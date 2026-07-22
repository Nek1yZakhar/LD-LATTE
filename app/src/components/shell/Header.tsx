import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Workflow, 
  UserCheck, 
  ShieldCheck, 
  Github, 
  Menu, 
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DESIGN_TOKENS } from '@/lib/design-tokens';

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
      subtitle: 'Инструмент, скоринг & офферы'
    },
    {
      id: 'part2' as const,
      label: 'Часть 2 • Автоматизация',
      shortLabel: 'Часть 2',
      icon: Workflow,
      href: '#part-2',
      subtitle: 'Схема, SLA & Экономика'
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
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#D4C4B7] shadow-sm transition-all duration-200">
      <div className="ld-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Area */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('hero', '#hero')}>
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center p-1 shadow-sm border border-[#48121A]/20 group-hover:scale-105 transition-transform duration-200">
              <img src="/favicon.svg" alt="LD Latte Logo" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-['Bodoni_Moda',serif] text-xl font-bold tracking-widest text-[#48121A]">
                  LD LATTE
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#48121A]/10 text-[#48121A] border border-[#48121A]/20">
                  DEMO UI
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#8C7C75] tracking-widest uppercase">
                Modular AI Pipeline
              </p>
            </div>
          </div>

          {/* Desktop Navigation Switcher */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-[#F3EDE2] rounded-2xl border border-[#E8E0D7]" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePart === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.href)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#48121A] shadow-sm border border-[#48121A]/30'
                      : 'text-[#4A3E39] hover:text-[#48121A] hover:bg-[#EBE3D5]/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#48121A]' : 'text-[#8C7C75]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Proof Badges & Quick Action */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#EAF3EC] text-[#2E6B48] border border-[#2E6B48]/20 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Mock Enforced</span>
            </div>
            <a
              href="https://github.com/Nek1yZakhar/LD-LATTE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#48121A] text-[#FAF7F2] hover:bg-[#6B1D2E] transition-colors duration-200 text-xs font-semibold shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-[#D4C4B7]" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#F3EDE2] text-[#161210] border border-[#D4C4B7] hover:bg-[#EBE3D5] transition-colors"
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
            <span className="text-xs font-semibold text-[#8C7C75] uppercase tracking-wider">
              Навигация по материалам
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#2E6B48]/10 text-[#2E6B48] rounded-md">
              100% Real Data
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleNavClick('hero', '#hero')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
                activePart === 'hero' ? 'bg-[#C88D74]/15 text-[#161210] border border-[#C88D74]/30' : 'bg-[#F3EDE2] text-[#4A3E39]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C88D74]" />
                <span>Обзор & Доказательства</span>
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
                      ? 'bg-[#FFFFFF] text-[#161210] border border-[#C88D74] shadow-sm'
                      : 'bg-[#F3EDE2] text-[#4A3E39] hover:bg-[#EBE3D5]'
                  }`}
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[#C88D74]/20 text-[#C88D74]' : 'bg-[#FAF7F2] text-[#8C7C75]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#161210]">{item.label}</p>
                      <p className="text-xs text-[#8C7C75]">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C7C75]" />
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-[#E8E0D7] flex items-center justify-between">
            <a
              href="https://github.com/Nek1yZakhar/LD-LATTE"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#161210] text-[#FAF7F2] text-xs font-semibold shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span>Открыть Исходный Код GitHub</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
