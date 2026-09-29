export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatNumber(n) {
  return Number(n || 0).toLocaleString('pt-BR');
}

export function progressBar(fraction, label) {
  const pct = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
  return `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${esc(label)}"><span style="width:${pct}%"></span></div>`;
}

export function ring(fraction, inner, label) {
  const f = Math.max(0, Math.min(1, fraction));
  const r = 26;
  const c = 2 * Math.PI * r;
  return `<div class="ring" role="img" aria-label="${esc(label)}">
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="ring-track"/><circle cx="32" cy="32" r="${r}" class="ring-fill" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - f)).toFixed(1)}"/></svg>
    <span>${inner}</span></div>`;
}

export function relativeTime(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  const days = Math.floor(diff / 86400);
  return days === 1 ? 'ontem' : `há ${days} dias`;
}

export function plural(n, one, many) {
  return `${formatNumber(n)} ${n === 1 ? one : many}`;
}

let toastTimer = null;
export function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}
