import React from 'react';
import { History, Play, RotateCcw, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { SECTIONS } from '../data/questions';

export default function ResumeModal({
  isOpen,
  attemptData,
  onResume,
  onStartFresh
}) {
  if (!isOpen || !attemptData) return null;

  const currentSection = SECTIONS.find(s => s.id === attemptData.current_section_id) || SECTIONS[0];
  const sectionTimeLeft = attemptData.sectional_time_left?.[attemptData.current_section_id] ?? 900;
  
  const mins = Math.floor(sectionTimeLeft / 60);
  const secs = sectionTimeLeft % 60;
  const timeFormatted = `${mins}m ${secs}s`;

  // Count answered questions from question_states
  const states = attemptData.question_states || {};
  let answeredCount = 0;
  Object.values(states).forEach((q) => {
    if (q.status === 'ANSWERED' || q.status === 'ANSWERED_AND_MARKED') {
      answeredCount++;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b4d89] to-[#0e2b4f] text-white px-5 py-4 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <History className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-snug">Resume In-Progress Exam</h3>
            <p className="text-xs text-blue-200">Previous session detected in Supabase / Local Storage</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg text-blue-900 space-y-2">
            <div className="font-bold text-sm text-[#1b4d89] flex items-center justify-between">
              <span>{attemptData.test_title || 'SSC CGL Tier 1 Mock Test 3'}</span>
              <span className="text-[11px] bg-blue-200/80 px-2 py-0.5 rounded font-mono text-blue-900">
                In-Progress
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-gray-700">
              <div>
                <span className="text-gray-500 block">Candidate:</span>
                <span className="font-bold text-gray-900">{attemptData.candidate_name || 'ANKIT MEWADA'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Roll Number:</span>
                <span className="font-bold text-gray-900">{attemptData.roll_number || '2201048291'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Active Section:</span>
                <span className="font-bold text-[#1b4d89]">{currentSection.shortTitle}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Section Time Left:</span>
                <span className="font-bold text-amber-700 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {timeFormatted}
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-blue-100 flex justify-between">
                <span>Progress: <strong className="text-emerald-700">{answeredCount} of 100 Answered</strong></span>
                <span className="text-gray-500">Last saved: {new Date(attemptData.updated_at || Date.now()).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-xs">
            Would you like to resume this attempt exactly where you left off, or discard it to start a fresh attempt?
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3.5 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={onStartFresh}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-300 rounded transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Discard &amp; Start Fresh</span>
          </button>
          <button
            onClick={onResume}
            className="flex items-center space-x-2 px-5 py-2 text-xs font-bold text-white bg-[#107c41] hover:bg-[#0b6333] active:bg-[#084e27] rounded shadow transition tracking-wide"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume Past Attempt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
