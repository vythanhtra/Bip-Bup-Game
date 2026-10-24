"""Trailer v3 edit: punch-in zoom + flashes from the in-page event log, black dips at scene marks, upscale, concat."""
import json, subprocess, os
W,H=1080,1920; FPS=30
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
def load(n): return json.load(open(f'raw/{n}.json'))
def fx(name, size):
    j=load(name); ev=j['events']; marks=j['marks']
    pulses=[]; flashes=[]; dips=[]
    for e in ev:
        if e['k']=='hit':
            crit=e['ms'] and e['ms']<130
            pulses.append((e['t'], .11 if crit else .06, .28))
            if crit: flashes.append((e['t'], 'white@0.55', .07))
        elif e['k']=='hurt':
            pulses.append((e['t'], .05, .2)); flashes.append((e['t'], 'red@0.35', .1))
        elif e['k']=='fakesig':
            pulses.append((e['t'], .03, .15))
    for k,t in marks.items():
        if k.startswith('ko'): pulses.append((t, .16, .45)); flashes.append((t, 'white@0.8', .1))
        if k in ('gate1','gag','montage','m1','m2','duck','hold','spot','boss','final','lose'): dips.append(t)
    sw,sh=size
    z='(1'+''.join(f"+{a}*max(0,1-(t-{t:.3f})/{d})*gte(t,{t:.3f})" for t,a,d in pulses)+')'
    chain=[f"scale=w='iw*{z}':h='ih*{z}':eval=frame:flags=bicubic", f"crop={sw}:{sh}:(iw-{sw})/2:(ih-{sh})*0.55"]
    for t,c,d in flashes: chain.append(f"drawbox=c={c}:t=fill:enable='between(t,{t:.3f},{t+d:.3f})'")
    chain.append(f"scale={W}:{H}:flags=lanczos")
    for t in dips:
        if t<0.2: continue
        chain.append(f"drawbox=c=black@0.5:t=fill:enable='between(t,{t-.1:.3f},{t-.05:.3f})'")
        chain.append(f"drawbox=c=black:t=fill:enable='between(t,{t-.05:.3f},{t+.03:.3f})'")
        chain.append(f"drawbox=c=black@0.5:t=fill:enable='between(t,{t+.03:.3f},{t+.08:.3f})'")
    return ','.join(chain)
os.makedirs('v3',exist_ok=True)
segs=[('hook',(540,960)),('logo',None),('game',(540,960)),('outro',None)]
offset=0; timeline={'segments':[],'marks':{},'events':[]}
for name,size in segs:
    out=f'v3/{name}.mp4'
    trim=0.0
    if name=='hook':   # open on the battle, not the title screen: first fake signal lands ~1.0 s after the gate starts
        j0=load(name); trim=round(max(0,j0['events'][0]['t']-1.0),3)
        j0['marks']={k:round(v-trim,3) for k,v in j0['marks'].items()}; j0['events']=[dict(x,t=round(x['t']-trim,3)) for x in j0['events']]
        json.dump(j0,open('v3/hook.json','w'))
    vf=fx('../v3/hook' if trim else name,size) if size else f"scale={W}:{H}:flags=lanczos"
    subprocess.check_call(['ffmpeg','-y','-v','error','-ss',str(trim),'-i',f'raw/{name}.mp4','-vf',vf+f',fps={FPS},format=yuv420p','-c:v','libx264','-preset','fast','-crf','17','-an',out])
    d=dur(out); j=load('../v3/hook' if trim else name)
    timeline['segments'].append({'name':name,'offset':round(offset,3),'dur':round(d,3)})
    timeline['marks'][name]=round(offset,3)
    for k,t in j['marks'].items(): timeline['marks'][k]=round(offset+t,3)
    for e in j['events']: timeline['events'].append(dict(e,t=round(offset+e['t'],3),seg=name))
    print(name, round(d,2), 'offset', round(offset,2)); offset+=d
timeline['total']=round(offset,3)
open('v3/list.txt','w').write(''.join(f"file '{os.path.abspath('v3/'+n)}.mp4'\n" for n,_ in segs))
subprocess.check_call(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i','v3/list.txt','-c','copy','v3/video.mp4'])
json.dump(timeline,open('v3/timeline.json','w'),indent=1)
print('total',round(dur('v3/video.mp4'),2),'marks',timeline['marks'])
