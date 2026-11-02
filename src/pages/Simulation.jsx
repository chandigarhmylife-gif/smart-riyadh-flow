import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import useSimulationEngine from '../hooks/useSimulationEngine';
import TrafficCanvas from '../components/Simulation/TrafficCanvas';
import ControlPanel from '../components/Simulation/ControlPanel';
import MetricsSidebar from '../components/Simulation/MetricsSidebar';
import SignalIndicator from '../components/Simulation/SignalIndicator';
import AIDecisions from '../components/Simulation/AIDecisions';
import SimulationStatusBar from '../components/Simulation/SimulationStatusBar';
import TrafficMap from '../components/Map/TrafficMap';
import LiveMetricsStream from '../components/RealTime/LiveMetricsStream';
import LiveAlerts from '../components/RealTime/LiveAlerts';
import TrafficAnalysis from '../components/AI/TrafficAnalysis';
import SmartRecommendations from '../components/AI/SmartRecommendations';
import TrafficForecast24h from '../components/AI/TrafficForecast24h';
import PublicTransitPriority from '../components/Transit/PublicTransitPriority';
import TransitImpactAnalysis from '../components/Transit/TransitImpactAnalysis';
import EmergencyPriority from '../components/Simulation/EmergencyPriority';
import VehicleTypes from '../components/Simulation/VehicleTypes';

export default function Simulation() {
  const { toast } = useToast();
  const [selectedScenarioId, setSelectedScenarioId] = useState('default');
  const [loadedScenario, setLoadedScenario] = useState(null);
  const [savingResults, setSavingResults] = useState(false);
  const [rightTab, setRightTab] = useState('metrics');

  // Fetch saved scenarios for dropdown
  const { data: scenarios = [], isLoading: loadingScenarios } = useQuery({
    queryKey: ['sim-scenarios'],
    queryFn: () => base44.entities.TrafficScenario.list('-updated_date', 30),
  });

  // Load scenario from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('scenario');
    if (id) {
      setSelectedScenarioId(id);
    }
  }, []);

  // Load scenario data when selection changes
  useEffect(() => {
    if (selectedScenarioId === 'default' || !selectedScenarioId) {
      setLoadedScenario(null);
      return;
    }
    const found = scenarios.find(s => String(s.id) === String(selectedScenarioId));
    if (found) {
      setLoadedScenario(found);
    }
  }, [selectedScenarioId, scenarios]);

  const scenarioConfig = loadedScenario?.config || {};
  const engine = useSimulationEngine({
    duration: scenarioConfig.duration || 60,
  });

  const {
    isRunning, speed, setSpeed, elapsedSeconds, duration,
    signalStates, timings, metrics, vehicles, aiDecisions,
    emergencyActive, currentPhaseLabel,
    play, pause, reset, triggerEmergency,
  } = engine;

  const handleScenarioChange = (value) => {
    if (isRunning) {
      toast({ title: 'Stop the simulation first', variant: 'destructive' });
      return;
    }
    reset();
    setSelectedScenarioId(value);
  };

  const handleEmergencyTrigger = (emergency) => {
    if (!isRunning) return;
    const dirMap = { North: 'north', South: 'south', East: 'east', West: 'west' };
    triggerEmergency(dirMap[emergency.direction] || 'north');
  };

  const handleSaveResults = async () => {
    if (!loadedScenario) {
      toast({ title: 'No scenario to save results to', variant: 'destructive' });
      return;
    }
    setSavingResults(true);
    await base44.entities.TrafficScenario.update(loadedScenario.id, {
      status: 'completed',
      results: {
        avgWaitTime: Math.round(metrics.avgWaitTime),
        throughput: Math.round(metrics.throughput),
        queueLength: Math.round(metrics.queueLength),
        efficiency: Math.round(metrics.efficiency),
        totalVehicles: metrics.totalVehicles,
        co2Saved: parseFloat(metrics.co2Saved.toFixed(2)),
        durationRan: elapsedSeconds,
        completedAt: new Date().toISOString(),
      },
    });
    setSavingResults(false);
    toast({ title: 'Results saved', description: `Results for "${loadedScenario.name}" saved.` });
  };

  const scenarioName = loadedScenario?.name || 'Default Scenario';

  // Map intersections from loaded scenario for map view
  const mapIntersections = (loadedScenario?.intersections || []).map((inter, i) => ({
    id: inter.id,
    name: inter.name,
    position: [24.7112 + i * 0.001, 46.6741 + i * 0.001],
    status: Object.values(signalStates)[i % 4],
  }));
  if (mapIntersections.length === 0) {
    mapIntersections.push(
      { id: 1, name: 'King Fahd / Al Urubah', position: [24.7112, 46.6741], status: signalStates.north },
      { id: 2, name: 'Olaya / Al Urubah', position: [24.7128, 46.6788], status: signalStates.south },
      { id: 3, name: 'King Fahd / Tahlia', position: [24.6993, 46.6806], status: signalStates.east },
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Traffic Simulation</h1>
            <p className="text-slate-600">Real-time adaptive signal control</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={String(selectedScenarioId)} onValueChange={handleScenarioChange}>
              <SelectTrigger className="w-56 border-2">
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Scenario</SelectItem>
                {scenarios.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loadedScenario && elapsedSeconds > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveResults}
                disabled={savingResults}
              >
                {savingResults ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Results
              </Button>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <SimulationStatusBar
          isRunning={isRunning}
          elapsedSeconds={elapsedSeconds}
          duration={duration}
          metrics={metrics}
          emergencyActive={emergencyActive}
          currentPhaseLabel={currentPhaseLabel}
          scenarioName={scenarioName}
        />

        {/* Scenario Info */}
        {loadedScenario && (
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline">Weather: {scenarioConfig.weatherCondition || 'clear'}</Badge>
            <Badge variant="outline">Time: {scenarioConfig.timeOfDay || '-'}</Badge>
            <Badge variant="outline">{(loadedScenario.intersections || []).length} intersections</Badge>
            <Badge variant="outline">{(loadedScenario.vehicle_flows || []).length} flows</Badge>
            {scenarioConfig.aiOptimization && <Badge className="bg-purple-100 text-purple-800 text-xs">AI Optimization</Badge>}
            {scenarioConfig.transitPriority && <Badge className="bg-green-100 text-green-800 text-xs">Transit Priority</Badge>}
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Left Column - Controls */}
          <div className="lg:col-span-3 space-y-4">
            <ControlPanel
              isRunning={isRunning}
              onPlay={play}
              onPause={pause}
              onReset={reset}
              speed={speed}
              onSpeedChange={setSpeed}
            />
            <SignalIndicator signalStates={signalStates} timings={timings} />
            <EmergencyPriority onEmergencyTrigger={handleEmergencyTrigger} />
          </div>

          {/* Center Column - Visualization */}
          <div className="lg:col-span-6">
            <Tabs defaultValue="3d" className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="3d">3D Simulation</TabsTrigger>
                <TabsTrigger value="map">Live Map</TabsTrigger>
              </TabsList>
              <TabsContent value="3d" className="h-[500px] lg:h-[600px]">
                <TrafficCanvas
                  signalStates={signalStates}
                  vehicles={vehicles}
                  isRunning={isRunning}
                />
              </TabsContent>
              <TabsContent value="map" className="h-[500px] lg:h-[600px]">
                <TrafficMap
                  intersections={mapIntersections}
                  isRunning={isRunning}
                />
              </TabsContent>
            </Tabs>

            {/* AI Decisions below canvas */}
            <div className="mt-4">
              <AIDecisions decisions={aiDecisions} />
            </div>
          </div>

          {/* Right Column - Metrics & AI Tools */}
          <div className="lg:col-span-3 space-y-4">
            <Tabs value={rightTab} onValueChange={setRightTab}>
              <TabsList className="grid w-full grid-cols-3 mb-2">
                <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">AI Tools</TabsTrigger>
                <TabsTrigger value="transit" className="text-xs">Transit</TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="space-y-4 mt-0">
                <MetricsSidebar metrics={metrics} isRunning={isRunning} />
                <LiveMetricsStream isActive={isRunning} />
                <LiveAlerts isActive={isRunning} />
              </TabsContent>

              <TabsContent value="ai" className="space-y-4 mt-0">
                <TrafficAnalysis
                  trafficData={metrics}
                  onAnalysisComplete={(result) => {}}
                />
                <SmartRecommendations
                  scenario={{ name: scenarioName }}
                  metrics={metrics}
                />
                <TrafficForecast24h currentMetrics={metrics} />
              </TabsContent>

              <TabsContent value="transit" className="space-y-4 mt-0">
                <PublicTransitPriority
                  isRunning={isRunning}
                  onPriorityChange={() => {}}
                />
                <TransitImpactAnalysis currentMetrics={metrics} />
                <VehicleTypes onDistributionChange={() => {}} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}