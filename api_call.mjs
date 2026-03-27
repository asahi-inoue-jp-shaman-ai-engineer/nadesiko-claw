// api_call.mjs — OpenRouter API呼び出しヘルパー
// なでしこ3の 起動待機 から呼ばれる（同期実行・stdout出力）
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// config.json と tmp_body.json を読む
const config = JSON.parse(readFileSync(join(__dir, 'config.json'), 'utf8'));
const body   = JSON.parse(readFileSync(join(__dir, 'tmp_body.json'), 'utf8'));

// APIキー: 環境変数 > config.json
const apiKey = process.env.OPENROUTER_API_KEY || config?.agent?.api_key || '';
if (!apiKey) {
  process.stdout.write(JSON.stringify({
    choices: null,
    error: { message: 'APIキーが設定されていません。OPENROUTER_API_KEY環境変数またはconfig.jsonのagent.api_keyを設定してください。' }
  }));
  process.exit(0);
}

// Anthropic形式 → OpenAI/OpenRouter形式に変換
// body: { model, max_tokens, system, messages }
const messages = [];
if (body.system) {
  messages.push({ role: 'system', content: body.system });
}
if (body.messages) {
  messages.push(...body.messages);
}

const reqBody = {
  model: body.model || 'qwen/qwen3-max',
  messages,
  max_tokens: body.max_tokens || 4096
};

try {
  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://nadesiko-claw.railway.app',
      'X-Title': 'NadesikoClaw'
    },
    body: JSON.stringify(reqBody)
  });
  const json = await resp.json();
  process.stdout.write(JSON.stringify(json));
} catch (e) {
  process.stdout.write(JSON.stringify({ error: { message: e.message } }));
}
