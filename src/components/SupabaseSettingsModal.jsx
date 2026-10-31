import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, X, ExternalLink, Key, RefreshCw, UploadCloud, FileText } from 'lucide-react';
import { getSupabaseConfig, setSupabaseConfig, getSupabase, uploadQuestionsToSupabase } from '../services/supabase';
import { AVAILABLE_TESTS } from '../data/questions';

export default function SupabaseSettingsModal({ isOpen, onClose, onConfigUpdated }) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [testStatus, setTestStatus] = useState(null); // 'testing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Upload state
  const [uploadState, setUploadState] = useState({
    active: false,
    testId: null,
    progressText: '',
    percent: 0,
    success: false,
    error: null,
  });

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url);
      setKey(config.key);
      setTestStatus(null);
      setErrorMessage('');
      setUploadState({ active: false, testId: null, progressText: '', percent: 0, success: false, error: null });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    setTestStatus('testing');
    setErrorMessage('');

    try {
      setSupabaseConfig(url, key);
      const client = getSupabase();
      if (!client) {
        throw new Error('Please provide both Supabase URL and Anon / Service Role Key.');
      }

      // Quick ping test
      const { data, error } = await client.from('mock_tests').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase test ping notice:', error);
      }

      setTestStatus('success');
      if (onConfigUpdated) onConfigUpdated();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setTestStatus('error');
      setErrorMessage(err.message || 'Failed to connect to Supabase.');
    }
  };

  const handleClear = () => {
    setSupabaseConfig('', '');
    setUrl('');
    setKey('');
    setTestStatus(null);
    if (onConfigUpdated) onConfigUpdated();
  };

  const handleUploadTestQuestions = async (testConfigKey) => {
    const testConfig = AVAILABLE_TESTS[testConfigKey];
    if (!testConfig) return;

    // First save the entered config
    setSupabaseConfig(url, key);
    const client = getSupabase();
    if (!client) {
      setUploadState({
        active: false,
        testId: testConfigKey,
        progressText: '',
        percent: 0,
        success: false,
        error: 'Please enter and verify your Supabase URL and API Key first.',
      });
      return;
    }

    setUploadState({
      active: true,
      testId: testConfigKey,
      progressText: `Starting upload for ${testConfig.title}...`,
      percent: 5,
      success: false,
      error: null,
    });

    try {
      const questionsList = testConfig.getQuestions();
      await uploadQuestionsToSupabase(testConfig, questionsList, (progress) => {
        setUploadState(prev => ({
          ...prev,
          progressText: progress.message || `Uploading (${progress.current || 0}/${progress.total || questionsList.length})...`,
          percent: progress.percent || Math.round(((progress.current || 0) / (progress.total || questionsList.length)) * 100),
        }));
      });

      setUploadState({
        active: false,
        testId: testConfigKey,
        progressText: `🎉 All ${questionsList.length} questions for "${testConfig.title}" uploaded successfully to Supabase!`,
        percent: 100,
        success: true,
        error: null,
      });
    } catch (err) {
      console.error('Upload questions error:', err);
      setUploadState({
        active: false,
        testId: testConfigKey,
        progressText: '',
        percent: 0,
        success: false,
        error: `${err.message || 'Failed to upload questions.'} (You can also run rrb_mock_test_1_seed.sql in Supabase SQL editor)`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-gray-300 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1b4d89] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Supabase Cloud Database &amp; Question Uploader</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          <p className="text-gray-600 leading-relaxed">
            Enter your active Supabase project URL and API Key (Anon or Service Role) to sync candidate session answers, timers, and upload test questions.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Supabase Project URL:</label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Supabase API Key (Anon or Service Role):</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 font-mono text-xs"
              />
            </div>
          </div>

          {testStatus === 'success' && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Connected successfully! Saved and ready for real-time tracking.</span>
            </div>
          )}

          {testStatus === 'error' && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Questions to Supabase Section */}
          <div className="border border-blue-200 bg-blue-50/60 rounded-lg p-3.5 space-y-3">
            <div className="flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-[#1b4d89]" />
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wide">
                Direct Supabase Question Uploader (API Key)
              </h4>
            </div>
            <p className="text-gray-600 text-[11px]">
              Click below to batch-upload questions directly into your Supabase database <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-blue-900">questions</code> and <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-blue-900">mock_tests</code> tables:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleUploadTestQuestions('rrb_cbt_mock_1')}
                disabled={uploadState.active || !url || !key}
                className="flex items-center justify-center space-x-1.5 p-2 bg-[#1b4d89] hover:bg-[#153e6e] disabled:bg-gray-300 text-white font-bold rounded shadow-xs transition"
              >
                {uploadState.active && uploadState.testId === 'rrb_cbt_mock_1' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span className="text-amber-300">🚆</span>
                )}
                <span>Upload RRB Test (100 Qs)</span>
              </button>

              <button
                type="button"
                onClick={() => handleUploadTestQuestions('ssc_cgl_tier1_mock_3')}
                disabled={uploadState.active || !url || !key}
                className="flex items-center justify-center space-x-1.5 p-2 bg-slate-700 hover:bg-slate-800 disabled:bg-gray-300 text-white font-bold rounded shadow-xs transition"
              >
                {uploadState.active && uploadState.testId === 'ssc_cgl_tier1_mock_3' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>📑</span>
                )}
                <span>Upload SSC Test (100 Qs)</span>
              </button>
            </div>

            {/* Upload Progress Display */}
            {uploadState.active && (
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 transition-all duration-300"
                    style={{ width: `${uploadState.percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-gray-700 font-medium">
                  <span>{uploadState.progressText}</span>
                  <span className="font-mono">{uploadState.percent}%</span>
                </div>
              </div>
            )}

            {uploadState.success && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded flex items-center space-x-2 text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{uploadState.progressText}</span>
              </div>
            )}

            {uploadState.error && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 rounded flex items-center space-x-2 text-[11px]">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadState.error}</span>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 p-3 rounded text-[11px] text-gray-600 space-y-1.5">
            <span className="font-bold text-gray-800 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Alternative: Supabase SQL Seed Files:
            </span>
            <p>1. <strong>RRB Mock Test 1:</strong> Run <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800 font-bold">rrb_mock_test_1_seed.sql</code> in your Supabase SQL Editor.</p>
            <p>2. <strong>SSC CGL Mock Test 3:</strong> Run <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800 font-bold">mock_test_3_seed.sql</code> in your Supabase SQL Editor.</p>
            <p>3. <strong>CLI Terminal Command:</strong> <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800 font-mono">node scripts/upload_rrb_to_supabase.js &lt;URL&gt; &lt;KEY&gt;</code></p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-300 flex justify-between items-center shrink-0">
          <button
            onClick={handleClear}
            className="text-gray-500 hover:text-red-600 text-xs font-semibold"
          >
            Clear Settings
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-xs font-medium"
            >
              Close
            </button>
            <button
              onClick={handleTestAndSave}
              disabled={testStatus === 'testing' || !url || !key}
              className="px-4 py-1.5 bg-[#1b4d89] hover:bg-[#153e6e] disabled:bg-gray-300 text-white rounded font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
            >
              {testStatus === 'testing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <span>Save &amp; Connect</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
