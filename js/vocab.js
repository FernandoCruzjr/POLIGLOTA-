// Banco de vocabulário: data/vocab/categories.json + um arquivo por categoria.
// Cada arquivo só é baixado quando a categoria é aberta (ou quando a busca precisa).
let categories = null;
const cache = new Map();

export async function loadCategories() {
  if (categories) return categories;
  const res = await fetch('data/vocab/categories.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Não foi possível carregar as categorias.');
  categories = (await res.json()).categories;
  return categories;
}

export const getCategories = () => categories || [];

export function findCategory(id) {
  return getCategories().find((c) => c.id === id) || null;
}

export async function loadCategory(id) {
  if (cache.has(id)) return cache.get(id);
  const promise = fetch(`data/vocab/${id}.json`)
    .then((r) => {
      if (!r.ok) throw new Error('Categoria não encontrada.');
      return r.json();
    })
    .then((words) => words.map((w) => ({ ...w, id: `${id}.${w.slug}`, category: id })))
    .catch((e) => {
      cache.delete(id);
      throw e;
    });
  cache.set(id, promise);
  return promise;
}

export async function loadAll() {
  const cats = await loadCategories();
  const lists = await Promise.all(cats.map((c) => loadCategory(c.id)));
  return lists.flat();
}

// Ids de todas as palavras de uma categoria sem baixar o arquivo
// (categories.json guarda a lista de slugs gerada pelo tools/check-vocab.mjs).
export function wordIdsOf(category) {
  return (category.slugs || []).map((s) => `${category.id}.${s}`);
}

export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function search(query, limit = 30) {
  const q = normalize(query);
  if (q.length < 2) return [];
  const words = await loadAll();
  const scored = [];
  words.forEach((w) => {
    const en = normalize(w.word);
    const pt = normalize(w.translation);
    let score = 0;
    if (en === q || pt === q) score = 4;
    else if (en.startsWith(q) || pt.startsWith(q)) score = 3;
    else if (en.split(' ').some((p) => p.startsWith(q)) || pt.split(' ').some((p) => p.startsWith(q))) score = 2;
    else if (en.includes(q) || pt.includes(q)) score = 1;
    if (score) scored.push({ w, score });
  });
  scored.sort((a, b) => b.score - a.score || a.w.word.length - b.w.word.length);
  return scored.slice(0, limit).map((s) => s.w);
}
