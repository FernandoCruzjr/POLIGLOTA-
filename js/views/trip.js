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
const INKS = ['#1D4ED8', '#B91C1C', '#0F7A4A', '#7C3AED', '#C2410C', '#0E7490', '#BE185D', '#4D7C0F', '#1E3A8A', '#9A3412'];
const inkFor = (i) => INKS[i % INKS.length];

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
      <img src="img/kiko-prof.png" alt="" width="72" height="72" class="modal-mascot">
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

// ---------- Mapa de aventura ----------

const MAP_W = 400;
const STEP_Y = 175;
const TOP_Y = 150;
const XS = [120, 285, 115, 290, 130, 280, 110, 295, 125, 275];

function mapLayout(n) {
  const pts = [];
  for (let i = 0; i < n; i += 1) pts.push({ x: XS[i % XS.length], y: TOP_Y + i * STEP_Y });
  const chest = { x: 200, y: TOP_Y + n * STEP_Y + 10 };
  return { pts, chest, h: chest.y + 170 };
}

// Trilha: sai de baixo do nome de uma ilha e chega por cima da próxima.
function pathD(points) {
  if (points.length < 2) return '';
  let d = '';
  for (let i = 1; i < points.length; i += 1) {
    const a = { x: points[i - 1].x, y: points[i - 1].y + 82 };
    const b = { x: points[i].x, y: points[i].y - 48 };
    const my = (a.y + b.y) / 2;
    d += `${i === 1 ? `M ${a.x} ${a.y}` : ` M ${a.x} ${a.y}`} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
  }
  return d;
}

const pct = (v, total) => `${(v / total) * 100}%`;

function kikoLine(trip, pr) {
  if (!pr.done) return 'Oi! Sou o Professor Kiko. Toque na primeira ilha para começar nossa aula!';
  if (!pr.next) return `Você completou a ${trip.title}! Abra o baú e veja seu passaporte! 🏆`;
  return `Muito bem! Próxima aula: ${pr.next.title}. Bora?`;
}

async function renderIndex(root) {
  root.innerHTML = '<p class="muted center">Carregando o mapa…</p>';
  let trip;
  try {
    const list = await loadIndex();
    trip = await loadTrip(list[0].id);
  } catch (e) {
    root.innerHTML = '<div class="card empty"><p>Não foi possível carregar o mapa. Verifique a internet.</p></div>';
    return null;
  }
  const chs = trip.chapters;
  const pr = tripProgress(trip);
  const { pts, chest, h } = mapLayout(chs.length);
  const curIdx = pr.next ? chs.indexOf(pr.next) : chs.length; // chs.length = baú
  const kikoKey = `trip.${trip.id}.kikoAt`;
  const fromIdx = Math.min(store.getFlag(kikoKey, curIdx), curIdx);
  const posOf = (i) => (i >= chs.length ? chest : pts[i]);
  const allDone = !pr.next;
  const g = store.get().profile.gender;
  const doneCount = pr.done;
  const passportCount = chs.filter(done).length;

  root.classList.add('map-view');
  root.innerHTML = `
    <header class="map-header">
      <div class="map-title">
        <span class="trip-flag" aria-hidden="true">${trip.emoji}</span>
        <div>
          <h1>${esc(trip.title)}</h1>
          <p class="small">${doneCount} de ${chs.length} ilhas · fala como <button type="button" class="link-btn inline light" data-change-gender>${g === 'f' ? 'mulher (ka)' : g === 'm' ? 'homem (khrap)' : 'escolher'}</button></p>
        </div>
      </div>
      ${progressBar(doneCount / chs.length, 'Progresso da viagem')}
      <div class="map-actions">
        ${pr.next ? `<a class="map-btn primary" href="#/viagem/${trip.id}/${pr.next.id}">▶ ${pr.done ? 'Continuar' : 'Começar'}</a>` : ''}
        <a class="map-btn" href="#/passaporte">🛂 Passaporte <span class="badge">${passportCount}</span></a>
        <a class="map-btn" href="#/viagem/${trip.id}/frases">🧩 Monte a frase</a>
      </div>
    </header>

    <div class="map-world" style="aspect-ratio:${MAP_W}/${h}">
      <svg class="map-path" viewBox="0 0 ${MAP_W} ${h}" preserveAspectRatio="none" aria-hidden="true">
        <path d="${pathD([...pts, chest])}" class="trail-shadow"/>
        <path d="${pathD([...pts, chest])}" class="trail"/>
        ${curIdx > 0 ? `<path d="${pathD([...pts, chest].slice(0, curIdx + 1))}" class="trail done"/>` : ''}
      </svg>

      <span class="deco gem" style="left:8%;top:${pct(260, h)}">💎</span>
      <span class="deco gem g2" style="left:88%;top:${pct(620, h)}">💎</span>
      <span class="deco gem" style="left:6%;top:${pct(1180, h)}">💎</span>
      <span class="deco gem g2" style="left:90%;top:${pct(1520, h)}">💎</span>
      <span class="deco boat" style="top:${pct(420, h)}">⛵</span>
      <span class="deco boat b2" style="top:${pct(1010, h)}">🚤</span>
      <span class="deco boat b3" style="top:${pct(1650, h)}">🛶</span>
      <span class="deco fish" style="left:70%;top:${pct(330, h)}">🐠</span>
      <span class="deco fish f2" style="left:20%;top:${pct(880, h)}">🐟</span>

      <div class="map-start" style="left:${pct(200, MAP_W)};top:${pct(40, h)}">🛫 São Paulo → Bangkok</div>

      ${chs.map((c, i) => {
        const p = pts[i];
        const open = unlocked(trip, i);
        const isDone = done(c);
        const isNext = pr.next && pr.next.id === c.id;
        const stars = starsOf(c);
        const [main, side] = c.island || [c.emoji, ''];
        return `
        <button type="button" class="isle ${isDone ? 'done' : ''} ${isNext ? 'next' : ''} ${open ? '' : 'locked'}" data-ch="${i}"
          style="left:${pct(p.x, MAP_W)};top:${pct(p.y, h)};animation-delay:${(i % 4) * -0.7}s"
          aria-label="Ilha ${i + 1}: ${esc(c.title)}${isDone ? `, concluída com ${stars} estrelas` : open ? ', liberada' : ', bloqueada'}">
          <span class="isle-top"><span class="isle-main">${main}</span><span class="isle-side">${side}</span></span>
          <span class="isle-rock"></span>
          ${open ? '' : '<span class="isle-fog">☁️☁️</span><span class="isle-lock">🔒</span>'}
          <span class="isle-sign">Nível ${i + 1}</span>
          <span class="isle-name">${esc(c.title)}</span>
          ${isDone ? `<span class="isle-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>` : ''}
        </button>`;
      }).join('')}

      <button type="button" class="isle chest ${allDone ? 'open' : 'locked'}" data-chest style="left:${pct(chest.x, MAP_W)};top:${pct(chest.y, h)}" aria-label="Baú do fim da viagem${allDone ? ', aberto' : ', fechado'}">
        <span class="isle-top"><span class="isle-main">${allDone ? '🏆' : '🎁'}</span></span>
        <span class="isle-rock"></span>
        <span class="isle-sign gold">Baú final</span>
      </button>

      <div class="map-kiko" data-kiko style="left:${pct(posOf(fromIdx).x, MAP_W)};top:${pct(posOf(fromIdx).y, h)}">
        <span class="kiko-bubble">${esc(kikoLine(trip, pr))}</span>
        <img src="img/kiko-prof.png" alt="Professor Kiko" width="72" height="72">
      </div>
    </div>

    <section class="map-soon" aria-labelledby="soon-title">
      <h2 id="soon-title">🌍 Próximos destinos</h2>
      <div class="soon-isles">
        ${[['🇺🇸', 'Estados Unidos'], ['🇵🇹', 'Portugal'], ['🇬🇧', 'Londres'], ['🇫🇷', 'Paris']].map(([f, n]) => `<div class="soon-isle"><span>${f}</span><strong>${n}</strong><em>em breve</em></div>`).join('')}
      </div>
    </section>

    <div class="sheet-backdrop" data-sheet-bg hidden></div>
    <section class="sheet" data-sheet hidden role="dialog" aria-modal="true" aria-labelledby="sheet-title"></section>`;

  // Kiko caminha até a ilha atual quando você acabou de concluir uma aula.
  const kiko = root.querySelector('[data-kiko]');
  if (fromIdx !== curIdx) {
    requestAnimationFrame(() => setTimeout(() => {
      kiko.classList.add('walking');
      kiko.style.left = pct(posOf(curIdx).x, MAP_W);
      kiko.style.top = pct(posOf(curIdx).y, h);
      setTimeout(() => kiko.classList.remove('walking'), 1600);
    }, 500));
  }
  store.setFlag(kikoKey, curIdx);
  setTimeout(() => {
    const target = root.querySelector('.isle.next') || root.querySelector('.isle.chest');
    target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, 300);

  const sheet = root.querySelector('[data-sheet]');
  const sheetBg = root.querySelector('[data-sheet-bg]');
  const closeSheet = () => { sheet.hidden = true; sheetBg.hidden = true; stopSpeech(); };

  function openChapter(i) {
    const c = chs[i];
    if (!unlocked(trip, i)) { toast('Complete a ilha anterior para liberar esta. 🔒'); return; }
    const d = discovery(trip, c);
    const stars = starsOf(c);
    const isDone = done(c);
    sheet.innerHTML = `
      ${sceneHtml(c.scene)}
      <div class="sheet-body">
        <p class="eyebrow">Nível ${i + 1} · ${trip.emoji} ${esc(trip.title)}</p>
        <h2 id="sheet-title">${c.emoji} ${esc(c.title)}</h2>
        <p class="muted">${esc(c.summary)}</p>
        ${isDone ? `<p class="sheet-meta">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)} · 🧭 ${Math.round(d.pct * 100)}% dos caminhos${d.totalEndings > 1 ? ` · 🏁 ${d.endings}/${d.totalEndings} finais` : ''}</p>` : ''}
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/viagem/${trip.id}/${c.id}">${isDone ? '🔀 Jogar de novo' : '▶ Começar a aula'}</a>
          <button type="button" class="btn btn-ghost" data-close>Fechar</button>
        </div>
      </div>`;
    sheet.hidden = false;
    sheetBg.hidden = false;
    sheet.querySelector('.btn-primary').focus({ preventScroll: true });
  }

  function onClick(e) {
    const isle = e.target.closest('[data-ch]');
    if (isle) { openChapter(Number(isle.dataset.ch)); return; }
    if (e.target.closest('[data-chest]')) {
      if (allDone) { location.hash = '#/passaporte'; } else toast('Complete todas as ilhas para abrir o baú! 🎁');
      return;
    }
    if (e.target.closest('[data-kiko]')) { speakPt(kikoLine(trip, pr)); return; }
    if (e.target.closest('[data-close]') || e.target.closest('[data-sheet-bg]')) { closeSheet(); return; }
    if (e.target.closest('[data-change-gender]')) genderPicker(() => renderIndex(root));
  }
  const onKey = (e) => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); };
  root.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  return () => {
    root.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    root.classList.remove('map-view');
    stopSpeech();
  };
}

// ---------- Passaporte ----------

async function renderPassport(root) {
  root.innerHTML = '<p class="muted center">Abrindo o passaporte…</p>';
  let trip;
  try {
    const list = await loadIndex();
    trip = await loadTrip(list[0].id);
  } catch (e) {
    root.innerHTML = '<div class="card empty"><p>Não foi possível abrir o passaporte.</p></div>';
    return null;
  }
  const p = store.get().profile;
  const lessons = store.get().lessons;
  const chs = trip.chapters;
  const earned = chs.filter(done).length;
  const complete = earned === chs.length;
  const rot = (i) => [-8, 6, -4, 9, -10, 4, -6, 8, -3, 7][i % 10];

  root.innerHTML = `
    <a class="back-link" href="#/viagem">${icon('back', 18)} Mapa</a>
    <section class="passport-cover">
      <span class="pp-emblem">🌍</span>
      <p class="pp-kicker">Passaporte · Passport</p>
      <h1>Hi Family</h1>
      <p class="pp-name">${esc(p.name || 'Viajante')}</p>
      <p class="pp-count">${earned} de ${chs.length} carimbos · ${trip.emoji} ${esc(trip.title)}</p>
    </section>
    <section class="passport-page" aria-labelledby="pp-title">
      <h2 id="pp-title">${trip.emoji} Carimbos da Tailândia</h2>
      <ul class="stamp-grid">
        ${chs.map((c, i) => {
          const d = discovery(trip, c);
          const stars = starsOf(c);
          const info = lessons[c.lessonId];
          if (!done(c)) {
            return `<li class="stamp-slot"><span class="stamp empty"><span class="stamp-emoji">?</span><span class="stamp-name">Nível ${i + 1}</span></span></li>`;
          }
          const date = info && info.completedAt ? new Date(info.completedAt).toLocaleDateString('pt-BR') : '';
          return `<li class="stamp-slot">
            <span class="stamp ${d.pct >= 0.99 ? 'gold' : ''}" style="--ink:${inkFor(i)};transform:rotate(${rot(i)}deg)">
              <span class="stamp-emoji">${c.island ? c.island[0] : c.emoji}</span>
              <span class="stamp-name">${esc(c.title)}</span>
              <span class="stamp-date">${date}</span>
            </span>
            <span class="stamp-extra">${'⭐'.repeat(stars)}${d.pct >= 0.99 ? ' · 🧭 Explorador' : ''}</span>
          </li>`;
        }).join('')}
      </ul>
      ${complete ? `<div class="big-stamp"><span class="stamp big" style="--ink:#B91C1C"><span class="stamp-emoji">🇹🇭</span><span class="stamp-name">Tailândia completa</span><span class="stamp-date">Khob khun!</span></span></div>` : ''}
      <div class="pp-legend">
        <p>🛂 Um carimbo por aula concluída</p>
        <p>⭐ Estrelas pela sua melhor nota</p>
        <p>🥇 Carimbo dourado de <strong>Explorador</strong> ao descobrir 100% dos caminhos</p>
      </div>
    </section>`;
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
  const learned = [];
  const learn = (en, pt) => { const e = fmt(en); if (e && !learned.some((l) => l.en === e)) learned.push({ en: e, pt: fmt(pt) }); };
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
    el.innerHTML = `<img src="img/kiko-prof.png" alt="" width="28" height="28"><p>${esc(fmt(text))}</p>`;
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
        el.innerHTML = `<img class="kiko" src="img/kiko-prof.png" alt="" width="44" height="44"><div><span class="bubble-name">🎓 Professor Kiko</span><p data-text></p></div>`;
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
          if (n.who === 'you') learn(n.en, n.pt);
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
        el.className = 'explain-card board';
        el.innerHTML = `
          <p class="tip-title">✏️ No quadro do professor: ${esc(fmt(n.title))}</p>
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
          learn(n.en, n.pt);
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
      if (o.tone === 'good') learn(o.text, o.pt);
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
      if (n.who === 'you') learn(n.en.replace('___', n.answer), n.pt);
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
        ${firstTime ? `<a class="stamp-new" href="#/passaporte" aria-label="Carimbo novo no passaporte: ${esc(chapter.title)}">
          <span class="stamp stamp-slam" style="--ink:${inkFor(idx)}"><span class="stamp-emoji">${chapter.island ? chapter.island[0] : chapter.emoji}</span><span class="stamp-name">${esc(chapter.title)}</span><span class="stamp-date">${new Date().toLocaleDateString('pt-BR')}</span></span>
          <span class="stamp-label">🛂 Carimbo novo no passaporte!</span>
        </a>` : ''}
        ${learned.length ? `<section class="card class-review">
          <p class="tip-title">📝 Revisão da aula</p>
          <p class="muted small">Frases que você usou hoje. Toque para ouvir e repita em voz alta!</p>
          <ul>${learned.slice(0, 6).map((l) => `<li><span><strong lang="en">${esc(l.en)}</strong><br><span class="muted">${esc(l.pt)}</span></span>${speakBtn(l.en)}</li>`).join('')}</ul>
        </section>` : ''}
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
    if (e.target.closest('[data-start]')) { stopSpeech(); go(chapter.start); return; }
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

  // Plano da aula: o professor apresenta o que vai ser aprendido.
  function lessonPlan() {
    const phrases = Object.values(nodes).filter((n) => n.type === 'build').slice(0, 3);
    const el = document.createElement('div');
    el.className = 'plan-card';
    el.innerHTML = `
      <img class="kiko" src="img/kiko-prof.png" alt="" width="56" height="56">
      <div>
        <p class="tip-title">📋 Plano da aula ${chapter.number}</p>
        <p>${esc(chapter.summary)}</p>
        ${phrases.length ? `<p class="muted small">Frases que você vai dominar:</p><ul class="plan-list">${phrases.map((b) => `<li><strong lang="en">${esc(fmt(b.en))}</strong> <span class="muted">${esc(fmt(b.pt))}</span></li>`).join('')}</ul>` : ''}
      </div>`;
    add(el);
    if (narrationOn()) speakPt(`Aula ${chapter.number}: ${chapter.title}. ${chapter.summary} Vamos lá!`);
    dock.innerHTML = `<button type="button" class="btn btn-primary btn-lg wide" data-start>Começar a aula ${icon('chevron', 18)}</button>`;
    dock.querySelector('[data-start]').focus({ preventScroll: true });
  }

  root.addEventListener('click', onClick);
  const begin = () => lessonPlan();
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

export function render(root, { trip, chapter, passport }) {
  if (passport) return renderPassport(root);
  if (!trip) return renderIndex(root);
  if (chapter === 'frases') return renderPractice(root, trip);
  return renderChapter(root, trip, chapter);
}
