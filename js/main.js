/* ═══════════════════════════════════════════════════════════
   TEAMTUNES — main.js
═══════════════════════════════════════════════════════════ */

// ─── Navbar: add "scrolled" class after user scrolls ────────
const navbar = document.getElementById('navbar');

function updateNav() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run on load in case page is already scrolled

// ─── Hamburger menu (mobile) ─────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-label', 'Open menu');
  });
});

// ─── Scroll Reveal (IntersectionObserver) ────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Observe all elements with the .reveal class
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Smooth scroll for anchor links ──────────────────────────
// (CSS scroll-behavior: smooth handles this, but this improves
//  offset so content isn't hidden behind the fixed navbar)
const NAV_HEIGHT = 68;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Gallery: drag to scroll on desktop ──────────────────────
const galleryScroll = document.querySelector('.gallery-scroll');

if (galleryScroll) {
  let isDown  = false;
  let startX  = 0;
  let scrollLeft = 0;

  galleryScroll.addEventListener('mousedown', (e) => {
    isDown = true;
    galleryScroll.style.cursor = 'grabbing';
    startX     = e.pageX - galleryScroll.offsetLeft;
    scrollLeft = galleryScroll.scrollLeft;
  });

  galleryScroll.addEventListener('mouseleave', () => {
    isDown = false;
    galleryScroll.style.cursor = '';
  });

  galleryScroll.addEventListener('mouseup', () => {
    isDown = false;
    galleryScroll.style.cursor = '';
  });

  galleryScroll.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - galleryScroll.offsetLeft;
    const walk = (x - startX) * 1.5;
    galleryScroll.scrollLeft = scrollLeft - walk;
  });
}

// ─── Hero: pause video on low-power / data-saver preference ──
const heroVideo = document.querySelector('.hero-video');
if (heroVideo && navigator.connection) {
  if (navigator.connection.saveData || navigator.connection.effectiveType === 'slow-2g') {
    heroVideo.remove(); // fall back to poster image
  }
}
