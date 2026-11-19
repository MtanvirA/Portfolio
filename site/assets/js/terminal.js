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
            text: `Featured Projects:
1. ShareSync       - Full-stack portfolio & stock tracking web app (ASP.NET Core + MySQL)
2. Railway Monitor - ESP32 IoT track obstacle & velocity safety prototype
3. CampusSync      - PSTU CSE department scheduling & coordination portal prototype
Type 'project sharesync', 'project railway', or 'project campussync' for deep-dives, or visit /projects/ for complete case studies.`
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
        skills: {
            type: 'list',
            text: `Technical Competencies:
- Languages: C++, C#, C, JavaScript
- Backend:   ASP.NET Core MVC, Entity Framework Core
- Database:  MySQL
- Frontend:  HTML5, CSS, Tailwind CSS, Vanilla JS
- Tooling:   Git, GitHub, VS Code`
        },
        education: {
            type: 'info',
            text: `Patuakhali Science and Technology University (PSTU)
Degree: B.Sc. in Engineering, CSE
Session: 2023–2024
Provisional Academic Standing:
- 1st Semester: 3.870 | Cumulative: 3.870
- 2nd Semester: 3.771 | Cumulative: 3.820
- 3rd Semester: 3.821 | Cumulative: 3.820
Overall Cumulative CGPA: 3.820 (Through 3rd Semester)`
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
        const dialog = document.getElementById('terminalDialog');
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
