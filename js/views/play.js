import { kikoHtml } from '../kiko.js';
import * as store from '../store.js';
import * as vocab from '../vocab.js';
import { esc, plural } from '../ui.js';

export function render(root) {
  const due = store.dueWordsCount();
  root.innerHTML = `
    <header class="page-head">
      <h1>Jogar 🎮</h1>
      <p class="muted">Pratique com quizzes rápidos ou desafie a família numa sala.</p>
    </header>

    <a class="card play-hero" href="#/sala">
      ${kikoHtml(72)}
      <span>
        <strong>Sala de quiz ao vivo</strong>
        <span>Crie uma sala, passe o código e joguem juntos em tempo real.</span>
      </span>
      <span class="play-cta">Entrar →</span>
    </a>

    <div class="play-grid">
      <a class="card play-tile" href="#/quiz/misto"><span class="quick-emoji">🎲</span><strong>Quiz misturado</strong><span class="muted small">10 palavras de vários temas</span></a>
      <a class="card play-tile" href="#/revisao"><span class="quick-emoji">🔄</span><strong>Revisão</strong><span class="muted small">${due ? `${plural(due, 'palavra', 'palavras')} para hoje` : 'Reforce o que já estudou'}</span></a>
      <a class="card play-tile" href="#/ranking"><span class="quick-emoji">🏆</span><strong>Ranking</strong><span class="muted small">Veja quem está na frente</span></a>
    </div>

    <section aria-labelledby="quiz-cats">
      <h2 id="quiz-cats" class="section-title">Quiz por tema</h2>
      <ul class="chip-grid">
        ${vocab.getCategories().map((c) => `<li><a class="topic-chip" href="#/quiz/${esc(c.id)}"><span aria-hidden="true">${c.emoji}</span> ${esc(c.name)}</a></li>`).join('')}
      </ul>
    </section>`;
}
