import React from 'react';
import { ShieldCheck, CheckCircle2, Cpu, FileCheck2, Database } from 'lucide-react';
import { GROUNDED_PROOF_METRICS } from '@/data';

export const ProofRail: React.FC = () => {
  const metrics = GROUNDED_PROOF_METRICS;

  return (
    <div className="bg-[#F3EDE2] border-b border-[#D4C4B7] py-3.5 px-4 sm:px-6">
      <div className="ld-container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left Side: Proof Chips */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D4C4B7] text-[#161210] font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#2E6B48] animate-pulse"></span>
            <span>{metrics.activeRealProfiles}/{metrics.totalSeedProfiles} Real Profiles</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EAF3EC] text-[#2E6B48] border border-[#2E6B48]/30 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>0% Synthetic Mock Data</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#4A3E39] border border-[#E8E0D7] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B48]" />
            <span>{metrics.unitTestsPassCount}/39 Pytest Suite PASS</span>
          </div>
        </div>

        {/* Right Side: Stack Badges */}
        <div className="flex items-center space-x-2 text-[11px] font-mono text-[#8C7C75]">
          <span className="hidden sm:inline">Stack:</span>
          <span className="px-2 py-0.5 rounded bg-[#EBE3D5] text-[#161210] border border-[#D4C4B7]">
            Qwen3-Embedding-0.6B
          </span>
          <span className="px-2 py-0.5 rounded bg-[#EBE3D5] text-[#161210] border border-[#D4C4B7]">
            BGE-Reranker-v2-m3
          </span>
          <span className="px-2 py-0.5 rounded bg-[#EBE3D5] text-[#161210] border border-[#D4C4B7]">
            Qwen2.5-VL
          </span>
        </div>

      </div>
    </div>
  );
};
