/* ===== DON'T TRUST THE DUCK: English text layer for world.js (transcreation, not translation) ===== */
var LANG_EN = window.LANG_EN || {}; window.LANG_EN = LANG_EN;
LANG_EN.world = {
  STORY: [
    'The Land of Boop used to be fast. Roosters crowed at 5 sharp. Rice cakes cooked in 12 hours. You called someone, they answered.',
    'Up in the Sky Court, the Turtle Lord, ten thousand years old, got sick of everyone calling him slow. So he dropped the Slowness Curse on the world: now everyone is as slow as he is.',
    'Now roosters crow at 2 p.m. Ti’s New Year rice cakes have been cooking for three months. The Village Chief yawns and half a day is gone. Even Ti’s boop...',
    'New Year is almost here. Ti Boop, the only student of Grandma Boop, puts Beep on his shoulder, leaves Bamboo Village, crosses 5 lands and breaks 40 gates held by the Turtle’s goons, all the way up to the Sky Court to make him lift the curse.',
    'One rule. When Beep crows BEEP, the fight is on. Swing before the beep and you get pecked. After that: punch, dodge, block, and laugh.'
  ],
  RANKS: [
    [200, '👑', 'Boop Emperor'],
    [240, '🥇', 'Golden Royal'],
    [290, '⚔️', 'Iron Master'],
    [350, '🎋', 'Bamboo Fighter'],
    [1e9, '🌱', 'Grass Rookie']
  ],
  HEROES: {
    tibup: { name: 'Ti Boop', perk: 'Balanced. Not strong, not weak, very hungry.', line: 'One boop. The ground files a complaint.', bio: '16, Bamboo Village. Fists twice the size of his head. Weakness: the smell of dinner.' },
    hoayen: { name: 'Blaze Yen', perk: '+30% damage. Her super keeps burning the opponent.', line: 'HOT!!! Everything is HOT!!!', bio: 'Grills rice paper at the Night Market. Set fire to three neighbouring stalls. Hits harder than anyone.' },
    bangnhi: { name: 'Frost Nhi', perk: 'Her super freezes the opponent for 1.5 s. The first swing before the BEEP each fight is forgiven.', line: 'Calm... calm... BOOP.', bio: 'From the Frozen River. Talks slow, thinks hard. Her super freezes the opponent.' },
    thachlao: { name: 'Old Stone', perk: '200 HP, the most, but hits 20% softer. Super, Sulk: reflects every hit for 3 s.', line: 'I am rock. Rock does not rush.', bio: 'A rock Ti punched 10,000 times until it woke up. Lots of HP, soft hits, sulks constantly.' }
  },
  ENEMIES: {
    linhco:   { name: 'Grass Guard', line: 'Scarecrow. Fears nothing but fire.' },
    traului:  { name: 'Lazy Buffalo', line: 'Zzz... hit me later... zzz...' },
    linhdem:  { name: 'Lantern Cop', line: 'Night shift. Double pay, double.' },
    vitgia:   { name: 'Certified Rooster (actually a duck)', line: 'Cock-a-doodle... I mean... quack.' },
    lytruong: { name: 'Yawning Chief', line: 'Yawn... speed is illegal. Taxed.' },
    cao:      { name: 'Big Bro Designer', line: 'Genuine Aura, $9.99. Uh... BEEP!' },
    canhcut:  { name: 'Lion-Dance Penguin', line: 'Boom boom tak... forgot the dance.' },
    nguoituyet: { name: 'Sneezing Snowman', line: 'Ah... don’t hit me mid... CHOO!' },
    bangvuong: { name: 'Sneezing Ice King', line: 'One sneeze freezes the river.' },
    khilua:   { name: 'Fire Monkey', line: 'Grilled banana? On my own hands.' },
    ganuong:  { name: 'Resurrected Roast Chicken', line: 'Roasted 3 times. Now I roast back.' },
    hoalong:  { name: 'Hotpot Dragon', line: 'See it in the smoke? Boop it.' },
    thienbinh: { name: 'Napping Sky Guard', line: '3,000 years on duty... nap... BOOP' },
    tiennu:   { name: 'Fairy Influencer', line: 'Drop a like, guys. Fighting a kid.' },
    rua:      { name: 'Turtle Lord', line: 'Ten thousand years. Now YOU slow.' }
  },
  WORLDS: [
    { name: 'Bamboo Village', sub: 'Sunrise, rice fields, bamboo wind', mech: 'Learn to fight: walk, combo, hold back to block, jump, dash. Only swing after the BEEP.' },
    { name: 'Night Market', sub: 'Lanterns, grill smoke, scams', mech: 'The duck yells fake BEEPs mid-fight: on QUACK, hold your fists. Enemies grab 🤲 (jab to interrupt), anti-air your jumps and dash in.' },
    { name: 'Frozen River', sub: 'Aurora, snow, sneezes', mech: 'Slippery ice: you keep sliding after you stop. Enemies have a knockdown hook.' },
    { name: 'Volcano', sub: 'Lava, hotpot smoke', mech: 'Smoke hides the arrows: watch the enemy fist. Standing still burns your feet. Enemies perfect-block and counter.' },
    { name: 'Sky Court', sub: 'Golden clouds, fairy livestreams', mech: 'Each fight mixes two things you have met, at random. Final boss: 3 rounds.' }
  ],
  PHASE_LINES: {
    40: ['Round one. I’m not even awake.', 'Round two. You’re waking me up.', 'FINAL ROUND. TEN THOUSAND YEARS!']
  },
  PRO_DLG: [
    { name: 'Grandma Boop', text: 'See that, Ti? The Turtle’s curse got into your fist too. Nobody in this village can be quick anymore.' },
    { name: 'Ti Boop', text: 'So what do we eat for New Year, Grandma? The rice cakes are still raw!' },
    { name: 'Grandma Boop', text: 'Only one rooster in the world still crows on time: our Beep. The curse can’t touch his crow. Punch right on his BEEP and the curse can’t hold your hand.' },
    { name: 'Grandma Boop', text: 'That speed is called Ba Khi. Ten years I’ve trained you, and this is the day it was for.' },
    { name: 'Ti Boop', text: 'Why don’t you go, Grandma?' },
    { name: 'Grandma Boop', text: 'I’m seventy-eight and cursed. Getting to the village gate would take me three days. You are my only student.' },
    { name: 'Grandma Boop', text: 'The Turtle sits in the Sky Court. His goons hold 40 gates across 5 lands. Break them all, go up there, and make him lift the curse.' },
    { name: 'Beep the Rooster', text: 'Every gate you break, that land gets a little faster. I’m coming along to crow for you.' }
  ],
  DIALOG: {
    1: [
      { who: 'banoi', name: 'Grandma Boop', text: 'Ti. Listen. When Beep crows "BEEP", the fight is on. Swing before the beep and he pecks you. In the fight: punch, dodge, block.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Grandma, what if I’m hungry at that exact moment?' },
      { who: 'banoi', name: 'Grandma Boop', text: 'Hungry? Then boop faster. Hesitate and the Chief taxes your empty stomach.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'And stop looking at me like that. I am the referee, not the lunch.' }
    ],
    8: [
      { who: 'lytruong', name: 'Yawning Chief', text: 'Yawn... speed is illegal in this village. Anyone fast... yawn... pays a tax.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Are you done, sir? I’ve grown moss waiting.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'Careful: when he yawns, everyone gets sleepy. When he goes "Yaaawn...", hold back to block, or you nap for a second.' }
    ],
    9: [
      { who: 'gabip', name: 'Beep the Rooster', text: 'The Night Market has a DUCK pretending to be me. Mid-fight it yells a fake BEEP, with a QUACK. Hold your fists for a second; punch right then and you get pecked.' },
      { who: 'tibup', name: 'Ti Boop', text: 'A duck impersonating a rooster? Nothing is sacred anymore.' },
      { who: 'vitgia', name: 'Certified Rooster (actually a duck)', text: 'Cock-a-doodle... I mean... quack.' }
    ],
    16: [
      { who: 'cao', name: 'Big Bro Designer', text: 'Genuine Battle Aura, $9.99 a pack, buy 2 get 1 free. You in, little bro? Uh... BEEP!' },
      { who: 'tibup', name: 'Ti Boop', text: 'You’re not a rooster. You’re a fox in sunglasses.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'The Fox fights three rounds. When he yells "Buy 2 get 1, sold!" he lunges with Close the Deal: hold back to block. The duck is still around, too.' }
    ],
    17: [
      { who: 'gabip', name: 'Beep the Rooster', text: 'The Frozen River is slippery: stop walking and you keep sliding a bit. Stop earlier than usual.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Can I punch while I slide?' },
      { who: 'canhcut', name: 'Lion-Dance Penguin', text: 'Sure. I lion-dance on ice all day. Boom boom... whoa.' }
    ],
    20: [
      { who: 'gabip', name: 'Beep the Rooster', text: 'Review: slippery floor and the knockdown hook together. Dashes slide further on ice too.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Slide plus dash? So it is figure skating now?' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'Exactly. And art should look good. Fight.' }
    ],
    24: [
      { who: 'bangvuong', name: 'Sneezing Ice King', text: 'Ah... one sneeze and the whole river freezes. Two sneezes and... CHOO! CHOO!' },
      { who: 'tibup', name: 'Ti Boop', text: 'You have a cold. See a doctor. Why is the river paying for it?' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'When the Ice King yells "Freeze!", whoever gets hit is frozen solid. Hold back to block and you will not freeze.' }
    ],
    25: [
      { who: 'gabip', name: 'Beep the Rooster', text: 'The Volcano is full of smoke: it hides the warning arrows. Watch its fist instead: a yellow glow means winding up, red means here it comes.' },
      { who: 'khilua', name: 'Fire Monkey', text: 'Miss, and I grill bananas on your head.' }
    ],
    32: [
      { who: 'hoalong', name: 'Hotpot Dragon', text: 'My hotpot boils with smoke. See something? Boop it. If you can see anything.' },
      { who: 'tibup', name: 'Ti Boop', text: 'What kind of hotpot makes this much smoke? Did you put the firewood IN the pot?' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'When the dragon blows smoke, the whole arena goes blind. Hold back to block, then watch for the glowing fist.' }
    ],
    33: [
      { who: 'tiennu', name: 'Fairy Influencer', text: 'Guys, drop a like. Today I’m fighting a kid who brought a rooster to heaven.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'The Sky Court mixes two things you have met, picked at random: the duck, ice, smoke, hot ground, feints. At the start of each fight I tell you which two.' }
    ],
    40: [
      { who: 'rua', name: 'Turtle Lord', text: 'Ten thousand years I was slow. Today the whole world is slow with me.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Sir, my rice cakes have been cooking for three months. I need to get home before they turn into coal.' },
      { who: 'rua', name: 'Turtle Lord', text: 'Then survive my three rounds first. Round one... I’m not even awake.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'Three rounds, and each round he changes his moves: faster and trickier as it goes. Win two rounds and you are done. Lose and you go train again. No crying.' }
    ]
  },
  WIN_LINES: {
    8: 'The Chief yawned once and fell asleep for good. Bamboo Village woke up. The rooster crows at 5 again.',
    16: 'Big Bro ran off barefoot, leaving 300 packs of fake Aura. Up north the Frozen River thaws. Blaze Yen joins (new character unlocked).',
    24: 'The Ice King sneezed one last time and went into hibernation. The river flows. Frost Nhi quietly tags along (new character unlocked).',
    32: 'The hotpot finally cooked. Smoke cleared. Old Stone, the rock Ti punched 10,000 times, got up and followed (new character unlocked).',
    40: 'The Turtle Lord fell... then yawned. The Curse broke. Roosters crow at 5. Ti ran home: rice cakes done. The Turtle got a slice. Chewed slow.'
  },
  SHOP_TXT: { banh1: { name: 'Rice cake', desc: 'Max HP +20 each (base 120). Up to 3, price rises. Always on, nothing to wear.' }, duaca: { name: 'Big chopsticks', desc: 'Punches reach 1.5 tiles further and hit harder: 8 to 9 damage.' }, giaprom: { name: 'Straw armour', desc: 'Max HP +30, but you walk 5% slower. Ti\'s outfit turns straw-gold.' }, chay: { name: 'Rice pestle', desc: 'Heavy hits and the combo hook deal 6 more (18 to 24).' }, aomua: { name: 'Leaf raincoat', desc: 'Blocking costs half the usual HP. Ti\'s outfit turns leaf-green.' }, quatmo: { name: 'Palm fan', desc: 'Blocking costs no HP. After a perfect block you get 0.9 s of double-damage counter (normally 0.6).' }, aodai: { name: 'Red ao dai', desc: 'Ba Khi fills 30% faster, so specials come sooner. Ti\'s outfit turns red.' }, gaytre: { name: 'Bamboo staff', desc: 'Ba Khi Rush and supers deal 10 more and reach 1 tile further.' }, noicom: { name: 'Rice pot', desc: 'Max HP +40, but you walk 10% slower.' }, aotien: { name: 'Fairy robe', desc: 'Perfect-block window twice as long (0.15 to 0.3 s), counters come easier. Ti\'s outfit turns sky blue.' } },
  SUPERS: {
    tibup: { name: 'Hungry Haymaker Flurry', line: 'SO HUNGRY! PUNCH EVERYTHING!' }, hoayen: { name: 'Rice-Paper Face Grill', line: 'HOT ENOUGH?!' }, bangnhi: { name: 'Stay... Calm...', line: 'Stay... calm... then... BOOP.' }, thachlao: { name: 'Sulk', line: "I'm sulking. Rocks don't fight." },
    linhco: { name: 'Straw Storm', line: 'STRAW STORM!' }, traului: { name: 'Nap Body Slam', line: 'Zzz... timber...' }, linhdem: { name: 'Flash Photo', line: 'Say cheese!' }, vitgia: { name: 'Fake Crow', line: 'BEEP! (trust me)' }, lytruong: { name: 'Contagious Yawn', line: 'Yaaawn...' }, cao: { name: 'Close the Deal', line: 'Buy 2 get 1, sold!' },
    canhcut: { name: 'Wild Lion Dance', line: 'BOOM BOOM CLACK!' }, nguoituyet: { name: 'Sneeze Blizzard', line: 'AH... CHOOO!' }, bangvuong: { name: 'Royal Deep Freeze', line: 'Freeze!' }, khilua: { name: 'Grilled Banana Rain', line: 'Bananas away!' }, ganuong: { name: 'Crispy Revival', line: 'Roast me a fourth time!' },
    hoalong: { name: 'Smoke Hotpot', line: 'More smoke!' }, thienbinh: { name: 'Sleepy Crush', line: 'Zzz... THUD.' }, tiennu: { name: 'Hearts Flood', line: 'Drop hearts, everyone!' }, rua: { name: 'Art of Slowness', line: 'Slow... down...' }
  },
  GRANDMA: {
    start: ['Fight properly, Grandma is watching.', 'Remember: beep first, then boop.', 'Stand up straight, Tí!'], combo: ['Three in a row! I taught you that.', 'Nice hook. Just like your grandpa.', "That's my grandson."],
    perfect: ['Perfect block! Now hit him back.', 'Block like that and even the rice cake is scared.', 'He left his ribs open!'], heroLow: ['Tí, one breath left.', 'I told you to eat breakfast.', 'Block, block, child!'],
    enemyLow: ["He's about to drop. Don't get greedy.", 'One more hit.', 'He is shaking, I can see it.'], ko: ["That's it! Come home, I'm cooking.", 'Down. Whole village, clap.', "That's my boy."],
    lost: ['Get up and go again.', 'Lose, then train. No crying.', "I'm not angry. I'm just... sighing."], time: ['Ten seconds, hurry!', 'Time is running out, child.', 'Hit him, stop admiring!'],
    idle: ['Are you two dancing?', "I'm old, I can't wait this long.", 'Even the rooster is yawning.', 'What are those hands for?'], ref: ["Rooster crossing, don't hit the rooster!", 'The referee is running again. Dear me.', 'Hit the rooster and I hit you.'],
    superHero: ['Ba Khi! The whole village heard that.', "That's our family's kung fu.", 'I have goosebumps.'], superEnemy: ['Careful, he is up to something!', 'I saw that trick back in 1975.', 'Block, Tí! Block!']
  },
  REF_LINES: { run: ['Referee coming through!', 'Move, rooster walking!', 'No hitting the rooster!'], peck: ['PECK! Who told you to hit a rooster.', 'Referees feel pain too!', 'Yellow card! I mean, yellow beak.'] },
  TAUNTS: {
    linhco: ['Even scarecrows can wait.', 'You shaking?', 'Wind can’t move me.', 'Crows fear me. Why not you?', 'Been standing here since 1998.', 'Punch me: 7 years bad luck.'],
    traului: ['Zzz... zzz...', 'Hit soft, I’m dreaming.', 'Grass tastes better than you.', 'Dreaming you lose...', 'Five more minutes...', 'Lying down is a martial art.'],
    linhdem: ['Night shift. Keep it down.', 'Where’s my overtime?', 'My lantern is brighter than you.', 'One photo first.', 'Staring fee: $2.', 'Go home, market’s closed.'],
    vitgia: ['Cluck... quack... cluck.', 'Trust me, I’m a rooster.', 'Roosters can swim, right?', 'Quack. I mean cluck.', 'Here’s my rooster certificate.', 'Swimming rooster. Evolved.'],
    lytruong: ['Yawn... taxes?', 'Speed is... yawn... banned.', 'Wait till I finish yawning.', 'Being fast is a crime.', 'One yawn = the whole week.', 'Did you file a boop permit?'],
    cao: ['Buy 2 get 1?', 'Big Bro is legit.', 'Sunglasses, $9.99.', 'You’re a VIP customer.', 'Genuine... genuinely mine.', 'No cash? I do instalments.'],
    canhcut: ['Boom boom... forgot it.', 'Too cold, boop me warm.', 'Lion dance, no snacks?', 'Tak boom... tak what?', 'Lion head is heavy.', 'Where did the audience go?'],
    nguoituyet: ['Ah... ah...', 'Don’t hit me mid-sneeze.', 'New carrot nose, fresh.', 'Had this cold 400 years.', 'Anyone got a tissue?', 'Ah... not yet... nervous?'],
    bangvuong: ['Ah... CHOO yet?', 'One sneeze = frozen.', 'I’m sick. You’re dead.', 'The river is my hanky.', 'That’s a royal sneeze.', 'Don’t look at my nose.'],
    khilua: ['Grilled banana?', 'My hands are on fire.', 'Monkeys can boop too.', 'Self-charcoal, cheap.', 'You hot or am I hot?', 'Don’t pour water!'],
    ganuong: ['Roasted three times already.', 'Crispy yet?', 'This time I roast YOU.', 'Smell that? That’s me.', 'My skin is shoe leather.', 'Salt, pepper, lime?'],
    hoalong: ['Hotpot boiling yet?', 'Eyes burning yet?', 'Can you see anything?', 'More veggies?', 'Dragon hotpot: $50 a pot.', 'Cough. That’s the smoke.'],
    thienbinh: ['Three thousand years... yawn.', 'Quick nap.', 'Sky gate... zzz.', 'Paid in clouds.', 'Who’s there? Eh... sleep.', 'Sleeping standing up. Pro.'],
    tiennu: ['Drop a like, guys!', 'I’m live right now.', 'Is this my good angle?', 'Link in the comments.', '10K people watching.', 'Don’t roast me, I’ll cry.'],
    rua: ['Ten thousand years.', 'Slow... is fast.', 'What’s the rush?', 'Let me think... till next week.', 'Boop tomorrow. Same thing.', 'Fast people? All old now.']
  },
  HERO_CHEER: {
    tibup: ['BOOP!', 'So hungry!', 'Again!', 'Grandma, look!', 'Big hands, big boop!', 'Dinner time!'],
    hoayen: ['HOT!!!', 'Burn!', 'More fire!', 'Extra crispy!', 'Crunch!', 'Blazing!'],
    bangnhi: ['Calm... down.', 'Cold.', 'Just enough.', 'Done.', 'Don’t celebrate yet.', 'Ice.'],
    thachlao: ['Rock does not rush.', 'Hmph.', 'Done.', 'Rock drop.', 'Slow but sure.', 'Ten thousand punches, returned.']
  },
  HERO_OUCH: {
    tibup: ['Ow!', 'Grandma!', 'Slipped!', 'Hungry hands shake!', 'Yikes!', 'That hurt, Grandma!'],
    hoayen: ['Furious!!!', 'Who booped?!', 'Blood’s boiling!', 'I’ll burn his house!', 'Hmph!', 'Missed!'],
    bangnhi: ['...', 'Bit early.', 'Cold now.', 'Miscounted.', 'Hm.', 'Breathe.'],
    thachlao: ['Sulking.', 'Rock pain.', 'Hmph.', 'Rocks feel pain too.', 'Chipped.', 'Going back to being a rock.']
  },
  ROUND_CALL: { normal: 'Wait for it...', double: 'BEEP BEEP, two boops!', hold: 'HOLD your finger, charge!', spot: 'Watch for the light!', reverse: 'REVERSE! Quack: boop. Beep: wait!', count: 'COUNT crows! Boop after the LAST!' },
  MOVE_CALLS: {
    linhco: ['Straw swing!', 'Straw swing!', 'Double straw!'],
    traului: ['Charge... later...', 'One roll.', 'Zzz...'],
    linhdem: ['Left lamp, right lamp!', 'Shift change!', 'Lights on!'],
    vitgia: ['Quack!', 'Peck!', 'Quack... cluck!', 'Wing slap!'],
    lytruong: ['Yaaawn...', 'Yawn... fine!', 'Tax time!'],
    cao: ['Wanna buy? Wanna buy?', 'Genuine goods!', 'Free gift!', 'Buy 2 get 1!'],
    canhcut: ['Boom boom tak!', 'Tak boom boom!', 'Lion head!'],
    nguoituyet: ['Ah... ah...', 'CHOO!', 'Runny nose!'],
    bangvuong: ['Royal sneeze!', 'Ice hanky!', 'Freeze!'],
    khilua: ['Banana toss!', 'Monkey hop!', 'Hot coals!'],
    ganuong: ['Crispy... crispy...', 'Re-roast!', 'Honey sticky!'],
    hoalong: ['Hotpot boil!', 'Ladle spin!', 'Smoke!'],
    thienbinh: ['Zzz... who\'s there?', 'Awake now!', 'Guard the gate!'],
    tiennu: ['Strike a pose!', 'Drop hearts!', 'Going live!'],
    rua: [['Slow... down...', 'Ten thousand years...'], ['Shell slam!', 'Yawn!', 'Gotcha.'], ['TURTLE AURA!', 'Fast works too.']]
  },
  ENEMY_WIN_LINES: ['You lost? The Slowness Curse has you now.', 'This slow, even the Turtle could beat you.', 'Sleep tight, champ.', 'Three fouls. If Grandma finds out...']
};

/* ===== DON'T TRUST THE DUCK: English text layer for story2.js (per-gate flavour, variant names, banter) ===== */
var LANG_EN = window.LANG_EN || {}; window.LANG_EN = LANG_EN;
LANG_EN.story = {
  GATE_META: {
    1:  { title: 'First Lesson', name: 'Grass Guard, Intern' },
    2:  { title: 'Buffalo Dreaming', name: 'Lazy Buffalo, Napping', intro: [['gabip', 'New move: JUMP. Punch while in the air for an air attack that knocks down. This buffalo is slow, practise on him.'], ['traului', 'Zzz... dreaming of grass... do not wake...'], ['tibup', 'Grandma, do I really have to hit a sleeping buffalo?'], ['banoi', 'Sleeping on the clock? You boop.']] },
    3:  { title: 'Bird Incident', name: 'Grass Guard, Bird Victim', intro: [['linhco', 'Don\'t look at my hat. The bird... the bird didn\'t respect me.'], ['tibup', 'I thought birds were scared of scarecrows?'], ['linhco', 'Birds these days are too lazy to be scared.']] },
    4:  { title: 'Late For Work', name: 'Lazy Buffalo, Late Again', intro: [['gabip', 'New move: DASH. Tap a direction twice, fast. A back dash dodges a hit for an instant.'], ['traului', 'I\'m three hours late. By village time that\'s... on time.'], ['gabip', 'By Slowness Curse time, you\'re early.']] },
    5:  { title: 'Middle Management', name: 'Grass Guard, Team Lead', intro: [['linhco', 'I\'m head of scarecrows. Seven scarecrows report to me.'], ['tibup', 'Do they stand still like you?'], ['linhco', 'We call that company culture.']] },
    6:  { title: 'Gym Buffalo', name: 'Lazy Buffalo, Gym Member', intro: [['traului', 'I go to the gym. Lie down 23 hours a day. Rest one hour.'], ['tibup', 'Rest from what?'], ['traului', 'From... that position.']] },
    7:  { title: 'The Last Scarecrow', name: 'Grass Guard, Veteran', intro: [['gabip', 'New: a TAG TEAM. One attacks, one covers, then they swap. Drop one and the other gets furious.'], ['linhco', 'Forty years on this field. Nobody has ever walked past.'], ['tibup', 'So what are you guarding?'], ['linhco', '...I forgot.']] },
    8:  { title: 'The Chief Yawns' },
    9:  { title: 'Duck 101', name: 'The Duck, Intern Rooster' },
    10: { title: 'Night Shift', name: 'Lantern Cop, Night Shift', intro: [['linhdem', 'Night shift pays double. Nobody has paid me yet.'], ['tibup', 'So why do you do it?'], ['linhdem', 'The lanterns are pretty.']] },
    11: { title: 'Certified Rooster', name: 'The Duck, Certificate Holder', intro: [['gabip', 'New: the GRAB 🤲. Blocking does not stop a grab! When you see 🤲, jab fast to interrupt it, or back away.'], ['vitgia', 'I\'m a Grade B certified rooster. Online course. Three days.'], ['gabip', 'Rooster certificates don\'t have a Grade B.'], ['vitgia', 'Quack. So yes, they do.']] },
    12: { title: 'Lantern Selfie', name: 'Lantern Cop, Content Creator', intro: [['linhdem', 'Hold on, one photo first. The lantern light is unreal here.'], ['tibup', 'Are you here to fight or to post?'], ['linhdem', 'Post, then fight.']] },
    13: { title: 'Fake Beard', name: 'The Duck, Fake Beard', intro: [['gabip', 'New: jump in here and you get ANTI-AIRED ⬆️. To get close, dash, do not jump.'], ['vitgia', 'This time I have a beard. Roosters have beards. Obviously.'], ['tibup', 'Roosters don\'t have beards.'], ['vitgia', 'Mature roosters do.']] },
    14: { title: 'Fee Collector', name: 'Lantern Cop, Fee Collector', intro: [['gabip', 'From here it is all mixed: the fake beep, grabs, anti-air. Remember: 🤲 means jab to interrupt, QUACK means hold your fists.'], ['linhdem', 'Halt. Market entry fee: five. Breathing fee: two.'], ['tibup', 'How much to boop you?'], ['linhdem', 'That one\'s... free. Wait.']] },
    15: { title: 'Duck Boss', name: 'The Duck, Mini Boss', intro: [['vitgia', 'Strongest duck in the market. I can do "cluck" AND "quack".'], ['gabip', 'Still a duck.'], ['vitgia', 'A multi-skilled duck.']] },
    16: { title: 'The Fox Sells Brands' },
    17: { title: 'Frozen Lion Dance', name: 'Lion-Dance Penguin, Blanked' },
    18: { title: 'Runny Nose', name: 'Yoga Snowman, Runny Nose', intro: [['nguoituyet', 'Ah... ah... I\'ve had this cold for 400 years. Still not over it.'], ['tibup', 'Did you take anything for it?'], ['nguoituyet', 'Yes. It froze in my stomach.']] },
    19: { title: 'Penguin With Drum', name: 'Lion-Dance Penguin, With Drum', intro: [['gabip', 'New: the knockdown HOOK. Hold back to block it. If you go down, you are safe for a moment as you get up.'], ['canhcut', 'I brought my drum this time. Boom... boom... boom...'], ['gabip', 'Your drum is slower than your hook.'], ['canhcut', 'My drum is frozen, that\'s why.']] },
    20: { title: 'Snowman Yoga', name: 'Yoga Snowman, Breathwork', intro: [['gabip', 'Review: ice and the hook.'], ['nguoituyet', 'Hold the breath... like yoga... ah... CHOO. Ruined it.']] },
    21: { title: 'Wedding Gig', name: 'Lion-Dance Penguin, Weddings', intro: [['canhcut', 'Just got back from a wedding gig. The bride cried.'], ['tibup', 'Because it was so moving?'], ['canhcut', 'Because I slid into the cake.']] },
    22: { title: 'Designer Scarf', name: 'Yoga Snowman, Designer Scarf', intro: [['gabip', 'This snowman hooks too. If you go down, get up calm, do not swing wildly.'], ['nguoituyet', 'The Fox sold me this scarf. Designer. Only 99.'], ['tibup', 'The Fox sells fakes, sir.'], ['nguoituyet', '...That explains why I\'m colder with it on.']] },
    23: { title: 'Dress Rehearsal', name: 'Lion-Dance Penguin, Rehearsal', intro: [['canhcut', 'Dress rehearsal today. I know the moves now. Boom boom clack... uh.'], ['gabip', 'A tag team on slippery ice. Drop the closer one first.']] },
    24: { title: 'The Ice King Sneezes' },
    25: { title: 'Banana Roast', name: 'Fire Monkey, Banana Griller' },
    26: { title: 'Chicken, Round One', name: 'Roast Chicken, Revived Once', intro: [['ganuong', 'They roasted me. I came back. Now I\'m extra crispy.'], ['tibup', 'Does crispy hurt more?'], ['ganuong', 'It hurts. But it smells amazing.']] },
    27: { title: 'Charcoal Dealer', name: 'Fire Monkey, Charcoal Dealer', intro: [['gabip', 'New: HOT GROUND. Stand still for more than two seconds and your feet burn. Keep moving, keep punching.'], ['khilua', 'Charcoal! Fresh, homemade charcoal! You buying?'], ['tibup', 'You make it from your own hands?'], ['khilua', 'Cuts costs.']] },
    28: { title: 'Chicken, Round Two', name: 'Roast Chicken, Revived Twice', intro: [['ganuong', 'Second time now. My skin is basically a leather boot.'], ['gabip', 'Review: smoke and hot ground together. Watch the fist and keep moving.']] },
    29: { title: 'Afraid Of Water', name: 'Fire Monkey, Hydrophobic', intro: [['gabip', 'New: this monkey can PERFECT BLOCK and counter for double. Punch once or twice, then back off. No mashing.'], ['khilua', 'Only one thing scares me: water. You got water on you?'], ['tibup', 'Just fists.'], ['khilua', 'Oh. Fine then.']] },
    30: { title: 'Honey Glazed', name: 'Roast Chicken, Honey Glazed', intro: [['ganuong', 'Honey glaze this time. Hit me and your hand gets sticky.'], ['gabip', 'All mixed: smoke, hot ground, perfect blocks. Both hands ready.']] },
    31: { title: 'Monkey King', name: 'Fire Monkey, Island King', intro: [['khilua', 'I\'m king of Monkey Island. Population: one monkey. Me.'], ['tibup', 'Isn\'t that lonely?'], ['khilua', 'Not with fire.']] },
    32: { title: 'Hotpot Dragon' },
    33: { title: 'Sleepy Sky Guard', name: 'Sky Guard, Dozing' },
    34: { title: 'Going Live', name: 'Fairy Influencer, Live Now', intro: [['tiennu', 'Hi everyone, ten thousand of you watching! This kid is DONE today.'], ['tibup', 'Could you get my good side, at least?']] },
    35: { title: 'Loud Snorer', name: 'Sky Guard, Loud Snorer', intro: [['thienbinh', 'Zzz... who\'s there... zzz... gate\'s closed... zzz...'], ['gabip', 'He snores so loud. Do not let him lull you to sleep.']] },
    36: { title: 'Link In Bio', name: 'Fairy Influencer, Online Shop', intro: [['tiennu', 'Link in the comments, everyone! Fake Battle Aura, only 99.'], ['tibup', 'You buy stock from the Fox too?'], ['tiennu', '40% commission. No ethics module installed.']] },
    37: { title: 'Overtime', name: 'Sky Guard, Overtime', intro: [['thienbinh', 'Three thousand years of overtime. Still paid in... clouds.'], ['tibup', 'Can you eat clouds?'], ['thienbinh', 'If I could, I wouldn\'t be dozing.']] },
    38: { title: 'Exposed', name: 'Fairy Influencer, Exposed', intro: [['tiennu', 'I got exposed for selling fakes. So I\'m streaming to explain.'], ['gabip', 'Explaining by hitting people?'], ['tiennu', 'Content is content.']] },
    39: { title: 'The Final Gate', name: 'Sky Guard, Main Gate', intro: [['thienbinh', 'I guard the main gate. Behind it: the Turtle Lord.'], ['tibup', 'Do you ever sleep?'], ['thienbinh', 'Yes. Standing up. More professional.']] },
    40: { title: 'Turtle Lord' }
  },
  ENEMY_HIT: {
    _: ['Ow!', 'Hey!', 'Rude!', 'Mom!', 'Easy!', 'Oof!'],
    traului: ['Zzz... ow...', 'Who hits a buffalo?', 'Dreamt of a punch...'], lytruong: ['Yawn... ow...', 'That\'s a fine!'], cao: ['My glasses!', 'That\'s designer!'],
    vitgia: ['Quack!!', 'Rooster down! I mean duck!'], rua: ['Slow... down...', 'I\'ll hurt tomorrow.'], hoalong: ['My hotpot!', 'Smoke in my eyes!'], tiennu: ['Don\'t film this!', 'Cut! CUT!'],
    ganuong: ['Extra crispy!', 'Roasting me again?'], bangvuong: ['Ah... ow... CHOO!'], thienbinh: ['I\'m awake!', 'Who hit the gate?']
  },
  ENEMY_LOW: {
    _: ['Okay okay, can we talk?', 'Call it a draw?', 'I have kids at home...', 'Let me get my manager.'],
    traului: ['Just let me finish my nap...'], cao: ['50% off! Spare me!'], vitgia: ['Fine, I\'m a duck. Mercy.'], lytruong: ['Tax exemption! For you!'],
    tiennu: ['Chat, help me, smash that like!'], rua: ['Only ten thousand. Still young...'], ganuong: ['Stop! I\'m almost fried chicken!'], hoalong: ['The hotpot isn\'t even done!']
  },
  ENEMY_FOOLED: {
    _: ['Ha ha, got you!', 'Too easy!', 'Walked right into it!'],
    vitgia: ['Quack quack quack, gotcha!', 'Duck 1, Human 0.'], cao: ['Trusted me? That costs extra.'], bangvuong: ['Fake sneeze. Real one... CHOO!']
  },
  HERO_CRIT: {
    tibup: ['CRITICAL BOOP!', 'Grandma, I did it!', 'Big fists, big reasons!'],
    hoayen: ['BURN IT ALL!', 'Hot enough?!', 'More charcoal!'],
    bangnhi: ['Frozen.', 'Just cold enough.', 'Calm is power.'],
    thachlao: ['Rock falls.', 'Hm. Strong.', 'No rush. Still landed.']
  },
  HERO_SLOW: {
    tibup: ['My hand was in the snack bag.', 'Lag! It\'s the wifi!', 'I was thinking about dinner...'],
    hoayen: ['Gone cold!', 'This slow, who\'d buy my food?'],
    bangnhi: ['...a bit too calm.', 'Too cold. Stiff fingers.'],
    thachlao: ['Rock here. Rocks don\'t rush.', 'Slow is good. I think.']
  },
  GABIP_LINES: {
    count: ['Can you even count?', 'Two... or three? Nervous yet?', 'Ears listen, finger counts.'],
    reverse: ['Today the duck is the ref.', 'It\'s reversed. Fight the habit.', 'BEEP is the trap. Remember?'],
    slow: ['Are you asleep?', 'Slower than the Turtle Lord.', 'I beeped, then made tea.', 'The Chief is faster.'],
    fast: ['Faster than the beep!', 'My beak wasn\'t even shut!', 'Was that hand or eyes?'],
    streak: ['Streak 3! Warming up!', 'Streak 5! Who taught you?', 'Streak 7! Can\'t beep that fast!', 'Streak 10!!! TRUE BATTLE AURA!'],
    fooled: ['Told you. Don\'t trust the duck!', 'RED screen and you booped!', 'What are your ears for?!'],
    hold: ['Hold steady... no shaking.', 'Aura rising...', 'Not yet. Don\'t let go!'],
    phew: ['Phew. Keep waiting.', 'Nice. Didn\'t fall for it.', 'Duck lost. Wait for me.']
  }
};
