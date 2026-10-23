import numpy as np, wave, sys
sr=44100; bpm=150; beat=60/bpm; total=float(sys.argv[1]) if len(sys.argv)>1 else 100
n=int(sr*total); out=np.zeros(n)
def note(f): return 440*2**((f-69)/12)
def sq(f,t,duty=.5): return np.where((t*f)%1<duty,1.0,-1.0)
def tri(f,t): return 2*np.abs(2*((t*f)%1)-1)-1
def env(t,a=.005,d=.18): return np.minimum(t/a,1)*np.exp(-t/d)
# A minor pentatonic hook, 8 bars, 16th notes
mel=[69,72,74,76,74,72,69,67, 69,72,76,79,76,74,72,69, 64,67,69,72,69,67,64,62, 64,67,69,72,74,72,69,67]
mel2=[81,79,76,74,76,79,81,84, 81,79,76,74,72,74,76,79, 76,74,72,69,72,74,76,79, 81,84,81,79,76,74,72,69]
bass=[45,45,52,45,48,48,43,43]
step=beat/2
def add(sig,start,t0len):
    s=int(start*sr); e=min(n,s+len(sig)); 
    if s<n: out[s:e]+=sig[:e-s]
i=0; t=0.0; bar=0
while t<total:
    seq=mel if (bar//8)%2==0 else mel2
    for k,m in enumerate(seq):
        tt=np.arange(int(sr*step*1.2))/sr
        add(.18*sq(note(m),tt,.25)*env(tt,.004,.14), t+k*step, 0)
        if k%4==0:
            b=bass[(k//4+bar*8)%8]; tb=np.arange(int(sr*beat))/sr
            add(.22*tri(note(b),tb)*env(tb,.005,.35), t+k*step, 0)
        if k%2==0:
            th=np.arange(int(sr*.05))/sr; add(.05*np.random.uniform(-1,1,len(th))*env(th,.001,.02), t+k*step,0)
        if k%8==0:
            tk=np.arange(int(sr*.25))/sr; add(.5*np.sin(2*np.pi*(120*np.exp(-tk*18)+40)*tk)*env(tk,.002,.12), t+k*step,0)
        if k%8==4:
            ts=np.arange(int(sr*.18))/sr; add(.22*np.random.uniform(-1,1,len(ts))*env(ts,.001,.06), t+k*step,0)
    t+=len(seq)*step; bar+=4
out=np.tanh(out*1.4)*.8
with wave.open('music.wav','wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype(np.int16).tobytes())
print('music.wav', total, 's')
