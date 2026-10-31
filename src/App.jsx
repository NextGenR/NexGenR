import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SectionTabs from './components/SectionTabs';
import QuestionArea from './components/QuestionArea';
import QuestionPalette from './components/QuestionPalette';
import SectionInfoModal from './components/SectionInfoModal';
import SubmitModal from './components/SubmitModal';
import ResultModal from './components/ResultModal';
import CustomQuestionsModal from './components/CustomQuestionsModal';
import ResumeModal from './components/ResumeModal';
import SectionTimeOverModal from './components/SectionTimeOverModal';
import EarlySectionSubmitModal from './components/EarlySectionSubmitModal';
import SupabaseSettingsModal from './components/SupabaseSettingsModal';
import LoginPage from './components/LoginPage';
import TestSelectionPage from './components/TestSelectionPage';

import {
  AVAILABLE_TESTS,
  STATUS,
  SSC_SECTIONS,
  RRB_SECTIONS,
  getDefaultQuestions,
  getRrbMockTestQuestions
} from './data/questions';

import {
  getSupabaseConfig,
  getInProgressAttempt,
  saveOrUpdateAttempt,
  recordQuestionAnswer,
  saveUserResponseInstant,
  fetchUserResponsesFromDb,
  submitFinalAttempt
} from './services/supabase';

// Synchronously read saved test session for instant offline resumption
export const readSavedSession = (rollNo, testId) => {
  if (!rollNo || !testId) return null;
  try {
    const key = `toppers_session_${rollNo}_${testId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && !parsed.isSubmitted) return parsed;
    }
  } catch (err) {
    console.warn('Could not read saved session:', err);
  }
  return null;
};

export default function App() {
  // Navigation screen states: 'login' | 'dashboard' | 'test'
  const [currentScreen, setCurrentScreen] = useState(() => {
    return localStorage.getItem('toppers_screen') || 'login';
  });

  // Candidate Profile (Managed via Login screen dropdown: Om, Nitin, Ankit Mewada, or custom)
  const [candidate, setCandidate] = useState(() => {
    try {
      const saved = localStorage.getItem('toppers_active_candidate');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          if (parsed.name === 'Nitu') parsed.name = 'Ankit Mewada';
          return parsed;
        }
      }
    } catch (e) { }
    return {
      name: "Om",
      rollNo: "RRB2026-OM01",
      systemNo: "C9-LAB3-042",
      photoUrl: null
    };
  });

  // Active Test Selection (Default: RRB Mock Test 1, user can switch or choose SSC CGL)
  const [activeTestId, setActiveTestId] = useState(() => {
    return localStorage.getItem('toppers_active_test_id') || 'rrb_cbt_mock_1';
  });

  const activeTestConfig = AVAILABLE_TESTS[activeTestId] || AVAILABLE_TESTS.ssc_cgl_tier1_mock_3;
  const sections = activeTestConfig.sections;

  // Retrieve initial saved snapshot if resuming after network drop, reload, or tab close
  const initialSavedSession = useRef(readSavedSession(candidate.rollNo, activeTestId)).current;

  // Questions for active test
  const [questions, setQuestions] = useState(() => activeTestConfig.getQuestions());

  // Deterministic attempt ID tied to candidate and active test
  const attemptId = `attempt_${candidate.rollNo}_${activeTestId}`;

  // Section Tracking (Strict Sectional Timing) - Resumes exact active section
  const [activeSectionId, setActiveSectionId] = useState(() => {
    return initialSavedSession?.activeSectionId || activeTestConfig.defaultSectionId;
  });

  // Completed sections - Resumes exact completed sections
  const [completedSections, setCompletedSections] = useState(() => {
    return Array.isArray(initialSavedSession?.completedSections) ? initialSavedSession.completedSections : [];
  });

  // Active Question Number (1 to 100) - Resumes exact question number
  const [activeQuestionNumber, setActiveQuestionNumber] = useState(() => {
    return initialSavedSession?.activeQuestionNumber || 1;
  });

  // Sectional Time Left mapping in seconds - Resumes exact time countdown
  const [sectionalTimeLeft, setSectionalTimeLeft] = useState(() => {
    return initialSavedSession?.sectionalTimeLeft || { ...activeTestConfig.initialSectionalTimes };
  });

  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [language, setLanguage] = useState(() => initialSavedSession?.language || 'en');
  const [liveSyncMessage, setLiveSyncMessage] = useState(() => {
    if (initialSavedSession?.activeQuestionNumber) {
      return `⚡ Test Resumed from Question ${initialSavedSession.activeQuestionNumber} (All answers & timer restored)`;
    }
    return null;
  });

  // Question Statuses and Time Spent state map:
  // { [qNum]: { status, selectedOption, timeSpentSeconds } }
  const [questionStatuses, setQuestionStatuses] = useState(() => {
    if (initialSavedSession?.questionStatuses && Object.keys(initialSavedSession.questionStatuses).length > 0) {
      return initialSavedSession.questionStatuses;
    }
    const initial = {};
    const qs = activeTestConfig.getQuestions();
    qs.forEach((q, idx) => {
      initial[q.question_number] = {
        status: idx === 0 ? STATUS.NOT_ANSWERED : STATUS.NOT_VISITED,
        selectedOption: null,
        timeSpentSeconds: 0,
      };
    });
    return initial;
  });

  // Modals state
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isCustomQuestionsOpen, setIsCustomQuestionsOpen] = useState(false);
  const [isEarlySubmitOpen, setIsEarlySubmitOpen] = useState(false);
  const [isSectionTimeOverOpen, setIsSectionTimeOverOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [pendingExpiredSection, setPendingExpiredSection] = useState(null);

  // Resume State
  const [detectedPastAttempt, setDetectedPastAttempt] = useState(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Supabase connection indicator
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(() => getSupabaseConfig().isConfigured);
  const [isSynced, setIsSynced] = useState(true);

  // --------------------------------------------------------------------------
  // CONTINUOUS OFFLINE RESUME ENGINE: Auto-Save Snapshot to localStorage
  // --------------------------------------------------------------------------
  const latestSessionRef = useRef({});
  latestSessionRef.current = {
    candidate,
    activeTestId,
    activeSectionId,
    activeQuestionNumber,
    completedSections,
    sectionalTimeLeft,
    questionStatuses,
    language,
    isSubmitted: false,
    lastSavedAt: Date.now()
  };

  const persistSessionLocally = () => {
    if (currentScreen !== 'test' || !candidate?.rollNo || !activeTestId) return;
    try {
      const sessionKey = `toppers_session_${candidate.rollNo}_${activeTestId}`;
      localStorage.setItem(sessionKey, JSON.stringify(latestSessionRef.current));
    } catch (e) {
      console.warn('Local session save error:', e);
    }
  };

  // Auto-save whenever user navigates, selects options, or switches sections
  useEffect(() => {
    if (currentScreen === 'test') {
      persistSessionLocally();
    }
  }, [
    currentScreen,
    candidate.rollNo,
    activeTestId,
    activeSectionId,
    activeQuestionNumber,
    completedSections,
    questionStatuses,
    language
  ]);

  // Synchronous fallback for tab close, network crash, page reload (beforeunload / pagehide)
  useEffect(() => {
    const handleUnloadSave = () => {
      if (currentScreen === 'test' && candidate?.rollNo && activeTestId) {
        try {
          const sessionKey = `toppers_session_${candidate.rollNo}_${activeTestId}`;
          localStorage.setItem(sessionKey, JSON.stringify(latestSessionRef.current));
        } catch (e) { }
      }
    };

    window.addEventListener('beforeunload', handleUnloadSave);
    window.addEventListener('pagehide', handleUnloadSave);
    return () => {
      window.removeEventListener('beforeunload', handleUnloadSave);
      window.removeEventListener('pagehide', handleUnloadSave);
    };
  }, [currentScreen, candidate?.rollNo, activeTestId]);

  // --------------------------------------------------------------------------
  // Tab Switcher Handler (Switch between SSC CGL and RRB Mock Tests)
  // --------------------------------------------------------------------------
  const handleSwitchTestTab = async (newTestId, forceReset = false) => {
    const targetConfig = AVAILABLE_TESTS[newTestId];
    if (!targetConfig) return;

    // Save test choice
    localStorage.setItem('toppers_active_test_id', newTestId);
    setActiveTestId(newTestId);

    const targetQuestions = targetConfig.getQuestions();
    setQuestions(targetQuestions);

    const saved = !forceReset ? readSavedSession(candidate.rollNo, newTestId) : null;
    if (saved) {
      // Resume existing in-progress attempt for this test!
      setActiveSectionId(saved.activeSectionId || targetConfig.defaultSectionId);
      setActiveQuestionNumber(saved.activeQuestionNumber || 1);
      setCompletedSections(Array.isArray(saved.completedSections) ? saved.completedSections : []);
      setSectionalTimeLeft(saved.sectionalTimeLeft || { ...targetConfig.initialSectionalTimes });
      setQuestionStatuses(saved.questionStatuses || {});
      setIsTimerRunning(true);
      setLiveSyncMessage(`⚡ Resumed ${targetConfig.tabLabel} from Question ${saved.activeQuestionNumber || 1}`);
      setTimeout(() => setLiveSyncMessage(null), 3500);
    } else {
      // Start fresh
      setActiveSectionId(targetConfig.defaultSectionId);
      setCompletedSections([]);
      setActiveQuestionNumber(1);
      setSectionalTimeLeft({ ...targetConfig.initialSectionalTimes });
      setIsTimerRunning(true);

      const resetStatuses = {};
      targetQuestions.forEach((q, idx) => {
        resetStatuses[q.question_number] = {
          status: idx === 0 ? STATUS.NOT_ANSWERED : STATUS.NOT_VISITED,
          selectedOption: null,
          timeSpentSeconds: 0,
        };
      });
      setQuestionStatuses(resetStatuses);

      setLiveSyncMessage(`Switched to ${targetConfig.tabLabel} (${targetQuestions.length} Questions)`);
      setTimeout(() => setLiveSyncMessage(null), 3500);
    }
  };

  // --------------------------------------------------------------------------
  // 1. INSTANT FETCH FROM SUPABASE ON PAGE LOAD / TEST CHANGE
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    const currentAttemptId = `attempt_${candidate.rollNo}_${activeTestId}`;

    const loadSavedDataFromSupabase = async () => {
      try {
        console.log(`⚡ Fetching past responses from Supabase for ${activeTestId} (attempt: ${currentAttemptId})`);
        const savedResponses = await fetchUserResponsesFromDb(currentAttemptId);
        if (isMounted && savedResponses && Object.keys(savedResponses).length > 0) {
          setQuestionStatuses((prev) => {
            const updated = { ...prev };
            let answeredCount = 0;
            Object.entries(savedResponses).forEach(([qNumStr, resp]) => {
              const qNum = Number(qNumStr);
              if (updated[qNum]) {
                const hasAns = Boolean(resp.selectedOption);
                if (hasAns) answeredCount++;
                updated[qNum] = {
                  status: resp.status || (hasAns ? STATUS.ANSWERED : STATUS.NOT_ANSWERED),
                  selectedOption: resp.selectedOption || null,
                  timeSpentSeconds: resp.timeSpentSeconds || 0,
                };
              }
            });
            return updated;
          });
          setLiveSyncMessage(`⚡ Restored ${Object.keys(savedResponses).length} saved responses from Supabase!`);
          setTimeout(() => setLiveSyncMessage(null), 4000);
        }

        // Also check if in-progress session metadata exists
        const attempt = await getInProgressAttempt(activeTestId, candidate.rollNo);
        if (isMounted && attempt && attempt.status === 'in_progress') {
          if (attempt.current_section_id) setActiveSectionId(attempt.current_section_id);
          if (attempt.current_question_number) setActiveQuestionNumber(attempt.current_question_number);
          if (attempt.completed_sections) setCompletedSections(attempt.completed_sections);
          if (attempt.sectional_time_left) setSectionalTimeLeft(attempt.sectional_time_left);
        }
      } catch (err) {
        console.warn('Startup sync warning:', err);
      }
    };

    loadSavedDataFromSupabase();
    return () => { isMounted = false; };
  }, [activeTestId, candidate.rollNo]);

  // Handler: Resume Past Attempt
  const handleResumePastAttempt = () => {
    if (!detectedPastAttempt) return;

    if (detectedPastAttempt.current_section_id) setActiveSectionId(detectedPastAttempt.current_section_id);
    if (detectedPastAttempt.current_question_number) setActiveQuestionNumber(detectedPastAttempt.current_question_number);
    if (detectedPastAttempt.completed_sections) setCompletedSections(detectedPastAttempt.completed_sections);
    if (detectedPastAttempt.sectional_time_left) setSectionalTimeLeft(detectedPastAttempt.sectional_time_left);

    if (detectedPastAttempt.question_states) {
      setQuestionStatuses((prev) => {
        const merged = { ...prev };
        Object.entries(detectedPastAttempt.question_states).forEach(([qNum, state]) => {
          merged[Number(qNum)] = {
            status: state.status || STATUS.NOT_VISITED,
            selectedOption: state.selectedOption || null,
            timeSpentSeconds: state.timeSpentSeconds || 0,
          };
        });
        return merged;
      });
    }

    setIsResumeModalOpen(false);
    setIsTimerRunning(true);
  };

  // Handler: Start Fresh Attempt
  const handleStartFreshAttempt = () => {
    setIsResumeModalOpen(false);
    localStorage.removeItem(`ssc_mock_attempt_${activeTestId}_${candidate.rollNo}`);
  };

  // --------------------------------------------------------------------------
  // Section Timing Countdown & Question Active Time Tracking (1s interval)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      // 1. Increment time spent on CURRENT question
      setQuestionStatuses((prev) => {
        const currentQ = prev[activeQuestionNumber];
        if (!currentQ) return prev;
        return {
          ...prev,
          [activeQuestionNumber]: {
            ...currentQ,
            timeSpentSeconds: (currentQ.timeSpentSeconds || 0) + 1,
          }
        };
      });

      // 2. Decrement time left for CURRENT ACTIVE SECTION
      setSectionalTimeLeft((prev) => {
        const currentSecTime = prev[activeSectionId] ?? 900;
        if (currentSecTime <= 1) {
          // SECTION TIME IS OVER!
          handleSectionTimeExpired(activeSectionId);
          return {
            ...prev,
            [activeSectionId]: 0,
          };
        }
        return {
          ...prev,
          [activeSectionId]: currentSecTime - 1,
        };
      });

      // 3. Periodic snapshot save every 3 seconds to keep time exact
      if (Math.floor(Date.now() / 1000) % 3 === 0) {
        persistSessionLocally();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, activeSectionId, activeQuestionNumber]);

  // Total time left = sum of current active section time + remaining sections
  const totalTimeLeft = Object.entries(sectionalTimeLeft)
    .filter(([secId]) => !completedSections.includes(secId))
    .reduce((sum, [, secSecs]) => sum + secSecs, 0);

  const currentSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const currentQuestion = questions.find((q) => q.question_number === activeQuestionNumber) || questions[0];
  const currentOption = questionStatuses[activeQuestionNumber]?.selectedOption || null;
  const currentQTimeSpent = questionStatuses[activeQuestionNumber]?.timeSpentSeconds || 0;

  // --------------------------------------------------------------------------
  // Handling Section Expiration & Progression
  // --------------------------------------------------------------------------
  const handleSectionTimeExpired = (expiredSecId) => {
    const expiredSectionObj = sections.find(s => s.id === expiredSecId);
    setPendingExpiredSection(expiredSectionObj);
    setIsSectionTimeOverOpen(true);
  };

  const handleProceedAfterSectionOver = () => {
    setIsSectionTimeOverOpen(false);

    // Mark section as completed
    const newlyCompleted = [...new Set([...completedSections, activeSectionId])];
    setCompletedSections(newlyCompleted);

    // Find next section in order
    const currentIndex = sections.findIndex(s => s.id === activeSectionId);
    const nextSec = sections[currentIndex + 1];

    if (nextSec) {
      // Advance to next section
      setActiveSectionId(nextSec.id);
      const firstQOfNext = nextSec.startIndex + 1;

      setQuestionStatuses((prev) => {
        if (prev[firstQOfNext]?.status === STATUS.NOT_VISITED) {
          return {
            ...prev,
            [firstQOfNext]: { ...prev[firstQOfNext], status: STATUS.NOT_ANSWERED }
          };
        }
        return prev;
      });

      setActiveQuestionNumber(firstQOfNext);
      syncToBackend(newlyCompleted, nextSec.id, firstQOfNext);
    } else {
      // All sections completed! Final test submission
      handleFinalSubmit();
    }
  };

  // Early Section Submit
  const handleConfirmEarlySectionSubmit = () => {
    setIsEarlySubmitOpen(false);
    setSectionalTimeLeft(prev => ({ ...prev, [activeSectionId]: 0 }));
    handleProceedAfterSectionOver();
  };

  // --------------------------------------------------------------------------
  // Auto-Save / Sync to Supabase
  // --------------------------------------------------------------------------
  const syncToBackend = async (completed = completedSections, currentSec = activeSectionId, currentQ = activeQuestionNumber) => {
    setIsSynced(false);

    let totalAttempted = 0;
    Object.values(questionStatuses).forEach((q) => {
      if (q.status === STATUS.ANSWERED || q.status === STATUS.ANSWERED_AND_MARKED) {
        totalAttempted++;
      }
    });

    const payload = {
      id: attemptId,
      test_id: activeTestId,
      test_title: activeTestConfig.title,
      roll_number: candidate.rollNo,
      candidate_name: candidate.name,
      status: 'in_progress',
      current_section_id: currentSec,
      current_question_number: currentQ,
      sectional_time_left: sectionalTimeLeft,
      completed_sections: completed,
      question_states: questionStatuses,
      total_questions: questions.length,
      total_attempted: totalAttempted,
      time_taken_seconds: activeTestConfig.totalDurationSeconds - totalTimeLeft,
    };

    await saveOrUpdateAttempt(payload);

    // Also record current question answer
    const currentQData = questions.find(q => q.question_number === currentQ);
    const stateObj = questionStatuses[currentQ];
    if (currentQData && stateObj) {
      await recordQuestionAnswer({
        attempt_id: attemptId,
        roll_number: candidate.rollNo,
        candidate_name: candidate.name,
        test_id: activeTestId,
        question_number: currentQ,
        section_name: currentQData.section_title,
        selected_option: stateObj.selectedOption,
        correct_option: currentQData.correct_option,
        is_correct: stateObj.selectedOption?.toLowerCase() === currentQData.correct_option?.toLowerCase(),
        status: stateObj.status,
        time_taken_seconds: stateObj.timeSpentSeconds || 0,
      });
    }

    setIsSynced(true);
  };

  // Periodic Auto-save every 10 seconds
  useEffect(() => {
    if (!isTimerRunning) return;
    const saveInterval = setInterval(() => {
      syncToBackend();
    }, 10000);
    return () => clearInterval(saveInterval);
  }, [isTimerRunning, attemptId, activeTestId, activeSectionId, activeQuestionNumber, questionStatuses, sectionalTimeLeft, completedSections]);

  // --------------------------------------------------------------------------
  // Question Actions & State Updates (Instant Supabase Sync on Every Click)
  // --------------------------------------------------------------------------
  const handleSelectOption = async (optKey) => {
    const currentQData = questions.find(q => q.question_number === activeQuestionNumber);
    const spentSec = questionStatuses[activeQuestionNumber]?.timeSpentSeconds || 0;

    setQuestionStatuses((prev) => ({
      ...prev,
      [activeQuestionNumber]: {
        ...prev[activeQuestionNumber],
        selectedOption: optKey
      }
    }));

    if (currentQData) {
      setLiveSyncMessage(`⚡ Syncing Q${activeQuestionNumber} -> Option ${optKey.toUpperCase()}...`);
      const res = await saveUserResponseInstant({
        attempt_id: attemptId,
        roll_number: candidate.rollNo,
        candidate_name: candidate.name,
        test_id: activeTestId,
        question_number: activeQuestionNumber,
        section_name: currentQData.section_title,
        selected_option: optKey,
        time_taken_seconds: spentSec,
        correct_option: currentQData.correct_option,
        is_correct: optKey.toLowerCase() === (currentQData.correct_option || '').toLowerCase(),
        status: STATUS.ANSWERED
      });
      if (res && res.success) {
        setLiveSyncMessage(`✓ Supabase Synced: Q${activeQuestionNumber} -> Option ${optKey.toUpperCase()} in ${spentSec}s`);
        setTimeout(() => setLiveSyncMessage(null), 3500);
      }
    }
  };

  // Save & Next
  const handleSaveAndNext = async () => {
    const currentSelected = questionStatuses[activeQuestionNumber]?.selectedOption;
    const currentQData = questions.find(q => q.question_number === activeQuestionNumber);
    const spentSec = questionStatuses[activeQuestionNumber]?.timeSpentSeconds || 0;

    setQuestionStatuses((prev) => {
      const newStatus = currentSelected ? STATUS.ANSWERED : STATUS.NOT_ANSWERED;
      return {
        ...prev,
        [activeQuestionNumber]: {
          ...prev[activeQuestionNumber],
          status: newStatus,
          selectedOption: currentSelected || null
        }
      };
    });

    if (currentQData && currentSelected) {
      await saveUserResponseInstant({
        attempt_id: attemptId,
        roll_number: candidate.rollNo,
        candidate_name: candidate.name,
        test_id: activeTestId,
        question_number: activeQuestionNumber,
        section_name: currentQData.section_title,
        selected_option: currentSelected,
        time_taken_seconds: spentSec,
        correct_option: currentQData.correct_option,
        is_correct: currentSelected.toLowerCase() === (currentQData.correct_option || '').toLowerCase(),
        status: STATUS.ANSWERED
      });
    }

    // Navigation constrained to CURRENT SECTION
    const maxQInSection = currentSection.endIndex + 1;
    if (activeQuestionNumber < maxQInSection) {
      const nextQNum = activeQuestionNumber + 1;
      setQuestionStatuses((prev) => {
        if (prev[nextQNum]?.status === STATUS.NOT_VISITED) {
          return {
            ...prev,
            [nextQNum]: { ...prev[nextQNum], status: STATUS.NOT_ANSWERED }
          };
        }
        return prev;
      });
      setActiveQuestionNumber(nextQNum);
    } else {
      setIsEarlySubmitOpen(true);
    }

    syncToBackend();
  };

  // Mark for Review & Next
  const handleMarkForReviewAndNext = async () => {
    const currentSelected = questionStatuses[activeQuestionNumber]?.selectedOption;
    const currentQData = questions.find(q => q.question_number === activeQuestionNumber);
    const spentSec = questionStatuses[activeQuestionNumber]?.timeSpentSeconds || 0;
    const newStatus = currentSelected ? STATUS.ANSWERED_AND_MARKED : STATUS.MARKED_FOR_REVIEW;

    setQuestionStatuses((prev) => ({
      ...prev,
      [activeQuestionNumber]: {
        ...prev[activeQuestionNumber],
        status: newStatus,
        selectedOption: currentSelected || null
      }
    }));

    if (currentQData) {
      await saveUserResponseInstant({
        attempt_id: attemptId,
        roll_number: candidate.rollNo,
        candidate_name: candidate.name,
        test_id: activeTestId,
        question_number: activeQuestionNumber,
        section_name: currentQData.section_title,
        selected_option: currentSelected || null,
        time_taken_seconds: spentSec,
        correct_option: currentQData.correct_option,
        is_correct: currentSelected ? currentSelected.toLowerCase() === (currentQData.correct_option || '').toLowerCase() : false,
        status: newStatus
      });
    }

    const maxQInSection = currentSection.endIndex + 1;
    if (activeQuestionNumber < maxQInSection) {
      const nextQNum = activeQuestionNumber + 1;
      setQuestionStatuses((prev) => {
        if (prev[nextQNum]?.status === STATUS.NOT_VISITED) {
          return {
            ...prev,
            [nextQNum]: { ...prev[nextQNum], status: STATUS.NOT_ANSWERED }
          };
        }
        return prev;
      });
      setActiveQuestionNumber(nextQNum);
    } else {
      setIsEarlySubmitOpen(true);
    }

    syncToBackend();
  };

  // Clear Response
  const handleClearResponse = async () => {
    const currentQData = questions.find(q => q.question_number === activeQuestionNumber);
    const spentSec = questionStatuses[activeQuestionNumber]?.timeSpentSeconds || 0;

    setQuestionStatuses((prev) => ({
      ...prev,
      [activeQuestionNumber]: {
        ...prev[activeQuestionNumber],
        status: STATUS.NOT_ANSWERED,
        selectedOption: null
      }
    }));

    if (currentQData) {
      setLiveSyncMessage(`⚡ Clearing Q${activeQuestionNumber} in Supabase...`);
      await saveUserResponseInstant({
        attempt_id: attemptId,
        roll_number: candidate.rollNo,
        candidate_name: candidate.name,
        test_id: activeTestId,
        question_number: activeQuestionNumber,
        section_name: currentQData.section_title,
        selected_option: null,
        time_taken_seconds: spentSec,
        correct_option: currentQData.correct_option,
        is_correct: false,
        status: STATUS.NOT_ANSWERED
      });
      setLiveSyncMessage(`✓ Cleared Q${activeQuestionNumber} in Supabase`);
      setTimeout(() => setLiveSyncMessage(null), 3000);
    }

    syncToBackend();
  };

  // Previous Question
  const handlePreviousQuestion = () => {
    const minQInSection = currentSection.startIndex + 1;
    if (activeQuestionNumber > minQInSection) {
      setActiveQuestionNumber(activeQuestionNumber - 1);
    }
  };

  // Direct Navigate from Palette
  const handleNavigateToQuestion = (targetQNum) => {
    if (targetQNum === activeQuestionNumber) return;

    const minQInSection = currentSection.startIndex + 1;
    const maxQInSection = currentSection.endIndex + 1;
    if (targetQNum < minQInSection || targetQNum > maxQInSection) {
      return; // Locked to active section!
    }

    setQuestionStatuses((prev) => {
      const curr = prev[activeQuestionNumber];
      if (curr && !curr.selectedOption && (curr.status === STATUS.NOT_VISITED || curr.status === STATUS.NOT_ANSWERED)) {
        return {
          ...prev,
          [activeQuestionNumber]: { ...curr, status: STATUS.NOT_ANSWERED },
          [targetQNum]: prev[targetQNum]?.status === STATUS.NOT_VISITED
            ? { ...prev[targetQNum], status: STATUS.NOT_ANSWERED }
            : prev[targetQNum]
        };
      }
      if (prev[targetQNum]?.status === STATUS.NOT_VISITED) {
        return {
          ...prev,
          [targetQNum]: { ...prev[targetQNum], status: STATUS.NOT_ANSWERED }
        };
      }
      return prev;
    });

    setActiveQuestionNumber(targetQNum);
  };

  // --------------------------------------------------------------------------
  // Final Test Submission
  // --------------------------------------------------------------------------
  const handleFinalSubmit = async () => {
    setIsSubmitModalOpen(false);
    setIsTimerRunning(false);

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    let score = 0;

    const detailedAnswers = questions.map((q) => {
      const s = questionStatuses[q.question_number];
      const userAns = s?.selectedOption;
      const isAttempted = s?.status === STATUS.ANSWERED || s?.status === STATUS.ANSWERED_AND_MARKED;
      const isCorrect = isAttempted && userAns && userAns.toLowerCase() === (q.correct_option || '').toLowerCase();

      let marks = 0;
      if (isAttempted && userAns) {
        if (isCorrect) {
          correct++;
          score += activeTestConfig.positiveMarks;
          marks = activeTestConfig.positiveMarks;
        } else {
          incorrect++;
          score -= activeTestConfig.negativeMarks;
          marks = -activeTestConfig.negativeMarks;
        }
      } else {
        unattempted++;
      }

      return {
        question_number: q.question_number,
        section_name: q.section_title,
        selected_option: userAns || null,
        correct_option: q.correct_option,
        is_correct: isCorrect,
        marks_awarded: marks,
        status: s?.status || STATUS.NOT_VISITED,
        time_spent_seconds: s?.timeSpentSeconds || 0,
      };
    });

    const accuracy = (correct + incorrect > 0) ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    const timeTaken = activeTestConfig.totalDurationSeconds - totalTimeLeft;

    const finalAttemptPayload = {
      id: attemptId,
      test_id: activeTestId,
      test_title: activeTestConfig.title,
      roll_number: candidate.rollNo,
      candidate_name: candidate.name,
      total_questions: questions.length,
      total_attempted: correct + incorrect,
      total_correct: correct,
      total_incorrect: incorrect,
      total_unattempted: unattempted,
      total_score: score,
      accuracy_percentage: accuracy,
      time_taken_seconds: timeTaken,
      status: 'submitted',
    };

    await submitFinalAttempt(finalAttemptPayload, detailedAnswers);
    // Clear in-progress session snapshot on final submission
    try {
      const sessionKey = `toppers_session_${candidate.rollNo}_${activeTestId}`;
      localStorage.removeItem(sessionKey);
      localStorage.removeItem(`ssc_mock_attempt_${activeTestId}_${candidate.rollNo}`);
    } catch (e) { }
    setIsResultModalOpen(true);
  };

  const handleRestartTest = () => {
    try {
      const sessionKey = `toppers_session_${candidate.rollNo}_${activeTestId}`;
      localStorage.removeItem(sessionKey);
      localStorage.removeItem(`ssc_mock_attempt_${activeTestId}_${candidate.rollNo}`);
    } catch (e) { }
    setActiveSectionId(activeTestConfig.defaultSectionId);
    setCompletedSections([]);
    setActiveQuestionNumber(1);
    setSectionalTimeLeft({ ...activeTestConfig.initialSectionalTimes });
    setIsTimerRunning(true);
    setIsResultModalOpen(false);

    const reset = {};
    questions.forEach((q, idx) => {
      reset[q.question_number] = {
        status: idx === 0 ? STATUS.NOT_ANSWERED : STATUS.NOT_VISITED,
        selectedOption: null,
        timeSpentSeconds: 0
      };
    });
    setQuestionStatuses(reset);
  };

  const isCurrentSectionLast = activeSectionId === sections[sections.length - 1].id;
  const currentSectionIndex = sections.findIndex(s => s.id === activeSectionId);
  const nextSectionObj = sections[currentSectionIndex + 1];

  // --------------------------------------------------------------------------
  // SCREEN 1: CANDIDATE LOGIN PAGE
  // User picks name from dropdown (Om, Nitin, or custom) and logs into portal
  // --------------------------------------------------------------------------
  if (currentScreen === 'login') {
    return (
      <LoginPage
        initialCandidate={candidate}
        onLogin={(selectedCandidate) => {
          setCandidate(selectedCandidate);
          try {
            localStorage.setItem('toppers_active_candidate', JSON.stringify(selectedCandidate));
            localStorage.setItem('toppers_screen', 'dashboard');
          } catch (e) { }
          setCurrentScreen('dashboard');
        }}
      />
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 2: 10 RRB MOCK TESTS SELECTION DASHBOARD
  // Candidate views all 10 RRB Mock Tests and launches Mock Test 1
  // --------------------------------------------------------------------------
  if (currentScreen === 'dashboard') {
    return (
      <TestSelectionPage
        candidate={candidate}
        onSelectTest={(testId) => {
          const selectedId = testId || 'rrb_cbt_mock_1';
          handleSwitchTestTab(selectedId, true);
          try {
            localStorage.setItem('toppers_screen', 'test');
          } catch (e) { }
          setCurrentScreen('test');
        }}
        onSelectSscTest={() => {
          handleSwitchTestTab('ssc_cgl_tier1_mock_3', true);
          try {
            localStorage.setItem('toppers_screen', 'test');
          } catch (e) { }
          setCurrentScreen('test');
        }}
        onLogout={() => {
          try {
            localStorage.setItem('toppers_screen', 'login');
          } catch (e) { }
          setCurrentScreen('login');
        }}
      />
    );
  }

  // --------------------------------------------------------------------------
  // SCREEN 3: TCS iON CBT TEST EXAMINATION ENVIRONMENT
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-[#e9ecef] font-sans antialiased text-gray-900 select-none overflow-hidden">
      {/* 1. Top Header with Exam Tabs & Sectional Countdown */}
      <Header
        sectionTimeLeft={sectionalTimeLeft[activeSectionId] ?? 0}
        totalTimeLeft={totalTimeLeft}
        language={language}
        setLanguage={setLanguage}
        candidate={candidate}
        activeSectionTitle={currentSection?.title}
        isSupabaseConfigured={isSupabaseConfigured}
        isSynced={isSynced}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        testTitle={activeTestConfig.title}
        availableTests={AVAILABLE_TESTS}
        activeTestId={activeTestId}
        onSelectTestTab={handleSwitchTestTab}
        badgeText={activeTestConfig.badgeText}
        onGoToDashboard={() => {
          try {
            localStorage.setItem('toppers_screen', 'dashboard');
          } catch (e) { }
          setCurrentScreen('dashboard');
        }}
        onSwitchUser={() => {
          try {
            localStorage.setItem('toppers_screen', 'login');
          } catch (e) { }
          setCurrentScreen('login');
        }}
      />

      {/* CBT Status Bar */}
      <div className="bg-[#e2e8f0] border-b border-gray-300 px-3 sm:px-4 py-1 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-gray-800">{activeTestConfig.tabLabel}</span>
          <span className="text-gray-400">|</span>
          <span className="text-blue-900 font-medium">
            Section {currentSectionIndex + 1} of {sections.length}: <strong>{currentSection?.title}</strong>
          </span>
          <span className="hidden md:inline text-gray-500">
            ({currentSection?.totalQuestions} Questions • Sequential CBT Locking)
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="text-[11px] font-bold text-[#1b4d89] hover:underline bg-white px-2 py-0.5 rounded border border-gray-300 shadow-2xs hover:bg-blue-50 transition"
          >
            ⚙️ Supabase Sync &amp; Upload
          </button>
          <button
            onClick={() => setIsCustomQuestionsOpen(true)}
            className="text-[11px] font-bold text-gray-700 hover:underline bg-white px-2 py-0.5 rounded border border-gray-300 shadow-2xs hover:bg-gray-50 transition"
          >
            📂 Load JSON
          </button>
        </div>
      </div>

      {/* Live Supabase Sync Notification Banner */}
      {liveSyncMessage && (
        <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-1 flex items-center justify-between shadow-xs transition-all">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-ping mr-1"></span>
            <span>{liveSyncMessage}</span>
          </span>
          <span className="text-[10px] text-emerald-100 uppercase font-mono">Live Database Connected</span>
        </div>
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative" style={{ height: 'calc(100vh - 110px)' }}>
        {/* Left Column (75% width) */}
        <section className="w-full md:w-[75%] flex flex-col h-full bg-white border-r border-gray-300 overflow-hidden">
          {/* Section Tabs with Strict Locking */}
          <SectionTabs
            sections={sections}
            activeSectionId={activeSectionId}
            completedSections={completedSections}
            onSelectSection={(secId) => {
              if (secId === activeSectionId) return;
            }}
            onOpenSectionInfo={() => setIsInfoModalOpen(true)}
            questionStatuses={questionStatuses}
            questions={questions}
          />

          {/* Question Display Area & Footer Controls */}
          <QuestionArea
            currentQuestion={currentQuestion}
            currentSection={currentSection}
            selectedOption={currentOption}
            onSelectOption={handleSelectOption}
            onSaveAndNext={handleSaveAndNext}
            onMarkForReviewAndNext={handleMarkForReviewAndNext}
            onClearResponse={handleClearResponse}
            onPreviousQuestion={handlePreviousQuestion}
            onSubmitSectionEarly={() => setIsEarlySubmitOpen(true)}
            hasNext={activeQuestionNumber < (currentSection.endIndex + 1)}
            hasPrevious={activeQuestionNumber > (currentSection.startIndex + 1)}
            language={language}
            setLanguage={setLanguage}
            activeQuestionNumber={activeQuestionNumber}
            questionTimeSpentSeconds={currentQTimeSpent}
          />
        </section>

        {/* Right Column (25% width - Question Palette restricted to Active Section) */}
        <aside className="w-full md:w-[25%] h-full bg-[#f0f4f8] flex flex-col overflow-hidden">
          <QuestionPalette
            questions={questions}
            currentSection={currentSection}
            activeQuestionNumber={activeQuestionNumber}
            questionStatuses={questionStatuses}
            onNavigateToQuestion={handleNavigateToQuestion}
            onSubmitTest={() => setIsSubmitModalOpen(true)}
            onSubmitSectionEarly={() => setIsEarlySubmitOpen(true)}
            sectionTimeLeft={sectionalTimeLeft[activeSectionId] ?? 0}
            candidate={candidate}
            isLastSection={isCurrentSectionLast}
          />
        </aside>
      </main>

      {/* Modals */}
      <SectionInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        sections={sections}
        totalDurationMinutes={Math.round(activeTestConfig.totalDurationSeconds / 60)}
        totalMarks={activeTestConfig.totalMarks}
        positiveMarks={activeTestConfig.positiveMarks}
        negativeMarks={activeTestConfig.negativeMarks}
      />

      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleFinalSubmit}
        questions={questions}
        questionStatuses={questionStatuses}
        sections={sections}
      />

      <ResultModal
        isOpen={isResultModalOpen}
        onRestart={handleRestartTest}
        onGoToDashboard={() => {
          setIsResultModalOpen(false);
          try {
            localStorage.setItem('toppers_screen', 'dashboard');
          } catch (e) { }
          setCurrentScreen('dashboard');
        }}
        questions={questions}
        questionStatuses={questionStatuses}
        timeTakenSeconds={activeTestConfig.totalDurationSeconds - totalTimeLeft}
        attemptId={attemptId}
        isSupabaseConfigured={isSupabaseConfigured}
        sections={sections}
        positiveMarks={activeTestConfig.positiveMarks}
        negativeMarks={activeTestConfig.negativeMarks}
        totalMarks={activeTestConfig.totalMarks}
        testTitle={activeTestConfig.title}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        attemptData={detectedPastAttempt}
        onResume={handleResumePastAttempt}
        onStartFresh={handleStartFreshAttempt}
      />

      <SectionTimeOverModal
        isOpen={isSectionTimeOverOpen}
        completedSection={pendingExpiredSection}
        nextSection={nextSectionObj}
        onProceed={handleProceedAfterSectionOver}
      />

      <EarlySectionSubmitModal
        isOpen={isEarlySubmitOpen}
        onClose={() => setIsEarlySubmitOpen(false)}
        onConfirm={handleConfirmEarlySectionSubmit}
        currentSection={currentSection}
        nextSection={nextSectionObj}
      />

      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigUpdated={() => setIsSupabaseConfigured(getSupabaseConfig().isConfigured)}
      />

      <CustomQuestionsModal
        isOpen={isCustomQuestionsOpen}
        onClose={() => setIsCustomQuestionsOpen(false)}
        onLoadQuestions={(newQs) => {
          setQuestions(newQs);
          setActiveQuestionNumber(1);
          const reset = {};
          newQs.forEach((q, idx) => {
            reset[q.question_number] = {
              status: idx === 0 ? STATUS.NOT_ANSWERED : STATUS.NOT_VISITED,
              selectedOption: null,
              timeSpentSeconds: 0
            };
          });
          setQuestionStatuses(reset);
        }}
      />
    </div>
  );
}
