import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Workflow, 
  UserCheck, 
  Github, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  activePart: 'hero' | 'part1' | 'part2' | 'part3';
  onNavigate: (part: 'hero' | 'part1' | 'part2' | 'part3') => void;
}

export const Header: React.FC<HeaderProps> = ({ activePart, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'part1' as const,
      label: 'Часть 1 • AI-Пайплайн',
      shortLabel: 'Часть 1',
      icon: Layers,
      href: '#part-1',
      subtitle: 'Отбор, скоринг & офферы'
    },
    {
      id: 'part2' as const,
      label: 'Часть 2 • Автоматизация',
      shortLabel: 'Часть 2',
      icon: Workflow,
      href: '#part-2',
      subtitle: 'Схема, SLA & экономика'
    },
    {
      id: 'part3' as const,
      label: 'Часть 3 • Автор & Кейсы',
      shortLabel: 'Часть 3',
      icon: UserCheck,
      href: '#part-3',
      subtitle: 'Резюме Захара Матвейчука'
    },
  ];

  const handleNavClick = (id: 'hero' | 'part1' | 'part2' | 'part3', href: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/80 backdrop-blur-md border-b border-[#D4C4B7]/60 transition-all duration-200">
      <div className="ld-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop 3-Column Grid for Absolute Mathematical Center Alignment */}
        <div className="hidden md:grid md:grid-cols-3 items-center h-14 sm:h-16">
          
          {/* Col 1: Left Brand Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer group justify-self-start" onClick={() => handleNavClick('hero', '#hero')}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center p-1 shadow-2xs border border-[#48121A]/20 group-hover:scale-105 transition-transform duration-200">
              <img src="/favicon.svg" alt="LD Latte Logo" className="w-full h-full" />
            </div>
            <div>
              <span className="font-['Bodoni_Moda',serif] text-base sm:text-lg font-bold tracking-widest text-[#48121A] leading-none block">
                LD LATTE
              </span>
              <p className="text-[9px] font-bold text-[#8C7C75] tracking-wider uppercase leading-none mt-0.5">
                MODULAR AI PIPELINE
              </p>
            </div>
          </div>

          {/* Col 2: Center Navigation Switcher (Flat Single-Line Buttons) */}
          <div className="justify-self-center">
            <nav className="flex items-center space-x-1 p-0.5 sm:p-1 bg-[#F3EDE2]/80 rounded-xl border border-[#E8E0D7]" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePart === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.href)}
                    className={`flex items-center space-x-1.5 px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
                      isActive
                        ? 'bg-[#FFFFFF] text-[#48121A] shadow-2xs border border-[#48121A]/30'
                        : 'text-[#4A3E39] hover:text-[#48121A] hover:bg-[#EBE3D5]/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#48121A]' : 'text-[#8C7C75]'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Col 3: Right GitHub Action Button */}
          <div className="justify-self-end flex items-center">
            <a
              href="https://github.com/Nek1yZakhar/LD-LATTE"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#48121A] text-[#FAF7F2] hover:bg-[#6B1D2E] flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105"
              title="Исходный код на GitHub"
              aria-label="Исходный код на GitHub"
            >
              <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>

        </div>

        {/* Mobile Flex Bar */}
        <div className="md:hidden flex items-center justify-between h-14">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('hero', '#hero')}>
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center p-1 shadow-sm border border-[#48121A]/20">
              <img src="/favicon.svg" alt="LD Latte Logo" className="w-full h-full" />
            </div>
            <div>
              <span className="font-['Bodoni_Moda',serif] text-lg font-bold tracking-widest text-[#48121A]">
                LD LATTE
              </span>
              <p className="text-[9px] font-bold text-[#8C7C75] tracking-wider uppercase">
                MODULAR AI PIPELINE
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="https://github.com/Nek1yZakhar/LD-LATTE"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-[#48121A] text-[#FAF7F2] flex items-center justify-center"
              title="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#F3EDE2] text-[#161210] border border-[#D4C4B7] hover:bg-[#EBE3D5] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#D4C4B7] px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E0D7]">
            <span className="text-xs font-bold text-[#8C7C75] uppercase tracking-wider">
              MODULAR AI PIPELINE — Навигация
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleNavClick('hero', '#hero')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-colors ${
                activePart === 'hero' ? 'bg-[#48121A]/10 text-[#48121A] border border-[#48121A]/30' : 'bg-[#F3EDE2] text-[#4A3E39]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#48121A]" />
                <span>Обзор системы</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C7C75]" />
            </button>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePart === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.href)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#48121A] border border-[#48121A] shadow-xs'
                      : 'bg-[#F3EDE2] text-[#4A3E39] hover:bg-[#EBE3D5]'
                  }`}
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[#48121A]/15 text-[#48121A]' : 'bg-[#FAF7F2] text-[#8C7C75]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#161210]">{item.label}</p>
                      <p className="text-[11px] text-[#8C7C75]">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C7C75]" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};





