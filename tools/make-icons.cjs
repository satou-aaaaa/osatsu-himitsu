// アプリのアイコン（icon-192.png・icon-512.png・icon-512-maskable.png）を作る。maskable は絵を中心から0.75倍にして、丸く切られても欠けないようにする。生成りの地に、調べた結果の紙と虫めがね（お札の形・絵・額面は描かない）。
// 使い方: node tools/make-icons.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const [s, name, k] of [[192, "icon-192.png", 1], [512, "icon-512.png", 1], [512, "icon-512-maskable.png", 0.75]]) {
    const p = await b.newPage({ viewport: { width: s, height: s } });
    await p.setContent(`<body style="margin:0"><svg width="${s}" height="${s}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#f3eee4"/><g transform="translate(50 50) scale(${k}) translate(-50 -50)">
      <rect x="14" y="16" width="50" height="62" rx="6" fill="#fffdf8" stroke="#22263a" stroke-width="2.5"/>
      <rect x="22" y="28" width="30" height="5" rx="2.5" fill="#22263a99"/><rect x="22" y="40" width="34" height="5" rx="2.5" fill="#22263a66"/><rect x="22" y="52" width="24" height="5" rx="2.5" fill="#22263a66"/>
      <circle cx="64" cy="62" r="15" fill="#ffffffcc" stroke="#b3402a" stroke-width="5"/>
      <path d="M75 73 L88 86" stroke="#b3402a" stroke-width="8" stroke-linecap="round"/></g></svg></body>`);
    await p.screenshot({ path: path.join(__dirname, "..", name), clip: { x: 0, y: 0, width: s, height: s } });
  }
  await b.close();
})();
