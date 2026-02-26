import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Settings2 } from 'lucide-react';

const INTERSECTIONS = [
  'King Fahd Rd / Olaya St',
  'King Abdullah Rd / Tahlia St',
  'Prince Mohammed Rd / Exit 7',
  'Northern Ring / King Salman Rd',
  'Makkah Rd / Al Urubah Rd',
];

const TIME_PERIODS = [
  { key: 'morning', label: 'Morning Peak (7–9 AM)' },
  { key: 'midday', label: 'Midday (11 AM–1 PM)' },
  { key: 'evening', label: 'Evening Peak (4–7 PM)' },
  { key: 'offpeak', label: 'Off-Peak (9 PM–6 AM)' },
];

const CUSTOM_METRICS = [
  { key: 'v2c', label: 'Volume-to-Capacity Ratio' },
  { key: 'los', label: 'Level of Service (LOS)' },
  { key: 'phf', label: 'Peak Hour Factor' },
  { key: 'stopRate', label: 'Stop Rate' },
  { key: 'travelTime', label: 'Travel Time Index' },
];

export default function AdvancedCustomization({ onChange }) {
  const [selectedIntersections, setSelectedIntersections] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState(['morning', 'evening']);
  const [selectedCustomMetrics, setSelectedCustomMetrics] = useState([]);

  const toggle = (list, setList, key) => {
    const next = list.includes(key) ? list.filter(k => k !== key) : [...list, key];
    setList(next);
    onChange?.({ intersections: selectedIntersections, periods: selectedPeriods, customMetrics: selectedCustomMetrics });
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings2 className="w-5 h-5 text-blue-600" />
          <span>Advanced Customization</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Intersections */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Intersections</p>
          <div className="space-y-2">
            {INTERSECTIONS.map(name => (
              <div key={name} className="flex items-center space-x-2">
                <Checkbox
                  id={name}
                  checked={selectedIntersections.includes(name)}
                  onCheckedChange={() => toggle(selectedIntersections, setSelectedIntersections, name)}
                />
                <label htmlFor={name} className="text-sm text-slate-600 cursor-pointer">{name}</label>
              </div>
            ))}
          </div>
          {selectedIntersections.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedIntersections.map(n => (
                <Badge key={n} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">{n.split('/')[0].trim()}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Time Periods */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Time Periods</p>
          <div className="space-y-2">
            {TIME_PERIODS.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={selectedPeriods.includes(key)}
                  onCheckedChange={() => toggle(selectedPeriods, setSelectedPeriods, key)}
                />
                <label htmlFor={key} className="text-sm text-slate-600 cursor-pointer">{label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Data Points */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">Additional Data Points</p>
          <div className="space-y-2">
            {CUSTOM_METRICS.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={selectedCustomMetrics.includes(key)}
                  onCheckedChange={() => toggle(selectedCustomMetrics, setSelectedCustomMetrics, key)}
                />
                <label htmlFor={key} className="text-sm text-slate-600 cursor-pointer">{label}</label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}