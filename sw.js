// Service worker do Hi Family: deixa o app inteiro funcionando sem internet.
// - Na instalação, baixa e guarda todos os arquivos do app (lista abaixo).
// - Arquivos do app: tenta a rede (para pegar atualizações) e, se ela falhar
//   ou demorar (internet de navio/satélite), usa a cópia guardada.
// - Imagens: usa a cópia guardada primeiro (quase nunca mudam).
// - Fontes do Google: guarda na primeira vez que carregam.
// - Supabase (login, ranking, sincronização): sempre direto pela rede.
// A lista e a versão são geradas por: python3 tools/make_sw.py

// VERSION-START
const VERSION = 'f95713e2d4';
// VERSION-END
const CACHE = `hf-app-${VERSION}`;
const RUNTIME = 'hf-runtime';
const NETWORK_TIMEOUT_MS = 4000;

// PRECACHE-START
const PRECACHE = [
  "./",
  "css/app.css",
  "data/course.json",
  "data/dict.json",
  "data/kids.json",
  "data/navy.json",
  "data/patterns.json",
  "data/phrases.json",
  "data/trips/index.json",
  "data/trips/japan.json",
  "data/trips/thailand.json",
  "data/trips/usa.json",
  "data/vocab/adjectives.json",
  "data/vocab/adverbs.json",
  "data/vocab/airplane.json",
  "data/vocab/airport.json",
  "data/vocab/animals.json",
  "data/vocab/bank.json",
  "data/vocab/body.json",
  "data/vocab/categories.json",
  "data/vocab/city.json",
  "data/vocab/clothes.json",
  "data/vocab/colors.json",
  "data/vocab/conversation.json",
  "data/vocab/drinks.json",
  "data/vocab/emergencies.json",
  "data/vocab/emotions.json",
  "data/vocab/expressions.json",
  "data/vocab/family.json",
  "data/vocab/food.json",
  "data/vocab/health.json",
  "data/vocab/home.json",
  "data/vocab/hotel.json",
  "data/vocab/internet.json",
  "data/vocab/jobs.json",
  "data/vocab/leisure.json",
  "data/vocab/money.json",
  "data/vocab/nature.json",
  "data/vocab/numbers.json",
  "data/vocab/phrasal-verbs.json",
  "data/vocab/prepositions.json",
  "data/vocab/relationships.json",
  "data/vocab/restaurant.json",
  "data/vocab/school.json",
  "data/vocab/shopping.json",
  "data/vocab/sports.json",
  "data/vocab/technology.json",
  "data/vocab/time.json",
  "data/vocab/transport.json",
  "data/vocab/travel.json",
  "data/vocab/verbs.json",
  "data/vocab/weather.json",
  "data/vocab/work.json",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-128.png",
  "icons/icon-144.png",
  "icons/icon-152.png",
  "icons/icon-192.png",
  "icons/icon-384.png",
  "icons/icon-512-maskable.png",
  "icons/icon-512.png",
  "icons/icon-72.png",
  "icons/icon-96.png",
  "img/app-icon-256.png",
  "img/kiko-prof.png",
  "img/kiko/arcoiris-cap.png",
  "img/kiko/arcoiris.png",
  "img/kiko/azul-cap.png",
  "img/kiko/azul.png",
  "img/kiko/dourado-cap.png",
  "img/kiko/dourado.png",
  "img/kiko/fantasma-cap.png",
  "img/kiko/fantasma.png",
  "img/kiko/laranja-cap.png",
  "img/kiko/laranja.png",
  "img/kiko/noite-cap.png",
  "img/kiko/noite.png",
  "img/kiko/rosa-cap.png",
  "img/kiko/rosa.png",
  "img/kiko/roxo-cap.png",
  "img/kiko/roxo.png",
  "img/kiko/turquesa-cap.png",
  "img/kiko/turquesa.png",
  "img/kiko/verde-cap.png",
  "img/kiko/verde.png",
  "img/kiko/vermelho-cap.png",
  "img/kiko/vermelho.png",
  "img/login-hero.jpg",
  "img/mascot-avatar.png",
  "index.html",
  "js/app.js",
  "js/auth.js",
  "js/config.js",
  "js/content.js",
  "js/favorites.js",
  "js/game-styles.js",
  "js/game.js",
  "js/icons.js",
  "js/kiko.js",
  "js/quiz-engine.js",
  "js/speech.js",
  "js/store.js",
  "js/ui.js",
  "js/vendor/supabase.js",
  "js/views/boss.js",
  "js/views/favs.js",
  "js/views/home.js",
  "js/views/kids-styles.js",
  "js/views/kids.js",
  "js/views/learn.js",
  "js/views/lesson.js",
  "js/views/navy-styles.js",
  "js/views/navy.js",
  "js/views/patterns.js",
  "js/views/plan.js",
  "js/views/play.js",
  "js/views/profile.js",
  "js/views/quiz.js",
  "js/views/ranking.js",
  "js/views/room.js",
  "js/views/shop.js",
  "js/views/soon.js",
  "js/views/speak.js",
  "js/views/trip-styles.js",
  "js/views/trip.js",
  "js/views/vocab.js",
  "js/vocab.js",
  "js/wordtip.js",
  "manifest.json"
];
// PRECACHE-END

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Um arquivo que falhe não impede os outros de ficarem offline.
    await Promise.allSettled(PRECACHE.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('hf-app-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'status') {
    caches.open(CACHE).then((c) => c.keys()).then((keys) => {
      event.source.postMessage({ type: 'status', version: VERSION, cached: keys.length, total: PRECACHE.length });
    });
  }
});

const RUNTIME_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) {
    if (RUNTIME_HOSTS.includes(url.hostname)) event.respondWith(staleWhileRevalidate(req));
    return; // Supabase e outros serviços: sem interferência
  }

  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req, 'index.html'));
    return;
  }
  if (url.pathname.includes('/img/') || url.pathname.includes('/icons/')) {
    event.respondWith(cacheFirst(req));
    return;
  }
  event.respondWith(networkFirst(req));
});

async function fromCache(req, fallbackUrl) {
  const cache = await caches.open(CACHE);
  return (await cache.match(req, { ignoreSearch: true }))
    || (await caches.match(req, { ignoreSearch: true }))
    || (fallbackUrl ? cache.match(fallbackUrl) : undefined);
}

async function networkFirst(req, fallbackUrl) {
  const cache = await caches.open(CACHE);
  const network = fetch(req).then((res) => {
    if (res && res.ok && res.type === 'basic') cache.put(stripSearch(req), res.clone());
    return res;
  });
  const cached = await fromCache(req, fallbackUrl);
  if (!cached) {
    try { return await network; } catch (e) { return offlineResponse(req); }
  }
  // Com cópia guardada: espera a rede só por alguns segundos.
  const timeout = new Promise((resolve) => setTimeout(() => resolve(cached), NETWORK_TIMEOUT_MS));
  try {
    return await Promise.race([network.catch(() => cached), timeout]);
  } catch (e) {
    return cached;
  }
}

async function cacheFirst(req) {
  const cached = await fromCache(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) (await caches.open(CACHE)).put(stripSearch(req), res.clone());
    return res;
  } catch (e) {
    return offlineResponse(req);
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(req);
  const network = fetch(req).then((res) => {
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || network;
}

function stripSearch(req) {
  const url = new URL(req.url);
  url.search = '';
  return url.toString();
}

function offlineResponse(req) {
  const isJson = new URL(req.url).pathname.endsWith('.json');
  return new Response(isJson ? '{"offline":true}' : 'Offline', {
    status: 503,
    headers: { 'Content-Type': isJson ? 'application/json' : 'text/plain; charset=utf-8' },
  });
}
