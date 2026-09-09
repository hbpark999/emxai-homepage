"""Editable passive PCB/filter examples with a fixed CMC/LISN/source fixture."""
import re
from src.netlist import build

EXAMPLES=['PCB + CMC', 'PCB + CMC + X capacitor', 'PCB + CMC + X/Y (π filter)']

def example(name):
    text=build('B2','ac')
    start=text.index('* ---------------- PCB:')
    end=text.index('* ---------------- LISN,')
    lines=text[start:end].splitlines()
    out=['* Editable PCB B2 passive RLC + filter example', '* CMC, LISN and virtual source are attached by the application.']
    for line in lines:
        if re.match(r'^(LCM1|LCM2|K1)\s',line):continue
        if re.match(r'^[CRL][XY]',line):
            if name==EXAMPLES[0]:continue
            if name==EXAMPLES[1] and re.match(r'^[CRL]Y',line):continue
        out.append(line)
    return '\n'.join(out)+'\n'

def validate_fragment(text):
    if not text.strip():raise ValueError('PCB/filter SPICE is empty')
    names=set();count=0
    for number,line in enumerate(text.splitlines(),1):
        line=line.split(';',1)[0].strip()
        if not line or line.startswith('*'):continue
        parts=line.split()
        if len(parts)!=4 or not re.fullmatch(r'[RLC][A-Za-z0-9_]+',parts[0],re.I):
            raise ValueError(f'Line {number}: R/L/C name node1 node2 value 형식만 지원합니다.')
        if parts[0].lower() in names:raise ValueError(f'Line {number}: duplicate component')
        names.add(parts[0].lower())
        if not all(re.fullmatch(r'[A-Za-z0-9_]+',x) for x in parts[1:3]):raise ValueError('Invalid node')
        if not re.fullmatch(r'(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?(?:meg|[fpnumkg])?',parts[3],re.I):
            raise ValueError(f'Line {number}: positive numeric SPICE value required')
        if float(re.match(r'(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?',parts[3])[0])<=0:
            raise ValueError('Values must be positive')
        count+=1
    if not count:raise ValueError('No RLC components')
    return text

def circuit(fragment,library):
    validate_fragment(fragment)
    base=build('B2','ac')
    tail=base[base.index('* ---------------- LISN,'):]
    # Prefix user elements so their names cannot collide with the fixture.
    rows=[]
    for line in fragment.splitlines():
        if line.strip() and not line.lstrip().startswith('*'):
            p=line.split();p[0]=p[0][0]+'USR_'+p[0][1:];line=' '.join(p)
        rows.append(line)
    return '* User PCB/filter simulation\n'+'\n'.join(rows)+'\n'+tail.replace('.end',
        f'.include "{library}"\nXCMC p11 p13 p12 p14 CMC_SELECTED\n.end')
