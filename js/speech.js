// Áudio gratuito: usa a voz em inglês do próprio aparelho (Web Speech API).
// Quando houver arquivos de áudio gravados, basta preencher "audio" no item
// do JSON que o arquivo tem prioridade sobre a voz sintetizada.
let voice = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  voice =
    voices.find((v) => v.lang === 'en-US' && /google|samantha|natural/i.test(v.name)) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang && v.lang.startsWith('en')) ||
    null;
}

if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.addEventListener('voiceschanged', pickVoice);
}

export function canSpeak() {
  return 'speechSynthesis' in window;
}

export function speak(text, { slow = false, audio = null } = {}) {
  if (audio) {
    const el = new Audio(audio);
    el.playbackRate = slow ? 0.75 : 1;
    el.play().catch(() => speak(text, { slow }));
    return;
  }
  if (!canSpeak()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  if (voice) u.voice = voice;
  u.rate = slow ? 0.6 : 0.9;
  speechSynthesis.speak(u);
}

// Narração em português (voz do aparelho). Devolve uma Promise que resolve
// quando a fala termina, para a história poder esperar o narrador.
let ptVoice = null;
function pickPtVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  ptVoice = voices.find((v) => v.lang === 'pt-BR') || voices.find((v) => v.lang && v.lang.startsWith('pt')) || null;
}
if ('speechSynthesis' in window) {
  pickPtVoice();
  speechSynthesis.addEventListener('voiceschanged', pickPtVoice);
}

export function speakPt(text) {
  return new Promise((resolve) => {
    if (!canSpeak()) { resolve(); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''));
    u.lang = 'pt-BR';
    if (ptVoice) u.voice = ptVoice;
    u.rate = 1.02;
    u.onend = resolve;
    u.onerror = resolve;
    speechSynthesis.speak(u);
  });
}

export function stopSpeech() {
  if (canSpeak()) speechSynthesis.cancel();
}
