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
  'TRADUCCIÓN 01':'Jerarquía visual', 'TRADUCCIÓN 02':'Diseñar para alguien',
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

# --------- posiciones sobre el mapa: zigzag compacto, TODOS en tierra ---------
N = len(stations)
MW, MH = 3000, 2100
cx, cy = MW/2, MH/2
SCALE = 6.4   # mismo scale que mapgen.py

# --- relieve (idéntico a mapgen.py) para saber qué es tierra ---
def _hsh(x,y):
    n=math.sin(x*127.1+y*311.7)*43758.5453123
    return n-math.floor(n)
def _vn(x,y):
    xi,yi=math.floor(x),math.floor(y); xf,yf=x-xi,y-yi
    u=xf*xf*(3-2*xf); v=yf*yf*(3-2*yf)
    a=_hsh(xi,yi);b=_hsh(xi+1,yi);c=_hsh(xi,yi+1);d=_hsh(xi+1,yi+1)
    return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v
def _elev_world(x,y):
    e=0;amp=1;freq=0.055;norm=0
    for _ in range(5):
        e+=_vn(x*freq,y*freq)*amp;norm+=amp;amp*=0.5;freq*=2.03
    e/=norm
    d=math.hypot(x,y)/122
    island=max(0,1-d*d*0.92)
    return (e-0.40)*30*island

# elevación en coords de PÍXEL del SVG, con suavizado que imita al del mapa (gaussian sigma~2.4)
def elev_px(px, py):
    wx=(px-cx)/SCALE; wy=(py-cy)/SCALE
    # promedio ponderado 5x5 (aprox del gaussian_filter del mapa)
    s=0; wsum=0
    for dx in range(-4,5,2):
        for dy in range(-4,5,2):
            w=math.exp(-(dx*dx+dy*dy)/(2*2.4*2.4))
            s+=_elev_world(wx+dx,wy+dy)*w; wsum+=w
    return s/wsum

def is_land(px,py):
    # tierra firme con margen: bien por encima del nivel de costa y lejos de lagos
    if elev_px(px,py) <= 2.6:      # umbral alto => evita costa y lagos
        return False
    # además, chequear un anillo alrededor: que no haya agua muy cerca
    for a in range(0,360,45):
        nx=px+34*math.cos(math.radians(a)); ny=py+34*math.sin(math.radians(a))
        if elev_px(nx,ny) <= 1.2:
            return False
    return True

def push_to_land(px, py):
    """Si el punto cae en agua, buscar el punto de tierra firme más cercano (espiral)."""
    if is_land(px,py): return px,py
    for r in range(10, 340, 10):
        for a in range(0, 360, 20):
            nx=px+r*math.cos(math.radians(a))
            ny=py+r*math.sin(math.radians(a))
            if is_land(nx,ny):
                return nx,ny
    return px,py   # fallback

import random
random.seed(4)

# ---- RECORRIDO distribuido por TODO el mapa (arriba, abajo, distintas zonas) ----
#    Los cruces están permitidos; lo que cuidamos es: todos en tierra, buena
#    separación entre pines, y orden narrativo 1->2->3 que la ruta conecta.

# tierra en cualquier dirección (no solo vertical): busca el punto de tierra más cercano
def to_land_any(x, y, maxr=240):
    if is_land(x, y): return (x, y)
    for r in range(12, maxr+1, 12):
        for a in range(0, 360, 15):
            nx = x + r*math.cos(math.radians(a))
            ny = y + r*math.sin(math.radians(a))
            if is_land(nx, ny): return (nx, ny)
    return (x, y)

# waypoints repartidos por toda la isla, saltando entre zonas (arriba/abajo/lados).
# El orden es el del recorrido; se eligieron para cubrir bien el territorio.
WPTS = [
    (1010, 1250),  # 0  oeste (masa izq)
    (1010, 1400),  # 1  sur-oeste
    (1200, 1400),  # 2  sur
    (1290, 1270),  # 3  este de masa izq
    (1160, 1180),  # 4  centro-oeste
    (1090,  950),  # 5  sube a la península
    (1100,  790),  # 6  NORTE (punta península)
    (1230,  880),  # 7  norte-este
    (1310, 1160),  # 8  baja al centro-este de masa izq
    (1140, 1290),  # 9  vuelve al sur-oeste
    (1560, 1130),  # 10 PUENTE a masa derecha (centro)
    (1620, 1000),  # 11 norte de masa derecha
    (1780, 1030),  # 12 norte-este
    (1950, 1050),  # 13 noreste
    (2080, 1150),  # 14 este (borde)
    (2000, 1290),  # 15 sur-este
    (1850, 1310),  # 16 sur de masa derecha
    (1680, 1290),  # 17 sur-centro derecha
    (1720, 1130),  # 18 centro de masa derecha
    (1880, 1180),  # 19 este-centro
    (1560, 1250),  # 20 baja centro-derecha
    (1450, 1080),  # 21 vuelve por el norte del puente
    (1280, 1350),  # 22 salta al sur de masa izq
    (1050, 1130),  # 23 oeste
    (1180, 1010),  # 24 centro-norte (fin)
]
# ajustar todos a tierra
pts = [to_land_any(x, y) for (x, y) in WPTS]

# separar TODOS los pines por relajación (empuje simétrico), manteniéndolos en tierra
MINSEP = 112
for it in range(40):
    disp = [[0.0,0.0] for _ in pts]
    for i in range(len(pts)):
        for j in range(i+1, len(pts)):
            dx=pts[i][0]-pts[j][0]; dy=pts[i][1]-pts[j][1]
            dd=math.hypot(dx,dy) or 0.001
            if dd < MINSEP:
                f=(MINSEP-dd)/2
                ux,uy=dx/dd, dy/dd
                disp[i][0]+=ux*f; disp[i][1]+=uy*f
                disp[j][0]-=ux*f; disp[j][1]-=uy*f
    moved=0
    for i in range(len(pts)):
        if abs(disp[i][0])<0.5 and abs(disp[i][1])<0.5: continue
        nx=pts[i][0]+disp[i][0]*0.5
        ny=pts[i][1]+disp[i][1]*0.5
        cand=to_land_any(nx,ny)
        pts[i]=cand; moved+=1
    if moved==0: break


for st,(x,y) in zip(stations, pts):
    st['x'] = round(x); st['y'] = round(y)

# --------- ciudades reales del recorrido (coordenadas geográficas verdaderas) ---------
# El viaje personal de Nina como metáfora del recorrido de aprendizaje:
# empieza en casa (Montevideo), cruza Europa, y vuelve a casa (El Pinar).
CITIES = [
    ("Montevideo",      -34.9011, -56.1645),
    ("Madrid",           40.4168,  -3.7038),
    ("Barcelona",        41.3874,   2.1686),
    ("Lisboa",           38.7223,  -9.1393),
    ("Dublín",           53.3498,  -6.2603),
    ("Londres",          51.5074,  -0.1278),
    ("Edimburgo",        55.9533,  -3.1883),
    ("París",            48.8566,   2.3522),
    ("Luxemburgo",       49.6116,   6.1319),
    ("Montecarlo",       43.7384,   7.4246),
    ("Zúrich",           47.3769,   8.5417),
    ("Roma",             41.9028,  12.4964),
    ("Bruselas",         50.8503,   4.3517),
    ("Ámsterdam",        52.3676,   4.9041),
    ("Copenhague",       55.6761,  12.5683),
    ("Berlín",           52.5200,  13.4050),
    ("Praga",            50.0755,  14.4378),
    ("Viena",            48.2082,  16.3738),
    ("Varsovia",         52.2297,  21.0122),
    ("Budapest",         47.4979,  19.0402),
    ("Zagreb",           45.8150,  15.9819),
    ("Andorra la Vella", 42.5063,   1.5218),
    ("Brujas",           51.2093,   3.2247),
    ("Salamanca",        40.9701,  -5.6635),
    ("El Pinar",        -34.7967, -55.8981),
]
for st, (city, lat, lon) in zip(stations, CITIES):
    st['city'] = city
    st['lat'] = lat
    st['lon'] = lon

with open('js/stations.js','w',encoding='utf-8') as f:
    f.write('export const MAP={w:%d,h:%d,cx:%d,cy:%d};\n'%(MW,MH,cx,cy))
    f.write('export const STATIONS=')
    json.dump(stations, f, ensure_ascii=False)
    f.write(';\n')

print(N,'estaciones generadas')
for i,s in enumerate(stations):
    print(f"  {i:2} {s['short'][:22]:22} ({s['x']},{s['y']})")
