import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ user, onMobileMenuToggle, isMobileMenuOpen }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={createPageUrl('Landing')} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <div className="w-6 h-6 border-2 border-white rounded-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              AI-Traffic Control
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Link to={createPageUrl('Dashboard')}>
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Dashboard
                  </Button>
                </Link>
                <Link to={createPageUrl('Simulation')}>
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Simulation
                  </Button>
                </Link>
                <Link to={createPageUrl('NetworkSimulation')}>
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Network
                  </Button>
                </Link>
                <Link to={createPageUrl('Analytics')}>
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Analytics
                  </Button>
                </Link>
                <Link to={createPageUrl('ScenarioHistory')}>
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    History
                  </Button>
                </Link>
                <Link to={createPageUrl('RealTimeNetwork')}>
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Real-Time
                  </Button>
                </Link>
                <Link to={createPageUrl('APIConnections')}>
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    API
                  </Button>
                </Link>
                <Link to={createPageUrl('ScenarioBuilder')}>
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Builder
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <a href="#features">
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Features
                  </Button>
                </a>
                <a href="#benefits">
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Benefits
                  </Button>
                </a>
              </>
            )}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{user.full_name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl('Settings')} className="flex items-center">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to={createPageUrl('Login')}>
                  <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Login
                  </Button>
                </Link>
                <Link to={createPageUrl('Register')}>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
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
            {user ? (
              <>
                <Link to={createPageUrl('Dashboard')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Dashboard
                  </Button>
                </Link>
                <Link to={createPageUrl('Simulation')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Simulation
                  </Button>
                </Link>
                <Link to={createPageUrl('NetworkSimulation')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Network
                  </Button>
                </Link>
                <Link to={createPageUrl('Analytics')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Analytics
                  </Button>
                </Link>
                <Link to={createPageUrl('ScenarioHistory')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    History
                  </Button>
                </Link>
                <Link to={createPageUrl('RealTimeNetwork')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Real-Time
                  </Button>
                </Link>
                <Link to={createPageUrl('APIConnections')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    API
                  </Button>
                </Link>
                <Link to={createPageUrl('IncidentManagement')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Incidents
                  </Button>
                </Link>
                <Link to={createPageUrl('DeviceManagement')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Devices
                  </Button>
                </Link>
                <Link to={createPageUrl('ScenarioBuilder')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Builder
                  </Button>
                </Link>
                <Link to={createPageUrl('UserManagement')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Users
                  </Button>
                </Link>
                <Link to={createPageUrl('AlertManagement')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Alerts
                  </Button>
                </Link>
                <Link to={createPageUrl('ModelManagement')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    AI Models
                  </Button>
                </Link>
                <Link to={createPageUrl('Settings')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to={createPageUrl('Login')} className="block">
                  <Button variant="ghost" className="w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    Login
                  </Button>
                </Link>
                <Link to={createPageUrl('Register')} className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}