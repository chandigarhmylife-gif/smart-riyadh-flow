import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Filter, Loader2, FolderOpen } from 'lucide-react';

import ScenarioCard from '../components/Scenarios/ScenarioCard';
import CreateScenarioModal from '../components/Scenarios/CreateScenarioModal';
import DataImport from '../components/Scenarios/DataImport';

export default function Scenarios() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-updated_date');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch scenarios from database
  const { data: scenarios = [], isLoading } = useQuery({
    queryKey: ['traffic-scenarios'],
    queryFn: () => base44.entities.TrafficScenario.list('-updated_date', 50),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TrafficScenario.create(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['traffic-scenarios'] });
      setCreateModalOpen(false);
      toast({ title: 'Scenario created', description: `"${created.name}" has been created.` });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TrafficScenario.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traffic-scenarios'] });
      setDeletingId(null);
      toast({ title: 'Scenario deleted' });
    },
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: (scenario) => {
      const { id, created_date, updated_date, created_by, ...data } = scenario;
      return base44.entities.TrafficScenario.create({
        ...data,
        name: `${data.name} (Copy)`,
        status: 'draft',
      });
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['traffic-scenarios'] });
      toast({ title: 'Scenario duplicated', description: `"${created.name}" created.` });
    },
  });

  const handleCreateScenario = (formData) => {
    // Build a starter scenario with one intersection based on form
    const intersection = {
      id: 1,
      name: 'Intersection 1',
      x: 300,
      y: 200,
      lanes: 4,
      type: formData.intersectionType,
    };
    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      status: 'draft',
      intersections: [intersection],
      vehicle_flows: [],
      config: {
        duration: formData.duration,
        weatherCondition: formData.weatherCondition,
        timeOfDay: formData.timeOfDay,
        transitPriority: false,
        emergencyVehicles: false,
        incidents: false,
        aiOptimization: true,
      },
      vehicle_distribution: { cars: 70, buses: 15, trucks: 15 },
    });
  };

  const handleDelete = (scenario) => {
    setDeletingId(scenario.id);
    deleteMutation.mutate(scenario.id);
  };

  const handleDuplicate = (scenario) => {
    duplicateMutation.mutate(scenario);
  };

  const handleImportComplete = (data) => {
    toast({ title: 'Data imported', description: 'Traffic data file processed successfully.' });
  };

  // Filter & sort
  const filtered = scenarios
    .filter(s => {
      const matchesSearch = !searchQuery || 
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === '-updated_date') return new Date(b.updated_date) - new Date(a.updated_date);
      if (sortBy === '-created_date') return new Date(b.created_date) - new Date(a.created_date);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Scenario Management</h1>
            <p className="text-slate-600">Create and manage traffic simulation scenarios</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/ScenarioBuilder')}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Open Builder
            </Button>
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Scenario
            </Button>
          </div>
        </div>

        {/* Search, Filter, Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36 border-2">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40 border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-updated_date">Recently Updated</SelectItem>
              <SelectItem value="-created_date">Recently Created</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Import */}
        <DataImport onImportComplete={handleImportComplete} />

        {/* Stats bar */}
        <div className="flex gap-3 flex-wrap">
          <Badge variant="outline" className="text-xs py-1 px-3">
            Total: {scenarios.length}
          </Badge>
          <Badge className="bg-slate-100 text-slate-700 text-xs py-1 px-3">
            Draft: {scenarios.filter(s => s.status === 'draft').length}
          </Badge>
          <Badge className="bg-green-100 text-green-700 text-xs py-1 px-3">
            Completed: {scenarios.filter(s => s.status === 'completed').length}
          </Badge>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Scenarios Grid */}
        {!isLoading && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {searchQuery || statusFilter !== 'all' ? 'Filtered' : 'All'} Scenarios ({filtered.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(scenario => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  deleting={deletingId === scenario.id}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <Card className="border-2 border-dashed border-slate-300">
                <CardContent className="py-16 text-center">
                  <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No scenarios found</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {searchQuery ? 'Try adjusting your search.' : 'Create your first scenario to get started.'}
                  </p>
                  <Button 
                    onClick={() => setCreateModalOpen(true)} 
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Scenario
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Create Modal */}
        <CreateScenarioModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreateScenario}
          saving={createMutation.isPending}
        />
      </div>
    </div>
  );
}