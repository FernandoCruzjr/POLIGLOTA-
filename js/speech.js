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
