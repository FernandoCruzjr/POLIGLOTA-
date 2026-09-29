// Professor Kiko com os acessórios da lojinha. O chapéu de formatura já vem
// desenhado em kiko-prof.png; os outros itens são emojis por cima do avatar.
import * as store from './store.js';

export const SHOP = [
  { id: 'grad', slot: 'head', emoji: '🎓', name: 'Capelo de professor', price: 0 },
  { id: 'cap', slot: 'head', emoji: '🧢', name: 'Boné', price: 40 },
  { id: 'sunhat', slot: 'head', emoji: '👒', name: 'Chapéu de praia', price: 60 },
  { id: 'tophat', slot: 'head', emoji: '🎩', name: 'Cartola', price: 90 },
  { id: 'crown', slot: 'head', emoji: '👑', name: 'Coroa', price: 200 },
  { id: 'glasses', slot: 'face', emoji: '👓', name: 'Óculos de leitura', price: 30 },
  { id: 'shades', slot: 'face', emoji: '🕶️', name: 'Óculos escuros', price: 50 },
  { id: 'goggles', slot: 'face', emoji: '🥽', name: 'Óculos de mergulho', price: 80 },
  { id: 'bow', slot: 'neck', emoji: '🎀', name: 'Lacinho', price: 30 },
  { id: 'flower', slot: 'neck', emoji: '🌺', name: 'Flor havaiana', price: 40 },
  { id: 'scarf', slot: 'neck', emoji: '🧣', name: 'Cachecol', price: 60 },
  { id: 'medal', slot: 'neck', emoji: '🏅', name: 'Medalha de ouro', price: 150 },
];

export const SLOTS = { head: 'Cabeça', face: 'Rosto', neck: 'Pescoço' };

export const itemById = (id) => SHOP.find((i) => i.id === id) || null;

// Devolve o Kiko vestido. size em px; cls extra para animações de cada tela.
export function kikoHtml(size = 64, { cls = '', alt = '' } = {}) {
  const eq = store.wallet().equipped || {};
  const head = itemById(eq.head);
  const face = itemById(eq.face);
  const neck = itemById(eq.neck);
  const base = !head || head.id === 'grad' ? 'img/kiko-prof.png' : 'img/mascot-avatar.png';
  const layer = (item, part) => (item && item.id !== 'grad' ? `<span class="kk-${part}" aria-hidden="true">${item.emoji}</span>` : '');
  return `<span class="kiko-dress ${cls}" style="--kk:${size}px" ${alt ? `role="img" aria-label="${alt}"` : 'aria-hidden="true"'}>
    <img src="${base}" alt="" width="${size}" height="${size}">
    ${layer(head, 'head')}${layer(face, 'face')}${layer(neck, 'neck')}
  </span>`;
}
