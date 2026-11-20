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
         Hosting: Netlify Free ($0/mo)                   Target: Localhost / Academic Exploration
         Domain: https://mtanviranjum.tech               Stack: .NET 10, EF Core, MySQL, MailKit
         Runtime: Static HTML5, CSS3, Vanilla JS,        Status: Standalone academic learning project;
                  Netlify Forms, Responsive SVGs                 Preserved intact for experimentation
```

### Path A: Public Production Static Portfolio (`site/`)
* **Live Canonical Domain**: [https://mtanviranjum.tech](https://mtanviranjum.tech)
* **Hosting Platform**: **Netlify Free Tier** ($0/month)
* **Publish Directory**: `site` (Netlify serves only static assets from this directory)
* **Build Command**: `npm ci && npm run build:static-css`
* **Zero Database Dependencies**: The public website is a 100% static site. It does **not** connect to any database (no MySQL, no TiDB Cloud, no external relational database), requires no server runtime, and uses no server secrets.
* **Visual Identity**: **Editorial Monochrome** (Black `#0B0B0C`, Charcoal `#141416`, Slate `#252528`, Gray `#858585`) paired with an intentional **Crimson Red (`#E3343F`)** accent.
* **Key Features**:
  * **5 Full Case Studies**: Dedicated technical breakdowns for all five portfolio projects with architectural schematics.
  * **7 Standardized Chapters**: Unified navigation across all pages (`01 WORK`, `02 RESEARCH`, `03 TOOLKIT`, `04 ACADEMIA`, `05 HOW I BUILD`, `06 ABOUT`, `07 CONTACT`).
  * **Client-Side Terminal**: Offline interactive command palette (`Ctrl+K` or `>_ Terminal`) with command history and project aliases.
  * **Netlify Forms**: Static contact form with automated spam protection, honeypot filtering (`name="contact"`), and redirect to `/thank-you/`.
  * **Official CV Download**: Direct access to verified Curriculum Vitae (`/assets/documents/Tanvir-Anjum-CV.pdf`).
  * **1200×630 Open Graph Cards**: High-resolution PNG preview cards for social sharing across the homepage and all project pages.

### Path B: ASP.NET Core MVC Learning Application (Root)
* **Status**: Full-stack ASP.NET Core MVC application preserved in the repository root for continued academic learning.
* **Legacy Configurations**: `Dockerfile`, `docker-compose.yml`, and `render.yaml` belong to previous ASP.NET container/Render deployment explorations. They are **not** used by the current Netlify static production deployment.
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
  * Illustrated Geometric Pixel-Art Portrait (WebP): `site/assets/images/profile/tanvir-pixel-portrait.webp`
  * Illustrated Geometric Pixel-Art Portrait (PNG Fallback): `site/assets/images/profile/tanvir-pixel-portrait.png`
  * Authentic Photo Fallback (WebP): `site/assets/images/profile/tanvir-anjum.webp`
  * Authentic Photo Fallback (JPG): `site/assets/images/profile/tanvir-anjum.jpg`
  * Official CV: `site/assets/documents/Tanvir-Anjum-CV.pdf`

### Verified Profiles
* **GitHub**: [github.com/MtanvirA](https://github.com/MtanvirA)
* **LinkedIn**: [linkedin.com/in/md-tanvir-anjum-3642371aa](https://www.linkedin.com/in/md-tanvir-anjum-3642371aa/)
* **Codeforces**: [codeforces.com/profile/MtanvirA](https://codeforces.com/profile/MtanvirA)
* **LeetCode**: [leetcode.com/u/MtanvirA/](https://leetcode.com/u/MtanvirA/)

---

## 2. Verified Five-Project Catalogue

Every public-facing description across the homepage, project archive, case studies, terminal, and diagrams has been audited against actual repository source code and the verified marksheet/CV records.

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
* **Python**: Practical scripting and automation (confirmed familiarity).
* **Tailwind CSS**: Utility-first CSS architecture utilized for compiling the static production portfolio stylesheet.

### Practical AI-Assisted Development
* **Tooling**: ChatGPT, GitHub Copilot, Google Antigravity
* **Engineering Workflow**: Prompt engineering, task decomposition, AI-assisted implementation, debugging assistance, code explanation and review, documentation assistance.
* *Note: Described strictly as practical developer workflow skills. Clearly distinguished from academic machine learning and deep learning research interests; not listed on the November 2026 CV.*

---

## 4. Academic Progression (PSTU CSE)

* **Degree**: B.Sc. Engineering in Computer Science and Engineering
* **Session**: 2023–2024 | **Current Status**: 4th-semester undergraduate
* **Cumulative CGPA**: **3.820 / 4.000** through the third semester
* **Completed Credit Hours**: **62.00 Total Credits** across three semesters
* **Honors**: Dean's Merit Award (Level 1); 1st merit position in the 3rd semester ("First among the students shown in the published third-semester result sheet")

### Semester Breakdown & Official Marksheets
* **First Semester**: **3.870 GPA** &bull; **20.25 Credits**
* **Second Semester**: **3.771 GPA** &bull; **20.75 Credits**
* **Third Semester**: **3.821 GPA** &bull; **21.00 Credits** (1st merit position)
* **Cumulative**: **3.820 CGPA** &bull; **62.00 Total Credits Completed**

### Selected CSE Theory Coursework Across Three Semesters
* **Semester 1 — Programming Foundations (GPA 3.870 &bull; 20.25 Credits Total)**:
  1. **CIT-111** — Programming Language &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)
  2. **MAT-111** — Mathematics-I &bull; Grade A (3.75) &bull; Theory (3.00 Credits)
  3. **EEE-111** — Basic Electrical Engineering &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)
* **Semester 2 — Mathematical & Object-Oriented Foundations (GPA 3.771 &bull; 20.75 Credits Total)**:
  1. **CIT-121** — Discrete Mathematics &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)
  2. **CCE-121** — Object Oriented Programming &bull; Grade B (3.00) &bull; Theory (3.00 Credits)
  3. **MAT-121** — Mathematics-II &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)
  4. **EEE-121** — Electronic Device and Circuits &bull; Grade A (3.75) &bull; Theory (3.00 Credits)
* **Semester 3 — Core Computer Science & Systems (GPA 3.821 &bull; 21.00 Credits Total &bull; 1st Merit Position)**:
  1. **CIT-211** — Data Structure and Algorithms &bull; Grade A- (3.50) &bull; Theory (3.00 Credits)
  2. **CIT-213** — Software Engineering &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)
  3. **CCE-211** — Data Communication and Engineering &bull; Grade A- (3.50) &bull; Theory (3.00 Credits)
  4. **MAT-211** — Mathematics-III &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)
  5. **EEE-211** — Electrical Technology &bull; Grade A+ (4.00) &bull; Theory (3.00 Credits)

---

## 5. Directory Structure of `site/`

```
site/
├── index.html                                 # Landing page (7 chapters, contact form, pixel portrait)
├── 404.html                                   # Accessible custom 404 page
├── robots.txt                                 # Search crawler directives (disallows /thank-you/)
├── sitemap.xml                                # XML search sitemap (7 canonical routes)
├── favicon.svg / favicon.ico                  # Vector and raster brand icons
├── thank-you/
│   └── index.html                             # Form submission confirmation page (noindex, follow)
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
│   │   └── Tanvir-Anjum-CV.pdf                # Verified Curriculum Vitae
│   ├── images/
│   │   ├── og-card.png                        # 1200x630 Open Graph PNG social sharing card
│   │   ├── og-card.svg                        # Vector Open Graph design source
│   │   ├── profile-placeholder.svg            # Fallback profile graphic
│   │   ├── profile/
│   │   │   ├── tanvir-pixel-portrait.webp     # Illustrated geometric pixel-art portrait (WebP primary)
│   │   │   ├── tanvir-pixel-portrait.png      # Illustrated geometric pixel-art portrait (PNG fallback)
│   │   │   ├── tanvir-anjum.webp              # Authentic portrait photo (WebP preserved fallback)
│   │   │   └── tanvir-anjum.jpg               # Authentic portrait photo (JPG preserved fallback)
│   │   └── projects/                          # High-resolution PNG and SVG schematics
│   │       ├── sharesync.png / sharesync.svg
│   │       ├── nas-sync.png / nas-sync.svg
│   │       ├── campussync.png / campussync.svg
│   │       ├── railway.png / railway.svg
│   │       └── student-enrollment.png / student-enrollment.svg
│   └── js/
│       ├── site.js                            # Navigation, drawer, scrollspy, ticker, canvas physics
│       └── terminal.js                        # Offline client-side interactive terminal modal
└── styles/
    └── site.css                               # Tailwind CSS input configuration
```

---

## 6. Local Development & Build

### Prerequisites
* **Node.js**: `v22.x` (LTS recommended)
* **npm**: `v10.x` or higher
* **Git**: Installed and available in PATH

### Setup & Local Commands
```powershell
# 1. Clean installation of dependencies
npm ci

# 2. Build the production static stylesheet
npm run build:static-css

# 3. Optional: Watch mode for live CSS development
npm run watch:static-css

# 4. Local static preview (any static file server):
npx serve site
# or
python -m http.server 3000 --directory site
```
Visit `http://localhost:3000/` to test the local static site.

---

## 7. Netlify Production Deployment Configuration

The production static site is configured through `netlify.toml` in the repository root:

* **GitHub Repository**: `MtanvirA/Portfolio`
* **Production Branch**: `main`
* **Base Directory**: Repository root (`.`)
* **Build Command**: `npm ci && npm run build:static-css`
* **Publish Directory**: `site`
* **Node Version**: `22` (specified in `[build.environment]`)

### Authoritative Response Headers (`netlify.toml`)
* `X-Frame-Options: DENY` (prevents framing/clickjacking)
* `X-Content-Type-Options: nosniff` (strict MIME sniffing prevention)
* `Referrer-Policy: strict-origin-when-cross-origin`
* `Permissions-Policy: camera=(), microphone=(), geolocation=()`
* `Content-Security-Policy-Report-Only`: Baseline CSP allowing `'self'`, Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), inline scripts/styles, and Netlify submission endpoints.
* **Browser Caching Policy**:
  * `/assets/*`: Configured with `Cache-Control: public, max-age=0, must-revalidate` so browsers revalidate assets with Netlify's edge CDN, avoiding stale cached stylesheets or scripts across atomic deploys.
  * Netlify's built-in atomic deployments automatically manage CDN edge cache invalidation.

---

## 8. Netlify Forms Setup & Gmail Forwarding

The homepage contact form (`site/index.html`) is structured natively for Netlify Forms:
```html
<form id="contactForm"
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      action="/thank-you/"
      class="space-y-4">
    <p class="hidden" aria-hidden="true">
        <label>Don’t fill this out if you're human: <input name="bot-field" /></label>
    </p>
    ...
</form>
```

> **Note on Static Forms**: During deployment, Netlify's build processor parses `<form data-netlify="true">`, strips the attribute, and injects its internal `form-name` hidden field. The static HTML does **not** include duplicate hidden inputs.

### Post-Deployment Dashboard Checklist (Manual Steps)
Because Netlify accounts require manual authentication, complete these steps in the Netlify UI after the initial deploy:
1. Log into your [Netlify Dashboard](https://app.netlify.com/).
2. Navigate to **Site configuration** &rarr; **Forms**.
3. Ensure **Form detection** is enabled (toggle to **Active**).
4. Trigger a new deploy (or push a commit) so Netlify crawls the static HTML.
5. In the **Forms** tab, confirm that the `contact` form is detected.
6. Click **Form notifications** &rarr; **Add notification** &rarr; **Email notification**.
7. Enter notification email: `tanviranjum201@gmail.com`.
8. Check your Gmail inbox for a Netlify verification email and confirm the subscription.
9. Perform a test submission at `https://mtanviranjum.tech/#contact` and verify that:
   - The submission redirects to `/thank-you/`.
   - The message appears in Netlify Forms dashboard.
   - You receive an email alert in Gmail.

---

## 9. Custom Domain Configuration (`mtanviranjum.tech`)

To connect the custom domain `mtanviranjum.tech` to Netlify:
1. In the Netlify Dashboard, navigate to **Site configuration** &rarr; **Domain management**.
2. Click **Add custom domain** and enter `mtanviranjum.tech`.
3. Select **Add domain** and designate `mtanviranjum.tech` as the primary domain (with `www.mtanviranjum.tech` redirecting automatically to apex, or vice versa based on your preferred canonical form).
4. At your external domain registrar or DNS provider (Namecheap, Porkbun, Cloudflare, etc.), configure DNS records using the **exact values displayed in your Netlify Dashboard**:
   * **Apex Domain (`@`)**:
     * *Recommended (if supported by your DNS provider)*: Create an `ALIAS`, `ANAME`, or flattened `CNAME` record pointing to your Netlify site URL (e.g., `<your-site-name>.netlify.app`).
     * *Standard A Record*: If your registrar only supports traditional A records at the apex, obtain Netlify's authoritative load balancer IP directly from the Netlify Domain Management instructions on screen and create an `A` record pointing to that designated IP. Do not hardcode arbitrary external IPs.
   * **Subdomain (`www`)**:
     * Create a standard `CNAME` record with host `www` pointing to `<your-site-name>.netlify.app` (or your apex domain per Netlify dashboard guidance).
   * *Alternative (Netlify DNS)*: You may optionally delegate DNS management by pointing your registrar's nameservers to Netlify's managed NS records.
5. Under **HTTPS & SSL/TLS**, Netlify will automatically request, issue, and renew a free Let's Encrypt SSL/TLS certificate once DNS propagation completes (typically within 10–30 minutes).
6. *Security Note*: Keep the site on the standard Content-Security-Policy-Report-Only baseline initially. Do **not** enforce strict CSP or activate HTTP Strict Transport Security (HSTS) preload until custom domain TLS verification and form submission pathways have fully resolved and verified in production.

---

## 10. SEO, Sitemap & Crawler Directives

* **Canonical Domain**: All pages declare canonical URLs referencing `https://mtanviranjum.tech/`.
* **Sitemap (`site/sitemap.xml`)**: Lists all 7 canonical public routes (Home, Projects Archive, ShareSync, Smart Railway, CampusSync, NAS Sync, Student Enrollment). Non-canonical routes (`/thank-you/`, `/404.html`) are intentionally excluded.
* **Robots (`site/robots.txt`)**: Allows search engine indexing across the site while explicitly disallowing `/thank-you/`.
* **Social Previews**: All pages include Open Graph (`og:*`) and Twitter Card (`twitter:*`) metadata pointing to dedicated 1200×630 PNG images (`site/assets/images/og-card.png` and `site/assets/images/projects/*.png`).

---

## 11. Client-Side Interactive Terminal

Accessible via `Ctrl+K` or the `>_ Terminal` button on every page. Operates **100% offline in client-side JavaScript**:
* **Core Commands**: `help`, `about`, `projects`, `skills`, `education`, `research`, `cv`, `links`, `contact`, `whoami`, `date`, `clear`, `exit`.
* **Project Deep-Dive Commands & Aliases**:
  * `project sharesync`
  * `project railway`
  * `project campussync`
  * `project nassync` (or `project nas-sync`)
  * `project enrollment` (or `project student-enrollment`)
* **Accessibility**: Native HTML5 `<dialog>` with Escape-to-close behavior, outside backdrop click detection, and history cycling with Arrow keys.

---

## 12. License

This repository is open-source under the [MIT License](LICENSE).
