import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import { AlertTriangle, CheckCircle, TrendingUp, Zap, Leaf, Car, Clock, Target } from 'lucide-react';

const ICON_MAP = { Clock, Car, Zap, Leaf, AlertTriangle, TrendingUp, Target };
const LOS_COLOR = { A: 'bg-green-100 text-green-700', B: 'bg-blue-100 text-blue-700', C: 'bg-yellow-100 text-yellow-700' };
const PIE_PALETTE = ['#10B981','#3B82F6','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#F97316'];

function KPICard({ icon: IconName, label, ai, fixed, unit, better, theme }) {
  const Icon = ICON_MAP[IconName] || Zap;
  const rawPct = better === 'lower'
    ? Math.round(((fixed - ai) / (fixed || 1)) * 100)
    : Math.round(((ai - fixed) / (fixed || 1)) * 100);
  const pct = Math.abs(rawPct);
  return (
    <div className={`bg-white rounded-xl border p-4 flex flex-col gap-2 shadow-sm ${theme.accentBorder}`}>
      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">
        <Icon className={`w-4 h-4 ${theme.accentText}`} /> {label}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-2xl font-bold ${theme.kpiColor}`}>{ai}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span></p>
          {fixed !== 0 && <p className="text-xs text-slate-400">Baseline: {fixed}{unit}</p>}
        </div>
        {pct > 0 && (
          <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${theme.badgeGood}`}>
            <TrendingUp className="w-3 h-3" /> {pct}% better
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ number, title, gradient }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl bg-gradient-to-r ${gradient} px-5 py-3 mb-4`}>
      <span className="text-white/60 text-lg font-bold">{number}</span>
      <h2 className="text-white text-lg font-bold tracking-wide">{title}</h2>
    </div>
  );
}

function NarrativeSection({ content, sectionNum, gradient, theme }) {
  return (
    <div>
      <SectionHeader number={sectionNum} title="Full AI-Generated Narrative" gradient={gradient} />
      <div className={`bg-white rounded-xl border ${theme.accentBorder} p-6 shadow-sm prose prose-slate max-w-none
        prose-headings:font-bold prose-h1:text-2xl prose-h1:border-b prose-h1:pb-2 prose-h1:mb-4
        prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3 prose-p:text-slate-700 prose-p:leading-relaxed
        prose-table:w-full prose-th:bg-slate-100 prose-th:px-3 prose-th:py-2 prose-th:text-left
        prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-slate-200 prose-li:text-slate-700
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded`}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// 5. ENVIRONMENTAL IMPACT
// ════════════════════════════════════════════
export function EnvironmentalLayout({ report, config }) {
  const { theme, chartData, kpis, coverStats } = config;
  const g = theme.headerGradients;
  return (
    <div className="space-y-8">
      <div className={`bg-gradient-to-br ${theme.cover} rounded-2xl p-8 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4"><Leaf className="w-5 h-5 text-lime-300" /><span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Environmental Impact · Smart Riyadh Flow</span></div>
          <h1 className="text-3xl font-extrabold mb-1">{report.title}</h1>
          <p className="text-green-200 text-sm mb-6">Audience: {config.audience}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{coverStats.map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center"><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-green-200 mt-0.5">{s.label}</p></div>
          ))}</div>
        </div>
      </div>

      <div><SectionHeader number="01" title="Environmental KPIs" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}</div>
      </div>

      <div><SectionHeader number="02" title="Monthly CO₂ Emissions Trend (tons/day)" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData.monthlyEmissions}>
              <defs>
                <linearGradient id="ecoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.accent} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.accent} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" T" />
              <Tooltip formatter={v => `${v} T/day`} />
              <Legend />
              <Area type="monotone" dataKey="ai" name="AI Adaptive" stroke={theme.accent} fill="url(#ecoGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="fixed" name="Fixed-Time" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><SectionHeader number="03" title="Vehicle Mix Emissions Share" gradient={g[2]} />
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={chartData.vehicleTypePie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                  {chartData.vehicleTypePie.map((_, i) => <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div><SectionHeader number="04" title="Impact Equivalents" gradient={g[0]} />
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
            {[{ icon: '🌳', label: 'Trees Equivalent', value: '70,300 / year' }, { icon: '⛽', label: 'Fuel Saved', value: '4.5M L / year' }, { icon: '🏭', label: 'CO₂ Avoided', value: '1,533 T / year' }, { icon: '🔇', label: 'Noise Reduction', value: '−8 dB average' }, { icon: '🎯', label: 'Vision 2030', value: 'Sustainability KPI ✓' }].map(e => (
              <div key={e.label} className={`flex justify-between items-center px-3 py-2 rounded-lg ${theme.accentBg}`}>
                <span className="text-sm">{e.icon} <span className="text-slate-700 font-medium">{e.label}</span></span>
                <span className={`font-bold text-sm ${theme.kpiColor}`}>{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div><SectionHeader number="05" title="Environmental Impact Summary Table" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className={`${theme.tableHeader} text-white`}>
              <tr>{['Category', 'Daily Saving', 'Annual', 'Equivalent', 'Vision 2030'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.impactRows.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{r.category}</td>
                  <td className={`px-4 py-3 font-bold ${theme.kpiColor}`}>{r.daily}</td>
                  <td className="px-4 py-3 text-slate-700">{r.annual}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{r.equivalent}</td>
                  <td className="px-4 py-3 text-center text-green-600 font-bold">{r.vision2030}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NarrativeSection content={report.content} sectionNum="06" gradient={g[2]} theme={theme} />
    </div>
  );
}

// ════════════════════════════════════════════
// 6. PEAK HOUR ANALYSIS
// ════════════════════════════════════════════
export function PeakHourLayout({ report, config }) {
  const { theme, chartData, kpis, coverStats } = config;
  const g = theme.headerGradients;
  const sevColor = { Critical: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-green-100 text-green-700' };
  return (
    <div className="space-y-8">
      <div className={`bg-gradient-to-br ${theme.cover} rounded-2xl p-8 text-white`}>
        <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-yellow-300" /><span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Peak Hour Report · Traffic Control Room</span></div>
        <h1 className="text-3xl font-extrabold mb-1">{report.title}</h1>
        <p className="text-red-200 text-sm mb-6">Audience: {config.audience}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{coverStats.map(s => (
          <div key={s.label} className="bg-black/20 rounded-xl p-3 text-center"><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-red-200 mt-0.5">{s.label}</p></div>
        ))}</div>
      </div>

      <div><SectionHeader number="01" title="Peak Period KPIs" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}</div>
      </div>

      <div><SectionHeader number="02" title="AM vs PM Peak Wait Time Comparison" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData.hourlyComparison} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="s" />
              <Tooltip formatter={v => `${v}s`} />
              <Legend />
              <Bar dataKey="ai" name="AI Adaptive" fill={theme.accent} radius={[4, 4, 0, 0]} />
              <Bar dataKey="fixed" name="Fixed-Time" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div><SectionHeader number="03" title="Critical Bottleneck Locations" gradient={g[2]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className={`${theme.tableHeader} text-white`}>
              <tr>{['Location', 'Severity', 'Max Queue', 'Clear Time', 'AI Response'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.bottlenecks.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                  <td className="px-4 py-3 font-medium text-slate-800">{r.location}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sevColor[r.severity]}`}>{r.severity}</span></td>
                  <td className="px-4 py-3 text-slate-700">{r.maxQueue}</td>
                  <td className="px-4 py-3 text-slate-700">{r.clearTime}</td>
                  <td className="px-4 py-3 text-green-700 text-xs">{r.aiAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NarrativeSection content={report.content} sectionNum="04" gradient={g[0]} theme={theme} />
    </div>
  );
}

// ════════════════════════════════════════════
// 7. MONTHLY TREND
// ════════════════════════════════════════════
export function MonthlyTrendLayout({ report, config }) {
  const { theme, chartData, kpis, coverStats } = config;
  const g = theme.headerGradients;
  return (
    <div className="space-y-8">
      <div className={`bg-gradient-to-br ${theme.cover} rounded-2xl p-8 text-white`}>
        <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-cyan-300" /><span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Monthly Trend · Planning Report</span></div>
        <h1 className="text-3xl font-extrabold mb-1">{report.title}</h1>
        <p className="text-cyan-200 text-sm mb-6">Audience: {config.audience}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{coverStats.map(s => (
          <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center"><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-cyan-200 mt-0.5">{s.label}</p></div>
        ))}</div>
      </div>

      <div><SectionHeader number="01" title="6-Month Trend KPIs" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}</div>
      </div>

      <div><SectionHeader number="02" title="Efficiency & Wait Time Trends Over 6 Months" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="efficiency" name="Efficiency (%)" stroke={theme.accent} strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="waitAI" name="AI Wait (s)" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="waitFixed" name="Fixed Wait (s)" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div><SectionHeader number="03" title="Growth by Key Metric" gradient={g[2]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.growthBar} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sep" name="Sep 2025" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="feb" name="Feb 2026" fill={theme.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <NarrativeSection content={report.content} sectionNum="04" gradient={g[0]} theme={theme} />
    </div>
  );
}

// ════════════════════════════════════════════
// 8. SAFETY & INCIDENT
// ════════════════════════════════════════════
export function SafetyLayout({ report, config }) {
  const { theme, chartData, kpis, coverStats } = config;
  const g = theme.headerGradients;
  const sevColor = { Critical: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-green-100 text-green-700' };
  return (
    <div className="space-y-8">
      <div className={`bg-gradient-to-br ${theme.cover} rounded-2xl p-8 text-white`}>
        <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-yellow-300" /><span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Safety & Incident Report</span></div>
        <h1 className="text-3xl font-extrabold mb-1">{report.title}</h1>
        <p className="text-yellow-200 text-sm mb-6">Audience: {config.audience}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{coverStats.map(s => (
          <div key={s.label} className="bg-black/20 rounded-xl p-3 text-center"><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-yellow-200 mt-0.5">{s.label}</p></div>
        ))}</div>
      </div>

      <div><SectionHeader number="01" title="Safety KPIs" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}</div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><SectionHeader number="02" title="Weekly Incident Count" gradient={g[1]} />
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.incidentTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="ai" name="AI Controlled" fill={theme.accent} radius={[4, 4, 0, 0]} />
                <Bar dataKey="fixed" name="Fixed-Time" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div><SectionHeader number="03" title="Incident Type Breakdown" gradient={g[2]} />
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData.incidentTypePie} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${value}%`}>
                  {chartData.incidentTypePie.map((_, i) => <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div><SectionHeader number="04" title="Incident Log" gradient={g[0]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className={`${theme.tableHeader} text-white`}>
              <tr>{['Date', 'Location', 'Type', 'Severity', 'Response Time', 'Outcome'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.safetyIncidents.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{r.date}</td>
                  <td className="px-4 py-3 text-slate-800">{r.location}</td>
                  <td className="px-4 py-3 text-slate-700">{r.type}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sevColor[r.severity]}`}>{r.severity}</span></td>
                  <td className="px-4 py-3 text-slate-700">{r.responseTime}</td>
                  <td className="px-4 py-3 text-green-700 text-xs">{r.outcome}</td>
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

// ════════════════════════════════════════════
// 9. NETWORK EFFICIENCY
// ════════════════════════════════════════════
export function NetworkLayout({ report, config }) {
  const { theme, chartData, kpis, coverStats } = config;
  const g = theme.headerGradients;
  return (
    <div className="space-y-8">
      <div className={`bg-gradient-to-br ${theme.cover} rounded-2xl p-8 text-white`}>
        <div className="flex items-center gap-2 mb-4"><Zap className="w-5 h-5 text-sky-300" /><span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Network Efficiency · Smart City Division</span></div>
        <h1 className="text-3xl font-extrabold mb-1">{report.title}</h1>
        <p className="text-sky-200 text-sm mb-6">Audience: {config.audience}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{coverStats.map(s => (
          <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center"><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-sky-200 mt-0.5">{s.label}</p></div>
        ))}</div>
      </div>

      <div><SectionHeader number="01" title="Network KPIs" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}</div>
      </div>

      <div><SectionHeader number="02" title="Corridor Efficiency & Speed" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData.corridorBar} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="corridor" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="efficiency" name="Efficiency (%)" fill={theme.accent} radius={[4, 4, 0, 0]} />
              <Bar dataKey="speed" name="Avg Speed (km/h)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><SectionHeader number="03" title="Network Capability Radar" gradient={g[2]} />
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={chartData.networkRadar}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <Radar name="AI Network" dataKey="value" stroke={theme.accent} fill={theme.accent} fillOpacity={0.35} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div><SectionHeader number="04" title="AI Coverage Expansion" gradient={g[0]} />
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={chartData.connectivityTrend}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.accent} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={theme.accent} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={v => `${v}%`} />
                <Area type="monotone" dataKey="pct" name="AI Coverage" stroke={theme.accent} fill="url(#netGrad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <NarrativeSection content={report.content} sectionNum="05" gradient={g[1]} theme={theme} />
    </div>
  );
}

// ════════════════════════════════════════════
// 10. ROI & COST-BENEFIT
// ════════════════════════════════════════════
export function ROILayout({ report, config }) {
  const { theme, chartData, kpis, coverStats } = config;
  const g = theme.headerGradients;
  return (
    <div className="space-y-8">
      <div className={`bg-gradient-to-br ${theme.cover} rounded-2xl p-8 text-white`}>
        <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-yellow-300" /><span className="text-white/70 text-xs font-semibold uppercase tracking-widest">ROI & Cost-Benefit · Finance Ministry</span></div>
        <h1 className="text-3xl font-extrabold mb-1">{report.title}</h1>
        <p className="text-yellow-200 text-sm mb-6">Audience: {config.audience}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{coverStats.map(s => (
          <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center"><p className="text-xl font-bold">{s.value}</p><p className="text-xs text-yellow-200 mt-0.5">{s.label}</p></div>
        ))}</div>
      </div>

      <div><SectionHeader number="01" title="Financial KPIs" gradient={g[0]} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis.map((k, i) => <KPICard key={i} {...k} theme={theme} />)}</div>
      </div>

      <div><SectionHeader number="02" title="5-Year Cumulative ROI Trajectory" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-2">Cumulative SAR (millions) — break-even at Year 2.4</p>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={chartData.roiTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="M" />
              <Tooltip formatter={v => `SAR ${v}M`} />
              <Legend />
              <Line type="monotone" dataKey="cumulative" name="Cumulative Return" stroke={theme.accent} strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="savings" name="Annual Savings" stroke="#22C55E" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div><SectionHeader number="03" title="Investment Cost Breakdown" gradient={g[2]} />
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData.costBreakdownPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${value}%`}>
                  {chartData.costBreakdownPie.map((_, i) => <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-1 flex flex-col justify-center">
          <SectionHeader number="04" title="Break-Even Highlights" gradient={g[0]} />
          {[
            { label: 'Total Investment', val: 'SAR 580M', color: 'text-red-600' },
            { label: 'Year 1 Savings', val: 'SAR 420M', color: 'text-slate-700' },
            { label: 'Break-Even Point', val: '2.4 Years', color: 'text-yellow-700' },
            { label: '5-Year Return', val: 'SAR 3,440M', color: 'text-green-700' },
            { label: '10-Year NPV', val: 'SAR 8.4B', color: 'text-green-800 font-extrabold' },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-slate-600">{r.label}</span>
              <span className={`text-sm font-bold ${r.color}`}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div><SectionHeader number="05" title="Benefits Breakdown by Category" gradient={g[1]} />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className={`${theme.tableHeader} text-white`}>
              <tr>{['Benefit Category', 'Annual (SAR)', '5-Year (SAR)', 'Source'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.roiRows.map((r, i) => (
                <tr key={i} className={i === chartData.roiRows.length - 1 ? `bg-yellow-50 font-bold` : i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{r.category}</td>
                  <td className={`px-4 py-3 ${theme.kpiColor} font-semibold`}>{r.annualSAR}</td>
                  <td className="px-4 py-3 text-slate-700">{r.year5}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NarrativeSection content={report.content} sectionNum="06" gradient={g[2]} theme={theme} />
    </div>
  );
}