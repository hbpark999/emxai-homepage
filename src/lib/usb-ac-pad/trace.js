/**
 * usb-ac-pad/trace.js
 * public/tools/usb-ac-pad/index.html의 인라인 모듈을 그대로 옮긴 사본이다.
 * 화면과 MCP가 같은 코드를 쓰도록 수정 없이 복사한다.
 * 갱신 절차: index.html을 고친 뒤 scripts/extract-usb-ac-pad.mjs로 다시 뽑는다.
 */
/* Port-to-port electrical delay from ideal gap-short Sdd21 phase regression.
   This is an endpoint timing estimate, not a detected reflection or local Z0. */
(function(root){'use strict';
function endpoints(g){return ['P','N'].map(sign=>{
 const input=g.traces.find(t=>t.net==='IN_'+sign),output=g.traces.find(t=>t.net==='OUT_'+sign);
 if(!input||!output)throw Error('Trace endpoint geometry missing');
 const path=[...input.centerline,...output.centerline];
 const length=path.slice(1).reduce((v,p,i)=>v+Math.hypot(p[0]-path[i][0],p[1]-path[i][1]),0);
 return {net:sign,start:input.centerline[0],end:output.centerline.at(-1),length_mm:length};
});}
function delay(f,s){const x=[],y=[];let previous=null,unwrapped=0;
 for(let k=0;k<f.length;k++){if(f[k]<1e8||f[k]>1e9)continue;
 const re=s.real[k*16+4],im=s.imaginary[k*16+4];if(!Number.isFinite(re)||!Number.isFinite(im)||Math.hypot(re,im)<.1)return null;
 const p=Math.atan2(im,re);if(previous===null)unwrapped=p;else{let d=p-previous;while(d>Math.PI)d-=2*Math.PI;while(d< -Math.PI)d+=2*Math.PI;unwrapped+=d;}previous=p;x.push(f[k]);y.push(unwrapped);}
 if(x.length<8)return null;const mx=x.reduce((a,b)=>a+b)/x.length,my=y.reduce((a,b)=>a+b)/y.length;
 let xx=0,xy=0;for(let i=0;i<x.length;i++){xx+=(x[i]-mx)**2;xy+=(x[i]-mx)*(y[i]-my);}const slope=xy/xx,seconds=-slope/(2*Math.PI);
 const residual=Math.sqrt(y.reduce((a,v,i)=>a+(v-my-slope*(x[i]-mx))**2,0)/x.length);
 if(!(seconds>0&&Number.isFinite(seconds))||residual>.05)return null;
 return {oneway_ns:seconds*1e9,roundtrip_ns:seconds*2e9,phase_rms_rad:residual};
}
function samples(result,end,count=8){
 if(!Number.isInteger(count)||count<2||count>16)throw Error('Zdiff 구간 수는 2–16 정수여야 합니다.');
 if(!result||!(end>0))return [];
 const t=result.time_ns,z=result.z_ohm;if(t[0]>0||t.at(-1)<end)return [];
 let j=0;return Array.from({length:count+1},(_,i)=>{const x=end*i/count;while(j<t.length-2&&t[j+1]<x)j++;const a=(x-t[j])/(t[j+1]-t[j]);return {time_ns:x,z:z[j]*(1-a)+z[j+1]*a};});
}
const api={endpoints,delay,samples};root.USBTrace=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
