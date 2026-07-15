/* ============================================================
   VETCARE — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // 1. MOBILE HAMBURGER TOGGLE
  // ==========================================================
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav on link click (mobile)
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================================
  // 2. ACTIVE NAV DETECTION
  // ==========================================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // ==========================================================
  // 3. TESTIMONIAL CAROUSEL
  // ==========================================================
  const carousel = (() => {
    const track = document.querySelector('.testimonial-track');
    const slides = track ? track.querySelectorAll('.testimonial-slide') : [];
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval = null;
    const totalSlides = slides.length;
    const AUTOPLAY_DELAY = 5000;

    function goTo(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(next, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index));
        startAutoplay();
      });
    });

    // Pause on hover
    const carouselEl = document.querySelector('.testimonial-carousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stopAutoplay);
      carouselEl.addEventListener('mouseleave', startAutoplay);
    }

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
      }
      isDragging = false;
      startAutoplay();
    }, { passive: true });

    // Initialize
    goTo(0);
    startAutoplay();
  })();

  // ==========================================================
  // 4. SCROLL REVEAL (Intersection Observer)
  // ==========================================================
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

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ==========================================================
  // 5. PET COUNTER COUNT-UP ANIMATION
  // ==========================================================
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function animate(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          counter.innerHTML = current + suffix;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            counter.innerHTML = target + suffix;
          }
        }

        requestAnimationFrame(animate);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-number').forEach(el => counterObserver.observe(el));

  // ==========================================================
  // 6. FORM VALIDATION
  // ==========================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formInputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
    const formSuccess = contactForm.querySelector('.form-success');
    const formFields = contactForm.querySelector('.form-fields');

    function validateField(field) {
      const errorEl = field.parentElement.querySelector('.form-error');
      let isValid = true;

      if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
      } else if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          isValid = false;
        }
      } else if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
        if (!phoneRegex.test(field.value.trim())) {
          isValid = false;
        }
      }

      field.classList.toggle('error', !isValid && field.value.trim() !== '');
      if (errorEl) {
        errorEl.style.display = (!isValid && field.value.trim() !== '') ? 'block' : 'none';
      }

      return isValid;
    }

    // Real-time validation on blur
    formInputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      formInputs.forEach(input => {
        // For required fields, check if empty
        if (input.hasAttribute('required') && !input.value.trim()) {
          allValid = false;
          input.classList.add('error');
          const errorEl = input.parentElement.querySelector('.form-error');
          if (errorEl) errorEl.style.display = 'block';
        } else if (!validateField(input)) {
          allValid = false;
        }
      });

      if (allValid) {
        // Simulate submission
        if (formFields) formFields.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      }
    });
  }

  // ==========================================================
  // 7. SMOOTH SCROLL (internal anchor links)
  // ==========================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ==========================================================
  // 8. HEADER SHADOW ON SCROLL
  // ==========================================================
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.2)';
      } else {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }
});