// Estilos da Viagem (mapa, história, passaporte). Ficam junto do código para
// o mapa nunca aparecer sem estilo, mesmo se o navegador guardar um app.css antigo.
export default `
/* ---------- Viagem ---------- */
.home-avatar-link { border-radius: 50%; flex-shrink: 0; }
.trip-hero { display: flex; align-items: center; gap: 14px; text-decoration: none; padding: 16px; background: linear-gradient(135deg, #FFF7E0, #FFFFFF 60%); border-color: #F5E2A8; }
.trip-hero-text { flex: 1; min-width: 0; display: grid; gap: 4px; }
.trip-hero-text strong { font-size: 1.1rem; }
.trip-hero .bar { height: 8px; margin-top: 2px; }
.trip-flag { font-size: 2.6rem; line-height: 1; width: 64px; height: 64px; display: grid; place-items: center; border-radius: 18px; background: #fff; box-shadow: var(--shadow); flex-shrink: 0; }
.trip-card { display: grid; gap: 12px; }
.trip-head { display: flex; gap: 14px; align-items: center; }
.trip-head > div { display: grid; gap: 4px; min-width: 0; }
.trip-path .node span { font-size: 1.2rem; }
.soon-trips { display: grid; gap: 6px; }
.grow { flex: 1; min-width: 0; }
.story { gap: 12px; }
.chat { display: grid; gap: 10px; padding-bottom: 6px; }
.narration { display: flex; gap: 10px; align-items: flex-start; background: var(--green-50); border: 1px dashed var(--green-200); border-radius: 16px; padding: 10px 12px; font-size: .95rem; animation: rise .25s ease; }
.narration img { border-radius: 50%; flex-shrink: 0; }
.bubble { max-width: 88%; padding: 10px 14px 8px; border-radius: 18px; animation: rise .25s ease; box-shadow: var(--shadow); }
.bubble.them { justify-self: start; background: var(--surface); border: 1px solid var(--border); border-bottom-left-radius: 6px; }
.bubble.you { justify-self: end; background: var(--green-700); color: #fff; border-bottom-right-radius: 6px; }
.bubble-name { display: block; font-size: .75rem; font-weight: 600; opacity: .75; margin-bottom: 2px; }
.bubble-en { font-size: 1.08rem; font-weight: 600; line-height: 1.4; }
.bubble-en .speak-btn { display: inline-grid; vertical-align: middle; }
.small-btn { width: 32px; height: 32px; }
.bubble.you .speak-btn { background: rgba(255, 255, 255, .18); color: #fff; }
.bubble-pt summary { cursor: pointer; font-size: .78rem; font-weight: 600; opacity: .75; padding: 2px 0; }
.bubble-pt p { font-size: .9rem; opacity: .9; padding-top: 2px; }
.blank { display: inline-block; min-width: 70px; border-bottom: 3px solid var(--accent); color: var(--accent-ink); text-align: center; }
.blank.filled { border-color: var(--green-500); color: var(--green-800); background: var(--green-50); border-radius: 6px 6px 0 0; padding: 0 4px; }
.dock { position: sticky; bottom: 0; background: var(--surface); border: 1px solid var(--border); border-radius: 22px 22px 0 0; padding: 14px 14px calc(14px + env(safe-area-inset-bottom)); box-shadow: 0 -8px 24px rgba(11, 61, 46, .08); display: grid; gap: 12px; margin: 0 -4px; }
.dock.standalone { position: static; border-radius: var(--radius); margin: 0; }
.build-wrap { display: grid; gap: 12px; }
.dock-prompt { font-weight: 600; }
.dock-feedback:empty { display: none; }
.options.single { grid-template-columns: minmax(0, 1fr) !important; }
.options.single .option { min-height: 52px; font-size: 1rem; }
.tiles { display: flex; flex-wrap: wrap; gap: 8px; }
.tile { min-height: 44px; padding: 8px 14px; border-radius: 12px; border: 2px solid var(--border); background: var(--surface); font: inherit; font-weight: 600; color: var(--text); cursor: pointer; box-shadow: 0 3px 0 var(--border); }
.tile:hover:not(:disabled) { border-color: var(--green-500); }
.tile.used { opacity: .25; box-shadow: none; }
.tile.big { font-size: 1.05rem; }
.tile.wrong { border-color: var(--danger); color: var(--danger); text-decoration: line-through; box-shadow: none; }
.tile.in-answer { background: var(--green-50); border-color: var(--green-200); box-shadow: none; }
.build-answer { min-height: 56px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 8px; border-radius: 14px; border: 2px dashed var(--green-200); background: #FBFEFC; }
.dock-actions { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 10px; }
.btn.wide { width: 100%; }
.trip-finish { font-weight: 700; color: var(--green-800); }

/* ---------- História animada ---------- */
.scene { position: relative; height: 96px; border-radius: 20px; overflow: hidden; flex-shrink: 0; }
.scene.big { height: 120px; margin: -2px 0 2px; }
.sky-day { background: linear-gradient(180deg, #BFE7FB 0%, #E6F7FD 70%); }
.sky-dusk { background: linear-gradient(180deg, #FFB88A 0%, #FFE2B8 60%, #FFF4DE 100%); }
.sky-night { background: linear-gradient(180deg, #1B2A55 0%, #3B3F7A 70%, #5B4C86 100%); }
.sky-sea { background: linear-gradient(180deg, #BFE7FB 0%, #DDF6FF 55%, #3CC4D6 56%, #1FA3C1 100%); }
.scene-ground { position: absolute; left: 0; right: 0; bottom: 0; height: 16px; background: linear-gradient(180deg, #9ED9A8, #6CC07D); }
.sky-sea .scene-ground, .sky-night .scene-ground { display: none; }
.sky-night::after { content: '✦ · ✧ ·  ✦   · ✧'; position: absolute; top: 10px; left: 14px; right: 14px; color: #FFF6C8; letter-spacing: 14px; font-size: .7rem; opacity: .8; animation: twinkle 2.4s ease-in-out infinite; }
.scene-cloud { position: absolute; font-size: 1.6rem; opacity: .85; animation: cloud 26s linear infinite; }
.scene-cloud.c1 { top: 6px; left: -20%; }
.scene-cloud.c2 { top: 26px; left: -40%; font-size: 1.1rem; animation-duration: 34s; animation-delay: -12s; }
.sky-night .scene-cloud { opacity: .25; }
.scene-item { position: absolute; font-size: 2.3rem; line-height: 1; bottom: 14px; }
.scene-item.pos-0 { left: 12%; }
.scene-item.pos-1 { left: 45%; }
.scene-item.pos-2 { left: 76%; }
.anim-fly { bottom: auto; top: 18px; animation: fly 9s linear infinite; }
.anim-drive { animation: drive 7s linear infinite; }
.anim-walk { animation: drive 14s linear infinite; }
.anim-swim { bottom: 6px; animation: swim 8s ease-in-out infinite; }
.anim-wave { bottom: 2px; animation: wave 3s ease-in-out infinite; }
.anim-bob { animation: bob 2.6s ease-in-out infinite; }
.anim-float { bottom: auto; top: 14px; animation: bob 4s ease-in-out infinite; }
.anim-sway { transform-origin: bottom center; animation: sway 3s ease-in-out infinite; }
.anim-spin { bottom: auto; top: 10px; animation: spin 18s linear infinite; }
.anim-pulse { animation: pulseScale 1.8s ease-in-out infinite; }
@keyframes cloud { to { transform: translateX(160vw); } }
@keyframes fly { 0% { left: -12%; transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-8px) rotate(-6deg); } 100% { left: 108%; transform: translateY(0) rotate(-6deg); } }
@keyframes drive { 0% { left: 108%; } 100% { left: -14%; } }
@keyframes swim { 0%, 100% { transform: translateX(0) scaleX(1); } 49% { transform: translateX(60px) scaleX(1); } 50% { transform: translateX(60px) scaleX(-1); } 99% { transform: translateX(0) scaleX(-1); } }
@keyframes wave { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(14px); } }
@keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes sway { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
@keyframes pulseScale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
@keyframes twinkle { 50% { opacity: .35; } }

.narr-toggle { font-size: 1.25rem; }
.narration { display: flex; gap: 10px; align-items: flex-start; background: #FFFBEF; border: 1px solid #F5E2A8; border-radius: 18px; padding: 12px; font-size: 1rem; line-height: 1.5; animation: rise .25s ease; }
.narration .kiko { border-radius: 50%; flex-shrink: 0; border: 2px solid #fff; box-shadow: var(--shadow); animation: kikoTalk 1.2s ease-in-out 2; }
.narration.mood-oops .kiko { animation: kikoOops .5s ease-in-out 2; }
.narration.mood-oops { background: #FFF1EC; border-color: #F8C9B8; }
.narration [data-text].writing::after { content: '▍'; animation: twinkle .7s steps(1) infinite; color: var(--green-700); }
@keyframes kikoTalk { 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }
@keyframes kikoOops { 25% { transform: translateX(-4px) rotate(-10deg); } 75% { transform: translateX(4px) rotate(10deg); } }
.bubble.typing { display: inline-flex; gap: 5px; padding: 14px 16px; width: auto; }
.bubble.typing span { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); opacity: .5; animation: dots 1s ease-in-out infinite; }
.bubble.typing span:nth-child(2) { animation-delay: .15s; }
.bubble.typing span:nth-child(3) { animation-delay: .3s; }
@keyframes dots { 50% { transform: translateY(-5px); opacity: 1; } }
.tip-card, .explain-card { border-radius: 18px; padding: 14px; display: grid; gap: 8px; animation: rise .3s ease; }
.tip-card { background: #FFF6DC; border: 1px solid #F2D98C; }
.explain-card { background: #EAF4FF; border: 1px solid #C5DDF7; }
.tip-title { font-weight: 700; font-size: 1.02rem; }
.tip-card ul, .explain-card ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.explain-card .examples li { background: rgba(255, 255, 255, .7); border-radius: 12px; padding: 8px 10px; }
.kiko-note { display: flex; gap: 8px; align-items: flex-start; font-size: .92rem; padding: 8px 10px; border-radius: 14px; animation: rise .25s ease; }
.kiko-note img { border-radius: 50%; flex-shrink: 0; }
.kiko-note.tone-good { background: #E4F8EA; color: #0B5A32; }
.kiko-note.tone-ok { background: #FFF4D6; color: #6B4800; }
.kiko-note.tone-bad { background: #FDECEC; color: #8A1C1C; }
.action-chip { justify-self: end; background: var(--green-100); color: var(--green-900); font-weight: 600; font-size: .92rem; padding: 8px 12px; border-radius: 14px; animation: rise .25s ease; }
.option.action { font-weight: 500; }
.option.is-ok { border-color: #E0A100; background: #FFF6DC; box-shadow: 0 3px 0 #E0A100; }
.option.is-ok .option-mark { color: #B07D00; }
.choice-result { text-align: center; font-size: 1.05rem; }
.choice-result.tone-good { color: var(--ok); }
.choice-result.tone-ok { color: #9A6B00; }
.choice-result.tone-bad { color: var(--danger); }
.stars-row { display: flex; gap: 6px; justify-content: center; font-size: 2.4rem; }
.star { filter: grayscale(1); opacity: .3; }
.star.on { filter: none; opacity: 1; animation: pop .5s cubic-bezier(.2, 1.4, .4, 1) both; }
.end-text { max-width: 460px; font-size: 1.02rem; }
.done-screen .scene { width: 100%; }

.chapter-list { list-style: none; margin: 4px 0 0; padding: 0; display: grid; gap: 8px; }
.ch-row { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 16px; border: 1px solid var(--border); text-decoration: none; background: var(--surface); }
a.ch-row:hover { border-color: var(--green-500); background: var(--green-50); }
.chapter-list li.is-next .ch-row { border-color: var(--green-500); box-shadow: 0 0 0 3px var(--green-100); }
.ch-row.locked { opacity: .55; }
.ch-emoji { font-size: 1.8rem; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px; background: var(--green-50); flex-shrink: 0; }
.ch-emoji.locked { font-size: 1.2rem; background: var(--track); }
.ch-text { flex: 1; min-width: 0; display: grid; gap: 2px; }
.ch-meta { font-size: .8rem; color: var(--green-800); font-weight: 600; }
.link-btn.inline { padding: 0; font-size: inherit; text-decoration: underline; }

.modal-backdrop { position: fixed; inset: 0; z-index: 80; background: rgba(11, 61, 46, .45); display: grid; place-items: center; padding: 16px; animation: rise .2s ease; }
.modal { max-width: 420px; width: 100%; display: grid; gap: 12px; text-align: center; justify-items: center; }
.modal .stack { width: 100%; }
.modal .btn { flex-wrap: wrap; }
.modal-mascot { border-radius: 50%; animation: kikoTalk 1.2s ease-in-out 2; }
.done-screen .reward-row { gap: 8px; }
.done-screen .reward-row .reward { padding: 10px 14px; font-size: 1rem; }


/* ---------- Professor Kiko ---------- */
.plan-card { display: flex; gap: 12px; align-items: flex-start; background: linear-gradient(135deg, #FFFFFF, #EEF8F1); border: 2px solid var(--green-200); border-radius: 20px; padding: 14px; animation: rise .3s ease; }
.plan-card .kiko { flex-shrink: 0; animation: kikoTalk 1.2s ease-in-out 2; }
.plan-card > div { display: grid; gap: 6px; min-width: 0; }
.plan-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.plan-list li { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 6px 10px; display: grid; }
.explain-card.board { background: linear-gradient(160deg, #1F4A3A, #173A2D); border: 6px solid #8B5E34; border-radius: 16px; color: #F4F1E6; box-shadow: inset 0 0 30px rgba(0, 0, 0, .25), var(--shadow); font-family: 'Poppins', 'Comic Sans MS', system-ui, sans-serif; }
.explain-card.board .tip-title { color: #FFE9A8; }
.explain-card.board .examples li { background: rgba(255, 255, 255, .08); border: 1px dashed rgba(255, 255, 255, .25); }
.explain-card.board .muted { color: #CFE3D8; }
.explain-card.board .speak-btn { background: rgba(255, 255, 255, .15); color: #fff; }
.class-review { width: 100%; text-align: left; display: grid; gap: 8px; }
.class-review ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.class-review li { display: flex; justify-content: space-between; align-items: center; gap: 10px; background: var(--green-50); border-radius: 12px; padding: 8px 10px; }

/* ---------- Carimbos ---------- */
.stamp { --ink: #1D4ED8; position: relative; display: inline-grid; justify-items: center; align-content: center; gap: 2px; width: 120px; height: 120px; border-radius: 50%; border: 4px double var(--ink); color: var(--ink); text-align: center; padding: 10px; background: radial-gradient(circle, rgba(255, 255, 255, .6), rgba(255, 255, 255, 0) 70%); mix-blend-mode: multiply; }
.stamp::after { content: ''; position: absolute; inset: 6px; border-radius: 50%; border: 1.5px dashed var(--ink); opacity: .6; }
.stamp-emoji { font-size: 2rem; line-height: 1; }
.stamp-name { font-size: .66rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; line-height: 1.15; }
.stamp-date { font-size: .62rem; opacity: .8; }
.stamp.empty { --ink: #B8C7BE; border-style: dashed; color: #9AAEA3; }
.stamp.empty::after { display: none; }
.stamp.gold { --ink: #B7791F; box-shadow: 0 0 0 4px #FFF4D6; }
.stamp.big { width: 170px; height: 170px; transform: rotate(-12deg); }
.stamp.big .stamp-emoji { font-size: 3rem; }
.stamp.big .stamp-name { font-size: .85rem; }
.stamp-new { display: grid; justify-items: center; gap: 6px; text-decoration: none; }
.stamp-label { font-weight: 700; color: var(--green-800); }
.stamp-slam { animation: slam .6s cubic-bezier(.2, 1.6, .4, 1) .4s both; }
@keyframes slam { 0% { transform: scale(2.4) rotate(-25deg); opacity: 0; } 60% { transform: scale(.9) rotate(-8deg); opacity: 1; } 100% { transform: scale(1) rotate(-8deg); } }

/* ---------- Passaporte ---------- */
.passport-cover { background: linear-gradient(160deg, #0B3D2E, #0F7A4A); color: #F6E7B0; border-radius: 22px; padding: 28px 20px; display: grid; justify-items: center; gap: 4px; text-align: center; box-shadow: var(--shadow); border: 3px solid #C9A44C; }
.pp-emblem { font-size: 3rem; }
.pp-kicker { letter-spacing: .2em; text-transform: uppercase; font-size: .72rem; opacity: .85; }
.passport-cover h1 { color: #F6E7B0; font-size: 2rem; }
.pp-name { font-size: 1.1rem; font-weight: 600; color: #fff; }
.pp-count { font-size: .85rem; opacity: .9; }
.passport-page { background: #FBF6E9; background-image: repeating-linear-gradient(0deg, transparent 0 27px, rgba(11, 61, 46, .05) 27px 28px); border: 1px solid #E8DDC0; border-radius: 18px; padding: 18px 14px; display: grid; gap: 14px; }
.stamp-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 8px; justify-items: center; }
.stamp-slot { display: grid; justify-items: center; gap: 4px; }
.stamp-extra { font-size: .78rem; color: #6B5B2E; min-height: 1.2em; }
.big-stamp { display: grid; place-items: center; padding: 6px; }
.pp-legend { display: grid; gap: 4px; font-size: .85rem; color: #5E5335; border-top: 1px dashed #D8C99E; padding-top: 10px; }
@media (min-width: 640px) { .stamp-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

/* ---------- Mapa de aventura ---------- */
.view.map-view { max-width: none; padding-left: 0; padding-right: 0; padding-top: 0; background: radial-gradient(ellipse at 50% 0%, #2F6FD0 0%, #1B4FA8 35%, #0E2F73 100%); min-height: 100vh; gap: 0; }
.map-header { position: sticky; top: 0; z-index: 5; display: grid; gap: 10px; padding: 14px 16px 12px; background: linear-gradient(180deg, rgba(10, 36, 90, .96), rgba(10, 36, 90, .82)); backdrop-filter: blur(6px); color: #fff; }
.map-title { display: flex; align-items: center; gap: 12px; }
.map-title h1 { font-size: 1.25rem; color: #fff; }
.map-title .trip-flag { width: 48px; height: 48px; font-size: 2rem; border-radius: 14px; }
.map-header .bar { background: rgba(255, 255, 255, .18); height: 10px; }
.map-header .bar > span { background: linear-gradient(90deg, #FFC857, #FFE39A); }
.link-btn.light { color: #FFE39A; }
.map-actions { display: flex; gap: 8px; overflow-x: auto; }
.map-btn { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; min-height: 40px; padding: 6px 14px; border-radius: 999px; background: rgba(255, 255, 255, .14); color: #fff; font-weight: 600; font-size: .9rem; text-decoration: none; border: 1px solid rgba(255, 255, 255, .25); }
.map-btn.primary { background: var(--accent); color: var(--green-900); border-color: transparent; box-shadow: 0 3px 0 #C99A2E; }
.map-btn .badge { background: #fff; color: #1B4FA8; border-radius: 999px; padding: 0 7px; font-size: .75rem; }
.map-world { position: relative; width: 100%; max-width: 520px; margin: 0 auto; }
.map-path { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.trail, .trail-shadow { fill: none; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.trail-shadow { stroke: rgba(0, 0, 0, .25); stroke-width: 16; stroke-dasharray: 1 24; transform: translateY(3px); }
.trail { stroke: #C9D8EE; stroke-width: 14; stroke-dasharray: 1 24; }
.trail.done { stroke: #FFE08A; }
.map-start { position: absolute; transform: translate(-50%, -50%); background: rgba(255, 255, 255, .15); color: #fff; font-weight: 600; font-size: .85rem; padding: 6px 14px; border-radius: 999px; border: 1px dashed rgba(255, 255, 255, .45); white-space: nowrap; }
.deco { position: absolute; pointer-events: none; font-size: 1.6rem; }
.deco.gem { font-size: 1.4rem; filter: drop-shadow(0 0 8px rgba(120, 200, 255, .9)); animation: bob 3s ease-in-out infinite, twinkle 2.2s ease-in-out infinite; }
.deco.gem.g2 { animation-delay: -1.2s; }
.deco.boat { animation: sail 22s linear infinite; }
.deco.boat.b2 { animation-duration: 16s; animation-direction: reverse; }
.deco.boat.b3 { animation-duration: 28s; animation-delay: -9s; }
.deco.fish { font-size: 1.2rem; opacity: .85; animation: swim 7s ease-in-out infinite; }
.deco.fish.f2 { animation-delay: -3s; }
@keyframes sail { 0% { left: -12%; } 100% { left: 108%; } }

.isle { position: absolute; transform: translate(-50%, -50%); width: 36%; max-width: 180px; aspect-ratio: 1 / 1.05; border: 0; background: none; padding: 0; cursor: pointer; font: inherit; animation: isleFloat 4.5s ease-in-out infinite; -webkit-tap-highlight-color: transparent; }
@keyframes isleFloat { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-50%, calc(-50% - 8px)); } }
.isle-top { position: absolute; left: 4%; right: 4%; top: 28%; height: 34%; border-radius: 50%; background: radial-gradient(ellipse at 50% 35%, #8EE07A 0%, #4DB05A 55%, #2E8A45 100%); box-shadow: inset 0 -6px 0 rgba(0, 0, 0, .12); z-index: 2; }
.isle-rock { position: absolute; left: 12%; right: 12%; top: 44%; height: 42%; background: linear-gradient(180deg, #A0876A 0%, #7B6450 45%, #5A4A3E 100%); clip-path: polygon(0 0, 100% 0, 78% 55%, 58% 100%, 40% 88%, 20% 60%); z-index: 1; }
.isle-main { position: absolute; left: 50%; bottom: 38%; transform: translateX(-50%); font-size: clamp(2.4rem, 11vw, 3.6rem); line-height: 1; filter: drop-shadow(0 4px 2px rgba(0, 0, 0, .25)); }
.isle-side { position: absolute; right: 2%; bottom: 20%; font-size: clamp(1.1rem, 5vw, 1.6rem); }
.isle-sign { position: absolute; left: 4%; top: 52%; z-index: 3; background: linear-gradient(180deg, #C8955E, #9E6C3A); color: #FFF4DC; font-weight: 700; font-size: .7rem; padding: 3px 8px; border-radius: 6px; border: 2px solid #6E4622; box-shadow: 0 2px 0 rgba(0, 0, 0, .25); white-space: nowrap; }
.isle-sign.gold { background: linear-gradient(180deg, #FFD978, #E0A82E); color: #5A3A00; border-color: #A87408; left: 50%; transform: translateX(-50%); top: 86%; }
.isle-name { position: absolute; left: 50%; top: 88%; transform: translateX(-50%); width: 130%; text-align: center; color: #fff; font-weight: 700; font-size: .82rem; line-height: 1.2; text-shadow: 0 2px 4px rgba(0, 0, 0, .5); z-index: 3; }
.isle-stars { position: absolute; left: 50%; top: 6%; transform: translateX(-50%); font-size: .95rem; white-space: nowrap; z-index: 3; filter: drop-shadow(0 1px 1px rgba(0, 0, 0, .4)); }
.isle.done .isle-top { background: radial-gradient(ellipse at 50% 35%, #A6F08C 0%, #5BC065 55%, #34964C 100%); box-shadow: inset 0 -6px 0 rgba(0, 0, 0, .12), 0 0 22px rgba(255, 224, 138, .55); }
.isle.next::before { content: ''; position: absolute; left: 50%; top: 45%; width: 110%; aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle, rgba(255, 224, 138, .45), rgba(255, 224, 138, 0) 65%); animation: pulseScale 2s ease-in-out infinite; z-index: 0; }
.isle.locked .isle-top, .isle.locked .isle-rock, .isle.locked .isle-main, .isle.locked .isle-side { filter: grayscale(.85) brightness(.8); }
.isle.locked .isle-name { opacity: .7; }
.isle-fog { position: absolute; left: 50%; top: 40%; transform: translate(-50%, -50%); font-size: 2.4rem; letter-spacing: -14px; opacity: .95; z-index: 4; animation: wave 5s ease-in-out infinite; filter: drop-shadow(0 2px 6px rgba(0, 0, 0, .2)); }
.isle-lock { position: absolute; left: 50%; top: 40%; transform: translate(-50%, -50%); font-size: 1.4rem; z-index: 5; }
.isle:focus-visible { outline: 3px solid #FFE08A; outline-offset: 4px; border-radius: 30px; }
.isle.chest .isle-top { background: radial-gradient(ellipse at 50% 35%, #FFE7A0, #E8B64C 60%, #B8862A); }
.isle.chest.open .isle-main { animation: pop .6s cubic-bezier(.2, 1.4, .4, 1) both, bob 2.6s ease-in-out .6s infinite; }

.map-kiko { position: absolute; z-index: 6; transform: translate(-50%, calc(-100% - 58px)); display: grid; justify-items: center; pointer-events: auto; cursor: pointer; transition: left 1.5s ease-in-out, top 1.5s ease-in-out; }
.map-kiko img { width: 64px; height: 64px; filter: drop-shadow(0 6px 6px rgba(0, 0, 0, .35)); animation: bob 1.6s ease-in-out infinite; }
.map-kiko.walking img { animation: hop .35s ease-in-out infinite; }
@keyframes hop { 50% { transform: translateY(-14px) rotate(-6deg); } }
.kiko-bubble { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); width: max-content; max-width: 210px; background: #fff; color: var(--green-900); font-size: .78rem; font-weight: 600; line-height: 1.3; padding: 8px 10px; border-radius: 14px; box-shadow: var(--shadow); margin-bottom: 4px; }
.kiko-bubble::after { content: ''; position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%); border: 6px solid transparent; border-bottom: 0; border-top-color: #fff; }

.map-soon { max-width: 520px; margin: 0 auto; padding: 0 16px 20px; color: #fff; display: grid; gap: 10px; }
.map-soon h2 { color: #fff; }
.soon-isles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
.soon-isle { display: grid; justify-items: center; gap: 2px; background: rgba(255, 255, 255, .1); border: 1px dashed rgba(255, 255, 255, .3); border-radius: 16px; padding: 10px 4px; text-align: center; }
.soon-isle span { font-size: 1.8rem; filter: grayscale(.4); }
.soon-isle strong { font-size: .72rem; }
.soon-isle em { font-size: .66rem; opacity: .75; font-style: normal; }

.sheet-backdrop { position: fixed; inset: 0; background: rgba(5, 20, 50, .55); z-index: 40; }
.sheet { position: fixed; left: 0; right: 0; bottom: 0; z-index: 41; background: var(--surface); border-radius: 26px 26px 0 0; padding: 12px 16px calc(18px + env(safe-area-inset-bottom)); max-width: 560px; margin: 0 auto; display: grid; gap: 12px; box-shadow: 0 -10px 40px rgba(0, 0, 0, .3); animation: sheetUp .3s cubic-bezier(.2, .9, .3, 1); }
.sheet-body { display: grid; gap: 8px; }
.sheet-meta { font-weight: 600; color: var(--green-800); }
@keyframes sheetUp { from { transform: translateY(100%); } }
@media (min-width: 960px) {
  .view.map-view { margin-left: var(--sidebar-w); }
  .map-header { border-radius: 0 0 22px 22px; max-width: 560px; margin: 0 auto; width: 100%; }
  .sheet { bottom: 24px; border-radius: 26px; }
}
.map-world { overflow-x: clip; }
.view.map-view { overflow-x: clip; }
.kiko-bubble { max-width: min(210px, 60vw); }
@media (prefers-reduced-motion: reduce) { .isle, .map-kiko img { animation: none !important; } }

`;
