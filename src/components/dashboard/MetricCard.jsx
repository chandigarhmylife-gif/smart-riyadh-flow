import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  colorClass = 'from-blue-500 to-blue-700',
  loading = false 
}) {
  const isPositiveTrend = trend === 'up';
  
  if (loading) {
    return (
      <Card className="border-2 border-slate-200 animate-pulse">
        <CardContent className="p-6">
          <div className="h-20 bg-slate-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-slate-200 hover:shadow-xl transition-all group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {trendValue && (
              <div className="flex items-center space-x-1">
                {isPositiveTrend ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                  {trendValue}
                </span>
                <span className="text-sm text-slate-500">vs last week</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}