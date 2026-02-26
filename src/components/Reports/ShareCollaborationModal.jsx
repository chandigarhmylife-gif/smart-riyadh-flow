import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Copy, Send, MessageSquare, Check, Users } from 'lucide-react';

const SAMPLE_COMMENTS = [
  { id: 1, user: 'Ahmed Al-Rashid', time: '10 min ago', text: 'Great improvement in evening peak metrics. Recommend sharing with the city council.' },
  { id: 2, user: 'Sara Mohammed', time: '1 hr ago', text: 'The CO₂ reduction numbers look impressive — can we verify with the sensor team?' },
];

export default function ShareCollaborationModal({ report, onClose }) {
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState(SAMPLE_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);
  const [sharedWith, setSharedWith] = useState(['director@riyadh.gov.sa']);

  const shareLink = `https://smartriyadhflow.app/reports/shared/${report?.title?.replace(/\s+/g, '-').toLowerCase() || 'report'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (!email || sharedWith.includes(email)) return;
    setSharedWith([...sharedWith, email]);
    setEmail('');
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { id: Date.now(), user: 'You', time: 'Just now', text: newComment }]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Share & Collaborate</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Share Link */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Share Link</p>
            <div className="flex items-center space-x-2">
              <input readOnly value={shareLink} className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-600 bg-slate-50" />
              <Button size="sm" variant="outline" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Invite by Email */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Invite Collaborators</p>
            <div className="flex items-center space-x-2">
              <input
                className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-sm"
                placeholder="Enter email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleInvite()}
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleInvite}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {sharedWith.map(em => (
                <Badge key={em} variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">{em}</Badge>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> Comments
            </p>
            <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
              {comments.map(c => (
                <div key={c.id} className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">{c.user}</span>
                    <span className="text-xs text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-600">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                className="flex-1 border border-slate-200 rounded px-3 py-1.5 text-sm"
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
              />
              <Button size="sm" variant="outline" onClick={handleComment}>Post</Button>
            </div>
          </div>

          {/* Version */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Version History</p>
            <div className="space-y-1">
              {[{ v: 'v1.2', t: 'Today 9:14 AM', note: 'Expanded Rec. section' }, { v: 'v1.1', t: 'Yesterday 4:00 PM', note: 'Added KPI table' }, { v: 'v1.0', t: '2 days ago', note: 'Initial generation' }].map(item => (
                <div key={item.v} className="flex items-center justify-between text-xs text-slate-600 py-1 border-b border-slate-100">
                  <span className="font-mono font-semibold text-blue-700">{item.v}</span>
                  <span>{item.note}</span>
                  <span className="text-slate-400">{item.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}