"""Tiny numpy chiptune + SFX kit shared by the trailer music scripts."""
import numpy as np, wave
sr=44100; out=None; n=0
def init(total):
    global out,n; n=int(sr*total)+sr; out=np.zeros(n)
def note(m): return 440*2**((m-69)/12)
def env(t,a=.005,d=.18): return np.minimum(t/a,1)*np.exp(-t/d)
def add(sig,start):
    s=int(start*sr); e=min(n,s+len(sig))
    if 0<=s<n: out[s:e]+=sig[:e-s]
def tone(f,start,length,wave='sq',vol=.15,duty=.5,a=.005,d=.18,glide=None,vib=0):
    t=np.arange(int(sr*length))/sr
    ff=f if glide is None else f*(glide/f)**(t/length)
    if vib: ff=ff*(1+vib*np.sin(2*np.pi*6*t))
    ph=np.cumsum(np.broadcast_to(ff,t.shape))/sr
    w={'sq':np.where(ph%1<duty,1.0,-1.0),'tri':2*np.abs(2*(ph%1)-1)-1,'saw':2*(ph%1)-1,'sin':np.sin(2*np.pi*ph)}[wave]
    add(vol*w*env(t,a,d),start)
def kick(start,vol=.6):
    t=np.arange(int(sr*.3))/sr; add(vol*np.sin(2*np.pi*(130*np.exp(-t*16)+38)*t)*env(t,.002,.13),start)
def snare(start,vol=.3):
    t=np.arange(int(sr*.2))/sr; add(vol*(np.random.uniform(-1,1,len(t))*.7+.3*np.sin(2*np.pi*190*t))*env(t,.001,.07),start)
def hat(start,vol=.07,length=.05):
    t=np.arange(int(sr*length))/sr; add(vol*np.random.uniform(-1,1,len(t))*env(t,.001,length/2.5),start)
def crash(start,vol=.35,length=1.4):
    t=np.arange(int(sr*length))/sr; add(vol*np.random.uniform(-1,1,len(t))*env(t,.002,length*.36),start)
def riser(start,length,vol=.25):
    t=np.arange(int(sr*length))/sr; nz=np.random.uniform(-1,1,len(t)); add(vol*nz*(t/length)**2,start); tone(110,start,length,'saw',vol*.6,glide=880,a=.3,d=length*3)
def chord(ms,start,length,vol=.14,wave='sq',duty=.5):
    for m in ms: tone(note(m),start,length,wave,vol,duty,a=.01,d=length*.6)
def theme(start,end,bpm,mel,bass,drums='med',vol=1.0,duty=.25,octave=0,hats=True):
    beat=60/bpm; step=beat/2; t=start; k=0
    while t<end-.01:
        m=mel[k%len(mel)]
        if m: tone(note(m+octave),t,step*1.15,'sq',.14*vol,duty,a=.004,d=.14)
        if k%4==0: tone(note(bass[(k//4)%len(bass)]),t,beat,'tri',.2*vol,a=.005,d=.3)
        if drums!='none':
            if k%8==0: kick(t,.5*vol)
            if k%8==4: snare(t,.26*vol)
            if drums=='hard':
                if k%2==1 and hats: hat(t,.06*vol)
                if k%16==14: snare(t+step/2,.18*vol)
                if k%4==2: kick(t,.3*vol)
            elif k%2==0 and hats: hat(t,.05*vol)
        t+=step; k+=1
# ---- game SFX (match the in-game WebAudio sounds) ----
def bip(t0,vol=.3):
    tone(1320,t0,.09,'sq',vol,.5,a=.002,d=.05); tone(1760,t0+.05,.08,'sq',vol*.8,.5,a=.002,d=.05)
def bup(t0,vol=.5,crit=False):
    t=np.arange(int(sr*.18))/sr; add(vol*np.sin(2*np.pi*(180*np.exp(-t*22)+45)*t)*env(t,.001,.09),t0)
    add(vol*.5*np.random.uniform(-1,1,len(t))*env(t,.001,.03),t0)
    if crit: tone(880,t0+.02,.25,'sq',vol*.35,.25,a=.002,d=.12,glide=1760); crash(t0,vol*.35,.5)
def quack(t0,vol=.35):
    for i in range(2): tone(330,t0+i*.17,.14,'saw',vol,a=.004,d=.09,glide=200,vib=.08)
def buzzer(t0,vol=.4):
    tone(110,t0,.28,'sq',vol,.5,a=.002,d=.2); tone(113,t0,.28,'sq',vol*.6,.5,a=.002,d=.2); snare(t0,.25)
def whoosh(t0,vol=.25,length=.3):
    t=np.arange(int(sr*length))/sr; add(vol*np.random.uniform(-1,1,len(t))*np.sin(np.pi*t/length)**2,t0)
def trombone(t0,notes=(64,62,60,57),vol=.22,step=.22,last=.9):
    for i,m in enumerate(notes): tone(note(m),t0+i*step,step*.95 if i<len(notes)-1 else last,'saw',vol,a=.02,d=.5,vib=.012 if i==len(notes)-1 else 0)
def write(path,fade=3.0,peak=.7):
    o=np.tanh(out*1.1); o=o/np.max(np.abs(o))*peak
    f=int(sr*fade); o[n-sr-f:n-sr]*=np.linspace(1,0,f); o[n-sr:]=0
    with wave.open(path,'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((o*32767).astype(np.int16).tobytes())
