import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useNetworkSimulation from '../hooks/useNetworkSimulation';
import IntersectionNetwork from '../components/Network/IntersectionNetwork.jsx';
import SimulationHeader from '../components/Network/SimulationHeader.jsx';
import NetworkStatsBar from '../components/Network/NetworkStatsBar.jsx';
import VehicleTypes from '../components/Simulation/VehicleTypes';
import WeatherImpact from '../components/Integration/WeatherImpact';
import EmergencyPriority from '../components/Simulation/EmergencyPriority';
import LiveMetricsStream from '../components/RealTime/LiveMetricsStream';
import TrafficMap from '../components/Map/TrafficMap';
import PublicTransitPriority from '../components/Transit/PublicTransitPriority';
import TransitImpactAnalysis from '../components/Transit/TransitImpactAnalysis';

export default function NetworkSimulation() {
  const sim = useNetworkSimulation();

  const mapIntersections = sim.intersections
    .filter(i => i.status === 'active' && i.mapPos)
    .map(i => ({
      id: i.id,
      name: i.name,
      position: i.mapPos,
      status: i.signalState
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-[1800px] mx-auto space-y-4">
        <SimulationHeader
          isRunning={sim.isRunning}
          speed={sim.speed}
          elapsedTime={sim.elapsedTime}
          emergencyCount={sim.emergencyVehicles.length}
          onPlay={sim.play}
          onPause={sim.pause}
          onReset={sim.reset}
          onSpeedChange={sim.setSpeed}
        />

        <div className="grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <Tabs defaultValue="network" className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="network">Network Diagram</TabsTrigger>
                <TabsTrigger value="map">Live Map View</TabsTrigger>
              </TabsList>
              <TabsContent value="network">
                <IntersectionNetwork
                  intersections={sim.intersections}
                  isRunning={sim.isRunning}
                  onAdd={sim.addIntersection}
                  onRemove={sim.removeIntersection}
                  onToggleCoordination={sim.toggleCoordination}
                  onToggleStatus={sim.toggleIntersectionStatus}
                />
              </TabsContent>
              <TabsContent value="map" className="h-[600px]">
                <TrafficMap
                  intersections={mapIntersections}
                  vehicles={sim.vehicles}
                  emergencyVehicles={sim.emergencyVehicles}
                  incidents={sim.incidents}
                  isRunning={sim.isRunning}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <LiveMetricsStream isActive={sim.isRunning} />
            <PublicTransitPriority
              isRunning={sim.isRunning}
              onPriorityChange={(enabled) => sim.setTransitPriority(enabled)}
            />
            <EmergencyPriority onEmergencyTrigger={sim.triggerEmergency} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <VehicleTypes onDistributionChange={sim.setVehicleDistribution} />
          <WeatherImpact onWeatherChange={(w) => sim.updateWeather(w)} />
        </div>

        <TransitImpactAnalysis
          currentMetrics={{
            avgWaitTime: sim.networkMetrics.waitTime,
            throughput: sim.networkMetrics.throughput,
            efficiency: sim.networkMetrics.efficiency,
            queueLength: Math.round(sim.networkMetrics.throughput / 100)
          }}
        />

        <NetworkStatsBar
          metrics={sim.networkMetrics}
          elapsedTime={sim.elapsedTime}
          emergencyCount={sim.emergencyVehicles.length}
        />
      </div>
    </div>
  );
}