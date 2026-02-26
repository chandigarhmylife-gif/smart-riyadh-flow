import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function GeneratedReportModal({ report, onClose }) {
  const handlePrint = () => window.print();

  const handleDownload = () => {
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{report.title}</h2>
            <p className="text-sm text-slate-500">Generated on {new Date().toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="prose prose-slate max-w-none
            prose-headings:text-slate-900 prose-headings:font-bold
            prose-h1:text-3xl prose-h1:border-b prose-h1:pb-3 prose-h1:mb-6
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-slate-700 prose-p:leading-relaxed
            prose-strong:text-slate-900
            prose-table:w-full prose-th:bg-slate-100 prose-th:px-4 prose-th:py-2
            prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-slate-200
            prose-li:text-slate-700
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded
          ">
            <ReactMarkdown>{report.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}