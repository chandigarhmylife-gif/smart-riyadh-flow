import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PredictiveAnalytics({ currentMetrics }) {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState(null);

  const generateForecast = async () => {
    setLoading(true);
    try {
      const prompt = `Based on current traffic metrics, forecast the next 6 hours:
Current: Wait Time ${currentMetrics.avgWaitTime}s, Efficiency ${currentMetrics.efficiency}%

Generate realistic hour-by-hour predictions considering typical traffic patterns.
Format as JSON array with: hour (like "14:00"), waitTime, efficiency`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            forecast: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  hour: { type: 'string' },
                  waitTime: { type: 'number' },
                  efficiency: { type: 'number' }
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

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Predictive Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!forecast ? (
          <Button 
            onClick={generateForecast}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Forecast...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate 6-Hour Forecast
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {forecast.summary && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-slate-700">{forecast.summary}</p>
              </div>
            )}
            
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={forecast.forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Efficiency %"
                />
              </LineChart>
            </ResponsiveContainer>

            <Button 
              onClick={generateForecast}
              variant="outline"
              disabled={loading}
              className="w-full"
            >
              Refresh Forecast
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}