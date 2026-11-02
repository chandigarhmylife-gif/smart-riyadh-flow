import { describe, it, expect } from 'vitest';
import {
  PHASE_CONFIGS,
  CYCLE_LENGTH,
  initialSignalState,
  tickSignal,
  signalStatesFor,
  isGreenPhase,
  approachTimings,
} from '../signalTiming';

describe('signal plan', () => {
  it('has a 63 second cycle (30 + 4 + 25 + 4)', () => {
    expect(CYCLE_LENGTH).toBe(63);
  });

  it('never gives conflicting approaches green at the same time', () => {
    for (const p of PHASE_CONFIGS) {
      const nsMoving = p.north !== 'red' || p.south !== 'red';
      const ewMoving = p.east !== 'red' || p.west !== 'red';
      expect(nsMoving && ewMoving).toBe(false);
    }
  });

  it('counts down within a phase', () => {
    const s = tickSignal({ phase: 0, phaseTimer: 10 });
    expect(s).toEqual({ phase: 0, phaseTimer: 9, changed: false });
  });

  it('moves to the next phase when the timer runs out', () => {
    const s = tickSignal({ phase: 0, phaseTimer: 1 });
    expect(s).toEqual({ phase: 1, phaseTimer: PHASE_CONFIGS[1].duration, changed: true });
  });

  it('advances exactly one phase per expiry and returns to phase 0 after a full cycle', () => {
    let state = initialSignalState();
    const visited = [state.phase];
    for (let t = 0; t < CYCLE_LENGTH; t++) {
      const next = tickSignal(state);
      if (next.changed) visited.push(next.phase);
      state = { phase: next.phase, phaseTimer: next.phaseTimer };
    }
    expect(visited).toEqual([0, 1, 2, 3, 0]);
    expect(state).toEqual(initialSignalState());
  });

  it('flags only the green phases', () => {
    expect([0, 1, 2, 3].map(isGreenPhase)).toEqual([true, false, true, false]);
  });

  it('shows remaining time only on moving approaches', () => {
    expect(approachTimings(signalStatesFor(0), 12)).toEqual({ north: 12, south: 12, east: 0, west: 0 });
    expect(approachTimings(signalStatesFor(3), 2)).toEqual({ north: 0, south: 0, east: 2, west: 2 });
  });
});
