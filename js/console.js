/**
 * Interactive Security & Telemetry Console Engine
 */
(function() {
  const commands = {
    help: () => `Available Commands:
  help                     Show this command directory
  whoami                   Display summary bio and target roles
  skills                   List categorized technical & security proficiencies
  repos                    Query featured GitHub repositories (@Deady007)
  audit --project sppl     Run GxP 21 CFR Part 11 compliance audit on SPPL ERP
  audit --project linq     Run organizational policy verification on LinQ HRMS
  telemetry                View real-time delivery completion and metrics
  certifications           List completed job simulations and degree details
  themes                   List available Hallmark themes (50 Total)
  theme <name>             Switch active theme (e.g. "theme blueprint", "theme darkroom")
  contact                  Display direct email, phone, and profile links
  clear                    Clear terminal screen output`,

    whoami: () => `Viral Parmar
Business Analyst | Cybersecurity Candidate | Full-Stack Systems Engineer
Location: Vadodara, Gujarat, India
Education: Bachelor of Computer Applications (BCA), The Maharaja Sayajirao University of Baroda (2025)
Experience: Business Analyst at Fiscal Ox (Jul 2025 - Present)
            Full Stack Laravel Intern at Deepak Foundation (Dec 2024 - Mar 2025)
Focus: Software engineering, GxP CSV data integrity, and cybersecurity monitoring.`,

    skills: () => `[Cybersecurity & Compliance]
  • 21 CFR Part 11 Electronic Records & Signatures (§11.10, §11.50)
  • Gapless Audit Trail Analysis & ALCOA+ Data Integrity Verification
  • Role-Based Access Control (RBAC) & Session Timeout Configuration
  • Tata Group Cybersecurity Analyst Simulation (Threat Analysis, Anomaly Detection)
  • Incident, OOT, and OOD Segregation

[Business Analysis & Agile PO]
  • Structured User Stories & Given/When/Then Acceptance Criteria
  • Sprint0 Backlog Grooming & Markov Milestone Risk Estimation
  • Workflow Process Mapping & Form Validation Matrices
  • Cross-Functional Blocker Ownership

[Development & Databases]
  • Languages: Python, PHP, JavaScript, TypeScript, SQL
  • Frameworks: Laravel, React, Node.js, Flask, Tailwind CSS
  • Storage: SQLite WAL, MySQL, MongoDB, Docker`,

    repos: () => `Featured Repositories on github.com/Deady007 (50+ Total):
  1. po-copilot               Private PO Copilot app, SQLite WAL, 28 tests, e-signatures
  2. sprint0-dashboard        Flow analytics server, Markov risk engine, Gini coefficient
  3. Linq-hr                  Enterprise HRMS, biometric attendance coupling, 360 reviews
  4. biocare                  LIMS platform, GS1-128 barcode parsing, chain of custody
  5. CoreKit                  Microservices mesh, Docker containers, TypeScript APIs
  6. HBP-v3                   Healthcare portal, dynamic medical forms (Deepak Foundation)
  7. DPR                      Daily progress reporting web system`,

    "audit --project sppl": () => `[GxP AUDIT TRACE: Suleshvari Pharma Private Ltd. (SPPL ERP)]
  • Regulatory Scope: US FDA 21 CFR Part 11, EU GMP Annex 11, Revised Schedule M
  • Batch Records: MPCR transitioned to BPCR plant terminology standard (SPPL-82) [PASS]
  • QA Quarantine Gate: Mandatory lot quarantine before repack issuance (SPPL-40) [PASS]
  • Stock Cutover: Single cut-off date 30-Sep-2026 enforced for inventory ledger (SPPL-144) [PASS]
  • Deviation Decoupling: Out-of-Trend (OOT) forms isolated from generic plant incidents (SPPL-184) [PASS]
  • Protocol Sign-Off: Modular OQ v4.0 execution standard (FO_OQ_001) verified [PASS]
  • Overall Completion: 178 of 186 stories delivered (95.7%)`,

    "audit --project linq": () => `[POLICY AUDIT TRACE: LinQ Enterprise HRMS (LN & LD)]
  • Leave Accrual Rule: Mid-month hires after 15th do not accrue initial month credits (LN-2) [PASS]
  • Financial Guardrail: Petty cash monthly budget capping card active (LN-105) [PASS]
  • Attendance Validation: WFH requests coupled with biometric punch logs (LN-97) [PASS]
  • Org Chart Hierarchy: Direct click-to-reassign reporting managers (LD-17) [PASS]
  • Security Deposit Gate: Notice period verification required for exit refunds (LD-64) [PASS]
  • Backlog Delivery: 108/108 stories (LN) + 68/68 stories (LD) = 100% complete [PASS]`,

    telemetry: () => `Active System Telemetry:
  • SPPL ERP: 95.7% (178 Done / 8 Open) · In Qualification Round R6
  • LinQ NS: 100% (108 Done / 0 Open) · Production Deployed
  • Linq DS: 100% (68 Done / 0 Open) · Client Accepted & Trained
  • PO Copilot: 28 Unit Tests Passing in 0.895s · Zero Hallucination Mode Active`,

    certifications: () => `Education & Simulation Credentials:
  1. Bachelor of Computer Applications (BCA) - The Maharaja Sayajirao University of Baroda (2022 - 2025)
  2. Cybersecurity Analyst Job Simulation - Tata Group (Forage)
  3. Data Analytics Job Simulation - Deloitte Australia (Forage)`,

    themes: () => {
      if (!window.HALLMARK_THEMES) return "Themes database not loaded.";
      return `Hallmark 50 Themes Directory:\n` +
        window.HALLMARK_THEMES.map(t => `  • ${t.slug.padEnd(14)} (${t.genre}) - ${t.displayFace}`).join('\n') +
        `\n\nType "theme <slug>" to activate any theme immediately.`;
    },

    contact: () => `Direct Communication Channels:
  • Email: parmarviral397@gmail.com
  • Phone: +91 6351493983
  • LinkedIn: https://linkedin.com/in/parmar-viral-13m711
  • GitHub: https://github.com/Deady007
  • Resume: Download via header button or /Viral_Parmar_Resume.pdf`
  };

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.initConsole = function(containerId) {
    const root = document.getElementById(containerId);
    if (!root) return;

    const output = root.querySelector('.terminal-output');
    const input = root.querySelector('.terminal-input');
    const body = root.querySelector('.terminal-body');
    const form = root.querySelector('.terminal-form');
    if (!output || !input || !form) return;

    const history = [];
    let historyIndex = -1;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawInput = input.value.trim();
      if (!rawInput) return;

      history.push(rawInput);
      historyIndex = history.length;

      const userLine = document.createElement('div');
      userLine.innerHTML = `<span class="prompt-tag">guest@vp-portfolio:~$</span> <span>${escapeHtml(rawInput)}</span>`;
      output.appendChild(userLine);

      const cmd = rawInput.toLowerCase();

      if (cmd === 'clear') {
        output.innerHTML = '';
      } else if (cmd.startsWith('theme ')) {
        const themeSlug = cmd.slice(6).trim();
        const found = window.HALLMARK_THEMES ? window.HALLMARK_THEMES.find(t => t.slug === themeSlug || t.name.toLowerCase() === themeSlug) : null;
        if (found && window.setHallmarkTheme) {
          window.setHallmarkTheme(found.slug);
          const res = document.createElement('div');
          res.style.color = 'var(--color-ok, #4ade80)';
          res.textContent = `Applied Hallmark theme: "${found.name}" (${found.genre}).`;
          output.appendChild(res);
        } else {
          const res = document.createElement('div');
          res.style.color = 'var(--color-bad, #f87171)';
          res.textContent = `Theme "${themeSlug}" not found. Type "themes" to list all 50 themes.`;
          output.appendChild(res);
        }
      } else if (commands[cmd]) {
        const responseDiv = document.createElement('div');
        responseDiv.textContent = commands[cmd]().trim();
        output.appendChild(responseDiv);
      } else {
        const errDiv = document.createElement('div');
        errDiv.style.color = 'var(--color-bad, #f87171)';
        errDiv.textContent = `Command not recognized: "${rawInput}". Type "help" for a list of commands.`;
        output.appendChild(errDiv);
      }

      input.value = '';
      if (body) body.scrollTop = body.scrollHeight;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (history.length > 0 && historyIndex > 0) {
          historyIndex--;
          input.value = history[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < history.length - 1) {
          historyIndex++;
          input.value = history[historyIndex];
        } else {
          historyIndex = history.length;
          input.value = '';
        }
        e.preventDefault();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.initConsole('portfolio-terminal');
  });
})();
