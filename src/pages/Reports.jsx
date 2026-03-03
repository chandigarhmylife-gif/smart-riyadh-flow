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
    const activeMetrics = Object.entries(selectedMetrics)
      .filter(([, v]) => v)
      .map(([k]) => k.replace(/([A-Z])/g, ' $1').trim())
      .join(', ');

    const prompt = `You are a senior traffic engineering consultant with 25+ years of experience working on smart city projects across the GCC. Generate an extremely detailed, professional, publication-quality traffic control performance report in Markdown format. This report must be comprehensive, data-rich, and suitable for presentation to a city council, transportation authority, or government ministry.

**Report Configuration:**
- Report Type: ${selectedTemplate.name}
- Description: ${selectedTemplate.description}
- Date Range: ${dateRange.start || 'January 1, 2026'} to ${dateRange.end || 'February 26, 2026'}
- Selected Metrics: ${activeMetrics}
- City: Riyadh, Saudi Arabia (Smart Riyadh Flow initiative)
- Target Length: 15–20 pages (extremely detailed)

---

# Required Sections — Write Each Section Fully and In Full Detail

## 1. Title Page & Report Metadata
Full title block: Report Title, Subtitle, Prepared By (Smart Riyadh Flow Analytics Division), Date, Version (v2.1), Classification (Confidential – Official Use Only), Distribution List.

## 2. Table of Contents
List all sections with page numbers.

## 3. Executive Summary (5–6 paragraphs)
Comprehensive summary of the reporting period. Cover: system deployment status, headline KPI improvements, financial impact, environmental gains, and top 3 strategic recommendations. End with a strong value statement for leadership.
Include a summary callout box with 4 headline statistics in bold.

## 4. Introduction & Background
- Background on Riyadh's traffic challenges (population growth, vehicle density, Vision 2030)
- History of the Smart Riyadh Flow project
- Objectives of this report
- Scope: 24 AI-controlled intersections, 312 sensors, 6 traffic corridors
- Methodology: Data collection, AI model type, update frequency

## 5. System Architecture Overview
- Describe the AI adaptive signal control architecture
- Sensor types and locations
- Data pipeline (real-time feeds, edge computing, cloud analytics)
- AI model: reinforcement learning + pattern recognition
- System uptime and redundancy: 99.7% uptime
- Integration with Riyadh Municipality emergency systems

## 6. Key Performance Indicators (KPI) Master Dashboard
A comprehensive markdown table:
| KPI | Baseline (Fixed-Time) | AI Adaptive | Improvement | Target | Status |
Include at minimum 12 KPIs: Average Wait Time, Peak Wait Time, Off-Peak Wait Time, Vehicle Throughput, Signal Efficiency, Queue Length, Average Travel Speed, Fuel Consumption per 100km, CO₂ Emissions per day, Stop-and-Go Events per km, Travel Time Index, Level of Service (LOS) Grade.
Use specific Riyadh data values.

## 7. Detailed Metric Analysis by Time Period
For EACH selected metric (${activeMetrics}), write a full subsection:
### 7.x [Metric Name]
- Definition and significance
- A full data table: Morning Peak (7–9AM) | Midday (11AM–1PM) | Afternoon (2–4PM) | Evening Peak (4–7PM) | Night (9PM–5AM)
- Week-over-week trend (improving/stable/declining)
- Statistical highlights (max, min, average, standard deviation)
- Root cause notes for outliers
- Comparison to GCC regional benchmarks and international best practices (e.g., Singapore, London, Dubai)

## 8. 24-Hour Traffic Flow Profile
A full hour-by-hour table (24 rows: 12AM through 11PM) showing:
| Hour | AI Wait Time (s) | Fixed Wait Time (s) | Volume (veh/hr) | LOS Grade | AI Signal Phase |
Identify and annotate the 3 peak congestion windows.

## 9. Intersection-Level Performance Analysis
Full table for ALL 12 monitored intersections:
| Intersection | Road 1 | Road 2 | LOS | AI Wait (s) | Fixed Wait (s) | Volume | Flow % | Status | AI Action Applied |
Use real Riyadh street names.
Follow with a paragraph analysis of the top 3 best-performing and worst-performing intersections with root cause analysis.

## 10. AI Adaptive Control vs. Fixed-Time Control: Full Comparison
Comprehensive side-by-side comparison:
| Metric | Fixed-Time | AI Adaptive | Absolute Change | % Improvement | Annualized Impact |
Cover at least 15 metrics.
Include a subsection on signal phase analysis: green time utilization, cycle length optimization, coordination index.

## 11. Peak Hour Deep Dive
### 11.1 Morning Peak (7:00 – 9:00 AM)
- Volume distribution, wait time heatmap description, bottleneck locations
- Table: Top 5 congested intersections during morning peak
- AI actions taken, results

### 11.2 Evening Peak (4:00 – 7:00 PM)
- Same structure as morning peak
- Special incidents or anomalies noted

### 11.3 Peak Hour Factor (PHF) Analysis
- PHF table by day of week
- Comparison to Riyadh seasonal norms

## 12. Bottleneck & Queue Propagation Analysis
- Identify and rank the top 7 bottleneck locations
- For each: location, direction, trigger, queue length (AI vs fixed), propagation distance, clearance time, AI intervention
- Table format
- Analysis of secondary congestion caused by each bottleneck

## 13. Traffic Incident & Anomaly Log
Full log table for the reporting period:
| Date | Time | Location | Type | Severity | Duration | Vehicles Affected | AI System Response | Outcome |
Include at least 8 incidents. Types: Congestion, Stall, Accident, Emergency Vehicle, Pedestrian Event, Signal Fault.
Follow with incident analysis: frequency by type, response time averages, AI effectiveness rating.

## 14. Environmental Impact Assessment
### 14.1 Carbon Emissions Analysis
- CO₂ reduced per day/month/year (in metric tons)
- Comparison to fixed-time baseline
- Equivalences: trees planted, passenger flights, homes powered

### 14.2 Fuel Savings
- Liters saved per day and year
- Cost savings in SAR and USD
- Breakdown by vehicle type (passenger cars, SUVs, buses, trucks)

### 14.3 Air Quality Impact
- NOx, PM2.5, and VOC reduction estimates
- Urban air quality index improvement
- Health cost savings (estimated SAR)

### 14.4 Noise Pollution
- Average dB reduction from fewer stop-and-go events
- Affected residential zones

### 14.5 Saudi Vision 2030 Alignment
Table: | Vision 2030 Target | Current Status | Contribution from Smart Riyadh Flow | Progress |
Include at least 6 targets.

## 15. Financial & Economic Impact Analysis
### 15.1 Cost Savings Summary
- Fuel cost savings
- Commuter time value (SAR per hour × hours saved)
- Accident cost reduction
- Infrastructure wear reduction

### 15.2 ROI Model
| Year | Investment (SAR M) | Annual Savings (SAR M) | Cumulative Net (SAR M) |
Show 5-year projection. State break-even year.

### 15.3 Cost per Intersection
- CAPEX and OPEX per signal unit
- Comparison to international costs

## 16. Public Transit & Emergency Services Impact
- Bus corridor improvements: route time savings, reliability index
- Emergency vehicle preemption: count, average clearance time, lives impacted
- Pedestrian crossing optimization: crossing time, safety improvement

## 17. AI Model Performance & System Health
- Model accuracy: prediction vs actual (96.4%)
- False positive / false negative rates for congestion detection
- System uptime log
- Sensor health and data completeness
- Data latency metrics (target: <1.2s, achieved: 0.9s avg)
- Model retraining schedule and updates

## 18. Stakeholder Impact Assessment
- Commuters: time saved, reliability improvement
- Businesses: delivery efficiency, customer access
- Municipality: reduced maintenance, complaints down
- Emergency services: faster response
- Environment: sustainability progress
- Vision 2030: KPIs contributed to

## 19. Benchmarking Against Global Standards
Table:
| Metric | Riyadh (AI) | Dubai ATMS | Singapore iTMS | London SCOOT | Best in Class |
Compare at least 8 metrics.
Add a paragraph on what Riyadh can learn from global leaders and where it excels.

## 20. Risk Register
Full risk table:
| Risk ID | Risk Description | Category | Likelihood | Impact | Risk Score | Mitigation Strategy | Owner | Status |
Include at least 10 risks across: technical, operational, financial, environmental, and regulatory categories.

## 21. Strategic Recommendations
Provide 12 numbered recommendations, each with:
- Priority: High / Medium / Low
- Description (2–3 sentences)
- Expected Impact
- Timeline
- Responsible Department
- Estimated Cost

## 22. 12-Month Implementation Roadmap
A phased plan:
### Phase 1 (Months 1–3): Consolidation
### Phase 2 (Months 4–6): Expansion
### Phase 3 (Months 7–9): Optimization
### Phase 4 (Months 10–12): Full Scale
Each phase: goals, milestones, deliverables, KPIs, budget.

## 23. Data Methodology & Quality Notes
- Data sources (loop detectors, cameras, GPS probes, weather API)
- Data completeness rate: 98.7%
- Quality control processes
- Known limitations and caveats
- Statistical confidence levels

## 24. Glossary of Terms
Define at least 15 technical terms used in the report.

## 25. Conclusion
A full, powerful closing section (4–5 paragraphs) summarizing:
- Achievements in the reporting period
- Transformational impact of AI traffic control
- Commitment to Vision 2030
- Call to action for leadership
End with a bold headline statement of value delivered.

---

**Mandatory Style Requirements:**
- Use specific, exact numbers throughout (never vague ranges — always exact values)
- Every section must include at least one markdown table
- Use **bold** for all key statistics and critical findings
- Use > blockquotes for important executive callouts
- Be specific about Riyadh intersections, roads, and districts (King Fahd Rd, Olaya St, Tahlia St, Northern Ring Rd, Makkah Rd, Prince Sultan Rd, KAFD, Al-Malaz, Diplomatic Quarter, etc.)
- Write in formal, technical English suitable for government publication
- This report MUST be extremely long and detailed — do not summarize or shorten any section
- Every table must have at least 5 rows of data`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setGeneratedReport({
      title: `${selectedTemplate.name} — ${dateRange.start || 'Jan 2026'} to ${dateRange.end || 'Feb 2026'}`,
      content: result,
      templateType: selectedTemplate.type,
    });
    setIsGenerating(false);
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