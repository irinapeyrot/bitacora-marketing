# -*- coding: utf-8 -*-
tpl = open('index.template.html', encoding='utf-8').read()
svg = open('map.svg', encoding='utf-8').read()
out = tpl.replace('<!--MAP_SVG-->', svg)
open('index.html', 'w', encoding='utf-8').write(out)
print('index.html', len(out), 'bytes')
