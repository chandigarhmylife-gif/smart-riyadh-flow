import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Trash2, Copy, Clock, MapPin, Loader2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import moment from 'moment';

const STATUS_STYLES = {
  draft: 'bg-slate-100 text-slate-700',
  ready: 'bg-blue-100 text-blue-700',
  running: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
};

export default function ScenarioCard({ scenario, onEdit, onDelete, onDuplicate, deleting }) {
  const navigate = useNavigate();
  const intersectionCount = (scenario.intersections || []).length;
  const flowCount = (scenario.vehicle_flows || []).length;
  const weather = scenario.config?.weatherCondition || 'clear';
  const timeOfDay = scenario.config?.timeOfDay || '-';

  const handleRun = () => {
    navigate(`/Simulation?scenario=${scenario.id}`);
  };

  const handleEdit = () => {
    navigate(`/ScenarioBuilder?id=${scenario.id}`);
  };

  return (
    <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group">
      <CardContent className="p-5">
        {/* Preview Thumbnail */}
        <div className="mb-4 h-28 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 p-3">
            {(scenario.intersections || []).map((inter, i) => (
              <div 
                key={i}
                className="absolute w-3 h-3 bg-blue-500 rounded-full"
                style={{
                  left: `${10 + (i * 25) % 80}%`,
                  top: `${20 + (i * 30) % 60}%`
                }}
              />
            ))}
          </div>
          <div className="relative z-10 text-center">
            <MapPin className="w-8 h-8 text-blue-600 mx-auto" />
            <span className="text-xs text-blue-700 font-medium mt-1 block">
              {intersectionCount} intersection{intersectionCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900 leading-tight">{scenario.name}</h3>
              <Badge className={`text-[10px] px-1.5 py-0 ${STATUS_STYLES[scenario.status] || STATUS_STYLES.draft}`}>
                {scenario.status || 'draft'}
              </Badge>
            </div>
            {scenario.description && (
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{scenario.description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-[10px]">{flowCount} flows</Badge>
            <Badge variant="outline" className="text-[10px]">{weather}</Badge>
            <Badge variant="outline" className="text-[10px]">{timeOfDay}</Badge>
          </div>

          <div className="flex items-center text-[11px] text-slate-400">
            <Clock className="w-3 h-3 mr-1" />
            {moment(scenario.updated_date || scenario.created_date).fromNow()}
          </div>

          <div className="flex gap-1.5 pt-1">
            <Button 
              onClick={handleRun} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
              size="sm"
            >
              <Play className="w-3.5 h-3.5 mr-1" />
              Run
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleEdit}>
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onDuplicate(scenario)}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(scenario)}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}