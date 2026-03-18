import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertCircle, Car, Bus, Truck } from 'lucide-react';

const VEHICLE_TYPES = [
  { key: 'cars', label: 'Cars', icon: Car, color: 'text-blue-600' },
  { key: 'buses', label: 'Buses', icon: Bus, color: 'text-green-600' },
  { key: 'trucks', label: 'Trucks', icon: Truck, color: 'text-orange-600' },
];

export default function VehicleDistribution({ distribution, onDistributionChange }) {
  const total = distribution.cars + distribution.buses + distribution.trucks;
  const isValid = total === 100;

  const handleChange = (key, newVal) => {
    const others = VEHICLE_TYPES.filter(v => v.key !== key);
    const otherTotal = others.reduce((sum, v) => sum + distribution[v.key], 0);
    
    // Auto-balance: distribute remaining among others proportionally
    const remaining = 100 - newVal;
    if (otherTotal === 0) {
      // Split equally
      const updated = { ...distribution, [key]: newVal };
      updated[others[0].key] = Math.round(remaining / 2);
      updated[others[1].key] = remaining - Math.round(remaining / 2);
      onDistributionChange(updated);
    } else {
      const updated = { ...distribution, [key]: newVal };
      const ratio0 = distribution[others[0].key] / otherTotal;
      updated[others[0].key] = Math.round(remaining * ratio0);
      updated[others[1].key] = remaining - updated[others[0].key];
      // Clamp to valid range
      if (updated[others[1].key] < 0) {
        updated[others[1].key] = 0;
        updated[others[0].key] = remaining;
      }
      if (updated[others[0].key] < 0) {
        updated[others[0].key] = 0;
        updated[others[1].key] = remaining;
      }
      onDistributionChange(updated);
    }
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="text-sm">Vehicle Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {VEHICLE_TYPES.map(({ key, label, icon: Icon, color }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <Label className="text-xs">{label}</Label>
              </div>
              <span className="text-sm font-bold text-slate-900">{distribution[key]}%</span>
            </div>
            <Slider 
              value={[distribution[key]]}
              onValueChange={([v]) => handleChange(key, v)}
              max={100}
              min={0}
              step={1}
            />
          </div>
        ))}

        {/* Total indicator */}
        <div className={`flex items-center justify-between p-2 rounded text-xs border ${
          isValid 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          {isValid ? (
            <span>✓ Total: 100%</span>
          ) : (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Total: {total}% (must be 100%)</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}