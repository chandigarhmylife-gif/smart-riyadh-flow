import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, TrendingUp, Database, RefreshCw, 
  CheckCircle, AlertCircle, Activity, Download
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ModelManagement() {
  const [models, setModels] = useState([
    {
      id: 1,
      name: 'Traffic Signal Optimizer v3.2',
      type: 'signal_control',
      status: 'active',
      accuracy: 94.2,
      version: '3.2.1',
      trainingDate: '2026-01-05',
      lastUsed: '2026-01-09 10:30 AM',
      predictions: 125847,
      avgLatency: '42ms',
      datasetSize: '2.4M samples'
    },
    {
      id: 2,
      name: 'Congestion Predictor',
      type: 'prediction',
      status: 'active',
      accuracy: 91.8,
      version: '2.5.0',
      trainingDate: '2026-01-03',
      lastUsed: '2026-01-09 09:15 AM',
      predictions: 89432,
      avgLatency: '38ms',
      datasetSize: '1.8M samples'
    },
    {
      id: 3,
      name: 'Traffic Flow Analyzer',
      type: 'analysis',
      status: 'training',
      accuracy: 89.5,
      version: '1.9.2',
      trainingDate: '2026-01-08',
      lastUsed: '2026-01-07 04:20 PM',
      predictions: 67823,
      avgLatency: '55ms',
      datasetSize: '3.1M samples'
    },
    {
      id: 4,
      name: 'Incident Detection Model',
      type: 'detection',
      status: 'deprecated',
      accuracy: 85.3,
      version: '1.2.0',
      trainingDate: '2025-12-15',
      lastUsed: '2026-01-01 11:45 AM',
      predictions: 34567,
      avgLatency: '78ms',
      datasetSize: '890K samples'
    }
  ]);

  const performanceData = [
    { date: 'Jan 1', accuracy: 92.1, latency: 45 },
    { date: 'Jan 2', accuracy: 93.2, latency: 43 },
    { date: 'Jan 3', accuracy: 93.8, latency: 41 },
    { date: 'Jan 4', accuracy: 94.0, latency: 42 },
    { date: 'Jan 5', accuracy: 94.2, latency: 42 },
    { date: 'Jan 6', accuracy: 94.1, latency: 43 },
    { date: 'Jan 7', accuracy: 94.3, latency: 41 }
  ];

  const usageData = [
    { model: 'Signal Opt.', usage: 45623 },
    { model: 'Congestion', usage: 32456 },
    { model: 'Flow Analyzer', usage: 28934 },
    { model: 'Incident Det.', usage: 12345 }
  ];

  const handleRetrain = (id) => {
    setModels(models.map(m => 
      m.id === id ? { ...m, status: 'training' } : m
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      training: 'bg-blue-100 text-blue-800',
      deprecated: 'bg-red-100 text-red-800',
      testing: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'active') return <CheckCircle className="w-4 h-4" />;
    if (status === 'training') return <RefreshCw className="w-4 h-4 animate-spin" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getTypeIcon = (type) => {
    return <Brain className="w-5 h-5" />;
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Model Management</h1>
          <p className="text-slate-600">Monitor and manage AI models for traffic control</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-sm text-green-700 mb-1">Active Models</div>
              <div className="text-3xl font-bold text-green-600">
                {models.filter(m => m.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-sm text-blue-700 mb-1">Avg Accuracy</div>
              <div className="text-3xl font-bold text-blue-600">
                {(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="text-sm text-purple-700 mb-1">Total Predictions</div>
              <div className="text-3xl font-bold text-purple-600">387K</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-sm text-orange-700 mb-1">Avg Latency</div>
              <div className="text-3xl font-bold text-orange-600">48ms</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle>Model Accuracy Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[85, 95]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} name="Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle>Model Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#3B82F6" name="Predictions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Models List */}
        <div className="space-y-4">
          {models.map(model => (
            <Card key={model.id} className="border-2 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      {getTypeIcon(model.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-slate-900 text-lg">{model.name}</h3>
                        <Badge className={getStatusColor(model.status)}>
                          {getStatusIcon(model.status)}
                          <span className="ml-1">{model.status}</span>
                        </Badge>
                        <Badge variant="outline">v{model.version}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">Type: {model.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRetrain(model.id)}
                      disabled={model.status === 'training'}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${model.status === 'training' ? 'animate-spin' : ''}`} />
                      Retrain
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Accuracy Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Model Accuracy</span>
                    <span className={`text-sm font-bold ${getAccuracyColor(model.accuracy)}`}>
                      {model.accuracy}%
                    </span>
                  </div>
                  <Progress value={model.accuracy} className="h-2" />
                </div>

                {/* Model Details Grid */}
                <div className="grid md:grid-cols-5 gap-4 pt-4 border-t text-sm">
                  <div>
                    <div className="text-slate-600 mb-1">Training Date</div>
                    <div className="font-semibold text-slate-900">{model.trainingDate}</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Last Used</div>
                    <div className="font-semibold text-slate-900">{model.lastUsed}</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Predictions</div>
                    <div className="font-semibold text-slate-900">{model.predictions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Avg Latency</div>
                    <div className="font-semibold text-slate-900">{model.avgLatency}</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Dataset Size</div>
                    <div className="font-semibold text-slate-900">{model.datasetSize}</div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-slate-600" />
                    <h4 className="text-xs font-semibold text-slate-700">Performance Metrics</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-slate-600">Precision</div>
                      <div className="font-bold text-green-600">92.3%</div>
                    </div>
                    <div>
                      <div className="text-slate-600">Recall</div>
                      <div className="font-bold text-blue-600">89.7%</div>
                    </div>
                    <div>
                      <div className="text-slate-600">F1 Score</div>
                      <div className="font-bold text-purple-600">90.9</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}