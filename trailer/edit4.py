"""Trailer v4 edit: punch-in zoom + flashes from the event log, dips at scene marks, upscale, concat. Usage: python3 edit4.py vi|en"""
import json, subprocess, os, sys
LANG=sys.argv[1] if len(sys.argv)>1 else 'vi'; RAW=f'raw4-{LANG}'; OUT=f'v4-{LANG}'
W,H=1080,1920; FPS=30
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
def load(n): return json.load(open(f'{RAW}/{n}.json'))
DIP=('gate1','gag','lose','montage','m1','m2','duck','reverse','count','hold','spot','boss','daily','ghost','final','vs1','vs2','vs3')
def fx(j, size):
    ev=j['events']; marks=j['marks']; pulses=[]; flashes=[]; dips=[]
    for e in ev:
        if e['k']=='hit':
            crit=e['ms'] and e['ms']<130
            pulses.append((e['t'], .11 if crit else .06, .28))
            if crit: flashes.append((e['t'], 'white@0.55', .07))
        elif e['k']=='hurt': pulses.append((e['t'], .05, .2)); flashes.append((e['t'], 'red@0.35', .1))
        elif e['k']=='fakesig': pulses.append((e['t'], .03, .15))
        elif e['k']=='won': pulses.append((e['t'], .08, .35))
    for k,t in marks.items():
        if k.startswith('ko') or k=='vsend': pulses.append((t, .16, .45)); flashes.append((t, 'white@0.8', .1))
        if k in DIP: dips.append(t)
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
os.makedirs(OUT,exist_ok=True)
segs=[('hook',(540,960)),('logo',None),('game',(540,960)),('vs',(540,960)),('outro',None)]
offset=0; timeline={'segments':[],'marks':{},'events':[],'lang':LANG}
for name,size in segs:
    out=f'{OUT}/{name}.mp4'; j=load(name); trim=0.0
    if name=='hook':
        trim=round(max(0,j['events'][0]['t']-1.0),3); j['marks']={k:round(v-trim,3) for k,v in j['marks'].items()}; j['events']=[dict(x,t=round(x['t']-trim,3)) for x in j['events']]
    vf=fx(j,size) if size else f"scale={W}:{H}:flags=lanczos"
    subprocess.check_call(['ffmpeg','-y','-v','error','-ss',str(trim),'-i',f'{RAW}/{name}.mp4','-vf',vf+f',fps={FPS},format=yuv420p','-c:v','libx264','-preset','fast','-crf','17','-an',out])
    d=dur(out)
    timeline['segments'].append({'name':name,'offset':round(offset,3),'dur':round(d,3)}); timeline['marks'][name]=round(offset,3)
    for k,t in j['marks'].items(): timeline['marks'][k]=round(offset+t,3)
    for e in j['events']: timeline['events'].append(dict(e,t=round(offset+e['t'],3),seg=name))
    print(name, round(d,2), 'offset', round(offset,2)); offset+=d
timeline['total']=round(offset,3)
open(f'{OUT}/list.txt','w').write(''.join(f"file '{os.path.abspath(OUT+'/'+n)}.mp4'\n" for n,_ in segs))
subprocess.check_call(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',f'{OUT}/list.txt','-c','copy',f'{OUT}/video.mp4'])
json.dump(timeline,open(f'{OUT}/timeline.json','w'),indent=1)
print('total',round(dur(f'{OUT}/video.mp4'),2),'marks',timeline['marks'])
