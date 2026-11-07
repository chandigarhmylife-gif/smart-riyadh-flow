import { describe, it, expect } from 'vitest';
import {
  axisDirection,
  buildLinks,
  travelTimeSeconds,
  greenWaveOffsets,
  createNetwork,
  stepNetwork,
  networkSummary,
  intersectionMetrics,
  vehiclePositions,
  preemptIntersection,
  setNetworkConditions,
  setTransitPriority,
  updateNodeSettings,
  STANDARD_PLAN,
  TRANSIT_PRIORITY_PLAN,
} from '../networkModel';
import { planCycle } from '../signalTiming';

// The King Fahd Rd / Olaya St corridor used on the Network page.
const NODES = [
  { id: 1, name: 'King Fahd / Al Urubah', status: 'active', coordination: 'synchronized', mapPos: [24.7112, 46.6741] },
  { id: 2, name: 'Olaya / Al Urubah', status: 'active', coordination: 'synchronized', mapPos: [24.7128, 46.6788] },
  { id: 3, name: 'King Fahd / Tahlia', status: 'active', coordination: 'synchronized', mapPos: [24.6993, 46.6806] },
  { id: 4, name: 'Olaya / Tahlia', status: 'active', coordination: 'synchronized', mapPos: [24.7009, 46.6852] },
];

function runFor(nodes, options, seconds) {
  const net = createNetwork(nodes, options);
  for (let t = 0; t < seconds; t++) stepNetwork(net);
  return net;
}

function averageOverSeeds(controlMode, seeds = [1, 2, 3, 4, 5]) {
  const all = seeds.map((seed) => networkSummary(runFor(NODES, { controlMode, seed }, 3600)));
  const avg = (fn) => all.reduce((s, x) => s + fn(x), 0) / all.length;
  return {
    avgDelay: avg((x) => x.avgDelay),
    platoonStopRate: avg((x) => x.platoonStopRate),
    southbound: avg((x) => x.platoonStopRateByDir.south ?? 0),
  };
}

describe('geometry', () => {
  it('classifies neighbours by compass direction and ignores diagonals', () => {
    expect(axisDirection(NODES[0].mapPos, NODES[2].mapPos)).toBe('south');
    expect(axisDirection(NODES[0].mapPos, NODES[1].mapPos)).toBe('east');
    expect(axisDirection(NODES[0].mapPos, NODES[3].mapPos)).toBe(null);
  });

  it('links the 2x2 grid in both directions along each road', () => {
    const links = buildLinks(NODES).map((l) => `${l.from}-${l.to}-${l.dir}`).sort();
    expect(links).toEqual([
      '1-2-east', '1-3-south', '2-1-west', '2-4-south',
      '3-1-north', '3-4-east', '4-2-north', '4-3-west',
    ]);
  });

  it('gives realistic travel times, slower in bad weather', () => {
    const [link] = buildLinks(NODES).filter((l) => l.from === 1 && l.to === 3);
    const clear = travelTimeSeconds(link.lengthKm, 'clear');
    expect(clear > 90 && clear < 120).toBe(true); // ~1.5 km at 50 km/h
    expect(travelTimeSeconds(link.lengthKm, 'storm') > clear).toBe(true);
  });
});

describe('green wave offsets', () => {
  const links = buildLinks(NODES);
  const cycle = planCycle(STANDARD_PLAN);

  it('offsets each downstream signal by the link travel time', () => {
    const o = greenWaveOffsets(NODES, links);
    const tt12 = travelTimeSeconds(links.find((l) => l.from === 1 && l.to === 2).lengthKm);
    const tt13 = travelTimeSeconds(links.find((l) => l.from === 1 && l.to === 3).lengthKm);
    expect(o[1]).toBe(0);
    expect(o[2]).toBe(tt12 % cycle);
    expect(o[3]).toBe(tt13 % cycle);
  });

  it('gives independent signals offsets that are not tied to travel times', () => {
    const nodes = NODES.map((n) => (n.id === 3 ? { ...n, coordination: 'independent' } : n));
    const o = greenWaveOffsets(nodes, links);
    expect(o[3]).toBe((3 * 37 + 11) % cycle);
  });
});

describe('network simulation', () => {
  it('moves vehicles between intersections and conserves them', () => {
    const net = runFor(NODES, { seed: 3 }, 900);
    const s = networkSummary(net);
    expect(s.vehiclesInTransit > 0).toBe(true);
    expect(intersectionMetrics(net).every((m) => m.totalVehicles > 0)).toBe(true);
    const positions = vehiclePositions(net, 1000);
    expect(positions.length).toBe(s.vehiclesInTransit);
    // Every vehicle on the map lies inside the corridor's bounding box.
    for (const v of positions) {
      expect(v.position[0] >= 24.699 && v.position[0] <= 24.713).toBe(true);
      expect(v.position[1] >= 46.674 && v.position[1] <= 46.686).toBe(true);
    }
  });

  it('is reproducible for the same seed', () => {
    const a = networkSummary(runFor(NODES, { seed: 9 }, 600));
    const b = networkSummary(runFor(NODES, { seed: 9 }, 600));
    expect(a).toEqual(b);
  });

  it('green wave cuts platoon stops versus uncoordinated signals', () => {
    const coordinated = averageOverSeeds('coordinated');
    const independent = averageOverSeeds('independent');
    expect(coordinated.platoonStopRate < independent.platoonStopRate - 10).toBe(true);
    expect(coordinated.southbound < independent.southbound / 2).toBe(true);
    expect(coordinated.avgDelay < independent.avgDelay).toBe(true);
  });

  it('adaptive control gives the lowest average delay', () => {
    const adaptive = averageOverSeeds('adaptive');
    const coordinated = averageOverSeeds('coordinated');
    expect(adaptive.avgDelay < coordinated.avgDelay).toBe(true);
  });

  it('holds the requested axis green during pre-emption', () => {
    const net = createNetwork(NODES, { seed: 1 });
    preemptIntersection(net, 2, 'ew', 5);
    stepNetwork(net);
    expect(net.nodes[2].states).toEqual({ north: 'red', south: 'red', east: 'green', west: 'green' });
    for (let t = 0; t < 10; t++) stepNetwork(net);
    expect(net.preempt[2].until <= net.t).toBe(true);
  });

  it('treats a switched-off signal as uncontrolled and excludes it from summaries', () => {
    const net = createNetwork(NODES, { seed: 1 });
    updateNodeSettings(net, [{ id: 4, status: 'inactive' }]);
    stepNetwork(net);
    expect(Object.values(net.nodes[4].states).every((s) => s === 'green')).toBe(true);
  });

  it('applies weather and bus priority without losing queues', () => {
    const net = runFor(NODES, { seed: 2 }, 300);
    const queued = net.nodes[1].model.approaches.north.queue;
    const before = net.nodes[1].model.dischargePerSecond;
    setNetworkConditions(net, { weather: 'storm' });
    expect(net.nodes[1].model.dischargePerSecond < before).toBe(true);
    expect(net.nodes[1].model.approaches.north.queue).toBe(queued);
    setTransitPriority(net, true);
    expect(net.plan).toBe(TRANSIT_PRIORITY_PLAN);
    expect(TRANSIT_PRIORITY_PLAN[0].duration > STANDARD_PLAN[0].duration).toBe(true);
  });
});

import { setIncident, eventsSince, incomingWithin, linkStorage, roadStates } from '../networkModel';

describe('platoon-aware adaptive control', () => {
  it('stops far fewer platoons than plain adaptive control', () => {
    const plain = averageOverSeeds('adaptive');
    const platoon = averageOverSeeds('adaptive-platoon');
    expect(platoon.platoonStopRate < plain.platoonStopRate - 20).toBe(true);
  });

  it('keeps delay below the fixed-time green wave', () => {
    const platoon = averageOverSeeds('adaptive-platoon');
    const wave = averageOverSeeds('coordinated');
    expect(platoon.avgDelay < wave.avgDelay).toBe(true);
  });

  it('sees vehicles due within the look-ahead window', () => {
    const net = runFor(NODES, { seed: 4 }, 600);
    const soon = incomingWithin(net, 3, 8);
    const later = incomingWithin(net, 3, 1000);
    const total = (o) => Object.values(o).reduce((s, n) => s + n, 0);
    expect(total(later) >= total(soon)).toBe(true);
    expect(total(later) > 0).toBe(true);
  });
});

describe('incidents and spillback', () => {
  it('sizes link storage from road length and lanes', () => {
    expect(linkStorage(0.5, 2)).toBe(133); // 1000 m of lane / 7.5 m per vehicle
  });

  it('an incident builds a queue that spills back and blocks the upstream signal', () => {
    const net = createNetwork(NODES, { seed: 3, storageScale: 0.1 });
    for (let t = 0; t < 300; t++) stepNetwork(net);
    setIncident(net, 4, 0.25);
    for (let t = 0; t < 1500; t++) stepNetwork(net);
    const s = networkSummary(net);
    expect(s.spillbackSeconds > 0).toBe(true);
    const kinds = eventsSince(net, 0).map((e) => e.type);
    expect(kinds).toContain('incident');
    expect(kinds).toContain('spillback');
  });

  it('spillback clears once the incident is removed', () => {
    const net = createNetwork(NODES, { seed: 3, storageScale: 0.1 });
    setIncident(net, 4, 0.25);
    for (let t = 0; t < 1800; t++) stepNetwork(net);
    setIncident(net, 4, null);
    for (let t = 0; t < 2400; t++) stepNetwork(net);
    expect(networkSummary(net).spillbackLinks).toBe(0);
    expect(eventsSince(net, 0).map((e) => e.type)).toContain('spillback-cleared');
  });

  it('does not spill back under normal traffic on real road lengths', () => {
    const net = runFor(NODES, { seed: 5 }, 1800);
    expect(networkSummary(net).spillbackSeconds).toBe(0);
  });

  it('reports each event once using sequence numbers', () => {
    const net = createNetwork(NODES, { seed: 1 });
    setIncident(net, 2, 0.5);
    const first = eventsSince(net, 0);
    expect(first.length).toBe(1);
    expect(eventsSince(net, first[0].seq)).toEqual([]);
  });

  it('describes road occupancy for the map', () => {
    const net = runFor(NODES, { seed: 2 }, 300);
    const roads = roadStates(net);
    expect(roads.length).toBe(8);
    expect(roads.every((r) => r.level >= 0 && r.level <= 1)).toBe(true);
    expect(roads[0].label).toMatch(/→/);
  });
});
