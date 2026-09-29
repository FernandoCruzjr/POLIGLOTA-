// Monta perguntas de múltipla escolha a partir do banco de vocabulário.
// Usado pelo quiz solo, pela revisão e pela sala multiplayer.
import * as vocab from './vocab.js';

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function iconFor(word) {
  if (word.emoji) return word.emoji;
  const cat = vocab.findCategory(word.category);
  return cat ? cat.emoji : '💬';
}

// Tradução "limpa" para comparar opções parecidas (ignora parênteses e acentos).
function key(text) {
  return vocab.normalize(String(text).replace(/\(.*?\)/g, ''));
}

// direction: 'en-pt' mostra a palavra em inglês e pede a tradução;
// 'pt-en' mostra o português e pede a palavra em inglês.
export function buildQuestion(word, pool, direction) {
  const field = direction === 'en-pt' ? 'translation' : 'word';
  const correctKey = key(word[field]);
  const used = new Set([correctKey]);
  const distractors = [];
  for (const w of shuffle(pool)) {
    if (w.id === word.id) continue;
    const k = key(w[field]);
    if (!k || used.has(k)) continue;
    used.add(k);
    distractors.push(w[field]);
    if (distractors.length === 3) break;
  }
  const options = shuffle([word[field], ...distractors]);
  return {
    wordId: word.id,
    direction,
    icon: iconFor(word),
    prompt: direction === 'en-pt' ? word.word : word.translation,
    speakText: word.word,
    options,
    correct: options.indexOf(word[field]),
    answerText: word[field],
  };
}

// Alterna os dois sentidos, começando pelo mais fácil (inglês → português).
// As opções erradas vêm, de preferência, da mesma categoria da palavra.
export function buildQuiz(words, pool, count = 10) {
  const base = pool.length >= 4 ? pool : words;
  return words.slice(0, count).map((w, i) => {
    const sameCat = base.filter((p) => p.category === w.category);
    return buildQuestion(w, sameCat.length >= 4 ? sameCat : base, i % 3 === 2 ? 'pt-en' : 'en-pt');
  });
}

export async function wordsByIds(ids) {
  const byCat = new Map();
  ids.forEach((id) => {
    const cat = id.split('.')[0];
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(id);
  });
  const found = [];
  await Promise.all([...byCat.keys()].map(async (cat) => {
    try {
      const words = await vocab.loadCategory(cat);
      const wanted = new Set(byCat.get(cat));
      words.forEach((w) => { if (wanted.has(w.id)) found.push(w); });
    } catch (e) { /* categoria removida: ignora */ }
  }));
  const order = new Map(ids.map((id, i) => [id, i]));
  return found.sort((a, b) => order.get(a.id) - order.get(b.id));
}

// Sorteia palavras de várias categorias (modo "Misturado" e sala multiplayer).
export async function randomWords(count, categoryIds) {
  const cats = categoryIds && categoryIds.length ? categoryIds : vocab.getCategories().map((c) => c.id);
  const picked = shuffle(cats).slice(0, Math.min(cats.length, 6));
  const lists = await Promise.all(picked.map((c) => vocab.loadCategory(c)));
  const all = lists.flat();
  return { words: shuffle(all).slice(0, count), pool: all };
}
