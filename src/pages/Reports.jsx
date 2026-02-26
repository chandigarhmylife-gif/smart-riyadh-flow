import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Calendar, Eye, Loader2 } from 'lucide-react';
import ReportTemplate from '../components/Reports/ReportTemplate';
import ReportGenerator from '../components/AI/ReportGenerator';
import GeneratedReportModal from '../components/Reports/GeneratedReportModal';
import { base44 } from '@/api/base44Client';

export default function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedMetrics, setSelectedMetrics] = useState({
    waitTime: true,
    throughput: true,
    efficiency: true,
    emissions: false,
    queueLength: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Performance Summary',
      description: 'Overview of traffic control performance with key metrics',
      type: 'summary',
      metrics: 8,
      pages: 4
    },
    {
      id: 2,
      name: 'Daily Analysis',
      description: 'Detailed breakdown of daily traffic patterns',
      type: 'daily',
      metrics: 12,
      pages: 8
    },
    {
      id: 3,
      name: 'Comparison Report',
      description: 'AI control vs fixed-time comparison analysis',
      type: 'comparison',
      metrics: 10,
      pages: 6
    },
    {
      id: 4,
      name: 'Performance Metrics',
      description: 'Comprehensive metrics and KPI analysis',
      type: 'performance',
      metrics: 15,
      pages: 10
    }
  ];

  const historicalReports = [
    { id: 1, name: 'January Week 1 Summary', date: '2024-01-07', type: 'PDF' },
    { id: 2, name: 'Downtown Rush Hour Analysis', date: '2024-01-05', type: 'PDF' },
    { id: 3, name: 'Monthly Performance Report', date: '2024-01-01', type: 'PDF' }
  ];

  const handleGenerateReport = () => {
    console.log('Generating report:', { selectedTemplate, dateRange, selectedMetrics });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Report Generation</h1>
          <p className="text-slate-600">Create custom traffic analysis reports</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle>Select Report Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {templates.map(template => (
                    <ReportTemplate
                      key={template.id}
                      template={template}
                      selected={selectedTemplate?.id === template.id}
                      onSelect={setSelectedTemplate}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date Range */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Date Range</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric Selection */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle>Select Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(selectedMetrics).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setSelectedMetrics({ ...selectedMetrics, [key]: checked })
                        }
                      />
                      <label htmlFor={key} className="text-sm text-slate-700 cursor-pointer capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedTemplate}
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
            >
              <FileDown className="w-5 h-5 mr-2" />
              Generate Report
            </Button>
          </div>

          {/* Preview & History Panel */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  <div className="space-y-4">
                    <div className="aspect-[8.5/11] bg-slate-100 rounded-lg border-2 border-slate-200 p-4">
                      <div className="h-full flex flex-col space-y-2">
                        <div className="h-8 bg-slate-300 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="flex-1 space-y-2 pt-4">
                          <div className="h-20 bg-slate-200 rounded"></div>
                          <div className="h-20 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 text-center">
                      {selectedTemplate.name} preview
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <FileDown className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>Select a template to preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Report Generator */}
            <ReportGenerator 
              scenarioData={{ name: 'Current Analysis' }}
              metricsData={{ 
                avgWaitTime: 42, 
                throughput: 156, 
                efficiency: 89, 
                queueLength: 8 
              }}
            />

            {/* Historical Reports */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {historicalReports.map(report => (
                    <div 
                      key={report.id}
                      className="p-3 border-2 border-slate-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 text-sm mb-1">{report.name}</h4>
                          <p className="text-xs text-slate-500">{report.date}</p>
                        </div>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded">{report.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}