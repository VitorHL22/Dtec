// ---------- Helpers ----------
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

// Smooth scroll helper
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 60, behavior: 'smooth' });
}

/* ---------- HERO CTA ---------- */
document.getElementById('saibaMais').addEventListener('click', (e) => {
  e.preventDefault();
  smoothScrollTo('#guia');
});

/* ---------- TABS (filtragem dinâmica) ---------- */
const tabs = qsa('.tab');
const cards = qsa('.card');

function setActiveTab(tabEl) {
  tabs.forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  const filter = tabEl.dataset.filter;
  // mostrar os cards correspondentes
  cards.forEach(card => {
    if (card.dataset.type === filter) {
      card.classList.remove('hidden');
      card.setAttribute('aria-hidden', 'false');
    } else {
      card.classList.add('hidden');
      card.setAttribute('aria-hidden', 'true');
    }
  });
}

tabs.forEach(t => {
  t.addEventListener('click', () => setActiveTab(t));
});

// Inicial: mostrar plástico (já com classe no HTML)
setActiveTab(document.querySelector('.tab.active'));

/* ---------- LOGIN MODAL ---------- */
const loginModal = qs('#loginModal');
const openLogin = qs('#openLogin');
const closeLogin = qs('#closeLogin');
const cancelLogin = qs('#cancelLogin');
const loginForm = qs('#loginForm');
const loginMsg = qs('#loginMsg');

function openModal(modal) {
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openLogin.addEventListener('click', () => openModal(loginModal));
closeLogin.addEventListener('click', () => closeModal(loginModal));
cancelLogin.addEventListener('click', () => closeModal(loginModal));
loginModal.addEventListener('click', (ev) => {
  if (ev.target === loginModal) closeModal(loginModal);
});

// Validação simples e mensagem
loginForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const user = loginForm.user.value.trim();
  const pass = loginForm.pass.value.trim();
  if (user.length >= 1 && pass.length >= 4) {
    loginMsg.textContent = 'Login simulado realizado com sucesso. (Sem backend)';
    loginMsg.style.color = 'green';
    setTimeout(()=> closeModal(loginModal), 900);
  } else {
    loginMsg.textContent = 'Usuário ou senha inválidos (mínimo 4 caracteres).';
    loginMsg.style.color = 'crimson';
  }
});

/* ---------- PONTOS DE COLETA MODAL ---------- */
const pointsModal = qs('#pointsModal');
const openPoints = qs('#openPoints');
const closePoints = qs('#closePoints');

openPoints.addEventListener('click', () => openModal(pointsModal));
closePoints.addEventListener('click', () => closeModal(pointsModal));
pointsModal.addEventListener('click', (ev) => { if (ev.target === pointsModal) closeModal(pointsModal); });

/* ---------- Small UI niceties: lazy fade-in of cards when visible ---------- */
function revealOnScroll() {
  const revealElems = qsa('.card:not(.hidden)');
  const windowBottom = window.innerHeight;
  revealElems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowBottom - 50) {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    } else {
      el.style.opacity = 0;
      el.style.transform = 'translateY(12px)';
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('resize', revealOnScroll);
document.addEventListener('DOMContentLoaded', revealOnScroll);

/* ---------- Accessibility: keyboard close modals with Escape ---------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal(loginModal);
    closeModal(pointsModal);
  }
});
