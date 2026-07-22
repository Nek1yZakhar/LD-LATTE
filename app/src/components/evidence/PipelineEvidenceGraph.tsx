import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Award,
  Cpu,
  Filter
} from 'lucide-react';
import type { PipelineNode, IdealBloggerProfile } from '@/data';

interface PipelineEvidenceGraphProps {
  nodes: PipelineNode[];
  idealPortrait: IdealBloggerProfile;
}

export const PipelineEvidenceGraph: React.FC<PipelineEvidenceGraphProps> = ({ nodes, idealPortrait }) => {
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);
  const [showPortraitModal, setShowPortraitModal] = useState<boolean>(false);

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (selectedNode || showPortraitModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedNode, showPortraitModal]);

  return (
    <div className="space-y-8">
      {/* 1.1 Pipeline Graph Cards */}
      <div id="p1-flow" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D7]">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#48121A]/10 text-[#48121A] text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>1.1 Логика работы конвейера</span>
            </div>
            <h3 className="text-xl font-bold text-[#161210]">Пошаговая схема работы AI-системы (8 этапов)</h3>
            <p className="text-xs text-[#4A3E39]">
              Кликните на любой этап, чтобы узнать, что происходит на этом шаге, какие данные передаются и какой алгоритм используется.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono relative group/tooltip">
            <span className="px-3 py-1.5 rounded-xl bg-[#EAF3EC] text-[#2E6B48] border border-[#2E6B48]/30 font-semibold flex items-center space-x-1.5 cursor-help hover:bg-[#DDF0E2] transition-all shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#2E6B48]" />
              <span>Строгое Pydantic-валидирование</span>
              <Info className="w-3 h-3 text-[#2E6B48]/70 ml-0.5" />
            </span>

            {/* Custom Premium Tooltip */}
            <div className="absolute right-0 top-full mt-2.5 w-80 p-4 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/40 backdrop-blur-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-30 space-y-2 text-xs font-sans">
              <div className="flex items-center space-x-2 text-[#C88D74] font-bold border-b border-[#FAF7F2]/10 pb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Что такое Pydantic-контракт?</span>
              </div>
              <p className="text-[11px] text-[#FAF7F2]/90 leading-relaxed font-normal">
                Гарантия абсолютной целостности данных: каждый из 8 модулей конвейера обменивается строго типизированными объектами Python. Ошибки типов, пропущенные поля и невалидная структура исключаются автоматически.
              </p>
            </div>
          </div>
        </div>

        {/* Central Axis Tree Flow Diagram (Minimalistic & Highly Readable) */}
        <div className="relative py-4 px-1">
          {/* Main Horizontal Flow Line (Desktop/Tablet) */}
          <div className="hidden lg:block absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-[#D4C4B7] z-0" />

          {/* Grid of Nodes Alternating Top & Bottom on Central Axis */}
          <div className="hidden lg:grid grid-cols-8 gap-3 relative z-10">
            {nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isTop = index % 2 === 0; // Steps 1, 3, 5, 7 on Top; Steps 2, 4, 6, 8 on Bottom

              return (
                <div key={node.id} className="flex flex-col items-center justify-between h-84 py-1">
                  {/* Top Slot */}
                  <div className="w-full h-36 flex flex-col justify-end">
                    {isTop && (
                      <button
                        onClick={() => setSelectedNode(node)}
                        className={`p-3 sm:p-3.5 rounded-2xl text-left transition-all relative group flex flex-col justify-between h-34 border ${
                          node.isVlmNode 
                            ? 'bg-[#F7EFF1] border-[#48121A]/40 hover:border-[#48121A] shadow-xs' 
                            : isSelected 
                              ? 'bg-[#48121A] text-[#FAF7F2] border-[#48121A] shadow-md ring-2 ring-[#48121A]/20' 
                              : 'bg-[#FAF7F2] border-[#E8E0D7] hover:border-[#48121A] hover:bg-[#FFFFFF]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-xs font-bold font-mono ${
                              isSelected ? 'text-[#C88D74]' : 'text-[#8C7C75]'
                            }`}>
                              ШАГ 0{node.stageNumber}
                            </span>
                            {node.isVlmNode ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#48121A] text-[#FAF7F2]">
                                VLM Визуал
                              </span>
                            ) : (
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#C88D74]' : 'bg-[#2E6B48]'}`}></span>
                            )}
                          </div>
                          <h4 className={`text-xs sm:text-sm font-bold leading-snug clamp-2 ${
                            isSelected ? 'text-[#FAF7F2]' : 'text-[#161210]'
                          }`}>
                            {node.name}
                          </h4>
                        </div>

                        <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                          <span className={`text-[10px] sm:text-[11px] font-mono truncate ${
                            isSelected ? 'text-[#FAF7F2]/80' : 'text-[#8C7C75]'
                          }`}>
                            {node.moduleFile.split('/').pop()}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                            isSelected ? 'text-[#C88D74] translate-x-0.5' : 'text-[#8C7C75] group-hover:translate-x-0.5'
                          }`} />
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Stem Line & Node Dot Connection on Central Axis */}
                  <div className="flex flex-col items-center justify-center my-1">
                    <div className={`w-0.5 h-4 ${isTop ? 'bg-[#D4C4B7]' : 'bg-transparent'}`} />
                    <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected 
                        ? 'bg-[#48121A] border-[#C88D74] scale-125 z-20 shadow-xs' 
                        : node.isVlmNode
                          ? 'bg-[#48121A] border-[#48121A]'
                          : 'bg-[#FFFFFF] border-[#D4C4B7] hover:border-[#48121A]'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#FAF7F2]' : 'bg-[#48121A]'}`} />
                    </div>
                    <div className={`w-0.5 h-4 ${!isTop ? 'bg-[#D4C4B7]' : 'bg-transparent'}`} />
                  </div>

                  {/* Bottom Slot */}
                  <div className="w-full h-36 flex flex-col justify-start">
                    {!isTop && (
                      <button
                        onClick={() => setSelectedNode(node)}
                        className={`p-3 sm:p-3.5 rounded-2xl text-left transition-all relative group flex flex-col justify-between h-34 border ${
                          node.isVlmNode 
                            ? 'bg-[#F7EFF1] border-[#48121A]/40 hover:border-[#48121A] shadow-xs' 
                            : isSelected 
                              ? 'bg-[#48121A] text-[#FAF7F2] border-[#48121A] shadow-md ring-2 ring-[#48121A]/20' 
                              : 'bg-[#FAF7F2] border-[#E8E0D7] hover:border-[#48121A] hover:bg-[#FFFFFF]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-xs font-bold font-mono ${
                              isSelected ? 'text-[#C88D74]' : 'text-[#8C7C75]'
                            }`}>
                              ШАГ 0{node.stageNumber}
                            </span>
                            {node.isVlmNode ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#48121A] text-[#FAF7F2]">
                                VLM Визуал
                              </span>
                            ) : (
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#C88D74]' : 'bg-[#2E6B48]'}`}></span>
                            )}
                          </div>
                          <h4 className={`text-xs sm:text-sm font-bold leading-snug clamp-2 ${
                            isSelected ? 'text-[#FAF7F2]' : 'text-[#161210]'
                          }`}>
                            {node.name}
                          </h4>
                        </div>

                        <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                          <span className={`text-[10px] sm:text-[11px] font-mono truncate ${
                            isSelected ? 'text-[#FAF7F2]/80' : 'text-[#8C7C75]'
                          }`}>
                            {node.moduleFile.split('/').pop()}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                            isSelected ? 'text-[#C88D74] translate-x-0.5' : 'text-[#8C7C75] group-hover:translate-x-0.5'
                          }`} />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile / Small Screens Layout (Vertical Tree Line) */}
          <div className="lg:hidden relative pl-6 space-y-3.5">
            <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-[#D4C4B7]" />
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div key={node.id} className="relative">
                  <div className={`absolute -left-6 top-4 w-3.5 h-3.5 rounded-full border-2 ${
                    isSelected ? 'bg-[#48121A] border-[#C88D74]' : 'bg-[#FFFFFF] border-[#D4C4B7]'
                  }`} />
                  <button
                    onClick={() => setSelectedNode(node)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all relative group flex flex-col justify-between h-32 border ${
                      node.isVlmNode 
                        ? 'bg-[#F7EFF1] border-[#48121A]/40 hover:border-[#48121A] shadow-xs' 
                        : isSelected 
                          ? 'bg-[#48121A] text-[#FAF7F2] border-[#48121A] shadow-md ring-2 ring-[#48121A]/20' 
                          : 'bg-[#FAF7F2] border-[#E8E0D7] hover:border-[#48121A] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold font-mono ${
                          isSelected ? 'text-[#C88D74]' : 'text-[#8C7C75]'
                        }`}>
                          ШАГ 0{node.stageNumber}
                        </span>
                        {node.isVlmNode ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#48121A] text-[#FAF7F2]">
                            VLM Визуал
                          </span>
                        ) : (
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#C88D74]' : 'bg-[#2E6B48]'}`}></span>
                        )}
                      </div>
                      <h4 className={`text-xs sm:text-sm font-bold leading-snug clamp-2 ${
                        isSelected ? 'text-[#FAF7F2]' : 'text-[#161210]'
                      }`}>
                        {node.name}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                      <span className={`text-[10px] sm:text-[11px] font-mono truncate ${
                        isSelected ? 'text-[#FAF7F2]/80' : 'text-[#8C7C75]'
                      }`}>
                        {node.moduleFile.split('/').pop()}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-[#C88D74] translate-x-0.5' : 'text-[#8C7C75] group-hover:translate-x-0.5'
                      }`} />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Banner with Architectural Note on VLM */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF7F2] to-[#F3EDE2] border border-[#D4C4B7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-[#48121A]/10 text-[#48121A] shrink-0 mt-0.5 border border-[#48121A]/20 shadow-2xs">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#161210] text-sm">
                Зачем здесь мультимодальный AI (Qwen2.5-VL)?
              </p>
              <p className="text-[#4A3E39] mt-0.5 leading-relaxed">
                Зрительный AI-анализ подключается <strong className="text-[#48121A]">только на самом последнем шаге</strong> — для финальной проверки эстетики ленты у 5 лучших финалистов. Система не тратит ресурсы на разбор миллиона картинок: сначала математика и алгоритмы отсеивают неподходящих блогеров, а мультимодальная модель оценивает визуал только у лидеров шорт-листа.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPortraitModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#161210] text-[#FAF7F2] hover:bg-[#48121A] transition-all duration-200 font-semibold shrink-0 text-xs flex items-center space-x-2 self-start sm:self-center shadow-md hover:shadow-lg"
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
              <span>1.2 Эталонный портрет блогера</span>
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
      {selectedNode && createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#161210]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#D4C4B7] rounded-3xl max-w-3xl sm:max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header (Integrated inside rounded top) */}
            <div className="flex items-start justify-between p-6 sm:p-8 pb-5 border-b border-[#E8E0D7] bg-[#FFFFFF] shrink-0">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#48121A] text-[#FAF7F2] font-mono text-xs sm:text-sm font-bold">
                    ШАГ 0{selectedNode.stageNumber}
                  </span>
                  {selectedNode.isVlmNode && (
                    <span className="px-2.5 py-1 rounded-md bg-[#C88D74] text-[#161210] text-xs sm:text-sm font-bold">
                      VLM Аудит визуала
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#161210]">{selectedNode.name}</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#8C7C75] hover:text-[#161210] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 text-sm overflow-y-auto shrink grow">
              {/* Special Funnel & Quality Control Card for Stage 01 (34 -> 19) */}
              {selectedNode.stageNumber === 1 && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#E8E0D7] pb-3">
                    <div className="flex items-center space-x-2 text-[#48121A] font-bold text-sm sm:text-base">
                      <Filter className="w-5 h-5 text-[#48121A]" />
                      <span>Воронка отбора: от 34 ссылок к 19 профилям</span>
                    </div>
                    {/* Interactive Tooltip Badge: 100% Real Data Policy */}
                    <div className="relative group/policyTooltip inline-block">
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#2E6B48]/10 text-[#2E6B48] border border-[#2E6B48]/20 cursor-help flex items-center space-x-1 hover:bg-[#2E6B48]/20 transition-colors">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2E6B48]" />
                        <span>100% Real Data Policy</span>
                        <Info className="w-3 h-3 text-[#2E6B48]/70" />
                      </span>

                      {/* Tooltip Popup */}
                      <div className="absolute top-full right-0 mt-2.5 w-80 p-4 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/40 backdrop-blur-md opacity-0 group-hover/policyTooltip:opacity-100 transition-all duration-200 pointer-events-none z-50 space-y-2 text-xs font-sans">
                        <div className="flex items-center space-x-2 text-[#C88D74] font-bold border-b border-[#FAF7F2]/10 pb-2 text-xs">
                          <ShieldCheck className="w-4 h-4 text-[#2E6B48]" />
                          <span>Политика 100% реальных данных (Zero-Mock)</span>
                        </div>
                        <p className="text-xs text-[#FAF7F2]/90 leading-relaxed font-normal">
                          Пайплайн категорически запрещает синтез фейковых профилей. Из 34 исходных ссылок 15 недоступных (HTTP 404/400) отсеяны сетевой проверкой, а все 19 профилей в анализе — это реально существующие живые инфлюенсеры.
                        </p>
                        <div className="flex items-center justify-between border-t border-[#FAF7F2]/10 pt-2 text-[10px] text-[#8C7C75]">
                          <span>Hard Reject Enforced</span>
                          <span className="text-[#2E6B48] font-semibold">19/34 Valid Instagram Profiles</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Metric Badges */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                    <div className="p-3 sm:p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7]">
                      <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-[#161210]">34</span>
                      <span className="text-xs text-[#8C7C75] leading-tight block font-medium mt-1">Исходный seed-список</span>
                    </div>
                    <div className="p-3 sm:p-4 rounded-xl bg-[#EAF3EC] border border-[#2E6B48]/30">
                      <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-[#2E6B48]">19</span>
                      <span className="text-xs text-[#2E6B48] font-bold leading-tight block mt-1">Прошли сетевую проверку</span>
                    </div>
                    <div className="p-3 sm:p-4 rounded-xl bg-[#F7EFF1] border border-[#48121A]/30">
                      <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-[#48121A]">15</span>
                      <span className="text-xs text-[#48121A] font-bold leading-tight block mt-1">Исключены (HTTP 404/400)</span>
                    </div>
                  </div>

                  {/* Clear human-readable quality rationale */}
                  <div className="space-y-1.5 bg-[#FFFFFF] p-4 rounded-xl border border-[#E8E0D7]">
                    <span className="font-bold text-[#161210] text-xs sm:text-sm block">Почему часть ссылок была исключена:</span>
                    <p className="text-xs sm:text-sm text-[#4A3E39] leading-relaxed">
                      Система выполнила прямую сетевую проверку каждой ссылки в Instagram. 15 аккаунтов оказались недоступными (страницы удалены, заблокированы или переименованы). Пайплайн автоматически отсеял их до начала анализа. Это <strong className="text-[#161210] font-semibold">контроль качества данных</strong>, а не их потеря.
                    </p>
                  </div>

                  {/* Samples of Excluded Usernames with Custom Interactive Tooltip */}
                  <div className="space-y-2 pt-2 border-t border-[#E8E0D7]">
                    <span className="text-xs font-bold text-[#8C7C75] uppercase tracking-wider block">
                      Примеры исключенных профилей из исходного списка (HTTP 404):
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {['_crazy__unicorn__', 'curly.bloger', 'demoiselle._.rie', 'merklary_l', 'nev_pollyy', 'yunglolaa'].map((user) => (
                        <span key={user} className="px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#D4C4B7] text-[#8C7C75] text-xs font-mono line-through decoration-[#48121A]/50">
                          @{user}
                        </span>
                      ))}

                      {/* Custom Tooltip Badge for Remaining 9 Excluded Profiles */}
                      <div className="relative group/tooltip inline-block">
                        <span className="px-3 py-1 rounded-md bg-[#F7EFF1] text-[#48121A] text-xs font-semibold border border-[#48121A]/30 cursor-help flex items-center space-x-1.5 hover:bg-[#F0E4E7] transition-colors">
                          <span>+ 9 других недоступных ссылок</span>
                          <Info className="w-3.5 h-3.5 text-[#48121A]/70" />
                        </span>

                        {/* Tooltip Content */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-80 p-4 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/40 backdrop-blur-md opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none z-50 space-y-2.5 text-xs font-sans">
                          <div className="flex items-center justify-between border-b border-[#FAF7F2]/10 pb-2 text-[#C88D74] font-bold text-xs">
                            <span>Остальные 9 исключенных профилей</span>
                            <span className="text-[11px] font-mono text-[#FAF7F2]/60">HTTP 404</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 font-mono text-xs text-[#FAF7F2]/90">
                            <span>@sha_obzor.wb</span>
                            <span>@lv_yana_lv</span>
                            <span>@miysta_fatt_</span>
                            <span>@habakher</span>
                            <span>@ri_vls</span>
                            <span>@__aparina</span>
                            <span>@rtini.a13</span>
                            <span>@ninooochka2.0</span>
                            <span className="col-span-2">@irinatitovaaa_</span>
                          </div>
                          <p className="text-[11px] text-[#8C7C75] leading-tight border-t border-[#FAF7F2]/10 pt-2">
                            Все 15 аккаунтов отсеяны сетевой валидацией (Hard Reject).
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="font-bold text-[#8C7C75] uppercase text-xs tracking-wider">Файл модуля Python:</span>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] font-mono text-[#48121A] text-sm font-bold flex items-center justify-between">
                  <span>{selectedNode.moduleFile}</span>
                  <FileCode className="w-4.5 h-4.5 text-[#8C7C75]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                  <span className="font-bold text-[#8C7C75] uppercase text-xs tracking-wider block">Что модуль получает:</span>
                  <p className="font-medium text-[#161210] text-sm sm:text-base leading-snug">{selectedNode.inputContract}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                  <span className="font-bold text-[#8C7C75] uppercase text-xs tracking-wider block">Что модуль создает:</span>
                  <p className="font-semibold text-[#2E6B48] text-sm sm:text-base leading-snug">{selectedNode.outputContract}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-[#8C7C75] uppercase text-xs tracking-wider">Описание работы модуля:</span>
                <p className="text-[#4A3E39] leading-relaxed text-sm sm:text-base bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E0D7]">
                  {selectedNode.description}
                </p>
              </div>

              {selectedNode.isVlmNode && (
                <div className="p-4 sm:p-5 rounded-xl bg-[#F7EFF1] border border-[#48121A]/30 text-[#48121A] space-y-1.5">
                  <span className="font-bold uppercase text-xs tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Строгое архитектурное ограничение</span>
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    VLM модель не загружается при первичном поиске (Retrieval). Она вызывается только для первых 5 кандидатов шорт-листа, прошедших реранкинг BGE-Reranker-v2-m3.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-8 border-t border-[#E8E0D7] flex justify-end bg-[#FAF7F2] shrink-0">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-6 py-3 rounded-xl bg-[#161210] text-[#FAF7F2] hover:bg-[#48121A] transition-colors font-bold text-xs sm:text-sm shadow-xs"
              >
                Закрыть инспектор
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Ideal Portrait Modal */}
      {showPortraitModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#161210]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#D4C4B7] rounded-3xl max-w-3xl sm:max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 sm:p-8 pb-5 border-b border-[#E8E0D7] bg-[#FFFFFF] shrink-0">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-[#48121A]/10 text-[#48121A] text-xs font-bold uppercase tracking-wider">
                  Deep Inspection
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#161210] mt-1">Инспектор эталонного профиля инфлюенсера</h3>
              </div>
              <button
                onClick={() => setShowPortraitModal(false)}
                className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#8C7C75] hover:text-[#161210]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 text-sm overflow-y-auto shrink grow">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-4">
                <h4 className="font-bold text-[#161210] text-base">Параметры идеального блогера (`IdealBloggerProfile`):</h4>
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-[#8C7C75]">Target Niches:</span>
                    <p className="font-bold text-[#161210] text-sm sm:text-base mt-0.5">{idealPortrait.target_niches.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[#8C7C75]">Min Engagement Rate (ER):</span>
                    <p className="font-bold font-mono text-[#2E6B48] text-sm sm:text-base mt-0.5">{(idealPortrait.estimated_er_min * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-[#8C7C75]">Preferred Tone of Voice:</span>
                    <p className="font-bold text-[#161210] capitalize text-sm sm:text-base mt-0.5">{idealPortrait.preferred_tone_of_voice}</p>
                  </div>
                  <div>
                    <span className="text-[#8C7C75]">Sponsorship Saturation Max:</span>
                    <p className="font-bold font-mono text-[#C88D74] uppercase text-sm sm:text-base mt-0.5">{idealPortrait.sponsorship_saturation_max}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-[#161210] text-base">Ключевые темы контента:</h4>
                <div className="flex flex-wrap gap-2.5">
                  {idealPortrait.key_themes.map((theme) => (
                    <span key={theme} className="px-3.5 py-1.5 rounded-xl bg-[#F3EDE2] border border-[#E8E0D7] text-[#161210] font-semibold text-xs sm:text-sm">
                      ✓ {theme}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-[#E8E0D7]">
                <h4 className="font-bold text-[#161210] text-base">Сгенерированное обоснование Llama-3.3-70B:</h4>
                <p className="text-[#4A3E39] leading-relaxed bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E0D7] text-xs sm:text-sm">
                  {idealPortrait.rationale}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-8 border-t border-[#E8E0D7] flex justify-end bg-[#FAF7F2] shrink-0">
              <button
                onClick={() => setShowPortraitModal(false)}
                className="px-6 py-3 rounded-xl bg-[#161210] text-[#FAF7F2] hover:bg-[#48121A] transition-colors font-bold text-xs sm:text-sm shadow-xs"
              >
                Закрыть
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
