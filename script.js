/**
 * EpicNoob22 — Cybersecurity Portfolio
 * script.js — Premium interactions & animations
 */

(function () {
  'use strict';

  /* ============================================================
     UTILITIES
  ============================================================ */

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function throttle(fn, limit) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= limit) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

  function debounce(fn, delay) {
    var timer;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  /* ============================================================
     1. PRELOADER
  ============================================================ */

  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Hide after animation completes (letters + subtitle = ~1.8s, add extra)
    setTimeout(function () {
      preloader.classList.add('hidden');
      setTimeout(function () {
        preloader.style.display = 'none';
        preloader.setAttribute('aria-hidden', 'true');
      }, 800);
    }, 2000);
  }

  /* ============================================================
     2. CUSTOM CURSOR
  ============================================================ */

  function initCursor() {
    // Only on pointer devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;
    var isVisible = false;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '0.7';
      }
      dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px) translate(-50%, -50%)';
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      isVisible = false;
    });

    document.addEventListener('mouseenter', function () {
      if (isVisible) {
        dot.style.opacity = '1';
        ring.style.opacity = '0.7';
      }
    });

    // Smooth ring follow
    function animateRing() {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states
    var hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .filter-btn, .nav-link, .tag');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', function () {
        ring.classList.remove('hover');
      });
    });

    // Text hover
    var textEls = document.querySelectorAll('p, li, span, .about-paragraphs, .project-desc, .timeline-desc');
    textEls.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.classList.add('text-hover');
      });
      el.addEventListener('mouseleave', function () {
        ring.classList.remove('text-hover');
      });
    });
  }

  /* ============================================================
     3. SCROLL PROGRESS
  ============================================================ */

  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function update() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', throttle(update, 16), { passive: true });
    update();
  }

  /* ============================================================
     4. NAVBAR
  ============================================================ */

  function initNavbar() {
    var navbar = document.getElementById('navbar');
    var hamburger = document.getElementById('navHamburger');
    var navLinks = document.getElementById('navLinks');
    if (!navbar) return;

    // Scrolled state
    function updateNavbar() {
      if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', throttle(updateNavbar, 100), { passive: true });
    updateNavbar();

    // Hamburger toggle
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close on link click
      navLinks.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    // Active link tracking via IntersectionObserver
    var sections = document.querySelectorAll('section[id]');
    var navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

    if (sections.length && navLinkEls.length) {
      var activeSection = '';

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
            navLinkEls.forEach(function (link) {
              var href = link.getAttribute('href');
              if (href === '#' + activeSection) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

      sections.forEach(function (s) { observer.observe(s); });
    }
  }

  /* ============================================================
     5. SCROLL REVEAL
  ============================================================ */

  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseFloat(entry.target.style.getPropertyValue('--delay') || '0');
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay * 1000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     6. COUNTER ANIMATIONS
  ============================================================ */

  function formatNumber(n) {
    if (n >= 1000) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
    }
    return String(n);
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var numEl = el.querySelector('.stat-number');
    if (!numEl || isNaN(target)) return;

    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(target * eased);
      numEl.textContent = formatNumber(current) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        numEl.textContent = formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var statCards = document.querySelectorAll('[data-count]');
    if (!statCards.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statCards.forEach(function (card) { observer.observe(card); });
  }

  /* ============================================================
     7. PROGRESS BARS
  ============================================================ */

  function initProgressBars() {
    var bars = document.querySelectorAll('.skill-progress-bar, .ctf-progress-bar');
    if (!bars.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var target = bar.style.getPropertyValue('--target') || '0%';
          setTimeout(function () {
            bar.style.width = target;
          }, 200);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) { observer.observe(bar); });
  }

  /* ============================================================
     8. PROJECTS FILTER
  ============================================================ */

  function initProjectsFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        // Update active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Filter cards
        projectCards.forEach(function (card) {
          if (filter === 'all') {
            card.classList.remove('hidden-filter');
            return;
          }
          var category = card.getAttribute('data-category');
          if (category === filter) {
            card.classList.remove('hidden-filter');
          } else {
            card.classList.add('hidden-filter');
          }
        });
      });
    });
  }

  /* ============================================================
     9. MAGNETIC BUTTONS
  ============================================================ */

  function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var btns = document.querySelectorAll('[data-magnetic]');
    btns.forEach(function (btn) {
      var rect, centerX, centerY;
      var radius = 60;

      btn.addEventListener('mouseenter', function () {
        rect = btn.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      });

      btn.addEventListener('mousemove', function (e) {
        rect = btn.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        var dx = e.clientX - centerX;
        var dy = e.clientY - centerY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          var strength = (radius - dist) / radius;
          var moveX = dx * strength * 0.4;
          var moveY = dy * strength * 0.4;
          btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px) translateY(-2px)';
        }
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(function () {
          btn.style.transition = '';
        }, 500);
      });
    });
  }

  /* ============================================================
     10. BACK TO TOP
  ============================================================ */

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    function update() {
      if (window.pageYOffset > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', throttle(update, 200), { passive: true });
    update();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     10b. THEME TOGGLE
  ============================================================ */

  function initThemeToggle() {
    var toggle = document.getElementById('themeToggle');
    var icon = document.getElementById('themeIcon');
    if (!toggle || !icon) return;

    var savedTheme = localStorage.getItem('epicnoob22-theme') || 'dark';
    applyTheme(savedTheme);

    function applyTheme(theme) {
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.className = 'fas fa-sun';
      } else {
        document.documentElement.removeAttribute('data-theme');
        icon.className = 'fas fa-moon';
      }
      localStorage.setItem('epicnoob22-theme', theme);
    }

    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ============================================================
     10c. LANGUAGE SWITCHER
  ============================================================ */

  function initLangToggle() {
    var toggle = document.getElementById('langToggle');
    var label = toggle ? toggle.querySelector('.lang-label') : null;
    if (!toggle || !label) return;

    var translations = {
      en: {
        nav_about: 'About',
        nav_journey: 'Journey',
        nav_skills: 'Skills',
        nav_projects: 'Projects',
        nav_certs: 'Certifications',
        hero_eyebrow: 'Portfolio 2026 \u00a0\u00b7\u00a0 Cybersecurity Specialist',
        hero_desc: 'Passionate about offensive and defensive security, I build tools, break systems (ethically), and protect infrastructures. Currently seeking an apprenticeship.',
        hero_badge: 'Available for apprenticeship \u2014 Sept. 2026',
        hero_cta_projects: 'Discover my projects',
        hero_cta_contact: 'Contact me',
        hero_scroll: 'Scroll',
        about_eyebrow: 'Who am I?',
        about_title: 'About',
        about_subtitle: 'Who\u2019s behind the username?',
        stat_ctf: 'CTFs solved',
        stat_certs: 'Certifications',
        stat_projects: 'Projects',
        stat_hours: 'Lab hours',
        journey_eyebrow: 'My story',
        journey_title: 'My Journey',
        skills_eyebrow: 'Expertise',
        skills_title: 'Skills',
        projects_eyebrow: 'Achievements',
        projects_title: 'Projects',
        projects_subtitle: 'A selection of my cybersecurity achievements',
        filter_all: 'All',
        filter_offensive: 'Offensive',
        filter_defensive: 'Defensive',
        filter_tools: 'Tools',
        filter_labs: 'Labs',
        certs_eyebrow: 'Official validations',
        certs_title: 'Certifications',
        ctf_eyebrow: 'Competitions',
        ctf_writeups_title: 'Latest Writeups',
        blog_eyebrow: 'Knowledge sharing',
        blog_title: 'Articles & Writeups',
        contact_eyebrow: 'Get in touch',
        contact_cta_title: 'Let\u2019s work together',
        contact_cta_text: 'Available for a cybersecurity apprenticeship starting September 2026. I\u2019m open to any collaboration, internship, or project opportunity.',
      },
      fr: {
        nav_about: '\u00c0 propos',
        nav_journey: 'Parcours',
        nav_skills: 'Comp\u00e9tences',
        nav_projects: 'Projets',
        nav_certs: 'Certifications',
        hero_eyebrow: 'Portfolio 2026 \u00a0\u00b7\u00a0 Cybersecurity Specialist',
        hero_desc: 'Passionn\u00e9 par la s\u00e9curit\u00e9 offensive et d\u00e9fensive, je construis des outils, je casse des syst\u00e8mes (\u00e9thiquement), et je prot\u00e8ge les infrastructures. Actuellement en recherche d\u2019alternance.',
        hero_badge: 'Disponible pour alternance \u2014 Sept. 2026',
        hero_cta_projects: 'D\u00e9couvrir mes projets',
        hero_cta_contact: 'Me contacter',
        hero_scroll: 'Scroll',
        about_eyebrow: 'Qui suis-je ?',
        about_title: '\u00c0 propos',
        about_subtitle: 'Qui se cache derri\u00e8re le pseudo\u00a0?',
        stat_ctf: 'CTF r\u00e9solus',
        stat_certs: 'Certifications',
        stat_projects: 'Projets',
        stat_hours: 'Heures de lab',
        journey_eyebrow: 'Mon histoire',
        journey_title: 'Mon Parcours',
        skills_eyebrow: 'Expertise',
        skills_title: 'Comp\u00e9tences',
        projects_eyebrow: 'R\u00e9alisations',
        projects_title: 'Projets',
        projects_subtitle: 'Une s\u00e9lection de mes r\u00e9alisations en cybers\u00e9curit\u00e9',
        filter_all: 'Tous',
        filter_offensive: 'Offensif',
        filter_defensive: 'D\u00e9fensif',
        filter_tools: 'Outils',
        filter_labs: 'Labs',
        certs_eyebrow: 'Validations officielles',
        certs_title: 'Certifications',
        ctf_eyebrow: 'Comp\u00e9titions',
        ctf_writeups_title: 'Derniers Writeups',
        blog_eyebrow: 'Partage de connaissances',
        blog_title: 'Articles & Writeups',
        contact_eyebrow: 'Entrons en contact',
        contact_cta_title: 'Travaillons ensemble',
        contact_cta_text: 'Disponible pour une alternance en cybers\u00e9curit\u00e9 \u00e0 partir de septembre 2026. Je suis ouvert \u00e0 toute opportunit\u00e9 de collaboration, de stage ou de projet.',
      }
    };

    var currentLang = localStorage.getItem('epicnoob22-lang') || 'fr';
    applyLang(currentLang);

    function applyLang(lang) {
      currentLang = lang;
      label.textContent = lang.toUpperCase();
      toggle.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en fran\u00e7ais');
      document.documentElement.setAttribute('lang', lang);
      localStorage.setItem('epicnoob22-lang', lang);

      var dict = translations[lang];
      if (!dict) return;

      var elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
          el.textContent = dict[key];
        }
      });
    }

    toggle.addEventListener('click', function () {
      applyLang(currentLang === 'fr' ? 'en' : 'fr');
    });
  }

  /* ============================================================
     10d. KEYBOARD SHORTCUTS
  ============================================================ */

  function initKeyboardShortcuts() {
    var modal = document.getElementById('shortcutsModal');
    var closeBtn = document.getElementById('shortcutsClose');
    if (!modal) return;

    var sectionKeys = {
      '1': '#home',
      '2': '#about',
      '3': '#journey',
      '4': '#skills',
      '5': '#projects',
      '6': '#certifications',
      '7': '#ctf',
      '8': '#blog',
      '9': '#contact'
    };

    function openShortcuts() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeShortcuts() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeShortcuts);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeShortcuts();
    });

    document.addEventListener('keydown', function (e) {
      var tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      var isInput = (tag === 'input' || tag === 'textarea' || tag === 'select');
      var terminalModal = document.getElementById('terminalModal');
      var isTerminalOpen = terminalModal && terminalModal.classList.contains('open');

      // Esc closes shortcuts
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        e.preventDefault();
        closeShortcuts();
        return;
      }

      // Don't handle shortcuts when typing in inputs or terminal
      if (isInput || isTerminalOpen) return;

      // ? = toggle shortcuts panel
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        if (modal.classList.contains('open')) {
          closeShortcuts();
        } else {
          openShortcuts();
        }
        return;
      }

      // Ignore if any modifier key is pressed (except for Ctrl+`)
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // T = toggle theme
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        var themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.click();
        return;
      }

      // L = toggle language
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        var langToggle = document.getElementById('langToggle');
        if (langToggle) langToggle.click();
        return;
      }

      // ArrowUp = scroll to top (when nothing focused)
      if (e.key === 'ArrowUp' && !isInput) {
        // Only if shortcuts panel is not open
        if (!modal.classList.contains('open')) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      // Number keys for section navigation
      if (sectionKeys[e.key]) {
        e.preventDefault();
        var target = document.querySelector(sectionKeys[e.key]);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
    });
  }

  /* ============================================================
     11. CONTACT FORM
  ============================================================ */

  function showToast(message, type) {
    var toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'toast ' + (type || '');
    toast.classList.add('show');

    setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var nameInput = document.getElementById('contactName');
    var emailInput = document.getElementById('contactEmail');
    var subjectInput = document.getElementById('contactSubject');
    var messageInput = document.getElementById('contactMessage');
    var nameError = document.getElementById('nameError');
    var emailError = document.getElementById('emailError');
    var subjectError = document.getElementById('subjectError');
    var messageError = document.getElementById('messageError');

    function clearError(input, errorEl) {
      if (input) input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    }

    function setError(input, errorEl, message) {
      if (input) input.classList.add('error');
      if (errorEl) errorEl.textContent = message;
      return false;
    }

    // Live validation
    if (nameInput) nameInput.addEventListener('input', function () { clearError(nameInput, nameError); });
    if (emailInput) emailInput.addEventListener('input', function () { clearError(emailInput, emailError); });
    if (subjectInput) subjectInput.addEventListener('change', function () { clearError(subjectInput, subjectError); });
    if (messageInput) messageInput.addEventListener('input', function () { clearError(messageInput, messageError); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;

      // Name
      if (!nameInput || !nameInput.value.trim()) {
        setError(nameInput, nameError, 'Veuillez entrer votre nom.');
        valid = false;
      } else if (nameInput.value.trim().length < 2) {
        setError(nameInput, nameError, 'Le nom doit contenir au moins 2 caractères.');
        valid = false;
      }

      // Email
      if (!emailInput || !emailInput.value.trim()) {
        setError(emailInput, emailError, 'Veuillez entrer votre email.');
        valid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        setError(emailInput, emailError, 'Veuillez entrer un email valide.');
        valid = false;
      }

      // Subject
      if (!subjectInput || !subjectInput.value) {
        setError(subjectInput, subjectError, 'Veuillez choisir un sujet.');
        valid = false;
      }

      // Message
      if (!messageInput || !messageInput.value.trim()) {
        setError(messageInput, messageError, 'Veuillez entrer votre message.');
        valid = false;
      } else if (messageInput.value.trim().length < 10) {
        setError(messageInput, messageError, 'Le message doit contenir au moins 10 caractères.');
        valid = false;
      }

      if (!valid) return;

      // Submit form via FormSubmit.co
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.querySelector('span').textContent : 'Envoyer';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Envoi en cours…';
      }

      var honeyField = form.querySelector('input[name="_honey"]');
      var formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value,
        message: messageInput.value.trim(),
        _honey: honeyField ? honeyField.value : '',
        _subject: 'Portfolio — ' + (subjectInput.value || 'Nouveau message'),
        _template: 'table'
      };

      fetch('https://formsubmit.co/ajax/rayan.riri78@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.success) {
          showToast('✅ Message envoyé ! Je vous répondrai très vite.', 'success');
          form.reset();
        } else {
          showToast('❌ Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        }
      })
      .catch(function () {
        showToast('❌ Erreur réseau. Vérifiez votre connexion et réessayez.', 'error');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = originalText;
        }
      });
    });
  }

  /* ============================================================
     12. TERMINAL
  ============================================================ */

  function initTerminal() {
    var trigger = document.getElementById('terminalTrigger');
    var modal = document.getElementById('terminalModal');
    var closeBtn = document.getElementById('terminalClose');
    var body = document.getElementById('terminalBody');
    var input = document.getElementById('terminalInput');

    if (!trigger || !modal || !body || !input) return;

    var commandHistory = [];
    var historyIndex = -1;
    var themeGlow = false;

    // Open/close
    function openTerminal() {
      modal.classList.add('open');
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-hidden', 'false');
      input.focus();
    }

    function closeTerminal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }

    trigger.addEventListener('click', function () {
      if (modal.classList.contains('open')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeTerminal();
    });

    // Keyboard shortcut Ctrl+`
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        if (modal.classList.contains('open')) {
          closeTerminal();
        } else {
          openTerminal();
        }
      }
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeTerminal();
      }
    });

    // Terminal commands
    var COMMANDS = {
      help: function () {
        return [
          { text: '\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510', cls: 'accent' },
          { text: '\u2502  Commandes disponibles                          \u2502', cls: 'accent' },
          { text: '\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518', cls: 'accent' },
          { text: '  about        \u2192 Pr\u00e9sentation d\'EpicNoob22', cls: '' },
          { text: '  skills       \u2192 Comp\u00e9tences avec barres ASCII', cls: '' },
          { text: '  projects     \u2192 Liste des 8 projets', cls: '' },
          { text: '  certs        \u2192 Certifications obtenues', cls: '' },
          { text: '  ctf          \u2192 Statistiques CTF', cls: '' },
          { text: '  blog         \u2192 Articles publi\u00e9s', cls: '' },
          { text: '  contact      \u2192 Informations de contact', cls: '' },
          { text: '  socials      \u2192 Tous les liens sociaux', cls: '' },
          { text: '  whoami       \u2192 Identit\u00e9', cls: '' },
          { text: '  date         \u2192 Date et heure actuelles', cls: '' },
          { text: '  history      \u2192 Historique des commandes', cls: '' },
          { text: '  theme        \u2192 Toggle glow effect', cls: '' },
          { text: '  goto [sect]  \u2192 Naviguer vers une section', cls: '' },
          { text: '  echo [text]  \u2192 Afficher du texte', cls: '' },
          { text: '  fortune      \u2192 Citation cybers\u00e9curit\u00e9 al\u00e9atoire', cls: '' },
          { text: '  ascii        \u2192 ASCII art EpicNoob22', cls: '' },
          { text: '  secret       \u2192 \ud83e\udd2b', cls: '' },
          { text: '  clear        \u2192 Effacer le terminal', cls: '' },
          { text: '  exit         \u2192 Fermer le terminal', cls: '' },
        ];
      },
      about: function () {
        return [
          { text: '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557', cls: 'accent' },
          { text: '\u2551        EpicNoob22 \u2014 About        \u2551', cls: 'accent' },
          { text: '\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  Nom       : EpicNoob22', cls: '' },
          { text: '  R\u00f4le      : Apprenti en Cybers\u00e9curit\u00e9', cls: '' },
          { text: '  Sp\u00e9cia.   : Red Team & Blue Team', cls: '' },
          { text: '  Dispo.    : Alternance \u2014 Sept. 2026', cls: 'success' },
          { text: '  Lieu      : France (Remote & Pr\u00e9sentiel)', cls: '' },
          { text: '', cls: '' },
          { text: '  Passionn\u00e9 de cybers\u00e9curit\u00e9 depuis 2020.', cls: '' },
          { text: '  CTF, pentesting, homelab SOC \u2014 c\'est ma vie.', cls: '' },
        ];
      },
      whoami: function () {
        return [
          { text: 'EpicNoob22 \u2014 Cybersecurity Apprentice', cls: 'cyan' },
          { text: 'Red Team \u00b7 Blue Team \u00b7 Ethical Hacker', cls: '' },
          { text: 'uid=1337(epicnoob22) gid=1337(hackers)', cls: 'accent' },
        ];
      },
      skills: function () {
        return [
          { text: '  Comp\u00e9tences \u2014 EpicNoob22', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  S\u00e9curit\u00e9 Offensive  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591] 78%', cls: '' },
          { text: '  S\u00e9curit\u00e9 D\u00e9fensive  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591] 72%', cls: '' },
          { text: '  R\u00e9seau & Infra      [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591] 82%', cls: '' },
          { text: '  Outils & Tech       [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591] 85%', cls: '' },
          { text: '  Scripting & Dev     [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591] 73%', cls: '' },
          { text: '  Syst\u00e8mes & Cloud    [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591] 77%', cls: '' },
          { text: '', cls: '' },
          { text: '  Outils : Kali \u00b7 Burp Suite \u00b7 Wireshark \u00b7 Nmap', cls: '' },
          { text: '           Metasploit \u00b7 Ghidra \u00b7 BloodHound \u00b7 ELK', cls: '' },
        ];
      },
      projects: function () {
        return [
          { text: '  Projets \u2014 EpicNoob22', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  1. \ud83c\udfe0  HomeLab SOC          [D\u00e9fensif]', cls: '' },
          { text: '         ELK Stack \u00b7 Wazuh \u00b7 Suricata \u00b7 Docker', cls: '' },
          { text: '', cls: '' },
          { text: '  2. \ud83d\udd0d  VulnScanner Pro       [Offensif]', cls: '' },
          { text: '         Python \u00b7 OWASP \u00b7 Automation \u00b7 ReportLab', cls: '' },
          { text: '', cls: '' },
          { text: '  3. \ud83d\udd10  Active Directory Lab   [Labs]', cls: '' },
          { text: '         BloodHound \u00b7 Mimikatz \u00b7 Proxmox', cls: '' },
          { text: '', cls: '' },
          { text: '  4. \ud83e\uddec  Malware Analysis Sandbox [D\u00e9fensif]', cls: '' },
          { text: '         Ghidra \u00b7 REMnux \u00b7 YARA \u00b7 Volatility 3', cls: '' },
          { text: '', cls: '' },
          { text: '  5. \ud83c\udfa3  PhishGuard            [Outils]', cls: '' },
          { text: '         GoPhish \u00b7 Flask \u00b7 PostgreSQL \u00b7 Docker', cls: '' },
          { text: '', cls: '' },
          { text: '  6. \ud83e\udd16  AutoRecon Bot          [Offensif]', cls: '' },
          { text: '         Bash \u00b7 Python \u00b7 Nmap \u00b7 OSINT', cls: '' },
          { text: '', cls: '' },
          { text: '  7. \ud83c\udf10  Honeypot Network        [D\u00e9fensif]', cls: '' },
          { text: '         Cowrie \u00b7 Dionaea \u00b7 ELK Stack', cls: '' },
          { text: '', cls: '' },
          { text: '  8. \ud83d\udd11  CryptoVault            [Outils]', cls: '' },
          { text: '         Python \u00b7 AES-256-GCM \u00b7 SQLite \u00b7 HIBP', cls: '' },
        ];
      },
      certs: function () {
        return [
          { text: '  Certifications \u2014 EpicNoob22', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  \u2705  CompTIA Security+ (SY0-701) \u2014 812/900 \u2014 2025', cls: 'success' },
          { text: '  \u2705  eJPT \u2014 INE Security \u2014 2025', cls: 'success' },
          { text: '  \u2705  Google Cybersecurity Certificate \u2014 2024', cls: 'success' },
          { text: '  \u2705  Advent of Cyber 2025 \u2014 TryHackMe \u2014 2025', cls: 'success' },
        ];
      },
      ctf: function () {
        return [
          { text: '  CTF Stats \u2014 EpicNoob22', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  \ud83d\udfe9  HackTheBox   : Hacker \u2014 Top 10% \u2014 25+ machines', cls: '' },
          { text: '  \ud83d\udfe6  TryHackMe    : 0x8 [Hacker] \u2014 Top 5% \u2014 80+ rooms', cls: 'cyan' },
          { text: '  \ud83d\udfe5  Root-Me      : Avanc\u00e9 \u2014 150+ challenges', cls: '' },
          { text: '', cls: '' },
          { text: '  Total : 50+ CTF r\u00e9solus sur 3 plateformes', cls: 'success' },
        ];
      },
      contact: function () {
        return [
          { text: '  Contact \u2014 EpicNoob22', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  \ud83d\udce7  epicnoob22@proton.me', cls: '' },
          { text: '  \ud83d\udc19  github.com/EpicNoob22', cls: '' },
          { text: '  \ud83d\udcbc  linkedin.com/in/EpicNoob22', cls: '' },
          { text: '  \ud83d\udea9  tryhackme.com/p/EpicNoob22', cls: '' },
          { text: '  \ud83d\udce6  app.hackthebox.com/EpicNoob22', cls: '' },
          { text: '  \ud83c\udf10  root-me.org/EpicNoob22', cls: '' },
          { text: '', cls: '' },
          { text: '  \ud83d\udccd  France \u2014 Remote & Pr\u00e9sentiel', cls: '' },
          { text: '  \ud83d\udfe2  Disponible \u2014 Alternance Sept. 2026', cls: 'success' },
        ];
      },
      socials: function () {
        return [
          { text: '  Liens sociaux \u2014 EpicNoob22', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  GitHub     \u2192 https://github.com/EpicNoob22', cls: '' },
          { text: '  LinkedIn   \u2192 https://linkedin.com/in/EpicNoob22', cls: '' },
          { text: '  TryHackMe  \u2192 https://tryhackme.com/p/EpicNoob22', cls: '' },
          { text: '  HackTheBox \u2192 https://app.hackthebox.com/profile/EpicNoob22', cls: '' },
          { text: '  Root-Me    \u2192 https://www.root-me.org/EpicNoob22', cls: '' },
          { text: '  Email      \u2192 epicnoob22@proton.me', cls: '' },
        ];
      },
      blog: function () {
        return [
          { text: '  Articles \u2014 EpicNoob22', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  1. \ud83c\udfe0 Comment j\'ai mont\u00e9 mon HomeLab SOC pour <100\u20ac', cls: '' },
          { text: '        12 Mars 2026 \u00b7 12 min \u00b7 HomeLab \u00b7 SOC \u00b7 Tutorial', cls: '' },
          { text: '', cls: '' },
          { text: '  2. \ud83c\udf10 Les 10 vuln\u00e9rabilit\u00e9s web les plus critiques en 2026', cls: '' },
          { text: '        28 F\u00e9v 2026 \u00b7 15 min \u00b7 OWASP \u00b7 Web Security', cls: '' },
          { text: '', cls: '' },
          { text: '  3. \ud83c\udff0 Active Directory : du d\u00e9butant au pentester', cls: '' },
          { text: '        15 Jan 2026 \u00b7 20 min \u00b7 AD \u00b7 Pentesting \u00b7 Red Team', cls: '' },
          { text: '', cls: '' },
          { text: '  4. \ud83d\udea9 Mon setup CTF : outils, m\u00e9thodo et tips', cls: '' },
          { text: '        1 D\u00e9c 2025 \u00b7 8 min \u00b7 CTF \u00b7 Tools \u00b7 Methodology', cls: '' },
        ];
      },
      date: function () {
        var now = new Date();
        return [
          { text: now.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'medium' }), cls: 'cyan' },
        ];
      },
      history: function () {
        if (!commandHistory.length) {
          return [{ text: '  Aucune commande dans l\'historique.', cls: '' }];
        }
        return commandHistory.map(function (cmd, i) {
          return { text: '  ' + (i + 1) + '  ' + cmd, cls: '' };
        });
      },
      theme: function () {
        themeGlow = !themeGlow;
        var termWin = document.querySelector('.terminal-window');
        if (termWin) {
          if (themeGlow) {
            termWin.style.boxShadow = '0 0 40px rgba(129, 140, 248, 0.3), 0 0 80px rgba(34, 211, 238, 0.1)';
          } else {
            termWin.style.boxShadow = '';
          }
        }
        return [{ text: 'Glow effect ' + (themeGlow ? 'activ\u00e9 \u2728' : 'd\u00e9sactiv\u00e9'), cls: themeGlow ? 'accent' : '' }];
      },
      clear: function () {
        body.innerHTML = '';
        return null;
      },
      exit: function () {
        setTimeout(closeTerminal, 300);
        return [{ text: 'Au revoir ! \ud83d\udc4b', cls: 'success' }];
      },
      secret: function () {
        return [
          { text: '  \ud83d\udd10 Acc\u00e8s restreint d\u00e9verrouill\u00e9...', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  Flag: CTF{y0u_f0und_th3_s3cr3t_t3rm1n4l}', cls: 'success' },
          { text: '', cls: '' },
          { text: '  F\u00e9licitations, hacker \ud83d\udc40', cls: 'cyan' },
        ];
      },
      fortune: function () {
        var quotes = [
          '"The only truly secure system is one that is powered off, cast in a block of concrete and sealed in a lead-lined room." \u2014 Gene Spafford',
          '"Security is not a product, but a process." \u2014 Bruce Schneier',
          '"Hackers are breaking the systems for profit. Before, it was about intellectual curiosity and the pursuit of knowledge." \u2014 Kevin Mitnick',
          '"In security, there\'s no such thing as too much paranoia." \u2014 Anonymous',
          '"The internet is a dangerous place. Trust no one, verify everything." \u2014 Zero Trust Principle',
          '"A hacker doesn\'t break through security; they walk through the door you left open." \u2014 Anonymous',
          '"The best way to predict the future is to create it." \u2014 Alan Kay',
          '"To know your enemy, you must become your enemy." \u2014 Sun Tzu',
          '"Offense informs defense. Build red team skills to be a better blue teamer." \u2014 Anonymous',
          '"There are only two types of companies: those that have been hacked, and those that don\'t know it yet." \u2014 John Chambers',
          '"Security without privacy is not security at all." \u2014 EFF',
          '"The quieter you become, the more you can hear." \u2014 Kali Linux motto',
        ];
        var quote = quotes[Math.floor(Math.random() * quotes.length)];
        return [{ text: quote, cls: 'cyan' }];
      },
      ascii: function () {
        return [
          { text: ' \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2563\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557', cls: 'accent' },
          { text: ' \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d', cls: 'accent' },
          { text: ' \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2551\u2588\u2588\u2551     ', cls: 'accent' },
          { text: ' \u2588\u2588\u2554\u2550\u2550\u255d  \u2588\u2588\u2554\u2550\u2550\u2550\u255d \u2588\u2588\u2551\u2588\u2588\u2551     ', cls: 'accent' },
          { text: ' \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551     \u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2557', cls: 'accent' },
          { text: ' \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d\u255a\u2550\u255d     \u255a\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u255d', cls: 'accent' },
          { text: '', cls: '' },
          { text: ' \u2588\u2588\u2588\u2557   \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557', cls: 'cyan' },
          { text: ' \u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u255a\u2550\u2550\u2550\u2550\u2588\u2588\u2557\u255a\u2550\u2550\u2550\u2550\u2588\u2588\u2557', cls: 'cyan' },
          { text: ' \u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2588\u2588\u2588\u2554\u255d', cls: 'cyan' },
          { text: ' \u2588\u2588\u2551\u255a\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u255d \u2588\u2588\u2554\u2550\u2550\u2550\u255d', cls: 'cyan' },
          { text: ' \u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2588\u2551\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557', cls: 'cyan' },
          { text: ' \u255a\u2550\u255d  \u255a\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u255d  \u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d', cls: 'cyan' },
        ];
      },
    };

    // Process goto command
    function processGoto(args) {
      var sectionMap = {
        home: '#home', about: '#about', journey: '#journey',
        skills: '#skills', projects: '#projects',
        certifications: '#certifications', certs: '#certifications',
        ctf: '#ctf', blog: '#blog', contact: '#contact'
      };
      var section = args[0] ? args[0].toLowerCase() : '';
      var target = sectionMap[section];
      if (target) {
        var el = document.querySelector(target);
        if (el) {
          closeTerminal();
          setTimeout(function () {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
          return [{ text: 'Navigation vers #' + section + ' ✓', cls: 'success' }];
        }
      }
      /* Show all section names except the 'certs' alias (use 'certifications') */
      var available = Object.keys(sectionMap).filter(function (k) { return k !== 'certs'; });
      return [
        { text: 'Section inconnue : "' + (args[0] || '') + '"', cls: 'error' },
        { text: 'Sections disponibles : ' + available.join(', '), cls: '' },
      ];
    }

    // Render output
    function appendOutput(lines) {
      if (!lines) return;
      lines.forEach(function (line) {
        var p = document.createElement('p');
        p.className = 'terminal-output' + (line.cls ? ' ' + line.cls : '');
        p.textContent = line.text;
        body.appendChild(p);
      });
    }

    function appendCommandLine(cmd) {
      var line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = '<span class="terminal-line-prompt">epicnoob22 \u2192 </span><span class="terminal-line-cmd">' + escapeHtml(cmd) + '</span>';
      body.appendChild(line);
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function scrollToBottom() {
      body.scrollTop = body.scrollHeight;
    }

    function executeCommand(raw) {
      var trimmed = raw.trim();
      if (!trimmed) return;

      commandHistory.push(trimmed);
      historyIndex = commandHistory.length;

      var parts = trimmed.split(/\s+/);
      var cmd = parts[0].toLowerCase();
      var args = parts.slice(1);

      appendCommandLine(trimmed);

      if (cmd === 'echo') {
        appendOutput([{ text: args.join(' ') || '', cls: '' }]);
      } else if (cmd === 'goto') {
        appendOutput(processGoto(args));
      } else if (COMMANDS[cmd]) {
        var result = COMMANDS[cmd](args);
        appendOutput(result);
      } else {
        appendOutput([
          { text: 'Commande introuvable : "' + escapeHtml(cmd) + '"', cls: 'error' },
          { text: 'Tapez "help" pour voir les commandes disponibles.', cls: '' },
        ]);
      }

      scrollToBottom();
    }

    // Input handling
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        executeCommand(input.value);
        input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex];
          // Move cursor to end
          setTimeout(function () {
            input.selectionStart = input.selectionEnd = input.value.length;
          }, 0);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        var partial = input.value.toLowerCase();
        var cmdNames = Object.keys(COMMANDS).concat(['goto', 'echo']);
        var matches = cmdNames.filter(function (c) { return c.startsWith(partial); });
        if (matches.length === 1) {
          input.value = matches[0];
        } else if (matches.length > 1) {
          appendCommandLine(partial + '[TAB]');
          appendOutput([{ text: matches.join('  '), cls: 'accent' }]);
          scrollToBottom();
        }
      }
    });

    // Click on modal body to focus input
    body.addEventListener('click', function () { input.focus(); });
  }

  /* ============================================================
     13. TYPING ANIMATION
  ============================================================ */

  function initTypingAnimation() {
    var el = document.getElementById('typingText');
    if (!el) return;

    var phrases = [
      'Apprenti en Cybersécurité',
      'Ethical Hacker',
      'Red Team · Blue Team',
      'Pentester & Défenseur',
      'Passionné de CTF',
      'Builder de HomeLab SOC'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 60;
    var deleteSpeed = 35;
    var pauseEnd = 2000;
    var pauseStart = 400;

    function type() {
      var current = phrases[phraseIndex];

      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      var delay = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === current.length) {
        delay = pauseEnd;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = pauseStart;
      }

      setTimeout(type, delay);
    }

    type();
  }

  /* ============================================================
     14. PARTICLE NETWORK (Hero Canvas)
  ============================================================ */

  function initParticleNetwork() {
    var canvas = document.getElementById('heroParticles');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var maxParticles = 60;       // balance between visual density and performance
    var connectionDistance = 150; // max px between particles to draw a connection line
    var mouseX = -1000;
    var mouseY = -1000;

    function resize() {
      var hero = canvas.closest('.hero-bg');
      if (!hero) return;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    resize();
    window.addEventListener('resize', debounce(resize, 200));

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    for (var i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    document.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(129, 140, 248, ' + p.opacity + ')';
        ctx.fill();

        // Connect nearby particles
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            var alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(129, 140, 248, ' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect to mouse
        var mDx = p.x - mouseX;
        var mDy = p.y - mouseY;
        var mDist = Math.sqrt(mDx * mDx + mDy * mDy);
        if (mDist < connectionDistance * 1.5) {
          var mAlpha = (1 - mDist / (connectionDistance * 1.5)) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = 'rgba(34, 211, 238, ' + mAlpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ============================================================
     15. TILT EFFECT ON GLASS CARDS
  ============================================================ */

  function initTiltEffect() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var cards = document.querySelectorAll('.bento-card.glass, .cert-card.glass, .ctf-platform.glass, .writeup-card.glass, .blog-card.glass');
    cards.forEach(function (card) {
      // Add glare element
      var glare = document.createElement('div');
      glare.className = 'glass-glare';
      card.appendChild(glare);

      card.addEventListener('mouseenter', function () {
        card.classList.add('tilt-active');
      });

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -4;
        var rotateY = ((x - centerX) / centerX) * 4;
        var glareX = (x / rect.width) * 100;
        var glareY = (y / rect.height) * 100;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
        glare.style.setProperty('--glare-x', glareX + '%');
        glare.style.setProperty('--glare-y', glareY + '%');
      });

      card.addEventListener('mouseleave', function () {
        card.classList.remove('tilt-active');
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(function () {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  /* ============================================================
     16. INIT
  ============================================================ */

  function init() {
    initPreloader();
    initCursor();
    initScrollProgress();
    initNavbar();
    initScrollReveal();
    initCounters();
    initProgressBars();
    initProjectsFilter();
    initMagneticButtons();
    initBackToTop();
    initThemeToggle();
    initLangToggle();
    initKeyboardShortcuts();
    initContactForm();
    initTerminal();
    initTypingAnimation();
    initParticleNetwork();
    initTiltEffect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
