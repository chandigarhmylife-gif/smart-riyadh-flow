import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Clock, Plus, X, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function IncidentManagement() {
  const [showForm, setShowForm] = useState(false);
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      type: 'accident',
      severity: 'high',
      location: 'King Fahd Rd & Tahlia St',
      position: [24.7112, 46.6741],
      description: 'Multi-vehicle collision blocking 2 lanes',
      status: 'active',
      reportedAt: '10:45 AM',
      impact: 'High traffic delay, +15 min avg wait time',
      responders: 'Police, Ambulance dispatched'
    },
    {
      id: 2,
      type: 'construction',
      severity: 'medium',
      location: 'Olaya St & Tahlia St',
      position: [24.7128, 46.6788],
      description: 'Road resurfacing, single lane closure',
      status: 'active',
      reportedAt: '08:30 AM',
      impact: 'Moderate delay, +8 min avg wait time',
      responders: 'Traffic control team on site'
    },
    {
      id: 3,
      type: 'weather',
      severity: 'low',
      location: 'Highway 101 North',
      position: [24.7185, 46.6760],
      description: 'Heavy rain reducing visibility',
      status: 'monitoring',
      reportedAt: '09:15 AM',
      impact: 'Minor slowdown, reduced speeds',
      responders: 'Traffic monitoring active'
    }
  ]);

  const [newIncident, setNewIncident] = useState({
    type: '',
    severity: '',
    location: '',
    description: ''
  });

  const handleAddIncident = () => {
    const incident = {
      id: Date.now(),
      ...newIncident,
      status: 'active',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      position: [24.7112 + Math.random() * 0.005, 46.6741 + Math.random() * 0.005],
      impact: 'Calculating impact...',
      responders: 'Pending dispatch'
    };
    setIncidents([incident, ...incidents]);
    setNewIncident({ type: '', severity: '', location: '', description: '' });
    setShowForm(false);
  };

  const handleResolve = (id) => {
    setIncidents(incidents.map(inc => 
      inc.id === id ? { ...inc, status: 'resolved' } : inc
    ));
  };

  const getSeverityColor = (severity) => {
    if (severity === 'high') return 'bg-red-100 text-red-800 border-red-200';
    if (severity === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getStatusColor = (status) => {
    if (status === 'active') return 'destructive';
    if (status === 'monitoring') return 'secondary';
    return 'outline';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Incident Management</h1>
            <p className="text-slate-600">Track and respond to traffic incidents in real-time</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Report Incident
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-sm text-red-700 mb-1">Active Incidents</div>
              <div className="text-3xl font-bold text-red-600">
                {incidents.filter(i => i.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="text-sm text-yellow-700 mb-1">High Severity</div>
              <div className="text-3xl font-bold text-yellow-600">
                {incidents.filter(i => i.severity === 'high').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-sm text-blue-700 mb-1">Under Monitoring</div>
              <div className="text-3xl font-bold text-blue-600">
                {incidents.filter(i => i.status === 'monitoring').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-sm text-green-700 mb-1">Avg Response Time</div>
              <div className="text-3xl font-bold text-green-600">8 min</div>
            </CardContent>
          </Card>
        </div>

        {/* New Incident Form */}
        {showForm && (
          <Card className="border-2 border-red-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Report New Incident</span>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Incident Type</Label>
                  <Select value={newIncident.type} onValueChange={(v) => setNewIncident({...newIncident, type: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accident">Accident</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="weather">Weather</SelectItem>
                      <SelectItem value="breakdown">Vehicle Breakdown</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Severity</Label>
                  <Select value={newIncident.severity} onValueChange={(v) => setNewIncident({...newIncident, severity: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input 
                  placeholder="e.g., King Fahd Rd & Tahlia St"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Describe the incident..."
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                />
              </div>
              <Button 
                onClick={handleAddIncident} 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!newIncident.type || !newIncident.severity || !newIncident.location}
              >
                Submit Incident Report
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Map & Incidents */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle>Incident Locations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px]">
                <MapContainer center={[24.7128, 46.6788]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {incidents.filter(i => i.status !== 'resolved').map(incident => (
                    <Marker key={incident.id} position={incident.position}>
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-sm mb-1">{incident.location}</h3>
                          <p className="text-xs mb-2">{incident.description}</p>
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Incident List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Active Incidents</h3>
            {incidents.map(incident => (
              <Card key={incident.id} className={`border-2 ${
                incident.status === 'resolved' ? 'opacity-50 border-slate-200' : 'border-slate-200'
              }`}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        incident.severity === 'high' ? 'text-red-600' : 
                        incident.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <div>
                        <h4 className="font-semibold text-slate-900">{incident.location}</h4>
                        <p className="text-sm text-slate-600 mt-1">{incident.description}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      <span>{incident.reportedAt}</span>
                    </div>
                    <Badge className={`${getSeverityColor(incident.severity)} w-fit`}>
                      {incident.severity} severity
                    </Badge>
                  </div>

                  <div className="p-2 bg-slate-50 rounded text-xs space-y-1">
                    <div><strong>Impact:</strong> {incident.impact}</div>
                    <div><strong>Response:</strong> {incident.responders}</div>
                  </div>

                  {incident.status !== 'resolved' && (
                    <Button 
                      onClick={() => handleResolve(incident.id)}
                      variant="outline" 
                      size="sm"
                      className="w-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}