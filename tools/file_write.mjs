// file_write.mjs — ファイルに内容を書き込むツール
// 入力: {tool: "file_write", args: {path: "./output/xxx.md", content: "..."}}
// 出力: {ok: true, path: "..."}
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
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
  const p = input.args.path;
  const lastSlash = p.lastIndexOf('/');
  const dir = lastSlash > 0 ? p.substring(0, lastSlash) : '';
  if (dir) mkdirSync(dir, { recursive: true });
  writeFileSync(p, input.args.content, 'utf8');
  process.stdout.write(JSON.stringify({ ok: true, path: p }));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: e.message }));
}
