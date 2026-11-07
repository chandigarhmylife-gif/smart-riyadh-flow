import { useState, useEffect, useRef, useCallback } from 'react';
import { computeNetworkMetrics } from '@/lib/networkMetrics';
import {
  createNetwork,
  stepNetwork,
  intersectionMetrics,
  networkSummary,
  vehiclePositions,
  preemptIntersection,
  setNetworkConditions,
  setTransitPriority as setNetworkTransitPriority,
  updateNodeSettings,
  setIncident as setNetworkIncident,
  roadStates,
  eventsSince,
} from '@/lib/networkModel';
import { updateQueueAlerts, pushAlerts } from '@/lib/alerts';
import { DIRECTIONS, queueLengths } from '@/lib/trafficModel';

/** Queue alert thresholds per approach (vehicles), for 2-lane approaches. */
const QUEUE_ALERT = { high: 30, clear: 10 };

const EMPTY_STATS = { waitTime: 0, throughput: 0, queueLength: 0, efficiency: 0, stopRate: 0 };

const DEFAULT_INTERSECTIONS = [
  { id: 1, name: 'King Fahd / Al Urubah', status: 'active', coordination: 'synchronized', signalState: 'green', position: { x: 120, y: 80 }, mapPos: [24.7112, 46.6741], ...EMPTY_STATS },
  { id: 2, name: 'Olaya / Al Urubah', status: 'active', coordination: 'synchronized', signalState: 'red', position: { x: 350, y: 80 }, mapPos: [24.7128, 46.6788], ...EMPTY_STATS },
  { id: 3, name: 'King Fahd / Tahlia', status: 'active', coordination: 'synchronized', signalState: 'green', position: { x: 120, y: 220 }, mapPos: [24.6993, 46.6806], ...EMPTY_STATS },
  { id: 4, name: 'Olaya / Tahlia', status: 'active', coordination: 'synchronized', signalState: 'yellow', position: { x: 350, y: 220 }, mapPos: [24.7009, 46.6852], ...EMPTY_STATS },
];

const EMPTY_SUMMARY = { avgDelay: 0, stopRate: 0, platoonStopRate: 0, platoonStopRateByDir: {}, vehiclesInTransit: 0 };

/** Weather options from the WeatherImpact panel mapped to model conditions. */
const WEATHER_IMPACT = { clear: 0, cloudy: 5, rain: 20, 'heavy-rain': 40, snow: 50, fog: 30 };

/**
 * Multi-intersection simulation on the corridor network model.
 *
 * controlMode:
 *  - 'coordinated': fixed-time plans; synchronized intersections share a green wave
 *  - 'adaptive': every intersection runs queue-actuated control on its own
 *  - 'adaptive-platoon': adaptive control that also sees vehicles arriving
 *    from upstream signals and holds or brings forward green for them
 *
 * A baseline network with uncoordinated fixed-time signals runs alongside on
 * identical arrivals, so the benefit of coordination or adaptive control is measured.
 */
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
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [baselineSummary, setBaselineSummary] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [controlMode, setControlModeState] = useState('coordinated');
  const [roads, setRoads] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const netRef = useRef(null);
  const baseRef = useRef(null);
  const intersectionsRef = useRef(intersections);
  intersectionsRef.current = intersections;
  const settingsRef = useRef({});
  settingsRef.current = {
    controlMode,
    weather: weather.condition,
    transitPriority,
    heavyVehicleShare: ((vehicleDistribution.truck || 0) + (vehicleDistribution.bus || 0)) / 100,
  };
  const emergencyTimeouts = useRef([]);
  const queueAlertsRef = useRef(new Set());
  const eventIndexRef = useRef(0);

  // Read and write through the ref so rapid successive edits don't overwrite each other.
  const commit = (next) => {
    intersectionsRef.current = next;
    setIntersections(next);
  };

  const nameOf = (id) => intersectionsRef.current.find((i) => i.id === Number(id))?.name || `Intersection ${id}`;
  const describeKey = (key) => {
    const [id, dir] = key.split(':');
    return `${nameOf(id)}, ${dir} approach`;
  };

  /** (Re)build the network and its uncoordinated baseline from current settings. */
  const buildNetworks = useCallback((nodes = intersectionsRef.current) => {
    const s = settingsRef.current;
    const seed = Math.floor(Math.random() * 1e9);
    const common = {
      weather: s.weather,
      transitPriority: s.transitPriority,
      heavyVehicleShare: s.heavyVehicleShare,
      timeOfDay: 'rush-hour',
      seed,
    };
    netRef.current = createNetwork(nodes, { ...common, controlMode: s.controlMode });
    baseRef.current = createNetwork(nodes, { ...common, controlMode: 'independent' });
    // Carry active incidents over to the rebuilt networks.
    for (const n of nodes) {
      if (n.incident) {
        setNetworkIncident(netRef.current, n.id, n.incident);
        setNetworkIncident(baseRef.current, n.id, n.incident);
      }
    }
    // Incidents carried over above are already shown; only report new events.
    eventIndexRef.current = netRef.current.eventSeq;
    queueAlertsRef.current = new Set();
  }, []);

  // Main loop: one simulated second per tick.
  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = setInterval(() => {
      if (!netRef.current) buildNetworks();
      stepNetwork(netRef.current);
      stepNetwork(baseRef.current);

      const byId = Object.fromEntries(intersectionMetrics(netRef.current).map((m) => [m.id, m]));
      setIntersections((prev) => {
        const next = prev.map((i) => (byId[i.id] ? { ...i, ...byId[i.id], id: i.id } : i));
        intersectionsRef.current = next;
        return next;
      });
      setSummary(networkSummary(netRef.current));
      setBaselineSummary(networkSummary(baseRef.current));
      setVehicles(vehiclePositions(netRef.current));
      setRoads(roadStates(netRef.current));

      // Alerts: queue build-up per approach, plus spillback/incident events.
      const net = netRef.current;
      const queues = {};
      for (const id of net.order) {
        if (net.nodes[id].status === 'inactive') continue;
        const q = queueLengths(net.nodes[id].model);
        for (const d of DIRECTIONS) queues[`${id}:${d}`] = q[d];
      }
      const qa = updateQueueAlerts(queueAlertsRef.current, queues, QUEUE_ALERT);
      queueAlertsRef.current = qa.active;
      const fresh = eventsSince(net, eventIndexRef.current).map((e) => ({
        ...e,
        kind: e.type,
        fromName: e.from !== undefined ? nameOf(e.from) : undefined,
        toName: e.to !== undefined ? nameOf(e.to) : undefined,
        name: e.node !== undefined ? nameOf(e.node) : undefined,
      }));
      eventIndexRef.current = net.eventSeq;
      const events = [...qa.events, ...fresh];
      if (events.length) setAlerts((prev) => pushAlerts(prev, events, net.t, describeKey));

      setElapsedTime((t) => t + 1);
    }, Math.max(50, 1000 / speed));
    return () => clearInterval(interval);
  }, [isRunning, speed, buildNetworks]);

  // Aggregate KPIs whenever intersection data changes.
  useEffect(() => {
    setNetworkMetrics({ ...computeNetworkMetrics(intersections), stopRate: Math.round(summary.stopRate) });
  }, [intersections, summary.stopRate]);

  useEffect(() => () => emergencyTimeouts.current.forEach(clearTimeout), []);

  const play = () => {
    if (!netRef.current) buildNetworks();
    setIsRunning(true);
  };
  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    netRef.current = null;
    baseRef.current = null;
    emergencyTimeouts.current.forEach(clearTimeout);
    emergencyTimeouts.current = [];
    setIntersections((prev) => prev.map((i) => ({ ...i, ...EMPTY_STATS })));
    setSummary(EMPTY_SUMMARY);
    setBaselineSummary(null);
    setVehicles([]);
    setRoads([]);
    setAlerts([]);
    setEmergencyVehicles([]);
    setIncidents([]);
    commit(intersectionsRef.current.map((i) => ({ ...i, incident: null })));
  };

  /** Changing the controller restarts the run so statistics aren't mixed. */
  const setControlMode = (mode) => {
    settingsRef.current.controlMode = mode;
    setControlModeState(mode);
    netRef.current = null;
    baseRef.current = null;
    setElapsedTime(0);
    setSummary(EMPTY_SUMMARY);
    setBaselineSummary(null);
    setVehicles([]);
    setRoads([]);
    setAlerts([]);
    setIntersections((prev) => prev.map((i) => ({ ...i, ...EMPTY_STATS })));
  };

  // Topology changes rebuild the network (links and offsets depend on it),
  // so statistics start again from zero.
  const rebuild = (nodes) => {
    if (!netRef.current) return;
    buildNetworks(nodes);
    setElapsedTime(0);
    setSummary(EMPTY_SUMMARY);
    setBaselineSummary(null);
  };


  const addIntersection = (data) => {
    const intersections = intersectionsRef.current;
    const newId = intersections.length > 0 ? Math.max(...intersections.map((i) => i.id)) + 1 : 1;
    const newInt = {
      id: newId,
      name: data?.name || `Intersection ${newId}`,
      status: 'active',
      coordination: 'independent',
      signalState: 'green',
      position: { x: 80 + Math.random() * 400, y: 60 + Math.random() * 200 },
      mapPos: data?.mapPos || [24.7112 + (Math.random() - 0.5) * 0.01, 46.6741 + (Math.random() - 0.5) * 0.01],
      ...EMPTY_STATS,
    };
    const next = [...intersections, newInt].map((i) => ({ ...i, ...(netRef.current ? EMPTY_STATS : {}) }));
    commit(next);
    rebuild(next);
  };

  const removeIntersection = (id) => {
    const next = intersectionsRef.current.filter((i) => i.id !== id);
    commit(next);
    rebuild(next);
  };

  const applySettings = (next) => {
    if (netRef.current) updateNodeSettings(netRef.current, next);
    if (baseRef.current) updateNodeSettings(baseRef.current, next.map(({ id, status }) => ({ id, status })));
  };

  const toggleCoordination = (id) => {
    const next = intersectionsRef.current.map((i) => (
      i.id === id ? { ...i, coordination: i.coordination === 'synchronized' ? 'independent' : 'synchronized' } : i
    ));
    commit(next);
    applySettings(next);
  };

  const toggleIntersectionStatus = (id) => {
    const next = intersectionsRef.current.map((i) => (
      i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i
    ));
    commit(next);
    applySettings(next);
  };

  /** Emergency vehicle: pre-empts the nearest active intersection for its approach. */
  const triggerEmergency = () => {
    const current = intersectionsRef.current;
    const active = current.filter((i) => i.status === 'active');
    const target = active[Math.floor(Math.random() * active.length)] || current[0];
    const direction = ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)];
    const emergency = {
      id: Date.now(),
      type: ['ambulance', 'fire', 'police'][Math.floor(Math.random() * 3)],
      direction,
      eta: Math.floor(Math.random() * 20) + 10,
      position: target?.mapPos || [24.7112, 46.6741],
      intersection: target?.name,
      timestamp: new Date().toLocaleTimeString(),
    };
    if (netRef.current) {
      setAlerts((prev) => pushAlerts(prev, [{
        kind: 'emergency',
        message: `${emergency.type.charAt(0).toUpperCase() + emergency.type.slice(1)} heading ${direction.toLowerCase()} at ${target?.name}: ${direction === 'North' || direction === 'South' ? 'N-S' : 'E-W'} green held for ${Math.min(15, emergency.eta)}s.`,
      }], netRef.current.t, describeKey));
    }
    if (target && netRef.current) {
      const axis = direction === 'North' || direction === 'South' ? 'ns' : 'ew';
      preemptIntersection(netRef.current, target.id, axis, Math.min(15, emergency.eta));
      preemptIntersection(baseRef.current, target.id, axis, Math.min(15, emergency.eta));
    }
    setEmergencyVehicles((prev) => [...prev, emergency]);
    emergencyTimeouts.current.push(setTimeout(() => {
      setEmergencyVehicles((prev) => prev.filter((e) => e.id !== emergency.id));
    }, emergency.eta * 1000));
    return emergency;
  };

  const clearEmergency = (id) => {
    setEmergencyVehicles((prev) => prev.filter((e) => e.id !== id));
  };

  /**
   * Incident at an intersection: severity 'minor' (half capacity), 'major'
   * (a quarter), or null to clear. Shown on the map and applied to both networks.
   */
  const INCIDENT_SHARE = { minor: 0.5, major: 0.25 };
  const setIncident = (id, severity) => {
    const share = severity ? INCIDENT_SHARE[severity] : null;
    const next = intersectionsRef.current.map((i) => (i.id === id ? { ...i, incident: share, incidentSeverity: severity } : i));
    commit(next);
    for (const net of [netRef.current, baseRef.current]) {
      if (net) setNetworkIncident(net, id, share);
    }
    setIncidents(next.filter((i) => i.incident).map((i) => ({
      id: `incident-${i.id}`,
      position: i.mapPos,
      type: i.incidentSeverity === 'major' ? 'Major incident' : 'Minor incident',
      severity: i.incidentSeverity,
      description: `${i.name}: ${i.incidentSeverity === 'major' ? '75%' : '50%'} of capacity lost`,
    })));
  };

  const updateWeather = (w) => {
    setWeather({ condition: w.condition, impact: WEATHER_IMPACT[w.condition] || 0 });
    for (const net of [netRef.current, baseRef.current]) {
      if (net) setNetworkConditions(net, { weather: w.condition });
    }
  };

  const updateTransitPriority = (enabled) => {
    setTransitPriority(enabled);
    for (const net of [netRef.current, baseRef.current]) {
      if (net) setNetworkTransitPriority(net, enabled);
    }
  };

  const updateVehicleDistribution = (dist) => {
    setVehicleDistribution(dist);
    const heavyVehicleShare = ((dist.truck || 0) + (dist.bus || 0)) / 100;
    for (const net of [netRef.current, baseRef.current]) {
      if (net) setNetworkConditions(net, { heavyVehicleShare });
    }
  };

  return {
    isRunning, speed, elapsedTime, intersections, emergencyVehicles, incidents,
    transitPriority, weather, vehicleDistribution, networkMetrics, vehicles,
    summary, baselineSummary, controlMode, roads, alerts,
    play, pause, reset, setSpeed, addIntersection, removeIntersection,
    toggleCoordination, toggleIntersectionStatus, triggerEmergency, clearEmergency,
    setTransitPriority: updateTransitPriority, updateWeather,
    setVehicleDistribution: updateVehicleDistribution, setControlMode, setIncident,
  };
}
