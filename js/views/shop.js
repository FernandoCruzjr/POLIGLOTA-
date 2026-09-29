// Lojinha do Kiko: gaste as moedas em acessórios para o professor.
import * as store from '../store.js';
import { esc, toast, formatNumber } from '../ui.js';
import { SHOP, SLOTS, kikoHtml, itemById } from '../kiko.js';
import { speakPt } from '../speech.js';
import '../game.js';

const EARN = [
  ['🏝️ Capítulo de viagem', '10 + estrelas'],
  ['📚 Lição nova', '5'],
  ['🧠 Quiz e revisão', '1 a cada 2 acertos'],
  ['⚔️ Vencer um chefão', '50'],
  ['🎁 Abrir um baú do tesouro', '100'],
];

export function render(root) {
  function draw() {
    const w = store.wallet();
    const eq = w.equipped;
    root.innerHTML = `
      <header class="page-head row-between">
        <div>
          <h1>Lojinha do Kiko</h1>
          <p class="muted">Vista o seu professor com as moedas que você ganha estudando.</p>
        </div>
        <span class="coin-chip" aria-label="${formatNumber(w.coins)} moedas">🪙 ${formatNumber(w.coins)}</span>
      </header>
      <section class="shop-hero" aria-label="Kiko vestido">
        <div class="shop-stage">${kikoHtml(140, { alt: 'Professor Kiko com os acessórios escolhidos' })}</div>
        <p class="small muted">${[eq.head, eq.face, eq.neck].map(itemById).filter((x) => x && x.id !== 'grad').map((x) => x.name).join(' · ') || 'Professor Kiko de capelo'}</p>
      </section>
      ${Object.entries(SLOTS).map(([slot, label]) => `
        <section aria-labelledby="slot-${slot}">
          <h2 id="slot-${slot}" class="level-title">${label}</h2>
          <div class="shop-grid">
            ${SHOP.filter((it) => it.slot === slot).map((it) => {
              const owned = w.owned.includes(it.id) || it.price === 0;
              const on = eq[slot] === it.id;
              const poor = !owned && w.coins < it.price;
              const tag = on ? 'Usando' : owned ? 'Usar' : `🪙 ${it.price}`;
              return `<button type="button" class="shop-item ${owned ? 'owned' : ''} ${on ? 'equipped' : ''} ${poor ? 'poor' : ''}" data-item="${it.id}"
                aria-label="${esc(it.name)}: ${on ? 'em uso, toque para tirar' : owned ? 'comprado, toque para usar' : `custa ${it.price} moedas`}" aria-pressed="${on}">
                <span class="si-emoji" aria-hidden="true">${it.emoji}</span>
                <span class="si-name">${esc(it.name)}</span>
                <span class="si-price">${tag}</span>
              </button>`;
            }).join('')}
          </div>
        </section>`).join('')}
      <section class="card">
        <h2>Como ganhar moedas</h2>
        <ul class="shop-earn">${EARN.map(([a, b]) => `<li><span>${a}</span><strong>🪙 ${b}</strong></li>`).join('')}</ul>
      </section>`;
  }

  function onClick(e) {
    const b = e.target.closest('[data-item]');
    if (!b) return;
    const it = itemById(b.dataset.item);
    const w = store.wallet();
    const owned = w.owned.includes(it.id) || it.price === 0;
    if (w.equipped[it.slot] === it.id) {
      store.equipItem(it.slot, it.slot === 'head' ? 'grad' : null);
    } else if (owned) {
      store.equipItem(it.slot, it.id);
    } else if (store.buyItem(it.id, it.price)) {
      store.equipItem(it.slot, it.id);
      toast(`${it.emoji} ${it.name} comprado!`);
      speakPt('Uau! Ficou ótimo em mim! Obrigado!');
    } else {
      toast(`Faltam ${it.price - w.coins} moedas. Estude mais um pouquinho! 💪`);
      return;
    }
    draw();
    root.querySelector(`[data-item="${it.id}"]`)?.focus({ preventScroll: true });
  }

  draw();
  root.addEventListener('click', onClick);
  return () => root.removeEventListener('click', onClick);
}
