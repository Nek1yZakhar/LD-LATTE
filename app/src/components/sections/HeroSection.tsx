import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  FileText,
  ChevronDown
} from 'lucide-react';
import { GROUNDED_PROOF_METRICS } from '@/data';

export const HeroSection: React.FC = () => {
  const metrics = GROUNDED_PROOF_METRICS;

  const scrollToPart = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative py-16 sm:py-24 bg-[#FAF7F2] overflow-hidden border-b border-[#D4C4B7]">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#48121A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#D4C4B7]/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="ld-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline / Eyebrow */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D4C4B7] shadow-sm text-xs font-semibold text-[#161210]">
            <Sparkles className="w-3.5 h-3.5 text-[#48121A]" />
            <span>Единый Публичный Навигатор Тестового Задания LD Latte</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E6B48]"></span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="font-['Outfit'] text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#161210] leading-tight sm:leading-none">
            Модульный AI-пайплайн поиска <br className="hidden sm:inline" />
            <span className="font-['Bodoni_Moda',serif] italic font-normal text-[#48121A]">
              & аутрича fashion-блогеров
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[#4A3E39] max-w-3xl mx-auto leading-relaxed font-normal">
            Сквозной конвейер для бренда <strong className="text-[#48121A]">LD LATTE</strong>: от self-operated парсинга Instagram до векторного поиска Qwen3-Embedding, кросс-энкодера BGE-Reranker, визуальной валидации VLM и генерации персонализированных писем.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollToPart('#part-1')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#48121A] text-[#FAF7F2] hover:bg-[#6B1D2E] transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>Часть 1: AI-Пайплайн Studio</span>
            <ArrowRight className="w-4 h-4 text-[#D4C4B7]" />
          </button>

          <button
            onClick={() => scrollToPart('#part-2')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#FFFFFF] text-[#161210] border border-[#D4C4B7] hover:border-[#48121A] hover:bg-[#F3EDE2] transition-all duration-200 text-sm font-semibold shadow-xs"
          >
            <span>Часть 2: Схема автоматизации</span>
          </button>

          <button
            onClick={() => scrollToPart('#part-3')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#FFFFFF] text-[#161210] border border-[#D4C4B7] hover:border-[#48121A] hover:bg-[#F3EDE2] transition-all duration-200 text-sm font-semibold shadow-xs"
          >
            <span>Часть 3: Автор & Резюме</span>
          </button>
        </div>

        {/* Feature Grid Summary */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#48121A]/20 flex items-center justify-center text-[#48121A] mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#161210]">100% Real Data</h3>
            <p className="text-xs text-[#8C7C75] mt-1">
              19 реально спарсенных профилей Instagram. Фейки и моки полностью запрещены.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#48121A]/20 flex items-center justify-center text-[#48121A] mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#161210]">Qwen3 + BGE Reranker</h3>
            <p className="text-xs text-[#8C7C75] mt-1">
              Двухуровневый отбор: векторные эмбеддинги 0.6B + кросс-энкодер логиты.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#48121A]/20 flex items-center justify-center text-[#48121A] mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#161210]">VLM Visual Sanity</h3>
            <p className="text-xs text-[#8C7C75] mt-1">
              Qwen2.5-VL контролирует пастельную эстетику ленты кандидатов перед оффером.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#48121A]/20 flex items-center justify-center text-[#48121A] mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#161210]">Personalized Offers</h3>
            <p className="text-xs text-[#8C7C75] mt-1">
              Генератор писем с 100% заземлением в фактах постов и anti-robotic QA.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
