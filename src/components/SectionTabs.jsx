import React, { useState } from 'react';
import { Info, Lock, CheckCircle, Clock } from 'lucide-react';
import { SECTIONS } from '../data/questions';

export default function SectionTabs({
  sections = SECTIONS,
  activeSectionId,
  completedSections = [],
  onSelectSection,
  onOpenSectionInfo,
  questionStatuses,
  questions
}) {
  const [lockedTooltip, setLockedTooltip] = useState(null);

  const handleTabClick = (section) => {
    const isCompleted = completedSections.includes(section.id);
    const isCurrent = activeSectionId === section.id;

    if (isCompleted) {
      setLockedTooltip(`"${section.shortTitle}" has already been submitted and cannot be revisited.`);
      setTimeout(() => setLockedTooltip(null), 3000);
      return;
    }

    if (!isCurrent) {
      setLockedTooltip(`"${section.shortTitle}" is locked! You cannot access it until the current section's time is over.`);
      setTimeout(() => setLockedTooltip(null), 3000);
      return;
    }

    onSelectSection(section.id);
  };

  return (
    <div className="bg-white border-b border-gray-300 shadow-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 select-none relative">
      {/* Toast Tooltip when user clicks a locked section */}
      {lockedTooltip && (
        <div className="absolute top-12 left-4 z-30 bg-gray-900/95 text-white text-xs px-3 py-1.5 rounded-md shadow-lg flex items-center space-x-2 border border-gray-700 animate-fade-in">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{lockedTooltip}</span>
        </div>
      )}

      <div className="flex items-center space-x-1.5 overflow-x-auto min-w-max">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pr-1 hidden sm:inline">
          Sections:
        </span>
        {(sections || SECTIONS).map((section) => {
          const isCurrent = activeSectionId === section.id;
          const isCompleted = completedSections.includes(section.id);
          const isLocked = !isCurrent && !isCompleted;

          // Answered count in this section
          const sectionQuestions = questions.slice(section.startIndex, section.endIndex + 1);
          const answeredCount = sectionQuestions.filter(
            (q) => questionStatuses[q.question_number]?.status === 'ANSWERED' ||
                   questionStatuses[q.question_number]?.status === 'ANSWERED_AND_MARKED'
          ).length;

          let tabStyle = "";
          let icon = null;

          if (isCurrent) {
            tabStyle = "bg-[#1b4d89] text-white border-[#1b4d89] shadow-sm font-bold ring-1 ring-[#1b4d89]";
            icon = <Clock className="w-3 h-3 text-amber-300" />;
          } else if (isCompleted) {
            tabStyle = "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed opacity-80";
            icon = <CheckCircle className="w-3 h-3 text-emerald-600" />;
          } else {
            // Locked section
            tabStyle = "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-75";
            icon = <Lock className="w-3 h-3 text-gray-400" />;
          }

          return (
            <button
              key={section.id}
              onClick={() => handleTabClick(section)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs transition-all border ${tabStyle}`}
              title={
                isCurrent 
                  ? `${section.title} (Active Section)`
                  : isCompleted 
                    ? `${section.title} (Submitted)` 
                    : `${section.title} (Locked until current section time is over)`
              }
            >
              {icon}
              <span>{section.shortTitle}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isCurrent
                    ? 'bg-blue-300/30 text-white'
                    : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? 'Done' : `${answeredCount}/${section.totalQuestions}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Info Icon */}
      <button
        onClick={onOpenSectionInfo}
        title="View Sectional Marking Scheme & Instructions"
        className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-[#1b4d89] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition shrink-0 ml-2"
        id="section-info-btn"
      >
        <Info className="w-3.5 h-3.5 text-[#1b4d89]" />
        <span className="hidden sm:inline">Marking Scheme (15 Min / Sec)</span>
      </button>
    </div>
  );
}
