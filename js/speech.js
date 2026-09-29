// Voz do app, gratuita: usa as vozes instaladas no aparelho (Web Speech API).
// Para soar menos robótico:
//  - escolhe automaticamente a voz mais natural disponível (vozes "Natural"
//    do Edge, Google, Luciana/Felipe do iPhone…), ou a que o aluno escolheu;
//  - fala frase por frase, com pequenas pausas;
//  - na narração em português, os trechos em inglês entre aspas são lidos
//    pela voz inglesa (pronúncia certa em vez de sotaque de leitura).
// Arquivos de áudio gravados (campo "audio") sempre têm prioridade.

const PREF_KEY = 'hf_voice_prefs';
const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;

let prefs = { pt: null, en: null };
try { prefs = { ...prefs, ...JSON.parse(localStorage.getItem(PREF_KEY) || '{}') }; } catch (e) { /* sem armazenamento */ }

let voices = [];
function refresh() {
  if (!hasSpeech) return;
  voices = speechSynthesis.getVoices();
}
if (hasSpeech) {
  refresh();
  speechSynthesis.addEventListener('voiceschanged', refresh);
}

// Quanto maior a nota, mais natural costuma soar a voz.
function score(v, lang) {
  let s = 0;
  const name = v.name.toLowerCase();
  if (/natural|neural/.test(name)) s += 60;
  if (/premium|enhanced|melhorad|aprimorad/.test(name)) s += 45;
  if (/online/.test(name)) s += 25;
  if (/google/.test(name)) s += 30;
  if (lang === 'pt') {
    if (v.lang === 'pt-BR' || v.lang === 'pt_BR') s += 40;
    if (/francisca|thalita|antonio|luciana|felipe|fernanda|vitoria|vitória/.test(name)) s += 20;
  } else {
    if (v.lang === 'en-US' || v.lang === 'en_US') s += 30;
    if (/aria|jenny|guy|ava|andrew|emma|samantha|alex|allison|susan/.test(name)) s += 15;
  }
  if (/compact|espeak/.test(name)) s -= 40;
  if (v.localService === false) s += 5;
  return s;
}

export function listVoices(lang) {
  const prefix = lang === 'pt' ? 'pt' : 'en';
  return voices
    .filter((v) => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith(prefix))
    .sort((a, b) => score(b, lang) - score(a, lang));
}

function voiceFor(lang) {
  const list = listVoices(lang);
  const chosen = prefs[lang] && list.find((v) => v.voiceURI === prefs[lang]);
  return chosen || list[0] || null;
}

export function currentVoiceName(lang) {
  const v = voiceFor(lang);
  return v ? v.name : null;
}

export function setVoice(lang, voiceURI) {
  prefs[lang] = voiceURI || null;
  try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) { /* ignora */ }
}

export function canSpeak() {
  return hasSpeech;
}

// ---------- Fila de falas ----------

let queueId = 0;

export function stopSpeech() {
  queueId += 1;
  if (hasSpeech) speechSynthesis.cancel();
}

function cleanText(text) {
  return String(text)
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

// Quebra em frases (e frases longas em pedaços por vírgula) para dar respiro.
function sentences(text) {
  const parts = text.match(/[^.!?]+[.!?]*|[.!?]+/g) || [text];
  const out = [];
  parts.forEach((p) => {
    const t = p.trim();
    if (!t) return;
    if (t.length > 160) t.split(/(?<=[,;:])\s+/).forEach((c) => c.trim() && out.push(c.trim()));
    else out.push(t);
  });
  return out;
}

function utter(text, lang, { rate, pitch }) {
  const u = new SpeechSynthesisUtterance(text);
  const v = voiceFor(lang);
  u.lang = lang === 'pt' ? 'pt-BR' : 'en-US';
  if (v) u.voice = v;
  u.rate = rate;
  u.pitch = pitch;
  return u;
}

// Fala uma lista de pedaços {text, lang} em sequência. Resolve ao terminar.
function run(chunks, opts) {
  if (!hasSpeech || !chunks.length) return Promise.resolve();
  stopSpeech();
  const id = queueId;
  return new Promise((resolve) => {
    let i = 0;
    const next = () => {
      if (id !== queueId || i >= chunks.length) { resolve(); return; }
      const c = chunks[i];
      i += 1;
      const u = utter(c.text, c.lang, c.lang === 'en' ? opts.en : opts.pt);
      let done = false;
      const go = () => { if (done) return; done = true; setTimeout(next, c.pause ?? 140); };
      u.onend = go;
      u.onerror = go;
      speechSynthesis.speak(u);
      // Alguns navegadores não disparam onend: segurança por tempo.
      setTimeout(go, 1200 + c.text.length * 110);
    };
    next();
  });
}

const DEFAULTS = {
  pt: { rate: 1.0, pitch: 1.05 }, // o professor Kiko: animado, mas calmo
  en: { rate: 0.9, pitch: 1.0 },
};

// Inglês (palavras, falas, exemplos).
export function speak(text, { slow = false, audio = null } = {}) {
  if (audio) {
    stopSpeech();
    const el = new Audio(audio);
    el.playbackRate = slow ? 0.8 : 1;
    el.play().catch(() => speak(text, { slow }));
    return Promise.resolve();
  }
  const t = cleanText(text);
  if (!t) return Promise.resolve();
  const en = { rate: slow ? 0.62 : DEFAULTS.en.rate, pitch: 1 };
  return run([{ text: t, lang: 'en' }], { en, pt: DEFAULTS.pt });
}

// Parece inglês? (só letras latinas sem acento e palavras comuns do inglês)
function looksEnglish(s) {
  if (/[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(s)) return false;
  const words = s.toLowerCase().match(/[a-z']+/g) || [];
  if (!words.length) return false;
  const common = /^(i|you|we|he|she|it|they|the|a|an|is|are|am|to|of|in|on|at|for|with|my|your|here|there|please|thank|thanks|yes|no|not|do|does|can|could|would|what|where|how|much|many|this|that|and|or|go|have|has|take|make|sorry|excuse|me|hello|good|bad|time|day|water|ticket|seat|bag|room|money|change|left|right|each|just|looking|deal|spicy|khrap|ka|sawasdee|khob|khun|mai|phet)$/;
  return words.some((w) => common.test(w)) || words.length === 1;
}

// Narração em português com trechos em inglês lidos pela voz inglesa.
export function speakPt(text, { audio = null } = {}) {
  if (audio) {
    stopSpeech();
    return new Promise((resolve) => {
      const el = new Audio(audio);
      el.onended = resolve;
      el.onerror = () => { speakPt(text).then(resolve); };
      el.play().catch(() => speakPt(text).then(resolve));
    });
  }
  const clean = cleanText(text);
  const chunks = [];
  // Divide por aspas: "..." ou “...”
  const re = /["“”]([^"“”]+)["“”]/g;
  let last = 0;
  let m;
  const pushPt = (s) => sentences(s).forEach((t) => chunks.push({ text: t, lang: 'pt' }));
  while ((m = re.exec(clean))) {
    pushPt(clean.slice(last, m.index));
    const inner = m[1].trim();
    if (looksEnglish(inner)) chunks.push({ text: inner, lang: 'en', pause: 220 });
    else chunks.push({ text: inner, lang: 'pt' });
    last = re.lastIndex;
  }
  pushPt(clean.slice(last));
  return run(chunks.filter((c) => c.text.replace(/[.!?,;:\s]/g, '')), DEFAULTS);
}

// Frase de teste para o seletor de voz no perfil.
export function previewVoice(lang) {
  return lang === 'pt'
    ? speakPt('Olá! Eu sou o professor Kiko. Vamos aprender inglês juntos? Repita comigo: "Nice to meet you!"')
    : speak('Hello! Nice to meet you. How are you today?');
}
