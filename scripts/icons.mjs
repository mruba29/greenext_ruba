// Minimal set of original, generic line icons (24x24, stroke-based). No external icon libraries.
const svg = (paths, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${paths}</svg>`;

export const icons = {
  server: svg('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r="0.9" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r="0.9" fill="currentColor" stroke="none"/>'),
  database: svg('<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.66 3.58 3 8 3s8-1.34 8-3v-13"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>'),
  bolt: svg('<path d="M12.5 2 4 14h6l-1 8 8.5-12H12l1-8z"/>'),
  cpu: svg('<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'),
  network: svg('<circle cx="12" cy="4" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 6v5m0 0-6 5m6-5 6 5"/>'),
  heart: svg('<path d="M12 20s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 11c-2.5 4.65-9.5 9-9.5 9z"/>'),
  bank: svg('<path d="M3 10h18M5 10v9M19 10v9M9 10v9M15 10v9M2 19h20M12 3 2 8h20L12 3z"/>'),
  factory: svg('<path d="M3 21V10l6 4v-4l6 4V6l6 4v11z"/><path d="M3 21h18"/>'),
  chip: svg('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>'),
  landmark: svg('<path d="M3 21h18M4 10h16M12 3l9 5H3l9-5zM6 10v8M10 10v8M14 10v8M18 10v8"/>'),
  pin: svg('<path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/>'),
  shield: svg('<path d="M12 3l8 3v6c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V6l8-3z"/>'),
  spark: svg('<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>'),
  building: svg('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/>'),
  briefcase: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>'),
  arrowRight: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  graduation: svg('<path d="M2 9 12 4l10 5-10 5-10-5z"/><path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/><path d="M22 9v6"/>'),
  cart: svg('<circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none"/><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"/>'),
  leaf: svg('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>'),
  tree: svg('<path d="M12 22v-6"/><path d="M12 16a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="m8 16 4-3 4 3"/>'),
  wind: svg('<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'),
  checkCircle: svg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
  trendingUp: svg('<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'),
  bot: svg('<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>'),
  layers: svg('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'),
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1s-.8 1-.9 1.2c-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.3.9.9-3.2-.2-.3a8.2 8.2 0 1 1 7.3 4z"/></svg>`,
  brandLeaf: `<svg class="gn-leaf-svg" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="GreenNext Logo Leaf"><defs><linearGradient id="gn-leaf-grad" x1="4" y1="32" x2="32" y2="4" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#00FF66"/><stop offset="100%" stop-color="#39FF14"/></linearGradient><filter id="gn-leaf-glow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0" stdDeviation="1.8" flood-color="#00FF66" flood-opacity="0.7"/></filter></defs><path d="M7 29 C4.5 21 6.5 12 13 6 C18 1.5 25 1.5 31 3 C31.5 9 31.5 16 26.5 22.5 C20.5 29 13.5 30.5 7 29 Z" fill="rgba(0, 255, 102, 0.10)" stroke="url(#gn-leaf-grad)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" filter="url(#gn-leaf-glow)"/><path d="M7 29 C12 25 18 19 24.5 10" stroke="url(#gn-leaf-grad)" stroke-width="1.8" stroke-linecap="round" filter="url(#gn-leaf-glow)"/><path d="M18 17 L25.5 14" stroke="#00FF66" stroke-width="1.4" stroke-linecap="round"/><circle cx="25.5" cy="14" r="1.4" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/><path d="M14 21 L8.5 18" stroke="#00FF66" stroke-width="1.4" stroke-linecap="round"/><circle cx="8.5" cy="18" r="1.4" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/><path d="M10.5 25.5 L17 24.5" stroke="#00FF66" stroke-width="1.3" stroke-linecap="round"/><circle cx="17" cy="24.5" r="1.2" fill="#FFFFFF" stroke="#00FF66" stroke-width="0.8"/><circle cx="31" cy="3" r="1.4" fill="#FFFFFF" stroke="#39FF14" stroke-width="0.8"/><path d="M7 29 C5 31.5 3.5 33 2.5 34" stroke="url(#gn-leaf-grad)" stroke-width="1.8" stroke-linecap="round"/></svg>`,
};

export function icon(name, cls = '') {
  return `<span class="icon-wrap${cls ? ' ' + cls : ''}">${icons[name] || icons.spark}</span>`;
}
