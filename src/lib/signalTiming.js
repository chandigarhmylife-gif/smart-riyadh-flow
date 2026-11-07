// Fixed-time signal plan for a single 4-approach intersection.
// Pure functions so the cycle logic can be unit tested without React.

export const PHASE_CONFIGS = [
  { north: 'green', south: 'green', east: 'red', west: 'red', duration: 30 },
  { north: 'yellow', south: 'yellow', east: 'red', west: 'red', duration: 4 },
  { north: 'red', south: 'red', east: 'green', west: 'green', duration: 25 },
  { north: 'red', south: 'red', east: 'yellow', west: 'yellow', duration: 4 },
];

export const CYCLE_LENGTH = PHASE_CONFIGS.reduce((sum, p) => sum + p.duration, 0);

export function signalStatesFor(phaseIndex) {
  const { north, south, east, west } = PHASE_CONFIGS[phaseIndex];
  return { north, south, east, west };
}

export function initialSignalState() {
  return { phase: 0, phaseTimer: PHASE_CONFIGS[0].duration };
}

/**
 * Advance the signal plan by one second.
 * Returns the new { phase, phaseTimer } and whether the phase changed.
 */
export function tickSignal(state) {
  return tickPlan(state, PHASE_CONFIGS);
}

/** Same as tickSignal for any 4-phase plan (e.g. from makePlan or Webster's method). */
export function tickPlan({ phase, phaseTimer }, plan) {
  if (phaseTimer > 1) {
    return { phase, phaseTimer: phaseTimer - 1, changed: false };
  }
  const nextPhase = (phase + 1) % plan.length;
  return { phase: nextPhase, phaseTimer: plan[nextPhase].duration, changed: true };
}

/** True when the given phase starts a green interval (where a decision is logged). */
export function isGreenPhase(phaseIndex) {
  const p = PHASE_CONFIGS[phaseIndex];
  return p.north === 'green' || p.east === 'green';
}

// ---------------------------------------------------------------------------
// Adaptive (queue-actuated) control
// ---------------------------------------------------------------------------

export const ADAPTIVE_LIMITS = {
  minGreen: 10, // seconds a green must last before it can end
  maxGreen: 50, // hard cap so the cross street is never starved
  gapQueue: 1, // end green early ("gap out") once the served queue is this small
};

const SERVED = {
  0: ['north', 'south'],
  2: ['east', 'west'],
};
const OPPOSING = {
  0: ['east', 'west'],
  2: ['north', 'south'],
};

const sumQueues = (queues, dirs) => dirs.reduce((s, d) => s + (queues[d] ?? 0), 0);

export function initialAdaptiveState(limits = ADAPTIVE_LIMITS) {
  return { phase: 0, phaseTimer: limits.maxGreen, greenElapsed: 0 };
}

/**
 * Advance an adaptive plan by one second using current queue lengths.
 *
 * Green phases run between minGreen and maxGreen. After minGreen the green ends
 * when its own queue has cleared (gap-out) or when maxGreen is reached
 * (max-out), but only if traffic is waiting on the cross street; otherwise the
 * green rests where it is. Yellow phases keep their fixed duration.
 *
 * Optional `incoming` gives vehicles about to arrive per approach (e.g. a
 * platoon from the upstream signal). When provided, the controller is
 * platoon-aware: it won't gap out while a platoon is about to reach the
 * served approaches, and an imminent platoon on the cross street counts as
 * waiting traffic so the signal can change before it arrives.
 *
 * `limits.minGreenByPhase` can raise the minimum green for one phase, e.g.
 * to give pedestrians time to cross.
 *
 * Returns { phase, phaseTimer, greenElapsed, changed, reason } where reason is
 * 'gap-out' | 'max-out' | 'yellow-end' | null.
 */
export function tickSignalAdaptive(state, queues, limits = ADAPTIVE_LIMITS, incoming = null) {
  const { phase } = state;

  if (!isGreenPhase(phase)) {
    if (state.phaseTimer > 1) {
      return { ...state, phaseTimer: state.phaseTimer - 1, changed: false, reason: null };
    }
    const next = (phase + 1) % PHASE_CONFIGS.length;
    return { phase: next, phaseTimer: limits.maxGreen, greenElapsed: 0, changed: true, reason: 'yellow-end' };
  }

  const greenElapsed = state.greenElapsed + 1;
  const served = sumQueues(queues, SERVED[phase]);
  const opposing = sumQueues(queues, OPPOSING[phase]);
  const servedSoon = incoming ? sumQueues(incoming, SERVED[phase]) : 0;
  const opposingSoon = incoming ? sumQueues(incoming, OPPOSING[phase]) : 0;
  const minGreen = limits.minGreenByPhase?.[phase] ?? limits.minGreen;

  let reason = null;
  if (greenElapsed >= minGreen && opposing + opposingSoon > 0) {
    if (greenElapsed >= limits.maxGreen) reason = 'max-out';
    else if (served <= limits.gapQueue && servedSoon === 0) reason = 'gap-out';
  }

  if (reason) {
    const next = phase + 1; // the yellow that follows this green
    return { phase: next, phaseTimer: PHASE_CONFIGS[next].duration, greenElapsed: 0, changed: true, reason };
  }

  return {
    phase,
    phaseTimer: Math.max(1, limits.maxGreen - greenElapsed),
    greenElapsed,
    changed: false,
    reason: null,
  };
}

/** Remaining green/yellow seconds shown per approach. */
export function approachTimings(signalStates, phaseTimer) {
  const t = (s) => (s === 'green' || s === 'yellow' ? phaseTimer : 0);
  return {
    north: t(signalStates.north),
    south: t(signalStates.south),
    east: t(signalStates.east),
    west: t(signalStates.west),
  };
}

// ---------------------------------------------------------------------------
// Fixed-time plans with custom splits and offsets (used for coordination)
// ---------------------------------------------------------------------------

/** A 4-phase plan in the same phase order as PHASE_CONFIGS. */
export function makePlan({ nsGreen = 30, ewGreen = 25, yellow = 4 } = {}) {
  return [
    { ...PHASE_CONFIGS[0], duration: nsGreen },
    { ...PHASE_CONFIGS[1], duration: yellow },
    { ...PHASE_CONFIGS[2], duration: ewGreen },
    { ...PHASE_CONFIGS[3], duration: yellow },
  ];
}

export const planCycle = (plan) => plan.reduce((s, p) => s + p.duration, 0);

/**
 * Phase shown at simulation second `t` for a plan whose N-S green starts at
 * `offset` seconds into every cycle. Returns { phase, remaining }.
 */
export function phaseAtTime(t, plan, offset = 0) {
  const cycle = planCycle(plan);
  let pos = (((t - offset) % cycle) + cycle) % cycle;
  for (let i = 0; i < plan.length; i++) {
    if (pos < plan[i].duration) return { phase: i, remaining: plan[i].duration - pos };
    pos -= plan[i].duration;
  }
  return { phase: 0, remaining: plan[0].duration };
}

export function planStates(plan, phase) {
  const { north, south, east, west } = plan[phase];
  return { north, south, east, west };
}
