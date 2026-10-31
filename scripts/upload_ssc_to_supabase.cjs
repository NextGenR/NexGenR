const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const url = 'https://zgxskpqsjylbwrhhrzim.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpneHNrcHFzanlsYndyaGhyemltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODY0MDIsImV4cCI6MjEwMjk2MjQwMn0.1RSVtWx8gxJhQcmDfJMvRfRLMvl4ju9GuwxgiKn5f8w';

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function uploadSsc() {
  const sscData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'ssc_cgl_mock_test_3.json'), 'utf8'));
  console.log(`Loaded ${sscData.length} SSC questions.`);

  await supabase.from('mock_tests').upsert({
    id: 'ssc_cgl_tier1_mock_3',
    title: 'SSC CGL Tier-I Full Mock Test 3 (TCS iON CBT Pattern)',
    total_questions: 100,
    total_time_minutes: 60,
    sectional_time_minutes: 15,
    has_sectional_timing: true,
  }, { onConflict: 'id' });
  console.log('SSC Mock Test metadata registered.');

  const formatted = sscData.map((q) => ({
    test_id: 'ssc_cgl_tier1_mock_3',
    question_number: q.question_number,
    part_number: q.part_number || (Math.floor((q.question_number - 1) / 25) + 1),
    section_name: q.section_name || `PART-${Math.floor((q.question_number - 1) / 25) + 1}`,
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

  const BATCH_SIZE = 25;
  for (let i = 0; i < formatted.length; i += BATCH_SIZE) {
    const chunk = formatted.slice(i, i + BATCH_SIZE);
    await supabase.from('questions').upsert(chunk, { onConflict: 'test_id,question_number' });
    console.log(`  ✓ Uploaded SSC Q${i + 1} to Q${i + chunk.length}`);
  }

  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('test_id', 'ssc_cgl_tier1_mock_3');
  console.log(`🎉 SSC Mock Test verified: ${count} questions in Supabase!`);
}

uploadSsc().catch(console.error);

