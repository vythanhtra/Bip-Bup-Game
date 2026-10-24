const fs = require('fs');
const url = process.argv[2] || 'https://ba-khi.vercel.app';
const LANG = process.argv[3] || '';   // 'en' builds the international edition: English meta + English default
const META_ZH = { title: '别信鸭子', desc: '一根手指的反应格斗。听到哔就嘭。40 关、5 个世界、40 个奇葩对手，还有一只永远别信的鸭子。免费，免安装。', og: '别信鸭子 🥊 先哔，再嘭。', ogd: '一条规则，一根手指，四十个奇葩。发个链接，比朋友反应更快。免费，浏览器直接玩。' };
const META_EN = { title: "Don't Trust the Duck", desc: "A one-finger reflex brawler. Beep means BOOP. 40 gates, 5 worlds, 40 idiots and a duck you should never trust. Free, no install.", og: "Don't Trust the Duck 🥊 Beep first. Then boop.", ogd: "One rule. One finger. Forty idiots. Beat your friends' reflex time with a link. Free, in the browser." };
let src = fs.readFileSync('src/game.html', 'utf8').split('__SHARE_URL__').join(url);
const META = LANG === 'zh' ? META_ZH : META_EN;
if (LANG === 'en' || LANG === 'zh') src = src.replace('<html lang="vi">', '<html lang="' + LANG + '">').replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + META.desc + '">').replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + META.og + '">').replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + META.ogd + '">').replace(/<title>[^<]*<\/title>/, '<title>' + META.title + '</title>');
const main = src.match(/<script>\n\(function\(\)\{([\s\S]*?)\}\)\(\);\n<\/script>/);
if (!main) throw new Error('main script not found');
const gameJs = '(function(){' + main[1] + '})();\n';
const html = src
  .replace('<script>/*SPRITES*/</script>', '<script src="sprites.js"></script>')
  .replace('<script>/*WORLD*/</script>', '<script src="world.js"></script>')
  .replace('<script>/*STORY2*/</script>', '<script src="story2.js"></script>')
  .replace('<script>/*AUDIO*/</script>', '<script src="audio.js"></script>')
  .replace('<script>/*LANG*/</script>', '<script src="lang-en.js"></script><script src="lang-zh.js"></script>')
  .replace('<script>/*I18N*/</script>', '<script src="i18n.js"></script>')
  .replace('<script>/*VERSUS*/</script>', fs.existsSync('src/versus.js') ? '<script src="versus.js"></script>' : '')
  .replace(main[0], '<script src="game.js"></script>');
fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/index.html', html);
fs.writeFileSync('public/sprites.js', fs.readFileSync('src/sprites.js', 'utf8'));
fs.writeFileSync('public/world.js', fs.readFileSync('src/world.js', 'utf8'));
fs.writeFileSync('public/audio.js', fs.readFileSync('src/audio.js', 'utf8'));
fs.writeFileSync('public/story2.js', fs.readFileSync('src/story2.js', 'utf8'));
fs.writeFileSync('public/i18n.js', (LANG ? "var DEFAULT_LANG = '" + LANG + "';\n" : '') + fs.readFileSync('src/i18n.js', 'utf8'));
fs.writeFileSync('public/lang-en.js', fs.readFileSync('src/lang/en-world.js', 'utf8') + '\n' + fs.readFileSync('src/lang/en-story.js', 'utf8'));
fs.writeFileSync('public/lang-zh.js', fs.readFileSync('src/lang/zh-world.js', 'utf8') + '\n' + fs.readFileSync('src/lang/zh-story.js', 'utf8'));
if (fs.existsSync('src/versus.js')) fs.writeFileSync('public/versus.js', fs.readFileSync('src/versus.js', 'utf8'));
fs.writeFileSync('public/game.js', gameJs);
['sprites.js', 'world.js', 'story2.js', 'audio.js', 'i18n.js', 'lang-en.js', 'lang-zh.js', 'game.js'].concat(fs.existsSync('src/versus.js') ? ['versus.js'] : []).forEach(f => new Function(fs.readFileSync('public/' + f, 'utf8')));
if (/<script>/.test(html)) throw new Error('inline script left in html');
console.log('built:', fs.readdirSync('public').map(f => f + ' ' + fs.statSync('public/' + f).size + 'B').join(', '));
