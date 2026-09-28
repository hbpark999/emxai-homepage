/**
 * usb-ac-pad/component.js
 * public/tools/usb-ac-pad/index.html의 인라인 모듈을 그대로 옮긴 사본이다.
 * 화면과 MCP가 같은 코드를 쓰도록 수정 없이 복사한다.
 * 갱신 절차: index.html을 고친 뒤 scripts/extract-usb-ac-pad.mjs로 다시 뽑는다.
 */
/* Local passive two-terminal component import. No eval, includes, or networking.
 * S2P must describe a deembedded series-through element, not a grounded fixture.
 * SPICE subset: numeric passive R/L/C, constant .param, internal .SUBCKT/X.
 */
(function(root){'use strict';
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],abs=a=>Math.hypot(...a);
function div(a,b){const d=b[0]*b[0]+b[1]*b[1];if(d<1e-40)throw Error('부품 회로가 특이 행렬입니다.');return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d];}
function number(t,params={}){t=String(t).trim().toLowerCase();if(/^\{\w+\}$/.test(t))t=t.slice(1,-1);if(Object.hasOwn(params,t))return params[t];
 const m=t.match(/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(meg|mil|[tgkmunpf])?([a-z]*)$/i);
 if(!m||!['','ohm','ohms','f','h'].includes(m[3]))throw Error('지원하지 않는 SPICE 값/수식: '+t);
 const v=Number(m[1])*({t:1e12,g:1e9,meg:1e6,k:1e3,m:1e-3,u:1e-6,n:1e-9,p:1e-12,f:1e-15,mil:25.4e-6}[m[2]]||1);
 if(!Number.isFinite(v))throw Error('유한한 소자값이 필요합니다.');return v;}
function gammaY(y){return div(sub([1,0],mul([50,0],y)),add([1,0],mul([50,0],y)));}
function solve(A,b){A=A.map((r,i)=>r.map(v=>v.slice()).concat([b[i].slice()]));const n=A.length;
 for(let k=0;k<n;k++){let p=k;for(let i=k+1;i<n;i++)if(abs(A[i][k])>abs(A[p][k]))p=i;
 if(abs(A[p][k])<1e-28)throw Error('SPICE 노드 행렬이 특이합니다.');[A[p],A[k]]=[A[k],A[p]];const v=A[k][k];
 for(let j=k;j<=n;j++)A[k][j]=div(A[k][j],v);
 for(let i=0;i<n;i++)if(i!==k){const v=A[i][k];for(let j=k;j<=n;j++)A[i][j]=sub(A[i][j],mul(v,A[k][j]));}}
 return A.map(r=>r[n]);}
function spice(text,top=''){
 const physical=text.replace(/^\uFEFF/,'').split(/\r?\n/),lines=[];
 for(let line of physical){line=line.trim();if(!line||line.startsWith('*'))continue;line=line.split(/[;$]/)[0].trim();if(!line)continue;
 if(line.startsWith('+')){if(!lines.length)throw Error('잘못된 continuation');lines[lines.length-1]+=' '+line.slice(1);}else lines.push(line);}
 const definitions={},globalParams={},loose=[];let active=null;
 function assignments(tokens,env){for(const token of tokens){if(token.toLowerCase()==='params:')continue;const m=token.match(/^(\w+)=(.+)$/);if(!m)throw Error('상수 NAME=VALUE 형식만 지원: '+token);env[m[1].toLowerCase()]=number(m[2],env);}}
 for(const line of lines){const t=line.split(/\s+/),op=t[0].toLowerCase();
 if(op==='.subckt'){if(active||t.length<4)throw Error('잘못된 .SUBCKT');const split=t.findIndex((v,i)=>i>1&&(v.includes('=')||v.toLowerCase()==='params:'));
 const end=split<0?t.length:split;active={name:t[1].toLowerCase(),pins:t.slice(2,end).map(v=>v.toLowerCase()),defaults:t.slice(end),lines:[]};
 if(definitions[active.name])throw Error('중복 .SUBCKT');definitions[active.name]=active;
 }else if(op==='.ends'){if(!active)throw Error('대응하지 않는 .ENDS');active=null;
 }else if(op==='.end'){if(active)throw Error('.ENDS 누락');
 }else if(op==='.param'&&!active)assignments(t.slice(1),globalParams);
 else if(active)active.lines.push(t);
 else if(op.startsWith('.'))throw Error('지원하지 않는 SPICE 명령: '+op);
 else loose.push(t);}
 if(active)throw Error('.ENDS 누락');const names=Object.keys(definitions);let def;
 if(names.length){if(loose.length)throw Error('라이브러리 밖 회로/제목 줄을 제거하고 .SUBCKT만 제공해 주세요.');if(!top&&names.length!==1)throw Error('여러 .SUBCKT가 있습니다. 사용할 이름을 입력하세요.');def=definitions[(top||names[0]).toLowerCase()];if(!def)throw Error('지정한 .SUBCKT를 찾지 못했습니다.');}
 else {throw Error('2단자 .SUBCKT 모델이 필요합니다.');}
 if(def.pins.length!==2||def.pins[0]===def.pins[1])throw Error('최상위 .SUBCKT는 서로 다른 2개 단자여야 합니다.');
 const elements=[];
 function expand(d,pins,scope,env,overrides=[],depth=0){if(depth>8)throw Error('서브회로 재귀/깊이 제한');env={...env};assignments(d.defaults,env);assignments(overrides,env);
 const map=new Map(d.pins.map((p,i)=>[p,pins[i]])),seen=new Set();function node(s){s=s.toLowerCase();if(s==='0'||s==='gnd')throw Error('외부 접지 0/GND가 있는 모델은 현재 floating gap에 연결할 수 없습니다.');return map.get(s)||scope+s;}
 for(const t of d.lines){const op=t[0].toLowerCase();if(op==='.param'){assignments(t.slice(1),env);continue;}
 if(seen.has(op))throw Error('중복 소자 이름');seen.add(op);
 if(op[0]==='x'){const k=t.findIndex((v,i)=>i>0&&(v.includes('=')||v.toLowerCase()==='params:')),end=k<0?t.length:k,child=definitions[t[end-1].toLowerCase()];
 if(!child||end-2!==child.pins.length)throw Error('내부 X 서브회로/단자 수 오류');expand(child,t.slice(1,end-1).map(node),scope+op+'/',env,t.slice(end),depth+1);continue;}
 if(!['r','l','c'].includes(op[0])||t.length!==4)throw Error('지원 범위 밖 소자/옵션: '+t.join(' '));
 const value=number(t[3],env);if(value<0)throw Error('음수 소자는 지원하지 않습니다.');elements.push({type:op[0],a:node(t[1]),b:node(t[2]),value});if(elements.length>128)throw Error('소자 128개 제한');}}
 expand(def,['P','N'],'',globalParams);
 if(!elements.length)throw Error('빈 SPICE 회로');
 function admittance(freq){const parent=new Map();function find(n){if(!parent.has(n))parent.set(n,n);if(parent.get(n)!==n)parent.set(n,find(parent.get(n)));return parent.get(n);}
 for(const e of elements)if((e.type==='r'&&e.value===0)||(e.type==='l'&&(e.value===0||freq===0)))parent.set(find(e.a),find(e.b));
 const p=find('P'),n=find('N');if(p===n)return null;
 const edges=[];for(const e of elements){const a=find(e.a),b=find(e.b);if(a===b||(e.type==='c'&&(e.value===0||freq===0)))continue;
 let y;if(e.type==='r')y=[1/e.value,0];else if(e.type==='l')y=[0,-1/(2*Math.PI*freq*e.value)];else y=[0,2*Math.PI*freq*e.value];edges.push({a,b,y});}
 const reachable=new Set([p]);for(let count=0;count<=edges.length;count++){let changed=false;for(const e of edges)if(reachable.has(e.a)||reachable.has(e.b)){const size=reachable.size;reachable.add(e.a);reachable.add(e.b);changed||=reachable.size!==size;}if(!changed)break;}
 if(!reachable.has(n))return [0,0];const nodes=[...reachable].filter(v=>v!==p&&v!==n);if(nodes.length>32)throw Error('내부 노드 32개 제한');const ids=new Map(nodes.map((v,i)=>[v,i])),A=nodes.map(()=>nodes.map(()=>[0,0])),rhs=nodes.map(()=>[0,0]);
 for(const e of edges)for(const [a,b] of [[e.a,e.b],[e.b,e.a]])if(ids.has(a)){const i=ids.get(a);A[i][i]=add(A[i][i],e.y);if(ids.has(b))A[i][ids.get(b)]=sub(A[i][ids.get(b)],e.y);else if(b===p)rhs[i]=add(rhs[i],e.y);}
 const v=solve(A,rhs),voltage=a=>a===p?[1,0]:(a===n?[0,0]:v[ids.get(a)]);let current=[0,0];for(const e of edges){if(e.a===p)current=add(current,mul(e.y,sub([1,0],voltage(e.b))));if(e.b===p)current=add(current,mul(e.y,sub([1,0],voltage(e.a))));}return current;}
 const y0=admittance(0),y1=admittance(1000),y2=admittance(2000),c1=y1?y1[1]/(2000*Math.PI):0,c2=y2?y2[1]/(4000*Math.PI):0;
 const cap=!!y0&&abs(y0)<1e-15&&c1>0&&Math.abs(c1-c2)<c1*.01&&Math.abs(y1[0])<Math.abs(y1[1])*.01;
 return {kind:'spice',name:def.name,elements:elements.length,capacitanceNF:cap?c1*1e9:null,
 gamma:f=>f.map(v=>{const y=admittance(v);return y===null?[-1,0]:gammaY(y);}),description:`SPICE ${def.name} · RLC ${elements.length}개 · ${cap?'DC 개방, 저주파 C '+(c1*1e9).toPrecision(5)+' nF':'TDR 미지원: 단순 저주파 커패시터 조건 미확인'}`};
}
function s2p(text){let unit=1e9,format='ma',reference=50,order='21_12',count=null,version=1,ended=false,pendingReference=false;const values=[];
 for(let line of text.replace(/^\uFEFF/,'').split(/\r?\n/)){line=line.split('!')[0].trim();if(!line)continue;if(ended)throw Error('[End] 뒤 데이터');
 if(pendingReference){const a=line.split(/\s+/).map(Number);if(!a.length||a.length>2||a.some(v=>!(v>0))||(a.length===2&&a[0]!==a[1]))throw Error('동일한 양의 포트 기준 임피던스만 지원');reference=a[0];pendingReference=false;continue;}
 if(line.startsWith('#')){const t=line.slice(1).trim().toLowerCase().split(/\s+/);let parameter='s';for(let i=0;i<t.length;i++){if({hz:1,khz:1e3,mhz:1e6,ghz:1e9}[t[i]])unit={hz:1,khz:1e3,mhz:1e6,ghz:1e9}[t[i]];else if(['ri','ma','db'].includes(t[i]))format=t[i];else if(t[i]==='s')parameter='s';else if(t[i]==='r'){reference=Number(t[++i]);}else throw Error('S 파라미터 RI/MA/DB 옵션만 지원');}if(parameter!=='s'||!(reference>0))throw Error('잘못된 S2P 옵션');continue;}
 if(line.startsWith('[')){const m=line.match(/^\[([^\]]+)\]\s*(.*)$/);if(!m)throw Error('잘못된 Touchstone 키워드');const key=m[1].toLowerCase(),arg=m[2].trim();
 if(key==='version'){version=Number(arg);if(![2,2.1].includes(version))throw Error('Touchstone 1/2/2.1 지원');}
 else if(key==='number of ports'){if(Number(arg)!==2)throw Error('2-port만 지원');}
 else if(key==='number of frequencies')count=Number(arg);
 else if(key==='two-port data order'){if(!['21_12','12_21'].includes(arg))throw Error('지원하지 않는 포트 순서');order=arg;}
 else if(key==='matrix format'){if(arg.toLowerCase()!=='full')throw Error('Full S행렬만 지원');}
 else if(key==='reference'){if(arg){const r=arg.split(/\s+/).map(Number);if(r.length>2||r.some(v=>!(v>0))||(r.length===2&&r[0]!==r[1]))throw Error('동일 포트 기준 임피던스 필요');reference=r[0];}else pendingReference=true;}
 else if(key==='network data'){}else if(key==='end')ended=true;else throw Error('지원하지 않는 Touchstone 키워드: '+key);continue;}
 const row=line.split(/\s+/).map(Number);if(!row.every(Number.isFinite))throw Error('비수치 S2P 데이터');values.push(...row);if(values.length>9*20000)throw Error('S2P 20,000점 제한');}
 if(pendingReference||values.length%9||values.length<18)throw Error('S2P 데이터 길이 오류');const points=[];let seriesError=0;
 for(let i=0;i<values.length;i+=9){const f=values[i]*unit;if(f<0||(points.length&&f<=points.at(-1).f))throw Error('증가하는 주파수 필요');const pairs=[];for(let k=0;k<4;k++){let a=values[i+1+2*k],b=values[i+2+2*k];if(format!=='ri'){if(format==='ma'&&a<0)throw Error('음수 MA 크기');a=format==='db'?10**(a/20):a;b*=Math.PI/180;pairs.push([a*Math.cos(b),a*Math.sin(b)]);}else pairs.push([a,b]);}
 if(!Number.isFinite(f)||!Number.isFinite(reference)||!pairs.flat().every(Number.isFinite))throw Error('Nonfinite S2P value');
 const [s11,a,b,s22]=pairs,s21=order==='21_12'?a:b,s12=order==='21_12'?b:a;
 const error=Math.max(abs(sub(s11,s22)),abs(sub(s21,s12)),abs(sub(add(s11,s21),[1,0])));seriesError=Math.max(seriesError,error);
 if(error>1e-3)throw Error('S2P가 floating 직렬 2단자 모델과 맞지 않습니다. 접지 기생/fixture/기준면 확인 필요 (잔차 '+error.toExponential(2)+')');
 const g=div(sub(mul([2*reference,0],s11),mul([50,0],s21)),add(mul([2*reference,0],s11),mul([50,0],s21)));
 if(!g.every(Number.isFinite)||abs(g)>1+1e-6)throw Error('수동성 위반 부품 모델');points.push({f,g});}
 if(count!==null&&count!==points.length)throw Error('Number of Frequencies 불일치');
 return {kind:'s2p',points,reference,seriesError,minHz:points[0].f,maxHz:points.at(-1).f,
 description:`S2P · ${points.length}점 · ${points[0].f/1e6} MHz–${points.at(-1).f/1e9} GHz · R ${reference}Ω · 직렬성 잔차 ${seriesError.toExponential(2)}`,
 gamma:(f,allowDC=false)=>f.map(v=>{if(v===0&&points[0].f>0)return [1,0];if(v<points[0].f-1e-5||v>points.at(-1).f+1e-5)throw Error('S2P 대역이 10 MHz–12.5 GHz를 덮지 않습니다. 외삽하지 않습니다.');let lo=0,hi=points.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(points[m].f>v)hi=m;else lo=m;}const a=points[lo],b=points[hi],t=Math.max(0,Math.min(1,(v-a.f)/(b.f-a.f)));return add(mul([1-t,0],a.g),mul([t,0],b.g));})};
}
function prepare(model,f,{confirmed=false,dcConfirmed=false,capacitanceNF=220}={}){
 if(model.kind==='s2p'&&dcConfirmed&&model.minHz===0&&abs(sub(model.points[0].g,[1,0]))>1e-3)throw Error('파일의 DC 응답이 DC 개방 가정과 다릅니다.');
 if(!confirmed)throw Error('부품 양단/기준면 및 PCB 패드 기생 중복 여부를 먼저 확인해 주세요.');
 const pairs=model.gamma(f,dcConfirmed),gamma={real:new Float64Array(f.length*2),imaginary:new Float64Array(f.length*2)};
 for(let k=0;k<f.length;k++)for(let j=0;j<2;j++){gamma.real[k*2+j]=pairs[k][0];gamma.imaginary[k*2+j]=pairs[k][1];}
 let cap=model.kind==='spice'?model.capacitanceNF:(dcConfirmed?capacitanceNF:null);
 if(cap!==null&&!(Number.isFinite(cap)&&cap>0))throw Error('양의 정격 용량이 필요합니다.');
 return {gamma,capacitanceNF:cap,tdrAllowed:cap!==null,dcAvailable:model.kind==='spice'||model.minHz===0||dcConfirmed};
}
const api={spice,s2p,prepare};root.USBComponent=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
