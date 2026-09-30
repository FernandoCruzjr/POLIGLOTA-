# Hi Family

Aprenda inglês. Conecte-se com o mundo. Plataforma gratuita para a família: lições curtas, áudio, 2.061 palavras com quiz ilustrado, revisão espaçada, ranking e salas de quiz ao vivo.

Site estático (HTML + CSS + JavaScript puro, sem etapa de build), hospedado na Vercel, com login e progresso no mesmo Supabase do Alfa-Alfa, em tabelas separadas (`en_*`).

## Como publicar

1. **Supabase**: SQL Editor → cole `supabase/schema.sql` → Run (uma vez só; pode repetir sem problema).
2. **GitHub**: crie um repositório novo (ex.: `ingles-em-familia`) e envie todos os arquivos desta pasta.
3. **Vercel**: Add New → Project → importe o repositório → Framework "Other" → Deploy. Não precisa configurar build.
4. **Supabase → Authentication → URL Configuration**: em *Redirect URLs*, adicione o endereço novo da Vercel (ex.: `https://ingles-em-familia.vercel.app/**`). Sem isso, os links de confirmação de conta e de "esqueci a senha" voltam para o site errado.

Quem já tem conta no Alfa-Alfa entra com o mesmo e-mail e senha. Contas criadas aqui não ganham acesso ao Alfa-Alfa (lá continua valendo a aprovação manual).

## Estrutura

```
index.html            casca do app: tela de login + navegação
css/app.css           visual (verde, cartões arredondados, mobile primeiro)
js/app.js             inicialização, login e rotas (#/inicio, #/aprender, #/licao/ID, ...)
js/config.js          chaves do Supabase, nome do app, regras de XP
js/auth.js            login, cadastro, recuperação de senha
js/store.js           progresso do aluno: salva no aparelho e sincroniza com o Supabase
js/vocab.js           lê o vocabulário por categoria e faz a busca
js/content.js         lê o curso de data/course.json (trilha, desbloqueio, nível atual)
js/speech.js          áudio grátis pela voz em inglês do aparelho
js/quiz-engine.js     monta as perguntas de múltipla escolha
js/views/*.js         telas: início, aprender (mapa), lição, vocabulário, quiz/revisão, jogar, ranking, sala, perfil, viagem, chefão, loja
js/game.js            mapa de ilhas compartilhado, moedas, baú e festa (estilos em js/game-styles.js)
js/kiko.js            itens da lojinha e o Kiko com acessórios
img/                  mascote, ícone e imagem da tela de login
data/vocab/           categories.json + um arquivo por categoria
tools/check-vocab.mjs confere o banco e atualiza categories.json
tools/story_*.py      histórias ramificadas (gera data/trips/*.json e valida os caminhos)
data/trips/           viagens: index.json + um arquivo por destino
data/course.json      níveis → unidades → lições → itens (en, pt, pron, note, audio opcional)
supabase/schema.sql   tabelas en_* com segurança por usuário (RLS)
```

### Adicionar conteúdo

Edite `data/course.json`. Cada item de lição:

```json
{ "en": "Good morning!", "pt": "Bom dia!", "pron": "gud MÓR-nin", "note": "opcional", "audio": "opcional/arquivo.mp3" }
```

A sílaba forte vai em MAIÚSCULAS. Para abrir um nível novo, preencha `units` dele.

Para palavras, edite `data/vocab/<categoria>.json` (campos: slug, word, translation, pron, example, exampleTranslation, difficulty 1–3, level) e rode `node tools/check-vocab.mjs`: ele aponta erros e atualiza as contagens em `categories.json`. Para uma categoria nova, acrescente-a em `categories.json` e crie o arquivo.

## Fases

- [x] **Fase 1**: dashboard, visual verde, navegação (barra inferior no celular, lateral no computador), trilha com 3 unidades / 10 lições, XP, sequência e meta diária
- [x] **Fase 2**: área de vocabulário com 2.061 palavras em 40 categorias (`data/vocab/*.json`), busca em inglês ou português, estudo por cartões, status por palavra
- [x] **Identidade Hi Family**: nome, paleta, Poppins, ícone, mascote e tela de login
- [x] **Quiz com ícone** (1.682 palavras com emoji; as demais usam o emoji da categoria), revisão espaçada (1, 3, 7 e 21 dias; erro volta em 10 min)
- [x] **Ranking** geral e da semana (função `en_ranking` no schema.sql)
- [x] **Sala de quiz ao vivo** com código de 4 letras (Supabase Realtime, sem tabelas)
- [x] **Viagem ✈️ — Aventura na Tailândia**: 10 capítulos narrados pelo Kiko, com escolhas que ramificam a história, vários finais, dicas culturais, explicações, lacunas, monte a frase, narração em português e animações
- [x] **Mapa de aventura** com ilhas flutuantes, Kiko caminhando, névoa nas ilhas bloqueadas e baú final; **passaporte** com carimbos (dourado de Explorador)
- [x] **Professor Kiko**: plano da aula, quadro-negro, revisão da aula e voz escolhida entre as mais naturais do aparelho (inglês lido com voz inglesa)
- [x] **Novo destino: Aventura em Orlando 🇺🇸** (10 capítulos: imigração, carro alugado, hotel, gorjeta, parque, outlet, farmácia, tempestade/911, posto e volta) e tela de **destinos** (`#/viagem`) com um mapa por país (`#/viagem/<destino>`)
- [x] **Chefão** no fim de cada mapa (7 acertos, 3 corações, 15 s por pergunta), com perguntas tiradas das próprias histórias/lições; o **baú do tesouro** só abre depois dele
- [x] **Moedas 🪙 e Lojinha do Kiko** (`#/loja`): chapéus, óculos e acessórios que aparecem no Kiko em todo o app
- [x] **Aprender virou mapa**: lições como ilhas no céu, placas de unidade, Kiko caminhando e o Dragão das Palavras como chefão do nível
- [x] **Área Kids 🎈** (`#/kids`): 92 palavras com imagem, som, nome e tradução (animais com o som do bicho, cores, números 0–20 e objetos da cozinha, quarto, banheiro e sala), com cartões, jogo "ouça e toque" e jogo da memória. Dados em `data/kids.json` (gerado por `tools/make_kids.py`)
- [x] **Treino de fala 🗣️** (`#/fala`): shadowing e chorusing por situação de viagem, gravação da própria voz para comparar, conferência pelo reconhecimento de voz do navegador (quando existe) e frases-escudo
- [x] **Meu plano 🧭** (`#/plano`): rotina semanal de 30 min ligada às telas do app, micro-hábitos do dia, imersão nos tempos mortos, técnicas de imersão ativa (com pedidos prontos para correção e roleplay com IA), barril de conteúdos, dicas contra a vergonha e estimativa de tempo
- [x] **v0.8**: Treino de fala com **500 frases de turismo** em 10 situações (`data/phrases.json`, gerado de `tools/phrases_src/` por `tools/make_phrases.py`), com subtemas, progresso por frase e "minhas difíceis"; Área Kids com **926 palavras** (bichos, cores, números, cozinha, quarto, banheiro e sala; fontes em `tools/kids_src/`, `tools/make_kids.py` gera números, cores e o `data/kids.json`), com busca, grupos e frase de exemplo traduzida; **Kiko novo**: 11 cores (`tools/make_kiko_skins.py` gera `img/kiko/`), 7 espaços (cor, cabeça, rosto, pescoço, mão, amiguinho, fundo), 70 itens e provador na lojinha
- [x] **v0.9 — Aventura no Japão 🇯🇵**: 16 capítulos (~20 dias: Tóquio, Hakone, Kyoto, Nara, Osaka, Hiroshima/Miyajima e volta), tema sakura e chefão "O Ninja do Trem-Bala". Fontes em `tools/story_japan_part1..4.py`; rode `python3 tools/story_japan.py`
- [x] **v0.10**: Área Kids com 16 áreas e 1.299 palavras (novas: cumprimentos, verbos, emoções, horas, dias, meses, estações, clima, natureza); **dicionário de toque** em todas as falas (`data/dict.json`, fonte `tools/dict_src.json`; `tools/dict_tokens.py` lista as palavras do app); **🐢 devagar** e **🇧🇷 tradução sempre aberta** nas histórias; **"Leia assim"** (pronúncia em português) nas 508 frases; **Frases que se encaixam** (`#/frases`, 8 começos e 126 finais em `tools/patterns_src.json` → `tools/make_patterns.py`); **⭐ favoritas** (`#/favoritas`)
- [ ] **Fase 4**: página de desempenho com gráficos e conquistas (`en_achievement` já criada)
- [ ] **Fase 5**: PWA offline (service worker + sincronização; o armazenamento local já existe)

## Recursos que dependem do Supabase

- **Ranking:** rode de novo o `supabase/schema.sql` inteiro (ele só acrescenta; não apaga nada).
- **Sala ao vivo:** usa o Realtime do Supabase, que já vem ligado. Se em Realtime → Settings estiver marcado para aceitar só canais privados, desmarque.
- **Login com Google (opcional):** crie credenciais OAuth no Google Cloud, ative em Supabase → Authentication → Sign In / Providers → Google, e mude `GOOGLE_LOGIN_ENABLED` para `true` em `js/config.js`. Enquanto estiver `false`, o botão não aparece.

## Escrever histórias de viagem

As histórias ficam em `tools/story_thailand.py`, `tools/story_usa.py` e `tools/story_japan*.py`, numa mini-linguagem simples (`tools/story_dsl.py`):
`N()` narração do Kiko, `T()` fala de outra pessoa, `Y()` sua fala, `TIP()` dica cultural, `EX()` explicação,
`C()` escolha (cada opção `O()` pode levar a outro trecho com `go=`), `G()` lacuna, `B()` monte a frase,
`GO()` salto e `END()` final. Depois de editar, rode `python3 tools/story_thailand.py`: ele recria o JSON e
avisa se algum caminho ficou sem saída ou algum trecho ficou inalcançável.
Marcadores trocados conforme o jogador: `{p}` khrap/ka, `{spouse}` wife/husband, `{She}`, `{sheLow}`, `{herPt}` her/his, `{spousePt}`, `{spousePtCap}`, `{ElaPt}`, `{aPt}`, `{name}`.
Cada destino tem `theme` (ocean, sunset), `route` (texto do início do mapa) e `boss` (nome, emoji, fala). Para um destino novo, copie um desses arquivos, troque o `id`, acrescente o id em `ORDER` no `story_dsl.py` e rode o script.

**Moedas:** ficam na tabela `en_wallet`. Rode de novo o `supabase/schema.sql` para criá-la; até lá as moedas ficam salvas só no aparelho, e o resto sincroniza normalmente.
