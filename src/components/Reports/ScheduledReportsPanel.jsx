import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2, Bell } from 'lucide-react';

const defaultSchedules = [
  { id: 1, name: 'Weekly Performance Summary', frequency: 'weekly', day: 'Monday', time: '08:00', email: 'admin@riyadh.gov.sa', active: true },
  { id: 2, name: 'Monthly KPI Report', frequency: 'monthly', day: '1st', time: '07:00', email: 'director@riyadh.gov.sa', active: false },
];

export default function ScheduledReportsPanel() {
  const [schedules, setSchedules] = useState(defaultSchedules);
  const [showForm, setShowForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ name: '', frequency: 'weekly', email: '' });

  const handleAdd = () => {
    if (!newSchedule.name || !newSchedule.email) return;
    setSchedules([...schedules, { ...newSchedule, id: Date.now(), day: 'Monday', time: '08:00', active: true }]);
    setNewSchedule({ name: '', frequency: 'weekly', email: '' });
    setShowForm(false);
  };

  const toggleActive = (id) => setSchedules(schedules.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const remove = (id) => setSchedules(schedules.filter(s => s.id !== id));

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Scheduled Reports</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <div className="border-2 border-blue-200 rounded-lg p-3 space-y-2 bg-blue-50">
            <input
              className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm"
              placeholder="Schedule name"
              value={newSchedule.name}
              onChange={e => setNewSchedule({ ...newSchedule, name: e.target.value })}
            />
            <Select value={newSchedule.frequency} onValueChange={v => setNewSchedule({ ...newSchedule, frequency: v })}>
              <SelectTrigger className="text-sm h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <input
              className="w-full border border-slate-200 rounded px-3 py-1.5 text-sm"
              placeholder="Delivery email"
              value={newSchedule.email}
              onChange={e => setNewSchedule({ ...newSchedule, email: e.target.value })}
            />
            <div className="flex space-x-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1" onClick={handleAdd}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {schedules.map(s => (
          <div key={s.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{s.name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Bell className="w-3 h-3" /> {s.frequency} · {s.email}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={s.active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500'}
                variant="outline">
                {s.active ? 'Active' : 'Paused'}
              </Badge>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleActive(s.id)}>
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(s.id)}>
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </Button>
            </div>
          </div>
        ))}
        {schedules.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No scheduled reports</p>}
      </CardContent>
    </Card>
  );
}