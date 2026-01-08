import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

export default function LiveMetricsStream({ isActive }) {
  const [metrics, setMetrics] = useState({
    waitTime: 42,
    throughput: 156,
    efficiency: 89,
    queueLength: 8
  });

  const [changes, setChanges] = useState({});

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setMetrics(prev => {
        const newMetrics = {
          waitTime: Math.max(20, Math.min(80, prev.waitTime + (Math.random() - 0.5) * 5)),
          throughput: Math.max(100, Math.min(200, prev.throughput + (Math.random() - 0.5) * 10)),
          efficiency: Math.max(70, Math.min(98, prev.efficiency + (Math.random() - 0.5) * 3)),
          queueLength: Math.max(0, Math.min(20, prev.queueLength + Math.floor((Math.random() - 0.5) * 3)))
        };

        // Track changes for animation
        setChanges({
          waitTime: newMetrics.waitTime > prev.waitTime ? 'up' : 'down',
          throughput: newMetrics.throughput > prev.throughput ? 'up' : 'down',
          efficiency: newMetrics.efficiency > prev.efficiency ? 'up' : 'down',
          queueLength: newMetrics.queueLength > prev.queueLength ? 'up' : 'down'
        });

        return newMetrics;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const metricConfigs = [
    { 
      key: 'waitTime', 
      label: 'Wait Time', 
      value: `${Math.round(metrics.waitTime)}s`,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      key: 'throughput', 
      label: 'Throughput', 
      value: `${Math.round(metrics.throughput)} veh/h`,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      key: 'efficiency', 
      label: 'Efficiency', 
      value: `${Math.round(metrics.efficiency)}%`,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      key: 'queueLength', 
      label: 'Queue Length', 
      value: Math.round(metrics.queueLength),
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span>Live Metrics Stream</span>
          {isActive && (
            <div className="ml-auto">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-600">Live</span>
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metricConfigs.map(config => (
            <div 
              key={config.key}
              className={`p-3 rounded-lg ${config.bg} border border-slate-200 transition-all ${
                isActive && changes[config.key] ? 'scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-700">{config.label}</span>
                {isActive && changes[config.key] && (
                  changes[config.key] === 'up' ? 
                    <TrendingUp className="w-3 h-3 text-green-600" /> :
                    <TrendingDown className="w-3 h-3 text-red-600" />
                )}
              </div>
              <div className={`text-lg font-bold ${config.color}`}>
                {config.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}