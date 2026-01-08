import React, { useState, useEffect } from 'react';
import Header from './components/Navigation/Header';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        // User not logged in
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Don't show header on landing page
  const showHeader = currentPageName !== 'Landing';

  return (
    <div className="min-h-screen bg-slate-50">
      {showHeader && (
        <Header 
          user={user} 
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      )}
      <main className={showHeader ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  );
}