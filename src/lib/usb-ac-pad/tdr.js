/**
 * usb-ac-pad/tdr.js
 * public/tools/usb-ac-pad/index.html의 인라인 모듈을 그대로 옮긴 사본이다.
 * 화면과 MCP가 같은 코드를 쓰도록 수정 없이 복사한다.
 * 갱신 절차: index.html을 고친 뒤 scripts/extract-usb-ac-pad.mjs로 다시 뽑는다.
 */
/* Band-limited early-time TDR; analytic capacitor tail avoids RC time wrap.
 * Gaussian rise time is 10–90% (2.5631031311 sigma). Not a local pad Z0 solve.
 */
(function(root){
  'use strict';
  function inverseFFT(re,im) {
    const n=re.length;if(n===1)return [re,im];
    let p=2;while(p*p<=n&&n%p)p++;if(n%p)p=n;
    const m=n/p,parts=[];
    for(let r=0;r<p;r++) {
      const a=new Float64Array(m),b=new Float64Array(m);
      for(let j=0;j<m;j++){a[j]=re[r+p*j];b[j]=im[r+p*j];}
      parts.push(inverseFFT(a,b));
    }
    const a=new Float64Array(n),b=new Float64Array(n);
    for(let k=0;k<n;k++)for(let r=0;r<p;r++) {
      const angle=2*Math.PI*r*k/n,c=Math.cos(angle),s=Math.sin(angle),j=k%m;
      a[k]+=(parts[r][0][j]*c-parts[r][1][j]*s)/p;
      b[k]+=(parts[r][0][j]*s+parts[r][1][j]*c)/p;
    }
    return [a,b];
  }
  function cdf(x) {
    // erfc approximation, maximum absolute error about 1.5e-7.
    const z=Math.abs(x)/Math.SQRT2,t=1/(1+.5*z);
    const erfc=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(.37409196+t*(.09678418+t*(-.18628806+t*(.27886807+t*(-1.13520398+t*(1.48851587+t*(-.82215223+t*.17087277)))))))));
    return x>=0?1-erfc/2:erfc/2;
  }
  function earlyTime(f,mixed,risePs=200,z0=90,capacitanceNf=220,roi=[-.5,2],mode='capacitor') {
    if(!['capacitor','short'].includes(mode))throw Error('Unknown TDR termination mode');
    if(f.length<3||mixed.shape[0]!==f.length||mixed.shape[1]!==4||mixed.shape[2]!==4)throw Error('TDR shape mismatch');
    if(!(risePs>=50&&risePs<=1000&&z0>0&&capacitanceNf>0))throw Error('Unsupported TDR settings');
    let df=10e6;for(let k=0;k<f.length;k++) {
      if(!Number.isFinite(f[k])||f[k]<0||(k&&f[k]<=f[k-1]))throw Error('Invalid frequency axis');
      if(k)df=Math.min(df,f[k]-f[k-1]);
    }
    const bins=Math.ceil(f[f.length-1]/df),n=8*bins,du=f[f.length-1]/bins;
    if(n>200000)throw Error('TDR grid exceeds browser limit');
    const re=new Float64Array(n),im=new Float64Array(n),tau=capacitanceNf*1e-9*z0,sigma=risePs*1e-12/2.5631031311;
    const ff=f[0]>0?[0,...f]:Array.from(f),rr=new Float64Array(ff.length),ii=new Float64Array(ff.length),offset=f[0]>0?1:0;
    const dcReflection=mode==='short'?mixed.real[0]:0;
    for(let k=0;k<f.length;k++) {
      const w=2*Math.PI*f[k]*tau,d=1+w*w;
      rr[k+offset]=mixed.real[k*16]-(mode==='short'?dcReflection:1/d);ii[k+offset]=mixed.imaginary[k*16]+(mode==='short'?0:w/d);
    }
    rr[0]=0;ii[0]=0;let j=0;
    for(let k=1;k<=bins;k++) {
      const freq=k*du;while(j<ff.length-2&&ff[j+1]<freq)j++;
      const a=(freq-ff[j])/(ff[j+1]-ff[j]),window=Math.exp(-.5*(2*Math.PI*freq*sigma)**2);
      re[k]=(rr[j]*(1-a)+rr[j+1]*a)*window;im[k]=(ii[j]*(1-a)+ii[j+1]*a)*window;
      re[n-k]=re[k];im[n-k]=-im[k];
    }
    const impulse=inverseFFT(re,im)[0],time=[],rho=[],z=[];let cumulative=0;
    for(let k=0;k<n;k++) {
      cumulative+=impulse[(k+n/2)%n];const t=(k-n/2)/(n*du);
      if(t*1e9<roi[0]||t*1e9>roi[1])continue;
      const tail=mode==='short'?dcReflection*cdf(t/sigma):cdf(t/sigma)-Math.exp(-t/tau+sigma*sigma/(2*tau*tau))*cdf(t/sigma-sigma/tau);
      const r=cumulative+tail;time.push(t*1e9);rho.push(r);z.push(Math.abs(1-r)>1e-7?z0*(1+r)/(1-r):NaN);
    }
    return {time_ns:time,rho,z_ohm:z,rise_ps:risePs,sample_interval_ps:1e12/(n*du),
      fmax_excitation_fraction:Math.exp(-.5*(2*Math.PI*f[f.length-1]*sigma)**2),
      mode,scope:mode==='short'?'Ideal gap short; finite-band TDR with extrapolated low-frequency reflection':'Finite-band equivalent TDR; nominal capacitor tail is assumed; DC is not statically solved'};
  }
  const api={earlyTime};root.USBTdr=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
