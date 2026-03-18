import React, { useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Grid, MapPin, Trash2 } from 'lucide-react';

export default function NetworkCanvas({ 
  intersections, 
  vehicleFlows, 
  onUpdateIntersections, 
  onAddIntersection,
  onSelectIntersection,
  selectedIntersectionId 
}) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const handleMouseDown = (e, intersection) => {
    e.preventDefault();
    setDragging(intersection.id);
    onSelectIntersection(intersection.id);
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(e.clientX - rect.left, rect.width - 30));
    const y = Math.max(30, Math.min(e.clientY - rect.top, rect.height - 30));
    
    onUpdateIntersections(prev => 
      prev.map(i => i.id === dragging ? { ...i, x, y } : i)
    );
  }, [dragging, onUpdateIntersections]);

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.tagName === 'svg') {
      onSelectIntersection(null);
    }
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Network Layout</span>
          <div className="flex gap-2">
            <Button onClick={onAddIntersection} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Intersection
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={canvasRef}
          className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg relative select-none cursor-crosshair"
          style={{ height: '420px' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        >
          <div className="absolute top-3 left-3 flex items-center gap-2 text-xs text-slate-400">
            <Grid className="w-4 h-4" />
            <span>Drag intersections to reposition</span>
          </div>

          {intersections.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MapPin className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Click "Add Intersection" to start building</p>
              </div>
            </div>
          )}

          {/* Flow Lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#3B82F6" />
              </marker>
            </defs>
            {vehicleFlows.map(flow => {
              const from = intersections.find(i => i.id === flow.from);
              const to = intersections.find(i => i.id === flow.to);
              if (!from || !to) return null;
              
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist === 0) return null;
              const offsetX = (dx / dist) * 32;
              const offsetY = (dy / dist) * 32;

              return (
                <g key={flow.id}>
                  <line
                    x1={from.x + offsetX}
                    y1={from.y + offsetY}
                    x2={to.x - offsetX}
                    y2={to.y - offsetY}
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                    markerEnd="url(#arrowhead)"
                    opacity="0.7"
                  />
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 10}
                    textAnchor="middle"
                    fill="#1E40AF"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {flow.volume} veh/h
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Intersection Nodes */}
          {intersections.map(intersection => {
            const isSelected = selectedIntersectionId === intersection.id;
            return (
              <div
                key={intersection.id}
                className={`absolute flex flex-col items-center cursor-grab active:cursor-grabbing z-10 
                  ${dragging === intersection.id ? 'z-20' : ''}`}
                style={{ 
                  left: `${intersection.x}px`, 
                  top: `${intersection.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseDown={(e) => handleMouseDown(e, intersection)}
              >
                <div className={`w-14 h-14 rounded-xl shadow-lg flex items-center justify-center transition-all
                  ${isSelected 
                    ? 'bg-blue-700 ring-4 ring-blue-300 scale-110' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                  }`}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="mt-1 text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                  {intersection.name}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}