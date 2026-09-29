# Gera as cores do Kiko (img/kiko/<cor>.png e <cor>-cap.png) trocando só o verde das penas.
# Rodar na pasta do projeto:  python3 tools/make_kiko_skins.py   (precisa de numpy e Pillow)
import numpy as np
from PIL import Image

def hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a[..., :3].max(-1); mn = a[..., :3].min(-1); d = mx - mn; m = d > 1e-6; dd = np.where(m, d, 1)
    rc, gc, bc = (mx - r) / dd, (mx - g) / dd, (mx - b) / dd
    h = np.where(r == mx, bc - gc, np.where(g == mx, 2.0 + rc - bc, 4.0 + gc - rc))
    h = np.where(m, (h / 6.0) % 1.0, 0)
    return h, np.where(mx > 0, d / np.where(mx > 0, mx, 1), 0), mx

def rgb(h, s, v):
    i = np.floor(h * 6).astype(int) % 6; f = h * 6 - np.floor(h * 6)
    p, q, t = v * (1 - s), v * (1 - s * f), v * (1 - s * (1 - f))
    return np.stack([np.choose(i, [v, q, p, p, t, v]), np.choose(i, [t, v, v, q, p, p]), np.choose(i, [p, p, t, v, v, q])], -1)

SKINS = {
  'verde': None, 'azul': dict(hue=0.58), 'turquesa': dict(hue=0.49), 'roxo': dict(hue=0.76), 'rosa': dict(hue=0.91, sat=0.8, val=1.08),
  'vermelho': dict(hue=0.99), 'laranja': dict(hue=0.055, spread=0.25, sat=1.15, val=1.1), 'dourado': dict(hue=0.12, spread=0.15, sat=0.95, val=1.18),
  'arcoiris': dict(rainbow=True), 'fantasma': dict(hue=0.6, sat=0.08, val=1.15), 'noite': dict(hue=0.66, sat=0.55, val=0.6),
}
for base, suffix in [('img/mascot-avatar.png', ''), ('img/kiko-prof.png', '-cap')]:
    im = Image.open(base).convert('RGBA').resize((256, 256), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255.0
    h, s, v = hsv(a)
    green = (h > 0.17) & (h < 0.48) & (s > 0.18)
    H, W = h.shape
    for name, cfg in SKINS.items():
        out = a.copy()
        if cfg:
            sp = cfg.get('spread', 0.6)
            if cfg.get('rainbow'):
                target = (np.linspace(0, 1, H)[:, None] * 0.8 + np.linspace(0, 1, W)[None, :] * 0.2) % 1.0
                nh = (target + (h - 0.30) * 0.5) % 1.0
            else:
                nh = (cfg['hue'] + (h - 0.30) * sp) % 1.0
            ns = np.clip(s * cfg.get('sat', 1.0), 0, 1); nv = np.clip(v * cfg.get('val', 1.0), 0, 1)
            out[..., :3] = np.where(green[..., None], rgb(nh, ns, nv), a[..., :3])
        Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), 'RGBA').save(f'img/kiko/{name}{suffix}.png', optimize=True)
print('ok', len(SKINS))
