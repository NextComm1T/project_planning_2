/* Wireframe 정합성 검사 — 화면을 고친 뒤 `node check.js` 로 돌린다.
   확인 항목: screen-meta JSON 파싱 / data-when·data-not 값이 실제 state id인지 /
             common.js 로드 순서 / 링크 대상 파일 존재. */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const dir = path.join(root, 'screens');
let fail = 0;
const say = (ok, msg) => { if (!ok) fail++; console.log((ok ? 'OK   ' : 'FAIL ') + msg); };

for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html'))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = src.match(/<script type="application\/json" id="screen-meta">([\s\S]*?)<\/script>/);
  say(!!m, `${f}: screen-meta 블록`);
  if (!m) continue;

  let meta;
  try { meta = JSON.parse(m[1]); } catch (e) { say(false, `${f}: meta JSON — ${e.message}`); continue; }
  say(true, `${f}: state ${meta.states.length}개 (${meta.states.map(s => s.id).join(', ')})`);

  const ids = meta.states.map(s => s.id);
  const used = new Set();
  for (const attr of ['data-when', 'data-not']) {
    const re = new RegExp(attr + '="([^"]+)"', 'g');
    let x;
    while ((x = re.exec(src))) x[1].split(' ').forEach(v => used.add(v));
  }
  const unknown = [...used].filter(v => !ids.includes(v));
  say(unknown.length === 0, `${f}: data-when/not 값 ↔ state id — ${unknown.join(',') || '일치'}`);

  const iCommon = src.indexOf('scripts/common.js');
  const iInline = src.lastIndexOf('<script>');
  say(iInline === -1 || iCommon > iInline, `${f}: common.js 가 페이지 스크립트보다 뒤에 로드`);

  const links = [...src.matchAll(/href="([^"#]+?)(\?[^"]*)?"/g)].map(x => x[1])
    .filter(h => !h.startsWith('http') && !h.startsWith('..'));
  for (const h of new Set(links)) say(fs.existsSync(path.join(dir, h)), `${f}: 링크 ${h}`);
}

const idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const refs = [...idx.matchAll(/(?:href|src)="([^"#]+?)(\?[^"]*)?"/g)].map(x => x[1]).filter(h => !h.startsWith('http'));
for (const h of new Set(refs)) say(fs.existsSync(path.join(root, h)), `index.html: 참조 ${h}`);

console.log(fail === 0 ? '\n전부 통과' : `\n실패 ${fail}건`);
process.exit(fail ? 1 : 0);
