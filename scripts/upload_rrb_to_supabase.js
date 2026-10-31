/**
 * Upload RRB Mock Test 1 Questions to Supabase (ES Module)
 * Usage:
 *   node scripts/upload_rrb_to_supabase.js [SUPABASE_URL] [SUPABASE_KEY]
 * Or configure .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or service_role key)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Resolve credentials
let supabaseUrl = process.argv[2] || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
let supabaseKey = process.argv[3] || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// Read .env if not provided in args or env
if (supabaseUrl) {
  supabaseUrl = supabaseUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}
if (supabaseKey) {
  supabaseKey = supabaseKey.trim();
}

if (!supabaseUrl || !supabaseKey) {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
        supabaseUrl = supabaseUrl || trimmed.substring('VITE_SUPABASE_URL='.length).trim();
      }
      if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
        supabaseKey = supabaseKey || trimmed.substring('VITE_SUPABASE_ANON_KEY='.length).trim();
      }
    });
  }
}

if (supabaseUrl) {
  supabaseUrl = supabaseUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}
if (supabaseKey) {
  supabaseKey = supabaseKey.trim();
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL and Key are required.');
  console.error('Usage: node scripts/upload_rrb_to_supabase.js <SUPABASE_URL> <SUPABASE_API_KEY>');
  process.exit(1);
}

console.log('----------------------------------------------------');
console.log('🚀 Connecting to Supabase at:', supabaseUrl);
console.log('🔑 Using API Key (length:', supabaseKey.length, ')');
console.log('----------------------------------------------------');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function upload() {
  const rrbJsonPath = path.join(__dirname, '..', 'RRB_MOCK_JSON', 'RRB_MOCKTEST_1_v2.json');
  if (!fs.existsSync(rrbJsonPath)) {
    console.error('❌ Could not find RRB JSON file at:', rrbJsonPath);
    process.exit(1);
  }

  const rawQuestions = JSON.parse(fs.readFileSync(rrbJsonPath, 'utf8'));
  console.log(`📂 Loaded ${rawQuestions.length} questions from RRB_MOCKTEST_1_v2.json`);

  // 1. Upsert mock_tests entry
  console.log('\n1️⃣ Upserting Mock Test metadata into public.mock_tests...');
  const testPayload = {
    id: 'rrb_cbt_mock_1',
    title: 'RRB Full Mock Test 1 (TCS iON CBT Pattern)',
    total_questions: 100,
    total_time_minutes: 90,
    sectional_time_minutes: 23,
    has_sectional_timing: true,
  };

  const { error: testError } = await supabase
    .from('mock_tests')
    .upsert(testPayload, { onConflict: 'id' });

  if (testError) {
    console.warn('⚠️ Warning on mock_tests upsert (table might not exist yet or RLS policy required):', testError.message);
    console.log('💡 Note: You can run rrb_mock_test_1_seed.sql in Supabase SQL Editor if tables need creation.');
  } else {
    console.log('✅ Mock Test metadata registered successfully!');
  }

  // 2. Format questions payload
  const formattedQuestions = rawQuestions.map(q => ({
    test_id: 'rrb_cbt_mock_1',
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

  // 3. Batch upload questions in chunks of 25
  const BATCH_SIZE = 25;
  console.log(`\n2️⃣ Uploading ${formattedQuestions.length} questions in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < formattedQuestions.length; i += BATCH_SIZE) {
    const chunk = formattedQuestions.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from('questions')
      .upsert(chunk, { onConflict: 'test_id,question_number' });

    if (error) {
      console.error(`❌ Batch failed at questions ${i + 1} to ${i + chunk.length}:`, error.message);
      console.log('💡 Tip: Run rrb_mock_test_1_seed.sql in Supabase SQL Editor to bypass client-side RLS restrictions.');
      process.exit(1);
    }
    console.log(`  ✓ Uploaded questions ${i + 1} to ${Math.min(i + BATCH_SIZE, formattedQuestions.length)} / ${formattedQuestions.length}`);
  }

  // 4. Verify count
  console.log('\n3️⃣ Verifying uploaded questions count in Supabase...');
  const { count, error: countError } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('test_id', 'rrb_cbt_mock_1');

  if (countError) {
    console.warn('⚠️ Verification query note:', countError.message);
  } else {
    console.log(`🎉 SUCCESS! Supabase contains ${count} questions for RRB Mock Test 1!`);
  }
}

upload().catch(err => {
  console.error('\n❌ Upload failed with error:', err.message);
  console.log('💡 If your Supabase instance is paused or offline, run rrb_mock_test_1_seed.sql in Supabase Dashboard SQL editor.');
  process.exit(1);
});
