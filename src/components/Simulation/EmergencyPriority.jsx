import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ambulance, AlertTriangle, Clock } from 'lucide-react';

export default function EmergencyPriority({ onEmergencyTrigger }) {
  const [activeEmergencies, setActiveEmergencies] = useState([]);

  const triggerEmergency = () => {
    const emergency = {
      id: Date.now(),
      type: 'ambulance',
      direction: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
      eta: Math.floor(Math.random() * 30) + 10,
      timestamp: new Date().toLocaleTimeString()
    };

    setActiveEmergencies([...activeEmergencies, emergency]);
    if (onEmergencyTrigger) onEmergencyTrigger(emergency);

    // Auto-remove after ETA
    setTimeout(() => {
      setActiveEmergencies(prev => prev.filter(e => e.id !== emergency.id));
    }, emergency.eta * 1000);
  };

  const clearEmergency = (id) => {
    setActiveEmergencies(activeEmergencies.filter(e => e.id !== id));
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Ambulance className="w-5 h-5 text-red-600" />
            <span>Emergency Priority System</span>
          </CardTitle>
          {activeEmergencies.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {activeEmergencies.length} Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={triggerEmergency}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Simulate Emergency Vehicle
        </Button>

        {activeEmergencies.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Ambulance className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No active emergency vehicles</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeEmergencies.map(emergency => (
              <div 
                key={emergency.id}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-in slide-in-from-right"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Ambulance className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">Emergency Vehicle</p>
                      <p className="text-sm text-red-700">Direction: {emergency.direction}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => clearEmergency(emergency.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-red-700">
                    <Clock className="w-4 h-4" />
                    <span>ETA: {emergency.eta}s</span>
                  </div>
                  <span className="text-red-600">• Priority Override Active</span>
                </div>

                <div className="mt-3 p-2 bg-white border border-red-200 rounded text-xs text-red-800">
                  🚨 All signals adjusted for emergency clearance. Traffic temporarily held on cross streets.
                </div>
              </div>
            ))}
          </div>
        )}

        {activeEmergencies.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>System Response:</strong> AI has automatically adjusted signal timing to provide green corridor for emergency vehicles. Normal operation will resume after clearance.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}