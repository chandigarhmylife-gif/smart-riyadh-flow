import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Clock, TrendingUp, Calendar, Filter } from 'lucide-react';

export default function ScenarioHistory() {
  const [scenarios, setScenarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Mock data - replace with actual database query
    const mockHistory = [
      {
        id: 1,
        name: 'Downtown Rush Hour',
        date: '2026-01-08',
        time: '08:30 AM',
        duration: '45 min',
        type: 'rush-hour',
        avgWaitTime: 38,
        throughput: 1247,
        efficiency: 92,
        emissions: -28,
        improvement: 25
      },
      {
        id: 2,
        name: 'School Zone Morning',
        date: '2026-01-07',
        time: '07:45 AM',
        duration: '30 min',
        type: 'school-zone',
        avgWaitTime: 42,
        throughput: 892,
        efficiency: 87,
        emissions: -22,
        improvement: 18
      },
      {
        id: 3,
        name: 'Evening Commute Test',
        date: '2026-01-07',
        time: '05:15 PM',
        duration: '60 min',
        type: 'evening',
        avgWaitTime: 45,
        throughput: 1389,
        efficiency: 89,
        emissions: -31,
        improvement: 22
      },
      {
        id: 4,
        name: 'Weekend Light Traffic',
        date: '2026-01-06',
        time: '11:00 AM',
        duration: '20 min',
        type: 'custom',
        avgWaitTime: 28,
        throughput: 567,
        efficiency: 94,
        emissions: -15,
        improvement: 12
      },
      {
        id: 5,
        name: 'Night Mode Test',
        date: '2026-01-05',
        time: '11:30 PM',
        duration: '15 min',
        type: 'custom',
        avgWaitTime: 22,
        throughput: 234,
        efficiency: 96,
        emissions: -8,
        improvement: 9
      }
    ];
    setScenarios(mockHistory);
  }, []);

  const filteredScenarios = scenarios
    .filter(s => filterType === 'all' || s.type === filterType)
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return b.id - a.id;
      if (sortBy === 'efficiency') return b.efficiency - a.efficiency;
      if (sortBy === 'improvement') return b.improvement - a.improvement;
      return 0;
    });

  const handleExport = (scenario) => {
    const data = JSON.stringify(scenario, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scenario.name.replace(/\s+/g, '_')}_${scenario.date}.json`;
    a.click();
  };

  const getTypeColor = (type) => {
    const colors = {
      'rush-hour': 'bg-red-100 text-red-800',
      'school-zone': 'bg-yellow-100 text-yellow-800',
      'evening': 'bg-orange-100 text-orange-800',
      'custom': 'bg-blue-100 text-blue-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Scenario History</h1>
          <p className="text-slate-600">Review past simulation runs and performance data</p>
        </div>

        {/* Filters & Search */}
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
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rush-hour">Rush Hour</SelectItem>
                  <SelectItem value="school-zone">School Zone</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="efficiency">Sort by Efficiency</SelectItem>
                  <SelectItem value="improvement">Sort by Improvement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-sm text-blue-700 mb-1">Total Simulations</div>
              <div className="text-3xl font-bold text-blue-600">{scenarios.length}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-sm text-green-700 mb-1">Avg Efficiency</div>
              <div className="text-3xl font-bold text-green-600">
                {Math.round(scenarios.reduce((sum, s) => sum + s.efficiency, 0) / scenarios.length)}%
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="text-sm text-purple-700 mb-1">Avg Improvement</div>
              <div className="text-3xl font-bold text-purple-600">
                +{Math.round(scenarios.reduce((sum, s) => sum + s.improvement, 0) / scenarios.length)}%
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <div className="text-sm text-emerald-700 mb-1">Total Runtime</div>
              <div className="text-3xl font-bold text-emerald-600">3.5h</div>
            </CardContent>
          </Card>
        </div>

        {/* Scenario List */}
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
                        <span>{scenario.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{scenario.time}</span>
                      </div>
                      <Badge className={getTypeColor(scenario.type)}>
                        {scenario.type}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(scenario)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1">Duration</div>
                    <div className="text-lg font-bold text-slate-900">{scenario.duration}</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-700 mb-1">Avg Wait Time</div>
                    <div className="text-lg font-bold text-blue-600">{scenario.avgWaitTime}s</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-green-700 mb-1">Throughput</div>
                    <div className="text-lg font-bold text-green-600">{scenario.throughput}</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xs text-purple-700 mb-1">Efficiency</div>
                    <div className="text-lg font-bold text-purple-600">{scenario.efficiency}%</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-xs text-emerald-700 mb-1">Improvement</div>
                    <div className="text-lg font-bold text-emerald-600 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{scenario.improvement}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScenarios.length === 0 && (
          <Card className="border-2 border-slate-200">
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">No scenarios found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}