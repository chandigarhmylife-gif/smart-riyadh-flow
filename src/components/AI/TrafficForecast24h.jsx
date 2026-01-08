import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, AlertTriangle, TrendingUp, Loader2, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TrafficForecast24h({ currentMetrics, historicalData }) {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);

  const generateForecast = async () => {
    setLoading(true);
    try {
      const prompt = `Analyze current and historical traffic data to predict the next 24 hours:

Current Conditions:
- Wait Time: ${currentMetrics.avgWaitTime}s
- Throughput: ${currentMetrics.throughput} veh/h
- Efficiency: ${currentMetrics.efficiency}%
- Queue Length: ${currentMetrics.queueLength}

Generate a comprehensive 24-hour forecast including:
1. Hourly predictions (congestion level 0-100, avg travel time in minutes, expected throughput)
2. Peak congestion periods with specific times
3. Potential bottleneck locations with severity (high/medium/low)
4. Recommended actions for each critical period

Format as JSON with:
- hourlyData: array of {hour (0-23), congestion (0-100), travelTime (mins), throughput (veh/h)}
- peakPeriods: array of {time (e.g. "08:00-09:00"), congestion, impact ("high"/"medium"/"low")}
- bottlenecks: array of {location, severity, description, recommendation}
- summary: overall forecast summary text`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            hourlyData: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  hour: { type: 'number' },
                  congestion: { type: 'number' },
                  travelTime: { type: 'number' },
                  throughput: { type: 'number' }
                }
              }
            },
            peakPeriods: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  time: { type: 'string' },
                  congestion: { type: 'number' },
                  impact: { type: 'string' }
                }
              }
            },
            bottlenecks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  location: { type: 'string' },
                  severity: { type: 'string' },
                  description: { type: 'string' },
                  recommendation: { type: 'string' }
                }
              }
            },
            summary: { type: 'string' }
          }
        }
      });

      setForecast(result);
    } catch (error) {
      console.error('Forecast generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity?.toLowerCase() === 'high') return 'bg-red-100 text-red-800 border-red-200';
    if (severity?.toLowerCase() === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getImpactBadge = (impact) => {
    const colors = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    };
    return colors[impact?.toLowerCase()] || 'secondary';
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>24-Hour Traffic Forecast</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!forecast ? (
          <Button 
            onClick={generateForecast}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Traffic Patterns...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate 24-Hour Forecast
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-slate-700 leading-relaxed">{forecast.summary}</p>
            </div>

            {/* Hourly Congestion Chart */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Hourly Congestion Forecast</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={forecast.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(hour) => `${hour}:00`}
                    formatter={(value, name) => {
                      if (name === 'congestion') return [`${value}%`, 'Congestion'];
                      return [value, name];
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="congestion" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Congestion %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Travel Time Predictions */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Predicted Travel Times</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={forecast.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(hour) => `${hour}:00`}
                    formatter={(value) => [`${value} min`, 'Travel Time']}
                  />
                  <Bar dataKey="travelTime" fill="#3B82F6" name="Travel Time (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Peak Congestion Periods */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Peak Congestion Periods</h4>
              <div className="space-y-2">
                {forecast.peakPeriods?.map((period, index) => (
                  <div 
                    key={index}
                    className="p-3 border-2 border-slate-200 rounded-lg hover:border-orange-400 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="font-semibold text-slate-900">{period.time}</span>
                      </div>
                      <Badge variant={getImpactBadge(period.impact)}>
                        {period.impact?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600">
                      Expected Congestion: <span className="font-medium text-red-600">{period.congestion}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottleneck Locations */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Potential Bottlenecks</span>
              </h4>
              <div className="space-y-3">
                {forecast.bottlenecks?.map((bottleneck, index) => (
                  <div 
                    key={index}
                    className="p-4 border-2 border-slate-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <h5 className="font-semibold text-slate-900">{bottleneck.location}</h5>
                      </div>
                      <Badge className={`border ${getSeverityColor(bottleneck.severity)}`}>
                        {bottleneck.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{bottleneck.description}</p>
                    <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                      <strong>Recommendation:</strong> {bottleneck.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Refresh Button */}
            <Button 
              onClick={generateForecast}
              variant="outline"
              disabled={loading}
              className="w-full"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh Forecast
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}