import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Leaf, Clock, CheckCircle } from 'lucide-react';

export default function PublicDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    avgWaitTime: 38,
    throughput: 1567,
    efficiency: 92,
    co2Reduction: 34
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate live metric updates
      setMetrics(prev => ({
        avgWaitTime: Math.max(20, Math.min(60, prev.avgWaitTime + (Math.random() - 0.5) * 3)),
        throughput: Math.max(1200, Math.min(2000, prev.throughput + (Math.random() - 0.5) * 20)),
        efficiency: Math.max(80, Math.min(98, prev.efficiency + (Math.random() - 0.5) * 2)),
        co2Reduction: Math.max(25, Math.min(45, prev.co2Reduction + (Math.random() - 0.5) * 1))
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const intersectionStatus = [
    { name: 'King Fahd / Al Urubah', status: 'optimal', flow: 'high' },
    { name: 'Olaya / Al Urubah', status: 'good', flow: 'medium' },
    { name: 'Olaya / Tahlia', status: 'optimal', flow: 'high' },
    { name: 'Olaya / Musa Bin Nusair', status: 'moderate', flow: 'medium' }
  ];

  const getStatusColor = (status) => {
    if (status === 'optimal') return 'bg-green-500';
    if (status === 'good') return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-white">City Traffic Control System</h1>
          <p className="text-2xl text-blue-200">AI-Powered Adaptive Signal Management</p>
          <div className="flex items-center justify-center space-x-2 text-xl text-white">
            <Activity className="w-6 h-6 animate-pulse text-green-400" />
            <span>System Online</span>
            <span className="text-blue-200">•</span>
            <Clock className="w-5 h-5" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-3 text-blue-300" />
                <div className="text-sm text-blue-200 mb-2">Average Wait Time</div>
                <div className="text-5xl font-bold text-white mb-2">
                  {Math.round(metrics.avgWaitTime)}s
                </div>
                <Badge className="bg-green-500/30 text-green-200 border-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Optimal
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-3 text-green-300" />
                <div className="text-sm text-blue-200 mb-2">Throughput</div>
                <div className="text-5xl font-bold text-white mb-2">
                  {Math.round(metrics.throughput)}
                </div>
                <div className="text-sm text-blue-200">vehicles/hour</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-purple-300" />
                <div className="text-sm text-blue-200 mb-2">System Efficiency</div>
                <div className="text-5xl font-bold text-white mb-2">
                  {Math.round(metrics.efficiency)}%
                </div>
                <Badge className="bg-purple-500/30 text-purple-200 border-purple-400">
                  Excellent
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <Leaf className="w-12 h-12 mx-auto mb-3 text-green-300" />
                <div className="text-sm text-blue-200 mb-2">CO₂ Reduction</div>
                <div className="text-5xl font-bold text-white mb-2">
                  {Math.round(metrics.co2Reduction)}%
                </div>
                <div className="text-sm text-green-300">vs traditional</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Intersection Status */}
        <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl text-white text-center">Live Intersection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {intersectionStatus.map((intersection, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{intersection.name}</h3>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-blue-500/30 text-blue-200 border-blue-400 text-sm px-3 py-1">
                          {intersection.flow} flow
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full ${getStatusColor(intersection.status)} animate-pulse mb-2`}></div>
                      <span className="text-white text-sm font-medium">{intersection.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/20">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl font-bold text-green-400 mb-2">4</div>
              <div className="text-xl text-white">Active Intersections</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/20">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-xl text-white">AI Monitoring</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-2 border-white/20">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl font-bold text-purple-400 mb-2">+25%</div>
              <div className="text-xl text-white">Improvement</div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-blue-200 text-lg">
          <p>Real-time data powered by AI Traffic Control System</p>
          <p className="text-sm mt-2 text-blue-300">Data updates every 3 seconds</p>
        </div>
      </div>
    </div>
  );
}