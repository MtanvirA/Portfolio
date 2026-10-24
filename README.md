# Md. Tanvir Anjum — Personal Engineering Portfolio

[![.NET 10 LTS](https://img.shields.io/badge/.NET-10.0%20LTS-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![ASP.NET Core MVC](https://img.shields.io/badge/ASP.NET%20Core-MVC-512BD4?logo=dotnet)](https://learn.microsoft.com/aspnet/core)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MySQL 8.0](https://img.shields.io/badge/Database-MySQL%208.0-4479A1?logo=mysql)](https://www.mysql.com/)
[![Tests](https://img.shields.io/badge/Tests-56%20Passed-22c55e)](#automated-testing)

A personal portfolio web application engineered for **Md. Tanvir Anjum**, an undergraduate Computer Science and Engineering student at **Patuakhali Science and Technology University (PSTU)**, Bangladesh.

This is a production-grade software system combining a dark-first editorial frontend, compiled Tailwind CSS asset pipeline, ASP.NET Core MVC backend on .NET 10 LTS, Entity Framework Core with native Oracle MySQL provider, rate-limited and honeypot-protected contact message persistence, and an interactive command-line terminal Easter egg.

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

## 2. Technical Stack & Architecture

### Backend
* **Runtime**: .NET 10.0 LTS (SDK 10.0.402)
* **Framework**: ASP.NET Core MVC (C#)
* **ORM**: Entity Framework Core 10 (`Microsoft.EntityFrameworkCore` 10.0.12)
* **MySQL Provider**: `MySql.EntityFrameworkCore` 10.0.12 (Oracle's official EF Core 10 provider)
* **Dependency Injection**: Scoped services for catalogues, rate limiting, and database access
* **Validation**: Strongly-typed model validation with server-side error feedback and honeypot anti-spam protection

### Frontend & Styling
* **Markup**: Semantic HTML5 (landmarks, native `<dialog closedby="any">`, accessible forms)
* **CSS Pipeline**: Compiled Tailwind CSS v4 (`@tailwindcss/cli` with standalone build)
* **Custom Styles**: Graphite/charcoal design tokens (`#090a0f`, `#10131a`, `#d4ff3a` lime accent, `#14b8a6` teal)
* **Typography**: Plus Jakarta Sans (body), Outfit (editorial headings), JetBrains Mono (code/numbers) via Google Fonts
* **Client Logic**: Vanilla JavaScript with zero heavy framework bloat

### Repository Structure
```
Portfolio/
├── Controllers/
│   ├── HomeController.cs        # Main page, contact submissions, terminal API, error handling
│   └── ProjectsController.cs    # Project catalogue and case-study detail routing
├── Models/
│   ├── ContactMessage.cs        # EF Core MySQL entity for contact messages
│   ├── ProjectItem.cs           # Typed project domain model
│   ├── EducationRecord.cs       # PSTU transcript record and semester breakdown
│   └── SkillModels.cs           # Categorized skills and verified coding profiles
├── ViewModels/
│   ├── HomeViewModel.cs         # Aggregate view model for the homepage
│   ├── ContactFormViewModel.cs  # Form validation model with honeypot trap
│   └── ProjectDetailViewModel.cs# Case study detail model with adjacent navigation
├── Data/
│   └── ApplicationDbContext.cs  # EF Core DbContext with MySQL table mappings and indexes
├── Migrations/
│   ├── 20261024075230_InitialCreate.cs # EF Core migration for contact_messages table
│   └── InitialCreate.sql        # Standalone SQL DDL script for manual MySQL execution
├── Services/
│   ├── IProjectService.cs       # Centralized project catalogue service
│   ├── IEducationService.cs     # Centralized academic records service
│   ├── ISkillService.cs         # Technical competencies & coding profiles service
│   ├── IRateLimitService.cs     # Thread-safe in-memory IP sliding-window rate limiter
│   └── IContactService.cs       # MySQL message persistence with safe error handling
├── Options/
│   └── PortfolioOptions.cs      # Centralized typed configuration (WhatsApp, links, domain)
├── Styles/
│   └── site.css                 # Tailwind v4 entry point with design tokens
├── Views/
│   ├── Home/
│   │   └── Index.cshtml         # Hero, About, Projects, Skills, Education, Profiles, Contact
│   ├── Projects/
│   │   ├── Index.cshtml         # Project catalogue with category filtering
│   │   └── Details.cshtml       # Comprehensive case-study view
│   └── Shared/
│       ├── _Layout.cshtml       # Master layout with navigation, terminal modal, and footer
│       ├── NotFound.cshtml      # Custom 404 page
│       └── Error.cshtml         # Safe error diagnostics page
├── wwwroot/
│   ├── css/site.min.css         # Compiled, minified Tailwind CSS
│   ├── js/site.js               # Vanilla JS navigation, validation, and terminal console
│   ├── images/
│   │   ├── profile-placeholder.svg # Monogram avatar (replace with profile.jpg)
│   │   ├── og-card.svg          # High-resolution Open Graph social preview card
│   │   └── projects/            # Technical schematic SVGs (sharesync, railway, campussync)
│   ├── robots.txt
│   └── sitemap.xml
├── Tests/
│   ├── ContactServiceTests.cs   # Persistence, rate limiting, and honeypot tests
│   ├── EducationServiceTests.cs # Verified GPA and coursework tests
│   ├── HomeControllerTests.cs   # Controller action and terminal command tests
│   ├── ProjectServiceTests.cs   # Slug lookup and neighbor navigation tests
│   └── RateLimitServiceTests.cs # Sliding window rate limit tests
├── appsettings.json             # Application settings with safe placeholders
├── appsettings.Example.json     # Configuration template
├── package.json                 # Tailwind CLI build scripts
└── Portfolio.slnx               # .NET 10 solution file
```

---

## 3. Verified Projects Catalogue

1. **ShareSync** (`/projects/sharesync`)
   * **Category**: Full-Stack Web
   * **Status**: Academic Project (In Active Development)
   * **Stack**: C#, ASP.NET Core MVC, MySQL, Entity Framework Core, Tailwind CSS, JavaScript
   * **Description**: Academic share-market investment portfolio and transaction tracking application exploring relational database schema design, position averaging calculations, and profit/loss reconciliation.
   * **Repository**: [https://github.com/MtanvirA/ShareSync](https://github.com/MtanvirA/ShareSync)

2. **Smart Railway Track Health Monitoring** (`/projects/railway-track-health-monitoring`)
   * **Category**: IoT & Systems
   * **Status**: Academic Hardware Prototype / Concept
   * **Stack**: C/C++ (ESP-IDF/Arduino), ESP32, Ultrasonic Sensors, 0.96" OLED, Buzzer Module
   * **Description**: Embedded IoT safety prototype combining transit-time speed calculation, obstacle proximity scanning, audio buzzer alerts, and automated multi-color signaling logic.
   * **Repository**: [https://github.com/MtanvirA/Smart-Railway-Track-Monitoring](https://github.com/MtanvirA/Smart-Railway-Track-Monitoring)

3. **CampusSync** (`/projects/campussync`)
   * **Category**: Academic Systems
   * **Status**: Department Prototype / In Design Phase
   * **Stack**: C#, ASP.NET Core, MySQL, Tailwind CSS, JavaScript
   * **Description**: University department schedule and lab resource coordination platform designed for the PSTU CSE department to eliminate classroom and laboratory double-booking.
   * **Repository**: [https://github.com/MtanvirA/CampusSync](https://github.com/MtanvirA/CampusSync)

---

## 4. Academic Standing (PSTU Provisional Records)

* **Degree**: B.Sc. in Engineering, Computer Science and Engineering
* **Institution**: Patuakhali Science and Technology University (PSTU)
* **Session**: 2023–2024
* **Overall Cumulative CGPA**: **3.820** through 3rd Semester

| Semester | Semester GPA | Cumulative CGPA | Academic Focus |
| :--- | :---: | :---: | :--- |
| **First Semester** | **3.870** | **3.870** | Fundamentals of computing, problem-solving, mathematics |
| **Second Semester** | **3.771** | **3.820** | Structured programming, OOP, engineering sciences |
| **Third Semester** | **3.821** | **3.820** | Data structures, discrete algorithms, software engineering |

*All academic information is centralized in `Services/EducationService.cs` so future semester results can be updated in a single place.*

---

## 5. Local Setup & Execution Guide

### Prerequisites
1. **.NET 10.0 SDK** (verify with `dotnet --version` &rarr; `10.0.x`)
2. **Node.js** (v20+ or v24+ for Tailwind CLI compilation)
3. **MySQL 8.0 Server** (running locally on `localhost:3306`)
4. **EF Core CLI Tools** (install/update via `dotnet tool update --global dotnet-ef`)

### Step 1: Clone the Repository
```powershell
git clone https://github.com/MtanvirA/Portfolio.git
cd Portfolio
```

### Step 2: Install Frontend Dependencies & Compile Tailwind CSS
```powershell
npm install
npm run build:css
```
*(To run continuous live recompilation during CSS editing, use `npm run watch:css`)*

### Step 3: Configure Local MySQL Database & Dedicated User
Log in to MySQL (via MySQL Workbench or `mysql -u root -p`) as administrator and execute the following SQL script to create the database and a dedicated application user with restricted database-scoped privileges:

```sql
-- 1. Create portfolio database with UTF8MB4 support
CREATE DATABASE IF NOT EXISTS portfolio_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

-- 2. Create a dedicated application user (replace 'YOUR_LOCAL_PASSWORD' with a strong local secret)
CREATE USER IF NOT EXISTS 'portfolio_user'@'localhost' 
    IDENTIFIED BY 'YOUR_LOCAL_PASSWORD';

-- 3. Grant database-scoped privileges strictly to portfolio_db.*
-- (SELECT, INSERT, UPDATE, DELETE for runtime; CREATE, ALTER, INDEX, DROP, REFERENCES for EF migrations)
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, REFERENCES 
    ON portfolio_db.* TO 'portfolio_user'@'localhost';

FLUSH PRIVILEGES;
```

> **Security Note**: Granting privileges strictly on `portfolio_db.*` ensures the application user cannot access other databases or administrative system tables.

### Step 4: Configure Secrets Locally (.NET User Secrets)
Store your connection string outside the repository using .NET User Secrets. This ensures passwords are never committed to version control:

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=portfolio_db;Uid=portfolio_user;Pwd=YOUR_LOCAL_PASSWORD;"
```

Secrets are securely maintained by the .NET runtime in `%APPDATA%\Microsoft\UserSecrets\9b935fff-8bc6-4755-beda-b490ff221125\secrets.json`.

*(Alternatively, in production or CI environments, set the environment variable `ConnectionStrings__DefaultConnection`)*.

### Step 5: Apply EF Core Database Migrations
Apply the existing migration to create the `contact_messages` table and migration history:

```powershell
dotnet ef database update
```

*Alternatively, execute the standalone SQL script directly:*
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u portfolio_user -p portfolio_db < Migrations/InitialCreate.sql
```

Verify that the table exists in MySQL:
```sql
USE portfolio_db;
SHOW TABLES;
DESCRIBE contact_messages;
```

### Step 6: Run the Web Application
```powershell
dotnet run --launch-profile "http"
```
Navigate to: `http://localhost:5124` (or your configured port).

---

## 6. Request Lifecycle & Testing

### ASP.NET Core Request Lifecycle Flow
When a user submits the contact form, the request flows through the following pipeline:

```
[ Browser Client ]
       │
       ▼  HTTP POST /Home/SubmitContact (Form data + Anti-Forgery Token)
[ MVC Controller (HomeController) ]
       │  1. Verifies [ValidateAntiForgeryToken] cookie & token
       │  2. Validates ModelState ([Required], [EmailAddress], length bounds)
       ▼
[ Contact Service (ContactService) ]
       │  3. Honeypot check: Rejects immediately if HoneyPotCompany is filled
       │  4. Rate limit check: Enforces max 3 submissions per 5 min per client IP
       │  5. Normalization: Lowercases email, trims text, hashes IP for privacy
       ▼
[ Entity Framework Core (ApplicationDbContext) ]
       │  6. Generates parameterized SQL INSERT query
       ▼
[ MySQL 8.0 Database (portfolio_db.contact_messages) ]
       │  7. Commits row to database table (primary persistence confirmed)
       ▼
[ Notification Service (SmtpContactNotificationService) ]
       │  8. If enabled, dispatches notification email via SMTP relay (SMTP2GO)
       │  9. Updates message entity with delivery outcome (Sent / Failed / NotConfigured)
       ▼
[ Response to Browser ]
          Returns JSON { success: true, message: "..." } for AJAX
          OR Redirects with TempData flash message for standard POST
```

### Automated & Integration Testing

#### Test Suite Distinction
1. **Unit Tests**: Test individual classes, string normalization, GPA calculations, and rate limit algorithms in isolation with zero external dependencies.
2. **In-Memory Tests (`Microsoft.EntityFrameworkCore.InMemory`)**: Test `ContactService` and `ContactNotificationTests` logic using an ephemeral in-memory database provider and mock notification services. *Note*: In-memory tests validate service logic, but do not test MySQL connection strings, user authentication, column collation, or network transport.
3. **Real MySQL Integration Verification**: Live end-to-end tests where the ASP.NET Core runtime connects over TCP port 3306 to MySQL 8.0, authenticates via `caching_sha2_password`, executes EF Core migrations, persists synthetic messages, and queries rows using SQL.

#### Running the Test Suite
```powershell
dotnet test
```

### Test Suite Summary (56 Passing Tests):
* `ForwardedHeadersTests` (4 tests): Validated trusted proxy security boundary, rejection of spoofed `X-Forwarded-For` and `X-Forwarded-Proto` from untrusted direct connections, acceptance from loopback and configured CIDR networks, and rate limiter protection against header spoofing.
* `ContactNotificationTests` (10 tests): Validated DB persistence ordering (notification not called on DB error), notification dispatched after persistence, graceful operation when provider is disabled/unconfigured, provider failure tolerance (saved message preserved, visitor still receives success), HTML encoding injection prevention, zero credential leakage in client responses, Gmail SMTP defaults, and configuration binding.
* `ContactValidationTests` (7 tests): Validated `[Required]`, `[EmailAddress]`, and string length constraints.
* `ContactServiceTests` (8 tests): Tested EF Core persistence, string normalization (lowercase emails, trimmed inputs), honeypot anti-spam trap detection, rate-limit blocking, and safe database exception handling without credential leaks.
* `RateLimitServiceTests` (5 tests): Tested sliding-window request throttling, threshold enforcement, and null IP safety.
* `HomeControllerTests` (7 tests): Tested aggregate view model assembly, AJAX JSON responses, standard Post/Redirect/Get flow, and interactive terminal commands.
* `ProjectServiceTests` (9 tests): Verified slug retrieval, case-insensitivity, category filtering, and neighbor navigation.
* `EducationServiceTests` (6 tests): Verified PSTU transcript calculations, 3.820 CGPA, and course highlights.

#### How to Submit and Verify a Real Test Message
1. Start the application:
   ```powershell
   dotnet run
   ```
2. In the browser, navigate to `#contact`, fill out the form, and click **Send Message**.
3. In MySQL Workbench or CLI, query the persisted record:
   ```sql
   USE portfolio_db;
   SELECT Id, Name, Email, Subject, Message, CreatedAtUtc, Status, NotificationStatus, ClientIpHash 
   FROM contact_messages 
   ORDER BY CreatedAtUtc DESC LIMIT 1;
   ```
4. Verify that:
   - Exactly one row exists with matching fields.
   - The email is trimmed and normalized to lowercase.
   - The status is `"New"`.
   - The notification status reflects delivery (`"Sent"`, `"NotConfigured"`, or `"Failed"`).
   - The client IP is stored as a one-way cryptographic SHA-256 hash.
5. If testing with a synthetic record, clean up after verification:
   ```sql
   DELETE FROM contact_messages WHERE Email = 'your-synthetic-email@example.com';
   ```

---

## 7. Contact Email Notifications Setup (Gmail SMTP)

The application includes an injectable email notification pipeline powered by **MailKit** and configured to use **Gmail SMTP Relay** (`smtp.gmail.com:587` with STARTTLS). When a visitor submits a contact message, the application persists the message to MySQL first and then sends a formatted notification email directly to the portfolio owner (`tanviranjum201@gmail.com`).

### Notification Configuration Parameters
* **Recipient (`OwnerEmail`)**: `tanviranjum201@gmail.com`
* **Sender (`SenderEmail`)**: `tanviranjum201@gmail.com`
* **Sender Display Name**: `Tanvir Anjum Portfolio`
* **SMTP Host**: `smtp.gmail.com`
* **SMTP Port**: `587`
* **Security Protocol**: `STARTTLS` (`UseTls: true`)
* **Authentication**: Gmail address + Google Account **App Password**

### Security & Reliability Guarantees
* **Database Primary**: The database remains the primary system of record. If database saving fails, no notification is attempted.
* **Failure Isolation**: If email delivery fails (e.g., SMTP rate limit or incorrect app password), the visitor's submission is **never discarded or lost**. The visitor still receives a success confirmation, while the entity records `NotificationStatus = "Failed"` and logs the failure internally.
* **No Plaintext Secrets**: Google App Passwords must never be committed to Git. They are managed exclusively through `.NET User Secrets` in development or environment variables in production.
* **Safe HTML Encoding**: All submitted visitor text is sanitized with `HtmlEncoder.Default.Encode` before inclusion in email HTML bodies.
* **Reply-To Safety**: Outgoing email uses `tanviranjum201@gmail.com` as the authenticated `From` address, while setting `Reply-To` to the visitor's validated email address. This allows one-click owner response while preventing SPF/DKIM spoofing rejections.
* **No Visitor Auto-Replies**: Notifications are delivered exclusively to the configured portfolio owner.

---

### Google Account App Password Setup Process

Standard Google account passwords cannot be used with third-party SMTP clients. You must generate a dedicated **16-character App Password**:

1. **Enable 2-Step Verification**:
   * Open your Google Account security dashboard: [https://myaccount.google.com/security](https://myaccount.google.com/security).
   * Under **How you sign in to Google**, ensure **2-Step Verification** is turned **ON**.
2. **Generate an App Password**:
   * Visit the App Passwords page directly: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)  
     *(Official Google guide: [https://support.google.com/accounts/answer/185833](https://support.google.com/accounts/answer/185833))*.
   * Under **App name**, enter a descriptive label, for example: `Portfolio Contact`.
   * Click **Create**.
   * Google displays a 16-character code (e.g. `xxxx xxxx xxxx xxxx`). Copy this code without spaces.
3. **Store in .NET User Secrets**:
   * Configure the secret locally using the CLI commands detailed below.
   * **Security Rule**: Never share, commit, or print this app password.

> **Blocker Note**: If the **App Passwords** page displays a message stating that the setting is unavailable for your account, check whether 2-Step Verification is enabled. If you are using an institutional Google Workspace account where the administrator has disabled 2-Step Verification or App Passwords, use a personal standard `@gmail.com` account or request policy adjustment from your administrator.

---

### Local Development Configuration (.NET User Secrets)

By default, email notifications are **disabled** (`"Enabled": false`), allowing local development and testing to run cleanly without external dependencies.

To enable live email notifications on your local machine, execute the following commands in PowerShell from the project root (`E:\Projects\Portfolio`):

```powershell
# Navigate to the project root
cd E:\Projects\Portfolio

# Set Gmail SMTP configuration in .NET User Secrets
dotnet user-secrets set "ContactNotification:Enabled" "true"
dotnet user-secrets set "ContactNotification:SmtpHost" "smtp.gmail.com"
dotnet user-secrets set "ContactNotification:SmtpPort" "587"
dotnet user-secrets set "ContactNotification:UseTls" "true"

dotnet user-secrets set "ContactNotification:Username" "tanviranjum201@gmail.com"
dotnet user-secrets set "ContactNotification:Password" "<YOUR_GOOGLE_APP_PASSWORD>"

dotnet user-secrets set "ContactNotification:SenderEmail" "tanviranjum201@gmail.com"
dotnet user-secrets set "ContactNotification:SenderName" "Tanvir Anjum Portfolio"
dotnet user-secrets set "ContactNotification:OwnerEmail" "tanviranjum201@gmail.com"
```

> **Security Warning**: Replace `<YOUR_GOOGLE_APP_PASSWORD>` with your 16-character generated app password. Do not print your secrets using `dotnet user-secrets list` in public terminals or logs.

---

### Production Environment Variables

On your production hosting server (e.g., MonsterASP.NET, Linux container, or cloud host), set the following environment variables:

```bash
ContactNotification__Enabled=true
ContactNotification__SmtpHost=smtp.gmail.com
ContactNotification__SmtpPort=587
ContactNotification__UseTls=true
ContactNotification__Username=tanviranjum201@gmail.com
ContactNotification__Password=<YOUR_GOOGLE_APP_PASSWORD>
ContactNotification__SenderEmail=tanviranjum201@gmail.com
ContactNotification__SenderName=Tanvir Anjum Portfolio
ContactNotification__OwnerEmail=tanviranjum201@gmail.com
```

---

### Manual Test & Verification Procedure

After setting your Google App Password in User Secrets:

1. **Launch the Application**:
   ```powershell
   dotnet run
   ```
2. **Submit a Synthetic Message**:
   * Open `http://localhost:5124#contact` in your browser.
   * Enter a test submission:
     * **Name**: `Test Visitor`
     * **Email**: `synthetic-test@example.com`
     * **Subject**: `Testing Gmail SMTP Notification`
     * **Message**: `Verifying real-time email dispatch to portfolio owner via Gmail SMTP.`
   * Click **Send Message**.
3. **Verify Database Persistence**:
   * Inspect the `contact_messages` table in MySQL (`portfolio_db`):
     ```sql
     USE portfolio_db;
     SELECT Id, Name, Email, Subject, NotificationStatus, NotificationSentAtUtc, NotificationError 
     FROM contact_messages 
     ORDER BY CreatedAtUtc DESC LIMIT 1;
     ```
   * Confirm that:
     * `NotificationStatus` is `'Sent'`.
     * `NotificationSentAtUtc` contains the current UTC timestamp.
     * `NotificationError` is `NULL`.
4. **Confirm Inbox Delivery**:
   * Open the inbox for `tanviranjum201@gmail.com`.
   * Confirm receipt of the email with subject `[Portfolio Contact] Testing Gmail SMTP Notification (from Test Visitor)`.
   * Verify that replying to the message addresses `synthetic-test@example.com` (via `Reply-To`).
5. **Clean Up Synthetic Record**:
   ```sql
   DELETE FROM contact_messages WHERE Email = 'synthetic-test@example.com';
   ```

---

## 8. Replacing the Profile Placeholder

A predictable placeholder location is configured:
* Placeholder image: `wwwroot/images/profile-placeholder.svg` (editorial monogram visual)
* Real photograph location: `wwwroot/images/profile.jpg`

To use your real photograph:
1. Place your photograph at `wwwroot/images/profile.jpg`.
2. Update the `src` attribute of the profile image in `Views/Home/Index.cshtml` to `~/images/profile.jpg`.

---

## 9. Deployment & Free-First Hosting Guide

### Hosting Options Analysis (ASP.NET Core + MySQL)

| Platform | Tier / Pricing | Sleep / Spin-Down Behavior | MySQL Strategy | Custom Domain & Trade-offs | Assessment for Portfolio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MonsterASP.NET Free** | Free ($0/mo, no CC) | **Always-On** (No spin-down sleep) | Built-in MySQL (1GB storage included) | **Subdomain only** (`*.monsterasp.net`). Does **not** support custom domains (`mtanviranjum.tech`) on free tier. | Excellent for free staging and testing. For custom domain on `mtanviranjum.tech`, upgrade to **MonsterASP.NET Premium** (~$3–$5/mo). |
| **MonsterASP.NET Premium** | Paid (~$3–$5/mo) | Always-On | Built-in MySQL | Full custom domain + Let's Encrypt SSL included. | **Recommended for Production**: Native ASP.NET Core on Windows/IIS, automated SSL, single-dashboard MySQL, zero cold starts. |
| **Render.com Free Web Service** | Free ($0/mo) | **Spins down after 15m** idle (50–60s cold start) | External free MySQL required (Aiven / TiDB) | Full custom domain (`mtanviranjum.tech`) + free TLS. | Viable via container [Dockerfile](file:///e:/Projects/Portfolio/Dockerfile). **Trade-offs**: 50s cold-start delays degrade recruiter experience; container disk is ephemeral so an external managed MySQL database is mandatory. |
| **Fly.io** | Pay-as-you-go / Free allowances | Scalable to 0 or always-on | External free MySQL (Aiven / TiDB) | Full custom domain + Anycast edge TLS. Requires credit card registration. | Fast edge container hosting. Requires external managed database. |
| **Azure for Students** | Free $100 credit (PSTU email) | Always-On (B1 Linux App Service) | Azure Database for MySQL Flexible Server | Full custom domain + managed TLS. Valid for 12 months with university email. | Enterprise-grade cloud architecture; free during student eligibility. |

> **Production Hosting Principle**: Avoid assuming any hosting service is "permanently free without limitations." Free plans always enforce explicit trade-offs: either inactivity spin-down (cold starts), subdomain restrictions, ephemeral storage, or trial credit expirations.

### Health Check Endpoint
The application exposes a lightweight health check endpoint at:
```http
GET /health
```
Returns `200 OK` (`Healthy`). Designed for cloud orchestrators (Docker, Kubernetes, Render, AWS ECS, Azure) to verify liveness without triggering database queries or rendering MVC views.

### Trusted Reverse Proxy & Header Forwarding Security
The application is configured with `ForwardedHeadersOptions` adhering to a strict **least-privilege trust model**:
* **Enabled Headers**: Only `ForwardedHeaders.XForwardedFor` and `ForwardedHeaders.XForwardedProto`.
* **ForwardLimit**: Defaults to `1` (single reverse proxy hop).
* **Safe Default Trust**: ASP.NET Core by default trusts only loopback proxies (`127.0.0.1` and `::1`).
* **Anti-Spoofing Protection**: `KnownProxies` and `KnownIPNetworks` are **never cleared globally**. Direct connections from untrusted client IPs with spoofed `X-Forwarded-For` or `X-Forwarded-Proto` headers are strictly rejected by the middleware, ensuring `RemoteIpAddress` reflects the real client IP and protects `MemoryRateLimitService` against throttling bypass attacks.
* **Environment-Specific Trusted Proxy Binding**: When deployed behind a specific cloud load balancer or container network, operators declare the trusted proxy IP or CIDR network via configuration or environment variables without code modifications:
  * `ForwardedHeaders__KnownNetworks__0="172.17.0.0/16"` (e.g., Docker bridge network)
  * `ForwardedHeaders__KnownProxies__0="10.0.0.1"` (e.g., dedicated reverse proxy)
* **IIS Integration**: When hosted on IIS (e.g., MonsterASP.NET), the ASP.NET Core Module handles proxy routing internally on loopback or in-process, requiring no custom network CIDR configuration.

### Required Environment Variables on Production Host
Set the following environment variables in your hosting provider's dashboard or container environment:

```bash
# ASP.NET Core Runtime
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_HTTP_PORTS=8080

# Relational Database Connection (scoped portfolio_user account)
ConnectionStrings__DefaultConnection="Server=YOUR_PROD_HOST;Port=3306;Database=portfolio_db;Uid=portfolio_user;Pwd=YOUR_PROD_PASSWORD;CharSet=utf8mb4;"

# Gmail SMTP Email Notifications
ContactNotification__Enabled=true
ContactNotification__SmtpHost=smtp.gmail.com
ContactNotification__SmtpPort=587
ContactNotification__UseTls=true
ContactNotification__Username=tanviranjum201@gmail.com
ContactNotification__Password=<YOUR_16_CHAR_GOOGLE_APP_PASSWORD>
ContactNotification__SenderEmail=tanviranjum201@gmail.com
ContactNotification__SenderName="Tanvir Anjum Portfolio"
ContactNotification__OwnerEmail=tanviranjum201@gmail.com

# Portfolio Configuration
Portfolio__CanonicalDomain=https://mtanviranjum.tech
Portfolio__WhatsAppNumber=+8801718659824
```

### Production Database Migration Strategy
When deploying to a fresh production MySQL instance:
1. **Option A (EF Core CLI)**:
   ```powershell
   dotnet ef database update --connection "Server=YOUR_HOST;Port=3306;Database=portfolio_db;Uid=portfolio_user;Pwd=...;"
   ```
2. **Option B (Idempotent SQL Script)**:
   Generate and execute the complete idempotent migration script:
   ```powershell
   dotnet ef migrations script --idempotent --configuration Release -o Migrations/ProductionMigration.sql
   ```
   Apply `Migrations/ProductionMigration.sql` using MySQL Workbench or CLI against `portfolio_db`.

### Pre-Deployment Checklist
- [ ] Production MySQL database created with `utf8mb4` character set.
- [ ] Dedicated `portfolio_user` account created with privileges granted strictly on `portfolio_db.*`.
- [ ] Database migrations applied (`contact_messages` table with notification columns).
- [ ] Google Account 2-Step Verification enabled and 16-character App Password generated.
- [ ] Environment variables configured in hosting provider dashboard.
- [ ] Domain DNS records (`A` / `CNAME` for `mtanviranjum.tech`) pointed to production host IP/CNAME.
- [ ] Verified `/health` endpoint returns `200 OK`.
- [ ] Verified SSL/TLS certificate is active on `https://mtanviranjum.tech`.
- [ ] Executed synthetic contact submission test and confirmed email receipt in Gmail.

---

## 10. Security & Secret Hygiene Architecture

* **Least-Privilege Database Access**: The web application never connects as MySQL `root`. It runs under a dedicated `portfolio_user` account with permissions strictly scoped to `portfolio_db.*` (`SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, REFERENCES, INDEX, ALTER`), preventing access to system catalogs or sibling project databases.
* **Secret Hygiene & Isolation**:
  * **Local Development**: Connection strings and SMTP passwords are managed exclusively via `.NET User Secrets` (`dotnet user-secrets`), stored outside the repository tree in `%APPDATA%\Microsoft\UserSecrets\`.
  * **Production / CI**: Credentials are provided via environment variables (`ConnectionStrings__DefaultConnection`, `ContactNotification__Password`).
  * **Zero Committed Secrets**: Tracked settings files (`appsettings.json`, `appsettings.Example.json`) contain only non-sensitive placeholder templates.
* **Credential Rotation Protocol**: If local development credentials are ever exposed, passwords can be rotated immediately in MySQL via `ALTER USER 'portfolio_user'@'localhost' IDENTIFIED BY '...'` and re-set locally in `.NET User Secrets` without altering project source code.
* **Honeypot Trap**: Forms include a hidden `HoneyPotCompany` field that trips automated bots while remaining invisible to humans.
* **Rate Limiting**: In-memory sliding-window limiter restricts submissions to 3 attempts per 5 minutes per IP address.
* **Antiforgery Protection**: Server verifies ASP.NET Core antiforgery tokens on all POST requests (`[ValidateAntiForgeryToken]`) with `SameSite=Strict`, `HttpOnly`, and `SecurePolicy=SameAsRequest`.
* **Security Headers**: Middleware enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
* **Zero Public Data Leakage**: No public API endpoint exists to read or list saved contact messages. Database exceptions are caught and sanitized to prevent stack trace or credential leaks.

---

## 11. License

This project is licensed under the [MIT License](LICENSE).
