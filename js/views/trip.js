// Área Viagem: histórias narradas e ramificadas. Cada escolha leva a um
// caminho diferente; o conteúdo fica em data/trips/*.json (gerado por
// tools/story_*.py).
import * as store from '../store.js';
import { icon } from '../icons.js';
import { esc, progressBar, toast } from '../ui.js';
import { speak, speakPt, stopSpeech, canSpeak } from '../speech.js';
import { shuffle } from '../quiz-engine.js';

const XP = { chapterFirst: 10, chapterRepeat: 3, perGood: 2 };
const cache = new Map();

// ---------- Dados ----------

async function loadIndex() {
  if (cache.has('index')) return cache.get('index');
  const res = await fetch('data/trips/index.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('index');
  const data = (await res.json()).trips;
  cache.set('index', data);
  return data;
}

async function loadTrip(id) {
  if (cache.has(id)) return cache.get(id);
  const res = await fetch(`data/trips/${id}.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error('trip');
  const trip = await res.json();
  trip.chapters.forEach((c, i) => { c.number = i + 1; c.lessonId = `trip.${trip.id}.${c.id}`; });
  cache.set(id, trip);
  return trip;
}

const done = (c) => store.isLessonDone(c.lessonId);
const unlocked = (trip, i) => i === 0 || done(trip.chapters[i]) || done(trip.chapters[i - 1]);
const seenKey = (trip, c) => `trip.${trip.id}.${c.id}.seen`;
const endKey = (trip, c) => `trip.${trip.id}.${c.id}.endings`;

export function tripProgress(trip) {
  const d = trip.chapters.filter(done).length;
  return { done: d, total: trip.chapters.length, next: trip.chapters.find((c) => !done(c)) || null };
}

function discovery(trip, c) {
  const seen = new Set(store.getFlag(seenKey(trip, c), []));
  const ids = Object.keys(c.nodes);
  const found = ids.filter((id) => seen.has(id)).length;
  return { pct: ids.length ? found / ids.length : 0, endings: store.getFlag(endKey(trip, c), []).length, totalEndings: c.endings.length };
}

function starsOf(c) {
  const st = store.get().lessons[c.lessonId];
  if (!st) return 0;
  return st.score >= 90 ? 3 : st.score >= 60 ? 2 : 1;
}

// Usado pelo Início para mostrar o card da viagem atual.
export async function currentTripSummary() {
  try {
    const list = await loadIndex();
    const trip = await loadTrip(list[0].id);
    return { trip, ...tripProgress(trip) };
  } catch (e) { return null; }
}

// ---------- Personalização (khrap/ka, esposa/marido) ----------

function vars() {
  const p = store.get().profile;
  const f = p.gender === 'f';
  return {
    p: f ? 'ka' : 'khrap',
    spouse: f ? 'husband' : 'wife',
    She: f ? 'He' : 'She',
    spousePt: f ? 'meu marido' : 'minha esposa',
    ElaPt: f ? 'Ele' : 'Ela',
    aPt: f ? 'o' : 'a',
    name: (p.name || 'Silva').split(' ')[0],
  };
}

function fmt(text) {
  if (!text) return text;
  const v = vars();
  return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
}

function genderPicker(onPick) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-backdrop';
  wrap.innerHTML = `
    <div class="modal card" role="dialog" aria-modal="true" aria-labelledby="gender-title">
      <img src="img/mascot-avatar.png" alt="" width="72" height="72" class="modal-mascot">
      <h2 id="gender-title">Antes de viajar…</h2>
      <p class="muted">Na Tailândia, a palavrinha de educação muda: homens dizem <strong>khrap</strong> e mulheres dizem <strong>ka</strong>. Como você quer aparecer nas falas?</p>
      <div class="stack">
        <button type="button" class="btn btn-soft btn-lg" data-g="m">🙋‍♂️ Homem <span class="muted small">(khrap · my wife)</span></button>
        <button type="button" class="btn btn-soft btn-lg" data-g="f">🙋‍♀️ Mulher <span class="muted small">(ka · my husband)</span></button>
      </div>
    </div>`;
  document.body.appendChild(wrap);
  wrap.querySelector('[data-g]').focus();
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-g]');
    if (!b) return;
    store.setLocalPref({ gender: b.dataset.g });
    wrap.remove();
    onPick();
  });
}

// ---------- Peças visuais ----------

function sceneHtml(scene, big = false) {
  const items = (scene && scene.items) || [];
  return `<div class="scene sky-${esc((scene && scene.sky) || 'day')} ${big ? 'big' : ''}" aria-hidden="true">
    <span class="scene-cloud c1">☁️</span><span class="scene-cloud c2">☁️</span>
    ${items.map(([e, anim], i) => `<span class="scene-item anim-${esc(anim)} pos-${i}">${e}</span>`).join('')}
    <span class="scene-ground"></span>
  </div>`;
}

function speakBtn(text, label = 'Ouvir') {
  return canSpeak() ? `<button type="button" class="icon-btn speak-btn small-btn" data-say="${esc(text)}" aria-label="${label}">${icon('speaker', 18)}</button>` : '';
}

const strip = (w) => w.replace(/[.,!?]+$/g, '');
const norm = (s) => s.toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();

function buildDock(step) {
  const en = fmt(step.en);
  const tiles = shuffle([...en.split(' ').map(strip), ...(step.extra || []).map(fmt)]);
  return {
    html: `<div class="build-wrap" data-build>
      <p class="dock-prompt">🧩 Monte em inglês: <strong>${esc(fmt(step.pt))}</strong></p>
      <div class="build-answer" data-answer aria-label="Sua frase" aria-live="polite"><span class="muted small">Toque nas palavras na ordem certa</span></div>
      <div class="tiles" data-bank>${tiles.map((t, i) => `<button type="button" class="tile" data-tile="${i}">${esc(t)}</button>`).join('')}</div>
      <div class="dock-actions">
        <button type="button" class="btn btn-ghost" data-clear>Limpar</button>
        <button type="button" class="btn btn-primary" data-check disabled>Verificar</button>
      </div></div>`,
    target: norm(en),
    en,
  };
}

// Liga os blocos de "monte a frase"; chama onResult(ok) uma única vez.
function wireBuild(host, target, onResult) {
  const dock = host.querySelector('[data-build]');
  const answer = dock.querySelector('[data-answer]');
  const check = dock.querySelector('[data-check]');
  const picked = [];
  let used = false;
  const redraw = () => {
    answer.innerHTML = picked.length
      ? picked.map((b, i) => `<button type="button" class="tile in-answer" data-remove="${i}">${esc(b.textContent)}</button>`).join('')
      : '<span class="muted small">Toque nas palavras na ordem certa</span>';
    check.disabled = picked.length === 0;
  };
  dock.addEventListener('click', (e) => {
    if (used) return;
    const t = e.target.closest('[data-tile]');
    if (t && !t.disabled) { picked.push(t); t.disabled = true; t.classList.add('used'); redraw(); return; }
    const r = e.target.closest('[data-remove]');
    if (r) { const [b] = picked.splice(Number(r.dataset.remove), 1); b.disabled = false; b.classList.remove('used'); redraw(); return; }
    if (e.target.closest('[data-clear]')) { picked.splice(0).forEach((b) => { b.disabled = false; b.classList.remove('used'); }); redraw(); return; }
    if (e.target.closest('[data-check]')) {
      used = true;
      onResult(norm(picked.map((b) => b.textContent).join(' ')) === target);
    }
  });
}

function narrationToggle() {
  const on = store.get().profile.narration !== false;
  return `<button type="button" class="icon-btn narr-toggle" data-narr aria-pressed="${on}" aria-label="${on ? 'Desligar' : 'Ligar'} narração">${on ? '🔊' : '🔇'}</button>`;
}

// ---------- Lista de capítulos ----------

async function renderIndex(root) {
  root.innerHTML = '<p class="muted center">Carregando viagens…</p>';
  let trips;
  try {
    const list = await loadIndex();
    trips = await Promise.all(list.map((t) => loadTrip(t.id)));
  } catch (e) {
    root.innerHTML = '<div class="card empty"><p>Não foi possível carregar as viagens. Verifique a internet.</p></div>';
    return null;
  }
  const g = store.get().profile.gender;

  root.innerHTML = `
    <header class="page-head">
      <h1>Viagem ✈️</h1>
      <p class="muted">Histórias narradas em que <strong>as suas escolhas mudam o caminho</strong>. Refaça os capítulos para descobrir outros finais!</p>
    </header>
    ${trips.map((trip) => {
      const pr = tripProgress(trip);
      return `
      <section class="card trip-card" aria-labelledby="trip-${trip.id}">
        ${sceneHtml(trip.chapters[0].scene, true)}
        <div class="trip-head">
          <span class="trip-flag" aria-hidden="true">${trip.emoji}</span>
          <div>
            <h2 id="trip-${trip.id}">${esc(trip.title)}</h2>
            <p class="muted small">${esc(trip.intro)}</p>
          </div>
        </div>
        ${progressBar(pr.done / pr.total, `Progresso em ${trip.title}`)}
        <p class="muted small">${pr.done} de ${pr.total} capítulos · Você fala como <button type="button" class="link-btn inline" data-change-gender>${g === 'f' ? 'mulher (ka)' : g === 'm' ? 'homem (khrap)' : 'escolher'}</button></p>
        <div class="cat-actions">
          ${pr.next ? `<a class="btn btn-primary btn-lg" href="#/viagem/${trip.id}/${pr.next.id}">${icon('play', 18)} ${pr.done ? 'Continuar' : 'Começar a viagem'}</a>` : ''}
          <a class="btn btn-soft btn-lg" href="#/viagem/${trip.id}/frases">🧩 Monte a frase</a>
        </div>
        <ol class="chapter-list">
          ${trip.chapters.map((c, i) => {
            const isDone = done(c);
            const open = unlocked(trip, i);
            const isNext = pr.next && pr.next.id === c.id;
            const d = discovery(trip, c);
            const stars = starsOf(c);
            const inner = `
              <span class="ch-emoji ${open ? '' : 'locked'}" aria-hidden="true">${open ? c.emoji : '🔒'}</span>
              <span class="ch-text">
                <strong>${c.number}. ${esc(c.title)}</strong>
                <span class="muted small">${esc(c.summary)}</span>
                ${isDone ? `<span class="ch-meta"><span aria-label="${stars} de 3 estrelas">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</span> · 🧭 ${Math.round(d.pct * 100)}% dos caminhos${d.totalEndings > 1 ? ` · 🏁 ${d.endings}/${d.totalEndings} finais` : ''}</span>` : ''}
              </span>
              ${isNext ? '<span class="chip chip-green">Próximo</span>' : ''}`;
            return `<li class="${isNext ? 'is-next' : ''}">${open
              ? `<a class="ch-row" href="#/viagem/${trip.id}/${c.id}">${inner}</a>`
              : `<div class="ch-row locked" aria-label="Capítulo ${c.number}, bloqueado">${inner}</div>`}</li>`;
          }).join('')}
        </ol>
      </section>`;
    }).join('')}
    <section class="card soon-trips">
      <h2>Próximos destinos</h2>
      <p class="muted">🇺🇸 Estados Unidos · 🇵🇹 Portugal · 🇬🇧 Londres · 🇫🇷 Paris</p>
    </section>`;

  root.querySelector('[data-change-gender]')?.addEventListener('click', () => genderPicker(() => renderIndex(root)));
  return null;
}

// ---------- Capítulo (motor da história) ----------

async function renderChapter(root, tripId, chapterId) {
  let trip;
  try { trip = await loadTrip(tripId); } catch (e) { location.hash = '#/viagem'; return null; }
  const idx = trip.chapters.findIndex((c) => c.id === chapterId);
  if (idx < 0 || !unlocked(trip, idx)) { location.hash = '#/viagem'; return null; }
  const chapter = trip.chapters[idx];
  const nodes = chapter.nodes;
  const startedAt = Date.now();
  const visited = [];
  let good = 0;
  let tasks = 0;
  let firstTry = true;
  let finished = false;
  let alive = true;
  let typing = null;
  const timers = new Set();
  document.body.classList.add('lesson-mode');

  const narrationOn = () => store.get().profile.narration !== false;
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };

  root.innerHTML = `
    <div class="lesson story">
      <div class="lesson-top">
        <a class="icon-btn" href="#/viagem" aria-label="Sair do capítulo">${icon('close')}</a>
        <div data-progress class="grow">${progressBar(0, 'Progresso do capítulo')}</div>
        ${narrationToggle()}
      </div>
      ${sceneHtml(chapter.scene)}
      <p class="eyebrow center">${trip.emoji} Capítulo ${chapter.number} · ${esc(chapter.title)}</p>
      <div class="chat" data-chat aria-live="polite"></div>
      <div class="dock" data-dock></div>
    </div>`;
  const chat = root.querySelector('[data-chat]');
  const dock = root.querySelector('[data-dock]');
  const bar = root.querySelector('[data-progress]');

  // Os ramos têm tamanhos diferentes: a barra avança pelo caminho percorrido.
  const approxLen = Math.max(12, Math.round(Object.keys(nodes).length * 0.6));
  // O painel de respostas é fixo embaixo: rola a página até o fim da conversa.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollDown = () => requestAnimationFrame(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }));

  function add(el) { chat.appendChild(el); scrollDown(); return el; }

  function bubble({ who, speaker, en, pt, html }) {
    const el = document.createElement('div');
    el.className = `bubble ${who === 'you' ? 'you' : 'them'}`;
    el.innerHTML = `
      <span class="bubble-name">${esc(fmt(speaker))}</span>
      <p class="bubble-en" lang="en">${html || esc(fmt(en))} ${speakBtn(fmt(en))}</p>
      ${pt ? `<details class="bubble-pt"><summary>tradução</summary><p>${esc(fmt(pt))}</p></details>` : ''}`;
    return add(el);
  }

  function continueDock(extra = '', next) {
    dock.innerHTML = `${extra}<button type="button" class="btn btn-primary btn-lg wide" data-next>Continuar ${icon('chevron', 18)}</button>`;
    dock.dataset.next = next;
    dock.querySelector('[data-next]').focus({ preventScroll: true });
    scrollDown();
  }

  function kikoNote(text, tone) {
    const el = document.createElement('div');
    el.className = `kiko-note tone-${tone}`;
    el.innerHTML = `<img src="img/mascot-avatar.png" alt="" width="28" height="28"><p>${esc(fmt(text))}</p>`;
    return add(el);
  }

  function finishTyping() {
    if (typing) { typing.finish(); typing = null; }
  }

  // Máquina de escrever na narração (termina na hora ao tocar em Continuar).
  function typewrite(el, text) {
    const chars = [...text];
    let i = 0;
    const t = { finish() { clearInterval(t.timer); el.textContent = text; el.classList.remove('writing'); } };
    el.classList.add('writing');
    t.timer = setInterval(() => {
      i += 2;
      el.textContent = chars.slice(0, i).join('');
      if (i >= chars.length) { t.finish(); if (typing === t) typing = null; }
    }, 18);
    typing = t;
  }

  function markTask(tone) {
    tasks += 1;
    if (tone === 'good') good += 1;
  }

  function go(id) {
    if (!alive) return;
    finishTyping();
    stopSpeech();
    const n = nodes[id];
    visited.push(id);
    bar.innerHTML = progressBar(Math.min(0.95, visited.length / approxLen), 'Progresso do capítulo');
    firstTry = true;

    switch (n.type) {
      case 'narration': {
        const el = document.createElement('div');
        el.className = `narration mood-${n.mood || 'talk'}`;
        el.innerHTML = `<img class="kiko" src="img/mascot-avatar.png" alt="" width="44" height="44"><div><span class="bubble-name">Kiko, seu guia</span><p data-text></p></div>`;
        add(el);
        const text = fmt(n.pt);
        typewrite(el.querySelector('[data-text]'), text);
        if (narrationOn()) speakPt(text);
        continueDock('', n.next);
        break;
      }
      case 'line': {
        const show = () => {
          if (!alive) return;
          bubble(n);
          speak(fmt(n.en));
          continueDock('', n.next);
        };
        if (n.who === 'them') {
          dock.innerHTML = '';
          const dots = document.createElement('div');
          dots.className = 'bubble them typing';
          dots.setAttribute('aria-label', 'digitando');
          dots.innerHTML = '<span></span><span></span><span></span>';
          add(dots);
          later(() => { dots.remove(); show(); }, 650);
        } else show();
        break;
      }
      case 'tip': {
        const el = document.createElement('div');
        el.className = 'tip-card';
        el.innerHTML = `
          <p class="tip-title"><span aria-hidden="true">${n.icon}</span> Dica cultural: ${esc(fmt(n.title))}</p>
          <p>${esc(fmt(n.pt))}</p>
          ${n.dos.length ? `<ul class="dos">${n.dos.map((d) => `<li>✅ ${esc(fmt(d))}</li>`).join('')}</ul>` : ''}
          ${n.donts.length ? `<ul class="donts">${n.donts.map((d) => `<li>🚫 ${esc(fmt(d))}</li>`).join('')}</ul>` : ''}`;
        add(el);
        if (narrationOn()) speakPt(`${fmt(n.title)}. ${fmt(n.pt)}`);
        continueDock('', n.next);
        break;
      }
      case 'explain': {
        const el = document.createElement('div');
        el.className = 'explain-card';
        el.innerHTML = `
          <p class="tip-title">📘 Entenda: ${esc(fmt(n.title))}</p>
          <p>${esc(fmt(n.pt))}</p>
          ${n.examples.length ? `<ul class="examples">${n.examples.map((x) => `<li><span lang="en"><strong>${esc(fmt(x.en))}</strong></span> ${speakBtn(fmt(x.en))}<br><span class="muted">${esc(fmt(x.pt))}</span></li>`).join('')}</ul>` : ''}`;
        add(el);
        if (narrationOn()) speakPt(fmt(n.pt));
        continueDock('', n.next);
        break;
      }
      case 'choice': {
        delete dock.dataset.next;
        dock.innerHTML = `
          <p class="dock-prompt">💬 ${esc(fmt(n.prompt))}</p>
          <div class="options single">${shuffle(n.options.map((o, k) => ({ o, k }))).map(({ o, k }) => `
            <button type="button" class="option ${o.lang === 'pt' ? 'action' : ''}" data-choice="${k}" ${o.lang === 'en' ? 'lang="en"' : ''}>
              <span class="option-text">${o.lang === 'pt' ? '🎬 ' : ''}${esc(fmt(o.text))}</span><span class="option-mark" aria-hidden="true"></span>
            </button>`).join('')}</div>`;
        dock.querySelector('[data-choice]').focus({ preventScroll: true });
        scrollDown();
        break;
      }
      case 'gap': {
        delete dock.dataset.next;
        const html = esc(fmt(n.en)).replace('___', '<span class="blank" data-blank>_____</span>');
        bubble({ ...n, html });
        dock.innerHTML = `
          <p class="dock-prompt">✏️ Complete a frase <span class="muted small">(${esc(fmt(n.pt))})</span></p>
          <div class="tiles">${shuffle(n.options).map((o) => `<button type="button" class="tile big" data-gap="${esc(fmt(o))}" lang="en">${esc(fmt(o))}</button>`).join('')}</div>
          <div class="dock-feedback" role="status" aria-live="assertive"></div>`;
        scrollDown();
        break;
      }
      case 'build': {
        delete dock.dataset.next;
        const b = buildDock(n);
        dock.innerHTML = b.html;
        scrollDown();
        wireBuild(dock, b.target, (ok) => {
          markTask(ok ? 'good' : 'bad');
          bubble({ who: 'you', speaker: 'Você', en: n.en, pt: n.pt });
          speak(b.en);
          continueDock(`<div class="feedback ${ok ? 'ok' : 'bad'}"><p><strong>${ok ? '✓ Perfeito!' : '✗ Quase!'}</strong>${ok ? '' : ` O certo é: <span lang="en">${esc(b.en)}</span>`}</p></div>`, n.next);
        });
        break;
      }
      case 'end':
        complete(n);
        break;
      default:
        go(n.next);
    }
  }

  function onChoice(btn) {
    const n = nodes[visited[visited.length - 1]];
    const o = n.options[Number(btn.dataset.choice)];
    markTask(o.tone);
    dock.querySelectorAll('[data-choice]').forEach((b) => { b.disabled = true; });
    btn.classList.add(o.tone === 'good' ? 'is-correct' : o.tone === 'ok' ? 'is-ok' : 'is-wrong');
    btn.querySelector('.option-mark').textContent = o.tone === 'good' ? '✓' : o.tone === 'ok' ? '~' : '✗';
    if (o.lang === 'pt') {
      const el = document.createElement('div');
      el.className = 'action-chip';
      el.textContent = `🎬 ${fmt(o.text)}`;
      add(el);
    } else {
      bubble({ who: 'you', speaker: 'Você', en: o.text, pt: o.pt });
      speak(fmt(o.text));
    }
    kikoNote(o.fb, o.tone);
    const label = o.tone === 'good' ? '✓ Boa escolha!' : o.tone === 'ok' ? '〜 Funciona!' : '✗ Hmm…';
    continueDock(`<p class="choice-result tone-${o.tone}"><strong>${label}</strong></p>`, o.next);
  }

  function onGap(btn) {
    const n = nodes[visited[visited.length - 1]];
    const answer = fmt(n.answer);
    const fb = dock.querySelector('.dock-feedback');
    if (btn.dataset.gap === answer) {
      markTask(firstTry ? 'good' : 'ok');
      const blank = chat.querySelector('[data-blank]:not(.filled)');
      if (blank) { blank.textContent = answer; blank.classList.add('filled'); }
      speak(fmt(n.en).replace('___', answer));
      continueDock(`<div class="feedback ok"><p><strong>✓ Isso!</strong> ${firstTry ? 'Acertou de primeira.' : ''}</p></div>`, n.next);
    } else {
      firstTry = false;
      btn.classList.add('wrong');
      btn.disabled = true;
      fb.innerHTML = '<div class="feedback bad"><p><strong>✗ Não encaixa aqui.</strong> Tente outra palavra.</p></div>';
    }
  }

  function complete(endNode) {
    finished = true;
    stopSpeech();
    const pct = Math.round((good / Math.max(tasks, 1)) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
    const firstTime = !done(chapter);
    const xp = (firstTime ? XP.chapterFirst : XP.chapterRepeat) + good * XP.perGood;
    const seconds = Math.min(Math.round((Date.now() - startedAt) / 1000), 1800);
    const prevBest = store.get().lessons[chapter.lessonId]?.score || 0;
    store.recordLesson({ lessonId: chapter.lessonId, title: `Viagem: ${chapter.title}`, xp, seconds, score: Math.max(pct, prevBest) });

    const seen = new Set(store.getFlag(seenKey(trip, chapter), []));
    visited.forEach((id) => seen.add(id));
    store.setFlag(seenKey(trip, chapter), [...seen]);
    const endings = new Set(store.getFlag(endKey(trip, chapter), []));
    const newEnding = !endings.has(endNode.ending);
    endings.add(endNode.ending);
    store.setFlag(endKey(trip, chapter), [...endings]);
    const d = discovery(trip, chapter);
    const nextCh = trip.chapters[idx + 1];

    root.innerHTML = `
      <div class="lesson done-screen">
        ${sceneHtml(chapter.scene)}
        <div class="stars-row" aria-label="${stars} de 3 estrelas">${[1, 2, 3].map((s) => `<span class="star ${s <= stars ? 'on' : ''}" style="animation-delay:${s * 0.15}s">⭐</span>`).join('')}</div>
        <h1>${esc(endNode.title)}</h1>
        <p class="end-text">${esc(fmt(endNode.pt))}</p>
        <div class="reward-row">
          <div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>
          <div class="card reward"><span aria-hidden="true">🧭</span><strong>${Math.round(d.pct * 100)}% dos caminhos</strong></div>
          ${d.totalEndings > 1 ? `<div class="card reward"><span aria-hidden="true">🏁</span><strong>${d.endings}/${d.totalEndings} finais${newEnding && d.endings > 1 ? ' · novo!' : ''}</strong></div>` : ''}
        </div>
        <p class="muted small">${good} de ${tasks} escolhas ótimas. ${d.pct < 0.99 ? 'Refaça escolhendo outras opções para ver o que acontece!' : 'Você explorou todos os caminhos! 🏆'}</p>
        <div class="stack">
          ${nextCh ? `<a class="btn btn-primary btn-lg" href="#/viagem/${trip.id}/${nextCh.id}">Próximo: ${nextCh.emoji} ${esc(nextCh.title)}</a>` : `<p class="trip-finish">🎉 Você completou a ${esc(trip.title)}!</p>`}
          <a class="btn btn-ghost" href="#/viagem/${trip.id}/${chapter.id}?${Date.now()}">🔀 Refazer com outras escolhas</a>
          <a class="btn btn-ghost" href="#/viagem">Ver capítulos</a>
        </div>
      </div>`;
    if (narrationOn()) speakPt(`${endNode.title}. ${fmt(endNode.pt)}`);
    root.querySelector('.btn-primary, .btn')?.focus({ preventScroll: true });
  }

  function onClick(e) {
    const say = e.target.closest('[data-say]');
    if (say) { speak(say.dataset.say); return; }
    const narr = e.target.closest('[data-narr]');
    if (narr) {
      const on = !narrationOn();
      store.setLocalPref({ narration: on });
      narr.textContent = on ? '🔊' : '🔇';
      narr.setAttribute('aria-pressed', String(on));
      narr.setAttribute('aria-label', `${on ? 'Desligar' : 'Ligar'} narração`);
      if (!on) stopSpeech();
      toast(on ? 'Narração ligada' : 'Narração desligada');
      return;
    }
    if (finished) return;
    if (e.target.closest('[data-next]')) {
      const nx = dock.dataset.next;
      delete dock.dataset.next;
      if (nx) go(nx);
      return;
    }
    const c = e.target.closest('[data-choice]');
    if (c && !c.disabled) { onChoice(c); return; }
    const g = e.target.closest('[data-gap]');
    if (g && !g.disabled) onGap(g);
  }

  root.addEventListener('click', onClick);
  const begin = () => go(chapter.start);
  if (!store.get().profile.gender) genderPicker(begin); else begin();

  return () => {
    alive = false;
    finishTyping();
    timers.forEach(clearTimeout);
    root.removeEventListener('click', onClick);
    document.body.classList.remove('lesson-mode');
    document.querySelector('.modal-backdrop')?.remove();
    stopSpeech();
  };
}

// ---------- Treino avulso: monte a frase ----------

async function renderPractice(root, tripId) {
  let trip;
  try { trip = await loadTrip(tripId); } catch (e) { location.hash = '#/viagem'; return null; }
  const pool = [];
  trip.chapters.forEach((c, k) => {
    if (!unlocked(trip, k)) return;
    Object.values(c.nodes).forEach((n) => {
      if (n.type === 'build') pool.push({ pt: n.pt, en: n.en, extra: n.extra });
      if (n.type === 'choice') {
        n.options.filter((o) => o.tone === 'good' && o.lang === 'en' && o.pt && o.text.split(' ').length <= 9)
          .forEach((o) => pool.push({ pt: o.pt, en: o.text, extra: [] }));
      }
      if (n.type === 'line' && n.who === 'you' && n.en.split(' ').length <= 8) pool.push({ pt: n.pt, en: n.en, extra: [] });
    });
  });
  const items = shuffle(pool).slice(0, 8);
  if (!items.length) { toast('Libere um capítulo primeiro'); location.hash = '#/viagem'; return null; }
  const startedAt = Date.now();
  let i = 0;
  let right = 0;
  document.body.classList.add('lesson-mode');

  function show() {
    const b = buildDock(items[i]);
    root.innerHTML = `
      <div class="lesson">
        <div class="lesson-top">
          <a class="icon-btn" href="#/viagem" aria-label="Sair do treino">${icon('close')}</a>
          ${progressBar(i / items.length, 'Progresso do treino')}
          <span class="muted small">${i + 1}/${items.length}</span>
        </div>
        <p class="eyebrow center">🧩 Monte a frase · ${trip.emoji} ${esc(trip.title)}</p>
        <div class="card dock standalone" data-dock>${b.html}</div>
      </div>`;
    const dock = root.querySelector('[data-dock]');
    wireBuild(dock, b.target, (ok) => {
      if (ok) right += 1;
      speak(b.en);
      dock.innerHTML = `
        <div class="feedback ${ok ? 'ok' : 'bad'}">
          <p><strong>${ok ? '✓ Perfeito!' : '✗ Quase!'}</strong></p>
          <p lang="en" class="bubble-en">${esc(b.en)} ${speakBtn(b.en)}</p>
          <p class="muted">${esc(fmt(items[i].pt))}</p>
        </div>
        <button type="button" class="btn btn-primary btn-lg wide" data-next>${i < items.length - 1 ? 'Próxima' : 'Ver resultado'} ${icon('chevron', 18)}</button>`;
      dock.querySelector('[data-next]').focus({ preventScroll: true });
    });
  }

  function finish() {
    const xp = right * XP.perGood;
    store.recordQuizSession({ xp, seconds: Math.min(Math.round((Date.now() - startedAt) / 1000), 1800), type: 'build', ref: trip.id, title: `Monte a frase: ${right}/${items.length}` });
    root.innerHTML = `
      <div class="lesson done-screen">
        <div class="burst" aria-hidden="true">🧩</div>
        <h1>${right === items.length ? 'Perfeito!' : 'Bom treino!'}</h1>
        <p class="score-big"><strong>${right}</strong> de ${items.length} frases</p>
        <div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/viagem/${trip.id}/frases?${Date.now()}">Treinar de novo</a>
          <a class="btn btn-ghost" href="#/viagem">Voltar à viagem</a>
        </div>
      </div>`;
  }

  function onClick(e) {
    const say = e.target.closest('[data-say]');
    if (say) { speak(say.dataset.say); return; }
    if (e.target.closest('[data-next]')) {
      if (i < items.length - 1) { i += 1; show(); } else finish();
    }
  }

  root.addEventListener('click', onClick);
  if (!store.get().profile.gender) genderPicker(show); else show();
  return () => {
    root.removeEventListener('click', onClick);
    document.body.classList.remove('lesson-mode');
    document.querySelector('.modal-backdrop')?.remove();
    stopSpeech();
  };
}

export function render(root, { trip, chapter }) {
  if (!trip) return renderIndex(root);
  if (chapter === 'frases') return renderPractice(root, trip);
  return renderChapter(root, trip, chapter);
}
