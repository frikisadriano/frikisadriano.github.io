// Numéro WhatsApp au format international, sans "+" ni espaces.
// Bénin : numéros à 10 chiffres depuis 2024 (01 + ancien numéro à 8 chiffres).
const WHATSAPP = '2290168760508';

const waLink = (text) => `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// ----- Liens WhatsApp -----
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = waLink(a.dataset.waText);
  a.target = '_blank';
  a.rel = 'noopener';
});

// ----- Thème clair / sombre -----
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

const currentTheme = () => root.getAttribute('data-theme')
  || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

themeBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// ----- Menu mobile -----
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');

const closeMenu = () => {
  nav.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
};

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

// ----- En-tête au défilement et lien actif -----
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

// ----- Apparition au défilement -----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ----- Filtres des projets -----
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filters.forEach((b) => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });
    projects.forEach((p) => {
      p.hidden = cat !== 'tous' && p.dataset.category !== cat;
      if (!p.hidden) p.classList.add('is-visible');
    });
  });
});

// ----- Fenêtre de détail d'un projet -----
const modal = document.getElementById('project-modal');
const modalImg = modal.querySelector('.modal-img');

projects.forEach((project) => {
  project.querySelector('[data-open]').addEventListener('click', () => {
    const img = project.querySelector('.project-media img');
    const title = project.querySelector('h3').textContent;
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    document.getElementById('modal-kind').textContent = project.querySelector('.project-kind').textContent;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = project.querySelector('.project-body > p:not(.project-kind)').textContent;
    document.getElementById('modal-details').innerHTML = project.querySelector('.project-details').innerHTML;
    document.getElementById('modal-demo').href = waLink(`Bonjour Adriano, j'aimerais voir une démonstration du projet ${title}.`);
    modal.showModal();
  });
});

modal.querySelector('[data-close]').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});

// ----- Formulaire de contact -> WhatsApp -----
const form = document.getElementById('contact-form');
const formError = document.getElementById('form-error');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nom = data.get('nom').trim();
  const message = data.get('message').trim();

  if (!nom || !message) {
    formError.hidden = false;
    return;
  }
  formError.hidden = true;

  const text = `Bonjour Adriano, je suis ${nom}.\nType de projet : ${data.get('type')}\n\n${message}`;
  window.open(waLink(text), '_blank', 'noopener');
});

// ----- Année du pied de page -----
document.getElementById('year').textContent = new Date().getFullYear();
