/**
 * EpicNoob22 — Cybersecurity Portfolio
 * script.js — Complete interactive features
 */

(function () {
  'use strict';

  /* ============================================================
     UTILITY FUNCTIONS
  ============================================================ */

  function throttle(fn, limit) {
    var lastCall = 0;
    return function () {
      var now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        return fn.apply(this, arguments);
      }
    };
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, delay);
    };
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /* ============================================================
     1. PRELOADER + BOOT SEQUENCE
  ============================================================ */

  var bootSequenceDone = false;
  var typewriterReady = false;

  function initPreloader() {
    var preloader = document.getElementById('preloader');
    var bootSequence = document.getElementById('bootSequence');
    var mainContent = document.getElementById('main-content');
    var navbar = document.getElementById('navbar');
    var footer = document.querySelector('.footer');

    if (!preloader) return;

    /* Hide main content until boot is done */
    if (mainContent) mainContent.style.opacity = '0';
    if (navbar) navbar.style.opacity = '0';
    if (footer) footer.style.opacity = '0';

    setTimeout(function () {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.5s ease';
      setTimeout(function () {
        preloader.style.display = 'none';
        preloader.setAttribute('aria-hidden', 'true');
        showBootSequence(function () {
          revealMainContent(mainContent, navbar, footer);
        });
      }, 500);
    }, 1500);
  }

  function showBootSequence(onComplete) {
    var bootSequence = document.getElementById('bootSequence');
    var bootText = document.getElementById('bootText');

    if (!bootSequence || !bootText) {
      if (onComplete) onComplete();
      return;
    }

    bootSequence.style.display = 'flex';
    bootSequence.style.opacity = '1';
    bootSequence.removeAttribute('aria-hidden');

    var lines = [
      'BIOS v2.0.1 Copyright EpicNoob Systems',
      'CPU: Brain i9-13900K @ 3.00GHz',
      'Memory Test: 16384 MB OK',
      'Detecting hardware... OK',
      'Loading kernel modules...',
      'Starting network interfaces... eth0 UP [192.168.1.1]',
      'Mounting filesystems... OK',
      'Starting security services...',
      'Initializing firewall rules... 2048 rules loaded',
      'Starting SSH daemon... OK [port 22]',
      'Loading Kali Linux...',
      'Starting terminal services...',
      '[  OK  ] Started EpicNoob22 Portfolio Service',
      '[  OK  ] Reached target Multi-User System',
      "Welcome to EpicNoob22's Cybersecurity Portfolio",
      "Type 'help' to get started \u2014 Press any key to continue..."
    ];

    var index = 0;

    function displayNextLine() {
      if (index >= lines.length) {
        setTimeout(function () {
          bootSequence.style.transition = 'opacity 0.6s ease';
          bootSequence.style.opacity = '0';
          setTimeout(function () {
            bootSequence.style.display = 'none';
            bootSequence.setAttribute('aria-hidden', 'true');
            bootSequenceDone = true;
            if (onComplete) onComplete();
            if (typewriterReady) startTypewriter();
          }, 600);
        }, 800);
        return;
      }

      var span = document.createElement('span');
      span.className = 'boot-line';
      span.textContent = lines[index];
      bootText.appendChild(span);
      bootText.appendChild(document.createTextNode('\n'));

      /* Auto-scroll boot terminal */
      var bootTerminal = bootSequence.querySelector('.boot-terminal');
      if (bootTerminal) bootTerminal.scrollTop = bootTerminal.scrollHeight;

      index++;
      setTimeout(displayNextLine, 120);
    }

    displayNextLine();
  }

  function revealMainContent(mainContent, navbar, footer) {
    var elements = [mainContent, navbar, footer];
    elements.forEach(function (el) {
      if (!el) return;
      el.style.transition = 'opacity 0.8s ease';
      el.style.opacity = '1';
    });
  }

  /* ============================================================
     2. CUSTOM CURSOR
  ============================================================ */

  function initCursor() {
    var cursorInner = document.getElementById('cursorInner');
    var cursorOuter = document.getElementById('cursorOuter');

    if (!cursorInner || !cursorOuter) return;

    var mouseX = -100;
    var mouseY = -100;
    var outerX = -100;
    var outerY = -100;
    var targetX = -100;
    var targetY = -100;
    var rafId = null;

    var hoverSelectors = 'a, button, .btn, .skill-card, .project-card, .social-link, ' +
      '.cert-card, .platform-card, .blog-card, .writeup-card, .tilt-card, ' +
      '.nav-link, .terminal-toggle-btn, .back-to-top, .platform-link, ' +
      '.writeup-read, .blog-read-link, .project-link, .cert-verify, ' +
      '.footer-social-link, .hamburger, .terminal-egg-dot';

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetX = mouseX;
      targetY = mouseY;

      cursorInner.style.left = mouseX + 'px';
      cursorInner.style.top = mouseY + 'px';
    });

    function animateOuter() {
      outerX += (targetX - outerX) * 0.15;
      outerY += (targetY - outerY) * 0.15;

      cursorOuter.style.left = outerX + 'px';
      cursorOuter.style.top = outerY + 'px';

      rafId = requestAnimationFrame(animateOuter);
    }

    animateOuter();

    document.addEventListener('mouseover', function (e) {
      if (e.target && e.target.matches && e.target.matches(hoverSelectors)) {
        cursorOuter.classList.add('hovering');
        cursorInner.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target && e.target.matches && e.target.matches(hoverSelectors)) {
        cursorOuter.classList.remove('hovering');
        cursorInner.classList.remove('hovering');
      }
    });

    document.addEventListener('mouseleave', function () {
      cursorInner.style.opacity = '0';
      cursorOuter.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
      cursorInner.style.opacity = '1';
      cursorOuter.style.opacity = '1';
    });

    document.addEventListener('mousedown', function () {
      cursorInner.classList.add('clicking');
      cursorOuter.classList.add('clicking');
    });

    document.addEventListener('mouseup', function () {
      cursorInner.classList.remove('clicking');
      cursorOuter.classList.remove('clicking');
    });
  }

  /* ============================================================
     3. MATRIX RAIN CANVAS
  ============================================================ */

  var matrixAnimId = null;

  function initMatrix() {
    var canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');

    function resizeMatrix() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeMatrix();

    var fontSize = 14;
    var columns = [];
    var lastFrameTime = 0;
    var frameInterval = 1000 / 30;

    function buildColumns() {
      var colCount = Math.floor(canvas.width / fontSize);
      columns = [];
      for (var i = 0; i < colCount; i++) {
        columns.push(Math.floor(Math.random() * canvas.height / fontSize) * -1);
      }
    }

    buildColumns();

    function getRandomChar() {
      var rand = Math.random();
      if (rand < 0.6) {
        /* Katakana range: 0x30A0 - 0x30FF */
        return String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
      } else if (rand < 0.85) {
        return String.fromCharCode(0x30 + Math.floor(Math.random() * 10));
      } else {
        var symbols = ['@', '#', '$', '%', '&', '*', '!', '?', '>', '<', '/', '\\', '|', '~', '^'];
        return symbols[Math.floor(Math.random() * symbols.length)];
      }
    }

    function drawMatrix(timestamp) {
      matrixAnimId = requestAnimationFrame(drawMatrix);

      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < columns.length; i++) {
        var y = columns[i] * fontSize;

        /* Bright leading character */
        ctx.fillStyle = '#ffffff';
        ctx.font = fontSize + 'px JetBrains Mono, monospace';
        ctx.fillText(getRandomChar(), i * fontSize, y);

        /* Trail characters */
        ctx.fillStyle = '#00ff88';
        if (y > fontSize) {
          ctx.globalAlpha = 0.85;
          ctx.fillText(getRandomChar(), i * fontSize, y - fontSize);
          ctx.globalAlpha = 0.6;
          ctx.fillText(getRandomChar(), i * fontSize, y - fontSize * 2);
          ctx.globalAlpha = 0.35;
          ctx.fillText(getRandomChar(), i * fontSize, y - fontSize * 3);
          ctx.globalAlpha = 0.15;
          ctx.fillText(getRandomChar(), i * fontSize, y - fontSize * 4);
          ctx.globalAlpha = 1;
        }

        columns[i]++;

        if (y > canvas.height && Math.random() > 0.975) {
          columns[i] = 0;
        }
      }
    }

    if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
    requestAnimationFrame(drawMatrix);

    window._matrixResize = function () {
      resizeMatrix();
      buildColumns();
    };
  }

  /* ============================================================
     4. PARTICLES SYSTEM
  ============================================================ */

  var particlesAnimId = null;
  var particlesList = [];

  function initParticles() {
    var canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var mouseX = -9999;
    var mouseY = -9999;
    var lastFrameTime = 0;
    var frameInterval = 1000 / 60;

    function resizeParticles() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeParticles();

    var isMobile = window.innerWidth < 768;
    var particleCount = isMobile ? 40 : 80;

    function createParticle() {
      var colors = ['#00ff88', '#00d4ff'];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    }

    function buildParticles() {
      particlesList = [];
      for (var i = 0; i < particleCount; i++) {
        particlesList.push(createParticle());
      }
    }

    buildParticles();

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function drawParticles(timestamp) {
      particlesAnimId = requestAnimationFrame(drawParticles);

      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particlesList.length; i++) {
        var p = particlesList[i];

        /* Mouse repulsion */
        var dx = p.x - mouseX;
        var dy = p.y - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100 && dist > 0) {
          var force = (100 - dist) / 100;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        /* Speed cap */
        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2;
          p.vy = (p.vy / speed) * 2;
        }

        p.x += p.vx;
        p.y += p.vy;

        /* Bounce off walls */
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }

        /* Draw particle */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      /* Draw connection lines */
      for (var i = 0; i < particlesList.length; i++) {
        for (var j = i + 1; j < particlesList.length; j++) {
          var pa = particlesList[i];
          var pb = particlesList[j];
          var lx = pa.x - pb.x;
          var ly = pa.y - pb.y;
          var lineD = Math.sqrt(lx * lx + ly * ly);

          if (lineD < 120) {
            var lineOpacity = (1 - lineD / 120) * 0.25;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.strokeStyle = '#00ff88';
            ctx.globalAlpha = lineOpacity;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    if (particlesAnimId) cancelAnimationFrame(particlesAnimId);
    requestAnimationFrame(drawParticles);

    window._particlesResize = function () {
      resizeParticles();
      isMobile = window.innerWidth < 768;
      particleCount = isMobile ? 40 : 80;
      buildParticles();
    };
  }

  /* ============================================================
     5. TYPEWRITER EFFECT
  ============================================================ */

  var typewriterInstance = null;

  function initTypewriter() {
    typewriterReady = true;
    if (bootSequenceDone) startTypewriter();
  }

  function startTypewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;

    var phrases = [
      'Passionn\u00e9 de cybers\u00e9curit\u00e9 \uD83D\uDD10',
      'Ethical Hacker en formation \uD83D\uDC80',
      'En recherche d\u2019alternance \uD83D\uDE80',
      'CTF Player \u2014 Hack the Planet! \uD83C\uDF0D',
      'Blue Team \uD83D\uDEE1\uFE0F + Red Team \u2694\uFE0F',
      'Toujours un terminal ouvert... \uD83D\uDDA5\uFE0F',
      'while(!(succeed = try()));',
      'root@kali:~# nmap -sV target'
    ];

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var currentText = '';
    var timeoutId = null;

    function type() {
      var current = phrases[phraseIndex];

      if (isDeleting) {
        currentText = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = current.substring(0, charIndex + 1);
        charIndex++;
      }

      el.textContent = currentText;

      var delay = 80;

      if (isDeleting) {
        delay = 40;
      }

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500;
      }

      timeoutId = setTimeout(type, delay);
    }

    type();
    typewriterInstance = timeoutId;
  }

  /* ============================================================
     6. NAVBAR
  ============================================================ */

  function initNavbar() {
    var navbar = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    var navLinkItems = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    /* Scroll: add .scrolled class */
    var handleScroll = throttle(function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      updateActiveNav();
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* Active nav link via scroll position */
    function updateActiveNav() {
      var sections = document.querySelectorAll('section[id]');
      var scrollPos = window.scrollY + 100;

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinkItems.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    /* Hamburger menu */
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        var isOpen = navLinks.classList.contains('open');
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });

      /* Close menu on nav link click */
      navLinkItems.forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });

      /* Close menu on outside click */
      document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target)) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ============================================================
     7. SCROLL ANIMATIONS (IntersectionObserver)
  ============================================================ */

  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var parent = el.parentElement;
          var siblings = parent ? Array.from(parent.querySelectorAll('.animate-on-scroll')) : [];
          var idx = siblings.indexOf(el);
          var delay = idx * 100;

          setTimeout(function () {
            el.classList.add('animated');
          }, delay);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     8. ANIMATED COUNTERS
  ============================================================ */

  function initCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    var startTime = null;
    var duration = 2000;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutCubic(progress);
      var current = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  /* ============================================================
     9. SKILL BAR ANIMATIONS
  ============================================================ */

  function initSkillBars() {
    var bars = document.querySelectorAll('.skill-progress[data-width], .platform-progress[data-width]');
    if (!bars.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateSkillBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) {
      observer.observe(bar);
    });
  }

  function animateSkillBar(bar) {
    var targetWidth = parseInt(bar.getAttribute('data-width'), 10);
    if (isNaN(targetWidth)) return;

    var startTime = null;
    var duration = 1500;

    var percentEl = bar.closest('.skill-bar-container')
      ? bar.closest('.skill-bar-container').querySelector('.skill-percent')
      : bar.closest('.platform-bar-container')
        ? bar.closest('.platform-bar-container').querySelector('.platform-percent')
        : null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutCubic(progress);
      var current = eased * targetWidth;

      bar.style.width = current.toFixed(1) + '%';

      if (percentEl) {
        percentEl.textContent = Math.round(current) + '%';
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        bar.style.width = targetWidth + '%';
        if (percentEl) percentEl.textContent = targetWidth + '%';
      }
    }

    requestAnimationFrame(step);
  }

  /* ============================================================
     10. 3D TILT EFFECT
  ============================================================ */

  function initTiltEffect() {
    var cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var percentX = (e.clientX - rect.left) / rect.width - 0.5;
        var percentY = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateX = percentY * -15;
        var rotateY = percentX * 15;

        card.style.transition = 'transform 0.1s ease';
        card.style.transform =
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  /* ============================================================
     11. TERMINAL EASTER EGG
  ============================================================ */

  var terminalHistory = [];
  var terminalHistoryIndex = -1;
  var terminalOpen = false;

  var terminalCommands = {
    help: function () {
      return (
        '<span class="t-cyan">╔══════════════════════════════════════════════════════╗</span>\n' +
        '<span class="t-cyan">║</span>         <span class="t-green">EpicNoob22 Terminal — Available Commands</span>         <span class="t-cyan">║</span>\n' +
        '<span class="t-cyan">╚══════════════════════════════════════════════════════╝</span>\n\n' +
        '<span class="t-yellow">Navigation</span>\n' +
        '  <span class="t-green">help</span>          <span class="t-dim">— Afficher cette aide</span>\n' +
        '  <span class="t-green">ls</span>            <span class="t-dim">— Lister les sections du portfolio</span>\n' +
        '  <span class="t-green">pwd</span>           <span class="t-dim">— Afficher le répertoire courant</span>\n' +
        '  <span class="t-green">cd &lt;section&gt;</span>  <span class="t-dim">— Naviguer vers une section</span>\n\n' +
        '<span class="t-yellow">Informations</span>\n' +
        '  <span class="t-green">whoami</span>        <span class="t-dim">— Informations sur EpicNoob22</span>\n' +
        '  <span class="t-green">skills</span>        <span class="t-dim">— Lister les compétences</span>\n' +
        '  <span class="t-green">projects</span>      <span class="t-dim">— Lister les projets</span>\n' +
        '  <span class="t-green">contact</span>       <span class="t-dim">— Informations de contact</span>\n' +
        '  <span class="t-green">cat about.txt</span> <span class="t-dim">— Lire le fichier about</span>\n\n' +
        '<span class="t-yellow">Fun</span>\n' +
        '  <span class="t-green">neofetch</span>      <span class="t-dim">— Afficher les infos système</span>\n' +
        '  <span class="t-green">sudo hire me</span>  <span class="t-dim">— Commande spéciale ;)</span>\n' +
        '  <span class="t-green">ping google.com</span> <span class="t-dim">— Tester la connectivité</span>\n' +
        '  <span class="t-green">nmap localhost</span>  <span class="t-dim">— Scanner les ports locaux</span>\n' +
        '  <span class="t-green">date</span>          <span class="t-dim">— Afficher la date</span>\n' +
        '  <span class="t-green">uname -a</span>      <span class="t-dim">— Informations système</span>\n' +
        '  <span class="t-green">history</span>       <span class="t-dim">— Historique des commandes</span>\n' +
        '  <span class="t-green">echo &lt;text&gt;</span>  <span class="t-dim">— Afficher du texte</span>\n\n' +
        '<span class="t-yellow">Terminal</span>\n' +
        '  <span class="t-green">clear</span>         <span class="t-dim">— Effacer le terminal</span>\n' +
        '  <span class="t-green">exit</span>          <span class="t-dim">— Fermer le terminal</span>\n'
      );
    },

    whoami: function () {
      return (
        '<span class="t-green">uid=1337(epicnoob22) gid=1337(hackers) groups=1337(hackers),0(root)</span>\n\n' +
        '<span class="t-cyan">Name:</span>       <span class="t-white">EpicNoob22</span>\n' +
        '<span class="t-cyan">Role:</span>       <span class="t-white">Apprenti Cybersécurité | Ethical Hacker</span>\n' +
        '<span class="t-cyan">Status:</span>     <span class="t-green">Available for alternance (Sept 2026)</span>\n' +
        '<span class="t-cyan">Location:</span>   <span class="t-white">France 🇫🇷</span>\n' +
        '<span class="t-cyan">Focus:</span>      <span class="t-white">Offensive Security + Blue Team</span>\n' +
        '<span class="t-cyan">GitHub:</span>     <span class="t-yellow">https://github.com/EpicNoob22</span>\n' +
        '<span class="t-cyan">Email:</span>      <span class="t-yellow">epicnoob22@proton.me</span>\n' +
        '<span class="t-cyan">Mission:</span>    <span class="t-pink">Hack the planet, but ethically. 🌍🔐</span>\n'
      );
    },

    skills: function () {
      return (
        '<span class="t-cyan">┌─ Skills ───────────────────────────────────────────┐</span>\n\n' +
        '<span class="t-yellow">Sécurité Offensive</span>    <span class="t-green">████████████████░░░░</span> 75%\n' +
        '  Pentesting, Red Team, OWASP Top 10, Exploitation\n\n' +
        '<span class="t-yellow">Sécurité Défensive</span>    <span class="t-green">██████████████░░░░░░</span> 70%\n' +
        '  SIEM/SOC, Incident Response, Forensics\n\n' +
        '<span class="t-yellow">Réseau &amp; Infra</span>        <span class="t-green">████████████████░░░░</span> 80%\n' +
        '  TCP/IP, Firewall, VPN, Active Directory\n\n' +
        '<span class="t-yellow">Outils</span>                <span class="t-green">█████████████████░░░</span> 85%\n' +
        '  Kali, Burp Suite, Wireshark, Nmap, Metasploit\n\n' +
        '<span class="t-yellow">Scripting &amp; Dev</span>      <span class="t-green">██████████████░░░░░░</span> 70%\n' +
        '  Python, Bash, PowerShell, C\n\n' +
        '<span class="t-yellow">Systèmes</span>              <span class="t-green">████████████████░░░░</span> 75%\n' +
        '  Linux, Windows Server, Docker, Proxmox\n' +
        '<span class="t-cyan">└───────────────────────────────────────────────────┘</span>\n'
      );
    },

    projects: function () {
      return (
        '<span class="t-cyan">drwxr-xr-x  8 epicnoob22 hackers 4096 2026  ~/projects/</span>\n\n' +
        '<span class="t-green">🏠 homelab-soc</span>        <span class="t-dim">SOC maison avec ELK, Wazuh, Suricata</span>\n' +
        '<span class="t-green">🔍 vulnscanner-pro</span>    <span class="t-dim">Scanner de vulnérabilités web en Python</span>\n' +
        '<span class="t-green">🔐 ad-lab</span>             <span class="t-dim">Active Directory lab vulnérable</span>\n' +
        '<span class="t-green">🦠 malware-sandbox</span>    <span class="t-dim">Sandbox analyse dynamique/statique</span>\n' +
        '<span class="t-green">🎣 phishguard</span>         <span class="t-dim">Outil de sensibilisation au phishing</span>\n' +
        '<span class="t-green">🤖 autorecon-bot</span>      <span class="t-dim">Bot de reconnaissance automatisée</span>\n' +
        '<span class="t-green">🌐 honeypot-network</span>   <span class="t-dim">Réseau de honeypots VPS</span>\n' +
        '<span class="t-green">🔑 cryptovault</span>        <span class="t-dim">Gestionnaire de mots de passe AES-256</span>\n\n' +
        '<span class="t-yellow">→ Voir tous les projets : </span><span class="t-cyan">https://github.com/EpicNoob22</span>\n'
      );
    },

    contact: function () {
      return (
        '<span class="t-cyan">┌─ Contact EpicNoob22 ───────────────────────────────┐</span>\n\n' +
        '<span class="t-green">📧 Email:</span>     <span class="t-yellow">epicnoob22@proton.me</span>\n' +
        '<span class="t-green">🐙 GitHub:</span>    <span class="t-yellow">https://github.com/EpicNoob22</span>\n' +
        '<span class="t-green">💼 LinkedIn:</span>  <span class="t-yellow">EpicNoob22</span>\n' +
        '<span class="t-green">🚩 TryHackMe:</span> <span class="t-yellow">https://tryhackme.com/p/EpicNoob22</span>\n' +
        '<span class="t-green">🌐 HTB:</span>       <span class="t-yellow">https://app.hackthebox.com/profile/EpicNoob22</span>\n\n' +
        '<span class="t-pink">Disponible pour alternance à partir de Septembre 2026 🚀</span>\n' +
        '<span class="t-cyan">└───────────────────────────────────────────────────┘</span>\n'
      );
    },

    clear: function () {
      var output = document.getElementById('terminalOutput');
      if (output) output.innerHTML = '';
      return null;
    },

    ls: function () {
      return (
        '<span class="t-cyan">total 8</span>\n' +
        '<span class="t-green">drwxr-xr-x</span> home/\n' +
        '<span class="t-green">drwxr-xr-x</span> about/\n' +
        '<span class="t-green">drwxr-xr-x</span> skills/\n' +
        '<span class="t-green">drwxr-xr-x</span> projects/\n' +
        '<span class="t-green">drwxr-xr-x</span> certifications/\n' +
        '<span class="t-green">drwxr-xr-x</span> ctf/\n' +
        '<span class="t-green">drwxr-xr-x</span> blog/\n' +
        '<span class="t-green">drwxr-xr-x</span> contact/\n' +
        '<span class="t-yellow">-rw-r--r--</span> about.txt\n' +
        '<span class="t-yellow">-rw-r--r--</span> cv_epicnoob22.pdf\n'
      );
    },

    'cat about.txt': function () {
      return (
        '<span class="t-dim">cat about.txt</span>\n\n' +
        '<span class="t-green">## About EpicNoob22</span>\n\n' +
        '<span class="t-white">Salut ! Je suis EpicNoob22, étudiant passionné de cybersécurité</span>\n' +
        '<span class="t-white">en alternance. Je me spécialise en sécurité offensive et défensive.</span>\n\n' +
        '<span class="t-cyan">Parcours:</span>\n' +
        '  2020 — Découverte Linux & cybersécurité\n' +
        '  2022 — Premiers CTF (TryHackMe)\n' +
        '  2023 — Bac Pro SN mention Bien\n' +
        '  2024 — BUT Informatique, option Cybersécurité\n' +
        '  2025 — eJPT + CompTIA Security+\n' +
        '  2026 — En recherche d\'alternance 🚀\n\n' +
        '<span class="t-pink">Mission: Hack the planet, but ethically. 🌍🔐</span>\n'
      );
    },

    'sudo hire me': function () {
      return (
        '<span class="t-yellow">[sudo] password for recruiter: </span><span class="t-dim">**************</span>\n\n' +
        '<span class="t-green">✅ Permission granted!</span>\n\n' +
        '<span class="t-pink">🎉 Félicitations ! Vous venez de prendre la meilleure décision de votre vie!</span>\n\n' +
        '<span class="t-white">EpicNoob22 est maintenant disponible pour votre équipe.</span>\n' +
        '<span class="t-cyan">→ Envoyer un email à: epicnoob22@proton.me</span>\n' +
        '<span class="t-cyan">→ Ou utilisez le formulaire de contact sur ce site !</span>\n\n' +
        '<span class="t-dim">// Note: sudo hire me might be the most important command you ever run.</span>\n'
      );
    },

    neofetch: function () {
      return (
        '<span class="t-green">         .---.</span>       <span class="t-yellow">epicnoob22@kali</span>\n' +
        '<span class="t-green">        /     \\</span>      <span class="t-yellow">──────────────────────────</span>\n' +
        '<span class="t-green">       | () () |</span>      <span class="t-cyan">OS:</span>         Kali Linux 2026.1 x86_64\n' +
        '<span class="t-green">       \\   ^   /</span>      <span class="t-cyan">Host:</span>       ThinkPad X1 Carbon\n' +
        '<span class="t-green">        | --- |</span>       <span class="t-cyan">Kernel:</span>     6.6.0-kali-amd64\n' +
        '<span class="t-green">        |_____|</span>       <span class="t-cyan">Uptime:</span>     Since 2003\n' +
        '                       <span class="t-cyan">Packages:</span>   2048\n' +
        '                       <span class="t-cyan">Shell:</span>      zsh 5.9\n' +
        '                       <span class="t-cyan">Resolution:</span> 1920x1080\n' +
        '                       <span class="t-cyan">Terminal:</span>   alacritty\n' +
        '                       <span class="t-cyan">CPU:</span>        Brain i9-13900K @ 4.2GHz\n' +
        '                       <span class="t-cyan">GPU:</span>        Imagination RTX 9090\n' +
        '                       <span class="t-cyan">Memory:</span>     16384MB / 16384MB\n' +
        '                       <span class="t-dim">           (100% used on CTFs)</span>\n\n' +
        '<span class="t-green">███</span><span class="t-cyan">███</span><span class="t-yellow">███</span><span class="t-pink">███</span><span class="t-white">███</span><span class="t-dim">███</span>  <span class="t-green">███</span><span class="t-cyan">███</span><span class="t-yellow">███</span><span class="t-pink">███</span><span class="t-white">███</span><span class="t-dim">███</span>\n'
      );
    },

    'ping google.com': function () {
      return (
        '<span class="t-white">PING google.com (142.250.74.142): 56 data bytes</span>\n' +
        '<span class="t-green">64 bytes from 142.250.74.142: icmp_seq=0 ttl=117 time=12.4 ms</span>\n' +
        '<span class="t-green">64 bytes from 142.250.74.142: icmp_seq=1 ttl=117 time=11.8 ms</span>\n' +
        '<span class="t-green">64 bytes from 142.250.74.142: icmp_seq=2 ttl=117 time=13.2 ms</span>\n' +
        '<span class="t-green">64 bytes from 142.250.74.142: icmp_seq=3 ttl=117 time=12.0 ms</span>\n\n' +
        '<span class="t-cyan">--- google.com ping statistics ---</span>\n' +
        '<span class="t-white">4 packets transmitted, 4 packets received, 0.0% packet loss</span>\n' +
        '<span class="t-white">round-trip min/avg/max/stddev = 11.8/12.35/13.2/0.52 ms</span>\n'
      );
    },

    'nmap localhost': function () {
      return (
        '<span class="t-white">Starting Nmap 7.94 ( https://nmap.org )</span>\n' +
        '<span class="t-white">Nmap scan report for localhost (127.0.0.1)</span>\n' +
        '<span class="t-white">Host is up (0.000087s latency).</span>\n\n' +
        '<span class="t-cyan">PORT     STATE  SERVICE    VERSION</span>\n' +
        '<span class="t-green">22/tcp   open   ssh        OpenSSH 9.5</span>\n' +
        '<span class="t-green">80/tcp   open   http       Apache httpd 2.4.58</span>\n' +
        '<span class="t-green">443/tcp  open   https      Apache httpd 2.4.58</span>\n' +
        '<span class="t-green">3306/tcp open   mysql      MySQL 8.0.35</span>\n' +
        '<span class="t-yellow">8080/tcp open   http-proxy Nginx 1.24.0</span>\n' +
        '<span class="t-pink">31337/tcp open   ELITE      nc (netcat)</span>\n\n' +
        '<span class="t-white">Service detection performed.</span>\n' +
        '<span class="t-white">Nmap done: 1 IP address (1 host up) scanned in 2.42 seconds</span>\n'
      );
    },

    history: function () {
      if (!terminalHistory.length) {
        return '<span class="t-dim">No commands in history yet.</span>\n';
      }
      var out = '<span class="t-cyan">Command History:</span>\n';
      terminalHistory.forEach(function (cmd, i) {
        out += '  <span class="t-dim">' + (i + 1) + '</span>  <span class="t-white">' + escapeHtml(cmd) + '</span>\n';
      });
      return out;
    },

    date: function () {
      var now = new Date();
      return (
        '<span class="t-green">' +
        now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) +
        ' ' +
        now.toLocaleTimeString('fr-FR') +
        ' CET</span>\n'
      );
    },

    'uname -a': function () {
      return (
        '<span class="t-green">Linux kali 6.6.0-kali-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9-1kali1 (2026-01-15) x86_64 GNU/Linux</span>\n'
      );
    },

    exit: function () {
      setTimeout(closeTerminal, 300);
      return '<span class="t-yellow">Fermeture du terminal...</span>\n';
    },

    pwd: function () {
      return '<span class="t-green">/home/epicnoob22</span>\n';
    },

    echo: function (args) {
      return '<span class="t-white">' + escapeHtml(args.join(' ')) + '</span>\n';
    }
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function openTerminal() {
    var terminal = document.getElementById('terminalEgg');
    var toggle = document.getElementById('terminalToggle');
    var input = document.getElementById('terminalInput');
    var output = document.getElementById('terminalOutput');

    if (!terminal) return;

    terminal.classList.remove('hidden');
    terminalOpen = true;

    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }

    /* Show welcome message if output is empty */
    if (output && !output.hasChildNodes()) {
      var welcome =
        '<span class="t-green">╔════════════════════════════════════════════════════╗</span>\n' +
        '<span class="t-green">║</span>    <span class="t-pink">EpicNoob22 Interactive Terminal v1.0.0</span>         <span class="t-green">║</span>\n' +
        '<span class="t-green">║</span>    <span class="t-dim">Type \'help\' to see available commands</span>          <span class="t-green">║</span>\n' +
        '<span class="t-green">╚════════════════════════════════════════════════════╝</span>\n\n' +
        '<span class="t-cyan">Last login:</span> <span class="t-white">' + new Date().toUTCString() + '</span>\n\n';
      appendTerminalOutput(welcome);
    }

    setTimeout(function () {
      if (input) input.focus();
    }, 100);
  }

  function closeTerminal() {
    var terminal = document.getElementById('terminalEgg');
    var toggle = document.getElementById('terminalToggle');

    if (!terminal) return;

    terminal.classList.add('hidden');
    terminalOpen = false;

    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  function appendTerminalOutput(html) {
    var output = document.getElementById('terminalOutput');
    if (!output) return;

    var div = document.createElement('div');
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function executeCommand(rawCmd) {
    var cmd = rawCmd.trim();
    if (!cmd) return;

    /* Add to history (avoid consecutive duplicates) */
    if (terminalHistory[terminalHistory.length - 1] !== cmd) {
      terminalHistory.push(cmd);
    }
    terminalHistoryIndex = terminalHistory.length;

    /* Echo the command with prompt */
    appendTerminalOutput(
      '<span class="t-green">root@kali:~#</span> <span class="t-white">' + escapeHtml(cmd) + '</span>\n'
    );

    /* Try exact match first */
    var cmdLower = cmd.toLowerCase();
    var result = null;

    if (typeof terminalCommands[cmdLower] === 'function') {
      result = terminalCommands[cmdLower]();
    } else if (typeof terminalCommands[cmd] === 'function') {
      result = terminalCommands[cmd]();
    } else if (cmdLower.startsWith('echo ')) {
      var echoArgs = cmd.slice(5).split(' ');
      result = terminalCommands.echo(echoArgs);
    } else if (cmdLower.startsWith('cd ')) {
      var target = cmd.slice(3).trim().toLowerCase();
      var validSections = ['home', 'about', 'skills', 'projects', 'certifications', 'ctf', 'blog', 'contact'];
      if (validSections.indexOf(target) !== -1) {
        var section = document.getElementById(target);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          result = '<span class="t-green">Navigating to /' + target + '</span>\n';
          closeTerminal();
        } else {
          result = '<span class="t-pink">bash: cd: ' + escapeHtml(target) + ': No such section</span>\n';
        }
      } else {
        result = '<span class="t-pink">bash: cd: ' + escapeHtml(cmd.slice(3)) + ': No such file or directory</span>\n';
      }
    } else if (cmdLower === 'cat about.txt') {
      result = terminalCommands['cat about.txt']();
    } else if (cmdLower === 'sudo hire me') {
      result = terminalCommands['sudo hire me']();
    } else if (cmdLower === 'ping google.com') {
      result = terminalCommands['ping google.com']();
    } else if (cmdLower === 'nmap localhost') {
      result = terminalCommands['nmap localhost']();
    } else if (cmdLower === 'uname -a') {
      result = terminalCommands['uname -a']();
    } else {
      result =
        '<span class="t-pink">bash: ' + escapeHtml(cmd) + ': command not found</span>\n' +
        '<span class="t-dim">Type \'help\' to see available commands</span>\n';
    }

    if (result !== null && result !== undefined) {
      appendTerminalOutput(result);
    }
  }

  /* Konami Code: ↑↑↓↓←→←→BA */
  var konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  var konamiIndex = 0;

  function initTerminal() {
    var toggle = document.getElementById('terminalToggle');
    var closeBtn = document.getElementById('terminalClose');
    var input = document.getElementById('terminalInput');
    var terminal = document.getElementById('terminalEgg');

    if (toggle) {
      toggle.addEventListener('click', function () {
        if (terminalOpen) {
          closeTerminal();
        } else {
          openTerminal();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeTerminal);
    }

    /* Close on Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && terminalOpen) {
        closeTerminal();
        return;
      }

      /* Konami code detection */
      var expected = konamiSequence[konamiIndex];
      if (e.key === expected) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
          konamiIndex = 0;
          if (!terminalOpen) openTerminal();
        }
      } else {
        konamiIndex = (e.key === konamiSequence[0]) ? 1 : 0;
      }
    });

    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var cmd = input.value;
          input.value = '';
          terminalHistoryIndex = terminalHistory.length;
          executeCommand(cmd);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (terminalHistoryIndex > 0) {
            terminalHistoryIndex--;
            input.value = terminalHistory[terminalHistoryIndex] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (terminalHistoryIndex < terminalHistory.length - 1) {
            terminalHistoryIndex++;
            input.value = terminalHistory[terminalHistoryIndex] || '';
          } else {
            terminalHistoryIndex = terminalHistory.length;
            input.value = '';
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          /* Basic tab completion */
          var partial = input.value.toLowerCase().trim();
          var allCmds = Object.keys(terminalCommands).concat(['cd', 'echo']);
          var matches = allCmds.filter(function (c) { return c.startsWith(partial); });
          if (matches.length === 1) {
            input.value = matches[0];
          } else if (matches.length > 1) {
            appendTerminalOutput(
              '<span class="t-dim">' + matches.join('  ') + '</span>\n'
            );
          }
        }
      });
    }

    /* Click outside to close */
    if (terminal) {
      terminal.addEventListener('click', function (e) {
        if (e.target === terminal) closeTerminal();
      });
    }
  }

  /* ============================================================
     12. CONTACT FORM VALIDATION
  ============================================================ */

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
    var charCount = document.getElementById('charCount');
    var submitBtn = document.getElementById('submitBtn');

    function showError(errorEl, msg) {
      if (!errorEl) return;
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }

    function clearError(errorEl) {
      if (!errorEl) return;
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }

    function validateEmail(email) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    /* Real-time char count */
    if (messageInput && charCount) {
      messageInput.addEventListener('input', function () {
        var len = messageInput.value.length;
        charCount.textContent = len + ' / 20 min';
        if (len >= 20) {
          charCount.style.color = '#00ff88';
        } else {
          charCount.style.color = '';
        }
      });
    }

    /* Real-time error clearing */
    if (nameInput) {
      nameInput.addEventListener('input', function () {
        if (nameInput.value.trim().length >= 2) clearError(nameError);
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', function () {
        if (validateEmail(emailInput.value.trim())) clearError(emailError);
      });
    }

    if (subjectInput) {
      subjectInput.addEventListener('change', function () {
        if (subjectInput.value) clearError(subjectError);
      });
    }

    if (messageInput) {
      messageInput.addEventListener('input', function () {
        if (messageInput.value.trim().length >= 20) clearError(messageError);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;

      /* Clear all errors */
      clearError(nameError);
      clearError(emailError);
      clearError(subjectError);
      clearError(messageError);

      /* Validate name */
      if (!nameInput || nameInput.value.trim().length < 2) {
        showError(nameError, 'Le nom doit contenir au moins 2 caractères.');
        isValid = false;
      }

      /* Validate email */
      if (!emailInput || !validateEmail(emailInput.value.trim())) {
        showError(emailError, 'Veuillez entrer une adresse email valide.');
        isValid = false;
      }

      /* Validate subject */
      if (!subjectInput || !subjectInput.value) {
        showError(subjectError, 'Veuillez choisir un sujet.');
        isValid = false;
      }

      /* Validate message */
      if (!messageInput || messageInput.value.trim().length < 20) {
        showError(messageError, 'Le message doit contenir au moins 20 caractères.');
        isValid = false;
      }

      if (!isValid) {
        showToast('Veuillez corriger les erreurs dans le formulaire.', 'error');
        return;
      }

      /* Simulate form submission */
      if (submitBtn) {
        var btnText = submitBtn.querySelector('.btn-text');
        var btnLoading = submitBtn.querySelector('.btn-loading');
        submitBtn.disabled = true;

        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';
      }

      setTimeout(function () {
        if (submitBtn) {
          var btnText = submitBtn.querySelector('.btn-text');
          var btnLoading = submitBtn.querySelector('.btn-loading');
          submitBtn.disabled = false;

          if (btnLoading) btnLoading.style.display = 'none';
          if (btnText) {
            btnText.style.display = 'flex';
            btnText.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Envoyé!';
          }

          setTimeout(function () {
            if (btnText) {
              btnText.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Envoyer le message';
            }
          }, 3000);
        }

        form.reset();
        if (charCount) charCount.textContent = '0 / 20 min';

        showToast('Message envoyé avec succès ! Je vous répondrai bientôt. 🚀', 'success');
      }, 1500);
    });
  }

  /* ============================================================
     13. TOAST NOTIFICATIONS
  ============================================================ */

  function showToast(message, type) {
    type = type || 'success';
    var container = document.getElementById('toastContainer');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    var icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
    var color = type === 'success' ? '#00ff88' : type === 'error' ? '#ff006e' : '#00d4ff';

    toast.innerHTML =
      '<i class="fas ' + icon + '" style="color:' + color + '" aria-hidden="true"></i>' +
      '<span>' + message + '</span>' +
      '<button class="toast-close" aria-label="Fermer la notification">' +
      '<i class="fas fa-times" aria-hidden="true"></i></button>';

    toast.style.cssText =
      'display:flex;align-items:center;gap:12px;padding:14px 18px;' +
      'background:rgba(13,13,21,0.95);border:1px solid ' + color + ';' +
      'border-radius:8px;color:#e0e0e0;font-family:"JetBrains Mono",monospace;' +
      'font-size:0.85rem;max-width:400px;box-shadow:0 4px 20px rgba(0,0,0,0.5);' +
      'transform:translateX(120%);transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);' +
      'margin-top:8px;position:relative;';

    var closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.style.cssText =
        'background:none;border:none;color:#888899;cursor:pointer;' +
        'padding:0;margin-left:auto;font-size:0.9rem;flex-shrink:0;';
      closeBtn.addEventListener('click', function () {
        removeToast(toast);
      });
    }

    container.appendChild(toast);

    /* Slide in */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.style.transform = 'translateX(0)';
      });
    });

    var autoRemove = setTimeout(function () {
      removeToast(toast);
    }, 4000);

    toast._autoRemove = autoRemove;
  }

  function removeToast(toast) {
    if (!toast || !toast.parentElement) return;
    clearTimeout(toast._autoRemove);
    toast.style.transform = 'translateX(120%)';
    setTimeout(function () {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 350);
  }

  /* ============================================================
     14. BACK TO TOP BUTTON
  ============================================================ */

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    var handleScroll = throttle(function () {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      } else {
        btn.classList.remove('visible');
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* Initial state */
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';
    btn.style.transition = 'opacity 0.3s ease';
  }

  /* ============================================================
     15. SMOOTH SCROLL
  ============================================================ */

  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ============================================================
     17. RESIZE HANDLER
  ============================================================ */

  function initResizeHandler() {
    var handleResize = debounce(function () {
      if (typeof window._matrixResize === 'function') {
        window._matrixResize();
      }
      if (typeof window._particlesResize === 'function') {
        window._particlesResize();
      }
    }, 250);

    window.addEventListener('resize', handleResize);
  }

  /* ============================================================
     18. INIT ALL
  ============================================================ */

  function init() {
    initPreloader();
    initCursor();
    initMatrix();
    initParticles();
    initNavbar();
    initScrollAnimations();
    initTypewriter();
    initCounters();
    initSkillBars();
    initTiltEffect();
    initTerminal();
    initContactForm();
    initBackToTop();
    initSmoothScroll();
    initResizeHandler();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
