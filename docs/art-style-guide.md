# Art style guide — bộ hình Stardew (ADR-003)

Nguồn: Canva generate-image. Mỗi hình ghi media id vào `docs/art-manifest.json` để tải lại.

## Ba mẫu prompt
**Chân dung (1:1)** — `Pixel art dialogue portrait in the style of a 16-bit farming RPG character portrait, 64x64 pixel grid upscaled, bust shot facing slightly {left|right}. {DESC}. Warm palette, hand-placed pixels, 5 to 6 tones per colour, soft pixel shading, clean dark outline, flat parchment-coloured background. No text, no watermark, no anti-aliasing blur.`

**Sprite trong trận (1:1)** — `16-bit pixel art game sprite, full body, side view facing {right|left}, {POSE}: {DESC}. Chibi proportions, two heads tall. Clean dark outline, 5 tones per colour, crisp pixels, no blur, centered on a plain flat solid light green background, no text, no watermark, no shadow.`
Tư thế: `idle` = "standing in a ready stance"; `attack` = "mid-attack lunging forward"; `hurt` = "knocked back, eyes squeezed shut, mouth open in pain".

**Nền sân đấu (9:16)** — `16-bit pixel art game background, vertical phone format, side-view 2D fighting stage, {SCENE}, a flat ground strip across the bottom quarter for characters to stand on. Tile-based look like a classic farming RPG, hand-placed pixels, no characters, no text, no watermark, crisp pixels without blur.`

Quy ước: hero nhìn sang phải, đối thủ nhìn sang trái. Chân dung hero hơi quay phải, đối thủ hơi quay trái.

## Mô tả nhân vật (DESC)
| key | DESC |
|---|---|
| tibup | a cheerful 10-year-old Vietnamese boy martial artist, black hair tied in a topknot bun with a yellow headband, big dark eyes, rosy cheeks, confident grin, orange kung-fu gi with dark belt, brown pants, bare feet |
| hoayen | a fiery teenage Vietnamese girl street-food cook and fighter, spiky red-orange hair in a high ponytail, red headband, red sleeveless martial top with flame trim, dark shorts, fingerless gloves, fierce grin, ember sparks |
| bangnhi | a calm young girl ice fighter, pale blue-white hair in two low buns, light blue martial dress with white trim, serene half-closed eyes, small smile, faint frost sparkle |
| thachlao | an old stone golem elder, body of mossy grey boulders, green moss eyebrows and beard, small calm glowing green eyes, cracked stone fists, heavy stance |
| gabip | a small yellow chicken referee wearing a black and white striped referee shirt, whistle in beak, red comb, confident pose |
| banoi | a tiny old Vietnamese grandmother in a brown áo bà ba and checkered scarf, wrinkled kind smile, bandaged knuckles |
| linhco | a scarecrow soldier, straw body in a green peasant tunic, conical straw hat, stitched sack face with button eyes, straw poking out of the sleeves |
| traului | a lazy sleepy water buffalo, dark grey hide, big curved horns, half-closed drowsy eyes, straw in mouth, lying on its belly |
| linhdem | a night-shift lantern soldier, scarecrow-like in a purple uniform and a glowing red paper-lantern hat, tired eyes with bags |
| vitgia | a plump white duck pretending to be a chicken, long orange duck bill, half-closed shifty eye, an obviously fake red rooster comb tied on with a visible string and a fake red wattle under the bill |
| lytruong | a yawning fat old village chief in a black traditional Vietnamese áo dài and khăn xếp turban, long thin moustache, mouth wide open in a huge yawn, holding a tax ledger |
| cao | a sly orange fox con-man in a flashy fake-designer tracksuit with a gold chain and sunglasses, big grin with a gold tooth, holding a bag of counterfeit goods |
| canhcut | a black and white penguin lion-dancer wearing a colourful red and gold lion-dance head as a hat, shivering, flippers out |
| nguoituyet | a sneezing snowman of three snowballs, carrot nose red from a cold, runny nose, scarf, watery eyes mid-sneeze |
| bangvuong | a tall old Ice King made of ice with a crystal crown, long white beard of icicles, blue royal robe, red nose about to sneeze, holding a frozen handkerchief |
| khilua | a red-orange fire monkey with flames for hair and tail tip, mischievous grin, holding a grilled banana on a stick |
| ganuong | a resurrected golden-brown crispy roast chicken standing upright with zombie-like glowing eyes, a bite missing, glistening honey glaze |
| hoalong | a red Asian fire dragon hotpot chef in a chef's apron and hat, holding a ladle, steam and smoke swirling, long whiskers |
| thienbinh | a sleepy golden-armoured celestial guard with a halberd, nodding off with drool, cloud boots |
| tiennu | a glamorous fairy livestreamer with pink hair and small wings, holding a phone on a selfie stick with a ring light, floating heart icons, fake smile |
| rua | a giant ancient green turtle with a moss-covered shell with a small tree growing on it, long white eyebrows, tiny spectacles, wise but grumpy expression |

## Nền (SCENE)
| world | SCENE |
|---|---|
| 1 langtre | a Vietnamese bamboo village at sunrise: tall green bamboo framing both sides, a thatched stilt house with a red lantern, rice paddy terraces and misty hills, warm sunrise sky with soft clouds |
| 2 chodem | a Vietnamese night market at night: dark purple-blue sky with stars and a full moon, strings of glowing red and yellow paper lanterns, wooden market stalls with awnings, cobblestone ground |
| 3 songbang | a frozen river at dusk: icy blue cliffs and ice spikes, aurora in a dark blue sky, snow-covered pine trees, frozen river surface as the ground |
| 4 daolua | a volcanic island: dark red-orange sky with ash, an erupting volcano in the distance, lava rivers, charred palm trees, cracked black rock ground with glowing cracks |
| 5 congtroi | the Gate of Heaven above the clouds at golden hour: a huge ornate golden gate with dragon carvings, fluffy clouds as the ground, pink and gold sky with distant pagoda roofs |

## Cảnh phụ (hai cảnh thêm mỗi vùng, 2026-10-26)
Mỗi vùng có ba sân đấu: cửa 1–3 cảnh chính, cửa 4–5 cảnh hai, cửa 6–8 (kể cả trùm) cảnh ba. Chế độ chạy chọn ngẫu nhiên. Mẫu prompt nền giữ nguyên; SCENE:
| key | SCENE |
|---|---|
| langtre2 | terraced rice paddies and a lotus pond with a small wooden pavilion, a water buffalo at the far edge, bright noon light |
| langtre3 | a Vietnamese village gate under a giant banyan tree at sunset, red lanterns, brick path |
| chodem2 | a riverside night market with sampan boats full of fruit and lanterns, full moon over the water |
| chodem3 | a festival street at night with fireworks, strings of lanterns, colourful shop fronts |
| songbang2 | a frozen waterfall and ice cave under the aurora, snowy pines |
| songbang3 | a snowy mountain village by a lake at dusk, warm windows, distant peaks |
| daolua2 | a black sand beach with lava flowing into the sea, volcano smoking behind, palm silhouettes |
| daolua3 | a volcanic cave over a lava lake, glowing cracks, stone bridge |
| congtroi2 | floating islands with waterfalls above a sea of clouds at dawn, cranes flying |
| congtroi3 | a celestial palace terrace with golden railings and dragon pillars, full moon, pagoda roofs in the clouds |

## Nền cảnh mở đầu (prologue, 2026-10-26)
| key | SCENE |
|---|---|
| pro-rua | dark purple storm clouds at dusk above the bamboo village, a gigantic ancient turtle with a mossy carved stone shell floating among the clouds casting slow purple ripples of magic downward |
| pro-banoi | the cozy yard of a grandmother's wooden house in the late afternoon: tiled roof, clay stove with a steaming pot of banh chung, bamboo fence, chickens, a wooden training post with a straw dummy, golden light |

## Tư thế đợt 2 (ADR-005)
Thêm vào mẫu sprite: `walk` = "walking mid-stride with one leg forward and arms swinging"; `jump` = "mid-air jumping pose with knees tucked up and one fist raised high"; `block` = "guarding stance with both forearms raised in front of the face, knees slightly bent, braced against a hit"; `down` = "knocked down and lying flat on the ground on the back with arms spread, little stars circling above, eyes as crosses"; `super` = tư thế tuyệt chiêu riêng (xem `SUPERS` trong world.js). Loader rơi về: down → hurt, block/jump/walk/crouch → idle, super → attack.
