# -*- coding: utf-8 -*-
"""
Reestructura el contenido en 25 estaciones planas (una por subpunto).
Cada estación: nombre corto (para el mapa), unidad, título, y su HTML propio.
Genera js/stations.js
"""
import json, math

data = json.loads(open('js/content.js', encoding='utf-8').read().split('=',1)[1].rsplit(';',1)[0])

# nombre corto para el label del mapa (por orden de aparición)
SHORT = {
  'PUNTO 01':'Marketing', 'PUNTO 02':'Orientaciones', 'PUNTO 03':'Necesidad y deseo',
  'PUNTO 04':'Valor', 'PUNTO 05':'Segmentación', 'PUNTO 06':'Buyer Persona',
  'PUNTO 07':'4P · 4C · Marca', 'PUNTO 08':'Digital', 'PUNTO 09':'Ecosistema',
  'PUNTO 10':'El embudo', 'PUNTO 11':'Customer Journey', 'PUNTO 12':'Campañas',
  'PUNTO 13':'Contenidos', 'PUNTO 14':'Territorios', 'PUNTO 15':'Matriz',
  'PUNTO 16':'Social Media', 'PUNTO 17':'Métricas',
  'TRADUCCIÓN 01':'Jerarquía visual', 'TRADUCCIÓN 02':'Diseñar p/ alguien',
  'TRADUCCIÓN 03':'Diseño = valor', 'TRADUCCIÓN 04':'De decorar a resolver',
}

def short_from_kicker(k):
    for key,val in SHORT.items():
        if k.startswith(key): return val
    return k.title()

stations = []
for r in data:
    uni = r.get('uni') or r.get('kicker') or ''
    desc = r.get('desc',''); points = r.get('points','')
    puntos = [b for b in r['blocks'] if b['kind']=='punto']
    intros = [b for b in r['blocks'] if b['kind']!='punto']
    intro_html = "".join(b['html'] for b in intros)

    if puntos:
        # la intro de la unidad se cuelga del primer subpunto
        for j, b in enumerate(puntos):
            st = dict(
                short = short_from_kicker(b['kicker']),
                uni = uni,
                kicker = b['kicker'],
                title = b['title'],
                html = b['html'],
                unit_intro = (intro_html if j==0 else ''),
                unit_desc  = (desc if j==0 else ''),
                unit_points= (points if j==0 else ''),
                is_unit_start = (j==0),
            )
            stations.append(st)
    else:
        # región sin subpuntos (prólogo, horizonte, cierre, referencias)
        st = dict(
            short = r['title'][:22],
            uni = uni,
            kicker = '',
            title = r['title'],
            html = intro_html,
            unit_intro='', unit_desc=desc, unit_points=points,
            is_unit_start=True,
        )
        stations.append(st)

# --------- posiciones sobre el mapa (recorrido serpenteante orgánico) ---------
# distribuimos las 25 estaciones a lo largo de una espiral/serpentina por la isla
N = len(stations)
MW, MH = 3000, 2100
cx, cy = MW/2, MH/2

# curva base: una ruta que recorre el territorio como un sendero
import random
random.seed(7)
pts = []
# serpentina de izquierda-abajo a derecha-arriba con ondulación
for i in range(N):
    t = i/(N-1)
    # eje principal diagonal
    x = -1050 + t*2100
    y = 620*math.sin(t*math.pi*2.15) * (0.5+0.5*math.cos(t*math.pi))
    # inclinar el conjunto
    ang = -0.28
    rx = x*math.cos(ang) - y*math.sin(ang)
    ry = x*math.sin(ang) + y*math.cos(ang)
    # jitter suave para que no sea mecánico
    rx += random.uniform(-40,40)
    ry += random.uniform(-40,40)
    pts.append((cx+rx, cy+ry))

for st,(x,y) in zip(stations, pts):
    st['x'] = round(x); st['y'] = round(y)

with open('js/stations.js','w',encoding='utf-8') as f:
    f.write('export const MAP={w:%d,h:%d,cx:%d,cy:%d};\n'%(MW,MH,cx,cy))
    f.write('export const STATIONS=')
    json.dump(stations, f, ensure_ascii=False)
    f.write(';\n')

print(N,'estaciones generadas')
for i,s in enumerate(stations):
    print(f"  {i:2} {s['short'][:22]:22} ({s['x']},{s['y']})")
