import React from 'react';
import { BookmarkCheck, RotateCcw, ChevronRight, ChevronLeft, Clock, Send, ShieldAlert } from 'lucide-react';

export const OPTION_KEYS = ['a', 'b', 'c', 'd'];

export default function QuestionArea({
  currentQuestion,
  currentSection,
  selectedOption,
  onSelectOption,
  onSaveAndNext,
  onMarkForReviewAndNext,
  onClearResponse,
  onPreviousQuestion,
  onSubmitSectionEarly,
  hasNext,
  hasPrevious,
  language,
  setLanguage,
  activeQuestionNumber,
  questionTimeSpentSeconds = 0
}) {
  if (!currentQuestion) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <p className="text-gray-500 font-medium">No question selected.</p>
      </div>
    );
  }

  // Format time mm:ss
  const formatTimeSpent = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isHindi = language === 'hi';
  const questionText = (isHindi && currentQuestion.question_text_hi) 
    ? currentQuestion.question_text_hi 
    : currentQuestion.question_text;

  const currentOptions = (isHindi && currentQuestion.options_hi)
    ? currentQuestion.options_hi
    : currentQuestion.options;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden shadow-xs">
      {/* Question Header Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#f8fafc] border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="text-xs sm:text-sm font-bold text-[#1b4d89] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Question No. {activeQuestionNumber}
          </span>
          <span className="text-xs font-semibold text-gray-600 hidden sm:inline">
            Section: <strong className="text-gray-900">{currentSection?.shortTitle}</strong>
          </span>
        </div>

        {/* Right Info: Live Per-Question Time Spent & Marks Scheme */}
        <div className="flex items-center space-x-2.5">
          {/* Question Active Time Spent */}
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold" title="Time recorded on this question">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-sans text-amber-700 font-medium hidden sm:inline">Time:</span>
            <span>{formatTimeSpent(questionTimeSpentSeconds)}</span>
          </div>

          {/* Marks Scheme badge */}
          <div className="flex items-center text-xs font-bold border border-gray-300 rounded px-2.5 py-1 bg-white shadow-2xs">
            <span className="text-emerald-600 mr-1.5">
              +{Number(currentSection?.positiveMarks || 2).toFixed(2)}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-rose-600 ml-1.5">
              -{Number(currentSection?.negativeMarks || 0.5).toFixed(2)}
            </span>
          </div>

          {/* Quick Language switch */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-200 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded font-medium transition ${
                !isHindi ? 'bg-white text-blue-800 shadow-2xs font-bold' : 'text-gray-600 hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded font-medium transition ${
                isHindi ? 'bg-white text-blue-800 shadow-2xs font-bold' : 'text-gray-600 hover:text-black'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Question Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-7 select-text">
        {/* Chapter / Topic Tag if available */}
        {currentQuestion.chapter_name && (
          <div className="mb-3">
            <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Topic: {currentQuestion.chapter_name}
            </span>
          </div>
        )}

        {/* Question Text */}
        <div className="mb-6">
          <div className="text-gray-900 text-sm sm:text-base font-medium leading-relaxed whitespace-pre-line tracking-wide">
            {questionText}
          </div>
        </div>

        {/* Option Selection List (A, B, C, D) */}
        <div className="space-y-3 max-w-3xl">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Select one option:
          </div>
          {OPTION_KEYS.map((optKey) => {
            const optValue = currentOptions ? currentOptions[optKey] : null;
            if (!optValue) return null;

            const isSelected = selectedOption === optKey;

            return (
              <div
                key={optKey}
                onClick={() => onSelectOption(optKey)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onSelectOption(optKey);
                  }
                }}
                className={`flex items-start p-3 sm:p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#00a389]/10 border-[#00a389] shadow-xs text-gray-900 font-medium ring-1 ring-[#00a389]/40'
                    : 'bg-white border-gray-200 hover:bg-slate-50 hover:border-gray-300 text-gray-800'
                }`}
              >
                {/* Radio Indicator */}
                <div className="flex items-center h-5 mr-3 mt-0.5 shrink-0">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? 'border-[#00a389] bg-[#00a389]' : 'border-gray-400 bg-white'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>

                {/* Option Badge (A, B, C, D) */}
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-3 shrink-0 ${
                  isSelected
                    ? 'bg-[#00a389] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                }`}>
                  {optKey.toUpperCase()}
                </div>

                {/* Option Text */}
                <div className="text-sm leading-relaxed pt-0.5 whitespace-pre-line flex-1">
                  {optValue}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Action Controls (TCS iON Bottom Bar) */}
      <div className="bg-[#e9ecef] border-t border-gray-300 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-inner select-none">
        {/* Left Side Controls */}
        <div className="flex items-center space-x-2">
          {/* Mark for Review & Next */}
          <button
            onClick={onMarkForReviewAndNext}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-[#6b21a8] hover:bg-[#581c87] active:bg-[#4a1572] rounded shadow-xs transition border border-[#581c87]"
            id="btn-mark-review"
            title="Mark this question for review and proceed to next"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Mark for Review & Next</span>
          </button>

          {/* Clear Response */}
          <button
            onClick={onClearResponse}
            disabled={!selectedOption}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded shadow-2xs transition border ${
              selectedOption
                ? 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100 active:bg-gray-200 cursor-pointer'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            id="btn-clear-response"
            title="Clear the selected response for this question"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Response</span>
          </button>
        </div>

        {/* Right Side Navigation & Save Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Question Button */}
          <button
            onClick={onPreviousQuestion}
            disabled={!hasPrevious}
            className={`flex items-center space-x-1 px-3 py-2 text-xs sm:text-sm font-semibold rounded border transition ${
              hasPrevious
                ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            }`}
            id="btn-prev-question"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Save & Next (Prominent Testbook Primary Button) */}
          <button
            onClick={onSaveAndNext}
            className="flex items-center space-x-2 px-5 py-2 text-xs sm:text-sm font-extrabold text-white bg-[#00a389] hover:bg-[#008f78] active:bg-[#007b67] rounded-lg shadow-sm transition border border-[#008f78] cursor-pointer"
            id="btn-save-next"
            title="Save selected response and proceed to next"
          >
            <span>Save &amp; Next</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Early Submit Section Button */}
          <button
            onClick={onSubmitSectionEarly}
            className="flex items-center space-x-1 px-2.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition ml-1"
            title="Submit this section early and lock it"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden xl:inline">Submit Section</span>
          </button>
        </div>
      </div>
    </div>
  );
}
