import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Printer, FileDown, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap, Leaf, Car, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';

// ── Static chart data ──────────────────────────────────────────────────────────
const hourlyWaitData = [
  { hour: '6AM', ai: 22, fixed: 41 }, { hour: '7AM', ai: 35, fixed: 67 },
  { hour: '8AM', ai: 42, fixed: 78 }, { hour: '9AM', ai: 31, fixed: 58 },
  { hour: '10AM', ai: 24, fixed: 44 }, { hour: '11AM', ai: 21, fixed: 39 },
  { hour: '12PM', ai: 28, fixed: 51 }, { hour: '1PM', ai: 26, fixed: 48 },
  { hour: '2PM', ai: 23, fixed: 42 }, { hour: '3PM', ai: 29, fixed: 53 },
  { hour: '4PM', ai: 44, fixed: 81 }, { hour: '5PM', ai: 48, fixed: 89 },
  { hour: '6PM', ai: 39, fixed: 72 }, { hour: '7PM', ai: 27, fixed: 49 },
];

const throughputData = [
  { day: 'Mon', ai: 1820, fixed: 1340 }, { day: 'Tue', ai: 1950, fixed: 1380 },
  { day: 'Wed', ai: 1870, fixed: 1290 }, { day: 'Thu', ai: 2010, fixed: 1420 },
  { day: 'Fri', ai: 2180, fixed: 1510 }, { day: 'Sat', ai: 1640, fixed: 1180 },
  { day: 'Sun', ai: 1390, fixed: 1020 },
];

const emissionsPie = [
  { name: 'CO₂ Saved', value: 42 }, { name: 'Remaining', value: 58 },
];

const intersectionData = [
  { name: 'King Fahd / Olaya', los: 'A', wait: 28, flow: 96 },
  { name: 'Tahlia / King Abdullah', los: 'B', wait: 34, flow: 91 },
  { name: 'Uruba / Prince Sultan', los: 'B', wait: 37, flow: 88 },
  { name: 'Makkah Rd / Exit 7', los: 'C', wait: 51, flow: 79 },
  { name: 'Northern Ring / Hala', los: 'C', wait: 55, flow: 74 },
];

const radarData = [
  { metric: 'Throughput', ai: 95, fixed: 65 },
  { metric: 'Wait Time', ai: 88, fixed: 45 },
  { metric: 'Efficiency', ai: 92, fixed: 60 },
  { metric: 'Safety', ai: 87, fixed: 70 },
  { metric: 'Emissions', ai: 90, fixed: 55 },
  { metric: 'Reliability', ai: 93, fixed: 62 },
];

const PIE_COLORS = ['#10B981', '#E2E8F0'];
const LOS_COLOR = { A: 'bg-green-100 text-green-700', B: 'bg-blue-100 text-blue-700', C: 'bg-yellow-100 text-yellow-700', D: 'bg-orange-100 text-orange-700' };

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, label, ai, fixed, unit, better }) {
  const pct = Math.round(((better === 'lower' ? fixed - ai : ai - fixed) / fixed) * 100);
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">
        <Icon className="w-4 h-4 text-blue-600" /> {label}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-blue-700">{ai}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span></p>
          <p className="text-xs text-slate-400">Fixed: {fixed}{unit}</p>
        </div>
        <div className="flex items-center gap-1 bg-green-50 text-green-700 rounded-full px-2 py-1 text-xs font-bold">
          <TrendingUp className="w-3 h-3" /> {pct}% better
        </div>
      </div>
    </div>
  );
}

// ── Section Divider ───────────────────────────────────────────────────────────
function SectionHeader({ number, title, color = 'blue' }) {
  const colors = {
    blue: 'from-blue-700 to-blue-500',
    green: 'from-green-700 to-green-500',
    purple: 'from-purple-700 to-purple-500',
    orange: 'from-orange-600 to-orange-400',
    slate: 'from-slate-700 to-slate-500',
  };
  return (
    <div className={`flex items-center gap-3 rounded-xl bg-gradient-to-r ${colors[color]} px-5 py-3 mb-4 print:rounded-none`}>
      <span className="text-white/60 text-lg font-bold">{number}</span>
      <h2 className="text-white text-lg font-bold tracking-wide">{title}</h2>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function GeneratedReportModal({ report, onClose }) {
  const printRef = useRef();

  const handlePrint = () => window.print();

  const handleDownloadMD = () => {
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(#report-print-root) { display: none !important; }
          #report-print-root { position: fixed; inset: 0; z-index: 9999; background: white; overflow: auto; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      <div id="report-print-root" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
        <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">

          {/* Modal toolbar */}
          <div className="no-print flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white rounded-t-2xl flex-shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{report.title}</h2>
              <p className="text-xs text-slate-400">Generated {new Date().toLocaleString()} · Smart Riyadh Flow</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadMD}>
                <FileDown className="w-4 h-4 mr-1" /> Markdown
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" /> Print / PDF
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
            </div>
          </div>

          {/* Scrollable report body */}
          <div ref={printRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-slate-50 rounded-b-2xl">

            {/* ── COVER PAGE ── */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute rounded-full border border-white"
                    style={{ width: (i + 1) * 120, height: (i + 1) * 120, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                ))}
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/20 rounded-xl p-2"><Zap className="w-6 h-6 text-yellow-300" /></div>
                  <span className="text-white/70 font-semibold tracking-widest text-xs uppercase">Smart Riyadh Flow · AI Traffic Control</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 leading-tight">{report.title}</h1>
                <p className="text-blue-200 text-sm mb-8">Prepared by: AI Traffic Analytics Engine · Classification: Official</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Intersections', value: '24' },
                    { label: 'Data Points', value: '1.2M' },
                    { label: 'Avg Improvement', value: '43%' },
                    { label: 'CO₂ Saved/day', value: '4.2T' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold">{s.value}</p>
                      <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── KPI SUMMARY ── */}
            <div>
              <SectionHeader number="01" title="Key Performance Indicators" color="blue" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KPICard icon={Clock}   label="Avg Wait Time"  ai={38}   fixed={71}  unit="s"       better="lower" />
                <KPICard icon={Car}     label="Throughput"     ai={1950} fixed={1340} unit=" v/hr"  better="higher" />
                <KPICard icon={Zap}     label="Efficiency"     ai={92}   fixed={61}  unit="%"       better="higher" />
                <KPICard icon={Leaf}    label="CO₂ Reduction"  ai={42}   fixed={0}   unit="%"       better="higher" />
              </div>
            </div>

            {/* ── WAIT TIME CHART ── */}
            <div>
              <SectionHeader number="02" title="Hourly Wait Time: AI vs Fixed-Time Control" color="blue" />
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs text-slate-500 mb-3">Average vehicle wait time (seconds) by hour of day</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={hourlyWaitData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="s" />
                    <Tooltip formatter={(v) => `${v}s`} />
                    <Legend />
                    <Bar dataKey="ai" name="AI Adaptive" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fixed" name="Fixed-Time" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── THROUGHPUT TREND ── */}
            <div>
              <SectionHeader number="03" title="Weekly Vehicle Throughput Trend" color="green" />
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs text-slate-500 mb-3">Vehicles per hour processed by each control method</p>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={throughputData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ai" name="AI Adaptive" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="fixed" name="Fixed-Time" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── PERFORMANCE RADAR + EMISSIONS PIE ── */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <SectionHeader number="04" title="Multi-Metric Radar Analysis" color="purple" />
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <Radar name="AI" dataKey="ai" stroke="#1E40AF" fill="#1E40AF" fillOpacity={0.3} />
                      <Radar name="Fixed" dataKey="fixed" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.2} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <SectionHeader number="05" title="Emissions Reduction" color="green" />
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={emissionsPie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
                        {emissionsPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-3xl font-extrabold text-green-600 -mt-2">42%</p>
                  <p className="text-xs text-slate-500">CO₂ reduction vs fixed-time</p>
                  <p className="text-xs text-slate-400 mt-1">≈ 4.2 tons/day · 1,533 tons/year saved</p>
                </div>
              </div>
            </div>

            {/* ── INTERSECTION TABLE ── */}
            <div>
              <SectionHeader number="06" title="Intersection Performance Breakdown" color="orange" />
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      {['Intersection', 'LOS Grade', 'Avg Wait (AI)', 'Traffic Flow %', 'Status'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {intersectionData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{row.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${LOS_COLOR[row.los]}`}>{row.los}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{row.wait}s</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-2">
                              <div className="h-2 rounded-full bg-blue-500" style={{ width: `${row.flow}%` }} />
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

            {/* ── AI vs FIXED COMPARISON TABLE ── */}
            <div>
              <SectionHeader number="07" title="AI Adaptive vs Fixed-Time Control" color="slate" />
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
                    <tr>
                      {['Metric', 'Fixed-Time', 'AI Adaptive', 'Improvement', 'Annual Impact'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { metric: 'Avg Wait Time', fixed: '71s', ai: '38s', imp: '46%↓', annual: '2.1M hrs saved' },
                      { metric: 'Throughput', fixed: '1,340 v/hr', ai: '1,950 v/hr', imp: '45%↑', annual: '+223M vehicles' },
                      { metric: 'Signal Efficiency', fixed: '61%', ai: '92%', imp: '51%↑', annual: 'Full network' },
                      { metric: 'Fuel Consumption', fixed: '8.4L/100km', ai: '6.1L/100km', imp: '27%↓', annual: '1.2B SAR saved' },
                      { metric: 'CO₂ Emissions', fixed: '10.2 t/day', ai: '5.9 t/day', imp: '42%↓', annual: '1,570 t saved' },
                      { metric: 'Stop-and-Go Events', fixed: '18/km', ai: '7/km', imp: '61%↓', annual: 'Reduced wear' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-3 font-semibold text-slate-800">{row.metric}</td>
                        <td className="px-4 py-3 text-slate-500">{row.fixed}</td>
                        <td className="px-4 py-3 text-blue-700 font-semibold">{row.ai}</td>
                        <td className="px-4 py-3">
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">{row.imp}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{row.annual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── RECOMMENDATIONS ── */}
            <div>
              <SectionHeader number="08" title="Top Recommendations" color="orange" />
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { priority: 'High', text: 'Expand AI control to Northern Ring Road corridor to reduce peak-hour congestion by ~35%.', dept: 'Traffic Engineering' },
                  { priority: 'High', text: 'Implement emergency vehicle preemption at King Fahd Road intersections.', dept: 'Operations' },
                  { priority: 'Medium', text: 'Integrate real-time weather data to adjust signal timing during sandstorm events.', dept: 'IT & Data' },
                  { priority: 'Medium', text: 'Deploy adaptive pedestrian crossing timers at high-footfall commercial zones.', dept: 'Urban Planning' },
                  { priority: 'Low', text: 'Publish a public-facing dashboard for citizen traffic awareness.', dept: 'Communications' },
                  { priority: 'Low', text: 'Conduct quarterly model retraining with updated traffic sensor data.', dept: 'AI/ML Team' },
                ].map((rec, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-sm">
                    <span className={`mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full h-fit flex-shrink-0 ${rec.priority === 'High' ? 'bg-red-100 text-red-700' : rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {rec.priority}
                    </span>
                    <div>
                      <p className="text-sm text-slate-800">{rec.text}</p>
                      <p className="text-xs text-slate-400 mt-1">Dept: {rec.dept}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── AI NARRATIVE ── */}
            <div>
              <SectionHeader number="09" title="Full AI-Generated Report Narrative" color="slate" />
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm prose prose-slate max-w-none
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
              ">
                <ReactMarkdown>{report.content}</ReactMarkdown>
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="font-bold text-sm">Smart Riyadh Flow · AI Traffic Control System</span>
              </div>
              <div className="text-xs text-blue-200 text-center sm:text-right">
                <p>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>Confidential · For Official Use Only</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}