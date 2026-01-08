import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, Plus, Settings, TrendingUp } from 'lucide-react';

export default function IntersectionNetwork({ onNetworkChange }) {
  const [intersections, setIntersections] = useState([
    { 
      id: 1, 
      name: 'Main & 1st', 
      status: 'active', 
      coordination: 'synchronized',
      efficiency: 92,
      position: { x: 100, y: 100 }
    },
    { 
      id: 2, 
      name: 'Main & 2nd', 
      status: 'active', 
      coordination: 'synchronized',
      efficiency: 88,
      position: { x: 300, y: 100 }
    },
    { 
      id: 3, 
      name: '1st & Oak', 
      status: 'active', 
      coordination: 'independent',
      efficiency: 76,
      position: { x: 100, y: 300 }
    }
  ]);

  const addIntersection = () => {
    const newIntersection = {
      id: intersections.length + 1,
      name: `Intersection ${intersections.length + 1}`,
      status: 'inactive',
      coordination: 'independent',
      efficiency: 0,
      position: { x: Math.random() * 400, y: Math.random() * 400 }
    };
    setIntersections([...intersections, newIntersection]);
    if (onNetworkChange) onNetworkChange([...intersections, newIntersection]);
  };

  const getStatusColor = (status) => {
    if (status === 'active') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'inactive') return 'bg-slate-100 text-slate-800 border-slate-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const avgEfficiency = intersections.length > 0
    ? Math.round(intersections.reduce((sum, i) => sum + i.efficiency, 0) / intersections.length)
    : 0;

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-blue-600" />
            <span>Intersection Network</span>
          </CardTitle>
          <Button onClick={addIntersection} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Network Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-blue-800 mb-1">Total</div>
            <div className="text-2xl font-bold text-blue-600">{intersections.length}</div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs text-green-800 mb-1">Active</div>
            <div className="text-2xl font-bold text-green-600">
              {intersections.filter(i => i.status === 'active').length}
            </div>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-xs text-purple-800 mb-1">Avg Efficiency</div>
            <div className="text-2xl font-bold text-purple-600">{avgEfficiency}%</div>
          </div>
        </div>

        {/* Network Visualization */}
        <div className="relative h-64 bg-slate-50 border-2 border-slate-200 rounded-lg overflow-hidden">
          <svg className="w-full h-full">
            {/* Draw connections between coordinated intersections */}
            {intersections.map((source, i) => 
              intersections.slice(i + 1).map((target, j) => {
                if (source.coordination === 'synchronized' && target.coordination === 'synchronized') {
                  return (
                    <line
                      key={`${source.id}-${target.id}`}
                      x1={source.position.x}
                      y1={source.position.y}
                      x2={target.position.x}
                      y2={target.position.y}
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.3"
                    />
                  );
                }
                return null;
              })
            )}
            
            {/* Draw intersections */}
            {intersections.map(intersection => (
              <g key={intersection.id}>
                <circle
                  cx={intersection.position.x}
                  cy={intersection.position.y}
                  r="20"
                  fill={intersection.status === 'active' ? '#10B981' : '#94A3B8'}
                  opacity="0.8"
                />
                <text
                  x={intersection.position.x}
                  y={intersection.position.y + 35}
                  textAnchor="middle"
                  className="text-xs font-medium fill-slate-700"
                >
                  {intersection.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Intersection List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {intersections.map(intersection => (
            <div 
              key={intersection.id}
              className="p-3 border-2 border-slate-200 rounded-lg hover:border-blue-400 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900">{intersection.name}</h4>
                <Badge className={`text-xs border ${getStatusColor(intersection.status)}`}>
                  {intersection.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  {intersection.coordination === 'synchronized' ? '🔗 Synchronized' : '⚪ Independent'}
                </span>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-medium">{intersection.efficiency}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}