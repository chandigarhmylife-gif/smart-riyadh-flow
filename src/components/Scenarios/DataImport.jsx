import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { detectFormat, parseTrafficFile, cleanAndTransform } from '@/lib/trafficData';

export default function DataImport({ onImportComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [validation, setValidation] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      validateFile(selectedFile);
    }
  };

  const validateFile = (file) => {
    const validTypes = ['text/csv', 'application/json'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setValidation({
        status: 'error',
        message: 'Invalid file type. Please upload CSV or JSON files only.'
      });
      return;
    }

    if (file.size > maxSize) {
      setValidation({
        status: 'error',
        message: 'File size exceeds 10MB limit.'
      });
      return;
    }

    setValidation({
      status: 'success',
      message: 'File validated successfully. Ready to import.'
    });
  };

  const handleUpload = async () => {
    if (!file || validation?.status === 'error') return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Parse the file data
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const raw = parseTrafficFile(e.target.result, detectFormat(file));
          const data = cleanAndTransform(raw);
          
          setValidation({
            status: 'success',
            message: 'Data imported successfully!'
          });
          
          if (onImportComplete) {
            onImportComplete({ file_url, data });
          }
        } catch (error) {
          setValidation({
            status: 'error',
            message: error?.message || 'Failed to parse file data.'
          });
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setValidation({
        status: 'error',
        message: 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = () => {
    if (!validation) return null;
    if (validation.status === 'success') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (validation.status === 'error') return <XCircle className="w-5 h-5 text-red-600" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  };

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <span>Import Traffic Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  CSV or JSON files up to 10MB
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Selected File Info */}
        {file && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-600">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              {getStatusIcon()}
            </div>
          </div>
        )}

        {/* Validation Message */}
        {validation && (
          <div className={`p-3 rounded-lg border ${
            validation.status === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="text-sm">{validation.message}</p>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || validation?.status === 'error' || uploading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Import Data'}
        </Button>

        {/* Format Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Expected format:</strong> CSV with columns: timestamp, vehicle_count, direction, speed. 
            JSON with array of traffic events.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}