"""Trailer v3 score: scene-structured chiptune + SFX synced to the in-page event log (v3/timeline.json)."""
import json
from chip import *
T=json.load(open('v3/timeline.json')); M=T['marks']; total=T['total']; init(total)
A=[69,72,74,76,74,72,69,67, 69,72,76,79,76,74,72,69, 64,67,69,72,69,67,64,62, 64,67,69,72,74,72,69,67]
B=[81,79,76,74,76,79,81,84, 81,79,76,74,72,74,76,79, 76,74,72,69,72,74,76,79, 81,84,81,79,76,74,72,69]
BOSS=[57,69,57,68,57,69,57,67, 60,72,60,71,60,72,60,69, 57,69,57,68,57,69,57,67, 62,74,62,73,62,74,62,71]
bassA=[45,45,52,45,48,48,43,43]; bassB=[41,41,43,43,45,45,52,52]; bassBoss=[45,45,45,45,48,48,50,50]
ev=T['events']; E=lambda k,a,b: [e for e in ev if e['k']==k and a<=e['t']<b]
# ---- 1. hook: cold open, tense ticking, duck scam ----
fooled=M['fooled']; logo=M['logo']
t=0.0
while t<fooled-.1: tone(55,t,.5,'sin',.2,a=.01,d=.4); hat(t,.09,.04); hat(t+.25,.05,.03); t+=.5
tone(27.5,0,1.2,'sin',.3,a=.01,d=.8)
trombone(fooled+.15,(67,65,63,60),.24,.2,.8)      # sad trombone right on the scam
riser(logo-1.1,1.1,.3)
# ---- 2. logo: stinger ----
chord([45,52,57,64,69],logo,1.6,.22,'sq',.5); kick(logo,.9); crash(logo,.45); tone(27.5,logo,1.6,'sin',.5,a=.005,d=.6)
for i,m in enumerate([69,72,76,81]): tone(note(m),logo+1.1+i*.13,.5,'sq',.12,.25,a=.004,d=.35)
tone(note(81),logo+1.65,1.3,'sq',.1,.25,a=.01,d=.9)
# ---- 3. gate 1 ----
g1=M['gate1']; w1=M['win1']; gag=M['gag']; lose=M['lose']; mon=M['montage']; duck=M['duck']; hold=M['hold']; spot=M['spot']; boss=M['boss']; ko16=M['ko16']; fin=M['final']; ko=M['ko']; outro=M['outro']
theme(M['game'],g1,150,A,bassA,'none',.6)
theme(g1,w1-.05,150,A,bassA,'med',1.0)
for i,m in enumerate([76,79,81,88]): tone(note(m),w1+i*.11,.4,'sq',.14,.25,a=.004,d=.3)
tone(note(88),w1+.44,.9,'sq',.1,.25,a=.01,d=.7); crash(w1,.25)
# ---- 4. rule break: drums out, wah, then sad trombone on the loss ----
theme(w1+1.3,gag-.05,150,A,bassA,'none',.7)
tone(330,gag,.6,'saw',.22,glide=110,a=.01,d=.5); tone(165,gag+.05,.6,'saw',.12,glide=55,a=.01,d=.5)
t=gag+.8
while t<lose-.2: tone(55,t,.5,'sin',.18,a=.01,d=.4); hat(t,.07,.04); t+=.5
trombone(lose+.1,(64,62,60,57),.24,.24,1.1)
# ---- 5. montage: fast and hard, stab on every cut ----
theme(mon,duck-.05,168,B,bassB,'hard',1.0,duty=.5)
for k in ('montage','m1','m2'): crash(M[k],.3,.6); kick(M[k],.8)
# ---- 6. duck lesson: stab, stop, ticking, resume ----
tone(220,duck,.25,'saw',.3,glide=140); tone(110,duck,.25,'saw',.2,glide=70); snare(duck,.4)
t=duck+.4
hits=E('hit',duck,hold)
while t<(hits[0]['t'] if hits else hold)-.1: tone(55,t,.5,'sin',.18,a=.01,d=.4); hat(t,.08,.04); hat(t+.25,.05,.03); t+=.5
if hits: theme(hits[0]['t']+.3,hold-.05,168,B,bassB,'med',.8,duty=.5)
# ---- 7. hold: rising charge until the release ----
hits=E('hit',hold,spot)
rel=hits[0]['t'] if hits else hold+1.5
tone(110,hold+.3,rel-hold-.3,'tri',.22,glide=880,a=.05,d=(rel-hold)*3); hat(hold+.3,.05,.03)
t=hold+.3
while t<rel: hat(t,.06,.03); t+=.125
crash(rel,.3,.8); kick(rel,.8)
theme(rel+.4,spot-.05,168,B,bassB,'med',.7,duty=.5,octave=-12)
# ---- 8. volcano: lower, smoky, no hats ----
theme(spot,boss-.05,168,B,bassB,'med',.8,duty=.5,octave=-12,hats=False)
# ---- 9. boss 16 ----
crash(boss,.35); kick(boss,.9)
theme(boss,ko16-1.0,172,BOSS,bassBoss,'hard',1.0,duty=.5)
riser(ko16-1.4,1.4,.28)
chord([45,52,57,64],ko16,1.2,.22,'sq',.5); kick(ko16,1.0); crash(ko16,.45); tone(27.5,ko16,1.2,'sin',.5,a=.005,d=.5)
for i,m in enumerate([69,73,76,81]): tone(note(m),ko16+.9+i*.12,.45,'sq',.13,.25,a=.004,d=.35)
# ---- 10. final boss: faster, phase lifts ----
crash(fin,.35); kick(fin,.9)
ph=[e['t'] for e in ev if e['k']=='hit' and e['gate']==40]
theme(fin,ko-1.2,184,BOSS,bassBoss,'hard',1.0,duty=.5)
theme(fin+4,ko-1.2,184,[m+12 if m else 0 for m in BOSS],bassBoss,'none',.35,duty=.25)
riser(ko-1.6,1.6,.3)
chord([45,52,57,64],ko,1.4,.24,'sq',.5); kick(ko,1.0); crash(ko,.5); tone(27.5,ko,1.4,'sin',.5,a=.005,d=.5)
for i,m in enumerate([69,73,76,81,85]): tone(note(m),ko+1.2+i*.12,.5,'sq',.13,.25,a=.004,d=.4)
tone(note(85),ko+1.8,1.4,'sq',.1,.25,a=.01,d=1.0)
# ---- 11. result + outro: calm chords, tag sting ----
t=ko+3.0; prog=[[57,61,64,69],[55,59,62,67],[53,57,60,65],[55,59,62,67]]; i=0
while t<total:
    chord(prog[i%4],t,2.2,.09,'tri'); tone(note(prog[i%4][0]-12),t,2.2,'sin',.18,a=.02,d=1.6)
    if t>=outro: tone(note(prog[i%4][3]+12),t+.5,.6,'sq',.06,.25,a=.01,d=.4)
    t+=2.0; i+=1
for i,m in enumerate([81,0,84,88]):
    if m: tone(note(m),outro+1.2+i*.14,.5,'sq',.12,.25,a=.004,d=.4)
# ---- SFX from the event log ----
for e in ev:
    k,t0=e['k'],e['t']
    if k=='go': bip(t0)
    elif k=='hit': bup(t0,.55,crit=bool(e['ms'] and e['ms']<130))
    elif k=='fakesig': quack(t0)
    elif k=='hurt': buzzer(t0); whoosh(t0-.08,.2)
    elif k=='won':
        for i,m in enumerate([76,81,88]): tone(note(m),t0+i*.08,.3,'sq',.1,.25,a=.003,d=.2)
write('v3/music.wav')
print('music ok',round(total,2),'events',len(ev))
