/**
 * ===================================================================
 * HUI HUI GWAN — 回回館
 * Islamic & Korean Heritage Platform
 * Interactive Scripts + i18n Language System
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Preloader ────────────────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  });

  // Safety net: hide preloader after 3s regardless
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);

  // ─── i18n Language System ─────────────────────────────────────────
  const LANG_LABELS = { en: 'EN', tr: 'TR', ko: '한' };
  
  const langSwitcher = document.getElementById('langSwitcher');
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langCurrent = document.getElementById('langCurrent');
  const langOptions = document.querySelectorAll('.lang-option');

  let currentLang = localStorage.getItem('hhg-lang') || 'en';

  // Toggle dropdown
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langSwitcher.classList.toggle('open');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!langSwitcher.contains(e.target)) {
      langSwitcher.classList.remove('open');
    }
  });

  // Close dropdown on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      langSwitcher.classList.remove('open');
    }
  });

  // Switch language
  langOptions.forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.dataset.lang;
      if (lang === currentLang) {
        langSwitcher.classList.remove('open');
        return;
      }
      setLanguage(lang, true);
      langSwitcher.classList.remove('open');
    });
  });

  function setLanguage(lang, animate = false) {
    currentLang = lang;
    localStorage.setItem('hhg-lang', lang);
    document.documentElement.lang = lang;

    // Update button label
    langCurrent.textContent = LANG_LABELS[lang];

    // Update active state on options
    langOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    // Get all translatable elements
    const elements = document.querySelectorAll('[data-i18n]');
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');

    if (animate) {
      // Fade out → swap text → fade in
      elements.forEach(el => el.classList.add('i18n-fading'));
      
      setTimeout(() => {
        applyTranslations(elements, placeholders, lang);
        elements.forEach(el => el.classList.remove('i18n-fading'));
      }, 200);
    } else {
      applyTranslations(elements, placeholders, lang);
    }
  }

  function applyTranslations(elements, placeholders, lang) {
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = TRANSLATIONS[key];
      if (!translation) return;

      const text = translation[lang] || translation['en'];
      
      // Check if this element uses HTML content
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // Handle placeholder translations
    placeholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = TRANSLATIONS[key];
      if (!translation) return;
      el.placeholder = translation[lang] || translation['en'];
    });
  }

  // Apply saved language on load
  setLanguage(currentLang, false);

  // ─── Navbar Scroll Effect ─────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    // Navbar background on scroll
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load

  // ─── Back to Top ──────────────────────────────────────────────────
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Mobile Navigation Toggle ────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    
    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // ─── Active Nav Link on Scroll ────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = navLinks.querySelectorAll('a[href^="#"]');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 200;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinkElements.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ─── Scroll Reveal Animations ─────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a small delay based on the element's transition-delay style
        const delay = entry.target.style.transitionDelay || '0s';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Social Platform Tabs ─────────────────────────────────────────
  const tabButtons = document.querySelectorAll('.social-platform-tab');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Add a subtle animation to the social grid cards
      const socialCards = document.querySelectorAll('.social-card');
      socialCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, i * 80);
      });
    });
  });

  // ─── Gallery Lightbox ─────────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('[data-lightbox]');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ─── Newsletter Form ──────────────────────────────────────────────
  const newsletterForm = document.getElementById('newsletter-form');
  
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    
    // Visual feedback
    const btn = document.getElementById('newsletter-submit');
    const subscribedText = TRANSLATIONS['newsletter.subscribed'] 
      ? TRANSLATIONS['newsletter.subscribed'][currentLang] 
      : '✓ Subscribed!';
    const originalText = btn.textContent;
    btn.textContent = subscribedText;
    btn.style.background = 'linear-gradient(135deg, #2a7c6f, #1d5a50)';
    btn.style.color = '#f5f0e8';
    
    setTimeout(() => {
      btn.textContent = TRANSLATIONS['newsletter.submit'][currentLang] || 'Subscribe';
      btn.style.background = '';
      btn.style.color = '';
      newsletterForm.reset();
    }, 2500);
  });

  // ─── Smooth Anchor Scrolling ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── Parallax Effect on Hero ──────────────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const parallaxOffset = scrollY * 0.3;
      heroBg.style.transform = `translateY(${parallaxOffset}px)`;
      heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
    }
  }, { passive: true });

  // ─── Counter Animation (for future stat sections) ─────────────────
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      element.textContent = Math.floor(start + (target - start) * eased);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  };

  // ─── Image lazy loading fallback ──────────────────────────────────
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imgObserver.observe(img);
    });
  }

  // ─── Keyboard navigation helpers ─────────────────────────────────
  document.querySelectorAll('.gallery-item, .social-card').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  console.log(
    '%c回回館 Hui Hui Gwan %c— Where Islam Meets Korea',
    'background: #1a1f4b; color: #c9a84c; font-size: 16px; padding: 8px 12px; font-weight: bold; border-radius: 4px 0 0 4px;',
    'background: #2a7c6f; color: #f5f0e8; font-size: 16px; padding: 8px 12px; border-radius: 0 4px 4px 0;'
  );
});
