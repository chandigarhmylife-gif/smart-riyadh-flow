import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bus, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export default function PublicTransitPriority({ isRunning, onPriorityChange }) {
  const [priorityEnabled, setPriorityEnabled] = useState(true);
  const [activeTransit, setActiveTransit] = useState([]);

  useEffect(() => {
    if (!isRunning) {
      setActiveTransit([]);
      return;
    }

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const transit = {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'bus' : 'tram',
          route: `Route ${Math.floor(Math.random() * 20) + 1}`,
          direction: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
          eta: Math.floor(Math.random() * 30) + 10,
          passengers: Math.floor(Math.random() * 40) + 10,
          timestamp: new Date().toLocaleTimeString()
        };
        
        setActiveTransit(prev => [...prev, transit].slice(-5));
        
        setTimeout(() => {
          setActiveTransit(prev => prev.filter(t => t.id !== transit.id));
        }, transit.eta * 1000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handlePriorityToggle = (enabled) => {
    setPriorityEnabled(enabled);
    if (onPriorityChange) onPriorityChange(enabled);
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bus className="w-5 h-5 text-green-600" />
            <span>Public Transit Priority</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">System</span>
            <Switch
              checked={priorityEnabled}
              onCheckedChange={handlePriorityToggle}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Priority System</span>
            <Badge variant={priorityEnabled ? 'default' : 'secondary'}>
              {priorityEnabled ? 'Active' : 'Disabled'}
            </Badge>
          </div>
          {priorityEnabled && (
            <p className="text-xs text-slate-600 mt-2">
              Transit vehicles can request green phase extension or early activation
            </p>
          )}
        </div>

        {/* Active Transit Requests */}
        {activeTransit.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Bus className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No active transit requests</p>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900">Active Requests</h4>
            {activeTransit.map(transit => (
              <div 
                key={transit.id}
                className="p-3 bg-green-50 border-2 border-green-200 rounded-lg animate-in slide-in-from-right"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Bus className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">
                        {transit.type === 'bus' ? '🚌 Bus' : '🚊 Tram'} - {transit.route}
                      </p>
                      <p className="text-xs text-green-700">Direction: {transit.direction}</p>
                    </div>
                  </div>
                  {priorityEnabled && (
                    <Badge variant="default" className="bg-green-600">
                      Priority Granted
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1 text-green-700">
                    <Clock className="w-3 h-3" />
                    <span>ETA: {transit.eta}s</span>
                  </div>
                  <div className="text-green-700">
                    👥 {transit.passengers} passengers
                  </div>
                </div>

                {priorityEnabled && (
                  <div className="mt-2 p-2 bg-white border border-green-200 rounded text-xs text-green-800">
                    ✓ Signal phase extended for transit clearance
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Impact Statistics */}
        {priorityEnabled && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-900">Transit Impact</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-blue-700 mb-1">Transit Delay Reduction</div>
                <div className="text-lg font-bold text-blue-600">-42%</div>
              </div>
              <div>
                <div className="text-blue-700 mb-1">Schedule Adherence</div>
                <div className="text-lg font-bold text-blue-600">+28%</div>
              </div>
              <div>
                <div className="text-blue-700 mb-1">People Moved/Hour</div>
                <div className="text-lg font-bold text-blue-600">+850</div>
              </div>
              <div>
                <div className="text-blue-700 mb-1">General Traffic Impact</div>
                <div className="text-lg font-bold text-blue-600">+3%</div>
              </div>
            </div>
          </div>
        )}

        {!priorityEnabled && activeTransit.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-xs text-yellow-800">
                Priority system disabled. Transit vehicles experiencing standard delays.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}