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
export function tickSignal({ phase, phaseTimer }) {
  if (phaseTimer > 1) {
    return { phase, phaseTimer: phaseTimer - 1, changed: false };
  }
  const nextPhase = (phase + 1) % PHASE_CONFIGS.length;
  return { phase: nextPhase, phaseTimer: PHASE_CONFIGS[nextPhase].duration, changed: true };
}

/** True when the given phase starts a green interval (where a decision is logged). */
export function isGreenPhase(phaseIndex) {
  const p = PHASE_CONFIGS[phaseIndex];
  return p.north === 'green' || p.east === 'green';
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
