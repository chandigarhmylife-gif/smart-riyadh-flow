import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header({ user, onMobileMenuToggle, isMobileMenuOpen }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={createPageUrl('Landing')} className="flex items-center space-x-3 group">

            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Smart Riyadh Flow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">Dashboard</Button>
            </Link>
            <Link to={createPageUrl('Simulation')}>
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">Simulation</Button>
            </Link>
            <Link to={createPageUrl('NetworkSimulation')}>
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">Network</Button>
            </Link>
            <Link to={createPageUrl('Analytics')}>
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">Analytics</Button>
            </Link>
            <Link to={createPageUrl('ScenarioHistory')}>
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">History</Button>
            </Link>
            <Link to={createPageUrl('RealTimeNetwork')}>
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">Real-Time</Button>
            </Link>
            <Link to={createPageUrl('APIConnections')}>
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">API</Button>
            </Link>
            <Link to={createPageUrl('ScenarioBuilder')}>
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">Builder</Button>
            </Link>
          </nav>

          {/* Settings Link */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to={createPageUrl('Settings')}>
              <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                <SettingsIcon className="w-4 h-4 mr-1" /> Settings
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {[
              { label: 'Dashboard', page: 'Dashboard' },
              { label: 'Simulation', page: 'Simulation' },
              { label: 'Network', page: 'NetworkSimulation' },
              { label: 'Analytics', page: 'Analytics' },
              { label: 'History', page: 'ScenarioHistory' },
              { label: 'Real-Time', page: 'RealTimeNetwork' },
              { label: 'API', page: 'APIConnections' },
              { label: 'Builder', page: 'ScenarioBuilder' },
              { label: 'Incidents', page: 'IncidentManagement' },
              { label: 'Devices', page: 'DeviceManagement' },
              { label: 'AI Models', page: 'ModelManagement' },
              { label: 'Baselines', page: 'PerformanceBaselines' },
              { label: 'Emissions', page: 'EmissionAnalytics' },
              { label: 'Public View', page: 'PublicDisplay' },
              { label: 'Settings', page: 'Settings' },
            ].map(({ label, page }) => (
              <Link key={page} to={createPageUrl(page)} className="block">
                <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}