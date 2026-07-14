# -*- coding: utf-8 -*-
"""
Genera el mapa cartográfico como un SVG grande (vista cenital).
Curvas de nivel por marching squares + retícula + rosa de los vientos.
Las estaciones se marcan como <g class="pin" data-i="N"> para que el JS las anime.
"""
import math

# --- ruido fBm (mismo del terreno 3D, para coherencia) ---
def hash(x, y):
    n = math.sin(x*127.1 + y*311.7)*43758.5453123
    return n - math.floor(n)

def vnoise(x, y):
    xi, yi = math.floor(x), math.floor(y)
    xf, yf = x-xi, y-yi
    u = xf*xf*(3-2*xf); v = yf*yf*(3-2*yf)
    a=hash(xi,yi); b=hash(xi+1,yi); c=hash(xi,yi+1); d=hash(xi+1,yi+1)
    return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v

def elev(x, y):
    e=0; amp=1; freq=0.055; norm=0
    for _ in range(5):
        e+=vnoise(x*freq,y*freq)*amp; norm+=amp; amp*=0.5; freq*=2.03
    e/=norm
    d=math.hypot(x,y)/120
    island=max(0,1-d*d*0.85)
    return (e-0.42)*30*island

# --- marching squares → paths de contorno ---
def contour_paths(level, W, H, step):
    segs=[]
    for x in range(-W//2, W//2, step):
        for y in range(-H//2, H//2, step):
            v=[elev(x,y),elev(x+step,y),elev(x+step,y+step),elev(x,y+step)]
            c=[(x,y),(x+step,y),(x+step,y+step),(x,y+step)]
            idx=0
            for i in range(4):
                if v[i]>level: idx|=(1<<i)
            if idx in (0,15): continue
            def lerp(i,j):
                t=(level-v[i])/(v[j]-v[i]+1e-9)
                return (c[i][0]+(c[j][0]-c[i][0])*t, c[i][1]+(c[j][1]-c[i][1])*t)
            E=[lerp(0,1),lerp(1,2),lerp(3,2),lerp(0,3)]
            table={1:[(3,0)],2:[(0,1)],3:[(3,1)],4:[(1,2)],5:[(3,2),(0,1)],
                   6:[(0,2)],7:[(3,2)],8:[(2,3)],9:[(2,0)],10:[(2,3),(0,1)],
                   11:[(2,1)],12:[(1,3)],13:[(1,0)],14:[(0,3)]}
            for a,b in table.get(idx,[]):
                segs.append((E[a],E[b]))
    return segs

# world → svg coords
def W2S(x, y, cx, cy):
    return (cx + x, cy + y)   # 1:1, el mapa es grande

def build_map():
    # lienzo grande: el "territorio" completo
    MW, MH = 2600, 1800
    cx, cy = MW/2, MH/2
    scale = 6.2   # amplifica el mundo (rango ~±120) al lienzo
    step = 3

    parts = [f'<svg id="territory" viewBox="0 0 {MW} {MH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">']

    # fondo papel
    parts.append(f'<rect x="0" y="0" width="{MW}" height="{MH}" fill="#f7f5f0"/>')

    # retícula de coordenadas
    parts.append('<g stroke="#9a9a9a" stroke-width="1" opacity="0.12">')
    G=90
    xg=0
    while xg<=MW:
        parts.append(f'<line x1="{xg}" y1="0" x2="{xg}" y2="{MH}"/>'); xg+=G
    yg=0
    while yg<=MH:
        parts.append(f'<line x1="0" y1="{yg}" x2="{MW}" y2="{yg}"/>'); yg+=G
    parts.append('</g>')

    # curvas de nivel
    levels=[(-9,'#cfcdc6',0.35,'sea'),(-6,'#cfcdc6',0.4,'sea'),(-3,'#cfcdc6',0.5,'sea'),
            (0,'#141414',0.30,'land'),(2.5,'#141414',0.34,'land'),(5,'#141414',0.40,'land'),
            (7.5,'#141414',0.5,'land'),(10,'#141414',0.6,'land'),(12.5,'#141414',0.7,'land')]
    Wr, Hr = 260, 260   # rango del mundo a muestrear
    for lv,col,op,kind in levels:
        segs=contour_paths(lv, Wr, Hr, step)
        if not segs: continue
        d=[]
        for (ax,ay),(bx,by) in segs:
            sx1,sy1=W2S(ax*scale/6.2*1, ay*scale/6.2*1, cx, cy)  # placeholder scale
            # aplicar escala real
            sx1,sy1 = cx+ax*scale, cy+ay*scale
            sx2,sy2 = cx+bx*scale, cy+by*scale
            d.append(f'M{sx1:.1f} {sy1:.1f}L{sx2:.1f} {sy2:.1f}')
        dash = ' stroke-dasharray="2 5"' if kind=='sea' else ''
        parts.append(f'<path d="{"".join(d)}" fill="none" stroke="{col}" stroke-width="1.3" opacity="{op}"{dash}/>')

    # rosa de los vientos (esquina)
    rx,ry,rr=MW-190,190,58
    parts.append(f'<g transform="translate({rx},{ry})" opacity="0.5">')
    parts.append(f'<circle r="{rr}" fill="none" stroke="#141414" stroke-width="1"/>')
    parts.append(f'<circle r="{rr*0.62}" fill="none" stroke="#9a9a9a" stroke-width="0.6"/>')
    for ang,lab in [(0,'N'),(90,'E'),(180,'S'),(270,'O')]:
        a=math.radians(ang-90)
        x2=math.cos(a)*rr; y2=math.sin(a)*rr
        parts.append(f'<line x1="0" y1="0" x2="{x2:.1f}" y2="{y2:.1f}" stroke="#141414" stroke-width="0.8"/>')
        lx=math.cos(a)*(rr+14); ly=math.sin(a)*(rr+14)
        col = '#d8412f' if lab=='N' else '#6b6b6b'
        parts.append(f'<text x="{lx:.1f}" y="{ly+4:.1f}" font-family="Space Grotesk" font-size="13" font-weight="600" fill="{col}" text-anchor="middle">{lab}</text>')
    # aguja
    parts.append(f'<path d="M0 {-rr*0.8} L7 0 L0 {rr*0.3} L-7 0 Z" fill="#d8412f"/>')
    parts.append('</g>')

    parts.append('</svg>')
    return "".join(parts), (MW, MH, cx, cy, scale)

if __name__=='__main__':
    svg,(MW,MH,cx,cy,scale)=build_map()
    open('/home/claude/web2/map.svg','w').write(svg)
    # exportar coordenadas de estaciones en px del SVG
    COORDS=[(-78,62),(-34,16),(22,40),(66,-6),(18,-48),(-40,-66),(-82,-26),(-96,14)]
    px=[(round(cx+x*scale),round(cy+y*scale)) for x,y in COORDS]
    import json
    open('/home/claude/web2/js/coords.js','w').write(
        'export const MAP={w:%d,h:%d};\nexport const PINS=%s;\n'%(MW,MH,json.dumps(px)))
    print('map.svg', len(svg),'bytes · pines:', px)
