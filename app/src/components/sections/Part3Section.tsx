import React from 'react';
import { 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  ExternalLink, 
  Github, 
  FileText, 
  CheckCircle2,
  Workflow
} from 'lucide-react';
import { GROUNDED_AUTHOR_RESUME, GROUNDED_PROOF_LINKS } from '@/data';

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
            Резюме разработчика <br />
            <span className="font-[#Playfair Display] italic font-normal text-[#48121A]">
              & портфолио прошлых проектов
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#4A3E39] leading-relaxed">
            Подробная информация о квалификации, образовании, стеке и реальных инженерных системах, созданных автором.
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
                <p className="text-xs font-mono text-[#48121A]">{author.targetRoles.join(' • ')}</p>
                <p className="text-xs text-[#8C7C75] mt-0.5">{author.location} ({author.workFormat})</p>
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
              <p className="font-bold text-[#161210]">{author.education[0]?.institution}</p>
              <p className="text-[#4A3E39]">{author.education[0]?.degree} ({author.education[0]?.period})</p>
              <p className="text-[#8C7C75] pt-1 border-t border-[#E8E0D7]">{author.education[0]?.details}</p>
            </div>

            {/* Core Tech Stack */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-2">
              <div className="flex items-center space-x-2 text-[#48121A] font-bold">
                <Code2 className="w-4 h-4" />
                <span>Ключевой Инженерный Стек</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[...author.technicalStack.languages, ...author.technicalStack.backendApi, ...author.technicalStack.aiMlData].map((skill: string) => (
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
              <h3 className="text-lg font-bold text-[#161210]">Ключевые инженерные кейсы</h3>
            </div>
            <span className="text-xs text-[#8C7C75]">Production Proven Systems</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {author.keyCaseStudies.map((project) => (
              <div key={project.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D7] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[#48121A] bg-[#48121A]/15 px-2 py-0.5 rounded">
                    {project.role}
                  </span>
                  <h4 className="text-sm font-bold text-[#161210]">{project.title}</h4>
                  <p className="text-xs text-[#8C7C75] leading-relaxed">{project.description}</p>
                </div>

                <div className="pt-3 border-t border-[#E8E0D7] space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs text-[#2E6B48] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{project.results[0]}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.stack.map((tech: string) => (
                      <span key={tech} className="text-[9px] font-mono bg-[#FFFFFF] text-[#4A3E39] px-1.5 py-0.5 rounded border border-[#E8E0D7]">
                        {tech}
                      </span>
                    ))}
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

        {/* 3.4 Proof Docs Navigator */}
        <div id="p3-evidence" className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D4C4B7] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E0D7]">
            <div>
              <span className="text-xs font-bold text-[#48121A] uppercase tracking-wider">3.4 Доказательный слой</span>
              <h3 className="text-lg font-bold text-[#161210]">Навигатор по файлам и артефактам проекта</h3>
            </div>
            <span className="text-xs font-mono text-[#2E6B48]">All Artifacts Grounded</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {GROUNDED_PROOF_LINKS.map((link) => (
              <a
                key={link.id}
                href={`https://github.com/Nek1yZakhar/LD-LATTE/blob/main/${link.filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E0D7] hover:border-[#48121A] transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#161210] group-hover:text-[#48121A] transition-colors">{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8C7C75] group-hover:text-[#48121A]" />
                </div>
                <p className="text-[11px] text-[#8C7C75]">{link.description}</p>
                <p className="text-[10px] font-mono text-[#48121A] pt-1">{link.filePath}</p>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
