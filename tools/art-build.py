#!/usr/bin/env python3
"""Art pipeline (ADR-003): img-src/{p,s,bg}/*.png  ->  public/img/{p,s,bg}/*.png

- s/  battle sprites on a flat green key colour: key out, trim, scale to SPRITE_H px tall
- p/  dialogue portraits: scale to PORTRAIT px square
- bg/ vertical stage backgrounds: cover-fit to BG_W x BG_H
Every output is palette-quantised (<=192 colours, backgrounds 96) to keep the whole set under the 3 MB budget.
Usage: python3 tools/art-build.py [--src img-src] [--out public/img]
"""
import os, sys, math, json
from PIL import Image

SPRITE_H, PORTRAIT, BG_W, BG_H = 192, 256, 540, 960
args = dict(zip(sys.argv[1::2], sys.argv[2::2]))
SRC, OUT = args.get('--src', 'img-src'), args.get('--out', 'public/img')

def key_out(im, tol=48):
    im = im.convert('RGBA'); px = im.load(); w, h = im.size
    corners = [px[2, 2], px[w - 3, 2], px[2, h - 3], px[w - 3, h - 3]]
    bg = max(set(corners), key=corners.count)
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            d = math.sqrt((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2)
            if d < tol: px[x, y] = (r, g, b, 0)
            elif d < tol * 1.6: px[x, y] = (r, g, b, int(255 * (d - tol) / (tol * .6)))
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

total, files = 0, []
for kind, fn in (('s', do_sprite), ('p', do_portrait), ('bg', do_bg)):
    d = os.path.join(SRC, kind)
    if not os.path.isdir(d): continue
    for f in sorted(os.listdir(d)):
        if not f.lower().endswith('.png'): continue
        key = kind + '/' + os.path.splitext(f)[0]
        n = fn(os.path.join(d, f), os.path.join(OUT, key + '.png')); total += n; files.append(key)
        print('%-28s %6d B' % (key, n))
os.makedirs(OUT, exist_ok=True)
json.dump({'files': files, 'bytes': total}, open(os.path.join(OUT, 'manifest.json'), 'w'))
print('total %.1f KB in %d files -> %s/manifest.json' % (total / 1024, len(files), OUT))
if total > 3 * 1024 * 1024: print('WARNING: over the 3 MB budget', file=sys.stderr); sys.exit(1)
