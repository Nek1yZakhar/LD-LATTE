import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Cpu, 
  FileText,
  Workflow,
  UserCheck
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToPart = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 bg-[#FAF7F2] overflow-hidden border-b border-[#D4C4B7]">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#48121A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#D4C4B7]/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="ld-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        
        {/* Symmetrical Centered Eyebrow Badge */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#D4C4B7] shadow-2xs text-xs font-bold text-[#48121A]">
            <Sparkles className="w-3.5 h-3.5 text-[#48121A]" />
            <span>Agentic AI Workflow отбора блогеров для бренда LD LATTE</span>
          </div>
        </div>

        {/* Hero Title & Subtitle - Clean Modern Sans-Serif Typography */}
        <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <h1 className="font-['Outfit'] text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#161210] leading-tight sm:leading-tight text-center">
            Модульный AI-пайплайн поиска, скоринга <br className="hidden sm:inline" />
            <span className="text-[#48121A] font-extrabold">
              & аутрича fashion-блогеров
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#4A3E39] max-w-3xl mx-auto leading-relaxed text-center font-normal">
            Сквозной <strong className="text-[#48121A] font-semibold">Agentic Workflow</strong> поиска и отбора для бренда <strong className="text-[#48121A] font-bold">LD LATTE</strong>: автоматически собирает 100% реальные профили в Instagram <span className="font-mono text-xs font-semibold text-[#48121A] bg-[#F3EDE2] px-2 py-0.5 rounded-md border border-[#D4C4B7] shadow-2xs">(Instaloader / Playwright)</span>, измеряет семантический скоринг совпадения со стилем бренда <span className="font-mono text-xs font-semibold text-[#48121A] bg-[#F3EDE2] px-2 py-0.5 rounded-md border border-[#D4C4B7] shadow-2xs">(Qwen3 + BGE-Reranker)</span>, проводит VLM Visual Sanity Pass аудита постов <span className="font-mono text-xs font-semibold text-[#48121A] bg-[#F3EDE2] px-2 py-0.5 rounded-md border border-[#D4C4B7] shadow-2xs">(Qwen2.5-VL)</span> и готовит персональные PR-офферы.
          </p>
        </div>

        {/* 3 Clear Action Buttons aligned with Parts 1, 2, 3 */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full">
          <button
            onClick={() => scrollToPart('#part-1')}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#48121A] text-[#FAF7F2] hover:bg-[#6B1D2E] transition-all duration-200 text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <span>Часть 1: Результаты отбора</span>
            <ArrowRight className="w-4 h-4 text-[#D4C4B7]" />
          </button>

          <button
            onClick={() => scrollToPart('#part-2')}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#FFFFFF] text-[#161210] border border-[#D4C4B7] hover:border-[#48121A] hover:bg-[#F3EDE2] transition-all duration-200 text-xs sm:text-sm font-bold shadow-2xs"
          >
            <Workflow className="w-4 h-4 text-[#48121A]" />
            <span>Часть 2: Схема работы</span>
          </button>

          <button
            onClick={() => scrollToPart('#part-3')}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#FFFFFF] text-[#161210] border border-[#D4C4B7] hover:border-[#48121A] hover:bg-[#F3EDE2] transition-all duration-200 text-xs sm:text-sm font-bold shadow-2xs"
          >
            <UserCheck className="w-4 h-4 text-[#48121A]" />
            <span>Часть 3: Об авторе</span>
          </button>
        </div>

        {/* Feature Grid: Symmetrical 4 Cards Visible Above Fold */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#48121A]/20 flex items-center justify-center text-[#48121A] mb-2.5">
                <Search className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#161210]">1. Прямой авто-сбор (100% Real Data)</h3>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F3EDE2] text-[#48121A] border border-[#D4C4B7]">
                Instaloader / Playwright
              </span>
              <p className="text-xs text-[#6E5D55] mt-2 leading-relaxed">
                Прямой парсинг Instagram без посредников и фейковых баз: собирает реальные профили, тексты постов и метрики вовлеченности в режиме Live.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#48121A]/20 flex items-center justify-center text-[#48121A] mb-2.5">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#161210]">2. Семантический скоринг & Реранкинг</h3>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F3EDE2] text-[#48121A] border border-[#D4C4B7]">
                Qwen3-Embedding + BGE-Reranker
              </span>
              <p className="text-xs text-[#6E5D55] mt-2 leading-relaxed">
                Математически измеряет смысловое соответствие текстов и аудитории блогера с ДНК бренда LD LATTE на основе векторов текста.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#48121A]/20 flex items-center justify-center text-[#48121A] mb-2.5">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#161210]">3. VLM Visual Sanity (Аудит эстетики)</h3>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F3EDE2] text-[#48121A] border border-[#D4C4B7]">
                Qwen2.5-VL Visual Sanity Pass
              </span>
              <p className="text-xs text-[#6E5D55] mt-2 leading-relaxed">
                Мультимодальный визуальный контроль: нейросеть «смотрит» посты кандидатов для отбора профилей с идеальной гармонией стиля.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#48121A]/20 flex items-center justify-center text-[#48121A] mb-2.5">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-sm text-[#161210]">4. Персонализированный Outreach & QA</h3>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F3EDE2] text-[#48121A] border border-[#D4C4B7]">
                Outreach Generator & Fact-Check
              </span>
              <p className="text-xs text-[#6E5D55] mt-2 leading-relaxed">
                Синтезирует индивидуальное коммерческое предложение с точным заземлением в фактах из постов и контролем anti-robotic QA.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};





