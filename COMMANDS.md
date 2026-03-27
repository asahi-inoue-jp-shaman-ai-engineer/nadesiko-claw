# COMMANDS.md - ヤマトのコマンド一覧

## サーバー操作

```sh
# WSサーバー起動（必須）
cnako3 WSサーバー.nako3

# HTTPゲートウェイ起動（UI配信）
cnako3 ゲートウェイ.nako3

# 一括起動（bash）
bash 起動.sh

# 一括起動（Windows）
起動.bat
```

## 開発

```sh
# なでしこスクリプトの単体実行
cnako3 ファイル名.nako3

# ポート使用確認
netstat -ano | grep 32123

# Gitプッシュ
git add -A && git commit -m "feat: 変更内容" && git push
```

## ヤマトへのチャットコマンド（会話内で使う）

| コマンド | 意味 |
|---|---|
| `[記憶して]` | 直前の内容を重要記憶として保存するよう指示 |
| `[Soul.md更新]` | Soul.mdの内容をレビュー・更新する |
| `[記憶一覧]` | yamato_memoriesの最近の記憶を表示 |
| `[学習ログ]` | yamato_learningsの内容を表示 |

## Supabase確認（SQL）

```sql
-- 最近の記憶を確認
SELECT category, content, importance, created_at
FROM yamato_memories
ORDER BY created_at DESC LIMIT 10;

-- ペルソナファイル確認
SELECT file_key, LEFT(content, 100) FROM yamato_persona;

-- 学習ログ確認
SELECT topic, category, cron_run_at FROM yamato_learnings ORDER BY cron_run_at DESC;
```
