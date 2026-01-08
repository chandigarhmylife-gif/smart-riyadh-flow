import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

export default function ControlPanel({ 
  isRunning, 
  onPlay, 
  onPause, 
  onReset, 
  speed = 1, 
  onSpeedChange 
}) {
  const speedLabels = {
    0.5: '0.5x',
    1: '1x',
    2: '2x',
    4: '4x'
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            {!isRunning ? (
              <Button 
                onClick={onPlay}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
            ) : (
              <Button 
                onClick={onPause}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button 
              onClick={onReset}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Simulation Speed</label>
              <div className="flex items-center space-x-1 text-sm font-medium text-blue-600">
                <FastForward className="w-4 h-4" />
                <span>{speedLabels[speed] || `${speed}x`}</span>
              </div>
            </div>
            <Slider
              value={[speed]}
              onValueChange={(values) => onSpeedChange(values[0])}
              min={0.5}
              max={4}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>0.5x</span>
              <span>1x</span>
              <span>2x</span>
              <span>4x</span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-2 pt-2 border-t border-slate-200">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-sm text-slate-600">
              {isRunning ? 'Simulation Running' : 'Simulation Paused'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}