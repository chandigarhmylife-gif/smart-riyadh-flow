import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AlertsPanel({ alerts = [], onDismiss }) {
  const defaultAlerts = [
    {
      id: 1,
      type: 'info',
      title: 'New Feature Available',
      message: 'Multi-intersection coordination is now available in beta',
      timestamp: '5 minutes ago'
    },
    {
      id: 2,
      type: 'success',
      title: 'Simulation Complete',
      message: 'Downtown Rush Hour scenario completed with 92% efficiency',
      timestamp: '1 hour ago'
    },
    {
      id: 3,
      type: 'warning',
      title: 'High Traffic Detected',
      message: 'Unusual traffic patterns detected in Zone 3',
      timestamp: '2 hours ago'
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-slate-700" />
          <span>Recent Alerts</span>
          {displayAlerts.length > 0 && (
            <Badge variant="secondary" className="ml-2">{displayAlerts.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No new alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-4 border-2 rounded-xl ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-slate-900 text-sm">{alert.title}</h4>
                      {onDismiss && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 -mt-1"
                          onClick={() => onDismiss(alert.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-slate-700">{alert.message}</p>
                    <p className="text-xs text-slate-500">{alert.timestamp}</p>
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