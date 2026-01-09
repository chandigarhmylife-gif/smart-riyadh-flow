import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, Plus, AlertCircle, AlertTriangle, CheckCircle,
  Mail, MessageSquare, X, Edit, Trash2
} from 'lucide-react';

export default function AlertManagement() {
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      name: 'High Traffic Congestion',
      type: 'warning',
      enabled: true,
      trigger: 'Avg wait time > 120 seconds',
      channels: ['email', 'sms'],
      recipients: 'operators@city.gov',
      message: 'High traffic congestion detected at intersection',
      cooldown: 30,
      lastTriggered: '2026-01-09 09:15 AM'
    },
    {
      id: 2,
      name: 'Device Offline',
      type: 'critical',
      enabled: true,
      trigger: 'Device status = offline for > 5 minutes',
      channels: ['email', 'sms', 'push'],
      recipients: 'admin@city.gov',
      message: 'Critical: Traffic control device is offline',
      cooldown: 15,
      lastTriggered: '2026-01-08 03:45 PM'
    },
    {
      id: 3,
      name: 'Low System Performance',
      type: 'info',
      enabled: true,
      trigger: 'Efficiency < 70%',
      channels: ['email'],
      recipients: 'engineers@city.gov',
      message: 'System performance below optimal threshold',
      cooldown: 60,
      lastTriggered: 'Never'
    },
    {
      id: 4,
      name: 'Emergency Vehicle Priority',
      type: 'info',
      enabled: false,
      trigger: 'Emergency vehicle detected',
      channels: ['push'],
      recipients: 'operators@city.gov',
      message: 'Emergency vehicle priority activated',
      cooldown: 5,
      lastTriggered: '2026-01-09 08:20 AM'
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    name: '',
    type: 'info',
    trigger: '',
    channels: [],
    recipients: '',
    message: '',
    cooldown: 30
  });

  const handleAddAlert = () => {
    const alert = {
      id: Date.now(),
      ...newAlert,
      enabled: true,
      lastTriggered: 'Never'
    };
    setAlerts([...alerts, alert]);
    setNewAlert({
      name: '',
      type: 'info',
      trigger: '',
      channels: [],
      recipients: '',
      message: '',
      cooldown: 30
    });
    setShowAddAlert(false);
  };

  const handleToggle = (id) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const handleDelete = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const toggleChannel = (channel) => {
    const channels = newAlert.channels.includes(channel)
      ? newAlert.channels.filter(c => c !== channel)
      : [...newAlert.channels, channel];
    setNewAlert({ ...newAlert, channels });
  };

  const getTypeColor = (type) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type) => {
    if (type === 'critical') return <AlertCircle className="w-4 h-4" />;
    if (type === 'warning') return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Alert Management</h1>
            <p className="text-slate-600">Configure and manage system alerts and notifications</p>
          </div>
          <Button onClick={() => setShowAddAlert(!showAddAlert)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-sm text-blue-700 mb-1">Total Alerts</div>
              <div className="text-3xl font-bold text-blue-600">{alerts.length}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-sm text-green-700 mb-1">Active</div>
              <div className="text-3xl font-bold text-green-600">
                {alerts.filter(a => a.enabled).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-sm text-red-700 mb-1">Critical Alerts</div>
              <div className="text-3xl font-bold text-red-600">
                {alerts.filter(a => a.type === 'critical').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="text-sm text-purple-700 mb-1">Triggered Today</div>
              <div className="text-3xl font-bold text-purple-600">12</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Alert Form */}
        {showAddAlert && (
          <Card className="border-2 border-blue-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Create New Alert</span>
                <Button variant="ghost" size="sm" onClick={() => setShowAddAlert(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Alert Name</Label>
                  <Input 
                    placeholder="e.g., High Traffic Volume"
                    value={newAlert.name}
                    onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Alert Type</Label>
                  <Select value={newAlert.type} onValueChange={(v) => setNewAlert({...newAlert, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Trigger Condition</Label>
                <Input 
                  placeholder="e.g., Queue length > 20 vehicles"
                  value={newAlert.trigger}
                  onChange={(e) => setNewAlert({...newAlert, trigger: e.target.value})}
                />
              </div>
              <div>
                <Label>Alert Message</Label>
                <Textarea 
                  placeholder="Message to send when alert is triggered..."
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                />
              </div>
              <div>
                <Label>Recipients</Label>
                <Input 
                  placeholder="email@example.com"
                  value={newAlert.recipients}
                  onChange={(e) => setNewAlert({...newAlert, recipients: e.target.value})}
                />
              </div>
              <div>
                <Label>Notification Channels</Label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={newAlert.channels.includes('email')}
                      onCheckedChange={() => toggleChannel('email')}
                    />
                    <Mail className="w-4 h-4 text-slate-600" />
                    <span className="text-sm">Email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={newAlert.channels.includes('sms')}
                      onCheckedChange={() => toggleChannel('sms')}
                    />
                    <MessageSquare className="w-4 h-4 text-slate-600" />
                    <span className="text-sm">SMS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={newAlert.channels.includes('push')}
                      onCheckedChange={() => toggleChannel('push')}
                    />
                    <Bell className="w-4 h-4 text-slate-600" />
                    <span className="text-sm">Push</span>
                  </div>
                </div>
              </div>
              <div>
                <Label>Cooldown Period (minutes)</Label>
                <Input 
                  type="number"
                  value={newAlert.cooldown}
                  onChange={(e) => setNewAlert({...newAlert, cooldown: parseInt(e.target.value)})}
                />
              </div>
              <Button 
                onClick={handleAddAlert}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!newAlert.name || !newAlert.trigger || !newAlert.message}
              >
                Create Alert
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map(alert => (
            <Card key={alert.id} className="border-2 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg border ${getTypeColor(alert.type)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{alert.name}</h3>
                        <Badge className={getTypeColor(alert.type)}>
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{alert.message}</p>
                      <div className="text-xs text-slate-500">
                        <strong>Trigger:</strong> {alert.trigger}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={alert.enabled} onCheckedChange={() => handleToggle(alert.id)} />
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(alert.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t text-sm">
                  <div>
                    <div className="text-slate-600 mb-1">Channels</div>
                    <div className="flex space-x-2">
                      {alert.channels.map(channel => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Recipients</div>
                    <div className="font-semibold text-slate-900">{alert.recipients}</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Last Triggered</div>
                    <div className="font-semibold text-slate-900">{alert.lastTriggered}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}