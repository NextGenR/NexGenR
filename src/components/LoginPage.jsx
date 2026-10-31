import React, { useState, useEffect } from 'react';
import { User, Lock, ArrowRight, Plus, ShieldCheck, CheckCircle2, Monitor, Award } from 'lucide-react';

export const DEFAULT_CANDIDATES = [
  { name: 'Om', rollNo: 'RRB2026-OM01', systemNo: 'C9-LAB3-042' },
  { name: 'Nitin', rollNo: 'RRB2026-NT02', systemNo: 'C9-LAB3-043' },
  { name: 'Ankit Sharma', rollNo: '2201048291', systemNo: 'C9-LAB3-044' },
  { name: 'Shristi', rollNo: 'RRB2026-SH03', systemNo: 'C9-LAB3-045' },
];

export default function LoginPage({ onLogin, initialCandidate }) {
  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem('toppers_candidate_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read candidate list from storage:', e);
    }
    return DEFAULT_CANDIDATES;
  });

  const [selectedName, setSelectedName] = useState(() => {
    return initialCandidate?.name || candidates[0]?.name || 'Om';
  });

  // Adding custom name
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRollNo, setNewRollNo] = useState('');

  // Password / PIN
  const [password, setPassword] = useState('••••••••');

  const selectedCandidate = candidates.find(c => c.name === selectedName) || candidates[0];

  const handleAddNewCandidate = (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    const generatedRoll = newRollNo.trim() || `RRB2026-${trimmed.toUpperCase().substring(0, 4)}${Math.floor(10 + Math.random() * 90)}`;
    const newCandidate = {
      name: trimmed,
      rollNo: generatedRoll,
      systemNo: `C9-LAB3-0${Math.floor(40 + Math.random() * 50)}`,
    };

    const updated = [...candidates, newCandidate];
    setCandidates(updated);
    try {
      localStorage.setItem('toppers_candidate_list', JSON.stringify(updated));
    } catch (err) {}

    setSelectedName(trimmed);
    setIsAddingNew(false);
    setNewName('');
    setNewRollNo('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCandidate && onLogin) {
      onLogin(selectedCandidate);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#eef2f6] text-gray-900 font-sans select-none">
      {/* Top Banner - TCS iON CBT Header */}
      <header className="bg-[#1b4d89] text-white shadow-md border-b border-[#0d3463]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <span className="text-xl">🚆</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight uppercase">
                  RRB &amp; SSC Computer Based Test (CBT) Portal
                </h1>
                <span className="bg-amber-400 text-blue-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                  TCS iON Engine
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Railway Recruitment Board &amp; Staff Selection Commission Assessment System
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs text-blue-100">
            <div className="flex items-center space-x-1">
              <Monitor className="w-4 h-4 text-emerald-400" />
              <span>CBT Node: <strong>C9-LAB3</strong></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-gray-300 overflow-hidden animate-fade-in">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#1b4d89] to-[#2563eb] text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <h2 className="text-base font-bold tracking-tight">Candidate Login / Identify</h2>
            </div>
            <span className="text-[11px] font-mono bg-black/25 px-2 py-0.5 rounded text-amber-200">
              System: {selectedCandidate?.systemNo || 'C9-LAB3-042'}
            </span>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* Candidate Photo & System Info */}
            <div className="flex items-center space-x-4 p-3 bg-blue-50/70 rounded-lg border border-blue-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1b4d89] to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0 border-2 border-white">
                {selectedCandidate?.name ? selectedCandidate.name.substring(0, 2).toUpperCase() : 'OM'}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Candidate Name</span>
                <h3 className="font-extrabold text-gray-900 text-lg truncate leading-tight">
                  {selectedCandidate?.name || 'Om'}
                </h3>
                <span className="text-xs text-blue-800 font-mono font-medium block">
                  Roll No: <strong>{selectedCandidate?.rollNo || 'RRB2026-OM01'}</strong>
                </span>
              </div>
            </div>

            {/* Candidate Selector Dropdown */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Pick Candidate Name:</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(!isAddingNew)}
                    className="text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1 text-[11px]"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isAddingNew ? 'Cancel' : 'Add Other Name'}</span>
                  </button>
                </label>

                {!isAddingNew ? (
                  <div className="relative">
                    <select
                      value={selectedName}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setIsAddingNew(true);
                        } else {
                          setSelectedName(e.target.value);
                        }
                      }}
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer"
                    >
                      {candidates.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.rollNo})
                        </option>
                      ))}
                      <option value="__add_new__">+ Add Another Name...</option>
                    </select>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-lg space-y-2.5 animate-fade-in">
                    <span className="font-bold text-amber-950 block text-[11px]">
                      Enter New Candidate Details:
                    </span>
                    <input
                      type="text"
                      placeholder="Candidate Name (e.g. Rahul, Priya)"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 font-medium"
                      autoFocus
                    />
                    <input
                      type="text"
                      placeholder="Roll Number (optional)"
                      value={newRollNo}
                      onChange={(e) => setNewRollNo(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(false)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 rounded text-[11px] font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddNewCandidate}
                        disabled={!newName.trim()}
                        className="px-3 py-1 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white rounded text-[11px] font-bold shadow-xs"
                      >
                        Add &amp; Select
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Password / PIN field (default populated for CBT simulation) */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Candidate Password / PIN:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-mono tracking-widest text-gray-800 focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                  <div className="absolute right-3 top-2.5 text-[10px] text-gray-400 font-bold uppercase">
                    Virtual Keyboard Active
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#1b4d89] hover:bg-[#153e6e] text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <span>Sign In to CBT Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="border-t border-gray-200 pt-3 text-[11px] text-gray-500 space-y-1 text-center">
              <p>Candidate responses &amp; sectional times will be saved under <strong>{selectedCandidate?.name}</strong>.</p>
              <p className="text-gray-400">Strict TCS iON CBT Examination Simulation Protocol</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 border-t border-gray-300 text-gray-600 text-[11px] py-2 px-4 text-center">
        <span>© 2026 Railway Recruitment Board (RRB) &amp; SSC Assessment Portal • Powered by Supabase Cloud Engine</span>
      </footer>
    </div>
  );
}
