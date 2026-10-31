import React, { useState } from 'react';
import { X, BookOpen, Clock, Award, ChevronRight } from 'lucide-react';

export default function QuestionPaperModal({
  isOpen,
  onClose,
  questions = [],
  sections = [],
  onNavigateToQuestion,
  language = 'en'
}) {
  const [activeSectionId, setActiveSectionId] = useState(() => sections[0]?.id || 'gs');
  const [lang, setLang] = useState(language);

  if (!isOpen) return null;

  const currentSection = sections.find(s => s.id === activeSectionId) || sections[0];
  const sectionQuestions = questions.slice(
    currentSection?.startIndex || 0,
    (currentSection?.endIndex || 24) + 1
  );

  const isHindi = lang === 'hi';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-300 my-6 flex flex-col max-h-[90vh]">
        {/* Testbook Style Header */}
        <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#00a389] flex items-center justify-center text-white font-black text-sm shadow">
              TP
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-extrabold tracking-tight">Question Paper Overview</h2>
                <span className="bg-[#00a389]/20 text-[#00a389] border border-[#00a389]/40 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Testbook CBT Mode
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Read all questions across sections • Click any question to navigate directly
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded border border-slate-700 text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded font-bold transition ${
                  !isHindi ? 'bg-[#00a389] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded font-bold transition ${
                  isHindi ? 'bg-[#00a389] text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Question Paper"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center space-x-2 overflow-x-auto">
          {sections.map((sec) => {
            const isActive = sec.id === activeSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#00a389] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{sec.shortTitle}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {sec.totalQuestions} Qs
                </span>
              </button>
            );
          })}
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {sectionQuestions.map((q) => {
            const qText = (isHindi && q.question_text_hi) ? q.question_text_hi : q.question_text;
            const opts = (isHindi && q.options_hi) ? q.options_hi : q.options;

            return (
              <div
                key={q.question_number}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs hover:border-[#00a389] transition"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-extrabold text-xs text-[#00a389] bg-[#00a389]/10 px-2 py-0.5 rounded">
                    Question No. {q.question_number}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Marks: +{currentSection?.positiveMarks || 1.0} / -{currentSection?.negativeMarks || 0.33}
                    </span>
                    {onNavigateToQuestion && (
                      <button
                        onClick={() => {
                          onNavigateToQuestion(q.question_number);
                          onClose();
                        }}
                        className="text-[11px] font-bold text-[#00a389] hover:underline flex items-center space-x-0.5 ml-2"
                      >
                        <span>Go to Question</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-slate-800 text-sm font-medium mb-3 whitespace-pre-line leading-relaxed">
                  {qText}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {['a', 'b', 'c', 'd'].map((key) => {
                    const optText = opts?.[key];
                    if (!optText) return null;
                    return (
                      <div key={key} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start space-x-2">
                        <span className="font-bold uppercase text-slate-600 w-4 shrink-0">({key.toUpperCase()})</span>
                        <span className="text-slate-700 flex-1">{optText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing {sectionQuestions.length} Questions in <strong>{currentSection?.title}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#00a389] hover:bg-[#008f78] text-white text-xs font-bold rounded-lg shadow-xs transition"
          >
            Back to Test
          </button>
        </div>
      </div>
    </div>
  );
}
