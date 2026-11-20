/**
 * Tanvir Anjum Portfolio - Production Static Site Interactions (Milestone 15)
 * Editorial Monochrome + Crimson Red Palette
 * Implements Editorial Navigation, Scroll Progress, Scroll-Triggered Reveals,
 * Hero Interactive Synthesis Console, Project Filtering, Accessible Motion Pause,
 * Netlify Form enhancements, and Engineering Canvas proximity tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollProgressBar();
    initMotionToggle();
    initInteractiveTicker();
    initRevealOnScroll();
    initHeroSynthesisConsole();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    initAriaValidationSync();
    initEngineeringCanvas();
    initPixelPortrait();
    initBackgroundPixelField();
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
            header?.classList.add('bg-[#0B0B0C]/95', 'backdrop-blur-md', 'border-b', 'border-[#252528]');
            header?.classList.remove('bg-transparent');
        } else {
            header?.classList.remove('bg-[#0B0B0C]/95', 'backdrop-blur-md', 'border-b', 'border-[#252528]');
            header?.classList.add('bg-transparent');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (menuToggle && mobileMenu) {
        const closeMobileMenu = () => {
            mobileMenu.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('overflow-hidden');
            const iconOpen = menuToggle.querySelector('.icon-open');
            const iconClose = menuToggle.querySelector('.icon-close');
            if (iconOpen && iconClose) {
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            }
        };

        const openMobileMenu = () => {
            mobileMenu.classList.remove('hidden');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('overflow-hidden');
            const iconOpen = menuToggle.querySelector('.icon-open');
            const iconClose = menuToggle.querySelector('.icon-close');
            if (iconOpen && iconClose) {
                iconOpen.classList.add('hidden');
                iconClose.classList.remove('hidden');
            }
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
                menuToggle.focus();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && header && !header.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && !mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
            }
        }, { passive: true });
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
                        link.classList.remove('text-[#E3343F]', 'font-semibold');
                        link.classList.add('text-[#858585]');
                    });
                    matchingLinks.forEach(matchingLink => {
                        matchingLink.classList.add('text-[#E3343F]', 'font-semibold');
                        matchingLink.classList.remove('text-[#858585]');
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
   3. ACCESSIBLE MOTION TOGGLE (Milestone 16.6)
   ======================================================== */
function initMotionToggle() {
    const btn = document.getElementById('motionToggle');
    if (!btn) return;

    const pauseIcon = btn.querySelector('.icon-pause');
    const playIcon = btn.querySelector('.icon-play');

    const updateButtonVisual = (isPaused) => {
        btn.setAttribute('aria-pressed', String(isPaused));
        btn.setAttribute('aria-label', isPaused ? 'Resume ambient animation motion' : 'Pause ambient animation motion');
        btn.setAttribute('title', isPaused ? 'Resume ambient motion' : 'Pause ambient motion');

        if (pauseIcon && playIcon) {
            if (isPaused) {
                pauseIcon.classList.add('hidden');
                playIcon.classList.remove('hidden');
                btn.classList.add('text-[#E3343F]', 'border-[#E3343F]/50');
                btn.classList.remove('text-[#858585]');
            } else {
                pauseIcon.classList.remove('hidden');
                playIcon.classList.add('hidden');
                btn.classList.remove('text-[#E3343F]', 'border-[#E3343F]/50');
                btn.classList.add('text-[#858585]');
            }
        }
    };

    // Check stored preference or system setting
    const stored = localStorage.getItem('tanvir_motion');
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (stored === 'paused' || (!stored && prefersReduce)) {
        document.body.classList.add('motion-paused');
        updateButtonVisual(true);
    } else {
        updateButtonVisual(false);
    }

    btn.addEventListener('click', () => {
        const isPaused = document.body.classList.toggle('motion-paused');
        updateButtonVisual(isPaused);
        localStorage.setItem('tanvir_motion', isPaused ? 'paused' : 'running');
    });

    try {
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            const hasStored = localStorage.getItem('tanvir_motion');
            if (!hasStored) {
                document.body.classList.toggle('motion-paused', e.matches);
                updateButtonVisual(e.matches);
            }
        });
    } catch (_) {}
}

/* ========================================================
   3.1. INTERACTIVE TICKER (Auto-Marquee + Drag/Swipe/Wheel)
   ======================================================== */
function initInteractiveTicker() {
    const tickerWrap = document.getElementById('ticker');
    const track = tickerWrap?.querySelector('.ticker-track');
    if (!tickerWrap || !track) return;

    // Enable JS interactive mode (disables static CSS keyframe animation)
    tickerWrap.classList.add('ticker-js-active');

    // Accessibility configuration
    tickerWrap.setAttribute('tabindex', '0');
    tickerWrap.setAttribute('role', 'region');
    tickerWrap.setAttribute('aria-label', 'Engineering focus areas marquee. Drag, swipe, or use left and right arrow keys to scroll manually.');

    let currentX = 0;
    let singleCycleWidth = 0;
    let isPointerDown = false;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let dragStartX = 0;
    let lastDragX = 0;
    let lastDragTime = 0;
    let velocity = 0;
    let isDecelerating = false;
    let isWheelActive = false;
    let wheelTimeout = null;
    let lastTimestamp = 0;
    let rafId = null;

    const SPEED = 58; // pixels per second (~36s for 2100px cycle)

    const calculateMetrics = () => {
        const items = track.querySelectorAll('.ticker-item');
        if (items.length >= 16) {
            // Find repeat cycle width: distance from item 0 to item (length / 3 or length / 2)
            const setSize = Math.floor(items.length / 3) || Math.floor(items.length / 2) || 8;
            if (items[setSize] && items[0]) {
                singleCycleWidth = items[setSize].offsetLeft - items[0].offsetLeft;
            }
        }
        if (!singleCycleWidth || singleCycleWidth <= 0) {
            singleCycleWidth = track.scrollWidth / (items.length >= 24 ? 3 : 2);
        }
    };

    const wrapPosition = () => {
        if (singleCycleWidth > 0) {
            while (currentX >= singleCycleWidth) {
                currentX -= singleCycleWidth;
            }
            while (currentX < 0) {
                currentX += singleCycleWidth;
            }
        }
    };

    const checkMotionPaused = () => {
        const isBodyPaused = document.body.classList.contains('motion-paused');
        const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return isBodyPaused || prefersReduce;
    };

    const tick = (timestamp) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const dt = Math.min((timestamp - lastTimestamp) * 0.001, 0.1);
        lastTimestamp = timestamp;

        const isPaused = checkMotionPaused();

        if (isDecelerating) {
            // Smooth inertial glide after release
            currentX += velocity * dt * 60;
            velocity *= 0.92;
            if (Math.abs(velocity) < 0.05) {
                isDecelerating = false;
                velocity = 0;
            }
            wrapPosition();
            track.style.transform = `translate3d(${-currentX.toFixed(2)}px, 0, 0)`;
        } else if (!isDragging && !isWheelActive && !isPaused) {
            // Continuous auto-scrolling
            currentX += SPEED * dt;
            wrapPosition();
            track.style.transform = `translate3d(${-currentX.toFixed(2)}px, 0, 0)`;
        }

        rafId = requestAnimationFrame(tick);
    };

    calculateMetrics();
    rafId = requestAnimationFrame(tick);

    window.addEventListener('resize', () => {
        calculateMetrics();
        wrapPosition();
    }, { passive: true });

    // Pointer Dragging (Mouse & Touch)
    tickerWrap.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;

        isPointerDown = true;
        isDragging = false;
        isDecelerating = false;
        velocity = 0;

        startX = e.clientX;
        startY = e.clientY;
        dragStartX = currentX;
        lastDragX = e.clientX;
        lastDragTime = performance.now();
    });

    window.addEventListener('pointermove', (e) => {
        if (!isPointerDown) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!isDragging) {
            // Distinguish horizontal swipe vs vertical page scroll
            if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
                isDragging = true;
                tickerWrap.classList.add('is-dragging');
                if (e.pointerType === 'mouse') {
                    document.body.style.userSelect = 'none';
                    try { window.getSelection()?.removeAllRanges(); } catch (_) {}
                }
                try {
                    tickerWrap.setPointerCapture(e.pointerId);
                } catch (_) {}
            } else if (Math.abs(dy) > 6 && Math.abs(dy) > Math.abs(dx)) {
                // Vertical intent: release and allow normal page scrolling
                isPointerDown = false;
                return;
            }
        }

        if (isDragging) {
            const now = performance.now();
            const timeDelta = now - lastDragTime;
            if (timeDelta > 0) {
                const instantV = (lastDragX - e.clientX) / timeDelta * 16.67;
                velocity = velocity * 0.35 + instantV * 0.65;
                lastDragX = e.clientX;
                lastDragTime = now;
            }

            currentX = dragStartX - dx;
            wrapPosition();
            track.style.transform = `translate3d(${-currentX.toFixed(2)}px, 0, 0)`;
        }
    }, { passive: true });

    const handlePointerEnd = (e) => {
        if (!isPointerDown) return;
        isPointerDown = false;

        if (isDragging) {
            isDragging = false;
            tickerWrap.classList.remove('is-dragging');
            document.body.style.userSelect = '';

            try {
                if (e && tickerWrap.hasPointerCapture(e.pointerId)) {
                    tickerWrap.releasePointerCapture(e.pointerId);
                }
            } catch (_) {}

            if (Math.abs(velocity) > 1.2) {
                isDecelerating = true;
            }
        }
    };

    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);

    // Trackpad / Mouse Wheel Horizontal Scrolling
    tickerWrap.addEventListener('wheel', (e) => {
        const deltaX = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);

        if (Math.abs(deltaX) > 1) {
            // Horizontal wheel detected: consume and scroll ticker
            e.preventDefault();

            isWheelActive = true;
            isDecelerating = false;
            velocity = 0;

            currentX += deltaX * 0.9;
            wrapPosition();
            track.style.transform = `translate3d(${-currentX.toFixed(2)}px, 0, 0)`;

            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                isWheelActive = false;
            }, 350);
        }
    }, { passive: false });

    // Keyboard Arrow Navigation
    tickerWrap.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            isDecelerating = false;
            currentX += 120;
            wrapPosition();
            track.style.transform = `translate3d(${-currentX.toFixed(2)}px, 0, 0)`;
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            isDecelerating = false;
            currentX -= 120;
            wrapPosition();
            track.style.transform = `translate3d(${-currentX.toFixed(2)}px, 0, 0)`;
        }
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
            stack: ["C / C++", "C# (ASP.NET)", "Java", "Python"],
            desc: "Writing strongly typed, high-efficiency compiled logic. Developing OOP hierarchies in Java/C#, memory models and pointer arithmetic in C/C++, and algorithmic clarity."
        },
        algorithms: {
            title: "02 / ALGORITHMIC RIGOR & LOGIC",
            role: "COMPETITIVE PROGRAMMING",
            stack: ["Graphs (BFS/DFS)", "Dynamic Programming", "Greedy", "O(V+E) Analysis"],
            desc: "Approaching engineering challenges with rigorous complexity analysis and mathematical intuition. Active on Codeforces and LeetCode honing algorithmic problem-solving."
        },
        databases: {
            title: "03 / RELATIONAL DATABASES & PERSISTENCE",
            role: "DATA INTEGRITY & SCHEMA DESIGN",
            stack: ["MySQL", "Entity Framework Core", "Schema Design", "ACID Transactions"],
            desc: "Designing normalized schemas, relational models, indexing strategies, and clean repository data abstractions with MySQL and Entity Framework Core."
        },
        hardware: {
            title: "04 / EMBEDDED SYSTEMS & IOT",
            role: "PHYSICAL COMPUTING BRIDGES",
            stack: ["ESP32", "Sensors & OLED", "microSD (SPI)", "PlatformIO"],
            desc: "Connecting physical sensors to microcontrollers. Designed IoT railway safety prototypes with speed and obstacle monitoring, and local WiFi network storage servers with hardware telemetry."
        },
        web: {
            title: "05 / FULL-STACK WEB ARCHITECTURE",
            role: "END-TO-END PRODUCTION APPS",
            stack: ["ASP.NET Core MVC", "Bootstrap / Tailwind", "REST APIs", "Clean Architecture"],
            desc: "Architecting multi-tier software with Clean Architecture separation, custom cookie authentication, responsive accessible UI, and seamless client-server integration."
        }
    };

    const activateNode = (key) => {
        const item = DATA[key];
        if (!item) return;

        nodeButtons.forEach(btn => {
            const isTarget = btn.getAttribute('data-node') === key;
            btn.classList.toggle('border-[#E3343F]', isTarget);
            btn.classList.toggle('bg-[#1F1F22]', isTarget);
            btn.classList.toggle('border-[#252528]', !isTarget);
            btn.classList.toggle('bg-[#141416]', !isTarget);
            btn.setAttribute('aria-selected', String(isTarget));
        });

        titleEl.textContent = item.title;
        if (roleEl) roleEl.textContent = item.role;
        if (descEl) descEl.textContent = item.desc;

        if (stackEl) {
            stackEl.innerHTML = '';
            item.stack.forEach(tech => {
                const badge = document.createElement('span');
                badge.className = 'px-2 py-0.5 rounded bg-[#1F1F22] border border-[#252528] text-xs font-mono text-[#E3343F]';
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
                b.classList.remove('bg-[#E3343F]', 'text-white', 'border-[#E3343F]');
                b.classList.add('bg-[#141416]', 'text-[#858585]', 'border-[#252528]');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('bg-[#E3343F]', 'text-white', 'border-[#E3343F]');
            btn.classList.remove('bg-[#141416]', 'text-[#858585]', 'border-[#252528]');
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

/* ========================================================
   10. ILLUSTRATED PIXEL PORTRAIT & TILE PHYSICS (Milestone 16.4)
   ======================================================== */
function initPixelPortrait() {
    const wrapper = document.getElementById('portraitPixelWrapper');
    const img = document.getElementById('portraitImg');
    const canvas = document.getElementById('portraitPixelCanvas');
    if (!wrapper || !img || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const TARGET_TILE_SIZE = 15; // 15 CSS px cells (~24x32 grid on desktop)
    const EFFECT_RADIUS = 100; // Proximity influence radius in CSS px
    const MAX_DISPLACEMENT = 3.6; // Subtle 1-4px displacement range

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;

    let tiles = [];
    let isHovering = false;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let currentMouseX = -1000;
    let currentMouseY = -1000;
    let lastHoverMoveTime = 0;
    const HOVER_IDLE_TIMEOUT = 1200; // Allow 1.2s of ripple settling when cursor rests inside portrait
    let rafId = null;

    const buildTileGrid = () => {
        width = wrapper.clientWidth;
        height = wrapper.clientHeight;
        if (!width || !height || !img.naturalWidth) return false;

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        cols = Math.round(width / TARGET_TILE_SIZE);
        rows = Math.round(height / TARGET_TILE_SIZE);

        const tileW = width / cols;
        const tileH = height / rows;
        const srcTileW = img.naturalWidth / cols;
        const srcTileH = img.naturalHeight / rows;

        tiles = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const ox = c * tileW;
                const oy = r * tileH;
                tiles.push({
                    c, r,
                    ox,
                    oy,
                    cx: ox + tileW * 0.5,
                    cy: oy + tileH * 0.5,
                    w: tileW,
                    h: tileH,
                    sx: c * srcTileW,
                    sy: r * srcTileH,
                    sw: srcTileW,
                    sh: srcTileH,
                    x: ox,
                    y: oy,
                    scale: 1.0,
                    highlight: 0.0,
                    crimsonAlpha: 0.0,
                    // Deterministic ~10% crimson accent keys connecting to site palette (#E3343F)
                    isCrimsonAccent: ((c * 7 + r * 13) % 11 === 0)
                });
            }
        }
        return true;
    };

    const renderPristineRest = () => {
        if (!tiles.length) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        ctx.fillStyle = '#141416';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < tiles.length; i++) {
            const t = tiles[i];
            t.x = t.ox;
            t.y = t.oy;
            t.scale = 1.0;
            t.highlight = 0.0;
            t.crimsonAlpha = 0.0;
            ctx.drawImage(img, t.sx, t.sy, t.sw, t.sh, t.ox, t.oy, t.w, t.h);
        }
        ctx.restore();
    };

    const animate = (timestamp) => {
        if (!tiles.length) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        ctx.fillStyle = '#141416';
        ctx.fillRect(0, 0, width, height);

        // Smooth cursor tracking interpolation
        currentMouseX += (targetMouseX - currentMouseX) * 0.22;
        currentMouseY += (targetMouseY - currentMouseY) * 0.22;

        const time = (timestamp || performance.now()) * 0.001;
        let hasActiveMotion = false;

        const isHoverActive = isHovering && (performance.now() - lastHoverMoveTime < HOVER_IDLE_TIMEOUT);

        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];

            let targetX = tile.ox;
            let targetY = tile.oy;
            let targetScale = 1.0;
            let targetHighlight = 0.0;
            let targetCrimson = 0.0;

            if (isHoverActive) {
                const dx = tile.cx - currentMouseX;
                const dy = tile.cy - currentMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < EFFECT_RADIUS) {
                    const p = 1.0 - dist / EFFECT_RADIUS;
                    const ease = p * p * (3 - 2 * p); // Cubic smoothstep

                    // Organic directional displacement away from pointer
                    const angle = Math.atan2(dy, dx);
                    const push = ease * MAX_DISPLACEMENT;

                    // Restrained ripple wave propagating through adjacent tiles
                    const ripple = Math.sin(dist * 0.12 - time * 4.8) * (0.85 * ease);

                    targetX = tile.ox + Math.cos(angle) * (push + ripple);
                    targetY = tile.oy + Math.sin(angle) * (push + ripple);

                    // Small scale variation (1.0 to 1.055)
                    targetScale = 1.0 + 0.055 * ease;

                    // Subtle brightness highlight
                    targetHighlight = ease * 0.18;

                    // Subtle crimson accent
                    if (tile.isCrimsonAccent && ease > 0.15) {
                        targetCrimson = ease * 0.45;
                    }
                }
            } else if (isHovering) {
                // Pointer is stationary inside portrait: maintain subtle displaced shape without running ripples
                const dx = tile.cx - currentMouseX;
                const dy = tile.cy - currentMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < EFFECT_RADIUS) {
                    const p = 1.0 - dist / EFFECT_RADIUS;
                    const ease = p * p * (3 - 2 * p);
                    const angle = Math.atan2(dy, dx);
                    const push = ease * (MAX_DISPLACEMENT * 0.85);

                    targetX = tile.ox + Math.cos(angle) * push;
                    targetY = tile.oy + Math.sin(angle) * push;
                    targetScale = 1.0 + 0.04 * ease;
                    targetHighlight = ease * 0.12;
                    if (tile.isCrimsonAccent && ease > 0.15) {
                        targetCrimson = ease * 0.35;
                    }
                }
            }

            // Spring interpolation towards target
            const spring = 0.18;
            tile.x += (targetX - tile.x) * spring;
            tile.y += (targetY - tile.y) * spring;
            tile.scale += (targetScale - tile.scale) * spring;
            tile.highlight += (targetHighlight - tile.highlight) * spring;
            tile.crimsonAlpha += (targetCrimson - tile.crimsonAlpha) * spring;

            if (Math.abs(tile.x - targetX) > 0.02 ||
                Math.abs(tile.y - targetY) > 0.02 ||
                Math.abs(tile.scale - targetScale) > 0.004) {
                hasActiveMotion = true;
            }

            const isDisplaced = tile.scale > 1.002 ||
                                Math.abs(tile.x - tile.ox) > 0.04 ||
                                Math.abs(tile.y - tile.oy) > 0.04 ||
                                tile.highlight > 0.01;

            if (!isDisplaced) {
                ctx.drawImage(img, tile.sx, tile.sy, tile.sw, tile.sh, tile.ox, tile.oy, tile.w, tile.h);
            } else {
                const cx = tile.x + tile.w * 0.5;
                const cy = tile.y + tile.h * 0.5;
                ctx.save();
                ctx.translate(cx, cy);
                if (tile.scale !== 1.0) {
                    ctx.scale(tile.scale, tile.scale);
                }

                ctx.drawImage(img, tile.sx, tile.sy, tile.sw, tile.sh, -tile.w * 0.5, -tile.h * 0.5, tile.w, tile.h);

                // Subtle dark tile seam emphasizing physical geometric tiles
                ctx.strokeStyle = 'rgba(11, 11, 12, 0.35)';
                ctx.lineWidth = 0.8;
                ctx.strokeRect(-tile.w * 0.5, -tile.h * 0.5, tile.w, tile.h);

                // Subtle brightness
                if (tile.highlight > 0.01) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${tile.highlight.toFixed(3)})`;
                    ctx.fillRect(-tile.w * 0.5, -tile.h * 0.5, tile.w, tile.h);
                }

                // Subtle crimson accent (#E3343F)
                if (tile.crimsonAlpha > 0.01) {
                    ctx.fillStyle = `rgba(227, 52, 63, ${(tile.crimsonAlpha * 0.22).toFixed(3)})`;
                    ctx.fillRect(-tile.w * 0.5, -tile.h * 0.5, tile.w, tile.h);
                    ctx.strokeStyle = `rgba(227, 52, 63, ${(tile.crimsonAlpha * 0.6).toFixed(3)})`;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(-tile.w * 0.5, -tile.h * 0.5, tile.w, tile.h);
                }

                ctx.restore();
            }
        }

        ctx.restore();

        if (isHoverActive || hasActiveMotion) {
            rafId = requestAnimationFrame(animate);
        } else {
            rafId = null;
            if (!isHovering) {
                renderPristineRest();
            }
        }
    };

    const wakeUpLoop = () => {
        if (!rafId) {
            rafId = requestAnimationFrame(animate);
        }
    };

    const init = () => {
        if (!buildTileGrid()) {
            setTimeout(init, 80);
            return;
        }

        wrapper.classList.add('canvas-ready');
        renderPristineRest();

        // On touchscreens or reduced motion, retain static illustrated rendering
        if (!hasFinePointer || prefersReducedMotion) {
            return;
        }

        wrapper.addEventListener('pointerenter', (e) => {
            const rect = wrapper.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
            currentMouseX = targetMouseX;
            currentMouseY = targetMouseY;
            lastHoverMoveTime = performance.now();
            isHovering = true;
            wakeUpLoop();
        });

        wrapper.addEventListener('pointermove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
            lastHoverMoveTime = performance.now();
            isHovering = true;
            wakeUpLoop();
        });

        wrapper.addEventListener('pointerleave', () => {
            isHovering = false;
            wakeUpLoop();
        });
    };

    if (img.complete && img.naturalWidth) {
        init();
    } else {
        img.addEventListener('load', init);
    }

    window.addEventListener('resize', () => {
        if (buildTileGrid()) {
            renderPristineRest();
        }
    }, { passive: true });
}

/* ========================================================
   11. EDITORIAL BACKGROUND PIXEL FIELD (Milestone 16.4)
   ======================================================== */
function initBackgroundPixelField() {
    let canvas = document.getElementById('bgPixelCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bgPixelCanvas';
        canvas.className = 'bg-pixel-canvas fixed inset-0 pointer-events-none z-0';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const SPACING = 34; // 34px grid spacing (clean, sparse, unobtrusive)
    const RADIUS = 110; // Proximity radius in CSS px

    let width = 0;
    let height = 0;
    let dpr = 1;
    let points = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let lastPointerTime = 0;
    const POINTER_IDLE_THRESHOLD = 180; // ms: pointer only treated as actively moving for 180ms after event
    let rafId = null;

    const buildGrid = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        points = [];
        const cols = Math.ceil(width / SPACING);
        const rows = Math.ceil(height / SPACING);

        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c <= cols; c++) {
                // Deterministic accent for ~5% of dots in crimson
                const isAccent = ((c * 7 + r * 13) % 23) === 0;
                points.push({
                    x: c * SPACING,
                    y: r * SPACING,
                    isAccent: isAccent,
                    intensity: 0
                });
            }
        }
    };

    const render = () => {
        const now = performance.now();
        const isMoving = (now - lastPointerTime) < POINTER_IDLE_THRESHOLD;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        let hasActivePoints = false;

        for (let i = 0; i < points.length; i++) {
            const pt = points[i];

            if (isMoving) {
                const dx = pt.x - mouseX;
                const dy = pt.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < RADIUS) {
                    const targetIntensity = Math.pow(1 - dist / RADIUS, 1.5);
                    if (targetIntensity > pt.intensity) {
                        pt.intensity = targetIntensity;
                    }
                }
            }

            if (pt.intensity > 0.01) {
                hasActivePoints = true;
                // Decay intensity smoothly
                pt.intensity *= 0.90;

                const baseSize = 1.5;
                const activeSize = baseSize + pt.intensity * 2.0;

                if (pt.isAccent) {
                    ctx.fillStyle = `rgba(227, 52, 63, ${(0.3 + pt.intensity * 0.7).toFixed(3)})`;
                } else {
                    const alpha = (0.25 + pt.intensity * 0.65).toFixed(3);
                    ctx.fillStyle = pt.intensity > 0.4 ? `rgba(245, 245, 242, ${alpha})` : `rgba(133, 133, 133, ${alpha})`;
                }
                ctx.fillRect(pt.x - activeSize * 0.5, pt.y - activeSize * 0.5, activeSize, activeSize);
            } else {
                pt.intensity = 0;
                // Subtle resting dot
                const size = 1.5;
                if (pt.isAccent) {
                    ctx.fillStyle = 'rgba(227, 52, 63, 0.22)';
                } else {
                    ctx.fillStyle = 'rgba(66, 66, 66, 0.35)';
                }
                ctx.fillRect(pt.x - size * 0.5, pt.y - size * 0.5, size, size);
            }
        }

        ctx.restore();

        // Loop continues only while pointer is actively moving or points are still decaying
        if (hasActivePoints || isMoving) {
            rafId = requestAnimationFrame(render);
        } else {
            rafId = null;
        }
    };

    buildGrid();
    render(); // Initial static frame

    if (!hasFinePointer || prefersReducedMotion) {
        // Mobile or reduced motion: static grid, no pointer tracking overhead
        window.addEventListener('resize', () => {
            buildGrid();
            render();
        }, { passive: true });
        return;
    }

    window.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastPointerTime = performance.now();
        if (!rafId) rafId = requestAnimationFrame(render);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        lastPointerTime = 0;
        mouseX = -1000;
        mouseY = -1000;
        if (!rafId) rafId = requestAnimationFrame(render);
    });

    window.addEventListener('resize', () => {
        buildGrid();
        render();
    }, { passive: true });
}
