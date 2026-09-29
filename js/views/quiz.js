// Quiz solo (por categoria ou misturado) e Revisão.
import * as store from '../store.js';
import * as vocab from '../vocab.js';
import * as engine from '../quiz-engine.js';
import { icon } from '../icons.js';
import { esc, progressBar, plural, coinReward } from '../ui.js';
import { speak, canSpeak } from '../speech.js';
import { XP_RULES } from '../config.js';

const SIZE = 10;
const MAX_SECONDS = 30 * 60;

// ---------- Peças visuais compartilhadas com a sala multiplayer ----------

export function questionHtml(q, { index, total, header = '', closeHref = null, extra = '' }) {
  const isEn = q.direction === 'en-pt';
  return `
    <div class="lesson quiz">
      <div class="lesson-top">
        ${closeHref ? `<a class="icon-btn" href="${closeHref}" aria-label="Sair do quiz">${icon('close')}</a>` : ''}
        ${progressBar(index / total, 'Progresso do quiz')}
        <span class="muted small">${index + 1}/${total}</span>
      </div>
      ${header}
      <section class="card quiz-card" aria-live="polite">
        <div class="quiz-icon" aria-hidden="true">${q.icon}</div>
        <p class="quiz-ask">${isEn ? 'O que significa' : 'Como se diz em inglês'}</p>
        <p class="quiz-prompt" ${isEn ? 'lang="en"' : ''}>${esc(q.prompt)}${isEn && canSpeak() ? ` <button type="button" class="icon-btn speak-btn" data-say="${esc(q.speakText)}" aria-label="Ouvir">${icon('speaker', 20)}</button>` : ''}</p>
        ${extra}
      </section>
      <div class="options" role="group" aria-label="Opções de resposta">
        ${q.options.map((o, i) => `<button type="button" class="option" data-option="${i}" ${!isEn ? 'lang="en"' : ''}><span class="option-key" aria-hidden="true">${i + 1}</span><span class="option-text">${esc(o)}</span><span class="option-mark" aria-hidden="true"></span></button>`).join('')}
      </div>
      <div class="quiz-feedback" role="status" aria-live="assertive"></div>
    </div>`;
}

// Pinta certo/errado nas opções (com símbolo e texto, não só cor).
export function markOptions(root, correctIndex, chosenIndex) {
  root.querySelectorAll('[data-option]').forEach((b) => {
    const i = Number(b.dataset.option);
    b.disabled = true;
    b.classList.remove('picked');
    const mark = b.querySelector('.option-mark');
    if (i === correctIndex) { b.classList.add('is-correct'); mark.textContent = '✓'; }
    else if (i === chosenIndex) { b.classList.add('is-wrong'); mark.textContent = '✗'; }
  });
}

export function feedbackHtml(ok, q, { continueLabel = 'Continuar' } = {}) {
  return `
    <div class="feedback ${ok ? 'ok' : 'bad'}">
      <p><strong>${ok ? '✓ Correto!' : '✗ Não foi dessa vez'}</strong>${ok ? '' : ` Resposta: <span ${q.direction === 'pt-en' ? 'lang="en"' : ''}>${esc(q.answerText)}</span>`}</p>
      ${continueLabel ? `<button type="button" class="btn btn-primary btn-lg" data-continue>${continueLabel} ${icon('chevron', 18)}</button>` : ''}
    </div>`;
}

// ---------- Seleção de palavras ----------

async function pickCategoryWords(catId) {
  if (catId === 'misto') {
    const { words, pool } = await engine.randomWords(SIZE, null);
    return { words, pool, title: 'Misturado', emoji: '🎲' };
  }
  const cat = vocab.findCategory(catId);
  if (!cat) return null;
  const all = await vocab.loadCategory(catId);
  // Prioriza palavras com menos domínio; um pouco de sorte para variar.
  const ordered = engine.shuffle(all).sort((a, b) => store.masteryOf(a.id) - store.masteryOf(b.id));
  return { words: engine.shuffle(ordered.slice(0, SIZE)), pool: all, title: cat.name, emoji: cat.emoji };
}

async function pickReviewWords() {
  let ids = store.dueWordIds(SIZE);
  let label = 'Revisão do dia';
  if (!ids.length) {
    ids = store.weakestSeenIds(SIZE);
    label = 'Reforço extra';
  }
  if (!ids.length) return null;
  const words = await engine.wordsByIds(ids);
  const cats = [...new Set(words.map((w) => w.category))];
  const pool = (await Promise.all(cats.map((c) => vocab.loadCategory(c)))).flat();
  return { words: engine.shuffle(words), pool, title: label, emoji: '🔄', due: store.dueWordsCount() };
}

function reviewEmpty(root) {
  const seen = store.seenWordsCount();
  root.innerHTML = `
    <header class="page-head"><h1>Revisão</h1></header>
    <section class="card empty">
      <span class="empty-icon">${icon('review', 34)}</span>
      <h2>${seen ? 'Tudo revisado por hoje! 🎉' : 'Nada para revisar ainda'}</h2>
      <p>${seen
        ? 'As palavras que você acerta voltam em 1, 3, 7 e 21 dias. As que você erra voltam em poucos minutos.'
        : 'Estude palavras no Vocabulário ou faça um quiz: o que você aprender aparece aqui para revisar.'}</p>
      <div class="stack narrow">
        <a class="btn btn-primary" href="#/vocabulario">Ir para o Vocabulário</a>
        <a class="btn btn-ghost" href="#/quiz/misto">Quiz misturado</a>
      </div>
    </section>`;
}

// ---------- Tela ----------

export async function render(root, { mode, cat }) {
  root.innerHTML = '<p class="muted center">Preparando o quiz…</p>';
  let set;
  try {
    set = mode === 'review' ? await pickReviewWords() : await pickCategoryWords(cat);
  } catch (e) {
    root.innerHTML = '<div class="card empty"><p>Não foi possível carregar as palavras. Verifique a internet.</p><a class="btn btn-ghost" href="#/jogar">Voltar</a></div>';
    return null;
  }
  if (!set) {
    if (mode === 'review') { reviewEmpty(root); return null; }
    location.hash = '#/jogar';
    return null;
  }

  const questions = engine.buildQuiz(set.words, set.pool, SIZE);
  const closeHref = mode === 'review' ? '#/inicio' : (cat === 'misto' ? '#/jogar' : `#/vocabulario/${cat}`);
  const startedAt = Date.now();
  const results = [];
  let index = 0;
  let answered = false;
  let finished = false;
  document.body.classList.add('lesson-mode');

  const header = `<p class="eyebrow center">${set.emoji} ${esc(set.title)}${set.due ? ` · ${plural(set.due, 'palavra', 'palavras')} para revisar` : ''}</p>`;

  function show() {
    answered = false;
    root.innerHTML = questionHtml(questions[index], { index, total: questions.length, header, closeHref });
    root.querySelector('[data-option]').focus({ preventScroll: true });
  }

  function answer(choice) {
    if (answered) return;
    answered = true;
    const q = questions[index];
    const ok = choice === q.correct;
    results.push({ q, ok });
    store.recordQuizAnswer(q.wordId, ok);
    markOptions(root, q.correct, choice);
    root.querySelector('.quiz-feedback').innerHTML = feedbackHtml(ok, q, { continueLabel: index === questions.length - 1 ? 'Ver resultado' : 'Continuar' });
    root.querySelector('.lesson').classList.add(ok ? 'answered-ok' : 'answered-bad');
    speak(q.speakText);
    root.querySelector('[data-continue]').focus({ preventScroll: true });
  }

  function next() {
    if (index < questions.length - 1) { index += 1; show(); } else complete();
  }

  function complete() {
    finished = true;
    const right = results.filter((r) => r.ok).length;
    const perfect = right === results.length;
    const xp = right * XP_RULES.quizCorrect + (perfect ? XP_RULES.quizPerfectBonus : 0);
    const seconds = Math.min(Math.round((Date.now() - startedAt) / 1000), MAX_SECONDS);
    store.recordQuizSession({
      xp, seconds, ref: mode === 'review' ? 'review' : cat,
      type: mode === 'review' ? 'review' : 'quiz',
      title: `${mode === 'review' ? 'Revisão' : 'Quiz'}: ${set.title} (${right}/${results.length})`,
    });
    const coins = store.addCoins(Math.floor(right / 2) + (perfect ? 2 : 0));
    const wrong = results.filter((r) => !r.ok);
    const again = mode === 'review' ? `#/revisao?${Date.now()}` : `#/quiz/${cat}?${Date.now()}`;

    root.innerHTML = `
      <div class="lesson done-screen">
        <div class="burst ${perfect ? '' : 'soft'}" aria-hidden="true">${perfect ? '🏆' : right >= results.length / 2 ? '👏' : '💪'}</div>
        <h1>${perfect ? 'Perfeito!' : right >= results.length / 2 ? 'Muito bem!' : 'Continue praticando!'}</h1>
        <p class="score-big"><strong>${right}</strong> de ${results.length} certas</p>
        <div class="reward-row">
          <div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>
          <div class="card reward"><span class="stat-icon flame">${icon('flame')}</span><strong>${plural(store.currentStreak(), 'dia', 'dias')}</strong></div>
          ${coinReward(coins)}
        </div>
        ${wrong.length ? `
          <section class="card review-list">
            <h2>Para revisar</h2>
            <ul>${wrong.map(({ q }) => `<li><span aria-hidden="true">${q.icon}</span> <strong lang="en">${esc(q.speakText)}</strong> <span class="muted">${esc(q.direction === 'en-pt' ? q.answerText : q.prompt)}</span></li>`).join('')}</ul>
            <p class="muted small">Elas voltam na Revisão daqui a poucos minutos.</p>
          </section>` : ''}
        <div class="stack">
          <a class="btn btn-primary btn-lg" href="${again}">Jogar de novo</a>
          <a class="btn btn-ghost" href="#/ranking">Ver ranking</a>
          <a class="btn btn-ghost" href="${closeHref}">Voltar</a>
        </div>
      </div>`;
    root.querySelector('.btn-primary').focus({ preventScroll: true });
  }

  function onClick(e) {
    const say = e.target.closest('[data-say]');
    if (say) { speak(say.dataset.say); return; }
    if (finished) return;
    const opt = e.target.closest('[data-option]');
    if (opt) { answer(Number(opt.dataset.option)); return; }
    if (e.target.closest('[data-continue]')) next();
  }

  function onKey(e) {
    if (finished || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Enter' && e.target.closest('button, a')) return;
    if (!answered && ['1', '2', '3', '4'].includes(e.key)) { e.preventDefault(); answer(Number(e.key) - 1); }
    else if (answered && (e.key === 'Enter' || e.key === 'ArrowRight')) { e.preventDefault(); next(); }
  }

  root.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  show();

  return () => {
    root.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('lesson-mode');
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  };
}
