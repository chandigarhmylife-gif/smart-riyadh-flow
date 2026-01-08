import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Play, Pause, RotateCcw, Map } from 'lucide-react';
import IntersectionNetwork from '../components/Network/IntersectionNetwork';
import VehicleTypes from '../components/Simulation/VehicleTypes';
import WeatherImpact from '../components/Integration/WeatherImpact';
import EmergencyPriority from '../components/Simulation/EmergencyPriority';
import LiveMetricsStream from '../components/RealTime/LiveMetricsStream';
import TrafficMap from '../components/Map/TrafficMap';
import PublicTransitPriority from '../components/Transit/PublicTransitPriority';
import TransitImpactAnalysis from '../components/Transit/TransitImpactAnalysis';

export default function NetworkSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [networkData, setNetworkData] = useState(null);
  const [vehicleDistribution, setVehicleDistribution] = useState(null);
  const [weather, setWeather] = useState(null);
  const [emergencyVehicles, setEmergencyVehicles] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const handlePlay = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setEmergencyVehicles([]);
    setIncidents([]);
  };

  const handleEmergencyTrigger = (emergency) => {
    const position = [37.7749 + (Math.random() - 0.5) * 0.01, -122.4194 + (Math.random() - 0.5) * 0.01];
    setEmergencyVehicles([...emergencyVehicles, { ...emergency, position }]);
    setTimeout(() => {
      setEmergencyVehicles(prev => prev.filter(e => e.id !== emergency.id));
    }, emergency.eta * 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center space-x-2">
              <Network className="w-8 h-8 text-blue-600" />
              <span>Multi-Intersection Network</span>
            </h1>
            <p className="text-slate-600">Coordinated traffic signal management across multiple intersections</p>
          </div>
          <div className="flex space-x-2">
            {!isRunning ? (
              <Button onClick={handlePlay} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Start Network
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Left Column - Network Visualization */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="network" className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="network">Network Diagram</TabsTrigger>
                <TabsTrigger value="map">Live Map View</TabsTrigger>
              </TabsList>
              <TabsContent value="network">
                <IntersectionNetwork onNetworkChange={setNetworkData} />
              </TabsContent>
              <TabsContent value="map" className="h-[600px]">
                <TrafficMap
                  intersections={[
                    { id: 1, name: 'Main & 1st', position: [37.7749, -122.4194], status: 'green' },
                    { id: 2, name: 'Main & 2nd', position: [37.7759, -122.4204], status: 'red' },
                    { id: 3, name: '1st & Oak', position: [37.7739, -122.4184], status: 'green' },
                    { id: 4, name: '2nd & Oak', position: [37.7749, -122.4214], status: 'green' }
                  ]}
                  emergencyVehicles={emergencyVehicles}
                  incidents={incidents}
                  isRunning={isRunning}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Controls & Metrics */}
          <div className="lg:col-span-4 space-y-4">
            <LiveMetricsStream isActive={isRunning} />
            <PublicTransitPriority 
              isRunning={isRunning}
              onPriorityChange={(enabled) => console.log('Transit priority:', enabled)}
            />
            <EmergencyPriority onEmergencyTrigger={handleEmergencyTrigger} />
          </div>
        </div>

        {/* Bottom Row - Advanced Controls */}
        <div className="grid lg:grid-cols-2 gap-4">
          <VehicleTypes onDistributionChange={setVehicleDistribution} />
          <WeatherImpact onWeatherChange={setWeather} />
        </div>

        {/* Transit Impact Analysis */}
        <TransitImpactAnalysis 
          currentMetrics={{ avgWaitTime: 38, throughput: 1247, efficiency: 87, queueLength: 12 }}
        />

        {/* Network Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
            <div className="text-sm opacity-90 mb-1">Network Efficiency</div>
            <div className="text-3xl font-bold">87%</div>
            <div className="text-xs opacity-75 mt-2">Across all intersections</div>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white">
            <div className="text-sm opacity-90 mb-1">Synchronized Signals</div>
            <div className="text-3xl font-bold">8/12</div>
            <div className="text-xs opacity-75 mt-2">Active coordination</div>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white">
            <div className="text-sm opacity-90 mb-1">Total Throughput</div>
            <div className="text-3xl font-bold">1,247</div>
            <div className="text-xs opacity-75 mt-2">Vehicles per hour</div>
          </div>
          <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white">
            <div className="text-sm opacity-90 mb-1">Avg Wait Time</div>
            <div className="text-3xl font-bold">38s</div>
            <div className="text-xs opacity-75 mt-2">Network average</div>
          </div>
        </div>
      </div>
    </div>
  );
}