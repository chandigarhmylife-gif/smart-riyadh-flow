import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Cloud, Check, X, Loader2, Activity, Database, 
  MapPin, CloudRain, Zap, AlertCircle 
} from 'lucide-react';

export default function APIConnections() {
  const [connections, setConnections] = useState([
    {
      id: 1,
      name: 'Google Traffic API',
      icon: MapPin,
      status: 'connected',
      enabled: true,
      apiKey: 'AIza••••••••••••••••••••••••8J2k',
      endpoint: 'https://maps.googleapis.com/maps/api/traffic',
      lastSync: '2 minutes ago',
      requestsToday: 1247,
      rateLimit: 10000,
      description: 'Real-time traffic data and congestion information'
    },
    {
      id: 2,
      name: 'Weather API',
      icon: CloudRain,
      status: 'connected',
      enabled: true,
      apiKey: 'wea••••••••••••••••••••••••abc',
      endpoint: 'https://api.openweathermap.org/data/2.5',
      lastSync: '5 minutes ago',
      requestsToday: 342,
      rateLimit: 5000,
      description: 'Weather conditions affecting traffic patterns'
    },
    {
      id: 3,
      name: 'City Traffic Database',
      icon: Database,
      status: 'connected',
      enabled: true,
      apiKey: 'ctd••••••••••••••••••••••••xyz',
      endpoint: 'https://city-traffic.example.com/api/v2',
      lastSync: '1 minute ago',
      requestsToday: 892,
      rateLimit: 15000,
      description: 'Historical traffic data and analytics'
    },
    {
      id: 4,
      name: 'Emergency Services API',
      icon: AlertCircle,
      status: 'disconnected',
      enabled: false,
      apiKey: '',
      endpoint: 'https://emergency.example.com/api',
      lastSync: 'Never',
      requestsToday: 0,
      rateLimit: 2000,
      description: 'Emergency vehicle routing and priority'
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [testingId, setTestingId] = useState(null);

  const handleToggle = (id) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, enabled: !conn.enabled } : conn
    ));
  };

  const handleTest = async (id) => {
    setTestingId(id);
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, status: 'connected' } : conn
    ));
    setTestingId(null);
  };

  const handleSave = (id) => {
    setEditingId(null);
  };

  const getStatusIcon = (status) => {
    if (status === 'connected') return <Check className="w-4 h-4 text-green-600" />;
    if (status === 'disconnected') return <X className="w-4 h-4 text-red-600" />;
    return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
  };

  const getStatusColor = (status) => {
    if (status === 'connected') return 'bg-green-100 text-green-800';
    if (status === 'disconnected') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">API Connections</h1>
          <p className="text-slate-600">Manage external data sources and integrations</p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-sm text-green-700 mb-1">Connected APIs</div>
              <div className="text-3xl font-bold text-green-600">
                {connections.filter(c => c.status === 'connected').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-sm text-blue-700 mb-1">Total Requests Today</div>
              <div className="text-3xl font-bold text-blue-600">
                {connections.reduce((sum, c) => sum + c.requestsToday, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="text-sm text-purple-700 mb-1">Active Endpoints</div>
              <div className="text-3xl font-bold text-purple-600">
                {connections.filter(c => c.enabled).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-sm text-orange-700 mb-1">Avg Response Time</div>
              <div className="text-3xl font-bold text-orange-600">142ms</div>
            </CardContent>
          </Card>
        </div>

        {/* API Connections List */}
        <div className="space-y-4">
          {connections.map(connection => {
            const Icon = connection.icon;
            const isEditing = editingId === connection.id;
            const isTesting = testingId === connection.id;

            return (
              <Card key={connection.id} className="border-2 border-slate-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${
                        connection.status === 'connected' ? 'bg-green-100' : 'bg-slate-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          connection.status === 'connected' ? 'text-green-600' : 'text-slate-600'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{connection.name}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{connection.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(connection.status)}>
                        {getStatusIcon(connection.status)}
                        <span className="ml-1">{connection.status}</span>
                      </Badge>
                      <Switch
                        checked={connection.enabled}
                        onCheckedChange={() => handleToggle(connection.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Configuration Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-slate-700">API Endpoint</Label>
                      <Input
                        value={connection.endpoint}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-slate-700">API Key</Label>
                      <Input
                        value={connection.apiKey}
                        type="password"
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Usage Statistics */}
                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Last Sync</div>
                      <div className="text-sm font-semibold text-slate-900 flex items-center space-x-1">
                        <Activity className="w-3 h-3" />
                        <span>{connection.lastSync}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Requests Today</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {connection.requestsToday.toLocaleString()} / {connection.rateLimit.toLocaleString()}
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${(connection.requestsToday / connection.rateLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Rate Limit</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {connection.rateLimit.toLocaleString()} / day
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex space-x-2">
                      {!isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingId(connection.id)}
                          >
                            Configure
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTest(connection.id)}
                            disabled={isTesting}
                          >
                            {isTesting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Test Connection
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSave(connection.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                    {connection.status === 'connected' && (
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        <Check className="w-3 h-3 mr-1" />
                        Operational
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add New Connection */}
        <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-all">
          <CardContent className="py-12 text-center">
            <Cloud className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Add New API Connection</h3>
            <p className="text-sm text-slate-600 mb-4">
              Connect additional data sources to enhance your traffic control system
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}