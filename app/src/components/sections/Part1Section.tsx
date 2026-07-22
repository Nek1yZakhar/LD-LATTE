import React from 'react';
import { 
  Layers, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Award, 
  Mail, 
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  FileCode
} from 'lucide-react';
import { getSectionContentMap, formatFollowersCount, formatPercentScore } from '@/data';

export const Part1Section: React.FC = () => {
  const content = getSectionContentMap();
  const { pipeline, idealPortrait, candidates, offers } = content;

  return (
    <section id="part-1" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#D4C4B7]">
      <div className="ld-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#48121A]/15 text-[#48121A] border border-[#48121A]/30 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Часть 1 • Модульный AI-Пайплайн Studio</span>
          </div>

          <h2 className="font-[#Outfit] text-3xl sm:text-4xl font-bold text-[#161210]">
            Инструмент поиска, математический скоринг <br />
            <span className="font-[#Playfair Display] italic font-normal text-[#48121A]">
              & персонализированные офферы
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
            Интерактивная рабочая среда, демонстрирующая сквозной процесс обработки инфлюенсеров LD Latte: от скрапинга и векторного анализа Qwen3 до визуального VLM-контроля и генерации писем.
          </p>
        </div>

        {/* 1.1 Pipeline Flowchart Shell */}
        <div id="p1-flow" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#48121A] uppercase tracking-wider">1.1 Архитектурный граф</span>
              <h3 className="text-lg font-bold text-[#161210]">Воронка конвейера (8 Модулей)</h3>
            </div>
            <span className="text-xs text-[#8C7C75] font-mono">Python Pipeline Architecture</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {pipeline.nodes.map((node, index) => (
              <div key={node.id} className="p-3 rounded-xl bg-[#F3EDE2] border border-[#E8E0D7] hover:border-[#48121A] transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#8C7C75]">0{node.stageNumber}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#48121A]"></span>
                </div>
                <p className="text-xs font-bold text-[#161210] truncate">{node.name}</p>
                <p className="text-[10px] font-mono text-[#8C7C75] truncate">{node.moduleFile.split('/').pop()}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] text-xs text-[#8C7C75] flex items-center justify-between">
            <span>💡 Каждый модуль имеет строгий Pydantic-контракт данных без возможности schema drift.</span>
            <a href="#p1-discovery" className="font-semibold text-[#161210] hover:text-[#48121A] flex items-center space-x-1">
              <span>Смотреть результаты</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 1.2 Ideal Blogger Portrait Shell */}
        <div id="p1-portrait" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#48121A] uppercase tracking-wider">1.2 Эталонный профиль</span>
              <h3 className="text-lg font-bold text-[#161210]">Портрет идеального инфлюенсера LD Latte</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#48121A]/15 text-[#48121A] text-xs font-semibold">
              LLM Synthesis (`portrait.py`)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#8C7C75] uppercase">Ключевые Ниши</h4>
              <div className="flex flex-wrap gap-1.5">
                {idealPortrait.target_niches.map((niche: string) => (
                  <span key={niche} className="px-2.5 py-1 rounded-md bg-[#F3EDE2] text-[#161210] text-xs font-semibold border border-[#E8E0D7]">
                    {niche}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#8C7C75] uppercase">Тон и Эстетика</h4>
              <p className="text-xs text-[#161210] font-medium leading-relaxed">
                {idealPortrait.preferred_tone_of_voice} • {idealPortrait.key_themes.join(', ')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#8C7C75] uppercase">Порог вовлеченности (ER)</h4>
              <p className="text-sm font-mono font-bold text-[#2E6B48]">
                ≥ {(idealPortrait.estimated_er_min * 100).toFixed(1)}% (Sponsorship Max: {idealPortrait.sponsorship_saturation_max})
              </p>
            </div>
          </div>
        </div>

        {/* 1.3 & 1.4 Candidates Discovery & Shortlist Shell Teaser */}
        <div id="p1-discovery" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#48121A] uppercase tracking-wider">1.3 & 1.4 Воронка и Топ Шорт-лист</span>
              <h3 className="text-lg font-bold text-[#161210]">Результаты фильтрации (19 Профилей / Top 5)</h3>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-[#EAF3EC] text-[#2E6B48]">
                {candidates.shortlist.length} В Шорт-листе
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F3EDE2] text-[#4A3E39]">
                {candidates.all.length} Всего кандидатов
              </span>
            </div>
          </div>

          {/* Shortlist Teaser Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidates.shortlist.slice(0, 3).map((candidate) => (
              <div key={candidate.username} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] hover:border-[#48121A] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#48121A] text-[#FAF7F2] flex items-center justify-center font-bold text-sm shadow-xs">
                      {candidate.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#161210]">{candidate.displayName}</h4>
                      <p className="text-xs font-mono text-[#8C7C75]">@{candidate.username}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3EC] text-[#2E6B48]">
                    VLM Pass
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#E8E0D7]">
                  <div>
                    <span className="text-[10px] text-[#8C7C75]">Подписчики:</span>
                    <p className="font-semibold text-[#161210]">{formatFollowersCount(candidate.followersCount)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C7C75]">Composite Score:</span>
                    <p className="font-semibold font-mono text-[#C88D74]">{formatPercentScore(candidate.compositeScore)}</p>
                  </div>
                </div>

                <p className="text-[11px] text-[#4A3E39] italic line-clamp-2">
                  "{candidate.vlmAestheticNotes}"
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#F3EDE2] border border-[#E8E0D7] text-center text-xs text-[#8C7C75]">
            📌 Полные таблицы пофичевого скоринга, логитов BGE-Reranker и модальный инспектор будут развернуты в TICKET-10E.
          </div>
        </div>

        {/* 1.5 Personalized Outreach Offers Shell */}
        <div id="p1-offers" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#C88D74] uppercase tracking-wider">1.5 Генератор писем</span>
              <h3 className="text-lg font-bold text-[#161210]">Персонализированные бартерные офферы</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#161210] text-[#FAF7F2] text-xs font-mono">
              DeepSeek-V4 / Groq Llama-3.3-70B
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#161210]">Пример сгенерированного оффера (для @daria_grogulenko):</span>
              <span className="text-[10px] font-mono text-[#2E6B48] bg-[#EAF3EC] px-2 py-0.5 rounded">
                QA Passed (Anti-Robotic Enforced)
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] text-xs font-sans text-[#161210] leading-relaxed italic">
              "Здравствуйте, Дарья! Меня зовут представитель бренда LD Latte. Нам очень откликается ваша эстетика уютного городского стиля..."
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
