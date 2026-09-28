/**
 * usb-ac-pad/network.js
 * public/tools/usb-ac-pad/index.html의 인라인 모듈을 그대로 옮긴 사본이다.
 * 화면과 MCP가 같은 코드를 쓰도록 수정 없이 복사한다.
 * 갱신 절차: index.html을 고친 뒤 scripts/extract-usb-ac-pad.mjs로 다시 뽑는다.
 */
/* Offline circuit operations. Port order: IN+, OUT+, IN-, OUT-, CAP+, CAP-. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.USBNetwork = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const add=(a,b)=>[a[0]+b[0],a[1]+b[1]], sub=(a,b)=>[a[0]-b[0],a[1]-b[1]];
  const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
  function div(a,b) {const d=b[0]*b[0]+b[1]*b[1];if(d<1e-28)throw Error('Singular circuit');return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d];}
  const matrix=(n,m)=>Array.from({length:n},()=>Array.from({length:m},()=>[0,0]));
  function solve(a,b) {
    const n=a.length,m=b[0].length,A=a.map((r,i)=>r.concat(b[i]).map(v=>v.slice()));
    for(let k=0;k<n;k++) {
      let p=k;for(let i=k+1;i<n;i++)if(Math.hypot(...A[i][k])>Math.hypot(...A[p][k]))p=i;
      if(Math.hypot(...A[p][k])<1e-12)throw Error('Ill-conditioned circuit');
      [A[k],A[p]]=[A[p],A[k]];const pivot=A[k][k];
      for(let j=k;j<n+m;j++)A[k][j]=div(A[k][j],pivot);
      for(let i=0;i<n;i++)if(i!==k) {const factor=A[i][k];for(let j=k;j<n+m;j++)A[i][j]=sub(A[i][j],mul(factor,A[k][j]));}
    }
    return A.map(r=>r.slice(n));
  }
  function checked(x,n) {
    if(!x.shape||x.shape[1]!==n||x.shape[2]!==n||x.real.length!==x.shape[0]*n*n||x.imaginary.length!==x.real.length)throw Error('Network shape mismatch');
    for(let i=0;i<x.real.length;i++)if(!Number.isFinite(x.real[i])||!Number.isFinite(x.imaginary[i]))throw Error('Nonfinite network');
  }
  const at=(x,k,i,j,n)=>[x.real[k*n*n+i*n+j],x.imaginary[k*n*n+i*n+j]];
  function output(count,n) {return {real:new Float64Array(count*n*n),imaginary:new Float64Array(count*n*n),shape:[count,n,n]};}
  function put(x,k,i,j,n,v){x.real[k*n*n+i*n+j]=v[0];x.imaginary[k*n*n+i*n+j]=v[1];}
  function seriesRLC(f,c=220e-9,r=0,l=0,reference=50) {
    if(![c,r,l,reference].every(Number.isFinite)||c<=0||r<0||l<0||reference<=0)throw Error('Invalid RLC');
    const out={real:new Float64Array(f.length*2),imaginary:new Float64Array(f.length*2)};
    for(let k=0;k<f.length;k++) {
      if(!Number.isFinite(f[k])||f[k]<0)throw Error('Invalid frequency');
      const w=2*Math.PI*f[k],v=div([1-w*w*l*c,w*c*(r-reference)],[1-w*w*l*c,w*c*(r+reference)]);
      for(let j=0;j<2;j++){out.real[k*2+j]=v[0];out.imaginary[k*2+j]=v[1];}
    }
    return out;
  }
  function loadGaps(x,gamma) {
    checked(x,6);const count=x.shape[0],out=output(count,4);
    if(gamma.real.length!==count*2||gamma.imaginary.length!==count*2)throw Error('Reflection shape mismatch');
    for(let k=0;k<count;k++) {
      const g=[0,1].map(i=>[gamma.real[k*2+i],gamma.imaginary[k*2+i]]);
      if(!g.flat().every(Number.isFinite))throw Error('Nonfinite load');
      const a=matrix(2,2),b=matrix(2,4);
      for(let i=0;i<2;i++) {
        for(let j=0;j<2;j++)a[i][j]=sub([i===j?1:0,0],mul(at(x,k,i+4,j+4,6),g[j]));
        for(let j=0;j<4;j++)b[i][j]=at(x,k,i+4,j,6);
      }
      const y=solve(a,b);
      for(let i=0;i<4;i++)for(let j=0;j<4;j++) {
        let v=at(x,k,i,j,6);for(let t=0;t<2;t++)v=add(v,mul(mul(at(x,k,i,t+4,6),g[t]),y[t][j]));
        put(out,k,i,j,4,v);
      }
    }
    return out;
  }
  function mixedMode(x,rawReference=50,differentialReference=90) {
    checked(x,4);if(!(rawReference>0&&differentialReference>0))throw Error('Invalid reference');
    const out=output(x.shape[0],4),g=(differentialReference/2-rawReference)/(differentialReference/2+rawReference);
    const T=[[1,0,-1,0],[0,1,0,-1],[1,0,1,0],[0,1,0,1]];
    for(let k=0;k<x.shape[0];k++) {
      const a=matrix(4,4),b=matrix(4,4);
      for(let i=0;i<4;i++)for(let j=0;j<4;j++) {
        const v=at(x,k,i,j,4);a[i][j]=sub([i===j?1:0,0],[g*v[0],g*v[1]]);b[i][j]=sub(v,[i===j?g:0,0]);
      }
      const s=solve(a,b);
      for(let i=0;i<4;i++)for(let j=0;j<4;j++) {
        let v=[0,0];for(let p=0;p<4;p++)for(let q=0;q<4;q++){const t=T[i][p]*T[j][q]/2;v[0]+=t*s[p][q][0];v[1]+=t*s[p][q][1];}
        put(out,k,i,j,4,v);
      }
    }
    return out;
  }
  return {seriesRLC,loadGaps,mixedMode};
});
