const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id], header[id]');

const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const track = document.getElementById('testimonialTrack');
const dotsWrap = document.getElementById('testimonialDots');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');

let activeIndex = 0;
let autoTimer;

function setHeaderState() {
  if (!header) {
    return;
  }
  header.classList.toggle('scrolled', window.scrollY > 12);
}

function toggleMenu(forceClose = false) {
  if (!menuToggle || !primaryNav) {
    return;
  }

  const shouldOpen = forceClose ? false : !primaryNav.classList.contains('open');
  primaryNav.classList.toggle('open', shouldOpen);
  menuToggle.setAttribute('aria-expanded', String(shouldOpen));
}

function closeMenuOnDesktop() {
  if (window.innerWidth > 930) {
    toggleMenu(true);
  }
}

function setActiveNavLink() {
  const sectionLinks = Array.from(navLinks).filter((link) => link.getAttribute('href')?.startsWith('#'));

  if (sectionLinks.length === 0 || sections.length === 0) {
    return;
  }

  const scrollPoint = window.scrollY + header.offsetHeight + 60;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPoint >= top && scrollPoint < bottom) {
      sectionLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

function createDots() {
  if (!dotsWrap || testimonialCards.length === 0) {
    return;
  }

  testimonialCards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => {
      setSlide(index);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });
}

function updateDots() {
  const dots = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeIndex);
  });
}

function setSlide(index) {
  if (testimonialCards.length === 0) {
    return;
  }

  activeIndex = (index + testimonialCards.length) % testimonialCards.length;
  testimonialCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === activeIndex);
  });

  updateDots();
}

function nextSlide() {
  setSlide(activeIndex + 1);
}

function prevSlide() {
  setSlide(activeIndex - 1);
}

function startAutoplay() {
  if (testimonialCards.length <= 1) {
    return;
  }

  autoTimer = window.setInterval(() => {
    nextSlide();
  }, 5000);
}

function restartAutoplay() {
  window.clearInterval(autoTimer);
  startAutoplay();
}

function setupSliderInteractionPause() {
  if (!track) {
    return;
  }

  track.addEventListener('mouseenter', () => window.clearInterval(autoTimer));
  track.addEventListener('mouseleave', startAutoplay);
  track.addEventListener('focusin', () => window.clearInterval(autoTimer));
  track.addEventListener('focusout', startAutoplay);
}

function setupRevealAnimations() {
  const animatedItems = document.querySelectorAll('[data-animate]');

  if (!('IntersectionObserver' in window) || animatedItems.length === 0) {
    animatedItems.forEach((item) => item.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
  );

  animatedItems.forEach((item) => observer.observe(item));
}

function setupContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) {
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  const accessKeyInput = form.querySelector('input[name="access_key"]');

  const setStatus = (message, type = '') => {
    if (!status) {
      return;
    }

    status.textContent = message;
    status.classList.remove('success', 'error');
    if (type) {
      status.classList.add(type);
    }
  };

  form.addEventListener('submit', (event) => {
    const key = accessKeyInput ? accessKeyInput.value.trim() : '';
    const missingKey = !key || key.includes('YOUR_WEB3FORMS_ACCESS_KEY');

    if (missingKey) {
      event.preventDefault();
      setStatus('Form submission is not enabled yet.', 'error');
      return;
    }

    setStatus('Submitting your inquiry...', 'success');

    if (button) {
      button.textContent = 'Sending...';
      button.disabled = true;
    }
  });
}

function getNepalDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
    day: Number(parts.find((part) => part.type === 'day')?.value),
  };
}

function getNepalFiscalYear(date = new Date()) {
  const { year, month, day } = getNepalDateParts(date);
  const startsThisYear = month > 7 || (month === 7 && day >= 16);
  const startYear = year + (startsThisYear ? 57 : 56);
  const endYear = String((startYear + 1) % 100).padStart(2, '0');

  return `FY ${startYear}/${endYear}`;
}

function setupDynamicDates() {
  const { year } = getNepalDateParts();

  document.querySelectorAll('[data-current-year]').forEach((item) => {
    item.textContent = String(year);
  });

  document.querySelectorAll('[data-fiscal-year]').forEach((item) => {
    item.textContent = getNepalFiscalYear();
  });
}

window.addEventListener('scroll', () => {
  setHeaderState();
  setActiveNavLink();
});

window.addEventListener('resize', closeMenuOnDesktop);

document.addEventListener('DOMContentLoaded', () => {
  setHeaderState();
  setActiveNavLink();
  setupRevealAnimations();
  setupContactForm();
  setupDynamicDates();

  if (menuToggle) {
    menuToggle.addEventListener('click', () => toggleMenu());
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoplay();
    });
  }

  createDots();
  setSlide(0);
  startAutoplay();
  setupSliderInteractionPause();
});
