// Corridor network model: several signalised intersections linked by road
// segments. Vehicles leaving one intersection travel to the next one at road
// speed and join its queue, so signal coordination (green waves) matters.
//
// Built on the single-intersection queue model in trafficModel.js.

import {
  DIRECTIONS,
  DEFAULT_DEMAND,
  WEATHER_FACTORS,
  createRng,
  createTrafficModel,
  stepTrafficModel,
  withConditions,
  queueLengths,
  modelMetrics,
} from './trafficModel';
import {
  ADAPTIVE_LIMITS,
  initialAdaptiveState,
  tickSignalAdaptive,
  signalStatesFor,
  makePlan,
  planCycle,
  phaseAtTime,
  planStates,
} from './signalTiming';

export const OPPOSITE = { north: 'south', south: 'north', east: 'west', west: 'east' };

/** Free-flow speed on links between intersections. */
export const LINK_SPEED_KMH = 50;
/** Share of vehicles leaving an intersection that continue straight to the next one. */
export const THROUGH_SHARE = 0.8;
/** Approaches fed by an upstream intersection still get this share of side-street demand. */
export const INTERNAL_DEMAND_SHARE = 0.15;
/** A neighbour must lie within this angle of a compass axis to be linked. */
export const LINK_CONE_DEG = 35;
export const MAX_LINK_KM = 2.5;
/** Through lanes per approach: King Fahd Rd and Olaya St are multi-lane arterials. */
export const DEFAULT_LANES = 2;

export const STANDARD_PLAN = makePlan({ nsGreen: 30, ewGreen: 25 });
/** Bus priority: King Fahd Rd and Olaya St (N-S) carry the bus routes. */
export const TRANSIT_PRIORITY_PLAN = makePlan({ nsGreen: 35, ewGreen: 20 });

const KM_PER_DEG_LAT = 111.32;

/** Approximate distance and displacement between two [lat, lon] points. */
export function displacementKm([lat1, lon1], [lat2, lon2]) {
  const north = (lat2 - lat1) * KM_PER_DEG_LAT;
  const east = (lon2 - lon1) * KM_PER_DEG_LAT * Math.cos((((lat1 + lat2) / 2) * Math.PI) / 180);
  return { north, east, km: Math.hypot(north, east) };
}

/** Compass direction from a to b, or null if b is not near an axis. */
export function axisDirection(a, b, coneDeg = LINK_CONE_DEG) {
  const { north, east } = displacementKm(a, b);
  const angle = (Math.atan2(east, north) * 180) / Math.PI; // 0 = north, 90 = east
  const axes = { north: 0, east: 90, south: 180, west: -90 };
  for (const [dir, axis] of Object.entries(axes)) {
    let diff = Math.abs(angle - axis);
    if (diff > 180) diff = 360 - diff;
    if (diff <= coneDeg) return dir;
  }
  return null;
}

/**
 * Link each intersection to its nearest neighbour in each compass direction.
 * Returns [{ from, to, dir, lengthKm }] where dir is the direction of travel.
 */
export function buildLinks(nodes, { coneDeg = LINK_CONE_DEG, maxKm = MAX_LINK_KM } = {}) {
  const links = [];
  for (const a of nodes) {
    const best = {};
    for (const b of nodes) {
      if (a.id === b.id || !a.mapPos || !b.mapPos) continue;
      const dir = axisDirection(a.mapPos, b.mapPos, coneDeg);
      if (!dir) continue;
      const { km } = displacementKm(a.mapPos, b.mapPos);
      if (km > maxKm) continue;
      if (!best[dir] || km < best[dir].lengthKm) best[dir] = { from: a.id, to: b.id, dir, lengthKm: km };
    }
    links.push(...Object.values(best));
  }
  return links;
}

/** Link travel time in whole seconds; bad weather slows traffic. */
export function travelTimeSeconds(lengthKm, weather = 'clear') {
  const factor = (WEATHER_FACTORS[weather] ?? WEATHER_FACTORS.clear).capacity;
  return Math.max(1, Math.round((lengthKm / (LINK_SPEED_KMH * factor)) * 3600));
}

/**
 * Signal offsets (s). Synchronized intersections connected by links get a
 * green wave for southbound and eastbound traffic: each downstream green
 * starts one travel time after the upstream green. Independent intersections
 * get unrelated offsets, as uncoordinated signals would.
 */
export function greenWaveOffsets(nodes, links, plan = STANDARD_PLAN, weather = 'clear') {
  const cycle = planCycle(plan);
  const mod = (x) => ((Math.round(x) % cycle) + cycle) % cycle;
  const synced = new Set(nodes.filter((n) => n.coordination === 'synchronized' && n.status !== 'inactive').map((n) => n.id));
  const offsets = {};

  for (const n of [...nodes].sort((a, b) => a.id - b.id)) {
    if (!synced.has(n.id)) {
      offsets[n.id] = mod(n.id * 37 + 11);
      continue;
    }
    if (n.id in offsets) continue;
    offsets[n.id] = 0;
    const queue = [n.id];
    while (queue.length) {
      const id = queue.shift();
      for (const l of links) {
        if (l.from !== id || !synced.has(l.to) || l.to in offsets) continue;
        const tt = travelTimeSeconds(l.lengthKm, weather);
        const forward = l.dir === 'south' || l.dir === 'east';
        offsets[l.to] = mod(offsets[id] + (forward ? tt : -tt));
        queue.push(l.to);
      }
    }
  }
  return offsets;
}

/**
 * Create a network.
 * options: controlMode ('coordinated' | 'independent' | 'adaptive'), weather,
 * timeOfDay, demand (veh/h per boundary approach), transitPriority, seed.
 * In 'independent' mode every intersection ignores its sync setting.
 */
export function createNetwork(nodes, options = {}) {
  const {
    controlMode = 'coordinated',
    weather = 'clear',
    timeOfDay = 'rush-hour',
    demand = DEFAULT_DEMAND,
    transitPriority = false,
    heavyVehicleShare = 0,
    lanes = DEFAULT_LANES,
    seed = 1,
  } = options;

  const links = buildLinks(nodes).map((l) => ({ ...l, pending: [] }));
  const plan = transitPriority ? TRANSIT_PRIORITY_PLAN : STANDARD_PLAN;
  const effectiveNodes = controlMode === 'independent'
    ? nodes.map((n) => ({ ...n, coordination: 'independent' }))
    : nodes;

  const net = {
    t: 0,
    options: { controlMode, weather, timeOfDay, demand, transitPriority, heavyVehicleShare, lanes, seed },
    plan,
    links,
    offsets: greenWaveOffsets(effectiveNodes, links, plan, weather),
    nodes: {},
    order: nodes.map((n) => n.id).sort((a, b) => a - b),
    preempt: {},
    platoon: { arrived: 0, stopped: 0, byDir: {} }, // vehicles arriving from upstream links
    rng: createRng(seed), // arrivals: identical across control modes
    routeRng: createRng(seed + 1),
    nextVehicleId: 1,
  };

  for (const n of nodes) {
    const fed = new Set(links.filter((l) => l.to === n.id).map((l) => OPPOSITE[l.dir]));
    const base = Object.fromEntries(
      DIRECTIONS.map((d) => [d, fed.has(d) ? demand * INTERNAL_DEMAND_SHARE : demand])
    );
    net.nodes[n.id] = {
      id: n.id,
      name: n.name,
      mapPos: n.mapPos,
      status: n.status ?? 'active',
      coordination: n.coordination ?? 'independent',
      model: createTrafficModel({ demand: base, weather, timeOfDay, heavyVehicleShare, lanes }),
      adaptive: initialAdaptiveState(),
      states: signalStatesFor(0),
    };
  }
  return net;
}

/** Hold one axis green at an intersection, e.g. for an emergency vehicle. */
export function preemptIntersection(net, nodeId, axis, seconds) {
  net.preempt[nodeId] = { axis, until: net.t + seconds };
}

/** Change weather or time of day without losing queues. */
export function setNetworkConditions(net, conditions) {
  for (const node of Object.values(net.nodes)) node.model = withConditions(node.model, conditions);
  Object.assign(net.options, conditions);
}

/** Switch bus priority (longer N-S green on the bus corridors) on or off. */
export function setTransitPriority(net, on) {
  net.options.transitPriority = on;
  net.plan = on ? TRANSIT_PRIORITY_PLAN : STANDARD_PLAN;
  updateNodeSettings(net, []);
}

/** Update sync/active flags without rebuilding (keeps queues and history). */
export function updateNodeSettings(net, nodes) {
  for (const n of nodes) {
    const node = net.nodes[n.id];
    if (!node) continue;
    node.status = n.status ?? node.status;
    node.coordination = n.coordination ?? node.coordination;
  }
  const effective = Object.values(net.nodes).map((n) => (
    net.options.controlMode === 'independent' ? { ...n, coordination: 'independent' } : n
  ));
  net.offsets = greenWaveOffsets(effective, net.links, net.plan, net.options.weather);
}

function signalFor(net, node) {
  const pre = net.preempt[node.id];
  if (pre && pre.until > net.t) {
    const ns = pre.axis === 'ns';
    return { north: ns ? 'green' : 'red', south: ns ? 'green' : 'red', east: ns ? 'red' : 'green', west: ns ? 'red' : 'green' };
  }
  if (node.status === 'inactive') {
    // Signal switched off: treated as uncontrolled, every approach may proceed.
    return { north: 'green', south: 'green', east: 'green', west: 'green' };
  }
  if (net.options.controlMode === 'adaptive') {
    const limits = net.options.transitPriority && node.adaptive.phase === 0
      ? { ...ADAPTIVE_LIMITS, maxGreen: ADAPTIVE_LIMITS.maxGreen + 10 }
      : ADAPTIVE_LIMITS;
    const next = tickSignalAdaptive(node.adaptive, queueLengths(node.model), limits);
    node.adaptive = { phase: next.phase, phaseTimer: next.phaseTimer, greenElapsed: next.greenElapsed ?? 0 };
    return signalStatesFor(next.phase);
  }
  const { phase } = phaseAtTime(net.t, net.plan, net.offsets[node.id] ?? 0);
  return planStates(net.plan, phase);
}

/** Advance the whole network by one second (mutates and returns net). */
export function stepNetwork(net) {
  // 1. Deliver vehicles that have finished travelling along a link.
  const extra = {};
  for (const link of net.links) {
    if (!link.pending.length) continue;
    const due = link.pending.filter((v) => v.arriveAt <= net.t);
    if (!due.length) continue;
    link.pending = link.pending.filter((v) => v.arriveAt > net.t);
    const approach = OPPOSITE[link.dir];
    extra[link.to] = extra[link.to] || {};
    extra[link.to][approach] = (extra[link.to][approach] || 0) + due.length;
  }

  // 2. Step every intersection.
  for (const id of net.order) {
    const node = net.nodes[id];
    node.states = signalFor(net, node);
    if (extra[id] && node.status !== 'inactive') {
      for (const [approach, n] of Object.entries(extra[id])) {
        const stops = node.states[approach] !== 'green' || node.model.approaches[approach].queue > 0;
        const travel = OPPOSITE[approach];
        const b = (net.platoon.byDir[travel] = net.platoon.byDir[travel] || { arrived: 0, stopped: 0 });
        net.platoon.arrived += n;
        b.arrived += n;
        if (stops) {
          net.platoon.stopped += n;
          b.stopped += n;
        }
      }
    }
    node.model = stepTrafficModel(node.model, node.states, net.rng, extra[id]);

    // 3. Send departures down the outgoing link in their direction of travel.
    for (const d of DIRECTIONS) {
      const departed = node.model.lastDepartures[d];
      if (!departed) continue;
      const dir = OPPOSITE[d];
      const link = net.links.find((l) => l.from === id && l.dir === dir);
      if (!link) continue;
      const tt = travelTimeSeconds(link.lengthKm, net.options.weather);
      for (let k = 0; k < departed; k++) {
        if (net.routeRng() < THROUGH_SHARE) {
          link.pending.push({ id: net.nextVehicleId++, departAt: net.t, arriveAt: net.t + tt });
        }
      }
    }
  }

  net.t += 1;
  return net;
}

/** Per-intersection KPIs plus the N-S signal state used for display. */
export function intersectionMetrics(net) {
  return net.order.map((id) => {
    const node = net.nodes[id];
    const m = modelMetrics(node.model);
    return {
      id,
      signalState: node.states.north,
      waitTime: Math.round(m.avgWaitTime),
      throughput: Math.round(m.throughput),
      queueLength: m.queueLength,
      efficiency: Math.round(m.efficiency),
      stopRate: Math.round(m.stopRate),
      totalVehicles: m.totalVehicles,
    };
  });
}

/** Whole-network averages, weighted by vehicles served. */
export function networkSummary(net, { activeOnly = true } = {}) {
  let arrived = 0;
  let delay = 0;
  let stopped = 0;
  for (const id of net.order) {
    const node = net.nodes[id];
    if (activeOnly && node.status === 'inactive') continue;
    for (const d of DIRECTIONS) {
      arrived += node.model.approaches[d].arrived;
      stopped += node.model.approaches[d].stopped ?? 0;
    }
    delay += node.model.totalDelay;
  }
  const p = net.platoon;
  return {
    avgDelay: arrived > 0 ? delay / arrived : 0,
    stopRate: arrived > 0 ? (stopped / arrived) * 100 : 0,
    // Vehicles arriving from an upstream intersection that had to stop: what a green wave targets.
    platoonStopRate: p.arrived > 0 ? (p.stopped / p.arrived) * 100 : 0,
    platoonStopRateByDir: Object.fromEntries(
      Object.entries(p.byDir).map(([d, v]) => [d, v.arrived > 0 ? (v.stopped / v.arrived) * 100 : 0])
    ),
    vehiclesInTransit: net.links.reduce((s, l) => s + l.pending.length, 0),
  };
}

/** Vehicles currently on links, interpolated between intersections for the map. */
export function vehiclePositions(net, max = 80) {
  const out = [];
  for (const link of net.links) {
    const a = net.nodes[link.from]?.mapPos;
    const b = net.nodes[link.to]?.mapPos;
    if (!a || !b) continue;
    const speedKmh = Math.round(
      (link.lengthKm / travelTimeSeconds(link.lengthKm, net.options.weather)) * 3600
    );
    for (const v of link.pending) {
      const span = Math.max(1, v.arriveAt - v.departAt);
      const f = Math.min(1, Math.max(0, (net.t - v.departAt) / span));
      out.push({
        id: v.id,
        position: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f],
        direction: link.dir.charAt(0).toUpperCase() + link.dir.slice(1),
        speed: speedKmh,
        type: 'car',
      });
      if (out.length >= max) return out;
    }
  }
  return out;
}
