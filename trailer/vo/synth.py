import sherpa_onnx, numpy as np, wave, json, subprocess, sys, os
M=os.environ.get('KOKORO_DIR','models/kokoro-multi-lang-v1_0')
SID=int(sys.argv[1]) if len(sys.argv)>1 else 16  # kokoro v1.0: 16 am_michael, 11 am_adam, 26 bm_george, 17 am_onyx
cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=M+'/model.onnx',voices=M+'/voices.bin',tokens=M+'/tokens.txt',data_dir=M+'/espeak-ng-data',lexicon=M+'/lexicon-us-en.txt',dict_dir=M+'/dict'),num_threads=4,provider='cpu'),max_num_sentences=1)
tts=sherpa_onnx.OfflineTts(cfg)
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
IN,GA,OU=dur('raw/intro.mp4'),dur('raw/game.mp4'),dur('raw/outro.mp4'); marks=json.load(open('marks.json'))
base={k:IN+v for k,v in marks.items()}; base['outro']=IN+GA; base['outro_game']=IN; base['logo']=IN-2.9
def at(s):
    if isinstance(s,(int,float)): return float(s)
    k=s.replace('+',' +').replace('-',' -').split(); return base[k[0]]+float(k[1]) if len(k)>1 else base[k[0]]
PITCH=0.96; SR=44100; total=IN+GA+OU; vo=np.zeros(int(SR*total)+SR); spans=[]
lines=json.load(open('vo/script.json')); prev_end=0
for L in lines:
    a=tts.generate(L['text'],sid=SID,speed=L.get('speed',1.0)); x=np.array(a.samples,dtype=np.float32); sr=a.sample_rate
    x=np.interp(np.arange(0,len(x),sr/SR),np.arange(len(x)),x)        # resample to 44.1k
    x=np.interp(np.arange(0,len(x),1/PITCH),np.arange(len(x)),x)          # pitch down a touch (PITCH<1)
    x=np.tanh(x/(np.max(np.abs(x))+1e-9)*2.2)/np.tanh(2.2)                     # vocal compression
    big=L.get('fx')=='big'; taps=[(0.07,.28),(0.14,.18),(0.21,.11),(0.30,.07)] if not big else [(0.07,.35),(0.14,.27),(0.21,.2),(0.3,.15),(0.42,.1),(0.55,.06)]
    tail=int(SR*(0.8 if big else 0.4)); y=np.zeros(len(x)+tail); y[:len(x)]+=x
    for d,g in taps:
        k=int(SR*d); y[k:k+len(x)]+=g*x
    x=y/(np.max(np.abs(y))+1e-9)*0.9
    start=max(at(L['at']),prev_end+0.12); s=int(start*SR); e=min(len(vo),s+len(x)); vo[s:e]+=x[:e-s]; prev_end=start+(len(x)-tail)/SR+0.05
    spans.append((start,prev_end)); print(f"{start:6.2f}-{prev_end:6.2f}  {L['text'][:60]}")
# music ducking: -9 dB under speech with 0.25 s ramps
w=wave.open('music.wav'); mus=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32767
mus=np.pad(mus,(0,max(0,len(vo)-len(mus))))[:len(vo)]
gain=np.ones(len(vo)); r=int(.25*SR)
for s,e in spans:
    a,b=int(max(0,s-.15)*SR),int(min(total,e+.15)*SR); gain[a:b]=np.minimum(gain[a:b],0.3)
    gain[max(0,a-r):a]=np.minimum(gain[max(0,a-r):a],np.linspace(1,.3,min(r,a))); gain[b:b+r]=np.minimum(gain[b:b+r],np.linspace(.3,1,min(r,len(vo)-b)))
mix=mus*gain*0.8+vo*1.35; mix=np.tanh(mix*1.5); mix=mix/np.max(np.abs(mix))*0.95
with wave.open('final_audio.wav','wb') as o: o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((mix*32767).astype(np.int16).tobytes())
with wave.open('vo/vo_only.wav','wb') as o: o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((vo*32767).astype(np.int16).tobytes())
print('ok total',round(total,2),'sid',SID)
