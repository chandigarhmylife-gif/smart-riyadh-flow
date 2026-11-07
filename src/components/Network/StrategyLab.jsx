import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, ErrorBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlaskConical, Download, Loader2 } from 'lucide-react';
import { STRATEGIES, BASELINE_STRATEGY, runExperimentAsync } from '@/lib/experiments';
import { toCsv, downloadText } from '@/lib/csv';

const COLORS = { independent: '#94a3b8', coordinated: '#2563eb', adaptive: '#f59e0b', 'adaptive-platoon': '#16a34a' };
const label = (key) => STRATEGIES.find((s) => s.key === key)?.label || key;
const pm = (ci, digits = 1) => `${ci.mean.toFixed(digits)} ± ${ci.half.toFixed(digits)}`;

function createWorker() {
  try {
    if (typeof Worker === 'undefined') return null;
    return new Worker(new URL('../../workers/strategyLab.worker.js', import.meta.url), { type: 'module' });
  } catch {
    return null;
  }
}

/**
 * Runs every control strategy on the current corridor, many times, with
 * identical traffic for each strategy in a run, and reports means with 95%
 * confidence intervals plus a paired comparison against uncoordinated signals.
 */
export default function StrategyLab({ nodes, conditions }) {
  const [seeds, setSeeds] = useState('10');
  const [minutes, setMinutes] = useState('30');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => () => workerRef.current?.terminate(), []);

  const run = async () => {
    setRunning(true);
    setError(null);
    setProgress(0);
    const options = { seeds: Number(seeds), durationS: Number(minutes) * 60, ...conditions };
    const plainNodes = nodes.map(({ id, name, status, coordination, mapPos }) => ({ id, name, status, coordination, mapPos }));
    const finish = (res) => {
      setResult(res);
      setRunning(false);
    };
    const fail = (message) => {
      setError(message);
      setRunning(false);
    };

    const worker = createWorker();
    if (worker) {
      workerRef.current?.terminate();
      workerRef.current = worker;
      worker.onmessage = (e) => {
        if (e.data.type === 'progress') setProgress((e.data.done / e.data.total) * 100);
        if (e.data.type === 'done') { finish(e.data.result); worker.terminate(); }
        if (e.data.type === 'error') { fail(e.data.message); worker.terminate(); }
      };
      worker.onerror = (e) => { fail(e.message || 'Experiment failed'); worker.terminate(); };
      worker.postMessage({ nodes: plainNodes, options });
    } else {
      try {
        finish(await runExperimentAsync(plainNodes, options, (done, total) => setProgress((done / total) * 100)));
      } catch (e) {
        fail(e?.message || 'Experiment failed');
      }
    }
  };

  const exportCsv = () => {
    const columns = [
      { key: 'strategy' }, { key: 'seed' },
      { key: 'avgDelay', label: 'avg_delay_s' }, { key: 'stopRate', label: 'stop_rate_pct' },
      { key: 'platoonStopRate', label: 'platoon_stop_rate_pct' }, { key: 'spillbackSeconds', label: 'spillback_link_seconds' },
    ];
    const s = result.settings;
    const preamble = [
      ['runs_per_strategy', s.seeds], ['duration_s', s.durationS], ['weather', s.weather],
      ['transit_priority', s.transitPriority], ['heavy_vehicle_share', s.heavyVehicleShare],
      ['incidents', (s.incidents || []).map((i) => `${i.id}:${i.share}`).join(' ') || 'none'],
    ];
    downloadText(`strategy-lab-${s.seeds}x${Math.round(s.durationS / 60)}min.csv`, toCsv(result.runs, columns, preamble));
  };

  const chartData = result
    ? STRATEGIES.map((s) => ({ key: s.key, name: label(s.key), mean: result.byStrategy[s.key].avgDelay.mean, err: result.byStrategy[s.key].avgDelay.half }))
    : [];
  const best = result ? chartData.reduce((a, b) => (b.mean < a.mean ? b : a)) : null;

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <FlaskConical className="w-5 h-5 text-purple-600" />
          Strategy Lab
          <span className="text-xs font-normal text-slate-500">Compare every control strategy on identical traffic</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Select value={seeds} onValueChange={setSeeds} disabled={running}>
            <SelectTrigger className="w-36" aria-label="Runs per strategy"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 runs each</SelectItem>
              <SelectItem value="10">10 runs each</SelectItem>
              <SelectItem value="20">20 runs each</SelectItem>
            </SelectContent>
          </Select>
          <Select value={minutes} onValueChange={setMinutes} disabled={running}>
            <SelectTrigger className="w-32" aria-label="Simulated time per run"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 min</SelectItem>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="60">60 min</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={run} disabled={running}>
            {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FlaskConical className="w-4 h-4 mr-2" />}
            {running ? 'Running…' : 'Run experiment'}
          </Button>
          {result && !running && (
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="w-4 h-4 mr-1" /> CSV
            </Button>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Uses the corridor as currently set up: synchronized signals, switched-off signals, incidents, weather, bus priority and vehicle mix.
        </p>

        {running && <Progress value={progress} aria-label="Experiment progress" />}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        {result && !running && (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500">
                    <th className="text-left font-medium pb-1">Strategy</th>
                    <th className="text-right font-medium pb-1">Avg delay (s)</th>
                    <th className="text-right font-medium pb-1">Stopping (%)</th>
                    <th className="text-right font-medium pb-1">Platoons (%)</th>
                    <th className="text-right font-medium pb-1">Δ delay vs uncoord.</th>
                  </tr>
                </thead>
                <tbody>
                  {STRATEGIES.map((s) => {
                    const r = result.byStrategy[s.key];
                    const p = result.paired[s.key];
                    return (
                      <tr key={s.key} className="border-t border-slate-100">
                        <td className="py-1.5 font-medium" style={{ color: COLORS[s.key] }}>{s.label}</td>
                        <td className="py-1.5 text-right">{pm(r.avgDelay)}</td>
                        <td className="py-1.5 text-right">{pm(r.stopRate, 0)}</td>
                        <td className="py-1.5 text-right">{pm(r.platoonStopRate, 0)}</td>
                        <td className="py-1.5 text-right">
                          {s.key === BASELINE_STRATEGY ? '—' : (
                            <span className={p.significant ? (p.mean < 0 ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold') : 'text-slate-500'}>
                              {p.mean >= 0 ? '+' : ''}{p.mean.toFixed(1)} ± {p.half.toFixed(1)}{p.significant ? ' ✓' : ''}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-xs text-slate-500 mt-2">
                Means ± 95% confidence interval over {result.settings.seeds} runs of {Math.round(result.settings.durationS / 60)} min.
                Δ is a paired comparison on the same traffic; ✓ means the difference is statistically significant.
                {best && ` Lowest delay: ${best.name}.`}
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: 's', angle: 0, position: 'insideTopLeft', fontSize: 11 }} />
                <Tooltip formatter={(v) => `${Number(v).toFixed(1)} s`} />
                <Bar dataKey="mean" name="Avg delay" isAnimationActive={false}>
                  {chartData.map((d) => <Cell key={d.key} fill={COLORS[d.key]} />)}
                  <ErrorBar dataKey="err" width={6} strokeWidth={1.5} stroke="#334155" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
