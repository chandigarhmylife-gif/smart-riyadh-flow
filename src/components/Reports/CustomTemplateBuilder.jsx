import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout, Plus, Trash2, GripVertical, Save, CheckCircle2 } from 'lucide-react';

const AVAILABLE_SECTIONS = [
  { id: 'exec_summary', label: 'Executive Summary' },
  { id: 'kpi_table', label: 'KPI Dashboard Table' },
  { id: 'intersection_analysis', label: 'Intersection Analysis' },
  { id: 'ai_vs_fixed', label: 'AI vs Fixed-Time Comparison' },
  { id: 'environmental', label: 'Environmental Impact' },
  { id: 'incident_log', label: 'Incident & Anomaly Log' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'risk_assessment', label: 'Risk Assessment' },
  { id: 'roadmap', label: 'Implementation Roadmap' },
  { id: 'conclusion', label: 'Conclusion' },
];

const SAVED_TEMPLATES = [
  { id: 1, name: 'City Council Brief', sections: ['exec_summary', 'kpi_table', 'recommendations'] },
  { id: 2, name: 'Full Engineering Report', sections: AVAILABLE_SECTIONS.map(s => s.id) },
];

export default function CustomTemplateBuilder({ onTemplateSelect }) {
  const [selectedSections, setSelectedSections] = useState(['exec_summary', 'kpi_table', 'recommendations']);
  const [templateName, setTemplateName] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState(SAVED_TEMPLATES);
  const [activeTab, setActiveTab] = useState('build'); // 'build' | 'saved'

  const toggle = (id) => {
    setSelectedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!templateName.trim()) return;
    const newTemplate = { id: Date.now(), name: templateName, sections: selectedSections };
    setSavedTemplates([...savedTemplates, newTemplate]);
    setTemplateName('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const loadTemplate = (t) => {
    setSelectedSections(t.sections);
    setActiveTab('build');
    onTemplateSelect?.(t);
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layout className="w-5 h-5 text-blue-600" />
            <span>Custom Template Builder</span>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant={activeTab === 'build' ? 'default' : 'outline'}
              className={activeTab === 'build' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              onClick={() => setActiveTab('build')}>Build</Button>
            <Button size="sm" variant={activeTab === 'saved' ? 'default' : 'outline'}
              className={activeTab === 'saved' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              onClick={() => setActiveTab('saved')}>Saved ({savedTemplates.length})</Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeTab === 'build' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Select sections to include in your report template:</p>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {AVAILABLE_SECTIONS.map(section => {
                const active = selectedSections.includes(section.id);
                return (
                  <div
                    key={section.id}
                    onClick={() => toggle(section.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all ${active ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <GripVertical className="w-4 h-4 text-slate-300" />
                    <span className={`text-sm flex-1 ${active ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>{section.label}</span>
                    {active && <Badge className="bg-blue-600 text-white text-xs">Included</Badge>}
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-slate-500">{selectedSections.length} of {AVAILABLE_SECTIONS.length} sections selected</div>

            <div className="flex gap-2">
              <input
                className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-sm"
                placeholder="Template name to save..."
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={!templateName.trim()}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </div>
            {saved && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Template saved successfully!
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-2">
            {savedTemplates.map(t => (
              <div key={t.id} className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.sections.length} sections</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => loadTemplate(t)}>
                    <Plus className="w-3 h-3 mr-1" /> Use
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7"
                    onClick={() => setSavedTemplates(prev => prev.filter(x => x.id !== t.id))}>
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
            {savedTemplates.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No saved templates yet.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}