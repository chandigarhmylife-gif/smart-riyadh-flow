import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Calendar, Eye, Loader2, LayoutDashboard, Share2 } from 'lucide-react';
import ReportTemplate from '../components/Reports/ReportTemplate';
import ReportGenerator from '../components/AI/ReportGenerator';
import GeneratedReportModal from '../components/Reports/GeneratedReportModal';
import ScheduledReportsPanel from '../components/Reports/ScheduledReportsPanel';
import AdvancedCustomization from '../components/Reports/AdvancedCustomization';
import ShareCollaborationModal from '../components/Reports/ShareCollaborationModal';
import InteractiveDashboardModal from '../components/Reports/InteractiveDashboardModal';
import BenchmarkGoals from '../components/Reports/BenchmarkGoals';
import AIDeepInsights from '../components/Reports/AIDeepInsights';
import AutomatedDistribution from '../components/Reports/AutomatedDistribution';
import CustomTemplateBuilder from '../components/Reports/CustomTemplateBuilder';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function Reports() {
  const { toast } = useToast();
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInteractiveDashboard, setShowInteractiveDashboard] = useState(false);

  const templates = [
    { id: 1, name: 'Performance Summary', description: 'Executive-level KPI overview for senior leadership', type: 'summary', metrics: 8, pages: 4 },
    { id: 2, name: 'Daily Analysis', description: '24-hour operational breakdown with incident log', type: 'daily', metrics: 12, pages: 8 },
    { id: 3, name: 'Comparison Report', description: 'AI vs fixed-time side-by-side with radar analysis', type: 'comparison', metrics: 10, pages: 6 },
    { id: 4, name: 'Performance Metrics', description: 'Deep technical KPIs vs global engineering benchmarks', type: 'performance', metrics: 15, pages: 10 },
    { id: 5, name: 'Environmental Impact', description: 'CO₂, fuel savings, and Vision 2030 sustainability alignment', type: 'environmental', metrics: 9, pages: 6 },
    { id: 6, name: 'Peak Hour Analysis', description: 'AM/PM congestion, bottleneck mapping, queue propagation', type: 'peak_hour', metrics: 11, pages: 7 },
    { id: 7, name: 'Monthly Trend Report', description: '6-month trend analysis with growth forecasting', type: 'monthly_trend', metrics: 10, pages: 6 },
    { id: 8, name: 'Safety & Incident Report', description: 'Incident frequency, near-miss analysis, emergency response', type: 'safety', metrics: 8, pages: 5 },
    { id: 9, name: 'Network Efficiency', description: 'City-wide signal coordination, corridors, green wave uptime', type: 'network', metrics: 12, pages: 8 },
    { id: 10, name: 'ROI & Cost-Benefit', description: 'Financial return, break-even analysis, 10-year NPV model', type: 'roi', metrics: 7, pages: 5 },
  ];

  const historicalReports = [
    { id: 1, name: 'January Week 1 Summary', date: '2024-01-07', type: 'PDF' },
    { id: 2, name: 'Downtown Rush Hour Analysis', date: '2024-01-05', type: 'PDF' },
    { id: 3, name: 'Monthly Performance Report', date: '2024-01-01', type: 'PDF' }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const activeMetrics = Object.entries(selectedMetrics)
        .filter(([, v]) => v)
        .map(([k]) => k.replace(/([A-Z])/g, ' $1').trim())
        .join(', ');

      const prompt = `You are a senior traffic engineering consultant with 20+ years of experience. Generate a highly detailed, professional traffic control performance report in Markdown format. This report should be comprehensive enough to present to a city council or transportation authority.

**Report Configuration:**
- Report Type: ${selectedTemplate.name}
- Description: ${selectedTemplate.description}
- Date Range: ${dateRange.start || 'January 1, 2026'} to ${dateRange.end || 'February 26, 2026'}
- Selected Metrics: ${activeMetrics}
- City: Riyadh, Saudi Arabia (Smart Riyadh Flow initiative)

**Required Sections (be thorough and detailed in each):**

## 1. Title Page & Report Metadata
Include report title, date, version, prepared by, and classification.

## 2. Executive Summary (3–4 paragraphs)
High-level summary of findings, overall system performance, and top recommendations. Include headline statistics.

## 3. System Overview
Describe the Smart Riyadh Flow adaptive signal control system, the intersections monitored, time period, and data sources used.

## 4. Key Performance Indicators (KPI) Dashboard
A markdown table with the following columns: KPI | Baseline (Fixed-Time) | AI Adaptive Control | Improvement | Target
Include at minimum: Average Wait Time, Vehicle Throughput, Signal Efficiency, Queue Length, Average Travel Speed, Fuel Consumption, CO₂ Emissions, Stop-and-Go Events.
Use realistic Riyadh traffic data values.

## 5. Detailed Metric Analysis
For each selected metric (${activeMetrics}), provide:
- Current values with breakdown by time of day (Morning Peak 7–9AM, Midday 11AM–1PM, Evening Peak 4–7PM, Off-Peak)
- A markdown table of hourly or daily data
- Trend analysis (improving/declining/stable)
- Comparison to regional and international benchmarks

## 6. Traffic Flow Analysis
- Intersection-level performance table (at least 5 intersections with names, volumes, LOS grade, wait time)
- Peak hour factor analysis
- Bottleneck identification with specific locations
- Queue propagation impact

## 7. AI Adaptive Control vs. Fixed-Time Control Comparison
A detailed side-by-side comparison table covering: wait time, throughput, efficiency, emissions, fuel savings, travel time reliability.
Include percentage improvements and annualized projections.

## 8. Incident & Anomaly Log
Table of notable traffic incidents, their duration, affected intersections, and system response.

## 9. Environmental Impact Assessment
- CO₂ reduction estimates (tons/day, tons/year)
- Fuel savings (liters/day, cost savings in SAR)
- Noise pollution reduction estimate
- Alignment with Saudi Vision 2030 sustainability goals

## 10. Recommendations
At least 8 numbered, actionable recommendations with: priority level (High/Medium/Low), estimated impact, implementation timeline, and responsible department.

## 11. Risk Assessment
Table of risks: Risk | Likelihood | Impact | Mitigation Strategy

## 12. Next Steps & Implementation Roadmap
Phased plan for the next 6 months with milestones.

## 13. Conclusion
Strong closing paragraph summarizing value delivered and path forward.

**Style requirements:**
- Use realistic, specific numbers throughout (not ranges — pick exact values)
- Include markdown tables wherever data is presented
- Use **bold** for key statistics and findings
- Use > blockquotes for important callouts
- Be specific about Riyadh intersections (e.g., King Fahd Road / Olaya Street, King Abdullah Road / Tahlia Street)
- Minimum length: very thorough and comprehensive`;

      const result = await base44.integrations.Core.InvokeLLM({ prompt });
      setGeneratedReport({
        title: `${selectedTemplate.name} — ${dateRange.start || 'Jan 2026'} to ${dateRange.end || 'Feb 2026'}`,
        content: result,
        templateType: selectedTemplate.type,
      });
    } catch (error) {
      toast({
        title: 'Report generation failed',
        description: error?.message || 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
    {generatedReport && (
      <GeneratedReportModal report={generatedReport} onClose={() => setGeneratedReport(null)} />
    )}
    {showShareModal && (
      <ShareCollaborationModal report={generatedReport} onClose={() => setShowShareModal(false)} />
    )}
    {showInteractiveDashboard && (
      <InteractiveDashboardModal onClose={() => setShowInteractiveDashboard(false)} />
    )}
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

            {/* Advanced Customization */}
            <AdvancedCustomization />

            {/* Benchmarking & Goals */}
            <BenchmarkGoals />

            {/* Custom Template Builder */}
            <CustomTemplateBuilder />

            {/* Generate Button Row */}
            <div className="flex gap-3">
              <Button
                onClick={handleGenerateReport}
                disabled={!selectedTemplate || isGenerating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-6 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5 mr-2" />
                    Generate Report (PDF)
                  </>
                )}
              </Button>
            </div>

            {/* Post-generation actions */}
            {generatedReport && (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowInteractiveDashboard(true)}>
                  <LayoutDashboard className="w-4 h-4 mr-2 text-blue-600" /> Interactive Dashboard
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowShareModal(true)}>
                  <Share2 className="w-4 h-4 mr-2 text-blue-600" /> Share & Collaborate
                </Button>
              </div>
            )}
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

            {/* Scheduled Reports */}
            <ScheduledReportsPanel />

            {/* AI Deep Insights */}
            <AIDeepInsights reportTitle={generatedReport?.title} />

            {/* Automated Distribution */}
            <AutomatedDistribution report={generatedReport} />

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
    </>
  );
}