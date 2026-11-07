import { describe, it, expect } from 'vitest';
import {
  levelOfService,
  websterDelay,
  websterPlan,
  evaluatePlan,
  saturationFlow,
  adviseTiming,
} from '../timingAdvisor';
import { createRng, createTrafficModel, stepTrafficModel, modelMetrics } from '../trafficModel';
import { makePlan, phaseAtTime, planStates, tickPlan } from '../signalTiming';

const uniform = (v) => ({ north: v, south: v, east: v, west: v });
const near = (a, b, tol) => Math.abs(a - b) <= tol;

describe('HCM level of service', () => {
  it('uses the signalized-intersection delay thresholds', () => {
    expect([5, 10, 10.1, 20, 30, 50, 70, 90].map((d) => levelOfService(d))).toEqual(['A', 'A', 'B', 'B', 'C', 'D', 'E', 'F']);
  });

  it('is F whenever demand exceeds capacity', () => {
    expect(levelOfService(12, true)).toBe('F');
    expect(levelOfService(Infinity)).toBe('F');
  });
});

describe("Webster's method", () => {
  it('matches a hand-worked delay example', () => {
    // C = 60 s, g = 27 s, v = 600 veh/h, s = 1800 veh/h -> about 17.6 s/veh
    expect(near(websterDelay(60, 27, 600, 1800), 17.6, 0.2)).toBe(true);
  });

  it('returns infinite delay at or over capacity', () => {
    expect(websterDelay(60, 20, 700, 1800)).toBe(Infinity);
  });

  it('computes the optimum cycle C0 = (1.5L + 5) / (1 - Y)', () => {
    // Y = 2 x 0.3 = 0.6, L = 8 s -> C0 = 17 / 0.4 = 42.5 -> 43 s (rounded)
    const plan = websterPlan(uniform(540), 1800);
    expect(near(plan.Y, 0.6, 1e-9)).toBe(true);
    expect(plan.cycle).toBe(43);
    expect(plan.nsGreen + plan.ewGreen + 8).toBe(43);
  });

  it('splits green in proportion to the critical flow ratios', () => {
    const plan = websterPlan({ north: 600, south: 300, east: 300, west: 200 }, 1800);
    expect(plan.nsGreen > plan.ewGreen).toBe(true);
  });

  it('respects a minimum green, e.g. for pedestrians', () => {
    const plan = websterPlan(uniform(150), 1800, { minGreen: 24 });
    expect(plan.nsGreen >= 24 && plan.ewGreen >= 24).toBe(true);
    expect(plan.cycle).toBe(plan.nsGreen + plan.ewGreen + 8);
  });

  it('flags oversaturation and caps the cycle', () => {
    const plan = websterPlan(uniform(900), 1800);
    expect(plan.oversaturated).toBe(true);
    expect(plan.cycle).toBe(150);
    expect(plan.los).toBe('F');
  });

  it('beats the standard 30/25 plan at moderate demand', () => {
    const advice = adviseTiming({ timeOfDay: 'midday' });
    expect(advice.optimized.delay < advice.standard.delay).toBe(true);
  });

  it('lowers saturation flow in bad weather and with heavy vehicles', () => {
    const clear = saturationFlow({});
    expect(saturationFlow({ weather: 'rain' }) < clear).toBe(true);
    expect(saturationFlow({ heavyVehicleShare: 0.2 }) < clear).toBe(true);
  });
});

describe('simulator validation against Webster', () => {
  function simulatedDelay(v, plan, seeds = 6, seconds = 7200) {
    const p = makePlan(plan);
    let total = 0;
    for (let seed = 1; seed <= seeds; seed++) {
      const rng = createRng(seed);
      let m = createTrafficModel({ demand: v, timeOfDay: 'midday' });
      for (let t = 0; t < seconds; t++) m = stepTrafficModel(m, planStates(p, phaseAtTime(t, p).phase), rng);
      total += modelMetrics(m).avgWaitTime;
    }
    return total / seeds;
  }

  for (const base of [250, 450, 600]) {
    it(`simulated delay is within 15% of Webster's formula (demand ${base} veh/h)`, () => {
      const v = base * 0.9; // midday factor
      const plan = { nsGreen: 30, ewGreen: 25 };
      const predicted = evaluatePlan(plan, uniform(v), 1800).delay;
      const simulated = simulatedDelay(base, plan);
      expect(Math.abs(simulated - predicted) / predicted < 0.15).toBe(true);
    });
  }
});

describe('tickPlan', () => {
  it('cycles through a custom plan', () => {
    const plan = makePlan({ nsGreen: 2, ewGreen: 3, yellow: 1 });
    let s = { phase: 0, phaseTimer: 2 };
    const seen = [];
    for (let i = 0; i < 7; i++) {
      s = tickPlan(s, plan);
      if (s.changed) seen.push(s.phase);
    }
    expect(seen).toEqual([1, 2, 3, 0]);
  });
});
