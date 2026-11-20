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
   10. INTERACTIVE PIXEL PORTRAIT (Milestone 16.4)
   ======================================================== */
function initPixelPortrait() {
    const wrapper = document.getElementById('portraitPixelWrapper');
    const img = document.getElementById('portraitImg');
    const canvas = document.getElementById('portraitPixelCanvas');
    if (!wrapper || !img || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const CELL_SIZE = 11; // 11 CSS px cells (well within 8-14px guideline)
    const LENS_RADIUS = 85; // Proximity reveal radius in CSS px
    const CORE_RADIUS = 42; // Fully clear reveal core in CSS px

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;

    let pixelColors = null; // Array of {r, g, b, a}
    let isHovering = false;
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let lensStrength = 0; // 0 = full pixel mosaic, 1 = active lens
    let rafId = null;

    const sampleImage = () => {
        width = wrapper.clientWidth;
        height = wrapper.clientHeight;
        if (!width || !height || !img.naturalWidth) return false;

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        cols = Math.ceil(width / CELL_SIZE);
        rows = Math.ceil(height / CELL_SIZE);

        const offCanvas = document.createElement('canvas');
        offCanvas.width = cols;
        offCanvas.height = rows;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
        if (!offCtx) return false;

        // Draw source image scaled down to grid dimensions
        offCtx.drawImage(img, 0, 0, cols, rows);
        const imgData = offCtx.getImageData(0, 0, cols, rows).data;

        pixelColors = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = (r * cols + c) * 4;
                pixelColors.push({
                    r: imgData[idx],
                    g: imgData[idx + 1],
                    b: imgData[idx + 2],
                    a: imgData[idx + 3] / 255
                });
            }
        }
        return true;
    };

    const drawFrame = () => {
        if (!pixelColors || !cols || !rows) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        // Smooth mouse position lerping
        mouseX += (targetMouseX - mouseX) * 0.22;
        mouseY += (targetMouseY - mouseY) * 0.22;

        // Smooth lens strength transition
        const targetStrength = isHovering ? 1 : 0;
        lensStrength += (targetStrength - lensStrength) * 0.18;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const p = pixelColors[r * cols + c];
                if (!p || p.a === 0) continue;

                const cellX = c * CELL_SIZE;
                const cellY = r * CELL_SIZE;
                const centerX = cellX + CELL_SIZE * 0.5;
                const centerY = cellY + CELL_SIZE * 0.5;

                let alpha = 1.0;
                let brightnessShift = 0;

                if (lensStrength > 0.01) {
                    const dx = centerX - mouseX;
                    const dy = centerY - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < LENS_RADIUS) {
                        const localT = (dist - CORE_RADIUS) / (LENS_RADIUS - CORE_RADIUS);
                        const clampedT = Math.max(0, Math.min(1, localT));
                        // Reveal underlying photo by fading mosaic alpha to 0 in core
                        alpha = 1.0 - (1.0 - clampedT) * lensStrength;
                        // Slight brighten edge response for physical pixel sensation
                        if (dist >= CORE_RADIUS && dist <= LENS_RADIUS) {
                            brightnessShift = (1 - Math.abs(clampedT - 0.5) * 2) * 25 * lensStrength;
                        }
                    }
                }

                if (alpha > 0.02) {
                    const red = Math.min(255, Math.max(0, Math.round(p.r + brightnessShift)));
                    const green = Math.min(255, Math.max(0, Math.round(p.g + brightnessShift)));
                    const blue = Math.min(255, Math.max(0, Math.round(p.b + brightnessShift)));

                    ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(3)})`;
                    ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
                }
            }
        }

        ctx.restore();

        // Continue animation while hovering or smoothly restoring to resting mosaic
        const needsMoreFrames = isHovering || lensStrength > 0.005 || Math.abs(targetMouseX - mouseX) > 0.5;
        if (needsMoreFrames) {
            rafId = requestAnimationFrame(drawFrame);
        } else {
            rafId = null;
            renderRestingMosaic();
        }
    };

    const renderRestingMosaic = () => {
        if (!pixelColors || !cols || !rows) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const p = pixelColors[r * cols + c];
                if (!p || p.a === 0) continue;
                ctx.fillStyle = `rgb(${p.r}, ${p.g}, ${p.b})`;
                ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
        ctx.restore();
    };

    const init = () => {
        if (!sampleImage()) {
            setTimeout(init, 80);
            return;
        }

        // On mobile or reduced motion: show a very subtle static mosaic or clear photo
        if (!hasFinePointer || prefersReducedMotion) {
            canvas.style.opacity = '0.2';
            renderRestingMosaic();
            return;
        }

        renderRestingMosaic();

        wrapper.addEventListener('pointerenter', (e) => {
            const rect = wrapper.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
            mouseX = targetMouseX;
            mouseY = targetMouseY;
            isHovering = true;
            if (!rafId) rafId = requestAnimationFrame(drawFrame);
        });

        wrapper.addEventListener('pointermove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
            isHovering = true;
            if (!rafId) rafId = requestAnimationFrame(drawFrame);
        });

        wrapper.addEventListener('pointerleave', () => {
            isHovering = false;
            if (!rafId) rafId = requestAnimationFrame(drawFrame);
        });
    };

    if (img.complete && img.naturalWidth) {
        init();
    } else {
        img.addEventListener('load', init);
    }

    window.addEventListener('resize', () => {
        if (sampleImage()) renderRestingMosaic();
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
    let isPointerActive = false;
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        let hasActivePoints = false;

        for (let i = 0; i < points.length; i++) {
            const pt = points[i];

            if (isPointerActive) {
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
                pt.intensity *= 0.92;

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

        if (hasActivePoints || isPointerActive) {
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
        isPointerActive = true;
        if (!rafId) rafId = requestAnimationFrame(render);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        isPointerActive = false;
        mouseX = -1000;
        mouseY = -1000;
        if (!rafId) rafId = requestAnimationFrame(render);
    });

    window.addEventListener('resize', () => {
        buildGrid();
        render();
    }, { passive: true });
}
