import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Play, BarChart3, Upload, Settings } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Monitor and manage your traffic control simulations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to={createPageUrl('Simulation')}>
            <Card className="border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Start</div>
                  <div className="text-sm text-slate-600">Simulation</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('Analytics')}>
            <Card className="border-2 border-slate-200 hover:border-green-400 hover:shadow-xl transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">View</div>
                  <div className="text-sm text-slate-600">Analytics</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-2 border-slate-200 hover:border-purple-400 hover:shadow-xl transition-all cursor-pointer group">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Upload</div>
                <div className="text-sm text-slate-600">Traffic Data</div>
              </div>
            </CardContent>
          </Card>

          <Link to={createPageUrl('Settings')}>
            <Card className="border-2 border-slate-200 hover:border-orange-400 hover:shadow-xl transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Manage</div>
                  <div className="text-sm text-slate-600">Settings</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              Welcome to AI-Traffic Control! This dashboard is your central hub for managing traffic simulations and analyzing performance.
            </p>
            <div className="text-sm text-slate-500">
              Phase 1 complete - Core UI foundation and navigation established.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}