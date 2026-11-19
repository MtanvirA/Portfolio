/**
 * Tanvir Anjum Portfolio - Production Static Site Interactions
 * Implements Navigation, Netlify Form enhancements, Project Filtering, Return-to-Top,
 * and the "Engineering Canvas" ambient spotlight & circuit node proximity tracker.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    initAriaValidationSync();
    initEngineeringCanvas();
});

/* ========================================================
   1. NAVIGATION & MOBILE MENU
   ======================================================== */
function initNavigation() {
    const header = document.getElementById('mainHeader');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');

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

    // Scrollspy for active navigation items on home
    const sections = document.querySelectorAll('section[id]');
    if (sections.length && navLinks.length) {
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
   3. NETLIFY FORM CLIENT-SIDE ENHANCEMENT
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
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
            e.preventDefault();
            form.reportValidity();
            return;
        }

        // Check honeypot field
        const honeypot = form.querySelector('input[name="bot-field"]');
        if (honeypot && honeypot.value.trim() !== '') {
            e.preventDefault();
            window.location.href = '/thank-you/';
            return;
        }

        // Show UI submitting feedback while submitting to action="/thank-you/"
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Submitting message...';
        if (btnSpinner) btnSpinner.classList.remove('hidden');
    });
}

/* ========================================================
   4. RETURN TO TOP BUTTON
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
   5. ENGINEERING CANVAS: SPOTLIGHT & CIRCUIT PROXIMITY
   ======================================================== */
function initEngineeringCanvas() {
    // Only activate fine pointer-tracking on devices that support hover pointer and no reduced motion
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
        // Mobile or touchscreens: leave static restrained background; do not attach listeners
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

            // Check proximity to circuit nodes
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
                    node.classList.add('active');
                } else {
                    node.classList.remove('active');
                }
            });

            // Check proximity to circuit traces
            traces.forEach(trace => {
                const traceRect = trace.getBoundingClientRect();
                const traceCenterX = traceRect.left + traceRect.width / 2;
                const traceCenterY = traceRect.top + traceRect.height / 2;

                const dx = lastEvent.clientX - traceCenterX;
                const dy = lastEvent.clientY - traceCenterY;
                const distSq = dx * dx + dy * dy;

                if (distSq < thresholdSq * 1.4) {
                    trace.classList.add('active');
                } else {
                    trace.classList.remove('active');
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
            nodes.forEach(n => n.classList.remove('active'));
            traces.forEach(t => t.classList.remove('active'));
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        });
    });
}
