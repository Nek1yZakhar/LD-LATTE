import React from 'react';
import { Anchor } from 'lucide-react';

interface SubNavItem {
  id: string;
  label: string;
  href: string;
}

interface SectionNavProps {
  activePart: 'hero' | 'part1' | 'part2' | 'part3';
  activeSubSection?: string;
}

export const SectionNav: React.FC<SectionNavProps> = ({ activePart }) => {
  const getSubNavItems = (): SubNavItem[] => {
    switch (activePart) {
      case 'part1':
        return [
          { id: 'p1-flow', label: '1.1 Схема конвейера', href: '#p1-flow' },
          { id: 'p1-portrait', label: '1.2 Идеальный портрет', href: '#p1-portrait' },
          { id: 'p1-discovery', label: '1.3 Воронка & Таблица', href: '#p1-discovery' },
          { id: 'p1-shortlist', label: '1.4 Шорт-лист & VLM', href: '#p1-shortlist' },
          { id: 'p1-offers', label: '1.5 Бартерные офферы', href: '#p1-offers' },
        ];
      case 'part2':
        return [
          { id: 'p2-arch', label: '2.1 Архитектурная схема', href: '#p2-arch' },
          { id: 'p2-scraping', label: '2.2 Скрапинг & Антифрод', href: '#p2-scraping' },
          { id: 'p2-sla', label: '2.3 SLA & Риски', href: '#p2-sla' },
          { id: 'p2-econ', label: '2.4 Экономика & Масштаб', href: '#p2-econ' },
        ];
      case 'part3':
        return [
          { id: 'p3-author', label: '3.1 Автор (Захар Матвейчук)', href: '#p3-author' },
          { id: 'p3-cases', label: '3.2 Прошлые кейсы & OSINT', href: '#p3-cases' },
          { id: 'p3-mindset', label: '3.3 AI-Native Workflow', href: '#p3-mindset' },
          { id: 'p3-evidence', label: '3.4 Доказательный слой', href: '#p3-evidence' },
        ];
      default:
        return [
          { id: 'overview', label: 'Обзор системы', href: '#hero' },
          { id: 'p1-flow', label: 'Конвейер & Скоринг', href: '#p1-flow' },
          { id: 'p1-shortlist', label: 'Шорт-лист кандидатов', href: '#p1-shortlist' },
          { id: 'p2-arch', label: 'Схема автоматизации', href: '#part-2' },
          { id: 'p3-author', label: 'Резюме автора', href: '#part-3' },
        ];
    }
  };

  const items = getSubNavItems();

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF7F2]/75 border-b border-[#E8E0D7]/60 py-1 px-4 sticky top-14 sm:top-16 z-30 backdrop-blur-xs transition-all">
      <div className="ld-container max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar space-x-5 text-[11px]">
        
        <div className="flex items-center space-x-1.5 font-medium text-[#8C7C75] shrink-0">
          <Anchor className="w-3 h-3 text-[#48121A]/60" />
          <span className="uppercase text-[9px] tracking-wider font-mono text-[#8C7C75]/90">Быстрый переход:</span>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.href)}
              className="text-[#6E5346] hover:text-[#48121A] hover:underline font-medium transition-colors whitespace-nowrap text-[11px]"
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

