import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricsTable() {
  const [sortField, setSortField] = useState('scenario');
  const [sortDirection, setSortDirection] = useState('asc');

  const data = [
    { scenario: 'Downtown Rush Hour', avgWait: 42, throughput: 156, efficiency: 89, improvement: 23 },
    { scenario: 'School Zone Morning', avgWait: 35, throughput: 98, efficiency: 92, improvement: 28 },
    { scenario: 'Evening Commute', avgWait: 48, throughput: 142, efficiency: 84, improvement: 18 },
    { scenario: 'Weekend Traffic', avgWait: 28, throughput: 112, efficiency: 94, improvement: 31 }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return aVal > bVal ? multiplier : -multiplier;
  });

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle>Efficiency Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('scenario')}>
                  <div className="flex items-center space-x-1">
                    <span>Scenario</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('avgWait')}>
                  <div className="flex items-center space-x-1">
                    <span>Avg Wait (s)</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('throughput')}>
                  <div className="flex items-center space-x-1">
                    <span>Throughput</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('efficiency')}>
                  <div className="flex items-center space-x-1">
                    <span>Efficiency</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('improvement')}>
                  <div className="flex items-center space-x-1">
                    <span>Improvement</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.scenario}</TableCell>
                  <TableCell>{row.avgWait}s</TableCell>
                  <TableCell>{row.throughput} veh/h</TableCell>
                  <TableCell>
                    <span className={row.efficiency >= 85 ? 'text-green-600 font-semibold' : 'text-slate-700'}>
                      {row.efficiency}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-green-600 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{row.improvement}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}