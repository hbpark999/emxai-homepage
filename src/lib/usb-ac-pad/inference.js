/**
 * usb-ac-pad/inference.js
 * public/tools/usb-ac-pad/index.html의 인라인 모듈을 그대로 옮긴 사본이다.
 * 화면과 MCP가 같은 코드를 쓰도록 수정 없이 복사한다.
 * 갱신 절차: index.html을 고친 뒤 scripts/extract-usb-ac-pad.mjs로 다시 뽑는다.
 */
/* Offline, dependency-free PCA/GP inference core. No Python/Node at runtime.
 * Raw S only: passivity projection and circuit/TDR stages are separate.
 * Works as a normal browser script (including file://) and as CommonJS for QA.
 */
(function(root) {
  'use strict';
  function decode(buffer) {
    const view = new DataView(buffer);
    const decoder = new TextDecoder();
    if (decoder.decode(new Uint8Array(buffer, 0, 8)) !== 'USBGP001')
      throw new Error('Unsupported model file');
    const length = view.getUint32(8, true);
    const meta = JSON.parse(decoder.decode(new Uint8Array(buffer, 12, length)));
    const offset = Math.ceil((12 + length) / 8) * 8;
    const arrays = {};
    for (const [name, entry] of Object.entries(meta.arrays)) {
      if (entry.dtype !== 'float64-le') throw new Error('Unsupported array type');
      const start = offset + entry.offset;
      if (start + entry.count * 8 > buffer.byteLength) throw new Error('Truncated model');
      // Copy using DataView: correct even on a big-endian host.
      const data = new Float64Array(entry.count);
      for (let i = 0; i < data.length; ++i) data[i] = view.getFloat64(start + 8 * i, true);
      arrays[name] = {data, shape: entry.shape};
    }
    return {meta, arrays};
  }
  function predictRaw(bundle, branch, input) {
    if (!['void', 'control'].includes(branch)) throw new Error('Unknown branch');
    const get = name => {
      const value = bundle.arrays[branch + '__' + name];
      if (!value) throw new Error('Missing model array: ' + name);
      return value;
    };
    const limits = get('limits').data;
    const x = get('x'), length = get('length').data, alpha = get('alpha');
    const scale = get('coeff_scale').data, components = get('pca_components');
    const mean = get('pca_mean').data;
    const n = x.shape[0], dim = x.shape[1], rank = alpha.shape[1];
    if (input.length !== dim || !input.every(Number.isFinite)) throw new Error('Invalid model inputs');
    const xn = input.map((value, i) => (value - limits[2*i]) / (limits[2*i+1] - limits[2*i]));
    if (xn.some(value => value < -1e-10 || value > 1+1e-10)) throw new Error('Outside trained contract bounds');
    const k = new Float64Array(n);
    for (let i = 0; i < n; ++i) {
      let d2 = 0;
      for (let j = 0; j < dim; ++j) d2 += ((xn[j] - x.data[i*dim+j]) / length[j]) ** 2;
      k[i] = Math.exp(-0.5*d2);
    }
    const coeff = new Float64Array(rank);
    for (let j = 0; j < rank; ++j) {
      for (let i = 0; i < n; ++i) coeff[j] += k[i]*alpha.data[i*rank+j];
      coeff[j] *= scale[j];
    }
    const flat = new Float64Array(mean);
    for (let j = 0; j < rank; ++j)
      for (let i = 0; i < flat.length; ++i) flat[i] += coeff[j]*components.data[j*flat.length+i];
    return {real: flat.subarray(0,flat.length/2), imaginary: flat.subarray(flat.length/2),
      flat, shape: Array.from(get('shape').data), passivityApplied: false,
      scope: 'Raw inference only; circuit and passivity validation required'};
  }
  const api = {decode, predictRaw};
  root.UsbPadInference = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
