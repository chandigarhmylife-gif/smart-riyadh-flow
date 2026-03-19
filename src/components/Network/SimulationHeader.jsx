import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Network, Play, Pause, RotateCcw, FastForward, Clock } from 'lucide-react';

export default function SimulationHeader({ isRunning, speed, elapsedTime, emergencyCount, onPlay, onPause, onReset, onSpeedChange }) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Network className="w-8 h-8 text-blue-600" />
          Multi-Intersection Network
        </h1>
        <p className="text-slate-600">Coordinated traffic signal management across multiple intersections</p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-mono text-slate-700">
          <Clock className="w-4 h-4" />
          {formatTime(elapsedTime)}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
          <FastForward className="w-4 h-4 text-slate-500" />
          <Slider value={[speed]} onValueChange={([v]) => onSpeedChange(v)}
            min={0.5} max={4} step={0.5} className="w-20" />
          <span className="text-xs font-medium text-slate-700 w-6">{speed}x</span>
        </div>

        {emergencyCount > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            🚨 {emergencyCount} Emergency
          </Badge>
        )}

        {!isRunning ? (
          <Button onClick={onPlay} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-1" /> Start
          </Button>
        ) : (
          <Button onClick={onPause} variant="outline">
            <Pause className="w-4 h-4 mr-1" /> Pause
          </Button>
        )}
        <Button onClick={onReset} variant="outline" size="icon">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}