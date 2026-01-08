import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets } from 'lucide-react';

export default function WeatherImpact({ onWeatherChange }) {
  const [weather, setWeather] = useState({
    condition: 'clear',
    temperature: 72,
    visibility: 10,
    precipitation: 0
  });

  const weatherConditions = [
    { 
      value: 'clear', 
      label: 'Clear', 
      icon: Sun, 
      impact: 0,
      color: 'text-yellow-600'
    },
    { 
      value: 'cloudy', 
      label: 'Cloudy', 
      icon: Cloud, 
      impact: 5,
      color: 'text-slate-600'
    },
    { 
      value: 'rain', 
      label: 'Rain', 
      icon: CloudRain, 
      impact: 20,
      color: 'text-blue-600'
    },
    { 
      value: 'heavy-rain', 
      label: 'Heavy Rain', 
      icon: Droplets, 
      impact: 40,
      color: 'text-blue-700'
    },
    { 
      value: 'snow', 
      label: 'Snow', 
      icon: CloudSnow, 
      impact: 50,
      color: 'text-cyan-600'
    },
    { 
      value: 'fog', 
      label: 'Fog', 
      icon: Wind, 
      impact: 30,
      color: 'text-slate-500'
    }
  ];

  const currentCondition = weatherConditions.find(w => w.value === weather.condition);
  const Icon = currentCondition?.icon || Sun;

  const handleWeatherChange = (condition) => {
    const newWeather = { ...weather, condition };
    setWeather(newWeather);
    if (onWeatherChange) onWeatherChange(newWeather);
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${currentCondition?.color}`} />
          <span>Weather Impact Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Weather Condition</label>
          <Select value={weather.condition} onValueChange={handleWeatherChange}>
            <SelectTrigger className="border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {weatherConditions.map(condition => {
                const ConditionIcon = condition.icon;
                return (
                  <SelectItem key={condition.value} value={condition.value}>
                    <div className="flex items-center space-x-2">
                      <ConditionIcon className={`w-4 h-4 ${condition.color}`} />
                      <span>{condition.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Impact Analysis */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Traffic Impact</span>
            <Badge variant={currentCondition?.impact > 30 ? 'destructive' : 'secondary'}>
              +{currentCondition?.impact}% delay
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Speed Reduction</span>
              <span className="font-medium">{currentCondition?.impact * 0.5}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Visibility Impact</span>
              <span className="font-medium">
                {currentCondition?.impact > 30 ? 'High' : currentCondition?.impact > 15 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Recommended Signal Adjustment</span>
              <span className="font-medium">+{Math.round(currentCondition?.impact * 0.3)}s</span>
            </div>
          </div>
        </div>

        {/* Weather Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-blue-800 mb-1">Temperature</div>
            <div className="text-lg font-bold text-blue-600">{weather.temperature}°F</div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs text-green-800 mb-1">Visibility</div>
            <div className="text-lg font-bold text-green-600">{weather.visibility} mi</div>
          </div>
        </div>

        {currentCondition?.impact > 20 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-medium text-yellow-800">
              ⚠️ Weather conditions may significantly impact traffic flow. AI signal timing has been adjusted automatically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}