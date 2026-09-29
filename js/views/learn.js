import * as store from '../store.js';
import * as content from '../content.js';
import { icon } from '../icons.js';
import { esc, progressBar } from '../ui.js';

export function render(root) {
  const done = store.isLessonDone;
  const course = content.getCourse();
  const next = content.nextLesson(done);
  const currentId = next ? next.lesson.id : null;

  const levelsHtml = course.levels.map((level) => {
    if (!level.units.length) {
      return `<li class="level-soon">${icon('lock', 18)}<span>Nível ${level.number} — ${esc(level.title)}</span><span class="chip">Em breve</span></li>`;
    }
    return '';
  }).join('');

  const activeLevels = course.levels.filter((l) => l.units.length);

  root.innerHTML = `
    <header class="page-head">
      <h1>Aprender</h1>
      <p class="muted">Siga a trilha na ordem: cada lição libera a próxima.</p>
    </header>

    ${activeLevels.map((level) => `
      <section aria-labelledby="level-${level.id}">
        <h2 class="level-title" id="level-${level.id}">Nível ${level.number} — ${esc(level.title)}</h2>
        ${level.units.map((unit) => {
          const up = content.unitProgress(unit, done);
          return `
          <article class="card unit" aria-labelledby="unit-${unit.id}">
            <header class="unit-head">
              <div>
                <p class="eyebrow">Unidade ${unit.number}</p>
                <h3 id="unit-${unit.id}">${esc(unit.title)}</h3>
                <p class="muted" lang="en">${esc(unit.subtitle)}</p>
              </div>
              <span class="unit-count">${up.done}/${up.total}</span>
            </header>
            ${progressBar(up.done / up.total, `Progresso da unidade ${unit.number}`)}
            <ol class="path">
              ${unit.lessons.map((lesson) => {
                const isDone = done(lesson.id);
                const unlocked = content.isUnlocked(lesson.id, done);
                const isCurrent = lesson.id === currentId;
                const state = isDone ? 'done' : isCurrent ? 'current' : unlocked ? 'open' : 'locked';
                const stateLabel = { done: 'concluída', current: 'próxima', open: 'disponível', locked: 'bloqueada' }[state];
                const node = isDone ? icon('check', 20) : unlocked ? `<span>${lesson.number}</span>` : icon('lock', 18);
                const inner = `
                  <span class="node node-${state}">${node}</span>
                  <span class="path-text">
                    <strong>Lição ${lesson.number} · ${esc(lesson.title)}</strong>
                    <span class="muted"><span lang="en">${esc(lesson.titleEn)}</span> · ${lesson.items.length} itens</span>
                  </span>
                  ${isCurrent ? '<span class="chip chip-green">Continuar</span>' : unlocked ? icon('chevron', 18, 'muted') : ''}`;
                return `<li class="path-item path-${state}">${
                  unlocked
                    ? `<a href="#/licao/${esc(lesson.id)}" aria-label="Lição ${lesson.number}, ${esc(lesson.title)}, ${stateLabel}">${inner}</a>`
                    : `<div aria-label="Lição ${lesson.number}, ${esc(lesson.title)}, ${stateLabel}">${inner}</div>`
                }</li>`;
              }).join('')}
            </ol>
          </article>`;
        }).join('')}
      </section>`).join('')}

    <section class="card" aria-labelledby="next-levels">
      <h2 id="next-levels">Próximos níveis</h2>
      <ul class="levels-soon">${levelsHtml}</ul>
    </section>
  `;
}
