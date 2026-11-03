import { describe, it, expect } from 'vitest';
import {
  createRng,
  samplePoisson,
  effectiveDemand,
  createTrafficModel,
  stepTrafficModel,
  modelMetrics,
  queueLengths,
  co2SavedKg,
  DEFAULT_DEMAND,
} from '../trafficModel';
import { signalStatesFor } from '../signalTiming';

const ALL_RED = { north: 'red', south: 'red', east: 'red', west: 'red' };
const NS_GREEN = signalStatesFor(0);

function run(model, states, seconds, seed = 7) {
  const rng = createRng(seed);
  let m = model;
  for (let t = 0; t < seconds; t++) m = stepTrafficModel(m, states, rng);
  return m;
}

describe('random numbers', () => {
  it('is reproducible for the same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('produces Poisson samples with roughly the requested mean', () => {
    const rng = createRng(3);
    let total = 0;
    for (let i = 0; i < 20000; i++) total += samplePoisson(0.3, rng);
    const mean = total / 20000;
    expect(mean > 0.28 && mean < 0.32).toBe(true);
  });

  it('returns 0 for non-positive rates', () => {
    expect(samplePoisson(0, createRng(1))).toBe(0);
  });
});

describe('demand scaling', () => {
  it('scales demand up at rush hour and down in bad weather', () => {
    const rush = effectiveDemand({ timeOfDay: 'rush-hour' }).north;
    const night = effectiveDemand({ timeOfDay: 'night' }).north;
    const storm = effectiveDemand({ timeOfDay: 'rush-hour', weather: 'storm' }).north;
    expect(rush).toBe(DEFAULT_DEMAND * 1.3);
    expect(night < rush).toBe(true);
    expect(storm < rush).toBe(true);
  });

  it('accepts per-direction demand', () => {
    const d = effectiveDemand({ demand: { north: 600, south: 100 }, timeOfDay: 'midday' });
    expect(d.north).toBe(600 * 0.9);
    expect(d.south).toBe(100 * 0.9);
    expect(d.east).toBe(DEFAULT_DEMAND * 0.9);
  });
});

describe('queue dynamics', () => {
  it('builds queues and delay while every signal is red', () => {
    const m = run(createTrafficModel({ timeOfDay: 'rush-hour' }), ALL_RED, 120);
    const q = queueLengths(m);
    expect(q.north > 0 && q.east > 0).toBe(true);
    expect(modelMetrics(m).totalVehicles).toBe(0);
    expect(modelMetrics(m).avgWaitTime > 0).toBe(true);
  });

  it('discharges only the approaches that have green', () => {
    let m = run(createTrafficModel({ timeOfDay: 'rush-hour' }), ALL_RED, 120);
    const before = queueLengths(m);
    m = run(m, NS_GREEN, 30, 99);
    const after = queueLengths(m);
    expect(after.north < before.north).toBe(true);
    expect(after.east >= before.east).toBe(true);
    expect(m.approaches.north.departed > 0).toBe(true);
    expect(m.approaches.east.departed).toBe(0);
  });

  it('never discharges faster than saturation flow', () => {
    let m = createTrafficModel({ demand: 5000 });
    m = run(m, ALL_RED, 60);
    const queued = m.approaches.north.queue;
    m = run(m, NS_GREEN, 10, 5);
    // 1800 veh/h/lane = 0.5 veh/s, so at most 5 vehicles in 10 s
    expect(m.approaches.north.departed <= 5).toBe(true);
    expect(queued > 5).toBe(true);
  });

  it('discharges more slowly in a storm', () => {
    const clear = createTrafficModel({ weather: 'clear' });
    const storm = createTrafficModel({ weather: 'storm' });
    expect(storm.dischargePerSecond < clear.dischargePerSecond).toBe(true);
  });

  it('keeps conservation: arrived = departed + queued', () => {
    const m = run(createTrafficModel(), NS_GREEN, 300);
    for (const a of Object.values(m.approaches)) {
      expect(a.arrived).toBe(a.departed + a.queue);
    }
  });
});

describe('metrics', () => {
  it('returns zeros for a fresh model', () => {
    expect(modelMetrics(createTrafficModel())).toEqual({
      avgWaitTime: 0, throughput: 0, queueLength: 0, efficiency: 0, totalVehicles: 0,
    });
  });

  it('reports efficiency as a percentage between 0 and 100', () => {
    const e = modelMetrics(run(createTrafficModel(), NS_GREEN, 200)).efficiency;
    expect(e >= 0 && e <= 100).toBe(true);
  });

  it('computes CO2 savings only when delay is lower than the baseline', () => {
    const better = { totalDelay: 1000 };
    const worse = { totalDelay: 3000 };
    expect(co2SavedKg(better, worse)).toBe((2000 * 0.64) / 1000);
    expect(co2SavedKg(worse, better)).toBe(0);
    expect(co2SavedKg(better, null)).toBe(0);
  });
});

describe('start-up lost time', () => {
  it('discharges nothing in the first 2 seconds of green', () => {
    let m = run(createTrafficModel({ demand: 3000 }), ALL_RED, 60);
    const rng = createRng(1);
    m = stepTrafficModel(m, NS_GREEN, rng);
    m = stepTrafficModel(m, NS_GREEN, rng);
    expect(m.approaches.north.departed).toBe(0);
    for (let i = 0; i < 4; i++) m = stepTrafficModel(m, NS_GREEN, rng);
    expect(m.approaches.north.departed > 0).toBe(true);
  });
});
