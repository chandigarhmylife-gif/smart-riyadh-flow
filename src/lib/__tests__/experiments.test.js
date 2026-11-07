import { describe, it, expect } from 'vitest';
import { meanCI, tCritical, summarise, runExperiment, runOnce, STRATEGIES } from '../experiments';
import { referenceMetrics, runIntersection } from '../referenceRun';

const NODES = [
  { id: 1, name: 'A', status: 'active', coordination: 'synchronized', mapPos: [24.7112, 46.6741] },
  { id: 2, name: 'B', status: 'active', coordination: 'synchronized', mapPos: [24.7128, 46.6788] },
  { id: 3, name: 'C', status: 'active', coordination: 'synchronized', mapPos: [24.6993, 46.6806] },
  { id: 4, name: 'D', status: 'active', coordination: 'synchronized', mapPos: [24.7009, 46.6852] },
];

describe('statistics', () => {
  it('computes mean, standard deviation and a t-based 95% CI', () => {
    const ci = meanCI([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(ci.mean).toBe(5);
    expect(Math.abs(ci.sd - 2.138) < 0.001).toBe(true);
    expect(Math.abs(ci.half - (2.365 * ci.sd) / Math.sqrt(8)) < 1e-9).toBe(true);
  });

  it('uses Student t for small samples and 1.96 for large ones', () => {
    expect(tCritical(1)).toBe(12.706);
    expect(tCritical(9)).toBe(2.262);
    expect(tCritical(200)).toBe(1.96);
  });

  it('marks a paired difference significant only when its CI excludes zero', () => {
    const runs = [];
    for (let seed = 1; seed <= 6; seed++) {
      runs.push({ strategy: 'independent', seed, avgDelay: 10 + seed, stopRate: 50, platoonStopRate: 50 });
      runs.push({ strategy: 'coordinated', seed, avgDelay: 8 + seed + (seed % 2) * 0.2, stopRate: 40, platoonStopRate: 30 });
      runs.push({ strategy: 'adaptive', seed, avgDelay: 10 + seed + (seed % 2 ? 1 : -1), stopRate: 60, platoonStopRate: 80 });
    }
    const { paired, byStrategy } = summarise(runs, ['independent', 'coordinated', 'adaptive']);
    expect(paired.coordinated.significant).toBe(true);
    expect(paired.coordinated.mean < 0).toBe(true);
    expect(paired.adaptive.significant).toBe(false);
    expect(byStrategy.independent.runs).toBe(6);
  });
});

describe('strategy experiments', () => {
  it('runs every strategy on identical traffic and reports progress', () => {
    const progress = [];
    const res = runExperiment(NODES, { seeds: 3, durationS: 900 }, (d, t) => progress.push([d, t]));
    expect(res.runs.length).toBe(3 * STRATEGIES.length);
    expect(progress.at(-1)).toEqual([12, 12]);
    for (const s of STRATEGIES) expect(Number.isFinite(res.byStrategy[s.key].avgDelay.mean)).toBe(true);
  });

  it('is repeatable', () => {
    const a = runOnce(NODES, 'coordinated', 5, { durationS: 600 });
    const b = runOnce(NODES, 'coordinated', 5, { durationS: 600 });
    expect(a).toEqual(b);
  });

  it('applies incidents to the runs', () => {
    const normal = runOnce(NODES, 'coordinated', 2, { durationS: 1200 });
    const incident = runOnce(NODES, 'coordinated', 2, { durationS: 1200, incidents: [{ id: 4, share: 0.25 }] });
    expect(incident.avgDelay > normal.avgDelay).toBe(true);
  });

  it('finds the green wave significantly better than uncoordinated signals', () => {
    const res = runExperiment(NODES, { seeds: 8, durationS: 1800, strategies: ['independent', 'coordinated'] });
    expect(res.paired.coordinated.significant).toBe(true);
    expect(res.paired.coordinated.mean < 0).toBe(true);
  });
});

describe('reference run', () => {
  it('gives realistic rush-hour numbers, better under adaptive control', () => {
    const adaptive = runIntersection({ controlMode: 'adaptive' });
    const fixed = runIntersection({ controlMode: 'fixed' });
    expect(adaptive.avgWaitTime < fixed.avgWaitTime).toBe(true);
    const r = referenceMetrics();
    expect(r.avgWaitTime > 3 && r.avgWaitTime < 40).toBe(true);
    expect(Number.isInteger(r.throughput)).toBe(true);
  });
});
