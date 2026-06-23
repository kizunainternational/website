const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id], header[id]');
const CONTACT_EMAIL = 'contact@kizunainternational.edu.np';

let testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const track = document.getElementById('testimonialTrack');
const dotsWrap = document.getElementById('testimonialDots');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');

const dailyTestimonials = [
  {
    name: 'Asmita Khadka',
    image: 'assets/review/asmita_khadka.jpeg',
    quote:
      'Kizuna International made my dream of studying in Japan possible. They guided me through every step, from language preparation to documentation. The entire process felt smooth and stress-free.',
  },
  {
    name: 'Babin Shahi',
    image: 'assets/review/babin_shahi.jpeg',
    quote:
      'I was confused about the application process at first, but the team explained everything clearly. Their support and timely guidance gave me confidence throughout the journey.',
  },
  {
    name: 'Bibek Thapa',
    image: 'assets/review/bibek_thapa.jpeg',
    quote:
      'The Japanese language classes were excellent. The instructors were patient and always willing to help. I improved my communication skills much faster than I expected.',
  },
  {
    name: 'Birendra Singh',
    image: 'assets/review/birendra_singh.jpeg',
    quote:
      'What impressed me most was their professionalism. Every question I had was answered promptly, and I always felt supported.',
  },
  {
    name: 'Chandan Pandit',
    image: 'assets/review/chandan_pandit.jpeg',
    quote:
      'Kizuna International helped me prepare for interviews and documentation. Their advice was practical and extremely useful.',
  },
  {
    name: 'Ganga Ram Bhul',
    image: 'assets/review/ganga_ram_bhul.jpeg',
    quote:
      'The counselors genuinely cared about my goals. They took the time to understand my situation and recommended the best options for me.',
  },
  {
    name: 'Naworaj Katuwal',
    image: 'assets/review/naworaj_katuwal.jpeg',
    quote:
      'I highly recommend Kizuna International to anyone interested in opportunities in Japan. Their team made the process straightforward and easy to understand.',
  },
  {
    name: 'Pradhumna Khadka',
    image: 'assets/review/pradhumna_khadka.jpeg',
    quote:
      'From the first consultation to the final application stage, everything was handled efficiently. I appreciated their attention to detail.',
  },
  {
    name: 'Rupa Karki',
    image: 'assets/review/rupa_karki.jpeg',
    quote:
      'The staff were friendly, knowledgeable, and always available when I needed assistance. Their guidance made a huge difference.',
  },
  {
    name: 'Sachyam Tandukar',
    image: 'assets/review/sachyam_tandukar.jpeg',
    quote:
      'I gained not only language skills but also valuable insights into Japanese culture. The learning environment was supportive and engaging.',
  },
  {
    name: 'Sarmista Aryal',
    image: 'assets/review/sarmista_aryal.jpeg',
    quote:
      'The documentation process seemed overwhelming at first, but Kizuna International helped me organize everything correctly and on time.',
  },
  {
    name: 'Sohani Kumar Sah',
    image: 'assets/review/sohani_kumar_sah.jpeg',
    quote:
      'Their step-by-step guidance reduced a lot of stress. I felt confident because I always knew what the next stage would be.',
  },
  {
    name: 'Sony Tamang',
    image: 'assets/review/sony_tamang.jpeg',
    quote:
      'The instructors encouraged us to keep improving and never gave up on us. Their dedication was truly inspiring.',
  },
  {
    name: 'Sujan Tamang',
    image: 'assets/review/sujan_tamang.jpeg',
    quote:
      'I appreciate how transparent and honest they were throughout the entire process. There were no surprises, and everything was explained clearly.',
  },
  {
    name: 'Susmita Basnet',
    image: 'assets/review/susmita_basnet.jpeg',
    quote:
      'Thanks to Kizuna International, I was able to move forward with my plans for Japan. Their support, expertise, and encouragement were invaluable.',
  },
];

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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[char];
  });
}

function getNepalDayNumber(date = new Date()) {
  const { year, month, day } = getNepalDateParts(date);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function setupDailyTestimonials() {
  const dailyTrack = document.querySelector('[data-daily-testimonials]');
  if (!dailyTrack || dailyTestimonials.length === 0) {
    return;
  }

  const groupSize = 3;
  const groupCount = Math.ceil(dailyTestimonials.length / groupSize);
  const groupIndex = getNepalDayNumber() % groupCount;
  const selectedTestimonials = dailyTestimonials.slice(groupIndex * groupSize, groupIndex * groupSize + groupSize);

  dailyTrack.innerHTML = selectedTestimonials
    .map(
      (testimonial) => `
        <article class="testimonial-card active">
          <div class="student">
            <div class="avatar student-photo">
              <img src="${escapeHtml(testimonial.image)}" alt="${escapeHtml(testimonial.name)}" loading="lazy" />
            </div>
            <div>
              <h3>${escapeHtml(testimonial.name)}</h3>
            </div>
            <div class="review-stars" aria-label="Rated 5 out of 5 stars">★★★★★</div>
          </div>
          <p>${escapeHtml(testimonial.quote)}</p>
        </article>
      `
    )
    .join('');

  testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
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
          const siblings = Array.from(entry.target.parentElement?.children || []).filter((el) =>
            el.hasAttribute('data-animate')
          );
          const order = Math.max(0, siblings.indexOf(entry.target));
          entry.target.style.transitionDelay = `${Math.min(order, 8) * 90}ms`;
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
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
  const botFields = form.querySelectorAll('.botcheck, .honeypot');

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
    const isBot = Array.from(botFields).some((field) => {
      if (field.type === 'checkbox') {
        return field.checked;
      }

      return field.value.trim() !== '';
    });

    if (isBot) {
      event.preventDefault();
      setStatus('Your inquiry could not be submitted.', 'error');
      return;
    }

    const key = accessKeyInput ? accessKeyInput.value.trim() : '';
    const missingKey = !key || key.includes('YOUR_WEB3FORMS_ACCESS_KEY');

    if (missingKey) {
      event.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name') || '';
      const phone = formData.get('phone') || '';
      const email = formData.get('email') || '';
      const message = formData.get('message') || '';
      const body = [
        `Full Name: ${name}`,
        `Phone / WhatsApp: ${phone}`,
        `Email: ${email}`,
        '',
        'Message:',
        message,
      ].join('\n');

      setStatus('Opening your email app to send this inquiry...', 'success');
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Study in Japan Inquiry')}&body=${encodeURIComponent(body)}`;
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

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox || !lightboxImg) {
    return;
  }

  const openTargets = document.querySelectorAll(
    '.coe-card:not([aria-hidden="true"]), .photo-grid figure'
  );

  openTargets.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (!img) {
        return;
      }
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setHeaderState();
  setActiveNavLink();
  setupDailyTestimonials();
  setupRevealAnimations();
  setupContactForm();
  setupDynamicDates();
  setupLightbox();

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
