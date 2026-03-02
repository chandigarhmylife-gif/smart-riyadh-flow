import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Brain, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock, 
  TrendingDown,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Smart Riyadh Flow
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Optimize Traffic Flow with{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Intelligent AI
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Simulate, visualize, and optimize traffic signal control systems using real-time AI analysis. 
                  Reduce congestion, emissions, and wait times with adaptive signal timing.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('Dashboard')}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl shadow-blue-500/30 text-lg px-8 py-6 group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#demo">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-slate-300 hover:border-blue-600 hover:bg-blue-50 text-slate-700 text-lg px-8 py-6"
                  >
                    Watch Demo
                  </Button>
                </a>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">40%</div>
                  <div className="text-sm text-slate-600">Reduced Wait Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">30%</div>
                  <div className="text-sm text-slate-600">Lower Emissions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">50%</div>
                  <div className="text-sm text-slate-600">Better Throughput</div>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Traffic Visualization */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                {/* Traffic Intersection Visualization */}
                <div className="aspect-square relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden">
                  {/* Vertical Road */}
                  <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-32 bg-slate-700">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-16 bg-yellow-400"></div>
                  </div>
                  
                  {/* Horizontal Road */}
                  <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-32 bg-slate-700">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-yellow-400"></div>
                  </div>

                  {/* Traffic Lights */}
                  <div className="absolute top-[calc(50%-80px)] left-[calc(50%-80px)] w-6 h-6 bg-green-500 rounded-full shadow-lg animate-pulse"></div>
                  <div className="absolute top-[calc(50%+54px)] right-[calc(50%-80px)] w-6 h-6 bg-red-500 rounded-full shadow-lg"></div>
                  
                  {/* Animated Cars */}
                  <div className="absolute top-[calc(50%-40px)] left-[calc(50%-16px)] w-8 h-12 bg-blue-500 rounded-lg shadow-lg animate-[slide-down_3s_ease-in-out_infinite]"></div>
                  <div className="absolute top-[calc(50%+28px)] left-[calc(50%+20px)] w-12 h-8 bg-red-400 rounded-lg shadow-lg"></div>
                  <div className="absolute top-[calc(50%-16px)] left-[calc(50%+60px)] w-12 h-8 bg-yellow-500 rounded-lg shadow-lg animate-[slide-left_4s_ease-in-out_infinite]"></div>
                  
                  {/* AI Indicator */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-slate-700">AI Active</span>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-lg font-bold text-green-600">92%</div>
                    <div className="text-xs text-slate-600">Efficiency</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-600">45s</div>
                    <div className="text-xs text-slate-600">Avg Wait</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-lg font-bold text-purple-600">Real-time</div>
                    <div className="text-xs text-slate-600">Analysis</div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-200 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Congestion</div>
                    <div className="text-lg font-bold text-slate-900">-35%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
              Powerful Features for Smart Cities
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive tools for traffic engineers, urban planners, and smart city consultants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">AI-Powered Optimization</h3>
                <p className="text-slate-600 leading-relaxed">
                  Real-time adaptive signal timing using machine learning algorithms that analyze traffic patterns and adjust automatically
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Real-Time Analytics</h3>
                <p className="text-slate-600 leading-relaxed">
                  Comprehensive performance metrics including wait times, throughput, queue lengths, and emission estimates
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Digital Twin Simulation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Interactive 3D visualization of road intersections with realistic vehicle movement and traffic patterns
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Data Integration</h3>
                <p className="text-slate-600 leading-relaxed">
                  Import real traffic data from CSV files, APIs, and live sensors for accurate simulation scenarios
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Scenario Management</h3>
                <p className="text-slate-600 leading-relaxed">
                  Create, save, and load different traffic scenarios for testing various conditions and edge cases
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Performance Comparison</h3>
                <p className="text-slate-600 leading-relaxed">
                  Side-by-side analysis of adaptive AI control versus traditional fixed-time control systems
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Comparison Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
              AI Control vs Traditional Systems
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how intelligent traffic management outperforms fixed-time signals
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Traditional Control */}
            <Card className="border-2 border-red-200 bg-red-50/30">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Traditional Fixed-Time Control</h3>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Cannot adapt to real-time traffic conditions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Causes unnecessary delays during off-peak hours</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Increases vehicle emissions and fuel consumption</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Poor coordination between intersections</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Requires manual adjustments and observations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Control */}
            <Card className="border-2 border-green-200 bg-green-50/30">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">AI-Powered Adaptive Control</h3>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Real-time adaptation to changing traffic patterns</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">40% reduction in average wait times</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">30% lower emissions through optimized flow</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Intelligent multi-intersection coordination</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Continuous learning and performance improvement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Ready to Transform Your Traffic Management?
          </h2>
          <p className="text-xl text-blue-100">
            Join traffic engineers and urban planners using AI to build smarter cities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Dashboard')}>
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-2xl text-lg px-8 py-6 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style>{`
        @keyframes slide-down {
          0%, 100% { transform: translateY(-100px); opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { transform: translateY(100px); }
        }
        
        @keyframes slide-left {
          0%, 100% { transform: translateX(100px); opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { transform: translateX(-100px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}