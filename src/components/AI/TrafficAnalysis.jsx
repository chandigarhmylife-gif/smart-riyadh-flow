import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, Lightbulb } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TrafficAnalysis({ trafficData, onAnalysisComplete }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeTraffic = async () => {
    setAnalyzing(true);
    try {
      const prompt = `Analyze this traffic scenario and provide optimization recommendations:
      
Traffic Data:
- Average Wait Time: ${trafficData.avgWaitTime}s
- Throughput: ${trafficData.throughput} vehicles/hour
- Queue Length: ${trafficData.queueLength} vehicles
- Current Efficiency: ${trafficData.efficiency}%

Provide:
1. Key insights about current traffic patterns
2. Specific optimization recommendations
3. Expected improvement percentage
4. Implementation priority (high/medium/low)

Format as JSON with keys: insights, recommendations, expectedImprovement, priority`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            insights: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } },
            expectedImprovement: { type: 'string' },
            priority: { type: 'string' }
          }
        }
      });

      setAnalysis(result);
      if (onAnalysisComplete) onAnalysisComplete(result);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>AI Traffic Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && (
          <Button 
            onClick={analyzeTraffic} 
            disabled={analyzing}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze Traffic Patterns
              </>
            )}
          </Button>
        )}

        {analysis && (
          <div className="space-y-4">
            {/* Key Insights */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span>Key Insights</span>
              </h4>
              <ul className="space-y-2">
                {analysis.insights?.map((insight, i) => (
                  <li key={i} className="text-sm text-slate-700 pl-4 border-l-2 border-blue-400">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900">Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendations?.map((rec, i) => (
                  <li key={i} className="text-sm text-slate-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected Improvement */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Expected Improvement</span>
                <span className="text-lg font-bold text-purple-600">{analysis.expectedImprovement}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Priority</span>
                <span className={`text-sm font-semibold uppercase ${
                  analysis.priority === 'high' ? 'text-red-600' :
                  analysis.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {analysis.priority}
                </span>
              </div>
            </div>

            {/* Re-analyze Button */}
            <Button 
              onClick={analyzeTraffic} 
              variant="outline"
              disabled={analyzing}
              className="w-full"
            >
              Re-analyze
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}