// Aggregate KPIs across a network of signalised intersections.

export function computeNetworkMetrics(intersections = []) {
  if (intersections.length === 0) {
    return { efficiency: 0, throughput: 0, waitTime: 0, synchronized: 0, total: 0 };
  }
  const active = intersections.filter(i => i.status === 'active');
  const synchronized = intersections.filter(i => i.coordination === 'synchronized').length;
  const avg = (key) =>
    active.length > 0 ? Math.round(active.reduce((s, i) => s + i[key], 0) / active.length) : 0;
  return {
    efficiency: avg('efficiency'),
    throughput: active.reduce((s, i) => s + i.throughput, 0),
    waitTime: avg('waitTime'),
    synchronized,
    total: intersections.length,
  };
}
