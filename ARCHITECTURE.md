# ARCHITECTURE.md - ヤマトのシステム全体像

## 全体構成

```
あさひ (ブラウザ)
  ↕ WebSocket (ws://localhost:32123)
ヤマト WSサーバー (WSサーバー.nako3)
  ↓ 内容を受け取る
エージェント層 (エージェント.nako3)
  ↓ 起動待機 (同期実行)
API呼び出し (api_call.mjs)
  ↕ HTTPS
OpenRouter → Qwen MAX
  ↕ REST API
Supabase (記憶・ペルソナ・学習ログ)
```

## コンポーネント責務

| ファイル | 言語 | 責務 |
|---|---|---|
| `WSサーバー.nako3` | なでしこ3 | WebSocket受信・ブロードキャスト |
| `エージェント.nako3` | なでしこ3 | 会話制御・記憶抽出・ペルソナ注入 |
| `ゲートウェイ.nako3` | なでしこ3 | HTTP静的配信・ヘルスチェック |
| `設定.nako3` | なでしこ3 | config.json読み込み |
| `api_call.mjs` | Node.js (薄い橋) | fetch非同期をexecSync経由で同期化 |
| `ui/index.html` | wnako3 + HTML | チャットUI |

## データの流れ

### 会話フロー
1. あさひがメッセージを送信 → WebSocket
2. WSサーバーが受信 → `ヤマトクロウ` を呼び出す
3. エージェントがSupabaseからペルソナ・記憶を読む
4. システムプロンプトを構築してAPIへ送信
5. Qwen MAXが応答 → WebSocketでブラウザへ返す
6. 応答から`[MEMORY]`タグを抽出 → Supabaseへ保存

### 記憶フロー
```
会話 → [MEMORY]タグ抽出 → yamato_memories
                              ↓ (クロンジョブ)
                        Soul.md更新 → yamato_persona[SOUL]
```

## ポート構成

| ポート | 用途 |
|---|---|
| 32000 | HTTPゲートウェイ（UI配信） |
| 32123 | WebSocketサーバー |

## Supabaseテーブル

| テーブル | 内容 |
|---|---|
| `yamato_memories` | 会話から抽出した記憶 |
| `yamato_persona` | Soul.md・ASAHI_MD等のペルソナファイル |
| `yamato_sessions` | 会話セッション管理 |
| `yamato_learnings` | クロンジョブの自律学習ログ |
