import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Clock, TrendingUp, Calendar, Filter, Loader2, FolderOpen } from 'lucide-react';
import moment from 'moment';

export default function ScenarioHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const { data: scenarios = [], isLoading } = useQuery({
    queryKey: ['scenario-history'],
    queryFn: () => base44.entities.TrafficScenario.list('-updated_date', 50),
  });

  const filteredScenarios = scenarios
    .filter(s => filterStatus === 'all' || s.status === filterStatus)
    .filter(s => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.updated_date) - new Date(a.updated_date);
      if (sortBy === 'efficiency') return (b.results?.efficiency || 0) - (a.results?.efficiency || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  const completedScenarios = scenarios.filter(s => s.status === 'completed' && s.results);
  const avgEfficiency = completedScenarios.length > 0
    ? Math.round(completedScenarios.reduce((sum, s) => sum + (s.results?.efficiency || 0), 0) / completedScenarios.length)
    : 0;
  const avgImprovement = completedScenarios.length > 0
    ? Math.round(completedScenarios.reduce((sum, s) => sum + Math.max(0, (s.results?.efficiency || 0) - 75), 0) / completedScenarios.length)
    : 0;

  const handleExport = (scenario) => {
    const data = JSON.stringify(scenario, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(scenario.name || 'scenario').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-slate-100 text-slate-800',
      ready: 'bg-blue-100 text-blue-800',
      running: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Scenario History</h1>
          <p className="text-slate-600">Review past simulation runs and performance data</p>
        </div>

        {/* Filters */}
        <Card className="border-2 border-slate-200">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search scenarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="efficiency">Sort by Efficiency</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-sm text-blue-700 mb-1">Total Scenarios</div>
              <div className="text-3xl font-bold text-blue-600">{scenarios.length}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-sm text-green-700 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-600">{completedScenarios.length}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="text-sm text-purple-700 mb-1">Avg Efficiency</div>
              <div className="text-3xl font-bold text-purple-600">{avgEfficiency || '-'}%</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <div className="text-sm text-emerald-700 mb-1">Avg Improvement</div>
              <div className="text-3xl font-bold text-emerald-600">+{avgImprovement}%</div>
            </CardContent>
          </Card>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Scenario List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredScenarios.map(scenario => (
              <Card key={scenario.id} className="border-2 border-slate-200 hover:border-blue-400 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{scenario.name}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{moment(scenario.updated_date).format('YYYY-MM-DD')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{moment(scenario.updated_date).format('hh:mm A')}</span>
                        </div>
                        <Badge className={getStatusColor(scenario.status)}>
                          {scenario.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExport(scenario)}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-xs text-slate-600 mb-1">Duration</div>
                      <div className="text-lg font-bold text-slate-900">{scenario.config?.duration || '-'} min</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs text-blue-700 mb-1">Avg Wait Time</div>
                      <div className="text-lg font-bold text-blue-600">
                        {scenario.results?.avgWaitTime != null ? `${Math.round(scenario.results.avgWaitTime)}s` : '-'}
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-xs text-green-700 mb-1">Throughput</div>
                      <div className="text-lg font-bold text-green-600">
                        {scenario.results?.throughput != null ? Math.round(scenario.results.throughput) : '-'}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-xs text-purple-700 mb-1">Efficiency</div>
                      <div className="text-lg font-bold text-purple-600">
                        {scenario.results?.efficiency != null ? `${Math.round(scenario.results.efficiency)}%` : '-'}
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="text-xs text-emerald-700 mb-1">CO₂ Saved</div>
                      <div className="text-lg font-bold text-emerald-600 flex items-center">
                        {scenario.results?.co2Saved != null ? (
                          <>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {scenario.results.co2Saved.toFixed(1)} kg
                          </>
                        ) : '-'}
                      </div>
                    </div>
                  </div>
                  {scenario.description && (
                    <p className="text-sm text-slate-500 mt-3">{scenario.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredScenarios.length === 0 && (
          <Card className="border-2 border-slate-200">
            <CardContent className="py-12 text-center">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No scenarios found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}