// Ícones SVG simples (traço), herdam a cor do texto via currentColor.
const paths = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
  learn: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 12h5"/>',
  vocab: '<rect x="3" y="4" width="13" height="16" rx="2.5"/><path d="M8 4v-.5A1.5 1.5 0 0 1 9.5 2H19a2 2 0 0 1 2 2v13.5a1.5 1.5 0 0 1-1.5 1.5H16"/><path d="M7 9h5M7 13h4"/>',
  review: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  flame: '<path d="M12 22c4 0 7-2.8 7-7 0-3.5-2.2-6-4.3-8.2-.5 2.3-1.8 3.7-3.2 4.2.4-3.4-1-6.6-3.5-9C8 5.4 5 9 5 15c0 4.2 3 7 7 7z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  turtle: '<path d="M4 15c0-4 3.6-7 8-7s8 3 8 7H4z"/><path d="M20 15h1.5a1.5 1.5 0 0 0 0-3H20"/><path d="M6 15v3M18 15v3M9 8.5 12 15l3-6.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
};

export function icon(name, size = 22, extraClass = '') {
  return `<svg class="icon ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || ''}</svg>`;
}

export const LOGO_SVG = `<svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" focusable="false"><rect width="64" height="64" rx="16" fill="#15803d"/><path d="M16 20a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H30l-8 7v-7h0a6 6 0 0 1-6-6z" fill="#fff"/><path d="M24 21v10M32 21v10M24 26h8M39 25.5V31" fill="none" stroke="#15803d" stroke-width="3" stroke-linecap="round"/><circle cx="39" cy="21.3" r="1.8" fill="#15803d"/></svg>`;
