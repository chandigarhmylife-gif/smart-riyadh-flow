import { describe, it, expect } from 'vitest';
import { computeNetworkMetrics } from '../networkMetrics';

const int = (o) => ({ status: 'active', coordination: 'independent', efficiency: 80, throughput: 100, waitTime: 30, ...o });

describe('computeNetworkMetrics', () => {
  it('returns zeros for an empty network', () => {
    expect(computeNetworkMetrics([])).toEqual({ efficiency: 0, throughput: 0, waitTime: 0, synchronized: 0, total: 0 });
  });

  it('averages efficiency and wait, and sums throughput, over active intersections only', () => {
    const m = computeNetworkMetrics([
      int({ efficiency: 90, waitTime: 20, throughput: 150, coordination: 'synchronized' }),
      int({ efficiency: 70, waitTime: 40, throughput: 100 }),
      int({ status: 'inactive', efficiency: 10, waitTime: 99, throughput: 999 }),
    ]);
    expect(m).toEqual({ efficiency: 80, throughput: 250, waitTime: 30, synchronized: 1, total: 3 });
  });

  it('does not divide by zero when every intersection is inactive', () => {
    const m = computeNetworkMetrics([int({ status: 'inactive' })]);
    expect(m.efficiency).toBe(0);
    expect(m.waitTime).toBe(0);
  });
});
