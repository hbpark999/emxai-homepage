"""Readable filter schematic; PCB parasitics retained in a separate table."""
import re
import numpy as np
from matplotlib.figure import Figure
import config

def components(text):
    return [p for line in text.splitlines() if (p:=line.split(';')[0].split()) and not p[0].startswith('*')]

def value(raw):
    try:
        m=re.fullmatch(r'([\d.eE+-]+)(meg|[fpnumkg])?',raw,re.I)
        v=float(m[1])*{'':1,'f':1e-15,'p':1e-12,'n':1e-9,'u':1e-6,'m':1e-3,'k':1e3,'meg':1e6,'g':1e9}[(m[2] or '').lower()]
        for scale,suffix in [(1e6,'M'),(1e3,'k'),(1,''),(1e-3,'m'),(1e-6,'µ'),(1e-9,'n'),(1e-12,'p'),(1e-15,'f')]:
            if v>=scale:return f'{v/scale:.3g} {suffix}'
    except (ValueError,TypeError):pass
    return raw

def draw(text):
    rows=components(text);parts={p[0].upper():p for p in rows}
    fig=Figure(figsize=(13,7.3),layout='constrained');ax=fig.add_subplot(111)
    color='#20364e'
    def wire(a,b):ax.plot([a[0],b[0]],[a[1],b[1]],color=color,lw=1.6)
    def label(x,y,t,size=10,ha='center'):ax.text(x,y,t,ha=ha,va='center',fontsize=size,color=color)
    def dot(x,y):ax.plot(x,y,'o',ms=4,color=color)
    def ground(x,y):
        for dy,w in [(0,.28),(-.12,.18),(-.24,.07)]:wire((x-w,y+dy),(x+w,y+dy))
    def symbol(kind,a,b,name):
        a=np.array(a,float);b=np.array(b,float);d=b-a;length=np.linalg.norm(d);u=d/length;v=np.array([-u[1],u[0]])
        mid=(a+b)/2;half=.35
        wire(a,mid-half*u);wire(mid+half*u,b)
        if kind=='C':
            for shift in [-.09,.09]:wire(mid+shift*u-.25*v,mid+shift*u+.25*v)
            wire(mid-half*u,mid-.09*u);wire(mid+.09*u,mid+half*u)
        elif kind=='R':
            q=np.linspace(-half,half,9);z=np.array([0,1,-1,1,-1,1,-1,1,0])*.12
            pts=mid+q[:,None]*u+z[:,None]*v;ax.plot(pts[:,0],pts[:,1],color=color,lw=1.5)
        else:
            t=np.linspace(0,4*np.pi,100);pts=mid+np.linspace(-half,half,100)[:,None]*u+(.18*np.sin(t))[:,None]*v
            ax.plot(pts[:,0],pts[:,1],color=color,lw=1.5)
        if abs(u[0])>.5:label(mid[0],mid[1]+.48,name,9)
        else:label(mid[0]+.4,mid[1],name,9,ha='left')
    # Two explicit line paths, four-terminal coupled choke in the centre.
    for y,left,right in [(6,'p1 / L_IN','p3 / L_OUT'),(2,'p2 / N_IN','p4 / N_OUT')]:
        wire((3,y),(8,y));symbol('L',(8,y),(10,y),'');wire((10,y),(18,y))
        dot(8.15,y+.22);dot(3,y);dot(18,y)
        label(4,y+.38,left,9);label(17.5,y+.38,right,9)
    wire((8.9,2.55),(8.9,5.45));wire((9.1,2.55),(9.1,5.45))
    label(9,7.25,'L1 · CMC-01',12);label(9,6.88,'검증된 4포트 SPICE',9)
    label(7.7,5.7,'p11',8);label(10.25,5.7,'p12',8)
    label(7.7,1.7,'p13',8);label(10.25,1.7,'p14',8)
    for name,x in [('CX1',6),('CX2',12)]:
        if name in parts:
            symbol('C',(x,6),(x,2),name+'  '+value(parts[name][3])+'F');dot(x,6);dot(x,2)
    for name,x,y,end in [('CY1',14,6,4.4),('CY2',16,2,.4)]:
        if name in parts:
            symbol('C',(x,y),(x,end),name+'  '+value(parts[name][3])+'F');ground(x,end);dot(x,y)
    for y,tag in [(6,'L'),(2,'N')]:
        # Supply AC ground through the LISN inductor, receiver branch C + R.
        symbol('L',(3,y),(3,y+1.3),f'{config.LISN_L*1e6:g} µH');ground(3,y+1.3)
        symbol('C',(3,y),(.8,y),f'{config.LISN_C*1e6:g} µF')
        symbol('R',(.8,y),(.8,y-1.3),f'{config.LISN_RES:g} Ω');ground(.8,y-1.3)
        dot(.8,y);label(.25,y+.35,f'V{tag}',9)
    label(1.7,8.15,'LISN · L/N',12)
    wire((18,6),(19.6,6));wire((19.6,6),(19.6,2));wire((19.6,2),(18,2))
    # Source is a block, not an electrical short: break the vertical edge.
    from matplotlib.patches import Rectangle
    ax.add_patch(Rectangle((18.15,2.7),2.7,2.6,facecolor='white',edgecolor=color,lw=1.3,zorder=4))
    ax.text(19.5,4,'가상 CM/DM\n노이즈원',ha='center',va='center',fontsize=10,zorder=5,color=color)
    ax.set(xlim=(-.6,21.2),ylim=(-.4,8.8));ax.axis('off')
    ax.set_title('CE EMI 필터 회로 · L/N 선로와 결합 CMC',fontsize=16,pad=12)
    fig.text(.5,.015,'기능 등가 회로: PCB 배선 RLC·X/Y의 ESR/ESL은 상세표로 분리 (계산에서는 유지) · 접지 기호 = PE / AC 기준',ha='center',fontsize=9,color='#64748b')
    return fig
