// Confere o banco de vocabulário e atualiza data/vocab/categories.json.
// Uso (na pasta do projeto):  node tools/check-vocab.mjs
//
// Verifica: campos obrigatórios, dificuldade 1–3, slugs repetidos na mesma
// categoria, palavras repetidas entre categorias e exemplo que não contém a palavra.
// Depois grava em categories.json a contagem e a lista de slugs de cada categoria
// (usadas para mostrar o progresso sem baixar todos os arquivos).
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = new URL('../data/vocab/', import.meta.url);
const REQUIRED = ['slug', 'word', 'translation', 'pron', 'example', 'exampleTranslation', 'difficulty', 'level'];

const catFile = new URL('categories.json', DIR);
const meta = JSON.parse(readFileSync(catFile, 'utf8'));
const seenWord = new Map();
const errors = [];
const warnings = [];
let total = 0;

const stem = (s) => s.toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(Boolean);

for (const cat of meta.categories) {
  let words;
  try {
    words = JSON.parse(readFileSync(new URL(`${cat.id}.json`, DIR), 'utf8'));
  } catch (e) {
    errors.push(`${cat.id}: arquivo ausente ou JSON inválido (${e.message})`);
    continue;
  }
  const slugs = new Set();
  words.forEach((w, i) => {
    const where = `${cat.id}[${i}] "${w.word}"`;
    REQUIRED.forEach((k) => { if (w[k] === undefined || w[k] === '') errors.push(`${where}: falta "${k}"`); });
    if (![1, 2, 3].includes(w.difficulty)) errors.push(`${where}: dificuldade deve ser 1, 2 ou 3`);
    if (slugs.has(w.slug)) errors.push(`${where}: slug repetido "${w.slug}"`);
    slugs.add(w.slug);
    const key = w.word.toLowerCase();
    if (seenWord.has(key)) warnings.push(`"${w.word}" aparece em ${seenWord.get(key)} e ${cat.id}`);
    else seenWord.set(key, cat.id);
    const ex = stem(w.example).join(' ');
    const first = stem(w.word)[0] || '';
    if (first.length > 2 && !ex.includes(first.slice(0, Math.max(3, first.length - 2)))) {
      warnings.push(`${where}: o exemplo não parece usar a palavra`);
    }
  });
  cat.count = words.length;
  cat.slugs = words.map((w) => w.slug);
  total += words.length;
}

meta.total = total;
writeFileSync(catFile, JSON.stringify(meta, null, 1) + '\n');

console.log(`${meta.categories.length} categorias, ${total} palavras.`);
warnings.forEach((w) => console.log('aviso:', w));
errors.forEach((e) => console.log('ERRO:', e));
process.exit(errors.length ? 1 : 0);
