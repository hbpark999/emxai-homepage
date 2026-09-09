"""Virtual-source harmonic RMS spectrum through the exact LTspice PCB/CMC circuit."""
import json
import subprocess
from pathlib import Path
import numpy as np
import config
from mvp.cmc_surrogate_gui import pcb_circuit_text, spice_text, LTSPICE, raw_trace


def pulse_coefficients(n, frequency, voltage, pulse_width, rise, fall):
    """Complex positive-order Fourier coefficients of LTspice PULSE(0,V,0,tr,tf,pw,T)."""
    n=np.asarray(n,dtype=float);period=1/frequency
    if np.any(n<=0) or min(rise,fall,pulse_width)<=0 or rise+pulse_width+fall>=period:
        raise ValueError('Invalid periodic pulse or harmonic order')
    w=2*np.pi*n*frequency
    slope_integral=voltage/rise*(-np.expm1(-1j*w*rise))
    slope_integral-=voltage/fall*np.exp(-1j*w*(rise+pulse_width))*(-np.expm1(-1j*w*fall))
    return slope_integral/(period*(1j*w)**2)


def run_virtual_ce(zcm,zdm,folder,fitted_library=None,frequency_start=150e3,frequency_stop=30e6,progress=None,passive_fragment=None):
    folder=Path(folder);folder.mkdir(parents=True,exist_ok=True)
    lib=folder/'selected.lib';lib.write_text(Path(fitted_library).read_text(encoding='utf-8') if fitted_library else spice_text(zcm,zdm),encoding='utf-8')
    fs=config.SRC_FSW_HZ;nmax=int(frequency_stop/fs)
    n=np.arange(max(1,int(np.ceil(frequency_start/fs))),nmax+1);expected=n*fs
    if len(n)<2:raise ValueError('No usable harmonic grid within the model band')
    coefficients=pulse_coefficients(n,fs,config.SRC_VPP,config.SRC_DUTY/fs,
                                    config.SRC_TRISE_S,config.SRC_TRISE_S)
    arrays={'frequency_hz':expected,'source_coefficients_v':coefficients}
    for topology in ['selected','bypass']:
        if progress:progress(topology)
        from src.cmc_demo_examples import circuit as user_circuit
        text=user_circuit(passive_fragment,lib) if passive_fragment is not None else pcb_circuit_text(lib)
        if fitted_library:
            text=text.replace('XCMC p11 p13 p12 p14 CMC_SELECTED','XCMC p11 p12 p13 p14 EMXAI_SPARAM_MODEL')
        assert 'Icm3 0 p3 AC 0.5' in text and 'Icm4 0 p4 AC 0.5' in text
        text=text.replace('Icm3 0 p3 AC 0.5', 'Vsw sw 0 AC 1\n'
            f'Ccm3 sw p3 {config.SRC_CM_CPAR_F/2:g}\nCcm4 sw p4 {config.SRC_CM_CPAR_F/2:g}')
        text=text.replace('Icm4 0 p4 AC 0.5',f'Gdm p4 p3 sw 0 {0.5/config.SRC_DM_Z:g}')
        text=text.replace('.ac dec 100 150k 30Meg',f'.ac lin {len(n)} {expected[0]:g} {expected[-1]:g}')
        if topology=='bypass':
            text=text.replace('XCMC p11 p12 p13 p14 EMXAI_SPARAM_MODEL' if fitted_library else 'XCMC p11 p13 p12 p14 CMC_SELECTED',
                              'RBYP_L p11 p12 1u\nRBYP_N p13 p14 1u')
        path=folder/f'{topology}.cir';path.write_text(text,encoding='utf-8')
        raw=path.with_suffix('.raw');raw.unlink(missing_ok=True)
        p=subprocess.run([str(LTSPICE),'-b','-Run',str(path)],timeout=300,capture_output=True)
        if p.returncode or not raw.exists():raise RuntimeError(f'LTspice failed: {path}')
        for line in ['l','n']:
            f,h=raw_trace(raw,f'V(m{line})')
            if not np.allclose(f,expected,rtol=1e-9) or not np.isfinite(h).all():
                raise ValueError('Unexpected harmonic grid or invalid transfer')
            arrays[f'{topology}_{line}_coefficient_v']=h*coefficients
            arrays[f'{topology}_{line}_rms_dbuv']=20*np.log10(np.maximum(np.sqrt(2)*abs(h*coefficients),1e-30))+120
    np.savez(folder/'spectrum.npz',**arrays)
    manifest=dict(status='virtual_harmonic_calculation_complete',frequency_points=len(n),
        source=dict(frequency_hz=fs,voltage_v=config.SRC_VPP,duty=config.SRC_DUTY,
                    rise_s=config.SRC_TRISE_S,cm_coupling_f=config.SRC_CM_CPAR_F,dm_impedance_ohm=config.SRC_DM_Z),
        output='RMS voltage of each discrete harmonic, dB microvolt',
        pcb='B2 HFSS lumped reduction including PCB capacitances',
        cmc='HFSS complex S4P vector-fitted 4-port' if fitted_library else '150 kHz magnitude-derived coupled-inductor approximation',
        detector='None: not quasi-peak, average-receiver or compliance result',
        scope='Linear circuit response to the configured virtual periodic source')
    (folder/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    return arrays,manifest


if __name__=='__main__':
    from mvp.cmc_surrogate_gui import load_artifacts,predict_curves
    artifact,_=load_artifacts();z=predict_curves(artifact,np.array([[8,20,32,8,.8,3]]))
    _,manifest=run_virtual_ce(*z,Path(__file__).resolve().parents[1]/'mvp/generated/virtual_ce')
    print(json.dumps(manifest,indent=2))
