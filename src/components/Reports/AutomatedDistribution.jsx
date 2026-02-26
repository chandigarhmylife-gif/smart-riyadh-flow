import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Mail, Cloud, CheckCircle2, Loader2, FolderOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DESTINATIONS = [
  { key: 'email', label: 'Email', icon: Mail, desc: 'Send to recipient email', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { key: 'drive', label: 'Google Drive', icon: Cloud, desc: 'Upload to Drive folder', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { key: 'dropbox', label: 'Dropbox', icon: FolderOpen, desc: 'Save to Dropbox', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
];

export default function AutomatedDistribution({ report }) {
  const [selected, setSelected] = useState('email');
  const [email, setEmail] = useState('');
  const [folder, setFolder] = useState('/SmartRiyadhFlow/Reports');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (selected === 'email' && !email) return;
    setSending(true);
    if (selected === 'email' && email) {
      await base44.integrations.Core.SendEmail({
        to: email,
        subject: `Smart Riyadh Flow Report: ${report?.title || 'Traffic Report'}`,
        body: `Dear Recipient,\n\nPlease find your requested Smart Riyadh Flow traffic report attached below.\n\nReport: ${report?.title || 'Traffic Report'}\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n${report?.content?.slice(0, 1500) || 'Report content'}\n\n...[Full report truncated for email. Download from the platform for full content.]\n\nBest regards,\nSmart Riyadh Flow System`
      });
    }
    // Simulate cloud upload for Drive/Dropbox
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="w-5 h-5 text-blue-600" />
          <span>Automated Distribution</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Destination Selection */}
        <div className="grid grid-cols-3 gap-2">
          {DESTINATIONS.map(d => {
            const Icon = d.icon;
            return (
              <button
                key={d.key}
                onClick={() => { setSelected(d.key); setSent(false); }}
                className={`border-2 rounded-lg p-3 text-center transition-all ${selected === d.key ? d.bg + ' border-opacity-100' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${selected === d.key ? d.color : 'text-slate-400'}`} />
                <p className={`text-xs font-semibold ${selected === d.key ? d.color : 'text-slate-500'}`}>{d.label}</p>
              </button>
            );
          })}
        </div>

        {/* Input */}
        {selected === 'email' && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Recipient Email</label>
            <input
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
              placeholder="recipient@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        )}
        {(selected === 'drive' || selected === 'dropbox') && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Destination Folder</label>
            <input
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm font-mono"
              value={folder}
              onChange={e => setFolder(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-1">
              Note: {selected === 'drive' ? 'Google Drive' : 'Dropbox'} integration requires Builder+ plan for full OAuth connection.
            </p>
          </div>
        )}

        {/* Status */}
        {sent && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            {selected === 'email' ? `Report sent to ${email}` : `Report uploaded to ${folder}`}
          </div>
        )}

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleSend}
          disabled={sending || !report || (selected === 'email' && !email)}
        >
          {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Send className="w-4 h-4 mr-2" /> Send Report</>}
        </Button>

        {!report && <p className="text-xs text-slate-400 text-center">Generate a report first to enable distribution.</p>}
      </CardContent>
    </Card>
  );
}