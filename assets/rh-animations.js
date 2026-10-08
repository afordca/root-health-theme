/* Root Health — scroll reveal + micro-interactions.
   Progressive enhancement: if this script or IntersectionObserver is
   unavailable, or the visitor prefers reduced motion, nothing is hidden and
   the page renders normally. */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function init() {
    var SELECTOR = [
      '[data-reveal]',
      '.root-health-section h1',
      '.root-health-section h2',
      '.root-health-section h3',
      '.root-health-section .type-label',
      '.subheader__description',
      '.subheader__bottle',
      '.subheader__benefit',
      '.rhpi-benefit',
      '.rhpi-gift',
      '.nutrition-stats__item',
      '.root-health-medical-advisors__advisor',
      '.team-card',
      '.root-health-values__item',
      '.root-health-faq__item',
      '.root-health-comparison-chart__table-wrapper',
      '.root-health-product-testing__wrapper',
      '.root-health-section .button',
      '.ril__card'
    ].join(',');

    var hero = document.querySelector('.section-root-health-hero, .root-health-hero');
    var nodes = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));

    // Keep the hero instant (it's above the fold).
    nodes = nodes.filter(function (el) { return !(hero && hero.contains(el)); });

    // Drop any node whose ancestor is also animating (avoid double reveals).
    nodes = nodes.filter(function (el) {
      return !nodes.some(function (other) { return other !== el && other.contains(el); });
    });

    if (!nodes.length) return;

    // Hide + gently stagger within each section.
    nodes.forEach(function (el) {
      el.classList.add('rh-reveal');
      var section = el.closest('.shopify-section') || el.closest('.root-health-section');
      if (section) {
        var i = section.__rhIndex || 0;
        section.__rhIndex = i + 1;
        if (i > 0) el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
      }
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('rh-reveal--in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    nodes.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Nav background fade-in: engage the scrolled nav styling the instant the
   user starts scrolling (not only after scrolling past the full header). */
(function () {
  var header = document.querySelector('sticky-header.section-header, .section-header');
  if (!header) return;
  var THRESHOLD = 4;
  var ticking = false;
  function update() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    header.classList.toggle('rh-nav-scrolled', y > THRESHOLD);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();
