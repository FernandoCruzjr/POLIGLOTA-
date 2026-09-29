import * as store from '../store.js';
import * as content from '../content.js';
import * as vocab from '../vocab.js';
import { currentTripSummary } from './trip.js';
import { kikoHtml } from '../kiko.js';
import { coinChip } from '../game.js';
import { WEEK, todayIdx } from './plan.js';
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
  const lessonsDone = content.allLessons().filter((e) => s.lessons[e.lesson.id]).length;
  const course = content.getCourse();
  const units = course.levels.flatMap((l) => l.units);
  const cats = vocab.getCategories();
  const totalWords = cats.reduce((n, c) => n + c.count, 0);
  const seenWords = store.seenWordsCount();
  const due = store.dueWordsCount();
  const catStats = cats.map((c) => ({ c, st: store.wordStats(vocab.wordIdsOf(c)) }));
  const started = catStats.filter((x) => x.st.seen > 0).sort((a, b) => b.st.mastery - a.st.mastery);
  const showcase = (started.length ? started : catStats).slice(0, 4);

  const heroAction = next
    ? `<p class="hero-next">Próxima lição</p>
       <p class="hero-lesson">${esc(next.lesson.title)} <span>· ${esc(next.lesson.titleEn)}</span></p>
       <a class="btn btn-primary btn-lg" href="#/licao/${esc(next.lesson.id)}">${icon('play', 18)} ${lessonsDone ? 'Continuar' : 'Começar'}</a>`
    : `<p class="hero-lesson">Você concluiu todas as lições disponíveis! 🎉</p>
       <a class="btn btn-primary btn-lg" href="#/aprender">Rever lições</a>`;

  root.innerHTML = `
    <header class="home-head">
      <a class="home-avatar-link" href="#/loja" aria-label="Lojinha do Kiko">${kikoHtml(64, { cls: 'home-avatar' })}</a>
      <div>
        <h1>Olá, ${esc(p.name || 'aluno')}!</h1>
        <p><span lang="en">${englishGreeting()}!</span> Hoje é um ótimo dia para aprender.</p>
      </div>
      ${coinChip(false)}
    </header>

    <section class="card hero" aria-labelledby="hero-title">
      <div class="hero-top">
        <span class="chip chip-green">Nível ${level.number} · ${esc(level.title)}</span>
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

    <a class="card trip-hero plan-today" href="#/plano">
      <span class="trip-flag" aria-hidden="true">🧭</span>
      <span class="trip-hero-text">
        <span class="eyebrow">Meu plano · ${WEEK[todayIdx()].name}</span>
        <strong>${esc(WEEK[todayIdx()].theme)}</strong>
        <span class="muted small">${WEEK[todayIdx()].blocks.map((b) => `${b.icon} ${esc(b.title)}`).join(' · ')}</span>
      </span>
      <span class="play-cta">Ver</span>
    </a>

    <div data-trip-slot></div>

    <a class="card play-hero" href="#/sala">
      <span class="quick-emoji" aria-hidden="true">👥</span>
      <span><strong>Sala de quiz ao vivo</strong><span>Jogue com a família em tempo real</span></span>
      <span class="play-cta">Jogar</span>
    </a>

    <div class="quick-row">
      <a class="card quick" href="#/revisao"><span class="quick-emoji">🔄</span><span><strong>Revisão</strong><span class="muted small">${due ? `${plural(due, 'palavra', 'palavras')} para hoje` : 'Nada pendente'}</span></span></a>
      <a class="card quick" href="#/ranking"><span class="quick-emoji">🏆</span><span><strong>Ranking</strong><span class="muted small">Veja sua posição</span></span></a>
      <a class="card quick" href="#/fala"><span class="quick-emoji">🗣️</span><span><strong>Treino de fala</strong><span class="muted small">Ouça, repita, grave</span></span></a>
      <a class="card quick" href="#/kids"><span class="quick-emoji">🎈</span><span><strong>Área Kids</strong><span class="muted small">Bichos, cores, casa</span></span></a>
    </div>

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

      <section class="card" aria-labelledby="vocab-title">
        <div class="card-head"><h2 id="vocab-title">Vocabulário</h2><a class="link" href="#/vocabulario">Ver tudo</a></div>
        <p class="muted small vocab-count">${formatNumber(seenWords)} de ${formatNumber(totalWords)} palavras estudadas</p>
        <ul class="unit-bars">
          ${showcase.map(({ c, st }) => `<li><a class="plain" href="#/vocabulario/${esc(c.id)}"><div class="row-between"><span>${c.emoji} ${esc(c.name)}</span><span class="muted">${st.seen}/${st.total}</span></div>${progressBar(st.mastery, `Domínio em ${c.name}`)}</a></li>`).join('')}
        </ul>
      </section>
    </div>

    <div class="grid-2">
      <section class="card" aria-labelledby="review-title">
        <div class="card-head"><h2 id="review-title">Revisão</h2></div>
        <div class="empty-inline">
          <span class="stat-icon review">${icon('review')}</span>
          <p>${due
            ? `<strong>${plural(due, 'palavra', 'palavras')}</strong> ${due === 1 ? 'está esperando' : 'estão esperando'} revisão. Leva só 2 minutos!`
            : seenWords
              ? 'Nenhuma palavra para revisar hoje. As palavras estudadas voltam para revisão no dia seguinte.'
              : 'Nenhuma palavra para revisar ainda. Estude palavras no Vocabulário e elas aparecem aqui para revisão.'}</p>
        </div>
        <a class="btn ${due ? 'btn-primary' : 'btn-ghost'}" href="#/revisao">${due ? 'Revisar agora' : 'Abrir revisão'}</a>
      </section>

      <section class="card" aria-labelledby="activity-title">
        <div class="card-head"><h2 id="activity-title">Últimas atividades</h2></div>
        ${s.activity.length
          ? `<ul class="activity">${s.activity.slice(0, 5).map((a) => `
              <li><span class="dot">${icon('check', 16)}</span><div><strong>${esc(a.title)}</strong><span class="muted">${relativeTime(a.at)}</span></div><span class="xp">+${a.xp} XP</span></li>`).join('')}</ul>`
          : '<p class="muted">Suas lições e estudos de vocabulário vão aparecer aqui.</p>'}
      </section>
    </div>

    <div>

      <section class="card" aria-labelledby="numbers-title">
        <div class="card-head"><h2 id="numbers-title">Estatísticas</h2><a class="link" href="#/perfil">Perfil</a></div>
        <dl class="numbers">
          <div><dt>Lições concluídas</dt><dd>${lessonsDone}/${content.allLessons().length}</dd></div>
          <div><dt>Palavras estudadas</dt><dd>${formatNumber(seenWords)}</dd></div>
          <div><dt>Minutos estudados</dt><dd>${formatNumber(Math.floor(p.totalSeconds / 60))}</dd></div>
          <div><dt>Dias de estudo</dt><dd>${formatNumber(p.studyDays)}</dd></div>
        </dl>
      </section>
    </div>
  `;

  currentTripSummary().then((t) => {
    const slot = root.querySelector('[data-trip-slot]');
    if (!t || !slot) return;
    const nextLabel = t.next ? `Capítulo ${t.next.number}: ${esc(t.next.title)}` : t.boss ? 'Viagem concluída! 🏆' : 'Chefão te esperando! ⚔️';
    slot.outerHTML = `
      <a class="card trip-hero" href="${t.next ? `#/viagem/${t.trip.id}/${t.next.id}` : `#/viagem/${t.trip.id}`}">
        <span class="trip-flag" aria-hidden="true">${t.trip.emoji}</span>
        <span class="trip-hero-text">
          <span class="eyebrow">Modo viagem ✈️</span>
          <strong>${esc(t.trip.title)}</strong>
          <span class="muted small">${nextLabel}</span>
          ${progressBar(t.done / t.total, 'Progresso da viagem')}
        </span>
        <span class="play-cta">${t.done ? 'Continuar' : 'Começar'}</span>
      </a>`;
  });
}
