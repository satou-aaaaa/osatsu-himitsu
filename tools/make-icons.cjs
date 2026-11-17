// アプリのアイコン（icon-192.png・icon-512.png）を作る。生成りの地に、お札の形（絵・額面は描かない）と虫めがね。
// 使い方: node tools/make-icons.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const s of [192, 512]) {
    const p = await b.newPage({ viewport: { width: s, height: s } });
    await p.setContent(`<body style="margin:0"><svg width="${s}" height="${s}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#f3eee4"/>
      <rect x="10" y="26" width="64" height="34" rx="4" fill="#efe6d2" stroke="#22263a" stroke-width="2.5"/>
      <ellipse cx="42" cy="43" rx="9" ry="11" fill="#fffdf8" stroke="#22263a40" stroke-width="1.5"/>
      <rect x="18" y="30" width="5" height="26" rx="2" fill="#9aa3b5"/>
      <rect x="58" y="34" width="2" height="18" fill="#22263a40"/><rect x="62" y="34" width="2" height="18" fill="#22263a40"/>
      <circle cx="64" cy="62" r="15" fill="#ffffffcc" stroke="#b3402a" stroke-width="5"/>
      <path d="M75 73 L88 86" stroke="#b3402a" stroke-width="8" stroke-linecap="round"/></svg></body>`);
    await p.screenshot({ path: path.join(__dirname, "..", `icon-${s}.png`), clip: { x: 0, y: 0, width: s, height: s } });
  }
  await b.close();
})();
