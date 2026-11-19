# Md. Tanvir Anjum — Personal Engineering Portfolio

[![Static Production Portfolio](https://img.shields.io/badge/Architecture-Static%20HTML5%2FCSS3%2FJS-E3343F?logo=html5)](https://mtanviranjum.tech)
[![Netlify Status](https://img.shields.io/badge/Hosting-Netlify%20Free%20Tier-00C7B7?logo=netlify)](https://www.netlify.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Design Identity](https://img.shields.io/badge/Theme-Editorial%20Monochrome%20%2B%20Crimson-141416)](https://mtanviranjum.tech)

A verified, content-audited technical portfolio repository for **Md. Tanvir Anjum**, a Computer Science and Engineering undergraduate at **Patuakhali Science and Technology University (PSTU)**, Bangladesh.

---

## Architectural Isolation: Two Decoupled Systems

This repository contains two completely isolated application paths:

```
                                  Repository Root
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
         [ PATH A: PUBLIC SITE ]                         [ PATH B: LEARNING APP ]
         Static Production Portfolio                     ASP.NET Core MVC Architecture
         Location: site/                                 Location: Repository Root (Controllers, Views...)
         Hosting: Netlify Free                           Target: Localhost / Academic Exploration
         Domain: https://mtanviranjum.tech               Stack: .NET 10, EF Core, MySQL, MailKit
         Runtime: Static HTML5, CSS3, Vanilla JS,        Status: Complete standalone learning project;
                  Netlify Forms, Responsive SVGs                 Kept intact for experimentation
```

### Path A: Public Production Static Portfolio (`site/`)
* **Live Domain**: [https://mtanviranjum.tech](https://mtanviranjum.tech)
* **Hosting Platform**: **Netlify Free Tier**
* **Publish Directory**: `site/` (Netlify serves only static files from this directory)
* **Build Command**: `npm ci && npm run build:static-css`
* **Zero Database Dependencies**: The public website is a 100% static site. It does **not** connect to any database (no MySQL, no TiDB Cloud, no external relational database), requires no server runtime, and uses no server secrets.
* **Visual Identity**: **Editorial Monochrome** (Black, White, Gray) paired with an intentional **Crimson Red (`#E3343F`)** accent for focus, badges, and active highlights.
* **Key Features**:
  * **5 Full Case Studies**: Dedicated technical breakdowns for all five portfolio projects with SVG architecture schematics.
  * **Client-Side Terminal**: Offline interactive command palette (`Ctrl+K` or `>_ Terminal`) with command history and project aliases.
  * **Netlify Forms**: Static contact form with automated spam protection and honeypot filtering (`name="contact"`).
  * **Official CV Download**: Direct access to verified November 2026 Curriculum Vitae (`/assets/documents/Tanvir-Anjum-CV.pdf`).

### Path B: ASP.NET Core MVC Learning Application (Root)
* **Status**: Complete full-stack ASP.NET Core MVC application preserved in the repository root for continued academic learning.
* **Separation Policy**: The public static portfolio does **not** rely on the root ASP.NET application or its MySQL database. Both tracks remain strictly decoupled.

---

## 1. Professional Background & Identity

* **Name**: Md. Tanvir Anjum
* **Current Status**: 4th-semester undergraduate
* **Institution**: Patuakhali Science and Technology University (PSTU), Bangladesh
* **Degree**: B.Sc. Engineering in Computer Science and Engineering
* **Session**: 2023–2024
* **Cumulative CGPA**: **3.820 / 4.000** through the third semester
* **Honors**: Dean's Merit Award (Level 1); 1st merit position in the 3rd semester ("First among the students shown in the published third-semester result sheet")
* **Canonical Domain**: [https://mtanviranjum.tech](https://mtanviranjum.tech)
* **Direct Email**: [tanviranjum201@gmail.com](mailto:tanviranjum201@gmail.com)
* **Profile Assets**:
  * WebP Photo: `site/assets/images/profile/tanvir-anjum.webp`
  * JPG Fallback: `site/assets/images/profile/tanvir-anjum.jpg`
  * Official CV: `site/assets/documents/Tanvir-Anjum-CV.pdf`

### Verified Profiles
* **GitHub**: [github.com/MtanvirA](https://github.com/MtanvirA)
* **LinkedIn**: [linkedin.com/in/md-tanvir-anjum-3642371aa](https://www.linkedin.com/in/md-tanvir-anjum-3642371aa/)
* **Codeforces**: [codeforces.com/profile/MtanvirA](https://codeforces.com/profile/MtanvirA)
* **LeetCode**: [leetcode.com/u/MtanvirA/](https://leetcode.com/u/MtanvirA/)

---

## 2. Verified Five-Project Catalogue

Every public-facing description across the homepage, project archive, case studies, terminal, and diagrams has been audited against actual repository source code and the verified November 2026 CV.

| Project | Category | Verified Technology Stack | Core Capabilities | Case Study Route | Repository |
|---|---|---|---|---|---|
| **ShareSync** | Full-Stack Web | ASP.NET Core (C#), Entity Framework Core, MySQL 8, JavaScript, Bootstrap 5, Chart.js | Holdings management, buy/sell transaction logging, watchlists, dividend tracking, portfolio valuation reports, CAGR, annualized volatility, and maximum drawdown metrics across 400+ DSE companies. | [`/projects/sharesync/`](site/projects/sharesync/index.html) | [GitHub](https://github.com/MtanvirA/ShareSync) |
| **NAS Sync Mini Server** | IoT / Embedded Systems | C++, ESP32, microSD, OLED, DHT11, PlatformIO | ESP32-based network storage and media server for trusted local networks (LAN). In-browser file management, uploads/downloads, media streaming, OLED status telemetry, and ambient temperature/humidity monitoring. | [`/projects/nas-sync-mini-server/`](site/projects/nas-sync-mini-server/index.html) | [GitHub](https://github.com/MtanvirA/NAS_Sync-Mini-Server) |
| **CampusSync** | Academic Systems | HTML, CSS, JavaScript, SQL | Academic scheduling and coordination platform prototype for PSTU CSE. Demonstrates class confirmations, available time slots, and schedule-conflict checks using structured mock data. | [`/projects/campussync/`](site/projects/campussync/index.html) | [GitHub](https://github.com/MtanvirA/CampusSync) |
| **Smart Railway Track Health Monitoring** | IoT Prototype | ESP32, Sensors, OLED, Buzzer, Embedded Systems | Academic IoT railway-safety prototype combining train-speed monitoring, ultrasonic obstacle detection, automatic signaling relays, live OLED telemetry status, and audio buzzer alerts. | [`/projects/railway-track-health-monitoring/`](site/projects/railway-track-health-monitoring/index.html) | [GitHub](https://github.com/MtanvirA/Smart-Railway-Track-Monitoring) |
| **PSTU Student Enrollment System** | Java / OOP | Java, Object-Oriented Programming | Menu-driven console enrollment and fee-management system. Implements role-based access (Student, Cashier, Admin), CGPA fee reductions, cashier payment approval, plain-text receipts, student records, and CSV export. | [`/projects/student-enrollment-system/`](site/projects/student-enrollment-system/index.html) | [GitHub](https://github.com/MtanvirA/Student-Enrollment-System-Using-Java) |

---

## 3. Technical Skills & Engineering Toolkit

### Verified Skills from November 2026 CV
* **Programming Languages**: C, C++, Java, C#, JavaScript, SQL
* **Web & Frameworks**: ASP.NET Core, Entity Framework Core, HTML5, CSS3, Bootstrap 5, Chart.js
* **Databases**: MySQL, Oracle, Relational Database Modeling (3NF, constraints, ACID transactions)
* **Embedded & Development Tools**: ESP32, PlatformIO, OLED (SSD1306), microSD, DHT11, Git, GitHub, Visual Studio Code
* **Problem Solving**: Data Structures and Algorithms, Competitive Programming (Codeforces, LeetCode)

### Additional Confirmed Practices
* **Python**: Programming fundamentals, syntax, and practical scripting (confirmed familiarity; not listed on Nov CV).
* **Tailwind CSS**: Utility-first CSS architecture utilized for compiling the static production portfolio stylesheet.

### Practical AI-Assisted Development (Software Workflow Skills)
* **Tooling**: ChatGPT, GitHub Copilot, Google Antigravity
* **Engineering Workflow**: Prompt engineering, task decomposition, AI-assisted implementation, debugging assistance, code explanation and review, documentation assistance
* *Note: Described strictly as practical developer workflow skills. Clearly distinguished from academic machine learning and deep learning research interests; not listed on the November 2026 CV.*

---

## 4. Academic Progression (PSTU CSE)

* **Degree**: B.Sc. Engineering in Computer Science and Engineering
* **Session**: 2023–2024 | **Current Status**: 4th-semester undergraduate
* **Cumulative CGPA**: **3.820 / 4.000** through the third semester
* **Honors**: Dean's Merit Award (Level 1); 1st merit position in the 3rd semester ("First among the students shown in the published third-semester result sheet")

### Semester Breakdown
* **First Semester**: 3.870 GPA
* **Second Semester**: 3.771 GPA
* **Third Semester**: 3.821 GPA (1st merit position)
* **Cumulative**: 3.820 CGPA

### Selected Second-Semester Coursework (All 9 Verified Transcript Entries)
1. **PHY-121** — Physics-II &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)
2. **PHY-122** — Physics-II Sessional &bull; Grade A+ (4.00) &bull; Laboratory Sessional (0.75 Credits)
3. **MAT-121** — Mathematics-II &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)
4. **CIT-121** — Discrete Mathematics &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)
5. **LCM-121** — Communicative English &bull; Grade A- (3.50) &bull; Theory (2.00 Credits)
6. **EEE-121** — Electronic Device and Circuits &bull; Grade A (3.75) &bull; Theory (3.00 Credits)
7. **EEE-122** — Electronic Device and Circuits Sessional &bull; Grade A+ (4.00) &bull; Laboratory Sessional (1.50 Credits)
8. **CCE-121** — Object Oriented Programming &bull; Grade B (3.00) &bull; Theory (3.00 Credits)
9. **CCE-122** — Object Oriented Programming Sessional &bull; Grade A+ (4.00) &bull; Laboratory Sessional (1.50 Credits)

---

## 5. Research Interests & Exploration Areas

The CV identifies five areas of keen academic interest that the user is eager to explore in advanced undergraduate studies and future graduate work:
1. **Machine Learning** — Academic research interest in statistical foundations and predictive modeling techniques.
2. **Deep Learning** — Learning direction centered on neural representations and architecture optimization.
3. **Artificial Intelligence** — Research interest in algorithmic problem solving, search heuristics, and intelligent systems.
4. **Robotics** — Exploratory learning direction in physical computing, autonomous systems, and control dynamics.
5. **Intelligent Embedded Systems** — Research interest bridging microcontroller platforms (ESP32) with sensory integration and embedded control.

*Integrity note: These topics represent genuine areas of study and future exploration; the portfolio does not claim active research publications, proprietary model training, or commercial robotic deployments without documented evidence.*

---

## 6. Directory Structure of `site/`

```
site/
├── index.html                                 # Landing page (Hero, About, Projects, Toolkit, Academia, Research, Contact)
├── 404.html                                   # Accessible custom 404 page
├── robots.txt                                 # Search crawler directives
├── sitemap.xml                                # XML search sitemap
├── favicon.svg / favicon.ico                  # Vector and raster brand icons
├── thank-you/
│   └── index.html                             # Form submission confirmation page
├── projects/
│   ├── index.html                             # 5-project catalogue with category filters
│   ├── sharesync/
│   │   └── index.html                         # ShareSync full case study
│   ├── nas-sync-mini-server/
│   │   └── index.html                         # NAS Sync Mini Server full case study
│   ├── campussync/
│   │   └── index.html                         # CampusSync scheduling prototype case study
│   ├── railway-track-health-monitoring/
│   │   └── index.html                         # Smart Railway Track Monitoring case study
│   └── student-enrollment-system/
│       └── index.html                         # Student Enrollment System (Java) case study
├── assets/
│   ├── css/
│   │   ├── site.min.css                       # Compiled, minified Tailwind CSS v4 stylesheet
│   │   └── interactions.css                   # Editorial Monochrome & micro-interaction styles
│   ├── documents/
│   │   └── Tanvir-Anjum-CV.pdf                # Verified November 2026 Curriculum Vitae
│   ├── images/
│   │   ├── og-card.svg                        # Open Graph social sharing card
│   │   ├── profile-placeholder.svg            # Fallback profile graphic
│   │   ├── profile/
│   │   │   ├── tanvir-anjum.webp              # Authentic portrait photo (WebP optimized)
│   │   │   └── tanvir-anjum.jpg               # Authentic portrait photo (JPG fallback)
│   │   └── projects/                          # High-contrast technical SVG schematics
│   │       ├── sharesync.svg
│   │       ├── nas-sync.svg
│   │       ├── campussync.svg
│   │       ├── railway.svg
│   │       └── student-enrollment.svg
│   └── js/
│       ├── site.js                            # Navigation, spotlight tracking, form validation
│       └── terminal.js                        # Offline client-side interactive terminal modal
└── styles/
    └── site.css                               # Tailwind CSS input configuration
```

---

## 7. Client-Side Interactive Terminal

Accessible via `Ctrl+K` or the `>_ Terminal` button on every page. Operates **100% offline in client-side JavaScript**:
* **Core Commands**: `help`, `about`, `projects`, `skills`, `education`, `research`, `cv`, `links`, `contact`, `whoami`, `date`, `clear`, `exit`.
* **Project Deep-Dive Commands & Aliases**:
  * `project sharesync`
  * `project railway`
  * `project campussync`
  * `project nassync` (or `project nas-sync`)
  * `project enrollment` (or `project student-enrollment`)
* **Accessibility**: Native HTML5 `<dialog closedby="any">` with Escape-to-close behavior, backdrop click detection, and history cycling with Arrow keys.

---

## 8. Netlify Forms & Static Deployment

The contact form on `site/index.html` submits asynchronously via Netlify Forms:
```html
<form id="contactForm" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you/">
  <input type="hidden" name="form-name" value="contact" />
  <p class="hidden">
    <label>Don’t fill this out if you're human: <input name="bot-field" /></label>
  </p>
  ...
</form>
```

### Local Build Commands
```powershell
# Compile production static CSS
npm run build:static-css

# Watch and recompile static CSS during local development
npm run watch:static-css
```

---

## 9. License

This repository is open-source under the [MIT License](LICENSE).
