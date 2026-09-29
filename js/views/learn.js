// Aprender: a trilha do curso como um mapa de ilhas no céu, com placas de
// unidade, o Kiko caminhando, um chefão por nível e o baú do tesouro.
import * as store from '../store.js';
import * as content from '../content.js';
import { esc, progressBar, toast } from '../ui.js';
import { shuffle } from '../quiz-engine.js';
import { mapHtml, wireMap, coinChip, openChest, lockedToast } from '../game.js';
import { renderBoss } from './boss.js';

const ICONS = {
  u1l1: ['👋', '😊'], u1l2: ['🙋', '📛'], u1l3: ['🔢', '🎲'], u1l4: ['👨‍👩‍👧', '❤️'],
  u2l1: ['🏠', '🛋️'], u2l2: ['🍎', '🥖'], u2l3: ['🛒', '💳'],
  u3l1: ['🧭', '🗺️'], u3l2: ['🍽️', '🍝'], u3l3: ['✈️', '🧳'],
};
const DEFAULT_BOSS = { name: 'O Dragão das Palavras', emoji: '🐲', intro: 'Grrr! Eu guardo o tesouro deste nível. Só passa quem lembra as palavras e frases das lições!' };
const bossKey = (level) => `boss.level.${level.id}`;
const lessonsOf = (level) => level.units.flatMap((u) => u.lessons.map((l) => ({ lesson: l, unit: u })));

function levelQuestions(level) {
  const items = lessonsOf(level).flatMap(({ lesson }) => lesson.items.map((it) => ({ ...it, lessonId: lesson.id })));
  const clean = (t) => t.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  const pick = (it, key) => {
    const same = items.filter((x) => x.lessonId === it.lessonId && x !== it);
    const other = items.filter((x) => x.lessonId !== it.lessonId);
    const seen = new Set([clean(it[key])]);
    const out = [];
    [...shuffle(same), ...shuffle(other)].forEach((x) => {
      const v = clean(x[key]);
      if (out.length < 3 && !seen.has(v)) { seen.add(v); out.push(v); }
    });
    return out;
  };
  return shuffle(items).slice(0, 14).map((it, k) => (k % 2
    ? { prompt: 'O que significa?', context: { speaker: '🎓 Professor Kiko', en: it.en }, options: [clean(it.pt), ...pick(it, 'pt')], answer: clean(it.pt), say: it.en }
    : { prompt: 'Como se diz em inglês?', pt: clean(it.pt), options: [it.en, ...pick(it, 'en')], answer: it.en, say: it.en }));
}

function kikoLine(level, next, bossDone) {
  if (next && next.level === level) {
    return content.allLessons()[0].lesson === next.lesson
      ? 'Oi! Eu sou o Professor Kiko. Toque na primeira ilha para a nossa primeira aula!'
      : `Muito bem! Próxima aula: ${next.lesson.title}. Vamos?`;
  }
  return bossDone ? 'Nível completo! Abra o baú do tesouro! 🎁' : `Todas as lições feitas! Enfrente ${DEFAULT_BOSS.name}! ⚔️`;
}

function renderMap(root) {
  const done = store.isLessonDone;
  const course = content.getCourse();
  const active = course.levels.filter((l) => l.units.length);
  const next = content.nextLesson(done);
  const level = next ? next.level : active[active.length - 1];
  const entries = lessonsOf(level);
  const allDone = entries.every(({ lesson }) => done(lesson.id));
  const boss = { ...DEFAULT_BOSS, ...(level.boss || {}) };
  const bDone = store.isLessonDone(bossKey(level));
  const doneCount = entries.filter(({ lesson }) => done(lesson.id)).length;

  const spec = {
    theme: 'sky',
    startLabel: `🌱 Nível ${level.number} · ${level.title}`,
    kikoLine: kikoLine(level, next, bDone),
    kikoKey: `learn.${level.id}.kikoAt`,
    nodes: entries.map(({ lesson, unit }, i) => {
      const isDone = done(lesson.id);
      const open = content.isUnlocked(lesson.id, done);
      const [main, side] = lesson.island || ICONS[lesson.id] || ['📘', '✏️'];
      return {
        main, side, name: lesson.title, sign: `Lição ${i + 1}`, done: isDone, open,
        next: next && next.lesson.id === lesson.id,
        banner: lesson.number === 1 ? { kicker: `Unidade ${unit.number}`, title: unit.title } : null,
        aria: `Lição ${i + 1}: ${lesson.title}, ${isDone ? 'concluída' : open ? 'liberada' : 'bloqueada'}`,
        id: lesson.id,
      };
    }),
    boss: { ...boss, open: allDone, done: bDone },
    chest: { open: bDone },
  };
  const soon = course.levels.filter((l) => !l.units.length);

  root.classList.add('map-view', 'theme-sky');
  root.innerHTML = `
    <header class="map-header">
      <div class="map-top-row">
        <span class="map-btn" aria-hidden="true">📚 Aprender</span>
        ${coinChip()}
      </div>
      <div class="map-title">
        <span class="trip-flag" aria-hidden="true">🌱</span>
        <div>
          <h1>Nível ${level.number} · ${esc(level.title)}</h1>
          <p class="small">${doneCount} de ${entries.length} lições${bDone ? ' · 🏆 chefão vencido' : ''}</p>
        </div>
      </div>
      ${progressBar(doneCount / entries.length, 'Progresso do nível')}
      <div class="map-actions">
        ${next && next.level === level ? `<a class="map-btn primary" href="#/licao/${esc(next.lesson.id)}">▶ ${doneCount ? 'Continuar' : 'Começar'}</a>` : !bDone ? `<a class="map-btn primary" href="#/aprender/chefao/${level.id}">⚔️ Enfrentar o chefão</a>` : ''}
        <a class="map-btn" href="#/revisao">🔄 Revisão</a>
        <a class="map-btn" href="#/loja">🛍️ Lojinha</a>
      </div>
    </header>
    ${mapHtml(spec)}
    <section class="map-soon" aria-labelledby="soon-title">
      <h2 id="soon-title">🔒 Próximos níveis</h2>
      <div class="soon-isles">
        ${soon.slice(0, 4).map((l) => `<div class="soon-isle"><span>${['🌿', '🌳', '⛰️', '🏔️', '🚀'][l.number - 2] || '⭐'}</span><strong>Nível ${l.number}</strong><em>${esc(l.title)}</em></div>`).join('')}
      </div>
    </section>`;
  wireMap(root, spec);

  function onClick(e) {
    const isle = e.target.closest('[data-node]');
    if (isle) {
      const n = spec.nodes[Number(isle.dataset.node)];
      if (!n.open) { lockedToast('a lição anterior'); return; }
      location.hash = `#/licao/${n.id}`;
      return;
    }
    if (e.target.closest('[data-boss]')) {
      if (!allDone) { lockedToast('todas as lições do nível'); return; }
      location.hash = `#/aprender/chefao/${level.id}`;
      return;
    }
    if (e.target.closest('[data-chest]')) {
      if (bDone) openChest(`learn.${level.id}`, 100, null);
      else toast(`Vença ${boss.name} para abrir o baú! ⚔️`);
    }
  }
  root.addEventListener('click', onClick);
  return () => {
    root.removeEventListener('click', onClick);
    root.classList.remove('map-view', 'theme-sky');
  };
}

export function render(root, { boss } = {}) {
  if (!boss) return renderMap(root);
  const level = content.getCourse().levels.find((l) => l.id === boss);
  if (!level || !lessonsOf(level).every(({ lesson }) => store.isLessonDone(lesson.id))) {
    toast('Complete todas as lições do nível primeiro! 🔒');
    location.hash = '#/aprender';
    return null;
  }
  return renderBoss(root, {
    title: `Nível ${level.number} · ${level.title}`,
    theme: 'sky',
    backHref: '#/aprender',
    doneKey: bossKey(level),
    boss: { ...DEFAULT_BOSS, ...(level.boss || {}) },
    questions: levelQuestions(level),
  });
}
