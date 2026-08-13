/**
 * Pretendard 를 **우리 서버에서** 낸다 — 외부 CDN 을 끊는다.
 *
 * ⚠⚠ 왜 옮기는가 (2026-08-11):
 *   예전에는 `<head>` 에서 jsdelivr 의 스타일시트를 불렀다. 그러면 두 가지가 걸린다.
 *   ① **렌더를 막는 요청이 남의 서버에 달려 있다.** 그 CSS 가 와야 화면이 그려지는데,
 *      그 앞에 DNS·TLS 까지 붙는다(그래서 preconnect 를 따로 달아야 했다).
 *   ② 회사망·공공망에서 그 도메인이 막히면 **한글 전체가 맑은 고딕으로 떨어진다.**
 *      회사 홈페이지에서 가장 티 나는 사고다.
 *   자매 프로젝트(HMG)가 같은 함정을 밟고 이미 같은 결론을 냈다 — `frontend/DESIGN.md`:
 *   "번들 필수. 이름만 올린 글꼴은 없는 글꼴이다… 외부 CDN 로드는 하지 않는다."
 *
 * ⚠ **통짜 한 벌(2MB)을 쓰지 않는다.** `woff2/` 에 든 한 파일은 한글 전체가 들어 있어 2MB 다.
 *   대신 `woff2-dynamic-subset/`(92벌)을 쓴다 — 각 `@font-face` 에 `unicode-range` 가 붙어 있어
 *   브라우저가 **그 페이지에 실제로 나온 글자가 든 조각만** 받는다. CDN 이 하던 것과 같은 방식이다.
 *
 * ⚠ CSS 는 `public/` 이 아니라 `src/app/` 으로 낸다. `globals.css` 가 `@import` 로 삼키면
 *   **이미 있는 스타일시트 한 장에 합쳐져서 요청이 하나도 안 는다.** public 에 두고 <link> 로
 *   부르면 self-host 인데도 요청이 한 번 더 생긴다 — 옮긴 이유의 절반이 사라진다.
 *
 * ⚠ 그래서 url() 을 **절대경로(`/fonts/...`)로 다시 쓴다.** 원본은 `./woff2-dynamic-subset/…`
 *   상대경로라, CSS 가 다른 폴더로 옮겨 가는 순간 전부 404 가 된다(화면은 멀쩡하고 글꼴만
 *   조용히 안 온다 — 알아채기 가장 어려운 종류의 고장이다).
 *
 * 실행: node scripts/build-fonts.mjs   (저장소 루트에서 · 패키지를 올리면 다시 돌린다)
 */
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PKG = path.join(ROOT, 'site', 'node_modules', 'pretendard', 'dist', 'web', 'variable')
const SRC_CSS = path.join(PKG, 'pretendardvariable-dynamic-subset.css')
const SRC_FONTS = path.join(PKG, 'woff2-dynamic-subset')

/** 내보낼 곳 — 글꼴 파일은 public, CSS 는 빌드에 삼켜지도록 src/app */
const OUT_FONTS = path.join(ROOT, 'site', 'public', 'fonts', 'pretendard')
const OUT_CSS = path.join(ROOT, 'site', 'src', 'app', 'pretendard.css')
const URL_BASE = '/fonts/pretendard'

async function main() {
  // 판을 갈아치울 때 옛 조각이 남으면 CSS 에 없는 파일이 그대로 배포된다
  await rm(OUT_FONTS, { recursive: true, force: true })
  await mkdir(OUT_FONTS, { recursive: true })

  const files = (await readdir(SRC_FONTS)).filter((f) => f.endsWith('.woff2'))
  for (const f of files) await copyFile(path.join(SRC_FONTS, f), path.join(OUT_FONTS, f))

  const raw = await readFile(SRC_CSS, 'utf8')
  const css = raw.replace(/url\(\.\/woff2-dynamic-subset\//g, `url(${URL_BASE}/`)

  // 옮겼는데 한 줄이라도 상대경로가 남아 있으면 그 조각만 404 다 — 조용히 넘어가지 않는다
  const left = css.match(/url\((?!\/fonts\/)[^)]*\)/g)
  if (left) throw new Error(`고쳐지지 않은 url() 이 남았습니다: ${left.slice(0, 3).join(', ')}`)

  const count = (css.match(/@font-face/g) ?? []).length
  if (count !== files.length) {
    throw new Error(`@font-face ${count}개인데 글꼴 파일은 ${files.length}개입니다 — 짝이 안 맞습니다`)
  }

  await writeFile(
    OUT_CSS,
    [
      '/* 자동 생성 — `node scripts/build-fonts.mjs` 가 씁니다. 손으로 고치지 마세요.',
      ' *',
      ' * Pretendard (SIL Open Font License 1.1) — Kil Hyung-jin',
      ' * https://github.com/orioncactus/pretendard',
      ' *',
      ` * 조각 ${files.length}벌. unicode-range 가 붙어 있어 브라우저는 그 페이지에 나온 글자가 든`,
      ' * 조각만 받습니다(한 벌 통짜는 2MB 입니다).',
      ' */',
      '',
      css.trimStart(),
    ].join('\n'),
    'utf8',
  )

  const kb = (await Promise.all(files.map(async (f) => (await readFile(path.join(SRC_FONTS, f))).length)))
    .reduce((a, b) => a + b, 0)
  console.log(`글꼴 조각 ${files.length}벌 → site/public/fonts/pretendard (${(kb / 1024 / 1024).toFixed(1)}MB, 실제 전송은 쓰인 조각만)`)
  console.log(`CSS → site/src/app/pretendard.css (@font-face ${count}개, globals.css 가 @import 로 삼킵니다)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
