// Meu Plano: rotina de 30 minutos por dia baseada no Natural Method e no
// Comprehensible Input, com micro-hábitos, imersão e dicas contra a vergonha.
import * as store from '../store.js';
import { esc, toast, progressBar } from '../ui.js';
import { kikoHtml } from '../kiko.js';
import '../game.js';

// Cada dia: 3 blocos de 10 minutos (ou um bloco maior no fim de semana).
const WEEK = [
  { d: 'Seg', name: 'Segunda', theme: 'Base + primeira situação', blocks: [
    { min: 10, icon: '📚', title: 'Lição nova', text: 'Faça a próxima ilha do Aprender. Ouça cada frase 2 vezes antes de ler a tradução.', href: '#/aprender', cta: 'Abrir o mapa' },
    { min: 10, icon: '✈️', title: 'História de viagem', text: 'Um capítulo da viagem. Leia as falas em voz alta, mesmo baixinho.', href: '#/viagem', cta: 'Viajar' },
    { min: 10, icon: '🗣️', title: 'Treino de fala: aeroporto', text: 'Shadowing das frases de aeroporto e imigração. Grave e ouça sua voz.', href: '#/fala/aeroporto', cta: 'Treinar' },
  ] },
  { d: 'Ter', name: 'Terça', theme: 'Vocabulário + escuta', blocks: [
    { min: 10, icon: '📖', title: 'Vocabulário de viagem', text: 'Estude 10 palavras de Aeroporto, Hotel ou Transporte.', href: '#/vocabulario', cta: 'Vocabulário' },
    { min: 5, icon: '🔄', title: 'Revisão', text: 'As palavras que você errou voltam aqui. Rapidinho!', href: '#/revisao', cta: 'Revisar' },
    { min: 15, icon: '🎧', title: 'Escuta com vídeo curto', text: 'Um vídeo de viagem do seu barril. Assista com legenda em inglês e pause para repetir 3 frases (shadowing).', href: '#/plano#barril', cta: 'Meu barril' },
  ] },
  { d: 'Qua', name: 'Quarta', theme: 'Área Kids + casa em inglês', blocks: [
    { min: 10, icon: '🎈', title: 'Área Kids', text: 'Cartões e jogo de um cômodo da casa. Depois faça a missão: diga o nome de 3 objetos reais.', href: '#/kids', cta: 'Área Kids' },
    { min: 10, icon: '✈️', title: 'História de viagem', text: 'Próximo capítulo. Tente escolher outra opção num capítulo já feito para ver outro caminho.', href: '#/viagem', cta: 'Viajar' },
    { min: 10, icon: '🗣️', title: 'Treino de fala: hotel', text: 'Check-in, pedir toalha, perguntar o café da manhã.', href: '#/fala/hotel', cta: 'Treinar' },
  ] },
  { d: 'Qui', name: 'Quinta', theme: 'Comida + sentence mining', blocks: [
    { min: 10, icon: '🍔', title: 'Vocabulário de comida', text: 'Palavras de Restaurante, Comida ou Bebidas, com o quiz no final.', href: '#/vocabulario', cta: 'Vocabulário' },
    { min: 10, icon: '⛏️', title: 'Sentence mining', text: 'Num vídeo de culinária ou comida de rua, anote 3 frases úteis inteiras (não palavras soltas). Ex.: "Can I get one of these?"', href: '#/plano#barril', cta: 'Meu barril' },
    { min: 10, icon: '🗣️', title: 'Treino de fala: restaurante', text: 'Pedir mesa, pedir o prato, pedir a conta.', href: '#/fala/restaurante', cta: 'Treinar' },
  ] },
  { d: 'Sex', name: 'Sexta', theme: 'Escrita com correção de IA', blocks: [
    { min: 10, icon: '✈️', title: 'História de viagem', text: 'Um capítulo novo ou o chefão, se já liberou.', href: '#/viagem', cta: 'Viajar' },
    { min: 10, icon: '✍️', title: 'Escrita ativa com IA', text: 'Escreva 5 frases sobre a sua viagem dos sonhos e peça correção (use o modelo de pedido em "Imersão ativa").', href: '#/plano#ativa', cta: 'Ver o modelo' },
    { min: 10, icon: '🗣️', title: 'Treino de fala: informações', text: 'Perguntar caminho, transporte e preços.', href: '#/fala/direcoes', cta: 'Treinar' },
  ] },
  { d: 'Sáb', name: 'Sábado', theme: 'Roleplay e família', blocks: [
    { min: 15, icon: '🎭', title: 'Roleplay de viagem', text: 'Simule uma situação real com a IA (modelo em "Imersão ativa") ou com alguém da família: um é o atendente, o outro o turista.', href: '#/plano#ativa', cta: 'Ver o roleplay' },
    { min: 10, icon: '👥', title: 'Sala de quiz com a família', text: 'Uma partida ao vivo. Rir junto tira a vergonha!', href: '#/sala', cta: 'Abrir sala' },
    { min: 5, icon: '🛡️', title: 'Frases-escudo', text: 'Repita as frases de emergência para quando der branco.', href: '#/fala/escudo/treino', cta: 'Treinar' },
  ] },
  { d: 'Dom', name: 'Domingo', theme: 'Descanso ativo (sem cobrança)', blocks: [
    { min: 20, icon: '🎬', title: 'Documentário de viagem', text: 'Assista por prazer, com legenda em inglês. Não precisa entender tudo: o cérebro está se acostumando com o som.', href: '#/plano#barril', cta: 'Meu barril' },
    { min: 10, icon: '🚑', title: 'Emergências (leve)', text: 'Uma rodada do treino de emergências e farmácia. É o que você mais precisa numa viagem.', href: '#/fala/emergencias', cta: 'Treinar' },
  ] },
];

const HABITS = [
  ['dead', '🎧 Ouvi inglês num tempo morto (carro, louça, fila, academia)'],
  ['self', '🗣️ Falei sozinho 1 minuto em inglês, narrando o que estava fazendo'],
  ['around', '🔎 Pesquisei o nome em inglês de 3 coisas ao meu redor'],
  ['think', '🧠 Pensei 3 frases em inglês sobre o meu dia'],
  ['algo', '📱 Assisti ou curti 1 vídeo em inglês (treinar o algoritmo)'],
  ['plan', '✅ Fiz os 30 minutos do plano de hoje'],
];

const FOLDERS = [
  ['ouvir', '🎧 Ouvir (podcasts para o carro)'],
  ['assistir', '📺 Assistir (vídeos de 5 a 15 min)'],
  ['ler', '📰 Ler (textos curtos e receitas)'],
  ['kids', '🎈 Kids (desenhos e canções)'],
];

const AI_WRITE = `Sou brasileiro, iniciante em inglês. Vou escrever 5 frases. Corrija cada uma, mostre a versão natural que um americano diria e explique os erros em português, de forma simples e gentil. Minhas frases:
1. ...`;
const AI_ROLE = `Vamos fazer um roleplay em inglês para eu treinar para viagens. Você é o recepcionista de um hotel em Orlando e eu sou o hóspede fazendo check-in. Use frases curtas e simples (nível iniciante). Faça uma pergunta de cada vez e espere a minha resposta. Se eu errar, continue a conversa e, no final, me mostre em português as 3 correções mais importantes.`;

const todayIdx = () => (new Date().getDay() + 6) % 7; // segunda = 0
const dayKey = () => `plan.day.${store.today()}`;

function weeksSinceStart() {
  let start = store.getFlag('plan.start', null);
  if (!start) { start = Date.now(); store.setFlag('plan.start', start); }
  return Math.floor((Date.now() - start) / (7 * 86400000));
}

export function render(root) {
  const p = store.get().profile;
  const name = (p.name || 'você').split(' ')[0];
  let sel = todayIdx();
  const week = weeksSinceStart();
  const phase = week < 4 ? 0 : week < 8 ? 1 : 2;

  function dayHtml(i) {
    const day = WEEK[i];
    return `
      <p class="small"><strong>${day.name}:</strong> ${esc(day.theme)}</p>
      ${day.blocks.map((b) => `
        <article class="pl-block">
          <span class="pl-min"><span aria-hidden="true">${b.icon}</span>${b.min} min</span>
          <div><h3>${esc(b.title)}</h3><p class="muted">${esc(b.text)}</p><a class="btn btn-soft" href="${b.href}">${esc(b.cta)} →</a></div>
        </article>`).join('')}`;
  }

  function checklist() {
    const done = new Set(store.getFlag(dayKey(), []));
    return HABITS.map(([k, t]) => `<label class="${done.has(k) ? 'done' : ''}"><input type="checkbox" data-habit="${k}" ${done.has(k) ? 'checked' : ''}> <span>${esc(t)}</span></label>`).join('');
  }

  function barrel() {
    const items = store.getFlag('plan.barrel', []);
    return FOLDERS.map(([f, label]) => {
      const list = items.filter((x) => x.folder === f);
      return `<div><p class="small"><strong>${label}</strong></p>
        <ul class="pl-barrel">${list.length ? list.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.title || x.url)}</a><button type="button" class="icon-btn small-btn" data-del="${esc(x.id)}" aria-label="Remover ${esc(x.title)}">✕</button></li>`).join('') : '<li class="muted small">Vazio. Adicione abaixo.</li>'}</ul></div>`;
    }).join('');
  }

  const doneToday = store.getFlag(dayKey(), []).length;

  root.innerHTML = `
    <section class="pl-hero">
      <div class="map-top-row">${kikoHtml(56)}<span class="chip">Semana ${week + 1}</span></div>
      <h1>O plano de ${esc(name)} 🧭</h1>
      <p>Do zero até se virar com segurança em viagens, com 30 minutos por dia e muito inglês nos "tempos mortos".</p>
      <div class="pl-facts"><span>🌱 Iniciante</span><span>🎯 Falar em viagens sem travar</span><span>⏱️ 30 min/dia</span><span>🍜 Turismo · culinária · história</span></div>
      <div class="pl-phase" aria-label="Fases do plano">
        ${[['Semanas 1–4', 'Destravar', 'ouvir muito, frases prontas, falar sozinho'], ['Semanas 5–8', 'Situações', 'aeroporto, hotel, restaurante, emergências'], ['Semanas 9–12', 'Conversa', 'roleplay, perguntas, improviso']].map(([w, t, d], k) => `<div class="${k === phase ? 'now' : ''}" style="color:${k === phase ? 'var(--green-900)' : '#fff'}"><strong>${t}</strong><span>${w}</span><span style="opacity:.8">${d}</span></div>`).join('')}
      </div>
    </section>

    <section aria-labelledby="pl-week">
      <h2 id="pl-week" class="section-title">📅 Cronograma da semana</h2>
      <div class="pl-tabs" role="tablist" aria-label="Dias da semana">
        ${WEEK.map((d, i) => `<button type="button" class="pl-tab ${i === todayIdx() ? 'today' : ''}" role="tab" aria-selected="${i === sel}" data-day="${i}">${d.d}<small>${d.blocks.reduce((n, b) => n + b.min, 0)} min</small></button>`).join('')}
      </div>
      <div class="pl-day" data-dayview role="tabpanel">${dayHtml(sel)}</div>
    </section>

    <section class="card" aria-labelledby="pl-habits">
      <div class="row-between"><h2 id="pl-habits">✅ Micro-hábitos de hoje</h2><span class="muted small" data-hcount>${doneToday}/${HABITS.length}</span></div>
      <p class="muted small">Pequenas coisas que colocam inglês no seu dia sem tomar tempo. Marcando todas, você ganha 🪙 5.</p>
      <div class="pl-check" data-habits>${checklist()}</div>
    </section>

    <details class="pl-acc" open>
      <summary>🧠 Vergonha de falar e "estou velho para aprender"</summary>
      <div class="pl-body">
        <p><strong>O mito da idade.</strong> Crianças têm vantagem no sotaque, mas adultos aprendem vocabulário e estruturas mais rápido no começo, porque entendem regras, fazem associações e sabem por que estão estudando. O seu objetivo é se comunicar, não soar nativo, e isso se aprende em qualquer idade.</p>
        <p><strong>Sotaque não é erro.</strong> Milhões de pessoas viajam falando inglês com sotaque. O atendente do hotel quer entender você, não te avaliar.</p>
        <ul>
          <li><strong>Escada da coragem:</strong> 1) falar sozinho → 2) gravar a voz no Treino de fala → 3) falar com a IA → 4) jogar com a família → 5) falar com estranhos na viagem.</li>
          <li><strong>Meta mínima ridícula:</strong> nos dias difíceis, faça só 5 minutos. Manter a sequência vale mais que um dia perfeito.</li>
          <li><strong>Troque o pensamento:</strong> em vez de "vou errar", pense "vou testar uma frase". Cada erro mostra o que estudar.</li>
          <li><strong>Frases-escudo:</strong> decore "Sorry, my English is not very good. Can you speak slowly, please?". Com ela, nenhuma conversa te pega desprevenido.</li>
          <li><strong>Comemore:</strong> a primeira vez que pedir um café em inglês numa viagem vale uma foto. Você vai lembrar para sempre.</li>
        </ul>
        <a class="btn btn-soft" href="#/fala/escudo/treino">🛡️ Treinar as frases-escudo</a>
      </div>
    </details>

    <details class="pl-acc">
      <summary>🌊 Como funciona o método (Natural Method + Input)</summary>
      <div class="pl-body">
        <p>A ideia é aprender como aprendemos a língua materna: <strong>primeiro entender, depois falar</strong>. Você ouve e lê muito inglês que consegue entender quase todo (o "input compreensível", um pouquinho acima do seu nível) e a fala vai surgindo naturalmente.</p>
        <ul>
          <li>Prefira <strong>frases inteiras</strong> a palavras soltas: "Can I get the check?" vale mais que "check".</li>
          <li>Use <strong>imagens e contexto</strong> em vez de tradução palavra por palavra (por isso a Área Kids funciona).</li>
          <li>Entender 70% já é suficiente. O resto o contexto ensina.</li>
          <li>O Hi Family já segue isso: histórias com contexto, áudio em tudo e repetição espaçada na Revisão.</li>
        </ul>
      </div>
    </details>

    <details class="pl-acc">
      <summary>⏳ Imersão nos tempos mortos</summary>
      <div class="pl-body">
        <ul class="pl-time">
          <li><strong>Carro / ônibus</strong><span>Podcast para iniciantes (6 Minute English, da BBC) ou o áudio de um vídeo de viagem.</span></li>
          <li><strong>Louça / banho</strong><span>Narre em inglês: "I'm washing the plates. The water is hot."</span></li>
          <li><strong>Fila / espera</strong><span>Revisão do Hi Family (2 minutos) ou um vídeo curto em inglês.</span></li>
          <li><strong>Caminhada</strong><span>Diga o nome das coisas que vê: car, tree, dog, store.</span></li>
          <li><strong>Antes de dormir</strong><span>Um episódio curto de desenho em inglês, com legenda em inglês.</span></li>
        </ul>
        <p><strong>Mude o idioma dos aparelhos</strong> aos poucos: comece pelo YouTube e pela Netflix (idioma do áudio e da legenda), depois o celular inteiro. Você já sabe onde ficam os botões; só vai aprender o nome deles.</p>
        <p><strong>Treine o algoritmo:</strong> pesquise em inglês o que você já gosta ("Bangkok street food", "Orlando travel tips", "history documentary"), curta e salve esses vídeos e siga criadores de viagem que falam inglês. Em uma semana, o feed começa a te entregar inglês sozinho.</p>
      </div>
    </details>

    <details class="pl-acc" id="ativa">
      <summary>🎯 Imersão ativa: técnicas</summary>
      <div class="pl-body">
        <ol>
          <li><strong>Shadowing:</strong> ouça uma frase e repita logo em seguida, imitando a melodia. <a href="#/fala">Treino de fala</a></li>
          <li><strong>Chorusing:</strong> fale junto com o áudio, ao mesmo tempo (botão "Falar junto").</li>
          <li><strong>Sentence mining:</strong> ao assistir algo, anote frases úteis inteiras que você entendeu e usaria numa viagem.</li>
          <li><strong>Flashcards com repetição espaçada:</strong> a <a href="#/revisao">Revisão</a> do app faz isso por você. Para as suas frases garimpadas, o Anki (grátis) é ótimo.</li>
          <li><strong>Interagir com o conteúdo:</strong> num vídeo que você já viu, pause antes da resposta do personagem e responda você. Quando travar, pesquise "como se diz…" e anote.</li>
          <li><strong>Escrita com correção de IA:</strong> copie este pedido e cole numa conversa com o Claude:</li>
        </ol>
        <p class="pl-prompt" data-copytext>${esc(AI_WRITE)}</p>
        <button type="button" class="btn btn-soft" data-copy="write">📋 Copiar pedido de correção</button>
        <p><strong>Roleplay de situação real:</strong> treine a conversa inteira antes de viver ela.</p>
        <p class="pl-prompt">${esc(AI_ROLE)}</p>
        <button type="button" class="btn btn-soft" data-copy="role">📋 Copiar roleplay do hotel</button>
        <p class="muted small">Troque "recepcionista de hotel" por garçom, oficial da imigração, farmacêutico ou motorista de táxi.</p>
      </div>
    </details>

    <details class="pl-acc" id="barril">
      <summary>🛢️ Meu barril de conteúdos</summary>
      <div class="pl-body">
        <p>Escolher o que assistir gasta tempo e energia. Separe tudo antes, com calma, e na hora de estudar é só abrir. Guarde aqui os links que você gostou (ficam salvos neste aparelho).</p>
        <p class="small"><strong>Sugestões para começar</strong> (grátis; procure pelo nome):</p>
        <ul>
          <li><strong>BBC Learning English</strong>: "6 Minute English" e vídeos curtos para iniciantes</li>
          <li><strong>VOA Learning English</strong>: notícias e histórias em inglês lento</li>
          <li><strong>Easy English</strong> (canal Easy Languages): entrevistas na rua com legendas</li>
          <li><strong>Rick Steves' Europe</strong>: documentários de viagem, cultura e história, fala calma e clara</li>
          <li><strong>Mark Wiens</strong>: comida de rua pelo mundo (ótimo para sentence mining de restaurante)</li>
          <li><strong>Language Reactor</strong>: extensão do Chrome que mostra legendas em inglês e português ao mesmo tempo no YouTube e na Netflix</li>
          <li><strong>YouGlish</strong>: digite uma palavra e ouça ela em vídeos reais</li>
        </ul>
        <div data-barrel>${barrel()}</div>
        <form data-barrel-form class="pl-barrel">
          <label>Título <input name="title" placeholder="Ex.: Comida de rua em Bangkok" maxlength="80"></label>
          <label>Link <input name="url" type="url" placeholder="https://…" required></label>
          <label>Pasta <select name="folder">${FOLDERS.map(([f, l]) => `<option value="${f}">${l}</option>`).join('')}</select></label>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </form>
      </div>
    </details>

    <details class="pl-acc">
      <summary>🎈 Área Kids na prática (para adultos também)</summary>
      <div class="pl-body">
        <ul>
          <li><strong>Imagem + som + nome + tradução:</strong> você vê o elefante, ouve o som, ouve "elephant" e só depois vê "elefante". O cérebro liga a palavra direto à imagem, sem passar pelo português.</li>
          <li><strong>Sem pressão:</strong> é brincadeira. Errar no jogo de ouvir e tocar não custa nada, e isso relaxa quem tem vergonha.</li>
          <li><strong>Leve para a casa real:</strong> depois de estudar "Cozinha", vá até a cozinha e aponte: fridge, cup, spoon. Cole post-its com os nomes, se quiser.</li>
          <li><strong>Cante junto:</strong> canções infantis (Super Simple Songs) repetem as mesmas frases muitas vezes, exatamente o que um iniciante precisa.</li>
          <li><strong>Com as crianças:</strong> joguem juntos o jogo da memória. Quem ensina aprende duas vezes.</li>
        </ul>
        <a class="btn btn-soft" href="#/kids">🎈 Abrir a Área Kids</a>
      </div>
    </details>

    <details class="pl-acc">
      <summary>📈 Em quanto tempo chego lá?</summary>
      <div class="pl-body">
        <p>Estimativa realista seguindo o plano (30 minutos ativos por dia + inglês nos tempos mortos, uns 5 dias por semana):</p>
        <ul class="pl-time">
          <li><strong>3 meses</strong><span>Sobrevivência: frases prontas no aeroporto, hotel e restaurante; entender perguntas simples e usar as frases-escudo.</span></li>
          <li><strong>6 a 9 meses</strong><span>Viagem com segurança nas situações comuns (nível A2): pedir informações, resolver problemas simples e conversas curtas sem travar tanto.</span></li>
          <li><strong>12 a 18 meses</strong><span>Conversas mais livres (nível B1): contar como foi o dia, dar opiniões, entender boa parte de um vídeo de viagem.</span></li>
        </ul>
        <p class="muted small">Cada pessoa tem um ritmo. O que mais acelera é a constância (todo dia um pouco) e falar em voz alta desde o começo. Viajar no meio do caminho também acelera muito!</p>
      </div>
    </details>`;

  function onClick(e) {
    const t = e.target.closest('[data-day]');
    if (t) {
      sel = Number(t.dataset.day);
      root.querySelectorAll('[data-day]').forEach((b) => b.setAttribute('aria-selected', String(Number(b.dataset.day) === sel)));
      root.querySelector('[data-dayview]').innerHTML = dayHtml(sel);
      return;
    }
    const c = e.target.closest('[data-copy]');
    if (c) {
      const text = c.dataset.copy === 'write' ? AI_WRITE : AI_ROLE;
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast('Copiado! Cole numa conversa com o Claude.'), () => toast('Selecione o texto e copie.'));
      return;
    }
    const d = e.target.closest('[data-del]');
    if (d) {
      store.setFlag('plan.barrel', store.getFlag('plan.barrel', []).filter((x) => x.id !== d.dataset.del));
      root.querySelector('[data-barrel]').innerHTML = barrel();
    }
    // Links internos com âncora (#/plano#barril): abre e rola até a seção.
    const a = e.target.closest('a[href^="#/plano#"]');
    if (a) {
      e.preventDefault();
      const sec = root.querySelector(`#${a.getAttribute('href').split('#')[2]}`);
      if (sec) { sec.open = true; sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  }

  function onChange(e) {
    const h = e.target.closest('[data-habit]');
    if (!h) return;
    const set = new Set(store.getFlag(dayKey(), []));
    if (h.checked) set.add(h.dataset.habit); else set.delete(h.dataset.habit);
    store.setFlag(dayKey(), [...set]);
    h.closest('label').classList.toggle('done', h.checked);
    root.querySelector('[data-hcount]').textContent = `${set.size}/${HABITS.length}`;
    if (set.size === HABITS.length && !store.hasFlag(`${dayKey()}.paid`)) {
      store.setFlag(`${dayKey()}.paid`);
      store.addCoins(5);
      toast('Todos os micro-hábitos de hoje! +5 🪙');
    }
  }

  function onSubmit(e) {
    const f = e.target.closest('[data-barrel-form]');
    if (!f) return;
    e.preventDefault();
    const url = f.url.value.trim();
    if (!/^https?:\/\//i.test(url)) { toast('Cole um link que comece com https://'); return; }
    const items = store.getFlag('plan.barrel', []);
    items.push({ id: String(Date.now()), title: f.title.value.trim(), url, folder: f.folder.value });
    store.setFlag('plan.barrel', items);
    f.reset();
    root.querySelector('[data-barrel]').innerHTML = barrel();
    toast('Guardado no barril! 🛢️');
  }

  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);
  root.addEventListener('submit', onSubmit);
  return () => {
    root.removeEventListener('click', onClick);
    root.removeEventListener('change', onChange);
    root.removeEventListener('submit', onSubmit);
  };
}

export { WEEK, todayIdx };
