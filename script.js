/* =============================================
   FRED MAKORI — PORTFOLIO JAVASCRIPT
   ============================================= */

// ---- NAVBAR: scroll behaviour + active link ----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scroll class for background
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});


// ---- MOBILE NAV TOGGLE ----
const navToggle = document.getElementById('navToggle');
const navLinksList = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});

// Close mobile menu on link click
navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksList.classList.remove('open');
  });
});


// ---- CIRCUIT CANVAS ANIMATION ----
const canvas = document.getElementById('circuitCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); drawCircuit(); });

function drawCircuit() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cols = Math.ceil(canvas.width / 80);
  const rows = Math.ceil(canvas.height / 80);
  const gridSize = 80;

  ctx.strokeStyle = '#00D4FF';
  ctx.lineWidth = 0.8;

  // Seed random with fixed value so pattern is stable
  const rng = seededRandom(42);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * gridSize + gridSize / 2;
      const y = r * gridSize + gridSize / 2;

      // Draw nodes
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00D4FF';
      ctx.fill();

      // Random horizontal or vertical trace
      const dir = rng() > 0.5;
      if (dir && c < cols - 1) {
        const length = (rng() > 0.5) ? gridSize : gridSize * 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + length, y);
        ctx.stroke();
      }
      if (!dir && r < rows - 1) {
        const length = (rng() > 0.5) ? gridSize : gridSize * 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + length);
        ctx.stroke();
      }

      // Occasional elbow turn
      if (rng() > 0.78 && c < cols - 1 && r < rows - 1) {
        ctx.beginPath();
        ctx.moveTo(x + gridSize / 2, y);
        ctx.lineTo(x + gridSize / 2, y + gridSize / 2);
        ctx.stroke();
      }
    }
  }
}

// Seeded pseudo-random number generator
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

drawCircuit();


// ---- SCROLL REVEAL ----
const fadeEls = document.querySelectorAll(
  '.skill-card, .timeline-item, .project-card, .edu-card, .about-grid, .contact-container'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Slight stagger per sibling
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => revealObserver.observe(el));


// ---- ANIMATED COUNTERS ----
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
  const duration = 1500;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target) + (target >= 10 ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}


// ---- SMOOTH SCROLL (fallback for older browsers) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});