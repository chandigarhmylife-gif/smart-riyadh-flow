import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, Lightbulb, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ICON_MAP = { anomaly: AlertTriangle, rootcause: Lightbulb, forecast: TrendingUp };
const COLOR_MAP = {
  anomaly: 'bg-red-50 border-red-200 text-red-700',
  rootcause: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  forecast: 'bg-blue-50 border-blue-200 text-blue-700',
};
const BADGE_MAP = {
  anomaly: 'bg-red-100 text-red-700',
  rootcause: 'bg-yellow-100 text-yellow-700',
  forecast: 'bg-blue-100 text-blue-700',
};

export default function AIDeepInsights({ reportTitle }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  const generate = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert traffic AI analyst. Based on the report "${reportTitle || 'Traffic Performance Report'}" for the Smart Riyadh Flow system, generate deep AI-driven insights. Return exactly 6 insights as JSON.

Each insight must have:
- type: one of "anomaly", "rootcause", or "forecast"
- title: short title (max 8 words)
- detail: 2-sentence explanation with specific data values
- severity: "high", "medium", or "low"

Return 2 anomalies, 2 root causes, and 2 forecasts. Be specific to Riyadh traffic context with realistic numbers.`,
      response_json_schema: {
        type: 'object',
        properties: {
          insights: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                title: { type: 'string' },
                detail: { type: 'string' },
                severity: { type: 'string' }
              }
            }
          }
        }
      }
    });
    setInsights(result.insights || []);
    setLoading(false);
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI Deep Insights</span>
          </div>
          <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : insights ? <RefreshCw className="w-4 h-4" /> : null}
            {loading ? 'Analyzing...' : insights ? 'Refresh' : 'Analyze Now'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!insights && !loading && (
          <div className="text-center py-8 text-slate-400">
            <Brain className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Click "Analyze Now" to get AI-driven anomaly detection, root cause analysis, and trend forecasts.</p>
          </div>
        )}
        {loading && (
          <div className="text-center py-8 text-slate-400">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-purple-500" />
            <p className="text-sm">AI is analyzing patterns...</p>
          </div>
        )}
        {insights && (
          <div className="space-y-3">
            {insights.map((ins, i) => {
              const Icon = ICON_MAP[ins.type] || Lightbulb;
              return (
                <div key={i} className={`border rounded-lg p-3 ${COLOR_MAP[ins.type] || COLOR_MAP.rootcause}`}>
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold">{ins.title}</span>
                        <Badge className={`text-xs ${BADGE_MAP[ins.type] || ''}`}>
                          {ins.type === 'anomaly' ? 'Anomaly' : ins.type === 'rootcause' ? 'Root Cause' : 'Forecast'}
                        </Badge>
                        {ins.severity === 'high' && <Badge className="text-xs bg-red-200 text-red-800">High</Badge>}
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">{ins.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}