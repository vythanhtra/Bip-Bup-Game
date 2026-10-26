/* ===== DON'T TRUST THE DUCK: English text layer for world.js (transcreation, not translation) ===== */
var LANG_EN = window.LANG_EN || {}; window.LANG_EN = LANG_EN;
LANG_EN.world = {
  STORY: [
    'The Land of Boop used to be fast. Roosters crowed at 5 sharp. Rice cakes cooked in 12 hours. You called someone, they answered.',
    'Then the Turtle Lord, ten thousand years old and tired of being called slow, dropped the Slowness Curse on everyone.',
    'Now roosters crow at 2 p.m. Ti’s rice cakes have been cooking for three months. The Village Chief yawns and half a day is gone.',
    'Ti Boop, the only student of Grandma Boop, took Beep the Rooster as referee and set out through 40 gates to give the world its reflexes back.',
    'One rule. When Beep crows BEEP, you BOOP. Boop before the beep and you eat a punch.'
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
    hoayen: { name: 'Blaze Yen', perk: '+30% damage, but the reaction window is 20% tighter.', line: 'HOT!!! Everything is HOT!!!', bio: 'Grills rice paper at the Night Market. Set fire to three neighbouring stalls. Hits hard, tighter window.' },
    bangnhi: { name: 'Frost Nhi', perk: 'First early boop of every fight is forgiven.', line: 'Calm... calm... BOOP.', bio: 'From the Frozen River. Talks slow, hits fast. One early boop forgiven per fight.' },
    thachlao: { name: 'Old Stone', perk: '5 hearts, window +25%, but hits 20% softer.', line: 'I am rock. Rock does not rush.', bio: 'A rock Ti punched 10,000 times until it woke up. Lots of HP, slow hands, sulks constantly.' }
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
    { name: 'Bamboo Village', sub: 'Sunrise, rice fields, bamboo wind', mech: 'Pure reflex. Hear BEEP, you BOOP.' },
    { name: 'Night Market', sub: 'Lanterns, grill smoke, scams', mech: 'A DUCK is pretending to be the rooster. Red screen, QUACK: freeze. Gate 14 flips it: QUACK means boop, BEEP means freeze.' },
    { name: 'Frozen River', sub: 'Aurora, snow, sneezes', mech: 'Double beat: BEEP BEEP means boop twice. Hold your finger, release on the beep to charge. Gate 22: 2 or 3 crows, boop after the LAST one.' },
    { name: 'Volcano', sub: 'Lava, hotpot smoke', mech: 'Smoke covers the screen. A light appears and shrinks. Boop exactly on the light.' },
    { name: 'Sky Court', sub: 'Golden clouds, fairy livestreams', mech: 'Beep calls the trick, then mixes them all. Final boss: 3 rounds.' }
  ],
  PHASE_LINES: {
    40: ['Round one. I’m not even awake.', 'Round two. You’re waking me up.', 'FINAL ROUND. TEN THOUSAND YEARS!']
  },
  DIALOG: {
    1: [
      { who: 'banoi', name: 'Grandma Boop', text: 'Ti. Listen. When Beep crows "BEEP", you BOOP. Boop before the beep and you eat a punch.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Grandma, what if I’m hungry at that exact moment?' },
      { who: 'banoi', name: 'Grandma Boop', text: 'Hungry? Then boop faster. Hesitate and the Chief taxes your empty stomach.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'And stop looking at me like that. I am the referee, not the lunch.' }
    ],
    8: [
      { who: 'lytruong', name: 'Yawning Chief', text: 'Yawn... speed is illegal in this village. Anyone fast... yawn... pays a tax.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Are you done, sir? I’ve grown moss waiting.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'Careful: when he yawns, the screen goes dark. Do not fall asleep with him!' }
    ],
    9: [
      { who: 'gabip', name: 'Beep the Rooster', text: 'The Night Market has a DUCK pretending to be me. It goes "QUACK" and the screen turns RED. Boop then and you’re scammed.' },
      { who: 'tibup', name: 'Ti Boop', text: 'A duck impersonating a rooster? Nothing is sacred anymore.' },
      { who: 'vitgia', name: 'Certified Rooster (actually a duck)', text: 'Cock-a-doodle... I mean... quack.' }
    ],
    16: [
      { who: 'cao', name: 'Big Bro Designer', text: 'Genuine Battle Aura, $9.99 a pack, buy 2 get 1 free. You in, little bro? Uh... BEEP!' },
      { who: 'tibup', name: 'Ti Boop', text: 'You’re not a rooster. You’re a fox in sunglasses.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'The fox will yell BEEP himself to bait you. Trust only ME and the GREEN screen.' }
    ],
    17: [
      { who: 'gabip', name: 'Beep the Rooster', text: 'The Frozen River is so cold I crow twice. "BEEP BEEP" means boop TWICE, fast.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Two boops? Will my hand survive?' },
      { who: 'canhcut', name: 'Lion-Dance Penguin', text: 'If it doesn’t, I’ll dance at the funeral. Boom boom... forgot the choreo.' }
    ],
    20: [
      { who: 'gabip', name: 'Beep the Rooster', text: 'New trick: HOLD your finger on the screen while waiting to charge. When I crow, RELEASE. Release early and you eat a punch.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Hold for how long?' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'Until I crow. Do not fall asleep.' }
    ],
    24: [
      { who: 'bangvuong', name: 'Sneezing Ice King', text: 'Ah... one sneeze and the whole river freezes. Two sneezes and... CHOO! CHOO!' },
      { who: 'tibup', name: 'Ti Boop', text: 'You have a cold. See a doctor. Why is the river paying for it?' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'This fight mixes double beats and charging. I call each round first. Listen.' }
    ],
    25: [
      { who: 'gabip', name: 'Beep the Rooster', text: 'The Volcano is full of hotpot smoke. When I crow, I can only light up ONE spot. Boop it. It shrinks.' },
      { who: 'khilua', name: 'Fire Monkey', text: 'Miss, and I grill bananas on your head.' }
    ],
    32: [
      { who: 'hoalong', name: 'Hotpot Dragon', text: 'My hotpot boils with smoke. See something? Boop it. If you can see anything.' },
      { who: 'tibup', name: 'Ti Boop', text: 'What kind of hotpot makes this much smoke? Did you put the firewood IN the pot?' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'Thickest smoke yet. Watch the light, not the dragon.' }
    ],
    33: [
      { who: 'tiennu', name: 'Fairy Influencer', text: 'Guys, drop a like. Today I’m fighting a kid who brought a rooster to heaven.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'The Sky Court mixes every trick. Each round I call it first: "Two beeps", "Hold", or "Find the light".' }
    ],
    40: [
      { who: 'rua', name: 'Turtle Lord', text: 'Ten thousand years I was slow. Today the whole world is slow with me.' },
      { who: 'tibup', name: 'Ti Boop', text: 'Sir, my rice cakes have been cooking for three months. I need to get home before they turn into coal.' },
      { who: 'rua', name: 'Turtle Lord', text: 'Then survive my three rounds first. Round one... I’m not even awake.' },
      { who: 'gabip', name: 'Beep the Rooster', text: 'Three rounds, three styles. Boop what I call. Lose and you go train again. No crying.' }
    ]
  },
  WIN_LINES: {
    8: 'The Chief yawned once and fell asleep for good. Bamboo Village woke up. The rooster crows at 5 again.',
    16: 'Big Bro ran off barefoot, leaving 300 packs of fake Aura. Up north the Frozen River thaws. Blaze Yen joins (new character unlocked).',
    24: 'The Ice King sneezed one last time and went into hibernation. The river flows. Frost Nhi quietly tags along (new character unlocked).',
    32: 'The hotpot finally cooked. Smoke cleared. Old Stone, the rock Ti punched 10,000 times, got up and followed (new character unlocked).',
    40: 'The Turtle Lord fell... then yawned. The Curse broke. Roosters crow at 5. Ti ran home: rice cakes done. The Turtle got a slice. Chewed slow.'
  },
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
