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
