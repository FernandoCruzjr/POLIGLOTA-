// Minhas favoritas: as frases que você marcou com ⭐ em qualquer parte do app.
import { icon } from '../icons.js';
import { esc } from '../ui.js';
import { speak, stopSpeech } from '../speech.js';
import { favList, favBtn } from '../favorites.js';
import { wordify } from '../wordtip.js';
import '../game.js';

export function render(root) {
  function draw() {
    const list = favList();
    const groups = [...new Set(list.map((f) => f.src || 'Outras'))];
    root.innerHTML = `
      <a class="back-link" href="#/fala">${icon('back', 18)} Treino de fala</a>
      <header class="page-head">
        <h1>⭐ Minhas favoritas</h1>
        <p class="muted">${list.length ? `${list.length} ${list.length === 1 ? 'frase guardada' : 'frases guardadas'}. Toque na estrela para tirar.` : 'Nenhuma frase ainda.'}</p>
      </header>
      ${list.length ? `<a class="btn btn-primary btn-lg" href="#/fala/favoritas/treino">🗣️ Treinar as favoritas</a>` : `
      <section class="card empty">
        <p>Toque na estrelinha <strong>☆</strong> ao lado de qualquer frase (nas histórias de viagem, no Treino de fala e nas frases que se encaixam) para guardar aqui as que você mais gostou.</p>
        <a class="btn btn-soft" href="#/fala">Ir para o Treino de fala</a>
      </section>`}
      ${groups.map((g) => `
        <section class="card sp-sub">
          <h2>${esc(g)}</h2>
          <ul class="sp-list">${list.filter((f) => (f.src || 'Outras') === g).map((f) => `<li>
            <button type="button" class="icon-btn speak-btn small-btn" data-say="${esc(f.en)}" aria-label="Ouvir">${icon('speaker', 18)}</button>
            <span><strong lang="en">${wordify(f.en)}</strong>${f.pron ? `<br><span class="sp-pron-s">🗣️ ${esc(f.pron)}</span>` : ''}${f.pt ? `<br><span class="muted">${esc(f.pt)}</span>` : ''}</span>
            <span class="row-btns"><button type="button" class="icon-btn speak-btn small-btn" data-slow="${esc(f.en)}" aria-label="Ouvir devagar">🐢</button>${favBtn(f)}</span>
          </li>`).join('')}</ul>
        </section>`).join('')}`;
  }
  function onClick(e) {
    const s = e.target.closest('[data-say]');
    if (s) { speak(s.dataset.say); return; }
    const sl = e.target.closest('[data-slow]');
    if (sl) { speak(sl.dataset.slow, { slow: true }); return; }
  }
  const onFav = () => setTimeout(draw, 30);
  draw();
  root.addEventListener('click', onClick);
  document.addEventListener('hf-fav-change', onFav);
  return () => { root.removeEventListener('click', onClick); document.removeEventListener('hf-fav-change', onFav); stopSpeech(); };
}
