import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, MoreVertical, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function RecentScenarios({ scenarios = [], loading = false }) {
  if (loading) {
    return (
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle>Recent Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const defaultScenarios = [
    {
      id: 1,
      name: 'Downtown Rush Hour',
      intersection: '4-way Main & 1st',
      lastRun: '2 hours ago',
      status: 'completed',
      efficiency: 87
    },
    {
      id: 2,
      name: 'School Zone Morning',
      intersection: '3-way Oak & Maple',
      lastRun: '5 hours ago',
      status: 'completed',
      efficiency: 92
    },
    {
      id: 3,
      name: 'Evening Commute',
      intersection: '4-way Highway & Central',
      lastRun: '1 day ago',
      status: 'completed',
      efficiency: 84
    }
  ];

  const displayScenarios = scenarios.length > 0 ? scenarios : defaultScenarios;

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Scenarios</CardTitle>
        <Link to={createPageUrl('Scenarios')}>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayScenarios.map(scenario => (
            <div 
              key={scenario.id}
              className="p-4 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-slate-900">{scenario.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {scenario.intersection}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{scenario.lastRun}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">Efficiency:</span>
                      <span className={scenario.efficiency >= 85 ? 'text-green-600' : 'text-yellow-600'}>
                        {scenario.efficiency}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link to={createPageUrl('Simulation')}>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Run
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}