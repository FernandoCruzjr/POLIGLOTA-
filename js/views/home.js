import * as store from '../store.js';
import * as content from '../content.js';
import { icon } from '../icons.js';
import { esc, formatNumber, progressBar, ring, relativeTime, plural } from '../ui.js';

function englishGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function render(root) {
  const s = store.get();
  const p = s.profile;
  const done = store.isLessonDone;
  const next = content.nextLesson(done);
  const level = content.currentLevel(done);
  const overall = content.overallProgress(done);
  const streak = store.currentStreak();
  const minutesToday = Math.floor(store.secondsToday() / 60);
  const goal = p.dailyGoalMin;
  const lessonsDone = Object.keys(s.lessons).length;
  const course = content.getCourse();
  const units = course.levels.flatMap((l) => l.units);

  const heroAction = next
    ? `<p class="hero-next">Próxima lição</p>
       <p class="hero-lesson">${esc(next.lesson.title)} <span>· ${esc(next.lesson.titleEn)}</span></p>
       <a class="btn btn-light btn-lg" href="#/licao/${esc(next.lesson.id)}">${icon('play', 18)} ${lessonsDone ? 'Continuar' : 'Começar'}</a>`
    : `<p class="hero-lesson">Você concluiu todas as lições disponíveis! 🎉</p>
       <a class="btn btn-light btn-lg" href="#/aprender">Rever lições</a>`;

  root.innerHTML = `
    <header class="page-head">
      <h1>Olá, ${esc(p.name || 'aluno')}!</h1>
      <p class="muted"><span lang="en">${englishGreeting()}!</span> Vamos praticar um pouco hoje?</p>
    </header>

    <section class="card hero" aria-labelledby="hero-title">
      <div class="hero-top">
        <span class="chip chip-on-green">Nível ${level.number} · ${esc(level.title)}</span>
        <span class="hero-pct">${Math.round(overall * 100)}%</span>
      </div>
      <h2 id="hero-title" class="sr-only">Seu progresso</h2>
      ${progressBar(overall, 'Progresso geral do curso')}
      ${heroAction}
    </section>

    <section class="stats" aria-label="Resumo de hoje">
      <div class="card stat">
        <span class="stat-icon flame">${icon('flame')}</span>
        <div><strong>${plural(streak, 'dia', 'dias')}</strong><span class="muted">Sequência</span></div>
      </div>
      <div class="card stat">
        <span class="stat-icon bolt">${icon('bolt')}</span>
        <div><strong>${formatNumber(p.xp)} XP</strong><span class="muted">Total</span></div>
      </div>
      <div class="card stat">
        ${ring(minutesToday / goal, `${Math.min(minutesToday, 999)}`, `${minutesToday} de ${goal} minutos hoje`)}
        <div><strong>${minutesToday >= goal ? 'Meta batida!' : `${goal} min`}</strong><span class="muted">Meta de hoje</span></div>
      </div>
    </section>

    <div class="grid-2">
      <section class="card" aria-labelledby="units-title">
        <div class="card-head"><h2 id="units-title">Progresso das unidades</h2><a class="link" href="#/aprender">Ver trilha</a></div>
        <ul class="unit-bars">
          ${units.map((u) => {
            const up = content.unitProgress(u, done);
            return `<li><div class="row-between"><span>${u.number}. ${esc(u.title)}</span><span class="muted">${up.done}/${up.total}</span></div>${progressBar(up.done / up.total, `Unidade ${u.number}`)}</li>`;
          }).join('')}
        </ul>
      </section>

      <section class="card" aria-labelledby="review-title">
        <div class="card-head"><h2 id="review-title">Revisão</h2></div>
        <div class="empty-inline">
          <span class="stat-icon review">${icon('review')}</span>
          <p>Nenhuma palavra para revisar ainda. Assim que você começar os exercícios, as palavras que precisarem de reforço aparecem aqui.</p>
        </div>
        <a class="btn btn-ghost" href="#/revisao">Abrir revisão</a>
      </section>
    </div>

    <div class="grid-2">
      <section class="card" aria-labelledby="activity-title">
        <div class="card-head"><h2 id="activity-title">Últimas atividades</h2></div>
        ${s.activity.length
          ? `<ul class="activity">${s.activity.slice(0, 5).map((a) => `
              <li><span class="dot">${icon('check', 16)}</span><div><strong>${esc(a.title)}</strong><span class="muted">${relativeTime(a.at)}</span></div><span class="xp">+${a.xp} XP</span></li>`).join('')}</ul>`
          : '<p class="muted">Suas lições concluídas vão aparecer aqui.</p>'}
      </section>

      <section class="card" aria-labelledby="numbers-title">
        <div class="card-head"><h2 id="numbers-title">Estatísticas</h2><a class="link" href="#/perfil">Perfil</a></div>
        <dl class="numbers">
          <div><dt>Lições concluídas</dt><dd>${lessonsDone}/${content.allLessons().length}</dd></div>
          <div><dt>Minutos estudados</dt><dd>${formatNumber(Math.floor(p.totalSeconds / 60))}</dd></div>
          <div><dt>Dias de estudo</dt><dd>${formatNumber(p.studyDays)}</dd></div>
        </dl>
      </section>
    </div>
  `;
}
