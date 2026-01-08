import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, TrendingUp, Activity } from 'lucide-react';

export default function MetricsSidebar({ metrics = {}, isRunning }) {
  const defaultMetrics = {
    avgWaitTime: 42,
    throughput: 156,
    queueLength: 8,
    efficiency: 89
  };

  const displayMetrics = Object.keys(metrics).length > 0 ? metrics : defaultMetrics;

  const metricCards = [
    {
      label: 'Avg Wait Time',
      value: `${displayMetrics.avgWaitTime}s`,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Throughput',
      value: `${displayMetrics.throughput} veh/h`,
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Queue Length',
      value: displayMetrics.queueLength,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      label: 'Efficiency',
      value: `${displayMetrics.efficiency}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <Card className="border-2 border-slate-200 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span>Live Metrics</span>
          {isRunning && (
            <div className="ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metricCards.map((metric, index) => (
          <div 
            key={index}
            className={`p-4 rounded-xl ${metric.bg} border border-slate-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">{metric.label}</span>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
          </div>
        ))}

        {/* Performance Indicator */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Performance</span>
            <span className={`text-sm font-bold ${
              displayMetrics.efficiency >= 85 ? 'text-green-600' : 
              displayMetrics.efficiency >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {displayMetrics.efficiency >= 85 ? 'Excellent' : 
               displayMetrics.efficiency >= 70 ? 'Good' : 'Poor'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                displayMetrics.efficiency >= 85 ? 'bg-green-500' : 
                displayMetrics.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${displayMetrics.efficiency}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}