# Viral Parmar - Systems, Cybersecurity & Product Engineering Portfolio

Personal engineering and business analysis portfolio for **Viral Parmar**, built on the Hallmark Console design system with strict typography, measured telemetry, and dark/light themes.

## Overview

- **Owner:** Viral Parmar (Vadodara, Gujarat, India)
- **Roles:** Business Analyst, Cybersecurity Analyst Candidate, Full-Stack Systems Engineer
- **GitHub:** [@Deady007](https://github.com/Deady007)
- **Live Assets:** Includes interactive audit terminal, 21 CFR Part 11 compliance verification table, 7 featured projects, and downloadable resume.

## Key Sections

1. **Telemetry & Hero:** High-density metric panels showing verified production delivery stats across pharmaceutical GxP ERPs, HRMS suites, and 50+ GitHub repositories.
2. **Disciplinary Competencies:** Categorized capabilities across Cybersecurity & Compliance (21 CFR Part 11, ALCOA+, RBAC), Agile Product Ownership (User stories, Given/When/Then acceptance criteria), Full-Stack Systems (Python, PHP/Laravel, SQLite WAL, React), and Analytical Tooling.
3. **Featured Deliverables:** Interactive filterable project directory covering:
   - **PO Copilot:** Desktop productivity tool with SQLite WAL persistence, e-signatures, and deterministic test suite.
   - **Sprint0 Flow Analytics Dashboard:** Delivery flow metrics with Markov completion risk modeling.
   - **LinQ Enterprise HRMS (LN & LD):** Enterprise HR suite with biometric attendance coupling and org hierarchies.
   - **Suleshvari Pharma ERP (SPPL):** GxP batch manufacturing, quarantine gates, and OOT deviation handling.
   - **BioCare LIMS Platform:** Chain of custody and GS1-128 barcode parsing.
   - **Deepak Foundation Health Portal (HBP-v3):** Healthcare beneficiary tracking and field survey forms.
   - **CoreKit Microservices Architecture:** Distributed service architecture with Docker and TypeScript.
4. **Regulatory & Compliance Verification Table:** Direct audit traceability mapping requirements to verification results (US FDA 21 CFR §11.10(e), §11.50, Tata Cybersecurity Simulation, Deloitte Analytics Simulation).
5. **Interactive Audit & Telemetry Console:** Web terminal supporting commands: `help`, `whoami`, `skills`, `repos`, `audit --project sppl`, `audit --project linq`, `telemetry`, `certifications`, `contact`, and `clear`.

## Technology & Design Standards

- Built with semantic HTML5, modern CSS3 variables, and vanilla JavaScript (zero heavy framework dependencies).
- Designed according to Hallmark standards (`console` theme, graphite ground with chromatic amber and cool blue telemetry accents).
- Strict 4px spacing scale and contrast accessibility compliant.
- Responsive layout across desktop (1280px+), tablet, and mobile (320px+).

## Running Locally

To preview the portfolio locally:

```bash
# Using Python
python3 -m http.server 3000 --directory /home/viral/portfolio

# Or using Node http-server / npx
npx serve /home/viral/portfolio
```

Then navigate to `http://localhost:3000` in any web browser.
