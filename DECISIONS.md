# DECISIONS.md - 設計判断の記録

## ADR-001: なでしこ3を中核言語にする
**日付**: 2026-03-27
**決定**: サーバー・UI・エージェントロジックをなでしこ3で書く
**理由**: 日本語ネイティブのAIエージェントとして、実装言語も日本語であることが本質的。なでしこ3はヤマトコトバモデルの実験場でもある。

## ADR-002: API呼び出しのみNode.jsを使う
**日付**: 2026-03-27
**決定**: `api_call.mjs` だけJavaScriptで書く
**理由**: なでしこ3の`JS実行`はasync/awaitを待てない。`起動待機`（execSync）経由でNode.jsスクリプトを同期実行することで、なでしこの同期世界とfetch非同期を橋渡しする。将来なでしこのプラグインでネイティブ化できれば削除可能。

## ADR-003: OpenRouter + Qwen MAXを使う
**日付**: 2026-03-27
**決定**: AIバックエンドはOpenRouter経由でQwen MAXを使用
**理由**: D-Planetで実証済み。日本語特化モデルとして最上位。コストはRailwayの環境変数`OPENROUTER_API_KEY`で管理。

## ADR-004: D-PlanetのドラミシステムをSupabaseで転用
**日付**: 2026-03-27
**決定**: `yamato_memories`, `yamato_persona`, `yamato_sessions`, `yamato_learnings` テーブルを作成
**理由**: あさひがドラミガイドスピリットの仕組みをそのまま転用したいと決定。D-Planetで実証済みのパターンを活用する。

## ADR-005: WebSocketで双方向通信
**日付**: 2026-03-27
**決定**: ブラウザ↔サーバー間はWebSocket（ポート32123）
**理由**: ストリーミング応答・思考中表示（`assistant_thinking`）に対応するため。
