/* ============================================================
   COMMERCIAL CONTRACTOR TEMPLATE — main.js
   Premium Industrial Theme for HVAC / Plumbing / Electrical
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 1. MOBILE HAMBURGER TOGGLE
  // =========================================================
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const navOverlay = document.querySelector('.nav-overlay');

  if (hamburger && nav) {
    const openNav = () => {
      hamburger.classList.add('active');
      nav.classList.add('open');
      if (navOverlay) navOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    const closeNav = () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      if (navOverlay) navOverlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      nav.classList.contains('open') ? closeNav() : openNav();
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeNav);
    }

    // Close nav on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // =========================================================
  // 2. ACTIVE NAV HIGHLIGHTING
  // =========================================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav a:not(.btn)');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  // =========================================================
  // 3. SCROLL REVEAL (Intersection Observer)
  // =========================================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // =========================================================
  // 4. TRUST NUMBER COUNT-UP ON SCROLL
  // =========================================================
  const countNumbers = document.querySelectorAll('.count-up');

  if (countNumbers.length > 0) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2000;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = target.toLocaleString() + suffix;
            }
          };

          requestAnimationFrame(animate);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    countNumbers.forEach(el => countObserver.observe(el));
  }

  // =========================================================
  // 5. FORM VALIDATION
  // =========================================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const validateField = (field) => {
      const errorEl = field.parentElement.querySelector('.form-error');
      const value = field.value.trim();

      if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = 'This field is required';
          errorEl.classList.add('show');
        }
        return false;
      }

      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          field.classList.add('error');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address';
            errorEl.classList.add('show');
          }
          return false;
        }
      }

      if (field.name === 'phone' && value) {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
          field.classList.add('error');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid phone number (10 digits)';
            errorEl.classList.add('show');
          }
          return false;
        }
      }

      field.classList.remove('error');
      if (errorEl) {
        errorEl.classList.remove('show');
        errorEl.textContent = '';
      }
      return true;
    };

    const fields = contactForm.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      fields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (isValid) {
        const successEl = document.getElementById('formSuccess');
        if (successEl) {
          successEl.classList.add('show');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
      } else {
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // =========================================================
  // 6. SMOOTH SCROLL
  // =========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // =========================================================
  // 7. PROJECT GALLERY FILTER TABS
  // =========================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          if (filter === 'all') {
            card.classList.remove('hidden');
          } else {
            const category = card.getAttribute('data-category');
            card.classList.toggle('hidden', category !== filter);
          }
        });
      });
    });
  }

  // =========================================================
  // 8. PHONE NUMBER FORMATTING (input mask)
  // =========================================================
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);
      if (value.length > 6) {
        value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
      } else if (value.length > 3) {
        value = `(${value.slice(0,3)}) ${value.slice(3)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
      e.target.value = value;
    });
  });

  // =========================================================
  // 9. FORMAT CURRENT YEAR IN FOOTER
  // =========================================================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});