import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Save, Play, RotateCcw, Loader2, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import NetworkCanvas from '../components/ScenarioBuilder/NetworkCanvas';
import IntersectionEditor from '../components/ScenarioBuilder/IntersectionEditor';
import FlowManager from '../components/ScenarioBuilder/FlowManager';
import SimulationConfig from '../components/ScenarioBuilder/SimulationConfig';
import VehicleDistribution from '../components/ScenarioBuilder/VehicleDistribution';

const DEFAULT_CONFIG = {
  duration: 60,
  weatherCondition: 'clear',
  timeOfDay: 'rush-hour',
  transitPriority: true,
  emergencyVehicles: false,
  incidents: false,
  aiOptimization: true
};

const DEFAULT_DISTRIBUTION = { cars: 70, buses: 15, trucks: 15 };

export default function ScenarioBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [scenarioId, setScenarioId] = useState(null);
  const [scenarioName, setScenarioName] = useState('New Scenario');
  const [description, setDescription] = useState('');
  const [intersections, setIntersections] = useState([]);
  const [vehicleFlows, setVehicleFlows] = useState([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [vehicleDistribution, setVehicleDistribution] = useState(DEFAULT_DISTRIBUTION);
  const [selectedIntersectionId, setSelectedIntersectionId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [loadingScenarios, setLoadingScenarios] = useState(false);

  // Load scenario from URL param if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      loadScenario(id);
    }
  }, []);

  const loadScenario = async (id) => {
    const scenarios = await base44.entities.TrafficScenario.filter({ id });
    if (scenarios.length > 0) {
      const s = scenarios[0];
      setScenarioId(s.id);
      setScenarioName(s.name);
      setDescription(s.description || '');
      setIntersections(s.intersections || []);
      setVehicleFlows(s.vehicle_flows || []);
      setConfig(s.config || DEFAULT_CONFIG);
      setVehicleDistribution(s.vehicle_distribution || DEFAULT_DISTRIBUTION);
      toast({ title: 'Scenario loaded', description: `Loaded "${s.name}"` });
    }
  };

  const handleAddIntersection = () => {
    const newId = intersections.length > 0 
      ? Math.max(...intersections.map(i => i.id)) + 1 
      : 1;
    const canvasWidth = 600;
    const canvasHeight = 380;
    const newIntersection = {
      id: newId,
      name: `Intersection ${newId}`,
      x: 80 + Math.random() * (canvasWidth - 160),
      y: 60 + Math.random() * (canvasHeight - 120),
      lanes: 4,
      type: '4-way'
    };
    setIntersections(prev => [...prev, newIntersection]);
    setSelectedIntersectionId(newId);
  };

  const handleUpdateIntersection = (id, updates) => {
    setIntersections(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const handleDeleteIntersection = (id) => {
    setIntersections(prev => prev.filter(i => i.id !== id));
    setVehicleFlows(prev => prev.filter(f => f.from !== id && f.to !== id));
    if (selectedIntersectionId === id) setSelectedIntersectionId(null);
    toast({ title: 'Intersection removed' });
  };

  const handleAddFlow = () => {
    if (intersections.length < 2) {
      toast({ title: 'Need at least 2 intersections', variant: 'destructive' });
      return;
    }
    const newId = vehicleFlows.length > 0 
      ? Math.max(...vehicleFlows.map(f => f.id)) + 1 
      : 1;
    setVehicleFlows(prev => [...prev, {
      id: newId,
      from: intersections[0].id,
      to: intersections[1].id,
      volume: 100,
      type: 'mixed'
    }]);
  };

  const handleUpdateFlow = (flowId, updates) => {
    setVehicleFlows(prev => prev.map(f => f.id === flowId ? { ...f, ...updates } : f));
  };

  const handleDeleteFlow = (flowId) => {
    setVehicleFlows(prev => prev.filter(f => f.id !== flowId));
    toast({ title: 'Flow removed' });
  };

  const handleSave = async () => {
    if (!scenarioName.trim()) {
      toast({ title: 'Please enter a scenario name', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const data = {
      name: scenarioName,
      description,
      status: 'draft',
      intersections,
      vehicle_flows: vehicleFlows,
      config,
      vehicle_distribution: vehicleDistribution
    };

    if (scenarioId) {
      await base44.entities.TrafficScenario.update(scenarioId, data);
      toast({ title: 'Scenario saved', description: `"${scenarioName}" has been updated.` });
    } else {
      const created = await base44.entities.TrafficScenario.create(data);
      setScenarioId(created.id);
      toast({ title: 'Scenario created', description: `"${scenarioName}" has been saved.` });
    }
    setSaving(false);
  };

  const handleRunSimulation = async () => {
    if (intersections.length === 0) {
      toast({ title: 'Add at least one intersection first', variant: 'destructive' });
      return;
    }
    setRunning(true);
    // Save first, then navigate
    const data = {
      name: scenarioName,
      description,
      status: 'ready',
      intersections,
      vehicle_flows: vehicleFlows,
      config,
      vehicle_distribution: vehicleDistribution
    };

    let id = scenarioId;
    if (id) {
      await base44.entities.TrafficScenario.update(id, data);
    } else {
      const created = await base44.entities.TrafficScenario.create(data);
      id = created.id;
      setScenarioId(id);
    }
    setRunning(false);
    toast({ title: 'Scenario ready', description: 'Navigating to simulation...' });
    navigate(`/Simulation?scenario=${id}`);
  };

  const handleReset = () => {
    setScenarioId(null);
    setScenarioName('New Scenario');
    setDescription('');
    setIntersections([]);
    setVehicleFlows([]);
    setConfig(DEFAULT_CONFIG);
    setVehicleDistribution(DEFAULT_DISTRIBUTION);
    setSelectedIntersectionId(null);
    toast({ title: 'Builder reset', description: 'All fields cleared.' });
  };

  const handleOpenLoadDialog = async () => {
    setLoadDialogOpen(true);
    setLoadingScenarios(true);
    const list = await base44.entities.TrafficScenario.list('-created_date', 20);
    setSavedScenarios(list);
    setLoadingScenarios(false);
  };

  const handleLoadSelected = (scenario) => {
    setScenarioId(scenario.id);
    setScenarioName(scenario.name);
    setDescription(scenario.description || '');
    setIntersections(scenario.intersections || []);
    setVehicleFlows(scenario.vehicle_flows || []);
    setConfig(scenario.config || DEFAULT_CONFIG);
    setVehicleDistribution(scenario.vehicle_distribution || DEFAULT_DISTRIBUTION);
    setLoadDialogOpen(false);
    toast({ title: 'Scenario loaded', description: `Loaded "${scenario.name}"` });
  };

  const selectedIntersection = intersections.find(i => i.id === selectedIntersectionId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Scenario Builder</h1>
            <p className="text-slate-600">Design custom traffic scenarios for simulation</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleOpenLoadDialog} variant="outline" size="sm">
              <FolderOpen className="w-4 h-4 mr-2" />
              Load
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} variant="outline" size="sm" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
            <Button onClick={handleRunSimulation} className="bg-blue-600 hover:bg-blue-700" size="sm" disabled={running}>
              {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Run Simulation
            </Button>
          </div>
        </div>

        {/* Scenario Name & Description */}
        <Card className="border-2 border-slate-200">
          <CardContent className="pt-6 space-y-3">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Scenario Name</Label>
                <Input 
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="e.g., Downtown Rush Hour"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this scenario..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Badge variant="outline" className="text-xs">
                {intersections.length} intersection{intersections.length !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {vehicleFlows.length} flow{vehicleFlows.length !== 1 ? 's' : ''}
              </Badge>
              {scenarioId && (
                <Badge className="bg-green-100 text-green-800 text-xs">Saved</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Canvas + Flows */}
          <div className="lg:col-span-2 space-y-4">
            <NetworkCanvas
              intersections={intersections}
              vehicleFlows={vehicleFlows}
              onUpdateIntersections={setIntersections}
              onAddIntersection={handleAddIntersection}
              onSelectIntersection={setSelectedIntersectionId}
              selectedIntersectionId={selectedIntersectionId}
            />
            <FlowManager
              vehicleFlows={vehicleFlows}
              intersections={intersections}
              onUpdateFlow={handleUpdateFlow}
              onAddFlow={handleAddFlow}
              onDeleteFlow={handleDeleteFlow}
            />
          </div>

          {/* Right: Config sidebar */}
          <div className="space-y-4">
            <IntersectionEditor
              intersection={selectedIntersection}
              onUpdate={handleUpdateIntersection}
              onDelete={handleDeleteIntersection}
              canDelete={intersections.length > 0}
            />
            <SimulationConfig config={config} onConfigChange={setConfig} />
            <VehicleDistribution 
              distribution={vehicleDistribution} 
              onDistributionChange={setVehicleDistribution} 
            />
          </div>
        </div>
      </div>

      {/* Load Scenario Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Load Saved Scenario</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loadingScenarios && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            )}
            {!loadingScenarios && savedScenarios.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">No saved scenarios found.</p>
            )}
            {!loadingScenarios && savedScenarios.map(s => (
              <button
                key={s.id}
                onClick={() => handleLoadSelected(s)}
                className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-sm">{s.name}</span>
                  <Badge variant="outline" className="text-xs">{s.status || 'draft'}</Badge>
                </div>
                {s.description && (
                  <p className="text-xs text-slate-500 mt-1 truncate">{s.description}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-slate-400">
                    {(s.intersections || []).length} intersections
                  </span>
                  <span className="text-xs text-slate-400">
                    {(s.vehicle_flows || []).length} flows
                  </span>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}