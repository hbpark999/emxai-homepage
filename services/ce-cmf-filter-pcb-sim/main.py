"""Read-only inference for the bundled, trusted 80-case model."""
import json
import pickle
from pathlib import Path
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field

ROOT=Path(__file__).resolve().parent
with (ROOT/'models/cmc_curve_surrogate_80.pkl').open('rb') as stream:
    MODEL=pickle.load(stream)
CARD=json.loads((ROOT/'models/model_card_80.json').read_text(encoding='utf-8'))
FAMILIES=[(16,28,6),(16,28,12),(20,32,8),(24,40,6),(24,40,12)]
app=FastAPI(title='CE-CMF-Filter-PCB Sim',version=CARD['version'])

class Design(BaseModel):
    turns:int=Field(default=8,ge=6,le=12,strict=True)
    family:int=Field(default=2,ge=0,le=4,strict=True)
    wire:float=Field(default=.8,ge=.5,le=1.1,allow_inf_nan=False)
    pitch:float=Field(default=3,ge=2.1,le=5,allow_inf_nan=False)

@app.get('/health')
def health():return {'status':'ok','model_version':CARD['version']}

@app.get('/model-info')
def model_info():return CARD

@app.post('/predict')
def predict(design:Design):
    x=np.array([[design.turns,*FAMILIES[design.family],design.wire,design.pitch]])
    db=MODEL['model'].predict(x)[0].reshape(tuple(MODEL['output_shape']))
    z=10**(db/20)
    return {'version':CARD['version'],'frequency_hz':np.asarray(MODEL['frequency_hz']).tolist(),
            'zcm_ohm':z[0].tolist(),'zdm_ohm':z[1].tolist(),
            'scope':'HFSS-based magnitude prediction; not a complex SPICE network'}
