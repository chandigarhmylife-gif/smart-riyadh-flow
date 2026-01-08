import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AIDecisions({ decisions = [] }) {
  const defaultDecisions = [
    {
      id: 1,
      timestamp: '14:23:45',
      decision: 'Extended green phase for North-South',
      reasoning: 'Detected higher vehicle density in northbound lane (12 vehicles). Extended phase by 8 seconds to improve throughput.',
      confidence: 94
    },
    {
      id: 2,
      timestamp: '14:23:30',
      decision: 'Reduced East-West timing',
      reasoning: 'Low traffic detected in east-west direction (3 vehicles). Reduced phase to 15 seconds to optimize overall efficiency.',
      confidence: 91
    },
    {
      id: 3,
      timestamp: '14:23:12',
      decision: 'Maintained current phase',
      reasoning: 'Balanced traffic distribution across all directions. No adjustment needed.',
      confidence: 88
    }
  ];

  const displayDecisions = decisions.length > 0 ? decisions : defaultDecisions;

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>AI Decision Log</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {displayDecisions.map(decision => (
            <div 
              key={decision.id}
              className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-slate-500">{decision.timestamp}</span>
                    <Badge variant="outline" className={`text-xs ${getConfidenceColor(decision.confidence)}`}>
                      {decision.confidence}% confidence
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-slate-900">{decision.decision}</h4>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {decision.reasoning}
              </p>
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-800">
            AI analyzes traffic patterns in real-time and makes adaptive signal timing decisions to optimize flow.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}