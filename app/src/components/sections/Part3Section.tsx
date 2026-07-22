import React, { useState } from 'react';
import { 
  UserCheck, 
  GraduationCap, 
  Code2, 
  ExternalLink, 
  Github, 
  FileText, 
  CheckCircle2,
  Workflow,
  FolderGit2,
  ShieldCheck,
  Globe,
  ChevronDown,
  HelpCircle,
  Database,
  Terminal,
  Layers
} from 'lucide-react';
import { GROUNDED_AUTHOR_RESUME, GROUNDED_PROOF_LINKS, type ProofLink } from '@/data';

export const Part3Section: React.FC = () => {
  const author = GROUNDED_AUTHOR_RESUME;

  return (
    <section id="part-3" className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="ld-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#48121A]/15 text-[#48121A] border border-[#48121A]/30 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Часть 3 • Автор & Инженерные Кейсы</span>
          </div>

          <h2 className="font-[#Outfit] text-3xl sm:text-4xl font-bold text-[#161210]">
            Профайл инженера <br />
            <span className="font-[#Playfair Display] italic font-normal text-[#48121A]">
              & портфолио реальных проектов
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
            Упаковка компетенций автора под вакансию AI Systems & Automation Engineer (Loop Engineer): практический стек, опыт создания брендов и автономных систем с ссылками на рабочие релизы.
          </p>
        </div>

        {/* 3.1 Author Bio Card */}
        <div id="p3-author" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E0D7]">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-[#161210] text-[#FAF7F2] flex items-center justify-center font-bold text-xl shadow-md border border-[#48121A]">
                ZM
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#161210]">{author.name}</h3>
                <p className="text-xs font-mono text-[#48121A] font-bold mt-0.5">{author.targetRoles[0]}</p>
                <p className="text-xs text-[#8C7C75]">{author.location} • {author.workFormat}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={author.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#161210] text-[#FAF7F2] hover:bg-[#48121A] transition-colors text-xs font-semibold"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Профиль</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* Education */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-2">
              <div className="flex items-center space-x-2 text-[#48121A] font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>Образование & Стажировки</span>
              </div>
              <div className="space-y-2 text-[#4A3E39]">
                <div>
                  <p className="font-bold text-[#161210]">{author.education[0]?.institution}</p>
                  <p className="text-[11px] text-[#8C7C75]">{author.education[0]?.degree} ({author.education[0]?.period})</p>
                </div>
                <div className="pt-2 border-t border-[#E8E0D7]">
                  <p className="font-bold text-[#161210]">{author.education[1]?.institution}</p>
                  <p className="text-[11px] text-[#8C7C75]">{author.education[1]?.degree} ({author.education[1]?.period})</p>
                </div>
              </div>
            </div>

            {/* Core Tech Stack */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-2">
              <div className="flex items-center space-x-2 text-[#48121A] font-bold">
                <Code2 className="w-4 h-4" />
                <span>Ключевой Инженерный Стек</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[...author.technicalStack.languages, ...author.technicalStack.aiMlData, ...author.technicalStack.parsingAutomation].map((skill: string) => (
                  <span key={skill} className="px-2.5 py-1 rounded-md bg-[#FFFFFF] text-[#161210] font-semibold border border-[#E8E0D7]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 3.2 Key Case Studies */}
        <div id="p3-cases" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#48121A] uppercase tracking-wider">3.2 Портфолио проектов</span>
              <h3 className="text-lg font-bold text-[#161210]">Ключевые инженерные и digital-кейсы</h3>
            </div>
            <span className="text-xs text-[#8C7C75] font-mono">Production Proven Systems</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {author.keyCaseStudies.map((project) => (
              <div key={project.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-4 flex flex-col justify-between hover:border-[#48121A]/40 transition-colors">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase text-[#48121A] bg-[#48121A]/15 px-2 py-0.5 rounded">
                    {project.role}
                  </span>
                  <h4 className="text-sm font-bold text-[#161210]">{project.title}</h4>
                  <p className="text-xs text-[#4A3E39] leading-relaxed">{project.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E8E0D7]">
                  <div className="flex items-start space-x-1.5 text-[11px] text-[#2E6B48] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{project.results[0]}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {project.stack.map((tech: string) => (
                      <span key={tech} className="text-[9px] font-mono bg-[#FFFFFF] text-[#4A3E39] px-1.5 py-0.5 rounded border border-[#E8E0D7]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links Row */}
                  <div className="flex items-center space-x-2 pt-1">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#48121A] text-[#FAF7F2] hover:bg-[#6B1D2E] transition-colors text-[11px] font-bold"
                      >
                        <Globe className="w-3 h-3 text-[#C88D74]" />
                        <span>Сайт / Demo</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#E8E0D7] text-[#161210] hover:bg-[#F3EDE2] transition-colors text-[11px] font-bold"
                      >
                        <Github className="w-3 h-3 text-[#161210]" />
                        <span>GitHub Repo</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3.3 AI-Native Workflow */}
        <div id="p3-mindset" className="p-6 sm:p-8 rounded-3xl bg-[#161210] text-[#FAF7F2] shadow-md space-y-6">
          <div className="flex items-center space-x-2 text-[#E8A990]">
            <Workflow className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#FAF7F2]">AI-Native Рабочий Процесс (Methodology)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF7F2]/10 border border-[#FAF7F2]/15 space-y-1">
              <span className="text-xs font-mono font-bold text-[#E8A990]">01. PLAN</span>
              <p className="text-[#D4C4B7]">Анализ требований и подготовка пошагового плана без ломания архитектуры.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2]/10 border border-[#FAF7F2]/15 space-y-1">
              <span className="text-xs font-mono font-bold text-[#E8A990]">02. APPROVE</span>
              <p className="text-[#D4C4B7]">Ожидание согласования пользователем перед модификацией кода.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2]/10 border border-[#FAF7F2]/15 space-y-1">
              <span className="text-xs font-mono font-bold text-[#E8A990]">03. EXECUTE</span>
              <p className="text-[#D4C4B7]">Чистая типизированная реализация с обработкой ошибок и тестами.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2]/10 border border-[#FAF7F2]/15 space-y-1">
              <span className="text-xs font-mono font-bold text-[#E8A990]">04. AUDIT</span>
              <p className="text-[#D4C4B7]">Полный аудит результатов, проверка 100% данных и фиксация в STATE.md.</p>
            </div>
          </div>
        </div>

        {/* 3.4 Proof Docs & Submission Navigator (De-emphasized Secondary Drawer) */}
        <SubmissionNavigatorHub />

      </div>
    </section>
  );
};

/**
 * Secondary Submission & Evidence Hub (Interactive Document Readers for README.md & ARCHITECTURE.md)
 */
const SubmissionNavigatorHub: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'readme' | 'architecture' | null>('readme');

  return (
    <div id="p3-evidence" className="rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] overflow-hidden transition-all shadow-xs space-y-6 p-6 sm:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E0D7]">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#48121A] uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>3.4 Инженерная Документация</span>
          </div>
          <h3 className="text-xl font-bold text-[#161210]">Полный текст архитектуры и документации</h3>
          <p className="text-xs text-[#8C7C75] mt-1">
            Нажмите на карту документа для мгновенного раскрытия и изучения полной технической спецификации, схем и Pydantic-контрактов.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EAF3EC] text-[#2E6B48] border border-[#2E6B48]/30 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2 Полных Документа (Full Text)</span>
          </span>
        </div>
      </div>

      {/* 2 Main Reader Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: README.md */}
        <button
          onClick={() => setActiveDoc(activeDoc === 'readme' ? null : 'readme')}
          className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-4 group ${
            activeDoc === 'readme'
              ? 'bg-[#FAF7F2] border-[#48121A] shadow-sm ring-1 ring-[#48121A]'
              : 'bg-[#FAF7F2]/60 border-[#E8E0D7] hover:border-[#48121A]/50 hover:bg-[#FAF7F2]'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border bg-[#48121A]/15 text-[#48121A] border-[#48121A]/30">
                README.MD • НАВИГАТОР
              </span>
              <FileText className={`w-4 h-4 transition-colors ${activeDoc === 'readme' ? 'text-[#48121A]' : 'text-[#8C7C75] group-hover:text-[#48121A]'}`} />
            </div>

            <h4 className="text-base font-bold text-[#161210] group-hover:text-[#48121A] transition-colors flex items-center space-x-2">
              <span>README.md — Стартовое руководство</span>
            </h4>

            <p className="text-xs text-[#4A3E39] leading-relaxed">
              Позиционирование проекта, гибридный стек (Qwen3, BGE, DeepSeek), правила обхода банов, quick-start команды и структура пайплайна.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E8E0D7] flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-[#8C7C75]">📄 /README.md (293 строки)</span>
            <span className="font-bold text-[#48121A] flex items-center space-x-1">
              <span>{activeDoc === 'readme' ? 'Свернуть' : 'Открыть полный документ'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDoc === 'readme' ? 'rotate-180' : ''}`} />
            </span>
          </div>
        </button>

        {/* Card 2: ARCHITECTURE.md */}
        <button
          onClick={() => setActiveDoc(activeDoc === 'architecture' ? null : 'architecture')}
          className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-4 group ${
            activeDoc === 'architecture'
              ? 'bg-[#FAF7F2] border-[#48121A] shadow-sm ring-1 ring-[#48121A]'
              : 'bg-[#FAF7F2]/60 border-[#E8E0D7] hover:border-[#48121A]/50 hover:bg-[#FAF7F2]'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border bg-[#161210]/10 text-[#161210] border-[#161210]/20">
                ARCHITECTURE.MD • СПЕЦИФИКАЦИЯ
              </span>
              <Code2 className={`w-4 h-4 transition-colors ${activeDoc === 'architecture' ? 'text-[#48121A]' : 'text-[#8C7C75] group-hover:text-[#48121A]'}`} />
            </div>

            <h4 className="text-base font-bold text-[#161210] group-hover:text-[#48121A] transition-colors flex items-center space-x-2">
              <span>ARCHITECTURE.md — Полная техническая архитектура</span>
            </h4>

            <p className="text-xs text-[#4A3E39] leading-relaxed">
              Детальное описание 5 слоев воронки, 7 Pydantic-контрактов данных, формулы скоринга, стратегия скрапинга и матрица моделей.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E8E0D7] flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-[#8C7C75]">📄 /docs/ARCHITECTURE.md (252 строки)</span>
            <span className="font-bold text-[#48121A] flex items-center space-x-1">
              <span>{activeDoc === 'architecture' ? 'Свернуть' : 'Открыть полную архитектуру'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDoc === 'architecture' ? 'rotate-180' : ''}`} />
            </span>
          </div>
        </button>

      </div>

      {/* Expanded Document Viewer Section */}
      {activeDoc === 'readme' && <ReadmeDocumentViewer />}
      {activeDoc === 'architecture' && <ArchitectureDocumentViewer />}

    </div>
  );
};

/**
 * Rich Visual Reader for README.md
 */
const ReadmeDocumentViewer: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] space-y-8 animate-in fade-in duration-200 text-xs sm:text-sm text-[#161210]">
      
      {/* Doc Header */}
      <div className="pb-4 border-b border-[#E8E0D7] space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-md bg-[#48121A] text-[#FAF7F2] font-mono text-xs font-bold uppercase">
            README.md • FULL TEXT
          </span>
          <span className="text-xs font-mono text-[#8C7C75]">100% Complete Grounded Document</span>
        </div>
        <h3 className="text-2xl font-bold text-[#161210]">LD Latte Influencer Discovery Pipeline</h3>
        <p className="text-xs sm:text-base text-[#4A3E39]">
          Система модульного конвейера обработки данных (<strong>modular AI pipeline, agent-ready</strong>) для автоматизированного поиска, анализа, скоринга и аутрича fashion-блогеров в интересах e-commerce бренда LD Latte.
        </p>
      </div>

      {/* Section 1: Flowchart Diagram Graph */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-[#48121A] font-bold text-base">
          <Workflow className="w-5 h-5" />
          <h4>1. Визуальная схема движения данных (Pipeline High-Level Flow Diagram)</h4>
        </div>

        {/* Visual Graph Nodes */}
        <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
              <span className="font-mono font-bold text-[#48121A] text-[10px]">STAGE 01</span>
              <p className="font-bold text-[#161210]">Seed CSV</p>
              <p className="text-[10px] text-[#8C7C75]">100% Real Data</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
              <span className="font-mono font-bold text-[#48121A] text-[10px]">STAGE 02</span>
              <p className="font-bold text-[#161210]">Ingest & Clean</p>
              <p className="text-[10px] text-[#8C7C75]">19 valid profiles</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
              <span className="font-mono font-bold text-[#48121A] text-[10px]">STAGE 03</span>
              <p className="font-bold text-[#161210]">IG Enrichment</p>
              <p className="text-[10px] text-[#8C7C75]">Instaloader/Playwright</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
              <span className="font-mono font-bold text-[#48121A] text-[10px]">STAGE 04</span>
              <p className="font-bold text-[#161210]">Ideal Portrait</p>
              <p className="text-[10px] text-[#8C7C75]">LLM Synthesis</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
              <span className="font-mono font-bold text-[#48121A] text-[10px]">STAGE 05</span>
              <p className="font-bold text-[#161210]">Discovery</p>
              <p className="text-[10px] text-[#8C7C75]">Rule Filtering</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
              <span className="font-mono font-bold text-[#48121A] text-[10px]">STAGE 06</span>
              <p className="font-bold text-[#161210]">Embeddings</p>
              <p className="text-[10px] text-[#2E6B48] font-bold">Qwen3-0.6B</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
              <span className="font-mono font-bold text-[#48121A] text-[10px]">STAGE 07</span>
              <p className="font-bold text-[#161210]">Feature Scoring</p>
              <p className="text-[10px] text-[#8C7C75]">5-Feature Math</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
              <span className="font-mono font-bold text-[#48121A] text-[10px]">STAGE 08</span>
              <p className="font-bold text-[#161210]">BGE Reranker</p>
              <p className="text-[10px] text-[#2E6B48] font-bold">bge-reranker-v2</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-1">
              <span className="font-mono font-bold text-[#48121A] text-[10px]">STAGE 09</span>
              <p className="font-bold text-[#161210]">VLM Sanity</p>
              <p className="text-[10px] text-[#C27D38] font-bold">Qwen2.5-VL (Top 5)</p>
            </div>
            <div className="p-3 rounded-xl bg-[#48121A] text-[#FAF7F2] space-y-1 col-span-2 sm:col-span-3 lg:col-span-3">
              <span className="font-mono text-[#E8A990] text-[10px]">STAGE 10</span>
              <p className="font-bold">Personalized Offer Generation & Full Site Packaging</p>
              <p className="text-[10px] text-[#D4C4B7]">DeepSeek-V4 + Anti-Robotic QA + React Demo UI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Technology Stack Matrix */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-[#48121A] font-bold text-base">
          <Code2 className="w-5 h-5" />
          <h4>2. Спецификация технологического стека (Technology Stack Matrix)</h4>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E8E0D7] bg-[#FFFFFF]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#161210] text-[#FAF7F2] font-mono text-[11px]">
              <tr>
                <th className="p-3">Слой архитектуры</th>
                <th className="p-3">Основная технология (Primary)</th>
                <th className="p-3">Резервный путь (Fallback)</th>
                <th className="p-3">Назначение и роль</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D7] text-[#4A3E39]">
              <tr>
                <td className="p-3 font-bold text-[#161210]">Scraping Layer</td>
                <td className="p-3 font-mono font-bold text-[#48121A]">Instaloader CLI</td>
                <td className="p-3 text-[#8C7C75]">Playwright + Stealth CDP</td>
                <td className="p-3">Прямой авто-сбор публичных данных профилей и постов</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[#161210]">Text Embeddings</td>
                <td className="p-3 font-mono font-bold text-[#2E6B48]">Qwen3-Embedding-0.6B</td>
                <td className="p-3 text-[#8C7C75]">Qwen3-Embedding-4B</td>
                <td className="p-3">Семантический векторный поиск текстов (CUDA/CPU, $0.00)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[#161210]">Reranker Layer</td>
                <td className="p-3 font-mono font-bold text-[#2E6B48]">BAAI/bge-reranker-v2-m3</td>
                <td className="p-3 text-[#8C7C75]">Jina Reranker</td>
                <td className="p-3">Кросс-энкодер пересортировка кандидатов с нормализацией</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[#161210]">VLM Visual Sanity</td>
                <td className="p-3 font-mono font-bold text-[#C27D38]">Qwen2.5-VL-72B (OpenRouter API)</td>
                <td className="p-3 text-[#8C7C75]">Offline Sandbox Audit</td>
                <td className="p-3">Точечный визуальный аудит 5 фото-финалистов ($0.003)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-[#161210]">Outreach Generation</td>
                <td className="p-3 font-mono font-bold text-[#48121A]">DeepSeek-V4 (OpenRouter / Groq)</td>
                <td className="p-3 text-[#8C7C75]">Llama-3.3-70B</td>
                <td className="p-3">Генерация писем + фильтр Anti-Robotic QA по Pydantic</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Quick Start Code Snippets */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-[#48121A] font-bold text-base">
          <Terminal className="w-5 h-5" />
          <h4>3. Команды быстрой сборки и запуска (Quick Start Guide)</h4>
        </div>

        <div className="p-5 rounded-2xl bg-[#161210] text-[#FAF7F2] font-mono text-xs space-y-4">
          <div>
            <span className="text-[#E8A990] font-bold"># 1. Запуск интерактивного Demo UI веб-сайта (Vite + React)</span>
            <pre className="mt-1 p-3 rounded-lg bg-[#000000]/50 border border-[#FAF7F2]/10 text-[#FAF7F2]">
cd app {"\n"}
npm install {"\n"}
npm run dev
            </pre>
          </div>

          <div>
            <span className="text-[#E8A990] font-bold"># 2. Установка виртуального окружения Python и тестов</span>
            <pre className="mt-1 p-3 rounded-lg bg-[#000000]/50 border border-[#FAF7F2]/10 text-[#FAF7F2]">
python -m venv .venv {"\n"}
.venv\Scripts\Activate.ps1 {"\n"}
pip install -r requirements.txt {"\n"}
python -m pytest tests/ -v
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
};

/**
 * Rich Visual Reader for ARCHITECTURE.md
 */
const ArchitectureDocumentViewer: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border border-[#D4C4B7] space-y-8 animate-in fade-in duration-200 text-xs sm:text-sm text-[#161210]">
      
      {/* Doc Header */}
      <div className="pb-4 border-b border-[#E8E0D7] space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-md bg-[#161210] text-[#FAF7F2] font-mono text-xs font-bold uppercase">
            ARCHITECTURE.md • SPECIFICATION
          </span>
          <span className="text-xs font-mono text-[#8C7C75]">100% Pydantic Guarded Specs</span>
        </div>
        <h3 className="text-2xl font-bold text-[#161210]">Архитектура системы и Pydantic-контракты</h3>
        <p className="text-xs sm:text-base text-[#4A3E39]">
          Детальное техническое описание 5 слоев воронки, структуры Pydantic-схем, детерминированного математического скоринга и стратегии скрапинга для бренда LD Latte.
        </p>
      </div>

      {/* Section 1: Detailed Data-Flow Schema */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-[#48121A] font-bold text-base">
          <Layers className="w-5 h-5" />
          <h4>1. Архитектурная карта слоев обработки данных (Layered Data-Flow)</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#48121A] uppercase bg-[#48121A]/10 px-2 py-0.5 rounded">
              Слой 1 • Ingest & Enrichment
            </span>
            <h5 className="font-bold text-[#161210]">Очистка & Сбор Instagram</h5>
            <p className="text-xs text-[#4A3E39]">
              `src/ingest/clean.py` ➔ `src/fetchers/enrich.py`. Сбор открытых постов и метаданных через Instaloader + Playwright sessionid.
            </p>
            <span className="text-[10px] font-mono text-[#8C7C75]">Файлы: seed_normalized.json ➔ seed_enriched.json</span>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#48121A] uppercase bg-[#48121A]/10 px-2 py-0.5 rounded">
              Слой 2 • Profile Analysis
            </span>
            <h5 className="font-bold text-[#161210]">Синтез идеального портрета</h5>
            <p className="text-xs text-[#4A3E39]">
              `src/analyzers/portrait.py`. Анализ успешных seed-интеграций и выявление общих стилистических признаков бренда.
            </p>
            <span className="text-[10px] font-mono text-[#8C7C75]">Файл: ideal_portrait.json</span>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#48121A] uppercase bg-[#48121A]/10 px-2 py-0.5 rounded">
              Слой 3 • Multi-Layer Scoring
            </span>
            <h5 className="font-bold text-[#161210]">Скоринг & BGE Reranker</h5>
            <p className="text-xs text-[#4A3E39]">
              `src/scoring/embed.py` + `score.py` + `rerank.py`. Qwen3 векторный поиск + 5-фичевый математический скоринг + BGE кросс-энкодер.
            </p>
            <span className="text-[10px] font-mono text-[#8C7C75]">Файлы: candidates_scored.json ➔ candidates_reranked.json</span>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#48121A] uppercase bg-[#48121A]/10 px-2 py-0.5 rounded">
              Слой 4 • Visual Sanity
            </span>
            <h5 className="font-bold text-[#161210]">VLM-аудит эстетики (Qwen2.5-VL)</h5>
            <p className="text-xs text-[#4A3E39]">
              `src/scoring/vlm_sanity.py`. Точечный мультимодальный контроль фото аватарок Top 5 кандидатов шорт-листа.
            </p>
            <span className="text-[10px] font-mono text-[#8C7C75]">Файл: shortlist_final.json ($0.003)</span>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#48121A] uppercase bg-[#48121A]/10 px-2 py-0.5 rounded">
              Слой 5 • Outreach & QA
            </span>
            <h5 className="font-bold text-[#161210]">Генератор писем DeepSeek-V4</h5>
            <p className="text-xs text-[#4A3E39]">
              `src/outreach/generator.py`. Персонализированный офер + валидатор `validate_qa_draft()` против канцелярита.
            </p>
            <span className="text-[10px] font-mono text-[#8C7C75]">Файл: barter_offers.json</span>
          </div>

          <div className="p-4 rounded-xl bg-[#161210] text-[#FAF7F2] space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#E8A990] uppercase bg-[#FAF7F2]/10 px-2 py-0.5 rounded">
              Слой 6 • Demo UI Packaging
            </span>
            <h5 className="font-bold text-[#FAF7F2]">React Demo UI (app/)</h5>
            <p className="text-xs text-[#D4C4B7]">
              Веб-приложение с инспекторами промптов, модалками, фильтрами кандидатов и полной документацией.
            </p>
            <a href="https://ld-latte.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-[#E8A990] hover:underline flex items-center space-x-1">
              <span>Vite + React SPA • Live Demo: ld-latte.vercel.app</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Section 2: Pydantic Data Contracts Explorer */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-[#48121A] font-bold text-base">
          <Database className="w-5 h-5" />
          <h4>2. Основные Pydantic-контракты данных (`src/shared/models.py`)</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-2">
            <div className="flex justify-between text-[#48121A] font-bold">
              <span>class SeedProfile(BaseModel):</span>
              <span className="text-[10px] bg-[#48121A]/10 px-2 py-0.5 rounded">TICKET-01</span>
            </div>
            <ul className="space-y-1 text-[#4A3E39] text-[11px]">
              <li><strong className="text-[#161210]">username:</strong> str</li>
              <li><strong className="text-[#161210]">raw_url:</strong> str</li>
              <li><strong className="text-[#161210]">is_valid:</strong> bool</li>
              <li><strong className="text-[#161210]">error_message:</strong> Optional[str]</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-2">
            <div className="flex justify-between text-[#48121A] font-bold">
              <span>class CandidateRerankResult(BaseModel):</span>
              <span className="text-[10px] bg-[#48121A]/10 px-2 py-0.5 rounded">TICKET-08</span>
            </div>
            <ul className="space-y-1 text-[#4A3E39] text-[11px]">
              <li><strong className="text-[#161210]">username:</strong> str</li>
              <li><strong className="text-[#161210]">semantic_similarity:</strong> float</li>
              <li><strong className="text-[#161210]">features_score:</strong> float</li>
              <li><strong className="text-[#161210]">cross_encoder_score:</strong> float</li>
              <li><strong className="text-[#161210]">composite_score:</strong> float</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-2">
            <div className="flex justify-between text-[#48121A] font-bold">
              <span>class FinalShortlistEntry(BaseModel):</span>
              <span className="text-[10px] bg-[#48121A]/10 px-2 py-0.5 rounded">TICKET-08 VLM</span>
            </div>
            <ul className="space-y-1 text-[#4A3E39] text-[11px]">
              <li><strong className="text-[#161210]">username:</strong> str</li>
              <li><strong className="text-[#161210]">vlm_sanity_passed:</strong> bool</li>
              <li><strong className="text-[#161210]">vlm_aesthetic_notes:</strong> str</li>
              <li><strong className="text-[#161210]">grounding_facts:</strong> List[str]</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E0D7] space-y-2">
            <div className="flex justify-between text-[#48121A] font-bold">
              <span>class OutreachDraft(BaseModel):</span>
              <span className="text-[10px] bg-[#48121A]/10 px-2 py-0.5 rounded">TICKET-09 QA</span>
            </div>
            <ul className="space-y-1 text-[#4A3E39] text-[11px]">
              <li><strong className="text-[#161210]">username:</strong> str</li>
              <li><strong className="text-[#161210]">subject:</strong> str</li>
              <li><strong className="text-[#161210]">body:</strong> str</li>
              <li><strong className="text-[#161210]">grounding_facts:</strong> List[str]</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};


