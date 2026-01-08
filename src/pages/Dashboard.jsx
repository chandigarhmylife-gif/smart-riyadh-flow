import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Activity, Users, Zap, Clock } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import RecentScenarios from '../components/dashboard/RecentScenarios';
import SystemStatus from '../components/dashboard/SystemStatus';
import QuickActions from '../components/dashboard/QuickActions';
import AlertsPanel from '../components/dashboard/AlertsPanel';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Welcome back{user ? `, ${user.full_name || user.email.split('@')[0]}` : ''}
          </h1>
          <p className="text-slate-600">Monitor and manage your traffic control simulations</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            title="Active Simulations"
            value="3"
            icon={Activity}
            trend="up"
            trendValue="+2"
            colorClass="from-blue-500 to-blue-700"
            loading={loading}
          />
          <MetricCard
            title="Avg Efficiency"
            value="89%"
            icon={Zap}
            trend="up"
            trendValue="+5%"
            colorClass="from-green-500 to-green-700"
            loading={loading}
          />
          <MetricCard
            title="Total Scenarios"
            value="24"
            icon={Users}
            trend="up"
            trendValue="+3"
            colorClass="from-purple-500 to-purple-700"
            loading={loading}
          />
          <MetricCard
            title="Avg Wait Time"
            value="42s"
            icon={Clock}
            trend="down"
            trendValue="-8s"
            colorClass="from-orange-500 to-orange-700"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2 columns width */}
          <div className="lg:col-span-2 space-y-6">
            <RecentScenarios loading={loading} />
            <AlertsPanel alerts={alerts} onDismiss={handleDismissAlert} />
          </div>

          {/* Right Column - 1 column width */}
          <div className="space-y-6">
            <SystemStatus loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}