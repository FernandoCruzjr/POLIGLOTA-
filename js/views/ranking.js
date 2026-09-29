import * as store from '../store.js';
import { sb } from '../auth.js';
import { esc, formatNumber } from '../ui.js';

const PERIODS = [
  { id: 'semana', label: 'Esta semana' },
  { id: 'geral', label: 'Geral' },
];

const AVATAR_COLORS = ['#0F7A4A', '#22C55E', '#0369a1', '#7c3aed', '#c2410c', '#be185d', '#0f766e', '#a16207'];

function avatar(name, id) {
  const n = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return `<span class="rank-avatar" style="background:${AVATAR_COLORS[n % AVATAR_COLORS.length]}" aria-hidden="true">${esc((name || '?').charAt(0).toUpperCase())}</span>`;
}

const MEDALS = ['🥇', '🥈', '🥉'];

async function fetchRanking(period) {
  await store.sync();
  const { data, error } = await sb().rpc('en_ranking', { p_period: period });
  if (error) throw error;
  return data || [];
}

export function render(root) {
  let period = 'semana';
  let alive = true;

  root.innerHTML = `
    <header class="page-head">
      <h1>Ranking 🏆</h1>
      <p class="muted">Quem mais ganhou XP estudando, fazendo quiz e jogando nas salas.</p>
    </header>
    <div class="filters" role="group" aria-label="Período do ranking">
      ${PERIODS.map((p) => `<button type="button" class="filter" data-period="${p.id}" aria-pressed="${p.id === period}">${p.label}</button>`).join('')}
    </div>
    <section id="rank-body" aria-live="polite"></section>`;

  const body = root.querySelector('#rank-body');

  async function load() {
    body.innerHTML = '<p class="muted center">Carregando ranking…</p>';
    try {
      const rows = await fetchRanking(period);
      if (!alive) return;
      if (!rows.length) {
        body.innerHTML = '<div class="card empty"><p>Ninguém pontuou neste período ainda. Faça um quiz e seja o primeiro! 🚀</p><a class="btn btn-primary" href="#/quiz/misto">Fazer um quiz</a></div>';
        return;
      }
      const top = rows.slice(0, 3);
      const me = rows.find((r) => r.is_me);
      body.innerHTML = `
        <div class="podium">
          ${[1, 0, 2].filter((i) => top[i]).map((i) => `
            <div class="podium-spot p${i + 1} ${top[i].is_me ? 'me' : ''}">
              ${avatar(top[i].name, top[i].user_id)}
              <span class="podium-medal" aria-hidden="true">${MEDALS[i]}</span>
              <strong>${esc(top[i].name)}${top[i].is_me ? ' (você)' : ''}</strong>
              <span class="muted small">${formatNumber(top[i].xp)} XP</span>
              <div class="podium-block"><span>${top[i].pos}º</span></div>
            </div>`).join('')}
        </div>
        <ol class="rank-list">
          ${rows.map((r) => `
            <li class="${r.is_me ? 'me' : ''}">
              <span class="rank-pos">${r.pos <= 3 ? MEDALS[r.pos - 1] : `${r.pos}º`}</span>
              ${avatar(r.name, r.user_id)}
              <span class="rank-name"><strong>${esc(r.name)}${r.is_me ? ' (você)' : ''}</strong><span class="muted small">🔥 ${r.streak} · 📖 ${formatNumber(r.words)} palavras</span></span>
              <span class="rank-xp">${formatNumber(r.xp)} XP</span>
            </li>`).join('')}
        </ol>
        ${me ? '' : '<p class="muted small center">Ganhe XP para aparecer no ranking.</p>'}`;
    } catch (e) {
      if (!alive) return;
      const p = store.get().profile;
      body.innerHTML = `
        <div class="card empty">
          <span class="empty-icon">🏆</span>
          <h2>Ranking indisponível</h2>
          <p>${navigator.onLine
            ? 'O ranking precisa do script do Supabase atualizado (supabase/schema.sql). Depois de rodar, é só voltar aqui.'
            : 'Sem internet no momento. O ranking aparece quando a conexão voltar.'}</p>
          <p><strong>Seu XP:</strong> ${formatNumber(p.xp)}</p>
          <button type="button" class="btn btn-ghost" data-retry>Tentar de novo</button>
        </div>`;
    }
  }

  function onClick(e) {
    const b = e.target.closest('[data-period]');
    if (b) {
      period = b.dataset.period;
      root.querySelectorAll('[data-period]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      load();
    }
    if (e.target.closest('[data-retry]')) load();
  }

  root.addEventListener('click', onClick);
  load();
  return () => { alive = false; root.removeEventListener('click', onClick); };
}
