/**
 * Tanvir Anjum Portfolio - Interactive Scripts
 * Complies with modern-web-guidance for dialogs, forms, and accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProjectFilters();
    initContactForm();
    initTerminalModal();
    initBackToTop();
    initAriaValidationSync();
});

/* ========================================================
   1. NAVIGATION & MOBILE MENU
   ======================================================== */
function initNavigation() {
    const header = document.getElementById('mainHeader');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header scroll appearance
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header?.classList.add('bg-[#090a0f]/90', 'backdrop-blur-md', 'border-b', 'border-[#212836]');
            header?.classList.remove('bg-transparent');
        } else {
            header?.classList.remove('bg-[#090a0f]/90', 'backdrop-blur-md', 'border-b', 'border-[#212836]');
            header?.classList.add('bg-transparent');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile menu toggle
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            mobileMenu.classList.toggle('hidden');

            const iconOpen = menuToggle.querySelector('.icon-open');
            const iconClose = menuToggle.querySelector('.icon-close');
            if (iconOpen && iconClose) {
                iconOpen.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            }
        });

        // Close mobile menu on clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuToggle.setAttribute('aria-expanded', 'false');
                const iconOpen = menuToggle.querySelector('.icon-open');
                const iconClose = menuToggle.querySelector('.icon-close');
                if (iconOpen && iconClose) {
                    iconOpen.classList.remove('hidden');
                    iconClose.classList.add('hidden');
                }
            });
        });
    }

    // Scrollspy for active navigation item
    const sections = document.querySelectorAll('section[id]');
    const onScrollSpy = () => {
        const scrollY = window.scrollY;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const matchingLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('text-[#d4ff3a]', 'font-semibold'));
                if (matchingLink) {
                    matchingLink.classList.add('text-[#d4ff3a]', 'font-semibold');
                }
            }
        });
    };
    window.addEventListener('scroll', onScrollSpy, { passive: true });
}

/* ========================================================
   2. PROJECT FILTERING
   ======================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            // Update active button state
            filterButtons.forEach(b => {
                b.classList.remove('bg-[#d4ff3a]', 'text-[#090a0f]', 'border-[#d4ff3a]');
                b.classList.add('bg-[#141822]', 'text-[#94a3b8]', 'border-[#232a36]');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('bg-[#d4ff3a]', 'text-[#090a0f]', 'border-[#d4ff3a]');
            btn.classList.remove('bg-[#141822]', 'text-[#94a3b8]', 'border-[#232a36]');
            btn.setAttribute('aria-pressed', 'true');

            // Filter project cards
            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(8px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ========================================================
   3. ACCESSIBLE FORM VALIDATION & AJAX SUBMISSION
   ======================================================== */
function initAriaValidationSync() {
    // Per modern-web-guidance: sync aria-invalid with :user-invalid state
    const syncAria = (el) => {
        if (!el || !('matches' in el)) return;
        if (el.matches('input, textarea')) {
            el.setAttribute('aria-invalid', el.matches(':user-invalid') ? 'true' : 'false');
        }
    };

    document.addEventListener('blur', (e) => syncAria(e.target), true);
    document.addEventListener('input', (e) => {
        if (e.target && e.target.hasAttribute && e.target.hasAttribute('aria-invalid')) {
            syncAria(e.target);
        }
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedbackBox = document.getElementById('contactFeedback');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        // Allow standard submit if JS fetch is not supported
        if (!window.fetch) return;

        // Check native HTML5 form validity
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        e.preventDefault();

        // UI loading state
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Submitting message...';
        if (btnSpinner) btnSpinner.classList.remove('hidden');
        if (feedbackBox) {
            feedbackBox.classList.add('hidden');
            feedbackBox.innerHTML = '';
        }

        const formData = new FormData(form);
        const tokenInput = form.querySelector('input[name="__RequestVerificationToken"]');
        const token = tokenInput ? tokenInput.value : '';

        try {
            const response = await fetch(form.action || '/Home/SubmitContact', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                body: formData
            });

            const result = await response.json();

            if (feedbackBox) {
                feedbackBox.classList.remove('hidden');
                if (result.success) {
                    feedbackBox.className = 'p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-sm flex items-start gap-3';
                    feedbackBox.innerHTML = `
                        <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        <div>
                            <p class="font-semibold text-emerald-200">Message Delivered</p>
                            <p class="mt-1">${escapeHtml(result.message)}</p>
                        </div>
                    `;
                    form.reset();
                } else {
                    const isDb = result.isDatabaseError;
                    const borderCls = isDb ? 'border-amber-500/40 bg-amber-950/30 text-amber-300' : 'border-rose-500/40 bg-rose-950/30 text-rose-300';
                    const iconColor = isDb ? 'text-amber-400' : 'text-rose-400';
                    const titleText = isDb ? 'Notice: Database Unavailable' : 'Submission Error';

                    feedbackBox.className = `p-4 rounded-xl border ${borderCls} text-sm flex items-start gap-3`;
                    feedbackBox.innerHTML = `
                        <svg class="w-5 h-5 ${iconColor} shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <div>
                            <p class="font-semibold">${titleText}</p>
                            <p class="mt-1">${escapeHtml(result.message)}</p>
                        </div>
                    `;
                }
                feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } catch (err) {
            console.error('Submission failed', err);
            if (feedbackBox) {
                feedbackBox.classList.remove('hidden');
                feedbackBox.className = 'p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-sm flex items-start gap-3';
                feedbackBox.innerHTML = `
                    <svg class="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    <div>
                        <p class="font-semibold">Network / Server Issue</p>
                        <p class="mt-1">Unable to complete the request right now. Please email directly at <a href="mailto:tanviranjum201@gmail.com" class="underline text-lime-300">tanviranjum201@gmail.com</a>.</p>
                    </div>
                `;
            }
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Send Message';
            if (btnSpinner) btnSpinner.classList.add('hidden');
        }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ========================================================
   4. TERMINAL EASTER EGG (Ctrl+K or Command Button)
   ======================================================== */
function initTerminalModal() {
    const dialog = document.getElementById('terminalDialog');
    const openBtns = document.querySelectorAll('.open-terminal-btn');
    const closeBtn = document.getElementById('closeTerminalBtn');
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');

    if (!dialog) return;

    // Open terminal modal
    const openModal = () => {
        if (typeof dialog.showModal === 'function') {
            dialog.showModal();
            terminalInput?.focus();
        }
    };

    openBtns.forEach(btn => btn.addEventListener('click', openModal));

    // Keyboard shortcut: Ctrl+K or Cmd+K
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

    // Light-dismiss fallback as required by modern-web-guidance
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

    // Terminal command history
    let commandHistory = [];
    let historyIdx = -1;

    terminalInput?.addEventListener('keydown', async (e) => {
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
            const rawCmd = terminalInput.value.trim();
            if (!rawCmd) return;

            commandHistory.push(rawCmd);
            historyIdx = -1;
            terminalInput.value = '';

            // Print user command prompt
            appendTerminalLine(`tanvir@pstu:~$ ${escapeHtml(rawCmd)}`, 'text-lime-300 font-bold');

            if (rawCmd.toLowerCase() === 'clear') {
                if (terminalOutput) terminalOutput.innerHTML = '';
                return;
            }

            if (rawCmd.toLowerCase() === 'exit') {
                dialog.close();
                return;
            }

            // Fetch command response from backend
            try {
                const res = await fetch(`/Home/TerminalCommand?cmd=${encodeURIComponent(rawCmd)}`);
                const data = await res.json();

                if (data.type === 'clear') {
                    if (terminalOutput) terminalOutput.innerHTML = '';
                } else if (data.type === 'exit') {
                    dialog.close();
                } else {
                    const colorCls = data.type === 'error' ? 'text-rose-400' : 'text-slate-300';
                    appendTerminalLine(escapeHtml(data.text), colorCls);
                }
            } catch (err) {
                appendTerminalLine('Error communicating with terminal backend service.', 'text-rose-400');
            }
        }
    });

    function appendTerminalLine(content, classNames) {
        if (!terminalOutput) return;
        const line = document.createElement('div');
        line.className = `whitespace-pre-wrap leading-relaxed py-1 font-mono-code text-xs md:text-sm ${classNames || ''}`;
        line.innerHTML = content;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

/* ========================================================
   5. RETURN TO TOP BUTTON
   ======================================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            btn.classList.add('opacity-100', 'translate-y-0');
        } else {
            btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
            btn.classList.remove('opacity-100', 'translate-y-0');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
