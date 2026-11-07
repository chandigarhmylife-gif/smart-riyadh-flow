// Headless single-intersection runs: used where the app needs realistic
// numbers without a live simulation (e.g. the Dashboard before any results
// are saved) and in tests.

import { createRng, createTrafficModel, stepTrafficModel, modelMetrics, queueLengths } from './trafficModel';
import {
  initialSignalState,
  initialAdaptiveState,
  tickSignal,
  tickSignalAdaptive,
  signalStatesFor,
} from './signalTiming';

/**
 * Run one intersection for `seconds` and return its KPIs.
 * controlMode: 'adaptive' | 'fixed'.
 */
export function runIntersection({ controlMode = 'adaptive', seconds = 3600, seed = 1, timeOfDay = 'rush-hour', weather = 'clear', demand } = {}) {
  const rng = createRng(seed);
  let model = createTrafficModel({ timeOfDay, weather, demand });
  let signal = controlMode === 'adaptive' ? initialAdaptiveState() : initialSignalState();
  for (let t = 0; t < seconds; t++) {
    signal = controlMode === 'adaptive' ? tickSignalAdaptive(signal, queueLengths(model)) : tickSignal(signal);
    model = stepTrafficModel(model, signalStatesFor(signal.phase), rng);
  }
  return modelMetrics(model);
}

/** Rounded KPIs for display, from a 1-hour rush-hour reference run. */
export function referenceMetrics(options = {}) {
  const m = runIntersection(options);
  return {
    avgWaitTime: Math.round(m.avgWaitTime),
    throughput: Math.round(m.throughput),
    efficiency: Math.round(m.efficiency),
    queueLength: Math.round(m.queueLength),
  };
}
