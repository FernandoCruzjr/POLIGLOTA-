# Inglês em Família

Plataforma gratuita para aprender inglês: lições curtas, áudio, XP, sequência diária e (nas próximas fases) vocabulário com cerca de 2.000 palavras e revisão espaçada.

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
js/views/*.js         telas: início, aprender, lição, perfil, vocabulário/revisão (em construção)
data/vocab/           categories.json + um arquivo por categoria
tools/check-vocab.mjs confere o banco e atualiza categories.json
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
- [ ] **Fase 3**: exercícios, domínio 0–4 por palavra, revisão espaçada (tabela `en_word_progress` já criada)
- [ ] **Fase 4**: página de desempenho com gráficos e conquistas (`en_achievement` já criada)
- [ ] **Fase 5**: PWA offline (service worker + sincronização; o armazenamento local já existe)
