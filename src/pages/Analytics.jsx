import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Calendar } from 'lucide-react';
import PerformanceChart from '../components/Analytics/PerformanceChart';
import TrafficHeatmap from '../components/Analytics/TrafficHeatmap';
import MetricsTable from '../components/Analytics/MetricsTable';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('7days');
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleExport = () => {
    console.log(`Exporting data as ${exportFormat}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Performance Analytics</h1>
            <p className="text-slate-600">Compare AI control vs traditional systems</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40 border-2">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24hours">Last 24 Hours</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-32 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Performance Comparison Chart */}
        <PerformanceChart title="Efficiency Comparison: AI vs Fixed-Time" />

        {/* Traffic Heatmap */}
        <TrafficHeatmap />

        {/* Metrics Table */}
        <MetricsTable />

        {/* Summary Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="text-sm font-medium text-green-800 mb-2">Avg Improvement</div>
            <div className="text-4xl font-bold text-green-600">+25%</div>
            <div className="text-sm text-green-700 mt-1">vs fixed-time control</div>
          </div>
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="text-sm font-medium text-blue-800 mb-2">Total Scenarios</div>
            <div className="text-4xl font-bold text-blue-600">24</div>
            <div className="text-sm text-blue-700 mt-1">analyzed this week</div>
          </div>
          <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
            <div className="text-sm font-medium text-purple-800 mb-2">Emissions Reduced</div>
            <div className="text-4xl font-bold text-purple-600">-30%</div>
            <div className="text-sm text-purple-700 mt-1">CO2 output average</div>
          </div>
        </div>
      </div>
    </div>
  );
}