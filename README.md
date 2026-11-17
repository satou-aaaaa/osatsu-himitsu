# お札のひみつ

すかし・ホログラム・ざらざらの字。お札（日本銀行券）を調べた結果を4つ読み、本物とちがう所を見つける1日5枚の学習ゲームです。事前の知識なしで遊べ、偽造を防ぐしかけと確かめ方（すかす・傾ける・さわる・ルーペで見る）が身につきます。

- 遊ぶ：<https://satou-aaaaa.github.io/osatsu-himitsu/>
- 今日の5枚はだれでも同じ（1日1回）。上級・とことん・練習は好きなだけ。時間制限なし。
- 記録は遊ぶ人のブラウザだけに残ります（外へ送りません）。別の端末へは「引き継ぎ」で移せます。

## 中身の出どころ（国立印刷局・日本銀行）

- 国立印刷局「新しい日本銀行券」：<https://www.npb.go.jp/ja/n_banknote/>
- 日本銀行「新しい日本銀行券の特徴」：<https://www.boj.or.jp/note_tfjgs/note/n_note/security.htm>
- 日本銀行「一万円・五千円・千円券の偽造防止技術」：<https://www.boj.or.jp/note_tfjgs/note/security/gizoe.htm>
- 日本銀行「二千円券の偽造防止技術」：<https://www.boj.or.jp/note_tfjgs/note/security/cur0004a.htm>
- 日本銀行「銀行券の偽造防止」：<https://www.boj.or.jp/note_tfjgs/note/security/index.htm>

お札の絵・写真は使わず、文字だけで書いています。調べた結果は練習用の作り話です。おかしなお札に気づいたら、使わずに、すぐ近くの警察か日本銀行へ知らせてください。

## 開発

```bash
bash scripts/setup.sh
node qa/run.mjs
```

決まりは [AGENTS.md](AGENTS.md)。感想は [感想フォーム](https://github.com/satou-aaaaa/osatsu-himitsu/issues/new?template=feedback.yml) から。
