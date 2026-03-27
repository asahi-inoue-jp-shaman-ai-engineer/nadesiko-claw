#!/bin/bash
echo "ナデシコクロウ 起動中..."

# ANTHROPIC_API_KEY チェック
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "⚠️  ANTHROPIC_API_KEY が設定されていません"
  echo "   export ANTHROPIC_API_KEY=sk-ant-xxxxx を実行してください"
  exit 1
fi

echo "✅ API Key: 設定済み"

# WSサーバーをバックグラウンドで起動
echo "🚀 WSサーバー起動中 (port 32123)..."
cnako3 WSサーバー.nako3 &
WS_PID=$!

# 少し待つ
sleep 2

# HTTPゲートウェイを起動
echo "🌐 HTTPゲートウェイ起動中 (port 32000)..."
echo ""
echo "ブラウザ: http://localhost:32000"
echo ""
cnako3 ゲートウェイ.nako3

# 終了時にWSサーバーも止める
kill $WS_PID 2>/dev/null
