import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

export default function FlowManager({ 
  vehicleFlows, 
  intersections, 
  onUpdateFlow, 
  onAddFlow, 
  onDeleteFlow 
}) {
  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Traffic Flows</span>
          <Button 
            onClick={onAddFlow} 
            size="sm" 
            variant="outline"
            disabled={intersections.length < 2}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Flow
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {vehicleFlows.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">
            No flows yet. Add at least 2 intersections, then create a flow.
          </p>
        )}
        {vehicleFlows.map(flow => {
          const fromIntersection = intersections.find(i => i.id === flow.from);
          const toIntersection = intersections.find(i => i.id === flow.to);
          
          return (
            <div key={flow.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className="truncate max-w-[80px]">{fromIntersection?.name || '?'}</span>
                  <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate max-w-[80px]">{toIntersection?.name || '?'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{flow.volume} veh/h</Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                    onClick={() => onDeleteFlow(flow.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              
              {/* From / To selectors */}
              <div className="grid grid-cols-2 gap-2">
                <Select 
                  value={String(flow.from)} 
                  onValueChange={(v) => onUpdateFlow(flow.id, { from: parseInt(v) })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {intersections.map(i => (
                      <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={String(flow.to)} 
                  onValueChange={(v) => onUpdateFlow(flow.id, { to: parseInt(v) })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {intersections.map(i => (
                      <SelectItem key={i.id} value={String(i.id)}>{i.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Flow type */}
              <Select 
                value={flow.type} 
                onValueChange={(v) => onUpdateFlow(flow.id, { type: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed Traffic</SelectItem>
                  <SelectItem value="cars-only">Cars Only</SelectItem>
                  <SelectItem value="heavy">Heavy Vehicles</SelectItem>
                  <SelectItem value="transit">Transit Priority</SelectItem>
                </SelectContent>
              </Select>

              {/* Volume slider */}
              <div>
                <Slider 
                  value={[flow.volume]} 
                  onValueChange={([v]) => onUpdateFlow(flow.id, { volume: v })}
                  max={500}
                  min={10}
                  step={10}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10</span>
                  <span>500 veh/h</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}