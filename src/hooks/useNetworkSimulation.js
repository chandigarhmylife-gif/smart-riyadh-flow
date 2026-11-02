import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_INTERSECTIONS = [
  { id: 1, name: 'King Fahd / Al Urubah', status: 'active', coordination: 'synchronized', efficiency: 85, signalState: 'green', position: { x: 120, y: 80 }, mapPos: [24.7112, 46.6741], waitTime: 32, throughput: 180, queueLength: 4 },
  { id: 2, name: 'Olaya / Al Urubah', status: 'active', coordination: 'synchronized', efficiency: 82, signalState: 'red', position: { x: 350, y: 80 }, mapPos: [24.7128, 46.6788], waitTime: 38, throughput: 160, queueLength: 6 },
  { id: 3, name: 'King Fahd / Tahlia', status: 'active', coordination: 'independent', efficiency: 74, signalState: 'green', position: { x: 120, y: 220 }, mapPos: [24.6993, 46.6806], waitTime: 45, throughput: 140, queueLength: 8 },
  { id: 4, name: 'Olaya / Tahlia', status: 'active', coordination: 'synchronized', efficiency: 80, signalState: 'yellow', position: { x: 350, y: 220 }, mapPos: [24.7009, 46.6852], waitTime: 36, throughput: 155, queueLength: 5 },
];

const SIGNAL_CYCLE = ['green', 'yellow', 'red', 'red'];
const SIGNAL_DURATIONS = { green: 4, yellow: 1, red: 3 }; // in ticks

export default function useNetworkSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intersections, setIntersections] = useState(DEFAULT_INTERSECTIONS);
  const [emergencyVehicles, setEmergencyVehicles] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [transitPriority, setTransitPriority] = useState(true);
  const [weather, setWeather] = useState({ condition: 'clear', impact: 0 });
  const [vehicleDistribution, setVehicleDistribution] = useState({ car: 70, truck: 15, bus: 10, emergency: 5 });
  const [networkMetrics, setNetworkMetrics] = useState({ efficiency: 0, throughput: 0, waitTime: 0, synchronized: 0, total: 0 });
  const [vehicles, setVehicles] = useState([]);

  const tickRef = useRef(0);
  const signalTimers = useRef({});

  // Compute aggregate network metrics from intersections
  const computeMetrics = useCallback((ints) => {
    if (ints.length === 0) return { efficiency: 0, throughput: 0, waitTime: 0, synchronized: 0, total: 0 };
    const active = ints.filter(i => i.status === 'active');
    const synced = ints.filter(i => i.coordination === 'synchronized').length;
    const avgEff = active.length > 0 ? Math.round(active.reduce((s, i) => s + i.efficiency, 0) / active.length) : 0;
    const totalThroughput = active.reduce((s, i) => s + i.throughput, 0);
    const avgWait = active.length > 0 ? Math.round(active.reduce((s, i) => s + i.waitTime, 0) / active.length) : 0;
    return { efficiency: avgEff, throughput: totalThroughput, waitTime: avgWait, synchronized: synced, total: ints.length };
  }, []);

  // Generate simulated vehicles on the map
  useEffect(() => {
    const mapInts = intersections.filter(i => i.mapPos);
    if (mapInts.length === 0) return;
    const center = mapInts[0].mapPos;
    const initialVehicles = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      position: [center[0] + (Math.random() - 0.5) * 0.008, center[1] + (Math.random() - 0.5) * 0.008],
      direction: ['North', 'South', 'East', 'West'][i % 4],
      speed: 20 + Math.random() * 20,
      type: 'car'
    }));
    setVehicles(initialVehicles);
  }, []);

  // Main simulation tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tickRef.current += 1;
      setElapsedTime(prev => prev + 1);

      // Weather impact factor (0 to 0.5 delay multiplier)
      const weatherFactor = weather.impact / 100;
      // Transit priority bonus
      const transitBonus = transitPriority ? 0.05 : 0;
      // Emergency penalty
      const emergencyPenalty = emergencyVehicles.length > 0 ? 0.08 : 0;

      setIntersections(prev => prev.map(intersection => {
        if (intersection.status !== 'active') return intersection;

        // Cycle signals
        const timer = signalTimers.current[intersection.id] || 0;
        const currentSignal = intersection.signalState;
        const duration = SIGNAL_DURATIONS[currentSignal] || 3;
        let newSignal = currentSignal;
        let newTimer = timer + 1;

        if (newTimer >= duration) {
          newTimer = 0;
          const idx = SIGNAL_CYCLE.indexOf(currentSignal);
          newSignal = SIGNAL_CYCLE[(idx + 1) % SIGNAL_CYCLE.length];
        }
        signalTimers.current[intersection.id] = newTimer;

        // Synchronized intersections get efficiency boost
        const syncBonus = intersection.coordination === 'synchronized' ? 5 : 0;
        const baseEfficiency = intersection.efficiency;
        const drift = (Math.random() - 0.45) * 3 + syncBonus * 0.05 + transitBonus * 10 - weatherFactor * 10 - emergencyPenalty * 10;
        const newEfficiency = Math.max(50, Math.min(99, baseEfficiency + drift));

        const baseThroughput = intersection.throughput;
        const tDrift = (Math.random() - 0.45) * 8 - weatherFactor * 30 + (transitBonus * 20) + syncBonus * 0.5;
        const newThroughput = Math.max(80, Math.min(250, baseThroughput + tDrift));

        const baseWait = intersection.waitTime;
        const wDrift = (Math.random() - 0.55) * 3 + weatherFactor * 5 - transitBonus * 5 - syncBonus * 0.3 + emergencyPenalty * 5;
        const newWait = Math.max(15, Math.min(80, baseWait + wDrift));

        const baseQueue = intersection.queueLength;
        const qDrift = Math.round((Math.random() - 0.55) * 2 + weatherFactor * 2 - transitBonus * 2);
        const newQueue = Math.max(0, Math.min(25, baseQueue + qDrift));

        return {
          ...intersection,
          signalState: newSignal,
          efficiency: Math.round(newEfficiency),
          throughput: Math.round(newThroughput),
          waitTime: Math.round(newWait),
          queueLength: Math.max(0, newQueue)
        };
      }));

      // Move vehicles on map
      setVehicles(prev => prev.map(v => ({
        ...v,
        position: [
          v.position[0] + (Math.random() - 0.5) * 0.0003,
          v.position[1] + (Math.random() - 0.5) * 0.0003
        ],
        speed: Math.max(5, Math.min(45, v.speed + (Math.random() - 0.5) * 5 - weatherFactor * 10))
      })));

    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, weather, transitPriority, emergencyVehicles.length]);

  // Recompute aggregate metrics when intersections change
  useEffect(() => {
    setNetworkMetrics(computeMetrics(intersections));
  }, [intersections, computeMetrics]);

  const play = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    tickRef.current = 0;
    signalTimers.current = {};
    setIntersections(DEFAULT_INTERSECTIONS);
    setEmergencyVehicles([]);
    setIncidents([]);
  };

  const addIntersection = (data) => {
    const newId = intersections.length > 0 ? Math.max(...intersections.map(i => i.id)) + 1 : 1;
    const newInt = {
      id: newId,
      name: data?.name || `Intersection ${newId}`,
      status: 'active',
      coordination: 'independent',
      efficiency: 70 + Math.floor(Math.random() * 15),
      signalState: 'green',
      position: { x: 80 + Math.random() * 400, y: 60 + Math.random() * 200 },
      mapPos: [24.7112 + (Math.random() - 0.5) * 0.01, 46.6741 + (Math.random() - 0.5) * 0.01],
      waitTime: 30 + Math.floor(Math.random() * 20),
      throughput: 120 + Math.floor(Math.random() * 60),
      queueLength: Math.floor(Math.random() * 10)
    };
    setIntersections(prev => [...prev, newInt]);
  };

  const removeIntersection = (id) => {
    setIntersections(prev => prev.filter(i => i.id !== id));
  };

  const toggleCoordination = (id) => {
    setIntersections(prev => prev.map(i =>
      i.id === id ? { ...i, coordination: i.coordination === 'synchronized' ? 'independent' : 'synchronized' } : i
    ));
  };

  const toggleIntersectionStatus = (id) => {
    setIntersections(prev => prev.map(i =>
      i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i
    ));
  };

  const triggerEmergency = () => {
    const centerMap = intersections[0]?.mapPos || [24.7112, 46.6741];
    const emergency = {
      id: Date.now(),
      type: ['ambulance', 'fire', 'police'][Math.floor(Math.random() * 3)],
      direction: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
      eta: Math.floor(Math.random() * 20) + 10,
      position: [centerMap[0] + (Math.random() - 0.5) * 0.005, centerMap[1] + (Math.random() - 0.5) * 0.005],
      timestamp: new Date().toLocaleTimeString()
    };
    setEmergencyVehicles(prev => [...prev, emergency]);
    setTimeout(() => {
      setEmergencyVehicles(prev => prev.filter(e => e.id !== emergency.id));
    }, emergency.eta * 1000);
    return emergency;
  };

  const clearEmergency = (id) => {
    setEmergencyVehicles(prev => prev.filter(e => e.id !== id));
  };

  const updateWeather = (w) => {
    const impacts = { clear: 0, cloudy: 5, rain: 20, 'heavy-rain': 40, snow: 50, fog: 30 };
    setWeather({ condition: w.condition, impact: impacts[w.condition] || 0 });
  };

  return {
    isRunning, speed, elapsedTime, intersections, emergencyVehicles, incidents,
    transitPriority, weather, vehicleDistribution, networkMetrics, vehicles,
    play, pause, reset, setSpeed, addIntersection, removeIntersection,
    toggleCoordination, toggleIntersectionStatus, triggerEmergency, clearEmergency,
    setTransitPriority, updateWeather, setVehicleDistribution
  };
}