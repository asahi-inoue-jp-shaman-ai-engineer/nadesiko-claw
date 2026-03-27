// 統合サーバー.mjs — Railway対応 HTTP+WS統合エントリポイント
// HTTP と WebSocket を同一ポートで処理。ヤマトコアをサブプロセスで管理。
import http from 'http';
import { WebSocketServer } from 'ws';
import { readFile, writeFile, access } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || '') || 32000;

// MIMEタイプ
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

// config.json が存在しない場合（Railway環境）デフォルトを作成
async function ensureConfig() {
  const configPath = join(__dirname, 'config.json');
  try {
    await access(configPath);
  } catch {
    console.log('📝 config.json が見つかりません。環境変数からデフォルト設定を生成します。');
    const defaultConfig = {
      agent: {
        name: process.env.AGENT_NAME || 'ヤマト',
        identity: process.env.AGENT_IDENTITY || 'あなたはヤマトです。日本語で話す自律型AIエージェントです。',
        model: process.env.AGENT_MODEL || 'qwen/qwen3-max'
      },
      gateway: {
        http_port: PORT,
        ws_port: PORT
      },
      memory: {
        supabase_url: 'https://dyimrnwbuzgcfeksezog.supabase.co',
        supabase_key: process.env.SUPABASE_SERVICE_KEY || ''
      }
    };
    await writeFile(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
    console.log('✅ デフォルト config.json を作成しました。');
  }
}

async function main() {
  await ensureConfig();

  // WSクライアント管理
  const clients = new Set();

  // cnako3 のパス（ローカルインストール優先）
  const localBin = join(__dirname, 'node_modules', '.bin');
  const pathSep = process.platform === 'win32' ? ';' : ':';
  const childEnv = { ...process.env, PATH: localBin + pathSep + (process.env.PATH || '') };

  // ヤマトコアプロセス（永続的なnadesiko3プロセス）
  // stdin: JSON行（WSクライアントからのメッセージ）
  // stdout: JSON行（WSクライアントへのレスポンス） + ログ行（そのまま表示）
  const nakoProc = spawn('cnako3', ['WSサーバー_stdio.nako3'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    cwd: __dirname,
    env: childEnv,
  });

  // stdoutをバッファリング → 1行ずつ処理
  // { で始まる行 → JSON → WSクライアントへブロードキャスト
  // それ以外      → ログ
  let stdoutBuf = '';
  nakoProc.stdout.on('data', (chunk) => {
    stdoutBuf += chunk.toString();
    const lines = stdoutBuf.split('\n');
    stdoutBuf = lines.pop(); // 末尾の不完全な行を保持
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('{')) {
        // JSON → 全WSクライアントへ送信
        for (const ws of clients) {
          if (ws.readyState === 1) {
            try { ws.send(trimmed); } catch (_) {}
          }
        }
      } else {
        // ログ行
        console.log('[ヤマト]', trimmed);
      }
    }
  });

  nakoProc.on('exit', (code) => {
    console.error('❌ nadesiko3プロセスが終了しました。コード:', code);
    process.exit(1);
  });

  nakoProc.on('error', (err) => {
    console.error('❌ nadesiko3プロセス起動エラー:', err.message);
    process.exit(1);
  });

  // HTTPサーバー（静的ファイル配信 + ヘルスチェック）
  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'ok', agent: 'ヤマト', port: PORT }));
      return;
    }

    const urlPath = (req.url === '/' ? '/index.html' : req.url).split('?')[0];
    const filePath = join(__dirname, 'ui', urlPath);
    try {
      const data = await readFile(filePath);
      const ext = extname(filePath);
      const ct = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': ct });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  // WSサーバー（同じHTTPサーバーにアタッチ、パス /ws）
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`🔗 WS接続: ${clients.size} クライアント`);

    ws.on('message', (data) => {
      const msg = data.toString();
      console.log('[WS→stdin]', msg.slice(0, 80));
      // ヤマトコアへ転送
      nakoProc.stdin.write(msg + '\n');
      console.log('[WS→stdin] 送信完了');
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log(`🔌 WS切断: ${clients.size} クライアント`);
    });

    ws.on('error', (err) => {
      console.error('WSエラー:', err.message);
      clients.delete(ws);
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 統合サーバー起動: http://0.0.0.0:${PORT}`);
    console.log(`📡 WebSocket: ws://0.0.0.0:${PORT}/ws`);
  });
}

main().catch((err) => {
  console.error('起動エラー:', err);
  process.exit(1);
});
