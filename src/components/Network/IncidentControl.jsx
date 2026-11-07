import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Construction } from 'lucide-react';

/**
 * Place or clear an incident (crash, breakdown, roadworks) at an
 * intersection. A minor incident halves capacity; a major one leaves a quarter.
 */
export default function IncidentControl({ intersections, onChange }) {
  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Construction className="w-5 h-5 text-amber-600" />
          Incidents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {intersections.map((i) => (
          <div key={i.id} className="flex items-center justify-between gap-2">
            <span className="text-sm text-slate-700 truncate" title={i.name}>{i.name}</span>
            <Select
              value={i.incidentSeverity || 'none'}
              onValueChange={(v) => onChange(i.id, v === 'none' ? null : v)}
            >
              <SelectTrigger className="w-36 h-8 text-xs" aria-label={`Incident at ${i.name}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No incident</SelectItem>
                <SelectItem value="minor">Minor (−50%)</SelectItem>
                <SelectItem value="major">Major (−75%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
        <p className="text-xs text-slate-500 pt-1">
          Lost capacity makes queues grow. When a queue fills the road back to the previous intersection, it spills back and blocks traffic there; the road turns red on the map.
        </p>
      </CardContent>
    </Card>
  );
}
