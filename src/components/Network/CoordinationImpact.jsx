import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves } from 'lucide-react';

const DIR_LABELS = { south: 'Southbound', north: 'Northbound', east: 'Eastbound', west: 'Westbound' };

function change(current, baseline) {
  if (!baseline) return null;
  return ((current - baseline) / baseline) * 100;
}

function Delta({ value, goodWhenNegative = true }) {
  if (value === null || !Number.isFinite(value)) return null;
  const good = goodWhenNegative ? value <= 0 : value >= 0;
  return (
    <span className={`text-xs font-semibold ${good ? 'text-green-600' : 'text-red-600'}`}>
      {value <= 0 ? '▼' : '▲'} {Math.abs(value).toFixed(0)}%
    </span>
  );
}

/**
 * Compares the running network against uncoordinated fixed-time signals on
 * identical traffic: overall delay, share of vehicles stopping, and stops for
 * platoons arriving from the previous intersection (what a green wave targets).
 */
export default function CoordinationImpact({ controlMode, summary, baseline, elapsedTime }) {
  const ready = baseline && elapsedTime >= 120;
  const rows = [
    { label: 'Average delay', value: `${summary.avgDelay.toFixed(1)}s`, base: baseline && `${baseline.avgDelay.toFixed(1)}s`, delta: ready ? change(summary.avgDelay, baseline.avgDelay) : null },
    { label: 'Vehicles stopping', value: `${summary.stopRate.toFixed(0)}%`, base: baseline && `${baseline.stopRate.toFixed(0)}%`, delta: ready ? change(summary.stopRate, baseline.stopRate) : null },
    { label: 'Platoons stopping', value: `${summary.platoonStopRate.toFixed(0)}%`, base: baseline && `${baseline.platoonStopRate.toFixed(0)}%`, delta: ready ? change(summary.platoonStopRate, baseline.platoonStopRate) : null },
  ];

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            Coordination Impact
          </span>
          <Badge variant="outline" className="text-xs">
            {controlMode === 'adaptive' ? 'Adaptive' : 'Green wave'} vs uncoordinated
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!ready ? (
          <p className="text-sm text-slate-500">
            Run the simulation for 2 minutes to compare against uncoordinated fixed-time signals on the same traffic.
          </p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500">
                  <th className="text-left font-medium pb-1">Metric</th>
                  <th className="text-right font-medium pb-1">This run</th>
                  <th className="text-right font-medium pb-1">Uncoordinated</th>
                  <th className="text-right font-medium pb-1">Change</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-slate-100">
                    <td className="py-1.5 text-slate-700">{r.label}</td>
                    <td className="py-1.5 text-right font-semibold text-slate-900">{r.value}</td>
                    <td className="py-1.5 text-right text-slate-500">{r.base}</td>
                    <td className="py-1.5 text-right"><Delta value={r.delta} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Object.keys(summary.platoonStopRateByDir).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(summary.platoonStopRateByDir).map(([dir, rate]) => (
                  <Badge key={dir} variant="secondary" className="text-xs font-normal">
                    {DIR_LABELS[dir] || dir} platoons stop {rate.toFixed(0)}%
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
        <p className="text-xs text-slate-500">
          {controlMode === 'adaptive'
            ? 'Each signal reacts to its own queues. This usually cuts delay, but signals ignore platoons coming from upstream.'
            : 'Synchronized signals are offset by the travel time between them, so southbound and eastbound platoons arrive on green.'}
        </p>
      </CardContent>
    </Card>
  );
}
