import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Eye, Key, Database, HelpCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [units, setUnits] = useState('metric');
  const [notifications, setNotifications] = useState({
    email: true,
    simulation: true,
    reports: false
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    console.log('Saving profile...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  defaultValue={user?.full_name || ''}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  placeholder="your@email.com"
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="Your company or institution"
              />
            </div>
            <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Display Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Theme</Label>
                <p className="text-sm text-slate-600">Choose your interface theme</p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Measurement Units</Label>
                <p className="text-sm text-slate-600">Speed and distance units</p>
              </div>
              <Select value={units} onValueChange={setUnits}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric</SelectItem>
                  <SelectItem value="imperial">Imperial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-600">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, email: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Simulation Alerts</Label>
                <p className="text-sm text-slate-600">Get notified when simulations complete</p>
              </div>
              <Switch
                checked={notifications.simulation}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, simulation: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Report Generation</Label>
                <p className="text-sm text-slate-600">Alerts for new reports</p>
              </div>
              <Switch
                checked={notifications.reports}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, reports: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>API Keys</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Access Key</Label>
              <div className="flex space-x-2">
                <Input
                  type="password"
                  value="••••••••••••••••••••••••"
                  disabled
                  className="flex-1"
                />
                <Button variant="outline">Regenerate</Button>
              </div>
              <p className="text-xs text-slate-500">Use this key to access traffic data APIs</p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Data Source Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                placeholder="https://api.trafficdata.com/v1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
              />
            </div>
            <Button variant="outline">Test Connection</Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Support & Help</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-700">Need help? Contact our support team:</p>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="justify-start">
                  📧 support@aitrafficcontrol.com
                </Button>
                <Button variant="outline" className="justify-start">
                  📚 View Documentation
                </Button>
                <Button variant="outline" className="justify-start">
                  💬 Community Forum
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="border-2 border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Delete Account</p>
                <p className="text-sm text-slate-600">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}