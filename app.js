const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopHeaderQuery = window.matchMedia('(min-width: 741px)');

function syncResponsiveHeader() {
  const header = document.querySelector('.site-header');
  if (desktopHeaderQuery.matches) header.setAttribute('hidden', '');
  else header.removeAttribute('hidden');
}

syncResponsiveHeader();
desktopHeaderQuery.addEventListener('change', syncResponsiveHeader);

window.addEventListener('load', () => {
  const previewSection = new URLSearchParams(window.location.search).get('section');
  const selector = previewSection ? `#${previewSection}` : window.location.hash;
  if (!selector) return;
  const target = document.querySelector(selector);
  if (target) window.setTimeout(() => target.scrollIntoView({ block: 'start' }), 80);
});

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? 'Close' : 'Menu';
}

menuButton.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const workVideos = document.querySelectorAll('.work-card video');
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !reducedMotion) entry.target.play().catch(() => {});
    else entry.target.pause();
  });
}, { rootMargin: '-15% 0px -15%', threshold: 0.2 });
workVideos.forEach((video) => videoObserver.observe(video));

const showreel = document.querySelector('.showreel video');
const toggle = document.querySelector('[data-video-toggle]');
toggle.addEventListener('click', () => {
  if (showreel.paused) {
    showreel.play().catch(() => {});
    toggle.textContent = 'Ⅱ';
    toggle.setAttribute('aria-label', 'Pause showreel');
  } else {
    showreel.pause();
    toggle.textContent = '▶';
    toggle.setAttribute('aria-label', 'Play showreel');
  }
});

const cursor = document.querySelector('.cursor-dot');
if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursor.style.opacity = '1';
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const projectData = {
  fnb: {
    index: '01',
    category: 'F&B',
    title: 'Food that moves.',
    client: 'One Stop · Gota',
    services: 'Strategy · Food film · Social',
    video: '/media/d52bb18e55cc3d9dbb8885b1.mp4',
    poster: '/media/ff3ccab4b45526e4d7faf9ec.jpg',
    description: 'From the first pour to the final bite, we make food and beverage content feel immediate. Bold concepts, appetite-led filmmaking and social systems designed to turn attention into action.'
  },
  campaigns: {
    index: '02',
    category: 'Brand campaigns',
    title: 'Big ideas. Built to travel.',
    client: 'Trendy campaign partners',
    services: 'Concept · Production · Rollout',
    video: '/media/cc0d02b5722e10acb1516583.mp4',
    poster: '/assets/hero-doha.png',
    description: 'A single sharp idea, carried across every format. We shape campaign platforms, direct the production and build the social rollout so each launch lands as one connected story.'
  },
  corporate: {
    index: '03',
    category: 'Corporate',
    title: 'Driven by detail.',
    client: 'Denza Qatar',
    services: 'Story · Film · Campaign content',
    video: '/media/350e255be2226ad4e771ed2e.mp4',
    poster: '/media/88dbb2a3a602efe9f30eace6.jpg',
    description: 'Corporate does not have to feel corporate. We translate product, people and purpose into confident films and social content with clarity, pace and character.'
  },
  lifestyle: {
    index: '04',
    category: 'Lifestyle',
    title: 'Culture, styled forward.',
    client: 'Sada',
    services: 'Art direction · Film · Social',
    video: '/media/eb5aa81baf629d2062c653db.mp4',
    poster: '/media/51b58e4573abca07c7c8800b.jpg',
    description: 'Editorial art direction meets the pace of social. We build visually distinct worlds for fashion, hospitality and lifestyle brands while keeping every frame rooted in local culture.'
  }
};

const projectOverlay = document.querySelector('[data-project-overlay]');
const drawerVideo = document.querySelector('[data-drawer-video]');
const drawerMedia = document.querySelector('.drawer-media');
const drawerDual = document.querySelector('.drawer-dual');
let projectTrigger = null;

function closeProject() {
  projectOverlay.classList.remove('open');
  projectOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
  drawerVideo.pause();
  if (projectTrigger) projectTrigger.focus({ preventScroll: true });
}

function openProject(key, trigger) {
  const project = projectData[key];
  if (!project) return;
  projectTrigger = trigger;
  document.querySelector('[data-drawer-index]').textContent = project.index;
  document.querySelector('[data-drawer-category]').textContent = project.category;
  document.querySelector('[data-drawer-title]').textContent = project.title;
  document.querySelector('[data-drawer-client]').textContent = project.client;
  document.querySelector('[data-drawer-services]').textContent = project.services;
  document.querySelector('[data-drawer-description]').textContent = project.description;
  const isDual = key === 'fnb';
  drawerMedia.classList.toggle('is-dual', isDual);
  drawerDual.setAttribute('aria-hidden', String(!isDual));
  drawerMedia.style.setProperty('--poster', `url('${project.poster}')`);
  if (isDual) {
    drawerVideo.pause();
    drawerVideo.removeAttribute('src');
    drawerVideo.load();
  } else {
    drawerVideo.poster = project.poster;
    drawerVideo.src = project.video;
  }
  projectOverlay.classList.add('open');
  projectOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
  projectOverlay.querySelector('.drawer-close').focus();
  if (!isDual && !reducedMotion) drawerVideo.play().catch(() => {});
}

document.querySelectorAll('[data-project]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openProject(trigger.dataset.project, trigger);
  });
});
document.querySelectorAll('[data-project-close]').forEach((button) => button.addEventListener('click', closeProject));
document.addEventListener('keydown', (event) => {
  if (!projectOverlay.classList.contains('open')) return;
  if (event.key === 'Escape') closeProject();
  if (event.key === 'Tab') {
    const focusable = [...projectOverlay.querySelectorAll('button, a[href]')].filter((element) => !element.hasAttribute('disabled'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const initialProject = new URLSearchParams(window.location.search).get('project');
if (projectData[initialProject]) {
  window.addEventListener('load', () => openProject(initialProject, document.querySelector(`[data-project="${initialProject}"]`)));
}
