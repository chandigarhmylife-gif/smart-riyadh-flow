import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, Plus, Trash2, Link2, Unlink, Power, TrendingUp } from 'lucide-react';

export default function IntersectionNetwork({ 
  intersections, 
  onAdd, 
  onRemove, 
  onToggleCoordination, 
  onToggleStatus,
  isRunning 
}) {
  const activeCount = intersections.filter(i => i.status === 'active').length;
  const avgEfficiency = intersections.length > 0
    ? Math.round(intersections.reduce((sum, i) => sum + i.efficiency, 0) / intersections.length)
    : 0;

  const signalColor = (state) => {
    if (state === 'green') return '#10B981';
    if (state === 'yellow') return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-blue-600" />
            <span>Intersection Network</span>
          </CardTitle>
          <Button onClick={onAdd} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <div className="text-xs text-blue-800 mb-1">Total</div>
            <div className="text-2xl font-bold text-blue-600">{intersections.length}</div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="text-xs text-green-800 mb-1">Active</div>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
            <div className="text-xs text-purple-800 mb-1">Avg Efficiency</div>
            <div className="text-2xl font-bold text-purple-600">{avgEfficiency}%</div>
          </div>
        </div>

        {/* SVG Network Visualization */}
        <div className="relative h-72 bg-slate-50 border-2 border-slate-200 rounded-lg overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 500 300">
            {/* Connection lines between synchronized intersections */}
            {intersections.map((src, i) =>
              intersections.slice(i + 1).map(tgt => {
                if (src.coordination === 'synchronized' && tgt.coordination === 'synchronized' && src.status === 'active' && tgt.status === 'active') {
                  return (
                    <line key={`${src.id}-${tgt.id}`}
                      x1={src.position.x} y1={src.position.y}
                      x2={tgt.position.x} y2={tgt.position.y}
                      stroke="#3B82F6" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
                  );
                }
                return null;
              })
            )}
            {/* Intersection nodes */}
            {intersections.map(int => (
              <g key={int.id}>
                {/* Outer ring for signal state */}
                <circle cx={int.position.x} cy={int.position.y} r="24"
                  fill="none" stroke={isRunning ? signalColor(int.signalState) : '#94A3B8'}
                  strokeWidth="3" opacity={int.status === 'active' ? 1 : 0.3} />
                {/* Inner node */}
                <circle cx={int.position.x} cy={int.position.y} r="18"
                  fill={int.status === 'active' ? (int.coordination === 'synchronized' ? '#3B82F6' : '#64748B') : '#CBD5E1'}
                  opacity="0.9" />
                {/* Efficiency text */}
                <text x={int.position.x} y={int.position.y + 4} textAnchor="middle"
                  fill="white" fontSize="11" fontWeight="bold">
                  {int.efficiency}%
                </text>
                {/* Label */}
                <text x={int.position.x} y={int.position.y + 42} textAnchor="middle"
                  className="fill-slate-600" fontSize="10" fontWeight="500">
                  {int.name}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Intersection List */}
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {intersections.map(int => (
            <div key={int.id}
              className={`p-3 border-2 rounded-lg transition-all ${
                int.status === 'active' ? 'border-slate-200 hover:border-blue-400' : 'border-slate-100 bg-slate-50 opacity-60'
              }`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {isRunning && int.status === 'active' && (
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: signalColor(int.signalState) }} />
                  )}
                  <h4 className="font-semibold text-slate-900 text-sm">{int.name}</h4>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7"
                    title={int.coordination === 'synchronized' ? 'Unsync' : 'Sync'}
                    onClick={() => onToggleCoordination(int.id)}>
                    {int.coordination === 'synchronized'
                      ? <Link2 className="w-3.5 h-3.5 text-blue-600" />
                      : <Unlink className="w-3.5 h-3.5 text-slate-400" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7"
                    title={int.status === 'active' ? 'Deactivate' : 'Activate'}
                    onClick={() => onToggleStatus(int.id)}>
                    <Power className={`w-3.5 h-3.5 ${int.status === 'active' ? 'text-green-600' : 'text-slate-400'}`} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-600"
                    onClick={() => onRemove(int.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{int.coordination === 'synchronized' ? '🔗 Synchronized' : '⚪ Independent'}</span>
                <div className="flex items-center gap-3">
                  <span>⏱ {int.waitTime}s</span>
                  <span>🚗 {int.throughput}/h</span>
                  <div className="flex items-center gap-1 text-green-600 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    {int.efficiency}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}