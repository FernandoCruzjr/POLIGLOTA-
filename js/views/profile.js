import * as store from '../store.js';
import * as content from '../content.js';
import { signOut } from '../auth.js';
import { icon } from '../icons.js';
import { esc, formatNumber, toast } from '../ui.js';
import { DAILY_GOAL_OPTIONS, APP_VERSION } from '../config.js';
import { listVoices, setVoice, currentVoiceName, previewVoice, canSpeak } from '../speech.js';

export function render(root, { user }) {
  const s = store.get();
  const p = s.profile;
  const initial = (p.name || user.email || '?').trim().charAt(0).toUpperCase();
  const level = content.currentLevel(store.isLessonDone);

  root.innerHTML = `
    <header class="page-head"><h1>Perfil</h1></header>

    <section class="card profile-card">
      <span class="avatar" aria-hidden="true">${esc(initial)}</span>
      <div>
        <p class="profile-name">${esc(p.name || 'Aluno')}</p>
        <p class="muted small">${esc(user.email)}</p>
        <span class="chip chip-green">Nível ${level.number} · ${esc(level.title)}</span>
      </div>
    </section>

    <section class="card" aria-labelledby="settings-title">
      <h2 id="settings-title">Preferências</h2>
      <form class="form" id="profile-form">
        <label for="pf-name">Como quer ser chamado(a)</label>
        <input id="pf-name" name="name" maxlength="40" autocomplete="nickname" value="${esc(p.name)}">
        <label for="pf-goal">Meta diária</label>
        <select id="pf-goal" name="goal">
          ${DAILY_GOAL_OPTIONS.map((m) => `<option value="${m}" ${m === p.dailyGoalMin ? 'selected' : ''}>${m} minutos por dia</option>`).join('')}
        </select>
        <button class="btn btn-primary" type="submit">Salvar</button>
      </form>
    </section>

    <section class="card" aria-labelledby="voice-title">
      <h2 id="voice-title">🎓 Voz do Professor Kiko</h2>
      ${canSpeak() ? `
      <p class="muted small">As vozes vêm do seu aparelho. Já escolhemos a mais natural, mas você pode trocar e testar.</p>
      <div class="form voice-form">
        <label for="voice-pt">Narração em português</label>
        <div class="voice-row"><select id="voice-pt" data-voice="pt"></select><button type="button" class="btn btn-soft" data-test="pt">▶ Testar</button></div>
        <label for="voice-en">Falas em inglês</label>
        <div class="voice-row"><select id="voice-en" data-voice="en"></select><button type="button" class="btn btn-soft" data-test="en">▶ Testar</button></div>
      </div>
      <details class="voice-help">
        <summary>Como deixar a voz ainda mais natural</summary>
        <ul class="tips">
          <li><strong>Computador:</strong> abra o app no navegador <strong>Microsoft Edge</strong> e escolha uma voz com "Natural" no nome (ex.: Francisca, Thalita, Antonio). São as mais parecidas com gente de verdade.</li>
          <li><strong>Android:</strong> em Configurações → Sistema → Idiomas → Saída de texto para fala, use o <strong>Mecanismo de fala do Google</strong> e baixe a voz em português de alta qualidade.</li>
          <li><strong>iPhone:</strong> em Ajustes → Acessibilidade → Conteúdo Falado → Vozes → Português (Brasil), baixe <strong>Luciana (Melhorada)</strong> ou <strong>Felipe (Melhorada)</strong>. Depois escolha aqui.</li>
        </ul>
      </details>` : '<p class="muted">Este navegador não tem voz sintetizada. Tente o Chrome ou o Edge.</p>'}
    </section>

    <section class="card" aria-labelledby="summary-title">
      <h2 id="summary-title">Resumo</h2>
      <dl class="numbers">
        <div><dt>XP total</dt><dd>${formatNumber(p.xp)}</dd></div>
        <div><dt>Sequência</dt><dd>${store.currentStreak()} 🔥</dd></div>
        <div><dt>Minutos estudados</dt><dd>${formatNumber(Math.floor(p.totalSeconds / 60))}</dd></div>
      </dl>
    </section>

    <section class="card" aria-labelledby="pron-title">
      <h2 id="pron-title">Como ler a pronúncia</h2>
      <ul class="tips">
        <li>A sílaba em <strong>MAIÚSCULAS</strong> é a mais forte: <em>ÉR-port</em> (airport).</li>
        <li><strong>th</strong> (como em <em>thank you</em>): encoste a ponta da língua nos dentes de cima e sopre.</li>
        <li><strong>dh</strong> (como em <em>this</em>, <em>mother</em>): mesma posição do th, mas com a voz vibrando.</li>
        <li>O <strong>r</strong> inicial em <em>rê-LOU</em> (hello) representa o "h" do inglês: soa como o "rr" de "carro", bem suave, só um sopro.</li>
        <li>Na dúvida, toque em <strong>Ouvir</strong> ou <strong>Devagar</strong> dentro da lição.</li>
      </ul>
    </section>

    <button class="btn btn-danger-ghost" id="logout">${icon('logout', 18)} Sair da conta</button>
    <p class="muted small center">Versão ${APP_VERSION}</p>
  `;

  root.querySelector('#profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    store.updateProfile({
      name: String(fd.get('name') || '').trim().slice(0, 40),
      dailyGoalMin: Number(fd.get('goal')) || 10,
    });
    toast('Preferências salvas');
    render(root, { user });
  });

  function fillVoices() {
    root.querySelectorAll('[data-voice]').forEach((sel) => {
      const lang = sel.dataset.voice;
      const list = listVoices(lang);
      const current = currentVoiceName(lang);
      sel.innerHTML = list.length
        ? list.map((v, i) => `<option value="${esc(v.voiceURI)}" ${v.name === current ? 'selected' : ''}>${esc(v.name)}${i === 0 ? ' ⭐ recomendada' : ''}</option>`).join('')
        : '<option value="">Voz padrão do aparelho</option>';
    });
  }
  if (canSpeak()) {
    fillVoices();
    speechSynthesis.addEventListener('voiceschanged', fillVoices, { once: true });
    root.querySelectorAll('[data-voice]').forEach((sel) => sel.addEventListener('change', () => {
      setVoice(sel.dataset.voice, sel.value);
      previewVoice(sel.dataset.voice);
    }));
    root.querySelectorAll('[data-test]').forEach((b) => b.addEventListener('click', () => previewVoice(b.dataset.test)));
  }

  root.querySelector('#logout').addEventListener('click', async () => {
    await signOut();
  });
}
