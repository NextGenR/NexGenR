import { createClient } from '@supabase/supabase-js';

// Live Supabase project credentials (default fallback)
export const SUPABASE_URL = 'https://zgxskpqsjylbwrhhrzim.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpneHNrcHFzanlsYndyaGhyemltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODY0MDIsImV4cCI6MjEwMjk2MjQwMn0.1RSVtWx8gxJhQcmDfJMvRfRLMvl4ju9GuwxgiKn5f8w';

let cachedClient = null;
let cachedUrl = null;
let cachedKey = null;

export const cleanSupabaseUrl = (rawUrl) => {
  if (!rawUrl) return '';
  let u = rawUrl.trim();
  u = u.replace(/\/rest\/v1\/?$/, '');
  u = u.replace(/\/+$/, '');
  return u;
};

export const getSupabaseConfig = () => {
  let url = localStorage.getItem('toppers_supabase_url') || (import.meta.env?.VITE_SUPABASE_URL || SUPABASE_URL);
  let key = localStorage.getItem('toppers_supabase_key') || (import.meta.env?.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY);
  url = cleanSupabaseUrl(url);
  key = (key || '').trim();
  return {
    url,
    key,
    isConfigured: Boolean(url && key && url.includes('supabase.co'))
  };
};

export const getSupabase = () => {
  const config = getSupabaseConfig();
  if (!config.url || !config.key) return null;

  if (!cachedClient || cachedUrl !== config.url || cachedKey !== config.key) {
    try {
      cachedClient = createClient(config.url, config.key, {
        auth: { persistSession: false }
      });
      cachedUrl = config.url;
      cachedKey = config.key;
    } catch (e) {
      console.warn('Supabase client init error:', e);
      return null;
    }
  }
  return cachedClient;
};

export const supabase = getSupabase();

export const setSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem('toppers_supabase_url', cleanSupabaseUrl(url));
    localStorage.setItem('toppers_supabase_key', key.trim());
  } else {
    localStorage.removeItem('toppers_supabase_url');
    localStorage.removeItem('toppers_supabase_key');
  }
  // Reset cached instance
  cachedClient = null;
  cachedUrl = null;
  cachedKey = null;
};

/**
 * INSTANT FETCH: Fetch all existing responses from Supabase on page load/refresh
 */
export const fetchUserResponsesFromDb = async (attemptId) => {
  try {
    const client = getSupabase();
    if (!client) return {};

    const { data, error } = await client
      .from('user_responses')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('question_number', { ascending: true });

    if (error) {
      console.error('Error fetching user_responses from Supabase:', error);
      return {};
    }

    const responsesMap = {};
    if (data && Array.isArray(data)) {
      data.forEach((row) => {
        responsesMap[row.question_number] = {
          selectedOption: row.selected_option || null,
          timeSpentSeconds: Number(row.time_taken_seconds || 0),
          status: row.status || (row.selected_option ? 'ANSWERED' : 'NOT_ANSWERED')
        };
      });
      console.log(`⚡ Fetched ${data.length} saved responses from Supabase user_responses table!`, responsesMap);
    }
    return responsesMap;
  } catch (err) {
    console.error('Failed to load user_responses:', err);
    return {};
  }
};

/**
 * INSTANT SAVE: The exact moment user selects or changes any answer
 */
export const saveUserResponseInstant = async (resp) => {
  try {
    const client = getSupabase();
    if (!client) return { success: false, error: 'No Supabase client' };

    const payload = {
      attempt_id: String(resp.attempt_id),
      roll_number: String(resp.roll_number || '2201048291'),
      candidate_name: resp.candidate_name || 'ANKIT SHARMA',
      test_id: resp.test_id || 'ssc_cgl_tier1_mock_3',
      question_number: Number(resp.question_number),
      section_name: resp.section_name || '',
      selected_option: resp.selected_option || null,
      time_taken_seconds: Number(resp.time_taken_seconds || 0),
      correct_option: resp.correct_option || null,
      is_correct: Boolean(resp.is_correct),
      status: resp.status || (resp.selected_option ? 'ANSWERED' : 'NOT_ANSWERED'),
      recorded_at: new Date().toISOString()
    };

    const { data, error } = await client
      .from('user_responses')
      .upsert(payload, { onConflict: 'attempt_id,question_number' })
      .select();

    if (error) {
      console.error('❌ Supabase user_responses save error:', error.message);
      return { success: false, error: error.message };
    }

    console.log(`✓ [SUPABASE INSTANT SYNC] Q${resp.question_number} => Option "${resp.selected_option}" in ${resp.time_taken_seconds}s`, data);
    return { success: true, data };
  } catch (err) {
    console.error('Error in saveUserResponseInstant:', err);
    return { success: false, error: err.message };
  }
};

export const recordUserResponse = saveUserResponseInstant;
export const recordQuestionAnswer = saveUserResponseInstant;

/**
 * Save or Update In-Progress Session Metadata
 */
export const saveOrUpdateAttempt = async (attemptData) => {
  try {
    const client = getSupabase();
    if (!client) return { success: false };

    const payload = {
      id: attemptData.id,
      test_id: attemptData.test_id,
      test_title: attemptData.test_title,
      roll_number: attemptData.roll_number,
      candidate_name: attemptData.candidate_name,
      status: attemptData.status || 'in_progress',
      current_section_id: attemptData.current_section_id,
      current_question_number: attemptData.current_question_number,
      sectional_time_left: attemptData.sectional_time_left,
      completed_sections: attemptData.completed_sections,
      question_states: attemptData.question_states,
      total_questions: attemptData.total_questions || 100,
      total_attempted: attemptData.total_attempted || 0,
      time_taken_seconds: attemptData.time_taken_seconds || 0,
      last_synced_at: new Date().toISOString()
    };

    await client
      .from('test_attempts')
      .upsert(payload, { onConflict: 'id' });

    return { success: true };
  } catch (err) {
    console.warn('Attempt metadata sync warning:', err);
    return { success: false };
  }
};

/**
 * Check for in-progress session
 */
export const getInProgressAttempt = async (testId = 'ssc_cgl_tier1_mock_3', rollNumber = '2201048291') => {
  try {
    const client = getSupabase();
    if (!client) return null;

    const { data, error } = await client
      .from('test_attempts')
      .select('*')
      .eq('test_id', testId)
      .eq('roll_number', rollNumber)
      .eq('status', 'in_progress')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) return data;
  } catch (e) {
    console.warn('getInProgressAttempt error:', e);
  }
  return null;
};

/**
 * Final Submit of Test Attempt
 */
export const submitFinalAttempt = async (attemptData, detailedAnswers = []) => {
  try {
    const client = getSupabase();
    if (!client) return { success: false };

    await client
      .from('test_attempts')
      .upsert({
        ...attemptData,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (detailedAnswers.length > 0) {
      const responsesPayload = detailedAnswers.map(ans => ({
        attempt_id: String(attemptData.id),
        roll_number: attemptData.roll_number || '2201048291',
        candidate_name: attemptData.candidate_name || 'ANKIT SHARMA',
        test_id: attemptData.test_id || 'ssc_cgl_tier1_mock_3',
        question_number: Number(ans.question_number),
        section_name: ans.section_name,
        selected_option: ans.selected_option || null,
        time_taken_seconds: Number(ans.time_spent_seconds || 0),
        correct_option: ans.correct_option,
        is_correct: ans.is_correct,
        status: ans.status,
        recorded_at: new Date().toISOString()
      }));

      await client
        .from('user_responses')
        .upsert(responsesPayload, { onConflict: 'attempt_id,question_number' });
    }

    return { success: true };
  } catch (err) {
    console.error('Error submitting test to Supabase:', err);
    return { success: false };
  }
};

/**
 * Direct Upload Catalog of Questions to Supabase
 * Handles mock test metadata registration and batched questions insertion
 */
export const uploadQuestionsToSupabase = async (testConfig, questionsList, onProgress) => {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase client not connected. Please enter valid Project URL and API Key.');
  }

  // 1. Register Mock Test in mock_tests table
  if (onProgress) {
    onProgress({
      phase: 'test_meta',
      message: `Registering "${testConfig.title}" in mock_tests table...`
    });
  }

  try {
    const totalTimeMins = Math.round((testConfig.totalDurationSeconds || 5400) / 60);
    const secTimeMins = Math.round(totalTimeMins / (testConfig.sections?.length || 4));

    await client.from('mock_tests').upsert({
      id: testConfig.id,
      title: testConfig.title,
      total_questions: questionsList.length,
      total_time_minutes: totalTimeMins,
      sectional_time_minutes: secTimeMins,
      has_sectional_timing: true,
    }, { onConflict: 'id' });
  } catch (e) {
    console.warn('mock_tests registration note:', e);
  }

  // 2. Format questions
  const formattedQuestions = questionsList.map((q) => ({
    test_id: testConfig.id,
    question_number: q.question_number,
    part_number: q.part_number || 1,
    section_name: q.section_name || `PART-${q.part_number || 1}`,
    section_title: q.section_title,
    chapter_name: q.chapter_name || '',
    difficulty: q.difficulty || 'Moderate',
    question_text: q.question_text,
    question_text_hi: q.question_text_hi || null,
    options: q.options || {},
    options_hi: q.options_hi || {},
    correct_option: q.correct_option,
    solution_text: q.solution_text || null,
    solution_text_hi: q.solution_text_hi || null,
  }));

  // 3. Batch upload questions (25 per chunk)
  const BATCH_SIZE = 25;
  const total = formattedQuestions.length;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const chunk = formattedQuestions.slice(i, i + BATCH_SIZE);
    const toNum = Math.min(i + BATCH_SIZE, total);

    if (onProgress) {
      onProgress({
        phase: 'uploading',
        current: toNum,
        total: total,
        percent: Math.round((toNum / total) * 100),
        message: `Uploading Q${i + 1} to Q${toNum} of ${total} to Supabase...`
      });
    }

    const { error } = await client
      .from('questions')
      .upsert(chunk, { onConflict: 'test_id,question_number' });

    if (error) {
      throw new Error(`Batch upload error (Q${i + 1}-Q${toNum}): ${error.message}`);
    }
  }

  if (onProgress) {
    onProgress({
      phase: 'complete',
      current: total,
      total: total,
      percent: 100,
      message: `🎉 Successfully uploaded all ${total} questions for "${testConfig.title}" to Supabase!`
    });
  }

  return { success: true, count: total };
};
