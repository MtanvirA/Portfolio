/**
 * Tanvir Anjum Portfolio - Offline Client-Side Terminal
 * Standalone, zero-dependency interactive command palette.
 * Complies with modern-web-guidance for accessible native dialogs and light dismiss.
 */

(function () {
    'use strict';

    const COMMANDS = {
        help: {
            type: 'help',
            text: `Available commands:
  about      - Display overview & professional background
  projects   - List verified featured engineering projects
  skills     - View categorized technical competencies
  education  - Show Patuakhali Science and Technology University records
  links      - Access GitHub, Codeforces, LeetCode, and LinkedIn
  contact    - Display direct contact channels
  clear      - Clear the terminal screen
  exit       - Close this terminal modal`
        },
        about: {
            type: 'info',
            text: `Md. Tanvir Anjum
Undergraduate Computer Science & Engineering student at PSTU.
Aspiring full-stack developer with a passion for algorithms, competitive programming, and building pragmatic web applications.`
        },
        projects: {
            type: 'list',
            text: `Featured Engineering Projects (5):
1. ShareSync                  - Full-stack portfolio & stock tracking web app (ASP.NET Core + MySQL)
2. Railway Track Monitoring   - ESP32 IoT track obstacle & velocity safety prototype
3. CampusSync                 - PSTU CSE department scheduling & coordination portal prototype
4. NAS Sync Mini Server       - ESP32 mini network storage, browser media streaming & DHT11 host
5. Student Enrollment System  - Object-oriented academic fee & enrollment manager (Java 17+)
Type 'project <name>' (e.g. 'project sharesync', 'project railway', 'project campussync', 'project nassync', 'project enrollment') or visit /projects/ for full case studies.`
        },
        'project sharesync': {
            type: 'info',
            text: `Project: ShareSync (Full-Stack Web)
Stack:   C#, ASP.NET Core MVC, MySQL, EF Core, Tailwind CSS
Details: Academic share-market investment portfolio and transaction ledger. Implements weighted-average cost basis accounting and realized/unrealized P&L reconciliation.
Repo:    https://github.com/MtanvirA/ShareSync
Route:   /projects/sharesync/`
        },
        'project railway': {
            type: 'info',
            text: `Project: Smart Railway Track Health Monitoring (IoT & Systems)
Stack:   C/C++ (ESP-IDF/Arduino), ESP32, Ultrasonic Sensors, OLED, Buzzer
Details: Real-time obstacle telemetry, transit-time velocity estimation, audio warning buzzer, and automated track signaling logic.
Repo:    https://github.com/MtanvirA/Smart-Railway-Track-Monitoring
Route:   /projects/railway-track-health-monitoring/`
        },
        'project campussync': {
            type: 'info',
            text: `Project: CampusSync (Academic Systems)
Stack:   C#, ASP.NET Core, MySQL, Tailwind CSS, JavaScript
Details: Department routine and shared computer laboratory resource coordination platform for PSTU CSE to eliminate scheduling collisions.
Repo:    https://github.com/MtanvirA/CampusSync
Route:   /projects/campussync/`
        },
        'project nassync': {
            type: 'info',
            text: `Project: NAS Sync Mini Server (IoT / Embedded Systems)
Stack:   C/C++ (Arduino/ESP-IDF), ESP32, microSD (SPI), SSD1306 OLED, DHT11 Sensor, ESPAsyncWebServer
Details: Low-power ESP32 web file host and media server. Supports browser-based file management, media streaming, OLED status, and ambient temperature/humidity logging.
Notice:  Educational/LAN prototype intended for trusted local networks.
Repo:    https://github.com/MtanvirA/NAS_Sync-Mini-Server
Route:   /projects/nas-sync-mini-server/`
        },
        'project nas-sync': {
            type: 'info',
            text: `Project: NAS Sync Mini Server (IoT / Embedded Systems)
Stack:   C/C++ (Arduino/ESP-IDF), ESP32, microSD (SPI), SSD1306 OLED, DHT11 Sensor, ESPAsyncWebServer
Details: Low-power ESP32 web file host and media server. Supports browser-based file management, media streaming, OLED status, and ambient temperature/humidity logging.
Notice:  Educational/LAN prototype intended for trusted local networks.
Repo:    https://github.com/MtanvirA/NAS_Sync-Mini-Server
Route:   /projects/nas-sync-mini-server/`
        },
        'project enrollment': {
            type: 'info',
            text: `Project: Student Enrollment System Using Java (Java / OOP)
Stack:   Java (JDK 17+), OOP Architecture, Collections, File I/O, Custom Exceptions
Details: Console-based academic registration and fee management application with role-based workflows (Student, Cashier, Admin), CGPA fee reductions, clearance queues, and CSV reports.
Notice:  Academic console prototype using in-memory data structures and CSV exports.
Repo:    https://github.com/MtanvirA/Student-Enrollment-System-Using-Java
Route:   /projects/student-enrollment-system/`
        },
        'project student-enrollment': {
            type: 'info',
            text: `Project: Student Enrollment System Using Java (Java / OOP)
Stack:   Java (JDK 17+), OOP Architecture, Collections, File I/O, Custom Exceptions
Details: Console-based academic registration and fee management application with role-based workflows (Student, Cashier, Admin), CGPA fee reductions, clearance queues, and CSV reports.
Notice:  Academic console prototype using in-memory data structures and CSV exports.
Repo:    https://github.com/MtanvirA/Student-Enrollment-System-Using-Java
Route:   /projects/student-enrollment-system/`
        },
        skills: {
            type: 'list',
            text: `Technical Competencies:
- Programming Languages: C, C++, Java, Python, C#, JavaScript
- Web Development:       HTML5, CSS, Tailwind CSS, Bootstrap, ASP.NET Core MVC
- Databases & Tooling:   MySQL, Git, GitHub, VS Code
- AI-Assisted Dev:       Prompt engineering, task decomposition, AI-assisted coding & debugging, refactoring, technical documentation (Copilot, Antigravity, ChatGPT)`
        },
        education: {
            type: 'info',
            text: `Patuakhali Science and Technology University (PSTU)
Degree: B.Sc. in Engineering, Computer Science and Engineering (Session: 2023–2024)
Provisional Academic Standing:
- 1st Semester: 3.870
- 2nd Semester: 3.771
- 3rd Semester: 3.821
Overall Cumulative CGPA: 3.820 (Through 3rd Semester)
Merit Standing: 1st position among students shown in published 3rd-semester result sheet.
Selected 2nd-Semester Grades (9 Courses):
- Physics-II: A+ | Physics-II Sessional: A+
- Mathematics-II: A+ | Discrete Mathematics: A+
- Communicative English: A-
- Electronic Device and Circuits: A | EDC Sessional: A+
- Object Oriented Programming: B | OOP Sessional: A+`
        },
        links: {
            type: 'links',
            text: `Verified Profiles:
- GitHub:     https://github.com/MtanvirA
- Codeforces: https://codeforces.com/profile/MtanvirA
- LeetCode:   https://leetcode.com/u/MtanvirA/
- LinkedIn:   https://www.linkedin.com/in/md-tanvir-anjum-3642371aa/
- Facebook:   https://www.facebook.com/mtanvira.uo/`
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
            line.className = `whitespace-pre-wrap leading-relaxed py-1 font-mono-code text-xs md:text-sm ${classNames || ''}`;
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

                // Echo command
                appendLine(`tanvir@pstu:~$ ${escapeHtml(raw)}`, 'text-lime-300 font-bold');

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
                    const colorCls = match.type === 'error' ? 'text-rose-400' : 'text-slate-300';
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
