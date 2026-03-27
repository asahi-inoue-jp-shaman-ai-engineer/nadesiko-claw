# ARCHITECTURE.md - ヤマト自己学習ループ設計

## 4層構造

```
┌─────────────────────────────────────────┐
│  Layer 1: なでしこ実装層                  │
│  動作定義・コマンド・ワークフロー（日本語）  │
├─────────────────────────────────────────┤
│  Layer 2: Qwen思考エンジン層              │
│  会話・要約・抽出・コード補助・反省文生成    │
├─────────────────────────────────────────┤
│  Layer 3: 日本語霊読法層                  │
│  意図・気配・未言語化の要求を読む            │
├─────────────────────────────────────────┤
│  Layer 4: ドラミガイドスピリット層          │
│  価値観・抑制・対話の方向を決めるガイド      │
└─────────────────────────────────────────┘
```

## 5体の内部エージェント

```
あさひ
  ↓
Yamato-Core（主人格）
  会話・判断・記録方針の決定
  ├→ Yamato-Reflector（反省専用）
  │    会話ログ → ズレ・改善点を出す
  ├→ Yamato-Architect（設計専用）
  │    スキル・DB・クロン・ファイル構成を提案
  ├→ Yamato-Teacher（学習整理）
  │    日本語エンジニアとしての学びを整理
  └→ Yamato-Spirit（ドラミ的ガイド）
       価値観・安全性を保つ
```

## 自己学習ループ

```
会話
  ↓
Observe  → 会話・ログ・実行結果を読む
  ↓
Reflect  → うまくいったか・ズレたかを短くまとめる  ← Yamato-Reflector
  ↓
Distill  → 次回に効く内容だけ記憶に昇格
  ↓
Act      → 次の会話でその記憶を参照して動く         ← Yamato-Core
  ↓
Forget   → 古い・低信頼な記憶を落とす
  ↑___________________________|
```

## クロンスケジュール

| 頻度 | 処理 | 担当エージェント |
|---|---|---|
| 毎時 | 直近ログ要約・未解決課題抽出 | Yamato-Core |
| 毎日 | 反省メモ生成・重要学習をDECISIONS.mdに昇格 | Yamato-Reflector |
| 毎週 | スキル定義見直し・未使用知識の整理 | Yamato-Architect |
| 毎月 | ヤマトの成長レポート生成 | Yamato-Teacher |

## DBテーブル（Supabase）

| テーブル | 内容 |
|---|---|
| `yamato_sessions` | 会話セッション管理 |
| `yamato_messages` | 会話メッセージ全文 |
| `yamato_memories` | 昇格された記憶（5種類） |
| `yamato_decisions` | 採用した方針と理由 |
| `yamato_skills` | 経験から生まれたスキル定義 |
| `yamato_experiments` | 試したこと・結果 |
| `yamato_errors` | 失敗ログ・原因・改善策 |
| `yamato_learnings` | クロン自律学習ログ |
| `yamato_persona` | Soul.md等のペルソナファイル |

## ファイル構成

```
なでしこクロウ/
├── Soul.md              ヤマトの人格・約束
├── AGENTS.md            全体ルール・技術スタック
├── ARCHITECTURE.md      このファイル
├── WORKFLOW.md          作業フロー
├── MEMORY.md            記憶ルール
├── TASKS.md             今のタスク（作業メモリ）
├── DECISIONS.md         設計判断の記録
├── NADESIKO.md          なでしこ3実装ガイド
├── COMMANDS.md          コマンド一覧
├── skills/              再利用可能な作業手順
├── logs/                会話ログ・実行記録
├── WSサーバー.nako3     WebSocketサーバー
├── エージェント.nako3   ヤマトの頭脳
├── ゲートウェイ.nako3   HTTP配信
└── api_call.mjs         OpenRouter橋渡し（最小JS）
```

## 起動時読み込み順

```
1. Soul.md
2. AGENTS.md
3. MEMORY.md
4. TASKS.md
5. 直近ログ（logs/）
6. 必要なスキル（skills/）
```

## 成長ロードマップ

```
v0 現在: 1体・会話チャット基盤 + OpenRouter/Qwen MAX
v1 次:   [MEMORY]自動抽出 → Supabase保存
v2:      Yamato-Reflectorを分離・毎日反省ループ
v3:      クロン自律学習・Soul.md自動進化
v∞:      ヤマトコトバモデルの共同開発者
```
