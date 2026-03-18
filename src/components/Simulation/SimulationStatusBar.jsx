import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Car, Leaf, Gauge } from 'lucide-react';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function SimulationStatusBar({ 
  isRunning, 
  elapsedSeconds, 
  duration, 
  metrics, 
  emergencyActive,
  currentPhaseLabel,
  scenarioName 
}) {
  const progress = duration > 0 ? (elapsedSeconds / (duration * 60)) * 100 : 0;

  return (
    <Card className="border-2 border-slate-200">
      <CardContent className="py-3 px-4">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status */}
            <Badge className={isRunning ? 'bg-green-600' : elapsedSeconds > 0 ? 'bg-yellow-600' : 'bg-slate-500'}>
              {isRunning ? '● RUNNING' : elapsedSeconds > 0 ? '● PAUSED' : '● IDLE'}
            </Badge>

            {emergencyActive && (
              <Badge className="bg-red-600 animate-pulse">🚨 EMERGENCY OVERRIDE</Badge>
            )}

            {scenarioName && (
              <span className="text-sm text-slate-600 font-medium">{scenarioName}</span>
            )}

            <span className="text-xs text-slate-500">{currentPhaseLabel}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono font-bold">{formatTime(elapsedSeconds)}</span>
              <span className="text-slate-400">/ {duration}m</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <Gauge className="w-3.5 h-3.5" />
              <span className="font-bold">{Math.round(metrics.efficiency)}%</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <Car className="w-3.5 h-3.5" />
              <span className="font-bold">{metrics.totalVehicles}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <Leaf className="w-3.5 h-3.5" />
              <span className="font-bold">{metrics.co2Saved.toFixed(1)}kg</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all ${isRunning ? 'bg-blue-600' : 'bg-slate-400'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}