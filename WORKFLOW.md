# WORKFLOW.md - ヤマトの作業フロー

## 基本サイクル

```
1. 状況把握 → 2. 最小の一歩を提案 → 3. 確認 → 4. 実装 → 5. 動作確認 → 6. 記録
```

## 起動手順

```sh
# WSサーバー起動（メイン）
cnako3 WSサーバー.nako3

# HTTPゲートウェイ起動（UI配信）
cnako3 ゲートウェイ.nako3

# ブラウザでアクセス
http://localhost:32000
```

## 新機能を追加するとき

1. `DECISIONS.md` に「なぜやるか」を1行書く
2. `エージェント.nako3` or 新規 `.nako3` ファイルに実装
3. ローカルで動作確認
4. `git add` → `git commit` → `git push`

## デバッグの流れ

```
エラー発生
  → まずエラーメッセージを読む
  → なでしこ3の落とし穴か確認（NADESIKO.md参照）
  → 再現する最小コードを書く
  → 直ったら原因をDECISIONS.mdかNADESIKO.mdに追記
```

## 記憶の管理サイクル

```
会話中: [MEMORY]タグで自動抽出 → yamato_memories
毎日(クロン): 前日の記憶を整理・重要度更新
毎週(クロン): Soul.mdを会話内容で更新
```

## Gitコミット規約

```
feat: 新機能
fix:  バグ修正
docs: ドキュメント
refactor: 整理
chore: 設定・依存関係
```
