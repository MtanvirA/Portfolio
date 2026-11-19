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
Computer Science and Engineering undergraduate at Patuakhali Science and Technology University (PSTU).
Current Status: 4th-semester undergraduate | Session: 2023–2024
Cumulative CGPA: 3.820 / 4.000 through the 3rd semester.
Honors: Dean's Merit Award (Level 1); 1st merit position in the 3rd semester (First among the students shown in the published third-semester result sheet).
Crafting full-stack web applications with ASP.NET Core & C#, competitive programming in C++, and exploring intelligent embedded systems.`
        },
        research: {
            type: 'list',
            text: `Research Interests & Learning Directions:
1. Machine Learning            - Research interest in statistical foundations and predictive modeling
2. Deep Learning               - Learning direction in neural network representations and architectures
3. Artificial Intelligence     - Research interest in algorithmic problem solving and intelligent systems
4. Robotics                    - Learning direction in autonomous systems and physical computing
5. Intelligent Embedded Systems - Research interest in microcontroller-driven edge devices (ESP32) and sensors`
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
2. Smart Railway Monitoring   - ESP32 IoT railway safety prototype with speed & obstacle monitoring
3. CampusSync                 - PSTU CSE department routine & coordination prototype (HTML, CSS, JS, SQL)
4. NAS Sync Mini Server       - ESP32 mini network storage, browser media streaming & DHT11 host
5. Student Enrollment System  - Console-based academic fee & enrollment manager (Java, OOP)
Type 'project <name>' (e.g. 'project sharesync', 'project railway', 'project campussync', 'project nassync', 'project enrollment') or visit /projects/ for full case studies.`
        },
        'project sharesync': {
            type: 'info',
            text: `Project: ShareSync (Full-Stack Web)
Stack:   ASP.NET Core (C#), Entity Framework Core, MySQL 8, JavaScript, Bootstrap 5, Chart.js
Details: Dhaka Stock Exchange (DSE) portfolio tracker and stock analytics platform. Implements Clean Architecture, holdings management, buy/sell transactions, watchlists, dividend tracking, and investment reports with CAGR, annualized volatility, and maximum drawdown metrics across 400+ DSE companies.
Repo:    https://github.com/MtanvirA/ShareSync
Route:   /projects/sharesync/`
        },
        'project railway': {
            type: 'info',
            text: `Project: Smart Railway Track Health Monitoring (IoT Prototype)
Stack:   ESP32, Sensors, OLED, Buzzer, Embedded Systems
Details: Academic IoT railway-safety prototype combining train-speed monitoring, ultrasonic obstacle detection, automatic signaling relays, live OLED telemetry status, and audio buzzer alerts.
Repo:    https://github.com/MtanvirA/Smart-Railway-Track-Monitoring
Route:   /projects/railway-track-health-monitoring/`
        },
        'project campussync': {
            type: 'info',
            text: `Project: CampusSync (Academic Systems Prototype)
Stack:   HTML, CSS, JavaScript, SQL
Details: Academic scheduling and coordination platform prototype for PSTU CSE. Features class confirmations, available timeslot verification, schedule-conflict checks, and an interactive demonstration driven by structured mock data.
Repo:    https://github.com/MtanvirA/CampusSync
Route:   /projects/campussync/`
        },
        'project nassync': {
            type: 'info',
            text: `Project: NAS Sync Mini Server (IoT / Embedded Systems)
Stack:   C++, ESP32, microSD, OLED, DHT11, PlatformIO
Details: ESP32-based network storage and media server designed for trusted local networks (LAN). Delivers browser-based file management, file upload/download, media playback, live hardware OLED status, and temperature/humidity monitoring via DHT11.
Repo:    https://github.com/MtanvirA/NAS_Sync-Mini-Server
Route:   /projects/nas-sync-mini-server/`
        },
        'project nas-sync': {
            type: 'info',
            text: `Project: NAS Sync Mini Server (IoT / Embedded Systems)
Stack:   C++, ESP32, microSD, OLED, DHT11, PlatformIO
Details: ESP32-based network storage and media server designed for trusted local networks (LAN). Delivers browser-based file management, file upload/download, media playback, live hardware OLED status, and temperature/humidity monitoring via DHT11.
Repo:    https://github.com/MtanvirA/NAS_Sync-Mini-Server
Route:   /projects/nas-sync-mini-server/`
        },
        'project enrollment': {
            type: 'info',
            text: `Project: PSTU Student Enrollment System (Java / OOP)
Stack:   Java, Object-Oriented Programming (JDK 8+)
Details: Menu-driven console-based enrollment and fee-management system. Implements role-based login (Student, Cashier, Administrator), CGPA-based fee reductions, cashier payment approval workflow, plain-text receipts, student records, and CSV report exports.
Repo:    https://github.com/MtanvirA/Student-Enrollment-System-Using-Java
Route:   /projects/student-enrollment-system/`
        },
        'project student-enrollment': {
            type: 'info',
            text: `Project: PSTU Student Enrollment System (Java / OOP)
Stack:   Java, Object-Oriented Programming (JDK 8+)
Details: Menu-driven console-based enrollment and fee-management system. Implements role-based login (Student, Cashier, Administrator), CGPA-based fee reductions, cashier payment approval workflow, plain-text receipts, student records, and CSV report exports.
Repo:    https://github.com/MtanvirA/Student-Enrollment-System-Using-Java
Route:   /projects/student-enrollment-system/`
        },
        skills: {
            type: 'list',
            text: `Technical Competencies (Verified from CV & Confirmed Practice):
- Programming Languages: C, C++, Java, C#, JavaScript, SQL, Python
- Web & Frameworks:      ASP.NET Core, Entity Framework Core, HTML5, CSS3, Bootstrap 5, Tailwind CSS, Chart.js
- Databases:             MySQL, Oracle
- Embedded & Tools:      ESP32, PlatformIO, Git, GitHub, Visual Studio Code
- Problem Solving:       Data Structures & Algorithms, Competitive Programming (Codeforces, LeetCode)
- AI-Assisted Dev:       ChatGPT, GitHub Copilot, Google Antigravity (Prompt Engineering, Task Decomposition, Code Explanation & Review, Debugging)`
        },
        education: {
            type: 'info',
            text: `Patuakhali Science and Technology University (PSTU)
Faculty of Computer Science and Engineering
Degree: B.Sc. in Computer Science and Engineering (Session: 2023–2024)
Academic Honors & Standing:
- Cumulative CGPA: 3.820 / 4.000 (Through 3rd Semester)
- Completed Credits: 62.00 Total Completed Credits
- Honors: Dean's Merit Award (Level 1)
- Merit Standing: 1st position among students shown in published 3rd-semester result sheet.
Progression:
- 1st Semester: 3.870 GPA (20.25 Credits)
- 2nd Semester: 3.771 GPA (20.75 Credits)
- 3rd Semester: 3.821 GPA (21.00 Credits)
Selected CSE & Engineering Coursework Across Three Semesters:
- Semester 1 (GPA 3.870 | 20.25 Credits):
  * CIT-111: Programming Language (3.00 Cr, Grade A+ / 4.00)
  * CIT-112: Programming Language Sessional (1.50 Cr, Grade A+ / 4.00)
  * MAT-111: Mathematics-I (3.00 Cr, Grade A / 3.75)
  * EEE-111: Basic Electrical Engineering (3.00 Cr, Grade A+ / 4.00)
  * EEE-112: Basic Electrical Engineering Sessional (1.50 Cr, Grade A / 3.75)
- Semester 2 (GPA 3.771 | 20.75 Credits):
  * CIT-121: Discrete Mathematics (3.00 Cr, Grade A+ / 4.00)
  * CCE-121: Object Oriented Programming (3.00 Cr, Grade B / 3.00)
  * CCE-122: Object Oriented Programming Sessional (1.50 Cr, Grade A+ / 4.00)
  * MAT-121: Mathematics-II (3.00 Cr, Grade A+ / 4.00)
  * EEE-121: Electronic Device and Circuits (3.00 Cr, Grade A / 3.75)
  * EEE-122: Electronic Device and Circuits Sessional (1.50 Cr, Grade A+ / 4.00)
- Semester 3 (GPA 3.821 | 21.00 Credits &bull; 1st Merit Position):
  * CIT-211: Data Structure and Algorithms (3.00 Cr, Grade A- / 3.50)
  * CIT-212: Data Structure and Algorithms Sessional (1.50 Cr, Grade A+ / 4.00)
  * CIT-213: Software Engineering (3.00 Cr, Grade A+ / 4.00)
  * CCE-211: Data Communication and Engineering (3.00 Cr, Grade A- / 3.50)
  * MAT-211: Mathematics-III (3.00 Cr, Grade A+ / 4.00)
  * EEE-211: Electrical Technology (3.00 Cr, Grade A+ / 4.00)
  * EEE-212: Electrical Technology Sessional (1.50 Cr, Grade A+ / 4.00)`
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