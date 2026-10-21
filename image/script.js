const header = document.querySelector('.header');
const burger = document.querySelector('.burger');

burger?.addEventListener('click', () => {
  header?.classList.toggle('open');
});
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => header?.classList.remove('open'));
});

// Reveal-on-scroll animation
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}

// EN / RU language switch. The selected language is saved in localStorage.
const languageToggle = document.getElementById('languageToggle');
const translatable = document.querySelectorAll('[data-en][data-ru]');

function setLanguage(language) {
  const lang = language === 'ru' ? 'ru' : 'en';
  document.documentElement.lang = lang;
  translatable.forEach(element => {
    element.textContent = element.dataset[lang];
  });
  if (languageToggle) {
    languageToggle.textContent = lang === 'en' ? 'RU' : 'EN';
    languageToggle.setAttribute('aria-label', lang === 'en' ? 'Switch language to Russian' : 'Переключить язык на английский');
    languageToggle.title = lang === 'en' ? 'Switch to Russian' : 'Switch to English';
  }
  try { localStorage.setItem('auri-language', lang); } catch (error) {}
}

let savedLanguage = 'en';
try { savedLanguage = localStorage.getItem('auri-language') || 'en'; } catch (error) {}
setLanguage(savedLanguage);
languageToggle?.addEventListener('click', () => {
  setLanguage(document.documentElement.lang === 'en' ? 'ru' : 'en');
});

// Drag to scroll gallery with mouse; native touch scrolling remains enabled.
const gallery = document.querySelector('.gallery');
let dragging = false;
let startX = 0;
let startScroll = 0;

gallery?.addEventListener('mousedown', event => {
  if (event.target.closest('button')) return;
  dragging = true;
  startX = event.pageX;
  startScroll = gallery.scrollLeft;
});
window.addEventListener('mouseup', () => { dragging = false; });
gallery?.addEventListener('mouseleave', () => { dragging = false; });
gallery?.addEventListener('mousemove', event => {
  if (!dragging) return;
  event.preventDefault();
  gallery.scrollLeft = startScroll - (event.pageX - startX) * 1.35;
});

// Add shape classes based on each artwork's natural proportions.
document.querySelectorAll('.art img').forEach(img => {
  const markShape = () => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    const card = img.closest('.art');
    card?.classList.add(ratio > 1.15 ? 'landscape' : ratio < 0.85 ? 'portrait' : 'square');
  };
  if (img.complete) markShape();
  else img.addEventListener('load', markShape, { once: true });
});

// Lightbox gallery: arrows, keyboard controls and swipe.
const lightbox = document.getElementById('lightbox');
const bigImage = document.getElementById('big');
const count = document.getElementById('count');
const works = [...document.querySelectorAll('.art img')];
let current = 0;

function showWork(index) {
  if (!works.length || !lightbox || !bigImage || !count) return;
  current = (index + works.length) % works.length;
  const image = works[current];
  bigImage.src = image.src;
  bigImage.alt = image.alt;
  count.textContent = `ART ${String(current + 1).padStart(2, '0')} / ${works.length}`;
  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  if (!lightbox || !bigImage) return;
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
  bigImage.src = '';
  document.body.classList.remove('lightbox-open');
}

works.forEach((image, index) => {
  image.closest('.art-open')?.addEventListener('click', () => showWork(index));
});
document.getElementById('close')?.addEventListener('click', closeLightbox);
document.getElementById('prev')?.addEventListener('click', () => showWork(current - 1));
document.getElementById('next')?.addEventListener('click', () => showWork(current + 1));
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', event => {
  if (!lightbox?.classList.contains('show')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showWork(current - 1);
  if (event.key === 'ArrowRight') showWork(current + 1);
});

let touchStartX = 0;
lightbox?.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });
lightbox?.addEventListener('touchend', event => {
  const difference = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(difference) > 50) showWork(current + (difference < 0 ? 1 : -1));
}, { passive: true });
