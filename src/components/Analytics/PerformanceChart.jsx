import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PerformanceChart({ data = [], title = "Performance Over Time" }) {
  const defaultData = [
    { time: '00:00', aiControl: 85, fixedTime: 65 },
    { time: '04:00', aiControl: 88, fixedTime: 67 },
    { time: '08:00', aiControl: 92, fixedTime: 62 },
    { time: '12:00', aiControl: 89, fixedTime: 68 },
    { time: '16:00', aiControl: 94, fixedTime: 64 },
    { time: '20:00', aiControl: 87, fixedTime: 66 }
  ];

  const displayData = data.length > 0 ? data : defaultData;

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="aiControl" 
              stroke="#10B981" 
              strokeWidth={2}
              name="AI Control"
            />
            <Line 
              type="monotone" 
              dataKey="fixedTime" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Fixed-Time"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}