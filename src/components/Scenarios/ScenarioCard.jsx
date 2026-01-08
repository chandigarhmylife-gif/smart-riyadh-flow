import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Trash2, Copy, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ScenarioCard({ scenario, onEdit, onDelete, onDuplicate }) {
  return (
    <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group">
      <CardContent className="p-6">
        {/* Preview Thumbnail */}
        <div className="mb-4 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full grid grid-cols-3 gap-1 p-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-slate-400 rounded"></div>
              ))}
            </div>
          </div>
          <MapPin className="w-12 h-12 text-blue-600 relative z-10" />
        </div>

        {/* Scenario Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{scenario.name}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">{scenario.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {scenario.intersectionType}
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {scenario.vehicleCount} vehicles
            </Badge>
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{scenario.lastModified}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Link to={createPageUrl('Simulation')} className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onEdit(scenario)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onDuplicate(scenario)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onDelete(scenario)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}