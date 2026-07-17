# -*- coding: utf-8 -*-
"""Mapa estilo Google Maps con ZONAS ORGÁNICAS reales:
áreas rellenas que calcan el relieve (contornos por nivel via matplotlib)."""
import math
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# ---------- ruido fBm (mismo relieve de siempre) ----------
def hsh(x,y):
    n=math.sin(x*127.1+y*311.7)*43758.5453123
    return n-math.floor(n)
def vn(x,y):
    xi,yi=math.floor(x),math.floor(y); xf,yf=x-xi,y-yi
    u=xf*xf*(3-2*xf); v=yf*yf*(3-2*yf)
    a=hsh(xi,yi);b=hsh(xi+1,yi);c=hsh(xi,yi+1);d=hsh(xi+1,yi+1)
    return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v
def elev(x,y):
    e=0;amp=1;freq=0.055;norm=0
    for _ in range(5):
        e+=vn(x*freq,y*freq)*amp;norm+=amp;amp*=0.5;freq*=2.03
    e/=norm
    d=math.hypot(x,y)/122
    island=max(0,1-d*d*0.92)
    return (e-0.40)*30*island

# Paleta Google Maps
C_WATER='#aad3e5'; C_WATER2='#a1cede'
C_SAND='#f3ecdb'; C_LAND='#eff1ea'; C_GREEN1='#dcebd0'; C_GREEN2='#c9dfb4'
C_CONTOUR='#c2cbb4'; C_GRID='#cfdbd4'; C_COAST='#8fb9cf'

def paths_for_band(X, Y, Z, lo, hi, cx, cy, scale):
    """Devuelve paths SVG de las áreas donde lo<=Z<hi, calcando la forma real."""
    fig, ax = plt.subplots()
    cs = ax.contourf(X, Y, Z, levels=[lo, hi])
    paths=[]
    for pth in cs.get_paths():
        subs=[]
        for poly in pth.to_polygons(closed_only=True):
            if len(poly) < 4: continue
            subs.append('M' + ' L'.join(f'{cx+px*scale:.1f} {cy+py*scale:.1f}' for px,py in poly) + ' Z')
        if subs:
            paths.append(' '.join(subs))   # subpaths juntos => evenodd hace los agujeros, sin puentes
    plt.close(fig)
    return paths

def contour_lines(X, Y, Z, levels, cx, cy, scale):
    fig, ax = plt.subplots()
    cs = ax.contour(X, Y, Z, levels=levels)
    segs=[]
    for pth in cs.get_paths():
        v=pth.vertices
        if len(v)<2: continue
        # partir donde el salto entre puntos consecutivos es anormalmente grande (puente)
        run=[v[0]]
        for k in range(1,len(v)):
            import math as _m
            if _m.hypot(v[k][0]-v[k-1][0], v[k][1]-v[k-1][1])>8:
                if len(run)>1:
                    segs.append('M'+' L'.join(f'{cx+px*scale:.1f} {cy+py*scale:.1f}' for px,py in run))
                run=[v[k]]
            else:
                run.append(v[k])
        if len(run)>1:
            segs.append('M'+' L'.join(f'{cx+px*scale:.1f} {cy+py*scale:.1f}' for px,py in run))
    plt.close(fig)
    return segs

def build(MW,MH,cx,cy,scale):
    R=165
    xs=np.linspace(-R,R,300)
    ys=np.linspace(-R,R,300)
    X,Y=np.meshgrid(xs,ys)
    Z=np.vectorize(elev)(X,Y)
    from scipy.ndimage import gaussian_filter
    Z=gaussian_filter(Z, sigma=2.4)   # suaviza mesetas => contornos limpios

    p=[f'<svg id="territory" viewBox="0 0 {MW} {MH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">']
    # océano de fondo
    p.append(f'<rect x="0" y="0" width="{MW}" height="{MH}" fill="{C_WATER}"/>')

    # bandas de tierra (de baja a alta), cada una calcando su forma
    bands=[(0.05,0.9,C_SAND),(0.9,4.0,C_LAND),(4.0,7.5,C_GREEN1),(7.5,40,C_GREEN2)]
    for lo,hi,col in bands:
        for d in paths_for_band(X,Y,Z,lo,hi,cx,cy,scale):
            p.append(f'<path d="{d}" fill="{col}" fill-rule="evenodd"/>')

    # lagos interiores (sobre campo suavizado, ya sin franjas)
    import numpy as _np
    Dc=_np.hypot(X,Y)
    Zin=_np.where(Dc<98, Z, 5.0)
    for d in paths_for_band(X,Y,Zin,-30,-1.4,cx,cy,scale):
        p.append(f'<path d="{d}" fill="{C_WATER2}" fill-rule="evenodd"/>')

    # costa marcada
    for d in contour_lines(X,Y,Z,[0.0],cx,cy,scale):
        p.append(f'<path d="{d}" fill="none" stroke="{C_COAST}" stroke-width="2.2" opacity="0.8"/>')

    # retícula tenue
    p.append(f'<g stroke="{C_GRID}" stroke-width="1" opacity="0.2">')
    G=220; x=0
    while x<=MW:p.append(f'<line x1="{x}" y1="0" x2="{x}" y2="{MH}"/>');x+=G
    y=0
    while y<=MH:p.append(f'<line x1="0" y1="{y}" x2="{MW}" y2="{y}"/>');y+=G
    p.append('</g>')
    p.append('</svg>')
    return "".join(p)

if __name__=='__main__':
    sj=open('js/stations.js').read()
    MW=int(sj.split('w:')[1].split(',')[0]); MH=int(sj.split('h:')[1].split(',')[0])
    cx=MW//2; cy=MH//2; scale=6.4
    svg=build(MW,MH,cx,cy,scale)
    open('map.svg','w').write(svg)
    print('map.svg',len(svg),'bytes',MW,'x',MH)
