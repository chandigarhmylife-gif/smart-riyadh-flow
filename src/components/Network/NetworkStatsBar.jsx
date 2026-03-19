import React from 'react';

export default function NetworkStatsBar({ metrics, elapsedTime, emergencyCount }) {
  const stats = [
    { label: 'Network Efficiency', value: `${metrics.efficiency}%`, sub: 'Across all intersections', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Synchronized Signals', value: `${metrics.synchronized}/${metrics.total}`, sub: 'Active coordination', gradient: 'from-green-500 to-green-600' },
    { label: 'Total Throughput', value: metrics.throughput.toLocaleString(), sub: 'Vehicles per hour', gradient: 'from-purple-500 to-purple-600' },
    { label: 'Avg Wait Time', value: `${metrics.waitTime}s`, sub: 'Network average', gradient: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className={`p-5 bg-gradient-to-br ${s.gradient} rounded-xl text-white`}>
          <div className="text-sm opacity-90 mb-1">{s.label}</div>
          <div className="text-3xl font-bold">{s.value}</div>
          <div className="text-xs opacity-75 mt-2">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}