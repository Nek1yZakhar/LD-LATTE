import React from 'react';
import { Layers, ShieldCheck, CheckCircle2, Cpu, Filter } from 'lucide-react';
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
              Интерактивная витрина 8 этапов конвейера: от сетевой валидации исходного списка до векторизации Qwen3-Embedding, кросс-энкодер реранкинга BGE-Reranker, VLM Visual Sanity контроля эстетики и генерации персональных PR-офферов.
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

            {/* Second-Layer Technical Badges */}
            <div className="pt-2 border-t border-[#E8E0D7] flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF3EC] text-[#2E6B48] border border-[#2E6B48]/30 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Real Data ({metrics.activeRealProfiles}/{metrics.totalSeedProfiles} Instagram Profiles)</span>
              </div>

              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFFFF] text-[#161210] border border-[#D4C4B7] font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B48]" />
                <span>{metrics.unitTestsPassCount}/39 Pytest Suite PASS</span>
              </div>

              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#F3EDE2] text-[#48121A] border border-[#D4C4B7] font-mono text-[11px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>Инженерный стек: Qwen3-Embedding | BGE-Reranker | Qwen2.5-VL</span>
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


