import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { levelOfService, LOS_DESCRIPTIONS } from '@/lib/timingAdvisor';

const LOS_COLORS = {
  A: 'bg-green-600',
  B: 'bg-green-500',
  C: 'bg-lime-500',
  D: 'bg-amber-500',
  E: 'bg-orange-600',
  F: 'bg-red-600',
};

export function LosBadge({ los, className = '' }) {
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white ${LOS_COLORS[los] || 'bg-slate-400'} ${className}`}
      title={`Level of Service ${los}: ${LOS_DESCRIPTIONS[los] || ''}`}
    >
      {los}
    </span>
  );
}

const fmtDelay = (d) => (Number.isFinite(d) ? `${d.toFixed(1)}s` : 'over capacity');

/**
 * Webster's optimum fixed-time plan for the current demand, compared with
 * the standard plan, plus HCM Level of Service for the plans and the live run.
 */
export default function TimingAdvisor({ advice, liveDelay, isRunning, elapsedSeconds, controlMode, onUseOptimized }) {
  const { optimized, standard, demand, saturationFlow } = advice;
  const rows = [
    { key: 'standard', label: 'Standard plan', plan: standard },
    { key: 'optimized', label: "Webster's optimum", plan: optimized },
  ];
  const liveReady = elapsedSeconds >= 300;
  const approachOrder = ['north', 'south', 'east', 'west'];

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="w-5 h-5 text-indigo-600" />
          Signal Timing Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-xs text-slate-500">
          Demand {Math.round(demand.north)}–{Math.round(Math.max(...Object.values(demand)))} veh/h per approach;
          saturation flow {Math.round(saturationFlow)} veh/h.
        </p>

        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="text-left font-medium pb-1">Plan</th>
              <th className="text-right font-medium pb-1">Cycle</th>
              <th className="text-right font-medium pb-1">Greens</th>
              <th className="text-right font-medium pb-1">Delay</th>
              <th className="text-right font-medium pb-1">LOS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-slate-100">
                <td className="py-1.5 text-slate-700">{r.label}</td>
                <td className="py-1.5 text-right">{r.plan.cycle}s</td>
                <td className="py-1.5 text-right">{r.plan.nsGreen}/{r.plan.ewGreen}</td>
                <td className="py-1.5 text-right">{fmtDelay(r.plan.delay)}</td>
                <td className="py-1.5 text-right"><LosBadge los={r.plan.los} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <p className="text-xs text-slate-500 mb-1">Degree of saturation (v/c), optimum plan</p>
          <div className="grid grid-cols-4 gap-1.5">
            {approachOrder.map((d) => {
              const a = optimized.approaches[d];
              const pct = Math.min(100, a.vc * 100);
              return (
                <div key={d} className="text-center">
                  <div className="h-1.5 rounded bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${a.vc >= 0.9 ? 'bg-red-500' : a.vc >= 0.75 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-600 capitalize">{d} {a.vc.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {optimized.oversaturated && (
          <p className="text-xs text-red-600">
            Demand is near or above capacity (flow ratio {optimized.Y.toFixed(2)}). No fixed-time plan can clear it; queues will grow.
          </p>
        )}
        {optimized.minGreen > 10 && (
          <p className="text-xs text-slate-500">Greens are at least {optimized.minGreen}s so pedestrians can cross.</p>
        )}

        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <span className="text-xs text-slate-600">
            This run ({controlMode}): {liveReady ? `${liveDelay.toFixed(1)}s avg wait` : 'needs 5 min of simulation'}
          </span>
          {liveReady && <LosBadge los={levelOfService(liveDelay)} />}
        </div>

        {controlMode !== 'optimized' && (
          <Button size="sm" variant="outline" className="w-full" onClick={onUseOptimized} disabled={isRunning}>
            Run Webster's optimum plan
          </Button>
        )}
        <p className="text-[11px] text-slate-400">
          Webster (1958) cycle and splits; delay from Webster's formula; LOS per HCM signalized-intersection thresholds.
        </p>
      </CardContent>
    </Card>
  );
}
