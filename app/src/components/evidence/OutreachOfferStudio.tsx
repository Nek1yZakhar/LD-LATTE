import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  FileCode, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  X, 
  ExternalLink,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import type { BarterOffer, OutreachPromptInspector } from '@/data';

interface OutreachOfferStudioProps {
  offers: BarterOffer[];
  promptInspector: OutreachPromptInspector;
}

export const OutreachOfferStudio: React.FC<OutreachOfferStudioProps> = ({ 
  offers, 
  promptInspector 
}) => {
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<number>(0);
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeOffer = offers[selectedOfferIndex] || offers[0];

  const handleCopyBody = () => {
    if (!activeOffer) return;
    navigator.clipboard.writeText(`${activeOffer.subject}\n\n${activeOffer.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="p1-offers" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0D7]">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#C88D74]/15 text-[#6E5346] text-xs font-bold uppercase tracking-wider mb-1">
            <Mail className="w-3.5 h-3.5" />
            <span>1.5 Сквозная генерация писем & QA</span>
          </div>
          <h3 className="text-xl font-bold text-[#161210]">Из чего формируется персональный оффер</h3>
          <p className="text-xs text-[#4A3E39]">
            Автоматический синтез писем (DeepSeek-V4) по фактам профиля с проверкой на отсутствие канцелярита.
          </p>
        </div>

        <button
          onClick={() => setShowPromptModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#48121A] hover:bg-[#6B1D2E] text-[#FAF7F2] text-xs font-bold transition-all shadow-xs flex items-center space-x-2 shrink-0"
        >
          <FileCode className="w-4 h-4 text-[#C88D74]" />
          <span>Инспектор промпта (`outreach_offer.md`)</span>
        </button>
      </div>

      {/* Narrative Explanation Banner: How the letter is assembled */}
      <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-[#48121A] font-bold">
          <Sparkles className="w-4 h-4 text-[#C88D74]" />
          <span>Как система собирает индивидуальное письмо (без шаблонов и роботоподобных фраз):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[#4A3E39]">
          <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-1">
            <span className="font-bold text-[#161210] block">1. Входные факты</span>
            <p className="text-[11px] leading-relaxed">
              Система берет био, посты кандидата из Шорт-листа, эталонный тон бренда LD Latte и личное имя автора.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-1">
            <span className="font-bold text-[#161210] block">2. Заземление в деталях</span>
            <p className="text-[11px] leading-relaxed">
              ИИ-модель (DeepSeek-V4) упоминает конкретные детали постов (стиль, эстетику, нишу) без выдуманных данных.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-1">
            <span className="font-bold text-[#2E6B48] block">3. Фильтр Anti-Robotic QA</span>
            <p className="text-[11px] leading-relaxed">
              Код отсеивает канцелярит (*«Надеюсь, письмо застанет вас...»*) и контролирует русский язык (Cyrillic ≥ 15).
            </p>
          </div>
        </div>
      </div>

      {/* Candidate Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-[#8C7C75] shrink-0 mr-1">Офферы для лидеров шорт-листа:</span>
        {offers.map((offer, idx) => {
          const isSelected = selectedOfferIndex === idx;
          return (
            <button
              key={offer.username}
              onClick={() => setSelectedOfferIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-[#161210] text-[#FAF7F2] border-[#161210] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#4A3E39] border-[#E8E0D7] hover:border-[#48121A]'
              }`}
            >
              @{offer.username}
            </button>
          );
        })}
      </div>

      {/* Barter Offer View Card */}
      {activeOffer && (
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] space-y-5">
          {/* Card Top Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E0D7]">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#161210]">Оффер для:</span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#48121A] text-[#FAF7F2] text-xs font-bold">
                @{activeOffer.username}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#EAF3EC] text-[#2E6B48] text-[10px] font-mono font-bold uppercase">
                Lang: {activeOffer.language}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-[#EAF3EC] text-[#2E6B48] text-xs font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>QA Passed (Cyrillic ≥ 15)</span>
              </span>
              <button
                onClick={handleCopyBody}
                className="p-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F3EDE2] text-[#161210] border border-[#E8E0D7] transition-colors"
                title="Копировать текст"
              >
                {copied ? <Check className="w-4 h-4 text-[#2E6B48]" /> : <Copy className="w-4 h-4 text-[#8C7C75]" />}
              </button>
            </div>
          </div>

          {/* Email Subject */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider">Тема письма (Subject):</span>
            <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] text-sm font-bold text-[#48121A]">
              {activeOffer.subject}
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider">Текст письма (Personalized Body):</span>
            <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] text-xs leading-relaxed text-[#161210] font-sans whitespace-pre-wrap">
              {activeOffer.body}
            </div>
          </div>

          {/* Grounding & Personalization Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-1.5">
              <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#C88D74]" />
                <span>Персонализированные детали</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {activeOffer.personalized_elements.map((item, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-[#F3EDE2] text-[#161210] text-xs font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-1.5">
              <span className="text-[10px] font-bold text-[#8C7C75] uppercase tracking-wider flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-[#2E6B48]" />
                <span>Заземляющие факты профиля</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {activeOffer.grounding_facts.map((fact, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-[#FAF7F2] text-[#4A3E39] text-xs">
                    {fact}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Inspector Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-[#161210]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#D4C4B7] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E0D7]">
              <div>
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#48121A]/10 text-[#48121A] text-xs font-bold uppercase tracking-wider mb-1">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Prompt & QA Guardrails Inspector</span>
                </div>
                <h3 className="text-xl font-bold text-[#161210]">{promptInspector.promptFilePath}</h3>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#8C7C75] hover:text-[#161210]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QA Guardrails Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                <span className="font-bold text-[#8C7C75] text-[10px] uppercase">Правило кириллицы:</span>
                <p className="font-mono text-[#2E6B48] font-bold">
                  cyrillic_count ≥ {promptInspector.qaRules.cyrillicMinCount} (Принудительно для блогеров из РФ)
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                <span className="font-bold text-[#8C7C75] text-[10px] uppercase">Заземление фактов:</span>
                <p className="font-mono text-[#161210] font-bold">
                  100% Fact Grounding (Запрет выдуманных коллекций)
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                <span className="font-bold text-[#8C7C75] text-[10px] uppercase">Обращение по имени:</span>
                <p className="font-mono text-[#48121A] font-bold">
                  First Name Extractor с фолбеком на @username
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                <span className="font-bold text-[#8C7C75] text-[10px] uppercase">Anti-Robotic QA Check:</span>
                <p className="font-mono text-[#2E6B48] font-bold">
                  `validate_qa_draft()` запрещает канцелярит и жаргон
                </p>
              </div>
            </div>

            {/* System Prompt Code Box */}
            <div className="space-y-2">
              <span className="font-bold text-[#161210] text-xs">Системный промпт генерации (`prompts/outreach_offer.md`):</span>
              <pre className="p-4 rounded-2xl bg-[#161210] text-[#FAF7F2] font-mono text-xs leading-relaxed overflow-x-auto border border-[#4A3E39] whitespace-pre-wrap">
                {promptInspector.systemPromptTemplate}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#E8E0D7] flex justify-end">
              <button
                onClick={() => setShowPromptModal(false)}
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
