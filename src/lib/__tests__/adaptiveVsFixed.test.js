import { describe, it, expect } from 'vitest';
import { createRng, createTrafficModel, stepTrafficModel, modelMetrics, queueLengths } from '../trafficModel';
import {
  initialSignalState, initialAdaptiveState, tickSignal, tickSignalAdaptive, signalStatesFor,
} from '../signalTiming';

// End-to-end: run both controllers on identical arrivals for one hour.
function simulate({ adaptive, demand, seed = 11, seconds = 3600, timeOfDay = 'rush-hour' }) {
  const rng = createRng(seed);
  let model = createTrafficModel({ demand, timeOfDay });
  let signal = adaptive ? initialAdaptiveState() : initialSignalState();
  for (let t = 0; t < seconds; t++) {
    const next = adaptive ? tickSignalAdaptive(signal, queueLengths(model)) : tickSignal(signal);
    signal = next;
    model = stepTrafficModel(model, signalStatesFor(signal.phase), rng);
  }
  return modelMetrics(model);
}

describe('adaptive vs fixed-time control', () => {
  it('cuts average wait under unbalanced demand (busy N-S, light E-W)', () => {
    const demand = { north: 520, south: 480, east: 120, west: 90 };
    const fixed = simulate({ adaptive: false, demand });
    const adaptive = simulate({ adaptive: true, demand });
    expect(adaptive.avgWaitTime < fixed.avgWaitTime).toBe(true);
  });

  it('does not lose throughput under balanced rush-hour demand', () => {
    const fixed = simulate({ adaptive: false, demand: 400 });
    const adaptive = simulate({ adaptive: true, demand: 400 });
    expect(adaptive.totalVehicles >= fixed.totalVehicles * 0.97).toBe(true);
  });
});

describe('green-time efficiency', () => {
  it('is higher under adaptive control, which avoids green on empty approaches', () => {
    const demand = { north: 520, south: 480, east: 120, west: 90 };
    const fixed = simulate({ adaptive: false, demand });
    const adaptive = simulate({ adaptive: true, demand });
    expect(adaptive.efficiency > fixed.efficiency).toBe(true);
  });
});
