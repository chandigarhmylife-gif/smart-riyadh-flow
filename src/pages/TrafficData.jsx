import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataSourceCard from '../components/TrafficData/DataSourceCard';
import DataPreviewTable from '../components/TrafficData/DataPreviewTable';
import DataImport from '../components/Scenarios/DataImport';

export default function TrafficData() {
  const [dataSources, setDataSources] = useState([
    {
      id: 1,
      name: 'Main Street Sensors',
      type: 'Live API Feed',
      status: 'connected',
      lastUpdated: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Historical CSV Data',
      type: 'CSV Import',
      status: 'connected',
      lastUpdated: '1 hour ago'
    },
    {
      id: 3,
      name: 'Traffic Camera Feed',
      type: 'Video Analytics',
      status: 'disconnected',
      lastUpdated: '3 days ago'
    }
  ]);

  const handleRefresh = (source) => {
    console.log('Refreshing:', source);
  };

  const handleSettings = (source) => {
    console.log('Settings for:', source);
  };

  const handleDelete = (source) => {
    setDataSources(dataSources.filter(s => s.id !== source.id));
  };

  const handleImportComplete = (data) => {
    console.log('Data imported:', data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Traffic Data Management</h1>
            <p className="text-slate-600">Manage data sources and import traffic data</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Data Source
          </Button>
        </div>

        {/* Data Sources Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Connected Data Sources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {dataSources.map(source => (
              <DataSourceCard
                key={source.id}
                source={source}
                onRefresh={handleRefresh}
                onSettings={handleSettings}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        {/* Import Section */}
        <DataImport onImportComplete={handleImportComplete} />

        {/* Data Preview */}
        <DataPreviewTable />

        {/* Data Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
            <div className="text-sm font-medium text-slate-600 mb-1">Total Records</div>
            <div className="text-2xl font-bold text-slate-900">1,245,892</div>
          </div>
          <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
            <div className="text-sm font-medium text-slate-600 mb-1">Data Sources</div>
            <div className="text-2xl font-bold text-slate-900">{dataSources.length}</div>
          </div>
          <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
            <div className="text-sm font-medium text-slate-600 mb-1">Last Import</div>
            <div className="text-2xl font-bold text-slate-900">2 min ago</div>
          </div>
          <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
            <div className="text-sm font-medium text-slate-600 mb-1">Storage Used</div>
            <div className="text-2xl font-bold text-slate-900">2.4 GB</div>
          </div>
        </div>
      </div>
    </div>
  );
}