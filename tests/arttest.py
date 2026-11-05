"""Sprite cut-out check (Owner 2026-11-05: Lão Rùa looked see-through in the art build).
Every battle sprite built from img-src/s by tools/art-build.py must keep its body opaque: away from the outline,
pixels are fully opaque (alpha 250 or more after the palette step). The old global colour key failed this (Lão Rùa: about two thirds of the body half transparent,
holes in the neck, belly and claws). Usage: python3 tests/arttest.py [public/img/s]"""
import glob, os, sys
from PIL import Image

D = sys.argv[1] if len(sys.argv) > 1 else 'public/img/s'
MIN_SOLID = 0.94   # share of interior pixels (2 px or more from any clear pixel) that must be fully opaque; the rest is fire, sparkles and palette specks
fails, n = 0, 0
for src in sorted(glob.glob('img-src/s/*.png')):
    f = os.path.join(D, os.path.basename(src)); n += 1
    if not os.path.exists(f): print('not ok - %s missing' % f); fails += 1; continue
    a = Image.open(f).convert('RGBA').getchannel('A'); w, h = a.size; A = a.load()
    clear = [[A[x, y] == 0 for x in range(w)] for y in range(h)]
    inner = solid = 0
    for y in range(2, h - 2):
        for x in range(2, w - 2):
            if any(clear[y + j][x + i] for j in range(-2, 3) for i in range(-2, 3)): continue
            inner += 1; solid += A[x, y] >= 250   # the 192-colour palette stores full alpha as 252-255
    share = solid / inner if inner else 1
    ok = share >= MIN_SOLID
    if not ok: fails += 1
    print('%s - %s body %.1f %% opaque' % ('ok' if ok else 'not ok', os.path.basename(f), 100 * share))
print('%d sprites, %d failed' % (n, fails)); sys.exit(1 if fails else 0)
