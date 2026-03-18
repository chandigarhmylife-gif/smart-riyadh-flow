import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import DataSourceCard from '../components/TrafficData/DataSourceCard';
import DataPreviewTable from '../components/TrafficData/DataPreviewTable';
import DataImport from '../components/Scenarios/DataImport';
import FileProcessor from '../components/TrafficData/FileProcessor';

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
    setDataSources(prev => prev.map(s => 
      s.id === source.id ? { ...s, lastUpdated: 'Just now', status: 'connected' } : s
    ));
  };

  const handleSettings = (source) => {
    // Toggle connection status as a simple settings action
    setDataSources(prev => prev.map(s => 
      s.id === source.id ? { ...s, status: s.status === 'connected' ? 'disconnected' : 'connected' } : s
    ));
  };

  const handleDelete = (source) => {
    setDataSources(dataSources.filter(s => s.id !== source.id));
  };

  const [fileToProcess, setFileToProcess] = useState(null);

  const handleImportComplete = (data) => {
    console.log('Data imported:', data);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToProcess(file);
    }
  };

  const handleProcessComplete = (cleanedData, quality) => {
    console.log('Processed:', cleanedData, quality);
    setFileToProcess(null);
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
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
            const id = Date.now();
            setDataSources(prev => [...prev, {
              id,
              name: `New Data Source ${prev.length + 1}`,
              type: 'Manual Import',
              status: 'disconnected',
              lastUpdated: 'Never'
            }]);
          }}>
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

        {/* Advanced File Processing */}
        {fileToProcess ? (
          <FileProcessor 
            file={fileToProcess} 
            onProcessComplete={handleProcessComplete}
          />
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileSelect}
              className="hidden"
              id="advanced-upload"
            />
            <label htmlFor="advanced-upload" className="cursor-pointer">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Advanced File Processing
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload CSV or JSON for validation and transformation
                  </p>
                </div>
              </div>
            </label>
          </div>
        )}

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