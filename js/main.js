// JSが動く環境でのみアニメーション用の初期状態を適用する（JS無効時に本文が消えないように）
document.documentElement.classList.add('js');

// Scroll reveal
// threshold は 0、rootMargin は 0 にする。
//  - 閾値を上げると、ビューポートより背の高い要素は可視割合が
//    (ビューポート高 / 要素高) を超えられず、永久に発火しない
//  - rootMargin で下端を削ると、ページ最下部の要素が発火しない
const reveals = [...document.querySelectorAll('.reveal')];
const show = el => el.classList.add('is-visible');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { threshold: 0 });
  reveals.forEach(el => io.observe(el));

  // 保険: 一気にスクロールされると IntersectionObserver が
  // 通過した要素を取りこぼすことがあるため、画面より上に来た要素は
  // スクロールのたびに表示させる（本文が読めないまま残るのを防ぐ）
  let ticking = false;
  const sweep = () => {
    ticking = false;
    for (let i = reveals.length - 1; i >= 0; i--) {
      const el = reveals[i];
      if (el.classList.contains('is-visible')) { reveals.splice(i, 1); continue; }
      if (el.getBoundingClientRect().top < innerHeight) { show(el); io.unobserve(el); reveals.splice(i, 1); }
    }
    if (!reveals.length) removeEventListener('scroll', onScrollSweep);
  };
  const onScrollSweep = () => { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } };
  addEventListener('scroll', onScrollSweep, { passive: true });
  addEventListener('resize', onScrollSweep, { passive: true });
} else {
  // 非対応環境ではアニメーションを諦めて、本文を確実に表示する
  reveals.forEach(show);
}

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
