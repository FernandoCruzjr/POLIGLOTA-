// Estilos da Área Kids (cores vivas, botões grandes). Injetados por kids.js.
export default `
.kids { display: grid; gap: 14px; }
.kd-hero { display: flex; align-items: center; gap: 14px; padding: 18px; border-radius: 26px; color: #4A2A00; background: linear-gradient(135deg, #FFE08A, #FFB86B 55%, #FF8FA3); box-shadow: 0 6px 0 rgba(0, 0, 0, .08); }
.kd-hero h1 { font-size: 1.5rem; color: #4A2A00; }
.kd-hero p { font-size: .92rem; }
.kd-kiko { animation: bob 2s ease-in-out infinite; }
.kd-title { font-size: 1.1rem; margin: 4px 0 8px; }
.kd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.kd-cat { display: grid; justify-items: center; gap: 2px; text-decoration: none; color: #2B2B2B; padding: 16px 8px 12px; border-radius: 24px; background: color-mix(in srgb, var(--c) 28%, #fff); border: 3px solid var(--c); box-shadow: 0 5px 0 var(--c); transition: transform .12s; text-align: center; }
.kd-cat:hover { transform: translateY(-2px); }
.kd-cat:active { transform: translateY(4px); box-shadow: 0 1px 0 var(--c); }
.kd-cat-emoji { font-size: 2.8rem; line-height: 1.1; animation: bob 3s ease-in-out infinite; }
.kd-cat strong { font-size: 1.05rem; }
.kd-cat-en { font-size: .82rem; opacity: .75; font-weight: 600; }
.kd-cat-meta { font-size: .75rem; font-weight: 700; background: #fff; border-radius: 999px; padding: 2px 10px; margin-top: 4px; }
.kd-cat-head { display: flex; gap: 12px; align-items: center; padding: 14px 16px; border-radius: 22px; background: color-mix(in srgb, var(--c) 30%, #fff); border: 3px solid var(--c); }
.kd-cat-head h1 { font-size: 1.3rem; }
.kd-cat-head h1 span { font-weight: 500; opacity: .7; }
.kd-tip { background: #FFF7DB; border: 1px dashed #F2C94C; border-radius: 16px; padding: 10px 12px; font-size: .9rem; color: #5E4300; }
.kd-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.kd-actions .btn.on { background: var(--green-50); border-color: var(--green-500); }
.kd-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.kd-card { position: relative; display: grid; justify-items: center; align-content: start; gap: 6px; min-height: 170px; padding: 14px 8px; border-radius: 22px; border: 3px solid color-mix(in srgb, var(--c) 60%, #fff); background: #fff; box-shadow: 0 4px 0 color-mix(in srgb, var(--c) 60%, #fff); font: inherit; color: #222; cursor: pointer; text-align: center; }
.kd-card.seen { border-color: var(--c); }
.kd-card.seen::after { content: '✓'; position: absolute; top: 6px; right: 10px; font-weight: 800; color: var(--green-700); }
.kd-card.open { background: color-mix(in srgb, var(--c) 18%, #fff); box-shadow: 0 4px 0 var(--c), 0 0 0 4px color-mix(in srgb, var(--c) 35%, transparent); }
.kd-card.bounce .kd-emoji, .kd-card.bounce .kd-swatch, .kd-card.bounce .kd-num { animation: kdBounce .5s cubic-bezier(.2, 1.6, .4, 1); }
@keyframes kdBounce { 0% { transform: scale(.7); } 60% { transform: scale(1.2) rotate(-6deg); } 100% { transform: scale(1); } }
.kd-emoji { font-size: 3.6rem; line-height: 1.1; }
.kd-swatch { width: 70px; height: 70px; border-radius: 50%; box-shadow: inset 0 -6px 0 rgba(0, 0, 0, .15), 0 3px 6px rgba(0, 0, 0, .15); }
.kd-swatch.light { border: 2px solid #ddd; }
.kd-num { display: grid; justify-items: center; gap: 4px; }
.kd-num b { font-size: 3rem; line-height: 1; color: #1E63D6; }
.kd-dots { display: flex; flex-wrap: wrap; justify-content: center; gap: 3px; max-width: 100px; }
.kd-dots i { width: 12px; height: 12px; border-radius: 50%; background: #FFC857; box-shadow: inset 0 -2px 0 rgba(0, 0, 0, .15); }
.kd-word { font-size: 1.25rem; font-weight: 700; }
.kd-back { display: none; gap: 2px; font-size: .85rem; }
.kd-card.open .kd-back { display: grid; animation: rise .25s ease; }
.kd-pt { font-weight: 700; color: var(--green-800); }
.kd-say { font-size: .82rem; font-style: italic; margin-top: 4px; }
.kd-saypt { font-size: .78rem; color: var(--muted); }
.kd-more { grid-column: 1 / -1; justify-self: center; }
.kd-search input { width: 100%; min-height: 46px; border-radius: 14px; border: 2px solid var(--border); padding: 8px 14px; font: inherit; }
.kd-groups { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; }
.kd-groups .topic-chip { flex-shrink: 0; border: 2px solid var(--border); background: var(--surface); cursor: pointer; font: inherit; font-weight: 600; }
.kd-groups .topic-chip.on { border-color: var(--green-500); background: var(--green-50); }
.kd-num.long b { font-size: 2rem; }
.kd-stars-row { display: flex; justify-content: center; gap: 6px; font-size: 1rem; color: #D9D9D9; }
.kd-stars-row .on { color: #22C55E; }
.kd-stars-row .now { color: #FFC857; transform: scale(1.4); }
.kd-ask { display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: 22px; background: #FFF7DB; }
.kd-ask > div { display: grid; gap: 8px; justify-items: start; }
.kd-ask-q { font-size: 1.3rem; font-weight: 700; }
.kd-pick { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.kd-opt { display: grid; place-items: center; min-height: 140px; border-radius: 24px; border: 3px solid color-mix(in srgb, var(--c) 60%, #fff); background: #fff; box-shadow: 0 5px 0 color-mix(in srgb, var(--c) 60%, #fff); cursor: pointer; font: inherit; }
.kd-opt:active { transform: translateY(3px); }
.kd-opt .kd-emoji { font-size: 4.2rem; }
.kd-opt.right { background: #E4F8EA; border-color: #22C55E; box-shadow: 0 5px 0 #22C55E; animation: kdBounce .5s ease; }
.kd-opt.wrong { opacity: .4; animation: shakeX .4s ease; }
.kd-feedback { min-height: 1.6em; text-align: center; font-size: 1.1rem; }
.kd-memory { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
@media (min-width: 640px) { .kd-memory { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.kd-mem { position: relative; aspect-ratio: 1 / 1.1; border-radius: 18px; border: 3px solid var(--c); background: var(--c); cursor: pointer; font: inherit; box-shadow: 0 4px 0 rgba(0, 0, 0, .15); transition: transform .3s; }
.kd-mem-back { font-size: 2rem; color: #fff; }
.kd-mem-face { display: none; place-items: center; }
.kd-mem.up { background: #fff; transform: rotateY(180deg); }
.kd-mem.up > * { transform: rotateY(180deg); }
.kd-mem.up .kd-mem-back { display: none; }
.kd-mem.up .kd-mem-face { display: grid; }
.kd-mem .kd-emoji { font-size: 2.6rem; }
.kd-mem .kd-swatch { width: 52px; height: 52px; }
.kd-mem .kd-num b { font-size: 2.2rem; }
.kd-mem-word { font-weight: 700; font-size: 1rem; color: #222; word-break: break-word; }
.kd-mem.match { background: #E4F8EA; border-color: #22C55E; }
.kd-confetti { font-size: 1.6rem; letter-spacing: 6px; overflow: hidden; white-space: nowrap; animation: rise .5s ease; }
.kd-learned { display: grid; gap: 6px; text-align: left; width: 100%; max-width: 360px; }
.kd-learned li { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 6px 10px; }
.kd-learned .kd-emoji { font-size: 1.8rem; }
.kd-learned .kd-swatch { width: 28px; height: 28px; }
.kd-learned .kd-num b { font-size: 1.4rem; }
.kd-media ul { display: grid; gap: 6px; padding-left: 18px; list-style: disc; font-size: .92rem; }
@keyframes shakeX { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
@media (prefers-reduced-motion: reduce) { .kd-cat-emoji, .kd-kiko { animation: none !important; } }
`;
