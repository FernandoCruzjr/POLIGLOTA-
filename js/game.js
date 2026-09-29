// Peças de "jogo" compartilhadas: mapa de ilhas (Viagem e Aprender), moedas,
// baú e o Kiko no mapa. Os estilos vão junto do código (ver game-styles.js).
import * as store from './store.js';
import { esc, toast, formatNumber } from './ui.js';
import { kikoHtml } from './kiko.js';
import { speakPt } from './speech.js';
import TRIP_CSS from './views/trip-styles.js';
import GAME_CSS from './game-styles.js';

if (!document.getElementById('hf-trip-styles')) {
  const st = document.createElement('style');
  st.id = 'hf-trip-styles';
  st.textContent = TRIP_CSS + GAME_CSS;
  document.head.appendChild(st);
}

// ---------- Temas ----------

export const THEMES = {
  ocean: { bg: '#1B4FA8', decos: ['💎', '⛵', '🐠', '🚤', '🐟', '💎', '🛶', '🐬'] },
  sunset: { bg: '#8A2F6B', decos: ['🌴', '🦩', '🎈', '🐊', '✨', '🌴', '🎆', '🦩'] },
  sakura: { bg: '#B8487E', decos: ['🌸', '🗻', '🎏', '⛩️', '🍣', '🌸', '🏮', '🍡'] },
  sky: { bg: '#6DB8EA', decos: ['☁️', '🎈', '🐦', '🌈', '☁️', '🪁', '🦋', '☁️'] },
};

export const coinChip = (light = true) =>
  `<a class="coin-chip ${light ? 'light' : ''}" href="#/loja" aria-label="${formatNumber(store.wallet().coins)} moedas. Abrir lojinha do Kiko"><span aria-hidden="true">🪙</span> ${formatNumber(store.wallet().coins)}</a>`;

// ---------- Mapa ----------

const MAP_W = 400;
const STEP_Y = 175;
const TOP_Y = 250;
const BANNER_GAP = 95;
const XS = [120, 285, 115, 290, 130, 280, 110, 295, 125, 275];
const pct = (v, total) => `${(v / total) * 100}%`;

function layout(nodes, hasBoss) {
  const pts = [];
  let y = TOP_Y;
  nodes.forEach((n, i) => {
    if (n.banner && i > 0) y += BANNER_GAP;
    pts.push({ x: XS[i % XS.length], y });
    y += STEP_Y;
  });
  const boss = hasBoss ? { x: 200, y: y + 50 } : null;
  if (boss) y += STEP_Y + 60;
  const chest = { x: 200, y: y + 10 };
  return { pts, boss, chest, h: chest.y + 170 };
}

// Trilha: sai de baixo do nome de uma ilha e chega por cima da próxima.
function pathD(points) {
  let d = '';
  for (let i = 1; i < points.length; i += 1) {
    const a = { x: points[i - 1].x, y: points[i - 1].y + 82 };
    const b = { x: points[i].x, y: points[i].y - 48 };
    const my = (a.y + b.y) / 2;
    d += ` M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
  }
  return d.trim();
}

const trail = (d, cls, stroke, width) =>
  `<path d="${d}" class="${cls}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-dasharray="1 24" vector-effect="non-scaling-stroke"/>`;

/*
  spec = {
    theme, startLabel, kikoLine, kikoKey,
    nodes: [{ main, side, name, sign, done, open, next, stars, aria, banner }],
    boss: { emoji, name, open, done } | null,
    chest: { open },
  }
  Posições na trilha: nós..., chefão, baú. "Atual" = primeiro nó não feito,
  depois o chefão, depois o baú.
*/
export function mapHtml(spec) {
  const theme = THEMES[spec.theme] || THEMES.ocean;
  const { pts, boss, chest, h } = layout(spec.nodes, Boolean(spec.boss));
  const stops = [...pts, ...(boss ? [boss] : []), chest];
  const firstOpen = spec.nodes.findIndex((n) => !n.done);
  const cur = firstOpen >= 0 ? firstOpen : spec.boss && !spec.boss.done ? pts.length : stops.length - 1;
  const from = Math.min(store.getFlag(spec.kikoKey, cur), cur);
  const pos = (i) => stops[Math.max(0, Math.min(i, stops.length - 1))];
  const all = pathD(stops);

  const decoHtml = [];
  for (let y = 330, k = 0; y < h - 120; y += 290, k += 1) {
    const e = theme.decos[k % theme.decos.length];
    const left = k % 2 ? 88 : 7;
    decoHtml.push(`<span class="deco drift d${k % 3}" style="left:${left}%;top:${pct(y, h)}">${e}</span>`);
  }

  const banners = spec.nodes.map((n, i) => (n.banner
    ? `<div class="map-banner" style="left:${pts[i].x < 200 ? 72 : 28}%;top:${pct(pts[i].y - 100, h)}"><span>${esc(n.banner.kicker)}</span><strong>${esc(n.banner.title)}</strong></div>`
    : '')).join('');

  const isles = spec.nodes.map((n, i) => {
    const p = pts[i];
    return `
      <button type="button" class="isle ${n.done ? 'done' : ''} ${n.next ? 'next' : ''} ${n.open ? '' : 'locked'}" data-node="${i}"
        style="left:${pct(p.x, MAP_W)};top:${pct(p.y, h)};animation-delay:${(i % 4) * -0.7}s" aria-label="${esc(n.aria)}">
        <span class="isle-top"><span class="isle-main">${n.main}</span><span class="isle-side">${n.side || ''}</span></span>
        <span class="isle-rock"></span>
        ${n.open ? '' : '<span class="isle-fog">☁️☁️</span><span class="isle-lock">🔒</span>'}
        <span class="isle-sign">${esc(n.sign)}</span>
        <span class="isle-name">${esc(n.name)}</span>
        ${n.done && n.stars ? `<span class="isle-stars">${'⭐'.repeat(n.stars)}${'☆'.repeat(3 - n.stars)}</span>` : ''}
      </button>`;
  }).join('');

  const b = spec.boss;
  const bossHtml = b ? `
    <button type="button" class="isle boss ${b.done ? 'done' : ''} ${b.open && !b.done ? 'next' : ''} ${b.open ? '' : 'locked'}" data-boss
      style="left:${pct(boss.x, MAP_W)};top:${pct(boss.y, h)}" aria-label="Chefão: ${esc(b.name)}${b.done ? ', derrotado' : b.open ? ', liberado' : ', bloqueado'}">
      <span class="isle-top"><span class="isle-main">${b.done ? '🏳️' : b.emoji}</span><span class="isle-side">${b.done ? '🏆' : '⚡'}</span></span>
      <span class="isle-rock"></span>
      ${b.open ? '' : '<span class="isle-fog">🌫️🌫️</span><span class="isle-lock">🔒</span>'}
      <span class="isle-sign boss-sign">Chefão</span>
      <span class="isle-name">${esc(b.name)}</span>
    </button>` : '';

  const cOpen = spec.chest.open;
  return `
    <div class="map-world theme-${esc(spec.theme)}" style="aspect-ratio:${MAP_W}/${h};max-width:520px;margin:0 auto;background:${theme.bg}">
      <svg class="map-path" viewBox="0 0 ${MAP_W} ${h}" preserveAspectRatio="none" aria-hidden="true">
        ${trail(all, 'trail-shadow', 'rgba(0,0,0,.25)', 16)}
        ${trail(all, 'trail', '#E4ECF7', 14)}
        ${cur > 0 ? trail(pathD(stops.slice(0, cur + 1)), 'trail done', '#FFE08A', 14) : ''}
      </svg>
      ${decoHtml.join('')}
      <div class="map-start" style="left:50%;top:${pct(40, h)}">${esc(spec.startLabel)}</div>
      ${banners}
      ${isles}
      ${bossHtml}
      <button type="button" class="isle chest ${cOpen ? 'open' : 'locked'}" data-chest style="left:${pct(chest.x, MAP_W)};top:${pct(chest.y, h)}" aria-label="Baú do tesouro${cOpen ? ', aberto' : ', fechado'}">
        <span class="isle-top"><span class="isle-main">${cOpen ? '🏆' : '🎁'}</span></span>
        <span class="isle-rock"></span>
        <span class="isle-sign gold">Baú do tesouro</span>
      </button>
      <div class="map-kiko" data-kiko data-cur="${cur}" data-from="${from}" style="left:${pct(pos(from).x, MAP_W)};top:${pct(pos(from).y, h)}">
        <span class="kiko-bubble">${esc(spec.kikoLine)}</span>
        ${kikoHtml(64, { alt: 'Professor Kiko' })}
      </div>
      <span hidden data-geo="${esc(JSON.stringify({ stops, h }))}"></span>
    </div>`;
}

// Faz o Kiko caminhar até a posição atual e centraliza a ilha da vez.
export function wireMap(root, spec) {
  const kiko = root.querySelector('[data-kiko]');
  if (!kiko) return;
  const { stops, h } = JSON.parse(root.querySelector('[data-geo]').dataset.geo);
  const cur = Number(kiko.dataset.cur);
  const from = Number(kiko.dataset.from);
  if (from !== cur) {
    requestAnimationFrame(() => setTimeout(() => {
      kiko.classList.add('walking');
      kiko.style.left = pct(stops[cur].x, MAP_W);
      kiko.style.top = pct(stops[cur].y, h);
      setTimeout(() => kiko.classList.remove('walking'), 1600);
    }, 500));
  }
  store.setFlag(spec.kikoKey, cur);
  setTimeout(() => {
    const target = root.querySelector('.isle.next') || root.querySelector('.isle.chest');
    target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, 300);
  kiko.addEventListener('click', () => speakPt(spec.kikoLine));
}

// ---------- Baú ----------

// Abre o baú uma vez: +moedas e festa. Nas próximas, só chama onAfter.
export function openChest(key, coins, onAfter) {
  const flag = `chest.${key}`;
  if (store.hasFlag(flag)) { onAfter?.(); return; }
  store.setFlag(flag);
  store.addCoins(coins);
  celebrate({
    icon: '🎁',
    title: 'Baú do tesouro aberto!',
    text: `Você ganhou ${coins} moedas para gastar na lojinha do Kiko.`,
    reward: `🪙 +${coins}`,
    primary: { label: 'Ir à lojinha', href: '#/loja' },
    secondary: onAfter ? { label: 'Continuar', action: onAfter } : null,
  });
}

export function celebrate({ icon, title, text, reward, primary, secondary }) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-backdrop';
  wrap.innerHTML = `
    <div class="modal card celebrate" role="dialog" aria-modal="true" aria-labelledby="cel-title">
      <div class="cel-rays" aria-hidden="true"></div>
      <span class="cel-icon" aria-hidden="true">${icon}</span>
      <h2 id="cel-title">${esc(title)}</h2>
      <p class="muted">${esc(text)}</p>
      ${reward ? `<p class="cel-reward">${esc(reward)}</p>` : ''}
      <div class="stack">
        ${primary ? `<a class="btn btn-primary btn-lg" href="${primary.href}" data-close-cel>${esc(primary.label)}</a>` : ''}
        ${secondary ? `<button type="button" class="btn btn-ghost" data-sec>${esc(secondary.label)}</button>` : '<button type="button" class="btn btn-ghost" data-close-cel>Fechar</button>'}
      </div>
    </div>`;
  document.body.appendChild(wrap);
  wrap.querySelector('.btn').focus();
  wrap.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-cel]') || e.target === wrap) wrap.remove();
    if (e.target.closest('[data-sec]')) { wrap.remove(); secondary.action(); }
  });
}

export function lockedToast(what = 'a ilha anterior') {
  toast(`Complete ${what} para liberar. 🔒`);
}
