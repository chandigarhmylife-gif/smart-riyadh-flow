import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Play, Upload, FolderOpen, FileText, BarChart3, Settings, AlertTriangle, Monitor, Zap, Brain } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      label: 'New Simulation',
      description: 'Start a new traffic simulation',
      icon: Play,
      color: 'from-blue-500 to-blue-700',
      path: 'Simulation'
    },
    {
      label: 'Load Scenario',
      description: 'Open existing scenario',
      icon: FolderOpen,
      color: 'from-purple-500 to-purple-700',
      path: 'Scenarios'
    },
    {
      label: 'Upload Data',
      description: 'Import traffic data',
      icon: Upload,
      color: 'from-green-500 to-green-700',
      path: 'TrafficData'
    },
    {
      label: 'View Analytics',
      description: 'Performance metrics',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-700',
      path: 'Analytics'
    },
    {
      label: 'Generate Report',
      description: 'Create detailed report',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-700',
      path: 'Reports'
    },
    {
      label: 'Settings',
      description: 'Configure system',
      icon: Settings,
      color: 'from-slate-500 to-slate-700',
      path: 'Settings'
    },
    {
      label: 'Alert Management',
      description: 'Manage system alerts',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-700',
      path: 'AlertManagement'
    },
    {
      label: 'Device Management',
      description: 'Manage traffic devices',
      icon: Monitor,
      color: 'from-cyan-500 to-cyan-700',
      path: 'DeviceManagement'
    },
    {
      label: 'Incident Management',
      description: 'Track & resolve incidents',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-700',
      path: 'IncidentManagement'
    },
    {
      label: 'Model Management',
      description: 'Manage AI models',
      icon: Brain,
      color: 'from-pink-500 to-pink-700',
      path: 'ModelManagement'
    }
  ];

  return (
    <Card className="border-2 border-slate-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map(action => (
            <Link key={action.label} to={createPageUrl(action.path)}>
              <button className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group text-left">
                <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">{action.label}</h4>
                <p className="text-xs text-slate-600">{action.description}</p>
              </button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}