// SNS で貼られたときの絵（og.png 1200×630）を作る。今日のお札（答え）は入れず、遊び方の例だけ。お札の絵・額面は描かない。
// 使い方: node tools/make-og.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(`<body style="margin:0;font-family:'Noto Sans CJK JP','IPAPGothic',sans-serif">
  <div style="width:1200px;height:630px;box-sizing:border-box;padding:60px 70px;background:#f3eee4;color:#22263a;display:flex;gap:50px;align-items:center">
    <div style="flex:1">
      <div style="font-size:32px;color:#842c1b;letter-spacing:.08em">国立印刷局・日本銀行の資料に基づく学習ゲーム</div>
      <div style="font-size:96px;font-weight:900;letter-spacing:.02em;white-space:nowrap;color:#143866;margin-top:8px">お札の<span style="color:#b3402a">ひみつ</span></div>
      <div style="font-size:40px;margin-top:10px;line-height:1.5">すかす・傾ける・さわる<br>1日5枚・時間制限なし</div>
    </div>
    <div style="width:420px;background:#fff;border:4px solid #22263a40;border-radius:24px;overflow:hidden;box-shadow:0 14px 30px #22263a33;transform:rotate(3deg)">
      <div style="background:#7a5a2e;color:#fff;font-size:24px;font-weight:900;padding:10px 20px">調べた結果</div>
      <div style="padding:18px;display:flex;flex-direction:column;gap:12px;font-size:26px;line-height:1.4">
        <div style="border:3px solid #22263a1f;border-radius:12px;padding:10px"><b>白い所</b><br>肖像の形が浮かぶ</div>
        <div style="border:3px dashed #b3402a;border-radius:12px;padding:10px"><b>銀色の部分</b><br>もようも色も変わらない？</div>
        <div style="border:3px solid #22263a1f;border-radius:12px;padding:10px"><b>額面の字</b><br>ざらざらしている</div>
      </div>
    </div>
  </div></body>`);
  await p.screenshot({ path: path.join(__dirname, "..", "og.png") });
  await b.close();
})();
