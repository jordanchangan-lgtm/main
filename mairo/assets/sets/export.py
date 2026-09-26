import sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, name = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
w, h = im.size
target_w = 2400
tw, th = target_w, round(target_w * 1.25)
# centre-crop to exactly 4:5, then resize
r = w / h
if r > 0.8: nw = round(h * 0.8); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
elif r < 0.8: nh = round(w / 0.8); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
if im.size[0] > tw: im = im.resize((tw, th), Image.LANCZOS)
im.save(name + '.jpg', quality=88, optimize=True, progressive=True, subsampling=0)
import os; print(name, im.size, os.path.getsize(name + '.jpg') // 1024, 'KB')
