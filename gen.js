// お札のひみつの問題を作る（ブラウザと node の両方で使う）。
// 1枚のお札を「調べた結果」を4つ並べ、本物とちがう所が1つ（ans）。全部が本物どおりなら ans = -1（「おかしな所なし」が正解）。
// 中身は国立印刷局・日本銀行の資料で確かめたしかけだけ（README・「このゲームについて」に出典）。
// お札の絵・肖像・額面の写しは描かない（文字で場所と見え方だけを書く）。乱数 R は呼ぶ回数が毎回同じになるように使う。
(function (root) {
  "use strict";
  const LV = ["やさしい", "ふつう", "むずかしい"];
  // 2段目「どう確かめる？」の4つ（日本銀行・国立印刷局の「すかす・傾ける・さわる」と、マイクロ文字のルーペ）
  const RULES = {
    suk: { name: "すかす", law: "光にかざして見る" },
    kat: { name: "傾ける", law: "角度を変えて見る" },
    saw: { name: "さわる", law: "指でなでる" },
    lup: { name: "ルーペで見る", law: "虫めがねで細かく見る" },
  };
  // 出典。画面の「このゲームについて」と README にも同じものを書く
  const SRC = {
    npb: ["国立印刷局「新しい日本銀行券」", "https://www.npb.go.jp/ja/n_banknote/"],
    nnote: ["日本銀行「新しい日本銀行券の特徴」", "https://www.boj.or.jp/note_tfjgs/note/n_note/security.htm"],
    enote: ["日本銀行「一万円・五千円・千円券の偽造防止技術」", "https://www.boj.or.jp/note_tfjgs/note/security/gizoe.htm"],
    n2000: ["日本銀行「二千円券の偽造防止技術」", "https://www.boj.or.jp/note_tfjgs/note/security/cur0004a.htm"],
    boj: ["日本銀行「銀行券の偽造防止」", "https://www.boj.or.jp/note_tfjgs/note/security/index.htm"],
  };

  const pick = (R, arr) => arr[Math.floor(R() * arr.length)];

  // お札（券種）。f = 2024年発行の新しいお札、e = 2004年発行のお札、n2 = 二千円券（2000年発行）
  // bars：すき入れの縦の棒の数。holo：ホログラムの形と場所（新しいお札だけ資料にある）。mark：さわってわかる識別マークの場所（新しいお札）
  // num：表の潜像模様の数字と場所（無ければ裏の NIPPON だけ）
  const NOTES = {
    f10: { name: "新しい一万円券", era: "2024年から", yen: "一万円", color: "#7a5a2e", sr: "npb", bars: 3, holo: "細長い帯の形で、左寄り", mark: "表の左右のはしの真ん中", num: ["表のもよう", "10000"], f: 1 },
    f5: { name: "新しい五千円券", era: "2024年から", yen: "五千円", color: "#6b4a7a", sr: "npb", bars: 2, holo: "細長い帯の形で、真ん中寄り", mark: "表の上下のはしの真ん中", num: ["表のもよう", "5000"], f: 1 },
    f1: { name: "新しい千円券", era: "2024年から", yen: "千円", color: "#2f5f7a", sr: "npb", bars: 1, holo: "四角い小さな形で、左下", mark: "表の右上と左下", num: null, f: 1 },
    e10: { name: "一万円券（2004年発行）", era: "2004年から", yen: "一万円", color: "#6f5a3a", sr: "enote", bars: 3, holo: "e", num: ["表の左下", "10000"] },
    e5: { name: "五千円券（2004年発行）", era: "2004年から", yen: "五千円", color: "#6a4f6e", sr: "enote", bars: 2, holo: "e", num: ["表の真ん中の下", "5000"] },
    e1: { name: "千円券（2004年発行）", era: "2004年から", yen: "千円", color: "#335a6e", sr: "enote", bars: 1, holo: null, num: null, epearl: 1 },
    n2: { name: "二千円券", era: "2000年から", yen: "二千円", color: "#3f5f4a", sr: "n2000", bars: 0, holo: null, num: ["表の左下", "2000"], ovi: 1 },
  };
  const NOTE_IDS = Object.keys(NOTES);
  const NUMS = ["10000", "5000", "2000", "1000"];
  const FHOLO = ["細長い帯の形で、左寄り", "細長い帯の形で、真ん中寄り", "四角い小さな形で、左下"];
  const FMARK = ["表の左右のはしの真ん中", "表の上下のはしの真ん中", "表の右上と左下"];

  // しかけ（調べる所）。g は組（同じ組は1枚に1つだけ）・m は確かめ方（RULES）・has(n) はそのお札にあるか
  // t(n) は本物どおりの見え方、x(n, R) は本物とちがう見え方
  const FEAT = {
    suka: { g: "suka", m: "suk", name: "すかし", has: () => true,
      t: (n) => (n.f ? "白い所：肖像と、まわりの細かいもようが浮かぶ" : n.ovi ? "白い所：すかしのもようが浮かぶ" : "白い所：肖像の形が浮かぶ"),
      x: () => "白い所：何の形も出てこない" },
    zara: { g: "zara", m: "saw", name: "深凹版印刷", has: () => true,
      t: () => "大きな額面の字：ざらざらと盛り上がっている",
      x: () => "大きな額面の字：つるつるで平ら" },
    micro: { g: "micro", m: "lup", name: "マイクロ文字", has: () => true,
      t: () => "細い線の中：「NIPPONGINKO」の小さな字が読める",
      x: () => "細い線の中：字にならない、にじんだ点の集まり" },
    holo: { g: "holo", m: "kat", name: "ホログラム", has: (n) => !!n.holo,
      t: (n) => (n.f ? "銀色の部分：肖像が立体的に回って見える" : "銀色の部分：もようと色が変わって見える"),
      x: () => "銀色の部分：もようも色も、まったく変わらない" },
    bar: { g: "bar", m: "suk", name: "すき入れバーパターン", has: (n) => n.bars > 0,
      t: (n) => `白い所のとなり：縦の棒が${n.bars}本見える`,
      x: (n, R) => `白い所のとなり：縦の棒が${pick(R, [1, 2, 3].filter((b) => b !== n.bars))}本見える` },
    pearl: { g: "pearl", m: "kat", name: "パールインキ", has: () => true,
      t: () => "左右のはしの余白：ピンク色にきらっと光る",
      x: () => "左右のはしの余白：どの角度でも光らない" },
    senzo: { g: "senzo", m: "kat", name: "潜像模様", has: () => true,
      t: (n) => (n.num ? `${n.num[0]}：「${n.num[1]}」の字が浮かぶ` : "裏のもよう：「NIPPON」の字が浮かぶ"),
      x: (n, R) => (n.num ? `${n.num[0]}：「${pick(R, NUMS.filter((v) => v !== n.num[1]))}」の字が浮かぶ` : "裏のもよう：どの角度でも、字は浮かばない") },
    holot: { g: "holo", m: "kat", name: "ホログラムの形と場所", has: (n) => !!n.f,
      t: (n) => `銀色の部分：${n.holo}`,
      x: (n, R) => `銀色の部分：${pick(R, FHOLO.filter((v) => v !== n.holo))}` },
    mark: { g: "mark", m: "saw", name: "識別マーク", has: (n) => !!n.f,
      t: (n) => `さわってわかる斜めの線の印：${n.mark}`,
      x: (n, R) => `さわってわかる斜めの線の印：${pick(R, FMARK.filter((v) => v !== n.mark))}` },
    ovi: { g: "ovi", m: "kat", name: "光学的変化インキ", has: (n) => !!n.ovi,
      t: () => "右上の「2000」：青緑から紫に色が変わる",
      x: () => "右上の「2000」：どの角度でも同じ色のまま" },
    epearl: { g: "epearl", m: "kat", name: "潜像パール模様", has: (n) => !!n.epearl,
      t: () => "左右のもよう：「千円」と「1000」の字が浮かぶ",
      x: () => "左右のもよう：どの角度でも、字は浮かばない" },
  };
  const FIDS = Object.keys(FEAT);

  // 種類＝本物とちがう所になるしかけ。look はヒント（見るところ）、why は本物どおりの説明
  const KINDS = [
    // ---- やさしい ----
    { id: "suka", lv: 0, look: "すかしは、光にかざすと白い所に形が浮かびます。",
      why: "どのお札にも、光にかざすと形が浮かぶ「すかし」があります。新しいお札は、まわりの細かいもようも浮かびます。" },
    { id: "zara", lv: 0, look: "額面の大きな字は、インキを高く盛って印刷しています。",
      why: "額面の字などは「深凹版印刷」で、インキが盛り上がり、さわるとざらざらします。" },
    { id: "micro", lv: 0, look: "とても小さな字は、コピー機ではつぶれてしまいます。",
      why: "細い線に見える所に「NIPPONGINKO」の小さな字（マイクロ文字）が入っています。ルーペで読めます。" },
    { id: "holo", lv: 0, look: "銀色のホログラムは、角度で見え方が変わります。",
      why: "ホログラムは傾けると見え方が変わります。新しいお札では、肖像が立体的に回って見えます（3Dホログラム）。" },
    // ---- ふつう ----
    { id: "bar", lv: 1, look: "すき入れの縦の棒は、一万円3本・五千円2本・千円1本です。",
      why: "光にかざすと見える縦の棒（すき入れバーパターン）は、一万円券3本・五千円券2本・千円券1本です。" },
    { id: "pearl", lv: 1, look: "左右のはしの余白は、傾けるとピンク色に光ります。",
      why: "左右のはしの余白には「パールインキ」が刷られ、傾けるとピンク色に光ります。" },
    { id: "senzo", lv: 1, look: "傾けると浮かぶ数字は、そのお札の額面と同じです。",
      why: "「潜像模様」は、傾けると額面の数字や「NIPPON」の字が浮かびます。数字はそのお札の額面です。" },
    // ---- むずかしい ----
    { id: "holot", lv: 2, look: "新しいお札のホログラム：一万円は帯で左寄り、五千円は帯で真ん中寄り、千円は四角で左下。",
      why: "新しいお札のホログラムは、一万円券は帯の形で左寄り、五千円券は帯の形で真ん中寄り、千円券は四角い形（パッチ型）で左下です。" },
    { id: "mark", lv: 2, look: "新しいお札の識別マーク：一万円は左右、五千円は上下、千円は右上と左下。",
      why: "目の不自由な人も指でわかる「識別マーク」は11本の斜めの線で、一万円券は左右のはしの真ん中、五千円券は上下のはしの真ん中、千円券は右上と左下です。" },
    { id: "ovi", lv: 2, look: "二千円券の右上の数字は、傾けると色が変わるインキです。",
      why: "二千円券の右上の「2000」は「光学的変化インキ」で、傾けると青緑から紫に色が変わります。" },
    { id: "epearl", lv: 2, look: "2004年発行の千円券は、左右のもようにパールと潜像を組み合わせています。",
      why: "2004年発行の千円券は「潜像パール模様」で、傾けると「千円」と「1000」の字が浮かびます。" },
  ];
  const BY = Object.fromEntries(KINDS.map((k) => [k.id, k]));
  for (const k of KINDS) { const f = FEAT[k.id]; k.name = f.name; k.rule = f.m; k.notes = NOTE_IDS.filter((n) => f.has(NOTES[n])); }
  const kindsOf = (lv) => KINDS.filter((k) => k.lv === lv).map((k) => k.id);

  function seedOf(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const shuf = (R, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // 1枚を作る。tag は「種類|種|o か x」（o は全部本物どおり・x はちがう所あり・無ければ種で決める）。同じ tag ならいつも同じお札
  function make(tag) {
    const [kind, seed, want] = String(tag).split("|"), k = BY[kind];
    if (!k) return null;
    const R = rng(seedOf(kind + "|" + seed)), roll = R(), ok = want === "o" ? true : want === "x" ? false : roll < 0.3;
    const nid = pick(R, k.notes), n = NOTES[nid], main = FEAT[kind];
    const gs = new Set([main.g]), others = [];
    for (const f of shuf(R, FIDS.filter((f) => f !== kind && FEAT[f].has(n)))) if (others.length < 3 && !gs.has(FEAT[f].g)) { gs.add(FEAT[f].g); others.push(f); }
    const order = shuf(R, [kind, ...others]);
    const xText = main.x(n, R);
    const parts = order.map((f) => ({ t: f, text: f === kind && !ok ? xText : FEAT[f].t(n) }));
    const ans = ok ? -1 : order.indexOf(kind);
    const key = [kind, ok ? "o" : "x", nid, parts.map((x) => x.text).sort().join("/")].join("|");
    return { tag, kind, lv: k.lv, rule: k.rule, name: k.name, look: k.look, src: n.sr, ok, key, note: nid, noteName: n.name, era: n.era, yen: n.yen, color: n.color, parts, ans, v: ok ? "o" : "x",
      why: k.why, fix: FEAT[kind].t(n) };
  }
  // 同じお札かを見分ける短い名前（とことん・練習で、1回の中に同じものを出さないため）
  const keyOf = (tag) => { const p = make(tag); return p ? p.key : ""; };

  // 今日の5枚（やさしい2・ふつう2・むずかしい1）。種類は重ねず、おかしな所なしは1〜2枚
  function dailyTags(date) {
    const R = rng(seedOf("day:" + date)), sh = (a) => shuf(R, a);
    const ids = [...sh(kindsOf(0)).slice(0, 2), ...sh(kindsOf(1)).slice(0, 2), ...sh(kindsOf(2)).slice(0, 1)];
    const nOk = R() < 0.5 ? 1 : 2, okAt = sh([0, 1, 2, 3, 4]).slice(0, nOk);
    return ids.map((id, i) => `${id}|${date}:d${i}|${okAt.includes(i) ? "o" : "x"}`);
  }
  // 上級の3枚（ふつう・むずかしいから、今日の5枚と別の種類。ヒントなし）。おかしな所なしは0〜1枚
  function hardTags(date) {
    const used = dailyTags(date).map((t) => t.split("|")[0]), R = rng(seedOf("hard:" + date));
    const pool = shuf(R, [...kindsOf(1), ...kindsOf(2)].filter((x) => !used.includes(x)));
    const okAt = R() < 0.5 ? Math.floor(R() * 3) : -1;
    return pool.slice(0, 3).map((id, i) => `${id}|${date}:h${i}|${i === okAt ? "o" : "x"}`);
  }

  const OSATSU = { KINDS, BY, LV, RULES, SRC, NOTES, FEAT, kindsOf, seedOf, rng, make, keyOf, dailyTags, hardTags };
  if (typeof module !== "undefined" && module.exports) module.exports = OSATSU; else root.OSATSU = OSATSU;
})(typeof self !== "undefined" ? self : this);
