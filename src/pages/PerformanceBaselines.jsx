import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, TrendingDown, Award, Calendar, RefreshCw } from 'lucide-react';

export default function PerformanceBaselines() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const baselines = [
    {
      id: 1,
      name: 'Best Performance',
      date: '2025-12-15',
      avgWaitTime: 28,
      throughput: 1847,
      efficiency: 96,
      queueLength: 4,
      type: 'best'
    },
    {
      id: 2,
      name: 'Average Performance',
      date: '2025-Q4',
      avgWaitTime: 42,
      throughput: 1456,
      efficiency: 89,
      queueLength: 8,
      type: 'average'
    },
    {
      id: 3,
      name: 'Target Performance',
      date: '2026 Goal',
      avgWaitTime: 25,
      throughput: 2000,
      efficiency: 98,
      queueLength: 3,
      type: 'target'
    }
  ];

  const currentPerformance = {
    avgWaitTime: 38,
    throughput: 1567,
    efficiency: 92,
    queueLength: 6
  };

  const comparisonData = [
    { metric: 'Wait Time', current: 38, best: 28, average: 42, target: 25 },
    { metric: 'Throughput', current: 1567, best: 1847, average: 1456, target: 2000 },
    { metric: 'Efficiency', current: 92, best: 96, average: 89, target: 98 },
    { metric: 'Queue', current: 6, best: 4, average: 8, target: 3 }
  ];

  const trendData = [
    { date: 'Week 1', performance: 87, baseline: 89 },
    { date: 'Week 2', performance: 89, baseline: 89 },
    { date: 'Week 3', performance: 90, baseline: 89 },
    { date: 'Week 4', performance: 92, baseline: 89 }
  ];

  const radarData = [
    { metric: 'Efficiency', current: 92, best: 96, target: 98, fullMark: 100 },
    { metric: 'Throughput', current: 78, best: 92, target: 100, fullMark: 100 },
    { metric: 'Wait Time', current: 85, best: 93, target: 96, fullMark: 100 },
    { metric: 'Queue Mgmt', current: 80, best: 90, target: 95, fullMark: 100 },
    { metric: 'Reliability', current: 88, best: 94, target: 97, fullMark: 100 }
  ];

  const getComparisonIcon = (current, baseline) => {
    if (current > baseline) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < baseline) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getComparisonColor = (current, baseline, inverse = false) => {
    const better = inverse ? current < baseline : current > baseline;
    return better ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Performance Baselines</h1>
            <p className="text-slate-600">Compare current performance against established benchmarks</p>
          </div>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Baselines
          </Button>
        </div>

        {/* Quick Comparison Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-blue-700">vs. Best</div>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">-4%</div>
              <div className="text-xs text-blue-600 mt-1">Below peak performance</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-green-700">vs. Average</div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">+3%</div>
              <div className="text-xs text-green-600 mt-1">Above average</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-purple-700">vs. Target</div>
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">-6%</div>
              <div className="text-xs text-purple-600 mt-1">Progress to goal</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-orange-700">Trend</div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">↑ 5%</div>
              <div className="text-xs text-orange-600 mt-1">Last 30 days</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Radar Chart */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle>Multi-Dimensional Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Radar name="Best" dataKey="best" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                <Radar name="Target" dataKey="target" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Baseline Definitions */}
        <div className="grid md:grid-cols-3 gap-6">
          {baselines.map(baseline => (
            <Card key={baseline.id} className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className={`w-5 h-5 ${
                    baseline.type === 'best' ? 'text-green-600' :
                    baseline.type === 'target' ? 'text-purple-600' : 'text-blue-600'
                  }`} />
                  <span>{baseline.name}</span>
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Calendar className="w-3 h-3" />
                  <span>{baseline.date}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Avg Wait Time</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{baseline.avgWaitTime}s</span>
                    {getComparisonIcon(currentPerformance.avgWaitTime, baseline.avgWaitTime)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Throughput</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{baseline.throughput}</span>
                    {getComparisonIcon(currentPerformance.throughput, baseline.throughput)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Efficiency</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{baseline.efficiency}%</span>
                    {getComparisonIcon(currentPerformance.efficiency, baseline.efficiency)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Queue Length</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{baseline.queueLength}</span>
                    {getComparisonIcon(baseline.queueLength, currentPerformance.queueLength)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trend Over Time */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle>Performance Trend vs Baseline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="performance" stroke="#3B82F6" strokeWidth={3} name="Current Performance" />
                <Line type="monotone" dataKey="baseline" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Average Baseline" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Metrics Table */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle>Detailed Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Metric</th>
                    <th className="text-right p-3">Current</th>
                    <th className="text-right p-3">Best</th>
                    <th className="text-right p-3">Average</th>
                    <th className="text-right p-3">Target</th>
                    <th className="text-right p-3">Gap to Target</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-medium">{row.metric}</td>
                      <td className="text-right p-3 font-bold text-blue-600">{row.current}</td>
                      <td className="text-right p-3 text-green-600">{row.best}</td>
                      <td className="text-right p-3 text-slate-600">{row.average}</td>
                      <td className="text-right p-3 text-purple-600">{row.target}</td>
                      <td className={`text-right p-3 font-bold ${
                        row.current >= row.target ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {row.current >= row.target ? '✓ Met' : `${row.target - row.current} gap`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}