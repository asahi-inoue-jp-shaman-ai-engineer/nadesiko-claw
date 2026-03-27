@echo off
chcp 65001 > nul
echo ナデシコクロウ 起動中...
echo.

:: ANTHROPIC_API_KEY が未設定なら警告
if "%ANTHROPIC_API_KEY%"=="" (
  echo ⚠️  ANTHROPIC_API_KEY が設定されていません
  echo    set ANTHROPIC_API_KEY=sk-ant-xxxxx を実行してから再起動してください
  pause
  exit /b 1
)

echo ✅ API Key: 設定済み
echo.

:: WSサーバーをバックグラウンドで起動
echo 🚀 WSサーバー起動中 (port 32123)...
start "ヤマト WSサーバー" cmd /c "cnako3 WSサーバー.nako3 & pause"

:: 少し待つ
timeout /t 2 /nobreak > nul

:: HTTPゲートウェイを起動
echo 🌐 HTTPゲートウェイ起動中 (port 32000)...
echo.
echo ブラウザ: http://localhost:32000
echo.
cnako3 ゲートウェイ.nako3
