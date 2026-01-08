import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LiveAlerts({ isActive }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!isActive) return;

    const generateAlert = () => {
      const alertTypes = [
        { 
          type: 'warning', 
          title: 'High Queue Detected',
          message: 'Queue length exceeds threshold in North lane',
          icon: AlertTriangle
        },
        { 
          type: 'info', 
          title: 'Pattern Change',
          message: 'Traffic pattern shifted to evening mode',
          icon: Info
        },
        { 
          type: 'success', 
          title: 'Optimization Applied',
          message: 'AI adjusted signal timing for improved flow',
          icon: CheckCircle2
        }
      ];

      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const newAlert = {
        id: Date.now(),
        ...randomAlert,
        timestamp: new Date().toLocaleTimeString()
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    };

    const interval = setInterval(generateAlert, 8000);
    return () => clearInterval(interval);
  }, [isActive]);

  const getAlertStyle = (type) => {
    if (type === 'warning') return 'border-yellow-200 bg-yellow-50';
    if (type === 'success') return 'border-green-200 bg-green-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getIconColor = (type) => {
    if (type === 'warning') return 'text-yellow-600';
    if (type === 'success') return 'text-green-600';
    return 'text-blue-600';
  };

  const handleDismiss = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <span>Live Alerts</span>
          {alerts.length > 0 && (
            <Badge variant="secondary" className="ml-2">{alerts.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3 border-2 rounded-lg ${getAlertStyle(alert.type)} animate-in slide-in-from-top`}
              >
                <div className="flex items-start space-x-3">
                  <alert.icon className={`w-5 h-5 mt-0.5 ${getIconColor(alert.type)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-slate-900 text-sm">{alert.title}</h4>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-5 w-5 -mt-1"
                        onClick={() => handleDismiss(alert.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-700">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}