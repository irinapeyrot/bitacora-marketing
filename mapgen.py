# -*- coding: utf-8 -*-
"""Mapa estilo Google Maps: raster fino + blur fuerte = zonas orgánicas sin cuadrados."""
import math

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
    d=math.hypot(x,y)/135
    island=max(0,1-d*d*0.8)
    return (e-0.40)*30*island

def march(level,Wr,Hr,step):
    segs=[]
    for x in range(-Wr//2,Wr//2,step):
        for y in range(-Hr//2,Hr//2,step):
            v=[elev(x,y),elev(x+step,y),elev(x+step,y+step),elev(x,y+step)]
            c=[(x,y),(x+step,y),(x+step,y+step),(x,y+step)]
            idx=0
            for i in range(4):
                if v[i]>level: idx|=(1<<i)
            if idx in(0,15):continue
            def lp(i,j):
                t=(level-v[i])/(v[j]-v[i]+1e-9)
                return(c[i][0]+(c[j][0]-c[i][0])*t,c[i][1]+(c[j][1]-c[i][1])*t)
            E=[lp(0,1),lp(1,2),lp(3,2),lp(0,3)]
            tb={1:[(3,0)],2:[(0,1)],3:[(3,1)],4:[(1,2)],5:[(3,2),(0,1)],6:[(0,2)],
                7:[(3,2)],8:[(2,3)],9:[(2,0)],10:[(2,3),(0,1)],11:[(2,1)],12:[(1,3)],
                13:[(1,0)],14:[(0,3)]}
            for a,b in tb.get(idx,[]):
                segs.append((E[a],E[b]))
    return segs

C_WATER='#aad3e5'; C_WATER2='#a1cede'
C_SAND='#f2ead9'; C_LAND='#eef0e8'; C_GREEN1='#dcebd0'; C_GREEN2='#cbe0b8'
C_CONTOUR='#c2cbb4'; C_GRID='#cfdbd4'; C_COAST='#8fb9cf'

def build(MW,MH,cx,cy,scale):
    Wr,Hr=310,310
    p=[f'<svg id="territory" viewBox="0 0 {MW} {MH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">']
    # blur FUERTE para fundir las celdas en manchas orgánicas
    p.append(f'<rect x="0" y="0" width="{MW}" height="{MH}" fill="{C_WATER}"/>')
    cell=9
    def color_for(e):
        if e<-1.5:return None
        if e<0.5:return C_SAND
        if e<4:return C_LAND
        if e<7.5:return C_GREEN1
        return C_GREEN2
    # tierra como CÍRCULOS solapados (radio > paso) => manchas redondeadas, sin cuadrados
    r=cell*scale*0.95
    p.append('<g>')
    for gx in range(-Wr//2,Wr//2,cell):
        for gy in range(-Hr//2,Hr//2,cell):
            col=color_for(elev(gx+cell/2,gy+cell/2))
            if col is None:continue
            sx=cx+gx*scale;sy=cy+gy*scale
            p.append(f'<circle cx="{sx:.0f}" cy="{sy:.0f}" r="{r:.0f}" fill="{col}"/>')
    p.append('</g>')
    # lagos interiores como círculos solapados
    rl=cell*scale*1.05
    p.append('<g>')
    for gx in range(-Wr//2,Wr//2,cell):
        for gy in range(-Hr//2,Hr//2,cell):
            e=elev(gx+cell/2,gy+cell/2)
            if not(-1.5<e<-0.3 and math.hypot(gx,gy)<100):continue
            neigh=sum(1 for dx in(-cell,0,cell) for dy in(-cell,0,cell)
                      if -1.5<elev(gx+dx+cell/2,gy+dy+cell/2)<-0.3)
            if neigh<8:continue
            sx=cx+gx*scale;sy=cy+gy*scale
            p.append(f'<circle cx="{sx:.0f}" cy="{sy:.0f}" r="{rl:.0f}" fill="{C_WATER2}"/>')
    p.append('</g>')
    # curvas de nivel finas
    for lv in [1.5,4,6.5,9]:
        segs=march(lv,Wr,Hr,3)
        d=[f'M{cx+a[0]*scale:.1f} {cy+a[1]*scale:.1f}L{cx+b[0]*scale:.1f} {cy+b[1]*scale:.1f}' for a,b in segs]
        p.append(f'<path d="{"".join(d)}" fill="none" stroke="{C_CONTOUR}" stroke-width="1" opacity="0.4"/>')
    # costa
    segs=march(0,Wr,Hr,3)
    d=[f'M{cx+a[0]*scale:.1f} {cy+a[1]*scale:.1f}L{cx+b[0]*scale:.1f} {cy+b[1]*scale:.1f}' for a,b in segs]
    p.append(f'<path d="{"".join(d)}" fill="none" stroke="{C_COAST}" stroke-width="2.2" opacity="0.8"/>')
    # retícula tenue y espaciada
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
