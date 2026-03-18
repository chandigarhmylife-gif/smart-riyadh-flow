import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle } from 'lucide-react';

export default function SignalIndicator({ signalStates = {}, timings = {} }) {
  const displayStates = Object.keys(signalStates).length > 0 ? signalStates : {
    north: 'green', south: 'green', east: 'red', west: 'red'
  };
  const displayTimings = Object.keys(timings).length > 0 ? timings : {
    north: 0, south: 0, east: 0, west: 0
  };

  const getStateColor = (state) => {
    if (state === 'green') return 'text-green-500';
    if (state === 'yellow') return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStateBg = (state) => {
    if (state === 'green') return 'bg-green-50 border-green-200';
    if (state === 'yellow') return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const directions = [
    { name: 'North', key: 'north' },
    { name: 'South', key: 'south' },
    { name: 'East', key: 'east' },
    { name: 'West', key: 'west' }
  ];

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Signal Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {directions.map(direction => (
          <div 
            key={direction.key}
            className={`p-3 rounded-lg border-2 ${getStateBg(displayStates[direction.key])}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Circle 
                  className={`w-5 h-5 ${getStateColor(displayStates[direction.key])} fill-current`}
                />
                <span className="font-semibold text-slate-900">{direction.name}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-600">Time Remaining</div>
                <div className="text-lg font-bold text-slate-900">
                  {displayTimings[direction.key]}s
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Cycle Info */}
        <div className="pt-3 border-t border-slate-200 text-center text-sm text-slate-600">
          <div className="font-medium">
            {displayStates.north === 'green' || displayStates.north === 'yellow' 
              ? 'Phase 1 (N-S Active)' 
              : 'Phase 2 (E-W Active)'}
          </div>
          <div className="text-xs">Adaptive timing active</div>
        </div>
      </CardContent>
    </Card>
  );
}