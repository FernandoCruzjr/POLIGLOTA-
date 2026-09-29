// Sala de quiz ao vivo. Usa o Realtime do Supabase (broadcast + presence):
// não grava nada no banco, as mensagens só passam entre quem está na sala.
// O anfitrião (quem criou) comanda o jogo: envia as perguntas, recebe as
// respostas, calcula os pontos e publica o placar.
import * as store from '../store.js';
import * as vocab from '../vocab.js';
import * as engine from '../quiz-engine.js';
import { sb } from '../auth.js';
import { icon } from '../icons.js';
import { esc, plural, toast, formatNumber, coinReward } from '../ui.js';
import { speak } from '../speech.js';
import { XP_RULES } from '../config.js';
import { questionHtml, markOptions } from './quiz.js';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const REVEAL_MS = 4000;
const HOST_KEY = (code) => `hf_host_${code}`;
const SETTINGS_KEY = (code) => `hf_room_settings_${code}`;

function newCode() {
  let c = '';
  for (let i = 0; i < 4; i += 1) c += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return c;
}

function roomLink(code) {
  return `${location.origin}${location.pathname}#/sala/${code}`;
}

function initial(name) {
  return esc((name || '?').trim().charAt(0).toUpperCase());
}

// ---------- Tela de entrada: criar ou entrar ----------

function renderEntry(root) {
  const cats = vocab.getCategories();
  root.innerHTML = `
    <a class="back-link" href="#/jogar">${icon('back', 18)} Jogar</a>
    <header class="page-head">
      <h1>Sala de quiz 👥</h1>
      <p class="muted">Joguem juntos, cada um no seu celular. Quem responde certo e mais rápido faz mais pontos.</p>
    </header>

    <section class="card" aria-labelledby="join-title">
      <h2 id="join-title">Entrar numa sala</h2>
      <form class="form join-form" id="join-form" novalidate>
        <label for="room-code">Código da sala</label>
        <div class="join-row">
          <input id="room-code" name="code" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABCD" required>
          <button class="btn btn-primary" type="submit">Entrar</button>
        </div>
      </form>
    </section>

    <section class="card" aria-labelledby="create-title">
      <h2 id="create-title">Criar uma sala</h2>
      <form class="form" id="create-form">
        <label for="room-topic">Tema</label>
        <select id="room-topic" name="topic">
          <option value="misto">🎲 Misturado (todos os temas)</option>
          ${cats.map((c) => `<option value="${esc(c.id)}">${c.emoji} ${esc(c.name)}</option>`).join('')}
        </select>
        <div class="two-cols">
          <div>
            <label for="room-count">Perguntas</label>
            <select id="room-count" name="count"><option>5</option><option selected>10</option><option>15</option></select>
          </div>
          <div>
            <label for="room-time">Tempo por pergunta</label>
            <select id="room-time" name="time"><option value="10">10 s</option><option value="15" selected>15 s</option><option value="20">20 s</option></select>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" type="submit">Criar sala</button>
      </form>
    </section>`;

  root.querySelector('#join-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = e.target.code.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 4) { toast('O código tem 4 letras/números'); return; }
    location.hash = `#/sala/${code}`;
  });
  root.querySelector('#create-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const code = newCode();
    try {
      sessionStorage.setItem(HOST_KEY(code), '1');
      sessionStorage.setItem(SETTINGS_KEY(code), JSON.stringify({
        topic: fd.get('topic'), count: Number(fd.get('count')), time: Number(fd.get('time')),
      }));
    } catch (err) { /* sem sessionStorage: segue como convidado */ }
    location.hash = `#/sala/${code}`;
  });
  return null;
}

// ---------- Sala ----------

function renderRoom(root, code, user) {
  const me = { id: user.id, name: store.get().profile.name || 'Aluno' };
  let isHost = false;
  let settings = { topic: 'misto', count: 10, time: 15 };
  try {
    isHost = sessionStorage.getItem(HOST_KEY(code)) === '1';
    settings = JSON.parse(sessionStorage.getItem(SETTINGS_KEY(code)) || 'null') || settings;
  } catch (e) { /* ignora */ }

  const client = sb();
  const channel = client.channel(`hf-room-${code}`, {
    config: { broadcast: { self: true }, presence: { key: me.id } },
  });

  let players = new Map(); // id -> { name, host }
  let hostId = isHost ? me.id : null;
  let phase = 'connecting'; // connecting | lobby | question | reveal | end | closed
  let current = null; // pergunta atual (lado do jogador)
  let myChoice = null;
  let myAnswers = []; // { wordId, ok }
  let timerId = null;
  let alive = true;

  // Só o anfitrião usa:
  const game = { questions: [], index: -1, answers: new Map(), scores: new Map(), sentAt: 0, busy: false };

  const send = (event, payload) => channel.send({ type: 'broadcast', event, payload });

  function topicLabel(t) {
    if (t === 'misto') return '🎲 Misturado';
    const c = vocab.findCategory(t);
    return c ? `${c.emoji} ${c.name}` : t;
  }

  // ----- Desenho das telas -----

  function drawConnecting(text = 'Conectando à sala…') {
    root.innerHTML = `<div class="room-wait"><span class="boot-dot"></span><p class="muted">${esc(text)}</p></div>`;
  }

  function drawLobby() {
    const list = [...players.entries()];
    root.innerHTML = `
      <div class="room">
        <div class="room-top">
          <button type="button" class="back-link as-btn" data-leave>${icon('back', 18)} Sair</button>
        </div>
        <section class="card room-code-card">
          <p class="muted">Código da sala</p>
          <p class="room-code" aria-label="Código ${code.split('').join(' ')}">${code}</p>
          <p class="muted small">${topicLabel(settings.topic)} · ${settings.count} perguntas · ${settings.time} s cada</p>
          <button type="button" class="btn btn-soft" data-share>📤 Convidar</button>
        </section>
        <section class="card">
          <h2>Jogadores (${list.length})</h2>
          <ul class="player-list">
            ${list.map(([id, p]) => `<li><span class="rank-avatar" aria-hidden="true">${initial(p.name)}</span><strong>${esc(p.name)}${id === me.id ? ' (você)' : ''}</strong>${p.host ? '<span class="chip chip-green">Anfitrião</span>' : ''}</li>`).join('')}
          </ul>
        </section>
        ${isHost
          ? `<button type="button" class="btn btn-primary btn-lg" data-start>${list.length > 1 ? '▶ Começar o jogo' : '▶ Começar (sozinho)'}</button>
             ${list.length < 2 ? '<p class="muted small center">Passe o código para a família entrar pelo menu Jogar → Sala de quiz.</p>' : ''}`
          : '<p class="muted center">Aguardando o anfitrião começar… ⏳</p>'}
      </div>`;
  }

  function scoreboardHtml(scores, { limit = 5, showDelta = true } = {}) {
    return `<ol class="mini-board">${scores.slice(0, limit).map((s, i) => `
      <li class="${s.id === me.id ? 'me' : ''}"><span class="rank-pos">${i + 1}º</span><span class="rank-avatar" aria-hidden="true">${initial(s.name)}</span>
      <span class="rank-name"><strong>${esc(s.name)}${s.id === me.id ? ' (você)' : ''}</strong></span>
      ${showDelta && s.delta ? `<span class="delta">+${s.delta}</span>` : ''}<span class="rank-xp">${formatNumber(s.score)}</span></li>`).join('')}</ol>`;
  }

  function drawQuestion(msg) {
    current = msg;
    myChoice = null;
    const header = `<p class="eyebrow center">Sala ${code} · ${topicLabel(settings.topic)}</p>
      <div class="timer" aria-hidden="true"><span style="animation-duration:${msg.duration}ms"></span></div>`;
    root.innerHTML = questionHtml(msg.q, {
      index: msg.i, total: msg.total, header,
      extra: `<p class="muted small" data-count>${plural(players.size, 'jogador', 'jogadores')} na sala</p>`,
    });
    const left = root.querySelector('.lesson-top');
    left.insertAdjacentHTML('afterbegin', `<button type="button" class="icon-btn" data-leave aria-label="Sair da sala">${icon('close')}</button>`);
    root.querySelector('[data-option]').focus({ preventScroll: true });
  }

  function drawReveal(msg) {
    if (!current || current.i !== msg.i) return;
    markOptions(root, msg.correct, myChoice);
    const ok = myChoice === msg.correct;
    const answeredMe = myChoice !== null;
    root.querySelector('.timer')?.classList.add('stopped');
    root.querySelector('.quiz-feedback').innerHTML = `
      <div class="feedback ${ok ? 'ok' : 'bad'}">
        <p><strong>${ok ? '✓ Correto!' : answeredMe ? '✗ Errou' : '⏰ Tempo esgotado'}</strong>${ok ? '' : ` Resposta: ${esc(msg.answerText)}`}</p>
        ${scoreboardHtml(msg.scores)}
        <p class="muted small">${msg.i + 1 < msg.total ? 'Próxima pergunta já vem…' : 'Resultado final já vem…'}</p>
      </div>`;
    speak(current.q.speakText);
  }

  function drawEnd(msg) {
    phase = 'end';
    const scores = msg.scores;
    const mine = scores.find((s) => s.id === me.id);
    const right = myAnswers.filter((a) => a.ok).length;
    const won = scores[0] && scores[0].id === me.id && scores.length > 1;
    const xp = right * XP_RULES.roomCorrect + (won ? XP_RULES.quizPerfectBonus : 0);
    if (myAnswers.length) {
      store.recordQuizSession({ xp, seconds: Math.min(msg.total * (settings.time + 5), 1800), type: 'room', ref: code, title: `Sala ${code}: ${right}/${msg.total} certas` });
    }
    const coins = myAnswers.length ? store.addCoins(Math.floor(right / 2) + (won ? 3 : 0)) : 0;
    const podium = scores.slice(0, 3);
    root.innerHTML = `
      <div class="lesson done-screen">
        <div class="burst" aria-hidden="true">${won ? '🏆' : '🎉'}</div>
        <h1>${won ? 'Você venceu!' : 'Fim de jogo!'}</h1>
        ${mine ? `<p class="score-big"><strong>${formatNumber(mine.score)}</strong> pontos · ${right}/${msg.total} certas</p>` : ''}
        ${coins ? `<div class="reward-row">${coinReward(coins)}</div>` : ''}
        <div class="podium">
          ${[1, 0, 2].filter((i) => podium[i]).map((i) => `
            <div class="podium-spot p${i + 1} ${podium[i].id === me.id ? 'me' : ''}">
              <span class="rank-avatar" aria-hidden="true">${initial(podium[i].name)}</span>
              <span class="podium-medal" aria-hidden="true">${['🥇', '🥈', '🥉'][i]}</span>
              <strong>${esc(podium[i].name)}</strong>
              <span class="muted small">${formatNumber(podium[i].score)} pts</span>
              <div class="podium-block"><span>${i + 1}º</span></div>
            </div>`).join('')}
        </div>
        ${scores.length > 3 ? scoreboardHtml(scores, { limit: 20, showDelta: false }) : ''}
        ${myAnswers.length ? `<div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>` : ''}
        <div class="stack">
          ${isHost ? '<button type="button" class="btn btn-primary btn-lg" data-again>Jogar de novo</button>' : '<p class="muted small">Se o anfitrião começar outra rodada, você entra automaticamente.</p>'}
          <button type="button" class="btn btn-ghost" data-leave>Sair da sala</button>
        </div>
      </div>`;
  }

  function drawClosed(text) {
    phase = 'closed';
    clearTimeout(timerId);
    root.innerHTML = `
      <div class="card empty">
        <span class="empty-icon">👋</span>
        <h2>${esc(text)}</h2>
        <a class="btn btn-primary" href="#/sala">Voltar para as salas</a>
      </div>`;
  }

  // ----- Lógica do anfitrião -----

  function currentScores() {
    return [...game.scores.entries()]
      .map(([id, s]) => ({ id, name: s.name, score: s.score, delta: s.delta || 0 }))
      .sort((a, b) => b.score - a.score);
  }

  async function hostStart() {
    if (game.busy) return;
    game.busy = true;
    try {
      let words; let pool;
      if (settings.topic === 'misto') {
        ({ words, pool } = await engine.randomWords(settings.count, null));
      } else {
        pool = await vocab.loadCategory(settings.topic);
        words = engine.shuffle(pool).slice(0, settings.count);
      }
      game.questions = engine.buildQuiz(words, pool, settings.count);
      game.index = -1;
      game.scores = new Map([...players.entries()].map(([id, p]) => [id, { name: p.name, score: 0, delta: 0 }]));
      hostNext();
    } catch (e) {
      toast('Não foi possível preparar as perguntas.');
    } finally {
      game.busy = false;
    }
  }

  function hostNext() {
    game.index += 1;
    if (game.index >= game.questions.length) {
      send('end', { total: game.questions.length, scores: currentScores() });
      return;
    }
    const q = game.questions[game.index];
    game.answers = new Map();
    game.sentAt = Date.now();
    game.scores.forEach((s) => { s.delta = 0; });
    const { correct, answerText, ...publicQ } = q; // a resposta só vai na revelação
    send('question', { i: game.index, total: game.questions.length, q: publicQ, duration: settings.time * 1000 });
    clearTimeout(timerId);
    timerId = setTimeout(hostReveal, settings.time * 1000 + 600);
  }

  function hostCollect(msg) {
    if (msg.i !== game.index || game.answers.has(msg.id)) return;
    game.answers.set(msg.id, msg);
    if (!game.scores.has(msg.id)) game.scores.set(msg.id, { name: msg.name, score: 0, delta: 0 });
    send('progress', { i: game.index, answered: game.answers.size });
    const everyone = [...players.keys()].every((id) => game.answers.has(id));
    if (everyone) { clearTimeout(timerId); timerId = setTimeout(hostReveal, 400); }
  }

  function hostReveal() {
    const q = game.questions[game.index];
    if (!q) return;
    const limit = settings.time * 1000;
    game.answers.forEach((a, id) => {
      const s = game.scores.get(id);
      if (!s) return;
      if (a.choice === q.correct) {
        const remaining = Math.max(0, limit - Math.min(a.ms, limit));
        s.delta = 100 + Math.round(100 * (remaining / limit));
        s.score += s.delta;
      }
    });
    send('reveal', { i: game.index, correct: q.correct, answerText: q.answerText, scores: currentScores() });
    clearTimeout(timerId);
    timerId = setTimeout(hostNext, REVEAL_MS);
  }

  // ----- Eventos da sala -----

  function syncPlayers() {
    const state = channel.presenceState();
    const next = new Map();
    Object.entries(state).forEach(([id, metas]) => {
      const m = metas[0] || {};
      next.set(id, { name: m.name || 'Aluno', host: Boolean(m.host) });
      if (m.host) hostId = id;
    });
    players = next;
    if (phase === 'lobby') drawLobby();
    const count = root.querySelector('[data-count]');
    if (count) count.textContent = `${plural(players.size, 'jogador', 'jogadores')} na sala`;
  }

  channel
    .on('presence', { event: 'sync' }, syncPlayers)
    .on('presence', { event: 'leave' }, ({ key }) => {
      if (!isHost && hostId && key === hostId && phase !== 'closed') drawClosed('O anfitrião saiu da sala');
    })
    .on('broadcast', { event: 'hello' }, ({ payload }) => {
      if (isHost) send('settings', { settings, playing: game.index >= 0 && game.index < game.questions.length, to: payload.id });
    })
    .on('broadcast', { event: 'settings' }, ({ payload }) => {
      if (isHost) return;
      settings = payload.settings;
      if (phase === 'connecting') {
        phase = 'lobby';
        if (payload.playing) drawConnecting('Jogo em andamento… você entra na próxima pergunta.');
        else drawLobby();
      }
    })
    .on('broadcast', { event: 'lobby' }, ({ payload }) => {
      settings = payload.settings || settings;
      myAnswers = [];
      phase = 'lobby';
      drawLobby();
    })
    .on('broadcast', { event: 'question' }, ({ payload }) => {
      phase = 'question';
      if (payload.i === 0) myAnswers = [];
      drawQuestion({ ...payload, receivedAt: Date.now() });
    })
    .on('broadcast', { event: 'progress' }, ({ payload }) => {
      const el = root.querySelector('[data-count]');
      if (el && current && payload.i === current.i) el.textContent = `${payload.answered} de ${players.size} responderam`;
    })
    .on('broadcast', { event: 'answer' }, ({ payload }) => { if (isHost) hostCollect(payload); })
    .on('broadcast', { event: 'reveal' }, ({ payload }) => {
      phase = 'reveal';
      if (current && current.i === payload.i && myChoice !== null) {
        const ok = myChoice === payload.correct;
        myAnswers.push({ wordId: current.q.wordId, ok });
        store.recordQuizAnswer(current.q.wordId, ok);
      }
      drawReveal(payload);
    })
    .on('broadcast', { event: 'end' }, ({ payload }) => drawEnd(payload))
    .subscribe(async (status) => {
      if (!alive) return;
      if (status === 'SUBSCRIBED') {
        await channel.track({ name: me.name, host: isHost, at: Date.now() });
        if (isHost) { phase = 'lobby'; drawLobby(); }
        else {
          send('hello', { id: me.id });
          // Sem resposta do anfitrião: a sala não existe (ou ele saiu).
          timerId = setTimeout(() => { if (phase === 'connecting') drawClosed('Sala não encontrada. Confira o código.'); }, 6000);
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        drawClosed(navigator.onLine ? 'Não foi possível conectar à sala' : 'Sem internet no momento');
      }
    });

  // ----- Ações do usuário -----

  async function share() {
    const url = roomLink(code);
    const text = `Vem jogar inglês comigo no Hi Family! Sala ${code}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Hi Family', text, url }); return; }
      await navigator.clipboard.writeText(`${text}: ${url}`);
      toast('Convite copiado!');
    } catch (e) { /* usuário cancelou */ }
  }

  function leave() {
    location.hash = '#/sala';
  }

  function onClick(e) {
    if (e.target.closest('[data-leave]')) { leave(); return; }
    if (e.target.closest('[data-share]')) { share(); return; }
    if (e.target.closest('[data-start]')) { hostStart(); return; }
    if (e.target.closest('[data-again]')) { send('lobby', { settings }); return; }
    const say = e.target.closest('[data-say]');
    if (say) { speak(say.dataset.say); return; }
    const opt = e.target.closest('[data-option]');
    if (opt && phase === 'question' && current && myChoice === null) {
      myChoice = Number(opt.dataset.option);
      opt.classList.add('picked');
      root.querySelectorAll('[data-option]').forEach((b) => { b.disabled = true; });
      root.querySelector('.quiz-feedback').innerHTML = '<p class="muted center">Resposta enviada! Aguardando os outros… ⏳</p>';
      send('answer', { i: current.i, id: me.id, name: me.name, choice: myChoice, ms: Date.now() - current.receivedAt });
    }
  }

  function onKey(e) {
    if (phase !== 'question' || myChoice !== null) return;
    if (['1', '2', '3', '4'].includes(e.key)) {
      root.querySelector(`[data-option="${Number(e.key) - 1}"]`)?.click();
    }
  }

  root.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  document.body.classList.add('lesson-mode');
  drawConnecting();

  return () => {
    alive = false;
    clearTimeout(timerId);
    root.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('lesson-mode');
    channel.untrack().catch(() => {});
    client.removeChannel(channel);
  };
}

export function render(root, { code, user }) {
  if (!code) return renderEntry(root);
  return renderRoom(root, code, user);
}
