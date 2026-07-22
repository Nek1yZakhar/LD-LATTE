import React from 'react';
import { ArrowUp, Github, FileText, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { GROUNDED_PROOF_LINKS, GROUNDED_AUTHOR_RESUME } from '@/data';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#161210] text-[#FAF7F2] border-t border-[#4A3E39] pt-14 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="ld-container max-w-7xl mx-auto space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] p-1.5 flex items-center justify-center">
                <img src="/favicon.svg" alt="LD Latte Logo" className="w-full h-full" />
              </div>
              <span className="font-[#Outfit] text-lg font-bold text-[#FAF7F2] tracking-tight">
                LD LATTE
              </span>
            </div>
            <p className="text-xs text-[#D4C4B7] leading-relaxed">
              Модульный AI-пайплайн поиска, векторного скоринга Qwen3, реранкинга BGE и визуального контроля VLM для fashion-бренда LD Latte.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#FAF7F2]/10 text-[#FAF7F2] border border-[#D4C4B7]/30 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B48]" />
                <span>Strict Zero-Mock Policy</span>
              </span>
            </div>
          </div>

          {/* Nav Links: Parts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#E8A990] uppercase tracking-wider">
              Структура проекта
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="text-[#FAF7F2] hover:text-[#E8A990] transition-colors font-normal">00. Обзор & Доказательства</a>
              </li>
              <li>
                <a href="#part-1" className="text-[#FAF7F2] hover:text-[#E8A990] transition-colors font-normal">01. Часть 1: AI-Пайплайн Studio</a>
              </li>
              <li>
                <a href="#part-2" className="text-[#FAF7F2] hover:text-[#E8A990] transition-colors font-normal">02. Часть 2: Схема автоматизации</a>
              </li>
              <li>
                <a href="#part-3" className="text-[#FAF7F2] hover:text-[#E8A990] transition-colors font-normal">03. Часть 3: Автор & Резюме</a>
              </li>
            </ul>
          </div>

          {/* Documentation Navigator */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#E8A990] uppercase tracking-wider">
              Документация & Код
            </h4>
            <ul className="space-y-2 text-xs">
              {GROUNDED_PROOF_LINKS.slice(0, 4).map((link) => (
                <li key={link.id}>
                  <a
                    href={`https://github.com/Nek1yZakhar/LD-LATTE/blob/main/${link.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 text-[#FAF7F2] hover:text-[#E8A990] transition-colors font-normal group"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#E8A990] shrink-0" />
                    <span className="text-[#FAF7F2] group-hover:text-[#E8A990]">{link.label}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Author Meta */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#E8A990] uppercase tracking-wider">
              Автор проекта
            </h4>
            <div className="text-xs text-[#D4C4B7] space-y-1.5">
              <p className="font-bold text-[#FAF7F2]">{GROUNDED_AUTHOR_RESUME.name}</p>
              <p className="text-[11px] text-[#D4C4B7]/80">{GROUNDED_AUTHOR_RESUME.education[0]?.institution}</p>
              <p className="text-[11px] text-[#D4C4B7]/80">{GROUNDED_AUTHOR_RESUME.education[0]?.degree}</p>
              <div className="pt-2 flex items-center space-x-2">
                <a
                  href={GROUNDED_AUTHOR_RESUME.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#FAF7F2]/10 hover:bg-[#48121A] text-[#FAF7F2] transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#4A3E39]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D4C4B7]/70">
          <p>© 2026 LD Latte AI Pipeline Demo. Подготовлено для бренда LD Latte.</p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2]/10 hover:bg-[#48121A] text-[#FAF7F2] transition-colors text-xs font-semibold"
            >
              <span>Наверх</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
