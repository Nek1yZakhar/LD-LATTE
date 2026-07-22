import React from 'react';
import { Layers, ShieldCheck, CheckCircle2, Cpu, Filter, Info } from 'lucide-react';
import { getSectionContentMap, GROUNDED_PROOF_METRICS } from '@/data';
import { PipelineEvidenceGraph } from '@/components/evidence/PipelineEvidenceGraph';
import { CandidateEvidenceStudio } from '@/components/evidence/CandidateEvidenceStudio';
import { OutreachOfferStudio } from '@/components/evidence/OutreachOfferStudio';

export const Part1Section: React.FC = () => {
  const content = getSectionContentMap();
  const { pipeline, idealPortrait, candidates, offers } = content;
  const metrics = GROUNDED_PROOF_METRICS;

  return (
    <section id="part-1" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#D4C4B7]">
      <div className="ld-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#48121A]/15 text-[#48121A] border border-[#48121A]/30 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Часть 1 • Интерактивный AI-Пайплайн Studio</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-['Outfit'] text-3xl sm:text-4xl font-extrabold text-[#161210]">
              Модульный AI-пайплайн: математический скоринг <br className="hidden sm:inline" />
              <span className="text-[#48121A]">
                & персонализированные офферы
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
              Интерактивная витрина 8 этапов конвейера: от сетевой валидации исходного списка до векторизации Qwen3–Embedding, кросс-энкодер реранкинга BGE-Reranker, VLM Visual Sanity контроля эстетики и генерации персональных PR-офферов.
            </p>
          </div>

          {/* Quality Filter Highlight Box: 19 out of 34 Explanation */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 text-[#2E6B48] font-bold text-xs sm:text-sm">
              <Filter className="w-4 h-4 text-[#2E6B48]" />
              <span>Валидация данных (100% Real Data Policy): {metrics.activeRealProfiles} из {metrics.totalSeedProfiles} активных профилей</span>
            </div>
            <p className="text-xs text-[#4A3E39] leading-relaxed">
              Из исходного списка в {metrics.totalSeedProfiles} ссылки {metrics.unreachableProfilesRemoved} аккаунтов оказались недоступны в Instagram (ошибки HTTP 404/400). Пайплайн автоматически применил фильтр сетевой валидации (Hard Reject) и отсеял их без выдумывания фейковых данных. Сквозной векторный скоринг Qwen3 и VLM-аудит Qwen2.5-VL проведены строго по <strong className="text-[#161210] font-semibold">{metrics.activeRealProfiles} реально существующим активным блогерам</strong>.
            </p>

            {/* Second-Layer Technical Badges with Custom Tooltips */}
            <div className="pt-2 border-t border-[#E8E0D7] flex flex-wrap items-center gap-2 text-xs">
              {/* Badge 1: 100% Real Data */}
              <div className="relative group/badge">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#EAF3EC] text-[#2E6B48] border border-[#2E6B48]/30 font-semibold text-[11px] cursor-help hover:bg-[#DDF0E2] transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Real Data ({metrics.activeRealProfiles}/{metrics.totalSeedProfiles} Instagram Profiles)</span>
                  <Info className="w-3 h-3 text-[#2E6B48]/70" />
                </div>
                {/* Tooltip 1 */}
                <div className="absolute left-0 top-full mt-2.5 w-72 sm:w-80 p-3.5 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/40 backdrop-blur-md opacity-0 group-hover/badge:opacity-100 transition-all duration-200 pointer-events-none z-30 space-y-1.5 text-xs font-sans">
                  <div className="flex items-center space-x-2 text-[#C88D74] font-bold border-b border-[#FAF7F2]/10 pb-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Политика 100% реальных данных</span>
                  </div>
                  <p className="text-[11px] text-[#FAF7F2]/90 leading-relaxed font-normal">
                    Пайплайн работает строго на реально спарсенных профилях. Из 34 исходных ссылок 15 недоступных аккаунтов отсеяны (Hard Reject), а скоринг проведен по 19 живым профилям без выдумывания фейков.
                  </p>
                </div>
              </div>

              {/* Badge 2: Pytest Suite PASS */}
              <div className="relative group/badge">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#FFFFFF] text-[#161210] border border-[#D4C4B7] font-semibold text-[11px] cursor-help hover:bg-[#FAF7F2] transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B48]" />
                  <span>{metrics.unitTestsPassCount}/39 Pytest Suite PASS</span>
                  <Info className="w-3 h-3 text-[#8C7C75]" />
                </div>
                {/* Tooltip 2 */}
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2.5 w-72 sm:w-80 p-3.5 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/40 backdrop-blur-md opacity-0 group-hover/badge:opacity-100 transition-all duration-200 pointer-events-none z-30 space-y-1.5 text-xs font-sans">
                  <div className="flex items-center space-x-2 text-[#C88D74] font-bold border-b border-[#FAF7F2]/10 pb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2E6B48]" />
                    <span>100% Покрытие тестами</span>
                  </div>
                  <p className="text-[11px] text-[#FAF7F2]/90 leading-relaxed font-normal">
                    Все 39 юнит- и интеграционных тестов (скрапинг, векторизация, BGE-реранкинг, VLM-аудит, anti-robotic QA) пройдены со 100% успехом в Pytest.
                  </p>
                </div>
              </div>

              {/* Badge 3: Engineering Stack */}
              <div className="relative group/badge">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#F3EDE2] text-[#48121A] border border-[#D4C4B7] font-mono text-[11px] cursor-help hover:bg-[#EAE0D2] transition-colors">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Инженерный стек: Qwen3-Embedding | BGE-Reranker | Qwen2.5-VL</span>
                  <Info className="w-3 h-3 text-[#48121A]/70" />
                </div>
                {/* Tooltip 3 */}
                <div className="absolute left-0 top-full mt-2.5 w-80 sm:w-96 p-3.5 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/40 backdrop-blur-md opacity-0 group-hover/badge:opacity-100 transition-all duration-200 pointer-events-none z-30 space-y-1.5 text-xs font-sans">
                  <div className="flex items-center space-x-2 text-[#C88D74] font-bold border-b border-[#FAF7F2]/10 pb-1.5">
                    <Cpu className="w-4 h-4" />
                    <span>Цепочка AI-моделей</span>
                  </div>
                  <p className="text-[11px] text-[#FAF7F2]/90 leading-relaxed font-normal">
                    Qwen3-Embedding (0.6B) отвечает за семантический поиск, BAAI/bge-reranker-v2-m3 уточняет рейтинг кросс-энкодером, а Qwen2.5-VL оценивает визуал 5 финалистов.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1.1 Pipeline Flowchart & 1.2 Ideal Blogger Portrait View */}
        <PipelineEvidenceGraph 
          nodes={pipeline.nodes} 
          idealPortrait={idealPortrait} 
        />

        {/* 1.3 & 1.4 Candidates Discovery & Shortlist Interactive Studio */}
        <CandidateEvidenceStudio 
          allCandidates={candidates.all} 
          shortlistCandidates={candidates.shortlist} 
        />

        {/* 1.5 Personalized Outreach Offers & Prompt Inspector */}
        <OutreachOfferStudio 
          offers={offers.items} 
          promptInspector={offers.promptInspector} 
        />

      </div>
    </section>
  );
};


