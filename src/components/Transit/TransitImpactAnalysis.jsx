import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bus, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TransitImpactAnalysis({ currentMetrics }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeTransitImpact = async () => {
    setLoading(true);
    try {
      const prompt = `Analyze the impact of public transit priority systems on traffic network performance:

Current Network Metrics:
- Average Wait Time: ${currentMetrics.avgWaitTime}s
- Network Efficiency: ${currentMetrics.efficiency}%
- Total Throughput: ${currentMetrics.throughput} veh/h

Provide comparative analysis for:
1. With Transit Priority (active signal preemption)
2. Without Transit Priority (standard operations)

Include:
- Performance metrics comparison (wait times, throughput, efficiency)
- Transit-specific improvements (schedule adherence, passenger throughput)
- General traffic impact assessment
- Cost-benefit analysis summary
- Implementation recommendations

Format as JSON with:
- comparisonData: array of {metric, withPriority (number), withoutPriority (number), unit}
- transitBenefits: array of {benefit, improvement, description}
- generalTrafficImpact: {description, percentageChange (number)}
- costBenefitSummary: string
- recommendations: array of strings`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            comparisonData: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  metric: { type: 'string' },
                  withPriority: { type: 'number' },
                  withoutPriority: { type: 'number' },
                  unit: { type: 'string' }
                }
              }
            },
            transitBenefits: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  benefit: { type: 'string' },
                  improvement: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            },
            generalTrafficImpact: {
              type: 'object',
              properties: {
                description: { type: 'string' },
                percentageChange: { type: 'number' }
              }
            },
            costBenefitSummary: { type: 'string' },
            recommendations: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setAnalysis(result);
    } catch (error) {
      console.error('Transit impact analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bus className="w-5 h-5 text-green-600" />
          <span>Transit Priority Impact Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis ? (
          <Button 
            onClick={analyzeTransitImpact}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Transit Impact...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze Transit Priority Impact
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-6">
            {/* Performance Comparison Chart */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Performance Comparison</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analysis.comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="withPriority" fill="#10B981" name="With Transit Priority" />
                  <Bar dataKey="withoutPriority" fill="#94A3B8" name="Without Priority" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Transit Benefits */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Transit-Specific Benefits</h4>
              <div className="space-y-2">
                {analysis.transitBenefits?.map((benefit, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-semibold text-green-900 text-sm">{benefit.benefit}</h5>
                      <div className="flex items-center space-x-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold">{benefit.improvement}</span>
                      </div>
                    </div>
                    <p className="text-xs text-green-700">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* General Traffic Impact */}
            <div className={`p-4 border-2 rounded-lg ${
              analysis.generalTrafficImpact?.percentageChange < 5 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {analysis.generalTrafficImpact?.percentageChange < 5 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-yellow-600" />
                )}
                <h4 className="font-semibold text-slate-900">General Traffic Impact</h4>
              </div>
              <p className="text-sm text-slate-700 mb-2">
                {analysis.generalTrafficImpact?.description}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Average Delay Change:</span>
                <Badge variant={analysis.generalTrafficImpact?.percentageChange < 5 ? 'default' : 'secondary'}>
                  +{analysis.generalTrafficImpact?.percentageChange}%
                </Badge>
              </div>
            </div>

            {/* Cost-Benefit Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Cost-Benefit Analysis</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                {analysis.costBenefitSummary}
              </p>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Implementation Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendations?.map((rec, index) => (
                  <li 
                    key={index}
                    className="text-sm text-slate-700 pl-4 border-l-2 border-blue-400 py-1"
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={analyzeTransitImpact}
              variant="outline"
              disabled={loading}
              className="w-full"
            >
              Refresh Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}