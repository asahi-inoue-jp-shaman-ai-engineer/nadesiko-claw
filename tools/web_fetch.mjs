// web_fetch.mjs — URLの内容を取得するツール
// 入力: tmp_tool.json = {tool: "web_fetch", args: {url: "https://..."}}
// 出力: {ok: true, content: "ページの内容（先頭2000文字）"}
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const tmpPath = join(__dir, '../tmp_tool.json');

let input;
try {
  input = JSON.parse(readFileSync(tmpPath, 'utf8'));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: 'tmp_tool.json の読み込み失敗: ' + e.message }));
  process.exit(0);
}

try {
  const resp = await fetch(input.args.url, { headers: { 'User-Agent': 'YamatoBot/1.0' } });
  const text = await resp.text();
  process.stdout.write(JSON.stringify({ ok: true, content: text.slice(0, 2000) }));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: e.message }));
}
