import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';

const INITIAL_FORM = {
  name: '',
  description: '',
  intersectionType: '4-way',
  weatherCondition: 'clear',
  timeOfDay: 'rush-hour',
  duration: 60,
};

export default function CreateScenarioModal({ open, onClose, onSave, saving }) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (open) setFormData(INITIAL_FORM);
  }, [open]);

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <span>Create New Scenario</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Scenario Name *</Label>
            <Input
              placeholder="e.g., Downtown Rush Hour"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the traffic scenario..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Intersection Type</Label>
              <Select
                value={formData.intersectionType}
                onValueChange={(v) => setFormData({ ...formData, intersectionType: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-way">3-Way</SelectItem>
                  <SelectItem value="4-way">4-Way</SelectItem>
                  <SelectItem value="roundabout">Roundabout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration (min)</Label>
              <Input
                type="number"
                min="5"
                max="180"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Weather</Label>
              <Select
                value={formData.weatherCondition}
                onValueChange={(v) => setFormData({ ...formData, weatherCondition: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">☀️ Clear</SelectItem>
                  <SelectItem value="rain">🌧️ Rain</SelectItem>
                  <SelectItem value="fog">🌫️ Fog</SelectItem>
                  <SelectItem value="snow">❄️ Snow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time of Day</Label>
              <Select
                value={formData.timeOfDay}
                onValueChange={(v) => setFormData({ ...formData, timeOfDay: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="rush-hour">Rush Hour</SelectItem>
                  <SelectItem value="midday">Midday</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name.trim() || saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Create Scenario
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}