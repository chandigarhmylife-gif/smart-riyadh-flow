import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PHASE_CONFIGS,
  initialSignalState,
  tickSignal,
  signalStatesFor,
  isGreenPhase,
  approachTimings,
} from '@/lib/signalTiming';

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function generateVehicles(signalStates, isRunning, count) {
  const directions = ['north', 'south', 'east', 'west'];
  const colors = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];
  return directions.flatMap((dir, di) => {
    const n = Math.ceil(count / 4);
    return Array.from({ length: n }, (_, i) => {
      const id = di * n + i + 1;
      const canGo = isRunning && signalStates[dir] === 'green';
      const speed = canGo ? randomBetween(0.5, 1.5) : 0;
      let pos;
      const offset = (i - n / 2) * 1.2;
      if (dir === 'north') pos = [0.6, 0.15, -4 + offset];
      else if (dir === 'south') pos = [-0.6, 0.15, 4 - offset];
      else if (dir === 'east') pos = [-4 + offset, 0.15, -0.6];
      else pos = [4 - offset, 0.15, 0.6];
      return { id, position: pos, color: colors[id % colors.length], direction: dir, speed };
    });
  });
}

export default function useSimulationEngine(config = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [phase, setPhase] = useState(0);
  const [phaseTimer, setPhaseTimer] = useState(PHASE_CONFIGS[0].duration);
  const [signalStates, setSignalStates] = useState({
    north: 'green', south: 'green', east: 'red', west: 'red'
  });
  const [metrics, setMetrics] = useState({
    avgWaitTime: 0,
    throughput: 0,
    queueLength: 0,
    efficiency: 0,
    totalVehicles: 0,
    co2Saved: 0,
  });
  const [vehicles, setVehicles] = useState([]);
  const [aiDecisions, setAiDecisions] = useState([]);
  const [emergencyActive, setEmergencyActive] = useState(false);

  const intervalRef = useRef(null);
  const decisionIdRef = useRef(0);
  const signalRef = useRef(initialSignalState());
  const emergencyRef = useRef(false);
  const emergencyTimeoutRef = useRef(null);

  const duration = config.duration || 60; // minutes

  // Tick every second (adjusted by speed)
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        if (next >= duration * 60) {
          setIsRunning(false);
          return prev;
        }
        return next;
      });

      // Phase cycling. The signal plan lives in a ref so one tick advances it
      // exactly once (no setState calls nested inside other updaters).
      const next = tickSignal(signalRef.current);
      signalRef.current = { phase: next.phase, phaseTimer: next.phaseTimer };
      setPhaseTimer(next.phaseTimer);
      if (next.changed) {
        setPhase(next.phase);
        if (!emergencyRef.current) {
          setSignalStates(signalStatesFor(next.phase));
        }
        if (isGreenPhase(next.phase)) {
          decisionIdRef.current += 1;
          const isNS = PHASE_CONFIGS[next.phase].north === 'green';
          const decision = {
            id: decisionIdRef.current,
            timestamp: new Date().toLocaleTimeString(),
            decision: isNS
              ? 'Activated North-South green phase'
              : 'Activated East-West green phase',
            reasoning: isNS
              ? `Detected ${Math.floor(randomBetween(8, 18))} vehicles queued in N-S direction. Extended phase to ${PHASE_CONFIGS[next.phase].duration}s for optimal clearance.`
              : `E-W queue building (${Math.floor(randomBetween(5, 14))} vehicles). Switching to clear cross-traffic and reduce wait times.`,
            confidence: Math.floor(randomBetween(85, 98)),
          };
          setAiDecisions(prev => [decision, ...prev].slice(0, 20));
        }
      }

      // Update metrics with realistic fluctuation
      setMetrics(prev => {
        const waitDelta = (Math.random() - 0.55) * 2;
        const throughputDelta = (Math.random() - 0.45) * 8;
        const queueDelta = Math.floor((Math.random() - 0.5) * 2);
        const effDelta = (Math.random() - 0.45) * 1.5;

        return {
          avgWaitTime: Math.max(15, Math.min(75, prev.avgWaitTime + waitDelta)),
          throughput: Math.max(80, Math.min(250, prev.throughput + throughputDelta)),
          queueLength: Math.max(0, Math.min(25, prev.queueLength + queueDelta)),
          efficiency: Math.max(60, Math.min(99, prev.efficiency + effDelta)),
          totalVehicles: prev.totalVehicles + Math.floor(randomBetween(1, 4)),
          co2Saved: Math.max(0, prev.co2Saved + randomBetween(0.01, 0.05)),
        };
      });

    }, Math.max(100, 1000 / speed));

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, speed, duration]);

  // Update vehicles whenever signals or running state changes
  useEffect(() => {
    const count = Math.floor(randomBetween(8, 16));
    setVehicles(generateVehicles(signalStates, isRunning, count));
  }, [signalStates, isRunning]);

  const play = useCallback(() => {
    if (elapsedSeconds === 0) {
      // Initialize metrics
      setMetrics({
        avgWaitTime: Math.floor(randomBetween(30, 50)),
        throughput: Math.floor(randomBetween(120, 180)),
        queueLength: Math.floor(randomBetween(4, 12)),
        efficiency: Math.floor(randomBetween(78, 92)),
        totalVehicles: 0,
        co2Saved: 0,
      });
    }
    setIsRunning(true);
  }, [elapsedSeconds]);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
    signalRef.current = initialSignalState();
    emergencyRef.current = false;
    if (emergencyTimeoutRef.current) clearTimeout(emergencyTimeoutRef.current);
    setPhase(0);
    setPhaseTimer(PHASE_CONFIGS[0].duration);
    setSignalStates(signalStatesFor(0));
    setMetrics({ avgWaitTime: 0, throughput: 0, queueLength: 0, efficiency: 0, totalVehicles: 0, co2Saved: 0 });
    setVehicles([]);
    setAiDecisions([]);
    setEmergencyActive(false);
  }, []);

  const triggerEmergency = useCallback((direction) => {
    emergencyRef.current = true;
    setEmergencyActive(true);
    // Force green in emergency direction
    const dirs = { north: 'red', south: 'red', east: 'red', west: 'red' };
    dirs[direction] = 'green';
    // Opposite direction gets green too
    const opposite = { north: 'south', south: 'north', east: 'west', west: 'east' };
    dirs[opposite[direction]] = 'green';
    setSignalStates(dirs);

    decisionIdRef.current += 1;
    setAiDecisions(prev => [{
      id: decisionIdRef.current,
      timestamp: new Date().toLocaleTimeString(),
      decision: `Emergency override: Green corridor for ${direction} direction`,
      reasoning: 'Emergency vehicle detected. All cross-traffic held to provide clearance corridor. Normal operation will resume after vehicle passes.',
      confidence: 99,
    }, ...prev].slice(0, 20));

    // Restore the normal plan after 15 seconds
    if (emergencyTimeoutRef.current) clearTimeout(emergencyTimeoutRef.current);
    emergencyTimeoutRef.current = setTimeout(() => {
      emergencyRef.current = false;
      setEmergencyActive(false);
      setSignalStates(signalStatesFor(signalRef.current.phase));
    }, 15000);
  }, []);

  const timings = approachTimings(signalStates, phaseTimer);

  const currentPhaseLabel = phase < 2 ? 'Phase 1 (N-S)' : 'Phase 2 (E-W)';

  return {
    isRunning,
    speed,
    setSpeed,
    elapsedSeconds,
    duration,
    signalStates,
    timings,
    metrics,
    vehicles,
    aiDecisions,
    emergencyActive,
    currentPhaseLabel,
    play,
    pause,
    reset,
    triggerEmergency,
  };
}