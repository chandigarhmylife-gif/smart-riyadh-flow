import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrafficHeatmap() {
  const hours = ['00', '04', '08', '12', '16', '20'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const data = days.map(day => 
    hours.map(() => Math.floor(Math.random() * 100))
  );

  const getColor = (value) => {
    if (value < 30) return 'bg-green-200';
    if (value < 60) return 'bg-yellow-300';
    if (value < 80) return 'bg-orange-400';
    return 'bg-red-500';
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle>Traffic Flow Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex">
            <div className="w-16"></div>
            {hours.map(hour => (
              <div key={hour} className="flex-1 text-center text-xs text-slate-600">
                {hour}:00
              </div>
            ))}
          </div>
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center">
              <div className="w-16 text-sm font-medium text-slate-700">{day}</div>
              <div className="flex-1 flex gap-1">
                {data[dayIndex].map((value, hourIndex) => (
                  <div
                    key={hourIndex}
                    className={`flex-1 h-10 rounded ${getColor(value)} transition-colors hover:opacity-80 cursor-pointer`}
                    title={`${day} ${hours[hourIndex]}:00 - ${value}% congestion`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span className="text-slate-600">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-300 rounded"></div>
            <span className="text-slate-600">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-slate-600">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-600">Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}