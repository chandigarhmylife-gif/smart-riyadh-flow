import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const hourlyData = [
  { hour: '6AM', aiWait: 28, fixedWait: 55, throughput: 110 },
  { hour: '7AM', aiWait: 42, fixedWait: 80, throughput: 185 },
  { hour: '8AM', aiWait: 48, fixedWait: 95, throughput: 210 },
  { hour: '9AM', aiWait: 35, fixedWait: 70, throughput: 170 },
  { hour: '12PM', aiWait: 30, fixedWait: 60, throughput: 145 },
  { hour: '4PM', aiWait: 44, fixedWait: 88, throughput: 195 },
  { hour: '5PM', aiWait: 52, fixedWait: 100, throughput: 220 },
  { hour: '6PM', aiWait: 38, fixedWait: 75, throughput: 160 },
  { hour: '9PM', aiWait: 20, fixedWait: 40, throughput: 90 },
];

const weeklyEfficiency = [
  { day: 'Mon', efficiency: 87 }, { day: 'Tue', efficiency: 91 },
  { day: 'Wed', efficiency: 89 }, { day: 'Thu', efficiency: 93 },
  { day: 'Fri', efficiency: 78 }, { day: 'Sat', efficiency: 82 }, { day: 'Sun', efficiency: 85 },
];

export default function InteractiveDashboardModal({ onClose }) {
  const [activeChart, setActiveChart] = useState('waitTime');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Interactive Report Dashboard</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPI Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Avg Wait Time', value: '38s', change: '-31%', good: true },
              { label: 'Throughput', value: '1,820 veh/hr', change: '+18%', good: true },
              { label: 'Efficiency', value: '89%', change: '+14pp', good: true },
              { label: 'CO₂ Saved', value: '4.2 tons/day', change: '-22%', good: true },
            ].map(kpi => (
              <div key={kpi.label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                <p className="text-lg font-bold text-slate-900">{kpi.value}</p>
                <p className={`text-xs font-semibold ${kpi.good ? 'text-green-600' : 'text-red-500'}`}>{kpi.change} vs fixed-time</p>
              </div>
            ))}
          </div>

          {/* Chart Toggle */}
          <div className="flex space-x-2">
            {[
              { key: 'waitTime', label: 'Wait Time', icon: BarChart3 },
              { key: 'efficiency', label: 'Efficiency Trend', icon: TrendingUp },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                size="sm"
                variant={activeChart === key ? 'default' : 'outline'}
                className={activeChart === key ? 'bg-blue-600 hover:bg-blue-700' : ''}
                onClick={() => setActiveChart(key)}
              >
                <Icon className="w-4 h-4 mr-1" /> {label}
              </Button>
            ))}
          </div>

          {/* Charts */}
          {activeChart === 'waitTime' && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">AI Adaptive vs Fixed-Time Wait (seconds) by Hour</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="aiWait" name="AI Adaptive" fill="#1d4ed8" radius={[4,4,0,0]} />
                  <Bar dataKey="fixedWait" name="Fixed-Time" fill="#94a3b8" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === 'efficiency' && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Signal Efficiency (%) — Weekly Trend</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyEfficiency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Intersection Table */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Intersection Performance Breakdown</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    {['Intersection', 'LOS', 'Avg Wait (AI)', 'Avg Wait (Fixed)', 'Improvement'].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-slate-600 font-semibold border border-slate-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['King Fahd / Olaya', 'B', '34s', '62s', '45%'],
                    ['Abdullah / Tahlia', 'C', '47s', '80s', '41%'],
                    ['Prince Mohammed / Exit 7', 'B', '29s', '55s', '47%'],
                    ['Northern Ring / King Salman', 'D', '58s', '98s', '41%'],
                    ['Makkah Rd / Al Urubah', 'C', '41s', '72s', '43%'],
                  ].map(([name, los, ai, fixed, imp]) => (
                    <tr key={name} className="hover:bg-slate-50">
                      <td className="px-3 py-2 border border-slate-200 font-medium text-slate-700">{name}</td>
                      <td className="px-3 py-2 border border-slate-200">
                        <span className={`px-2 py-0.5 rounded font-bold ${los === 'B' ? 'bg-green-100 text-green-700' : los === 'C' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{los}</span>
                      </td>
                      <td className="px-3 py-2 border border-slate-200 text-blue-700 font-semibold">{ai}</td>
                      <td className="px-3 py-2 border border-slate-200 text-slate-500">{fixed}</td>
                      <td className="px-3 py-2 border border-slate-200 text-green-600 font-bold">{imp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}