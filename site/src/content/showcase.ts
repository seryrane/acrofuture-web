/**
 * 실제 구축 화면 정본 — 회사 소개서 7절 포트폴리오(p13~p35)에서 뽑은 **실물 캡처**다.
 *
 * ⚠ **파일명이 아니라 쪽(`research/pages/pNN.png`)을 보고 붙인다.** 2026-08-07 에 p27·p28·p29
 *   세 쪽에서 짝이 어긋난 채로 배포됐다 — 르노 카드에 DGB 화면이, 마이카정보에 CJ 레시피 앱이 떴다.
 *   `scripts/build-media.mjs` 의 표와 여기가 **같은 근거**를 봐야 한다.
 * ⚠ 성과 수치("40% 단축")는 잰 자료가 없어 쓰지 않는다. 대신 **기간·고객사·기술스택**만 둔다.
 * ⚠ **문장은 방문자에게 하는 말이다.** "소개서 p17 에 실렸다", "고객사명이 원문에 없어 비웠다" 같은
 *   제작 과정 이야기를 화면에 내보내지 않는다 — 우리가 어떻게 만들었는지는 방문자의 관심사가 아니다.
 *   `source` 는 **코드에서만** 쓰는 출처 표시라 화면에 그리지 않는다(2026-08-07 사용자 지적).
 * ⚠ `work` 는 `works.ts` 의 slug 다. 사례 상세로 넘어가는 다리라 오타가 나면 링크가 죽는다.
 */
import { BAKED_WORK_MEDIA } from './media-manifest'
import type { WorkField } from './works'

export interface Shot {
  src: string
  /** 화면 설명 — 대체텍스트로도 쓰인다. "스크린샷" 같은 말은 쓰지 않는다(보이는 것을 말한다) */
  alt: string
  /**
   * web   = 생 브라우저 캡처라 창 틀을 씌운다
   * plain = 소개서에서 **이미 액자(폰 목업·구성도)에 담겨 나온 그림**. 틀을 또 씌우면 이중 액자가 된다
   * slide = **소개서 쪽에서 잘라 온 것**. 배경색이 있는 슬라이드 조각이라 흰 판에 올리면 겉돈다
   *
   * ⚠ 폰 목업이 들어간 그림에 우리 폰 틀을 덧씌워서 화면이 넘쳤던 적이 있다. kind 를 잘 고른다.
   */
  kind: 'web' | 'plain' | 'slide'
}

export interface ShowcaseCase {
  key: string
  field: WorkField
  client: string
  /**
   * 사례 고르는 줄에 쓰는 **짧은 이름**.
   * ⚠ 고객사명을 그대로 쓰면 안 된다 — 솔루션·측위는 다섯 건이 전부 KT 라 "KT KT KT" 가 된다.
   *   실제로 그렇게 나왔다. 사람이 서로 구분할 수 있는 말이어야 한다.
   */
  short: string
  title: string
  period: string
  desc: string
  stack?: string[]
  /** 근거 쪽 — **화면에 안 나온다.** 나중에 원본을 되짚을 때만 쓰는 값이다 */
  source: string
  /** works.ts 의 slug (있으면 사례 상세로 연결) */
  work?: string
  shots: Shot[]
}

const ALL_SHOWCASE: ShowcaseCase[] = [
  // ── 디지털금융 ────────────────────────────────────────────────────────
  {
    key: 'im-capital-ai-cc',
    field: 'finance',
    client: 'iM캐피탈(구 DGB캐피탈)',
    short: 'iM캐피탈 AI 고객센터',
    title: 'AI 고객센터 및 셀프서비스 구축',
    period: '2025.06 ~ 2026.01',
    // 고객사 제공 문구 그대로 (2026-08-07 갱신)
    desc: 'iM캐피탈 AI 고객센터는 Azure OpenAI(AOAI) 기반의 생성형 AI를 활용해 맞춤형 답변과 셀프서비스를 연계하여, 고객이 필요한 정보를 확인하고 관련 업무까지 직접 처리할 수 있는 지능형 금융 상담 서비스입니다.',
    stack: ['Azure OpenAI'],
    source: '고객 제공 화면',
    work: 'im-capital-ai-contact-center',
    /**
     * ⚠ 받은 다섯 장 중 **셋만 쓴다.**
     *   `ai-cc-4` 는 "최적의 답변을 생각하고 있어요!" 만 뜬 **빈 로딩 화면**이고,
     *   `ai-cc-5` 는 본문이 "첫번째 단락의 텍스트 영역 가이드입니다" 라는 **자리표시자**다.
     *   둘 다 파일은 구워 두었으니(`research/추가이미지/`) 실제 답변 화면이 생기면 바로 바꿔 끼운다.
     */
    shots: [
      { src: '/media/works/ai-cc-2.webp', alt: 'AI 고객센터 — 필요한 서비스를 고르는 화면', kind: 'plain' },
      { src: '/media/works/ai-cc-1.webp', alt: '셀프서비스 접수 내역 — 접수부터 완료까지 진행 상태', kind: 'plain' },
      { src: '/media/works/ai-cc-3.webp', alt: 'AI 검색 — 이렇게 물어보면 됩니다 안내', kind: 'plain' },
    ],
  },
  {
    key: 'im-capital-web',
    field: 'finance',
    client: 'iM캐피탈(구 DGB캐피탈)',
    short: 'iM캐피탈 웹',
    title: '홈페이지 프로세스 개선 및 UI/UX 리뉴얼',
    // 사용자 확인 2026-08-07 — 지금 올려 둔 화면은 2025년 개편 결과다
    period: '2025.04 ~ 2025.12',
    desc: '대출 상품을 고르고 신청하기까지의 절차를 다시 설계했습니다. 사용자 중심의 서비스 프로세스로 온·오프라인을 잇는 One Pass 경험을 제공하고, 금융 IT 의 디자인 흐름에 맞춰 브랜드 아이덴티티를 통일했습니다.',
    stack: ['전자정부프레임워크', 'HTML5', 'Java', 'jQuery', 'MySQL'],
    source: '소개서 p17',
    work: 'im-capital-homepage-renewal-2025',
    shots: [
      // ⚠ 맨 앞은 **지금 운영 중인 화면**이다. 소개서 캡처보다 이게 현재를 말한다.
      { src: '/media/works/im-capital-web-live.webp', alt: 'iM캐피탈 홈페이지 메인 화면', kind: 'web' },
      { src: '/media/works/im-capital-web-1.webp', alt: 'iM캐피탈 대출 상품 메인 화면', kind: 'web' },
      { src: '/media/works/im-capital-web-2.webp', alt: 'iM캐피탈 “내게 맞는 대출 찾기” 화면', kind: 'web' },
      { src: '/media/works/im-capital-mobile.webp', alt: 'iM캐피탈 모바일 웹 — 개편 전과 후', kind: 'slide' },
    ],
  },
  {
    key: 'dgb-capital-mobile',
    field: 'finance',
    client: 'DGB캐피탈',
    short: 'DGB캐피탈 웹·모바일',
    title: '홈페이지 프로세스 개선 구축 (WEB/APP)',
    period: '2022.08 ~ 2023.01',
    desc: '개인신용대출·자동차금융·스탁론을 하나의 모바일 흐름으로 묶었습니다. 상품마다 따로 놀던 신청 절차를 One Pass 로 통일하고, 브랜드 색과 일러스트를 상품별로 나눠 지금 무엇을 신청하는지가 한눈에 보이게 했습니다.',
    source: '소개서 p27',
    work: 'dgb-capital-homepage-process-improvement-2022',
    shots: [
      {
        src: '/media/works/dgb-capital-m-1.webp',
        alt: 'DGB캐피탈 모바일 — 개인신용대출 · 자동차금융 · 스탁론 진입 화면',
        kind: 'plain',
      },
      { src: '/media/works/dgb-capital-web.webp', alt: 'DGB캐피탈 Credit Loan 웹사이트 화면', kind: 'slide' },
    ],
  },

  // ── IT서비스 ──────────────────────────────────────────────────────────
  {
    key: 'autoever-cp-admin',
    field: 'mobility',
    client: '현대오토에버',
    short: '현대오토에버 글로벌 CP',
    title: '글로벌 컨텐츠 정보제공 사이트 구축',
    period: '2024.03 ~ 2024.12',
    desc: '전 세계 EV 충전소와 POI 데이터를 공급사별로 받아 검수하고 통계로 보는 관리자 웹입니다. 나라마다 데이터 품질이 달라서, 무엇이 얼마나 들어왔는지를 한 화면에서 비교할 수 있게 만드는 것이 핵심이었습니다.',
    stack: ['AWS', 'MSA', 'React', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Redis', 'Kafka'],
    source: '소개서 p14~15',
    work: 'hyundai-autoever-global-info-admin-web',
    shots: [
      { src: '/media/works/autoever-cp-admin-1.webp', alt: '지역별 EV 충전소 · POI 수집 통계 대시보드', kind: 'web' },
      { src: '/media/works/autoever-cp-admin-2.webp', alt: '지도 위에서 POI 를 조회하는 관리자 화면', kind: 'web' },
    ],
  },
  {
    key: 'autoever-poi-admin',
    field: 'mobility',
    client: '현대오토에버',
    short: '현대오토에버 POI Admin',
    title: '글로벌 POI Search Admin Portal 구축',
    period: '2024.01 ~ 2024.06',
    desc: '전 세계에서 들어온 POI 를 지도 위에서 검토하고 승인하는 관리자 웹입니다. 데이터를 모으는 쪽(글로벌 CP)과 짝이 되는 화면으로, 사람이 눈으로 확인해야 통과되는 관문을 맡습니다.',
    stack: ['AWS', 'MSA', 'React', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Redis', 'Kafka'],
    source: '소개서 p16',
    work: 'hyundai-autoever-global-cp-admin-portal',
    shots: [
      { src: '/media/works/autoever-poi-admin.webp', alt: '지도 위에서 POI 를 검토·승인하는 관리자 화면', kind: 'slide' },
    ],
  },
  {
    key: 'autoever-mapgpt',
    field: 'mobility',
    client: '현대오토에버',
    short: 'MAPGPT · 내비3D',
    title: 'MAPGPT 및 내비3D 시각화 선행개발 (픽업서비스)',
    period: '2024.09 ~ 2025.01',
    desc: '차 안에서 목적지를 말로 찾고, 3D 로 그린 지도 위에서 픽업까지 이어지는 흐름을 미리 만들어 본 선행 개발입니다. 상용 서비스가 아니라 "이렇게 되면 어떨까"를 먼저 만들어 보는 일이었습니다.',
    source: '소개서 p25',
    work: 'hyundai-autoever-mapgpt-navi3d-rd',
    shots: [
      { src: '/media/works/autoever-mapgpt.webp', alt: '내비3D 지도 위 픽업 주문·수령 흐름 시안', kind: 'slide' },
    ],
  },
  {
    key: 'testworks-tfs',
    field: 'mobility',
    client: '테스트웍스(TestWorks)',
    short: '테스트웍스 TFS',
    title: 'TFS Management Web Site 개발',
    period: '2022',
    desc: '테스트 장비가 어떻게 물려 있고 지금 무엇이 도는지를 한 화면에서 보는 관리 웹입니다. 장비 구조를 도해로 그려 두어, 어디가 막혔는지 목록이 아니라 그림으로 찾습니다.',
    source: '소개서 p19',
    work: 'testworks-tfs-management-site',
    shots: [
      { src: '/media/works/testworks-tfs.webp', alt: 'TFS 테스트 장비 구조도 관리 대시보드', kind: 'slide' },
    ],
  },
  {
    key: 'renault-my',
    field: 'mobility',
    client: '르노코리아자동차',
    short: 'MY르노코리아',
    title: 'MY르노코리아 · MY Renault 모바일 앱 통합 운영',
    period: '2020 ~ 2022.09',
    desc: '원격 시동·공조부터 경로를 차로 보내는 기능, 정비 예약까지 한 앱에서 다룹니다. 르노와 르노삼성 앱을 따로 굴리지 않고 하나로 합쳤습니다.',
    source: '소개서 p27',
    work: 'renault-korea-app-operation',
    shots: [
      { src: '/media/works/renault-my-1.webp', alt: '내 차량 관리 — 원격 시동 · 공조 · 배터리 상태', kind: 'plain' },
      { src: '/media/works/renault-my-2.webp', alt: '경로를 찾아 차로 보내는 화면', kind: 'plain' },
      { src: '/media/works/renault-my-3.webp', alt: '정비 예약과 이력 조회 화면', kind: 'plain' },
    ],
  },
  {
    key: 'hyundai-driving',
    field: 'mobility',
    client: '현대자동차',
    short: '현대차 운전결심',
    title: '운전연수 매칭 서비스 "운전결심" 개발 및 유지보수',
    period: '2020 ~ 2022',
    desc: '경찰청에 등록된 학원만 연결해 불법 운전연수를 걸러냅니다. 회원가입 없이 주변 학원과 바로 매칭되고, 운전 상식과 채팅 상담까지 앱 안에서 해결됩니다. 구축 이후 3년간 운영과 고도화를 이어 왔습니다.',
    source: '소개서 p20 · p28',
    work: 'hyundai-motor-driving-lesson-matching-operation-2021',
    shots: [
      { src: '/media/works/hyundai-driving-1.webp', alt: '경찰청 등록 학원 검색 화면', kind: 'plain' },
      { src: '/media/works/hyundai-driving-2.webp', alt: '회원가입 없이 매칭된 학원 목록', kind: 'plain' },
      { src: '/media/works/hyundai-driving-3.webp', alt: '차량 구매 · 초보운전 TIP 화면', kind: 'plain' },
      { src: '/media/works/hyundai-driving-4.webp', alt: '학원과 바로 잇는 채팅 상담 화면', kind: 'plain' },
      { src: '/media/works/hyundai-driving-web.webp', alt: '운전결심 웹 — 서비스 소개 화면', kind: 'slide' },
    ],
  },
  {
    key: 'blackvue-web',
    field: 'mobility',
    client: '',
    short: '블랙박스 영상 관리',
    title: '블랙박스 영상 관리 웹',
    period: '',
    desc: '차량 블랙박스가 찍은 영상을 웹에서 바로 돌려 보고, 그 순간의 위치를 지도 위에서 함께 확인합니다. 사고가 났을 때 "언제 어디서"를 영상과 지도로 한 번에 짚을 수 있게 만든 화면입니다.',
    source: '기존 홈페이지',
    shots: [{ src: '/media/works/blackvue-web.webp', alt: '블랙박스 영상 재생과 주행 경로 지도', kind: 'web' }],
  },
  {
    key: 'mycar-history',
    field: 'mobility',
    client: '',
    short: '마이카정보',
    title: '마이카정보 — 자동차 토털 이력관리 시스템',
    period: '2015.07 ~ 2016.01',
    desc: '차량번호 하나로 사고·정비·소유 이력을 한 번에 조회하는 서비스입니다. 흩어져 있던 차량 정보를 모아 중고차 거래와 정비 이력 확인에 바로 활용할 수 있게 했습니다.',
    source: '소개서 p29',
    work: 'vehicle-total-history-management-system',
    shots: [{ src: '/media/works/mycar-history-1.webp', alt: '차량 조회 · 지도 · 이력 목록 화면', kind: 'plain' }],
  },

  // ── 솔루션 · 측위 ─────────────────────────────────────────────────────
  {
    key: 'kt-rtk',
    field: 'lbs',
    client: 'KT',
    short: 'KT RTK · EAGLE-EYE',
    title: 'RTK 정밀측위 서비스 플랫폼 · EAGLE-EYE 위치관리 플랫폼',
    period: '2022 ~',
    desc: 'GPS 오차를 센티미터 단위까지 줄이는 보정 신호(RTK)를 전국에 뿌리는 플랫폼과, 그 위에서 위치를 관리하는 엔진입니다. 측위는 재는 일 자체가 서비스라, 정확도만큼 끊기지 않는 것이 중요합니다.',
    source: '소개서 p31',
    work: 'kt-rtk-precision-positioning-platform',
    shots: [
      // ⚠ 쪽 안에서 두 플랫폼이 나란히 실려 있고 어느 그림이 어느 쪽인지 표기가 없다 → 묶어서 부른다
      { src: '/media/works/kt-rtk-eagleeye-1.webp', alt: 'RTK 정밀측위 · EAGLE-EYE 플랫폼 구성도 (1/2)', kind: 'plain' },
      { src: '/media/works/kt-rtk-eagleeye-2.webp', alt: 'RTK 정밀측위 · EAGLE-EYE 플랫폼 구성도 (2/2)', kind: 'plain' },
    ],
  },
  {
    key: 'kt-szc',
    field: 'lbs',
    client: 'KT',
    short: 'KT SMART ZONE CAST',
    title: 'SMART ZONE CAST · 위치정보 품질 관리 시스템',
    period: '2019.03 ~ 2019.06 (품질관리)',
    desc: '정해진 구역에 들어온 단말에만 메시지를 보내는 위치기반 메시징 플랫폼입니다. 국립공원공단·지자체 등 여러 기관과 연계해 운영합니다. 옆의 품질 관리 시스템은 이 위치값이 얼마나 맞는지를 계속 재는 쪽입니다.',
    source: '소개서 p32',
    work: 'kt-location-info-quality-management-system',
    shots: [
      { src: '/media/works/kt-smart-zone-cast-arch.webp', alt: 'SMART ZONE CAST 위치기반 메시징 구성도', kind: 'plain' },
      { src: '/media/works/kt-loc-quality-arch.webp', alt: '위치정보 품질 관리 시스템 구성도', kind: 'plain' },
      { src: '/media/works/kt-szc-service.webp', alt: 'kt Smart Zone Cast 서비스 화면', kind: 'slide' },
    ],
  },
  {
    key: 'psnet-a',
    field: 'lbs',
    client: 'KT (재난안전통신망)',
    short: '재난안전통신망 · WPS',
    title: '재난안전통신망 A사업구역 LBS 솔루션 · 차세대 WPS 플랫폼',
    period: '구축 2018~2020 · 운영 2019~2025',
    desc: '경찰·소방·해경·군·의료 등 8대 분야 333개 기관, 24만 명이 쓰는 재난안전통신망의 위치 기능을 맡았습니다. 3년을 지어 7년째 운영 중입니다 — 재난망은 평소에 조용하다가 필요한 순간에만 확인되는 시스템이라, 오래 지키는 일이 곧 실력입니다.',
    source: '소개서 p33',
    work: 'disaster-safety-network-zone-a-lbs-solution',
    shots: [
      { src: '/media/works/psnet-wps-1.webp', alt: '재난안전통신망 LBS · 차세대 WPS 구성도 (1/2)', kind: 'plain' },
      { src: '/media/works/psnet-wps-2.webp', alt: '재난안전통신망 LBS · 차세대 WPS 구성도 (2/2)', kind: 'plain' },
    ],
  },
  {
    key: 'kt-geofencing',
    field: 'lbs',
    client: 'KT',
    short: 'KT 지오펜싱 · OSCA',
    title: 'CBS 지오펜싱 플랫폼 고도화(OPEN API) · 오픈인증플랫폼(OSCA)',
    period: '2018',
    desc: '지오펜싱 기능을 바깥에서도 쓸 수 있게 OPEN API 로 열었고, 소셜 로그인(Facebook·Google·kakao·NAVER)을 묶는 인증 플랫폼을 함께 구축했습니다.',
    source: '소개서 p35',
    work: 'cbs-geofencing-platform-upgrade',
    shots: [
      { src: '/media/works/kt-geofencing-osca-1.webp', alt: 'CBS 지오펜싱 OPEN API · OSCA 구성도 (1/2)', kind: 'plain' },
      { src: '/media/works/kt-geofencing-osca-2.webp', alt: 'CBS 지오펜싱 OPEN API · OSCA 구성도 (2/2)', kind: 'plain' },
    ],
  },
  {
    key: 'skt-zone-cast',
    field: 'lbs',
    client: 'SKT',
    short: 'SKT Smart Zone Cast',
    title: 'Smart [Zone Cast] 서비스 플랫폼 구축',
    period: '2016',
    desc: '지역을 정해 두고 그 안에 있는 사람에게만 광고를 보내는 캠페인 관리 웹입니다. 같은 계열의 플랫폼을 KT 와 SKT 양쪽에 지었습니다 — 통신사 두 곳이 같은 문제를 각자 풀게 했다는 뜻입니다.',
    source: '소개서 p22',
    work: 'skt-cbs-location-geofencing-platform',
    shots: [
      { src: '/media/works/skt-zone-cast.webp', alt: 'SKT Smart Zone Cast 지역 기반 광고 캠페인 관리 웹', kind: 'slide' },
    ],
  },
  {
    key: 'kt-cbs-web',
    field: 'lbs',
    client: 'KT',
    short: 'KT 지오펜싱 캠페인 웹',
    title: 'CBS 활용 위치기반 지오펜싱 서비스 플랫폼 구축',
    period: '2015 ~',
    desc: '구역을 그리고, 보내고, 얼마나 닿았는지 보는 데까지를 한 화면에서 합니다. 2018년 OPEN API 고도화의 바탕이 된 첫 플랫폼입니다.',
    source: '소개서 p23',
    work: 'kt-cbs-location-geofencing-platform',
    shots: [
      { src: '/media/works/kt-cbs-geofencing-web.webp', alt: 'Smart Zone Cast 캠페인 등록·발송 리포트 관리 웹', kind: 'slide' },
    ],
  },
  {
    key: 'kt-lbs-smart-rental',
    field: 'lbs',
    client: 'KT / 자사 솔루션',
    short: 'KT 통합 LBS · SMART RENTAL',
    title: 'KT 통합 LBS 유지보수 · SMART RENTAL 관리 솔루션 구축 및 운영',
    period: 'LBS 2017~ · 렌탈 2015~',
    desc: '통신사에 흩어져 있던 LBS 시스템을 하나로 묶어 운영하고 있습니다. 함께 제공하는 SMART RENTAL 은 아크로퓨처가 직접 개발해 운영하는 렌탈 자산 관리 솔루션으로, 대여 현황과 매출을 한 화면에서 관리합니다.',
    source: '소개서 p34',
    work: 'smart-rental-solution',
    shots: [
      { src: '/media/works/kt-lbs-smart-rental-1.webp', alt: 'KT 통합 LBS 플랫폼 구성도', kind: 'slide' },
      { src: '/media/works/kt-lbs-smart-rental-2.webp', alt: 'SMART RENTAL 관리자 대시보드', kind: 'slide' },
    ],
  },
  {
    key: 'kt-usafe',
    field: 'lbs',
    client: 'KT',
    short: 'KT U 안심 알리미',
    title: 'U 안심 알리미 서비스 개발 및 유지보수',
    period: '2016',
    desc: '아이가 지금 어디 있는지 보호자에게 알려 주는 서비스입니다. 위치를 재는 기술이 사람에게 닿는 가장 이른 형태였습니다.',
    source: '소개서 p21',
    shots: [{ src: '/media/works/kt-usafe-1.webp', alt: 'KT U 안심 알리미 서비스 웹 화면', kind: 'web' }],
  },

  // ── 그 밖 ─────────────────────────────────────────────────────────────
  {
    key: 'cj-thekitchen',
    field: 'etc',
    client: 'CJ제일제당',
    short: 'CJ THE KITCHEN',
    title: '"THE KITCHEN" 스마트폰 어플리케이션 개발',
    period: '2014',
    desc: '오늘 무엇을 해 먹을지 골라 주는 레시피 앱입니다. 측위·금융과는 결이 다르지만, 대형 소비재 브랜드의 소비자 앱을 맡았던 이력입니다.',
    source: '소개서 p29',
    work: 'cj-cheiljedang-the-kitchen-app',
    shots: [{ src: '/media/works/cj-thekitchen-1.webp', alt: 'THE KITCHEN 오늘의 레시피 · 추천 화면', kind: 'plain' }],
  },
  {
    key: 'dcg-shop',
    field: 'etc',
    client: 'DCG',
    short: 'DCG 쇼핑몰',
    title: '쇼핑몰 모바일 앱 (기획)',
    period: '2017',
    desc: '브랜드·디자이너·로드샵·백화점을 한 앱에서 훑는 종합 쇼핑몰입니다. 개발이 아니라 기획 단계의 산출물입니다.',
    source: '소개서 p28',
    shots: [{ src: '/media/works/dcg-shop-1.webp', alt: 'DCG world 앱 — 상품 목록 · 카테고리 검색 화면', kind: 'plain' }],
  },
]

/**
 * ⚠ **아직 안 들어온 그림은 화면에서 뺀다.**
 *   사용자가 넣어 주기로 한 캡처를 미리 적어 둘 수 있어야 하는데, 파일이 없으면 깨진 이미지가 뜬다.
 *   `media-manifest.ts`(굽는 스크립트가 씀)로 걸러서 **넣는 순간 저절로 나타나게** 한다.
 */
function baked(src: string): boolean {
  return BAKED_WORK_MEDIA.has(src.replace('/media/works/', '').replace('.webp', ''))
}

export const SHOWCASE: ShowcaseCase[] = ALL_SHOWCASE.map((c) => ({
  ...c,
  shots: c.shots.filter((s) => baked(s.src)),
})).filter((c) => c.shots.length > 0)

/** 캡처 장수 — 화면이 "N장" 이라고 말할 때 여기서 센다 */
export const SHOWCASE_SHOT_COUNT = SHOWCASE.reduce((n, c) => n + c.shots.length, 0)
