// Player de lição. Na Fase 1 cada lição é uma sequência de cartões para
// ouvir e entender; a Fase 3 intercala exercícios nesta mesma sequência.
import * as store from '../store.js';
import * as content from '../content.js';
import { icon } from '../icons.js';
import { esc, progressBar, plural, coinReward } from '../ui.js';
import { speak, canSpeak } from '../speech.js';
import { XP_RULES } from '../config.js';
import { wordify } from '../wordtip.js';
import { favBtn } from '../favorites.js';

const MAX_LESSON_SECONDS = 30 * 60;

export function render(root, { id }) {
  const entry = content.findLesson(id);
  if (!entry || !content.isUnlocked(id, store.isLessonDone)) {
    location.hash = '#/aprender';
    return;
  }
  const { lesson, unit } = entry;
  const items = lesson.items;
  const startedAt = Date.now();
  let index = 0;
  let finished = false;

  document.body.classList.add('lesson-mode');

  function card() {
    const item = items[index];
    const isLast = index === items.length - 1;
    const kind = /\s/.test(item.en.trim()) ? 'Frase' : 'Palavra';
    root.innerHTML = `
      <div class="lesson">
        <div class="lesson-top">
          <a class="icon-btn" href="#/aprender" aria-label="Sair da lição">${icon('close')}</a>
          ${progressBar(index / items.length, 'Progresso da lição')}
          <span class="muted small">${index + 1}/${items.length}</span>
        </div>
        <p class="eyebrow center">Unidade ${unit.number} · Lição ${lesson.number} · ${esc(lesson.title)}</p>
        <section class="card flash" aria-live="polite">
          <span class="chip">${kind}</span>
          <p class="flash-en" lang="en">${wordify(item.en)} ${favBtn({ en: item.en, pt: item.pt, pron: item.pron || '', src: 'Lições' })}</p>
          ${canSpeak() || item.audio ? `
          <div class="audio-row">
            <button class="btn btn-soft" data-speak>${icon('speaker', 20)} Ouvir</button>
            <button class="btn btn-soft" data-speak-slow>${icon('turtle', 20)} Devagar</button>
          </div>` : ''}
          <p class="pron"><span class="muted">Pronúncia:</span> <strong>${esc(item.pron)}</strong></p>
          <hr>
          <p class="flash-pt">${esc(item.pt)}</p>
          ${item.note ? `<p class="note">💡 ${esc(item.note)}</p>` : ''}
        </section>
        <div class="lesson-actions">
          <button class="btn btn-ghost" data-prev ${index === 0 ? 'disabled' : ''}>${icon('back', 18)} Anterior</button>
          <button class="btn btn-primary btn-lg" data-next>${isLast ? `${icon('check', 18)} Concluir lição` : `Próximo ${icon('chevron', 18)}`}</button>
        </div>
      </div>`;
    root.querySelector('[data-next]').focus({ preventScroll: true });
  }

  function complete() {
    finished = true;
    const seconds = Math.min(Math.round((Date.now() - startedAt) / 1000), MAX_LESSON_SECONDS);
    const firstTime = !store.isLessonDone(lesson.id);
    const xp = firstTime ? XP_RULES.lessonFirstTime : XP_RULES.lessonRepeat;
    store.recordLesson({ lessonId: lesson.id, title: `Lição: ${lesson.title}`, xp, seconds, score: 100 });
    const coins = store.addCoins(firstTime ? 5 : 1);
    const next = content.nextLesson(store.isLessonDone);
    const streak = store.currentStreak();

    root.innerHTML = `
      <div class="lesson done-screen">
        <div class="burst" aria-hidden="true">${icon('check', 44)}</div>
        <h1>Lição concluída!</h1>
        <p class="muted">${esc(lesson.title)} · <span lang="en">${esc(lesson.titleEn)}</span></p>
        <div class="reward-row">
          <div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>
          <div class="card reward"><span class="stat-icon flame">${icon('flame')}</span><strong>${plural(streak, 'dia', 'dias')}</strong></div>
          ${coinReward(coins)}
        </div>
        ${firstTime ? '' : '<p class="muted small">Revisar lições também vale XP.</p>'}
        <div class="stack">
          ${next ? `<a class="btn btn-primary btn-lg" href="#/licao/${esc(next.lesson.id)}">Próxima lição: ${esc(next.lesson.title)}</a>` : ''}
          <a class="btn btn-ghost" href="#/aprender">Voltar ao mapa</a>
          <a class="btn btn-ghost" href="#/inicio">Ir para o início</a>
        </div>
      </div>`;
    const primary = root.querySelector('.btn-primary') || root.querySelector('.btn');
    primary.focus({ preventScroll: true });
  }

  function onClick(e) {
    const t = e.target.closest('button');
    if (!t || finished) return;
    const item = items[index];
    if (t.hasAttribute('data-speak')) speak(item.en, { audio: item.audio });
    else if (t.hasAttribute('data-speak-slow')) speak(item.en, { slow: true, audio: item.audio });
    else if (t.hasAttribute('data-prev') && index > 0) { index -= 1; card(); }
    else if (t.hasAttribute('data-next')) {
      if (index < items.length - 1) { index += 1; card(); } else complete();
    }
  }

  function onKey(e) {
    if (finished || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); root.querySelector('[data-next]')?.click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); root.querySelector('[data-prev]:not([disabled])')?.click(); }
  }

  root.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  card();

  return () => {
    root.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('lesson-mode');
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  };
}
