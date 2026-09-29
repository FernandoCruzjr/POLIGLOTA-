// Estilos dos elementos de jogo: temas do mapa, chefão, moedas, lojinha,
// mundo de destinos e Kiko com acessórios. Injetados por game.js.
export default `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes rise { from { opacity: 0; transform: translateY(8px); } }
@keyframes pop { from { transform: scale(.4); opacity: 0; } }

/* ---------- Kiko com acessórios ---------- */
.kiko-dress { position: relative; display: inline-block; width: var(--kk); height: var(--kk); flex-shrink: 0; line-height: 1; }
.kiko-dress img { width: 100%; height: 100%; display: block; border-radius: 50%; }
.kiko-dress > span { position: absolute; pointer-events: none; transform: translate(-50%, -50%); filter: drop-shadow(0 2px 1px rgba(0, 0, 0, .25)); }
.kk-head { left: 46%; top: 4%; font-size: calc(var(--kk) * .56); }
.kk-face { left: 66%; top: 58%; font-size: calc(var(--kk) * .4); }
.kk-neck { left: 40%; top: 96%; font-size: calc(var(--kk) * .34); }
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
.shop-stage { padding: 30px 20px 14px; }
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
`;
