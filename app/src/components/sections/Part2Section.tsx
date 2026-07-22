import React from 'react';
import { 
  Workflow, 
  ShieldAlert, 
  DollarSign, 
  CheckCircle2, 
  Cpu, 
  Server, 
  Database,
  Lock,
  Layers,
  HelpCircle,
  AlertTriangle
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
            Как устроена сквозная автоматизация <br />
            <span className="font-[#Playfair Display] italic font-normal text-[#48121A]">
              от сбора данных до коммерческого предложения
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
            Понятное пошаговое описание производственного конвейера: что парсится, как обходят блокировки, почему решение стоит копейки и как работает защита от рисков при масштабировании на 1 000+ кандидатов в месяц.
          </p>
        </div>

        {/* 2.1 High-Level Architecture Nodes Breakdown */}
        <div id="p2-arch" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#48121A] uppercase tracking-wider">2.1 Ключевые узлы конвейера</span>
              <h3 className="text-lg font-bold text-[#161210]">4 этапа сквозной промышленной системы</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EAF3EC] text-[#2E6B48] text-xs font-bold border border-[#2E6B48]/30">
              100% Self-Operated Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Node 1: Scraping */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-[#161210] text-[#FAF7F2] flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <span className="text-[10px] font-mono text-[#2E6B48] bg-[#EAF3EC] px-2.5 py-0.5 rounded font-bold">
                  100% Собственный парсер
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#161210]">1. Сбор данных и профилей (Ingestion Layer)</h4>
              
              <div className="space-y-2 text-xs text-[#4A3E39] pt-1">
                <p><strong>Что происходит:</strong> Автоматический сбор публичной био и последних публикаций блогеров.</p>
                <p><strong>Зачем нужно:</strong> Чтобы обогатить список кандидатов подлинными текстами постов и метриками вовлеченности.</p>
                <p><strong>Чем реализовано:</strong> Локальный каскад `Instaloader CLI` + `Playwright` с авторизованной сессией куки (`sessionid`) и SOCKS5 прокси.</p>
                <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D4C4B7] text-[11px] text-[#48121A] font-medium">
                  💡 <strong>Важно:</strong> Сторонние сервисы (Apify) <u>НЕ использовались</u> — весь прогон на 100% выполнен собственным локальным скриптом.
                </div>
              </div>
            </div>

            {/* Node 2: AI Scoring */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-[#161210] text-[#FAF7F2] flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <span className="text-[10px] font-mono text-[#48121A] bg-[#48121A]/10 px-2.5 py-0.5 rounded font-bold">
                  Гибридный AI-стек
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#161210]">2. Математический скоринг и реранкинг (AI Engine)</h4>
              
              <div className="space-y-2 text-xs text-[#4A3E39] pt-1">
                <p><strong>Что происходит:</strong> Перевод текстов в векторы, детерминированная оценка 5 фич, реранкинг кросс-энкодером и точечный VLM-аудит визуала 5 лидеров.</p>
                <p><strong>Зачем нужно:</strong> Мгновенно отранжировать кандидатов по математике без субъективности.</p>
                <p><strong>Чем реализовано:</strong> `Qwen3-Embedding` + `BAAI/bge-reranker-v2-m3` (локально на GPU) + `Qwen2.5-VL` (облачный API для 5 финалистов).</p>
                <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D4C4B7] text-[11px] text-[#2E6B48] font-medium">
                  ⚡ <strong>Архитектура:</strong> Тяжелый текстовый скоринг работает локально ($0.00), а VLM вызывается через API строго для 5 финалистов (экономия VRAM).
                </div>
              </div>
            </div>

            {/* Node 3: CRM & Logistics */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-[#161210] text-[#FAF7F2] flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <span className="text-[10px] font-mono text-[#161210] bg-[#161210]/10 px-2.5 py-0.5 rounded font-bold">
                  Интеграция CRM / 1С
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#161210]">3. Интеграция с CRM и логистикой (CRM Bridge)</h4>
              
              <div className="space-y-2 text-xs text-[#4A3E39] pt-1">
                <p><strong>Что происходит:</strong> Передача карточки кандидата в Bitrix24 / Supabase при согласии блогера на бартер.</p>
                <p><strong>Зачем нужно:</strong> Автоматически сформировать наряд на сборку подарка и сгенерировать трек-номер доставки.</p>
                <p><strong>Чем реализовано:</strong> REST API webhook + Pydantic-схема заказа (`OutreachDraft` & CRM integration payload).</p>
              </div>
            </div>

            {/* Node 4: Outreach & Anti-Fraud */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-[#161210] text-[#FAF7F2] flex items-center justify-center font-bold text-xs">
                  04
                </span>
                <span className="text-[10px] font-mono text-[#2E6B48] bg-[#EAF3EC] px-2.5 py-0.5 rounded font-bold">
                  Anti-Robotic QA
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#161210]">4. Генерация офферов и QA (Outreach Automation)</h4>
              
              <div className="space-y-2 text-xs text-[#4A3E39] pt-1">
                <p><strong>Что происходит:</strong> Составление личных предложений о сотрудничестве на основе фактов из постов кандидата.</p>
                <p><strong>Зачем нужно:</strong> Высокая конверсия ответа от блогера благодаря теплому тону и отсутствию спам-шаблонов.</p>
                <p><strong>Чем реализовано:</strong> ИИ-генератор DeepSeek-V4 + валидатор `validate_qa_draft()` для проверки языка и отсева канцелярита.</p>
              </div>
            </div>

          </div>
        </div>

        {/* 2.2 Anti-Fraud & Scraping Hierarchy */}
        <div id="p2-scraping" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#48121A] uppercase tracking-wider">2.2 Обход блокировок и антифрод</span>
              <h3 className="text-lg font-bold text-[#161210]">Иерархия скрапинга: почему система работала сама</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#EAF3EC] text-[#2E6B48] text-xs font-semibold">
              Self-Operated Parser Policy
            </span>
          </div>

          <div className="space-y-3">
            {part2.scrapingHierarchy.map((tier) => (
              <div key={tier.level} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-lg text-[#FAF7F2] flex items-center justify-center text-xs font-bold shrink-0 ${
                    tier.level === 3 ? 'bg-[#8C7C75]' : 'bg-[#48121A]'
                  }`}>
                    T{tier.level}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#161210]">{tier.technology}</h4>
                    <p className="text-[11px] text-[#4A3E39] mt-0.5">{tier.role} • <i>{tier.triggerCondition}</i></p>
                  </div>
                </div>
                <span className={`text-[11px] font-mono px-3 py-1 rounded-md shrink-0 font-bold ${
                  tier.level === 3 
                    ? 'bg-[#FAF7F2] text-[#8C7C75] border border-[#D4C4B7]' 
                    : 'bg-[#EAF3EC] text-[#2E6B48]'
                }`}>
                  {tier.level === 3 ? 'НЕ вызывался (Резерв)' : 'ОСНОВНОЙ ПУТЬ'}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-2 text-xs text-[#4A3E39]">
            <span className="font-bold text-[#161210] block">Как преодолевались реальные сетевые ограничения Instagram:</span>
            <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
              <li><strong>Ограничения авторизации:</strong> Экспорт валидной сессии `sessionid` из браузера исключает триггеры капчи.</li>
              <li><strong>Rate-Limits и сетевые блокировки:</strong> Использован ротируемый пулл SOCKS5 прокси с задержками между запросами.</li>
              <li><strong>Удаленные / невалидные профили:</strong> Автоматическое правило Hard Reject отсеяло 15 недоступных ссылок из 34 без зависания конвейера.</li>
            </ul>
          </div>
        </div>

        {/* 2.3 SLA, Risks & Economics */}
        <div id="p2-econ" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Economics Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D7]">
              <div className="flex items-center space-x-2 text-[#48121A]">
                <DollarSign className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#161210]">Честная юнит-экономика прогона</h3>
              </div>
              <span className="text-[10px] font-mono text-[#2E6B48] bg-[#EAF3EC] px-2 py-0.5 rounded font-bold">
                Owner-Confirmed Model
              </span>
            </div>
            
            <p className="text-xs text-[#4A3E39] leading-relaxed">
              Реалистичный расчёт затрат на целевой прогон пула из <strong className="text-[#161210]">10–20 кандидатов</strong> (собственный локальный парсер):
            </p>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span>Парсинг & SOCKS5 Прокси:</span>
                <span className="font-mono font-bold text-[#161210]">~$0.01 (мизерный расход)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Qwen3 Embeddings & BGE Reranker:</span>
                <span className="font-mono font-bold text-[#2E6B48]">$0.00 (Локальный GPU)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Qwen2.5-VL-72B Multimodal (OpenRouter API):</span>
                <span className="font-mono font-bold text-[#2E6B48]">~$0.003 (Прямой VLM API-вызов)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Генерация писем (DeepSeek-V4 API):</span>
                <span className="font-mono font-bold text-[#2E6B48]">~$0.01 (Копейки — $0.14 / 1M ток)</span>
              </div>
              
              <div className="flex justify-between items-center pt-2.5 border-t border-[#E8E0D7] text-[#48121A] font-bold text-xs sm:text-sm">
                <span>Итого за прогон целевого пула:</span>
                <span className="font-mono text-[#2E6B48] font-extrabold">~$0.02 (около 2 центов)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#8C7C75] italic">
              * Живой мультимодальный проход Qwen2.5-VL-72B на OpenRouter для 5 изображений стоил меньше полуцента ($0.003), так как VLM вызывается точечно для верхушки шорт-листа.
            </p>
          </div>

          {/* SLA & Risks Card */}
          <div id="p2-sla" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-[#48121A] pb-2 border-b border-[#E8E0D7]">
              <ShieldAlert className="w-5 h-5 text-[#48121A]" />
              <h3 className="text-base font-bold text-[#161210]">Что может пойти не так и как система себя страхует</h3>
            </div>
            
            <div className="space-y-3 text-xs text-[#4A3E39]">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                <span className="font-bold text-[#161210] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B48]" />
                  <span>Риск: Битые или удаленные ссылки Instagram</span>
                </span>
                <p className="text-[11px] text-[#4A3E39] pl-5 leading-relaxed">
                  Защита: Автоматический отсев (Hard Reject) при откликах HTTP 404/400. В пилоте отсеяно 15 невалидных ссылок.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                <span className="font-bold text-[#161210] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B48]" />
                  <span>Риск: Канцелярит и ошибочный язык в письмах</span>
                </span>
                <p className="text-[11px] text-[#4A3E39] pl-5 leading-relaxed">
                  Защита: Модуль `validate_qa_draft()` запрещает стандартные клише и жестко проверяет наличие кириллицы.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
                <span className="font-bold text-[#161210] flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B48]" />
                  <span>Риск: Ошибочный отправка подарка не тому блогеру</span>
                </span>
                <p className="text-[11px] text-[#4A3E39] pl-5 leading-relaxed">
                  Защита: Контроль Human-in-the-loop — менеджер подтверждает отправку образца одежды в 1 клик.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

