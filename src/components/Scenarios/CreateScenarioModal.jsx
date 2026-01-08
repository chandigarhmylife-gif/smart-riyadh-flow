import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

export default function CreateScenarioModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    intersectionType: '4-way',
    vehicleCount: 50,
    duration: 300
  });

  const handleSave = () => {
    onSave({
      ...formData,
      id: Date.now(),
      lastModified: 'Just now'
    });
    setFormData({
      name: '',
      description: '',
      intersectionType: '4-way',
      vehicleCount: 50,
      duration: 300
    });
    onClose();
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
          {/* Scenario Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Scenario Name</Label>
            <Input
              id="name"
              placeholder="e.g., Downtown Rush Hour"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the traffic scenario..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Intersection Type */}
          <div className="space-y-2">
            <Label htmlFor="intersectionType">Intersection Type</Label>
            <Select
              value={formData.intersectionType}
              onValueChange={(value) => setFormData({ ...formData, intersectionType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-way">3-Way Intersection</SelectItem>
                <SelectItem value="4-way">4-Way Intersection</SelectItem>
                <SelectItem value="roundabout">Roundabout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Count */}
          <div className="space-y-2">
            <Label htmlFor="vehicleCount">Initial Vehicle Count</Label>
            <Input
              id="vehicleCount"
              type="number"
              min="10"
              max="200"
              value={formData.vehicleCount}
              onChange={(e) => setFormData({ ...formData, vehicleCount: parseInt(e.target.value) })}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Simulation Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              min="60"
              max="3600"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.name}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Scenario
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}