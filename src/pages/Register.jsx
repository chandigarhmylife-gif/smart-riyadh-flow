import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Link to={createPageUrl('Landing')} className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
        
        <Card className="border-2 border-slate-200 shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 border-2 border-white rounded-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">Get Started</CardTitle>
            <p className="text-slate-600">Create your account to start optimizing traffic</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center py-12 text-slate-600">
              <p>Registration is handled by Base44 platform.</p>
              <p className="mt-2 text-sm">Sign up functionality will be automatically managed.</p>
            </div>
            
            <div className="text-center text-sm">
              <span className="text-slate-600">Already have an account? </span>
              <Link to={createPageUrl('Login')} className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}