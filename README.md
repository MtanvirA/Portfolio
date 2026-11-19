# Md. Tanvir Anjum — Personal Engineering Portfolio

[![Netlify Status](https://img.shields.io/badge/Netlify-Free%20Tier%20($0)-00C7B7?logo=netlify)](https://www.netlify.com/)
[![Static Site](https://img.shields.io/badge/Architecture-Static%20HTML%2FCSS%2FJS-E34F26?logo=html5)](https://mtanviranjum.tech)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![.NET 10 LTS](https://img.shields.io/badge/.NET-10.0%20LTS%20(Learning%20App)-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![MySQL 8.0](https://img.shields.io/badge/Database-MySQL%208.0%20(Learning%20App)-4479A1?logo=mysql)](https://www.mysql.com/)
[![Tests](https://img.shields.io/badge/ASP.NET%20Tests-74%20Passed-22c55e)](#path-b-aspnet-core-mvc-learning-application)

A dual-track engineering repository created for **Md. Tanvir Anjum**, an undergraduate Computer Science and Engineering student at **Patuakhali Science and Technology University (PSTU)**, Bangladesh.

---

## Important Architectural Overview: Two Decoupled Paths

This repository houses two clearly separated application architectures:

```
                                  Repository Root
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
         [ PATH A: PUBLIC SITE ]                         [ PATH B: LEARNING APP ]
         Static Production Portfolio                     ASP.NET Core MVC Architecture
         Location: site/                                 Location: Repository Root (Controllers, Views...)
         Target: Netlify Free ($0/month)                 Target: Localhost / Academic Exploration
         Domain: https://mtanviranjum.tech               Stack: .NET 10, EF Core, MySQL, MailKit
         Runtime: Pure HTML5, CSS, Vanilla JS,           Status: 74 Automated Tests Passing;
                  Netlify Forms, Engineering Canvas              Kept Intact for Learning & Future Work
```

### Path A: Public Production Static Portfolio (`site/`)
* **Primary Domain**: [https://mtanviranjum.tech](https://mtanviranjum.tech)
* **Hosting Platform**: **Netlify Free Tier** (Strictly $0/month budget)
* **Source Directory**: `site/` (Netlify publishes **only** this directory)
* **Build Command**: `npm ci && npm run build:static-css`
* **Zero Backend Overhead**: Requires **no** .NET runtime, **no** ASP.NET server, **no** MySQL database, **no** Docker, **no** Render, **no** Resend API, and **no** server secrets.
* **Key Features**:
  * **Engineering Canvas**: Ambient, interactive background system with cursor-following spotlight, reactive circuit grid nodes, and monospace HUD micro-labels.
  * **Client-Side Terminal**: Fully offline interactive console (Ctrl+K or `>_ Terminal` button) with custom command parser.
  * **Netlify Forms**: Static contact form with automated spam protection and honeypot filtering (`data-netlify="true"`).

### Path B: ASP.NET Core MVC Learning Application (Root)
* **Status**: Complete, production-grade full-stack ASP.NET Core MVC application preserved in the repository root as an academic learning project.
* **Backend Stack**: .NET 10 LTS, C#, Entity Framework Core 10, Oracle's `MySql.EntityFrameworkCore` provider, sliding-window IP rate limiting, and dual email notification services (SMTP & Resend REST).
* **Testing Suite**: 74 automated unit and in-memory tests passing.
* **Separation Policy**: The public static portfolio does **not** rely on the ASP.NET backend. The ASP.NET Core implementation, services, database models, and migrations remain completely intact for continued experimentation.

---

## 1. Professional Background & Identity

* **Name**: Md. Tanvir Anjum
* **Positioning**: Aspiring Full-Stack Developer & Competitive Programmer
* **Institution**: Patuakhali Science and Technology University (PSTU), Bangladesh
* **Academic Program**: B.Sc. in Engineering, Computer Science and Engineering (Session 2023–2024)
* **Current Standing**: Undergraduate student (Completed 3rd semester, degree in progress)
* **Provisional CGPA**: **3.820** cumulative CGPA through 3rd semester
* **Canonical Domain**: [https://mtanviranjum.tech](https://mtanviranjum.tech)
* **Direct Email**: [tanviranjum201@gmail.com](mailto:tanviranjum201@gmail.com)

### Verified Profiles
* **GitHub**: [github.com/MtanvirA](https://github.com/MtanvirA)
* **LinkedIn**: [linkedin.com/in/md-tanvir-anjum-3642371aa](https://www.linkedin.com/in/md-tanvir-anjum-3642371aa/)
* **Codeforces**: [codeforces.com/profile/MtanvirA](https://codeforces.com/profile/MtanvirA)
* **LeetCode**: [leetcode.com/u/MtanvirA/](https://leetcode.com/u/MtanvirA/)
* **Facebook**: [facebook.com/mtanvira.uo](https://www.facebook.com/mtanvira.uo/)

---

## 2. Path A: Public Static Portfolio & Netlify Deployment Guide

The public portfolio is built using semantic HTML5, modern vanilla JavaScript, and Tailwind CSS v4, completely isolated from any database or server runtime.

### Directory Structure of `site/`
```
Portfolio/
├── site/
│   ├── index.html                   # Main landing page with all 7 core sections
│   ├── 404.html                     # Custom 404 error page
│   ├── robots.txt                   # Search engine crawler instructions
│   ├── sitemap.xml                  # XML sitemap for search indexation
│   ├── favicon.svg / favicon.ico    # Vector and raster brand icons
│   ├── thank-you/
│   │   └── index.html               # Form submission confirmation page
│   ├── projects/
│   │   ├── index.html               # Full project catalogue with category filtering
│   │   ├── sharesync/
│   │   │   └── index.html           # ShareSync full case study
│   │   ├── railway-track-health-monitoring/
│   │   │   └── index.html           # Railway track monitoring case study
│   │   └── campussync/
│   │       └── index.html           # CampusSync scheduling case study
│   ├── assets/
│   │   ├── css/
│   │   │   ├── site.min.css         # Compiled, minified Tailwind CSS v4 stylesheet
│   │   │   └── interactions.css     # Engineering Canvas & micro-interaction styles
│   │   ├── js/
│   │   │   ├── site.js              # Navigation, Netlify Form enhancement, spotlight & circuit tracking
│   │   │   └── terminal.js          # Offline client-side interactive command palette
│   │   └── images/
│   │       ├── profile-placeholder.svg
│   │       ├── og-card.svg
│   │       └── projects/            # Technical schematic diagrams (SVG)
│   └── styles/
│       └── site.css                 # Dedicated Tailwind input stylesheet for the static site
├── netlify.toml                     # Root Netlify build & deployment configuration
└── package.json                     # NPM build scripts
```

### The Engineering Canvas Interaction System
To address visually inactive negative space, the portfolio incorporates an ambient, hardware-inspired interaction system called **Engineering Canvas**:

1. **Interactive Background Spotlight**:
   * Uses CSS custom properties (`--pointer-x`, `--pointer-y`, `--spotlight-opacity`) updated via `requestAnimationFrame`.
   * Projects a soft, diffuse lime (`#d4ff3a`) and teal (`#14b8a6`) radial spotlight that follows the cursor across empty section space.
   * Fades smoothly upon mouse leave.
2. **Interactive Circuit Grid**:
   * Subtle background SVG layers containing fine 36px/40px grid lines, 45-degree and 90-degree circuit traces, and geometric nodes.
   * When the pointer nears a node (`dist < 135px`), the node dynamically illuminates (`.active` with lime/teal glow).
   * Selected anchor nodes exhibit gentle, ambient breathing pulses (`@keyframes circuitPulse`).
3. **Restrained Section HUD Labels**:
   * Monospace micro-badges (`SYS/01 &bull; KERNEL ONLINE`, `SYS/02 &bull; LOGIC // FOUNDATIONS`, `SCHEMATICS // VERIFIED`) strategically placed in section margins.
4. **Card Hover Mechanics & Scanlines**:
   * Project, skill, and academic cards provide a subtle 4px upward translation, localized accent border glow, and a faint scanning-line sweep across technical schematic diagrams.
5. **Accessibility & Responsive Safeguards**:
   * Cursor tracking is **only** bound on devices with fine hover capability (`@media (hover: hover) and (pointer: fine)`).
   * On mobile/touchscreens, mouse listeners are never registered, preserving battery and touch responsiveness.
   * Respects `@media (prefers-reduced-motion: reduce)` by removing animations, transitions, and transforms.
   * All decorative canvas layers have `pointer-events: none` to prevent blocking selection, clicks, or keyboard navigation.

### Client-Side Interactive Terminal
The command palette (`Ctrl+K` or `>_ Terminal` button) operates **100% offline** in JavaScript:
* **Available Commands**: `help`, `about`, `projects`, `project sharesync`, `project railway`, `project campussync`, `skills`, `education`, `links`, `contact`, `whoami`, `date`, `clear`, `exit`.
* **Keyboard Navigation**: History cycling with ArrowUp and ArrowDown keys.
* **Modal Accessibility**: Native HTML5 `<dialog closedby="any">` with fallback backdrop click detection and Escape-to-close behavior.

### Netlify Forms Configuration
The contact form on `site/index.html` uses Netlify Forms for serverless message collection:
```html
<form name="portfolio-contact" method="POST" action="/thank-you/" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="portfolio-contact" />
  <div class="hidden" aria-hidden="true">
    <input type="text" name="bot-field" tabindex="-1" autocomplete="off" />
  </div>
  ...
</form>
```

#### Manual Setup for Email Notifications
Netlify stores submissions in the site's Forms dashboard. To receive notification emails when a message arrives:
1. Log in to your [Netlify Dashboard](https://app.netlify.com).
2. Navigate to **Site Configuration** &rarr; **Forms**.
3. Under **Form notifications**, click **Add notification** &rarr; **Email notification**.
4. Configure:
   * **Event**: `New form submission`
   * **Form**: `portfolio-contact` (or `Any form`)
   * **Email to notify**: `tanviranjum201@gmail.com`
5. Click **Save**. Netlify sends a verification email to `tanviranjum201@gmail.com`. Click the confirmation link to activate alerts.

### Strict $0 Hosting Policy & Netlify Free Limits
* **Monthly Bandwidth**: 100 GB / month.
* **Build Minutes**: 300 minutes / month.
* **Form Submissions**: 100 submissions / month.
* **Hard Limit Enforcement**: Auto-recharge and credit card attachment must remain **disabled**. When free allowances are exhausted, Netlify temporarily pauses the site until the next credit cycle rather than incurring overage charges.
* **Domain**: The owned domain `mtanviranjum.tech` is used without purchasing extra services.

### Netlify Deployment Configuration (`netlify.toml`)
```toml
[build]
  command = "npm ci && npm run build:static-css"
  publish = "site"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

### Local Static Site Compilation
To compile the static Tailwind CSS stylesheet locally:
```powershell
npm run build:static-css
```
To run continuous live recompilation while editing:
```powershell
npm run watch:static-css
```

---

## 3. Path B: ASP.NET Core MVC Learning Application

The original ASP.NET Core application remains fully functional in the repository as a learning and experimentation vehicle.

### Backend Tech Stack
* **Runtime**: .NET 10.0 LTS (SDK 10.0.404)
* **Framework**: ASP.NET Core MVC (C#)
* **ORM**: Entity Framework Core 10 (`Microsoft.EntityFrameworkCore` 10.0.12)
* **MySQL Provider**: `MySql.EntityFrameworkCore` 10.0.12 (Oracle's official EF Core 10 provider)
* **Testing**: xUnit with 74 passing tests (`dotnet test -c Release`)
* **Contact Persistence**: MySQL `contact_messages` table with SHA-256 IP hashing, sliding-window rate limiting, and honeypot anti-spam protection.

### Local Development Setup for ASP.NET Core
1. **Prerequisites**: .NET 10 SDK, Node.js, and local MySQL 8.0 server.
2. **Compile ASP.NET Stylesheet**:
   ```powershell
   npm run build:css
   ```
3. **Configure Local Secrets**:
   ```powershell
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=portfolio_db;Uid=portfolio_user;Pwd=YOUR_LOCAL_PASSWORD;"
   ```
4. **Run Unit Tests**:
   ```powershell
   dotnet test -c Release
   ```
5. **Run the Learning Web App**:
   ```powershell
   dotnet run --launch-profile "http"
   ```
   Navigate to `http://localhost:5124`.

*(Note: Cloud TiDB migration scripts in `Migrations/` are standalone prototypes and are not required or executed for Netlify static deployment).*

---

## 4. Verified Projects Catalogue

1. **ShareSync** (`/projects/sharesync/`)
   * **Category**: Full-Stack Web
   * **Status**: Academic Project (In Active Development)
   * **Stack**: C#, ASP.NET Core MVC, MySQL, Entity Framework Core, Tailwind CSS, JavaScript
   * **Description**: Academic share-market investment portfolio and transaction tracking application exploring relational database schema design, position averaging calculations, and profit/loss reconciliation.
   * **Repository**: [https://github.com/MtanvirA/ShareSync](https://github.com/MtanvirA/ShareSync)

2. **Smart Railway Track Health Monitoring** (`/projects/railway-track-health-monitoring/`)
   * **Category**: IoT & Systems
   * **Status**: Academic Hardware Prototype / Concept
   * **Stack**: C/C++ (ESP-IDF/Arduino), ESP32, Ultrasonic Sensors, 0.96" OLED, Buzzer Module
   * **Description**: Embedded IoT safety prototype combining transit-time speed calculation, obstacle proximity scanning, audio buzzer alerts, and automated multi-color signaling logic.
   * **Repository**: [https://github.com/MtanvirA/Smart-Railway-Track-Monitoring](https://github.com/MtanvirA/Smart-Railway-Track-Monitoring)

3. **CampusSync** (`/projects/campussync/`)
   * **Category**: Academic Systems
   * **Status**: Department Prototype / In Design Phase
   * **Stack**: C#, ASP.NET Core, MySQL, Tailwind CSS, JavaScript
   * **Description**: University department schedule and lab resource coordination platform designed for the PSTU CSE department to eliminate classroom and laboratory double-booking.
   * **Repository**: [https://github.com/MtanvirA/CampusSync](https://github.com/MtanvirA/CampusSync)

---

## 5. Academic Standing (PSTU Provisional Records)

* **Degree**: B.Sc. in Engineering, Computer Science and Engineering
* **Institution**: Patuakhali Science and Technology University (PSTU)
* **Session**: 2023–2024
* **Overall Cumulative CGPA**: **3.820** through 3rd Semester

| Semester | Semester GPA | Cumulative CGPA | Academic Focus |
| :--- | :---: | :---: | :--- |
| **First Semester** | **3.870** | **3.870** | Fundamentals of computing, problem-solving, mathematics |
| **Second Semester** | **3.771** | **3.820** | Structured programming, OOP, engineering sciences |
| **Third Semester** | **3.821** | **3.820** | Data structures, discrete algorithms, software engineering |

---

## 6. Security, Secret Hygiene & Integrity Policy

* **Zero Public Data Leakage**: No database or administrative endpoints are published on the static website.
* **Strict Secret Isolation**: No database passwords, API tokens, or SMTP keys are included in `site/` or committed to version control.
* **Honeypot Trap**: Forms include a hidden `bot-field` trap that rejects automated bots.
* **Database Isolation**: The public static website runs completely isolated from all databases.

---

## 7. License

This project is licensed under the [MIT License](LICENSE).
