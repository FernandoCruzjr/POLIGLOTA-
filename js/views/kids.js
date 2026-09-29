// Área Kids: vocabulário essencial por imagem + som + nome + tradução.
// Bom para crianças e para adultos que querem aprender sem pressão.
import * as store from '../store.js';
import { icon } from '../icons.js';
import { esc, toast, coinReward } from '../ui.js';
import { speak, speakPt, stopSpeech } from '../speech.js';
import { shuffle } from '../quiz-engine.js';
import { kikoHtml } from '../kiko.js';
import '../game.js';
import KIDS_CSS from './kids-styles.js';

if (!document.getElementById('hf-kids-styles')) {
  const st = document.createElement('style');
  st.id = 'hf-kids-styles';
  st.textContent = KIDS_CSS;
  document.head.appendChild(st);
}

let data = null;
async function load() {
  if (data) return data;
  const res = await fetch('data/kids.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('kids');
  data = (await res.json()).categories;
  return data;
}

const seenKey = (cat) => `kids.${cat.id}.seen`;
const bestKey = (cat, game) => `kids.${cat.id}.${game}`;
const seenOf = (cat) => new Set(store.getFlag(seenKey(cat), []));

// O "desenho" de cada item: emoji, bolinha de cor ou número com pontinhos.
function picture(cat, it, big = false) {
  if (cat.kind === 'color') return `<span class="kd-swatch ${it.en === 'white' ? 'light' : ''}" style="background:${it.hex}" aria-hidden="true"></span>`;
  if (cat.kind === 'number') {
    const dots = it.n > 0 && it.n <= 10 ? `<span class="kd-dots">${'<i></i>'.repeat(it.n)}</span>` : '';
    return `<span class="kd-num" aria-hidden="true"><b>${it.n}</b>${big ? dots : ''}</span>`;
  }
  return `<span class="kd-emoji" aria-hidden="true">${it.emoji}</span>`;
}

// Fala o item: nome, depois a frase (o som do bicho ou onde fica o objeto).
function sayItem(cat, it, slow = false) {
  if (cat.kind === 'animal') return speak(`${it.en}! ... ${it.say}`, { slow });
  if (cat.kind === 'object') return speak(`${it.en}! ... ${it.say}`, { slow });
  return speak(`${it.en}! ... ${it.say && it.say !== it.en ? it.say : ''}`, { slow });
}

const TIPS = {
  animal: 'Imite o som junto com o app! Rir enquanto aprende faz a palavra grudar na memória.',
  color: 'Aponte para coisas ao seu redor e diga a cor em inglês: "The car is red."',
  number: 'Conte em inglês tudo o que puder hoje: degraus, pratos, pessoas na fila…',
  object: 'Missão do dia: vá até este cômodo da sua casa, aponte para 3 objetos e diga o nome em inglês.',
};

// ---------- Início da Área Kids ----------

async function renderIndex(root) {
  let cats;
  try { cats = await load(); } catch (e) { root.innerHTML = '<div class="card empty"><p>Não foi possível abrir a Área Kids.</p></div>'; return null; }
  const house = cats.filter((c) => c.room);
  const others = cats.filter((c) => !c.room);
  const tile = (c) => {
    const seen = seenOf(c).size;
    const stars = Math.max(store.getFlag(bestKey(c, 'ouvir'), 0), store.getFlag(bestKey(c, 'memoria'), 0));
    return `<a class="kd-cat" href="#/kids/${c.id}" style="--c:${c.color}">
      <span class="kd-cat-emoji" aria-hidden="true">${c.emoji}</span>
      <strong>${esc(c.name)}</strong>
      <span class="kd-cat-en" lang="en">${esc(c.nameEn)}</span>
      <span class="kd-cat-meta">${seen}/${c.items.length} ${stars ? '⭐'.repeat(stars) : ''}</span>
    </a>`;
  };
  root.innerHTML = `
    <div class="kids">
      <header class="kd-hero">
        ${kikoHtml(72, { cls: 'kd-kiko' })}
        <div>
          <h1>Área Kids 🎈</h1>
          <p>Veja, ouça e repita! Aprender brincando vale para crianças… e para adultos também.</p>
        </div>
      </header>
      <section aria-labelledby="kd-basic">
        <h2 id="kd-basic" class="kd-title">🌈 Primeiras palavras</h2>
        <div class="kd-grid">${others.map(tile).join('')}</div>
      </section>
      <section aria-labelledby="kd-house">
        <h2 id="kd-house" class="kd-title">🏠 Minha casa</h2>
        <p class="muted small">Cada cômodo tem os objetos do dia a dia. Depois de estudar, faça a missão: vá até o cômodo e diga o nome das coisas em inglês.</p>
        <div class="kd-grid">${house.map(tile).join('')}</div>
      </section>
      <section class="card kd-media" aria-labelledby="kd-media">
        <h2 id="kd-media">📺 Para assistir e cantar junto</h2>
        <p class="muted small">Desenhos e canções infantis em inglês usam frases curtas, repetição e imagens: é a forma mais leve de ouvir inglês todo dia. Procure no YouTube:</p>
        <ul>
          <li><strong>Super Simple Songs</strong>: canções de cores, números e animais, bem devagar</li>
          <li><strong>Peppa Pig (em inglês)</strong>: episódios de 5 minutos com inglês do dia a dia</li>
          <li><strong>Bluey</strong>: família, casa e brincadeiras (ótimo para assistir juntos)</li>
          <li><strong>Sesame Street</strong>: letras, números e muita música</li>
        </ul>
        <p class="muted small">Dica: assista primeiro com legenda em inglês e, na segunda vez, sem legenda.</p>
      </section>
    </div>`;
  return null;
}

// ---------- Cartões (ver, tocar, ouvir) ----------

async function renderCards(root, catId) {
  let cats;
  try { cats = await load(); } catch (e) { location.hash = '#/kids'; return null; }
  const cat = cats.find((c) => c.id === catId);
  if (!cat) { location.hash = '#/kids'; return null; }
  const seen = seenOf(cat);
  let slow = false;

  root.innerHTML = `
    <div class="kids">
      <a class="back-link" href="#/kids">${icon('back', 18)} Área Kids</a>
      <header class="kd-cat-head" style="--c:${cat.color}">
        <span class="kd-cat-emoji" aria-hidden="true">${cat.emoji}</span>
        <div><h1>${esc(cat.name)} <span lang="en">· ${esc(cat.nameEn)}</span></h1><p class="small">Toque em cada cartão para ver e ouvir.</p></div>
      </header>
      <p class="kd-tip">💡 ${esc(TIPS[cat.kind])}</p>
      <div class="kd-actions">
        <a class="btn btn-primary" href="#/kids/${cat.id}/ouvir">👂 Ouça e toque</a>
        <a class="btn btn-soft" href="#/kids/${cat.id}/memoria">🃏 Jogo da memória</a>
        <button type="button" class="btn btn-ghost" data-slow aria-pressed="false">🐢 Devagar</button>
      </div>
      <p class="muted small" data-count>${seen.size} de ${cat.items.length} cartões vistos</p>
      <div class="kd-cards">
        ${cat.items.map((it, i) => `
          <button type="button" class="kd-card ${seen.has(it.id) ? 'seen' : ''}" data-i="${i}" style="--c:${cat.color}" aria-label="${esc(it.en)}, ${esc(it.pt)}">
            ${picture(cat, it, true)}
            <span class="kd-word" lang="en">${esc(it.en)}</span>
            <span class="kd-back">
              <span class="kd-pron">🗣️ ${esc(it.pron)}</span>
              <span class="kd-pt">🇧🇷 ${esc(it.pt)}</span>
            </span>
          </button>`).join('')}
      </div>
    </div>`;

  function onClick(e) {
    const s = e.target.closest('[data-slow]');
    if (s) { slow = !slow; s.setAttribute('aria-pressed', String(slow)); s.classList.toggle('on', slow); toast(slow ? 'Voz devagar ligada 🐢' : 'Voz normal'); return; }
    const card = e.target.closest('[data-i]');
    if (!card) return;
    const it = cat.items[Number(card.dataset.i)];
    const wasOpen = card.classList.contains('open');
    root.querySelectorAll('.kd-card.open').forEach((c) => c.classList.remove('open'));
    card.classList.remove('bounce'); void card.offsetWidth; card.classList.add('bounce');
    if (wasOpen) { speakPt(`"${it.en}" quer dizer ${it.pt}.`); return; }
    card.classList.add('open', 'seen');
    sayItem(cat, it, slow);
    if (!seen.has(it.id)) {
      seen.add(it.id);
      store.setFlag(seenKey(cat), [...seen]);
      root.querySelector('[data-count]').textContent = `${seen.size} de ${cat.items.length} cartões vistos${seen.size === cat.items.length ? ' 🎉' : ''} · toque de novo para ouvir a tradução`;
      if (seen.size === cat.items.length) { store.addCoins(3); toast('Você viu todos os cartões! +3 🪙'); }
    }
  }
  root.addEventListener('click', onClick);
  return () => { root.removeEventListener('click', onClick); stopSpeech(); };
}

// ---------- Jogo: ouça e toque ----------

async function renderListen(root, catId) {
  let cats;
  try { cats = await load(); } catch (e) { location.hash = '#/kids'; return null; }
  const cat = cats.find((c) => c.id === catId);
  if (!cat) { location.hash = '#/kids'; return null; }
  const ROUNDS = Math.min(8, cat.items.length);
  const targets = shuffle(cat.items).slice(0, ROUNDS);
  const startedAt = Date.now();
  let r = 0;
  let firstTry = true;
  let right = 0;
  let locked = false;
  document.body.classList.add('lesson-mode');

  function round() {
    const t = targets[r];
    const opts = shuffle([t, ...shuffle(cat.items.filter((x) => x !== t)).slice(0, 3)]);
    firstTry = true;
    locked = false;
    root.innerHTML = `
      <div class="kids lesson">
        <div class="lesson-top">
          <a class="icon-btn" href="#/kids/${cat.id}" aria-label="Sair do jogo">${icon('close')}</a>
          <div class="kd-stars-row grow" aria-label="Rodada ${r + 1} de ${ROUNDS}">${targets.map((_, k) => `<span class="${k < r ? 'on' : k === r ? 'now' : ''}">●</span>`).join('')}</div>
        </div>
        <div class="kd-ask">
          ${kikoHtml(64, { cls: 'kd-kiko' })}
          <div>
            <p class="kd-ask-q">Onde está…?</p>
            <button type="button" class="btn btn-primary btn-lg kd-say" data-say>🔊 Ouvir de novo</button>
            ${cat.kind === 'animal' ? '<button type="button" class="btn btn-ghost" data-hint>🐾 Dica: o som</button>' : ''}
          </div>
        </div>
        <div class="kd-pick">
          ${opts.map((o) => `<button type="button" class="kd-opt" data-id="${o.id}" style="--c:${cat.color}" aria-label="Opção">${picture(cat, o, true)}</button>`).join('')}
        </div>
        <p class="kd-feedback" role="status" aria-live="assertive"></p>
      </div>`;
    setTimeout(() => speak(t.en), 250);
  }

  function pick(btn) {
    if (locked) return;
    const t = targets[r];
    const fb = root.querySelector('.kd-feedback');
    if (btn.dataset.id === t.id) {
      locked = true;
      if (firstTry) right += 1;
      btn.classList.add('right');
      fb.innerHTML = `🎉 <strong lang="en">Yes! ${esc(t.en)}!</strong> = ${esc(t.pt)}`;
      speak(`Yes! ${t.en}!`);
      setTimeout(() => { r += 1; if (r < ROUNDS) round(); else finish(); }, 1600);
    } else {
      firstTry = false;
      btn.classList.add('wrong');
      btn.disabled = true;
      fb.textContent = 'Quase! Ouça de novo e tente outra. 💪';
      speak(`Try again! ${t.en}`);
    }
  }

  function finish() {
    const stars = right >= ROUNDS ? 3 : right >= ROUNDS * 0.6 ? 2 : 1;
    const xp = right * 2;
    store.recordQuizSession({ xp, seconds: Math.min(Math.round((Date.now() - startedAt) / 1000), 900), type: 'kids', ref: cat.id, title: `Kids: ${cat.name} (${right}/${ROUNDS})` });
    const coins = store.addCoins(Math.ceil(right / 2));
    if (stars > store.getFlag(bestKey(cat, 'ouvir'), 0)) store.setFlag(bestKey(cat, 'ouvir'), stars);
    root.innerHTML = `
      <div class="kids lesson done-screen">
        <div class="kd-confetti" aria-hidden="true">${'🎈🎉⭐🌈🎊'.repeat(3)}</div>
        <div class="stars-row" aria-label="${stars} de 3 estrelas">${[1, 2, 3].map((s) => `<span class="star ${s <= stars ? 'on' : ''}" style="animation-delay:${s * 0.15}s">⭐</span>`).join('')}</div>
        <h1>${stars === 3 ? 'Perfeito! Great job!' : 'Muito bem! Good job!'}</h1>
        <p class="score-big"><strong>${right}</strong> de ${ROUNDS} de primeira</p>
        <div class="reward-row"><div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>${coinReward(coins)}</div>
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/kids/${cat.id}/ouvir?${Date.now()}">Jogar de novo</a>
          <a class="btn btn-soft" href="#/kids/${cat.id}/memoria">🃏 Jogo da memória</a>
          <a class="btn btn-ghost" href="#/kids/${cat.id}">Ver os cartões</a>
        </div>
      </div>`;
    speak(stars === 3 ? 'Great job!' : 'Good job!');
  }

  function onClick(e) {
    if (e.target.closest('[data-say]')) { speak(targets[r].en, { slow: true }); return; }
    if (e.target.closest('[data-hint]')) { speak(targets[r].sound); return; }
    const b = e.target.closest('[data-id]');
    if (b && !b.disabled) pick(b);
  }
  root.addEventListener('click', onClick);
  round();
  return () => { root.removeEventListener('click', onClick); document.body.classList.remove('lesson-mode'); stopSpeech(); };
}

// ---------- Jogo da memória ----------

async function renderMemory(root, catId) {
  let cats;
  try { cats = await load(); } catch (e) { location.hash = '#/kids'; return null; }
  const cat = cats.find((c) => c.id === catId);
  if (!cat) { location.hash = '#/kids'; return null; }
  const PAIRS = 6;
  const chosen = shuffle(cat.items).slice(0, PAIRS);
  const deck = shuffle(chosen.flatMap((it) => [{ it, face: 'pic' }, { it, face: 'word' }]));
  const startedAt = Date.now();
  let open = [];
  let moves = 0;
  let found = 0;
  let busy = false;
  document.body.classList.add('lesson-mode');

  root.innerHTML = `
    <div class="kids lesson">
      <div class="lesson-top">
        <a class="icon-btn" href="#/kids/${cat.id}" aria-label="Sair do jogo">${icon('close')}</a>
        <p class="eyebrow grow center">🃏 Memória · ${esc(cat.name)}</p>
        <span class="muted small" data-moves>0 jogadas</span>
      </div>
      <p class="muted small center">Ache os pares: o desenho e o nome em inglês.</p>
      <div class="kd-memory">
        ${deck.map((d, i) => `
          <button type="button" class="kd-mem" data-k="${i}" style="--c:${cat.color}" aria-label="Carta ${i + 1}, virada para baixo">
            <span class="kd-mem-back" aria-hidden="true">❓</span>
            <span class="kd-mem-face">${d.face === 'pic' ? picture(cat, d.it) : `<span class="kd-mem-word" lang="en">${esc(d.it.en)}</span>`}</span>
          </button>`).join('')}
      </div>
    </div>`;

  function flip(btn) {
    const k = Number(btn.dataset.k);
    if (busy || btn.classList.contains('up')) return;
    btn.classList.add('up');
    btn.setAttribute('aria-label', deck[k].face === 'pic' ? `Desenho de ${deck[k].it.pt}` : deck[k].it.en);
    if (deck[k].face === 'word') speak(deck[k].it.en);
    open.push(btn);
    if (open.length < 2) return;
    moves += 1;
    root.querySelector('[data-moves]').textContent = `${moves} jogadas`;
    const [a, b] = open.map((x) => deck[Number(x.dataset.k)]);
    if (a.it.id === b.it.id) {
      open.forEach((x) => { x.classList.add('match'); x.disabled = true; });
      open = [];
      found += 1;
      speak(`${a.it.en}!`);
      if (found === PAIRS) setTimeout(finish, 900);
    } else {
      busy = true;
      setTimeout(() => {
        open.forEach((x) => { x.classList.remove('up'); x.setAttribute('aria-label', 'Carta virada para baixo'); });
        open = [];
        busy = false;
      }, 1000);
    }
  }

  function finish() {
    const stars = moves <= PAIRS + 3 ? 3 : moves <= PAIRS + 7 ? 2 : 1;
    const xp = 10;
    store.recordQuizSession({ xp, seconds: Math.min(Math.round((Date.now() - startedAt) / 1000), 900), type: 'kids', ref: cat.id, title: `Kids: memória de ${cat.name} (${moves} jogadas)` });
    const coins = store.addCoins(stars + 1);
    if (stars > store.getFlag(bestKey(cat, 'memoria'), 0)) store.setFlag(bestKey(cat, 'memoria'), stars);
    root.innerHTML = `
      <div class="kids lesson done-screen">
        <div class="kd-confetti" aria-hidden="true">${'🃏⭐🎉🌈'.repeat(3)}</div>
        <div class="stars-row" aria-label="${stars} de 3 estrelas">${[1, 2, 3].map((s) => `<span class="star ${s <= stars ? 'on' : ''}" style="animation-delay:${s * 0.15}s">⭐</span>`).join('')}</div>
        <h1>Você achou todos os pares!</h1>
        <p class="score-big"><strong>${moves}</strong> jogadas</p>
        <ul class="kd-learned">${chosen.map((it) => `<li>${picture(cat, it)} <strong lang="en">${esc(it.en)}</strong> <span class="muted">${esc(it.pt)}</span></li>`).join('')}</ul>
        <div class="reward-row"><div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>${coinReward(coins)}</div>
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="#/kids/${cat.id}/memoria?${Date.now()}">Jogar de novo</a>
          <a class="btn btn-ghost" href="#/kids">Área Kids</a>
        </div>
      </div>`;
    speak('Well done!');
  }

  function onClick(e) {
    const b = e.target.closest('[data-k]');
    if (b && !b.disabled) flip(b);
  }
  root.addEventListener('click', onClick);
  return () => { root.removeEventListener('click', onClick); document.body.classList.remove('lesson-mode'); stopSpeech(); };
}

export function render(root, { cat, game }) {
  if (!cat) return renderIndex(root);
  if (game === 'ouvir') return renderListen(root, cat);
  if (game === 'memoria') return renderMemory(root, cat);
  return renderCards(root, cat);
}
