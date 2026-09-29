// Batalha contra o chefão: perguntas rápidas com tempo. Acertar tira vida do
// chefão; errar ou deixar o tempo acabar custa um coração.
import * as store from '../store.js';
import { icon } from '../icons.js';
import { esc, coinReward, toast } from '../ui.js';
import { speak, speakPt, stopSpeech, canSpeak } from '../speech.js';
import { shuffle } from '../quiz-engine.js';
import { kikoHtml } from '../kiko.js';
import { celebrate } from '../game.js';

const HP = 7;
const HEARTS = 3;
const SECONDS = 15;
const REWARD = { winFirst: 50, winRepeat: 15, lose: 3, xpFirst: 30, xpRepeat: 10 };

/*
  opts = {
    title, theme, backHref, doneKey,
    boss: { name, emoji, intro },
    questions: [{ prompt, pt?, context?: { speaker, en }, options: [..], answer, say? }]
  }
*/
export function renderBoss(root, opts) {
  const qs = shuffle(opts.questions).slice(0, HP + HEARTS);
  if (qs.length < HP) { toast('Ainda não há perguntas suficientes para o chefão.'); location.hash = opts.backHref; return null; }
  const firstWin = !store.isLessonDone(opts.doneKey);
  const startedAt = Date.now();
  let hp = HP;
  let hearts = HEARTS;
  let i = 0;
  let right = 0;
  let timer = null;
  let locked = false;
  let alive = true;
  document.body.classList.add('lesson-mode');

  const heartsHtml = () => Array.from({ length: HEARTS }, (_, k) => `<span class="${k < hearts ? '' : 'lost'}">❤️</span>`).join('');

  root.innerHTML = `
    <div class="lesson boss-screen">
      <div class="lesson-top">
        <a class="icon-btn" href="${opts.backHref}" aria-label="Fugir da batalha">${icon('close')}</a>
        <p class="eyebrow grow center">⚔️ ${esc(opts.title)}</p>
      </div>
      <section class="boss-arena ${esc(opts.theme || '')}" aria-label="Arena">
        <div class="boss-row">
          <span class="boss-name">${opts.boss.emoji} ${esc(opts.boss.name)}</span>
          <div class="hp" role="progressbar" aria-label="Vida do chefão" aria-valuemin="0" aria-valuemax="${HP}" aria-valuenow="${hp}" data-hp><span style="width:100%"></span></div>
        </div>
        <div class="boss-figure" data-fig aria-hidden="true">${opts.boss.emoji}</div>
        <p class="boss-say" data-say-box>${esc(opts.boss.intro)}</p>
        <div class="player-row">
          ${kikoHtml(44)}
          <span class="hearts" data-hearts aria-label="${hearts} corações">${heartsHtml()}</span>
        </div>
      </section>
      <div class="card boss-q" data-q aria-live="polite" tabindex="-1">
        <p class="muted">Acerte <strong>${HP}</strong> perguntas antes de perder os ${HEARTS} corações. Você tem <strong>${SECONDS} segundos</strong> em cada uma!</p>
        <button type="button" class="btn btn-primary btn-lg wide" data-fight>⚔️ Lutar!</button>
      </div>
    </div>`;
  const fig = root.querySelector('[data-fig]');
  const qBox = root.querySelector('[data-q]');
  const sayBox = root.querySelector('[data-say-box]');
  speakPt(opts.boss.intro);
  root.querySelector('[data-fight]').focus({ preventScroll: true });

  function fx(cls, emoji) {
    fig.classList.remove('hit', 'attack');
    void fig.offsetWidth;
    fig.classList.add(cls);
    const s = document.createElement('span');
    s.className = 'boss-hitfx';
    s.textContent = emoji;
    fig.parentElement.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }

  function updateBars() {
    const bar = root.querySelector('[data-hp]');
    bar.firstElementChild.style.width = `${(hp / HP) * 100}%`;
    bar.setAttribute('aria-valuenow', String(hp));
    const h = root.querySelector('[data-hearts]');
    h.innerHTML = heartsHtml();
    h.setAttribute('aria-label', `${hearts} corações`);
  }

  function ask() {
    if (!alive) return;
    locked = false;
    const q = qs[i];
    sayBox.textContent = ['Vamos ver se você sabe essa!', 'Rápido, rápido!', 'Hahaha, essa é difícil!', 'Não vai conseguir!', 'Pense bem…'][i % 5];
    qBox.innerHTML = `
      <div class="timer run" style="--t:${SECONDS}s"><span></span></div>
      <p class="boss-prompt">${esc(q.prompt)}${q.pt ? `<span class="pt">${esc(q.pt)}</span>` : ''}</p>
      ${q.context ? `<div class="bubble them"><span class="bubble-name">${esc(q.context.speaker)}</span><p class="bubble-en" lang="en">${esc(q.context.en)}${canSpeak() ? ` <button type="button" class="icon-btn speak-btn small-btn" data-say="${esc(q.context.en.replace('___', '…'))}" aria-label="Ouvir">${icon('speaker', 18)}</button>` : ''}</p></div>` : ''}
      <div class="options single">${shuffle(q.options).map((o) => `
        <button type="button" class="option" data-opt="${esc(o)}" lang="en"><span class="option-text">${esc(o)}</span><span class="option-mark" aria-hidden="true"></span></button>`).join('')}
      </div>`;
    if (q.context) speak(q.context.en.replace('___', ''));
    qBox.focus({ preventScroll: true });
    clearTimeout(timer);
    timer = setTimeout(() => answer(null), SECONDS * 1000);
  }

  function answer(btn) {
    if (locked || !alive) return;
    locked = true;
    clearTimeout(timer);
    const q = qs[i];
    qBox.querySelector('.timer')?.classList.remove('run');
    const ok = btn && btn.dataset.opt === q.answer;
    qBox.querySelectorAll('[data-opt]').forEach((b) => {
      b.disabled = true;
      if (b.dataset.opt === q.answer) { b.classList.add('is-correct'); b.querySelector('.option-mark').textContent = '✓'; }
    });
    if (ok) {
      right += 1;
      hp -= 1;
      fx('hit', ['💥', '⚡', '✨', '💫'][right % 4]);
      sayBox.textContent = ['Ai! Essa doeu!', 'Nãããão!', 'Sorte de principiante…', 'Grrr!'][right % 4];
      speak(q.say || q.answer);
    } else {
      hearts -= 1;
      if (btn) { btn.classList.add('is-wrong'); btn.querySelector('.option-mark').textContent = '✗'; }
      fx('attack', '💢');
      qBox.classList.add('shake');
      setTimeout(() => qBox.classList.remove('shake'), 400);
      sayBox.textContent = btn ? 'Hahaha! Errou!' : 'O tempo acabou! Hahaha!';
    }
    updateBars();
    const wait = ok ? 1100 : 2000;
    setTimeout(() => {
      if (!alive) return;
      if (hp <= 0) return finish(true);
      if (hearts <= 0) return finish(false);
      i += 1;
      if (i >= qs.length) return finish(false);
      ask();
    }, wait);
  }

  function finish(won) {
    stopSpeech();
    const seconds = Math.min(Math.round((Date.now() - startedAt) / 1000), 900);
    let coins;
    let xp;
    if (won) {
      xp = firstWin ? REWARD.xpFirst : REWARD.xpRepeat;
      store.recordLesson({ lessonId: opts.doneKey, title: `Chefão: ${opts.boss.name}`, xp, seconds, score: Math.round((hearts / HEARTS) * 100) });
      coins = store.addCoins(firstWin ? REWARD.winFirst : REWARD.winRepeat);
      fig.classList.add('defeated');
    } else {
      xp = right * 2;
      store.recordQuizSession({ xp, seconds, type: 'boss', ref: opts.doneKey, title: `Chefão: ${opts.boss.name} (${right}/${HP})` });
      coins = store.addCoins(REWARD.lose);
    }
    sayBox.textContent = won ? 'Você venceu… desta vez! 😵' : 'Hahaha! Volte quando estiver pronto!';
    qBox.innerHTML = `
      <div class="done-screen" style="padding:0">
        <div class="burst ${won ? '' : 'soft'}" aria-hidden="true">${won ? '🏆' : '💪'}</div>
        <h1>${won ? 'Chefão derrotado!' : 'Quase lá!'}</h1>
        <p class="muted">${won ? `${esc(opts.boss.name)} foi vencido com ${hearts} ${hearts === 1 ? 'coração' : 'corações'} sobrando.` : `Você acertou ${right} de ${HP}. Revise as histórias e tente de novo!`}</p>
        <div class="reward-row">
          <div class="card reward"><span class="stat-icon bolt">${icon('bolt')}</span><strong>+${xp} XP</strong></div>
          ${coinReward(coins)}
        </div>
        <div class="stack">
          ${won ? `<a class="btn btn-primary btn-lg" href="${opts.backHref}">Voltar ao mapa e abrir o baú 🎁</a>` : `<a class="btn btn-primary btn-lg" href="${location.hash.split('?')[0]}?${Date.now()}">⚔️ Tentar de novo</a>`}
          ${won ? `<a class="btn btn-ghost" href="${location.hash.split('?')[0]}?${Date.now()}">Lutar de novo</a>` : `<a class="btn btn-ghost" href="${opts.backHref}">Voltar ao mapa</a>`}
        </div>
      </div>`;
    qBox.querySelector('.btn').focus({ preventScroll: true });
    if (won && firstWin) {
      setTimeout(() => alive && celebrate({ icon: '🏆', title: 'Troféu conquistado!', text: `Você derrotou ${opts.boss.name}! O baú do tesouro foi liberado.`, reward: `🪙 +${coins}` }), 900);
    }
  }

  function onClick(e) {
    const say = e.target.closest('[data-say]');
    if (say) { speak(say.dataset.say); return; }
    if (e.target.closest('[data-fight]')) { stopSpeech(); ask(); return; }
    const b = e.target.closest('[data-opt]');
    if (b && !b.disabled) answer(b);
  }
  root.addEventListener('click', onClick);
  return () => {
    alive = false;
    clearTimeout(timer);
    root.removeEventListener('click', onClick);
    document.body.classList.remove('lesson-mode');
    document.querySelector('.modal-backdrop')?.remove();
    stopSpeech();
  };
}
