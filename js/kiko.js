// Professor Kiko com a cor e os acessórios da lojinha. As cores são imagens
// recoloridas (img/kiko/, geradas por tools/make_kiko_skins.py); os
// acessórios são emojis posicionados item a item por cima do avatar.
import * as store from './store.js';

// pos: left/top em % do avatar, size em fração do avatar, rot em graus.
export const SHOP = [
  // Cor do Kiko
  { id: 'verde', slot: 'skin', name: 'Verde clássico', price: 0 },
  { id: 'azul', slot: 'skin', name: 'Azul arara', price: 60 },
  { id: 'turquesa', slot: 'skin', name: 'Turquesa do Caribe', price: 60 },
  { id: 'roxo', slot: 'skin', name: 'Roxo', price: 80 },
  { id: 'rosa', slot: 'skin', name: 'Rosa flamingo', price: 80 },
  { id: 'vermelho', slot: 'skin', name: 'Vermelho', price: 80 },
  { id: 'laranja', slot: 'skin', name: 'Laranja pôr do sol', price: 100 },
  { id: 'noite', slot: 'skin', name: 'Azul noite', price: 120 },
  { id: 'fantasma', slot: 'skin', name: 'Branco neve', price: 150 },
  { id: 'dourado', slot: 'skin', name: 'Dourado', price: 300 },
  { id: 'arcoiris', slot: 'skin', name: 'Arco-íris', price: 400 },
  // Cabeça
  { id: 'grad', slot: 'head', emoji: '🎓', name: 'Capelo de professor', price: 0 },
  { id: 'cap', slot: 'head', emoji: '🧢', name: 'Boné', price: 40, pos: { left: 50, top: 6, size: 0.55, rot: -8 } },
  { id: 'sunhat', slot: 'head', emoji: '👒', name: 'Chapéu de praia', price: 60, pos: { left: 46, top: 4, size: 0.62 } },
  { id: 'flowerhead', slot: 'head', emoji: '🌸', name: 'Flor no cabelo', price: 30, pos: { left: 30, top: 12, size: 0.36, rot: -15 } },
  { id: 'bowhead', slot: 'head', emoji: '🎀', name: 'Laço de cabelo', price: 30, pos: { left: 30, top: 12, size: 0.4, rot: -12 } },
  { id: 'headphones', slot: 'head', emoji: '🎧', name: 'Fone de ouvido', price: 70, pos: { left: 48, top: 20, size: 0.68 } },
  { id: 'tophat', slot: 'head', emoji: '🎩', name: 'Cartola', price: 90, pos: { left: 46, top: 0, size: 0.56, rot: 8 } },
  { id: 'helmet', slot: 'head', emoji: '⛑️', name: 'Capacete de resgate', price: 80, pos: { left: 47, top: 6, size: 0.56 } },
  { id: 'pumpkin', slot: 'head', emoji: '🎃', name: 'Abóbora de Halloween', price: 90, pos: { left: 46, top: 2, size: 0.56 } },
  { id: 'mushroom', slot: 'head', emoji: '🍄', name: 'Chapéu de cogumelo', price: 90, pos: { left: 46, top: 2, size: 0.6 } },
  { id: 'halo', slot: 'head', emoji: '😇', name: 'Auréola', price: 120, pos: { left: 50, top: -6, size: 0.3 }, halo: true },
  { id: 'crown', slot: 'head', emoji: '👑', name: 'Coroa', price: 200, pos: { left: 47, top: 2, size: 0.5, rot: 6 } },
  // Rosto
  { id: 'glasses', slot: 'face', emoji: '👓', name: 'Óculos de leitura', price: 30 },
  { id: 'shades', slot: 'face', emoji: '🕶️', name: 'Óculos escuros', price: 50 },
  { id: 'goggles', slot: 'face', emoji: '🥽', name: 'Óculos de mergulho', price: 80, pos: { left: 66, top: 56, size: 0.44 } },
  { id: 'mask', slot: 'face', emoji: '🎭', name: 'Máscara de teatro', price: 70, pos: { left: 68, top: 58, size: 0.34 } },
  { id: 'star', slot: 'face', emoji: '⭐', name: 'Estrelinha na bochecha', price: 25, pos: { left: 42, top: 70, size: 0.2, rot: -12 } },
  { id: 'kiss', slot: 'face', emoji: '💋', name: 'Beijinho', price: 25, pos: { left: 42, top: 72, size: 0.2, rot: -15 } },
  { id: 'bandage', slot: 'face', emoji: '🩹', name: 'Curativo de aventureiro', price: 25, pos: { left: 40, top: 70, size: 0.22, rot: -25 } },
  // Pescoço
  { id: 'bow', slot: 'neck', emoji: '🎀', name: 'Gravatinha borboleta', price: 30 },
  { id: 'flower', slot: 'neck', emoji: '🌺', name: 'Flor havaiana', price: 40 },
  { id: 'bell', slot: 'neck', emoji: '🔔', name: 'Sininho', price: 40, pos: { left: 42, top: 96, size: 0.26 } },
  { id: 'scarf', slot: 'neck', emoji: '🧣', name: 'Cachecol', price: 60 },
  { id: 'tie', slot: 'neck', emoji: '👔', name: 'Camisa social', price: 70, pos: { left: 44, top: 100, size: 0.28 } },
  { id: 'necklace', slot: 'neck', emoji: '📿', name: 'Colar de contas', price: 60 },
  { id: 'medal', slot: 'neck', emoji: '🏅', name: 'Medalha de ouro', price: 150, pos: { left: 42, top: 100, size: 0.3 } },
  { id: 'trophy', slot: 'neck', emoji: '🥇', name: 'Medalha de campeão', price: 250, pos: { left: 42, top: 100, size: 0.3 } },
  // Na mão
  { id: 'balloon', slot: 'hand', emoji: '🎈', name: 'Balão', price: 30, pos: { left: 100, top: 40, size: 0.46, rot: 8 } },
  { id: 'icecream', slot: 'hand', emoji: '🍦', name: 'Sorvete', price: 30 },
  { id: 'drink', slot: 'hand', emoji: '🍹', name: 'Suco tropical', price: 40 },
  { id: 'camera', slot: 'hand', emoji: '📷', name: 'Câmera de turista', price: 60 },
  { id: 'map', slot: 'hand', emoji: '🗺️', name: 'Mapa', price: 50 },
  { id: 'suitcase', slot: 'hand', emoji: '🧳', name: 'Mala de viagem', price: 70 },
  { id: 'plane', slot: 'hand', emoji: '✈️', name: 'Aviãozinho', price: 70, pos: { left: 100, top: 30, size: 0.4, rot: -20 } },
  { id: 'umbrella', slot: 'hand', emoji: '🌂', name: 'Guarda-chuva', price: 50, pos: { left: 98, top: 60, size: 0.5, rot: 10 } },
  { id: 'books', slot: 'hand', emoji: '📚', name: 'Livros', price: 40 },
  { id: 'ball', slot: 'hand', emoji: '⚽', name: 'Bola', price: 40 },
  { id: 'guitar', slot: 'hand', emoji: '🎸', name: 'Violão', price: 110, pos: { left: 96, top: 72, size: 0.52, rot: -20 } },
  { id: 'wand', slot: 'hand', emoji: '🪄', name: 'Varinha mágica', price: 150 },
  // Amiguinho
  { id: 'chick', slot: 'pet', emoji: '🐣', name: 'Pintinho', price: 50 },
  { id: 'turtle', slot: 'pet', emoji: '🐢', name: 'Tartaruga', price: 60 },
  { id: 'butterfly', slot: 'pet', emoji: '🦋', name: 'Borboleta', price: 60, pos: { left: -4, top: 20, size: 0.34, rot: -10 } },
  { id: 'hamster', slot: 'pet', emoji: '🐹', name: 'Hamster', price: 70 },
  { id: 'puppy', slot: 'pet', emoji: '🐶', name: 'Cachorrinho', price: 90 },
  { id: 'kitten', slot: 'pet', emoji: '🐱', name: 'Gatinho', price: 90 },
  { id: 'penguin', slot: 'pet', emoji: '🐧', name: 'Pinguim', price: 100 },
  { id: 'fox', slot: 'pet', emoji: '🦊', name: 'Raposinha', price: 120 },
  { id: 'panda', slot: 'pet', emoji: '🐼', name: 'Panda', price: 150 },
  { id: 'unicorn', slot: 'pet', emoji: '🦄', name: 'Unicórnio', price: 250 },
  { id: 'dragon', slot: 'pet', emoji: '🐉', name: 'Dragãozinho', price: 350 },
  // Fundo
  { id: 'bg-sea', slot: 'bg', name: 'Praia', price: 50, deco: ['🌊', '🐚'] },
  { id: 'bg-sun', slot: 'bg', name: 'Pôr do sol', price: 60, deco: ['☀️', '🌴'] },
  { id: 'bg-jungle', slot: 'bg', name: 'Floresta', price: 60, deco: ['🌿', '🍃'] },
  { id: 'bg-hearts', slot: 'bg', name: 'Corações', price: 70, deco: ['💕', '💖'] },
  { id: 'bg-snow', slot: 'bg', name: 'Neve', price: 80, deco: ['❄️', '⛄'] },
  { id: 'bg-city', slot: 'bg', name: 'Cidade à noite', price: 100, deco: ['🌃', '✨'] },
  { id: 'bg-space', slot: 'bg', name: 'Espaço', price: 150, deco: ['🪐', '⭐'] },
  { id: 'bg-gold', slot: 'bg', name: 'Moldura de ouro', price: 200, deco: ['✨', '🌟'] },
  { id: 'bg-rainbow', slot: 'bg', name: 'Arco-íris', price: 250, deco: ['🌈', '☁️'] },
];

export const SLOTS = { skin: 'Cor', head: 'Cabeça', face: 'Rosto', neck: 'Pescoço', hand: 'Na mão', pet: 'Amiguinho', bg: 'Fundo' };
export const SLOT_ICONS = { skin: '🎨', head: '🎩', face: '🕶️', neck: '🎀', hand: '🎈', pet: '🐶', bg: '🌅' };
export const DEFAULT_LOOK = { skin: 'verde', head: 'grad', face: null, neck: null, hand: null, pet: null, bg: null };
const DEFAULT_POS = {
  head: { left: 46, top: 4, size: 0.56 }, face: { left: 66, top: 58, size: 0.4 }, neck: { left: 40, top: 96, size: 0.34 },
  hand: { left: 94, top: 80, size: 0.42, rot: 10 }, pet: { left: -4, top: 84, size: 0.42 },
};

export const itemById = (id) => SHOP.find((i) => i.id === id) || null;
export const skinSrc = (id, withCap) => `img/kiko/${itemById(id) && itemById(id).slot === 'skin' ? id : 'verde'}${withCap ? '-cap' : ''}.png`;
export const currentLook = () => ({ ...DEFAULT_LOOK, ...(store.wallet().equipped || {}) });

function layer(item) {
  if (!item || item.id === 'grad' || !item.emoji) return '';
  const p = { rot: 0, ...DEFAULT_POS[item.slot], ...(item.pos || {}) };
  const style = `left:${p.left}%;top:${p.top}%;font-size:calc(var(--kk) * ${p.size});transform:translate(-50%,-50%) rotate(${p.rot}deg)`;
  return `<span class="kk-${item.slot} ${item.halo ? 'kk-halo' : ''}" style="${style}" aria-hidden="true">${item.halo ? '' : item.emoji}</span>`;
}

// Kiko vestido. look: opcional, para pré-visualizar sem salvar.
export function kikoHtml(size = 64, { cls = '', alt = '', look = null } = {}) {
  const lk = { ...currentLook(), ...(look || {}) };
  const head = itemById(lk.head);
  const bg = itemById(lk.bg);
  const src = skinSrc(lk.skin, !head || head.id === 'grad');
  const decos = bg && bg.deco ? bg.deco.map((e, i) => `<span class="kk-deco d${i}" aria-hidden="true">${e}</span>`).join('') : '';
  return `<span class="kiko-dress ${bg ? bg.id : ''} ${cls}" style="--kk:${size}px" ${alt ? `role="img" aria-label="${alt}"` : 'aria-hidden="true"'}>
    ${decos}<img src="${src}" alt="" width="${size}" height="${size}">
    ${layer(head)}${layer(itemById(lk.face))}${layer(itemById(lk.neck))}${layer(itemById(lk.hand))}${layer(itemById(lk.pet))}
  </span>`;
}
