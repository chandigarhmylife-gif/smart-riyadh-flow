import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, CheckCircle2, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SmartRecommendations({ scenario, metrics }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const prompt = `Generate 3-5 specific signal timing optimization recommendations for this traffic scenario:

Scenario: ${scenario.name}
Current Metrics:
- Wait Time: ${metrics.avgWaitTime}s
- Efficiency: ${metrics.efficiency}%
- Throughput: ${metrics.throughput} veh/h

Provide actionable recommendations with expected impact. Format as JSON array with: title, description, impact, difficulty.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  impact: { type: 'string' },
                  difficulty: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setRecommendations(result.recommendations || []);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty?.toLowerCase() === 'easy') return 'bg-green-100 text-green-800 border-green-200';
    if (difficulty?.toLowerCase() === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <span>Smart Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <Button 
            onClick={generateRecommendations}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          >
            {loading ? 'Generating...' : 'Generate AI Recommendations'}
          </Button>
        ) : (
          <>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white border-2 border-slate-200 rounded-lg hover:border-yellow-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 flex-1">{rec.title}</h4>
                    <Badge className={`text-xs border ${getDifficultyColor(rec.difficulty)}`}>
                      {rec.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                  <div className="flex items-center space-x-2 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{rec.impact}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={generateRecommendations}
              variant="outline"
              disabled={loading}
              className="w-full"
            >
              Refresh Recommendations
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}