/* ============================================
   PHARMACY+ — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================
     1. MOBILE HAMBURGER TOGGLE
  ============================ */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const headerCta = document.querySelector('.header-cta');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================
     2. SMOOTH SCROLL FOR ANCHOR LINKS
  ============================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector('.site-header').offsetHeight;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ============================
     3. TESTIMONIALS CAROUSEL
  ============================ */
  var carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    var track = carousel.querySelector('.testimonial-track');
    var slides = track.querySelectorAll('.testimonial-slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var prevBtn = carousel.querySelector('.carousel-btn.prev');
    var nextBtn = carousel.querySelector('.carousel-btn.next');
    var currentIndex = 0;
    var autoRotateInterval;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(currentIndex - 1);
        resetAutoRotate();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(currentIndex + 1);
        resetAutoRotate();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToSlide(parseInt(this.getAttribute('data-index')));
        resetAutoRotate();
      });
    });

    function startAutoRotate() {
      autoRotateInterval = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 5000);
    }
    function resetAutoRotate() {
      clearInterval(autoRotateInterval);
      startAutoRotate();
    }
    startAutoRotate();
  }

  /* ============================
     4. SCROLL REVEAL (Intersection Observer)
  ============================ */
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ============================
     5. CONTACT FORM VALIDATION
  ============================ */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var successMsg = contactForm.querySelector('.form-success');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });
      contactForm.querySelectorAll('.form-error').forEach(function (el) {
        el.classList.remove('show');
      });
      if (successMsg) successMsg.classList.remove('show');

      // Validate required fields
      var requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        var errorEl = field.parentElement.querySelector('.form-error');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (errorEl) errorEl.classList.add('show');
          isValid = false;
        } else {
          field.classList.remove('error');
          if (errorEl) errorEl.classList.remove('show');
        }
      });

      // Email format check
      var emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
          emailField.classList.add('error');
          var emailError = emailField.parentElement.querySelector('.form-error');
          if (emailError) {
            emailError.textContent = 'Please enter a valid email address.';
            emailError.classList.add('show');
          }
          isValid = false;
        }
      }

      if (isValid && successMsg) {
        successMsg.classList.add('show');
        contactForm.reset();
      }
    });
  }

  /* ============================
     6. INSURANCE ACCORDION (Services page)
  ============================ */
  var accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', function () {
        item.classList.toggle('active');
      });
    }
  });

  /* ============================
     7. ACTIVE NAV LINK HIGHLIGHTING
  ============================ */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navAnchors = document.querySelectorAll('.nav-links a');
  navAnchors.forEach(function (link) {
    var linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

});