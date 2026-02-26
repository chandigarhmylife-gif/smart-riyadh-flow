import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, TrendingDown, Minus, Pencil, Check } from 'lucide-react';

const DEFAULT_BENCHMARKS = [
  { key: 'avgWaitTime', label: 'Avg Wait Time', unit: 's', current: 38, benchmark: 45, goal: 30, lowerIsBetter: true },
  { key: 'throughput', label: 'Throughput', unit: 'veh/hr', current: 1820, benchmark: 1600, goal: 2000, lowerIsBetter: false },
  { key: 'efficiency', label: 'Signal Efficiency', unit: '%', current: 89, benchmark: 80, goal: 95, lowerIsBetter: false },
  { key: 'co2', label: 'CO₂ Emissions', unit: 'tons/day', current: 14.2, benchmark: 18.0, goal: 12.0, lowerIsBetter: true },
];

function StatusIcon({ current, benchmark, lowerIsBetter }) {
  const better = lowerIsBetter ? current < benchmark : current > benchmark;
  const same = Math.abs(current - benchmark) / benchmark < 0.02;
  if (same) return <Minus className="w-4 h-4 text-yellow-500" />;
  return better
    ? <TrendingUp className="w-4 h-4 text-green-500" />
    : <TrendingDown className="w-4 h-4 text-red-500" />;
}

function GoalBar({ current, goal, lowerIsBetter }) {
  const pct = lowerIsBetter
    ? Math.min(100, Math.max(0, ((goal - current) / goal) * 100 + 50))
    : Math.min(100, (current / goal) * 100);
  const color = pct >= 90 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function BenchmarkGoals() {
  const [benchmarks, setBenchmarks] = useState(DEFAULT_BENCHMARKS);
  const [editingKey, setEditingKey] = useState(null);
  const [editVal, setEditVal] = useState({});

  const startEdit = (b) => { setEditingKey(b.key); setEditVal({ goal: b.goal, benchmark: b.benchmark }); };
  const saveEdit = (key) => {
    setBenchmarks(bs => bs.map(b => b.key === key ? { ...b, goal: Number(editVal.goal), benchmark: Number(editVal.benchmark) } : b));
    setEditingKey(null);
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>Benchmarking & Goals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {benchmarks.map(b => (
          <div key={b.key} className="border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <StatusIcon current={b.current} benchmark={b.benchmark} lowerIsBetter={b.lowerIsBetter} />
                <span className="text-sm font-semibold text-slate-700">{b.label}</span>
              </div>
              {editingKey === b.key ? (
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEdit(b.key)}>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => startEdit(b)}>
                  <Pencil className="w-3.5 h-3.5 text-slate-400" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs mb-2">
              <div className="bg-blue-50 rounded px-2 py-1 text-center">
                <p className="text-slate-400">Current</p>
                <p className="font-bold text-blue-700">{b.current} {b.unit}</p>
              </div>
              <div className="bg-slate-50 rounded px-2 py-1 text-center">
                {editingKey === b.key ? (
                  <input className="w-full text-center border border-slate-300 rounded text-xs" value={editVal.benchmark}
                    onChange={e => setEditVal({ ...editVal, benchmark: e.target.value })} />
                ) : (
                  <>
                    <p className="text-slate-400">Benchmark</p>
                    <p className="font-bold text-slate-600">{b.benchmark} {b.unit}</p>
                  </>
                )}
              </div>
              <div className="bg-green-50 rounded px-2 py-1 text-center">
                {editingKey === b.key ? (
                  <input className="w-full text-center border border-green-300 rounded text-xs" value={editVal.goal}
                    onChange={e => setEditVal({ ...editVal, goal: e.target.value })} />
                ) : (
                  <>
                    <p className="text-slate-400">Goal</p>
                    <p className="font-bold text-green-700">{b.goal} {b.unit}</p>
                  </>
                )}
              </div>
            </div>
            <GoalBar current={b.current} goal={b.goal} lowerIsBetter={b.lowerIsBetter} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}