import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, Clock, RotateCcw, Eye, Database, BarChart2 } from 'lucide-react';
import { SECTIONS, STATUS } from '../data/questions';

export default function ResultModal({
  isOpen,
  onRestart,
  questions,
  questionStatuses,
  timeTakenSeconds = 0,
  attemptId = null,
  isSupabaseConfigured = false,
  sections = SECTIONS,
  positiveMarks = 2.0,
  negativeMarks = 0.5,
  totalMarks = 200
}) {
  const currentSections = sections || SECTIONS;
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'solutions' | 'timing'
  const [solutionSection, setSolutionSection] = useState(() => currentSections[0]?.id || 'gi');

  if (!isOpen) return null;

  // Compute evaluation
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let totalScore = 0;

  questions.forEach((q) => {
    const userStatus = questionStatuses[q.question_number]?.status;
    const userAns = questionStatuses[q.question_number]?.selectedOption;

    const isAttempted = userStatus === STATUS.ANSWERED || userStatus === STATUS.ANSWERED_AND_MARKED;

    if (isAttempted && userAns) {
      if (userAns.toLowerCase() === (q.correct_option || '').toLowerCase()) {
        correctCount++;
        totalScore += positiveMarks;
      } else {
        incorrectCount++;
        totalScore -= negativeMarks;
      }
    } else {
      unattemptedCount++;
    }
  });

  const accuracy = (correctCount + incorrectCount > 0)
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
    : 0;

  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;
  const timeFormatted = `${mins}m ${secs}s`;

  // Format question seconds
  const formatSec = (s) => {
    if (!s) return '0s';
    const m = Math.floor(s / 60);
    const remainder = s % 60;
    if (m === 0) return `${remainder}s`;
    return `${m}m ${remainder}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-200 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b4d89] to-[#0e2b4f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Award className="w-7 h-7 text-yellow-400" />
            <div>
              <h2 className="text-lg font-bold">SSC CGL Tier 1 Mock Test 3 - Performance Report</h2>
              <div className="flex items-center space-x-2 text-xs text-blue-200">
                <span>Official SSC Marking (+2.00 / -0.50)</span>
                {attemptId && (
                  <>
                    <span>•</span>
                    <span className="flex items-center font-mono">
                      <Database className="w-3 h-3 mr-1 text-emerald-400" /> ID: {attemptId.slice(0, 8)}...
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onRestart}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs font-semibold text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Test</span>
          </button>
        </div>

        {/* Tab switch */}
        <div className="bg-gray-100 border-b border-gray-300 px-6 flex space-x-4">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'summary' ? 'border-[#1b4d89] text-[#1b4d89]' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Scorecard &amp; Analysis
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'solutions' ? 'border-[#1b4d89] text-[#1b4d89]' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Detailed Solutions</span>
          </button>
          <button
            onClick={() => setActiveTab('timing')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'timing' ? 'border-[#1b4d89] text-[#1b4d89]' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Question Timing Analysis</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Scorecard Hero Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center shadow-xs">
                  <div className="text-xs font-bold text-blue-700 uppercase">Total Score</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1b4d89] mt-1">
                    {totalScore.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">out of {Number(totalMarks).toFixed(2)}</div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center shadow-xs">
                  <div className="text-xs font-bold text-emerald-700 uppercase">Correct</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
                    {correctCount}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">+{(correctCount * 2).toFixed(1)} marks</div>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg text-center shadow-xs">
                  <div className="text-xs font-bold text-rose-700 uppercase">Incorrect</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
                    {incorrectCount}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">-{(incorrectCount * 0.5).toFixed(1)} penalty</div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-center shadow-xs">
                  <div className="text-xs font-bold text-amber-700 uppercase">Accuracy</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
                    {accuracy}%
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{timeFormatted} elapsed</div>
                </div>
              </div>

              {/* Section-Wise Scorecard Breakdown */}
              <div className="border border-gray-300 rounded-lg overflow-hidden shadow-xs">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-300 font-bold text-xs text-gray-700 uppercase tracking-wider">
                  Section-wise Performance Breakdown (15 Min / Section)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                        <th className="p-3">Section</th>
                        <th className="p-3 text-center">Attempted</th>
                        <th className="p-3 text-center text-green-700">Correct</th>
                        <th className="p-3 text-center text-red-600">Incorrect</th>
                        <th className="p-3 text-center">Unattempted</th>
                        <th className="p-3 text-center text-[#1b4d89] font-bold">Marks Scored</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentSections.map((sec) => {
                        const secQuestions = questions.slice(sec.startIndex, sec.endIndex + 1);
                        let sCorrect = 0;
                        let sIncorrect = 0;
                        let sUnattempted = 0;

                        secQuestions.forEach((q) => {
                          const status = questionStatuses[q.question_number]?.status;
                          const ans = questionStatuses[q.question_number]?.selectedOption;
                          const isAttempted = status === STATUS.ANSWERED || status === STATUS.ANSWERED_AND_MARKED;

                          if (isAttempted && ans) {
                            if (ans.toLowerCase() === (q.correct_option || '').toLowerCase()) sCorrect++;
                            else sIncorrect++;
                          } else {
                            sUnattempted++;
                          }
                        });

                        const sMarks = (sCorrect * positiveMarks) - (sIncorrect * negativeMarks);

                        return (
                          <tr key={sec.id} className="hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">{sec.title}</td>
                            <td className="p-3 text-center font-medium">{sCorrect + sIncorrect} / {sec.totalQuestions}</td>
                            <td className="p-3 text-center font-bold text-emerald-600">{sCorrect}</td>
                            <td className="p-3 text-center font-bold text-rose-600">{sIncorrect}</td>
                            <td className="p-3 text-center text-gray-500">{sUnattempted}</td>
                            <td className="p-3 text-center font-bold text-[#1b4d89]">{sMarks.toFixed(2)} / 50</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'solutions' && (
            <div className="space-y-4">
              <div className="flex space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
                {currentSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSolutionSection(s.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded transition ${
                      solutionSection === s.id ? 'bg-[#1b4d89] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s.shortTitle}
                  </button>
                ))}
              </div>

              {(() => {
                const targetSec = currentSections.find(s => s.id === solutionSection) || currentSections[0];
                const secQuestions = questions.slice(targetSec.startIndex, targetSec.endIndex + 1);

                return (
                  <div className="space-y-4">
                    {secQuestions.map((q) => {
                      const userAns = questionStatuses[q.question_number]?.selectedOption;
                      const correctAns = (q.correct_option || '').toLowerCase();
                      const isCorrect = userAns && userAns.toLowerCase() === correctAns;
                      const isUnattempted = !userAns;
                      const timeSpent = questionStatuses[q.question_number]?.timeSpentSeconds || 0;

                      return (
                        <div key={q.question_number} className="p-4 border rounded-lg bg-gray-50/50 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                                Q.{q.question_number}
                              </span>
                              <span className="text-gray-500 font-mono text-[11px] flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> Time: {formatSec(timeSpent)}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              isCorrect ? 'bg-green-100 text-green-800' :
                              isUnattempted ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-800'
                            }`}>
                              {isCorrect ? 'Correct (+2)' : isUnattempted ? 'Unattempted (0)' : 'Incorrect (-0.5)'}
                            </span>
                          </div>

                          <div className="text-xs sm:text-sm font-medium text-gray-900 whitespace-pre-line">
                            {q.question_text}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {['a', 'b', 'c', 'd'].map((key) => {
                              const isThisCorrect = key === correctAns;
                              const isThisUser = userAns === key;

                              let badgeStyle = "bg-white border-gray-200 text-gray-800";
                              if (isThisCorrect) badgeStyle = "bg-green-50 border-green-500 text-green-900 font-bold";
                              else if (isThisUser) badgeStyle = "bg-red-50 border-red-500 text-red-900";

                              return (
                                <div key={key} className={`p-2 rounded border flex items-center space-x-2 ${badgeStyle}`}>
                                  <span className="font-bold uppercase w-4">{key}.</span>
                                  <span className="flex-1">{q.options?.[key]}</span>
                                  {isThisCorrect && <span className="text-[10px] text-green-700 font-bold bg-green-200 px-1 rounded">Correct</span>}
                                  {isThisUser && !isThisCorrect && <span className="text-[10px] text-red-700 font-bold bg-red-200 px-1 rounded">Your Ans</span>}
                                </div>
                              );
                            })}
                          </div>

                          {q.solution_text && (
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-950 mt-2">
                              <span className="font-bold block mb-1">Explanation:</span>
                              <div className="whitespace-pre-line">{q.solution_text}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'timing' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-900 flex items-center justify-between">
                <span>Per-Question Time Breakdown recorded in Supabase / Local database.</span>
                <span className="font-bold">Total time: {timeFormatted}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                {questions.map((q) => {
                  const spent = questionStatuses[q.question_number]?.timeSpentSeconds || 0;
                  const status = questionStatuses[q.question_number]?.status;
                  const ans = questionStatuses[q.question_number]?.selectedOption;
                  const isCorrect = ans && ans.toLowerCase() === (q.correct_option || '').toLowerCase();

                  return (
                    <div key={q.question_number} className="bg-gray-50 border border-gray-200 p-2 rounded text-center">
                      <div className="text-[11px] font-bold text-gray-700">Q.{q.question_number}</div>
                      <div className="text-xs font-mono font-bold text-[#1b4d89] mt-0.5">{formatSec(spent)}</div>
                      <div className="text-[10px] mt-0.5">
                        {status === 'ANSWERED' || status === 'ANSWERED_AND_MARKED' ? (
                          isCorrect ? <span className="text-green-600 font-bold">Correct</span> : <span className="text-red-600 font-bold">Wrong</span>
                        ) : (
                          <span className="text-gray-400">Skipped</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-500">SSC Mock Test 3 Completed</span>
          <button
            onClick={onRestart}
            className="px-5 py-2 bg-[#1b4d89] hover:bg-[#153e6e] text-white text-xs font-bold rounded shadow transition"
          >
            Restart Exam
          </button>
        </div>
      </div>
    </div>
  );
}
