import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Car, Truck, Bus, Ambulance } from 'lucide-react';

export default function VehicleTypes({ onDistributionChange }) {
  const [distribution, setDistribution] = useState({
    car: 70,
    truck: 15,
    bus: 10,
    emergency: 5
  });

  const vehicleTypes = [
    { 
      key: 'car', 
      name: 'Standard Vehicles', 
      icon: Car, 
      color: 'bg-blue-100 text-blue-600',
      description: 'Passenger cars and small vehicles'
    },
    { 
      key: 'truck', 
      name: 'Commercial Trucks', 
      icon: Truck, 
      color: 'bg-orange-100 text-orange-600',
      description: 'Delivery trucks and heavy vehicles'
    },
    { 
      key: 'bus', 
      name: 'Public Transit', 
      icon: Bus, 
      color: 'bg-green-100 text-green-600',
      description: 'Buses and public transportation'
    },
    { 
      key: 'emergency', 
      name: 'Emergency Vehicles', 
      icon: Ambulance, 
      color: 'bg-red-100 text-red-600',
      description: 'Ambulances, fire trucks, police'
    }
  ];

  const handleChange = (key, value) => {
    const newDistribution = { ...distribution, [key]: value };
    setDistribution(newDistribution);
    if (onDistributionChange) {
      onDistributionChange(newDistribution);
    }
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle>Vehicle Type Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {vehicleTypes.map(type => {
          const Icon = type.icon;
          return (
            <div key={type.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{type.name}</p>
                    <p className="text-xs text-slate-600">{type.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {distribution[type.key]}%
                </Badge>
              </div>
              <Slider
                value={[distribution[type.key]]}
                onValueChange={([value]) => handleChange(type.key, value)}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          );
        })}

        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Total Distribution</span>
            <span className={`font-bold ${
              Object.values(distribution).reduce((a, b) => a + b, 0) === 100
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {Object.values(distribution).reduce((a, b) => a + b, 0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}