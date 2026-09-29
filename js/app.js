import * as auth from './auth.js';
import * as store from './store.js';
import * as content from './content.js';
import { toast } from './ui.js';
import { APP_NAME, GOOGLE_LOGIN_ENABLED } from './config.js';
import * as home from './views/home.js';
import * as learn from './views/learn.js';
import * as lesson from './views/lesson.js';
import * as vocabView from './views/vocab.js';
import * as vocab from './vocab.js';
import * as profile from './views/profile.js';
import * as quiz from './views/quiz.js';
import * as play from './views/play.js';
import * as ranking from './views/ranking.js';
import * as room from './views/room.js';
import * as trip from './views/trip.js';
import * as shop from './views/shop.js';
import * as kids from './views/kids.js';
import * as speakView from './views/speak.js';
import * as plan from './views/plan.js';

const $ = (sel) => document.querySelector(sel);

const ROUTES = [
  { re: /^#?\/?(inicio)?$/, nav: 'inicio', title: 'Início', view: home },
  { re: /^#\/aprender$/, nav: 'aprender', title: 'Aprender', view: learn, noRefresh: true, params: () => ({}) },
  { re: /^#\/aprender\/chefao\/([\w-]+)(?:\?\d*)?$/, nav: 'aprender', title: 'Chefão', view: learn, focusless: true, params: (m) => ({ boss: m[1] }) },
  { re: /^#\/licao\/([\w-]+)$/, nav: 'aprender', title: 'Lição', view: lesson, params: (m) => ({ id: m[1] }) },
  { re: /^#\/vocabulario$/, nav: 'vocabulario', title: 'Vocabulário', view: vocabView, params: () => ({ mode: 'index' }) },
  { re: /^#\/vocabulario\/([\w-]+)$/, nav: 'vocabulario', title: 'Vocabulário', view: vocabView, params: (m) => ({ mode: 'category', cat: m[1] }) },
  { re: /^#\/vocabulario\/([\w-]+)\/estudar(?:\?\d*)?$/, nav: 'vocabulario', title: 'Estudar palavras', view: vocabView, focusless: true, params: (m) => ({ mode: 'study', cat: m[1] }) },
  { re: /^#\/revisao(?:\?\d*)?$/, nav: 'revisao', title: 'Revisão', view: quiz, focusless: true, params: () => ({ mode: 'review' }) },
  { re: /^#\/quiz\/([\w-]+)(?:\?\d*)?$/, nav: 'jogar', title: 'Quiz', view: quiz, focusless: true, params: (m) => ({ mode: 'category', cat: m[1] }) },
  { re: /^#\/viagem$/, nav: 'viagem', title: 'Destinos', view: trip, noRefresh: true, params: () => ({}) },
  { re: /^#\/viagem\/([\w-]+)$/, nav: 'viagem', title: 'Mapa da viagem', view: trip, noRefresh: true, params: (m) => ({ trip: m[1] }) },
  { re: /^#\/passaporte(?:\?([\w-]*))?$/, nav: 'viagem', title: 'Passaporte', view: trip, params: (m) => ({ passport: m[1] || true }) },
  { re: /^#\/loja$/, nav: 'perfil', title: 'Lojinha do Kiko', view: shop },
  { re: /^#\/kids$/, nav: 'jogar', title: 'Área Kids', view: kids, params: () => ({}) },
  { re: /^#\/kids\/([\w-]+)$/, nav: 'jogar', title: 'Área Kids', view: kids, params: (m) => ({ cat: m[1] }) },
  { re: /^#\/kids\/([\w-]+)\/(ouvir|memoria)(?:\?\d*)?$/, nav: 'jogar', title: 'Área Kids', view: kids, focusless: true, params: (m) => ({ cat: m[1], game: m[2] }) },
  { re: /^#\/fala$/, nav: 'jogar', title: 'Treino de fala', view: speakView, params: () => ({}) },
  { re: /^#\/fala\/([\w-]+)$/, nav: 'jogar', title: 'Treino de fala', view: speakView, params: (m) => ({ sit: m[1] }) },
  { re: /^#\/fala\/([\w-]+)\/(treino|s\d+)(?:\?\d*)?$/, nav: 'jogar', title: 'Treino de fala', view: speakView, focusless: true, params: (m) => ({ sit: m[1], mode: m[2] }) },
  { re: /^#\/plano(?:#[\w-]*)?$/, nav: 'inicio', title: 'Meu plano', view: plan },
  { re: /^#\/viagem\/([\w-]+)\/([\w-]+)(?:\?\d*)?$/, nav: 'viagem', title: 'Viagem', view: trip, focusless: true, params: (m) => ({ trip: m[1], chapter: m[2] }) },
  { re: /^#\/jogar$/, nav: 'jogar', title: 'Jogar', view: play },
  { re: /^#\/ranking$/, nav: 'ranking', title: 'Ranking', view: ranking, noRefresh: true },
  { re: /^#\/sala$/, nav: 'jogar', title: 'Sala de quiz', view: room, noRefresh: true, params: () => ({}) },
  { re: /^#\/sala\/([A-Z0-9]{4,6})$/, nav: 'jogar', title: 'Sala de quiz', view: room, focusless: true, params: (m) => ({ code: m[1] }) },
  { re: /^#\/perfil$/, nav: 'perfil', title: 'Perfil', view: profile },
];

let user = null;
let cleanup = null;
let recovering = false;
let renderCount = 0;

function currentRoute() {
  const hash = location.hash || '#/inicio';
  for (const r of ROUTES) {
    const m = hash.match(r.re);
    if (m) return { route: r, params: r.params ? r.params(m) : {} };
  }
  return null;
}

function renderRoute() {
  if (!user) return;
  const found = currentRoute();
  if (!found) { location.hash = '#/inicio'; return; }
  const { route, params } = found;
  const view = $('#view');

  if (typeof cleanup === 'function') cleanup();
  cleanup = null;
  const myRender = ++renderCount;
  const result = route.view.render(view, { ...params, user });
  if (result && typeof result.then === 'function') {
    // Telas que baixam dados: só guarda a limpeza se ninguém navegou nesse meio-tempo.
    result.then((fn) => {
      if (typeof fn !== 'function') return;
      if (myRender === renderCount) cleanup = fn; else fn();
    });
  } else {
    cleanup = result || null;
  }

  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === route.nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = `${route.title} · ${APP_NAME}`;
  window.scrollTo(0, 0);

  const h1 = view.querySelector('h1');
  if (h1 && route.view !== lesson && !route.focusless) {
    h1.setAttribute('tabindex', '-1');
    h1.focus({ preventScroll: true });
  }
}

// ---------- Tela de acesso ----------

function hideBoot() {
  const b = $('#boot');
  if (b) b.remove();
}

function showAuth(panel = 'login') {
  hideBoot();
  $('#app-shell').hidden = true;
  $('#auth-screen').hidden = false;
  showPanel(panel);
}

function showPanel(name) {
  document.querySelectorAll('[data-panel]').forEach((el) => { el.hidden = el.dataset.panel !== name; });
  setAuthMessage('');
}

function setAuthMessage(text, kind = 'info') {
  const el = $('#auth-message');
  el.textContent = text;
  el.className = `auth-message ${kind}`;
}

async function withBusy(form, fn) {
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  try { await fn(); }
  catch (err) { setAuthMessage(auth.translateError(err), 'error'); }
  finally { btn.disabled = false; }
}

function wireAuthForms() {
  document.querySelectorAll('[data-toggle-pass]').forEach((b) => b.addEventListener('click', () => {
    const input = document.getElementById(b.dataset.togglePass);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    b.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  }));
  if (GOOGLE_LOGIN_ENABLED) {
    document.querySelectorAll('[data-google], [data-google-block]').forEach((el) => { el.hidden = false; });
    $('[data-google]').addEventListener('click', async () => {
      try { await auth.signInWithGoogle(); } catch (err) { setAuthMessage(auth.translateError(err), 'error'); }
    });
  }
  document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => showPanel(b.dataset.go)));

  $('#form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    withBusy(f, async () => {
      setAuthMessage('Entrando…');
      await auth.signIn(f.email.value.trim(), f.password.value, f.remember.checked);
    });
  });

  $('#form-signup').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    withBusy(f, async () => {
      setAuthMessage('Criando sua conta…');
      const needsConfirm = await auth.signUp(f.nome.value.trim(), f.email.value.trim(), f.password.value);
      if (needsConfirm) setAuthMessage('Conta criada! Abra o e-mail de confirmação que enviamos e depois volte para entrar.', 'ok');
    });
  });

  $('#form-forgot').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    withBusy(f, async () => {
      await auth.sendPasswordReset(f.email.value.trim());
      setAuthMessage('Pronto! Enviamos um link para você criar uma nova senha.', 'ok');
    });
  });

  $('#form-newpass').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    withBusy(f, async () => {
      await auth.updatePassword(f.password.value);
      recovering = false;
      toast('Senha alterada!');
      const session = await auth.getSession();
      if (session) enterApp(session.user);
    });
  });
}

// ---------- Entrada no app ----------

async function enterApp(u) {
  const switching = !user || user.id !== u.id;
  user = u;
  const shellVisible = !$('#app-shell').hidden;
  // Renovação de token etc. não deve redesenhar a tela (perderia a lição em andamento).
  if (!switching && shellVisible) return;
  if (switching) store.load(u.id, auth.displayNameFrom(u));
  hideBoot();
  $('#auth-screen').hidden = true;
  $('#app-shell').hidden = false;
  renderRoute();
  if (switching) {
    await store.pull();
    const r = currentRoute();
    if (r && r.route.view !== lesson && !r.route.focusless && !r.route.noRefresh) renderRoute();
  }
}

function leaveApp() {
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;
  user = null;
  store.unload();
  $('#view').innerHTML = '';
  showAuth('login');
}

async function start() {
  wireAuthForms();

  try {
    await Promise.all([content.loadCourse(), vocab.loadCategories()]);
  } catch (e) {
    setAuthMessage('Não foi possível carregar as lições. Verifique a internet e recarregue a página.', 'error');
  }

  try {
    auth.sb();
    await auth.applyRememberChoice();
  } catch (e) {
    showAuth('login');
    setAuthMessage(auth.translateError(e), 'error');
    return;
  }

  auth.onAuthChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') { recovering = true; showAuth('newpass'); return; }
    if (session && session.user) { if (!recovering) enterApp(session.user); }
    else if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') leaveApp();
  });

  window.addEventListener('hashchange', renderRoute);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') store.sync(); });
}

start();
