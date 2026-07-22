import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, 
  Search, 
  Award, 
  Eye, 
  X, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Info,
  Mail,
  BarChart3,
  BrainCircuit,
  Filter,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import type { NormalizedCandidate } from '@/data';
import { formatFollowersCount, formatPercentScore } from '@/data';

interface CandidateEvidenceStudioProps {
  allCandidates: NormalizedCandidate[];
  shortlistCandidates: NormalizedCandidate[];
}

// Candidate Avatar Component with Real Scraped Profile Pic & Monogram Fallback
const CandidateAvatar: React.FC<{ username: string; displayName: string; className?: string }> = ({ 
  username, 
  displayName,
  className = "w-13 h-13 sm:w-14 sm:h-14"
}) => {
  const [imgError, setImgError] = useState(false);
  const avatarPath = `/avatars/${username}.jpg`;

  if (imgError) {
    return (
      <div className={`${className} rounded-2xl bg-gradient-to-br from-[#48121A] to-[#7A2332] text-[#FAF7F2] flex items-center justify-center font-bold text-base shadow-xs shrink-0 border border-[#FAF7F2]/20`}>
        {displayName.substring(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`${className} rounded-2xl overflow-hidden shadow-xs shrink-0 border border-[#D4C4B7] bg-[#FAF7F2] relative`}>
      <img
        src={avatarPath}
        alt={displayName}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export const CandidateEvidenceStudio: React.FC<CandidateEvidenceStudioProps> = ({ 
  allCandidates, 
  shortlistCandidates 
}) => {
  const [viewMode, setViewMode] = useState<'shortlist' | 'all'>('shortlist');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<NormalizedCandidate | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'scores' | 'vlm' | 'offer'>('scores');

  // Prevent background scrolling when candidate modal is open
  useEffect(() => {
    if (selectedCandidate) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCandidate]);

  const displayedList = viewMode === 'shortlist' ? shortlistCandidates : allCandidates;
  
  const filteredCandidates = displayedList.filter(c => 
    c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.biography.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="p1-discovery" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
      {/* Section Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D7]">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#48121A]/10 text-[#48121A] text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>1.3 & 1.4 Студия отбора кандидатов</span>
          </div>
          <h3 className="text-xl font-bold text-[#161210]">Как система отобрала кандидатов</h3>
          <p className="text-xs text-[#4A3E39] mt-0.5">
            Кандидаты после поиска, математической оценки Qwen3 + BGE-Reranker и визуальной проверки VLM Sanity Pass.
          </p>
        </div>

        {/* View Mode Toggle with Explanatory Badges */}
        <div className="flex items-center p-1 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] shrink-0">
          <button
            onClick={() => setViewMode('shortlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'shortlist'
                ? 'bg-[#48121A] text-[#FAF7F2] shadow-xs'
                : 'text-[#8C7C75] hover:text-[#161210]'
            }`}
            title="Топовые финалисты с наивысшей оценкой, прошедшие визуальный контроль"
          >
            <Award className="w-3.5 h-3.5 text-[#C88D74]" />
            <span>Топ Шорт-лист ({shortlistCandidates.length})</span>
          </button>

          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'all'
                ? 'bg-[#48121A] text-[#FAF7F2] shadow-xs'
                : 'text-[#8C7C75] hover:text-[#161210]'
            }`}
            title="Полный список всех релевантных кандидатов после этапов discovery и скоринга"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Все Кандидаты ({allCandidates.length})</span>
          </button>
        </div>
      </div>

      {/* Explanatory Funnel Block with Interactive Tooltips on Every Stat Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E0D7] pb-2.5">
          <div className="flex items-center space-x-2 text-[#48121A] font-bold text-xs sm:text-sm">
            <Filter className="w-4 h-4 text-[#48121A]" />
            <span>Воронка отбора: путь от 34 референсных ссылок к 5 финалистам</span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-[#EAF3EC] text-[#2E6B48] text-[10px] font-mono font-bold self-start sm:self-auto">
            100% Real Data Policy
          </span>
        </div>

        {/* 5 Interactive Funnel Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          {/* Card 1: 34 Seed Links */}
          <div className="relative group/funnel1 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] cursor-help hover:border-[#48121A] transition-all">
            <span className="block text-base font-extrabold font-mono text-[#161210]">34</span>
            <span className="text-[10px] text-[#8C7C75] block mt-0.5 flex items-center justify-center space-x-0.5">
              <span>Исходных ссылок</span>
              <Info className="w-2.5 h-2.5 text-[#8C7C75]/70" />
            </span>

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#161210] text-[#FAF7F2] rounded-xl shadow-2xl border border-[#C88D74]/40 opacity-0 group-hover/funnel1:opacity-100 transition-all duration-200 pointer-events-none z-50 text-left text-[11px] font-sans">
              <p className="font-bold text-[#C88D74] mb-1">01. Исходные референсы бренда</p>
              <p className="text-[#FAF7F2]/90 leading-normal">
                Все 34 ссылки на аккаунты из файла `Блогеры - Лист1.csv`, переданного брендом LD Latte для анализа.
              </p>
            </div>
          </div>

          {/* Card 2: 19 Real Profiles */}
          <div className="relative group/funnel2 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] cursor-help hover:border-[#2E6B48] transition-all">
            <span className="block text-base font-extrabold font-mono text-[#2E6B48]">19</span>
            <span className="text-[10px] text-[#2E6B48] font-bold block mt-0.5 flex items-center justify-center space-x-0.5">
              <span>Реальных аккаунтов</span>
              <Info className="w-2.5 h-2.5 text-[#2E6B48]/70" />
            </span>

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#161210] text-[#FAF7F2] rounded-xl shadow-2xl border border-[#C88D74]/40 opacity-0 group-hover/funnel2:opacity-100 transition-all duration-200 pointer-events-none z-50 text-left text-[11px] font-sans">
              <p className="font-bold text-[#2E6B48] mb-1">02. Проверенные в Instagram</p>
              <p className="text-[#FAF7F2]/90 leading-normal">
                19 реально существующих активных профилей. 15 удаленных или невалидных ссылок отсеяны сетевым прогоном (HTTP 404/400) без фейковых данных.
              </p>
            </div>
          </div>

          {/* Card 3: 18 Discovered */}
          <div className="relative group/funnel3 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] cursor-help hover:border-[#48121A] transition-all">
            <span className="block text-base font-extrabold font-mono text-[#161210]">18</span>
            <span className="text-[10px] text-[#8C7C75] block mt-0.5 flex items-center justify-center space-x-0.5">
              <span>Прошли Discovery</span>
              <Info className="w-2.5 h-2.5 text-[#8C7C75]/70" />
            </span>

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#161210] text-[#FAF7F2] rounded-xl shadow-2xl border border-[#C88D74]/40 opacity-0 group-hover/funnel3:opacity-100 transition-all duration-200 pointer-events-none z-50 text-left text-[11px] font-sans">
              <p className="font-bold text-[#C88D74] mb-1">03. Candidate Discovery Stage</p>
              <p className="text-[#FAF7F2]/90 leading-normal">
                18 кандидатов с подписчиками и публикациями, успешно прошедших детерминированные фильтры модуля `discover.py`.
              </p>
            </div>
          </div>

          {/* Card 4: 17 In Full List */}
          <div className="relative group/funnel4 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D4C4B7] font-bold cursor-help hover:border-[#48121A] transition-all">
            <span className="block text-base font-extrabold font-mono text-[#48121A]">17</span>
            <span className="text-[10px] text-[#48121A] block mt-0.5 flex items-center justify-center space-x-0.5">
              <span>В полном списке</span>
              <Info className="w-2.5 h-2.5 text-[#48121A]/70" />
            </span>

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#161210] text-[#FAF7F2] rounded-xl shadow-2xl border border-[#C88D74]/40 opacity-0 group-hover/funnel4:opacity-100 transition-all duration-200 pointer-events-none z-50 text-left text-[11px] font-sans">
              <p className="font-bold text-[#C88D74] mb-1">04. Полный список скоринга</p>
              <p className="text-[#FAF7F2]/90 leading-normal">
                17 релевантных публичных кандидатов в полной базе (1 приватный аккаунт с 0 подписчиками отсеян на шаге фильтрации).
              </p>
            </div>
          </div>

          {/* Card 5: 5 Top Shortlist */}
          <div className="relative group/funnel5 p-2.5 rounded-xl bg-[#48121A] text-[#FAF7F2] font-bold col-span-2 sm:col-span-1 shadow-2xs cursor-help hover:bg-[#6E1D2A] transition-all">
            <span className="block text-base font-extrabold font-mono text-[#FAF7F2]">5</span>
            <span className="text-[10px] text-[#FAF7F2]/90 block mt-0.5 flex items-center justify-center space-x-0.5">
              <span>Топ Шорт-лист</span>
              <Info className="w-2.5 h-2.5 text-[#FAF7F2]/70" />
            </span>

            <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-[#161210] text-[#FAF7F2] rounded-xl shadow-2xl border border-[#C88D74]/40 opacity-0 group-hover/funnel5:opacity-100 transition-all duration-200 pointer-events-none z-50 text-left text-[11px] font-sans">
              <p className="font-bold text-[#C88D74] mb-1">05. Финалисты отбора</p>
              <p className="text-[#FAF7F2]/90 leading-normal">
                5 лидирующих кандидатов с высшей Итоговой оценкой (Composite Score), прошедшие визуальный VLM-контроль эстетики.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#4A3E39] leading-relaxed pt-1">
          💡 <strong>Как устроена воронка:</strong> В <strong>Все Кандидаты (17)</strong> вошли все реально существующие релевантные профили (из 18 спарсенных 1 закрытый аккаунт без подписчиков отсеян алгоритмом). В <strong>Топ Шорт-лист (5)</strong> входят только лидирующие кандидаты с высшим баллом. ИИ-модель <strong>VLM (Qwen2.5-VL)</strong> визуально проверяет эстетику ленты <strong>только для 5 финалистов шорт-листа</strong>, а не для всей базы, что обеспечивает экономичную и эффективную архитектуру.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96 md:w-[420px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7C75]" />
          <input
            type="text"
            placeholder="Поиск по имени, нику или нише..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] text-xs sm:text-sm text-[#161210] focus:outline-none focus:border-[#48121A] shadow-2xs transition-all"
          />
        </div>

        <div className="text-xs text-[#8C7C75] font-mono flex items-center space-x-2">
          <span>Отображено: <strong className="text-[#161210]">{filteredCandidates.length}</strong> из {displayedList.length}</span>
          {viewMode === 'shortlist' ? (
            <span className="px-2.5 py-1 rounded-md bg-[#EAF3EC] text-[#2E6B48] font-bold text-[11px]">
              Проверено VLM Визором
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-[#F3EDE2] text-[#8C7C75] font-semibold text-[11px]">
              Discovery + Scored Base
            </span>
          )}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCandidates.map((candidate) => (
          <div 
            key={candidate.username}
            className={`relative z-10 hover:z-50 p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
              candidate.isShortlist 
                ? 'bg-[#FFFFFF] border-[#D4C4B7] hover:border-[#48121A] shadow-xs' 
                : 'bg-[#FAF7F2] border border-[#E8E0D7] opacity-95 hover:opacity-100'
            }`}
          >
            <div className="space-y-3">
              {/* Header: Stylized Avatar + Display Name + Instagram Link + Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <CandidateAvatar username={candidate.username} displayName={candidate.displayName} className="w-12 h-12 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-[#161210] leading-tight truncate" title={candidate.displayName}>{candidate.displayName}</h4>
                    <a
                      href={`https://www.instagram.com/${candidate.username}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#8C7C75] hover:text-[#48121A] hover:underline mt-0.5 inline-flex items-center space-x-1 transition-colors truncate max-w-full group/instaLink"
                      title={`Перейти в Instagram профиль @${candidate.username}`}
                    >
                      <span className="truncate">@{candidate.username}</span>
                      <ExternalLink className="w-3 h-3 text-[#8C7C75]/70 shrink-0 group-hover/instaLink:text-[#48121A]" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1 shrink-0 pl-1">
                  {candidate.isShortlist ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#48121A] text-[#FAF7F2] text-[11px] font-bold whitespace-nowrap">
                      Шорт-лист
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-[#F3EDE2] text-[#8C7C75] text-[11px] font-medium whitespace-nowrap">
                      Кандидат
                    </span>
                  )}
                  
                  {/* Interactive VLM Audit Badge */}
                  {candidate.isShortlist && (
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setActiveModalTab('vlm');
                      }}
                      title="Нажмите для детального отчета визуальной проверки VLM (Qwen2.5-VL)"
                      className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold whitespace-nowrap shrink-0 flex items-center space-x-1 transition-all hover:scale-105 ${
                        candidate.vlmSanityPassed 
                          ? 'bg-[#EAF3EC] text-[#2E6B48] hover:bg-[#DDF0E2]' 
                          : 'bg-[#F7EFF1] text-[#48121A] hover:bg-[#F0E4E7]'
                      }`}
                    >
                      <Eye className="w-3 h-3 shrink-0" />
                      <span className="whitespace-nowrap">{candidate.vlmSanityPassed ? 'VLM Pass' : 'VLM Аудит'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grounded Bio Excerpt */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#8C7C75] uppercase tracking-wider block">
                  Описание профиля (Bio):
                </span>
                <p className="text-xs sm:text-sm text-[#4A3E39] whitespace-pre-line italic bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E0D7] leading-relaxed min-h-[4rem] max-h-40 overflow-y-auto font-sans">
                  "{candidate.biography}"
                </p>
              </div>

              {/* Metrics Grid with Language Context Tooltip */}
              <div className="grid grid-cols-3 gap-2 text-xs text-center py-2 border-y border-[#E8E0D7]">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-[#8C7C75] uppercase font-bold block">Подписчики</span>
                  <p className="font-bold text-[#161210] text-xs sm:text-sm mt-0.5">{formatFollowersCount(candidate.followersCount)}</p>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-[#8C7C75] uppercase font-bold block">Ниша</span>
                  <p className="font-bold text-[#161210] text-xs sm:text-sm capitalize mt-0.5">{candidate.niche}</p>
                </div>
                <div className="relative group/langTooltip cursor-help">
                  <span className="text-[10px] sm:text-[11px] text-[#8C7C75] uppercase font-bold flex items-center justify-center space-x-0.5">
                    <span>Язык</span>
                    <HelpCircle className="w-3 h-3 text-[#8C7C75]" />
                  </span>
                  <p className="font-bold text-[#161210] text-xs sm:text-sm uppercase font-mono mt-0.5">RU</p>

                  {/* Custom Language Context Popover */}
                  <div className="absolute bottom-full right-0 mb-2 w-72 sm:w-80 p-3.5 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/60 opacity-0 group-hover/langTooltip:opacity-100 transition-all duration-200 pointer-events-none z-[100] text-left text-xs whitespace-normal break-words space-y-1">
                    <p className="font-bold text-[#C88D74]">Языковой сигнал профиля (RU)</p>
                    <p className="text-[#FAF7F2]/90 leading-relaxed font-normal">
                      Для блогеров из РФ с латинским написанием никнейма лингвистический сигнал постов определен как русский (RU), а предложения формируются на русском языке.
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Label "Итоговая оценка" (Composite Score) Bar & Component Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs sm:text-sm relative group/scoreTooltip">
                  <div className="flex items-center space-x-1 cursor-help">
                    <span className="font-bold text-[#161210]">Итоговая оценка</span>
                    <HelpCircle className="w-3.5 h-3.5 text-[#8C7C75]" />
                  </div>
                  <span className="font-mono font-extrabold text-[#48121A] text-sm sm:text-base">
                    {formatPercentScore(candidate.compositeScore)}
                  </span>

                  {/* Custom Composite Score Formula Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 w-80 sm:w-96 p-3.5 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/60 opacity-0 group-hover/scoreTooltip:opacity-100 transition-all duration-200 pointer-events-none z-[100] text-left text-xs whitespace-normal break-words space-y-1">
                    <p className="font-bold text-[#C88D74]">Технический термин: Composite Score</p>
                    <p className="text-[#FAF7F2]/90 font-mono text-[11px] leading-relaxed font-normal">
                      Формула: 35% Qwen3 Embeddings + 35% 5-Feature Score + 30% BGE Reranker Score
                    </p>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-[#E8E0D7] overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#C88D74] to-[#48121A] rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(5, candidate.compositeScore * 100))}%` }}
                  ></div>
                </div>

                {/* Bottom Metrics with Custom Stylish Hover Popovers */}
                <div className="flex items-center justify-between pt-1 text-[10px] sm:text-xs font-mono text-[#8C7C75] whitespace-nowrap gap-1">
                  {/* Metric 1: Qwen3 */}
                  <div className="relative group/qwen shrink-0">
                    <span className="cursor-help border-b border-dashed border-[#8C7C75]/60 hover:text-[#161210] inline-block whitespace-nowrap">
                      Qwen3: <strong className="text-[#161210]">{formatPercentScore(candidate.semanticSimilarity)}</strong>
                    </span>

                    <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 p-3.5 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/60 opacity-0 group-hover/qwen:opacity-100 transition-all duration-200 pointer-events-none z-[100] text-left font-sans text-xs leading-relaxed whitespace-normal break-words space-y-1">
                      <p className="font-bold text-[#C88D74]">Qwen3-Embedding (0.6B)</p>
                      <p className="text-[#FAF7F2]/90 font-normal">Смысловое сходство профиля и постов с эталонным портретом бренда.</p>
                    </div>
                  </div>

                  {/* Metric 2: Features */}
                  <div className="relative group/feat text-center shrink-0">
                    <span className="cursor-help border-b border-dashed border-[#8C7C75]/60 hover:text-[#161210] inline-block whitespace-nowrap">
                      Features: <strong className="text-[#161210]">{formatPercentScore(candidate.featuresScore)}</strong>
                    </span>

                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/60 opacity-0 group-hover/feat:opacity-100 transition-all duration-200 pointer-events-none z-[100] text-left font-sans text-xs leading-relaxed whitespace-normal break-words space-y-1">
                      <p className="font-bold text-[#C88D74]">Детерминированный скоринг фич</p>
                      <p className="text-[#FAF7F2]/90 font-normal">Оценка по 5 критериям: ниша (30%), ER (25%), реклама (20%), свежесть (15%), язык (10%).</p>
                    </div>
                  </div>

                  {/* Metric 3: BGE Rerank */}
                  <div className="relative group/rerank text-right shrink-0">
                    <span className="cursor-help border-b border-dashed border-[#8C7C75]/60 hover:text-[#161210] inline-block whitespace-nowrap">
                      BGE: <strong className="text-[#161210]">{formatPercentScore(candidate.crossEncoderScore)}</strong>
                    </span>

                    <div className="absolute bottom-full right-0 mb-2 w-72 sm:w-80 p-3.5 bg-[#161210] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C88D74]/60 opacity-0 group-hover/rerank:opacity-100 transition-all duration-200 pointer-events-none z-[100] text-left font-sans text-xs leading-relaxed whitespace-normal break-words space-y-1">
                      <p className="font-bold text-[#C88D74]">BAAI/bge-reranker-v2-m3</p>
                      <p className="text-[#FAF7F2]/90 font-normal">Дополнительная пересортировка лидеров точной нейросетью-кросс-энкодером.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action */}
            <div className="pt-2 border-t border-[#E8E0D7] flex items-center justify-between">
              <span className="text-xs text-[#8C7C75] font-mono flex items-center space-x-1">
                <span>{candidate.barterOffer ? '✉️ Оффер сформирован' : '📊 Профиль оценен'}</span>
              </span>
              <button
                onClick={() => {
                  setSelectedCandidate(candidate);
                  setActiveModalTab('scores');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#48121A] text-[#161210] hover:text-[#FAF7F2] border border-[#D4C4B7] hover:border-[#48121A] text-xs sm:text-sm font-bold transition-colors flex items-center space-x-1"
              >
                <span>Детали скоринга</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Deep-Dive Modal Inspector (Rendered via React Portal with Full Dark Backdrop z-[9999]) */}
      {selectedCandidate && createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#161210]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#D4C4B7] rounded-3xl max-w-3xl sm:max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 sm:p-8 pb-4 border-b border-[#E8E0D7] bg-[#FFFFFF] shrink-0">
              <div className="flex items-center space-x-4">
                <CandidateAvatar username={selectedCandidate.username} displayName={selectedCandidate.displayName} className="w-14 h-14" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-[#161210]">{selectedCandidate.displayName}</h3>
                    {selectedCandidate.isShortlist && (
                      <span className="px-2 py-0.5 rounded bg-[#48121A] text-[#FAF7F2] text-xs font-bold">
                        Топ Шорт-лист
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://www.instagram.com/${selectedCandidate.username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-mono text-[#8C7C75] hover:text-[#48121A] hover:underline inline-flex items-center space-x-1 transition-colors mt-0.5 group/modalInsta"
                    title={`Перейти в Instagram профиль @${selectedCandidate.username}`}
                  >
                    <span>@{selectedCandidate.username}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#8C7C75]/80 group-hover/modalInsta:text-[#48121A]" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#8C7C75] hover:text-[#161210] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center space-x-2 px-6 sm:px-8 border-b border-[#E8E0D7] py-2 bg-[#FAF7F2] shrink-0">
              <button
                onClick={() => setActiveModalTab('scores')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeModalTab === 'scores' 
                    ? 'bg-[#48121A] text-[#FAF7F2] shadow-xs' 
                    : 'text-[#8C7C75] hover:text-[#161210] hover:bg-[#FFFFFF]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Математический скоринг</span>
              </button>

              <button
                onClick={() => setActiveModalTab('vlm')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeModalTab === 'vlm' 
                    ? 'bg-[#48121A] text-[#FAF7F2] shadow-xs' 
                    : 'text-[#8C7C75] hover:text-[#161210] hover:bg-[#FFFFFF]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Визуальная проверка (VLM)</span>
              </button>

              {selectedCandidate.barterOffer && (
                <button
                  onClick={() => setActiveModalTab('offer')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeModalTab === 'offer' 
                      ? 'bg-[#48121A] text-[#FAF7F2] shadow-xs' 
                      : 'text-[#8C7C75] hover:text-[#161210] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Персональный Оффер</span>
                </button>
              )}
            </div>

            {/* Modal Body Container */}
            <div className="p-6 sm:p-8 space-y-6 text-xs overflow-y-auto shrink grow">

              {/* Tab 1: Scoring Breakdown with Human-First Explanations */}
              {activeModalTab === 'scores' && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Composite Score Overview Card with Human Rationale */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#E8E0D7] pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider block">Финальный результат математического скоринга</span>
                        <h4 className="text-lg sm:text-xl font-extrabold text-[#161210]">Итоговая оценка (Composite Score)</h4>
                      </div>
                      <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#48121A]">
                        {formatPercentScore(selectedCandidate.compositeScore)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7]">
                      <p className="text-xs sm:text-sm text-[#161210] leading-relaxed">
                        💡 <strong>Как понятным языком интерпретировать балл {formatPercentScore(selectedCandidate.compositeScore)}:</strong> Этот результат объединяет смысловое соответствие текстов постов эстетике бренда ({formatPercentScore(selectedCandidate.semanticSimilarity)}), выполнение 5 базовых критериев ({formatPercentScore(selectedCandidate.featuresScore)}) и точную оценку нейросетью-реранкером ({formatPercentScore(selectedCandidate.crossEncoderScore)}). Оценка выше 60% означает высокую готовность к коммерческому сотрудничеству.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] text-[11px] sm:text-xs text-[#48121A] font-mono font-medium">
                      Формула: Composite = 0.35 * Qwen3_Embeddings ({formatPercentScore(selectedCandidate.semanticSimilarity)}) + 0.35 * Feature_Score ({formatPercentScore(selectedCandidate.featuresScore)}) + 0.30 * BGE_Reranker ({formatPercentScore(selectedCandidate.crossEncoderScore)})
                    </div>
                  </div>

                  {/* 5 Deterministic Partial Scores */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E8E0D7] pb-1.5">
                      <h4 className="font-bold text-[#161210] text-xs sm:text-sm">Детализация 5 формальных критериев (`partial_scores`):</h4>
                      <span className="text-[10px] font-bold text-[#8C7C75]">Общий вес блока в оценке: 35%</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1 hover:border-[#D4C4B7] transition-all">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-xs sm:text-sm text-[#161210]">Совпадение ниши (Niche Match)</span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#2E6B48]">
                            {(selectedCandidate.similarityBreakdown.partial_scores.niche_match * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#4A3E39] leading-relaxed">
                          Вес: 30%. Оценка попадания профиля в целевые категории бренда (lifestyle / beauty / fashion).
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1 hover:border-[#D4C4B7] transition-all">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-xs sm:text-sm text-[#161210]">Engagement Rate (ER Match)</span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#2E6B48]">
                            {(selectedCandidate.similarityBreakdown.partial_scores.er_match * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#4A3E39] leading-relaxed">
                          Вес: 25%. Проверка вовлеченности подписчиков по эталонному порогу бренд-стандарта (≥ 3.6%).
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1 hover:border-[#D4C4B7] transition-all">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-xs sm:text-sm text-[#161210]">Свежесть публикаций (Recency Match)</span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#2E6B48]">
                            {(selectedCandidate.similarityBreakdown.partial_scores.recency_match * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#4A3E39] leading-relaxed">
                          Вес: 15%. Подтверждение регулярной активности автора в Instagram (публикации ≤ 7 дней).
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1 hover:border-[#D4C4B7] transition-all">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-xs sm:text-sm text-[#161210]">Рекламная нагрузка (Sponsorship Match)</span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#2E6B48]">
                            {(selectedCandidate.similarityBreakdown.partial_scores.sponsorship_match * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#4A3E39] leading-relaxed">
                          Вес: 20%. Отсутствие «усталости аудитории» от частых спонсорских интеграций.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cross-Encoder Logits Box */}
                  {selectedCandidate.similarityBreakdown.raw_cross_encoder_score !== undefined && (
                    <div className="p-4 rounded-xl bg-[#F3EDE2] border border-[#D4C4B7] space-y-2.5">
                      <div className="flex items-center justify-between border-b border-[#D4C4B7]/60 pb-2">
                        <span className="font-bold text-[#161210] flex items-center space-x-1.5 text-xs sm:text-sm">
                          <BrainCircuit className="w-4 h-4 text-[#48121A]" />
                          <span>Логиты модели BAAI/bge-reranker-v2-m3 (Cross-Encoder)</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#48121A] text-[#FAF7F2] text-[10px] font-bold font-mono">
                          Вес: 30%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7]">
                          <span className="text-[#8C7C75] font-bold text-[10px] uppercase block mb-0.5">Raw Logit Score (сырой балл):</span>
                          <p className="font-bold text-[#161210] text-xs sm:text-sm">
                            {selectedCandidate.similarityBreakdown.raw_cross_encoder_score.toFixed(7)}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7]">
                          <span className="text-[#8C7C75] font-bold text-[10px] uppercase block mb-0.5">Sigmoid Normalized Score (в процентах):</span>
                          <p className="font-bold text-[#2E6B48] text-xs sm:text-sm">
                            {selectedCandidate.crossEncoderScore.toFixed(4)} ({formatPercentScore(selectedCandidate.crossEncoderScore)})
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] text-[11px] sm:text-xs text-[#4A3E39] leading-relaxed font-sans">
                        💡 <strong>Разъяснение:</strong> Модель BAAI/bge-reranker-v2-m3 производит точную смысловую пересортировку лидеров. <strong>Raw Logit Score</strong> — сырой математический балл нейросети. <strong>Sigmoid Normalized Score</strong> — нормализованная оценка (0..100%), приведенная математической функцией сигмоиды для финального расчета Composite Score.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: VLM Audit & Grounding Facts (Fully Translated to Russian) */}
              {activeModalTab === 'vlm' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#E8E0D7] pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider block">Мультимодальная нейросеть Qwen2.5-VL</span>
                        <h4 className="text-base sm:text-lg font-bold text-[#161210]">
                          Визуальный аудит эстетики ленты
                        </h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
                        selectedCandidate.vlmSanityPassed 
                          ? 'bg-[#EAF3EC] text-[#2E6B48]' 
                          : 'bg-[#F7EFF1] text-[#48121A]'
                      }`}>
                        {selectedCandidate.vlmSanityPassed ? <CheckCircle2 className="w-4 h-4 text-[#2E6B48]" /> : <XCircle className="w-4 h-4 text-[#48121A]" />}
                        <span>{selectedCandidate.vlmSanityPassed ? 'Визуальный Pass' : 'Аудит эстетики зафиксирован'}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider block">
                        Заключение ИИ-визора по эстетике ленты:
                      </span>
                      <p className="text-xs sm:text-sm text-[#161210] leading-relaxed italic bg-[#FFFFFF] p-4 rounded-xl border border-[#E8E0D7]">
                        "{selectedCandidate.vlmAestheticNotes}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="font-bold text-[#161210] text-sm">Фактологические заземления профиля (Grounding Facts):</h4>
                    <div className="space-y-2">
                      {selectedCandidate.groundingFacts.map((fact, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] text-xs text-[#4A3E39] flex items-start space-x-2.5">
                          <span className="text-[#48121A] font-bold font-mono">0{idx + 1}.</span>
                          <span className="leading-relaxed">{fact}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F7EFF1] border border-[#48121A]/30 text-[#48121A] space-y-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider block">
                      📌 Архитектурная роль VLM в пайплайне
                    </span>
                    <p className="text-xs leading-relaxed">
                      VLM проводит финальную эстетическую валидацию ленты строго на заключительном узком этапе для финалистов шорт-листа. Вердикт фиксируется в отчете для PR-менеджера и дополняет математический скоринг.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Generated Offer */}
              {activeModalTab === 'offer' && selectedCandidate.barterOffer && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#E8E0D7] pb-2.5">
                      <span className="font-bold text-[#161210]">Тема коммерческого письма:</span>
                      <span className="px-2.5 py-0.5 rounded bg-[#EAF3EC] text-[#2E6B48] font-mono text-[10px] font-bold">
                        QA Approved (Anti-Robotic Enforced)
                      </span>
                    </div>
                    <p className="font-bold text-[#48121A] text-sm sm:text-base bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E8E0D7]">
                      {selectedCandidate.barterOffer.subject}
                    </p>

                    <div className="space-y-1.5">
                      <span className="font-bold text-[#8C7C75] text-[10px] uppercase tracking-wider block">Текст сгенерированного персонального предложения:</span>
                      <div className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] text-xs sm:text-sm leading-relaxed text-[#161210] whitespace-pre-wrap font-sans">
                        {selectedCandidate.barterOffer.body}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1.5">
                      <span className="font-bold text-[#8C7C75] text-[10px] uppercase tracking-wider block">Персонализированные элементы:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidate.barterOffer.personalized_elements.map((elem, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F3EDE2] text-[#161210] text-xs">
                            ✨ {elem}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1.5">
                      <span className="font-bold text-[#8C7C75] text-[10px] uppercase tracking-wider block">Заземляющие факты:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidate.barterOffer.grounding_facts.map((fact, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F3EDE2] text-[#4A3E39] text-xs">
                            📍 {fact}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-[#E8E0D7] bg-[#FFFFFF] flex justify-end shrink-0">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-6 py-2.5 rounded-xl bg-[#161210] text-[#FAF7F2] hover:bg-[#48121A] transition-colors font-bold text-xs shadow-md"
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
