"""LTspice CM/DM transfer comparison, selected choke versus bypass."""
import json
import subprocess
from pathlib import Path
import numpy as np
from mvp.cmc_surrogate_gui import pcb_circuit_text, spice_text, LTSPICE, raw_trace


def run_comparison(zcm, zdm, folder, fitted_library=None, frequency_stop=30e6,passive_fragment=None):
    folder=Path(folder);folder.mkdir(parents=True,exist_ok=True)
    lib=folder/'selected.lib'
    lib.write_text(Path(fitted_library).read_text(encoding='utf-8') if fitted_library else spice_text(zcm,zdm),encoding='utf-8')
    arrays={}
    for topology in ['selected','bypass']:
        for mode in ['cm','dm']:
            from src.cmc_demo_examples import circuit as user_circuit
            circuit=user_circuit(passive_fragment,lib) if passive_fragment is not None else pcb_circuit_text(lib)
            circuit=circuit.replace('.ac dec 100 150k 30Meg',f'.ac dec 100 150k {frequency_stop:.12g}')
            if fitted_library:
                circuit=circuit.replace('XCMC p11 p13 p12 p14 CMC_SELECTED',
                                        'XCMC p11 p12 p13 p14 EMXAI_SPARAM_MODEL')
            if topology=='bypass':
                circuit=circuit.replace('XCMC p11 p12 p13 p14 EMXAI_SPARAM_MODEL' if fitted_library else 'XCMC p11 p13 p12 p14 CMC_SELECTED',
                    'RBYP_L p11 p12 1u\nRBYP_N p13 p14 1u')
            if mode=='dm':
                circuit=circuit.replace('Icm3 0 p3 AC 0.5','Icm3 0 p3 AC 1')
                circuit=circuit.replace('Icm4 0 p4 AC 0.5','Icm4 p4 0 AC 1')
            path=folder/f'{topology}_{mode}.cir'
            path.write_text(circuit,encoding='utf-8')
            raw=path.with_suffix('.raw');raw.unlink(missing_ok=True)
            p=subprocess.run([str(LTSPICE),'-b','-Run',str(path)],capture_output=True,timeout=300)
            if p.returncode or not raw.exists():raise RuntimeError(f'LTspice failed: {path}')
            f,l=raw_trace(raw,'V(ml)');fn,n=raw_trace(raw,'V(mn)')
            if not np.array_equal(f,fn) or not np.isfinite(l).all() or not np.isfinite(n).all():
                raise ValueError('Invalid AC response')
            if 'frequency_hz' in arrays and not np.array_equal(arrays['frequency_hz'],f):
                raise ValueError('Comparison grids differ')
            arrays['frequency_hz']=f
            arrays[f'{topology}_{mode}_l']=l
            arrays[f'{topology}_{mode}_n']=n
    for mode in ['cm','dm']:
        for line in ['l','n']:
            a=np.maximum(abs(arrays[f'bypass_{mode}_{line}']),1e-30)
            b=np.maximum(abs(arrays[f'selected_{mode}_{line}']),1e-30)
            arrays[f'insertion_{mode}_{line}_db']=20*np.log10(a/b)
    np.savez(folder/'comparison.npz',**arrays)
    (folder/'manifest.json').write_text(json.dumps({
        'status':'complete','pcb':'B2 HFSS lumped reduction',
        'baseline':'CMC bypass only; all X/Y capacitors retained',
        'cm_excitation':'total current 1 A split equally',
        'dm_excitation':'differential current 1 A',
        'response':'complex receiver voltage per unit mode current',
        'cmc_model':'HFSS complex S4P vector fitted 4-port' if fitted_library else '150 kHz magnitude-derived coupled inductors',
        'detector':'none; not absolute CE compliance',
        'frequency_hz':[float(f[0]),float(f[-1])],
    },indent=2),encoding='utf-8')
    return arrays


if __name__=='__main__':
    from mvp.cmc_surrogate_gui import load_artifacts,feature_vector,predict_curves
    artifact,_=load_artifacts()
    z=predict_curves(artifact,feature_vector(8,'F3 기준형 (20/32/8 mm)',.8,3))
    folder=Path(__file__).resolve().parents[1]/'mvp/generated/pcb_comparison'
    a=run_comparison(*z,folder)
    print(f'Four AC runs complete: {len(a["frequency_hz"])} points, {folder}')
