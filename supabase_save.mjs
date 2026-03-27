// supabase_save.mjs — Supabase REST API 保存ヘルパー
// なでしこ3の 起動待機 から呼ばれる（同期実行・stdout出力）
// tmp_save.json から入力を読み、INSERT または UPDATE を実行する
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// config.json を読む
let config = {};
try {
  config = JSON.parse(readFileSync(join(__dir, 'config.json'), 'utf8'));
} catch (_) {
  // config.json が存在しない場合は空オブジェクトで続行
}

// tmp_save.json を読む
let input = {};
try {
  input = JSON.parse(readFileSync(join(__dir, 'tmp_save.json'), 'utf8'));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: 'tmp_save.json の読み込みに失敗: ' + e.message }));
  process.exit(0);
}

// APIキー: 環境変数 > config.json
const apiKey = process.env.SUPABASE_SERVICE_KEY || config?.memory?.supabase_key || '';
if (!apiKey) {
  process.stdout.write(JSON.stringify({
    ok: false,
    error: 'Supabase APIキーが設定されていません。SUPABASE_SERVICE_KEY環境変数またはconfig.jsonのmemory.supabase_keyを設定してください。'
  }));
  process.exit(0);
}

// Supabase URL
const baseUrl = config?.memory?.supabase_url || 'https://dyimrnwbuzgcfeksezog.supabase.co';

// 入力パラメータの検証
const { table, data, mode = 'insert', match = {} } = input;

if (!table) {
  process.stdout.write(JSON.stringify({ ok: false, error: 'table が指定されていません' }));
  process.exit(0);
}
if (!data || typeof data !== 'object') {
  process.stdout.write(JSON.stringify({ ok: false, error: 'data が指定されていないか不正です' }));
  process.exit(0);
}

// URLとメソッドの決定
let url = `${baseUrl}/rest/v1/${table}`;
let method = 'POST';

if (mode === 'update') {
  method = 'PATCH';
  // match の各キーをクエリパラメータに追加
  const matchKeys = Object.keys(match);
  if (matchKeys.length === 0) {
    process.stdout.write(JSON.stringify({ ok: false, error: 'update モードでは match が必要です' }));
    process.exit(0);
  }
  const params = matchKeys.map(k => `${encodeURIComponent(k)}=eq.${encodeURIComponent(match[k])}`).join('&');
  url = `${url}?${params}`;
}

// Supabase REST API を呼び出す
try {
  const resp = await fetch(url, {
    method,
    headers: {
      'apikey': apiKey,
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });

  if (resp.ok) {
    process.stdout.write(JSON.stringify({ ok: true }));
  } else {
    let errBody = '';
    try {
      errBody = await resp.text();
    } catch (_) {}
    process.stdout.write(JSON.stringify({
      ok: false,
      error: `HTTP ${resp.status}: ${errBody}`
    }));
  }
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: e.message }));
}
