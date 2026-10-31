import mockTest3Data from './mockTest3.json';
import mockTest1Data from './defaultQuestions.json';
import rrbMockTest1Data from './rrbMockTest1.json';

// SSC CGL Exam Specifications (60 Minutes, 100 Questions, 200 Marks)
export const SSC_SECTION_DURATION_SECONDS = 15 * 60; // 15 minutes per section
export const SSC_TOTAL_EXAM_DURATION_SECONDS = 60 * 60; // 60 minutes total

export const SSC_SECTIONS = [
  {
    id: 'gi',
    part: 'PART - 1',
    title: 'General Intelligence & Reasoning',
    shortTitle: 'General Intelligence',
    totalQuestions: 25,
    maxMarks: 50,
    positiveMarks: 2.0,
    negativeMarks: 0.5,
    startIndex: 0,
    endIndex: 24,
    order: 0,
  },
  {
    id: 'ga',
    part: 'PART - 2',
    title: 'General Awareness',
    shortTitle: 'General Awareness',
    totalQuestions: 25,
    maxMarks: 50,
    positiveMarks: 2.0,
    negativeMarks: 0.5,
    startIndex: 25,
    endIndex: 49,
    order: 1,
  },
  {
    id: 'qa',
    part: 'PART - 3',
    title: 'Quantitative Aptitude',
    shortTitle: 'Quantitative Aptitude',
    totalQuestions: 25,
    maxMarks: 50,
    positiveMarks: 2.0,
    negativeMarks: 0.5,
    startIndex: 50,
    endIndex: 74,
    order: 2,
  },
  {
    id: 'ec',
    part: 'PART - 4',
    title: 'English Comprehension',
    shortTitle: 'English Comprehension',
    totalQuestions: 25,
    maxMarks: 50,
    positiveMarks: 2.0,
    negativeMarks: 0.5,
    startIndex: 75,
    endIndex: 99,
    order: 3,
  },
];

// RRB Exam Specifications (90 Minutes, 100 Questions, 100 Marks, +1.0 / -0.33)
export const RRB_TOTAL_EXAM_DURATION_SECONDS = 90 * 60; // 90 minutes total (5400s)

export const RRB_SECTIONS = [
  {
    id: 'gs',
    part: 'PART - 1',
    title: 'General Science',
    shortTitle: 'General Science',
    totalQuestions: 25,
    maxMarks: 25,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    startIndex: 0,
    endIndex: 24,
    durationSeconds: 22.5 * 60, // 1350s
    order: 0,
  },
  {
    id: 'math',
    part: 'PART - 2',
    title: 'Mathematics',
    shortTitle: 'Mathematics',
    totalQuestions: 25,
    maxMarks: 25,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    startIndex: 25,
    endIndex: 49,
    durationSeconds: 22.5 * 60, // 1350s
    order: 1,
  },
  {
    id: 'gi',
    part: 'PART - 3',
    title: 'General Intelligence & Reasoning',
    shortTitle: 'Reasoning',
    totalQuestions: 30,
    maxMarks: 30,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    startIndex: 50,
    endIndex: 79,
    durationSeconds: 25 * 60, // 1500s
    order: 2,
  },
  {
    id: 'ga',
    part: 'PART - 4',
    title: 'General Awareness & Current Affairs',
    shortTitle: 'General Awareness',
    totalQuestions: 20,
    maxMarks: 20,
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    startIndex: 80,
    endIndex: 99,
    durationSeconds: 20 * 60, // 1200s
    order: 3,
  },
];

export const STATUS = {
  NOT_VISITED: 'NOT_VISITED', // Silver / White
  NOT_ANSWERED: 'NOT_ANSWERED', // Red
  ANSWERED: 'ANSWERED', // Green
  MARKED_FOR_REVIEW: 'MARKED_FOR_REVIEW', // Purple
  ANSWERED_AND_MARKED: 'ANSWERED_AND_MARKED', // Purple with a Green Tick
};

// Exam Master Configurations
export const AVAILABLE_TESTS = {
  ssc_cgl_tier1_mock_3: {
    id: 'ssc_cgl_tier1_mock_3',
    tabLabel: 'SSC CGL MOCK TEST',
    shortCode: 'SSC CGL',
    title: 'SSC CGL Tier-I Mock Test 3 (TCS iON CBT)',
    badgeText: 'SSC CGL 2026',
    totalQuestions: 100,
    totalMarks: 200,
    totalDurationSeconds: SSC_TOTAL_EXAM_DURATION_SECONDS,
    sections: SSC_SECTIONS,
    defaultSectionId: 'gi',
    positiveMarks: 2.0,
    negativeMarks: 0.5,
    getQuestions: () => mockTest3Data,
    initialSectionalTimes: {
      gi: SSC_SECTION_DURATION_SECONDS,
      ga: SSC_SECTION_DURATION_SECONDS,
      qa: SSC_SECTION_DURATION_SECONDS,
      ec: SSC_SECTION_DURATION_SECONDS,
    }
  },
  rrb_cbt_mock_1: {
    id: 'rrb_cbt_mock_1',
    tabLabel: 'RRB MOCK TEST',
    shortCode: 'RRB CBT',
    title: 'RRB Full Mock Test 1 (TCS iON CBT Pattern)',
    badgeText: 'RRB CBT 2026',
    totalQuestions: 100,
    totalMarks: 100,
    totalDurationSeconds: RRB_TOTAL_EXAM_DURATION_SECONDS,
    sections: RRB_SECTIONS,
    defaultSectionId: 'gs',
    positiveMarks: 1.0,
    negativeMarks: 0.33,
    getQuestions: () => rrbMockTest1Data,
    initialSectionalTimes: {
      gs: 22.5 * 60,
      math: 22.5 * 60,
      gi: 25 * 60,
      ga: 20 * 60,
    }
  }
};

// Backwards compatibility exports
export const SECTIONS = SSC_SECTIONS;
export const SECTION_DURATION_SECONDS = SSC_SECTION_DURATION_SECONDS;
export const TOTAL_EXAM_DURATION_SECONDS = SSC_TOTAL_EXAM_DURATION_SECONDS;

export const getDefaultQuestions = () => mockTest3Data;
export const getMockTest1Questions = () => mockTest1Data;
export const getRrbMockTestQuestions = () => rrbMockTest1Data;
