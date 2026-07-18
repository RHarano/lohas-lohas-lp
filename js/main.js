// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Header scrolled state（下層ページは .static で常時ソリッド）
const header = document.getElementById('header');
if (header && !header.classList.contains('static')) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll); onScroll();
}

// Mobile nav
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
if (nav && toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); toggle.classList.remove('open');
  }));
}

// Plan modal（トップページのみ）
const modal = document.getElementById('planModal');
const openPlan = document.getElementById('openPlan');
if (modal && openPlan) {
  const openModal = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
  const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };
  openPlan.addEventListener('click', openModal);
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
