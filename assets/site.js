/* Shared JS — nav toggle, scroll reveal, scroll nav state, form validation */
(function () {
  'use strict';

  // ---- Mobile nav toggle ----
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const toggle = nav.querySelector('.nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
      });
    }
    // shrink/blur effect on scroll
    let scrolled = false;
    const onScroll = () => {
      const s = window.scrollY > 24;
      if (s !== scrolled) {
        scrolled = s;
        nav.classList.toggle('scrolled', s);
      }
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Reveal on scroll ----
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  // ---- Form validation (contact form) ----
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const showError = (field, msg) => {
      field.classList.add('invalid');
      const err = field.querySelector('.error-msg');
      if (err && msg) err.textContent = msg;
    };
    const clearError = (field) => field.classList.remove('invalid');

    form.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('input', () => clearError(el.closest('.field')));
      el.addEventListener('change', () => clearError(el.closest('.field')));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const fields = form.querySelectorAll('.field');
      fields.forEach(f => clearError(f));

      const required = form.querySelectorAll('[data-required]');
      required.forEach(el => {
        const field = el.closest('.field');
        if (!el.value.trim()) {
          showError(field, 'Pflichtfeld');
          valid = false;
        }
      });

      const email = form.querySelector('[name="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email.closest('.field'), 'Bitte gültige E-Mail angeben');
        valid = false;
      }

      if (!valid) return;

      // Build mailto fallback
      const data = Object.fromEntries(new FormData(form).entries());
      const subject = encodeURIComponent(`Anfrage über die Website — ${data.firstname || ''} ${data.lastname || ''}`.trim());
      const body = encodeURIComponent(
        `Vorname: ${data.firstname || ''}\n` +
        `Nachname: ${data.lastname || ''}\n` +
        `E-Mail: ${data.email || ''}\n` +
        `Telefon: ${data.phone || ''}\n` +
        `Art der Arbeit: ${data.kind || ''}\n\n` +
        `Nachricht:\n${data.message || ''}`
      );

      // Show inline success state
      const success = document.getElementById('contact-success');
      if (success) {
        form.style.display = 'none';
        success.style.display = 'block';
      }

      // Open mail client as fallback
      window.location.href = `mailto:info@maler-meisinger.de?subject=${subject}&body=${body}`;
    });
  }

  // ---- Current year in footer ----
  function initYear() {
    const el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function init() {
    initNav();
    initReveal();
    initContactForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
