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

  /* ============================================================
     10e. PROJECT DETAIL MODALS
  ============================================================ */

  function initProjectModals() {
    var modal = document.getElementById('projectModal');
    var closeBtn = document.getElementById('projectModalClose');
    var overlay = modal ? modal.querySelector('.project-modal-overlay') : null;
    if (!modal) return;

    var projectData = {
      'homelab-soc': {
        emoji: '🏠',
        title: 'HomeLab SOC',
        category: 'Défensif',
        desc: 'Construction d\'un Security Operations Center complet en environnement domestique. ELK Stack pour l\'agrégation des logs, Wazuh comme EDR, Suricata pour la détection d\'intrusions réseau. Dashboards Kibana personnalisés avec alerting automatisé via Discord et Telegram. Monitoring 24/7 avec règles de corrélation personnalisées.',
        tags: ['ELK Stack', 'Wazuh', 'Suricata', 'Docker', 'Grafana', 'Kibana', 'Sigma Rules', 'Discord API'],
        features: [
          'Agrégation centralisée des logs via Elasticsearch',
          'Détection d\'intrusions réseau avec Suricata',
          'EDR endpoint avec Wazuh agents',
          'Dashboards Kibana personnalisés pour SOC',
          'Alerting temps réel via Discord & Telegram',
          'Règles de corrélation Sigma personnalisées'
        ],
        github: 'https://github.com/EpicNoob22'
      },
      'vulnscanner': {
        emoji: '🔍',
        title: 'VulnScanner Pro',
        category: 'Offensif',
        desc: 'Scanner de vulnérabilités web automatisé développé en Python. Détection d\'injections SQL, XSS, SSRF et directory traversal. Génération de rapports PDF professionnels avec scoring CVSS, PoC et recommandations de remédiation. Architecture modulaire avec plugins extensibles.',
        tags: ['Python', 'OWASP', 'Automation', 'ReportLab', 'Requests', 'BeautifulSoup', 'CVSS'],
        features: [
          'Détection automatisée SQLi, XSS, SSRF, LFI',
          'Scoring CVSS v3.1 automatique',
          'Génération de rapports PDF professionnels',
          'Architecture modulaire avec plugins',
          'Mode silencieux pour intégration CI/CD',
          'Export JSON/CSV/PDF des résultats'
        ],
        github: 'https://github.com/EpicNoob22'
      },
      'ad-lab': {
        emoji: '🔐',
        title: 'Active Directory Lab',
        category: 'Labs',
        desc: 'Environnement AD vulnérable sur Proxmox : DC Windows Server 2022, 3 clients Windows, 1 serveur Linux. Scénarios Kerberoasting, Pass-the-Hash, Golden Ticket, DCSync. Documentation offensive et défensive complète avec guides pas-à-pas.',
        tags: ['Active Directory', 'BloodHound', 'Mimikatz', 'Proxmox', 'Windows Server', 'Kerberos', 'LDAP'],
        features: [
          'Domain Controller Windows Server 2022',
          '3 postes clients + 1 serveur Linux joints au domaine',
          'Scénarios Kerberoasting & AS-REP Roasting',
          'Pass-the-Hash, Pass-the-Ticket, Golden Ticket',
          'DCSync et attaques de délégation',
          'Documentation offensive & défensive complète'
        ],
        github: 'https://github.com/EpicNoob22'
      },
      'malware': {
        emoji: '🦠',
        title: 'Malware Analysis Sandbox',
        category: 'Défensif',
        desc: 'Sandbox isolée pour analyse dynamique et statique de malwares. Pipeline automatisé : soumission → analyse comportementale → extraction IOCs → rapport. Reverse engineering avec Ghidra, YARA rules custom.',
        tags: ['Ghidra', 'REMnux', 'YARA', 'Volatility 3', 'PE Analysis', 'Cuckoo', 'VirusTotal API'],
        features: [
          'Pipeline d\'analyse automatisé end-to-end',
          'Analyse statique avec Ghidra et radare2',
          'Analyse dynamique en sandbox isolée',
          'Extraction automatique des IOCs',
          'YARA rules custom pour détection',
          'Intégration VirusTotal API'
        ],
        github: 'https://github.com/EpicNoob22'
      },
      'phishguard': {
        emoji: '🎣',
        title: 'PhishGuard',
        category: 'Outils',
        desc: 'Plateforme de sensibilisation au phishing avec GoPhish customisé. Templates réalistes, dashboard analytique, module de formation automatisé pour les utilisateurs piégés. Rapports mensuels auto-générés.',
        tags: ['GoPhish', 'Python Flask', 'PostgreSQL', 'Docker', 'Chart.js', 'SMTP', 'Jinja2'],
        features: [
          'Campagnes de phishing simulées réalistes',
          'Dashboard analytique temps réel',
          'Module de formation automatisé post-piège',
          'Templates personnalisables par entreprise',
          'Rapports mensuels PDF auto-générés',
          'Scoring de sensibilisation par département'
        ],
        github: 'https://github.com/EpicNoob22'
      },
      'autorecon': {
        emoji: '🤖',
        title: 'AutoRecon Bot',
        category: 'Offensif',
        desc: 'Bot de reconnaissance automatisée pour pentesting. Orchestration de Subfinder, Nmap, WhatWeb et TheHarvester. Rapports Markdown structurés, mode silencieux, configuration YAML.',
        tags: ['Bash', 'Python', 'Nmap', 'OSINT', 'Subfinder', 'WhatWeb', 'TheHarvester'],
        features: [
          'Orchestration de 10+ outils de reconnaissance',
          'Scan de ports intelligent avec classification',
          'Enumération DNS et subdomain discovery',
          'OSINT automatisé avec TheHarvester',
          'Rapports Markdown structurés',
          'Configuration YAML flexible'
        ],
        github: 'https://github.com/EpicNoob22'
      },
      'honeypot': {
        emoji: '🌐',
        title: 'Honeypot Network',
        category: 'Défensif',
        desc: 'Réseau de honeypots sur 3 VPS : Cowrie (SSH), Dionaea (SMB), Conpot (SCADA). Logs centralisés ELK Stack, dashboard Kibana avec géoloc attaquants et mapping MITRE ATT&CK.',
        tags: ['Cowrie', 'Dionaea', 'Conpot', 'ELK Stack', 'MITRE ATT&CK', 'GeoIP', 'Kibana'],
        features: [
          'Honeypots SSH (Cowrie), SMB (Dionaea), SCADA (Conpot)',
          'Déployé sur 3 VPS dans différentes régions',
          'Centralisation des logs via ELK Stack',
          'Géolocalisation des attaquants',
          'Mapping MITRE ATT&CK automatisé',
          'Dashboard Kibana de threat intelligence'
        ],
        github: 'https://github.com/EpicNoob22'
      },
      'cryptovault': {
        emoji: '🔑',
        title: 'CryptoVault',
        category: 'Outils',
        desc: 'Gestionnaire de mots de passe CLI chiffré AES-256-GCM avec PBKDF2. Vault SQLite chiffré, génération de mots de passe forts, audit de sécurité, intégration Have I Been Pwned.',
        tags: ['Python', 'AES-256-GCM', 'SQLite', 'HIBP API', 'PBKDF2', 'Click', 'Rich'],
        features: [
          'Chiffrement AES-256-GCM avec dérivation PBKDF2',
          'Vault SQLite entièrement chiffré',
          'Générateur de mots de passe configurable',
          'Audit de sécurité des mots de passe',
          'Vérification Have I Been Pwned',
          'Interface CLI élégante avec Rich'
        ],
        github: 'https://github.com/EpicNoob22'
      }
    };

    function openProjectModal(projectId) {
      var data = projectData[projectId];
      if (!data) return;

      document.getElementById('modalEmoji').textContent = data.emoji;
      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalCategory').textContent = data.category;
      document.getElementById('modalDesc').textContent = data.desc;

      var tagsContainer = document.getElementById('modalTags');
      tagsContainer.innerHTML = '';
      data.tags.forEach(function (tag) {
        var span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });

      var featuresContainer = document.getElementById('modalFeatures');
      featuresContainer.innerHTML = '';
      data.features.forEach(function (feature) {
        var li = document.createElement('li');
        li.textContent = feature;
        featuresContainer.appendChild(li);
      });

      var actionsContainer = document.getElementById('modalActions');
      actionsContainer.innerHTML = '';
      if (data.github) {
        var a = document.createElement('a');
        a.href = data.github;
        a.className = 'btn btn-primary';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = '<i class="fab fa-github"></i> Voir sur GitHub';
        actionsContainer.appendChild(a);
      }

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeProjectModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }

    var projectCards = document.querySelectorAll('.project-card[data-project]');
    projectCards.forEach(function (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        openProjectModal(card.getAttribute('data-project'));
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
    if (overlay) overlay.addEventListener('click', closeProjectModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeProjectModal();
      }
    });
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
     10f. KONAMI CODE EASTER EGG
  ============================================================ */

  function initKonamiCode() {
    var sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    var position = 0;
    var canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var animationId = null;

    document.addEventListener('keydown', function (e) {
      if (e.key === sequence[position] || e.key.toLowerCase() === sequence[position]) {
        position++;
        if (position === sequence.length) {
          position = 0;
          startMatrixRain();
        }
      } else {
        position = 0;
      }
    });

    function startMatrixRain() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.classList.add('active');

      var fontSize = 14;
      var columns = Math.floor(canvas.width / fontSize);
      var drops = [];
      for (var i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
      }

      var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*(){}[];:<>?~';
      var charArray = chars.split('');

      function draw() {
        ctx.fillStyle = 'rgba(6, 6, 14, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < drops.length; i++) {
          var char = charArray[Math.floor(Math.random() * charArray.length)];

          // Lead character is white/bright
          if (drops[i] > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold ' + fontSize + 'px "JetBrains Mono", monospace';
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            // Trail characters are green
            ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
            ctx.font = fontSize + 'px "JetBrains Mono", monospace';
            var trailChar = charArray[Math.floor(Math.random() * charArray.length)];
            if (drops[i] > 1) {
              ctx.fillText(trailChar, i * fontSize, (drops[i] - 1) * fontSize);
            }
          }

          drops[i]++;

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
        }

        animationId = requestAnimationFrame(draw);
      }

      // Show toast
      var toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = '🎮 Konami Code activated! Matrix rain unlocked!';
        toast.className = 'toast success show';
        setTimeout(function () { toast.classList.remove('show'); }, 3500);
      }

      draw();

      // Stop after 8 seconds
      setTimeout(function () {
        if (animationId) cancelAnimationFrame(animationId);
        canvas.classList.remove('active');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }, 8000);
    }
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
          { text: '', cls: '' },
          { text: '  \u2500\u2500\u2500 Commandes Bonus \u2500\u2500\u2500', cls: 'cyan' },
          { text: '  neofetch     \u2192 Infos syst\u00e8me', cls: '' },
          { text: '  matrix       \u2192 Simulation Matrix', cls: '' },
          { text: '  ping         \u2192 Ping simul\u00e9', cls: '' },
          { text: '  nmap [ip]    \u2192 Scan de ports simul\u00e9', cls: '' },
          { text: '  cowsay [msg] \u2192 Vache qui parle', cls: '' },
          { text: '  uptime       \u2192 Temps d\u0027activit\u00e9', cls: '' },
          { text: '  sudo [cmd]   \u2192 Tenter sudo', cls: '' },
          { text: '  cat [file]   \u2192 Afficher un fichier', cls: '' },
          { text: '  ls [dir]     \u2192 Lister les fichiers', cls: '' },
          { text: '  rm [file]    \u2192 Supprimer un fichier', cls: '' },
          { text: '  weather      \u2192 M\u00e9t\u00e9o simul\u00e9e', cls: '' },
          { text: '  hack         \u2192 \ud83d\ude0f', cls: '' },
          { text: '  id           \u2192 Identit\u00e9 utilisateur', cls: '' },
          { text: '  hostname     \u2192 Nom de la machine', cls: '' },
          { text: '  uname        \u2192 Infos noyau', cls: '' },
          { text: '  ifconfig     \u2192 Interfaces r\u00e9seau', cls: '' },
          { text: '  pwd          \u2192 R\u00e9pertoire courant', cls: '' },
          { text: '  cd [dir]     \u2192 Changer de r\u00e9pertoire', cls: '' },
          { text: '  whoisprivate \u2192 Whois lookup', cls: '' },
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
      neofetch: function () {
        return [
          { text: '        .--.        epicnoob22@portfolio', cls: 'accent' },
          { text: '       |o_o |       \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500', cls: 'accent' },
          { text: '       |:_/ |       OS: Kali GNU/Linux Rolling', cls: '' },
          { text: '      //   \\ \\      Host: HomeLab SOC', cls: '' },
          { text: '     (|     | )     Kernel: 6.6.15-amd64', cls: '' },
          { text: '    /\'\\_   _/`\\     Shell: zsh 5.9', cls: '' },
          { text: '    \\___)=(___/     Terminal: epicnoob22-term v2.0', cls: '' },
          { text: '', cls: '' },
          { text: '  Uptime    : Since 2020 (6 years)', cls: 'cyan' },
          { text: '  Packages  : 15+ projects, 4 certs, 50+ CTF', cls: '' },
          { text: '  Resolution: 1337x1337 (hacker mode)', cls: '' },
          { text: '  DE        : Cybersecurity', cls: '' },
          { text: '  WM        : Red Team / Blue Team', cls: '' },
          { text: '  Theme     : Premium Dark [glassmorphism]', cls: '' },
          { text: '  CPU       : Caffeinated Brain @ 3.4GHz', cls: '' },
          { text: '  Memory    : 1500+ hours of lab / \u221e', cls: '' },
          { text: '', cls: '' },
          { text: '  \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588', cls: 'accent' },
        ];
      },
      matrix: function () {
        var lines = [];
        for (var i = 0; i < 12; i++) {
          var row = '  ';
          for (var j = 0; j < 40; j++) {
            var chars = '\u30a7\u30a2\u30ab\u30b5\u30bf\u30ca\u30cf\u30de\u30e4\u30e9\u30ef01234567890ABCDEF!@#$%';
            row += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          lines.push({ text: row, cls: i % 3 === 0 ? 'success' : 'cyan' });
        }
        lines.push({ text: '', cls: '' });
        lines.push({ text: '  [SIMULATION] The Matrix has you...', cls: 'accent' });
        lines.push({ text: '  Tip: Try the Konami code (\u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192BA) for the real thing!', cls: '' });
        return lines;
      },
      ping: function () {
        var targets = ['10.10.10.1', '192.168.1.1', 'hackthebox.com', 'tryhackme.com'];
        var target = targets[Math.floor(Math.random() * targets.length)];
        var lines = [
          { text: '  PING ' + target + ' (' + target + ') 56(84) bytes of data.', cls: '' }
        ];
        for (var i = 0; i < 4; i++) {
          var time = (Math.random() * 50 + 5).toFixed(1);
          lines.push({ text: '  64 bytes from ' + target + ': icmp_seq=' + (i + 1) + ' ttl=64 time=' + time + ' ms', cls: 'cyan' });
        }
        lines.push({ text: '', cls: '' });
        lines.push({ text: '  --- ' + target + ' ping statistics ---', cls: '' });
        lines.push({ text: '  4 packets transmitted, 4 received, 0% packet loss', cls: 'success' });
        return lines;
      },
      cowsay: function (args) {
        var message = args.length ? args.join(' ') : 'Moo! I mean... hack the planet!';
        var border = '  ' + new Array(message.length + 4).join('-');
        return [
          { text: border, cls: '' },
          { text: '  | ' + message + ' |', cls: 'cyan' },
          { text: border, cls: '' },
          { text: '         \\   ^__^', cls: '' },
          { text: '          \\  (oo)\\_______', cls: '' },
          { text: '             (__)\\       )\\/\\', cls: '' },
          { text: '                 ||----w |', cls: '' },
          { text: '                 ||     ||', cls: '' },
        ];
      },
      uptime: function () {
        var start = new Date(2020, 0, 1);
        var now = new Date();
        var diff = now - start;
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return [
          { text: '  System uptime: ' + days + ' days, ' + hours + ' hours', cls: 'cyan' },
          { text: '  Hacking since: January 2020', cls: '' },
          { text: '  Status: Still learning, still hacking \ud83d\udd25', cls: 'success' },
        ];
      },
      sudo: function (args) {
        if (args.length === 0) {
          return [{ text: '  usage: sudo <command>', cls: 'error' }];
        }
        var cmd = args.join(' ').toLowerCase();
        if (cmd === 'rm -rf /' || cmd === 'rm -rf /*') {
          return [
            { text: '  [sudo] password for epicnoob22: ********', cls: '' },
            { text: '  rm: cannot remove \'/\': Permission denied', cls: 'error' },
            { text: '  Nice try! \ud83d\ude0f This is a portfolio, not a real system.', cls: 'accent' },
          ];
        }
        if (cmd.includes('hack') || cmd.includes('exploit')) {
          return [
            { text: '  [sudo] password for epicnoob22: ********', cls: '' },
            { text: '  Permission granted. Remember: only ethical hacking! \ud83d\udee1\ufe0f', cls: 'success' },
          ];
        }
        return [
          { text: '  [sudo] password for epicnoob22: ********', cls: '' },
          { text: '  epicnoob22 is not in the sudoers file. This incident will be reported. \ud83d\udc40', cls: 'error' },
        ];
      },
      cat: function (args) {
        var file = args[0] ? args[0].toLowerCase() : '';
        if (file === '/etc/passwd' || file === 'etc/passwd') {
          return [
            { text: '  root:x:0:0:root:/root:/bin/bash', cls: '' },
            { text: '  epicnoob22:x:1337:1337:Ethical Hacker:/home/epicnoob22:/bin/zsh', cls: 'accent' },
            { text: '  nmap:x:1000:1000:Network Scanner:/opt/nmap:/usr/sbin/nologin', cls: '' },
            { text: '  burpsuite:x:1001:1001:Web Proxy:/opt/burp:/usr/sbin/nologin', cls: '' },
            { text: '  wireshark:x:1002:1002:Packet Analyzer:/opt/wireshark:/usr/sbin/nologin', cls: '' },
          ];
        }
        if (file === 'flag.txt' || file === '/flag.txt') {
          return [
            { text: '  CTF{t3rm1n4l_m4st3r_2026}', cls: 'success' },
            { text: '  Congratulations! You found another flag! \ud83c\udfc6', cls: 'accent' },
          ];
        }
        if (!file) {
          return [{ text: '  usage: cat <filename>', cls: 'error' }];
        }
        return [{ text: '  cat: ' + file + ': No such file or directory', cls: 'error' }];
      },
      ls: function (args) {
        var dir = args[0] ? args[0].toLowerCase() : '.';
        if (dir === '.' || dir === '~' || dir === '/home/epicnoob22') {
          return [
            { text: '  drwxr-xr-x  projects/', cls: 'accent' },
            { text: '  drwxr-xr-x  certifications/', cls: 'accent' },
            { text: '  drwxr-xr-x  ctf/', cls: 'accent' },
            { text: '  drwxr-xr-x  tools/', cls: 'accent' },
            { text: '  drwxr-xr-x  .ssh/', cls: '' },
            { text: '  -rw-r--r--  portfolio.html', cls: '' },
            { text: '  -rw-r--r--  flag.txt', cls: 'success' },
            { text: '  -rw-r--r--  .bashrc', cls: '' },
            { text: '  -rw-------  .bash_history', cls: '' },
          ];
        }
        if (dir === 'projects' || dir === 'projects/') {
          return [
            { text: '  drwxr-xr-x  homelab-soc/', cls: 'accent' },
            { text: '  drwxr-xr-x  vulnscanner-pro/', cls: 'accent' },
            { text: '  drwxr-xr-x  ad-lab/', cls: 'accent' },
            { text: '  drwxr-xr-x  malware-sandbox/', cls: 'accent' },
            { text: '  drwxr-xr-x  phishguard/', cls: 'accent' },
            { text: '  drwxr-xr-x  autorecon-bot/', cls: 'accent' },
            { text: '  drwxr-xr-x  honeypot-network/', cls: 'accent' },
            { text: '  drwxr-xr-x  cryptovault/', cls: 'accent' },
          ];
        }
        return [{ text: '  ls: cannot access \'' + dir + '\': No such file or directory', cls: 'error' }];
      },
      weather: function () {
        var conditions = ['\u2600\ufe0f Clear sky', '\ud83c\udf24\ufe0f Partly cloudy', '\ud83c\udf27\ufe0f Light rain', '\u26c8\ufe0f Thunderstorm', '\ud83c\udf2b\ufe0f Foggy', '\u2744\ufe0f Snowing'];
        var temps = [18, 22, 15, 28, 12, 5, 25, 20];
        var condition = conditions[Math.floor(Math.random() * conditions.length)];
        var temp = temps[Math.floor(Math.random() * temps.length)];
        return [
          { text: '  Weather Report \u2014 France \ud83c\uddeb\ud83c\uddf7', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  Condition : ' + condition, cls: '' },
          { text: '  Temp      : ' + temp + '\u00b0C', cls: 'cyan' },
          { text: '  Humidity  : ' + (Math.floor(Math.random() * 60) + 30) + '%', cls: '' },
          { text: '  Wind      : ' + (Math.floor(Math.random() * 30) + 5) + ' km/h', cls: '' },
          { text: '', cls: '' },
          { text: '  (Simulated data \u2014 not a real API call)', cls: '' },
        ];
      },
      whoisprivate: function () {
        return [
          { text: '  WHOIS Lookup \u2014 epicnoob22.dev', cls: 'accent' },
          { text: '', cls: '' },
          { text: '  Domain     : epicnoob22.dev', cls: '' },
          { text: '  Registrar  : GitHub Pages', cls: '' },
          { text: '  Created    : 2020-01-01', cls: '' },
          { text: '  Updated    : 2026-03-14', cls: '' },
          { text: '  Status     : ACTIVE', cls: 'success' },
          { text: '  Nameserver : ns1.github.io', cls: '' },
          { text: '', cls: '' },
          { text: '  Owner      : EpicNoob22', cls: 'cyan' },
          { text: '  Location   : France', cls: '' },
          { text: '  Purpose    : Cybersecurity Portfolio', cls: '' },
        ];
      },
      nmap: function (args) {
        var target = args[0] || '10.10.10.1';
        return [
          { text: '  Starting Nmap 7.94 ( https://nmap.org )', cls: '' },
          { text: '  Nmap scan report for ' + target, cls: 'accent' },
          { text: '  Host is up (0.023s latency).', cls: 'success' },
          { text: '', cls: '' },
          { text: '  PORT     STATE  SERVICE     VERSION', cls: '' },
          { text: '  22/tcp   open   ssh         OpenSSH 8.9p1', cls: 'cyan' },
          { text: '  80/tcp   open   http        nginx 1.24.0', cls: 'cyan' },
          { text: '  443/tcp  open   https       nginx 1.24.0', cls: 'cyan' },
          { text: '  3389/tcp closed ms-wbt-server', cls: '' },
          { text: '  8080/tcp open   http-proxy  Squid 5.7', cls: 'cyan' },
          { text: '', cls: '' },
          { text: '  Service detection performed. 5 services scanned.', cls: '' },
          { text: '  Nmap done: 1 IP address (1 host up) scanned in 12.34s', cls: 'success' },
          { text: '', cls: '' },
          { text: '  (Simulated scan \u2014 for educational purposes only)', cls: '' },
        ];
      },
      hack: function () {
        return [
          { text: '  [ACCESS DENIED]', cls: 'error' },
          { text: '', cls: '' },
          { text: '  Nice try! But remember:', cls: '' },
          { text: '  "With great power comes great responsibility"', cls: 'cyan' },
          { text: '', cls: '' },
          { text: '  \u2696\ufe0f  Always hack ethically.', cls: 'success' },
          { text: '  \ud83d\udcdd  Always get written authorization.', cls: 'success' },
          { text: '  \ud83d\udee1\ufe0f  Always report vulnerabilities responsibly.', cls: 'success' },
        ];
      },
      rm: function (args) {
        var target = args.join(' ');
        if (target.includes('-rf') && target.includes('/')) {
          return [
            { text: '  \ud83d\udeab PERMISSION DENIED', cls: 'error' },
            { text: '  rm: it is dangerous to operate recursively on \'/\'', cls: 'error' },
            { text: '', cls: '' },
            { text: '  Did you really just try to rm -rf / ? \ud83d\ude02', cls: 'accent' },
            { text: '  This portfolio survives everything!', cls: 'success' },
          ];
        }
        return [
          { text: '  rm: cannot remove \'' + (args[args.length - 1] || '') + '\': Read-only file system', cls: 'error' },
        ];
      },
      id: function () {
        return [
          { text: '  uid=1337(epicnoob22) gid=1337(hackers) groups=1337(hackers),27(sudo),100(users)', cls: 'cyan' },
        ];
      },
      hostname: function () {
        return [
          { text: '  epicnoob22-portfolio', cls: 'cyan' },
        ];
      },
      uname: function () {
        return [
          { text: '  Linux epicnoob22-portfolio 6.6.15-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux', cls: 'cyan' },
        ];
      },
      ifconfig: function () {
        return [
          { text: '  eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>', cls: '' },
          { text: '        inet 192.168.1.137  netmask 255.255.255.0  broadcast 192.168.1.255', cls: 'cyan' },
          { text: '        inet6 fe80::1337:dead:beef:cafe  prefixlen 64  scopeid 0x20<link>', cls: '' },
          { text: '        ether 00:13:37:de:ad:22  txqueuelen 1000  (Ethernet)', cls: '' },
          { text: '', cls: '' },
          { text: '  tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>', cls: '' },
          { text: '        inet 10.10.14.22  netmask 255.255.254.0', cls: 'success' },
          { text: '        (HackTheBox VPN connection)', cls: '' },
        ];
      },
      pwd: function () {
        return [{ text: '  /home/epicnoob22', cls: 'cyan' }];
      },
      cd: function (args) {
        var dir = args[0] || '~';
        return [{ text: '  Changed directory to ' + (dir === '~' ? '/home/epicnoob22' : dir), cls: '' }];
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
     10g. PAGE VISIBILITY TITLE
  ============================================================ */

  function initPageVisibility() {
    var originalTitle = document.title;
    var awayMessages = [
      '\u{1F440} Reviens, hacker !',
      '\u{1F512} La s\u00E9cu t\'attend !',
      '\u{1F480} Don\'t leave me...',
      '\u{1F6A8} Breach detected!',
    ];

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        document.title = awayMessages[Math.floor(Math.random() * awayMessages.length)];
      } else {
        document.title = originalTitle;
      }
    });
  }

  /* ============================================================
     10h. TEXT SCRAMBLE EFFECT
  ============================================================ */

  function initTextScramble() {
    var titles = document.querySelectorAll('.section-title');
    if (!titles.length) return;

    var chars = '!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    titles.forEach(function (title) {
      var originalText = title.textContent;
      var isAnimating = false;

      title.addEventListener('mouseenter', function () {
        if (isAnimating) return;
        isAnimating = true;
        title.classList.add('scrambling');

        var iterations = 0;
        var maxIterations = originalText.length * 3;

        var interval = setInterval(function () {
          title.textContent = originalText.split('').map(function (char, index) {
            if (index < iterations / 3) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');

          iterations++;

          if (iterations >= maxIterations) {
            clearInterval(interval);
            title.textContent = originalText;
            title.classList.remove('scrambling');
            isAnimating = false;
          }
        }, 30);
      });
    });
  }

  /* ============================================================
     10i. TIME-BASED GREETING
  ============================================================ */

  function initTimeGreeting() {
    var el = document.getElementById('heroGreeting');
    if (!el) return;

    var hour = new Date().getHours();
    var greeting;

    if (hour >= 5 && hour < 12) {
      greeting = '\u2600\uFE0F Bonjour ! Good morning!';
    } else if (hour >= 12 && hour < 18) {
      greeting = '\u{1F324}\uFE0F Bon apr\u00E8s-midi ! Good afternoon!';
    } else if (hour >= 18 && hour < 22) {
      greeting = '\u{1F306} Bonsoir ! Good evening!';
    } else {
      greeting = '\u{1F319} Bonne nuit ! Night owl hacking session?';
    }

    el.textContent = greeting;
  }

  /* ============================================================
     10j. SCROLL SPY DOTS
  ============================================================ */

  function initScrollSpy() {
    var nav = document.getElementById('scrollSpy');
    if (!nav) return;

    var dots = nav.querySelectorAll('.spy-dot');
    var sections = document.querySelectorAll('section[id]');

    // Show/hide based on scroll position
    function updateVisibility() {
      if (window.pageYOffset > 200) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', throttle(updateVisibility, 200), { passive: true });
    updateVisibility();

    // Active dot tracking
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          dots.forEach(function (dot) {
            var spy = dot.getAttribute('data-spy');
            if (spy === entry.target.id) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });

    // Click to navigate
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var target = document.getElementById(dot.getAttribute('data-spy'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
    initProjectModals();
    initKonamiCode();
    initContactForm();
    initTerminal();
    initTypingAnimation();
    initParticleNetwork();
    initTiltEffect();
    initPageVisibility();
    initTimeGreeting();
    initTextScramble();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
