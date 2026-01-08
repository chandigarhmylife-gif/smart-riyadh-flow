import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-3xl">Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Analytics dashboard will be implemented in future phases</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}