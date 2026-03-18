import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, MapPin } from 'lucide-react';

export default function IntersectionEditor({ 
  intersection, 
  onUpdate, 
  onDelete,
  canDelete 
}) {
  if (!intersection) {
    return (
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            Intersection Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-4">
            Select an intersection on the canvas to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Edit Intersection
          </div>
          {canDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
              onClick={() => onDelete(intersection.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs">Name</Label>
          <Input 
            value={intersection.name}
            onChange={(e) => onUpdate(intersection.id, { name: e.target.value })}
            className="mt-1 h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Lanes</Label>
          <Select 
            value={String(intersection.lanes)} 
            onValueChange={(v) => onUpdate(intersection.id, { lanes: parseInt(v) })}
          >
            <SelectTrigger className="mt-1 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Lanes</SelectItem>
              <SelectItem value="3">3 Lanes</SelectItem>
              <SelectItem value="4">4 Lanes</SelectItem>
              <SelectItem value="6">6 Lanes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Type</Label>
          <Select 
            value={intersection.type || '4-way'} 
            onValueChange={(v) => onUpdate(intersection.id, { type: v })}
          >
            <SelectTrigger className="mt-1 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4-way">4-Way Intersection</SelectItem>
              <SelectItem value="3-way">3-Way (T-Junction)</SelectItem>
              <SelectItem value="roundabout">Roundabout</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}