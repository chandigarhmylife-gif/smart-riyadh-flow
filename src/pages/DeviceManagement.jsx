import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Camera, Radio, Zap, AlertCircle, Settings, 
  Activity, CheckCircle, X, RefreshCw 
} from 'lucide-react';

export default function DeviceManagement() {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Traffic Signal Controller - Main & 1st',
      type: 'signal',
      status: 'online',
      health: 98,
      location: 'Main St & 1st Ave',
      lastUpdate: '1 min ago',
      firmware: 'v2.4.1',
      uptime: '45 days',
      enabled: true,
      metrics: { cyclesCompleted: 12847, avgResponseTime: '120ms' }
    },
    {
      id: 2,
      name: 'Vehicle Detection Sensor - Main & 2nd',
      type: 'sensor',
      status: 'online',
      health: 95,
      location: 'Main St & 2nd Ave',
      lastUpdate: '2 min ago',
      firmware: 'v1.8.3',
      uptime: '30 days',
      enabled: true,
      metrics: { vehiclesDetected: 45632, accuracy: '97%' }
    },
    {
      id: 3,
      name: 'Traffic Camera - 2nd & Oak',
      type: 'camera',
      status: 'warning',
      health: 72,
      location: '2nd St & Oak Ave',
      lastUpdate: '15 min ago',
      firmware: 'v3.1.0',
      uptime: '12 days',
      enabled: true,
      metrics: { framesProcessed: 2456789, quality: '1080p' }
    },
    {
      id: 4,
      name: 'Traffic Signal Controller - 3rd & Pine',
      type: 'signal',
      status: 'offline',
      health: 0,
      location: '3rd St & Pine Ave',
      lastUpdate: '2 hours ago',
      firmware: 'v2.4.1',
      uptime: '0 days',
      enabled: false,
      metrics: { cyclesCompleted: 8934, avgResponseTime: 'N/A' }
    },
    {
      id: 5,
      name: 'Emergency Vehicle Detector - Highway 101',
      type: 'sensor',
      status: 'online',
      health: 100,
      location: 'Highway 101 North',
      lastUpdate: '30 sec ago',
      firmware: 'v2.0.5',
      uptime: '90 days',
      enabled: true,
      metrics: { emergencyDetections: 234, falsePositives: '0.2%' }
    },
    {
      id: 6,
      name: 'Traffic Camera - Downtown Plaza',
      type: 'camera',
      status: 'online',
      health: 88,
      location: 'Downtown Plaza',
      lastUpdate: '3 min ago',
      firmware: 'v3.1.2',
      uptime: '60 days',
      enabled: true,
      metrics: { framesProcessed: 8923456, quality: '4K' }
    }
  ]);

  const getDeviceIcon = (type) => {
    if (type === 'signal') return Zap;
    if (type === 'camera') return Camera;
    return Radio;
  };

  const getStatusColor = (status) => {
    if (status === 'online') return 'bg-green-100 text-green-800';
    if (status === 'warning') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'online') return <CheckCircle className="w-4 h-4" />;
    if (status === 'warning') return <AlertCircle className="w-4 h-4" />;
    return <X className="w-4 h-4" />;
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    if (health > 0) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleToggle = (id) => {
    setDevices(devices.map(d => 
      d.id === id ? { ...d, enabled: !d.enabled } : d
    ));
  };

  const handleRestart = (id) => {
    setDevices(devices.map(d => 
      d.id === id ? { ...d, status: 'online', health: 100, lastUpdate: 'Just now' } : d
    ));
  };

  const onlineCount = devices.filter(d => d.status === 'online').length;
  const warningCount = devices.filter(d => d.status === 'warning').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;
  const avgHealth = Math.round(devices.reduce((sum, d) => sum + d.health, 0) / devices.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Device Management</h1>
          <p className="text-slate-600">Monitor and control traffic infrastructure devices</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-sm text-green-700 mb-1">Online Devices</div>
              <div className="text-3xl font-bold text-green-600">{onlineCount}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="text-sm text-yellow-700 mb-1">Warnings</div>
              <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-sm text-red-700 mb-1">Offline</div>
              <div className="text-3xl font-bold text-red-600">{offlineCount}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-sm text-blue-700 mb-1">Avg Health</div>
              <div className="text-3xl font-bold text-blue-600">{avgHealth}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Device Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {devices.map(device => {
            const Icon = getDeviceIcon(device.type);
            return (
              <Card key={device.id} className="border-2 border-slate-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-3 rounded-lg ${
                        device.status === 'online' ? 'bg-green-100' : 
                        device.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          device.status === 'online' ? 'text-green-600' : 
                          device.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{device.location}</p>
                      </div>
                    </div>
                    <Switch checked={device.enabled} onCheckedChange={() => handleToggle(device.id)} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Row */}
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(device.status)}>
                      {getStatusIcon(device.status)}
                      <span className="ml-1">{device.status}</span>
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">{device.lastUpdate}</span>
                    </div>
                  </div>

                  {/* Health Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Device Health</span>
                      <span className={`text-sm font-bold ${getHealthColor(device.health)}`}>
                        {device.health}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          device.health >= 90 ? 'bg-green-600' :
                          device.health >= 70 ? 'bg-yellow-600' :
                          device.health > 0 ? 'bg-orange-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${device.health}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Device Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-slate-600 mb-1">Firmware</div>
                      <div className="font-semibold text-slate-900">{device.firmware}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 mb-1">Uptime</div>
                      <div className="font-semibold text-slate-900">{device.uptime}</div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-semibold text-slate-700 mb-2">Performance Metrics</h4>
                    <div className="space-y-1 text-xs text-slate-600">
                      {Object.entries(device.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleRestart(device.id)}
                      disabled={device.status === 'online'}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}