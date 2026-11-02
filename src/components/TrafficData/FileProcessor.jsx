import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseCSV, validateJsonData, validateCsvData, cleanAndTransform } from '@/lib/trafficData';

export default function FileProcessor({ file, onProcessComplete }) {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const processFile = async () => {
    setProcessing(true);
    setProgress(0);

    try {
      const text = await file.text();
      
      // Simulate processing steps
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 300));

      let data;
      let quality = { errors: [], warnings: [], totalRecords: 0, validRecords: 0 };

      if (file.type === 'application/json') {
        data = JSON.parse(text);
        quality = validateJsonData(data);
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        data = parseCSV(text);
        quality = validateCsvData(data);
      }

      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Transform and clean data
      const cleanedData = cleanAndTransform(data);
      setProgress(100);

      setResult({
        success: true,
        data: cleanedData,
        quality,
        processed: new Date().toISOString()
      });

      if (onProcessComplete) {
        onProcessComplete(cleanedData, quality);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        processed: new Date().toISOString()
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Advanced File Processor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && (
          <>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-600">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Processing...</span>
                  <span className="text-slate-900 font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button 
              onClick={processFile}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {processing ? 'Processing...' : 'Process File'}
            </Button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            {result.success ? (
              <>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Processing Complete</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800 mb-1">Valid Records</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.quality.validRecords}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-sm text-slate-600 mb-1">Total Records</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {result.quality.totalRecords}
                    </div>
                  </div>
                </div>

                {result.quality.errors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        {result.quality.errors.length} Error(s)
                      </span>
                    </div>
                    <ul className="text-xs text-red-700 space-y-1">
                      {result.quality.errors.slice(0, 3).map((err, i) => (
                        <li key={i}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.quality.warnings.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        {result.quality.warnings.length} Warning(s)
                      </span>
                    </div>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {result.quality.warnings.slice(0, 3).map((warn, i) => (
                        <li key={i}>• {warn}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 text-red-600 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Processing Failed</span>
                </div>
                <p className="text-sm text-red-700">{result.error}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}