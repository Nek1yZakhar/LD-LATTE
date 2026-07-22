import React, { useState } from 'react';
import { 
  Layers, 
  ChevronRight, 
  FileCode, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  X, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Database,
  Sliders,
  Award
} from 'lucide-react';
import type { PipelineNode, IdealBloggerProfile } from '@/data';

interface PipelineEvidenceGraphProps {
  nodes: PipelineNode[];
  idealPortrait: IdealBloggerProfile;
}

export const PipelineEvidenceGraph: React.FC<PipelineEvidenceGraphProps> = ({ nodes, idealPortrait }) => {
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);
  const [showPortraitModal, setShowPortraitModal] = useState<boolean>(false);

  return (
    <div className="space-y-8">
      {/* 1.1 Pipeline Graph Cards */}
      <div id="p1-flow" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D7]">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#48121A]/10 text-[#48121A] text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>1.1 Interactive Pipeline Flow</span>
            </div>
            <h3 className="text-xl font-bold text-[#161210]">Архитектурный граф конвейера (8 Модулей)</h3>
            <p className="text-xs text-[#4A3E39]">
              Нажмите на любой модуль для детализации контрактов данных Pydantic и алгоритма работы.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-[#EAF3EC] text-[#2E6B48] border border-[#2E6B48]/30 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pydantic Guarded</span>
            </span>
          </div>
        </div>

        {/* Interactive Grid of Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-3 rounded-2xl text-left transition-all relative group flex flex-col justify-between h-32 border ${
                  node.isVlmNode 
                    ? 'bg-[#F7EFF1] border-[#48121A]/40 hover:border-[#48121A] shadow-xs' 
                    : isSelected 
                      ? 'bg-[#48121A] text-[#FAF7F2] border-[#48121A] shadow-md ring-2 ring-[#48121A]/20' 
                      : 'bg-[#FAF7F2] border-[#E8E0D7] hover:border-[#48121A] hover:bg-[#FFFFFF]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold font-mono ${
                      isSelected ? 'text-[#C88D74]' : 'text-[#8C7C75]'
                    }`}>
                      STAGE 0{node.stageNumber}
                    </span>
                    {node.isVlmNode ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#48121A] text-[#FAF7F2]">
                        VLM
                      </span>
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#C88D74]' : 'bg-[#2E6B48]'}`}></span>
                    )}
                  </div>
                  <h4 className={`text-xs font-bold leading-tight clamp-2 ${
                    isSelected ? 'text-[#FAF7F2]' : 'text-[#161210]'
                  }`}>
                    {node.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                  <span className={`text-[9px] font-mono truncate ${
                    isSelected ? 'text-[#FAF7F2]/70' : 'text-[#8C7C75]'
                  }`}>
                    {node.moduleFile.split('/').pop()}
                  </span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${
                    isSelected ? 'text-[#C88D74] translate-x-0.5' : 'text-[#8C7C75] group-hover:translate-x-0.5'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Banner with Architectural Note on VLM */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-[#48121A]/10 text-[#48121A] shrink-0 mt-0.5">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#161210]">
                Архитектурная роль VLM (Stage 07): Sanity Pass шорт-листа из 5 топов
              </p>
              <p className="text-[#4A3E39] mt-0.5 leading-relaxed">
                Мультимодальная модель Qwen2.5-VL используется <strong className="text-[#48121A]">исключительно на финальном шаге</strong> для оценки визуальной эстетики, а не для первичного поиска по всей базе. Это снижает затраты на инференс в ~100 раз.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPortraitModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#161210] text-[#FAF7F2] hover:bg-[#48121A] transition-colors font-semibold shrink-0 text-xs flex items-center space-x-1.5 self-start sm:self-center"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C88D74]" />
            <span>Инспектор эталонного профиля</span>
          </button>
        </div>
      </div>

      {/* 1.2 Ideal Blogger Portrait View */}
      <div id="p1-portrait" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D7]">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#C88D74]/15 text-[#6E5346] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1.2 Target Audience & Profile Target</span>
            </div>
            <h3 className="text-xl font-bold text-[#161210]">Портрет идеального инфлюенсера LD Latte</h3>
            <p className="text-xs text-[#4A3E39]">
              Синтезирован моделью Llama-3.3-70B (`portrait.py`) на основе анализа 19 реальных seed-профилей.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F3EDE2] text-[#48121A] border border-[#D4C4B7] text-xs font-mono font-semibold">
            `data/processed/ideal_portrait.json`
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-2">
            <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider">Целевые ниши</span>
            <div className="flex flex-wrap gap-1.5">
              {idealPortrait.target_niches.map((niche) => (
                <span key={niche} className="px-2.5 py-1 rounded-lg bg-[#48121A] text-[#FAF7F2] text-xs font-bold">
                  {niche}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1.5">
            <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider">Порог Engagement Rate</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-mono text-[#2E6B48]">
                ≥ {(idealPortrait.estimated_er_min * 100).toFixed(1)}%
              </span>
              <span className="text-xs text-[#8C7C75]">мин. вовлеченность</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1.5">
            <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider">Тон повествования</span>
            <p className="text-sm font-bold text-[#161210] capitalize">
              {idealPortrait.preferred_tone_of_voice}
            </p>
            <p className="text-[11px] text-[#8C7C75] truncate">
              {idealPortrait.key_themes.join(', ')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1.5">
            <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider">Рекламная нагрузка</span>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-[#EAF3EC] text-[#2E6B48] font-mono text-xs font-bold uppercase">
                {idealPortrait.sponsorship_saturation_max}
              </span>
              <span className="text-xs text-[#8C7C75]">Recency ≤ {idealPortrait.activity_recency_max_days}дн</span>
            </div>
          </div>
        </div>

        {/* Grounded Rationale Box */}
        <div className="p-5 rounded-2xl bg-[#F3EDE2] border border-[#E8E0D7] space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#161210]">
            <Info className="w-4 h-4 text-[#48121A]" />
            <span>Обоснование алгоритма синтеза (Grounding Rationale)</span>
          </div>
          <p className="text-xs text-[#4A3E39] leading-relaxed italic">
            "{idealPortrait.rationale}"
          </p>
        </div>
      </div>

      {/* Stage Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-[#161210]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#D4C4B7] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E0D7]">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-[#48121A] text-[#FAF7F2] font-mono text-xs font-bold">
                    STAGE 0{selectedNode.stageNumber}
                  </span>
                  {selectedNode.isVlmNode && (
                    <span className="px-2 py-0.5 rounded bg-[#C88D74] text-[#161210] text-xs font-bold">
                      VLM Sanity Node
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#161210]">{selectedNode.name}</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7C75] hover:text-[#161210] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#8C7C75] uppercase text-[10px] tracking-wider">Файл модуля Python:</span>
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] font-mono text-[#48121A] font-bold flex items-center justify-between">
                  <span>{selectedNode.moduleFile}</span>
                  <FileCode className="w-4 h-4 text-[#8C7C75]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                  <span className="font-bold text-[#8C7C75] uppercase text-[10px] tracking-wider">Входной контракт:</span>
                  <p className="font-mono text-[#161210] font-semibold truncate">{selectedNode.inputContract}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                  <span className="font-bold text-[#8C7C75] uppercase text-[10px] tracking-wider">Выходной контракт:</span>
                  <p className="font-mono text-[#2E6B48] font-semibold truncate">{selectedNode.outputContract}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#8C7C75] uppercase text-[10px] tracking-wider">Описание работы модуля:</span>
                <p className="text-[#4A3E39] leading-relaxed text-sm bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8E0D7]">
                  {selectedNode.description}
                </p>
              </div>

              {selectedNode.isVlmNode && (
                <div className="p-4 rounded-xl bg-[#F7EFF1] border border-[#48121A]/30 text-[#48121A] space-y-1">
                  <span className="font-bold uppercase text-[10px] tracking-wider flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Строгое архитектурное ограничение</span>
                  </span>
                  <p className="text-xs">
                    VLM модель не загружается при первичном поиске (Retrieval). Она вызывается только для первых 5 кандидатов шорт-листа, прошедших реранкинг BGE-Reranker-v2-m3.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E8E0D7] flex justify-end">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-5 py-2.5 rounded-xl bg-[#161210] text-[#FAF7F2] hover:bg-[#48121A] transition-colors font-bold text-xs"
              >
                Закрыть инспектор
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ideal Portrait Modal */}
      {showPortraitModal && (
        <div className="fixed inset-0 z-50 bg-[#161210]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#D4C4B7] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E0D7]">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#48121A]/10 text-[#48121A] text-xs font-bold uppercase tracking-wider">
                  Deep Inspection
                </span>
                <h3 className="text-xl font-bold text-[#161210] mt-1">Инспектор эталонного профиля инфлюенсера</h3>
              </div>
              <button
                onClick={() => setShowPortraitModal(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7C75] hover:text-[#161210]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3">
                <h4 className="font-bold text-[#161210] text-sm">Параметры идеального блогера (`IdealBloggerProfile`):</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8C7C75]">Target Niches:</span>
                    <p className="font-bold text-[#161210]">{idealPortrait.target_niches.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[#8C7C75]">Min Engagement Rate (ER):</span>
                    <p className="font-bold font-mono text-[#2E6B48]">{(idealPortrait.estimated_er_min * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-[#8C7C75]">Preferred Tone of Voice:</span>
                    <p className="font-bold text-[#161210] capitalize">{idealPortrait.preferred_tone_of_voice}</p>
                  </div>
                  <div>
                    <span className="text-[#8C7C75]">Sponsorship Saturation Max:</span>
                    <p className="font-bold font-mono text-[#C88D74] uppercase">{idealPortrait.sponsorship_saturation_max}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#161210]">Ключевые темы контента:</h4>
                <div className="flex flex-wrap gap-2">
                  {idealPortrait.key_themes.map((theme) => (
                    <span key={theme} className="px-3 py-1 rounded-xl bg-[#F3EDE2] border border-[#E8E0D7] text-[#161210] font-medium">
                      ✓ {theme}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E8E0D7]">
                <h4 className="font-bold text-[#161210]">Сгенерированное обоснование Llama-3.3-70B:</h4>
                <p className="text-[#4A3E39] leading-relaxed bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E0D7] text-xs">
                  {idealPortrait.rationale}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E0D7] flex justify-end">
              <button
                onClick={() => setShowPortraitModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#161210] text-[#FAF7F2] hover:bg-[#48121A] transition-colors font-bold text-xs"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
