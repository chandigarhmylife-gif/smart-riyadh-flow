import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import ScenarioCard from '../components/Scenarios/ScenarioCard';
import CreateScenarioModal from '../components/Scenarios/CreateScenarioModal';
import DataImport from '../components/Scenarios/DataImport';

export default function Scenarios() {
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: 'Downtown Rush Hour',
      description: 'Heavy traffic during morning peak hours at Main & 1st Street intersection',
      intersectionType: '4-way',
      vehicleCount: 120,
      lastModified: '2 hours ago'
    },
    {
      id: 2,
      name: 'School Zone Morning',
      description: 'Morning school drop-off traffic with pedestrian crossings',
      intersectionType: '3-way',
      vehicleCount: 45,
      lastModified: '1 day ago'
    },
    {
      id: 3,
      name: 'Evening Commute',
      description: 'Typical evening traffic pattern with mixed vehicle types',
      intersectionType: '4-way',
      vehicleCount: 85,
      lastModified: '3 days ago'
    }
  ]);

  const handleSaveScenario = (newScenario) => {
    setScenarios([newScenario, ...scenarios]);
  };

  const handleEdit = (scenario) => {
    console.log('Edit scenario:', scenario);
  };

  const handleDelete = (scenario) => {
    setScenarios(scenarios.filter(s => s.id !== scenario.id));
  };

  const handleDuplicate = (scenario) => {
    const duplicated = {
      ...scenario,
      id: Date.now(),
      name: `${scenario.name} (Copy)`,
      lastModified: 'Just now'
    };
    setScenarios([duplicated, ...scenarios]);
  };

  const handleImportComplete = (data) => {
    console.log('Import complete:', data);
  };

  const filteredScenarios = scenarios.filter(scenario =>
    scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scenario.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Scenario Management</h1>
            <p className="text-slate-600">Create and manage traffic simulation scenarios</p>
          </div>
          <Button 
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Scenario
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Data Import Section */}
        <DataImport onImportComplete={handleImportComplete} />

        {/* Scenarios Grid */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            All Scenarios ({filteredScenarios.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenarios.map(scenario => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>

          {filteredScenarios.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No scenarios found matching your search.</p>
            </div>
          )}
        </div>

        {/* Create Modal */}
        <CreateScenarioModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleSaveScenario}
        />
      </div>
    </div>
  );
}