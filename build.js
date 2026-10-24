const fs = require('fs');
const url = process.argv[2] || 'https://ba-khi.vercel.app';
const src = fs.readFileSync('src/game.html', 'utf8').split('__SHARE_URL__').join(url);
const main = src.match(/<script>\n\(function\(\)\{([\s\S]*?)\}\)\(\);\n<\/script>/);
if (!main) throw new Error('main script not found');
const gameJs = '(function(){' + main[1] + '})();\n';
const html = src
  .replace('<script>/*SPRITES*/</script>', '<script src="sprites.js"></script>')
  .replace('<script>/*WORLD*/</script>', '<script src="world.js"></script>')
  .replace('<script>/*STORY2*/</script>', '<script src="story2.js"></script>')
  .replace('<script>/*AUDIO*/</script>', '<script src="audio.js"></script>')
  .replace(main[0], '<script src="game.js"></script>');
fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/index.html', html);
fs.writeFileSync('public/sprites.js', fs.readFileSync('src/sprites.js', 'utf8'));
fs.writeFileSync('public/world.js', fs.readFileSync('src/world.js', 'utf8'));
fs.writeFileSync('public/audio.js', fs.readFileSync('src/audio.js', 'utf8'));
fs.writeFileSync('public/story2.js', fs.readFileSync('src/story2.js', 'utf8'));
fs.writeFileSync('public/game.js', gameJs);
['sprites.js', 'world.js', 'story2.js', 'audio.js', 'game.js'].forEach(f => new Function(fs.readFileSync('public/' + f, 'utf8')));
if (/<script>/.test(html)) throw new Error('inline script left in html');
console.log('built:', fs.readdirSync('public').map(f => f + ' ' + fs.statSync('public/' + f).size + 'B').join(', '));
