// Batch experiments: run several control strategies on the same corridor
// with the same random traffic (common random numbers) and summarise the
// results with 95% confidence intervals.

import { createNetwork, stepNetwork, networkSummary, setIncident } from './networkModel';

export const STRATEGIES = [
  { key: 'independent', label: 'Uncoordinated fixed-time' },
  { key: 'coordinated', label: 'Green wave' },
  { key: 'adaptive', label: 'Adaptive' },
  { key: 'adaptive-platoon', label: 'Platoon-aware adaptive' },
];

export const BASELINE_STRATEGY = 'independent';

export const METRICS = [
  { key: 'avgDelay', label: 'Avg delay', unit: 's' },
  { key: 'stopRate', label: 'Vehicles stopping', unit: '%' },
  { key: 'platoonStopRate', label: 'Platoons stopping', unit: '%' },
];

// Two-sided 95% Student t critical values for 1..30 degrees of freedom.
const T_975 = [
  12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228,
  2.201, 2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086,
  2.08, 2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.048, 2.045, 2.042,
];

export function tCritical(df) {
  if (df < 1) return Infinity;
  return df <= 30 ? T_975[df - 1] : 1.96;
}

/** Mean, sample standard deviation and 95% CI half-width. */
export function meanCI(values) {
  const n = values.length;
  if (n === 0) return { n, mean: NaN, sd: NaN, half: NaN, low: NaN, high: NaN };
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const sd = n > 1 ? Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1)) : 0;
  const half = n > 1 ? (tCritical(n - 1) * sd) / Math.sqrt(n) : Infinity;
  return { n, mean, sd, half, low: mean - half, high: mean + half };
}

/**
 * Run one strategy for one seed; returns the network summary.
 * conditions may include incidents: [{ id, share }] (capacity share kept).
 */
export function runOnce(nodes, strategy, seed, { durationS = 1800, incidents = [], ...conditions } = {}) {
  const net = createNetwork(nodes, { ...conditions, controlMode: strategy, seed });
  for (const inc of incidents) setIncident(net, inc.id, inc.share);
  for (let t = 0; t < durationS; t++) stepNetwork(net);
  const s = networkSummary(net);
  return { strategy, seed, avgDelay: s.avgDelay, stopRate: s.stopRate, platoonStopRate: s.platoonStopRate, spillbackSeconds: s.spillbackSeconds };
}

/** Summarise raw runs into per-strategy statistics and paired differences. */
export function summarise(runs, strategies = STRATEGIES.map((s) => s.key)) {
  const byStrategy = {};
  for (const key of strategies) {
    const mine = runs.filter((r) => r.strategy === key);
    byStrategy[key] = Object.fromEntries(METRICS.map((m) => [m.key, meanCI(mine.map((r) => r[m.key]))]));
    byStrategy[key].runs = mine.length;
  }

  // Paired differences against the baseline: same seed = same arrivals,
  // so differences remove most run-to-run noise.
  const paired = {};
  const base = Object.fromEntries(runs.filter((r) => r.strategy === BASELINE_STRATEGY).map((r) => [r.seed, r]));
  for (const key of strategies) {
    if (key === BASELINE_STRATEGY) continue;
    const diffs = runs
      .filter((r) => r.strategy === key && base[r.seed])
      .map((r) => r.avgDelay - base[r.seed].avgDelay);
    const ci = meanCI(diffs);
    paired[key] = { ...ci, significant: ci.n > 1 && (ci.high < 0 || ci.low > 0) };
  }
  return { byStrategy, paired };
}

/**
 * Run every strategy for `seeds` seeds. Calls onProgress(done, total) after
 * each run. Seeds start at `firstSeed` so experiments are repeatable.
 */
export function runExperiment(nodes, { seeds = 10, firstSeed = 1, durationS = 1800, strategies = STRATEGIES.map((s) => s.key), ...conditions } = {}, onProgress) {
  const runs = [];
  const total = seeds * strategies.length;
  for (let i = 0; i < seeds; i++) {
    for (const key of strategies) {
      runs.push(runOnce(nodes, key, firstSeed + i, { durationS, ...conditions }));
      if (onProgress) onProgress(runs.length, total);
    }
  }
  return { runs, ...summarise(runs, strategies), settings: { seeds, firstSeed, durationS, ...conditions } };
}

/** Same as runExperiment but yields to the browser between runs (no Worker available). */
export async function runExperimentAsync(nodes, options = {}, onProgress) {
  const { seeds = 10, firstSeed = 1, durationS = 1800, strategies = STRATEGIES.map((s) => s.key), ...conditions } = options;
  const runs = [];
  const total = seeds * strategies.length;
  for (let i = 0; i < seeds; i++) {
    for (const key of strategies) {
      runs.push(runOnce(nodes, key, firstSeed + i, { durationS, ...conditions }));
      if (onProgress) onProgress(runs.length, total);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
  return { runs, ...summarise(runs, strategies), settings: { seeds, firstSeed, durationS, ...conditions } };
}
