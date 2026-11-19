/**
 * Tanvir Anjum Portfolio - Production Static Site Interactions (Milestone 14)
 * Implements Editorial Navigation, Scroll Progress, Scroll-Triggered Reveals,
 * Hero Interactive Synthesis Console, Project Filtering, Accessible Motion Pause,
 * Netlify Form enhancements, and Engineering Canvas proximity tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollProgressBar();
    initMotionToggle();
    initRevealOnScroll();
    initHeroSynthesisConsole();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    initAriaValidationSync();
    initEngineeringCanvas();
});

/* ========================================================
   1. NAVIGATION & EDITORIAL SCROLLSPY
   ======================================================== */
function initNavigation() {
    const header = document.getElementById('mainHeader');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScroll = () => {
        if (window.scrollY > 20) {
            header?.classList.add('bg-[#090a0f]/92', 'backdrop-blur-md', 'border-b', 'border-[#212836]');
            header?.classList.remove('bg-transparent');
        } else {
            header?.classList.remove('bg-[#090a0f]/92', 'backdrop-blur-md', 'border-b', 'border-[#212836]');
            header?.classList.add('bg-transparent');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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

    // Scrollspy for active navigation items on home page
    const sections = document.querySelectorAll('section[id]');
    if (sections.length && navLinks.length) {
        const onScrollSpy = () => {
            const scrollY = window.scrollY;
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 140;
                const sectionId = current.getAttribute('id');
                const matchingLinks = document.querySelectorAll(`.nav-link[href*="#${sectionId}"]`);

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('text-[#d4ff3a]', 'font-semibold');
                        link.classList.add('text-slate-400');
                    });
                    matchingLinks.forEach(matchingLink => {
                        matchingLink.classList.add('text-[#d4ff3a]', 'font-semibold');
                        matchingLink.classList.remove('text-slate-400');
                    });
                }
            });
        };
        window.addEventListener('scroll', onScrollSpy, { passive: true });
        onScrollSpy();
    }
}

/* ========================================================
   2. SCROLL PROGRESS INDICATOR
   ======================================================== */
function initScrollProgressBar() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    const updateBar = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) {
            bar.style.width = '0%';
            return;
        }
        const pct = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
        bar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('resize', updateBar, { passive: true });
    updateBar();
}

/* ========================================================
   3. ACCESSIBLE MOTION TOGGLE
   ======================================================== */
function initMotionToggle() {
    const btn = document.getElementById('motionToggle');
    if (!btn) return;

    // Check stored preference or system setting
    const stored = localStorage.getItem('tanvir_motion');
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (stored === 'paused' || (!stored && prefersReduce)) {
        document.body.classList.add('motion-paused');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('title', 'Resume ambient motion');
    }

    btn.addEventListener('click', () => {
        const isPaused = document.body.classList.toggle('motion-paused');
        btn.setAttribute('aria-pressed', String(isPaused));
        btn.setAttribute('title', isPaused ? 'Resume ambient motion' : 'Pause ambient motion');
        localStorage.setItem('tanvir_motion', isPaused ? 'paused' : 'running');
    });
}

/* ========================================================
   4. SCROLL-TRIGGERED REVEALS (IntersectionObserver)
   ======================================================== */
function initRevealOnScroll() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!reveals.length) return;

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce || !('IntersectionObserver' in window)) {
        reveals.forEach(el => el.classList.add('is-revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ========================================================
   5. HERO INTERACTIVE SYNTHESIS CONSOLE
   ======================================================== */
function initHeroSynthesisConsole() {
    const nodeButtons = document.querySelectorAll('.hero-console-node-btn');
    const titleEl = document.getElementById('heroConsoleTitle');
    const descEl = document.getElementById('heroConsoleDesc');
    const stackEl = document.getElementById('heroConsoleStack');
    const roleEl = document.getElementById('heroConsoleRole');

    if (!nodeButtons.length || !titleEl) return;

    const DATA = {
        code: {
            title: "01 / COMPILED & OBJECT-ORIENTED CODE",
            role: "CORE PROGRAMMING & FOUNDATIONS",
            stack: ["C / C++", "C# (ASP.NET)", "Java 17+", "Python"],
            desc: "Writing strongly typed, high-efficiency compiled logic. Proficient with OOP hierarchies in Java/C#, memory models and pointer arithmetic in C/C++, and algorithmic clarity."
        },
        algorithms: {
            title: "02 / ALGORITHMIC RIGOR & LOGIC",
            role: "COMPETITIVE PROGRAMMING",
            stack: ["Graphs (BFS/DFS)", "Dynamic Programming", "Greedy", "O(V+E) Analysis"],
            desc: "Approaching engineering challenges with rigorous complexity analysis and mathematical intuition. Active on Codeforces and LeetCode honing algorithmic problem-solving."
        },
        databases: {
            title: "03 / RELATIONAL CLOUD DATABASES",
            role: "DATA INTEGRITY & PERSISTENCE",
            stack: ["TiDB Cloud (Distributed)", "MySQL", "EF Core", "ACID Transactions"],
            desc: "Designing normalized schemas, indexing strategies, resilient connection retry policies, and clean repository data abstractions across cloud MySQL protocols."
        },
        hardware: {
            title: "04 / EMBEDDED SYSTEMS & IOT",
            role: "PHYSICAL COMPUTING BRIDGES",
            stack: ["ESP32 / ESP8266", "Ultrasonic & Vibration", "I2C OLED", "UART & GSM/GPS"],
            desc: "Connecting physical sensors to micro-controllers. Engineered railway track obstacle detectors and WiFi mini network storage servers with hardware telemetry."
        },
        web: {
            title: "05 / FULL-STACK WEB ARCHITECTURE",
            role: "END-TO-END PRODUCTION APPS",
            stack: ["ASP.NET Core MVC", "Tailwind CSS v4", "REST APIs", "Clean Architecture"],
            desc: "Architecting multi-tier software with Clean Architecture separation, custom cookie authentication, responsive accessible UI, and seamless client-server integration."
        }
    };

    const activateNode = (key) => {
        const item = DATA[key];
        if (!item) return;

        nodeButtons.forEach(btn => {
            const isTarget = btn.getAttribute('data-node') === key;
            btn.classList.toggle('border-[#d4ff3a]', isTarget);
            btn.classList.toggle('bg-[#1a2333]', isTarget);
            btn.classList.toggle('border-[#212836]', !isTarget);
            btn.classList.toggle('bg-[#10141d]', !isTarget);
            btn.setAttribute('aria-selected', String(isTarget));
        });

        titleEl.textContent = item.title;
        if (roleEl) roleEl.textContent = item.role;
        if (descEl) descEl.textContent = item.desc;

        if (stackEl) {
            stackEl.innerHTML = '';
            item.stack.forEach(tech => {
                const badge = document.createElement('span');
                badge.className = 'px-2 py-0.5 rounded bg-[#161c27] border border-[#263143] text-xs font-mono-code text-[#d4ff3a]';
                badge.textContent = tech;
                stackEl.appendChild(badge);
            });
        }
    };

    nodeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-node');
            activateNode(key);
        });
        btn.addEventListener('mouseenter', () => {
            const key = btn.getAttribute('data-node');
            activateNode(key);
        });
    });
}

/* ========================================================
   6. PROJECT FILTERING
   ======================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            filterButtons.forEach(b => {
                b.classList.remove('bg-[#d4ff3a]', 'text-[#090a0f]', 'border-[#d4ff3a]');
                b.classList.add('bg-[#141822]', 'text-[#94a3b8]', 'border-[#232a36]');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('bg-[#d4ff3a]', 'text-[#090a0f]', 'border-[#d4ff3a]');
            btn.classList.remove('bg-[#141822]', 'text-[#94a3b8]', 'border-[#232a36]');
            btn.setAttribute('aria-pressed', 'true');

            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(6px)';
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
   7. NETLIFY FORM CLIENT-SIDE ENHANCEMENT
   ======================================================== */
function initAriaValidationSync() {
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
    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const feedbackBanner = document.getElementById('contactFeedback');

    if (urlParams.get('success') === 'true' && feedbackBanner) {
        feedbackBanner.classList.remove('hidden');
        feedbackBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.setAttribute('aria-invalid', 'true');
            }
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnSpinner = submitBtn?.querySelector('.btn-spinner');

        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Submitting message...';
        if (btnSpinner) btnSpinner.classList.remove('hidden');
    });
}

/* ========================================================
   8. RETURN TO TOP BUTTON
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

/* ========================================================
   9. ENGINEERING CANVAS: SPOTLIGHT & CIRCUIT PROXIMITY
   ======================================================== */
function initEngineeringCanvas() {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
        return;
    }

    const sections = document.querySelectorAll('.canvas-section');
    if (!sections.length) return;

    sections.forEach(section => {
        const nodes = section.querySelectorAll('.circuit-node, .circuit-pad');
        const traces = section.querySelectorAll('.circuit-trace, .circuit-signal-trace');

        let isPointerInside = false;
        let rafId = null;
        let lastEvent = null;

        const updateCanvas = () => {
            if (!lastEvent || !isPointerInside) {
                rafId = null;
                return;
            }

            const rect = section.getBoundingClientRect();
            const relX = lastEvent.clientX - rect.left;
            const relY = lastEvent.clientY - rect.top;

            section.style.setProperty('--pointer-x', `${relX}px`);
            section.style.setProperty('--pointer-y', `${relY}px`);
            section.style.setProperty('--spotlight-opacity', '1');

            const threshold = 135;
            const thresholdSq = threshold * threshold;

            nodes.forEach(node => {
                const nodeRect = node.getBoundingClientRect();
                const nodeCenterX = nodeRect.left + nodeRect.width / 2;
                const nodeCenterY = nodeRect.top + nodeRect.height / 2;

                const dx = lastEvent.clientX - nodeCenterX;
                const dy = lastEvent.clientY - nodeCenterY;
                const distSq = dx * dx + dy * dy;

                if (distSq < thresholdSq) {
                    node.classList.add('node-lit');
                } else {
                    node.classList.remove('node-lit');
                }
            });

            traces.forEach(trace => {
                const traceRect = trace.getBoundingClientRect();
                const traceCenterX = traceRect.left + traceRect.width / 2;
                const traceCenterY = traceRect.top + traceRect.height / 2;

                const dx = lastEvent.clientX - traceCenterX;
                const dy = lastEvent.clientY - traceCenterY;
                const distSq = dx * dx + dy * dy;

                if (distSq < thresholdSq * 1.4) {
                    trace.classList.add('trace-lit');
                } else {
                    trace.classList.remove('trace-lit');
                }
            });

            rafId = null;
        };

        section.addEventListener('pointerenter', (e) => {
            isPointerInside = true;
            lastEvent = e;
            if (!rafId) rafId = requestAnimationFrame(updateCanvas);
        });

        section.addEventListener('pointermove', (e) => {
            lastEvent = e;
            if (!rafId) rafId = requestAnimationFrame(updateCanvas);
        });

        section.addEventListener('pointerleave', () => {
            isPointerInside = false;
            section.style.setProperty('--spotlight-opacity', '0');
            nodes.forEach(n => n.classList.remove('node-lit'));
            traces.forEach(t => t.classList.remove('trace-lit'));
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        });
    });
}
