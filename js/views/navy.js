// Área Marinha ⚓: inglês naval com vocabulário do dia, temas, quiz
// e intercâmbio (conversas simuladas com militares de outras marinhas).
// Dados em data/navy.json, gerado por tools/make_navy.py.
import * as store from '../store.js';
import { icon } from '../icons.js';
import { esc, coinReward, plural } from '../ui.js';
import { speak, speakAccent, stopSpeech } from '../speech.js';
import { shuffle } from '../quiz-engine.js';
import NAVY_CSS from './navy-styles.js';

if (!document.getElementById('hf-navy-styles')) {
  const st = document.createElement('style');
  st.id = 'hf-navy-styles';
  st.textContent = NAVY_CSS;
  document.head.appendChild(st);
}

let data = null;
async function load() {
  if (data) return data;
  const r = await fetch('data/navy.json', { cache: 'no-cache' });
  if (!r.ok) throw new Error('navy');
  data = await r.json();
  data.all = data.categories.flatMap((c) => c.words.map((w) => ({ ...w, cat: c.id })));
  return data;
}

const failHtml = '<div class="card empty"><p>Não foi possível carregar a área Marinha. Abra o app uma vez com internet para ele ficar disponível offline.</p></div>';
const backTo = (href, label) => `<a class="back-link" href="${href}">${icon('back', 18)} ${label}</a>`;
const sayBtn = (text, label = 'Ouvir') => `<button type="button" class="nv-say" data-say="${esc(text)}" aria-label="${esc(label)}: ${esc(text)}">🔊</button>`;

// ---------- Vocabulário do dia ----------
// Ordem fixa embaralhada (mesma para todos) e um bloco novo por dia:
// em ~30 dias o aluno passa por todo o banco, depois recomeça.

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dayNumber(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(2025, 0, 1)) / 86400000);
}

function dailyWords(d, dateStr = store.today()) {
  const rnd = seeded(1808); // ano de criação dos Fuzileiros Navais
  const order = d.all.map((w) => ({ w, k: rnd() })).sort((a, b) => a.k - b.k).map((x) => x.w);
  const n = d.perDay || 10;
  const start = ((dayNumber(dateStr) * n) % order.length + order.length) % order.length;
  return Array.from({ length: n }, (_, i) => order[(start + i) % order.length]);
}

const dayKey = (dateStr = store.today()) => `navy.day.${dateStr}`;
const knownSet = () => new Set(store.getFlag('navy.known', []));

function navyStreak() {
  let n = 0;
  const d = new Date();
  if (!store.hasFlag(dayKey(store.today(d)))) d.setDate(d.getDate() - 1);
  while (store.hasFlag(dayKey(store.today(d)))) { n += 1; d.setDate(d.getDate() - 1); }
  return n;
}

function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ---------- Início da área ----------

async function renderHub(root) {
  let d;
  try { d = await load(); } catch (e) { root.innerHTML = failHtml; return null; }
  const today = store.today();
  const words = dailyWords(d);
  const done = store.getFlag(dayKey(today));
  const known = knownSet();
  const streak = navyStreak();
  const exDone = d.exchanges.filter((x) => store.getFlag(`navy.ex.${x.id}`)).length;
  const phrase = words.find((w) => w.ex.split(' ').length > 3) || words[0];

  root.innerHTML = `
    <div class="nv">
      <section class="nv-hero">
        <span class="nv-eyebrow">Inglês militar · Marinha</span>
        <h1>⚓ Inglês Naval</h1>
        <p>Vocabulário de bordo, rádio, manobra e cerimonial, todo dia um pouco. E um intercâmbio para conversar com militares de outras marinhas.</p>
        <div class="nv-badges">
          <span class="nv-badge">🔥 ${plural(streak, 'dia seguido', 'dias seguidos')}</span>
          <span class="nv-badge">📘 ${known.size}/${d.all.length} termos</span>
          <span class="nv-badge">🌍 ${exDone}/${d.exchanges.length} intercâmbios</span>
        </div>
      </section>

      <section class="card nv-day" aria-labelledby="nv-day-t">
        <div class="row-between"><h2 id="nv-day-t">📅 Vocabulário do dia</h2><span class="muted small">${esc(fmtDate(today))}</span></div>
        <div class="nv-day-words">${words.map((w) => `<span class="${known.has(w.id) ? 'ok' : ''}" lang="en">${esc(w.en)}</span>`).join('')}</div>
        <div class="nv-phrase">
          <span class="muted small">Frase do dia</span>
          <strong lang="en">${esc(phrase.ex)}</strong>
          <span class="small">${esc(phrase.exPt)}</span>
        </div>
        ${done
          ? `<p class="small">✅ Feito hoje: <strong>${done.right}/${done.total}</strong> no quiz. Volte amanhã para ${d.perDay} termos novos!</p>
             <a class="btn btn-ghost" href="#/marinha/dia?${Date.now()}">Estudar de novo</a>`
          : `<a class="btn btn-primary btn-lg" href="#/marinha/dia">${icon('play', 18)} Estudar os ${d.perDay} termos de hoje</a>`}
      </section>

      <a class="nv-big" href="#/marinha/intercambio">
        <span class="quick-emoji" aria-hidden="true">🌍</span>
        <span><strong>Intercâmbio naval</strong><span class="nv-flags">${[...new Set(d.exchanges.map((x) => x.flag))].join(' ')}</span><span>Converse com militares de ${new Set(d.exchanges.map((x) => x.country)).size} países: rádio, briefing, jantar, abordagem…</span></span>
        <span class="play-cta">Entrar</span>
      </a>

      <section aria-labelledby="nv-cats">
        <h2 id="nv-cats" class="section-title">Temas</h2>
        <div class="nv-grid">
          ${d.categories.map((c) => {
            const k = c.words.filter((w) => known.has(w.id)).length;
            return `<a class="nv-tile" href="#/marinha/tema/${c.id}"><span class="quick-emoji" aria-hidden="true">${c.emoji}</span><strong>${esc(c.name)}</strong><span class="muted small">${k}/${c.words.length} termos</span></a>`;
          }).join('')}
        </div>
      </section>
    </div>`;
  return null;
}

// ---------- Estudo do dia: cartões + quiz ----------

function renderDaily(root) {
  return load().then((d) => {
    const words = dailyWords(d);
    return runCards(root, d, words, {
      back: '#/marinha',
      title: 'Vocabulário do dia',
      onFinish: (right, total) => store.setFlag(dayKey(), { right, total, at: Date.now() }),
      ref: `navy-day-${store.today()}`,
    });
  }).catch(() => { root.innerHTML = failHtml; return null; });
}

function runCards(root, d, words, { back, title, onFinish, ref }) {
  const startedAt = Date.now();
  const known = knownSet();
  let i = 0;
  let open = false;
  let quizCleanup = null; // depois dos cartões, o quiz assume a tela
  document.body.classList.add('lesson-mode');

  function steps(cur) {
    return `<div class="nv-steps" aria-hidden="true">${words.map((_, k) => `<span class="${k < cur ? 'on' : k === cur ? 'now' : ''}"></span>`).join('')}</div>`;
  }

  function show() {
    const w = words[i];
    root.innerHTML = `
      <div class="nv lesson">
        <div class="lesson-top">
          <a class="icon-btn" href="${back}" aria-label="Sair">${icon('close')}</a>
          ${steps(i)}
        </div>
        <p class="muted small">${esc(title)} · cartão ${i + 1} de ${words.length}</p>
        <section class="nv-card" aria-live="polite">
          <span class="nv-en" lang="en">${esc(w.en)}</span>
          <span class="nv-pron">🗣️ ${esc(w.pron)}</span>
          <div class="nv-row">
            <button type="button" class="btn btn-soft" data-act="say">🔊 Ouvir</button>
            <button type="button" class="btn btn-soft" data-act="slow">🐢 Devagar</button>
          </div>
          ${open ? `
            <span class="nv-pt">${esc(w.pt)}</span>
            <div class="nv-exbox"><strong lang="en">${esc(w.ex)}</strong><span class="small muted">${esc(w.exPt)}</span><button type="button" class="link-btn" data-act="ex">🔊 Ouvir o exemplo</button></div>`
          : '<button type="button" class="btn btn-primary" data-act="open">Mostrar tradução</button>'}
        </section>
        ${open ? `<div class="nv-row">
          <button type="button" class="btn btn-ghost btn-lg" data-act="new">📘 Aprendi agora</button>
          <button type="button" class="btn btn-primary btn-lg" data-act="knew">✅ Já sabia</button>
        </div>` : ''}
      </div>`;
  }

  // "Já sabia" e "Aprendi agora" contam como termo estudado; a diferença é só para o aluno.
  function next() {
    known.add(words[i].id);
    store.setFlag('navy.known', [...known]);
    i += 1;
    open = false;
    if (i < words.length) { show(); speak(words[i].en); return; }
    root.removeEventListener('click', onClick);
    quizCleanup = runQuiz(root, d, words, { back, title, onFinish, ref, startedAt });
  }

  function onClick(ev) {
    const b = ev.target.closest('[data-act]');
    if (!b) return;
    const w = words[i];
    const act = b.dataset.act;
    if (act === 'say') speak(w.en);
    else if (act === 'slow') speak(w.en, { slow: true });
    else if (act === 'ex') speak(w.ex);
    else if (act === 'open') { open = true; show(); speak(w.ex); }
    else if (act === 'knew' || act === 'new') next();
  }
  root.addEventListener('click', onClick);
  show();
  speak(words[0].en);
  return () => {
    if (quizCleanup) { quizCleanup(); return; }
    root.removeEventListener('click', onClick); document.body.classList.remove('lesson-mode'); stopSpeech();
  };
}

// Quiz de múltipla escolha, alternando inglês→português e português→inglês.
function runQuiz(root, d, words, { back, title, onFinish, ref, startedAt = Date.now() }) {
  document.body.classList.add('lesson-mode');
  const qs = shuffle(words).slice(0, 10);
  let i = 0;
  let right = 0;
  let locked = false;

  function optionsFor(w, dir) {
    const sameCat = d.all.filter((x) => x.cat === w.cat && x.id !== w.id);
    const others = d.all.filter((x) => x.cat !== w.cat);
    const pool = shuffle(sameCat).concat(shuffle(others));
    const field = dir === 'en' ? 'pt' : 'en';
    const used = new Set([w[field]]);
    const opts = [w];
    for (const x of pool) {
      if (opts.length === 4) break;
      if (!used.has(x[field])) { used.add(x[field]); opts.push(x); }
    }
    return shuffle(opts);
  }

  function show() {
    const w = qs[i];
    const dir = i % 2 === 0 ? 'en' : 'pt';
    const opts = optionsFor(w, dir);
    locked = false;
    root.innerHTML = `
      <div class="nv lesson">
        <div class="lesson-top">
          <a class="icon-btn" href="${back}" aria-label="Sair">${icon('close')}</a>
          <div class="nv-steps" aria-hidden="true">${qs.map((_, k) => `<span class="${k < i ? 'on' : k === i ? 'now' : ''}"></span>`).join('')}</div>
        </div>
        <p class="muted small">Quiz · pergunta ${i + 1} de ${qs.length}</p>
        <section class="card">
          <p class="muted small">${dir === 'en' ? 'O que significa:' : 'Como se diz em inglês:'}</p>
          <p class="nv-q" ${dir === 'en' ? 'lang="en"' : ''}>${esc(dir === 'en' ? w.en : w.pt)} ${dir === 'en' ? sayBtn(w.en) : ''}</p>
        </section>
        <div class="nv-opts">${opts.map((o) => `<button type="button" class="nv-opt" data-o="${esc(o.id)}" ${dir === 'pt' ? 'lang="en"' : ''}>${esc(dir === 'en' ? o.pt : o.en)}</button>`).join('')}</div>
        <p class="kd-feedback" role="status" aria-live="assertive"></p>
      </div>`;
    if (dir === 'en') speak(w.en);
  }

  function answer(btn) {
    if (locked) return;
    locked = true;
    const w = qs[i];
    const ok = btn.dataset.o === w.id;
    if (ok) right += 1;
    root.querySelectorAll('.nv-opt').forEach((b) => {
      b.disabled = true;
      if (b.dataset.o === w.id) b.classList.add('right');
    });
    if (!ok) btn.classList.add('wrong');
    root.querySelector('.kd-feedback').innerHTML = `${ok ? '✅ Isso!' : '❌ Quase.'} <strong lang="en">${esc(w.en)}</strong> = ${esc(w.pt)}`;
    speak(w.en);
    setTimeout(() => { i += 1; if (i < qs.length) show(); else finish(); }, ok ? 1300 : 2400);
  }

  function finish() {
    const xp = right * 2 + 5;
    store.recordQuizSession({ xp, seconds: Math.min(Math.round((Date.now() - startedAt) / 1000), 1200), type: 'navy', ref, title: `⚓ ${title} (${right}/${qs.length})` });
    const coins = store.addCoins(Math.ceil(right / 2));
    if (onFinish) onFinish(right, qs.length);
    root.innerHTML = `
      <div class="nv lesson done-screen">
        <div class="burst" aria-hidden="true">⚓</div>
        <h1>${right === qs.length ? 'Bravo Zulu!' : right >= qs.length * 0.7 ? 'Muito bem!' : 'Bom treino!'}</h1>
        <p class="score-big"><strong>${right}</strong> de ${qs.length}</p>
        <p class="muted">${right === qs.length ? '“Bravo Zulu” é como a Marinha diz “excelente trabalho”.' : 'Repita amanhã: a revisão fixa as palavras.'}</p>
        <div class="reward-row"><div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>${coinReward(coins)}</div>
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/marinha/intercambio">🌍 Praticar no intercâmbio</a>
          <a class="btn btn-ghost" href="${back}">Voltar</a>
        </div>
      </div>`;
  }

  function onClick(ev) {
    const s = ev.target.closest('[data-say]');
    if (s) { speak(s.dataset.say); return; }
    const b = ev.target.closest('[data-o]');
    if (b && !b.disabled) answer(b);
  }
  root.addEventListener('click', onClick);
  show();
  return () => { root.removeEventListener('click', onClick); document.body.classList.remove('lesson-mode'); stopSpeech(); };
}

// ---------- Tema ----------

async function renderTheme(root, id, quiz) {
  let d;
  try { d = await load(); } catch (e) { root.innerHTML = failHtml; return null; }
  const c = d.categories.find((x) => x.id === id);
  if (!c) { location.hash = '#/marinha'; return null; }
  const words = c.words.map((w) => ({ ...w, cat: c.id }));
  if (quiz) {
    return runQuiz(root, d, words, { back: `#/marinha/tema/${c.id}`, title: c.name, ref: `navy-${c.id}` });
  }
  const known = knownSet();
  root.innerHTML = `
    <div class="nv">
      ${backTo('#/marinha', 'Inglês Naval')}
      <header class="page-head">
        <h1>${c.emoji} ${esc(c.name)}</h1>
        <p class="muted">${esc(c.desc)}</p>
      </header>
      <div class="nv-row" style="justify-content:flex-start">
        <a class="btn btn-primary" href="#/marinha/tema/${c.id}/quiz?${Date.now()}">🎯 Quiz do tema</a>
        <a class="btn btn-soft" href="#/marinha/tema/${c.id}/cartoes?${Date.now()}">🃏 Estudar em cartões</a>
      </div>
      <p class="muted small">Toque numa palavra para ver o exemplo. ${known.size ? '✅ = já estudada.' : ''}</p>
      <ul class="nv-words">
        ${words.map((w) => `
          <li><details class="nv-word">
            <summary>
              ${sayBtn(w.en)}
              <span class="grow"><strong lang="en">${known.has(w.id) ? '✅ ' : ''}${esc(w.en)}</strong><span class="small">${esc(w.pt)}</span><span class="nv-pron">🗣️ ${esc(w.pron)}</span></span>
              ${icon('chevron', 18)}
            </summary>
            <div class="nv-ex"><span lang="en"><strong>${esc(w.ex)}</strong> ${sayBtn(w.ex, 'Ouvir o exemplo')}</span><span class="muted">${esc(w.exPt)}</span></div>
          </details></li>`).join('')}
      </ul>
    </div>`;
  function onClick(ev) {
    const s = ev.target.closest('[data-say]');
    if (s) { ev.preventDefault(); speak(s.dataset.say); }
  }
  root.addEventListener('click', onClick);
  return () => { root.removeEventListener('click', onClick); stopSpeech(); };
}

async function renderThemeCards(root, id) {
  let d;
  try { d = await load(); } catch (e) { root.innerHTML = failHtml; return null; }
  const c = d.categories.find((x) => x.id === id);
  if (!c) { location.hash = '#/marinha'; return null; }
  const words = shuffle(c.words.map((w) => ({ ...w, cat: c.id }))).slice(0, 10);
  return runCards(root, d, words, { back: `#/marinha/tema/${c.id}`, title: c.name, ref: `navy-${c.id}` });
}

// ---------- Intercâmbio ----------

const LEVELS = ['', 'Básico', 'Intermediário', 'Avançado'];

async function renderExchangeList(root) {
  let d;
  try { d = await load(); } catch (e) { root.innerHTML = failHtml; return null; }
  root.innerHTML = `
    <div class="nv">
      ${backTo('#/marinha', 'Inglês Naval')}
      <section class="nv-hero">
        <span class="nv-eyebrow">Intercâmbio naval</span>
        <h1>🌍 Converse com outras marinhas</h1>
        <p>Situações reais de exercício combinado, visita a navio e rádio. Escolha o que dizer (ou responda falando 🎙️) e receba comentários na hora. Cada militar fala com o sotaque do seu país quando o aparelho tem essa voz.</p>
      </section>
      <div class="nv-ex-list">
        ${d.exchanges.map((x) => {
          const best = store.getFlag(`navy.ex.${x.id}`);
          return `<a class="nv-ex-item" href="#/marinha/intercambio/${x.id}">
            <span class="nv-flag" aria-hidden="true">${x.flag}</span>
            <span class="grow">
              <strong>${esc(x.title)}</strong>
              <span class="small">${esc(x.partner)} · ${esc(x.navy)}</span>
              ${best ? `<span class="nv-done">✓ Melhor resultado: ${best.pct}%</span>` : `<span class="muted small">${esc(x.role)}</span>`}
            </span>
            <span class="nv-lvl">${LEVELS[x.level]}</span>
          </a>`;
        }).join('')}
      </div>
    </div>`;
  return null;
}

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const PT_KEY = 'navy.showPt';

function words(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);
}
function overlap(said, target) {
  const a = new Set(words(said));
  const b = words(target);
  if (!b.length) return 0;
  return b.filter((w) => a.has(w)).length / b.length;
}

async function renderExchange(root, id) {
  let d;
  try { d = await load(); } catch (e) { root.innerHTML = failHtml; return null; }
  const x = d.exchanges.find((e) => e.id === id);
  if (!x) { location.hash = '#/marinha/intercambio'; return null; }
  document.body.classList.add('lesson-mode');
  const startedAt = Date.now();
  const maxScore = x.steps.filter((s) => s.who === 'you').length * 2;
  let score = 0;
  let pos = 0;
  let waiting = null; // passo "you" atual
  let rec = null;
  let showPt = store.getFlag(PT_KEY, true);
  const say = (t) => speakAccent(t, x.accent);

  root.innerHTML = `
    <div class="nv lesson ${showPt ? '' : 'nv-hide-pt'}" data-wrap>
      <div class="lesson-top">
        <a class="icon-btn" href="#/marinha/intercambio" aria-label="Sair">${icon('close')}</a>
        <strong class="grow">${x.flag} ${esc(x.title)}</strong>
        <button type="button" class="btn btn-soft" data-act="pt" aria-pressed="${showPt}">🇧🇷 ${showPt ? 'Tradução on' : 'Tradução off'}</button>
      </div>
      <div class="nv-scene"><strong>${esc(x.partner)}</strong><span class="small">${esc(x.role)} · ${esc(x.navy)}</span><span>🎬 ${esc(x.setting)}</span></div>
      <div class="nv-chat" data-chat aria-live="polite"></div>
      <div data-panel></div>
    </div>`;
  const chat = root.querySelector('[data-chat]');
  const panel = root.querySelector('[data-panel]');

  function bubble(who, en, pt, extra = '') {
    const el = document.createElement('div');
    el.className = `nv-msg ${who === 'npc' ? 'npc' : 'me'}`;
    el.innerHTML = `
      <span class="nv-ava" aria-hidden="true">${who === 'npc' ? x.flag : '🇧🇷'}</span>
      <div class="nv-bub">
        <div class="nv-bub-top"><small>${who === 'npc' ? esc(x.partner.split(' ').slice(-1)[0]) : 'Você'}</small><button type="button" data-say="${esc(en)}" data-who="${who}" aria-label="Ouvir">🔊</button></div>
        <span lang="en">${esc(en)}</span>
        <span class="nv-bub-pt">${esc(pt)}</span>
        ${extra}
      </div>`;
    chat.appendChild(el);
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  async function advance() {
    panel.innerHTML = '';
    while (pos < x.steps.length && x.steps[pos].who === 'npc') {
      const s = x.steps[pos];
      bubble('npc', s.en, s.pt);
      pos += 1;
      await say(s.en);
    }
    if (pos >= x.steps.length) { finish(); return; }
    waiting = x.steps[pos];
    const opts = shuffle(waiting.options.map((o, k) => ({ ...o, k })));
    panel.innerHTML = `
      <div class="nv-task">🎯 <strong>Sua vez:</strong> ${esc(waiting.hint)}</div>
      <div class="nv-opts">${opts.map((o) => `<button type="button" class="nv-opt" data-k="${o.k}"><span lang="en">${esc(o.en)}</span><span class="nv-opt-pt">${esc(o.pt)}</span></button>`).join('')}</div>
      ${Recognition ? '<div class="nv-tools"><button type="button" class="btn btn-ghost nv-mic" data-act="mic">🎙️ Responder falando</button><span class="muted small" data-heard></span></div>' : ''}`;
    panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function choose(k, heard = null) {
    if (!waiting) return;
    const step = waiting;
    waiting = null;
    const o = step.options[k];
    const best = step.options.find((p) => p.score === 2);
    score += o.score;
    const label = ['❌ Melhor não', '🟡 Aceitável', '✅ Ótima resposta'][o.score];
    bubble('me', heard || o.en, o.pt);
    say(o.en);
    pos += 1;
    panel.innerHTML = `
      <div class="nv-fb s${o.score}" role="status">
        <strong>${label}</strong>
        <span>${esc(o.fb)}</span>
        ${o.score < 2 ? `<span>💡 Melhor dizer: <strong lang="en">${esc(best.en)}</strong> <button type="button" class="link-btn" data-say="${esc(best.en)}" data-who="me">🔊</button></span>` : ''}
      </div>
      <button type="button" class="btn btn-primary btn-lg" data-act="next">Continuar ▶</button>`;
    if (o.react) {
      setTimeout(() => { bubble('npc', o.react.en, o.react.pt); say(o.react.en); }, 900);
    }
  }

  function listen(btn) {
    if (rec) { rec.abort(); return; }
    const heardEl = root.querySelector('[data-heard]');
    rec = new Recognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    btn.classList.add('on');
    btn.textContent = '⏹️ Ouvindo… toque para parar';
    rec.onresult = (ev) => {
      const alts = [...ev.results[0]].map((a) => a.transcript);
      let bestK = -1; let bestV = 0; let heard = alts[0];
      waiting.options.forEach((o, k) => alts.forEach((t) => {
        const v = overlap(t, o.en);
        if (v > bestV) { bestV = v; bestK = k; heard = t; }
      }));
      if (bestK >= 0 && bestV >= 0.5) choose(bestK, heard);
      else if (heardEl) heardEl.textContent = `Ouvi: “${alts[0]}”. Não reconheci nenhuma opção; tente de novo ou toque numa delas.`;
    };
    rec.onerror = () => { if (heardEl) heardEl.textContent = 'Não consegui ouvir. Confira o microfone (o reconhecimento de voz pode precisar de internet).'; };
    rec.onend = () => { rec = null; const b = root.querySelector('[data-act="mic"]'); if (b) { b.classList.remove('on'); b.textContent = '🎙️ Responder falando'; } };
    try { rec.start(); } catch (e) { rec = null; }
  }

  function finish() {
    const pct = Math.round((score / maxScore) * 100);
    const stars = pct >= 85 ? 3 : pct >= 60 ? 2 : 1;
    const prev = store.getFlag(`navy.ex.${x.id}`);
    if (!prev || pct > prev.pct) store.setFlag(`navy.ex.${x.id}`, { pct, at: Date.now() });
    const xp = score + 5;
    store.recordQuizSession({ xp, seconds: Math.min(Math.round((Date.now() - startedAt) / 1000), 1500), type: 'navy-exchange', ref: x.id, title: `${x.flag} Intercâmbio: ${x.title} (${pct}%)` });
    const coins = store.addCoins(stars * 2);
    panel.innerHTML = `
      <section class="card done-screen">
        <div class="nv-stars" aria-label="${stars} de 3 estrelas">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <h2>${pct >= 85 ? 'Bravo Zulu! Comunicação de primeira.' : pct >= 60 ? 'Missão cumprida!' : 'Bom começo, marinheiro!'}</h2>
        <p class="score-big"><strong>${pct}%</strong> de aproveitamento</p>
        <div class="reward-row"><div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>${coinReward(coins)}</div>
      </section>
      <section class="card">
        <h2 class="section-title">🔑 Expressões-chave</h2>
        <ul class="nv-keys">${x.keys.map((k) => `<li>${sayBtn(k.en)}<div><strong lang="en">${esc(k.en)}</strong><span class="small muted">${esc(k.pt)}</span></div></li>`).join('')}</ul>
      </section>
      <div class="stack">
        <a class="btn btn-primary btn-lg" href="#/marinha/intercambio/${x.id}?${Date.now()}">Treinar de novo</a>
        <a class="btn btn-ghost" href="#/marinha/intercambio">Outros intercâmbios</a>
      </div>`;
    panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function onClick(ev) {
    const s = ev.target.closest('[data-say]');
    if (s) { if (s.dataset.who === 'npc') say(s.dataset.say); else speak(s.dataset.say); return; }
    const o = ev.target.closest('[data-k]');
    if (o && waiting) { choose(Number(o.dataset.k)); return; }
    const a = ev.target.closest('[data-act]');
    if (!a) return;
    if (a.dataset.act === 'next') advance();
    else if (a.dataset.act === 'mic') listen(a);
    else if (a.dataset.act === 'pt') {
      showPt = !showPt;
      store.setFlag(PT_KEY, showPt);
      root.querySelector('[data-wrap]').classList.toggle('nv-hide-pt', !showPt);
      a.setAttribute('aria-pressed', String(showPt));
      a.textContent = `🇧🇷 ${showPt ? 'Tradução on' : 'Tradução off'}`;
    }
  }
  root.addEventListener('click', onClick);
  advance();
  return () => {
    root.removeEventListener('click', onClick);
    document.body.classList.remove('lesson-mode');
    if (rec) rec.abort();
    stopSpeech();
  };
}

export function render(root, { mode, id }) {
  if (mode === 'day') return renderDaily(root);
  if (mode === 'theme') return renderTheme(root, id, false);
  if (mode === 'theme-quiz') return renderTheme(root, id, true);
  if (mode === 'theme-cards') return renderThemeCards(root, id);
  if (mode === 'exchanges') return renderExchangeList(root);
  if (mode === 'exchange') return renderExchange(root, id);
  return renderHub(root);
}
