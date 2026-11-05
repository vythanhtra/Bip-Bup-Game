#!/usr/bin/env python3
"""Art pipeline (ADR-003): img-src/{p,s,bg}/*.png  ->  public/img/{p,s,bg}/*.png

- s/  battle sprites on a flat green key colour: key out, trim, scale to SPRITE_H px tall
- p/  dialogue portraits: scale to PORTRAIT px square
- bg/ vertical stage backgrounds: cover-fit to BG_W x BG_H
- bgw/ 16:9 desktop stage backgrounds: 3x (max 1280 wide), loaded only on wide screens
Every output is palette-quantised (<=192 colours, backgrounds 96) to keep the whole set under the 3 MB budget.
Usage: python3 tools/art-build.py [--src img-src] [--out public/img]
"""
import os, sys, math, json
from PIL import Image

SPRITE_H, PORTRAIT, BG_W, BG_H = 192, 256, 540, 960
args = dict(zip(sys.argv[1::2], sys.argv[2::2]))
SRC, OUT = args.get('--src', 'img-src'), args.get('--out', 'public/img')

def key_out(im, tol=48, pocket=.4, pocket_min=6):
    """Remove the flat key colour round the character, not inside it.
    Background = key-coloured pixels joined to the image edge, plus enclosed pockets of near-exact key colour
    (sky between tree branches, between an arm and the body). Only pixels touching the background get a soft edge;
    everything else stays opaque. Owner 2026-11-05: a global colour key cut holes in green and pale characters
    (Lão Rùa's neck, belly and claws) and left their whole body half transparent."""
    im = im.convert('RGBA'); px = im.load(); w, h = im.size
    corners = [px[2, 2], px[w - 3, 2], px[2, h - 3], px[w - 3, h - 3]]
    bg = max(set(corners), key=corners.count)
    d = [[math.sqrt((px[x, y][0] - bg[0]) ** 2 + (px[x, y][1] - bg[1]) ** 2 + (px[x, y][2] - bg[2]) ** 2) for x in range(w)] for y in range(h)]
    out = [[False] * w for _ in range(h)]

    def fill(seeds, lim):
        comp, stack = [], [s for s in seeds if d[s[1]][s[0]] < lim and not out[s[1]][s[0]]]
        for x, y in stack: out[y][x] = True
        while stack:
            x, y = stack.pop(); comp.append((x, y))
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < w and 0 <= ny < h and not out[ny][nx] and d[ny][nx] < lim: out[ny][nx] = True; stack.append((nx, ny))
        return comp

    fill([(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)], tol)
    seen = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if out[y][x] or seen[y][x] or d[y][x] >= tol * pocket: continue
            comp, stack = [], [(x, y)]; seen[y][x] = True
            while stack:
                cx, cy = stack.pop(); comp.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and not out[ny][nx] and d[ny][nx] < tol * pocket: seen[ny][nx] = True; stack.append((nx, ny))
            if len(comp) >= pocket_min:
                for cx, cy in comp: out[cy][cx] = True
                fill(comp, tol)
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if out[y][x]: px[x, y] = (r, g, b, 0); continue
            edge = any(0 <= nx < w and 0 <= ny < h and out[ny][nx] for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
            if edge and d[y][x] < tol * 1.6: px[x, y] = (r, g, b, int(255 * (d[y][x] - tol) / (tol * .6)) if d[y][x] >= tol else 0)
    return im

def quant(im, colors=192):
    try: return im.quantize(colors=colors, method=Image.Quantize.FASTOCTREE)
    except Exception: return im

def save(im, path, colors=192):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    quant(im, colors).save(path, optimize=True)
    return os.path.getsize(path)

def do_sprite(src, dst):
    im = key_out(Image.open(src)); box = im.getbbox()
    if box: im = im.crop(box)
    k = SPRITE_H / im.height; im = im.resize((max(1, round(im.width * k)), SPRITE_H), Image.LANCZOS)
    return save(im, dst)

def do_portrait(src, dst):
    im = Image.open(src).convert('RGBA'); s = min(im.size); im = im.crop(((im.width - s) // 2, (im.height - s) // 2, (im.width + s) // 2, (im.height + s) // 2))
    return save(im.resize((PORTRAIT, PORTRAIT), Image.LANCZOS), dst)

def do_bg(src, dst):
    im = Image.open(src).convert('RGB'); k = max(BG_W / im.width, BG_H / im.height)
    # a thumbnail source (200 px) holds no detail past 3x: emit it smaller, the game cover-fits any size
    k = min(k, 3.0); ow, oh = min(BG_W, round(im.width * k)), min(BG_H, round(im.height * k))
    if ow / oh > BG_W / BG_H: ow = round(oh * BG_W / BG_H)
    else: oh = round(ow * BG_H / BG_W)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    x0, y0 = (im.width - ow) // 2, (im.height - oh) // 2
    return save(im.crop((x0, y0, x0 + ow, y0 + oh)), dst, 96)  # 15 stages: 96 colours keeps the set under budget

def do_bgw(src, dst):
    # 16:9 desktop stages (Owner 2026-10-27): same 3x rule as the portrait set; full-res originals are capped at 1280 wide
    im = Image.open(src).convert('RGB'); k = min(3.0, 1280 / im.width)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    return save(im, dst, 96)

total, files, wide = 0, [], 0
for kind, fn in (('s', do_sprite), ('p', do_portrait), ('bg', do_bg), ('bgw', do_bgw)):
    d = os.path.join(SRC, kind)
    if not os.path.isdir(d): continue
    for f in sorted(os.listdir(d)):
        if not f.lower().endswith('.png'): continue
        key = kind + '/' + os.path.splitext(f)[0]
        n = fn(os.path.join(d, f), os.path.join(OUT, key + '.png')); files.append(key)
        if kind == 'bgw': wide += n
        else: total += n
        print('%-28s %6d B' % (key, n))
os.makedirs(OUT, exist_ok=True)
json.dump({'files': files, 'bytes': total + wide}, open(os.path.join(OUT, 'manifest.json'), 'w'))
print('total %.1f KB in %d files (+ %.1f KB desktop stages, loaded only on wide screens) -> %s/manifest.json' % (total / 1024, len(files), wide / 1024, OUT))
if wide > 2 * 1024 * 1024: print('WARNING: desktop stages over 2 MB', file=sys.stderr); sys.exit(1)
if total > 3 * 1024 * 1024: print('WARNING: over the 3 MB budget', file=sys.stderr); sys.exit(1)
