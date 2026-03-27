// supabase_query.mjs — SupabaseをSELECTするツール
// 入力: {tool: "supabase_query", args: {table: "yamato_memories", filter: "importance=gte.4&order=created_at.desc&limit=5"}}
// 出力: {ok: true, rows: [...]}
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const tmpPath = join(__dir, '../tmp_tool.json');
const configPath = join(__dir, '../config.json');

let input;
try {
  input = JSON.parse(readFileSync(tmpPath, 'utf8'));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: 'tmp_tool.json の読み込み失敗: ' + e.message }));
  process.exit(0);
}

let config = {};
try {
  config = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: 'config.json の読み込み失敗: ' + e.message }));
  process.exit(0);
}

const key = process.env.SUPABASE_SERVICE_KEY || config?.memory?.supabase_key || '';
const base = `${config.memory.supabase_url}/rest/v1`;

try {
  const filter = input.args.filter || '';
  const url = filter ? `${base}/${input.args.table}?${filter}` : `${base}/${input.args.table}`;
  const resp = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });
  const rows = await resp.json();
  process.stdout.write(JSON.stringify({ ok: true, rows }));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: e.message }));
}
