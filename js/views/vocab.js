import * as store from '../store.js';
import * as vocab from '../vocab.js';
import { icon } from '../icons.js';
import { esc, progressBar, plural, formatNumber } from '../ui.js';
import { speak, canSpeak } from '../speech.js';

const SESSION_SIZE = 10;
const MAX_SESSION_SECONDS = 30 * 60;
const MASTERY_SYMBOLS = ['○', '◔', '◑', '◕', '●'];

function statusBadge(id) {
  const m = store.masteryOf(id);
  return `<span class="status status-${m}"><span aria-hidden="true">${MASTERY_SYMBOLS[m]}</span> <span class="status-label">${store.MASTERY_LABELS[m]}</span></span>`;
}

function speakBtn(text, label) {
  if (!canSpeak()) return '';
  return `<button class="icon-btn speak-btn" type="button" data-say="${esc(text)}" aria-label="Ouvir ${esc(label || text)}">${icon('speaker', 20)}</button>`;
}

function wordRow(w, { showCategory = false } = {}) {
  const cat = showCategory ? vocab.findCategory(w.category) : null;
  return `
    <li class="word">
      <div class="word-main">
        ${speakBtn(w.word)}
        <div class="word-text">
          <strong lang="en">${esc(w.word)}</strong>
          <span>${esc(w.translation)}</span>
        </div>
        ${statusBadge(w.id)}
      </div>
      <details>
        <summary>Pronúncia e exemplo</summary>
        <div class="word-extra">
          <p><span class="muted">Pronúncia:</span> <strong class="pron-text">${esc(w.pron)}</strong></p>
          <p class="example"><span lang="en">${esc(w.example)}</span> ${speakBtn(w.example, 'o exemplo')}</p>
          <p class="muted">${esc(w.exampleTranslation)}</p>
          <p class="word-meta">
            ${cat ? `<a class="chip chip-green" href="#/vocabulario/${esc(cat.id)}">${cat.emoji} ${esc(cat.name)}</a>` : ''}
            <span class="chip">Dificuldade ${w.difficulty}</span>
            ${store.wordState(w.id) ? `<span class="chip">${plural(store.wordState(w.id).reviews, 'estudo', 'estudos')}</span>` : ''}
          </p>
          ${cat ? `<a class="btn btn-soft" href="#/vocabulario/${esc(cat.id)}/estudar">Estudar ${esc(cat.name)}</a>` : ''}
        </div>
      </details>
    </li>`;
}

function handleSpeakClicks(root) {
  const fn = (e) => {
    const b = e.target.closest('[data-say]');
    if (b) speak(b.dataset.say);
  };
  root.addEventListener('click', fn);
  return () => root.removeEventListener('click', fn);
}

// ---------- Lista de categorias + busca ----------

function renderIndex(root) {
  const cats = vocab.getCategories();
  const totalWords = cats.reduce((n, c) => n + c.count, 0);
  const seen = store.seenWordsCount();

  root.innerHTML = `
    <header class="page-head">
      <h1>Vocabulário</h1>
      <p class="muted">${formatNumber(seen)} de ${formatNumber(totalWords)} palavras estudadas, em ${cats.length} situações do dia a dia.</p>
    </header>

    <div class="quick-row">
      <a class="card quick" href="#/revisao"><span class="quick-emoji">🔄</span><span><strong>Revisão</strong><span class="muted small">${plural(store.dueWordsCount(), 'palavra', 'palavras')} para hoje</span></span></a>
      <a class="card quick" href="#/quiz/misto"><span class="quick-emoji">🎲</span><span><strong>Quiz misturado</strong><span class="muted small">10 palavras de vários temas</span></span></a>
    </div>

    <div class="search card">
      <label for="vocab-search">Pesquisar palavra</label>
      <input id="vocab-search" type="search" placeholder="ex.: airport ou aeroporto" autocomplete="off" autocapitalize="off" spellcheck="false">
    </div>
    <section id="search-results" aria-live="polite" hidden></section>

    <section id="cat-section" aria-labelledby="cats-title">
      <h2 id="cats-title" class="sr-only">Categorias</h2>
      <ul class="cat-grid">
        ${cats.map((c) => {
          const st = store.wordStats(vocab.wordIdsOf(c));
          return `<li><a class="card cat" href="#/vocabulario/${esc(c.id)}">
            <span class="cat-emoji" aria-hidden="true">${c.emoji}</span>
            <strong>${esc(c.name)}</strong>
            <span class="muted small">${plural(c.count, 'palavra', 'palavras')}</span>
            ${progressBar(st.mastery, `Domínio em ${c.name}`)}
            <span class="muted small">${st.seen ? `${st.seen} vistas · ${st.mastered} dominadas` : 'Não iniciada'}</span>
          </a></li>`;
        }).join('')}
      </ul>
    </section>`;

  const input = root.querySelector('#vocab-search');
  const results = root.querySelector('#search-results');
  const catSection = root.querySelector('#cat-section');
  let timer = null;
  let token = 0;

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const q = input.value;
      const mine = ++token;
      if (vocab.normalize(q).length < 2) {
        results.hidden = true;
        catSection.hidden = false;
        return;
      }
      results.hidden = false;
      catSection.hidden = true;
      results.innerHTML = '<p class="muted center">Procurando…</p>';
      try {
        const found = await vocab.search(q);
        if (mine !== token) return;
        results.innerHTML = found.length
          ? `<p class="muted small">${plural(found.length, 'resultado', 'resultados')}</p><ul class="word-list">${found.map((w) => wordRow(w, { showCategory: true })).join('')}</ul>`
          : `<div class="card empty"><p>Nenhuma palavra encontrada para "<strong>${esc(q)}</strong>".</p></div>`;
      } catch (e) {
        results.innerHTML = '<p class="muted center">Não foi possível pesquisar agora. Verifique a internet.</p>';
      }
    }, 180);
  });

  return handleSpeakClicks(root);
}

// ---------- Uma categoria ----------

const FILTERS = [
  { id: 'todas', label: 'Todas', test: () => true },
  { id: 'novas', label: 'Novas', test: (m) => m === 0 },
  { id: 'estudando', label: 'Estudando', test: (m) => m > 0 && m < 4 },
  { id: 'dominadas', label: 'Dominadas', test: (m) => m === 4 },
];

async function renderCategory(root, catId) {
  const cat = vocab.findCategory(catId);
  if (!cat) { location.hash = '#/vocabulario'; return null; }
  root.innerHTML = '<p class="muted center">Carregando palavras…</p>';
  let words;
  try {
    words = await vocab.loadCategory(catId);
  } catch (e) {
    root.innerHTML = '<div class="card empty"><p>Não foi possível carregar esta categoria. Verifique a internet e tente de novo.</p><a class="btn btn-ghost" href="#/vocabulario">Voltar</a></div>';
    return null;
  }
  const st = store.wordStats(words.map((w) => w.id));
  const hasNew = st.seen < st.total;
  let filter = 'todas';

  root.innerHTML = `
    <a class="back-link" href="#/vocabulario">${icon('back', 18)} Vocabulário</a>
    <header class="card cat-head">
      <span class="cat-emoji big" aria-hidden="true">${cat.emoji}</span>
      <div class="cat-head-text">
        <h1>${esc(cat.name)}</h1>
        <p class="muted">${plural(st.total, 'palavra', 'palavras')} · ${st.seen} vistas · ${st.mastered} dominadas</p>
        ${progressBar(st.mastery, `Domínio em ${cat.name}`)}
      </div>
      <div class="cat-actions">
        <a class="btn btn-primary btn-lg" href="#/vocabulario/${esc(cat.id)}/estudar">${icon('play', 18)} ${hasNew ? 'Estudar' : 'Praticar de novo'}</a>
        <a class="btn btn-soft btn-lg" href="#/quiz/${esc(cat.id)}">🎯 Quiz</a>
      </div>
    </header>
    <div class="filters" role="group" aria-label="Filtrar palavras">
      ${FILTERS.map((f) => `<button type="button" class="filter" data-filter="${f.id}" aria-pressed="${f.id === filter}">${f.label}</button>`).join('')}
    </div>
    <ul class="word-list" id="word-list"></ul>`;

  const list = root.querySelector('#word-list');
  function draw() {
    const f = FILTERS.find((x) => x.id === filter);
    const shown = words.filter((w) => f.test(store.masteryOf(w.id)));
    list.innerHTML = shown.length ? shown.map((w) => wordRow(w)).join('') : '<li class="muted center">Nenhuma palavra neste filtro.</li>';
  }
  draw();

  root.querySelector('.filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filter = b.dataset.filter;
    root.querySelectorAll('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    draw();
  });
  return handleSpeakClicks(root);
}

// ---------- Sessão de estudo (cartões) ----------

function pickSession(words) {
  const fresh = words.filter((w) => store.masteryOf(w.id) === 0);
  if (fresh.length) return { list: fresh.slice(0, SESSION_SIZE), isNew: true };
  // Tudo já visto: pratica as de menor domínio / estudadas há mais tempo.
  const sorted = [...words].sort((a, b) => {
    const wa = store.wordState(a.id); const wb = store.wordState(b.id);
    return (wa.mastery - wb.mastery) || String(wa.lastReview).localeCompare(String(wb.lastReview));
  });
  return { list: sorted.slice(0, SESSION_SIZE), isNew: false };
}

async function renderStudy(root, catId) {
  const cat = vocab.findCategory(catId);
  if (!cat) { location.hash = '#/vocabulario'; return null; }
  let words;
  try { words = await vocab.loadCategory(catId); } catch (e) { location.hash = `#/vocabulario/${catId}`; return null; }

  const { list, isNew } = pickSession(words);
  const startedAt = Date.now();
  let index = 0;
  let finished = false;
  document.body.classList.add('lesson-mode');

  function card() {
    const w = list[index];
    const isLast = index === list.length - 1;
    root.innerHTML = `
      <div class="lesson">
        <div class="lesson-top">
          <a class="icon-btn" href="#/vocabulario/${esc(cat.id)}" aria-label="Sair do estudo">${icon('close')}</a>
          ${progressBar(index / list.length, 'Progresso do estudo')}
          <span class="muted small">${index + 1}/${list.length}</span>
        </div>
        <p class="eyebrow center">${cat.emoji} ${esc(cat.name)} · ${isNew ? 'palavras novas' : 'praticando'}</p>
        <section class="card flash" aria-live="polite">
          ${statusBadge(w.id)}
          <p class="flash-en" lang="en">${esc(w.word)}</p>
          ${canSpeak() ? `<div class="audio-row">
            <button class="btn btn-soft" type="button" data-speak>${icon('speaker', 20)} Ouvir</button>
            <button class="btn btn-soft" type="button" data-speak-slow>${icon('turtle', 20)} Devagar</button>
          </div>` : ''}
          <p class="pron"><span class="muted">Pronúncia:</span> <strong>${esc(w.pron)}</strong></p>
          <p class="flash-pt">${esc(w.translation)}</p>
          <hr>
          <div class="example-box">
            <p class="example"><span lang="en">${esc(w.example)}</span> ${speakBtn(w.example, 'o exemplo')}</p>
            <p class="muted">${esc(w.exampleTranslation)}</p>
          </div>
        </section>
        <div class="lesson-actions">
          <button class="btn btn-ghost" type="button" data-prev ${index === 0 ? 'disabled' : ''}>${icon('back', 18)} Anterior</button>
          <button class="btn btn-primary btn-lg" type="button" data-next>${isLast ? `${icon('check', 18)} Concluir` : `Próxima ${icon('chevron', 18)}`}</button>
        </div>
      </div>`;
    root.querySelector('[data-next]').focus({ preventScroll: true });
  }

  function complete() {
    finished = true;
    const seconds = Math.min(Math.round((Date.now() - startedAt) / 1000), MAX_SESSION_SECONDS);
    const fresh = list.filter((w) => store.masteryOf(w.id) === 0).length;
    const xp = fresh * 2 + (list.length - fresh);
    store.recordWordsStudied({
      ids: list.map((w) => w.id), xp, seconds, ref: cat.id,
      title: `Vocabulário: ${cat.name} (${list.length} palavras)`,
    });
    const st = store.wordStats(words.map((w) => w.id));
    const remaining = st.total - st.seen;

    root.innerHTML = `
      <div class="lesson done-screen">
        <div class="burst" aria-hidden="true">${icon('check', 44)}</div>
        <h1>Muito bem!</h1>
        <p class="muted">${plural(list.length, 'palavra estudada', 'palavras estudadas')} em ${esc(cat.name)}</p>
        <div class="reward-row">
          <div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>
          <div class="card reward"><span class="stat-icon flame">${icon('flame')}</span><strong>${plural(store.currentStreak(), 'dia', 'dias')}</strong></div>
        </div>
        <p class="muted small">${remaining ? `Faltam ${plural(remaining, 'palavra nova', 'palavras novas')} nesta categoria.` : 'Você já viu todas as palavras desta categoria! 🎉'}</p>
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/vocabulario/${esc(cat.id)}/estudar?${Date.now()}">${remaining ? 'Estudar mais 10' : 'Praticar de novo'}</a>
          <a class="btn btn-ghost" href="#/vocabulario/${esc(cat.id)}">Ver palavras de ${esc(cat.name)}</a>
          <a class="btn btn-ghost" href="#/vocabulario">Outras categorias</a>
        </div>
      </div>`;
    root.querySelector('.btn-primary').focus({ preventScroll: true });
  }

  function onClick(e) {
    const say = e.target.closest('[data-say]');
    if (say) { speak(say.dataset.say); return; }
    const t = e.target.closest('button');
    if (!t || finished) return;
    const w = list[index];
    if (t.hasAttribute('data-speak')) speak(w.word, { audio: w.audio });
    else if (t.hasAttribute('data-speak-slow')) speak(w.word, { slow: true, audio: w.audio });
    else if (t.hasAttribute('data-prev') && index > 0) { index -= 1; card(); }
    else if (t.hasAttribute('data-next')) {
      if (index < list.length - 1) { index += 1; card(); } else complete();
    }
  }

  function onKey(e) {
    if (finished || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); root.querySelector('[data-next]')?.click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); root.querySelector('[data-prev]:not([disabled])')?.click(); }
  }

  root.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  card();
  return () => {
    root.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('lesson-mode');
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  };
}

export function render(root, { mode, cat }) {
  if (mode === 'category') return renderCategory(root, cat);
  if (mode === 'study') return renderStudy(root, cat);
  return renderIndex(root);
}
