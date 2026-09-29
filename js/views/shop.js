// Lojinha do Kiko: escolha a cor e vista o professor. Toque num item para
// provar; compre com as moedas que ganha estudando.
import * as store from '../store.js';
import { esc, toast, formatNumber } from '../ui.js';
import { SHOP, SLOTS, SLOT_ICONS, kikoHtml, itemById, currentLook, skinSrc } from '../kiko.js';
import { speak } from '../speech.js';
import { shuffle } from '../quiz-engine.js';
import '../game.js';

const EARN = [
  ['🏝️ Capítulo de viagem', '10 + estrelas'],
  ['📚 Lição nova', '5'],
  ['🧠 Quiz, revisão e Kids', '1 a cada 2 acertos'],
  ['🗣️ Treino de fala', '3'],
  ['✅ Todos os micro-hábitos do dia', '5'],
  ['⚔️ Vencer um chefão', '50'],
  ['🎁 Abrir um baú do tesouro', '100'],
];
const CHEERS = ['Looking good!', 'I love it!', 'So stylish!', 'Thank you!', 'Awesome!', 'This is so cool!'];

const owns = (it) => it.price === 0 || store.wallet().owned.includes(it.id);

export function render(root) {
  let slot = 'skin';
  let preview = null; // id do item sendo provado

  function thumb(it) {
    if (it.slot === 'skin') return `<img class="si-skin" src="${skinSrc(it.id, false)}" alt="" width="56" height="56" loading="lazy">`;
    if (it.slot === 'bg') return `<span class="si-bg ${it.id}" aria-hidden="true">${(it.deco || []).join('')}</span>`;
    return `<span class="si-emoji" aria-hidden="true">${it.emoji}</span>`;
  }

  function stageHtml() {
    const look = currentLook();
    const it = preview ? itemById(preview) : null;
    const tryLook = it ? { [it.slot]: it.id } : null;
    const w = store.wallet();
    let action = '';
    if (it) {
      const on = look[it.slot] === it.id;
      if (on) action = `<button type="button" class="btn btn-soft" data-off="${it.slot}">Tirar</button>`;
      else if (owns(it)) action = `<button type="button" class="btn btn-primary" data-use="${it.id}">Usar agora</button>`;
      else if (w.coins >= it.price) action = `<button type="button" class="btn btn-primary" data-buy="${it.id}">Comprar por 🪙 ${it.price}</button>`;
      else action = `<button type="button" class="btn btn-primary" disabled>Faltam 🪙 ${it.price - w.coins}</button>`;
    }
    return `
      <div class="shop-stage">${kikoHtml(150, { alt: 'Professor Kiko', look: tryLook, cls: it && !owns(it) ? 'trying' : '' })}</div>
      ${it ? `<p class="shop-try"><strong>${esc(it.name)}</strong> ${owns(it) ? '' : `<span class="muted">· provando</span>`}</p>
        <div class="shop-cta">${action}<button type="button" class="btn btn-ghost" data-cancel>${owns(it) ? 'Fechar' : 'Desistir'}</button></div>`
      : `<p class="small muted">${esc(Object.entries(look).map(([, id]) => itemById(id)).filter((x) => x && x.id !== 'grad' && x.id !== 'verde').map((x) => x.name).join(' · ') || 'Professor Kiko clássico')}</p>
        <div class="shop-cta"><button type="button" class="btn btn-soft" data-random>🎲 Look surpresa</button><button type="button" class="btn btn-ghost" data-reset>↺ Clássico</button></div>`}`;
  }

  function gridHtml() {
    const look = currentLook();
    const w = store.wallet();
    return SHOP.filter((it) => it.slot === slot).map((it) => {
      const own = owns(it);
      const on = look[slot] === it.id;
      const tag = on ? 'Usando' : own ? 'Seu' : `🪙 ${it.price}`;
      return `<button type="button" class="shop-item ${own ? 'owned' : ''} ${on ? 'equipped' : ''} ${!own && w.coins < it.price ? 'poor' : ''} ${preview === it.id ? 'trying' : ''}" data-item="${it.id}"
        aria-label="${esc(it.name)}: ${on ? 'em uso' : own ? 'seu, toque para provar' : `custa ${it.price} moedas, toque para provar`}" aria-pressed="${on}">
        ${thumb(it)}<span class="si-name">${esc(it.name)}</span><span class="si-price">${tag}</span>
      </button>`;
    }).join('');
  }

  function draw(focusId) {
    const w = store.wallet();
    const ownedCount = SHOP.filter(owns).length;
    root.innerHTML = `
      <header class="page-head row-between">
        <div><h1>Lojinha do Kiko</h1><p class="muted">Toque num item para provar. ${ownedCount} de ${SHOP.length} itens na sua coleção.</p></div>
        <span class="coin-chip" aria-label="${formatNumber(w.coins)} moedas">🪙 ${formatNumber(w.coins)}</span>
      </header>
      <section class="shop-hero" aria-live="polite" data-stage>${stageHtml()}</section>
      <div class="shop-tabs" role="tablist" aria-label="Partes do visual">
        ${Object.entries(SLOTS).map(([k, label]) => `<button type="button" role="tab" class="shop-tab ${k === slot ? 'on' : ''}" aria-selected="${k === slot}" data-slot="${k}"><span aria-hidden="true">${SLOT_ICONS[k]}</span>${label}</button>`).join('')}
      </div>
      <div class="shop-grid" role="tabpanel">${gridHtml()}</div>
      <section class="card">
        <h2>Como ganhar moedas</h2>
        <ul class="shop-earn">${EARN.map(([a, b]) => `<li><span>${a}</span><strong>🪙 ${b}</strong></li>`).join('')}</ul>
      </section>`;
    if (focusId) root.querySelector(focusId)?.focus({ preventScroll: true });
  }

  function equip(it) {
    store.equipItem(it.slot, it.id);
    speak(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
  }

  function onClick(e) {
    const tab = e.target.closest('[data-slot]');
    if (tab) { slot = tab.dataset.slot; preview = null; draw(`[data-slot="${slot}"]`); return; }
    const b = e.target.closest('[data-item]');
    if (b) {
      const it = itemById(b.dataset.item);
      preview = preview === it.id ? null : it.id;
      draw(`[data-item="${it.id}"]`);
      root.querySelector('[data-stage]').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      return;
    }
    const use = e.target.closest('[data-use]');
    if (use) { equip(itemById(use.dataset.use)); preview = null; draw(); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const it = itemById(buy.dataset.buy);
      if (store.buyItem(it.id, it.price)) { equip(it); toast(`${it.emoji || '🎨'} ${it.name}: é seu!`); preview = null; draw(); }
      else toast('Moedas insuficientes.');
      return;
    }
    const off = e.target.closest('[data-off]');
    if (off) { const sl = off.dataset.off; store.equipItem(sl, sl === 'head' ? 'grad' : sl === 'skin' ? 'verde' : null); preview = null; draw(); return; }
    if (e.target.closest('[data-cancel]')) { preview = null; draw(); return; }
    if (e.target.closest('[data-reset]')) { Object.keys(SLOTS).forEach((sl) => store.equipItem(sl, sl === 'head' ? 'grad' : sl === 'skin' ? 'verde' : null)); draw(); return; }
    if (e.target.closest('[data-random]')) {
      Object.keys(SLOTS).forEach((sl) => {
        const mine = SHOP.filter((it) => it.slot === sl && owns(it));
        const pick = Math.random() < 0.3 ? null : shuffle(mine)[0];
        store.equipItem(sl, pick ? pick.id : sl === 'head' ? 'grad' : sl === 'skin' ? 'verde' : null);
      });
      speak('Surprise!');
      draw();
      return;
    }
    if (e.target.closest('.shop-stage')) speak(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
  }

  draw();
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
