// 用法：node tools/encrypt.mjs <網站原始 HTML> <密碼>
// 例如：node tools/encrypt.mjs _private/ntw-demo.html my-new-password
//
// 會把網站內容用密碼加密（PBKDF2 + AES-GCM），輸出成 repository 根目錄的 index.html。
// index.html 裡只有密碼頁與密文，沒有任何網站原文，可以安全地放在公開的 repository。
// 需要 Node.js 18 以上。

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , input, password] = process.argv;
if (!input || !password) {
  console.error('用法：node tools/encrypt.mjs <網站原始 HTML> <密碼>');
  process.exit(1);
}
if (password.length < 10) {
  console.warn('提醒：密碼少於 10 個字元，建議使用更長、不易猜的密碼。');
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let html = readFileSync(input, 'utf8');

// 解密後的頁面也加上禁止收錄
if (!/name="robots"/.test(html)) {
  html = html.replace(/<head>/i, '<head>\n<meta name="robots" content="noindex, nofollow">');
}

// 從網站中取出內嵌的 Lumo logo，給密碼頁使用
const logoMatch = html.match(/src="(data:image\/png;base64,[^"]+)"/);
const logo = logoMatch ? logoMatch[1] : '';

const ITER = 600000;
const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
  keyMaterial,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt']
);
const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(html)));
const b64 = (u8) => Buffer.from(u8).toString('base64');
const payload = JSON.stringify({ v: 1, iter: ITER, salt: b64(salt), iv: b64(iv), data: b64(cipher) });

const template = readFileSync(join(root, 'tools', 'gate.html'), 'utf8');
const out = template.replace('__LOGO__', logo).replace('__PAYLOAD__', payload);
writeFileSync(join(root, 'index.html'), out);
console.log(`完成：index.html 已更新（${Math.round(out.length / 1024)} KB）。把 index.html 推上 GitHub 即可。`);
