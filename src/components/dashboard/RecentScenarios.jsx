import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import moment from 'moment';

const statusColors = {
  draft: 'bg-slate-100 text-slate-700',
  ready: 'bg-blue-100 text-blue-700',
  running: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
};

export default function RecentScenarios({ scenarios = [], loading = false }) {
  if (loading) {
    return (
      <Card className="border-2 border-slate-200">
        <CardHeader><CardTitle>Recent Scenarios</CardTitle></CardHeader>
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
        {scenarios.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No scenarios yet. Create one to get started.</p>
            <Link to={createPageUrl('ScenarioBuilder')}>
              <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">Create Scenario</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {scenarios.map(scenario => {
              const efficiency = scenario.results?.efficiency;
              return (
                <div 
                  key={scenario.id}
                  className="p-4 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-900">{scenario.name}</h4>
                        <Badge className={`text-xs ${statusColors[scenario.status] || 'bg-slate-100 text-slate-700'}`}>
                          {scenario.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{moment(scenario.updated_date).fromNow()}</span>
                        </div>
                        <span>{(scenario.intersections || []).length} intersections</span>
                        {efficiency != null && (
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">Efficiency:</span>
                            <span className={efficiency >= 85 ? 'text-green-600' : 'text-yellow-600'}>
                              {Math.round(efficiency)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link to={`/Simulation?scenario=${scenario.id}`}>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}