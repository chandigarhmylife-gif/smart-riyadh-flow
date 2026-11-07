// Signal timing advisor: classic traffic-engineering methods for a
// two-phase intersection (N-S and E-W).
//
// - Webster's optimum cycle length and green splits
// - Webster's delay formula to predict average delay
// - HCM Level of Service (LOS) from average delay
//
// Conventions match trafficModel.js: 2 s start-up lost time, 4 s yellow of
// which half is usable, so lost time per phase is 4 s and effective green
// equals displayed green.

import {
  DIRECTIONS,
  SATURATION_FLOW_PER_LANE,
  WEATHER_FACTORS,
  effectiveDemand,
  heavyVehicleFactor,
} from './trafficModel';

export const YELLOW_S = 4;
export const LOST_TIME_PER_PHASE_S = 4;
export const MIN_GREEN_S = 10;
export const MIN_CYCLE_S = 40;
export const MAX_CYCLE_S = 150;

export const PHASES = [
  { key: 'ns', label: 'North-South', approaches: ['north', 'south'] },
  { key: 'ew', label: 'East-West', approaches: ['east', 'west'] },
];

/** HCM Level of Service thresholds for signalized intersections (s/veh). */
export const LOS_THRESHOLDS = [
  ['A', 10],
  ['B', 20],
  ['C', 35],
  ['D', 55],
  ['E', 80],
];

export const LOS_DESCRIPTIONS = {
  A: 'Free flow: most vehicles arrive on green',
  B: 'Stable flow with short delays',
  C: 'Stable flow; many vehicles stop',
  D: 'Approaching unstable flow; congestion noticeable',
  E: 'At capacity; long delays',
  F: 'Over capacity; queues grow',
};

/** HCM LOS letter for an average delay (s/veh). Over-capacity is always F. */
export function levelOfService(delay, overCapacity = false) {
  if (overCapacity || !Number.isFinite(delay)) return 'F';
  for (const [letter, max] of LOS_THRESHOLDS) if (delay <= max) return letter;
  return 'F';
}

/** Saturation flow (veh/h) per approach under the given conditions. */
export function saturationFlow({ lanes = 1, weather = 'clear', heavyVehicleShare = 0 } = {}) {
  const w = (WEATHER_FACTORS[weather] ?? WEATHER_FACTORS.clear).capacity;
  return SATURATION_FLOW_PER_LANE * lanes * w * heavyVehicleFactor(heavyVehicleShare);
}

/**
 * Webster's delay (s/veh) for one approach.
 * C cycle (s), g effective green (s), v flow (veh/h), s saturation flow (veh/h).
 * Returns Infinity when the approach is at or over capacity.
 */
export function websterDelay(C, g, v, s) {
  if (v <= 0) return 0;
  const lambda = g / C;
  const x = (v * C) / (s * g);
  if (x >= 1) return Infinity;
  const q = v / 3600;
  const uniform = (C * (1 - lambda) ** 2) / (2 * (1 - lambda * x));
  const random = (x * x) / (2 * q * (1 - x));
  const correction = 0.65 * Math.cbrt(C / (q * q)) * x ** (2 + 5 * lambda);
  return Math.max(0, uniform + random - correction);
}

/**
 * Evaluate a timing plan: per-approach degree of saturation (v/c) and delay,
 * flow-weighted intersection delay and LOS.
 * plan: { nsGreen, ewGreen } displayed greens (s); cycle = greens + 2 yellows.
 */
export function evaluatePlan(plan, demand, satFlow) {
  const cycle = plan.nsGreen + plan.ewGreen + 2 * YELLOW_S;
  const greens = { ns: plan.nsGreen, ew: plan.ewGreen };
  const approaches = {};
  let flow = 0;
  let weighted = 0;
  let overCapacity = false;
  for (const phase of PHASES) {
    for (const d of phase.approaches) {
      const v = demand[d];
      const g = greens[phase.key];
      const vc = (v * cycle) / (satFlow * g);
      const delay = websterDelay(cycle, g, v, satFlow);
      if (vc >= 1) overCapacity = true;
      approaches[d] = { flow: v, vc, delay, los: levelOfService(delay, vc >= 1) };
      flow += v;
      weighted += v * delay;
    }
  }
  const delay = flow > 0 ? weighted / flow : 0;
  return { cycle, nsGreen: plan.nsGreen, ewGreen: plan.ewGreen, approaches, delay, overCapacity, los: levelOfService(delay, overCapacity) };
}

/**
 * Webster's optimum fixed-time plan.
 * demand: veh/h per approach (after time-of-day and weather scaling).
 * Returns { cycle, nsGreen, ewGreen, Y, flowRatios, oversaturated, ...evaluation }.
 */
export function websterPlan(demand, satFlow, { minGreen = MIN_GREEN_S } = {}) {
  const flowRatios = {};
  for (const phase of PHASES) {
    flowRatios[phase.key] = Math.max(...phase.approaches.map((d) => (demand[d] || 0) / satFlow));
  }
  const Y = flowRatios.ns + flowRatios.ew;
  const L = PHASES.length * LOST_TIME_PER_PHASE_S;
  const oversaturated = Y >= 0.9;

  let cycle = oversaturated ? MAX_CYCLE_S : (1.5 * L + 5) / (1 - Y);
  // The cycle must also fit both minimum greens (e.g. pedestrian crossing time).
  const minCycle = Math.max(MIN_CYCLE_S, 2 * minGreen + 2 * YELLOW_S);
  cycle = Math.round(Math.min(MAX_CYCLE_S, Math.max(minCycle, cycle)));

  const available = cycle - L;
  const share = (k) => (Y > 0 ? flowRatios[k] / Y : 0.5);
  let nsGreen = Math.max(minGreen, Math.round(available * share('ns')));
  let ewGreen = Math.max(minGreen, Math.round(available * share('ew')));
  // Keep the cycle length after rounding and minimum greens.
  const total = cycle - 2 * YELLOW_S;
  if (nsGreen + ewGreen !== total) {
    if (nsGreen >= ewGreen) nsGreen = Math.max(minGreen, total - ewGreen);
    else ewGreen = Math.max(minGreen, total - nsGreen);
  }

  return { ...evaluatePlan({ nsGreen, ewGreen }, demand, satFlow), Y, flowRatios, oversaturated, minGreen };
}

/**
 * Advice for the current conditions: Webster's optimum plan and an
 * evaluation of the standard 30 s / 25 s plan for comparison.
 */
export function adviseTiming({
  demand,
  timeOfDay = 'rush-hour',
  weather = 'clear',
  lanes = 1,
  heavyVehicleShare = 0,
  minGreen = MIN_GREEN_S,
} = {}) {
  const flows = effectiveDemand({ demand, timeOfDay, weather });
  const s = saturationFlow({ lanes, weather, heavyVehicleShare });
  return {
    demand: Object.fromEntries(DIRECTIONS.map((d) => [d, flows[d]])),
    saturationFlow: s,
    optimized: websterPlan(flows, s, { minGreen }),
    standard: evaluatePlan({ nsGreen: 30, ewGreen: 25 }, flows, s),
  };
}
