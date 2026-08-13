/**
 * 소개서에서 뽑아 둔 실물 캡처(research/추출이미지)를 웹용으로 굽는다.
 *
 * ⚠ **원본 이름은 내용을 말해 주지 않는다.** `p27_00` 이 DGB캐피탈인지 르노인지 파일명으론 모른다.
 *   2026-08-07 에 실제로 p27·p28·p29 세 페이지에서 짝이 어긋난 채로 배포됐다 —
 *   르노 카드에 DGB 화면이, 마이카정보 카드에 CJ 레시피 앱이 떴다.
 *   그래서 이 표는 **`research/pages/pNN.png` 를 눈으로 보고** 채운 것이다. 고칠 때도 그렇게 한다.
 *
 * ⚠ 소개서에는 **내용 없는 빈 목업 액자**("Place Your Image Here" 노트북)가 섞여 있다.
 *   p14_51 · p15_51 · p17_56 · p21_08 이 그것이고, 실으면 이미지가 깨진 것처럼 보인다. 굽지 않는다.
 * ⚠ p28_27 은 대부분이 검정이다(반사 효과가 들어간 조각). 같은 페이지의 개별 폰 캡처가 멀쩡하므로 버린다.
 * ⚠ **투명 영역을 흰색으로 눌러서 굽는다.** 안 그러면 어두운 바탕 위에서 통째로 까맣게 보인다.
 * ⚠ 세로가 긴 모바일 캡처는 줄이지 않는다 — 이미 작고, 더 줄이면 글씨가 뭉갠다.
 *
 * 실행: node scripts/build-media.mjs   (저장소 루트에서)
 */
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// ⚠ sharp 는 Next 가 site/ 안에 깔아 둔 것을 빌려 쓴다 — 루트에 따로 설치하지 않는다
const sharp = createRequire(path.join(ROOT, 'site', 'package.json'))('sharp')

const SRC = path.join(ROOT, 'research', '추출이미지')
const OUT = path.join(ROOT, 'site', 'public', 'media', 'works')

/**
 * 원본 파일 → 내보낼 이름. **research/pages 의 해당 쪽을 보고 확인한 것만 넣는다.**
 * 표에 없는 파일은 안 굽는다(빈 목업·연락처 지도·표지 등).
 */
const MAP = {
  // ── p14~15 · 현대오토에버 글로벌 컨텐츠 정보제공 사이트(Global CP) 2024.03~12 ──
  'p14_52_1229x660.png': 'autoever-cp-admin-1', // 지역별 EV 충전소·POI 통계 대시보드
  'p15_52_1229x660.png': 'autoever-cp-admin-2', // 지도 기반 POI 조회 화면

  // ── p17 · iM캐피탈 홈페이지 UI/UX 리뉴얼 2024.03~12 ──
  'p17_57_1626x893.png': 'im-capital-web-1', // 대출 상품 메인
  'p17_58_1619x889.png': 'im-capital-web-2', // 내게 맞는 대출 찾기

  // ── p21 · KT U 안심 알리미 2016 ──
  'p21_63_1578x978.png': 'kt-usafe-1',

  // ── p27 위 · DGB캐피탈 홈페이지 프로세스 개선(모바일) 2022.08~2023.01 ──
  // ⚠ 이 한 장에 CREDIT LOAN / AUTO FINANCE / STOCK LOAN 세 화면이 함께 들어 있다
  'p27_00_1671x1025.png': 'dgb-capital-m-1',

  // ── p27 아래 · MY르노코리아 / MY Renault 앱 2020~2022.09 ──
  'p27_01_720x1280.png': 'renault-my-1', // 내 차량 관리(원격 시동·공조)
  'p27_02_720x1280.png': 'renault-my-2', // 경로 안내 · 내 차로 전송
  'p27_03_720x1280.png': 'renault-my-3', // 정비 예약 이력

  // ── p28 위 · 현대자동차 운전연수 매칭 "운전결심" 2020~2022 ──
  'p28_28_497x884.png': 'hyundai-driving-1', // 학원 검색
  'p28_29_497x884.png': 'hyundai-driving-2', // 매칭 결과
  'p28_30_497x884.png': 'hyundai-driving-3', // 운전 TIP
  'p28_31_497x884.png': 'hyundai-driving-4', // 채팅 상담

  // ── p28 아래 · DCG 쇼핑몰 모바일 앱(기획) 2017 ──
  'p28_32_1324x736.png': 'dcg-shop-1',

  // ── p29 · CJ제일제당 THE KITCHEN(2014) / 마이카정보 자동차 이력관리(2015~16) ──
  // ⚠ 이 둘을 서로 바꿔 넣었던 적이 있다. p29_16 이 **음식**, p29_17 이 **차량**이다.
  'p29_16_1324x736.png': 'cj-thekitchen-1',
  'p29_17_1324x736.png': 'mycar-history-1',

  // ── p31 · KT RTK 정밀측위 / KT EAGLE-EYE 위치관리 플랫폼 ──
  // ⚠ 두 장 중 어느 쪽이 RTK 인지 쪽 안에서 구분이 안 된다 → 화면에서도 둘을 묶어 부른다
  'p31_00_2745x1713.png': 'kt-rtk-eagleeye-1',
  'p31_71_1036x666.png': 'kt-rtk-eagleeye-2',

  // ── p32 · KT SMART ZONE CAST / KT 위치정보 품질 관리 2019 ──
  'p32_33_2329x964.png': 'kt-smart-zone-cast-arch',
  'p32_34_1425x763.png': 'kt-loc-quality-arch',

  // ── p33 · 재난안전통신망 A사업구역 / KT 차세대 WPS ──
  'p33_27_1425x763.png': 'psnet-wps-1',
  'p33_90_1546x827.png': 'psnet-wps-2',

  // ── p35 · KT CBS 지오펜싱 OPEN API(2018) / KT 오픈인증플랫폼 OSCA ──
  'p35_00_1468x865.png': 'kt-geofencing-osca-1',
  'p35_79_1310x726.png': 'kt-geofencing-osca-2',
}

/** 굽지 않는 것과 그 이유 — 다음 사람이 "왜 빠졌지?" 하지 않게 남긴다 */
const SKIP_REASON = {
  'p14_51_1000x637.png': '빈 목업 액자',
  'p15_51_1000x637.png': '빈 목업 액자',
  'p17_56_990x637.png': '빈 목업 액자',
  'p21_08_1000x637.png': '빈 목업 액자',
  'p28_27_2067x890.png': '대부분 검정(반사 효과 조각)',
  'p37_00_3232x930.png': '연락처 쪽 지도',
  'p37_01_1348x659.png': '연락처 쪽 지도',
  '_titles.png': '쪽 제목 모음',
  // p11·p12 는 인증·특허·표창 증서다 — 이미 site/public/media/credentials/ 에 따로 들어가 있다
  'p11_03_456x697.png': '증서(credentials 에 있음)',
  'p11_04_456x697.png': '증서(credentials 에 있음)',
  'p11_05_454x696.png': '증서(credentials 에 있음)',
  'p12_00_455x696.png': '증서(credentials 에 있음)',
  'p12_01_454x695.png': '증서(credentials 에 있음)',
  'p12_02_456x698.png': '증서(credentials 에 있음)',
  'p12_03_546x836.png': '증서(credentials 에 있음)',
}

const MAX_W = 1600

/**
 * ⚠ **9쪽은 PDF 안에 이미지 객체가 없다.** 화면이 한 장으로 눌려 들어가 있어서 `추출이미지` 에
 *   아무것도 안 나왔고, 그래서 2026-08-07 까지 포트폴리오 20쪽 중 9쪽이 통째로 빠져 있었다
 *   (사용자가 "아직도 빠진 이미지가 있다"고 지적).
 *   → 쪽 렌더(`research/pages/pNN.png`, 2933x1650)에서 **화면 부분만 찾아서** 잘라 쓴다.
 *
 * ⚠ 자를 위치를 손으로 적지 않는다. 쪽마다 배치가 달라서 한 값으로 맞추면 어딘가는 왼쪽 설명 글이
 *   반쯤 걸려 들어온다(2026-08-07 에 실제로 그렇게 나왔고 사용자가 지적했다).
 *   대신 **밝은 화소가 가로로 넓게 이어지는 구간**을 찾는다 — 스크린샷은 밝고 넓고, 설명 판은 어둡다.
 * ⚠ `halves: true` 인 쪽은 위/아래에 사업이 하나씩 있어 반씩 나눠 찾는다.
 */
const PAGE_CROPS = [
  { page: 16, from: 1050, name: 'autoever-poi-admin' },     // 글로벌 POI Search Admin Portal 2024.01~06
  { page: 18, from: 1466, name: 'dgb-capital-web' },        // DGB캐피탈 Credit Loan 웹 2022.08~2023.01
  { page: 19, from: 1466, name: 'testworks-tfs' },          // 테스트웍스 TFS Management 2022
  { page: 20, from: 1466, name: 'hyundai-driving-web' },    // 현대차 운전결심 웹 2020~2022
  { page: 22, from: 1466, name: 'skt-zone-cast' },          // SKT Smart Zone Cast 2016
  { page: 23, from: 1466, name: 'kt-cbs-geofencing-web' },  // KT CBS 지오펜싱 캠페인/리포트 웹 2015
  { page: 25, from: 1120, name: 'autoever-mapgpt' },        // MAPGPT · 내비3D 픽업서비스 2024.09~2025.01
  { page: 26, from: 1050, name: 'im-capital-mobile' },      // iM캐피탈 모바일 리뉴얼 2024.03~12
  { page: 34, from: 0, name: 'kt-lbs-smart-rental', halves: true }, // KT 통합 LBS(위) / SMART RENTAL(아래)
]

/**
 * 지금 홈페이지(acrofuture.com)에서 받아 둔 것 — **소개서에 없는 자산이 여기 있다.**
 * ⚠ `research/기존홈페이지/` 는 손으로 받아 둔 원본이다. 이 표에 없는 파일은 아직 안 쓰는 것이다.
 */
const OLD_SITE = [
  { file: 'pc_ktbiz.svg', name: 'kt-szc-service' },

  // 블랙박스 영상 관리 웹 — IT서비스사업팀 사업이다(사용자 확인 2026-08-07).
  // ⚠ 고객사·기간은 아직 못 받았다. 받으면 works.ts 에 이력을 넣고 사례를 연결한다.
  { file: 'pc_blackvue.svg', name: 'blackvue-web' },
]

/**
 * 브랜드 폴더의 **가짜 SVG** 를 웹용으로 굽는다 (2026-08-11).
 *
 * ⚠⚠ `service_sol.svg` 는 **벡터가 아니다.** 안을 열어 보면 `<path>` 하나에 PNG 가 base64 로
 *   통째로 박혀 있는 껍데기다(540×540). 그래서 확대해도 안 또렷하고, 크기만 **205KB** 로
 *   이 사이트의 어떤 사진보다 컸다 — 회사 소개 캡처 중 제일 큰 것이 115KB 다.
 *   SVG 라는 확장자만 보고 "벡터니까 가볍겠지" 하고 넘어가면 못 찾는 종류의 무게다.
 * ⚠ 같은 폴더의 `solution_*.svg` 3종은 **진짜 벡터**(1KB)이고 CSS 마스크로 색만 빌려 쓴다.
 *   그건 건드리지 않는다 — 여기 목록에 있는 것만 굽는다.
 * ⚠ 원본보다 키우지 않는다. 540 짜리를 1400 으로 늘리면 용량만 늘고 더 흐려진다.
 */
const BRAND_RASTER = [{ file: 'service_sol.svg', name: 'service_sol' }]

/**
 * 사용자가 직접 넣어 주는 그림 — `research/추가이미지/` (파일 설명은 그 폴더의 README).
 *
 * ⚠ **파일이 없으면 조용히 건너뛴다.** 아직 안 들어온 그림 때문에 빌드가 깨지면 안 된다.
 * ⚠ 휴대폰 화면은 세로가 너무 길어 통째로 쓰면 카드 안에서 개미만 해진다.
 *   `ratio` 를 주면 **위에서부터** 그 비율(가로:세로)만큼 잘라 쓴다 — 머리와 첫 내용이 남아야
 *   무슨 화면인지 읽힌다(사용자 요청 2026-08-07).
 */
const DROP_IN = [
  { name: 'im-capital-web-live' },
  { name: 'ai-cc-1', ratio: 3 / 4 },
  { name: 'ai-cc-2', ratio: 3 / 4 },
  { name: 'ai-cc-3', ratio: 3 / 4 },
  { name: 'ai-cc-4', ratio: 3 / 4 },
  { name: 'ai-cc-5', ratio: 3 / 4 },
]

const PAGE_W = 2933
const PAGE_H = 1650

/**
 * 쪽에서 **화면(스크린샷) 부분의 경계 상자**를 찾는다.
 * 4배 축소해서 훑고, 밝은 화소 비율이 임계를 넘는 행·열의 범위를 취한다.
 */
async function findScreenBox(file, fromX, topY, botY) {
  const SC = 4
  const { data, info } = await sharp(file).greyscale().resize({ width: Math.round(PAGE_W / SC) }).raw()
    .toBuffer({ resolveWithObject: true })
  const W = info.width
  const x0 = Math.round(fromX / SC)
  const yA = Math.round(topY / SC)
  const yB = Math.min(info.height - 1, Math.round(botY / SC))
  const RW = W - x0
  const bright = (y, x) => data[y * W + x] > 232
  const TH = 0.25

  const rows = []
  for (let y = yA; y <= yB; y++) {
    let c = 0
    for (let x = x0; x < W; x++) if (bright(y, x)) c++
    rows.push(c / RW)
  }
  let t = rows.findIndex((v) => v > TH)
  let b = rows.length - 1 - [...rows].reverse().findIndex((v) => v > TH)
  if (t < 0) return { left: fromX, top: topY, width: PAGE_W - fromX, height: botY - topY }
  t += yA
  b += yA

  const cols = []
  for (let x = x0; x < W; x++) {
    let c = 0
    for (let y = t; y <= b; y++) if (bright(y, x)) c++
    cols.push(c / (b - t + 1))
  }
  let l = cols.findIndex((v) => v > TH)
  let r = cols.length - 1 - [...cols].reverse().findIndex((v) => v > TH)
  if (l < 0) { l = 0; r = cols.length - 1 }

  const pad = Math.round(0.03 * W)
  const L = Math.max(0, x0 + l - pad) * SC
  const T = Math.max(yA, t - pad) * SC
  const R = Math.min(W - 1, x0 + r + pad) * SC
  const B = Math.min(yB, b + pad) * SC
  return { left: L, top: T, width: R - L, height: B - T }
}

async function main() {
  // ⚠ 이름이 바뀐 적이 있어 옛 파일이 남으면 화면이 옛 그림을 계속 가리킨다 — 통째로 지우고 다시 굽는다
  await rm(OUT, { recursive: true, force: true })
  await mkdir(OUT, { recursive: true })

  const files = await readdir(SRC)
  let done = 0
  const unknown = []

  for (const f of files.sort()) {
    const name = MAP[f]
    if (!name) {
      if (!SKIP_REASON[f] && /^p\d/.test(f)) unknown.push(f)
      continue
    }
    const img = sharp(path.join(SRC, f))
    const meta = await img.metadata()
    const dst = path.join(OUT, `${name}.webp`)
    await img
      .flatten({ background: '#ffffff' })
      .resize(meta.width > MAX_W ? { width: MAX_W } : undefined)
      .webp({ quality: 82, effort: 5 })
      .toFile(dst)
    const { size } = await stat(dst)
    console.log(`${f} (${meta.width}x${meta.height}) -> ${name}.webp  ${(size / 1024).toFixed(0)}KB`)
    done++
  }

  // 쪽 렌더에서 화면만 잘라 쓰는 것들 — PDF 안에 이미지 객체가 없어 추출이 안 되는 9쪽
  for (const { page, from, name, halves } of PAGE_CROPS) {
    const src = path.join(ROOT, 'research', 'pages', `p${page}.png`)
    const ranges = halves
      ? [
          { suffix: '-1', top: 0, bot: PAGE_H / 2 },
          { suffix: '-2', top: PAGE_H / 2, bot: PAGE_H },
        ]
      : [{ suffix: '', top: 0, bot: PAGE_H }]

    for (const { suffix, top, bot } of ranges) {
      // 반씩 나눠 찾을 때는 그 반쪽 안에서 가장 넓은 밝은 덩어리를 찾는다(x 는 왼쪽 끝부터)
      const box = await findScreenBox(src, halves ? 0 : from, top, bot)
      const dst = path.join(OUT, `${name}${suffix}.webp`)
      await sharp(src)
        .extract(box)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 84, effort: 5 })
        .toFile(dst)
      const { size } = await stat(dst)
      console.log(`p${page}.png (화면 ${box.width}x${box.height}) -> ${name}${suffix}.webp  ${(size / 1024).toFixed(0)}KB`)
      done++
    }
  }

  // 지금 홈페이지(acrofuture.com)에서 받아 온 것 — 소개서에 없는 화면
  for (const { file, name } of OLD_SITE) {
    const dst = path.join(OUT, `${name}.webp`)
    await sharp(path.join(ROOT, 'research', '기존홈페이지', file), { density: 200 })
      .resize({ width: 1500, withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .webp({ quality: 82, effort: 5 })
      .toFile(dst)
    const { size } = await stat(dst)
    console.log(`기존홈페이지/${file} -> ${name}.webp  ${(size / 1024).toFixed(0)}KB`)
    done++
  }

  // 브랜드 폴더의 가짜 SVG(안이 PNG 인 껍데기) → webp
  const BRAND_OUT = path.join(ROOT, 'site', 'public', 'media', 'brand')
  for (const { file, name } of BRAND_RASTER) {
    const src = path.join(ROOT, 'research', '기존홈페이지', file)
    const dst = path.join(BRAND_OUT, `${name}.webp`)
    const before = (await stat(src)).size
    await sharp(src, { density: 200 })
      .resize({ width: 1100, withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .webp({ quality: 82, effort: 5 })
      .toFile(dst)
    const { size } = await stat(dst)
    console.log(
      `기존홈페이지/${file} -> brand/${name}.webp  ${(before / 1024).toFixed(0)}KB → ${(size / 1024).toFixed(0)}KB`,
    )
    // ⚠ 옛 SVG 를 남겨 두지 않는다. 남으면 205KB 가 계속 배포되고, 어느 것이 정본인지도 흐려진다
    await rm(path.join(BRAND_OUT, file), { force: true })
    done++
  }

  // 사용자가 넣어 준 그림 — 파일이 없으면 조용히 건너뛴다(빌드를 깨지 않는다)
  const dropDir = path.join(ROOT, 'research', '추가이미지')
  const dropped = await readdir(dropDir).catch(() => [])
  const waiting = []
  for (const { name, ratio } of DROP_IN) {
    const hit = dropped.find((f) => f.replace(/\.[^.]+$/, '') === name && /\.(png|jpe?g|webp)$/i.test(f))
    if (!hit) {
      waiting.push(name)
      continue
    }
    let img = sharp(path.join(dropDir, hit))
    const meta = await img.metadata()
    if (ratio) {
      // 위에서부터 잘라 원하는 비율을 만든다. 이미 그보다 납작하면 그냥 둔다.
      const want = Math.round(meta.width / ratio)
      if (want < meta.height) img = img.extract({ left: 0, top: 0, width: meta.width, height: want })
    }
    const dst = path.join(OUT, `${name}.webp`)
    await img
      .flatten({ background: '#ffffff' })
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(dst)
    const { size } = await stat(dst)
    console.log(`추가이미지/${hit} -> ${name}.webp  ${(size / 1024).toFixed(0)}KB`)
    done++
  }
  if (waiting.length) console.log(`\n  ⏳ 아직 안 들어온 그림: ${waiting.join(', ')}`)

  // ⚠ **구운 파일 목록을 코드로 내보낸다.**
  //   넣어 주기로 한 그림이 아직 없을 수 있는데, 화면이 그걸 모르면 깨진 이미지가 뜬다.
  //   `showcase.ts` 가 이 목록으로 걸러서 — 없는 그림은 조용히 빠지고, 넣는 순간 나타난다.
  const baked = (await readdir(OUT)).filter((f) => f.endsWith('.webp')).map((f) => f.replace('.webp', '')).sort()

  // ⚠⚠ **크기도 함께 내보낸다** (2026-08-11).
  //   `width`/`height` 없는 `<img>` 는 그림이 도착하는 순간 그 자리를 밀어내며 화면을 흔든다(CLS).
  //   정적 내보내기라 `next/image` 를 못 쓰는 것은 맞지만, **크기 속성은 next/image 와 무관하다** —
  //   그냥 HTML 속성이고, 굽는 김에 재면 공짜다. 손으로 적으면 그림을 바꿀 때마다 어긋난다.
  // ⚠ `works` 만이 아니라 **public/media 전체**를 훑는다. 증서(credentials)는 손으로 넣은 것이라
  //   이 스크립트가 굽지 않지만, 크기가 필요한 것은 똑같다. 나중에 폴더가 늘어도 저절로 따라온다.
  // ⚠ SVG 는 뺀다 — 벡터라 고유 크기가 뜻이 없고, 이 사이트에서는 마스크(색만 빌림)로 쓴다.
  const MEDIA_ROOT = path.join(ROOT, 'site', 'public', 'media')
  const sizes = []
  async function measure(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        await measure(full)
      } else if (/\.(webp|png|jpe?g|avif)$/i.test(e.name)) {
        const { width, height } = await sharp(full).metadata()
        const url = '/' + path.relative(path.join(ROOT, 'site', 'public'), full).split(path.sep).join('/')
        sizes.push([url, width, height])
      }
    }
  }
  await measure(MEDIA_ROOT)
  sizes.sort((a, b) => a[0].localeCompare(b[0]))

  await writeFile(
    path.join(ROOT, 'site', 'src', 'content', 'media-manifest.ts'),
    [
      '/** 자동 생성 — `node scripts/build-media.mjs` 가 씁니다. 손으로 고치지 마세요. */',
      '',
      '/** 아직 안 들어온 그림을 화면이 건너뛰게 하려고 둡니다. */',
      'export const BAKED_WORK_MEDIA = new Set<string>([',
      baked.map((n) => `  '${n}',`).join('\n'),
      '])',
      '',
      '/** 그림의 실제 크기 — `<img>` 에 width/height 를 박아 레이아웃이 안 흔들리게 합니다. */',
      'const MEDIA_SIZE: Record<string, readonly [number, number]> = {',
      sizes.map(([url, w, h]) => `  '${url}': [${w}, ${h}],`).join('\n'),
      '}',
      '',
      '/**',
      ' * `<img {...imgSize(src)} />` 로 쓴다.',
      ' *',
      ' * ⚠ 모르는 주소면 **아무것도 안 돌려준다.** 어림값을 넣으면 비율이 틀려서',
      ' *   `object-contain` 이 엉뚱한 여백을 만든다 — 없는 편이 낫다.',
      ' * ⚠ 화면에서 크기를 CSS 로 정하더라도 이 속성은 그대로 둔다. 브라우저는 이 둘의 **비율**만',
      ' *   써서 자리를 미리 잡고, 실제 크기는 CSS 가 이긴다.',
      ' */',
      'export function imgSize(src: string): { width: number; height: number } | Record<string, never> {',
      '  const hit = MEDIA_SIZE[src]',
      '  return hit ? { width: hit[0], height: hit[1] } : {}',
      '}',
      '',
    ].join('\n'),
    'utf8',
  )

  console.log(`\n구운 것 ${done}장`)
  for (const [f, why] of Object.entries(SKIP_REASON)) console.log(`  건너뜀 ${f} — ${why}`)
  if (unknown.length) console.log(`  ⚠ 표에도 제외 목록에도 없는 파일: ${unknown.join(', ')}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
