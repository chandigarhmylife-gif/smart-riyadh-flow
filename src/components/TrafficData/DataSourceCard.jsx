import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, Settings, Trash2 } from 'lucide-react';

export default function DataSourceCard({ source, onRefresh, onSettings, onDelete }) {
  const getStatusColor = (status) => {
    if (status === 'connected') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'disconnected') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <Card className="border-2 border-slate-200 hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-slate-900">{source.name}</h3>
                <Badge className={`text-xs border ${getStatusColor(source.status)}`}>
                  {source.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-600">{source.type}</p>
              <div className="text-xs text-slate-500">
                Last updated: {source.lastUpdated}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onRefresh(source)}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onSettings(source)}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(source)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}