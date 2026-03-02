import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  X, Printer, FileDown, TrendingUp, AlertTriangle, CheckCircle,
  Zap, Leaf, Car, Clock, Users, Target
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area,
} from 'recharts';
import { TEMPLATE_CONFIGS } from './templateConfigs';
import {
  EnvironmentalLayout, PeakHourLayout, MonthlyTrendLayout,
  SafetyLayout, NetworkLayout, ROILayout,
} from './ExtraLayouts';

const ICON_MAP = { Clock, Car, Zap, Leaf, AlertTriangle, TrendingUp, Users, Target };
const LOS_COLOR = {
  A: 'bg-green-100 text-green-700', B: 'bg-blue-100 text-blue-700',
  C: 'bg-yellow-100 text-yellow-700', D: 'bg-orange-100 text-orange-700',
};

// ── Shared: KPI Card ──────────────────────────────────────────────────────────
function KPICard({ icon: IconName, label, ai, fixed, unit, better, theme }) {
  const Icon = ICON_MAP[IconName] || Zap;
  const rawPct = better === 'lower'
    ? Math.round(((fixed - ai) / fixed) * 100)
    : Math.round(((ai - fixed) / fixed) * 100);
  const pct = Math.abs(rawPct);
  return (
    <div className={`bg-white rounded-xl border p-4 flex flex-col gap-2 shadow-sm ${theme.accentBorder}`}>
      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">
        <Icon className={`w-4 h-4 ${theme.accentText}`} /> {label}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-2xl font-bold ${theme.kpiColor}`}>{ai}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span></p>
          <p className="text-xs text-slate-400">Baseline: {fixed}{unit}</p>
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${theme.badgeGood}`}>
          <TrendingUp className="w-3 h-3" /> {pct}% better
        </div>
      </div>
    </div>
  );
}

// ── Shared: Section Header ────────────────────────────────────────────────────
function SectionHeader({ number, title, gradient }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl bg-gradient-to-r ${gradient} px-5 py-3 mb-4`}>
      <span className="text-white/60 text-lg font-bold">{number}</span>
      <h2 className="text-white text-lg font-bold tracking-wide">{title}</h2>
    </div>
  );
}

// ── Shared: AI Narrative ──────────────────────────────────────────────────────
function NarrativeSection({ content, sectionNum, gradient, theme }) {
  return (
    <div>
      <SectionHeader number={sectionNum} title="Full AI-Generated Narrative" gradient={gradient} />
      <div className={`bg-white rounded-xl border ${theme.accentBorder} p-6 shadow-sm prose prose-slate max-w-none
        prose-headings:text-slate-900 prose-headings:font-bold
        prose-h1:text-2xl prose-h1:border-b prose-h1:pb-2 prose-h1:mb-4
        prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3
        prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
        prose-p:text-slate-700 prose-p:leading-relaxed
        prose-strong:text-slate-900
        prose-table:w-full prose-th:bg-slate-100 prose-th:px-3 prose-th:py-2 prose-th:text-left
        prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-slate-200
        prose-li:text-slate-700
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded
      `}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  TEMPLATE 1 — Performance Summary (Green/Teal, Executive)
// ════════════════════════════════════════════════════════════════════
function SummaryLayout({ report, config }) {
  const { theme, chartData, kpis, recommendations, coverStats } = config;
  const g = theme.headerGradients;
  return (
    <div className="space-y-8">
      {/* Cover */}
      <div className={`bg-gradient-to-br ${theme.cover} rounded-2xl p-8 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute rounded-full border-2 border-white"
              style={{ width: (i + 1) * 80, height: (i + 1) * 80, top: 16, right: 16 }} />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white/20 rounded-lg p-1.5"><Zap className="w-5 h-5 text-yellow-300" /></div>
            <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Smart Riyadh Flow · Executive Report</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-1">{report.title}</h1>
          <p className="text-emerald-200 text-sm mb-6">Audience: {config.audience} · Classification: Confidential</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {coverStats.map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-emerald-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className={`${theme.accentBg} border ${theme.accentBorder} rounded-xl p-4`}>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">This Report Covers</p>
        <div className="flex flex-wrap gap-2">
          {config.focusAreas.map(f => (
            <span key={f} className={`${theme.badgeGood} px-3 py-1 rounded-full text-xs font-medium`}>{f}</span>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div>
        <SectionHeader number="01" title="Key Performance Indicators" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}
        </div>
      </div>

      {/* Wait Time by Period — Horizontal Bar style */}
      <div>
        <SectionHeader number="02" title="Wait Time by Traffic Period" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-3">Average seconds per period — AI vs Fixed-Time</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.waitBar} layout="vertical" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} unit="s" />
              <YAxis type="category" dataKey="period" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={v => `${v}s`} />
              <Legend />
              <Bar dataKey="ai" name="AI Adaptive" fill={theme.accent} radius={[0, 4, 4, 0]} />
              <Bar dataKey="fixed" name="Fixed-Time" fill="#CBD5E1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emissions Donut */}
      <div>
        <SectionHeader number="03" title="Environmental Impact Summary" gradient={g[2]} />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={chartData.emissionsPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill={theme.accent} />
                  <Cell fill="#E2E8F0" />
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <p className={`text-3xl font-extrabold ${theme.accentText} -mt-2`}>42%</p>
            <p className="text-xs text-slate-500">CO₂ reduction vs fixed-time</p>
            <p className="text-xs text-slate-400 mt-1">≈ 4.2 tons/day · 1,533 tons/year</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            {[
              { label: 'CO₂ Saved Daily', value: '4.2 T', sub: '1,533 T/year' },
              { label: 'Fuel Saved', value: '12,400 L/day', sub: '≈ SAR 3.3M/year' },
              { label: 'Noise Reduction', value: '−8 dB', sub: 'Fewer stop-and-go events' },
              { label: 'Vision 2030 Align.', value: '✓ Certified', sub: 'Sustainability KPI met' },
            ].map(e => (
              <div key={e.label} className={`flex justify-between items-center p-2 rounded-lg ${theme.accentBg}`}>
                <div>
                  <p className="text-xs font-semibold text-slate-700">{e.label}</p>
                  <p className="text-xs text-slate-400">{e.sub}</p>
                </div>
                <p className={`font-bold text-sm ${theme.accentText}`}>{e.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <SectionHeader number="04" title="Strategic Recommendations" gradient={g[0]} />
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-sm">
              <span className={`mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full h-fit flex-shrink-0 ${rec.priority === 'High' ? 'bg-red-100 text-red-700' : rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : theme.badgeGood}`}>
                {rec.priority}
              </span>
              <div className="flex-1">
                <p className="text-sm text-slate-800">{rec.text}</p>
                <p className="text-xs text-slate-400 mt-1">Responsible: {rec.dept}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NarrativeSection content={report.content} sectionNum="05" gradient={g[2]} theme={theme} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  TEMPLATE 2 — Daily Analysis (Blue/Indigo, Operational)
// ════════════════════════════════════════════════════════════════════
function DailyLayout({ report, config }) {
  const { theme, chartData, kpis, coverStats } = config;
  const g = theme.headerGradients;
  return (
    <div className="space-y-8">
      {/* Cover — diagonal stripe style */}
      <div className={`bg-gradient-to-r ${theme.cover} rounded-2xl p-8 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute w-px bg-white" style={{ left: `${i * 14}%`, top: 0, bottom: 0, transform: 'rotate(15deg)' }} />
          ))}
        </div>
        <div className="relative z-10">
          <span className="bg-white/20 text-white/80 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-widest">Daily Operations Report</span>
          <h1 className="text-3xl font-extrabold mt-4 mb-1">{report.title}</h1>
          <p className="text-blue-200 text-sm mb-6">Prepared for: {config.audience}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {coverStats.map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div>
        <SectionHeader number="01" title="Daily KPI Snapshot" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}
        </div>
      </div>

      {/* Hourly Line Chart */}
      <div>
        <SectionHeader number="02" title="24-Hour Wait Time Profile" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-3">Avg wait time (seconds) per hour — AI vs Fixed-Time</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData.hourlyLine}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} unit="s" />
              <Tooltip formatter={v => `${v}s`} />
              <Legend />
              <Line type="monotone" dataKey="ai" name="AI Adaptive" stroke={theme.accent} strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="fixed" name="Fixed-Time" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Intersection Table */}
      <div>
        <SectionHeader number="03" title="Intersection-Level Performance" gradient={g[2]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className={`${theme.tableHeader} text-white`}>
              <tr>
                {['Intersection', 'LOS', 'Wait (AI)', 'Volume', 'Flow %', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.intersectionData.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50'}>
                  <td className="px-4 py-3 font-medium text-slate-800">{row.name}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${LOS_COLOR[row.los]}`}>{row.los}</span></td>
                  <td className="px-4 py-3 text-slate-700">{row.wait}s</td>
                  <td className="px-4 py-3 text-slate-600">{row.volume.toLocaleString()} v</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${row.flow}%`, backgroundColor: theme.accent }} />
                      </div>
                      <span className="text-xs text-slate-500">{row.flow}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {row.flow >= 85
                      ? <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3 h-3" /> Optimal</span>
                      : <span className="flex items-center gap-1 text-yellow-600 text-xs"><AlertTriangle className="w-3 h-3" /> Monitor</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Log */}
      <div>
        <SectionHeader number="04" title="Incident & Anomaly Log" gradient={g[3]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                {['Time', 'Location', 'Type', 'Duration', 'System Response'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.incidents.map((inc, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{inc.time}</td>
                  <td className="px-4 py-3 text-slate-800">{inc.location}</td>
                  <td className="px-4 py-3"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">{inc.type}</span></td>
                  <td className="px-4 py-3 text-slate-600">{inc.duration}</td>
                  <td className="px-4 py-3 text-green-700 text-xs">{inc.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NarrativeSection content={report.content} sectionNum="05" gradient={g[1]} theme={theme} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  TEMPLATE 3 — Comparison Report (Purple/Violet, Policy)
// ════════════════════════════════════════════════════════════════════
function ComparisonLayout({ report, config }) {
  const { theme, chartData, kpis, coverStats } = config;
  const g = theme.headerGradients;
  return (
    <div className="space-y-8">
      {/* Cover — split panel style */}
      <div className={`bg-gradient-to-br ${theme.cover} rounded-2xl p-8 text-white`}>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-yellow-300" />
          <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Comparative Analysis · Smart Riyadh Flow</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-1">{report.title}</h1>
        <p className="text-purple-200 text-sm mb-6">Audience: {config.audience}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {coverStats.map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-purple-200 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs — side by side diff cards */}
      <div>
        <SectionHeader number="01" title="Key Metric Deltas: AI vs Fixed" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}
        </div>
      </div>

      {/* Radar Chart */}
      <div>
        <SectionHeader number="02" title="Multi-Dimensional Performance Radar" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-3">Normalized score (0–100) across 7 performance dimensions</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={chartData.radar}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <Radar name="AI Adaptive" dataKey="ai" stroke={theme.accent} fill={theme.accent} fillOpacity={0.3} />
              <Radar name="Fixed-Time" dataKey="fixed" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.2} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Throughput Bar */}
      <div>
        <SectionHeader number="03" title="Weekly Throughput Comparison" gradient={g[2]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData.weeklyBar} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ai" name="AI Adaptive" fill={theme.accent} radius={[4, 4, 0, 0]} />
              <Bar dataKey="fixed" name="Fixed-Time" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div>
        <SectionHeader number="04" title="Full Metric Comparison Matrix" gradient={g[0]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className={`${theme.tableHeader} text-white`}>
              <tr>
                {['Metric', 'Fixed-Time', 'AI Adaptive', 'Improvement', 'Annual Impact'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.comparisonRows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-purple-50'}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{row.metric}</td>
                  <td className="px-4 py-3 text-slate-500">{row.fixed}</td>
                  <td className={`px-4 py-3 font-semibold ${theme.kpiColor}`}>{row.ai}</td>
                  <td className="px-4 py-3"><span className={`${theme.badgeGood} px-2 py-0.5 rounded-full text-xs font-bold`}>{row.imp}</span></td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{row.annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NarrativeSection content={report.content} sectionNum="05" gradient={g[1]} theme={theme} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  TEMPLATE 4 — Performance Metrics (Orange/Amber, Technical)
// ════════════════════════════════════════════════════════════════════
function PerformanceLayout({ report, config }) {
  const { theme, chartData, kpis, coverStats } = config;
  const g = theme.headerGradients;
  return (
    <div className="space-y-8">
      {/* Cover — data-dense grid */}
      <div className={`bg-gradient-to-br ${theme.cover} rounded-2xl p-8 text-white relative overflow-hidden`}>
        <div className="absolute bottom-0 left-0 w-full h-24 opacity-10"
          style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Technical KPI Report · Engineering Grade</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-1">{report.title}</h1>
          <p className="text-amber-200 text-sm mb-6">Audience: {config.audience}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {coverStats.map(s => (
              <div key={s.label} className="bg-black/20 rounded-xl p-3 text-center">
                <p className="text-xl font-bold font-mono">{s.value}</p>
                <p className="text-xs text-amber-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div>
        <SectionHeader number="01" title="Advanced KPI Measurements" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}
        </div>
      </div>

      {/* Throughput Area Chart with Target Line */}
      <div>
        <SectionHeader number="02" title="Weekly Throughput vs Target" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-3">Vehicles/hr vs design capacity target (2,000 v/hr)</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData.throughputLine}>
              <defs>
                <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.accent} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="ai" name="AI Adaptive" stroke={theme.accent} fill="url(#aiGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="fixed" name="Fixed-Time" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="8 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Queue Length Bar */}
      <div>
        <SectionHeader number="03" title="Average Queue Length by Intersection" gradient={g[2]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-3">Average vehicles queued per cycle</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData.queueBar} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="intersection" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" veh" />
              <Tooltip />
              <Legend />
              <Bar dataKey="aiQ" name="AI Adaptive" fill={theme.accent} radius={[4, 4, 0, 0]} />
              <Bar dataKey="fixedQ" name="Fixed-Time" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technical Metrics Table */}
      <div>
        <SectionHeader number="04" title="Technical Metrics vs Global Benchmarks" gradient={g[3]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className={`${theme.tableHeader} text-white`}>
              <tr>
                {['Metric', 'AI Adaptive', 'Fixed-Time', 'Benchmark', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.metricsRows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{row.metric}</td>
                  <td className={`px-4 py-3 font-mono font-bold ${theme.kpiColor}`}>{row.ai}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{row.fixed}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{row.benchmark}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NarrativeSection content={report.content} sectionNum="05" gradient={g[0]} theme={theme} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  ROOT MODAL
// ════════════════════════════════════════════════════════════════════
export default function GeneratedReportModal({ report, onClose }) {
  const templateType = report.templateType || 'summary';
  const config = TEMPLATE_CONFIGS[templateType] || TEMPLATE_CONFIGS.summary;
  const { theme } = config;

  const handlePrint = () => window.print();

  const renderLayout = () => {
    switch (templateType) {
      case 'daily':          return <DailyLayout report={report} config={config} />;
      case 'comparison':     return <ComparisonLayout report={report} config={config} />;
      case 'performance':    return <PerformanceLayout report={report} config={config} />;
      case 'environmental':  return <EnvironmentalLayout report={report} config={config} />;
      case 'peak_hour':      return <PeakHourLayout report={report} config={config} />;
      case 'monthly_trend':  return <MonthlyTrendLayout report={report} config={config} />;
      case 'safety':         return <SafetyLayout report={report} config={config} />;
      case 'network':        return <NetworkLayout report={report} config={config} />;
      case 'roi':            return <ROILayout report={report} config={config} />;
      default:               return <SummaryLayout report={report} config={config} />;
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-print-content, #report-print-content * { visibility: visible; }
          #report-print-content {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            overflow: visible;
            background: white;
            z-index: 9999;
            padding: 20px;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div id="report-print-root" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
        <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">

          {/* Toolbar */}
          <div className="no-print flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white rounded-t-2xl flex-shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{report.title}</h2>
              <p className="text-xs text-slate-400">
                {config.label} · Generated {new Date().toLocaleString()} · Smart Riyadh Flow
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className={`text-white`} style={{ backgroundColor: config.theme.accent }} onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" /> Download PDF
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
            </div>
          </div>

          {/* Report Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 rounded-b-2xl">
            <div id="report-print-content">
            {renderLayout()}

            {/* Footer */}
            <div className={`mt-8 bg-gradient-to-r ${theme.cover} rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-white`}>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="font-bold text-sm">Smart Riyadh Flow · AI Traffic Control System</span>
              </div>
              <div className="text-xs text-white/60 text-center sm:text-right">
                <p>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>Template: {config.label} · Confidential · For Official Use Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}