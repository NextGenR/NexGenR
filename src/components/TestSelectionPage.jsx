import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  BookOpen, 
  LogOut, 
  Layers, 
  Sparkles, 
  Check, 
  ChevronRight,
  Database,
  ShieldCheck
} from 'lucide-react';

export const RRB_MOCK_TESTS_LIST = [
  {
    id: 'rrb_cbt_mock_1',
    testNumber: 1,
    title: 'RRB CBT Full Mock Test 1',
    subtitle: 'Official TCS iON Pattern • Complete Bilingual',
    status: 'AVAILABLE',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence & Reasoning', questions: 30 },
      { name: 'General Awareness & Current Affairs', questions: 20 },
    ],
    features: ['100 Bilingual Qs (Hindi & English)', 'Detailed Step-by-Step Solutions', 'Instant Supabase Sync']
  },
  {
    id: 'rrb_cbt_mock_2',
    testNumber: 2,
    title: 'RRB CBT Full Mock Test 2',
    subtitle: 'Advanced Physics, Chemistry & Aptitude',
    status: 'PRACTICE_READY',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence', questions: 30 },
      { name: 'General Awareness', questions: 20 },
    ],
    features: ['Standard CBT 100 Qs', 'Time Tracking Engine']
  },
  {
    id: 'rrb_cbt_mock_3',
    testNumber: 3,
    title: 'RRB CBT Full Mock Test 3',
    subtitle: 'High Weightage Reasoning & Arithmetic',
    status: 'PRACTICE_READY',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence', questions: 30 },
      { name: 'General Awareness', questions: 20 },
    ],
    features: ['Standard CBT 100 Qs', 'Time Tracking Engine']
  },
  {
    id: 'rrb_cbt_mock_4',
    testNumber: 4,
    title: 'RRB CBT Full Mock Test 4',
    subtitle: 'General Science & Life Sciences Special',
    status: 'PRACTICE_READY',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence', questions: 30 },
      { name: 'General Awareness', questions: 20 },
    ],
    features: ['Standard CBT 100 Qs', 'Time Tracking Engine']
  },
  {
    id: 'rrb_cbt_mock_5',
    testNumber: 5,
    title: 'RRB CBT Full Mock Test 5',
    subtitle: 'Current Affairs & GK Comprehensive',
    status: 'PRACTICE_READY',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence', questions: 30 },
      { name: 'General Awareness', questions: 20 },
    ],
    features: ['Standard CBT 100 Qs', 'Time Tracking Engine']
  },
  {
    id: 'rrb_cbt_mock_6',
    testNumber: 6,
    title: 'RRB CBT Full Mock Test 6',
    subtitle: 'Speed & Accuracy Booster Test',
    status: 'PRACTICE_READY',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence', questions: 30 },
      { name: 'General Awareness', questions: 20 },
    ],
    features: ['Standard CBT 100 Qs', 'Time Tracking Engine']
  },
  {
    id: 'rrb_cbt_mock_7',
    testNumber: 7,
    title: 'RRB CBT Full Mock Test 7',
    subtitle: 'Mathematics & Data Interpretation Focus',
    status: 'PRACTICE_READY',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence', questions: 30 },
      { name: 'General Awareness', questions: 20 },
    ],
    features: ['Standard CBT 100 Qs', 'Time Tracking Engine']
  },
  {
    id: 'rrb_cbt_mock_8',
    testNumber: 8,
    title: 'RRB CBT Full Mock Test 8',
    subtitle: 'Analytical & Non-Verbal Reasoning',
    status: 'PRACTICE_READY',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence', questions: 30 },
      { name: 'General Awareness', questions: 20 },
    ],
    features: ['Standard CBT 100 Qs', 'Time Tracking Engine']
  },
  {
    id: 'rrb_cbt_mock_9',
    testNumber: 9,
    title: 'RRB CBT Full Mock Test 9',
    subtitle: 'Full Syllabus All India Mock Test',
    status: 'PRACTICE_READY',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence', questions: 30 },
      { name: 'General Awareness', questions: 20 },
    ],
    features: ['Standard CBT 100 Qs', 'Time Tracking Engine']
  },
  {
    id: 'rrb_cbt_mock_10',
    testNumber: 10,
    title: 'RRB CBT Full Mock Test 10',
    subtitle: 'Final High-Yield Exam Day Simulation',
    status: 'PRACTICE_READY',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    sections: [
      { name: 'General Science', questions: 25 },
      { name: 'Mathematics', questions: 25 },
      { name: 'General Intelligence', questions: 30 },
      { name: 'General Awareness', questions: 20 },
    ],
    features: ['Standard CBT 100 Qs', 'Time Tracking Engine']
  },
];

export default function TestSelectionPage({
  candidate,
  onSelectTest,
  onLogout,
  onSelectSscTest
}) {
  const [activeTab, setActiveTab] = useState('rrb'); // 'rrb' | 'ssc'
  const [noticeMessage, setNoticeMessage] = useState(null);

  // Check if candidate has an in-progress session for a specific test
  const getSavedTestSession = (testId) => {
    if (!candidate?.rollNo || !testId) return null;
    try {
      const key = `toppers_session_${candidate.rollNo}_${testId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.isSubmitted) return parsed;
      }
    } catch (e) {}
    return null;
  };

  const handleLaunchTest = (testItem) => {
    // If user clicks Mock Test 1, launch RRB Mock Test 1
    if (testItem.testNumber === 1 || testItem.id === 'rrb_cbt_mock_1') {
      onSelectTest('rrb_cbt_mock_1');
    } else {
      // Show notice and also allow launching
      setNoticeMessage(`RRB Mock Test 1 has all 100 verified questions loaded from Supabase. Launching Mock Test 1 for you!`);
      setTimeout(() => {
        onSelectTest('rrb_cbt_mock_1');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8] text-gray-900 font-sans select-none">
      {/* Top Header */}
      <header className="bg-[#1b4d89] text-white shadow-md border-b border-[#0d3463] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">🚆</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight uppercase leading-tight">
                RRB CBT Mock Test Series Portal
              </h1>
              <p className="text-[11px] text-blue-200">
                TCS iON Examination Assessment Engine • Railway Recruitment Board
              </p>
            </div>
          </div>

          {/* Candidate Profile Widget & Logout */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
              <div className="w-7 h-7 rounded-full bg-amber-400 text-blue-950 font-black flex items-center justify-center text-xs shadow-xs">
                {candidate?.name ? candidate.name.substring(0, 2).toUpperCase() : 'OM'}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <span className="font-bold text-white block">{candidate?.name || 'Om'}</span>
                <span className="text-[10px] text-blue-200 font-mono">Roll: {candidate?.rollNo || 'RRB2026-OM01'}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold transition border border-white/15"
              title="Switch Candidate"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden md:inline">Change Candidate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notice Banner if any */}
      {noticeMessage && (
        <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 text-center shadow-xs animate-fade-in">
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Welcome Hero Card */}
        <div className="bg-gradient-to-r from-[#1b4d89] via-[#1e40af] to-[#0369a1] text-white rounded-xl p-5 sm:p-6 shadow-lg border border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 bg-amber-400 text-blue-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Official 10 Test Series Ready</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Welcome, {candidate?.name || 'Om'}! Pick Your Mock Test
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Experience the actual TCS iON Computer Based Test (CBT) environment. Select <strong>Mock Test 1</strong> below to begin your full 100-question bilingual test with instant timer tracking and Supabase cloud synchronization.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-lg border border-white/20 text-xs space-y-1.5 shrink-0 min-w-[200px]">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">CBT Exam Spec:</div>
            <div className="flex justify-between text-blue-100">
              <span>Total Questions:</span>
              <strong className="text-white">100 Qs</strong>
            </div>
            <div className="flex justify-between text-blue-100">
              <span>Exam Duration:</span>
              <strong className="text-white">90 Minutes</strong>
            </div>
            <div className="flex justify-between text-blue-100">
              <span>Marking Scheme:</span>
              <strong className="text-white">+1.0 / -0.33</strong>
            </div>
          </div>
        </div>

        {/* Exam Stream Tabs (RRB 10 Mock Tests / SSC CGL) */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('rrb')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-bold text-xs sm:text-sm transition-all border-b-2 ${
                activeTab === 'rrb'
                  ? 'bg-white text-[#1b4d89] border-[#1b4d89] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-100'
              }`}
            >
              <span className="text-base">🚆</span>
              <span>10 RRB Mock Tests</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                10 Tests
              </span>
            </button>

            <button
              onClick={() => {
                if (onSelectSscTest) onSelectSscTest();
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-t-lg font-bold text-xs sm:text-sm text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:bg-gray-100 transition"
            >
              <span className="text-base">📑</span>
              <span>SSC CGL Mock Test</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                100 Qs
              </span>
            </button>
          </div>

          <div className="text-xs text-gray-500 font-medium hidden sm:block">
            Logged in as: <strong className="text-gray-900">{candidate?.name}</strong>
          </div>
        </div>

        {/* 10 RRB Mock Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {RRB_MOCK_TESTS_LIST.map((testItem) => {
            const isMock1 = testItem.testNumber === 1;
            const savedSession = getSavedTestSession(testItem.id);
            const isInProgress = Boolean(savedSession);

            return (
              <div
                key={testItem.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden flex flex-col bg-white shadow-xs hover:shadow-md ${
                  isInProgress
                    ? 'border-amber-500 ring-2 ring-amber-400/50 relative'
                    : isMock1 
                      ? 'border-emerald-500 ring-2 ring-emerald-400/40 relative' 
                      : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {/* Active / In-Progress Ribbon */}
                {isInProgress ? (
                  <div className="bg-amber-600 text-white text-[10px] font-black px-3 py-1 flex items-center justify-between uppercase tracking-wider animate-pulse">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span>In-Progress • Resumes from Q.{savedSession.activeQuestionNumber || 1}</span>
                    </span>
                    <span>Test #{testItem.testNumber}</span>
                  </div>
                ) : isMock1 && (
                  <div className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 flex items-center justify-between uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      <span>Ready to Launch • 100 Questions Loaded</span>
                    </span>
                    <span>Test #1</span>
                  </div>
                )}

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Title & Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 uppercase">
                        Test #{testItem.testNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isInProgress
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : isMock1 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {isInProgress ? '⚡ Attempt in Progress' : isMock1 ? '🟢 Ready to Attempt' : 'Practice Test'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-gray-900 text-base leading-snug">
                      {testItem.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{testItem.subtitle}</p>
                  </div>

                  {/* Section Breakdown Pills */}
                  <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                      Sections (100 Questions):
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-700">
                      <div>🧬 Science: <strong>25 Qs</strong></div>
                      <div>📐 Maths: <strong>25 Qs</strong></div>
                      <div>🧠 Reasoning: <strong>30 Qs</strong></div>
                      <div>🌍 GK: <strong>20 Qs</strong></div>
                    </div>
                  </div>

                  {/* Test Specs Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-1 border-t border-gray-100">
                    <span className="flex items-center space-x-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{testItem.durationMinutes} Mins</span>
                    </span>
                    <span className="flex items-center space-x-1 font-medium">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{testItem.totalMarks} Marks</span>
                    </span>
                    <span className="font-mono text-[11px] text-gray-500">
                      +1.0 / -0.33
                    </span>
                  </div>

                  {/* Launch / Resume Button */}
                  <button
                    onClick={() => handleLaunchTest(testItem)}
                    className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                      isInProgress
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                        : isMock1
                          ? 'bg-[#1b4d89] hover:bg-[#153e6e] text-white hover:shadow-md'
                          : 'bg-gray-800 hover:bg-black text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {isInProgress
                        ? `Resume Test (from Q.${savedSession.activeQuestionNumber || 1})`
                        : isMock1 
                          ? 'Select & Start Mock Test 1' 
                          : `Start Mock Test ${testItem.testNumber}`}
                    </span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-300 py-3 px-4 text-center text-xs text-gray-500">
        <span>© 2026 Railway Recruitment Board (RRB) Mock Assessment Portal • Candidate Session: <strong>{candidate?.name}</strong></span>
      </footer>
    </div>
  );
}

