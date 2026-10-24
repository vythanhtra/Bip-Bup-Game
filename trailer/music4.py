"""Trailer v4 score: scene-structured chiptune + SFX synced to the event log. Usage: python3 music4.py vi|en"""
import json, sys
from chip import *
LANG=sys.argv[1] if len(sys.argv)>1 else 'vi'; OUT=f'v4-{LANG}'
T=json.load(open(f'{OUT}/timeline.json')); M=T['marks']; total=T['total']; init(total); ev=T['events']
E=lambda k,a,b: [e for e in ev if e['k']==k and a<=e['t']<b]
A=[69,72,74,76,74,72,69,67, 69,72,76,79,76,74,72,69, 64,67,69,72,69,67,64,62, 64,67,69,72,74,72,69,67]
B=[81,79,76,74,76,79,81,84, 81,79,76,74,72,74,76,79, 76,74,72,69,72,74,76,79, 81,84,81,79,76,74,72,69]
BOSS=[57,69,57,68,57,69,57,67, 60,72,60,71,60,72,60,69, 57,69,57,68,57,69,57,67, 62,74,62,73,62,74,62,71]
DAILY=[76,0,79,0,81,0,84,0, 83,0,79,0,76,0,74,0, 72,0,76,0,79,0,81,0, 79,0,76,0,74,0,72,0]
bassA=[45,45,52,45,48,48,43,43]; bassB=[41,41,43,43,45,45,52,52]; bassBoss=[45,45,45,45,48,48,50,50]; bassD=[48,48,52,52,45,45,43,43]
def tick(a,b,vol=.18):
    t=a
    while t<b-.1: tone(55,t,.5,'sin',vol,a=.01,d=.4); hat(t,.09,.04); hat(t+.25,.05,.03); t+=.5
def KO(t0,big=False):
    chord([45,52,57,64],t0,1.4 if big else 1.2,.24 if big else .22,'sq',.5); kick(t0,1.0); crash(t0,.5 if big else .45); tone(27.5,t0,1.4,'sin',.5,a=.005,d=.5)
    for i,m in enumerate([69,73,76,81,85] if big else [69,73,76,81]): tone(note(m),t0+(1.2 if big else .9)+i*.12,.5,'sq',.13,.25,a=.004,d=.4)
    if big: tone(note(85),t0+1.8,1.4,'sq',.1,.25,a=.01,d=1.0)
fooled=M['fooled']; logo=M['logo']
tick(0,fooled); tone(27.5,0,1.2,'sin',.3,a=.01,d=.8); trombone(fooled+.15,(67,65,63,60),.24,.2,.8); riser(logo-1.1,1.1,.3)
chord([45,52,57,64,69],logo,1.6,.22,'sq',.5); kick(logo,.9); crash(logo,.45); tone(27.5,logo,1.6,'sin',.5,a=.005,d=.6)
for i,m in enumerate([69,72,76,81]): tone(note(m),logo+1.1+i*.13,.5,'sq',.12,.25,a=.004,d=.35)
tone(note(81),logo+1.65,1.3,'sq',.1,.25,a=.01,d=.9)
g1,w1,gag,lose,mon,duck,rev,cnt,hold,spot,boss,ko16,daily,dres,ghost,fin,ko,vs,vs1,vs2,vs3,vsend,outro=[M[k] for k in ('gate1','win1','gag','lose','montage','duck','reverse','count','hold','spot','boss','ko16','daily','dailyRes','ghost','final','ko','vs','vs1','vs2','vs3','vsend','outro')]
theme(M['game'],g1,150,A,bassA,'none',.6); theme(g1,w1-.05,150,A,bassA,'med',1.0)
for i,m in enumerate([76,79,81,88]): tone(note(m),w1+i*.11,.4,'sq',.14,.25,a=.004,d=.3)
tone(note(88),w1+.44,.9,'sq',.1,.25,a=.01,d=.7); crash(w1,.25)
theme(w1+1.3,gag-.05,150,A,bassA,'none',.7)
tone(330,gag,.6,'saw',.22,glide=110,a=.01,d=.5); tone(165,gag+.05,.6,'saw',.12,glide=55,a=.01,d=.5)
tick(gag+.8,lose-.2,.16); trombone(lose+.1,(64,62,60,57),.24,.24,1.1)
theme(mon,duck-.05,168,B,bassB,'hard',1.0,duty=.5)
for k in ('montage','m1','m2'): crash(M[k],.3,.6); kick(M[k],.8)
tone(220,duck,.25,'saw',.3,glide=140); tone(110,duck,.25,'saw',.2,glide=70); snare(duck,.4)
hits=E('hit',duck,rev); tick(duck+.4,(hits[0]['t'] if hits else rev)-.1)
if hits: theme(hits[0]['t']+.3,rev-.05,168,B,bassB,'med',.8,duty=.5)
# reverse: scratch stab, then the theme played "backwards"
tone(880,rev,.35,'saw',.3,glide=110,a=.005,d=.3); snare(rev,.45); theme(rev+.5,cnt-.05,168,list(reversed(B)),bassB,'med',.85,duty=.5)
# count: ticking only, each crow gets a bell
tone(880,cnt,.35,'saw',.3,glide=110,a=.005,d=.3); snare(cnt,.45); tick(cnt+.4,hold-.1,.14)
for e in E('go',cnt,hold): tone(1760,e['t'],.25,'tri',.2,a=.003,d=.18)
hits=E('hit',hold,spot); rel=hits[0]['t'] if hits else hold+1.5
tone(110,hold+.3,rel-hold-.3,'tri',.22,glide=880,a=.05,d=(rel-hold)*3); t=hold+.3
while t<rel: hat(t,.06,.03); t+=.125
crash(rel,.3,.8); kick(rel,.8); theme(rel+.4,spot-.05,168,B,bassB,'med',.7,duty=.5,octave=-12)
theme(spot,boss-.05,168,B,bassB,'med',.8,duty=.5,octave=-12,hats=False)
crash(boss,.35); kick(boss,.9); theme(boss,ko16-1.0,172,BOSS,bassBoss,'hard',1.0,duty=.5); riser(ko16-1.4,1.4,.28); KO(ko16)
# daily: bright, bouncy
theme(daily,dres-.05,160,DAILY,bassD,'med',.85,duty=.25)
for i,m in enumerate([76,81,88]): tone(note(m),dres+i*.09,.3,'sq',.12,.25,a=.003,d=.25)
chord([57,61,64,69],dres+.4,2.0,.08,'tri')
# ghost: eerie pad + soft theme
tone(220,ghost,ghost and 2.2,'sin',.16,vib=.03,a=.3,d=2.0); tone(330,ghost+.3,2.0,'sin',.1,vib=.03,a=.3,d=1.8)
theme(ghost+2.0,fin-.05,150,A,bassA,'none',.55)
crash(fin,.35); kick(fin,.9); theme(fin,ko-1.2,184,BOSS,bassBoss,'hard',1.0,duty=.5); theme(fin+4,ko-1.2,184,[m+12 if m else 0 for m in BOSS],bassBoss,'none',.35,duty=.25)
riser(ko-1.6,1.6,.3); KO(ko,True)
t=ko+3.0; prog=[[57,61,64,69],[55,59,62,67],[53,57,60,65],[55,59,62,67]]; i=0
while t<vs-.1:
    chord(prog[i%4],t,2.2,.09,'tri'); tone(note(prog[i%4][0]-12),t,2.2,'sin',.18,a=.02,d=1.6); t+=2.0; i+=1
# versus: party tempo
crash(vs,.35); kick(vs,.9); theme(vs+.2,vsend-.1,176,B,bassB,'hard',1.0,duty=.5)
for k in ('vs1','vs2','vs3'): crash(M[k],.3,.6); kick(M[k],.8)
KO(vsend)
t=vsend+2.6; i=0
while t<total:
    chord(prog[i%4],t,2.2,.09,'tri'); tone(note(prog[i%4][0]-12),t,2.2,'sin',.18,a=.02,d=1.6)
    if t>=outro: tone(note(prog[i%4][3]+12),t+.5,.6,'sq',.06,.25,a=.01,d=.4)
    t+=2.0; i+=1
for i,m in enumerate([81,0,84,88]):
    if m: tone(note(m),outro+1.2+i*.14,.5,'sq',.12,.25,a=.004,d=.4)
for e in ev:
    k,t0=e['k'],e['t']
    if k=='go': bip(t0)
    elif k=='hit': bup(t0,.55,crit=bool(e['ms'] and e['ms']<130))
    elif k=='fakesig': quack(t0)
    elif k=='hurt': buzzer(t0); whoosh(t0-.08,.2)
    elif k=='won':
        for i,m in enumerate([76,81,88]): tone(note(m),t0+i*.08,.3,'sq',.1,.25,a=.003,d=.2)
write(f'{OUT}/music.wav'); print('music ok',round(total,2),'events',len(ev))
