import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [activePart, setActivePart] = useState<'hero' | 'part1' | 'part2' | 'part3'>('hero');

  useEffect(() => {
    const sectionIds = ['hero', 'part-1', 'part-2', 'part-3'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (id === 'hero') setActivePart('hero');
            else if (id === 'part-1') setActivePart('part1');
            else if (id === 'part-2') setActivePart('part2');
            else if (id === 'part-3') setActivePart('part3');
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#161210] flex flex-col font-sans selection:bg-[#48121A] selection:text-[#FAF7F2]">
      {/* Primary Clean Sticky Navigation Header */}
      <Header activePart={activePart} onNavigate={setActivePart} />

      {/* Main Unified Single-Page Narrative Container */}
      <main className="flex-1">
        {children}
      </main>

      {/* Production Proof Footer */}
      <Footer />
    </div>
  );
};


