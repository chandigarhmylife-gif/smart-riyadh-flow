import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Leaf, TrendingDown, Factory, Fuel, Wind, Calendar, Download } from 'lucide-react';

export default function EmissionAnalytics() {
  const emissionData = [
    { date: 'Jan 1', co2: 450, nox: 12, pm: 3.2, fuel: 180 },
    { date: 'Jan 2', co2: 420, nox: 11, pm: 2.9, fuel: 168 },
    { date: 'Jan 3', co2: 380, nox: 10, pm: 2.5, fuel: 152 },
    { date: 'Jan 4', co2: 350, nox: 9.5, pm: 2.3, fuel: 140 },
    { date: 'Jan 5', co2: 320, nox: 8.8, pm: 2.1, fuel: 128 },
    { date: 'Jan 6', co2: 310, nox: 8.5, pm: 2.0, fuel: 124 },
    { date: 'Jan 7', co2: 295, nox: 8.2, pm: 1.9, fuel: 118 }
  ];

  const comparisonData = [
    { scenario: 'AI Control', co2: 295, nox: 8.2, fuel: 118 },
    { scenario: 'Fixed-Time', co2: 450, nox: 12.5, fuel: 180 },
    { scenario: 'Reduction', co2: -155, nox: -4.3, fuel: -62 }
  ];

  const vehicleEmissions = [
    { type: 'Cars', co2: 180, percentage: 61 },
    { type: 'Buses', co2: 65, percentage: 22 },
    { type: 'Trucks', co2: 50, percentage: 17 }
  ];

  const hourlyData = [
    { hour: '00:00', emissions: 45 },
    { hour: '03:00', emissions: 28 },
    { hour: '06:00', emissions: 120 },
    { hour: '09:00', emissions: 280 },
    { hour: '12:00', emissions: 210 },
    { hour: '15:00', emissions: 195 },
    { hour: '18:00', emissions: 295 },
    { hour: '21:00', emissions: 150 }
  ];

  const totalReduction = 155;
  const reductionPercentage = ((155 / 450) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Emission Analytics</h1>
            <p className="text-slate-600">Environmental impact and carbon footprint analysis</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Leaf className="w-8 h-8 text-green-600" />
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-sm text-green-700 mb-1">CO₂ Reduction</div>
              <div className="text-3xl font-bold text-green-600">-{reductionPercentage}%</div>
              <div className="text-xs text-green-600 mt-1">{totalReduction} kg/day saved</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Factory className="w-8 h-8 text-blue-600" />
                <div className="text-sm text-blue-700">Today</div>
              </div>
              <div className="text-sm text-blue-700 mb-1">CO₂ Emissions</div>
              <div className="text-3xl font-bold text-blue-600">295 kg</div>
              <div className="text-xs text-blue-600 mt-1">vs 450 kg baseline</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Fuel className="w-8 h-8 text-purple-600" />
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-sm text-purple-700 mb-1">Fuel Saved</div>
              <div className="text-3xl font-bold text-purple-600">62 L</div>
              <div className="text-xs text-purple-600 mt-1">Per day average</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Wind className="w-8 h-8 text-orange-600" />
                <div className="text-sm text-orange-700">NOx</div>
              </div>
              <div className="text-sm text-orange-700 mb-1">Nitrogen Oxides</div>
              <div className="text-3xl font-bold text-orange-600">8.2 kg</div>
              <div className="text-xs text-orange-600 mt-1">-34% reduction</div>
            </CardContent>
          </Card>
        </div>

        {/* Emission Trends */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle>7-Day Emission Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={emissionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="co2" stackId="1" stroke="#10B981" fill="#10B981" name="CO₂ (kg)" />
                <Area type="monotone" dataKey="nox" stackId="2" stroke="#F59E0B" fill="#F59E0B" name="NOx (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI vs Traditional Comparison */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle>AI Control vs Fixed-Time Control Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData.slice(0, 2)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scenario" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="co2" fill="#10B981" name="CO₂ (kg)" />
                <Bar dataKey="nox" fill="#F59E0B" name="NOx (kg)" />
                <Bar dataKey="fuel" fill="#3B82F6" name="Fuel (L)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Vehicle Type Breakdown */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle>Emissions by Vehicle Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicleEmissions.map(vehicle => (
                  <div key={vehicle.type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{vehicle.type}</span>
                      <span className="text-sm font-bold text-slate-900">{vehicle.co2} kg ({vehicle.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${vehicle.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hourly Distribution */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle>Hourly Emission Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="emissions" stroke="#10B981" strokeWidth={3} name="CO₂ (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Impact Summary */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <span>Environmental Impact Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="text-sm text-green-700 mb-1">Trees Equivalent</div>
                <div className="text-2xl font-bold text-green-600">127 trees</div>
                <div className="text-xs text-slate-600 mt-1">CO₂ absorbed annually</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="text-sm text-green-700 mb-1">Cars Off Road</div>
                <div className="text-2xl font-bold text-green-600">34 cars</div>
                <div className="text-xs text-slate-600 mt-1">Daily equivalent reduction</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="text-sm text-green-700 mb-1">Annual Savings</div>
                <div className="text-2xl font-bold text-green-600">56.6 tons</div>
                <div className="text-xs text-slate-600 mt-1">CO₂ reduction projected</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Impact Analysis:</strong> By implementing AI-driven traffic control, the system has achieved a 
                <strong className="text-green-600"> {reductionPercentage}% reduction</strong> in CO₂ emissions compared to traditional 
                fixed-time control. This translates to significant environmental benefits, including reduced air pollution, 
                lower fuel consumption, and improved air quality for the surrounding community.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}