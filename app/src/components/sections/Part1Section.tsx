import React from 'react';
import { Layers } from 'lucide-react';
import { getSectionContentMap } from '@/data';
import { PipelineEvidenceGraph } from '@/components/evidence/PipelineEvidenceGraph';
import { CandidateEvidenceStudio } from '@/components/evidence/CandidateEvidenceStudio';
import { OutreachOfferStudio } from '@/components/evidence/OutreachOfferStudio';

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
            <span>Часть 1 • Интерактивный AI-Пайплайн Studio</span>
          </div>

          <h2 className="font-[#Outfit] text-3xl sm:text-4xl font-bold text-[#161210]">
            Инструмент поиска, математический скоринг <br />
            <span className="font-[#Playfair Display] italic font-normal text-[#48121A]">
              & персонализированные офферы
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
            Полностью интерактивная доказательная витрина: исследуйте 8 этапов конвейера, пофичевый скоринг 19 кандидатов, логиты BGE-Reranker, визуальный VLM-контроль Qwen2.5-VL и сгенерированные PR-офферы.
          </p>
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

