"""Selected, verified CMC -> PCB AC -> virtual CE, without surrogate retraining."""
import json
import hashlib
from datetime import datetime
from pathlib import Path
from uuid import uuid4
from langgraph.graph import StateGraph, START, END
from typing import TypedDict
from src.cmc_pcb_comparison import run_comparison
from src.cmc_virtual_ce import run_virtual_ce

ROOT=Path(__file__).resolve().parents[1]
MODEL=ROOT/'mvp/generated/cmc_spice_demo'
LABEL='CMC-01 | 8 turns × 2 · 20/32/8 mm · 0.8 mm'

def run_selected(label, progress=lambda percent,message:None,passive_fragment=None):
    if label!=LABEL:raise ValueError('Unknown verified representative')
    folder=MODEL/'runs'/f'{datetime.now():%Y%m%d_%H%M%S}_{uuid4().hex[:6]}'
    folder.mkdir(parents=True)
    if passive_fragment is not None:
        from src.cmc_demo_examples import validate_fragment
        validate_fragment(passive_fragment)
        (folder/'user_pcb_filter.cir').write_text(passive_fragment,encoding='utf-8')
    class State(TypedDict,total=False):
        ac:dict
        ce:dict
        manifest:dict
    def validate(state):
        progress(5,'선택 모델과 검증 기록 확인')
        check=json.loads((MODEL/'ltspice_validation.json').read_text())
        fit=json.loads((MODEL/'fit_summary.json').read_text(encoding='utf-8'))
        lib=MODEL/'cmc_representative.lib'
        digest=hashlib.sha256(lib.read_bytes()).hexdigest()
        registry=json.loads((MODEL/'verified_registry.json').read_text())
        if not check['modal_gate_pass'] or registry['library_sha256']!=digest:
            raise ValueError('SPICE model changed or verification failed; revalidation required')
        if any(x['status']!='pass' for x in fit['output_checks']):
            raise ValueError('Model output checks did not pass')
        return {'manifest':dict(model=label,library_sha256=digest,
                                circuit_origin='user-edited PCB/filter RLC' if passive_fragment is not None else 'PCB B2 default',
                                circuit_sha256=hashlib.sha256(passive_fragment.encode()).hexdigest() if passive_fragment is not None else None,
                                frequency_start=fit['frequency_min_hz'],frequency_stop=fit['frequency_max_hz'],
                                folder=str(folder),status='running')}
    def ac(state):
        progress(15,'PCB + LISN · CM/DM 회로 4건 계산')
        a=run_comparison(None,None,folder/'ac',fitted_library=MODEL/'cmc_representative.lib',
                         frequency_stop=state['manifest']['frequency_stop'],passive_fragment=passive_fragment)
        return {'ac':a}
    def ce(state):
        def report(topology):progress(65 if topology=='selected' else 80,
                                     '가상 CE Noise · '+('CMC 적용' if topology=='selected' else '바이패스')+' 계산')
        a,meta=run_virtual_ce(None,None,folder/'ce',fitted_library=MODEL/'cmc_representative.lib',
                            frequency_start=state['manifest']['frequency_start'],
                            frequency_stop=state['manifest']['frequency_stop'],progress=report,passive_fragment=passive_fragment)
        manifest={**state['manifest'],'status':'complete','ce':meta}
        if passive_fragment is not None:
            meta['pcb']='User-edited passive RLC fragment; original PCB layout is a reference only'
        (folder/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding='utf-8')
        progress(95,'계산 완료 · 비교 그래프 갱신')
        return {'ce':a,'manifest':manifest}
    graph=StateGraph(State)
    for name,fn in [('validate',validate),('pcb_ac',ac),('ce_noise',ce)]:graph.add_node(name,fn)
    graph.add_edge(START,'validate');graph.add_edge('validate','pcb_ac');graph.add_edge('pcb_ac','ce_noise');graph.add_edge('ce_noise',END)
    try:return graph.compile().invoke({})
    except Exception as exc:
        (folder/'error.json').write_text(json.dumps({'status':'failed','error':str(exc)},ensure_ascii=False),encoding='utf-8')
        raise
