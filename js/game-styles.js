// Estilos dos elementos de jogo: temas do mapa, chefão, moedas, lojinha,
// mundo de destinos e Kiko com acessórios. Injetados por game.js.
export default `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } }
@keyframes pop { from { transform: scale(.4); opacity: 0; } }

/* ---------- Kiko com acessórios ---------- */
.kiko-dress { position: relative; display: inline-block; width: var(--kk); height: var(--kk); flex-shrink: 0; line-height: 1; isolation: isolate; }
.kiko-dress img { position: relative; z-index: 1; width: 100%; height: 100%; display: block; border-radius: 50%; }
.kiko-dress > span { position: absolute; z-index: 2; pointer-events: none; transform: translate(-50%, -50%); filter: drop-shadow(0 2px 1px rgba(0, 0, 0, .25)); white-space: nowrap; }
.kiko-dress > .kk-pet, .kiko-dress > .kk-hand { z-index: 3; }
.kk-halo { width: calc(var(--kk) * .5); height: calc(var(--kk) * .14); border: calc(var(--kk) * .035) solid #FFD54F; border-radius: 50%; box-shadow: 0 0 calc(var(--kk) * .08) #FFE082; }
.kiko-dress[class*="bg-"]::before { content: ''; position: absolute; inset: calc(var(--kk) * -.1); border-radius: 50%; z-index: 0; }
.kiko-dress.bg-sea::before { background: linear-gradient(180deg, #7FD3F7 0%, #3BB2E6 55%, #F5DEB3 56%); }
.kiko-dress.bg-sun::before { background: linear-gradient(180deg, #FF9A5A, #E0527A 60%, #6B2A7A); }
.kiko-dress.bg-jungle::before { background: radial-gradient(circle, #7BD389, #1F7A3A); }
.kiko-dress.bg-hearts::before { background: radial-gradient(circle, #FFD1E3, #FF6FA8); }
.kiko-dress.bg-snow::before { background: radial-gradient(circle, #FFFFFF, #BFE3FF); }
.kiko-dress.bg-city::before { background: linear-gradient(180deg, #0B1B3F, #2B2F77 70%, #FFB84D 71%, #2B2F77 73%); }
.kiko-dress.bg-space::before { background: radial-gradient(circle at 30% 30%, #6B3FC9, #120A33 70%); }
.kiko-dress.bg-gold::before { background: conic-gradient(#FFE082, #D4A017, #FFF3C4, #C8901A, #FFE082); }
.kiko-dress.bg-rainbow::before { background: conic-gradient(#FF5A5A, #FFB84D, #FFE14D, #5AD16B, #4DA6FF, #9B5AFF, #FF5A5A); }
.kk-deco { font-size: calc(var(--kk) * .24); z-index: 2; }
.kk-deco.d0 { left: 92%; top: 6%; }
.kk-deco.d1 { left: 6%; top: 10%; }
.kiko-dress.trying { animation: tryWiggle 1.2s ease-in-out infinite; }
@keyframes tryWiggle { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); } }
.map-kiko img { animation: none; width: 100%; height: 100%; filter: none; }
.map-kiko .kiko-dress { filter: drop-shadow(0 6px 6px rgba(0, 0, 0, .35)); animation: bob 1.6s ease-in-out infinite; }
.map-kiko.walking .kiko-dress { animation: hop .35s ease-in-out infinite; }

/* ---------- Moedas ---------- */
.coin-chip { width: fit-content; justify-self: start; display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 4px 12px; border-radius: 999px; font-weight: 700; text-decoration: none; background: #FFF4D0; color: #7A5200; border: 2px solid #F2C94C; box-shadow: 0 2px 0 #D9A92A; white-space: nowrap; }
.coin-chip.light { background: rgba(255, 244, 208, .95); }
.coin-reward { text-decoration: none; color: #7A5200; background: #FFF7DB; border-color: #F2C94C; }
.coin-reward .coin-ico { font-size: 1.4rem; animation: coinSpin 1.2s ease .3s both; display: inline-block; }
@keyframes coinSpin { 0% { transform: rotateY(0) scale(.4); } 60% { transform: rotateY(540deg) scale(1.2); } 100% { transform: rotateY(720deg) scale(1); } }
.map-top-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }

/* ---------- Temas do mapa ---------- */
.view.map-view .map-header { z-index: 8; }
.home-head .coin-chip { margin-left: auto; align-self: flex-start; }
.home-head > div { min-width: 0; }
.view.map-view.theme-sunset { background: linear-gradient(180deg, #FF9A5A 0%, #E0527A 30%, #8A2F6B 60%, #3B1E6B 100%); }
.view.map-view.theme-sunset .map-header { background: linear-gradient(180deg, rgba(70, 20, 70, .95), rgba(70, 20, 70, .8)); }
.view.map-view.theme-sakura { background: linear-gradient(180deg, #FFB7D0 0%, #E86A9E 30%, #B8487E 60%, #5B2350 100%); }
.view.map-view.theme-sakura .map-header { background: linear-gradient(180deg, rgba(91, 20, 60, .95), rgba(91, 20, 60, .8)); }
.map-world.theme-sakura { background: linear-gradient(180deg, #E86A9E, #B8487E 45%, #5B2350) !important; }
.dest.sakura { background: linear-gradient(135deg, #FFB7D0, #E86A9E 45%, #7A2A5E); }
.boss-arena.sakura { background: radial-gradient(circle at 50% 20%, #E86A9E, #3B1230 75%); }
.view.map-view.theme-sky { background: linear-gradient(180deg, #4FA6E0 0%, #7EC8F5 35%, #BFE6FF 75%, #FFF3D6 100%); }
.view.map-view.theme-sky .map-header { background: linear-gradient(180deg, rgba(11, 61, 46, .96), rgba(15, 122, 74, .88)); }
.map-world.theme-sunset { background: linear-gradient(180deg, #E0527A, #8A2F6B 45%, #3B1E6B) !important; }
.map-world.theme-sky { background: linear-gradient(180deg, #7EC8F5, #A8DBFA 50%, #D8F0FF) !important; }
.map-world.theme-sky .isle-name { text-shadow: 0 1px 0 #0B3D2E, 0 2px 6px rgba(11, 61, 46, .8); }
.map-world.theme-sky .map-start { background: rgba(11, 61, 46, .55); }
.deco.drift { animation: bob 3.4s ease-in-out infinite; opacity: .92; }
.deco.drift.d1 { animation-delay: -1.1s; font-size: 1.9rem; }
.deco.drift.d2 { animation-delay: -2.2s; font-size: 1.4rem; }
.map-banner { position: absolute; transform: translate(-50%, -50%); z-index: 4; display: grid; justify-items: center; background: linear-gradient(180deg, #C8955E, #9E6C3A); color: #FFF4DC; border: 3px solid #6E4622; border-radius: 12px; padding: 6px 18px; box-shadow: 0 4px 0 rgba(0, 0, 0, .25); text-align: center; max-width: 48%; }
.map-banner span { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; opacity: .85; }
.map-banner strong { font-size: .95rem; line-height: 1.2; }

/* ---------- Ilha do chefão ---------- */
.isle.boss .isle-top { background: radial-gradient(ellipse at 50% 35%, #B18CFF 0%, #6B3FC9 55%, #3B1F80 100%); }
.isle.boss .isle-rock { background: linear-gradient(180deg, #5A4A6E, #3A2F4E 60%, #231B33); }
.isle.boss:not(.locked) .isle-main { animation: bossBreath 2.4s ease-in-out infinite; }
.isle.boss.done .isle-top { background: radial-gradient(ellipse at 50% 35%, #FFE7A0, #E8B64C 60%, #B8862A); }
.isle-sign.boss-sign { background: linear-gradient(180deg, #E0525A, #A3242C); border-color: #6B1016; color: #fff; }
.isle.boss.next::before { background: radial-gradient(circle, rgba(200, 120, 255, .55), rgba(200, 120, 255, 0) 65%); }
@keyframes bossBreath { 0%, 100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.12); } }

/* ---------- Festa (baú, vitória) ---------- */
.modal.celebrate { position: relative; overflow: hidden; text-align: center; }
.cel-rays { position: absolute; left: 50%; top: 70px; width: 360px; height: 360px; transform: translate(-50%, -50%); background: repeating-conic-gradient(rgba(255, 200, 87, .28) 0 12deg, transparent 12deg 24deg); border-radius: 50%; animation: raySpin 14s linear infinite; pointer-events: none; }
@keyframes raySpin { from { transform: translate(-50%, -50%) rotate(0); } to { transform: translate(-50%, -50%) rotate(360deg); } }
.cel-icon { position: relative; font-size: 4rem; display: block; animation: pop .6s cubic-bezier(.2, 1.4, .4, 1) both; }
.cel-reward { position: relative; font-size: 1.6rem; font-weight: 800; color: #7A5200; }
.modal.celebrate h2, .modal.celebrate p, .modal.celebrate .stack { position: relative; }

/* ---------- Mundo (escolher destino) ---------- */
.view.world-view { max-width: none; padding: 0 0 24px; background: radial-gradient(ellipse at 50% -10%, #3C7FE0 0%, #1B4FA8 40%, #0B2458 100%); min-height: 100vh; color: #fff; }
.world-head { max-width: 560px; margin: 0 auto; width: 100%; padding: 18px 16px 8px; display: grid; gap: 10px; }
.world-head h1 { color: #fff; font-size: 1.5rem; }
.world-head p { opacity: .85; }
.world-globe { font-size: 3rem; display: inline-block; animation: spin 30s linear infinite; }
.world-list { max-width: 560px; margin: 0 auto; padding: 0 16px; display: grid; gap: 16px; }
.dest { position: relative; display: grid; gap: 10px; padding: 18px; border-radius: 26px; color: #fff; text-decoration: none; overflow: hidden; border: 2px solid rgba(255, 255, 255, .25); box-shadow: 0 10px 0 rgba(0, 0, 0, .18), 0 16px 30px rgba(0, 0, 0, .25); transition: transform .15s; }
.dest:hover { transform: translateY(-2px); }
.dest:active { transform: translateY(3px); box-shadow: 0 5px 0 rgba(0, 0, 0, .18); }
.dest.ocean { background: linear-gradient(135deg, #2FA7D9, #1B4FA8 60%, #173A8C); }
.dest.sunset { background: linear-gradient(135deg, #FF9A5A, #E0527A 50%, #6B2A7A); }
.dest-top { display: flex; align-items: center; gap: 14px; }
.dest-flag { font-size: 3rem; width: 72px; height: 72px; display: grid; place-items: center; background: rgba(255, 255, 255, .92); border-radius: 22px; box-shadow: 0 4px 0 rgba(0, 0, 0, .15); flex-shrink: 0; animation: bob 3s ease-in-out infinite; }
.dest h2 { color: #fff; font-size: 1.2rem; }
.dest p { font-size: .9rem; opacity: .92; }
.dest .bar { background: rgba(255, 255, 255, .25); height: 10px; }
.dest .bar > span { background: linear-gradient(90deg, #FFC857, #FFE39A); }
.dest-meta { display: flex; flex-wrap: wrap; gap: 6px; font-size: .8rem; font-weight: 600; }
.dest-meta span { background: rgba(0, 0, 0, .18); padding: 3px 10px; border-radius: 999px; }
.dest-cta { justify-self: start; background: var(--accent); color: var(--green-900); font-weight: 700; padding: 8px 18px; border-radius: 999px; box-shadow: 0 3px 0 #C99A2E; }
.dest-deco { position: absolute; right: 16px; bottom: 14px; font-size: 2.2rem; opacity: .55; animation: bob 4s ease-in-out infinite; }
.world-soon { max-width: 560px; margin: 8px auto 0; padding: 0 16px; }
.world-soon h2 { color: #fff; margin-bottom: 8px; }

/* ---------- Lojinha do Kiko ---------- */
.shop-hero { display: grid; justify-items: center; gap: 8px; text-align: center; padding: 20px 16px; background: radial-gradient(circle at 50% 30%, #FFF7DB, #EBF9EE 70%); border-radius: 26px; border: 1px solid var(--border); }
.shop-hero .kiko-dress { animation: bob 2.4s ease-in-out infinite; }
.shop-stage { padding: 34px 40px 18px; cursor: pointer; }
.shop-try { font-size: 1rem; }
.shop-cta { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.shop-tabs { display: flex; gap: 8px; overflow-x: auto; padding: 2px 2px 6px; }
.shop-tab { flex-shrink: 0; display: grid; justify-items: center; gap: 2px; min-width: 72px; padding: 8px 10px; border-radius: 16px; border: 2px solid var(--border); background: var(--surface); font: inherit; font-size: .8rem; font-weight: 700; cursor: pointer; }
.shop-tab span { font-size: 1.4rem; }
.shop-tab.on { border-color: var(--green-500); background: var(--green-50); box-shadow: 0 3px 0 var(--green-500); }
.shop-item.trying { outline: 3px dashed #F2C94C; outline-offset: 2px; }
.si-skin { width: 56px; height: 56px; border-radius: 50%; }
.si-bg { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; font-size: 1.1rem; }
.si-bg.bg-sea { background: linear-gradient(180deg, #7FD3F7 0%, #3BB2E6 55%, #F5DEB3 56%); }
.si-bg.bg-sun { background: linear-gradient(180deg, #FF9A5A, #E0527A 60%, #6B2A7A); }
.si-bg.bg-jungle { background: radial-gradient(circle, #7BD389, #1F7A3A); }
.si-bg.bg-hearts { background: radial-gradient(circle, #FFD1E3, #FF6FA8); }
.si-bg.bg-snow { background: radial-gradient(circle, #FFFFFF, #BFE3FF); border: 1px solid #ddd; }
.si-bg.bg-city { background: linear-gradient(180deg, #0B1B3F, #2B2F77 70%, #FFB84D 71%, #2B2F77 73%); }
.si-bg.bg-space { background: radial-gradient(circle at 30% 30%, #6B3FC9, #120A33 70%); }
.si-bg.bg-gold { background: conic-gradient(#FFE082, #D4A017, #FFF3C4, #C8901A, #FFE082); }
.si-bg.bg-rainbow { background: conic-gradient(#FF5A5A, #FFB84D, #FFE14D, #5AD16B, #4DA6FF, #9B5AFF, #FF5A5A); }
.shop-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
@media (min-width: 640px) { .shop-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.shop-item { display: grid; justify-items: center; gap: 4px; padding: 12px 6px; border-radius: 18px; border: 2px solid var(--border); background: var(--surface); font: inherit; color: var(--text); cursor: pointer; box-shadow: 0 3px 0 var(--border); text-align: center; }
.shop-item:hover { border-color: var(--green-500); }
.shop-item .si-emoji { font-size: 2.2rem; line-height: 1.1; }
.shop-item .si-name { font-size: .78rem; font-weight: 600; line-height: 1.2; min-height: 2.4em; }
.shop-item .si-price { font-size: .78rem; font-weight: 700; color: #7A5200; background: #FFF4D0; border-radius: 999px; padding: 2px 8px; }
.shop-item.owned .si-price { background: var(--green-50); color: var(--green-800); }
.shop-item.equipped { border-color: var(--green-500); background: var(--green-50); box-shadow: 0 3px 0 var(--green-500); }
.shop-item.equipped .si-price { background: var(--green-700); color: #fff; }
.shop-item.poor { opacity: .6; }
.shop-earn { display: grid; gap: 6px; font-size: .9rem; }
.shop-earn li { display: flex; justify-content: space-between; gap: 10px; border-bottom: 1px dashed var(--border); padding: 4px 0; }

/* ---------- Batalha do chefão ---------- */
.boss-arena { position: relative; border-radius: 26px; padding: 16px 14px 14px; color: #fff; overflow: hidden; display: grid; gap: 10px; background: radial-gradient(circle at 50% 20%, #6B3FC9, #2A1560 70%); box-shadow: 0 8px 0 rgba(0, 0, 0, .2); }
.boss-arena.sunset { background: radial-gradient(circle at 50% 20%, #E0527A, #3B1E6B 75%); }
.boss-arena.sky { background: radial-gradient(circle at 50% 20%, #2FB36B, #0B3D2E 75%); }
.boss-arena::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, .08), transparent 40%), radial-gradient(circle at 85% 30%, rgba(255, 255, 255, .08), transparent 35%); pointer-events: none; }
.boss-row { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.boss-name { font-weight: 700; font-size: .95rem; }
.hp { flex: 1; height: 14px; border-radius: 999px; background: rgba(255, 255, 255, .2); overflow: hidden; border: 2px solid rgba(255, 255, 255, .35); }
.hp > span { display: block; height: 100%; background: linear-gradient(90deg, #FF5A5A, #FF9A5A); transition: width .4s ease; }
.boss-figure { position: relative; font-size: 5.2rem; line-height: 1; text-align: center; filter: drop-shadow(0 8px 10px rgba(0, 0, 0, .4)); animation: bossBreath2 2.4s ease-in-out infinite; }
@keyframes bossBreath2 { 50% { transform: scale(1.06) translateY(-4px); } }
.boss-figure.hit { animation: bossHit .5s ease; }
@keyframes bossHit { 0% { transform: translateX(0); filter: brightness(3); } 25% { transform: translateX(-14px) rotate(-8deg); } 50% { transform: translateX(12px) rotate(6deg); } 100% { transform: none; } }
.boss-figure.attack { animation: bossAttack .6s ease; }
@keyframes bossAttack { 40% { transform: scale(1.35) translateY(20px); } }
.boss-figure.defeated { animation: bossDown .9s ease forwards; }
@keyframes bossDown { to { transform: translateY(40px) rotate(90deg) scale(.4); opacity: 0; } }
.boss-hitfx { position: absolute; left: 50%; top: 40%; transform: translate(-50%, -50%); font-size: 3rem; pointer-events: none; animation: pop .5s ease both; }
.boss-say { position: relative; background: #fff; color: #2A1560; font-weight: 600; font-size: .9rem; border-radius: 16px; padding: 8px 12px; justify-self: center; max-width: 92%; text-align: center; }
.hearts { font-size: 1.3rem; letter-spacing: 2px; }
.hearts .lost { filter: grayscale(1); opacity: .35; }
.player-row { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.player-row .kiko-dress { animation: bob 1.8s ease-in-out infinite; }
.timer { height: 8px; border-radius: 999px; background: var(--green-50); overflow: hidden; border: 1px solid var(--border); }
.timer > span { display: block; height: 100%; width: 100%; background: linear-gradient(90deg, #22C55E, #FFC857, #FF5A5A); transform-origin: left; }
.timer.run > span { animation: timerRun var(--t, 15s) linear forwards; }
@keyframes timerRun { from { transform: scaleX(1); } to { transform: scaleX(0); } }
.boss-q { display: grid; gap: 12px; }
.boss-q:focus { outline: none; }
.boss-q .bubble { max-width: 100%; }
.boss-prompt { font-weight: 700; font-size: 1.05rem; }
.boss-prompt .pt { display: block; font-weight: 600; color: var(--green-800); font-size: 1.1rem; margin-top: 2px; }
.shake { animation: shakeX .4s ease; }
@keyframes shakeX { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
@media (prefers-reduced-motion: reduce) { .boss-figure, .world-globe, .dest-flag, .kiko-dress, .cel-rays { animation: none !important; } }

/* ---------- Treino de fala ---------- */
.sp-intro { display: flex; gap: 12px; align-items: flex-start; }
.sp-steps { display: grid; gap: 4px; padding-left: 18px; list-style: decimal; font-size: .92rem; margin-top: 4px; }
.sp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.sp-sit { display: grid; justify-items: start; gap: 6px; text-decoration: none; color: inherit; padding: 14px; }
.sp-sit.shield { background: #FFF7DB; border-color: #F2C94C; }
.sp-sit.hard { background: #FDECEC; border-color: #F5B5B5; }
.sp-sit .bar { width: 100%; height: 6px; }
.sp-sub { display: grid; gap: 8px; }
.sp-sub h2 { font-size: 1.05rem; }
.sp-list { display: grid; gap: 6px; }
.sp-list li { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: start; padding: 8px 0; border-bottom: 1px dashed var(--border); font-size: .93rem; }
.sp-list li:last-child { border-bottom: 0; }
.chip.sp-hear { background: #EAF2FF; color: #1E4FA8; font-size: .72rem; }
.sp-phrase .chip { justify-self: center; }
.sp-phrase { text-align: center; display: grid; gap: 8px; padding: 22px 16px; }
.sp-en { font-size: 1.45rem; font-weight: 700; line-height: 1.35; }
.sp-pt { color: var(--muted); }
.sp-buttons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.sp-buttons .btn-primary, .sp-buttons [data-check] { grid-column: 1 / -1; }
.sp-buttons .recording { background: #E53935; border-color: #E53935; animation: pulse 1.2s ease-in-out infinite; }
.sp-result:empty { display: none; }
.sp-result { display: grid; gap: 6px; text-align: center; }
.sp-compare { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.sp-live { font-weight: 700; color: var(--green-800); }
.sp-score { font-weight: 700; }
.sp-score.good { color: var(--green-700); }
.sp-score.ok { color: #9A6B00; }
.sp-rate { display: grid; gap: 8px; }
.sp-rate-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.sp-rate-row .btn { padding-left: 4px; padding-right: 4px; font-size: .9rem; }

/* ---------- Meu plano ---------- */
.pl-hero { display: grid; gap: 10px; padding: 18px; border-radius: 24px; color: #fff; background: linear-gradient(135deg, var(--green-700), var(--green-900)); }
.pl-hero h1 { color: #fff; font-size: 1.4rem; }
.pl-hero .bar { background: rgba(255, 255, 255, .2); }
.pl-hero .bar > span { background: linear-gradient(90deg, #FFC857, #FFE39A); }
.pl-facts { display: flex; flex-wrap: wrap; gap: 6px; }
.pl-facts span { background: rgba(255, 255, 255, .15); border-radius: 999px; padding: 3px 10px; font-size: .8rem; font-weight: 600; }
.pl-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; }
.pl-tab { flex-shrink: 0; min-width: 52px; min-height: 52px; border-radius: 16px; border: 2px solid var(--border); background: var(--surface); font: inherit; font-weight: 700; cursor: pointer; display: grid; place-items: center; line-height: 1.1; padding: 4px 8px; }
.pl-tab small { font-weight: 500; font-size: .7rem; color: var(--muted); }
.pl-tab[aria-selected="true"] { border-color: var(--green-500); background: var(--green-50); box-shadow: 0 3px 0 var(--green-500); }
.pl-tab.today::after { content: 'hoje'; font-size: .6rem; color: var(--green-700); }
.pl-day { display: grid; gap: 10px; }
.pl-block { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; align-items: start; padding: 12px; border-radius: 18px; border: 1px solid var(--border); background: var(--surface); }
.pl-min { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 14px; background: var(--green-50); font-weight: 800; color: var(--green-800); font-size: .8rem; text-align: center; line-height: 1.1; }
.pl-min span { font-size: 1.3rem; }
.pl-block h3 { font-size: 1rem; }
.pl-block p { font-size: .9rem; }
.pl-block .btn { margin-top: 6px; justify-self: start; }
.pl-check { display: grid; gap: 8px; }
.pl-check label { display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; border-radius: 14px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; font-size: .93rem; }
.pl-check input { width: 22px; height: 22px; accent-color: var(--green-700); flex-shrink: 0; margin-top: 1px; }
.pl-check label.done { background: var(--green-50); border-color: var(--green-200); }
.pl-acc { border: 1px solid var(--border); border-radius: 18px; background: var(--surface); overflow: hidden; }
.pl-acc + .pl-acc { margin-top: 10px; }
.pl-acc summary { cursor: pointer; padding: 14px 16px; font-weight: 700; list-style: none; display: flex; justify-content: space-between; gap: 10px; }
.pl-acc summary::-webkit-details-marker { display: none; }
.pl-acc summary::after { content: '▾'; color: var(--muted); }
.pl-acc[open] summary::after { content: '▴'; }
.pl-acc .pl-body { padding: 0 16px 16px; display: grid; gap: 10px; font-size: .93rem; }
.pl-body ul { display: grid; gap: 6px; padding-left: 18px; list-style: disc; }
.pl-body ol { display: grid; gap: 6px; padding-left: 18px; list-style: decimal; }
.pl-prompt { background: #F4F7F5; border: 1px dashed var(--green-200); border-radius: 14px; padding: 10px 12px; font-size: .88rem; white-space: pre-wrap; }
.pl-time { display: grid; gap: 8px; }
.pl-time li { list-style: none; display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 10px; padding: 10px; border-radius: 14px; background: var(--green-50); }
.pl-time li strong:first-child { color: var(--green-800); }
.pl-barrel { display: grid; gap: 8px; }
.pl-barrel li { list-style: none; display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--border); border-radius: 12px; }
.pl-barrel li a { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pl-barrel form { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
@media (min-width: 640px) { .pl-barrel form { grid-template-columns: 1fr 1.4fr auto auto; align-items: end; } }
.pl-phase { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.pl-phase div { padding: 10px; border-radius: 14px; border: 2px solid var(--border); font-size: .82rem; display: grid; gap: 2px; }
.pl-phase div.now { border-color: var(--green-500); background: var(--green-50); }

/* ---------- Dicionário de toque ---------- */
.w { cursor: help; border-bottom: 2px dotted rgba(15, 122, 74, .35); border-radius: 2px; }
.w:hover, .w.on { background: #FFF1B8; color: #3B2A00; border-bottom-color: #F2C94C; }
.bubble.you .w { border-bottom-color: rgba(255, 255, 255, .5); }
.bubble.you .w:hover, .bubble.you .w.on { color: #3B2A00; }
.w:focus-visible { outline: 2px solid var(--green-500); outline-offset: 1px; }
.wordtip { position: fixed; z-index: 120; display: grid; gap: 2px; background: #1F2A24; color: #fff; padding: 8px 12px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, .25); font-size: .9rem; line-height: 1.3; animation: rise .15s ease; }
.wordtip strong { font-size: 1rem; color: #FFE08A; }
.wordtip em { opacity: .7; }
.wordtip .wt-btns { display: flex; gap: 6px; margin-top: 4px; }
.wordtip button { background: rgba(255, 255, 255, .12); border: 0; color: #fff; border-radius: 8px; min-width: 34px; min-height: 30px; cursor: pointer; font-size: 1rem; }

/* ---------- Favoritas, devagar, leia assim ---------- */
.fav-btn { border: 0; background: transparent; color: #C9A227; font-size: 1.35rem; line-height: 1; min-width: 34px; min-height: 34px; border-radius: 10px; cursor: pointer; vertical-align: middle; }
.fav-btn.on { color: #F2B705; text-shadow: 0 1px 0 rgba(0, 0, 0, .15); }
.fav-btn:hover { background: #FFF7DB; }
.fav-btn.big { font-size: 1.7rem; min-width: 46px; min-height: 46px; border: 2px solid #F2C94C; background: #FFFBEA; }
.bubble.you .fav-btn { color: #FFE08A; }
.slow-btn { font-size: .95rem; }
.row-btns { display: inline-flex; gap: 4px; align-items: center; }
.narr-toggle.on { background: var(--green-50); box-shadow: inset 0 0 0 2px var(--green-500); }
.sp-pron { background: #FFF7DB; border: 1px dashed #F2C94C; color: #5E4300; border-radius: 12px; padding: 6px 10px; font-size: 1rem; justify-self: center; }
.sp-pron span { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; opacity: .8; margin-right: 4px; }
.sp-pron-s { font-size: .85rem; color: #8A6400; }
.sp-fav { justify-self: center; }
.sp-sit.fav { background: #FFFBEA; border-color: #F2C94C; }
.sp-sit.pat { background: #EAF2FF; border-color: #B7CFF5; }

/* ---------- Frases que se encaixam ---------- */
.pt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.pt-card { display: grid; gap: 6px; justify-items: start; text-decoration: none; color: inherit; padding: 14px; }
.pt-card strong { font-size: 1.05rem; }
.pt-stage { display: grid; gap: 10px; text-align: center; padding: 20px 14px; }
.pt-sentence { font-size: 1.45rem; font-weight: 700; line-height: 1.5; }
.pt-slot { display: inline-block; background: #E4F8EA; border: 2px solid #22C55E; border-radius: 12px; padding: 0 10px; margin: 0 4px; animation: kdPop .35s ease; }
.pt-slot.empty { background: #FFF7DB; border-color: #F2C94C; border-style: dashed; color: #9A6B00; min-width: 70px; }
@keyframes kdPop { from { transform: scale(.7); } }
.pt-pt { color: var(--muted); }
.pt-q { font-size: 1.2rem; font-weight: 700; color: var(--green-800); }
.pt-actions { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; align-items: center; }
.pt-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.pt-chip { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 6px 12px; border-radius: 999px; border: 2px solid var(--border); background: var(--surface); font: inherit; font-weight: 600; cursor: pointer; box-shadow: 0 2px 0 var(--border); }
.pt-chip.seen { border-color: var(--green-200); }
.pt-chip.on { border-color: var(--green-500); background: var(--green-50); box-shadow: 0 2px 0 var(--green-500); }
.pt-chip.big { min-height: 56px; font-size: 1.05rem; justify-content: center; }
.pt-chip.right { background: #E4F8EA; border-color: #22C55E; }
.pt-chip.wrong { opacity: .4; text-decoration: line-through; }
.pt-opts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
`;
