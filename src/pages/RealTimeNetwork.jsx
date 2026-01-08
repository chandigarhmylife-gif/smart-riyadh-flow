import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Play, Pause, MapPin, AlertTriangle, Activity, Zap } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const trafficLightIcon = L.divIcon({
  html: '<div style="background: #1E40AF; border-radius: 50%; width: 20px; height: 20px; border: 3px solid white;"></div>',
  className: 'custom-icon',
  iconSize: [20, 20],
});

export default function RealTimeNetwork() {
  const [isRunning, setIsRunning] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showTrafficFlow, setShowTrafficFlow] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);

  const [intersections] = useState([
    { id: 1, name: 'Main & 1st', position: [37.7749, -122.4194], status: 'green', efficiency: 92, flow: 'high' },
    { id: 2, name: 'Main & 2nd', position: [37.7759, -122.4204], status: 'red', efficiency: 87, flow: 'medium' },
    { id: 3, name: 'Main & 3rd', position: [37.7769, -122.4214], status: 'green', efficiency: 94, flow: 'high' },
    { id: 4, name: '1st & Oak', position: [37.7739, -122.4184], status: 'yellow', efficiency: 78, flow: 'low' },
    { id: 5, name: '2nd & Oak', position: [37.7749, -122.4194], status: 'green', efficiency: 89, flow: 'medium' },
    { id: 6, name: 'Main & 4th', position: [37.7779, -122.4224], status: 'red', efficiency: 85, flow: 'high' }
  ]);

  const [incidents] = useState([
    { id: 1, type: 'accident', position: [37.7754, -122.4199], severity: 'high', description: 'Multi-vehicle accident' },
    { id: 2, type: 'construction', position: [37.7764, -122.4209], severity: 'medium', description: 'Road work in progress' }
  ]);

  const [vehicles, setVehicles] = useState([
    { id: 1, position: [37.7745, -122.4190], type: 'car' },
    { id: 2, position: [37.7755, -122.4200], type: 'bus' },
    { id: 3, position: [37.7765, -122.4210], type: 'emergency' }
  ]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => ({
        ...v,
        position: [
          v.position[0] + (Math.random() - 0.5) * 0.0005,
          v.position[1] + (Math.random() - 0.5) * 0.0005
        ]
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const getStatusColor = (status) => {
    if (status === 'green') return '#10B981';
    if (status === 'red') return '#EF4444';
    return '#F59E0B';
  };

  const getFlowColor = (flow) => {
    if (flow === 'high') return '#10B981';
    if (flow === 'medium') return '#F59E0B';
    return '#EF4444';
  };

  const getIncidentColor = (severity) => {
    if (severity === 'high') return '#EF4444';
    if (severity === 'medium') return '#F59E0B';
    return '#3B82F6';
  };

  const networkHealth = Math.round(
    intersections.reduce((sum, i) => sum + i.efficiency, 0) / intersections.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Real-Time Network</h1>
            <p className="text-slate-600">Live traffic network monitoring and visualization</p>
          </div>
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Pause' : 'Resume'}
          </Button>
        </div>

        {/* Network Health Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Network Health</div>
                  <div className="text-3xl font-bold text-blue-600">{networkHealth}%</div>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-700 mb-1">Active Intersections</div>
                  <div className="text-3xl font-bold text-green-600">{intersections.length}</div>
                </div>
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-orange-700 mb-1">Active Incidents</div>
                  <div className="text-3xl font-bold text-orange-600">{incidents.length}</div>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-700 mb-1">Avg Throughput</div>
                  <div className="text-3xl font-bold text-purple-600">1,247</div>
                </div>
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map and Controls */}
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-slate-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[600px] relative">
                  <MapContainer
                    center={[37.7759, -122.4204]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    {/* Intersections */}
                    {intersections.map(intersection => (
                      <React.Fragment key={intersection.id}>
                        <Marker
                          position={intersection.position}
                          icon={trafficLightIcon}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold text-sm mb-2">{intersection.name}</h3>
                              <div className="space-y-1 text-xs">
                                <div>Status: <Badge style={{ backgroundColor: getStatusColor(intersection.status) }}>
                                  {intersection.status}
                                </Badge></div>
                                <div>Efficiency: {intersection.efficiency}%</div>
                                <div>Flow: {intersection.flow}</div>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                        <Circle
                          center={intersection.position}
                          radius={50}
                          pathOptions={{
                            color: getStatusColor(intersection.status),
                            fillColor: getStatusColor(intersection.status),
                            fillOpacity: 0.2
                          }}
                        />
                      </React.Fragment>
                    ))}

                    {/* Traffic Flow Lines */}
                    {showTrafficFlow && (
                      <>
                        <Polyline
                          positions={[[37.7749, -122.4194], [37.7759, -122.4204], [37.7769, -122.4214]]}
                          pathOptions={{ color: '#10B981', weight: 4, opacity: 0.6 }}
                        />
                        <Polyline
                          positions={[[37.7739, -122.4184], [37.7749, -122.4194], [37.7759, -122.4204]]}
                          pathOptions={{ color: '#F59E0B', weight: 4, opacity: 0.6 }}
                        />
                      </>
                    )}

                    {/* Incidents */}
                    {showIncidents && incidents.map(incident => (
                      <Circle
                        key={incident.id}
                        center={incident.position}
                        radius={100}
                        pathOptions={{
                          color: getIncidentColor(incident.severity),
                          fillColor: getIncidentColor(incident.severity),
                          fillOpacity: 0.3
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                              <h3 className="font-bold text-sm">{incident.type}</h3>
                            </div>
                            <p className="text-xs">{incident.description}</p>
                            <Badge variant="destructive" className="mt-2">
                              {incident.severity} severity
                            </Badge>
                          </div>
                        </Popup>
                      </Circle>
                    ))}

                    {/* Vehicles */}
                    {showVehicles && vehicles.map(vehicle => (
                      <Circle
                        key={vehicle.id}
                        center={vehicle.position}
                        radius={15}
                        pathOptions={{
                          color: vehicle.type === 'emergency' ? '#EF4444' : vehicle.type === 'bus' ? '#10B981' : '#3B82F6',
                          fillColor: vehicle.type === 'emergency' ? '#EF4444' : vehicle.type === 'bus' ? '#10B981' : '#3B82F6',
                          fillOpacity: 0.8
                        }}
                      />
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls & Info */}
          <div className="space-y-4">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Incidents</span>
                  <Switch checked={showIncidents} onCheckedChange={setShowIncidents} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Traffic Flow</span>
                  <Switch checked={showTrafficFlow} onCheckedChange={setShowTrafficFlow} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Vehicles</span>
                  <Switch checked={showVehicles} onCheckedChange={setShowVehicles} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Green Signal / High Flow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Red Signal / Low Flow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span>Yellow Signal / Medium Flow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span>Incident / Warning</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}