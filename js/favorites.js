// Frases favoritas: a estrelinha ⭐ em qualquer frase guarda ela aqui.
// Ficam salvas no aparelho (flags do store).
import * as store from './store.js';
import { esc, toast } from './ui.js';

const KEY = 'fav';
export const favMap = () => store.getFlag(KEY, {});
export const favList = () => Object.entries(favMap()).map(([id, f]) => ({ id, ...f })).sort((a, b) => (b.at || 0) - (a.at || 0));
export const isFav = (id) => Boolean(favMap()[id]);

const slug = (en) => `f.${String(en).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)}`;

export function toggleFav({ id, en, pt, pron, src }) {
  const key = id || slug(en);
  const all = { ...favMap() };
  if (all[key]) delete all[key];
  else all[key] = { en, pt: pt || '', pron: pron || '', src: src || '', at: Date.now() };
  store.setFlag(KEY, all);
  return Boolean(all[key]);
}

// Botão pronto para colocar ao lado de uma frase.
export function favBtn({ id, en, pt = '', pron = '', src = '' }, extraCls = '') {
  const key = id || slug(en);
  const on = isFav(key);
  return `<button type="button" class="fav-btn ${on ? 'on' : ''} ${extraCls}" data-fav="${esc(key)}" data-fav-en="${esc(en)}" data-fav-pt="${esc(pt)}" data-fav-pron="${esc(pron)}" data-fav-src="${esc(src)}" aria-pressed="${on}" aria-label="${on ? 'Tirar dos favoritos' : 'Guardar nos favoritos'}">${on ? '★' : '☆'}</button>`;
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-fav]');
  if (!b) return;
  e.stopPropagation();
  const on = toggleFav({ id: b.dataset.fav, en: b.dataset.favEn, pt: b.dataset.favPt, pron: b.dataset.favPron, src: b.dataset.favSrc });
  document.querySelectorAll(`[data-fav="${CSS.escape(b.dataset.fav)}"]`).forEach((x) => {
    x.classList.toggle('on', on);
    x.textContent = on ? '★' : '☆';
    x.setAttribute('aria-pressed', String(on));
    x.setAttribute('aria-label', on ? 'Tirar dos favoritos' : 'Guardar nos favoritos');
  });
  toast(on ? '⭐ Guardada nas favoritas' : 'Tirada das favoritas');
  document.dispatchEvent(new CustomEvent('hf-fav-change', { detail: { id: b.dataset.fav, on } }));
}, true);
