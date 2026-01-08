import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ReportGenerator({ scenarioData, metricsData }) {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const prompt = `Generate a comprehensive traffic analysis report based on this data:

Scenario: ${scenarioData.name}
Metrics:
- Average Wait Time: ${metricsData.avgWaitTime}s
- Throughput: ${metricsData.throughput} vehicles/hour
- Efficiency: ${metricsData.efficiency}%
- Queue Length: ${metricsData.queueLength} vehicles

Create a professional report with:
1. Executive Summary (2-3 sentences)
2. Key Findings (3-4 bullet points)
3. Performance Analysis (paragraph)
4. Recommendations (3-4 specific actions)
5. Conclusion (1-2 sentences)

Format as JSON with these sections.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            executiveSummary: { type: 'string' },
            keyFindings: { type: 'array', items: { type: 'string' } },
            performanceAnalysis: { type: 'string' },
            recommendations: { type: 'array', items: { type: 'string' } },
            conclusion: { type: 'string' }
          }
        }
      });

      setReport(result);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    const reportText = `
TRAFFIC ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
${report.executiveSummary}

KEY FINDINGS
${report.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

PERFORMANCE ANALYSIS
${report.performanceAnalysis}

RECOMMENDATIONS
${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

CONCLUSION
${report.conclusion}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic-report-${Date.now()}.txt`;
    a.click();
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>AI Report Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!report ? (
          <Button 
            onClick={generateReport}
            disabled={generating}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate AI Report
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Executive Summary</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{report.executiveSummary}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Key Findings</h4>
                <ul className="space-y-1">
                  {report.keyFindings?.map((finding, i) => (
                    <li key={i} className="text-sm text-slate-700 pl-4 border-l-2 border-blue-400">
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Performance Analysis</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{report.performanceAnalysis}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Recommendations</h4>
                <ul className="space-y-2">
                  {report.recommendations?.map((rec, i) => (
                    <li key={i} className="text-sm text-slate-700 bg-green-50 p-2 rounded border border-green-200">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Conclusion</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{report.conclusion}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={downloadReport}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button 
                onClick={generateReport}
                variant="outline"
                disabled={generating}
                className="flex-1"
              >
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}