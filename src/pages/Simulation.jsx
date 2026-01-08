import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrafficCanvas from '../components/Simulation/TrafficCanvas';
import ControlPanel from '../components/Simulation/ControlPanel';
import MetricsSidebar from '../components/Simulation/MetricsSidebar';
import SignalIndicator from '../components/Simulation/SignalIndicator';
import AIDecisions from '../components/Simulation/AIDecisions';
import TrafficAnalysis from '../components/AI/TrafficAnalysis';
import SmartRecommendations from '../components/AI/SmartRecommendations';
import LiveMetricsStream from '../components/RealTime/LiveMetricsStream';
import LiveAlerts from '../components/RealTime/LiveAlerts';
import TrafficMap from '../components/Map/TrafficMap';

export default function Simulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('rush-hour');
  const [signalStates, setSignalStates] = useState({
    north: 'green',
    south: 'green',
    east: 'red',
    west: 'red'
  });
  
  const [metrics, setMetrics] = useState({
    avgWaitTime: 42,
    throughput: 156,
    queueLength: 8,
    efficiency: 89
  });

  const scenarios = [
    { id: 'rush-hour', name: 'Downtown Rush Hour' },
    { id: 'school-zone', name: 'School Zone Morning' },
    { id: 'evening', name: 'Evening Commute' },
    { id: 'custom', name: 'Custom Scenario' }
  ];

  const handlePlay = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSignalStates({
      north: 'green',
      south: 'green',
      east: 'red',
      west: 'red'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Traffic Simulation</h1>
            <p className="text-slate-600">Real-time adaptive signal control</p>
          </div>
          <div className="w-full sm:w-64">
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map(scenario => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Left Column - Controls */}
          <div className="lg:col-span-3 space-y-4">
            <ControlPanel
              isRunning={isRunning}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={setSpeed}
            />
            <SignalIndicator signalStates={signalStates} />
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
                  isRunning={isRunning}
                />
              </TabsContent>
              <TabsContent value="map" className="h-[500px] lg:h-[600px]">
                <TrafficMap
                  intersections={[
                    { id: 1, name: 'Main & 1st', position: [37.7749, -122.4194], status: signalStates.north },
                    { id: 2, name: 'Main & 2nd', position: [37.7759, -122.4204], status: signalStates.south },
                    { id: 3, name: '1st & Oak', position: [37.7739, -122.4184], status: signalStates.east }
                  ]}
                  isRunning={isRunning}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Metrics & AI */}
          <div className="lg:col-span-3 space-y-4">
            <LiveMetricsStream isActive={isRunning} />
            <LiveAlerts isActive={isRunning} />
            <TrafficAnalysis 
              trafficData={metrics}
              onAnalysisComplete={(result) => console.log('Analysis:', result)}
            />
            <SmartRecommendations 
              scenario={{ name: selectedScenario }}
              metrics={metrics}
            />
          </div>
        </div>
      </div>
    </div>
  );
}