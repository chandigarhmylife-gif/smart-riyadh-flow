import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, BarChart3, Clock, CheckCircle2 } from 'lucide-react';

export default function ReportTemplate({ template, selected, onSelect }) {
  const icons = {
    performance: BarChart3,
    daily: Clock,
    summary: FileText,
    comparison: CheckCircle2
  };

  const Icon = icons[template.type] || FileText;

  return (
    <Card 
      className={`cursor-pointer border-2 transition-all ${
        selected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
      }`}
      onClick={() => onSelect(template)}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            selected ? 'bg-blue-600' : 'bg-slate-100'
          }`}>
            <Icon className={`w-6 h-6 ${selected ? 'text-white' : 'text-slate-600'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
            <p className="text-sm text-slate-600">{template.description}</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs bg-slate-100 px-2 py-1 rounded">{template.metrics} metrics</span>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded">{template.pages} pages</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}