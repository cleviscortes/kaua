/* ========================================================
   KAUÃ PRATES — MAIN JAVASCRIPT
   Handles: Preloader, Navbar, Scroll Animations,
   Gallery Filter, Lightbox, Mobile Menu, Parallax
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---- PRELOADER ----
  const preloader = document.getElementById('preloader');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      
      // Trigger hero animations after preloader
      setTimeout(triggerHeroAnimations, 200);
    }, 2000);
  });

  // Fallback: remove preloader after 4s even if load event doesn't fire
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      triggerHeroAnimations();
    }
  }, 4000);

  // ---- HERO ANIMATIONS ----
  function triggerHeroAnimations() {
    const animateElements = document.querySelectorAll('.animate-in');
    animateElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 200);
    });
  }

  // ---- NAVBAR SCROLL EFFECT ----
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---- MOBILE MENU ----
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // ---- SMOOTH SCROLL FOR NAV LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- SCROLL REVEAL ANIMATIONS ----
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- GALLERY FILTER ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ---- LIGHTBOX ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentImageIndex = 0;
  let visibleImages = [];

  function updateVisibleImages() {
    visibleImages = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
  }

  function openLightbox(index) {
    updateVisibleImages();
    currentImageIndex = index;
    const item = visibleImages[currentImageIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title');

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = title ? title.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function navigateLightbox(direction) {
    updateVisibleImages();
    currentImageIndex = (currentImageIndex + direction + visibleImages.length) % visibleImages.length;
    const item = visibleImages[currentImageIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title');

    lightboxImage.style.opacity = 0;
    setTimeout(() => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = title ? title.textContent : '';
      lightboxImage.style.opacity = 1;
    }, 200);
  }

  // Attach click events to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateVisibleImages();
      const visibleIndex = visibleImages.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Close lightbox when clicking outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ---- PARALLAX EFFECT ----
  const parallaxBg = document.querySelector('.parallax-bg');

  if (parallaxBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const section = parallaxBg.closest('.section');
      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
        const yPos = (scrolled - sectionTop) * 0.3;
        parallaxBg.style.transform = `translateY(${yPos}px)`;
      }
    }, { passive: true });
  }

  // ---- ACTIVE NAV LINK ON SCROLL ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function setActiveNavLink() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });

  // ---- MOUSE CURSOR EFFECT ON HERO ----
  const hero = document.getElementById('hero');
  
  if (hero && window.innerWidth > 1024) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = hero;
      
      const x = (clientX / offsetWidth - 0.5) * 10;
      const y = (clientY / offsetHeight - 0.5) * 10;
      
      const heroImg = hero.querySelector('.hero-img');
      if (heroImg) {
        heroImg.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
      }
    });

    hero.addEventListener('mouseleave', () => {
      const heroImg = hero.querySelector('.hero-img');
      if (heroImg) {
        heroImg.style.transform = 'scale(1.05)';
        heroImg.style.transition = 'transform 0.5s ease';
      }
    });
  }

  // ---- COUNTER ANIMATION (for stat numbers) ----
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        if (isNaN(target)) return;

        let current = 0;
        const increment = target / 60;
        const duration = 2000;
        const stepTime = duration / 60;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = el.textContent.startsWith('#') ? `#${target}` : target;
            clearInterval(timer);
          } else {
            el.textContent = el.textContent.startsWith('#') ? `#${Math.floor(current)}` : Math.floor(current);
          }
        }, stepTime);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // ---- DYNAMIC YEAR IN FOOTER ----
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace('2026', currentYear);
  }
});
