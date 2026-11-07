import React, { useState, useEffect, useMemo } from 'react';
import { referenceMetrics } from '@/lib/referenceRun';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Activity, Users, Zap, Clock } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import RecentScenarios from '../components/dashboard/RecentScenarios';
import SystemStatus from '../components/dashboard/SystemStatus';
import QuickActions from '../components/dashboard/QuickActions';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import LiveMetricsStream from '../components/RealTime/LiveMetricsStream';
import PredictiveAnalytics from '../components/AI/PredictiveAnalytics';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [liveUpdatesActive, setLiveUpdatesActive] = useState(true);

  const { data: scenarios = [] } = useQuery({
    queryKey: ['dashboard-scenarios'],
    queryFn: () => base44.entities.TrafficScenario.list('-updated_date', 50),
  });

  const completedScenarios = scenarios.filter(s => s.status === 'completed' && s.results);

  // Average only the values that saved results actually contain.
  const avgOf = (key) => {
    const vals = completedScenarios.map(c => c.results?.[key]).filter(v => Number.isFinite(v));
    return vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null;
  };
  const saved = {
    avgWaitTime: avgOf('avgWaitTime'),
    throughput: avgOf('throughput'),
    efficiency: avgOf('efficiency'),
    queueLength: avgOf('queueLength'),
  };
  const hasSaved = Object.values(saved).some(v => v !== null);

  // Before any results are saved, show a real 1-hour rush-hour simulation
  // (adaptive control, fixed seed) instead of made-up numbers.
  const reference = useMemo(() => referenceMetrics({ controlMode: 'adaptive', seconds: 3600, seed: 1 }), []);
  const currentMetrics = hasSaved
    ? Object.fromEntries(Object.entries(saved).map(([k, v]) => [k, v ?? reference[k]]))
    : reference;
  const metricsSource = hasSaved ? `${completedScenarios.length} completed` : 'reference sim';

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
            value={String(scenarios.filter(s => s.status === 'running').length)}
            icon={Activity}
            trend="up"
            trendValue={`${scenarios.filter(s => s.status === 'ready').length} ready`}
            colorClass="from-blue-500 to-blue-700"
            loading={loading}
          />
          <MetricCard
            title="Avg Efficiency"
            value={`${currentMetrics.efficiency}%`}
            icon={Zap}
            trend="up"
            trendValue={metricsSource}
            colorClass="from-green-500 to-green-700"
            loading={loading}
          />
          <MetricCard
            title="Total Scenarios"
            value={String(scenarios.length)}
            icon={Users}
            trend="up"
            trendValue={`${scenarios.filter(s => s.status === 'draft').length} drafts`}
            colorClass="from-purple-500 to-purple-700"
            loading={loading}
          />
          <MetricCard
            title="Avg Wait Time"
            value={`${currentMetrics.avgWaitTime}s`}
            icon={Clock}
            trend="down"
            trendValue={`${metricsSource} · ${currentMetrics.throughput} veh/h`}
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
            <RecentScenarios scenarios={scenarios.slice(0, 5)} loading={loading} />
            <LiveMetricsStream isActive={liveUpdatesActive} />
            <AlertsPanel alerts={alerts} onDismiss={handleDismissAlert} />
          </div>

          {/* Right Column - 1 column width */}
          <div className="space-y-6">
            <SystemStatus loading={loading} />
            <PredictiveAnalytics currentMetrics={currentMetrics} />
          </div>
        </div>
      </div>
    </div>
  );
}