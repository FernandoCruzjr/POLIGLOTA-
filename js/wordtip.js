// Dicionário de toque: cada palavra em inglês vira um botãozinho; ao tocar
// (ou passar o mouse), aparece a tradução. Dados em data/dict.json.
import { esc } from './ui.js';
import { speak } from './speech.js';

let dict = null;
let loading = null;
export function loadDict() {
  if (dict) return Promise.resolve(dict);
  if (!loading) {
    loading = fetch('data/dict.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((d) => { dict = d; return d; });
  }
  return loading;
}
loadDict();

export function gloss(word) {
  if (!dict) return null;
  const w = word.toLowerCase().replace(/’/g, "'").replace(/^'+|'+$/g, '');
  if (dict[w]) return dict[w];
  const tries = [w.replace(/'s$/, ''), w.replace(/s$/, ''), w.replace(/es$/, ''), w.replace(/ed$/, ''), w.replace(/ed$/, 'e'), w.replace(/ing$/, ''), w.replace(/ing$/, 'e'), w.replace(/ies$/, 'y'), w.replace(/ly$/, '')];
  for (const t of tries) if (t !== w && dict[t]) return dict[t];
  return null;
}

// Recebe texto puro e devolve HTML com cada palavra tocável.
export function wordify(text) {
  const s = String(text ?? '');
  return s.split(/([A-Za-z][A-Za-z'’]*)/).map((part, i) => (i % 2
    ? `<span class="w" role="button" tabindex="0" data-w="${esc(part)}">${esc(part)}</span>`
    : esc(part))).join('');
}

// ---------- Balãozinho ----------

let tip = null;
let current = null;
function ensureTip() {
  if (tip) return tip;
  tip = document.createElement('div');
  tip.className = 'wordtip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  document.body.appendChild(tip);
  tip.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tip-say]');
    if (b) { e.stopPropagation(); speak(b.dataset.tipSay, { slow: b.dataset.slow === '1' }); }
  });
  return tip;
}

function show(el) {
  const t = ensureTip();
  const word = el.dataset.w;
  const g = gloss(word);
  current = el;
  t.innerHTML = `<strong lang="en">${esc(word)}</strong><span>${g ? esc(g) : '<em>sem tradução no dicionário</em>'}</span>
    <span class="wt-btns"><button type="button" data-tip-say="${esc(word)}" aria-label="Ouvir ${esc(word)}">🔊</button><button type="button" data-tip-say="${esc(word)}" data-slow="1" aria-label="Ouvir devagar">🐢</button></span>`;
  t.hidden = false;
  const r = el.getBoundingClientRect();
  const tw = Math.min(260, window.innerWidth - 16);
  t.style.maxWidth = `${tw}px`;
  const left = Math.max(8, Math.min(window.innerWidth - t.offsetWidth - 8, r.left + r.width / 2 - t.offsetWidth / 2));
  let top = r.top - t.offsetHeight - 8;
  t.classList.toggle('below', top < 8);
  if (top < 8) top = r.bottom + 8;
  t.style.left = `${left}px`;
  t.style.top = `${top}px`;
  document.querySelectorAll('.w.on').forEach((x) => x.classList.remove('on'));
  el.classList.add('on');
}

export function hideTip() {
  if (tip) tip.hidden = true;
  if (current) current.classList.remove('on');
  current = null;
}

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
document.addEventListener('click', (e) => {
  const w = e.target.closest('.w');
  if (w) {
    e.stopPropagation();
    e.preventDefault();
    if (current === w && !finePointer) hideTip(); else show(w);
    return;
  }
  if (!e.target.closest('.wordtip')) hideTip();
}, true);
document.addEventListener('keydown', (e) => {
  const w = e.target.closest && e.target.closest('.w');
  if (w && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); show(w); }
  if (e.key === 'Escape') hideTip();
});
if (finePointer) {
  document.addEventListener('mouseover', (e) => { const w = e.target.closest('.w'); if (w && w !== current) show(w); });
}
window.addEventListener('scroll', hideTip, { passive: true });
window.addEventListener('hashchange', hideTip);
