const fs = require('fs');
const path = require('path');

const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'ssc_cgl_mock_test_1.json'), 'utf8'));

console.log(`Loaded ${mockData.length} questions from JSON.`);

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSC CGL Tier-1 Mock Test | ToppersMock CBT Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #00a8a8;
      --primary-dark: #008787;
      --primary-light: #e6f7f7;
      --navy-900: #0b192c;
      --navy-800: #13243c;
      --navy-700: #1e3a5f;
      --navy-50: #f0f4f9;
      --text-main: #1f2937;
      --text-muted: #6b7280;
      --border-color: #e5e7eb;
      --bg-page: #f4f6f9;
      --bg-card: #ffffff;
      
      /* Status Palette Colors matching ToppersMock / TCS iON */
      --status-answered: #22c55e;
      --status-answered-bg: #dcfce7;
      --status-answered-text: #15803d;
      
      --status-not-answered: #ef4444;
      --status-not-answered-bg: #fee2e2;
      --status-not-answered-text: #b91c1c;
      
      --status-not-visited: #9ca3af;
      --status-not-visited-bg: #f3f4f6;
      --status-not-visited-text: #4b5563;
      
      --status-marked: #8b5cf6;
      --status-marked-bg: #ede9fe;
      --status-marked-text: #6d28d9;
      
      --status-marked-answered: #8b5cf6;
      
      --font-scale: 16px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: 'Inter', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: var(--font-scale);
      color: var(--text-main);
      background-color: var(--bg-page);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
    }

    /* Top Navigation Bar */
    .top-header {
      background: linear-gradient(90deg, #0e1e38 0%, #172c4d 100%);
      color: #ffffff;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.18);
      z-index: 50;
      flex-shrink: 0;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      background: #00a8a8;
      color: white;
      font-weight: 800;
      font-size: 1.1rem;
      padding: 4px 10px;
      border-radius: 6px;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 8px rgba(0, 168, 168, 0.4);
    }

    .brand-logo svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    .exam-title-badge {
      display: flex;
      flex-direction: column;
    }

    .exam-title-main {
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.2px;
      color: #ffffff;
    }

    .exam-title-sub {
      font-size: 0.72rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .live-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      background-color: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 8px #22c55e;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .timer-container {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 6px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .timer-icon {
      color: #38bdf8;
      display: flex;
      align-items: center;
    }

    .timer-label {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .timer-display {
      font-family: 'Inter', monospace;
      font-size: 1.15rem;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 1px;
    }

    .timer-display.warning {
      color: #f87171;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      50% { opacity: 0.6; }
    }

    .quick-tools {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tool-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #e2e8f0;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s ease;
    }

    .tool-btn:hover {
      background: rgba(255, 255, 255, 0.18);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .tool-btn svg {
      width: 14px;
      height: 14px;
    }

    .user-profile-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.06);
      padding: 4px 10px 4px 6px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00a8a8, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: white;
    }

    .candidate-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: #f1f5f9;
    }

    /* Section Navigation Bar */
    .section-nav-bar {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      flex-shrink: 0;
      height: 48px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .section-tabs {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 100%;
      overflow-x: auto;
    }

    .section-tab-btn {
      height: 100%;
      padding: 0 16px;
      border: none;
      background: transparent;
      color: #4b5563;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .section-tab-btn:hover {
      color: var(--primary);
      background: #f8fafc;
    }

    .section-tab-btn.active {
      color: var(--primary);
      font-weight: 700;
    }

    .section-tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background-color: var(--primary);
      border-radius: 3px 3px 0 0;
    }

    .section-count-badge {
      font-size: 0.7rem;
      background: #e2e8f0;
      color: #334155;
      padding: 2px 7px;
      border-radius: 12px;
      font-weight: 600;
    }

    .section-tab-btn.active .section-count-badge {
      background: var(--primary-light);
      color: var(--primary);
    }

    .lang-font-control {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .view-lang-select {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }

    .view-lang-select select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      background-color: #f8fafc;
      font-size: 0.8rem;
      font-weight: 600;
      color: #0f172a;
      cursor: pointer;
      outline: none;
    }

    .view-lang-select select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-light);
    }

    .font-size-adjuster {
      display: flex;
      align-items: center;
      background: #f1f5f9;
      border-radius: 6px;
      padding: 2px;
      border: 1px solid #e2e8f0;
    }

    .font-btn {
      border: none;
      background: transparent;
      padding: 3px 8px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #475569;
      cursor: pointer;
      border-radius: 4px;
    }

    .font-btn:hover {
      background: #ffffff;
      color: var(--primary);
      box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    }

    /* Main Workspace Layout */
    .app-workspace {
      display: flex;
      flex: 1;
      height: calc(100vh - 108px);
      overflow: hidden;
      position: relative;
    }

    /* Left Area: Question Screen */
    .question-screen {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      overflow: hidden;
      border-right: 1px solid var(--border-color);
    }

    .question-header-bar {
      padding: 10px 1.5rem;
      border-bottom: 1px solid #edf2f7;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fafbfc;
      flex-shrink: 0;
    }

    .q-number-pill {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .q-no-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
    }

    .marks-badge {
      font-size: 0.75rem;
      padding: 3px 8px;
      border-radius: 4px;
      background: #e0f2fe;
      color: #0369a1;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .neg-marks {
      color: #b91c1c;
      background: #fee2e2;
    }

    .q-actions-inline {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .bookmark-btn {
      background: transparent;
      border: 1px solid #cbd5e1;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .bookmark-btn.bookmarked {
      background: #fef3c7;
      border-color: #f59e0b;
      color: #b45309;
    }

    .bookmark-btn svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }

    /* Question Content Body */
    .question-content-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 2rem;
    }

    .q-text-box {
      font-size: 1.05rem;
      line-height: 1.65;
      color: #1e293b;
      font-weight: 500;
      margin-bottom: 1.5rem;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .q-text-box.hindi-font {
      font-family: 'Noto Sans Devanagari', sans-serif;
      line-height: 1.8;
      font-size: 1.1rem;
    }

    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 850px;
    }

    .option-card {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 12px 18px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
      cursor: pointer;
      transition: all 0.18s ease;
      position: relative;
    }

    .option-card:hover {
      border-color: #93c5fd;
      background: #f8fafc;
      transform: translateY(-1px);
    }

    .option-card.selected {
      border-color: #00a8a8;
      background: #f0fdfa;
      box-shadow: 0 2px 8px rgba(0, 168, 168, 0.15);
    }

    .option-radio {
      appearance: none;
      width: 20px;
      height: 20px;
      border: 2px solid #cbd5e1;
      border-radius: 50%;
      margin-top: 3px;
      outline: none;
      cursor: pointer;
      display: grid;
      place-content: center;
      flex-shrink: 0;
      transition: border-color 0.2s;
    }

    .option-card.selected .option-radio {
      border-color: #00a8a8;
    }

    .option-card.selected .option-radio::before {
      content: '';
      width: 10px;
      height: 10px;
      background: #00a8a8;
      border-radius: 50%;
    }

    .option-label {
      font-weight: 700;
      color: #64748b;
      font-size: 0.95rem;
      min-width: 22px;
      padding-top: 1px;
    }

    .option-card.selected .option-label {
      color: #00a8a8;
    }

    .option-text {
      flex: 1;
      font-size: 1rem;
      line-height: 1.5;
      color: #334155;
      padding-top: 1px;
      white-space: pre-wrap;
    }

    .option-text.hindi-font {
      font-family: 'Noto Sans Devanagari', sans-serif;
    }

    /* Bottom Action Bar */
    .bottom-action-bar {
      padding: 12px 1.5rem;
      background: #ffffff;
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.03);
    }

    .action-group-left, .action-group-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn {
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.18s ease;
      border: 1px solid transparent;
      outline: none;
    }

    .btn:active {
      transform: scale(0.98);
    }

    .btn-secondary {
      background: #ffffff;
      border-color: #cbd5e1;
      color: #475569;
    }

    .btn-secondary:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
      color: #1e293b;
    }

    .btn-clear {
      background: #ffffff;
      border-color: #fca5a5;
      color: #dc2626;
    }

    .btn-clear:hover {
      background: #fef2f2;
      border-color: #f87171;
    }

    .btn-review {
      background: #f5f3ff;
      border-color: #c4b5fd;
      color: #7c3aed;
    }

    .btn-review:hover {
      background: #ede9fe;
      border-color: #a78bfa;
    }

    .btn-save-next {
      background: #10b981;
      color: #ffffff;
      border-color: #059669;
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
    }

    .btn-save-next:hover {
      background: #059669;
      box-shadow: 0 3px 8px rgba(16, 185, 129, 0.4);
    }

    .btn-submit-main {
      background: #0284c7;
      color: #ffffff;
      border-color: #0369a1;
      padding: 9px 24px;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);
    }

    .btn-submit-main:hover {
      background: #0369a1;
    }

    /* Right Sidebar: Palette & Status */
    .sidebar-palette {
      width: 340px;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.3s ease;
      position: relative;
    }

    .sidebar-palette.collapsed {
      width: 0;
      overflow: hidden;
    }

    .toggle-sidebar-btn {
      position: absolute;
      top: 50%;
      left: -14px;
      transform: translateY(-50%);
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #0e1e38;
      color: #ffffff;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20;
    }

    .toggle-sidebar-btn svg {
      width: 14px;
      height: 14px;
      transition: transform 0.3s;
    }

    .sidebar-palette.collapsed .toggle-sidebar-btn svg {
      transform: rotate(180deg);
    }

    .candidate-card-summary {
      padding: 12px 16px;
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .candidate-img-box {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: #64748b;
      font-weight: 700;
      border: 1px solid #cbd5e1;
    }

    .candidate-details {
      flex: 1;
    }

    .candidate-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: #0f172a;
    }

    .candidate-sub {
      font-size: 0.74rem;
      color: #64748b;
    }

    /* Legend Grid */
    .status-legend-box {
      padding: 12px 14px;
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 10px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.74rem;
      font-weight: 600;
      color: #475569;
    }

    .legend-badge {
      width: 26px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.72rem;
      font-weight: 700;
      color: #ffffff;
      flex-shrink: 0;
      position: relative;
    }

    .badge-answered {
      background-color: var(--status-answered);
      clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%);
    }

    .badge-not-answered {
      background-color: var(--status-not-answered);
      clip-path: polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%);
    }

    .badge-not-visited {
      background-color: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }

    .badge-marked {
      background-color: var(--status-marked);
      border-radius: 50%;
    }

    .badge-marked-answered {
      background-color: var(--status-marked);
      border-radius: 50%;
    }

    .badge-marked-answered::after {
      content: '';
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 8px;
      height: 8px;
      background-color: #22c55e;
      border-radius: 50%;
      border: 1.5px solid #ffffff;
    }

    /* Palette Filter & Header */
    .palette-header-section {
      padding: 10px 14px;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
    }

    .palette-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .palette-filter-select {
      padding: 3px 6px;
      font-size: 0.74rem;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      outline: none;
    }

    /* Palette Numbers Grid */
    .palette-grid-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 14px 12px;
    }

    .palette-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
    }

    .palette-btn {
      height: 38px;
      border: none;
      font-size: 0.86rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .palette-btn:hover {
      transform: scale(1.08);
      z-index: 2;
    }

    .palette-btn.current {
      box-shadow: 0 0 0 3px #0284c7 !important;
      font-weight: 900;
      transform: scale(1.05);
    }

    /* Palette status shapes & colors */
    .p-answered {
      background-color: var(--status-answered);
      color: #ffffff;
      clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%);
    }

    .p-not-answered {
      background-color: var(--status-not-answered);
      color: #ffffff;
      clip-path: polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%);
    }

    .p-not-visited {
      background-color: #ffffff;
      color: #475569;
      border: 1.5px solid #cbd5e1;
      border-radius: 4px;
    }

    .p-marked {
      background-color: var(--status-marked);
      color: #ffffff;
      border-radius: 50%;
    }

    .p-marked-answered {
      background-color: var(--status-marked);
      color: #ffffff;
      border-radius: 50%;
    }

    .p-marked-answered::after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 9px;
      height: 9px;
      background-color: #22c55e;
      border-radius: 50%;
      border: 2px solid #ffffff;
    }

    /* Modals */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(3px);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.2s ease;
    }

    .modal-overlay.active {
      display: flex;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-card {
      background: #ffffff;
      border-radius: 12px;
      width: 100%;
      max-width: 780px;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      animation: slideUp 0.25s ease;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-header {
      padding: 16px 20px;
      background: #0f172a;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close-btn:hover {
      color: #ffffff;
    }

    .modal-body {
      padding: 20px;
      overflow-y: auto;
      font-size: 0.92rem;
      line-height: 1.6;
      color: #334155;
    }

    .modal-footer {
      padding: 14px 20px;
      background: #f8fafc;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    /* Modal Tables */
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 0.85rem;
    }

    .summary-table th, .summary-table td {
      border: 1px solid #e2e8f0;
      padding: 10px 12px;
      text-align: center;
    }

    .summary-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
    }

    .summary-table td:first-child, .summary-table th:first-child {
      text-align: left;
    }

    .summary-table tr:hover {
      background: #f8fafc;
    }

    /* Result Dashboard Styles */
    .result-dashboard-wrapper {
      position: fixed;
      inset: 0;
      background: #f1f5f9;
      z-index: 2000;
      display: none;
      flex-direction: column;
      overflow-y: auto;
    }

    .result-dashboard-wrapper.active {
      display: flex;
    }

    .result-header {
      background: linear-gradient(135deg, #0e1e38 0%, #1e3a5f 100%);
      color: white;
      padding: 1.75rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .result-header h1 {
      font-size: 1.6rem;
      font-weight: 800;
      margin-bottom: 4px;
    }

    .result-header p {
      color: #94a3b8;
      font-size: 0.88rem;
    }

    .result-scorecard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      padding: 1.5rem 2rem 0;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }

    .stat-card.score::before { background: #00a8a8; }
    .stat-card.accuracy::before { background: #3b82f6; }
    .stat-card.correct::before { background: #22c55e; }
    .stat-card.incorrect::before { background: #ef4444; }
    .stat-card.unattempted::before { background: #9ca3af; }

    .stat-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-val {
      font-size: 1.85rem;
      font-weight: 800;
      color: #0f172a;
      margin-top: 6px;
    }

    .stat-sub {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: 4px;
    }

    .result-container-body {
      max-width: 1200px;
      margin: 1.5rem auto 3rem;
      width: 100%;
      padding: 0 2rem;
    }

    .section-breakdown-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 20px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }

    .card-heading {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Solutions View */
    .solutions-panel {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .sol-filter-pills {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .sol-pill {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #475569;
      transition: all 0.2s;
    }

    .sol-pill:hover, .sol-pill.active {
      background: #0f172a;
      color: #ffffff;
      border-color: #0f172a;
    }

    .sol-q-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      background: #ffffff;
    }

    .sol-q-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f1f5f9;
    }

    .sol-status-tag {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.76rem;
      font-weight: 700;
    }

    .tag-correct {
      background: #dcfce7;
      color: #15803d;
    }

    .tag-incorrect {
      background: #fee2e2;
      color: #b91c1c;
    }

    .tag-unattempted {
      background: #f1f5f9;
      color: #64748b;
    }

    .sol-explanation-box {
      margin-top: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #00a8a8;
      border-radius: 8px;
      padding: 16px;
      font-size: 0.92rem;
      line-height: 1.6;
    }

    .sol-explanation-box strong {
      color: #0f172a;
    }

    .opt-correct-highlight {
      border-color: #22c55e !important;
      background: #f0fdf4 !important;
      font-weight: 600;
    }

    .opt-wrong-highlight {
      border-color: #ef4444 !important;
      background: #fef2f2 !important;
      font-weight: 600;
    }

    /* Responsive adjustments */
    @media (max-width: 900px) {
      .sidebar-palette {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        box-shadow: -4px 0 15px rgba(0,0,0,0.15);
        z-index: 40;
      }
      .question-content-scroll {
        padding: 1rem;
      }
      .bottom-action-bar {
        padding: 10px;
      }
      .btn {
        padding: 8px 12px;
        font-size: 0.8rem;
      }
    }
  </style>
</head>
<body>

  <!-- Top Navigation Header -->
  <header class="top-header">
    <div class="brand-section">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <span>ToppersMock</span>
      </div>
      <div class="exam-title-badge">
        <div class="exam-title-main">SSC CGL Tier-I (CBT) Full Mock Test 1</div>
        <div class="exam-title-sub">
          <span class="live-dot"></span>
          <span>100 Questions &bull; 200 Marks &bull; 60 Minutes</span>
        </div>
      </div>
    </div>

    <div class="header-actions">
      <!-- Countdown Timer -->
      <div class="timer-container" title="Exam Timer">
        <div class="timer-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <div class="timer-label">Time Left</div>
          <div class="timer-display" id="exam-timer">60:00</div>
        </div>
      </div>

      <!-- Quick Tools -->
      <div class="quick-tools">
        <button class="tool-btn" id="btn-open-instructions" title="View Exam Instructions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>Instructions</span>
        </button>
        <button class="tool-btn" id="btn-open-question-paper" title="View Question Paper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <span>Question Paper</span>
        </button>
        <button class="tool-btn" id="btn-toggle-sound" title="Toggle Audio Feedback">
          <span id="sound-indicator">🔊</span>
        </button>
        <button class="tool-btn" id="btn-fullscreen" title="Toggle Fullscreen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </button>
        <button class="tool-btn" id="btn-open-cloud-sync" title="Configure Supabase Cloud Sync">
          <span>☁️ Database</span>
        </button>
      </div>

      <!-- User Profile Badge -->
      <div class="user-profile-badge">
        <div class="avatar">👤</div>
        <span class="candidate-name">Roll: 2401098421</span>
      </div>
    </div>
  </header>

  <!-- Section Selection Bar -->
  <nav class="section-nav-bar">
    <div class="section-tabs" id="section-tabs-container">
      <!-- Injected via JavaScript -->
    </div>

    <div class="lang-font-control">
      <div class="view-lang-select">
        <span>View In:</span>
        <select id="global-lang-select">
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
      </div>

      <div class="font-size-adjuster">
        <button class="font-btn" id="font-decrease" title="Decrease Font">A-</button>
        <button class="font-btn" id="font-reset" title="Default Font">A</button>
        <button class="font-btn" id="font-increase" title="Increase Font">A+</button>
      </div>
    </div>
  </nav>

  <!-- App Main Workspace -->
  <main class="app-workspace">
    <!-- Left: Question Screen -->
    <section class="question-screen">
      <div class="question-header-bar">
        <div class="q-number-pill">
          <span class="q-no-title" id="current-q-title">Question No. 1</span>
          <span class="marks-badge">+2.00</span>
          <span class="marks-badge neg-marks">-0.50</span>
        </div>

        <div class="q-actions-inline">
          <button class="bookmark-btn" id="btn-bookmark">
            <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <span id="bookmark-text">Bookmark</span>
          </button>
        </div>
      </div>

      <div class="question-content-scroll" id="question-scroll-area">
        <div class="q-text-box" id="question-text">
          <!-- Dynamic Question Text -->
        </div>

        <div class="options-grid" id="options-container">
          <!-- Dynamic Options -->
        </div>
      </div>

      <!-- Bottom Action Bar -->
      <footer class="bottom-action-bar">
        <div class="action-group-left">
          <button class="btn btn-review" id="btn-mark-review">Mark for Review & Next</button>
          <button class="btn btn-clear" id="btn-clear-response">Clear Response</button>
        </div>

        <div class="action-group-right">
          <button class="btn btn-secondary" id="btn-prev">Previous</button>
          <button class="btn btn-save-next" id="btn-save-next">Save & Next</button>
          <button class="btn btn-submit-main" id="btn-submit-exam">Submit Test</button>
        </div>
      </footer>
    </section>

    <!-- Right: Palette Sidebar -->
    <aside class="sidebar-palette" id="sidebar-palette">
      <button class="toggle-sidebar-btn" id="btn-toggle-sidebar" title="Collapse / Expand Palette">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <div class="candidate-card-summary">
        <div class="candidate-img-box">👤</div>
        <div class="candidate-details">
          <div class="candidate-title">Roll No: 2401098421</div>
          <div class="candidate-sub">SSC CGL 2026 Tier-1 Mock</div>
        </div>
      </div>

      <!-- Status Legend -->
      <div class="status-legend-box">
        <div class="legend-item">
          <span class="legend-badge badge-answered" id="legend-answered-count">0</span>
          <span>Answered</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge badge-not-answered" id="legend-not-answered-count">0</span>
          <span>Not Answered</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge badge-not-visited" id="legend-not-visited-count">100</span>
          <span>Not Visited</span>
        </div>
        <div class="legend-item">
          <span class="legend-badge badge-marked" id="legend-marked-count">0</span>
          <span>Marked for Review</span>
        </div>
        <div class="legend-item" style="grid-column: span 2;">
          <span class="legend-badge badge-marked-answered" id="legend-marked-answered-count">0</span>
          <span>Answered & Marked for Review</span>
        </div>
      </div>

      <!-- Palette Header & Filter -->
      <div class="palette-header-section">
        <span class="palette-title" id="palette-section-title">General Intelligence & Reasoning</span>
        <select class="palette-filter-select" id="palette-filter">
          <option value="section">This Section</option>
          <option value="all">All 100 Questions</option>
        </select>
      </div>

      <!-- Palette Grid Numbers -->
      <div class="palette-grid-scroll">
        <div class="palette-grid" id="palette-grid">
          <!-- Dynamic Palette Buttons -->
        </div>
      </div>
    </aside>
  </main>

  <!-- Instructions Modal -->
  <div class="modal-overlay" id="modal-instructions">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">SSC CGL Tier-I Instructions</div>
        <button class="modal-close-btn" data-close="modal-instructions">&times;</button>
      </div>
      <div class="modal-body">
        <h4 style="margin-bottom: 8px; color: #0f172a;">General Instructions:</h4>
        <ol style="margin-left: 20px; margin-bottom: 16px;">
          <li>Total duration of examination is <strong>60 minutes</strong> (1 Hour).</li>
          <li>The clock will be set at the server. The countdown timer at the top displays remaining time.</li>
          <li>The examination consists of <strong>100 questions</strong> across 4 sections:
            <ul>
              <li>Part A: General Intelligence & Reasoning (25 Qs - 50 Marks)</li>
              <li>Part B: General Awareness (25 Qs - 50 Marks)</li>
              <li>Part C: Quantitative Aptitude (25 Qs - 50 Marks)</li>
              <li>Part D: English Comprehension (25 Qs - 50 Marks)</li>
            </ul>
          </li>
          <li><strong>Marking Scheme:</strong> +2 marks for each correct answer; -0.50 negative marking for each incorrect answer.</li>
        </ol>

        <h4 style="margin-bottom: 8px; color: #0f172a;">Question Palette Legend:</h4>
        <p style="margin-bottom: 8px;">The Question Palette displays the status of each question using the following symbols:</p>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-left: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="legend-badge badge-not-visited">1</span> You have not visited the question yet.
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="legend-badge badge-not-answered">2</span> You have not answered the question.
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="legend-badge badge-answered">3</span> You have answered the question.
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="legend-badge badge-marked">4</span> You have NOT answered the question, but have marked the question for review.
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="legend-badge badge-marked-answered">5</span> The question is answered and marked for review (evaluated in final scoring).
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-close="modal-instructions">Close</button>
      </div>
    </div>
  </div>

  <!-- Question Paper View Modal -->
  <div class="modal-overlay" id="modal-question-paper">
    <div class="modal-card" style="max-width: 900px;">
      <div class="modal-header">
        <div class="modal-title">Question Paper Overview</div>
        <button class="modal-close-btn" data-close="modal-question-paper">&times;</button>
      </div>
      <div class="modal-body" id="question-paper-body">
        <!-- Rendered all questions -->
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-close="modal-question-paper">Close</button>
      </div>
    </div>
  </div>

  <!-- Submit Test Confirmation Modal -->
  <div class="modal-overlay" id="modal-submit-confirm">
    <div class="modal-card" style="max-width: 720px;">
      <div class="modal-header">
        <div class="modal-title">Submit Examination Confirmation</div>
        <button class="modal-close-btn" data-close="modal-submit-confirm">&times;</button>
      </div>
      <div class="modal-body">
        <p style="font-weight: 600; color: #0f172a; margin-bottom: 12px;">Exam Summary by Section:</p>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Section Name</th>
              <th>Total Qs</th>
              <th>Answered</th>
              <th>Not Answered</th>
              <th>Marked</th>
              <th>Not Visited</th>
            </tr>
          </thead>
          <tbody id="submit-summary-tbody">
            <!-- Dynamic rows -->
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 12px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; color: #92400e; font-size: 0.88rem;">
          ⚠️ <strong>Notice:</strong> Are you sure you want to finish and submit the test? Once submitted, you cannot change your answers.
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-close="modal-submit-confirm">Resume Test</button>
        <button class="btn btn-submit-main" id="btn-confirm-final-submit">Yes, Submit Now</button>
      </div>
    </div>
  </div>

  <!-- Supabase Cloud Sync Modal -->
  <div class="modal-overlay" id="modal-cloud-sync">
    <div class="modal-card" style="max-width: 580px;">
      <div class="modal-header">
        <div class="modal-title">Supabase Database API Keys</div>
        <button class="modal-close-btn" data-close="modal-cloud-sync">&times;</button>
      </div>
      <div class="modal-body">
        <p style="margin-bottom: 14px; font-size: 0.88rem; color: #475569; line-height: 1.5;">
          Connect your Supabase project to automatically save candidate attempts, question answers, scores, and timestamps in real-time.
        </p>

        <div style="margin-bottom: 14px;">
          <label style="display: block; font-weight: 700; margin-bottom: 6px; font-size: 0.82rem; color: #1e293b;">
            Supabase Project URL
          </label>
          <input type="text" id="input-supabase-url" placeholder="https://your-project.supabase.co" 
            style="width: 100%; padding: 9px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.88rem; font-family: monospace; outline: none;">
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; font-weight: 700; margin-bottom: 6px; font-size: 0.82rem; color: #1e293b;">
            Supabase Anon Public API Key
          </label>
          <input type="password" id="input-supabase-key" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
            style="width: 100%; padding: 9px 12px; border: 1.5px solid #cbd5e1; border-radius: 6px; font-size: 0.88rem; font-family: monospace; outline: none;">
        </div>

        <div id="supabase-status-message" style="display: none; padding: 10px 14px; border-radius: 6px; font-size: 0.84rem; margin-bottom: 12px;"></div>

        <div style="font-size: 0.76rem; color: #64748b; background: #f8fafc; padding: 10px 12px; border-radius: 6px; border: 1px solid #e2e8f0; line-height: 1.5;">
          💡 <strong>Where to find:</strong> Open Supabase Dashboard &rarr; <strong>Project Settings</strong> &rarr; <strong>API</strong> &rarr; Copy <em>Project URL</em> and <em>anon public key</em>.
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-close="modal-cloud-sync">Close</button>
        <button class="btn btn-save-next" id="btn-save-supabase-config">Save Credentials</button>
      </div>
    </div>
  </div>

  <!-- Result & Detailed Analytics Dashboard -->
  <div class="result-dashboard-wrapper" id="result-dashboard">
    <div class="result-header">
      <div>
        <h1>SSC CGL Tier-1 Mock Test 1 - ToppersMock Report</h1>
        <p>Roll No: 2401098421 | Date: <span id="exam-date-text"></span></p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-secondary" id="btn-print-result" style="color: #0f172a;">Print Report</button>
        <button class="btn btn-save-next" id="btn-reattempt-test">Re-attempt Test</button>
      </div>
    </div>

    <!-- Overall Statistics Cards -->
    <div class="result-scorecard-grid">
      <div class="stat-card score">
        <div class="stat-label">Total Score</div>
        <div class="stat-val" id="res-score">0 / 200</div>
        <div class="stat-sub" id="res-cutoff-status">Cutoff Target: 135+</div>
      </div>
      <div class="stat-card accuracy">
        <div class="stat-label">Accuracy</div>
        <div class="stat-val" id="res-accuracy">0%</div>
        <div class="stat-sub" id="res-percentile">Est. Percentile: --</div>
      </div>
      <div class="stat-card correct">
        <div class="stat-label">Correct Answers</div>
        <div class="stat-val" id="res-correct-count" style="color: #16a34a;">0</div>
        <div class="stat-sub" id="res-marks-plus">+0 Marks</div>
      </div>
      <div class="stat-card incorrect">
        <div class="stat-label">Incorrect Answers</div>
        <div class="stat-val" id="res-incorrect-count" style="color: #dc2626;">0</div>
        <div class="stat-sub" id="res-marks-minus">-0 Marks</div>
      </div>
      <div class="stat-card unattempted">
        <div class="stat-label">Unattempted</div>
        <div class="stat-val" id="res-unattempted-count">100</div>
        <div class="stat-sub">Skipped Questions</div>
      </div>
    </div>

    <!-- Main Result Content -->
    <div class="result-container-body">
      <!-- Section-wise Breakdown -->
      <div class="section-breakdown-card">
        <div class="card-heading">
          <span>Section-wise Performance Breakdown</span>
        </div>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Section Name</th>
              <th>Attempted</th>
              <th>Correct</th>
              <th>Incorrect</th>
              <th>Accuracy</th>
              <th>Score (Marks)</th>
            </tr>
          </thead>
          <tbody id="result-section-tbody">
            <!-- Dynamic Section Performance -->
          </tbody>
        </table>
      </div>

      <!-- Detailed Solutions & Explanations -->
      <div class="solutions-panel">
        <div class="card-heading">
          <span>Detailed Solutions & Step-by-Step Explanations</span>
          <div class="view-lang-select" style="font-size: 0.85rem;">
            <span>Solution Language:</span>
            <select id="sol-lang-select">
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>

        <!-- Filter Pills -->
        <div class="sol-filter-pills" id="sol-filter-container">
          <button class="sol-pill active" data-filter="all">All Questions (100)</button>
          <button class="sol-pill" data-filter="correct">Correct (<span id="sol-pill-correct-count">0</span>)</button>
          <button class="sol-pill" data-filter="incorrect">Incorrect (<span id="sol-pill-incorrect-count">0</span>)</button>
          <button class="sol-pill" data-filter="unattempted">Unattempted (<span id="sol-pill-unatt-count">0</span>)</button>
        </div>

        <!-- Questions List -->
        <div id="solutions-list-container">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </div>
  </div>

  <script>
    // Embedded JSON Mock Test Data
    const QUESTIONS = ${JSON.stringify(mockData)};

    // Supabase API Configuration (saved in localStorage or via Cloud Sync button)
    const SUPABASE_CONFIG = {
      url: window.localStorage.getItem('toppersmock_supabase_url') || 'https://zgxskpqsjylbwrhhrzim.supabase.co',
      anonKey: window.localStorage.getItem('toppersmock_supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZ291bHZwZ2F5dmlpeGFsbWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExODcwMjgsImV4cCI6MjEwNjc2MzAyOH0.ARy4m7wlO37fEjQFGuWQQ3kRcePbZNXOaF-UW-Bq1kE'
    };
    const examStartTime = new Date();

    // State Variables
    const TOTAL_TIME = 60 * 60; // 60 minutes in seconds
    let timeRemaining = TOTAL_TIME;
    let timerInterval = null;
    let currentQuestionIndex = 0; // 0 to 99
    let globalLanguage = 'en'; // 'en' or 'hi'
    let soundEnabled = true;
    let paletteFilter = 'section'; // 'section' or 'all'
    let fontSizeLevel = 0; // -1, 0, 1

    // Question State: 
    // status: 'not_visited', 'not_answered', 'answered', 'marked', 'marked_answered'
    // selectedOption: null or 'a', 'b', 'c', 'd'
    // bookmarked: boolean
    // timeSpent: seconds
    const userAnswers = QUESTIONS.map((q, idx) => ({
      questionIndex: idx,
      status: idx === 0 ? 'not_answered' : 'not_visited',
      selectedOption: null,
      bookmarked: false,
      timeSpent: 0
    }));

    // Audio synthesizer for CBT sound effects
    function playBeep(type = 'click') {
      if (!soundEnabled) return;
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.08);
        } else if (type === 'select') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        }
      } catch (e) {
        // AudioContext not allowed or not supported
      }
    }

    // Extract unique sections
    const sections = [];
    const sectionIndexMap = {};
    QUESTIONS.forEach((q, idx) => {
      if (!sectionIndexMap[q.section_title]) {
        sectionIndexMap[q.section_title] = {
          name: q.section_title,
          partNumber: q.part_number,
          partName: q.section_name,
          startIndex: idx,
          endIndex: idx,
          questions: []
        };
        sections.push(sectionIndexMap[q.section_title]);
      }
      sectionIndexMap[q.section_title].endIndex = idx;
      sectionIndexMap[q.section_title].questions.push(idx);
    });

    // Initialize UI
    function init() {
      renderSectionTabs();
      renderPalette();
      loadQuestion(0);
      startTimer();
      setupEventListeners();
      updateLegendCounts();
      document.getElementById('exam-date-text').textContent = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    }

    // Sections Render
    function renderSectionTabs() {
      const container = document.getElementById('section-tabs-container');
      container.innerHTML = '';

      sections.forEach((sec, idx) => {
        const btn = document.createElement('button');
        btn.className = 'section-tab-btn' + (isCurrentSection(sec) ? ' active' : '');
        btn.id = 'sec-tab-' + idx;
        
        // Count answered in this section
        const answeredInSec = sec.questions.filter(qIdx => 
          userAnswers[qIdx].status === 'answered' || userAnswers[qIdx].status === 'marked_answered'
        ).length;

        btn.innerHTML = \`
          <span>\${sec.partName}: \${sec.name}</span>
          <span class="section-count-badge">\${answeredInSec}/\${sec.questions.length}</span>
        \`;

        btn.addEventListener('click', () => {
          playBeep('click');
          // Navigate to first question in section or keep active
          loadQuestion(sec.startIndex);
        });

        container.appendChild(btn);
      });
    }

    function isCurrentSection(sec) {
      return currentQuestionIndex >= sec.startIndex && currentQuestionIndex <= sec.endIndex;
    }

    function getCurrentSection() {
      return sections.find(s => isCurrentSection(s));
    }

    function updateSectionTabsActive() {
      const currentSec = getCurrentSection();
      sections.forEach((sec, idx) => {
        const tab = document.getElementById('sec-tab-' + idx);
        if (tab) {
          if (sec === currentSec) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
          const answeredInSec = sec.questions.filter(qIdx => 
            userAnswers[qIdx].status === 'answered' || userAnswers[qIdx].status === 'marked_answered'
          ).length;
          const badge = tab.querySelector('.section-count-badge');
          if (badge) badge.textContent = \`\${answeredInSec}/\${sec.questions.length}\`;
        }
      });

      // Update palette title
      const pTitle = document.getElementById('palette-section-title');
      if (pTitle && currentSec) {
        pTitle.textContent = currentSec.name;
      }
    }

    // Question Rendering
    function loadQuestion(index) {
      if (index < 0 || index >= QUESTIONS.length) return;

      currentQuestionIndex = index;
      const qData = QUESTIONS[index];
      const state = userAnswers[index];

      // Mark as not_answered if it was not_visited
      if (state.status === 'not_visited') {
        state.status = 'not_answered';
      }

      // Title & Marks
      document.getElementById('current-q-title').textContent = \`Question No. \${qData.question_number}\`;

      // Bookmark button state
      const bmBtn = document.getElementById('btn-bookmark');
      if (state.bookmarked) {
        bmBtn.classList.add('bookmarked');
        document.getElementById('bookmark-text').textContent = 'Bookmarked';
      } else {
        bmBtn.classList.remove('bookmarked');
        document.getElementById('bookmark-text').textContent = 'Bookmark';
      }

      // Text with Hindi/English support
      const qTextBox = document.getElementById('question-text');
      const isHindi = globalLanguage === 'hi';
      const textToDisplay = (isHindi && qData.question_text_hi) ? qData.question_text_hi : qData.question_text;
      qTextBox.textContent = textToDisplay;
      if (isHindi) {
        qTextBox.classList.add('hindi-font');
      } else {
        qTextBox.classList.remove('hindi-font');
      }

      // Render Options
      const optionsContainer = document.getElementById('options-container');
      optionsContainer.innerHTML = '';

      const opts = (isHindi && qData.options_hi) ? qData.options_hi : qData.options;
      const optKeys = ['a', 'b', 'c', 'd'];

      optKeys.forEach(optKey => {
        if (!opts[optKey]) return;

        const card = document.createElement('label');
        card.className = 'option-card' + (state.selectedOption === optKey ? ' selected' : '');
        card.setAttribute('for', 'opt-' + optKey);

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'question_option';
        radio.id = 'opt-' + optKey;
        radio.className = 'option-radio';
        radio.checked = state.selectedOption === optKey;

        const labelBadge = document.createElement('span');
        labelBadge.className = 'option-label';
        labelBadge.textContent = optKey.toUpperCase() + '.';

        const optText = document.createElement('span');
        optText.className = 'option-text' + (isHindi ? ' hindi-font' : '');
        optText.textContent = opts[optKey];

        card.appendChild(radio);
        card.appendChild(labelBadge);
        card.appendChild(optText);

        card.addEventListener('click', (e) => {
          e.preventDefault();
          selectOption(optKey);
        });

        optionsContainer.appendChild(card);
      });

      // Update Section Tabs & Palette
      updateSectionTabsActive();
      renderPalette();
      updateLegendCounts();

      // Scroll top
      document.getElementById('question-scroll-area').scrollTop = 0;
    }

    function selectOption(optKey) {
      playBeep('select');
      const state = userAnswers[currentQuestionIndex];
      state.selectedOption = optKey;

      // Re-render option cards selected state
      const cards = document.querySelectorAll('.option-card');
      cards.forEach((card, idx) => {
        const key = ['a', 'b', 'c', 'd'][idx];
        if (key === optKey) {
          card.classList.add('selected');
          card.querySelector('.option-radio').checked = true;
        } else {
          card.classList.remove('selected');
          card.querySelector('.option-radio').checked = false;
        }
      });
    }

    // Palette Render
    function renderPalette() {
      const paletteGrid = document.getElementById('palette-grid');
      paletteGrid.innerHTML = '';

      const currentSec = getCurrentSection();
      const questionIndices = (paletteFilter === 'all') 
        ? QUESTIONS.map((_, i) => i) 
        : (currentSec ? currentSec.questions : []);

      questionIndices.forEach(qIdx => {
        const state = userAnswers[qIdx];
        const btn = document.createElement('button');
        btn.className = 'palette-btn';

        if (qIdx === currentQuestionIndex) {
          btn.classList.add('current');
        }

        // Apply Status Class
        switch (state.status) {
          case 'answered':
            btn.classList.add('p-answered');
            break;
          case 'not_answered':
            btn.classList.add('p-not-answered');
            break;
          case 'marked':
            btn.classList.add('p-marked');
            break;
          case 'marked_answered':
            btn.classList.add('p-marked-answered');
            break;
          default:
            btn.classList.add('p-not-visited');
            break;
        }

        btn.textContent = qIdx + 1;
        btn.title = \`Question \${qIdx + 1}: \${state.status.replace('_', ' ')}\`;

        btn.addEventListener('click', () => {
          playBeep('click');
          loadQuestion(qIdx);
        });

        paletteGrid.appendChild(btn);
      });
    }

    // Legend Counts
    function updateLegendCounts() {
      let answered = 0;
      let notAnswered = 0;
      let notVisited = 0;
      let marked = 0;
      let markedAnswered = 0;

      userAnswers.forEach(state => {
        switch (state.status) {
          case 'answered': answered++; break;
          case 'not_answered': notAnswered++; break;
          case 'not_visited': notVisited++; break;
          case 'marked': marked++; break;
          case 'marked_answered': markedAnswered++; break;
        }
      });

      document.getElementById('legend-answered-count').textContent = answered;
      document.getElementById('legend-not-answered-count').textContent = notAnswered;
      document.getElementById('legend-not-visited-count').textContent = notVisited;
      document.getElementById('legend-marked-count').textContent = marked;
      document.getElementById('legend-marked-answered-count').textContent = markedAnswered;
    }

    // Exam Timer
    function startTimer() {
      const timerEl = document.getElementById('exam-timer');
      timerInterval = setInterval(() => {
        timeRemaining--;
        userAnswers[currentQuestionIndex].timeSpent++;

        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        timerEl.textContent = \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;

        // Warning state when under 5 mins
        if (timeRemaining <= 300) {
          timerEl.classList.add('warning');
        }

        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          alert('Time is up! Your mock test will now be submitted automatically.');
          submitExam();
        }
      }, 1000);
    }

    // Action Handlers
    function handleSaveAndNext() {
      playBeep('click');
      const state = userAnswers[currentQuestionIndex];
      if (state.selectedOption) {
        state.status = 'answered';
      } else {
        state.status = 'not_answered';
      }

      if (currentQuestionIndex < QUESTIONS.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
      } else {
        openSubmitModal();
      }
    }

    function handleMarkReviewAndNext() {
      playBeep('click');
      const state = userAnswers[currentQuestionIndex];
      if (state.selectedOption) {
        state.status = 'marked_answered';
      } else {
        state.status = 'marked';
      }

      if (currentQuestionIndex < QUESTIONS.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
      } else {
        openSubmitModal();
      }
    }

    function handleClearResponse() {
      playBeep('click');
      const state = userAnswers[currentQuestionIndex];
      state.selectedOption = null;
      state.status = 'not_answered';
      loadQuestion(currentQuestionIndex);
    }

    function handlePrevious() {
      playBeep('click');
      if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
      }
    }

    // Submit Modal
    function openSubmitModal() {
      const tbody = document.getElementById('submit-summary-tbody');
      tbody.innerHTML = '';

      sections.forEach(sec => {
        let ans = 0, notAns = 0, marked = 0, notVis = 0;
        sec.questions.forEach(qIdx => {
          const st = userAnswers[qIdx].status;
          if (st === 'answered' || st === 'marked_answered') ans++;
          else if (st === 'not_answered') notAns++;
          else if (st === 'marked') marked++;
          else notVis++;
        });

        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td><strong>\${sec.name}</strong></td>
          <td>\${sec.questions.length}</td>
          <td style="color: #16a34a; font-weight: 700;">\${ans}</td>
          <td style="color: #dc2626; font-weight: 700;">\${notAns}</td>
          <td style="color: #7c3aed; font-weight: 700;">\${marked}</td>
          <td style="color: #64748b;">\${notVis}</td>
        \`;
        tbody.appendChild(tr);
      });

      document.getElementById('modal-submit-confirm').classList.add('active');
    }

    function submitExam() {
      clearInterval(timerInterval);
      document.getElementById('modal-submit-confirm').classList.remove('active');

      // Calculate Scores
      let totalCorrect = 0;
      let totalIncorrect = 0;
      let totalAttempted = 0;

      const sectionResults = sections.map(sec => ({
        section: sec,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        score: 0
      }));

      userAnswers.forEach((ans, idx) => {
        const qData = QUESTIONS[idx];
        const secRes = sectionResults.find(sr => sr.section.questions.includes(idx));

        if (ans.selectedOption) {
          totalAttempted++;
          if (ans.selectedOption.toLowerCase() === qData.correct_option.toLowerCase()) {
            totalCorrect++;
            if (secRes) secRes.correct++;
          } else {
            totalIncorrect++;
            if (secRes) secRes.incorrect++;
          }
        } else {
          if (secRes) secRes.unattempted++;
        }
      });

      // SSC CGL Marking: +2 for correct, -0.5 for incorrect
      const positiveMarks = totalCorrect * 2;
      const negativeMarks = totalIncorrect * 0.5;
      const totalScore = positiveMarks - negativeMarks;
      const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
      const unattempted = QUESTIONS.length - totalAttempted;

      // Update Dashboard Header Cards
      document.getElementById('res-score').textContent = \`\${totalScore.toFixed(2)} / 200\`;
      document.getElementById('res-accuracy').textContent = \`\${accuracy}%\`;
      document.getElementById('res-correct-count').textContent = totalCorrect;
      document.getElementById('res-marks-plus').textContent = \`+\${positiveMarks} Marks\`;
      document.getElementById('res-incorrect-count').textContent = totalIncorrect;
      document.getElementById('res-marks-minus').textContent = \`-\${negativeMarks.toFixed(2)} Marks\`;
      document.getElementById('res-unattempted-count').textContent = unattempted;

      // Estimated Percentile calculation
      let estPercentile = 0;
      if (totalScore >= 160) estPercentile = 99.2;
      else if (totalScore >= 140) estPercentile = 96.5;
      else if (totalScore >= 120) estPercentile = 88.0;
      else if (totalScore >= 100) estPercentile = 74.2;
      else if (totalScore >= 80) estPercentile = 55.0;
      else estPercentile = Math.max(10, Math.round((totalScore / 200) * 100));

      document.getElementById('res-percentile').textContent = \`Est. Percentile: \${estPercentile}%\`;
      document.getElementById('res-cutoff-status').textContent = totalScore >= 135 ? '✅ Likely Cleared Cutoff' : '⚠️ Below Cutoff Target (135)';

      // Section-wise Breakdown table
      const resTbody = document.getElementById('result-section-tbody');
      resTbody.innerHTML = '';
      sectionResults.forEach(sr => {
        const secScore = (sr.correct * 2) - (sr.incorrect * 0.5);
        const attempted = sr.correct + sr.incorrect;
        const secAcc = attempted > 0 ? Math.round((sr.correct / attempted) * 100) : 0;

        const row = document.createElement('tr');
        row.innerHTML = \`
          <td><strong>\${sr.section.name}</strong></td>
          <td>\${attempted} / \${sr.section.questions.length}</td>
          <td style="color: #16a34a; font-weight: 700;">\${sr.correct}</td>
          <td style="color: #dc2626; font-weight: 700;">\${sr.incorrect}</td>
          <td><strong>\${secAcc}%</strong></td>
          <td style="font-weight: 800; color: #0284c7;">\${secScore.toFixed(2)} / 50</td>
        \`;
        resTbody.appendChild(row);
      });

      // Update Filter counts in Solutions
      document.getElementById('sol-pill-correct-count').textContent = totalCorrect;
      document.getElementById('sol-pill-incorrect-count').textContent = totalIncorrect;
      document.getElementById('sol-pill-unatt-count').textContent = unattempted;

      // Render Solutions
      renderSolutions('all');

      // Auto-sync attempt to Supabase
      sendAttemptToSupabase({
        roll_number: '2401098421',
        test_id: 'ssc_cgl_tier1_mock_1',
        test_title: 'SSC CGL Tier-I (CBT) Full Mock Test 1',
        total_questions: QUESTIONS.length,
        total_attempted: totalAttempted,
        total_correct: totalCorrect,
        total_incorrect: totalIncorrect,
        total_unattempted: unattempted,
        total_score: parseFloat(totalScore.toFixed(2)),
        accuracy_percentage: accuracy,
        time_taken_seconds: TOTAL_TIME - timeRemaining,
        timestamp: new Date().toISOString(),
        started_at: examStartTime.toISOString(),
        submitted_at: new Date().toISOString(),
        section_breakdown: sectionResults.map(sr => ({
          section_name: sr.section.name,
          part_name: sr.section.partName,
          total: sr.section.questions.length,
          correct: sr.correct,
          incorrect: sr.incorrect,
          unattempted: sr.unattempted,
          score: (sr.correct * 2) - (sr.incorrect * 0.5)
        }))
      });

      // Show Result Dashboard
      document.getElementById('result-dashboard').classList.add('active');
    }

    async function sendAttemptToSupabase(payload) {
      if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        console.info('Supabase URL or Key not configured yet. Configure via the Cloud Sync button.');
        return;
      }
      try {
        const rawUrl = SUPABASE_CONFIG.url.trim();
        const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
        let res = await fetch(\`\${cleanUrl}/rest/v1/test_attempts\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': \`Bearer \${SUPABASE_CONFIG.anonKey}\`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(payload)
        });

        // Fallback if column 'timestamp' has not been added to Supabase yet
        if (!res.ok && res.status === 400) {
          const errText = await res.clone().text();
          if (errText.includes("'timestamp'")) {
            const fallbackPayload = { ...payload };
            delete fallbackPayload.timestamp;
            res = await fetch(\`\${cleanUrl}/rest/v1/test_attempts\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': \`Bearer \${SUPABASE_CONFIG.anonKey}\`,
                'Prefer': 'return=representation'
              },
              body: JSON.stringify(fallbackPayload)
            });
          }
        }
        if (res.ok) {
          const data = await res.json();
          console.log('✓ Successfully recorded test attempt to Supabase:', data);
          const attemptId = data && data[0] ? data[0].id : null;
          if (attemptId) {
            const answersBatch = userAnswers.map((ans, qIdx) => {
              const q = QUESTIONS[qIdx];
              const isCorrect = ans.selectedOption && (ans.selectedOption.toLowerCase() === q.correct_option.toLowerCase());
              return {
                attempt_id: attemptId,
                question_number: q.question_number,
                section_name: q.section_title,
                selected_option: ans.selectedOption,
                correct_option: q.correct_option,
                is_correct: isCorrect,
                marks_awarded: isCorrect ? 2.00 : (ans.selectedOption ? -0.50 : 0.00),
                status: ans.status,
                time_spent_seconds: ans.timeSpent,
                timestamp: new Date().toISOString()
              };
            });
            await fetch(\`\${cleanUrl}/rest/v1/test_attempt_answers\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': \`Bearer \${SUPABASE_CONFIG.anonKey}\`
              },
              body: JSON.stringify(answersBatch)
            });
            console.log('✓ Detailed question answers recorded to Supabase.');
          }
        } else {
          const err = await res.text();
          console.error('Supabase save error:', res.status, err);
        }
      } catch (err) {
        console.error('Network error connecting to Supabase:', err);
      }
    }

    // Solutions List Render
    function renderSolutions(filter = 'all') {
      const container = document.getElementById('solutions-list-container');
      container.innerHTML = '';
      const isHindi = document.getElementById('sol-lang-select').value === 'hi';

      QUESTIONS.forEach((q, idx) => {
        const state = userAnswers[idx];
        const isAttempted = !!state.selectedOption;
        const isCorrect = isAttempted && (state.selectedOption.toLowerCase() === q.correct_option.toLowerCase());
        const isIncorrect = isAttempted && !isCorrect;

        if (filter === 'correct' && !isCorrect) return;
        if (filter === 'incorrect' && !isIncorrect) return;
        if (filter === 'unattempted' && isAttempted) return;

        const card = document.createElement('div');
        card.className = 'sol-q-card';

        let statusTag = '';
        if (!isAttempted) {
          statusTag = '<span class="sol-status-tag tag-unattempted">Unattempted (0 Marks)</span>';
        } else if (isCorrect) {
          statusTag = '<span class="sol-status-tag tag-correct">Correct (+2.00 Marks)</span>';
        } else {
          statusTag = '<span class="sol-status-tag tag-incorrect">Incorrect (-0.50 Marks)</span>';
        }

        const qText = (isHindi && q.question_text_hi) ? q.question_text_hi : q.question_text;
        const opts = (isHindi && q.options_hi) ? q.options_hi : q.options;
        const solText = (isHindi && q.solution_text_hi) ? q.solution_text_hi : q.solution_text;

        let optionsHtml = '';
        ['a', 'b', 'c', 'd'].forEach(optKey => {
          if (!opts[optKey]) return;
          const isUserChoice = state.selectedOption === optKey;
          const isCorrectChoice = q.correct_option.toLowerCase() === optKey;

          let extraClass = '';
          let badgeNote = '';

          if (isCorrectChoice) {
            extraClass = 'opt-correct-highlight';
            badgeNote = ' <span style="color: #16a34a; font-weight: 700;">(Correct Answer ✓)</span>';
          }
          if (isUserChoice && !isCorrectChoice) {
            extraClass = 'opt-wrong-highlight';
            badgeNote = ' <span style="color: #dc2626; font-weight: 700;">(Your Answer ✗)</span>';
          }
          if (isUserChoice && isCorrectChoice) {
            badgeNote = ' <span style="color: #16a34a; font-weight: 700;">(Your Answer & Correct ✓)</span>';
          }

          optionsHtml += \`
            <div class="option-card \${extraClass}" style="margin-bottom: 8px; cursor: default;">
              <span class="option-label">\${optKey.toUpperCase()}.</span>
              <span class="option-text">\${opts[optKey]} \${badgeNote}</span>
            </div>
          \`;
        });

        card.innerHTML = \`
          <div class="sol-q-header">
            <div>
              <strong>Question \${q.question_number}</strong> &bull; <span style="color: #64748b;">\${q.section_title}</span>
            </div>
            <div>\${statusTag}</div>
          </div>
          <div class="q-text-box" style="margin-bottom: 12px; font-size: 1rem;">\${qText}</div>
          <div class="options-grid" style="margin-bottom: 14px;">\${optionsHtml}</div>
          <div class="sol-explanation-box">
            <div style="font-weight: 700; color: #00a8a8; margin-bottom: 6px;">Detailed Solution:</div>
            <div style="white-space: pre-wrap;">\${solText}</div>
          </div>
        \`;

        container.appendChild(card);
      });
    }

    // Event Listeners setup
    function setupEventListeners() {
      document.getElementById('btn-save-next').addEventListener('click', handleSaveAndNext);
      document.getElementById('btn-mark-review').addEventListener('click', handleMarkReviewAndNext);
      document.getElementById('btn-clear-response').addEventListener('click', handleClearResponse);
      document.getElementById('btn-prev').addEventListener('click', handlePrevious);

      // Bookmark
      document.getElementById('btn-bookmark').addEventListener('click', () => {
        playBeep('click');
        const st = userAnswers[currentQuestionIndex];
        st.bookmarked = !st.bookmarked;
        loadQuestion(currentQuestionIndex);
      });

      // Submit buttons
      document.getElementById('btn-submit-exam').addEventListener('click', openSubmitModal);
      document.getElementById('btn-confirm-final-submit').addEventListener('click', submitExam);

      // Language Selectors
      document.getElementById('global-lang-select').addEventListener('change', (e) => {
        globalLanguage = e.target.value;
        loadQuestion(currentQuestionIndex);
      });

      document.getElementById('sol-lang-select').addEventListener('change', () => {
        const activePill = document.querySelector('.sol-pill.active');
        const f = activePill ? activePill.dataset.filter : 'all';
        renderSolutions(f);
      });

      // Font size buttons
      document.getElementById('font-increase').addEventListener('click', () => {
        if (fontSizeLevel < 2) fontSizeLevel++;
        updateFontSize();
      });
      document.getElementById('font-decrease').addEventListener('click', () => {
        if (fontSizeLevel > -1) fontSizeLevel--;
        updateFontSize();
      });
      document.getElementById('font-reset').addEventListener('click', () => {
        fontSizeLevel = 0;
        updateFontSize();
      });

      // Palette Filter
      document.getElementById('palette-filter').addEventListener('change', (e) => {
        paletteFilter = e.target.value;
        renderPalette();
      });

      // Sidebar Toggle
      document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
        document.getElementById('sidebar-palette').classList.toggle('collapsed');
      });

      // Audio Toggle
      document.getElementById('btn-toggle-sound').addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        document.getElementById('sound-indicator').textContent = soundEnabled ? '🔊' : '🔇';
      });

      // Fullscreen
      document.getElementById('btn-fullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });

      // Modal Triggers
      document.getElementById('btn-open-instructions').addEventListener('click', () => {
        document.getElementById('modal-instructions').classList.add('active');
      });

      document.getElementById('btn-open-question-paper').addEventListener('click', () => {
        renderQuestionPaperModal();
        document.getElementById('modal-question-paper').classList.add('active');
      });

      // Supabase Cloud Sync Modal
      document.getElementById('btn-open-cloud-sync').addEventListener('click', () => {
        document.getElementById('input-supabase-url').value = SUPABASE_CONFIG.url;
        document.getElementById('input-supabase-key').value = SUPABASE_CONFIG.anonKey;
        document.getElementById('supabase-status-message').style.display = 'none';
        document.getElementById('modal-cloud-sync').classList.add('active');
      });

      document.getElementById('btn-save-supabase-config').addEventListener('click', () => {
        const url = document.getElementById('input-supabase-url').value.trim();
        const key = document.getElementById('input-supabase-key').value.trim();
        SUPABASE_CONFIG.url = url;
        SUPABASE_CONFIG.anonKey = key;
        window.localStorage.setItem('toppersmock_supabase_url', url);
        window.localStorage.setItem('toppersmock_supabase_key', key);

        const msgEl = document.getElementById('supabase-status-message');
        msgEl.style.display = 'block';
        msgEl.style.background = '#dcfce7';
        msgEl.style.color = '#15803d';
        msgEl.innerHTML = '✓ Supabase credentials saved successfully!';
        setTimeout(() => {
          document.getElementById('modal-cloud-sync').classList.remove('active');
        }, 1200);
      });

      // Modal Closers
      document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const targetId = e.currentTarget.getAttribute('data-close');
          const modal = document.getElementById(targetId);
          if (modal) modal.classList.remove('active');
        });
      });

      // Solution Filter Pills
      document.querySelectorAll('.sol-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
          document.querySelectorAll('.sol-pill').forEach(p => p.classList.remove('active'));
          e.currentTarget.classList.add('active');
          renderSolutions(e.currentTarget.dataset.filter);
        });
      });

      // Retake Test
      document.getElementById('btn-reattempt-test').addEventListener('click', () => {
        if (confirm('Are you sure you want to restart the mock test? All current responses will be reset.')) {
          window.location.reload();
        }
      });

      // Print Report
      document.getElementById('btn-print-result').addEventListener('click', () => {
        window.print();
      });

      // Keyboard navigation shortcuts
      window.addEventListener('keydown', (e) => {
        // Prevent shortcuts inside textboxes
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

        if (e.key === '1' || e.key.toLowerCase() === 'a') selectOption('a');
        else if (e.key === '2' || e.key.toLowerCase() === 'b') selectOption('b');
        else if (e.key === '3' || e.key.toLowerCase() === 'c') selectOption('c');
        else if (e.key === '4' || e.key.toLowerCase() === 'd') selectOption('d');
        else if (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'n') handleSaveAndNext();
        else if (e.key.toLowerCase() === 'm') handleMarkReviewAndNext();
        else if (e.key.toLowerCase() === 'p') handlePrevious();
      });
    }

    function updateFontSize() {
      const sizes = ['14px', '16px', '18px'];
      const baseSize = sizes[fontSizeLevel + 1] || '16px';
      document.documentElement.style.setProperty('--font-scale', baseSize);
    }

    function renderQuestionPaperModal() {
      const container = document.getElementById('question-paper-body');
      container.innerHTML = '';

      sections.forEach(sec => {
        const secHeader = document.createElement('h3');
        secHeader.style.cssText = 'color: #00a8a8; margin: 18px 0 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px;';
        secHeader.textContent = \`\${sec.partName}: \${sec.name}\`;
        container.appendChild(secHeader);

        sec.questions.forEach(qIdx => {
          const q = QUESTIONS[qIdx];
          const div = document.createElement('div');
          div.style.cssText = 'padding: 10px 0; border-bottom: 1px dashed #e2e8f0; font-size: 0.9rem;';

          div.innerHTML = \`
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">Q\${q.question_number}. \${q.question_text}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; color: #475569; margin-left: 14px;">
              <div>(A) \${q.options.a}</div>
              <div>(B) \${q.options.b}</div>
              <div>(C) \${q.options.c}</div>
              <div>(D) \${q.options.d}</div>
            </div>
          \`;
          container.appendChild(div);
        });
      });
    }

    // Launch App
    document.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlTemplate, 'utf8');
console.log('Successfully generated index.html!');
