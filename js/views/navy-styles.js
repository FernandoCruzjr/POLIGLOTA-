// Estilos da área Marinha ⚓ (azul-marinho e dourado). Injetados por navy.js.
export default `
.nv { --nv: #0B2545; --nv-2: #13315C; --nv-3: #1E4D8C; --nv-gold: #E0B13A; --nv-sea: #E8F1FB; --nv-ink: #0B2545; display: grid; gap: 14px; }
.nv-hero { position: relative; overflow: hidden; display: grid; gap: 8px; padding: 20px 18px; border-radius: 24px; color: #fff; background: linear-gradient(140deg, var(--nv) 0%, var(--nv-2) 55%, var(--nv-3) 100%); box-shadow: 0 8px 22px rgba(11, 37, 69, .25); }
.nv-hero::after { content: '⚓'; position: absolute; right: -6px; bottom: -24px; font-size: 7.5rem; opacity: .12; transform: rotate(-12deg); }
.nv-hero h1 { color: #fff; font-size: 1.5rem; }
.nv-hero p { color: #D6E4F5; font-size: .95rem; max-width: 52ch; }
.nv-eyebrow { font-size: .74rem; letter-spacing: .08em; text-transform: uppercase; font-weight: 700; color: var(--nv-gold); }
.nv-badges { display: flex; flex-wrap: wrap; gap: 8px; }
.nv-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, .12); border: 1px solid rgba(255, 255, 255, .22); color: #fff; border-radius: 999px; padding: 4px 12px; font-size: .82rem; font-weight: 600; }
.nv-day { display: grid; gap: 10px; border: 2px solid var(--nv-gold); }
.nv-day h2 { font-size: 1.1rem; color: var(--nv-ink); }
.nv-day-words { display: flex; flex-wrap: wrap; gap: 6px; }
.nv-day-words span { background: var(--nv-sea); color: var(--nv-ink); border-radius: 999px; padding: 3px 10px; font-size: .84rem; font-weight: 600; }
.nv-day-words span.ok { background: #DDF5E6; color: #0C6A40; }
.nv-phrase { background: var(--nv-sea); border-left: 4px solid var(--nv-3); border-radius: 12px; padding: 10px 12px; display: grid; gap: 2px; }
.nv-phrase strong { color: var(--nv-ink); }
.nv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.nv-tile { display: grid; gap: 4px; align-content: start; text-decoration: none; color: var(--text); padding: 14px; border-radius: 18px; background: var(--surface); border: 1px solid var(--border); transition: transform .15s; }
.nv-tile:hover { transform: translateY(-2px); border-color: var(--nv-3); }
.nv-tile .quick-emoji { font-size: 1.8rem; }
.nv-tile strong { color: var(--nv-ink); }
.nv-big { display: flex; gap: 14px; align-items: center; text-decoration: none; color: #fff; padding: 16px; border-radius: 20px; background: linear-gradient(120deg, #13315C, #1E4D8C); }
.nv-big strong { color: #fff; font-size: 1.05rem; }
.nv-big span span { color: #D6E4F5; display: block; font-size: .88rem; }
.nv-big .quick-emoji { font-size: 2.2rem; }
.nv-big .play-cta { margin-left: auto; background: var(--nv-gold); color: var(--nv); }
.nv-flags { letter-spacing: 2px; }

.nv-words { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.nv-word { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; }
.nv-word summary { display: flex; align-items: center; gap: 10px; padding: 10px 12px; cursor: pointer; list-style: none; }
.nv-word summary::-webkit-details-marker { display: none; }
.nv-word summary .grow { display: grid; }
.nv-word summary strong { color: var(--nv-ink); }
.nv-word .nv-ex { padding: 0 12px 12px 12px; display: grid; gap: 4px; font-size: .92rem; }
.nv-pron { color: var(--muted); font-size: .84rem; }
.nv-say { flex: none; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border); background: var(--nv-sea); font-size: 1.1rem; cursor: pointer; }
.nv-say:active { transform: scale(.94); }

.nv-card { display: grid; gap: 10px; justify-items: center; text-align: center; padding: 26px 18px; border-radius: 24px; background: var(--surface); border: 2px solid var(--nv-3); min-height: 280px; align-content: center; }
.nv-card .nv-en { font-size: 1.9rem; font-weight: 700; color: var(--nv-ink); line-height: 1.2; }
.nv-card .nv-pt { font-size: 1.15rem; font-weight: 600; color: var(--nv-3); }
.nv-card .nv-exbox { background: var(--nv-sea); border-radius: 14px; padding: 10px 12px; width: 100%; display: grid; gap: 2px; }
.nv-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.nv-steps { display: flex; gap: 4px; flex: 1; }
.nv-steps span { flex: 1; height: 6px; border-radius: 3px; background: var(--track); }
.nv-steps span.on { background: var(--nv-3); }
.nv-steps span.now { background: var(--nv-gold); }

.nv-q { font-size: 1.4rem; font-weight: 700; color: var(--nv-ink); text-align: center; }
.nv-opts { display: grid; gap: 10px; }
.nv-opt { text-align: left; padding: 14px 16px; border-radius: 16px; border: 2px solid var(--border); background: var(--surface); font: inherit; font-size: 1rem; cursor: pointer; color: var(--text); }
.nv-opt:hover:not(:disabled) { border-color: var(--nv-3); }
.nv-opt.right { border-color: #139158; background: #E7F8EE; }
.nv-opt.wrong { border-color: #b91c1c; background: #FDECEC; }
.nv-opt:disabled { cursor: default; }

.nv-chat { display: grid; gap: 10px; }
.nv-scene { background: var(--nv-sea); border-radius: 16px; padding: 12px 14px; font-size: .92rem; color: var(--nv-ink); display: grid; gap: 4px; }
.nv-msg { display: flex; gap: 8px; align-items: flex-end; max-width: 92%; }
.nv-msg.me { margin-left: auto; flex-direction: row-reverse; }
.nv-ava { flex: none; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; font-size: 1.3rem; background: var(--surface); border: 1px solid var(--border); }
.nv-bub { padding: 10px 12px; border-radius: 16px; background: var(--surface); border: 1px solid var(--border); display: grid; gap: 4px; }
.nv-msg.npc .nv-bub { border-bottom-left-radius: 4px; }
.nv-msg.me .nv-bub { background: #13315C; color: #fff; border-color: #13315C; border-bottom-right-radius: 4px; }
.nv-bub .nv-bub-pt { font-size: .86rem; color: var(--muted); }
.nv-msg.me .nv-bub .nv-bub-pt { color: #C9D9EE; }
.nv-bub-top { display: flex; align-items: center; gap: 8px; justify-content: space-between; }
.nv-bub-top small { font-weight: 700; color: var(--nv-3); }
.nv-msg.me .nv-bub-top small { color: var(--nv-gold); }
.nv-bub button { border: 0; background: transparent; cursor: pointer; font-size: 1rem; padding: 0 2px; }
.nv-hide-pt .nv-bub-pt, .nv-hide-pt .nv-opt-pt { display: none; }
.nv-task { border: 2px dashed var(--nv-gold); background: #FFF8E6; border-radius: 16px; padding: 10px 12px; color: #5E4300; font-size: .95rem; }
.nv-opt-pt { display: block; font-size: .84rem; color: var(--muted); margin-top: 2px; }
.nv-fb { border-radius: 14px; padding: 10px 12px; display: grid; gap: 4px; font-size: .93rem; }
.nv-fb.s2 { background: #E7F8EE; border: 1px solid #9BDDB5; }
.nv-fb.s1 { background: #FFF6DB; border: 1px solid #F2D27A; }
.nv-fb.s0 { background: #FDECEC; border: 1px solid #F3B4B4; }
.nv-tools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.nv-mic.on { background: #FDECEC; border-color: #b91c1c; }
.nv-keys { display: grid; gap: 6px; list-style: none; padding: 0; margin: 0; }
.nv-keys li { display: flex; gap: 10px; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 8px 10px; }
.nv-keys li div { display: grid; }
.nv-stars { font-size: 2rem; letter-spacing: 4px; }
.nv-ex-list { display: grid; gap: 10px; }
.nv-ex-item { display: flex; gap: 12px; align-items: center; text-decoration: none; color: var(--text); padding: 12px 14px; border-radius: 18px; background: var(--surface); border: 1px solid var(--border); }
.nv-ex-item:hover { border-color: var(--nv-3); }
.nv-ex-item .nv-flag { font-size: 2rem; }
.nv-ex-item strong { color: var(--nv-ink); }
.nv-ex-item .grow { display: grid; gap: 2px; }
.nv-lvl { font-size: .74rem; font-weight: 700; border-radius: 999px; padding: 2px 8px; background: var(--nv-sea); color: var(--nv-3); white-space: nowrap; }
.nv-done { font-size: .78rem; font-weight: 700; color: #0C6A40; }
`;
