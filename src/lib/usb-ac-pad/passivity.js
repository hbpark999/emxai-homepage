/**
 * usb-ac-pad/passivity.js
 * public/tools/usb-ac-pad/index.html의 인라인 모듈을 그대로 옮긴 사본이다.
 * 화면과 MCP가 같은 코드를 쓰도록 수정 없이 복사한다.
 * 갱신 절차: index.html을 고친 뒤 scripts/extract-usb-ac-pad.mjs로 다시 뽑는다.
 */
/* Dependency-free reciprocal/passive projection for small complex S matrices.
 * Real augmentation allows a real symmetric eigensolver for S^H S.
 * Sampled-frequency projection is not a proof of causality.
 */
(function(root){
  'use strict';
  function eigenSymmetric(input,n){
    const a=new Float64Array(input),v=new Float64Array(n*n);
    for(let i=0;i<n;i++)v[i*n+i]=1;
    let converged=false;
    for(let iter=0;iter<100*n*n;iter++){
      let p=0,q=1,largest=0;
      for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)
        if(Math.abs(a[i*n+j])>largest){largest=Math.abs(a[i*n+j]);p=i;q=j;}
      if(largest<1e-14){converged=true;break;}
      const apq=a[p*n+q],app=a[p*n+p],aqq=a[q*n+q];
      const tau=(aqq-app)/(2*apq);
      const t=(tau<0?-1:1)/(Math.abs(tau)+Math.hypot(1,tau));
      const c=1/Math.hypot(1,t),s=t*c;
      for(let k=0;k<n;k++){
        if(k!==p&&k!==q){
          const akp=a[k*n+p],akq=a[k*n+q];
          a[k*n+p]=a[p*n+k]=c*akp-s*akq;
          a[k*n+q]=a[q*n+k]=s*akp+c*akq;
        }
        const vkp=v[k*n+p],vkq=v[k*n+q];
        v[k*n+p]=c*vkp-s*vkq;v[k*n+q]=s*vkp+c*vkq;
      }
      a[p*n+p]=app-t*apq;a[q*n+q]=aqq+t*apq;a[p*n+q]=a[q*n+p]=0;
    }
    if(!converged)throw new Error('Passivity eigensolver did not converge');
    return {values:Float64Array.from({length:n},(_,i)=>a[i*n+i]),vectors:v};
  }
  function decompose(real,imag,n,base){
    const size=2*n,r=new Float64Array(size*size),gram=new Float64Array(size*size);
    for(let i=0;i<n;i++)for(let j=0;j<n;j++){
      const a=real[base+i*n+j],b=imag[base+i*n+j];
      r[i*size+j]=r[(i+n)*size+j+n]=a;
      r[i*size+j+n]=-b;r[(i+n)*size+j]=b;
    }
    for(let i=0;i<size;i++)for(let j=i;j<size;j++){
      let sum=0;for(let k=0;k<size;k++)sum+=r[k*size+i]*r[k*size+j];
      gram[i*size+j]=gram[j*size+i]=sum;
    }
    const e=eigenSymmetric(gram,size);
    return {r,e,size,maximum:Math.sqrt(Math.max(0,...e.values))};
  }
  function projectPassive(input,tolerance=1e-12){
    const [nf,n,n2]=input.shape;
    if(n!==n2||input.real.length!==nf*n*n||input.imaginary.length!==nf*n*n)
      throw new Error('Invalid complex S shape');
    const re=new Float64Array(input.real),im=new Float64Array(input.imaginary);
    if(!re.every(Number.isFinite)||!im.every(Number.isFinite))throw new Error('Nonfinite S');
    let before=0,after=0;
    for(let f=0;f<nf;f++)before=Math.max(before,decompose(re,im,n,f*n*n).maximum);
    if(before<=1+tolerance)return {...input,real:re,imaginary:im,passivityApplied:false,
      maxSingularBefore:before,maxSingularAfter:before,correction:0};
    for(let iteration=0;iteration<8;iteration++){
      for(let f=0;f<nf;f++){
        const base=f*n*n,{r,e,size}=decompose(re,im,n,base);
        const transform=new Float64Array(size*size),out=new Float64Array(size*size);
        const scales=Array.from(e.values,x=>1/Math.max(1,Math.sqrt(Math.max(0,x))));
        for(let i=0;i<size;i++)for(let j=0;j<size;j++){
          let sum=0;for(let k=0;k<size;k++)sum+=e.vectors[i*size+k]*scales[k]*e.vectors[j*size+k];
          transform[i*size+j]=sum;
        }
        for(let i=0;i<size;i++)for(let j=0;j<size;j++)
          for(let k=0;k<size;k++)out[i*size+j]+=r[i*size+k]*transform[k*size+j];
        for(let i=0;i<n;i++)for(let j=0;j<n;j++){
          re[base+i*n+j]=(out[i*size+j]+out[(i+n)*size+j+n])/2;
          im[base+i*n+j]=(out[(i+n)*size+j]-out[i*size+j+n])/2;
        }
        for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
          const a=base+i*n+j,b=base+j*n+i;
          re[a]=re[b]=(re[a]+re[b])/2;im[a]=im[b]=(im[a]+im[b])/2;
        }
      }
      after=0;for(let f=0;f<nf;f++)after=Math.max(after,decompose(re,im,n,f*n*n).maximum);
      if(after<=1+tolerance)break;
    }
    if(after>1+tolerance)throw new Error('Passivity projection failed');
    return {real:re,imaginary:im,shape:input.shape,passivityApplied:true,
      maxSingularBefore:before,maxSingularAfter:after,correction:before-after};
  }
  const api={projectPassive};root.UsbPadPassivity=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
