import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Save, Play, Grid, Car, Bus, Truck, 
  AlertCircle, MapPin, Settings 
} from 'lucide-react';

export default function ScenarioBuilder() {
  const [scenarioName, setScenarioName] = useState('New Scenario');
  const [intersections, setIntersections] = useState([
    { id: 1, name: 'Main & 1st', x: 100, y: 100, lanes: 4 },
    { id: 2, name: 'Main & 2nd', x: 300, y: 100, lanes: 4 }
  ]);
  
  const [vehicleFlows, setVehicleFlows] = useState([
    { id: 1, from: 1, to: 2, volume: 150, type: 'mixed' }
  ]);

  const [config, setConfig] = useState({
    duration: 60,
    weatherCondition: 'clear',
    timeOfDay: 'rush-hour',
    transitPriority: true,
    emergencyVehicles: false,
    incidents: false
  });

  const [vehicleDistribution, setVehicleDistribution] = useState({
    cars: 70,
    buses: 15,
    trucks: 15
  });

  const handleSave = () => {
    const scenario = {
      name: scenarioName,
      intersections,
      vehicleFlows,
      config,
      vehicleDistribution,
      createdAt: new Date().toISOString()
    };
    console.log('Saving scenario:', scenario);
  };

  const handleAddIntersection = () => {
    const newId = Math.max(...intersections.map(i => i.id), 0) + 1;
    setIntersections([...intersections, {
      id: newId,
      name: `Intersection ${newId}`,
      x: Math.random() * 400,
      y: Math.random() * 300,
      lanes: 4
    }]);
  };

  const handleAddFlow = () => {
    if (intersections.length < 2) return;
    const newId = Math.max(...vehicleFlows.map(f => f.id), 0) + 1;
    setVehicleFlows([...vehicleFlows, {
      id: newId,
      from: intersections[0].id,
      to: intersections[1].id,
      volume: 100,
      type: 'mixed'
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Scenario Builder</h1>
            <p className="text-slate-600">Design custom traffic scenarios for simulation</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSave} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </Button>
          </div>
        </div>

        {/* Scenario Name */}
        <Card className="border-2 border-slate-200">
          <CardContent className="pt-6">
            <Label>Scenario Name</Label>
            <Input 
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Network Layout</span>
                  <Button onClick={handleAddIntersection} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Intersection
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 border-2 border-slate-300 rounded-lg relative" style={{ height: '400px' }}>
                  <Grid className="absolute top-4 left-4 w-6 h-6 text-slate-400" />
                  {/* Intersections */}
                  {intersections.map(intersection => (
                    <div
                      key={intersection.id}
                      className="absolute w-16 h-16 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                      style={{ 
                        left: `${intersection.x}px`, 
                        top: `${intersection.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  ))}
                  
                  {/* Flow Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {vehicleFlows.map(flow => {
                      const from = intersections.find(i => i.id === flow.from);
                      const to = intersections.find(i => i.id === flow.to);
                      if (!from || !to) return null;
                      return (
                        <line
                          key={flow.id}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="#3B82F6"
                          strokeWidth="3"
                          strokeDasharray="5,5"
                          markerEnd="url(#arrowhead)"
                        />
                      );
                    })}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                        <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
                      </marker>
                    </defs>
                  </svg>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Flows */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Traffic Flows</span>
                  <Button onClick={handleAddFlow} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Flow
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vehicleFlows.map(flow => {
                  const from = intersections.find(i => i.id === flow.from);
                  const to = intersections.find(i => i.id === flow.to);
                  return (
                    <div key={flow.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {from?.name} → {to?.name}
                        </span>
                        <Badge>{flow.volume} veh/h</Badge>
                      </div>
                      <Slider 
                        value={[flow.volume]} 
                        onValueChange={([v]) => setVehicleFlows(vehicleFlows.map(f => 
                          f.id === flow.id ? {...f, volume: v} : f
                        ))}
                        max={300}
                        step={10}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-4">
            {/* Simulation Settings */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Simulation Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input 
                    type="number" 
                    value={config.duration}
                    onChange={(e) => setConfig({...config, duration: parseInt(e.target.value)})}
                    className="mt-2"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Transit Priority</Label>
                    <Switch 
                      checked={config.transitPriority}
                      onCheckedChange={(v) => setConfig({...config, transitPriority: v})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Emergency Vehicles</Label>
                    <Switch 
                      checked={config.emergencyVehicles}
                      onCheckedChange={(v) => setConfig({...config, emergencyVehicles: v})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Include Incidents</Label>
                    <Switch 
                      checked={config.incidents}
                      onCheckedChange={(v) => setConfig({...config, incidents: v})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Distribution */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle>Vehicle Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4 text-blue-600" />
                      <Label>Cars</Label>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{vehicleDistribution.cars}%</span>
                  </div>
                  <Slider 
                    value={[vehicleDistribution.cars]}
                    onValueChange={([v]) => setVehicleDistribution({...vehicleDistribution, cars: v})}
                    max={100}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Bus className="w-4 h-4 text-green-600" />
                      <Label>Buses</Label>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{vehicleDistribution.buses}%</span>
                  </div>
                  <Slider 
                    value={[vehicleDistribution.buses]}
                    onValueChange={([v]) => setVehicleDistribution({...vehicleDistribution, buses: v})}
                    max={100}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-orange-600" />
                      <Label>Trucks</Label>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{vehicleDistribution.trucks}%</span>
                  </div>
                  <Slider 
                    value={[vehicleDistribution.trucks]}
                    onValueChange={([v]) => setVehicleDistribution({...vehicleDistribution, trucks: v})}
                    max={100}
                  />
                </div>

                {vehicleDistribution.cars + vehicleDistribution.buses + vehicleDistribution.trucks !== 100 && (
                  <div className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    <AlertCircle className="w-4 h-4" />
                    <span>Total must equal 100%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}