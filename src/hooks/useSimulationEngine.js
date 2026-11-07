import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PHASE_CONFIGS,
  ADAPTIVE_LIMITS,
  initialSignalState,
  initialAdaptiveState,
  tickSignal,
  tickSignalAdaptive,
  signalStatesFor,
  approachTimings,
} from '@/lib/signalTiming';
import {
  DIRECTIONS,
  createRng,
  createTrafficModel,
  stepTrafficModel,
  queueLengths,
  modelMetrics,
  co2SavedKg,
} from '@/lib/trafficModel';

const VEHICLE_COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];
const MAX_VEHICLES_DRAWN_PER_APPROACH = 8;

const EMPTY_METRICS = {
  avgWaitTime: 0,
  throughput: 0,
  queueLength: 0,
  efficiency: 0,
  totalVehicles: 0,
  co2Saved: 0,
};

const OPPOSITE = { north: 'south', south: 'north', east: 'west', west: 'east' };

/** Seconds of simulated time between timeline samples. */
export const HISTORY_INTERVAL_S = 10;
const MAX_HISTORY_POINTS = 1440; // 4 hours at 10 s

/** Vehicles for the 3D view, one per queued car (capped), per approach. */
function vehiclesFromQueues(signalStates, isRunning, queues) {
  let id = 0;
  return DIRECTIONS.flatMap((dir) => {
    const n = Math.min(queues[dir] ?? 0, MAX_VEHICLES_DRAWN_PER_APPROACH);
    return Array.from({ length: n }, (_, i) => {
      id += 1;
      const canGo = isRunning && signalStates[dir] === 'green';
      const offset = i * 1.1;
      let position;
      if (dir === 'north') position = [0.6, 0.15, -2.5 - offset];
      else if (dir === 'south') position = [-0.6, 0.15, 2.5 + offset];
      else if (dir === 'east') position = [-2.5 - offset, 0.15, -0.6];
      else position = [2.5 + offset, 0.15, 0.6];
      return {
        id,
        position,
        color: VEHICLE_COLORS[id % VEHICLE_COLORS.length],
        direction: dir,
        speed: canGo ? 1 : 0,
      };
    });
  });
}

function directionLabel(phase) {
  return PHASE_CONFIGS[phase].north === 'green' ? 'North-South' : 'East-West';
}

/**
 * Single-intersection simulation.
 *
 * config:
 *  - duration (minutes)
 *  - controlMode: 'adaptive' (queue-actuated) | 'fixed' (63 s fixed-time plan)
 *  - timeOfDay, weatherCondition: scale demand and capacity
 *  - demand: veh/h per approach (number or { north, south, east, west })
 *  - seed: RNG seed for reproducible runs (random when omitted; the seed used is returned)
 *
 * In adaptive mode a fixed-time baseline runs in parallel with identical
 * arrivals, and co2Saved reports the idling CO2 avoided versus that baseline.
 */
export default function useSimulationEngine(config = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [phase, setPhase] = useState(0);
  const [phaseTimer, setPhaseTimer] = useState(PHASE_CONFIGS[0].duration);
  const [signalStates, setSignalStates] = useState(signalStatesFor(0));
  const [metrics, setMetrics] = useState(EMPTY_METRICS);
  const [baselineMetrics, setBaselineMetrics] = useState(null);
  const [queues, setQueues] = useState({ north: 0, south: 0, east: 0, west: 0 });
  const [vehicles, setVehicles] = useState([]);
  const [aiDecisions, setAiDecisions] = useState([]);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [seed, setSeed] = useState(null);

  const duration = config.duration || 60; // minutes
  const controlMode = config.controlMode === 'fixed' ? 'fixed' : 'adaptive';

  const configRef = useRef(config);
  configRef.current = config;

  const intervalRef = useRef(null);
  const decisionIdRef = useRef(0);
  const signalRef = useRef(initialSignalState());
  const baselineSignalRef = useRef(initialSignalState());
  const statesRef = useRef(signalStatesFor(0));
  const modelRef = useRef(null);
  const baselineRef = useRef(null);
  const rngRef = useRef(null);
  const baselineRngRef = useRef(null);
  const emergencyRef = useRef(false);
  const emergencyTimeoutRef = useRef(null);

  const initModels = useCallback(() => {
    const c = configRef.current;
    const options = {
      demand: c.demand,
      timeOfDay: c.timeOfDay || 'rush-hour',
      weather: c.weatherCondition || 'clear',
      lanes: c.lanes || 1,
    };
    const runSeed = Number.isFinite(c.seed) ? c.seed : Math.floor(Math.random() * 1e9);
    setSeed(runSeed);
    modelRef.current = createTrafficModel(options);
    rngRef.current = createRng(runSeed);
    const adaptive = c.controlMode !== 'fixed';
    baselineRef.current = adaptive ? createTrafficModel(options) : null;
    baselineRngRef.current = adaptive ? createRng(runSeed) : null;
    signalRef.current = adaptive ? initialAdaptiveState() : initialSignalState();
    baselineSignalRef.current = initialSignalState();
    statesRef.current = signalStatesFor(0);
    setPhaseTimer(signalRef.current.phaseTimer);
  }, []);

  const logDecision = useCallback((decision, reasoning, confidence) => {
    decisionIdRef.current += 1;
    const entry = {
      id: decisionIdRef.current,
      timestamp: new Date().toLocaleTimeString(),
      decision,
      reasoning,
      confidence,
    };
    setAiDecisions((prev) => [entry, ...prev].slice(0, 20));
  }, []);

  // Main loop: one simulated second per tick (faster at higher speeds).
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (!modelRef.current) initModels();
      const adaptive = configRef.current.controlMode !== 'fixed';

      // 1. Signal controller
      const currentQueues = queueLengths(modelRef.current);
      const next = adaptive
        ? tickSignalAdaptive(signalRef.current, currentQueues, ADAPTIVE_LIMITS)
        : tickSignal(signalRef.current);
      signalRef.current = {
        phase: next.phase,
        phaseTimer: next.phaseTimer,
        greenElapsed: next.greenElapsed ?? 0,
      };
      setPhaseTimer(next.phaseTimer);

      if (next.changed) {
        setPhase(next.phase);
        if (!emergencyRef.current) {
          statesRef.current = signalStatesFor(next.phase);
          setSignalStates(statesRef.current);
        }
        const nsQ = currentQueues.north + currentQueues.south;
        const ewQ = currentQueues.east + currentQueues.west;
        if (next.reason === 'gap-out' || next.reason === 'max-out') {
          const ending = directionLabel(next.phase - 1);
          const waiting = ending === 'North-South' ? ewQ : nsQ;
          logDecision(
            `Ended ${ending} green (${next.reason})`,
            next.reason === 'gap-out'
              ? `${ending} queue cleared to ${ending === 'North-South' ? nsQ : ewQ} vehicle(s); ${waiting} waiting on the cross street, so green time is reassigned.`
              : `${ending} green reached the ${ADAPTIVE_LIMITS.maxGreen}s maximum with ${waiting} vehicle(s) waiting on the cross street.`,
            next.reason === 'gap-out' ? 95 : 88
          );
        } else if (PHASE_CONFIGS[next.phase].north === 'green' || PHASE_CONFIGS[next.phase].east === 'green') {
          const label = directionLabel(next.phase);
          const servedQ = label === 'North-South' ? nsQ : ewQ;
          logDecision(
            `Activated ${label} green phase`,
            adaptive
              ? `${servedQ} vehicle(s) queued ${label}. Green will run ${ADAPTIVE_LIMITS.minGreen}-${ADAPTIVE_LIMITS.maxGreen}s depending on demand.`
              : `Fixed-time plan: ${PHASE_CONFIGS[next.phase].duration}s green with ${servedQ} vehicle(s) queued.`,
            adaptive ? 92 : 100
          );
        }
      }

      // 2. Traffic model under the signals actually shown
      modelRef.current = stepTrafficModel(modelRef.current, statesRef.current, rngRef.current);
      const m = modelMetrics(modelRef.current);

      // 3. Fixed-time baseline with identical arrivals (adaptive mode only)
      let co2Saved = 0;
      let baseM = null;
      if (baselineRef.current) {
        const b = tickSignal(baselineSignalRef.current);
        baselineSignalRef.current = { phase: b.phase, phaseTimer: b.phaseTimer };
        baselineRef.current = stepTrafficModel(
          baselineRef.current,
          signalStatesFor(b.phase),
          baselineRngRef.current
        );
        co2Saved = co2SavedKg(modelRef.current, baselineRef.current);
        baseM = modelMetrics(baselineRef.current);
        setBaselineMetrics(baseM);
      }

      // 4. Timeline sample
      const t = modelRef.current.elapsed;
      if (t % HISTORY_INTERVAL_S === 0) {
        const point = {
          t,
          avgWaitTime: m.avgWaitTime,
          queueLength: m.queueLength,
          throughput: m.throughput,
          stopRate: m.stopRate,
          efficiency: m.efficiency,
          co2Saved,
          baselineAvgWaitTime: baseM ? baseM.avgWaitTime : null,
          baselineQueueLength: baseM ? baseM.queueLength : null,
        };
        setHistory((prev) => {
          const next = [...prev, point];
          return next.length > MAX_HISTORY_POINTS ? next.slice(-MAX_HISTORY_POINTS) : next;
        });
      }

      setMetrics({ ...m, co2Saved });
      setQueues(queueLengths(modelRef.current));

      setElapsedSeconds((prev) => {
        const n = prev + 1;
        if (n >= duration * 60) setIsRunning(false);
        return n;
      });
    }, Math.max(50, 1000 / speed));

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, speed, duration, initModels, logDecision]);

  // Redraw queued vehicles when signals change.
  useEffect(() => {
    const q = modelRef.current ? queueLengths(modelRef.current) : queues;
    setVehicles(vehiclesFromQueues(signalStates, isRunning, q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signalStates, isRunning]);

  const play = useCallback(() => {
    if (!modelRef.current) initModels();
    setIsRunning(true);
  }, [initModels]);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    modelRef.current = null;
    baselineRef.current = null;
    signalRef.current = initialSignalState();
    baselineSignalRef.current = initialSignalState();
    statesRef.current = signalStatesFor(0);
    emergencyRef.current = false;
    if (emergencyTimeoutRef.current) clearTimeout(emergencyTimeoutRef.current);
    setPhase(0);
    setPhaseTimer(PHASE_CONFIGS[0].duration);
    setSignalStates(signalStatesFor(0));
    setMetrics(EMPTY_METRICS);
    setBaselineMetrics(null);
    setQueues({ north: 0, south: 0, east: 0, west: 0 });
    setVehicles([]);
    setAiDecisions([]);
    setEmergencyActive(false);
    setHistory([]);
    setSeed(null);
  }, []);

  // Changing control mode mid-run would mix two controllers' statistics.
  useEffect(() => {
    reset();
  }, [controlMode, reset]);

  useEffect(() => () => {
    if (emergencyTimeoutRef.current) clearTimeout(emergencyTimeoutRef.current);
  }, []);

  const triggerEmergency = useCallback((direction) => {
    emergencyRef.current = true;
    setEmergencyActive(true);
    const dirs = { north: 'red', south: 'red', east: 'red', west: 'red' };
    dirs[direction] = 'green';
    dirs[OPPOSITE[direction]] = 'green';
    statesRef.current = dirs;
    setSignalStates(dirs);

    logDecision(
      `Emergency override: Green corridor for ${direction} direction`,
      'Emergency vehicle detected. All cross-traffic held to provide clearance corridor. Normal operation will resume after vehicle passes.',
      99
    );

    if (emergencyTimeoutRef.current) clearTimeout(emergencyTimeoutRef.current);
    emergencyTimeoutRef.current = setTimeout(() => {
      emergencyRef.current = false;
      setEmergencyActive(false);
      statesRef.current = signalStatesFor(signalRef.current.phase);
      setSignalStates(statesRef.current);
    }, 15000);
  }, [logDecision]);

  const timings = approachTimings(signalStates, phaseTimer);
  const currentPhaseLabel = phase < 2 ? 'Phase 1 (N-S)' : 'Phase 2 (E-W)';

  return {
    isRunning,
    speed,
    setSpeed,
    elapsedSeconds,
    duration,
    controlMode,
    signalStates,
    timings,
    metrics,
    baselineMetrics,
    queues,
    vehicles,
    aiDecisions,
    emergencyActive,
    currentPhaseLabel,
    history,
    seed,
    play,
    pause,
    reset,
    triggerEmergency,
  };
}
