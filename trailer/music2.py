import numpy as np, wave, json, subprocess
sr=44100
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
IN,GA,OU=dur('raw/intro.webm'),dur('raw/game.webm'),dur('raw/outro.webm')
M=json.load(open('marks.json')); G=lambda k: IN+M[k]
total=IN+GA+OU; n=int(sr*total)+sr; out=np.zeros(n)
def note(m): return 440*2**((m-69)/12)
def sq(f,t,duty=.5): return np.where((t*f)%1<duty,1.0,-1.0)
def tri(f,t): return 2*np.abs(2*((t*f)%1)-1)-1
def saw(f,t): return 2*((t*f)%1)-1
def env(t,a=.005,d=.18,s=0.0,r=None):
    e=np.minimum(t/a,1)*np.exp(-t/d); return np.maximum(e, s*(t<(r or 0)))
def add(sig,start):
    s=int(start*sr); e=min(n,s+len(sig))
    if 0<=s<n: out[s:e]+=sig[:e-s]
def tone(f,start,length,wave='sq',vol=.15,duty=.5,a=.005,d=.18,glide=None):
    t=np.arange(int(sr*length))/sr
    ff=f if glide is None else f*(glide/f)**(t/length)
    ph=np.cumsum(ff)/sr
    w={'sq':np.where((ph)%1<duty,1.0,-1.0),'tri':2*np.abs(2*(ph%1)-1)-1,'saw':2*(ph%1)-1,'sin':np.sin(2*np.pi*ph)}[wave]
    add(vol*w*env(t,a,d),start)
def kick(start,vol=.6):
    t=np.arange(int(sr*.3))/sr; add(vol*np.sin(2*np.pi*(130*np.exp(-t*16)+38)*t)*env(t,.002,.13),start)
def snare(start,vol=.3):
    t=np.arange(int(sr*.2))/sr; add(vol*(np.random.uniform(-1,1,len(t))*.7+.3*np.sin(2*np.pi*190*t))*env(t,.001,.07),start)
def hat(start,vol=.07,length=.05):
    t=np.arange(int(sr*length))/sr; add(vol*np.random.uniform(-1,1,len(t))*env(t,.001,length/2.5),start)
def crash(start,vol=.35):
    t=np.arange(int(sr*1.4))/sr; add(vol*np.random.uniform(-1,1,len(t))*env(t,.002,.5),start)
def riser(start,length,vol=.25):
    t=np.arange(int(sr*length))/sr; nz=np.random.uniform(-1,1,len(t)); add(vol*nz*(t/length)**2,start); tone(110,start,length,'saw',vol*.6,glide=880,a=.3,d=length*3)
def chord(ms,start,length,vol=.14,wave='sq',duty=.5):
    for m in ms: tone(note(m),start,length,wave,vol,duty,a=.01,d=length*.6)
def theme(start,end,bpm,mel,bass,drums='med',vol=1.0,duty=.25,octave=0):
    beat=60/bpm; step=beat/2; t=start; k=0
    while t<end-.01:
        m=mel[k%len(mel)]
        if m: tone(note(m+octave),t,step*1.15,'sq',.14*vol,duty,a=.004,d=.14)
        if k%4==0: tone(note(bass[(k//4)%len(bass)]),t,beat,'tri',.2*vol,a=.005,d=.3)
        if drums!='none':
            if k%8==0: kick(t,.5*vol)
            if k%8==4: snare(t,.26*vol)
            if drums=='hard':
                if k%2==1: hat(t,.06*vol)
                if k%16==14: snare(t+step/2,.18*vol)
                if k%4==2: kick(t,.3*vol)
            elif k%2==0: hat(t,.05*vol)
        t+=step; k+=1
A=[69,72,74,76,74,72,69,67, 69,72,76,79,76,74,72,69, 64,67,69,72,69,67,64,62, 64,67,69,72,74,72,69,67]
B=[81,79,76,74,76,79,81,84, 81,79,76,74,72,74,76,79, 76,74,72,69,72,74,76,79, 81,84,81,79,76,74,72,69]
BOSS=[57,69,57,68,57,69,57,67, 60,72,60,71,60,72,60,69, 57,69,57,68,57,69,57,67, 62,74,62,73,62,74,62,71]
bassA=[45,45,52,45,48,48,43,43]; bassB=[41,41,43,43,45,45,52,52]; bassBoss=[45,45,45,45,48,48,50,50]
# ---- intro: dread ----
logo=IN-2.9
t=0.0
while t<logo-.4:
    tone(55,t,1.2,'sin',.22,a=.05,d=1.0); tone(110,t,1.2,'tri',.06,a=.05,d=.9); kick(t,.45); kick(t+.35,.25); t+=1.25
for i,m in enumerate([81,0,84,0,0,79,0,81]):
    if m: tone(note(m),1.0+i*0.95,.5,'tri',.08,a=.01,d=.4)
riser(logo-2.6,2.6,.3)
# logo hit
chord([45,52,57,64,69],logo,1.6,.2,'sq',.5); kick(logo,.9); crash(logo,.4); tone(27.5,logo,1.6,'sin',.5,a=.005,d=.6)
for i,m in enumerate([69,72,76,81]): tone(note(m),logo+1.4+i*.14,.5,'sq',.12,.25,a=.004,d=.35)
tone(note(81),logo+2.0,1.2,'sq',.1,.25,a=.01,d=.9)
# ---- game: title/map soft, then gate 1 full theme ----
g0=IN; g1=G('gate1'); w1=G('win1'); gag=G('gag'); night=G('night'); duck=G('duck'); boss=G('boss'); ko=G('ko'); gend=IN+GA
theme(g0,g1,150,A,bassA,'none',.75)
theme(g1,w1-.1,150,A,bassA,'med',1.0)
# win 1 fanfare + short break
for i,m in enumerate([76,79,81,88]): tone(note(m),w1+i*.11,.4,'sq',.14,.25,a=.004,d=.3)
tone(note(88),w1+.44,.9,'sq',.1,.25,a=.01,d=.7); crash(w1,.25)
theme(w1+1.2,gag-.05,150,A,bassA,'med',.8)
# gag: wah-wah slide, drums out
tone(330,gag,.7,'saw',.22,glide=110,a=.01,d=.5); tone(165,gag+.05,.7,'saw',.12,glide=55,a=.01,d=.5)
for i,m in enumerate([64,62,60,57]): tone(note(m),gag+.6+i*.18,.3,'sq',.1,.5,a=.004,d=.22)
# night market: darker variant, lower octave, half drums
theme(gag+1.5,night,150,A,bassA,'none',.5)
theme(night,duck-.05,150,B,bassB,'med',.85,duty=.5,octave=-12)
# duck: stab + stop
tone(220,duck,.25,'saw',.3,glide=140); tone(110,duck,.25,'saw',.2,glide=70); snare(duck,.4)
theme(duck+.7,boss,150,B,bassB,'med',.85,duty=.5,octave=-12)
# boss: tempo up, driving
crash(boss,.3); kick(boss,.8)
theme(boss,ko-1.2,172,BOSS,bassBoss,'hard',1.0,duty=.5)
riser(ko-1.6,1.6,.28)
# KO
chord([45,52,57,64],ko,1.4,.22,'sq',.5); kick(ko,1.0); crash(ko,.45); tone(27.5,ko,1.4,'sin',.5,a=.005,d=.5)
for i,m in enumerate([69,73,76,81,85]): tone(note(m),ko+1.3+i*.12,.5,'sq',.13,.25,a=.004,d=.4)
tone(note(85),ko+1.9,1.4,'sq',.1,.25,a=.01,d=1.0)
chord([57,64,69,73],ko+2.2,2.5,.07,'tri')
# after KO to outro: calm major chords
t=ko+3.2
prog=[[57,61,64,69],[55,59,62,67],[53,57,60,65],[55,59,62,67]]
i=0
while t<total:
    chord(prog[i%4],t,2.2,.09,'tri'); tone(note(prog[i%4][0]-12),t,2.2,'sin',.18,a=.02,d=1.6)
    if t>=gend: tone(note(prog[i%4][3]+12),t+.5,.6,'sq',.06,.25,a=.01,d=.4)
    t+=2.0; i+=1
# master: soft clip, normalize to -3 dBFS peak, fade out
out=np.tanh(out*1.1); out=out/np.max(np.abs(out))*0.7
fade=int(sr*3); out[n-sr-fade:n-sr]*=np.linspace(1,0,fade); out[n-sr:]=0
with wave.open('music.wav','wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype(np.int16).tobytes())
print('music ok total',round(total,2),'logo',logo,'gate1',round(g1,2),'gag',round(gag,2),'boss',round(boss,2),'ko',round(ko,2))
