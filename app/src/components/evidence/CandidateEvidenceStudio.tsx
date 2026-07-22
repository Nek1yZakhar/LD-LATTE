import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  SlidersHorizontal, 
  Award, 
  Eye, 
  X, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Mail,
  Sparkles,
  BarChart3,
  BrainCircuit,
  Filter
} from 'lucide-react';
import type { NormalizedCandidate } from '@/data';
import { formatFollowersCount, formatPercentScore } from '@/data';

interface CandidateEvidenceStudioProps {
  allCandidates: NormalizedCandidate[];
  shortlistCandidates: NormalizedCandidate[];
}

export const CandidateEvidenceStudio: React.FC<CandidateEvidenceStudioProps> = ({ 
  allCandidates, 
  shortlistCandidates 
}) => {
  const [viewMode, setViewMode] = useState<'shortlist' | 'all'>('shortlist');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<NormalizedCandidate | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'scores' | 'vlm' | 'offer'>('scores');

  const displayedList = viewMode === 'shortlist' ? shortlistCandidates : allCandidates;
  
  const filteredCandidates = displayedList.filter(c => 
    c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.niche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="p1-discovery" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
      {/* Section Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D7]">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#48121A]/10 text-[#48121A] text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>1.3 & 1.4 Interactive Candidates Studio</span>
          </div>
          <h3 className="text-xl font-bold text-[#161210]">Результаты поиска, векторного скоринга и VLM</h3>
          <p className="text-xs text-[#4A3E39]">
            Просмотр реальных метрик, эмбеддингов Qwen3, логов BGE-Reranker и вердиктов VLM Sanity Pass.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] shrink-0">
          <button
            onClick={() => setViewMode('shortlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'shortlist'
                ? 'bg-[#48121A] text-[#FAF7F2] shadow-xs'
                : 'text-[#8C7C75] hover:text-[#161210]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Топ Шорт-лист ({shortlistCandidates.length})</span>
          </button>

          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'all'
                ? 'bg-[#48121A] text-[#FAF7F2] shadow-xs'
                : 'text-[#8C7C75] hover:text-[#161210]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Все Кандидаты ({allCandidates.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7C75]" />
          <input
            type="text"
            placeholder="Поиск по имени, нику или нише..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] text-xs text-[#161210] focus:outline-none focus:border-[#48121A]"
          />
        </div>

        <div className="text-xs text-[#8C7C75] font-mono flex items-center space-x-2">
          <span>Показано: <strong className="text-[#161210]">{filteredCandidates.length}</strong> из {displayedList.length}</span>
          {viewMode === 'shortlist' && (
            <span className="px-2 py-0.5 rounded bg-[#EAF3EC] text-[#2E6B48] font-bold text-[10px]">
              VLM Sanity Screened
            </span>
          )}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => (
          <div 
            key={candidate.username}
            className={`p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
              candidate.isShortlist 
                ? 'bg-[#FFFFFF] border-[#D4C4B7] hover:border-[#48121A] shadow-xs' 
                : 'bg-[#FAF7F2] border border-[#E8E0D7] opacity-90 hover:opacity-100'
            }`}
          >
            <div className="space-y-3">
              {/* Header: Avatar + Display Name + Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#48121A] text-[#FAF7F2] flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {candidate.displayName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#161210] truncate">{candidate.displayName}</h4>
                    <p className="text-xs font-mono text-[#8C7C75]">@{candidate.username}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  {candidate.isShortlist ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#48121A] text-[#FAF7F2] text-[10px] font-bold">
                      Shortlist
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-[#F3EDE2] text-[#8C7C75] text-[10px] font-medium">
                      Discovered
                    </span>
                  )}
                  
                  {candidate.isShortlist && (
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center space-x-1 ${
                      candidate.vlmSanityPassed 
                        ? 'bg-[#EAF3EC] text-[#2E6B48]' 
                        : 'bg-[#F9ECE9] text-[#A83B2B]'
                    }`}>
                      <Eye className="w-2.5 h-2.5" />
                      <span>{candidate.vlmSanityPassed ? 'VLM Pass' : 'VLM Audit'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Grounded Bio & Metrics Grid */}
              <p className="text-xs text-[#4A3E39] line-clamp-2 italic bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E0D7]">
                "{candidate.biography}"
              </p>

              <div className="grid grid-cols-3 gap-2 text-xs text-center py-2 border-y border-[#E8E0D7]">
                <div>
                  <span className="text-[10px] text-[#8C7C75] uppercase font-bold">Подписчики</span>
                  <p className="font-bold text-[#161210]">{formatFollowersCount(candidate.followersCount)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C7C75] uppercase font-bold">Ниша</span>
                  <p className="font-bold text-[#161210] capitalize">{candidate.niche}</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C7C75] uppercase font-bold">Язык</span>
                  <p className="font-bold text-[#161210] uppercase font-mono">{candidate.language}</p>
                </div>
              </div>

              {/* Composite Score Bar & Component Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#161210]">Composite Score</span>
                  <span className="font-mono font-bold text-[#C88D74] text-sm">
                    {formatPercentScore(candidate.compositeScore)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E8E0D7] overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#C88D74] to-[#48121A] rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(5, candidate.compositeScore * 100))}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] font-mono text-[#8C7C75]">
                  <div>
                    <span>Qwen3: </span>
                    <strong className="text-[#161210]">{formatPercentScore(candidate.semanticSimilarity)}</strong>
                  </div>
                  <div>
                    <span>Features: </span>
                    <strong className="text-[#161210]">{formatPercentScore(candidate.featuresScore)}</strong>
                  </div>
                  <div>
                    <span>BGE Rerank: </span>
                    <strong className="text-[#161210]">{formatPercentScore(candidate.crossEncoderScore)}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action */}
            <div className="pt-2 border-t border-[#E8E0D7] flex items-center justify-between">
              <span className="text-[10px] text-[#8C7C75] font-mono">
                {candidate.barterOffer ? '✉️ Offer Generated' : '📊 Scored Entry'}
              </span>
              <button
                onClick={() => {
                  setSelectedCandidate(candidate);
                  setActiveModalTab('scores');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#48121A] text-[#161210] hover:text-[#FAF7F2] border border-[#D4C4B7] hover:border-[#48121A] text-xs font-bold transition-colors flex items-center space-x-1"
              >
                <span>Детали скоринга</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Deep-Dive Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-[#161210]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#D4C4B7] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E0D7]">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-[#48121A] text-[#FAF7F2] flex items-center justify-center font-bold text-xl shadow-md">
                  {selectedCandidate.displayName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-[#161210]">{selectedCandidate.displayName}</h3>
                    {selectedCandidate.isShortlist && (
                      <span className="px-2 py-0.5 rounded bg-[#48121A] text-[#FAF7F2] text-xs font-bold">
                        Top Shortlist
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-[#8C7C75]">@{selectedCandidate.username}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7C75] hover:text-[#161210]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-[#E8E0D7] pb-2">
              <button
                onClick={() => setActiveModalTab('scores')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeModalTab === 'scores' 
                    ? 'bg-[#48121A] text-[#FAF7F2]' 
                    : 'text-[#8C7C75] hover:text-[#161210] hover:bg-[#FAF7F2]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Математический скоринг</span>
              </button>

              <button
                onClick={() => setActiveModalTab('vlm')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeModalTab === 'vlm' 
                    ? 'bg-[#48121A] text-[#FAF7F2]' 
                    : 'text-[#8C7C75] hover:text-[#161210] hover:bg-[#FAF7F2]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>VLM Sanity Audit & Facts</span>
              </button>

              {selectedCandidate.barterOffer && (
                <button
                  onClick={() => setActiveModalTab('offer')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeModalTab === 'offer' 
                      ? 'bg-[#48121A] text-[#FAF7F2]' 
                      : 'text-[#8C7C75] hover:text-[#161210] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Персональный Оффер</span>
                </button>
              )}
            </div>

            {/* Tab 1: Scoring Breakdown */}
            {activeModalTab === 'scores' && (
              <div className="space-y-5 text-xs">
                {/* Composite Score Overview Card */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider">Финальный реранкинг score</span>
                      <h4 className="text-lg font-bold text-[#161210]">Composite Score Breakdown</h4>
                    </div>
                    <span className="text-2xl font-mono font-bold text-[#48121A]">
                      {formatPercentScore(selectedCandidate.compositeScore)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] text-[11px] text-[#4A3E39] font-mono">
                    Formula: Composite = 0.35 * Qwen3_Embeddings ({formatPercentScore(selectedCandidate.semanticSimilarity)}) + 0.35 * Feature_Score ({formatPercentScore(selectedCandidate.featuresScore)}) + 0.30 * BGE_Reranker ({formatPercentScore(selectedCandidate.crossEncoderScore)})
                  </div>
                </div>

                {/* 5 Deterministic Partial Scores */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#161210] text-sm">Пофичевый скоринг (`similarity_breakdown.partial_scores`):</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Совпадение ниши (Niche Match)</span>
                        <span className="font-mono text-[#2E6B48]">
                          {(selectedCandidate.similarityBreakdown.partial_scores.niche_match * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C7C75]">Вес фичи: 0.30 (lifestyle / beauty / fashion match)</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Engagement Rate (ER Match)</span>
                        <span className="font-mono text-[#2E6B48]">
                          {(selectedCandidate.similarityBreakdown.partial_scores.er_match * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C7C75]">Вес фичи: 0.25 (порог ≥ 3.6%)</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Свежесть публикаций (Recency Match)</span>
                        <span className="font-mono text-[#2E6B48]">
                          {(selectedCandidate.similarityBreakdown.partial_scores.recency_match * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C7C75]">Вес фичи: 0.15 (активность ≤ 7 дней)</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Рекламная нагрузка (Sponsorship Match)</span>
                        <span className="font-mono text-[#2E6B48]">
                          {(selectedCandidate.similarityBreakdown.partial_scores.sponsorship_match * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8C7C75]">Вес фичи: 0.20 (низкая насыщеность)</p>
                    </div>
                  </div>
                </div>

                {/* Cross-Encoder Logits Box */}
                {selectedCandidate.similarityBreakdown.raw_cross_encoder_score !== undefined && (
                  <div className="p-4 rounded-xl bg-[#F3EDE2] border border-[#E8E0D7] space-y-2">
                    <span className="font-bold text-[#161210] flex items-center space-x-1.5">
                      <BrainCircuit className="w-4 h-4 text-[#48121A]" />
                      <span>Логиты BAAI/bge-reranker-v2-m3</span>
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <span className="text-[#8C7C75]">Raw Logit Score:</span>
                        <p className="font-bold text-[#161210]">
                          {selectedCandidate.similarityBreakdown.raw_cross_encoder_score.toFixed(7)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#8C7C75]">Sigmoid Normalized Score:</span>
                        <p className="font-bold text-[#2E6B48]">
                          {selectedCandidate.crossEncoderScore.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: VLM Audit & Grounding Facts */}
            {activeModalTab === 'vlm' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#161210] uppercase text-[10px] tracking-wider">
                      Qwen2.5-VL Visual Aesthetic Audit
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${
                      selectedCandidate.vlmSanityPassed 
                        ? 'bg-[#EAF3EC] text-[#2E6B48]' 
                        : 'bg-[#F9ECE9] text-[#A83B2B]'
                    }`}>
                      {selectedCandidate.vlmSanityPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{selectedCandidate.vlmSanityPassed ? 'Sanity Passed' : 'Aesthetic Deviation Noted'}</span>
                    </span>
                  </div>

                  <p className="text-xs text-[#161210] leading-relaxed italic bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E8E0D7]">
                    "{selectedCandidate.vlmAestheticNotes}"
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-[#161210]">Фактологические заземления (Grounding Facts):</h4>
                  <div className="space-y-1.5">
                    {selectedCandidate.groundingFacts.map((fact, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] text-xs text-[#4A3E39] flex items-start space-x-2">
                        <span className="text-[#48121A] font-bold font-mono">0{idx + 1}.</span>
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F7EFF1] border border-[#48121A]/30 text-[#48121A] space-y-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider">
                    📌 Роль VLM в пайплайне
                  </span>
                  <p className="text-xs">
                    VLM проверяет визуальную эстетику профиля на заключительном этапе. Результаты вердикта не перечеркивают математический векторный поиск, но фиксируются в отчете для PR-менеджера.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Generated Offer */}
            {activeModalTab === 'offer' && selectedCandidate.barterOffer && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#161210]">Тема письма:</span>
                    <span className="px-2.5 py-0.5 rounded bg-[#EAF3EC] text-[#2E6B48] font-mono text-[10px] font-bold">
                      QA Approved (Anti-Robotic Enforced)
                    </span>
                  </div>
                  <p className="font-bold text-[#48121A] text-sm bg-[#FFFFFF] p-3 rounded-xl border border-[#E8E0D7]">
                    {selectedCandidate.barterOffer.subject}
                  </p>

                  <div className="space-y-1">
                    <span className="font-bold text-[#8C7C75] text-[10px] uppercase">Текст сгенерированного коммерческого предложения:</span>
                    <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] text-xs leading-relaxed text-[#161210] whitespace-pre-wrap font-sans">
                      {selectedCandidate.barterOffer.body}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1.5">
                    <span className="font-bold text-[#8C7C75] text-[10px] uppercase">Персонализированные элементы:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCandidate.barterOffer.personalized_elements.map((elem, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#161210] text-[11px]">
                          ✨ {elem}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1.5">
                    <span className="font-bold text-[#8C7C75] text-[10px] uppercase">Заземляющие факты:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCandidate.barterOffer.grounding_facts.map((fact, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#4A3E39] text-[11px]">
                          📍 {fact}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#E8E0D7] flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
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
