import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart as LineChartIcon, Download } from 'lucide-react';
import { toCsv, downloadText } from '@/lib/csv';

const SERIES = {
  wait: {
    label: 'Avg wait (s)',
    current: 'avgWaitTime',
    baseline: 'baselineAvgWaitTime',
  },
  queue: {
    label: 'Queued vehicles',
    current: 'queueLength',
    baseline: 'baselineQueueLength',
  },
};

const CSV_COLUMNS = [
  { key: 't', label: 'time_s' },
  { key: 'avgWaitTime', label: 'avg_wait_s' },
  { key: 'queueLength', label: 'queue_vehicles' },
  { key: 'throughput', label: 'throughput_veh_per_h' },
  { key: 'stopRate', label: 'stop_rate_pct' },
  { key: 'efficiency', label: 'green_efficiency_pct' },
  { key: 'co2Saved', label: 'co2_saved_kg' },
  { key: 'baselineAvgWaitTime', label: 'baseline_avg_wait_s' },
  { key: 'baselineQueueLength', label: 'baseline_queue_vehicles' },
];

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * Time series of the current run, with the fixed-time baseline when running
 * adaptive control, and a CSV export of every sample.
 */
export default function SimulationTimeline({ history, controlMode, seed, scenarioName, settings = {} }) {
  const [metric, setMetric] = useState('wait');
  const series = SERIES[metric];
  const showBaseline = controlMode === 'adaptive' && history.some((p) => p[series.baseline] !== null);

  const exportCsv = () => {
    const preamble = [
      ['scenario', scenarioName || 'Ad-hoc run'],
      ['control_mode', controlMode],
      ['seed', seed ?? ''],
      ...Object.entries(settings),
      ['exported_at', new Date().toISOString()],
    ];
    const csv = toCsv(history, CSV_COLUMNS, preamble);
    const safeName = (scenarioName || 'simulation').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadText(`${safeName}-${controlMode}-${seed ?? 'run'}.csv`, csv);
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <LineChartIcon className="w-5 h-5 text-blue-600" />
          <span>Run Timeline</span>
          <div className="ml-auto flex items-center gap-1">
            {Object.entries(SERIES).map(([key, s]) => (
              <Button
                key={key}
                size="sm"
                variant={metric === key ? 'default' : 'outline'}
                className="h-7 text-xs"
                onClick={() => setMetric(key)}
              >
                {s.label}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={exportCsv}
              disabled={history.length === 0}
              aria-label="Export run data as CSV"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              CSV
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length < 2 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            Start the simulation to see how wait time and queues develop over the run.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={history} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="t" tickFormatter={formatTime} tick={{ fontSize: 11 }} minTickGap={30} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                labelFormatter={(t) => `t = ${formatTime(t)}`}
                formatter={(v) => (typeof v === 'number' ? v.toFixed(1) : v)}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey={series.current}
                name={controlMode === 'adaptive' ? 'Adaptive' : 'Fixed-time'}
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              {showBaseline && (
                <Line
                  type="monotone"
                  dataKey={series.baseline}
                  name="Fixed-time baseline"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
        {seed !== null && seed !== undefined && (
          <p className="mt-2 text-xs text-slate-500">
            Run seed <span className="font-mono">{seed}</span>. Enter it in the seed box to replay exactly the same traffic.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
