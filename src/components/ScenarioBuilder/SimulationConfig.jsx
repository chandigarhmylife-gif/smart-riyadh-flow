import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Cloud, Clock } from 'lucide-react';

export default function SimulationConfig({ config, onConfigChange }) {
  const update = (key, value) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-sm">
          <Settings className="w-4 h-4" />
          <span>Simulation Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Duration */}
        <div>
          <Label className="text-xs">Duration (minutes)</Label>
          <div className="flex items-center gap-3 mt-1">
            <Slider
              value={[config.duration]}
              onValueChange={([v]) => update('duration', v)}
              min={5}
              max={180}
              step={5}
              className="flex-1"
            />
            <span className="text-sm font-bold text-slate-700 w-12 text-right">{config.duration}m</span>
          </div>
        </div>

        {/* Weather Condition */}
        <div>
          <Label className="text-xs flex items-center gap-1">
            <Cloud className="w-3 h-3" /> Weather
          </Label>
          <Select value={config.weatherCondition} onValueChange={(v) => update('weatherCondition', v)}>
            <SelectTrigger className="mt-1 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clear">☀️ Clear</SelectItem>
              <SelectItem value="rain">🌧️ Rain</SelectItem>
              <SelectItem value="fog">🌫️ Fog</SelectItem>
              <SelectItem value="snow">❄️ Snow</SelectItem>
              <SelectItem value="storm">⛈️ Storm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time of Day */}
        <div>
          <Label className="text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" /> Time of Day
          </Label>
          <Select value={config.timeOfDay} onValueChange={(v) => update('timeOfDay', v)}>
            <SelectTrigger className="mt-1 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">🌅 Morning (6-9 AM)</SelectItem>
              <SelectItem value="rush-hour">🚗 Rush Hour (7-9 AM)</SelectItem>
              <SelectItem value="midday">☀️ Midday (11-2 PM)</SelectItem>
              <SelectItem value="evening">🌆 Evening (4-7 PM)</SelectItem>
              <SelectItem value="night">🌙 Night (9 PM-6 AM)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Transit Priority</Label>
            <Switch 
              checked={config.transitPriority}
              onCheckedChange={(v) => update('transitPriority', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Emergency Vehicles</Label>
            <Switch 
              checked={config.emergencyVehicles}
              onCheckedChange={(v) => update('emergencyVehicles', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Include Incidents</Label>
            <Switch 
              checked={config.incidents}
              onCheckedChange={(v) => update('incidents', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">AI Optimization</Label>
            <Switch 
              checked={config.aiOptimization ?? true}
              onCheckedChange={(v) => update('aiOptimization', v)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}