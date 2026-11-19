/**
 * Tanvir Anjum Portfolio - Offline Client-Side Terminal
 * Standalone, zero-dependency interactive command palette.
 * Complies with modern-web-guidance for accessible native dialogs and light dismiss.
 * Editorial Monochrome + Crimson Red Theme.
 */

(function () {
    'use strict';

    const COMMANDS = {
        help: {
            type: 'help',
            text: `Available commands:
  about      - Display overview & professional background
  projects   - List verified featured engineering projects
  research   - View academic research interests & exploration areas
  skills     - View categorized technical competencies from CV
  education  - Show Patuakhali Science and Technology University records
  cv         - Show Curriculum Vitae download link
  links      - Access GitHub, Codeforces, LeetCode, and LinkedIn
  contact    - Display direct contact channels
  clear      - Clear the terminal screen
  exit       - Close this terminal modal`
        },
        about: {
            type: 'info',
            text: `Md. Tanvir Anjum
Undergraduate Computer Science & Engineering student at Patuakhali Science and Technology University (PSTU).
Session: 2023–2024 | Cumulative CGPA: 3.820/4.000 (Through 3rd Semester)
Recipient of the Dean's Merit Award (Level 1) and 1st merit position on the published 3rd semester result sheet.
Crafting full-stack web applications with ASP.NET Core & C#, competitive programming in C++, and exploring intelligent embedded systems.`
        },
        research: {
            type: 'list',
            text: `Research Interests & Exploration Areas:
1. Machine Learning            - Statistical learning theory, regularized loss minimization & classification
2. Deep Learning               - Neural representations, backpropagation & convolutional architectures
3. Artificial Intelligence     - Heuristic search, constraint satisfaction & autonomous planning
4. Robotics                    - Kinematics, feedback control loops & actuator coordination
5. Intelligent Embedded Systems - Edge intelligence, low-power telemetry & sensor fusion on ESP32`
        },
        cv: {
            type: 'info',
            text: `Curriculum Vitae:
Download the verified official CV directly at: /assets/documents/Tanvir-Anjum-CV.pdf`
        },
        projects: {
            type: 'list',
            text: `Featured Engineering Projects (5):
1. ShareSync                  - Full-stack DSE portfolio & stock analytics platform (ASP.NET Core + MySQL 8)
2. Railway Track Monitoring   - ESP32 IoT track obstacle & velocity safety prototype
3. CampusSync                 - PSTU CSE department routine & lab coordination portal prototype
4. NAS Sync Mini Server       - ESP32 mini network storage, browser media streaming & DHT11 host
5. Student Enrollment System  - Object-oriented academic fee & enrollment manager (Java 17+)
Type 'project <name>' (e.g. 'project sharesync', 'project railway', 'project campussync', 'project nassync', 'project enrollment') or visit /projects/ for full case studies.`
        },
        'project sharesync': {
            type: 'info',
            text: `Project: ShareSync (Full-Stack Web)
Stack:   C#, ASP.NET Core MVC, MySQL 8, EF Core, Bootstrap 5, Chart.js
Details: Dhaka Stock Exchange (DSE) portfolio tracker and stock analytics platform. Implements Clean Architecture, buy/sell transaction logging, custom watchlists, dividend tracking, and portfolio valuation reports with CAGR, annualized volatility, and maximum drawdown metrics.
Repo:    https://github.com/MtanvirA/ShareSync
Route:   /projects/sharesync/`
        },
        'project railway': {
            type: 'info',
            text: `Project: Smart Railway Track Health Monitoring (IoT & Systems)
Stack:   C++ (ESP-IDF/Arduino), ESP32, Ultrasonic Sensors, Vibration Sensors, GSM/GPS
Details: Autonomous safety prototype combining ultrasonic obstacle detection and vibration monitoring on railway lines. Delivers real-time GPS coordinates via GSM alert pipelines when track anomalies occur.
Repo:    https://github.com/MtanvirA/Smart-Railway-Track-Monitoring
Route:   /projects/railway-track-health-monitoring/`
        },
        'project campussync': {
            type: 'info',
            text: `Project: CampusSync (Academic Systems)
Stack:   C#, ASP.NET Core, MySQL, Tailwind CSS, JavaScript
Details: PSTU CSE department routine and lab coordination portal prototype. Resolves multi-department scheduling conflicts, handles role-based teacher and student access, and prevents overlapping lab reservations.
Repo:    https://github.com/MtanvirA/CampusSync
Route:   /projects/campussync/`
        },
        'project nassync': {
            type: 'info',
            text: `Project: NAS Sync Mini Server (IoT / Embedded Systems)
Stack:   C++ (Arduino/ESP-IDF), ESP32/ESP8266, microSD (SPI), SSD1306 OLED, DHT11 Sensor
Details: Lightweight local network storage mini-server running on ESP8266/ESP32 hardware. Delivers browser-based media streaming, SD card file system navigation, and live DHT11 environmental metrics on an I2C OLED display.
Repo:    https://github.com/MtanvirA/NAS_Sync-Mini-Server
Route:   /projects/nas-sync-mini-server/`
        },
        'project nas-sync': {
            type: 'info',
            text: `Project: NAS Sync Mini Server (IoT / Embedded Systems)
Stack:   C++ (Arduino/ESP-IDF), ESP32/ESP8266, microSD (SPI), SSD1306 OLED, DHT11 Sensor
Details: Lightweight local network storage mini-server running on ESP8266/ESP32 hardware. Delivers browser-based media streaming, SD card file system navigation, and live DHT11 environmental metrics on an I2C OLED display.
Repo:    https://github.com/MtanvirA/NAS_Sync-Mini-Server
Route:   /projects/nas-sync-mini-server/`
        },
        'project enrollment': {
            type: 'info',
            text: `Project: Student Enrollment System Using Java (Java / OOP)
Stack:   Java (JDK 17+), OOP Architecture, Inheritance, Polymorphism, File I/O
Details: Pure Java 17+ desktop enrollment and fee management system. Implements strict OOP principles including encapsulation, inheritance hierarchies, polymorphic fee calculation, and robust file I/O persistence.
Repo:    https://github.com/MtanvirA/Student-Enrollment-System-Using-Java
Route:   /projects/student-enrollment-system/`
        },
        'project student-enrollment': {
            type: 'info',
            text: `Project: Student Enrollment System Using Java (Java / OOP)
Stack:   Java (JDK 17+), OOP Architecture, Inheritance, Polymorphism, File I/O
Details: Pure Java 17+ desktop enrollment and fee management system. Implements strict OOP principles including encapsulation, inheritance hierarchies, polymorphic fee calculation, and robust file I/O persistence.
Repo:    https://github.com/MtanvirA/Student-Enrollment-System-Using-Java
Route:   /projects/student-enrollment-system/`
        },
        skills: {
            type: 'list',
            text: `Technical Competencies (Verified from CV):
- Programming Languages: C, C++, Java, C#, Python, JavaScript, SQL
- Frameworks & Web:      ASP.NET Core MVC, Entity Framework Core, HTML5, CSS3, Bootstrap 5, Tailwind CSS, Chart.js
- Databases & Storage:   MySQL 8, Oracle Database, Relational Modeling, ACID
- Embedded & Tooling:    ESP32, ESP8266, PlatformIO, Arduino IDE, Git, GitHub, VS Code, Visual Studio
- CS Foundations:        Data Structures & Algorithms, Object-Oriented Programming, Database Systems, Competitive Programming`
        },
        education: {
            type: 'info',
            text: `Patuakhali Science and Technology University (PSTU)
Faculty of Computer Science and Engineering
Degree: B.Sc. in Computer Science and Engineering (Session: 2023–2024)
Academic Honors & Standing:
- Cumulative CGPA: 3.820 / 4.000 (Through 3rd Semester)
- Honors: Dean's Merit Award (Level 1)
- Merit Standing: 1st position among students shown in published 3rd-semester result sheet.
Progression:
- 1st Semester: 3.870
- 2nd Semester: 3.771
- 3rd Semester: 3.821
Selected 2nd-Semester Coursework (All 9 Verified Entries):
- Physics-II: Grade A+ (4.00) | Physics-II Sessional: Grade A+ (4.00)
- Mathematics-II: Grade A+ (4.00) | Discrete Mathematics: Grade A+ (4.00)
- Communicative English: Grade A- (3.50)
- Electronic Device and Circuits: Grade A (3.75) | EDC Sessional: Grade A+ (4.00)
- Object Oriented Programming: Grade B (3.00) | OOP Sessional: Grade A+ (4.00)`
        },
        links: {
            type: 'links',
            text: `Verified Profiles:
- GitHub:     https://github.com/MtanvirA
- Codeforces: https://codeforces.com/profile/MtanvirA
- LeetCode:   https://leetcode.com/u/MtanvirA/
- LinkedIn:   https://www.linkedin.com/in/md-tanvir-anjum-3642371aa/`
        },
        contact: {
            type: 'info',
            text: `Get in touch:
- Email:    tanviranjum201@gmail.com
- Domain:   https://mtanviranjum.tech
- WhatsApp: Direct connect available in the Contact section on the website`
        },
        whoami: {
            type: 'info',
            text: 'guest@mtanviranjum.tech (visitor session: authorized)'
        },
        date: {
            type: 'info',
            text: () => new Date().toUTCString()
        }
    };

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function initTerminal() {
        const dialog = document.getElementById('terminalDialog') || document.getElementById('terminalModal');
        const openBtns = document.querySelectorAll('.open-terminal-btn');
        const closeBtn = document.getElementById('closeTerminalBtn');
        const terminalInput = document.getElementById('terminalInput');
        const terminalOutput = document.getElementById('terminalOutput');

        if (!dialog) return;

        const openModal = () => {
            if (typeof dialog.showModal === 'function') {
                dialog.showModal();
                terminalInput?.focus();
            }
        };

        openBtns.forEach(btn => btn.addEventListener('click', openModal));

        // Keyboard toggle: Ctrl+K or Cmd+K
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (dialog.open) {
                    dialog.close();
                } else {
                    openModal();
                }
            }
        });

        closeBtn?.addEventListener('click', () => dialog.close());

        // Light-dismiss fallback per modern-web-guidance
        if (!('closedBy' in HTMLDialogElement.prototype)) {
            dialog.addEventListener('click', (event) => {
                if (event.target !== dialog) return;
                const rect = dialog.getBoundingClientRect();
                const isInside = (
                    rect.top <= event.clientY &&
                    event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX &&
                    event.clientX <= rect.left + rect.width
                );
                if (!isInside) dialog.close();
            });
        }

        const appendLine = (content, classNames) => {
            if (!terminalOutput) return;
            const line = document.createElement('div');
            line.className = `whitespace-pre-wrap leading-relaxed py-1 font-mono text-xs md:text-sm ${classNames || ''}`;
            line.innerHTML = content;
            terminalOutput.appendChild(line);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        };

        const commandHistory = [];
        let historyIdx = -1;

        terminalInput?.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                if (commandHistory.length && historyIdx < commandHistory.length - 1) {
                    historyIdx++;
                    terminalInput.value = commandHistory[commandHistory.length - 1 - historyIdx];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIdx > 0) {
                    historyIdx--;
                    terminalInput.value = commandHistory[commandHistory.length - 1 - historyIdx];
                } else if (historyIdx === 0) {
                    historyIdx = -1;
                    terminalInput.value = '';
                }
                e.preventDefault();
            } else if (e.key === 'Enter') {
                const raw = terminalInput.value.trim();
                if (!raw) return;

                commandHistory.push(raw);
                historyIdx = -1;
                terminalInput.value = '';

                // Echo command in crimson accent
                appendLine(`tanvir@pstu:~$ ${escapeHtml(raw)}`, 'text-[#E3343F] font-bold');

                const normalized = raw.toLowerCase();

                if (normalized === 'clear') {
                    if (terminalOutput) terminalOutput.innerHTML = '';
                    return;
                }

                if (normalized === 'exit') {
                    dialog.close();
                    return;
                }

                // Check command map
                let match = COMMANDS[normalized];
                if (!match) {
                    // Check aliases
                    if (normalized === 'cls') {
                        if (terminalOutput) terminalOutput.innerHTML = '';
                        return;
                    }
                    if (normalized === 'quit') {
                        dialog.close();
                        return;
                    }
                    if (normalized === 'project' || normalized === 'case studies') {
                        match = COMMANDS.projects;
                    }
                    if (normalized === 'sharesync') match = COMMANDS['project sharesync'];
                    if (normalized === 'railway') match = COMMANDS['project railway'];
                    if (normalized === 'campussync') match = COMMANDS['project campussync'];
                    if (normalized === 'nas' || normalized === 'nassync') match = COMMANDS['project nassync'];
                    if (normalized === 'enrollment' || normalized === 'java') match = COMMANDS['project enrollment'];
                }

                if (match) {
                    const text = typeof match.text === 'function' ? match.text() : match.text;
                    const colorCls = match.type === 'error' ? 'text-rose-400' : 'text-[#F5F5F2]';
                    appendLine(escapeHtml(text), colorCls);
                } else {
                    appendLine(`Command not recognized: '${escapeHtml(raw)}'. Type 'help' for a list of available commands.`, 'text-rose-400');
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTerminal);
    } else {
        initTerminal();
    }
})();