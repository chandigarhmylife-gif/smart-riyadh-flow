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

import { tickSignalAdaptive, initialAdaptiveState, ADAPTIVE_LIMITS } from '../signalTiming';

describe('adaptive control', () => {
  const L = ADAPTIVE_LIMITS;
  const greenAt = (greenElapsed) => ({ phase: 0, phaseTimer: L.maxGreen - greenElapsed, greenElapsed });

  it('holds green for at least minGreen even if the queue is empty', () => {
    const s = tickSignalAdaptive(greenAt(3), { north: 0, south: 0, east: 9, west: 9 });
    expect(s.changed).toBe(false);
    expect(s.greenElapsed).toBe(4);
  });

  it('gaps out after minGreen once the served queue clears', () => {
    const s = tickSignalAdaptive(greenAt(L.minGreen), { north: 1, south: 0, east: 6, west: 2 });
    expect(s).toMatchObject({ phase: 1, changed: true, reason: 'gap-out' });
  });

  it('keeps green while the served approach still has a queue', () => {
    const s = tickSignalAdaptive(greenAt(20), { north: 5, south: 4, east: 6, west: 2 });
    expect(s.changed).toBe(false);
  });

  it('maxes out at maxGreen so the cross street is not starved', () => {
    const s = tickSignalAdaptive(greenAt(L.maxGreen - 1), { north: 30, south: 30, east: 1, west: 0 });
    expect(s).toMatchObject({ phase: 1, changed: true, reason: 'max-out' });
  });

  it('rests in green when nobody is waiting on the cross street', () => {
    const s = tickSignalAdaptive(greenAt(L.maxGreen + 5), { north: 0, south: 0, east: 0, west: 0 });
    expect(s.changed).toBe(false);
  });

  it('runs yellow for its fixed duration, then starts the next green', () => {
    let s = { phase: 1, phaseTimer: 2, greenElapsed: 0 };
    s = tickSignalAdaptive(s, {});
    expect(s).toMatchObject({ phase: 1, phaseTimer: 1, changed: false });
    s = tickSignalAdaptive(s, {});
    expect(s).toMatchObject({ phase: 2, changed: true, reason: 'yellow-end', greenElapsed: 0 });
  });

  it('starts in N-S green', () => {
    expect(initialAdaptiveState().phase).toBe(0);
  });
});

import { makePlan, planCycle, phaseAtTime } from '../signalTiming';

describe('fixed-time plans with offsets', () => {
  const plan = makePlan({ nsGreen: 30, ewGreen: 25, yellow: 4 });

  it('matches the standard 63 s cycle', () => {
    expect(planCycle(plan)).toBe(63);
  });

  it('finds the phase at any time, honouring the offset', () => {
    expect(phaseAtTime(0, plan)).toEqual({ phase: 0, remaining: 30 });
    expect(phaseAtTime(31, plan)).toEqual({ phase: 1, remaining: 3 });
    expect(phaseAtTime(40, plan)).toEqual({ phase: 2, remaining: 19 });
    expect(phaseAtTime(62, plan)).toEqual({ phase: 3, remaining: 1 });
    // With a 10 s offset, N-S green starts at t = 10 (and t = 73, ...).
    expect(phaseAtTime(10, plan, 10).phase).toBe(0);
    expect(phaseAtTime(5, plan, 10).phase).toBe(2); // cycle second 58: still E-W green
    expect(phaseAtTime(8, plan, 10).phase).toBe(3); // cycle second 61: E-W yellow
    expect(phaseAtTime(73, plan, 10)).toEqual({ phase: 0, remaining: 30 });
  });
});
