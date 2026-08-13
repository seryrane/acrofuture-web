/**
 * 정적 산출물(site/out)을 그대로 띄우는 최소 서버 — **검토용**.
 *
 * ⚠ 왜 개발 서버(`npm run dev`)를 안 쓰나: 개발 서버는 서버 쪽 모듈을 따로 캐시해서,
 *   콘텐츠 파일을 고쳐도 **서버가 옛 값을 계속 내보내는 일**이 있다. 실제로 업무 포탈 주소를
 *   바꿨는데 서버는 옛 주소, 브라우저는 새 주소를 그려서 하이드레이션이 깨졌다
 *   (2026-08-06). 보는 사람에게는 "예전 화면이 나온다"로만 보인다.
 * ⚠ 그래서 여기서는 `npm run build` 결과를 그대로 낸다 — **실제로 배포될 바로 그 파일**이다.
 *
 * 실행:  node scripts/serve-out.mjs [포트]
 */
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'site', 'out')
const PORT = Number(process.argv[2] || 3100)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

/** `/works/x/` 처럼 디렉터리로 내보낸 경로는 그 안의 index.html 을 찾는다 */
async function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  // ⚠ 상위 경로 탈출을 막는다 — 이 서버는 out 밖의 파일을 절대 내보내지 않는다
  const safe = normalize(clean).replace(/^(\.\.[/\\])+/, '')
  const base = join(ROOT, safe)
  for (const candidate of [base, join(base, 'index.html'), `${base}.html`]) {
    try {
      const s = await stat(candidate)
      if (s.isFile()) return candidate
    } catch {
      /* 다음 후보 */
    }
  }
  return null
}

createServer(async (req, res) => {
  const file = (await resolve(req.url || '/')) ?? (await resolve('/404'))
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('찾는 화면이 없습니다')
    return
  }
  res.writeHead(file.includes('404') ? 404 : 200, {
    'content-type': TYPES[extname(file)] || 'application/octet-stream',
    // 검토용이라 캐시를 두지 않는다 — 고친 것이 바로 보여야 한다
    'cache-control': 'no-store',
  })
  createReadStream(file).pipe(res)
}).listen(PORT, () => {
  process.stdout.write(`정적 산출물을 냅니다 → http://localhost:${PORT}  (${ROOT})\n`)
})
