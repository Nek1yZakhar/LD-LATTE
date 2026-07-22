import React from 'react';
import { 
  Workflow, 
  ShieldAlert, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Server, 
  Database,
  ArrowRight
} from 'lucide-react';
import { GROUNDED_PART2_AUTOMATION } from '@/data';

export const Part2Section: React.FC = () => {
  const part2 = GROUNDED_PART2_AUTOMATION;

  return (
    <section id="part-2" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#D4C4B7]">
      <div className="ld-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#48121A]/15 text-[#48121A] border border-[#48121A]/30 text-xs font-bold uppercase tracking-wider">
            <Workflow className="w-3.5 h-3.5" />
            <span>Часть 2 • Схема Сквозной Автоматизации</span>
          </div>

          <h2 className="font-[#Outfit] text-3xl sm:text-4xl font-bold text-[#161210]">
            Архитектура сквозной автоматизации <br />
            <span className="font-[#Playfair Display] italic font-normal text-[#48121A]">
              для fashion e-commerce
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
            {part2.summary}
          </p>
        </div>

        {/* 2.1 High-Level Architecture Diagram Shell */}
        <div id="p2-arch" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#48121A] uppercase tracking-wider">2.1 Системная интеграция</span>
              <h3 className="text-lg font-bold text-[#161210]">Промышленный конвейер автоматизации</h3>
            </div>
            <span className="text-xs font-mono text-[#8C7C75]">End-to-End Enterprise Flow</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {part2.systemArchitectureNodes.map((node, index) => (
              <div key={node.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-[#161210] text-[#FAF7F2] flex items-center justify-center font-bold text-xs">
                    0{index + 1}
                  </span>
                  <span className="text-[10px] font-mono text-[#48121A] bg-[#48121A]/10 px-2 py-0.5 rounded">
                    {node.id}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#161210]">{node.name}</h4>
                <p className="text-xs text-[#8C7C75] leading-relaxed">{node.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2.2 Anti-Fraud & Scraping Hierarchy */}
        <div id="p2-scraping" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#48121A] uppercase tracking-wider">2.2 Обход блокировок</span>
              <h3 className="text-lg font-bold text-[#161210]">Иерархия скрапинга и прокси-инфраструктура</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#EAF3EC] text-[#2E6B48] text-xs font-semibold">
              Self-Operated First
            </span>
          </div>

          <div className="space-y-3">
            {part2.scrapingHierarchy.map((tier) => (
              <div key={tier.level} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-[#48121A] text-[#FAF7F2] flex items-center justify-center text-xs font-bold shrink-0">
                    T{tier.level}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#161210]">{tier.technology} ({tier.role})</h4>
                    <p className="text-[11px] text-[#8C7C75]">{tier.triggerCondition}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#2E6B48] bg-[#EAF3EC] px-2.5 py-1 rounded-md shrink-0">
                  Level {tier.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2.3 SLA, Risks & Economics */}
        <div id="p2-econ" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Economics Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-[#48121A]">
              <DollarSign className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#161210]">Юнит-экономика прогона</h3>
            </div>
            <p className="text-xs text-[#8C7C75] leading-relaxed">
              Оценка затрат на обработку пула из <strong className="text-[#161210]">1,000 кандидатов</strong>:
            </p>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Парсинг & Прокси:</span>
                <span className="font-mono font-bold">$2.50 – $4.00</span>
              </div>
              <div className="flex justify-between">
                <span>Qwen3 + BGE Reranker:</span>
                <span className="font-mono font-bold">$3.00 – $5.00</span>
              </div>
              <div className="flex justify-between">
                <span>VLM Sanity Pass (Top 5):</span>
                <span className="font-mono font-bold">$0.50 – $1.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8E0D7] text-[#2E6B48] font-bold">
                <span>Итого на 1,000 инфлюенсеров:</span>
                <span className="font-mono">$12.00 – $15.00</span>
              </div>
            </div>
          </div>

          {/* SLA Card */}
          <div id="p2-sla" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-[#48121A]">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#161210]">SLA & Защита от рисков</h3>
            </div>
            <ul className="space-y-2 text-xs text-[#4A3E39]">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E6B48] shrink-0 mt-0.5" />
                <span>Автоматический отсев закрытых/удаленных профилей (Правило 7).</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E6B48] shrink-0 mt-0.5" />
                <span>Ротация сессионных куки каждые 100 запросов.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E6B48] shrink-0 mt-0.5" />
                <span>Human-in-the-loop проверка перед отправкой образцов LD Latte.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
