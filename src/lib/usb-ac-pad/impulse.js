/**
 * usb-ac-pad/impulse.js
 * public/tools/usb-ac-pad/index.html의 인라인 모듈을 그대로 옮긴 사본이다.
 * 화면과 MCP가 같은 코드를 쓰도록 수정 없이 복사한다.
 * 갱신 절차: index.html을 고친 뒤 scripts/extract-usb-ac-pad.mjs로 다시 뽑는다.
 */
/* Positive-frequency band-pass complex envelope. Unit-through peak normalization.
   No DC extrapolation, no impedance conversion, no independent curve scaling. */
(function(root){'use strict';
function compute(f,s,lo=1e7,hi=12.5e9,window='hann'){
 if(!Number.isFinite(lo)||!Number.isFinite(hi)||lo<=0||hi<=lo||lo<f.find(v=>v>0)-1e-5||hi>f.at(-1)+1e-5)throw Error('Impulse 대역은 PCB 데이터의 양의 주파수 범위 안이어야 합니다.');
 if(!['rect','hann','blackman'].includes(window))throw Error('Unknown impulse window');
 const ids=f.map((v,i)=>v>=lo-1e-5&&v<=hi+1e-5?i:-1).filter(i=>i>=0);
 if(ids.length<8)throw Error('Impulse 대역에 최소 8개 주파수 점이 필요합니다.');
 const a=f[ids[0]],b=f[ids.at(-1)],bw=b-a,fc=(a+b)/2;
 const weights=ids.map((i,k)=>{const u=(f[i]-a)/bw,w=window==='rect'?1:window==='hann'?.5-.5*Math.cos(2*Math.PI*u):.42-.5*Math.cos(2*Math.PI*u)+.08*Math.cos(4*Math.PI*u);return w*(k===0?(f[ids[1]]-a)/2:k===ids.length-1?(b-f[ids[k-1]])/2:(f[ids[k+1]]-f[ids[k-1]])/2);});
 const norm=weights.reduce((x,y)=>x+y,0),dt=1/(32*bw),left=Math.ceil(Math.max(.5e-9,4/bw)/dt),right=Math.ceil(Math.max(2e-9,4/bw)/dt);
 const time_ns=[],reflection=[],transmission=[],reference=[];
 for(let j=-left;j<=right;j++){const t=j*dt;let rr=0,ri=0,tr=0,ti=0,pr=0,pi=0;
 for(let k=0;k<ids.length;k++){const i=ids[k],p=2*Math.PI*(f[i]-fc)*t,c=Math.cos(p)*weights[k]/norm,d=Math.sin(p)*weights[k]/norm;
 rr+=s.real[i*16]*c-s.imaginary[i*16]*d;ri+=s.real[i*16]*d+s.imaginary[i*16]*c;
 tr+=s.real[i*16+4]*c-s.imaginary[i*16+4]*d;ti+=s.real[i*16+4]*d+s.imaginary[i*16+4]*c;pr+=c;pi+=d;}
 time_ns.push(t*1e9);reflection.push(Math.hypot(rr,ri));transmission.push(Math.hypot(tr,ti));reference.push(Math.hypot(pr,pi));}
 let crossing=left+1;while(crossing<reference.length&&reference[crossing]>.5)crossing++;
 const prev=reference[crossing-1],next=reference[crossing],half=(crossing-1-left+(.5-prev)/(next-prev))*dt;
 return {time_ns,reflection,transmission,reference,fwhm_ps:2*half*1e12,start_hz:a,stop_hz:b,points:ids.length,window};
}
const api={compute};root.USBImpulse=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
