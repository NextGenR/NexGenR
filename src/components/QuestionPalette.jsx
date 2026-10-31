import React from 'react';
import { Check, Clock, Send, Lock, ShieldAlert } from 'lucide-react';
import { STATUS } from '../data/questions';

export default function QuestionPalette({
  questions,
  currentSection,
  activeQuestionNumber,
  questionStatuses,
  onNavigateToQuestion,
  onSubmitTest,
  onSubmitSectionEarly,
  sectionTimeLeft = 900,
  candidate,
  isLastSection = false,
  onOpenQuestionPaper
}) {
  // STRICT SECTION LOCKING: Only get questions belonging to current section (1 to 25)
  const sectionQuestions = questions.slice(
    currentSection?.startIndex || 0,
    (currentSection?.endIndex || 24) + 1
  );

  // Format section time mm:ss
  const mins = Math.floor(Math.max(0, sectionTimeLeft) / 60);
  const secs = Math.max(0, sectionTimeLeft) % 60;
  const sectionTimeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Section level counts
  const counts = {
    answered: 0,
    notAnswered: 0,
    notVisited: 0,
    marked: 0,
    markedAnswered: 0,
  };

  sectionQuestions.forEach((q) => {
    const s = questionStatuses[q.question_number]?.status;
    if (s === STATUS.ANSWERED) counts.answered++;
    else if (s === STATUS.NOT_ANSWERED) counts.notAnswered++;
    else if (s === STATUS.MARKED_FOR_REVIEW) counts.marked++;
    else if (s === STATUS.ANSWERED_AND_MARKED) counts.markedAnswered++;
    else counts.notVisited++;
  });

  return (
    <aside className="w-full h-full flex flex-col bg-[#f0f4f8] border-l border-gray-300 select-none">
      {/* Candidate Mini Profile */}
      <div className="bg-white p-3 border-b border-gray-300 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-600 overflow-hidden flex items-center justify-center shrink-0">
            {candidate?.photoUrl ? (
              <img src={candidate.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs">
                {candidate?.name ? candidate.name.split(' ').map(n => n[0]).join('') : 'CD'}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-gray-900 truncate uppercase">
              {candidate?.name || 'CANDIDATE NAME'}
            </div>
            <div className="text-[11px] text-gray-600 truncate">
              Roll: <span className="font-semibold text-gray-800">{candidate?.rollNo || '2201048291'}</span>
            </div>
          </div>
        </div>

        {/* Section Countdown Badge */}
        <div className="text-right shrink-0 bg-blue-50 border border-blue-200 px-2 py-1 rounded">
          <span className="text-[9px] uppercase font-bold text-blue-700 block leading-none">Sec Time</span>
          <span className="text-xs font-mono font-bold text-blue-900">{sectionTimeFormatted}</span>
        </div>
      </div>

      {/* TCS iON Legend Counters Box for Current Section */}
      <div className="bg-white p-3 border-b border-gray-300 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
            {currentSection?.shortTitle} Status
          </span>
          <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">
            {currentSection?.totalQuestions || sectionQuestions.length} Qs
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
          {/* Answered */}
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded bg-[#28a745] text-white font-bold flex items-center justify-center text-[10px] shrink-0 shadow-2xs">
              {counts.answered}
            </div>
            <span className="text-gray-700 leading-tight">Answered</span>
          </div>

          {/* Not Answered */}
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded bg-[#e34f40] text-white font-bold flex items-center justify-center text-[10px] shrink-0 shadow-2xs">
              {counts.notAnswered}
            </div>
            <span className="text-gray-700 leading-tight">Not Answered</span>
          </div>

          {/* Not Visited */}
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded bg-white text-gray-700 border border-gray-400 font-bold flex items-center justify-center text-[10px] shrink-0 shadow-2xs">
              {counts.notVisited}
            </div>
            <span className="text-gray-700 leading-tight">Not Visited</span>
          </div>

          {/* Marked for Review */}
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center text-[10px] shrink-0 shadow-2xs">
              {counts.marked}
            </div>
            <span className="text-gray-700 leading-tight">Marked Review</span>
          </div>

          {/* Answered & Marked for Review */}
          <div className="flex items-center space-x-1.5 col-span-2 pt-1 border-t border-gray-100">
            <div className="relative w-5 h-5 rounded-full bg-[#7c3aed] text-white font-bold flex items-center justify-center text-[10px] shrink-0 shadow-2xs">
              <span>{counts.markedAnswered}</span>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white flex items-center justify-center">
                <Check className="w-2 h-2 text-white stroke-[3]" />
              </div>
            </div>
            <span className="text-gray-700 leading-tight text-[10px]">
              Answered &amp; Marked for Review <span className="text-gray-500">(Evaluated)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Section Sub-heading Notice */}
      <div className="bg-[#e2e8f0] px-3 py-1.5 border-b border-gray-300 flex items-center justify-between text-xs font-bold text-gray-700">
        <span className="truncate">{currentSection?.shortTitle}</span>
        <span className="text-[10px] text-gray-500 flex items-center">
          <Lock className="w-3 h-3 mr-1 text-gray-400" /> Other sections locked
        </span>
      </div>

      {/* Question Number Palette Grid (Restricted strictly to 25 questions of this section) */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-5 gap-2">
          {sectionQuestions.map((q, idx) => {
            const qNum = q.question_number;
            const relativeQNum = idx + 1; // 1 to 25 within the section
            const status = questionStatuses[qNum]?.status || STATUS.NOT_VISITED;
            const isActive = qNum === activeQuestionNumber;

            let btnClass = "";
            let showGreenTick = false;

            switch (status) {
              case STATUS.ANSWERED:
                btnClass = "bg-[#28a745] hover:bg-[#218838] text-white font-bold rounded shadow-2xs";
                break;
              case STATUS.NOT_ANSWERED:
                btnClass = "bg-[#e34f40] hover:bg-[#d32f2f] text-white font-bold rounded shadow-2xs";
                break;
              case STATUS.MARKED_FOR_REVIEW:
                btnClass = "bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-full shadow-2xs";
                break;
              case STATUS.ANSWERED_AND_MARKED:
                btnClass = "bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-full shadow-2xs";
                showGreenTick = true;
                break;
              case STATUS.NOT_VISITED:
              default:
                btnClass = "bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-semibold rounded shadow-2xs";
                break;
            }

            return (
              <button
                key={qNum}
                onClick={() => onNavigateToQuestion(qNum)}
                className={`relative h-9 flex items-center justify-center text-xs transition-all transform active:scale-95 ${btnClass} ${
                  isActive ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white font-black scale-105 z-10' : ''
                }`}
                title={`Question ${qNum} (Section Q.${relativeQNum}): ${status.replace(/_/g, ' ')}`}
                id={`palette-btn-${qNum}`}
              >
                <span>{qNum}</span>
                {showGreenTick && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white flex items-center justify-center">
                    <Check className="w-2 h-2 text-white stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Palette Bottom: Question Paper & Submit Buttons (Testbook Style) */}
      <div className="p-3 bg-white border-t border-gray-300 space-y-2">
        {onOpenQuestionPaper && (
          <button
            onClick={onOpenQuestionPaper}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition cursor-pointer"
            id="btn-palette-question-paper"
            title="Read all 100 questions in question paper mode"
          >
            <span>📑 Question Paper</span>
          </button>
        )}
        {isLastSection ? (
          <button
            onClick={onSubmitTest}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#00a389] hover:bg-[#008f78] active:bg-[#007b67] text-white text-xs font-black rounded-lg shadow transition tracking-wide uppercase cursor-pointer"
            id="btn-submit-test"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Full Test</span>
          </button>
        ) : (
          <button
            onClick={onSubmitSectionEarly}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs font-bold rounded-lg shadow transition cursor-pointer"
            id="btn-submit-section"
            title="Complete this section and proceed to next"
          >
            <span>Submit Section &amp; Next</span>
          </button>
        )}
      </div>
    </aside>
  );
}
