// 화면의 모든 문구·숫자·이름(3판). 출처는 docs/FACTS.md 하나뿐이며, 문구는 docs/STORYBOARD.md 의 따옴표 문구 그대로다.
// 문구를 고칠 때는 이 파일만 수정한다. 화면 문구에는 줄표(긴 대시, 짧은 대시)를 쓰지 않는다.
// 숫자+단위, 등급+인원, 고유 복합어는 줄바꿈 없는 공백(NB)으로 잇는다(DESIGN 4.3).

const NB = " ";
/** 줄바꿈 금지 결합자(보이지 않음): 가운뎃점 앞뒤에서 제목이 끊기지 않게 */
const WJ = "⁠";
const nb = (s: string) => s.replace(/ /g, NB);

export type Field = "lbs" | "fin" | "mob" | "etc";

/** 사업 기록 한 줄(연도 + 사이트 표기 그대로의 사업 제목) */
export type Rec = { y: string; t: string };

export const company = {
  name: "(주)아크로퓨처",
  wordmark: "acroFuture",
  ceo: "김철우",
  bizNo: "211-88-29376",
  founded: "2009. 07. 20",
  foundedIso: "2009-07-20",
  tagline: "SINCE 2009 · Mobile Future in Reality",
  copyright: "© 2026 (주)아크로퓨처",
} as const;

export const contact = {
  email: "help@acrofuture.com",
  // 제목 "프로젝트 문의"를 인코딩한 mailto
  mailto:
    "mailto:help@acrofuture.com?subject=%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EB%AC%B8%EC%9D%98",
  phone: "02-6925-1234",
  phoneHref: "tel:+82269251234",
  fax: "02-6280-2134",
  postal: "06258",
  address: `(06258) 서울 강남구 도곡로2길${NB}14 규원빌딩${NB}3F`,
  portalLabel: "portal.acrofuture.com",
  portalHref: "https://portal.acrofuture.com",
} as const;

// 바깥 서비스 링크(F 연락처): 업무 포털 · A-Flow · AI Office. 헤더 · 메뉴 시트 · 문의 · 바닥글이 같은 목록을 쓴다.
// A-Flow · AI Office 는 로그인 전 공개 소개(/intro · /welcome)로 넘어가는 첫 주소(2026-11-10 확인).
export const serviceLinks = [
  { id: "portal", name: "업무 포털", host: contact.portalLabel, href: contact.portalHref },
  { id: "aflow", name: "A-Flow", host: "studio.stock-autotrade.com", href: "https://studio.stock-autotrade.com" },
  { id: "aioffice", name: "AI Office", host: "aioffice.stock-autotrade.com", href: "https://aioffice.stock-autotrade.com" },
] as const;

export const cta = {
  primary: "프로젝트 문의",
  portal: "업무 포털",
  newWindow: "(새 창)",
  home: "처음으로",
  wordmarkLabel: "acroFuture, 처음으로",
  toLight: "밝은 화면으로",
  toDeep: "어두운 화면으로",
  menuOpen: "메뉴 열기",
  menuClose: "메뉴 닫기",
  menu: "메뉴",
  skip: "본문으로 건너뛰기",
} as const;

/** 헤더 내비 6개(4.1 정보 구조, V4-PLAN §11.2). 현재 표시는 html[data-chapter] */
export const nav = [
  { href: "#company", id: "company", label: "회사" },
  { href: "#business", id: "business", label: "사업" },
  { href: "#ai", id: "ai", label: "AI 활용" },
  { href: "#solutions", id: "solutions", label: "솔루션" },
  { href: "#record", id: "record", label: "사례" },
  { href: "#contact", id: "contact", label: "문의" },
] as const;

/** 챕터 레일 이름(aria-label·hover 표시) */
export const chapterNames = {
  top: "원점",
  lbs: "LBS·측위",
  history: "연혁",
  finance: "디지털금융",
  mobility: "IT서비스·모빌리티",
  solutions: "솔루션",
  process: "일하는 과정",
  record: "실적과 문의",
} as const;

export type ChapterId = keyof typeof chapterNames;

/** 캡션 4종(DESIGN 7.8) */
export const captions = {
  screen: "화면 예시. 실제 운영 수치가 아닙니다.",
  client: "화면 예시(도식). 실제 고객사 화면이 아닙니다.",
  service: "화면 예시(도식). 실제 서비스 화면이 아닙니다.",
  screenChip: "화면 예시",
  fieldBook: "사업 기록",
} as const;

/* ───────── 1장 원점 ───────── */
export const origin = {
  titleLines: ["위치를 재는 기술에서", "금융과 모빌리티까지"],
  lead: "2009년 측위에서 시작해, 지금은 은행·보험·캐피탈의 디지털 채널과 차량 내비게이션 콘텐츠를 만들고 운영합니다.",
  secondary: "17년의 경로 보기",
  captionOrigin: `원점 2009.${NB}07.${NB}20`,
  captionField: "LBS·측위",
  orbitTitle: "여러 신호를 모아 위치 하나를 잽니다",
  orbitBody: `복합측위 AI/ML, RTK${NB}정밀측위, 다중${NB}주파수${NB}측위(특허 제10-2226683호).`,
} as const;

/** 1.1 표제란(사업 영역 바로 가기, DESIGN 7.9) */
export const titleBlock = {
  label: "사업 영역 바로 가기",
  cells: [
    { href: "#lbs", field: "lbs", name: "위치 기반 서비스(LBS)·측위", meta: `2009년부터 · 사업${NB}52건` },
    { href: "#finance", field: "fin", name: "디지털금융", meta: `2012년부터 · 사업${NB}24건` },
    { href: "#mobility", field: "mob", name: "IT서비스·모빌리티", meta: `2012년부터 · 사업${NB}19건` },
    { href: "#solutions", field: "etc", name: "자체 솔루션", meta: `4종 · 등록${NB}특허${NB}2건` },
  ],
} as const satisfies { label: string; cells: readonly { href: string; field: Field; name: string; meta: string }[] };

/* ───────── 2장 LBS·측위 ───────── */
/**
 * 재난안전통신망 이용 기관·인원(FACTS 추가 수집 2, 재난안전통신망 상세 원문).
 * 값을 null 로 두면 2.5 본문과 중간 수치 사본에서 이 칸이 통째로 빠진다.
 */
export const disasterNet: { orgs: string | null; users: string | null } = {
  orgs: `333개${NB}기관`,
  users: `24만${NB}명`,
};

const disasterUsers =
  disasterNet.orgs && disasterNet.users
    ? `${nb("8대 분야")} ${disasterNet.orgs}, ${disasterNet.users}이`
    : `${nb("8대 분야")}가`;

export const lbs = {
  title: "LBS·측위, 2009년부터",
  meta: `사업${NB}52건`,
  body: "통신사 측위 플랫폼과 국책과제를 수행합니다. 위치를 재는 기술에서 시작해, 그 위치로 무엇을 할지까지 만듭니다.",
  rec21: [
    { y: "2009", t: "KT 지하철 측위 시스템 구축" },
    { y: "2010", t: "KT WiFi 측위 시스템 구축" },
    { y: "2012", t: "KT 유무선 통합 LBS 플랫폼 구축" },
  ] satisfies Rec[],

  hybridTitle: "여러 신호를 한 위치로 모읍니다",
  hybridBody:
    "여러 신호를 함께 써서 위치 하나를 계산하는 복합측위 엔진을 고도화해 왔습니다. KT 복합측위엔진(EAGLE-EYE) 고도화(2022)에 이어 AI/ML 기반 고도화(2023)를 수행했습니다.",
  hybridCaption: "여러 신호를 한 위치로 모으는 복합측위(도식)",
  rec22: [
    { y: "2020", t: "KT 복합측위엔진 고도화" },
    { y: "2021", t: `특허 등록 제10-2226683호 다중${NB}주파수${NB}측위` },
    { y: "2022", t: "KT 복합측위엔진(EAGLE-EYE) 고도화" },
    { y: "2023", t: "KT 복합측위엔진 AI/ML 기반 고도화" },
  ] satisfies Rec[],

  rtkTitle: "미터에서 센티미터로",
  rtkBody: `GPS 오차를 ${nb("센티미터 단위")}까지 줄이는 보정 신호(RTK)를 전국에 보내는 플랫폼과, 그 위에서 위치를 관리하는 엔진을 구축했습니다(KT, 2022). 측위는 재는 일 자체가 서비스라, 정확도만큼 끊기지 않는 것이 중요합니다.`,
  rtkLabels: { meter: `오차: 미터${NB}단위`, cm: `오차: 센티미터${NB}단위`, signal: `RTK${NB}보정${NB}신호`, sat: "위성", base: "기준국" },
  rtkCaption: "보정 신호로 오차 원이 줄어드는 과정(도식)",
  rec23: [
    { y: "2019", t: "KT 정밀 위성 보정 플랫폼 용역 개발" },
    { y: "2019", t: "KT 위치정보 품질 관리 시스템 구축" },
    { y: "2022", t: "KT RTK 정밀측위 서비스 플랫폼 구축" },
  ] satisfies Rec[],

  heightTitle: "높이까지 재는 3차원 측위",
  heightBody: `긴급구조용 ${nb("3차원 정밀측위")}를 국책과제로 개발했고(2021), KT 상용 플랫폼으로 구축했습니다(2022). ETRI의 단말용 공통 측위 에이전트 단말 탑재와 실증시험도 수행했습니다(2022).`,
  heightLabels: { plane: `평면${NB}위치`, height: "높이" },
  heightCaption: "평면 위치에 높이를 더하는 3차원 측위(도식)",
  rec24: [
    { y: "2020", t: "국책과제(긴급구조용지능형정밀측위기술개발)" },
    { y: "2021", t: `(국책과제) 긴급구조용 3차원${NB}정밀측위` },
    { y: "2022", t: `KT 긴급구조용 3차원${NB}정밀측위 상용 플랫폼 구축` },
    { y: "2022", t: "ETRI 단말용 공통 측위 에이전트 단말 탑재 및 실증시험" },
  ] satisfies Rec[],

  zoneTitle: "구역에 알리고, 재난망을 지킵니다",
  zoneBody: `지도 위에 지정한 구역 안의 단말에만 메시지를 보내는 위치기반 지오펜싱 플랫폼을 KT(2015~)와 SKT(2016)에 구축했고, 위치 기반 재난안전문자 서비스를 개발했습니다(2022). 경찰·소방·해경·군·의료 등 ${disasterUsers} 쓰는 재난안전통신망의 위치 기능은 ${nb("3년")}을 지어 ${nb("7년째 운영")}합니다.`,
  zoneCaption: "국내 지도에서 한 지역으로 들어가, 구역 안 단말에만 알림이 닿는 과정(도식)",
  rec25: [
    { y: "2015", t: "KT CBS 위치기반지오펜싱 플랫폼 구축 및 유지보수(진행 중)" },
    { y: "2016", t: "SKT CBS 위치기반지오펜싱 플랫폼 구축" },
    { y: "2018", t: "재난안전통신망 A사업구역 LBS 솔루션 납품 및 유지보수" },
    { y: "2022", t: "KT Smart Zone Cast(위치 기반 재난안전문자 서비스) 개발" },
  ] satisfies Rec[],

  seventeenTitle: "17년째 이어서",
  seventeenBody: `위치를 재는 기술에서 금융과 모빌리티까지. 2009.${NB}07.${NB}20 설립.`,
  giant: "17",
} as const;

/* ───────── 3장 연혁 ───────── */
export type Station = {
  id: string;
  label: string;
  iso: string;
  /** 소수 연도(2009.54 = 2009년 7월) */
  year: number;
  kind?: string;
  name: string;
  no?: string;
};

export const route = {
  title: "17년 동안 이어 온 경로",
  captionScaled: "역 사이 간격은 실제 햇수에 비례합니다.",
  captionOrdered: "역 순서는 시간순입니다.",
  branches: { upper: "디지털금융", middle: "LBS·측위", lower: "IT서비스" },
  counts: [
    { field: "fin", label: "디지털금융", n: 24 },
    { field: "lbs", label: "LBS·측위", n: 52 },
    { field: "mob", label: "IT서비스", n: 19 },
  ] as const,
  countsTitle: "갈래별 사업 건수",
  countsCaption: "갈래 옆 숫자는 분야별 사업 건수입니다.",
  stations: [
    { id: "s2009", label: `2009.${NB}07`, iso: "2009-07", year: 2009.54, name: "설립. 위치 기반 서비스(LBS)·측위 사업 시작" },
    { id: "s2012", label: "2012", iso: "2012", year: 2012, name: "디지털금융, IT서비스 사업 시작" },
    {
      id: "s2016",
      label: `2016.${NB}11`,
      iso: "2016-11",
      year: 2016.84,
      kind: "특허 등록",
      name: `위치기반${NB}푸쉬형${NB}마케팅`,
      no: "제10-1674367호",
    },
    {
      id: "s2021",
      label: `2021.${NB}03`,
      iso: "2021-03",
      year: 2021.17,
      kind: "특허 등록",
      name: `다중${NB}주파수${NB}측위`,
      no: "제10-2226683호",
    },
    { id: "s2025", label: "2025", iso: "2025", year: 2025, kind: "수상", name: `KT 우수협력상(AI/IT${NB}분야)` },
    { id: "s2026", label: "2026", iso: "2026", year: 2026, name: "17년째 이어서" },
  ] satisfies Station[],
  /** 연도별 대표 사업(FACTS 사업 사례 목록의 사이트 표기, 분야 색). d = 위치용 소수 연도, y = 표시 연도 */
  projectsTitle: "연도별 대표 사업",
  projectsCaption: "사업 사례 103건 가운데 해마다 대표 사업입니다. 색은 분야입니다.",
  projects: [
    { d: 2009.62, y: "2009", f: "lbs", t: "ETRI U서비스를 위한 아이폰 클라이언트 시제품 제작" },
    { d: 2009.92, y: "2009", f: "lbs", t: "KT 지하철 측위 시스템 구축" },
    { d: 2010.45, y: "2010", f: "lbs", t: "KT WiFi 측위 시스템 구축" },
    { d: 2010.8, y: "2010", f: "lbs", t: "KT 그룹GIS 플랫폼 구축" },
    { d: 2011.3, y: "2011", f: "lbs", t: "KT 위치정보자기제어시스템 구축" },
    { d: 2011.7, y: "2011", f: "etc", t: "사이버 로지텍 항만 물류 자동화 시스템 개발" },
    { d: 2012.05, y: "2012", f: "mob", t: "현대 MnSOFT 스마트링크 센터(내비게이션센터) 시스템 개발" },
    { d: 2012.6, y: "2012", f: "fin", t: "한국증권전산 모바일오피스 개발" },
    { d: 2012.95, y: "2012", f: "lbs", t: "KT 유무선 통합 LBS 플랫폼 구축" },
    { d: 2013.3, y: "2013", f: "lbs", t: "KT 위치정보 자기제어 유지보수(진행 중)" },
    { d: 2013.7, y: "2013", f: "lbs", t: "KT WPS 개발 유지보수" },
    { d: 2015.15, y: "2015", f: "lbs", t: "KT CBS 위치기반지오펜싱 플랫폼 구축 및 유지보수(진행 중)" },
    { d: 2015.5, y: "2015", f: "etc", t: "스마트 렌탈 솔루션 구축 및 운영(진행 중)" },
    { d: 2015.8, y: "2015", f: "lbs", t: "U안심알림이 서비스 개편" },
    { d: 2016.1, y: "2016", f: "fin", t: "에이스생명 모바일 영업지원시스템 구축" },
    { d: 2016.5, y: "2016", f: "lbs", t: "SKT CBS 위치기반지오펜싱 플랫폼 구축" },
    { d: 2017.3, y: "2017", f: "lbs", t: "KT LBS 통합 유지보수(진행 중)" },
    { d: 2017.72, y: "2017", f: "fin", t: "DGB캐피탈 PC/모바일 홈페이지 구축" },
    { d: 2018.3, y: "2018", f: "lbs", t: "CBS 지오펜싱 플랫폼 고도화" },
    { d: 2018.6, y: "2018", f: "fin", t: "KB국민은행 가계여신 Digitalization 구축 개발" },
    { d: 2018.95, y: "2018", f: "lbs", t: "재난안전통신망 A사업구역 LBS 솔루션 납품 및 유지보수" },
    { d: 2019.2, y: "2019", f: "lbs", t: "KT 위치정보 품질 관리 시스템 구축" },
    { d: 2019.6, y: "2019", f: "fin", t: "DGB캐피탈 모바일 채널 기능개선" },
    { d: 2020.2, y: "2020", f: "lbs", t: "KT 복합측위엔진 고도화" },
    { d: 2020.5, y: "2020", f: "mob", t: "현대자동차 운전연수 매칭 서비스 플랫폼 개발 구축" },
    { d: 2020.8, y: "2020", f: "fin", t: "DGB생명 IT시스템" },
    { d: 2021.2, y: "2021", f: "lbs", t: "(국책과제) 긴급구조용 3차원 정밀측위" },
    { d: 2021.8, y: "2021", f: "fin", t: "KB카드 마이데이터 구축(기획 부문)" },
    { d: 2022.28, y: "2022", f: "lbs", t: "KT RTK 정밀측위 서비스 플랫폼 구축" },
    { d: 2022.5, y: "2022", f: "mob", t: "르노코리아자동차 앱 운영/유지보수" },
    { d: 2022.65, y: "2022", f: "fin", t: "DGB캐피탈 홈페이지 프로세스 개선 구축(WEB/APP)" },
    { d: 2022.85, y: "2022", f: "mob", t: "TestWorks TFS Management 사이트 구축" },
    { d: 2023.1, y: "2023", f: "lbs", t: "KT 복합측위엔진 AI/ML 기반 고도화" },
    { d: 2023.3, y: "2023", f: "mob", t: "현대오토에버 글로벌 CP admin Portal 사이트 구축" },
    { d: 2023.62, y: "2023", f: "fin", t: "DGB캐피탈 카버스(오토금융) 플랫폼 구축" },
    { d: 2024.05, y: "2024", f: "mob", t: "현대오토에버 글로벌 POI Search Service 1단계 구축" },
    { d: 2024.45, y: "2024", f: "fin", t: "iM캐피탈 에이전트 영업관리 포털 구축" },
    { d: 2024.72, y: "2024", f: "mob", t: "현대오토에버 MAPGPT 및 내비3D 시각화 선행개발" },
    { d: 2025.28, y: "2025", f: "fin", t: "iM캐피탈 홈페이지 프로세스 개선 및 UI/UX 리뉴얼" },
    { d: 2025.45, y: "2025", f: "fin", t: "iM캐피탈 AI 고객센터 및 셀프서비스 구축" },
    { d: 2025.6, y: "2025", f: "mob", t: "현대오토에버 글로벌 POI Search Service 운영" },
    { d: 2026.25, y: "2026", f: "fin", t: "iM캐피탈 디지털브랜치 통합 전환 구축" },
  ] as { d: number; y: string; f: "fin" | "lbs" | "mob" | "etc"; t: string }[],
} as const;

/* ───────── 4장 디지털금융 ───────── */
/** 4.2 시간 비례 레일의 사업 하나. s·e 는 소수 연도(e 없으면 점). lane 은 겹칠 때 쌓는 칸 */
export type FinItem = { s: number; e?: number; lane: number; t: string; label?: string };

export const finance = {
  title: "디지털금융",
  meta: `2012년부터 · 사업${NB}24건`,
  body: "은행·보험·캐피탈의 고객 채널과 내부 시스템을 구축하고 지속적으로 운영합니다. 대출 신청처럼 작은 불편 하나가 고객 이탈로 이어질 수 있는 핵심 금융 서비스를 안정적으로 관리하고 개선합니다.",
  keywords: ["모바일·인터넷뱅킹", "UI/UX 리뉴얼", "오토금융", "에이전트 포털"],
  rails: { upper: "채널", lower: "내부 시스템" },
  sectorsTitle: "업종과 고객사",
  sectors: [
    { name: "은행", clients: ["가계여신 디지털화"] },
    { name: "보험", clients: ["IT시스템 · 모바일 영업지원"] },
    { name: "캐피탈", clients: ["홈페이지 · 오토금융 · AI 고객센터"] },
    { name: "카드", clients: ["마이데이터(기획)"] },
    { name: "증권", clients: ["모바일오피스"] },
  ],
  rec41: [
    { y: "2012", t: "한국증권전산 모바일오피스 개발" },
    { y: "2016", t: "에이스생명 모바일 영업지원시스템 구축" },
    { y: "2018", t: "KB국민은행 가계여신 Digitalization 구축 개발" },
    { y: "2021", t: "KB카드 마이데이터 구축(기획 부문)" },
  ] satisfies Rec[],

  longTitle: "2017년부터 이어 온 사업",
  longBody:
    "DGB캐피탈 PC·모바일 홈페이지 구축(2017)에서 시작해 고도화, 모바일 채널 개선, 프로세스 개선, 오토금융, 에이전트 포털, AI 고객센터로 이어 왔고, 디지털브랜치 통합 전환 구축(2026.04~2027.01)으로 이어집니다. DGB생명(현 iM라이프)의 IT시스템도 개발하고 운영합니다.",
  longRails: { upper: "캐피탈사", lower: "생명보험사" },
  longCaption: "막대 길이는 사업 기간입니다(도식)",
  axis: { from: 2017, to: 2027 },
  /** 위 레일: 캐피탈 사업(FACTS 추가 수집 2 의 기간). 기간을 모르는 사업은 그 해 가운데 점 */
  capital: [
    { s: 2017.71, lane: 0, t: "2017 PC/모바일 홈페이지 구축", label: "2017 홈페이지 구축" },
    { s: 2018.5, lane: 0, t: "2018 홈페이지 고도화" },
    { s: 2019.5, lane: 0, t: "2019 모바일 채널 기능개선" },
    { s: 2020.5, lane: 0, t: "2020 모바일(웹) 채널 기능 개선" },
    { s: 2022.3, lane: 1, t: "2022 개인신용대출·오토 기능 개선" },
    { s: 2022.3, lane: 2, t: "2022 위임채권·재고금융 퍼블리싱" },
    { s: 2022.58, e: 2023.08, lane: 0, t: "2022.08~2023.01 홈페이지 프로세스 개선 구축(WEB/APP)" },
    { s: 2023.3, lane: 1, t: "2023 홈페이지 프로세스 개선 구축" },
    { s: 2023.75, lane: 1, t: "2023 하반기 홈페이지 프로세스 개선" },
    { s: 2023.58, e: 2024.17, lane: 0, t: "2023.08~2024.02 오토금융 플랫폼 구축", label: "2023 오토금융 플랫폼" },
    { s: 2024.42, e: 2025.0, lane: 0, t: "2024.06~2024.12 에이전트 영업관리 포털 구축", label: "2024 에이전트 영업관리 포털" },
    { s: 2025.25, e: 2026.0, lane: 0, t: "2025.04~2025.12 홈페이지 프로세스 개선 및 UI/UX 리뉴얼", label: "2025 UI/UX 리뉴얼" },
    { s: 2025.42, e: 2026.08, lane: 1, t: "2025.06~2026.01 AI 고객센터 및 셀프서비스 구축", label: "2025 AI 고객센터" },
    { s: 2026.25, e: 2027.08, lane: 0, t: "2026.04~2027.01 디지털브랜치 통합 전환 구축", label: "2026 디지털브랜치 통합 전환" },
  ] satisfies FinItem[],
  /** 아래 레일: DGB생명·iM라이프 IT시스템(연도만 있음) */
  life: [
    { s: 2020.5, lane: 0, t: "2020 생명보험사 IT시스템" },
    { s: 2021.5, lane: 0, t: "2021 생명보험사 IT시스템" },
    { s: 2023.5, lane: 0, t: "2023 생명보험사 IT시스템 개발 및 유지보수" },
    { s: 2024.5, lane: 0, t: "2024 생명보험사 IT시스템 개발 및 운영" },
    { s: 2025.5, lane: 0, t: "2025 생명보험사 IT시스템 개발 및 유지보수" },
  ] satisfies FinItem[],
  longList: [
    "2017 DGB캐피탈 PC/모바일 홈페이지 구축",
    "2018 DGB캐피탈 홈페이지 고도화",
    "2019 DGB캐피탈 모바일 채널 기능개선",
    "2020 DGB캐피탈 모바일(웹) 채널 기능 개선",
    "2022 DGB캐피탈 홈페이지 프로세스 개선, 개인신용대출·오토 기능 개선, 위임채권·재고금융 퍼블리싱",
    "2023 DGB캐피탈 홈페이지 프로세스 개선(두 차례), 카버스(오토금융) 플랫폼 구축",
    "2024 iM캐피탈 에이전트 영업관리 포털 구축",
    "2025 iM캐피탈 홈페이지 프로세스 개선 및 UI/UX 리뉴얼, AI 고객센터 및 셀프서비스 구축",
    "2026~2027 iM캐피탈 디지털브랜치 통합 전환 구축",
    "DGB생명·iM라이프 IT시스템: 2020, 2021, 2023, 2024, 2025",
  ],

  loanTitle: "대출을 고르고 신청하기까지",
  loanBody: `개인신용대출·자동차금융·스탁론을 하나의 모바일 흐름으로 묶고, 상품마다 따로 놀던 신청 절차를 ${nb("One Pass")}로 통일했습니다(DGB캐피탈, 2022~2023). 대출 상품을 고르고 신청하기까지의 절차를 다시 설계해 온·오프라인을 잇는 ${nb("One Pass")} 경험을 만들었습니다(iM캐피탈, 2025).`,
  loanBranches: ["개인신용대출", "자동차금융", "스탁론"],
  loanScreens: ["대출 상품", "내게 맞는 대출 찾기", "신청"],
  rec43: [
    { y: "2022", t: "DGB캐피탈 홈페이지(WEB/APP) 프로세스 개선 구축" },
    { y: "2022", t: "DGB캐피탈 개인신용대출·오토 기능 개선" },
    { y: "2023", t: "DGB캐피탈 홈페이지 프로세스 개선(두 차례)" },
    { y: "2025", t: "iM캐피탈 홈페이지 프로세스 개선 및 UI/UX 리뉴얼" },
  ] satisfies Rec[],

  aiTitle: "AI 고객센터와 셀프서비스",
  aiBody: `${nb("Azure OpenAI")} 기반 생성형 AI로 맞춤형 답변과 셀프서비스를 잇습니다. 고객은 필요한 정보를 확인하고 관련 업무까지 직접 처리합니다(iM캐피탈, 2025.06~2026.01).`,
  aiPanels: ["필요한 서비스 고르기", "이렇게 물어보면 됩니다", "접수부터 완료까지"],
  aiSteps: ["접수", "진행", "완료"],
  aiChip: "Azure OpenAI",
  rec44: [{ y: "2025", t: "iM캐피탈 AI 고객센터 및 셀프서비스 구축" }] satisfies Rec[],

  toolsTitle: "영업 포털, 오토금융, 디지털브랜치",
  toolsBody: "고객 채널 뒤의 영업 도구와 오토금융 플랫폼도 구축합니다.",
  windows: [
    { id: "carverse", name: "오토금융 플랫폼", meta: `2023.08~2024.02 · 구축` },
    { id: "portal", name: "에이전트 영업관리 포털", meta: `2024.06~2024.12 · 구축·관리` },
    { id: "branch", name: "디지털브랜치 통합 전환", meta: `2026.04~2027.01 · 구축` },
  ],
  rec45: [
    { y: "2023", t: "DGB캐피탈 카버스(오토금융) 플랫폼 구축" },
    { y: "2024", t: "iM캐피탈(구 DGB캐피탈) 에이전트 영업관리 포털 구축" },
    { y: "2026", t: "iM캐피탈 디지털브랜치 통합 전환 구축" },
  ] satisfies Rec[],

  techTitle: "금융 사업 기술",
  tech: ["Azure OpenAI", "전자정부프레임워크", "HTML5", "Java", "jQuery", "MySQL"],
} as const;

/* ───────── 5장 IT서비스·모빌리티 ───────── */
export const mobility = {
  title: `IT서비스, 내비게이션${WJ}·${WJ}모빌리티`,
  meta: `2012년부터 · 사업${NB}19건`,
  body: "내비게이션의 검색과 지도, 차량 콘텐츠를 만들고 서비스를 이어서 운영합니다. 국내에서 검증한 것을 글로벌로 넓히는 일까지 함께합니다.",
  keywords: ["POI Search", "글로벌 CP 관리", "MAPGPT·내비3D", "커넥티드카", "aiworks"],
  rec51: [{ y: "2012", t: "현대 MnSOFT 스마트링크 센터(내비게이션센터) 시스템 개발" }] satisfies Rec[],

  poiTitle: "전 세계 POI가 모이는 길",
  poiBody: `전 세계에서 들어온 POI(관심 지점)를 지도 위에서 검토하고 승인하는 관리자 웹을 구축했습니다(글로벌 CP admin Portal, 2023). 사람이 눈으로 확인해야 통과되는 관문입니다. 이어 글로벌 ${nb("POI Search Service")}를 1단계(2024)와 2단계(2024~2025)로 구축하고 운영했습니다(2025).`,
  gates: ["수집", "검토·승인", "검색"],
  poiCaption: "POI가 관문을 지나 검색으로 가는 과정(도식)",
  rec52: [
    { y: "2023", t: "현대오토에버 글로벌 CP admin Portal 사이트 구축" },
    { y: "2024", t: `현대오토에버 글로벌 ${nb("POI Search Service")} 1단계 구축` },
    { y: "2024~2025", t: `현대오토에버 글로벌 ${nb("POI Search Service")} 2단계 구축` },
    { y: "2025", t: `현대오토에버 글로벌 ${nb("POI Search Service")} 운영` },
  ] satisfies Rec[],

  statsTitle: "공급사별로 받아 검수하고, 통계로 봅니다",
  statsBody:
    "전 세계 전기차(EV) 충전소와 POI 데이터를 공급사별로 받아 검수하고 통계로 보는 관리자 웹을 개발했습니다(2024). 나라마다 데이터 품질이 달라, 무엇이 얼마나 들어왔는지를 한 화면에서 비교하게 했습니다.",
  statsCard: "지역별 EV 충전소·POI 수집 통계",
  statsRegions: ["지역 A", "지역 B", "지역 C", "지역 D"],
  statsTechTitle: "관리자 웹 기술",
  statsTech: ["AWS", "MSA", "React", "TypeScript", "PostgreSQL", "MongoDB", "Redis", "Kafka"],
  rec53: [
    { y: "2024", t: "현대오토에버 글로벌 정보제공 서비스 관리자 웹 개발" },
    { y: "2024~2025", t: "현대오토에버 정보제공 서비스 표준 전개고도화 개발" },
  ] satisfies Rec[],

  mapTitle: "말로 찾고, 3D 지도로 잇는 흐름",
  mapBody:
    "차 안에서 목적지를 말로 찾고, 3D로 그린 지도 위에서 픽업까지 이어지는 흐름을 미리 만들어 본 선행 개발입니다(MAPGPT·내비3D, 2024~2025). 상용 서비스가 아니라, 먼저 만들어 보는 일이었습니다.",
  mapLabels: { voice: "말로 찾기", map: "3D 지도", pickup: "픽업" },
  mapCaption: "내비3D 지도 위 픽업 흐름 시안(도식)",
  rec54: [{ y: "2024~2025", t: "현대오토에버 MAPGPT 및 내비3D 시각화 선행개발" }] satisfies Rec[],

  appTitle: "차 밖까지 잇는 앱",
  appBody:
    "원격 시동·공조부터 경로를 차로 보내는 기능, 정비 예약까지 한 앱에서 다룹니다. 르노와 르노삼성 앱을 하나로 합쳐 운영했습니다(르노코리아자동차, 2022). 경찰청에 등록된 학원만 연결하는 운전연수 매칭 서비스는 구축 뒤 3년간 운영과 고도화를 이어 왔습니다(현대자동차, 2020~2022).",
  appScreens: ["내 차량 관리", "경로를 차로 보내기", "정비 예약"],
  lessonTitle: "운전연수 매칭",
  lessonSteps: ["등록 학원 검색", "회원가입 없이 매칭", "채팅 상담"],
  rec55: [
    { y: "2020", t: "현대자동차 운전연수 매칭 서비스 플랫폼 개발 구축" },
    { y: "2021", t: "현대자동차 운전연수 매칭 서비스 플랫폼 운영" },
    { y: "2022", t: "현대자동차 운전결심 서비스(웹/앱) 고도화, 운영" },
    { y: "2022", t: "르노코리아자동차 앱 운영, 고도화" },
  ] satisfies Rec[],

  clientsMeta: "IT서비스 고객사별 사업",
  clients: [
    { name: "현대오토에버", n: 7 },
    { name: "현대자동차", n: 4 },
    { name: "르노코리아자동차", n: 2 },
    { name: "TestWorks", n: 2 },
    { name: "MyRSM", n: 2 },
  ],
  clientsBody: "테스트 자동화 플랫폼처럼 차량 밖의 서비스 구축도 맡습니다(TestWorks aiworks 기획, TFS Management 구축, 2022).",
} as const;

/* ───────── 6장 솔루션 ───────── */
export type SolutionId = "actrack" | "cacago" | "zonecast" | "rental";

export type Solution = {
  id: SolutionId;
  field: Field;
  name: string;
  role: string;
  lead: string;
  body: string;
  /** 근거 칸 ①: 특허 건수(없으면 자사 직접 개발·운영) */
  patent: string | null;
  patentNo: string | null;
  projects: number;
  /** 근거 칸 ③ 첫 적용 해. null 이면 칸을 숨긴다 */
  firstApplied: number | null;
  support: string[];
  features: string[];
  links: string;
};

export const solutions = {
  title: "직접 설계해 운영하는 솔루션 4종",
  body: "외주 개발에서 그치지 않고 아크로퓨처가 직접 설계해 운영합니다. 특허 2건과 통신사 플랫폼 이력을 묶었습니다. 위치를 재는 일, 배차를 짜는 일, 구역에 알리는 일, 움직이는 자산을 대장으로 만드는 일입니다.",
  evidence: { patent: `등록${NB}특허`, own: "자사", ownLabel: "직접 개발·운영", projects: `적용${NB}사업`, first: "첫 적용" },
  supportTitle: "받치는 특허와 사업",
  items: [
    {
      id: "actrack",
      field: "fin",
      name: "AcTrack",
      role: "위치를 재는 일",
      lead: "GPS·WiFi로 정확하게, 실시간 위치 추적",
      body: `GPS와 WiFi를 함께 써서 실내외를 끊김 없이 추적합니다. 통신사 측위 플랫폼과 국책과제로 쌓은 엔진을 그대로 적용해, 신호가 약한 실내에서도 위치를 놓치지 않고 필요하면 ${nb("센티미터 단위")} 정밀측위까지 지원합니다.`,
      patent: "1건",
      patentNo: "제10-2226683호",
      projects: 4,
      firstApplied: 2019,
      support: [
        `특허 제10-2226683호 다중${NB}주파수${NB}측위`,
        "KT 복합측위엔진 AI/ML 기반 고도화",
        "KT RTK 정밀측위 서비스 플랫폼 구축",
        `KT 긴급구조용 3차원${NB}정밀측위 상용 플랫폼 구축`,
        "KT 위치정보 품질 관리 시스템 구축",
      ],
      features: [],
      links: "Cacago, Smart Rental",
    },
    {
      id: "cacago",
      field: "mob",
      name: "Cacago",
      role: "배차를 짜는 일",
      lead: "최적 경로로 배차부터 운송 완료까지",
      body: "차량 위치를 실시간으로 받아 경로를 다시 세우고, 배차 현황과 차량별 도착 예정을 한 화면에서 봅니다. 항만 물류 자동화에서 다뤄 온 문제를 솔루션으로 묶었습니다.",
      patent: null,
      patentNo: null,
      projects: 1,
      firstApplied: 2011,
      support: ["사이버 로지텍 항만 물류 자동화 시스템 개발(2011)"],
      features: ["실시간 경로 재계산", "차량별 위치 추적(AcTrack 연계)", "ERP·WMS 연동 API"],
      links: "AcTrack 위치 추적",
    },
    {
      id: "zonecast",
      field: "etc",
      name: "Smart Zone Cast",
      role: "구역에 알리는 일",
      lead: "정확한 타이밍에 딱, 실시간 지역 발송 메시지",
      body: "지도 위에 구역을 지정하면 그 안에 들어온 단말에만 메시지가 발송됩니다. KT와 SKT 양쪽에 같은 계열의 플랫폼을 구축했고, 위치 기반 재난안전문자에도 적용했습니다.",
      patent: "1건",
      patentNo: "제10-1674367호",
      projects: 4,
      firstApplied: 2015,
      support: [
        `특허 제10-1674367호 위치기반${NB}푸쉬형${NB}마케팅`,
        "KT CBS 위치기반지오펜싱 플랫폼 구축 및 유지보수(2015~, 진행 중)",
        "SKT CBS 위치기반지오펜싱 플랫폼 구축(2016)",
        "CBS 지오펜싱 플랫폼 고도화(2018)",
        "KT Smart Zone Cast 위치 기반 재난안전문자 서비스 개발(2022)",
      ],
      features: ["지도 기반 구역 설정", "위치 기반 재난안전문자", "OPEN API"],
      links: "OPEN API",
    },
    {
      id: "rental",
      field: "lbs",
      name: "Smart Rental",
      role: "움직이는 자산을 대장으로",
      lead: "대여부터 회수까지, 이동 자산 대장 한 곳에",
      body: "차량·장비처럼 이동하는 자산의 대여와 반납, 회수 이력을 한 대장에서 관리합니다. 자사 상품으로 2015년부터 직접 운영해 왔고, 차량 이력관리에서 같은 문제를 다뤄 왔습니다.",
      patent: null,
      patentNo: null,
      projects: 2,
      firstApplied: 2015,
      support: ["스마트 렌탈 솔루션 구축 및 운영(2015~, 진행 중)", "자동차 토털 이력관리 시스템 유지보수 및 기능개선(2015)"],
      features: ["가동률·회수 예정 집계", "AcTrack 위치 데이터 연계"],
      links: "AcTrack 위치 데이터",
    },
  ] satisfies Solution[],
  zoneSteps: ["구역 그리기", "송출", "리포트"],

  tableTitle: "4종을 한 표로",
  tableBody: "하는 일, 받치는 특허와 사업, 첫 적용 해를 나란히 놓았습니다. AcTrack의 위치는 Cacago와 Smart Rental로 이어집니다.",
  tableCaption: "자체 솔루션 4종 비교",
  tableHead: ["솔루션", "하는 일", "근거", "적용 사업", "첫 적용", "이어지는 곳"],
  patents: [
    { no: "제10-2226683호", name: `다중${NB}주파수${NB}측위`, date: `2021.${NB}03`, row: "actrack" },
    { no: "제10-1674367호", name: `위치기반${NB}푸쉬형${NB}마케팅`, date: `2016.${NB}11`, row: "zonecast" },
  ],
} as const;

/** 근거 칸 ③ 첫 적용(확정된 값만) */
export function firstAppliedLabel(year: number | null): string | null {
  return year === null ? null : `${year}년`;
}

/* ───────── 7장 일하는 과정 ───────── */
export const process = {
  title: "구축하고, 운영합니다",
  body: "은행·보험·캐피탈의 채널과 내부 시스템은 구축·운영까지, 내비게이션 콘텐츠는 제작·운영까지 합니다.",
  steps: ["요구 정리", "설계", "개발", "검증", "운영"],
  stepsCaption: "단계 이름은 일반적인 개발 과정을 뜻합니다.",
  basis: "사업 영역 표기: 구축·운영(디지털금융), 제작·운영(IT서비스), 국책과제(LBS·측위)",
  longTitle: "끝나면 떠나는 대신, 오래 지킵니다",
  longBody: "만든 사람이 지키면 문제가 생겼을 때 원인까지 가는 길이 짧습니다. 103건 이상 사업을 수행했고, 그중 상당수는 지금도 운영합니다.",
  /** 7.2 운영 기간 막대(시작·끝 소수 연도, open = 진행 중) */
  longRun: [
    { field: "lbs", name: "KT 위치정보 자기제어 유지보수", period: "2013~, 진행 중", s: 2013, e: 2026.75, open: true },
    { field: "lbs", name: "KT CBS 위치기반지오펜싱 플랫폼 구축 및 유지보수", period: "2015~, 진행 중", s: 2015, e: 2026.75, open: true },
    { field: "lbs", name: "스마트 렌탈 솔루션 구축 및 운영", period: "2015~, 진행 중", s: 2015, e: 2026.75, open: true },
    { field: "lbs", name: "KT LBS 통합 유지보수", period: "2017~, 진행 중", s: 2017, e: 2026.75, open: true },
    { field: "fin", name: "DGB캐피탈에서 iM캐피탈까지", period: "2017~2027", s: 2017.71, e: 2027.08, open: false },
    { field: "lbs", name: "재난안전통신망 위치 기능", period: `2018~, 3년${NB}구축, 7년째${NB}운영`, s: 2018.95, e: 2026.75, open: true },
  ] as const,
  longRunAxis: { from: 2009, to: 2027 },
  longRunCaption: "진행 중은 사업 사례 목록의 표기입니다.",
  // 7.3(2026-09-29 대표 지시): 기술 인력 97% 를 크게, 29명·등급은 보조 정보. 조직 = 4개 팀 + 기업부설연구소 + 전략기술본부
  peopleTitle: "기술 인력 97%",
  peopleBody: `약 30명 중 기술 인력이 97%입니다. 개발자 29명: 특급${NB}5명, 고급${NB}6명, 중급${NB}7명, 초급${NB}11명.`,
  grades: [
    { name: "특급", count: 5 },
    { name: "고급", count: 6 },
    { name: "중급", count: 7 },
    { name: "초급", count: 11 },
  ],
  bandLabel: `개발자 29명: 특급${NB}5명, 고급${NB}6명, 중급${NB}7명, 초급${NB}11명`,
  teamsTitle: "4개 팀과 기업부설연구소, 전략기술본부",
  orgTop: ["전략기술본부", "기업부설연구소"],
  orgTeams: ["디지털금융사업팀", "솔루션사업팀", "IT서비스사업팀", "경영지원팀"],
  giant: "97%",
  giantCaption: "기술 인력",
} as const;

/* ───────── 8장 실적과 도착 ───────── */
export const record = {
  projectsTitle: `누적 사업 103건 이상`,
  projectsGiant: "103+",
  byField: [
    { field: "lbs", label: "LBS·측위", n: 52 },
    { field: "fin", label: "디지털금융", n: 24 },
    { field: "mob", label: "IT서비스", n: 19 },
    { field: "etc", label: "그 밖", n: 8 },
  ] as const,
  byFieldCaption: "사업 사례 103건을 분야별로 나눈 수입니다.",
  clientsTitle: `고객사 24곳 이상`,
  clientsGiant: "24+",
  clientsCaption: "주요 고객사, 사업 건수 순",
  rowTop: [
    { name: "KT", n: 36 },
    { name: "DGB캐피탈", n: 11 },
    { name: "현대오토에버", n: 7 },
    { name: "iM캐피탈", n: 4 },
    { name: "현대자동차", n: 4 },
    { name: "DGB생명", n: 3 },
  ],
  rowBottom: [
    { name: "iM라이프", n: 2 },
    { name: "르노코리아자동차", n: 2 },
    { name: "TestWorks", n: 2 },
    { name: "ETRI", n: 2 },
    { name: "MyRSM", n: 2 },
    { name: "CJ", n: 2 },
  ],
  registry: [
    `등록 특허 제10-1674367호 위치기반${NB}푸쉬형${NB}마케팅(2016.${NB}11)`,
    `등록 특허 제10-2226683호 다중${NB}주파수${NB}측위(2021.${NB}03)`,
    `수상 KT 우수협력상(2025, AI/IT${NB}분야)`,
  ],
  marqueePause: "흐름 멈춤",
} as const;

export const contactSection = {
  title: "필요한 시스템을 알려 주세요",
  body: "금융 채널, 내비게이션 콘텐츠, 위치 기반 서비스, AI 제작 · 운영 솔루션의 구축과 운영을 상담합니다. 메일이나 전화로 연락해 주세요.",
  phoneLabel: "전화",
  faxLabel: "팩스",
  addressLabel: "주소",
  portalText: "업무 포털",
} as const;

export const meta = {
  // #509(대표 2026-11-10): 핵심 사업 셋(위치 · 모빌리티 · 금융) + AI 도입 · A-Flow. 히어로 제목 · 부제와 같은 말
  title: "아크로퓨처 | 위치 · 모빌리티 · 금융에 AI 와 자동화를 더합니다",
  description:
    "17년 동안 위치 · 모빌리티 · 금융 시스템을 만들고 운영해 온 (주)아크로퓨처가 그 업무에 AI 를 도입하고, 자동화 플랫폼 A-Flow 로 기획부터 납품 코드까지의 반복 작업을 줄입니다.",
  url: "https://acrofuture.com",
} as const;

/* ════════════════════════════════════════════════════════════════════
   4판 문구(2026-11-09, V4-PLAN B안). 근거 줄은 docs/FACTS.md 줄 번호(F:n) 또는 «추가 수집 3» 절(F3)이다.
   고객사 이름은 쓰지 않는다(D2): 업종 · 사업 성격으로 바꿔 쓴다.
   ════════════════════════════════════════════════════════════════════ */

/* ───────── 1 회사 #company ───────── */
export const hero = {
  label: "(주)아크로퓨처 · SINCE 2009", // F:6 F:7
  // #509(대표 2026-11-10 «위치, 모빌리티, 금융이 핵심 사업이고, AI 도입 및 A-Flow 자동화 혁신 플랫폼을 가지고 있는 회사»).
  // 후보 3안과 고른 이유: docs/R509.md. «혁신적인» 은 PRODUCT 금지어라 제목에 «혁신» 을 쓰지 않았다.
  titleBefore: `위치${NB}·${NB}모빌리티${NB}·${NB}금융에`,
  titleEm: "AI 와 자동화",
  titleAfter: "를 더합니다",
  lead: "17년 동안 위치 · 모빌리티 · 금융 시스템을 만들고 운영해 왔습니다. 그 업무를 아는 팀이 AI 를 도입하고, 자동화 플랫폼 A-Flow 로 기획부터 납품 코드까지의 반복 작업을 줄입니다.", // F:8 F:10 F:20~22 F3 A-Flow
  primary: "AI 도입 문의",
  secondary: "A-Flow 보기",
  // 도식: 세 사업(측점 + 오차 원) 가운데에 AI 도입 · A-Flow 층
  // #510: 세 사업의 업무가 가운데 AI 도입 · A-Flow 로 모이고, A-Flow 가 스펙에서 화면 · API · DB 를 만든다(FACTS «A-Flow» 한 줄 «스펙 하나에서 화면 · API · DB 까지»)
  figLabel: "위치 · 모빌리티 · 금융 세 사업의 업무가 가운데의 AI 도입과 A-Flow 로 모이고, A-Flow 가 화면 · API · DB 로 만들어 내는 도식",
  figCaption: "세 사업의 업무 → AI 도입 · A-Flow → 화면 · API · DB (도식)",
  figCore: ["AI 도입", "A-Flow"],
  // 아래 칸 4개: 세 사업(사례 건수, 사업 패널로) + AI · A-Flow(솔루션 A-Flow 카드로). 3판 첫 화면 «사업 칸 링크» 를 되살림(R508 → #509)
  // 옛 숫자 줄(17년 · 103건 이상 · 등록 특허 2건 · 97%) 재검토는 docs/NUMBERS.md «#509» 절
  fields: [
    { href: "#biz-lbs", field: "lbs", name: "위치", n: "52", unit: "건", since: "2009년부터", meta: "통신사 측위 · 재난망" }, // F:68 F:20
    { href: "#biz-it", field: "mob", name: "모빌리티", n: "19", unit: "건", since: "2012년부터", meta: "내비게이션 · 차량 서비스" }, // F:68 F:21
    { href: "#biz-fin", field: "fin", name: "금융", n: "24", unit: "건", since: "2012년부터", meta: "은행 · 보험 · 캐피탈" }, // F:68 F:19
    { href: "#aflow", field: "fix", name: "AI 도입 · A-Flow", n: "A-Flow", unit: "", since: "자체 제작 플랫폼", meta: "스펙에서 납품 코드까지" }, // F3 A-Flow
  ],
  fieldsLabel: "핵심 사업과 AI · A-Flow 바로 가기",
  fieldsNote: ["건수는 누적 사업 사례 103건 이상의 분야별 수(그 밖 8건)이며", "2026-09-28", "공개 사이트 기준입니다."], // F:14 F:68
} as const;

/* ───────── 2 AI 활용 #ai ───────── */
export const ai = {
  label: "AI 활용",
  titleBefore: "AI 직원 팀이 지시를 받아",
  titleEm: "사람의 승인까지",
  titleAfter: "일합니다",
  lead: "아크로퓨처는 AI 를 말이 아니라 일하는 방식으로 씁니다. 지시 한 건이 층(팀)을 따라 내려가 하위 지시로 갈라지고, 되돌릴 수 없는 일은 사람 승인에서 멈춥니다.", // F3 지시 흐름
  flowLabel: "사람 지시, PM 역할 AI 계획, 담당 AI 직원 실행, 사람 승인, 기록으로 이어지는 흐름 도식",
  steps: [
    { id: "order", title: "사람 지시", sub: "목표 · 끝 기준", detail: "목표와 끝났다고 볼 기준을 적습니다" },
    { id: "plan", title: "PM 역할 AI", sub: "계획 · 하위 지시로 나눔", detail: "PM 역할 AI 가 계획을 세우고 하위 지시로 나눕니다" },
    { id: "work", title: "담당 AI 직원", sub: "실행", detail: "담당 AI 직원이 같은 저장소에서 실행합니다" },
    { id: "gate", title: "사람 승인", sub: "", detail: "배포 · 외부 발송 · 되돌릴 수 없는 일은 여기서 멈춥니다" },
    { id: "log", title: "기록", sub: "보고 · 남음", detail: "보고와 승인이 기록으로 남습니다" },
  ],
  floors: ["가상 팀 A층", "가상 팀 B층", "가상 팀 C층"],
  flowCaption: "도식입니다. 팀 · 직원 이름은 가상입니다.",
  flowRule: "배포 · 외부 발송 · 되돌릴 수 없는 일은 사람 승인함을 거칩니다.", // F3 지시 흐름
  numsLabel: "사내 운영 기준 · 2026-11-10", // F3 수치
  // 한 주 완료 비율은 큰 숫자로 걸면 «AI 가 지시의 93% 를 끝낸다» 는 약속으로 읽힌다(대표 2026-11-10 «숫자 표현은 조심», #507) → 조건과 함께 각주 한 줄로.
  numsNote: "한 주(2026-11-02~11-08)에 받은 지시 166건 중 155건이 완료되었습니다. 사내 운영 기록을 2026-11-10 에 조회한 값으로, 그 주가 지난 뒤에 끝난 지시도 들어 있습니다.", // F3 한 주 166건 중 155건(2026-11-10 재측정)
  nums: [
    { n: "14", unit: "팀", label: "층(팀)" }, // F3 팀 14개
    { n: "31", unit: "명", label: "AI 직원" }, // F3 AI 직원 31명
    { n: "499", unit: "건", label: "업무 지시. 2026-10-20 첫 지시부터" }, // F3 지시 499건(2026-11-10 재측정)
  ],
  // 도식 → 제품 다리(대표 2026-11-10 «AI 활용 내용이 AI Office 내용인데 바로 연결이 안 됨»): 도식 끝 «기록» 에서 AI Office 화면으로.
  // 옛 원칙 3칸(rules) 중 승인 · 기록 두 칸은 아래 효과 3줄(aioffice.better)과 겹쳐 뺐고, 비밀값 원칙은 privacy 한 줄로 남겼다.
  bridgeLead: "이 흐름을 제품으로",
  officeLine: "도식의 다섯 단계는 AI Office 화면에서 이 자리입니다.", // F3 기능: 업무 지시 · 하위 지시 · 승인함
  officeShot: {
    src: "/v4/ai-office-demo-2-flow.webp", // #472 데모 캡처 ②(1440×900)의 위 720px
    alt: "AI Office 지시 화면 예시. 위쪽에 업무 지시 단추와 승인 요청(허용 · 거부), 가운데에 지시 하나를 하위 지시 3건으로 나눈 업무 분장과 각 담당 직원의 상태, 아래에 실행 기록이 보입니다",
    caption: "AI Office 화면 예시(데모 데이터). 실제 팀 · 직원 · 지시가 아닙니다.", // D8
    w: 1440,
    h: 720,
  },
  /** 도식 단계 ↔ 화면 자리. box = 캡처(1440×720) 안 [x, y, w, h], side = 번호 표지 쪽 */
  map: [
    { step: "order", ui: "업무 지시", body: "오른쪽 위 업무 지시에서 목표와 끝 기준을 적습니다", box: [1106, 6, 102, 46], side: "l" },
    { step: "plan", ui: "업무 분장", body: "층(팀)에 들어온 지시를 PM 역할 AI 가 하위 지시로 나눕니다", box: [28, 376, 412, 40], side: "l" },
    { step: "work", ui: "하위 지시와 상태", body: "하위 지시마다 맡은 직원과 진행 · 검토 요청 · 완료가 보입니다", box: [28, 420, 412, 162], side: "r" },
    { step: "gate", ui: "승인 요청", body: "되돌릴 수 없는 일은 사람이 허용 · 거부할 때까지 멈춥니다", box: [6, 60, 1428, 56], side: "l" },
    { step: "log", ui: "실행 기록", body: "실행 · 검토 · 승인이 지시마다 기록으로 남습니다", box: [24, 612, 1082, 94], side: "l" },
  ],
  privacy: "AI Office 는 작업 상태를 기록할 뿐 비밀값과 고객 데이터를 담지 않습니다.", // V4-PLAN §3 원칙
  toSolutions: "솔루션에서 AI Office 보기",
  selfTitle: "이 홈페이지 4판도 이 방식으로 만들었습니다",
  selfBody: "대표 지시 1건(2026-11-09)을 PM 역할 AI 가 계획하고, 사이트 분석 · 시안 · 화면 캡처 · 구현 · 모션 · 측정을 AI 직원 하위 지시로 나눠 맡겼습니다. 안 선택 · 공개 숫자 · 공개 배포는 대표가 승인합니다.", // F3 4판 제작
} as const;

/* ───────── 3 솔루션 #solutions ───────── */
/** at = 이 역할 장이 영상에서 시작하는 초(역할판 v3, 247.12초 — aflow-landing 과 같은 파일, ffprobe 로 길이 대조 2026-11-10) */
export type RoleTab = { id: string; at: number; name: string; now: string; change: string; better: string };

export const sol4 = {
  label: "솔루션",
  titleBefore: "그 방식으로 만든 제품을",
  titleAfter: "고객도 쓸 수 있습니다",
  groupMake: "AI 제작 · 운영 솔루션",
  groupMove: "위치 · 이동 솔루션",
  moveTitle: "위치를 재고, 알리고, 배차하고, 대장으로 만듭니다", // F:91
  // 옛 «특허 2건과 … 자체 솔루션 4종» 은 네 솔루션 모두 특허가 받치는 것처럼 읽혀(실제 특허는 AcTrack · Smart Zone Cast 두 곳) 카드별 근거로 바꿈(#507)
  moveMeta: "측위 특허와 통신사 플랫폼 사업에서 나온 자체 솔루션입니다. 카드마다 받치는 특허와 적용 사업을 적었습니다.", // F:91 F:166
  // 카드 펼침 상세(#508)
  open: "자세히 보기",
  close: "접기",
  useLabel: "쓰임새",
  who: "누가",
  when: "언제",
  betterLabel: "나아지는 것",
  featLabel: "핵심 기능",
  supportLabel: "적용 사업",
  linksLabel: "이어지는 솔루션",
  patentLabel: "받치는 특허",
  ownLabel: "자사 직접 개발 · 운영",
} as const;

export const aflow = {
  name: "A-Flow",
  tagline: "스펙 하나에서 화면 · API · DB 까지", // F3 A-Flow 한 줄
  body: "스펙을 검증하고 납품할 소스 코드로 생성하는 제작 플랫폼입니다. AI 는 코드가 아니라 스펙만 만듭니다.", // F3 A-Flow
  // 큰 숫자 카드(약 2.4초 · 약 4.3초)는 뺐다(대표 2026-11-10 «숫자 표현은 조심», #507): 고객이 «우리 프로젝트도 몇 초» 로 읽는다.
  // 그 자리는 숫자 없는 «무엇이 나아지나» 문장, 잰 값은 조건과 함께 같은 크기의 각주(measuredNote)로만 둔다.
  betterLabel: "나아지는 것",
  better: [
    "디자인 기준을 한 곳에서 고치면 모든 화면의 퍼블리싱 결과에 반영됩니다.", // F3 잰 숫자: 디자인 값 한 곳 → 전체 퍼블리싱 결과
    "반복 마크업은 스펙에서 생성되고, 사람은 고객 표준과 품질 검수를 맡습니다.", // F3 역할별 가치: 퍼블리셔
    "같은 스펙에서는 같은 코드가 나와, 검수한 결과를 다시 믿고 쓸 수 있습니다.", // F3 같은 입력 5회 출력 바이트 동일
  ],
  measuredNote:
    "사내 견본(화면 5개) 기준 · 2026-11-06 측정: 디자인 색 값 한 줄을 바꿔 전체 화면 퍼블리싱 결과가 다시 나오기까지 약 2.4초(3회 중앙값), 견본 화면 5개 퍼블리싱 약 4.3초(5회 중앙값), 같은 입력을 5회 생성한 결과는 파일 단위로 같았습니다. 기계가 생성하는 시간만 잰 값으로 사람이 값을 고르고 명세를 쓰고 검수하는 시간은 들어 있지 않으며, 실제 프로젝트는 화면 수와 구성에 따라 달라집니다.", // F3 · aflow-landing FACTS 148 · 150 · 151행(specforge eb3b6e01)
  tabsLabel: "역할을 고르면 영상이 그 역할 장으로 넘어가고, 바뀌는 일이 보입니다",
  tabsAria: "A-Flow 역할",
  cols: { now: "지금 하는 일", change: "바뀌는 일", better: "나아지는 것" },
  roles: [
    {
      id: "planner",
      at: 12.92, // 영상 장 시작(초): aflow-landing lib/filmCuts.ts 장면 2 기획자 표지
      name: "기획자",
      now: "화면 정의서 · 메뉴 구조를 문서로 쓰고 전달합니다",
      change: "문서 전달자에서, 모두가 보는 화면 명세의 주인으로",
      better: "디자인 · 퍼블리싱 · 개발이 같은 명세를 보므로 전달 중 어긋남과 되묻기가 줄어듭니다",
    },
    {
      id: "designer",
      at: 98.04, // 영상 장 시작(초): aflow-landing lib/filmCuts.ts 장면 7 디자이너 표지
      name: "디자이너",
      now: "화면마다 시안을 만들고 수정을 반영합니다",
      change: "화면 한 장씩 고치는 일에서, 디자인 기준(토큰 · 부품)을 관리하는 일로",
      better: "시안이 바뀔 때 화면마다 다시 고치는 공수가 줄어듭니다",
    },
    {
      id: "publisher",
      at: 149.96, // 영상 장 시작(초): aflow-landing lib/filmCuts.ts 장면 11 퍼블리셔 표지
      name: "퍼블리셔",
      now: "화면마다 HTML · JSP 를 손으로 쓰고, 수정 때마다 다시 만듭니다",
      change: "반복 마크업에서, 고객 표준 · 품질(접근성 · 반응형 · 호환) 검수로",
      better: "고객 표준 산출물과 검수 증적이 남고, 퍼블리싱 · 재작업 공수가 줄어듭니다",
    },
    {
      id: "ops",
      at: 196.92, // 영상 장 시작(초): aflow-landing lib/filmCuts.ts 장면 15 운영 · 보안 표지(보안 장면 17 까지)
      name: "운영보안",
      now: "고객 서버 · 폐쇄망 안에서 돌리고, 증적을 사람이 따로 모읍니다",
      change: "서명이 확인된 업데이트만 관리자 승인 뒤 적용하고, 이전 판으로 되돌립니다. 백업 · 감사 기록이 운영 중 남습니다",
      better: "외부 반출이 안 되는 사업에도 쓸 수 있고, 보안 심사 대응이 수월해집니다",
    },
  ] satisfies RoleTab[],
  video: {
    src: "/v4/aflow-film-v3-720p.mp4",
    poster: "/v4/aflow-film-v3-poster.webp",
    posterAlt: "A-Flow 소개 영상의 첫 화면. 화면 설계부터 디자인 · 퍼블리싱 · 점검 · 테스트까지, 기존 자산에서 시작하는 웹 제작 플랫폼",
    play: "A-Flow 소개 영상 재생",
    playFrom: "장부터 재생", // «A-Flow 소개 영상, 디자이너 장부터 재생»
    tag: "역할판 영상 · 누르면 재생 · 자막 내장 · 소리 없음",
  },
} as const;

export const aioffice = {
  name: "AI Office",
  tagline: "여러 프로젝트의 진행이 한 화면에", // F3 무엇: 프로젝트를 층, 세션을 직원
  better: [
    { title: "진행이 한 곳에 모입니다.", body: "프로젝트마다 흩어진 지시와 상태를 층(팀) · 직원 단위로 봅니다." }, // F3 기능 층 · 방 · 직원 상태
    { title: "승인을 거칩니다.", body: "배포 · 외부 발송 같은 되돌릴 수 없는 일은 사람이 승인한 뒤에 나갑니다." }, // F3 지시 흐름
    { title: "기록이 남습니다.", body: "지시 · 검토 · 승인을 나중에 따라갈 수 있습니다." }, // F3 기능
  ],
  portal: "업무포털 연동", // F3 기능 업무포털 · A-Flow 연동
  // 솔루션 절 카드는 짧게(지시 흐름 · 효과는 AI 활용 절의 #ai-office 로 옮김, 2026-11-10)
  body: "프로젝트를 층(팀)으로, AI 직원의 일을 자리와 상태로 보여 주는 사무실 화면입니다.", // F3 무엇
  back: "지시 흐름과 화면 대조는 AI 활용에서",
  shot: {
    src: "/v4/ai-office-demo-1.webp",
    alt: "AI Office 화면 예시. 가상 팀 층의 방과 직원 위치, 오늘의 팀 요약과 승인 대기가 한 화면에 보입니다",
    caption: "AI Office 화면 예시(데모 데이터). 실제 팀 · 직원 · 지시가 아닙니다.", // D8
    w: 1440,
    h: 900,
  },
} as const;

// 상세(펼침, #508): 3판 솔루션 장의 설명 · 받치는 사업 · 화면 예시를 되살렸다. 근거는 FACTS «자체 솔루션 카드 원문»(추가 수집 2).
// 적용 사업은 D2 표기(고객사 이름 → 업종), 해는 사업 사례 목록 표기. «나아지는 것» 은 FACTS 설명 문장을 고객 쪽 결과로 옮긴 것(숫자 없음).
export type MoveDetail = {
  lead: string; body: string; who: string; when: string; better: string;
  allFeatures: readonly string[]; support: readonly { y: string; t: string }[]; links: string | null;
};

export const move4 = [
  {
    id: "actrack", field: "fin", name: "AcTrack", line: "GPS · WiFi 기반 실시간 위치 추적", // F:25 F:92
    features: ["AI/ML 기반 복합측위", "RTK 정밀측위 보정 신호 배포", "긴급구조용 3차원 정밀측위"], // F:168
    patent: "제10-2226683호 다중 주파수 측위", projects: 4, first: 2019, // F:32 F:168 F:176
    patentDate: "2021.03", // F:32 F:176
    detail: {
      lead: "실내외를 오가도 위치를 놓치지 않는 추적", // F:168
      body: "GPS 와 WiFi 를 함께 써서 실내외를 끊김 없이 추적합니다. 통신사 측위 플랫폼과 국책과제로 쌓은 엔진을 그대로 적용해, 신호가 약한 실내에서도 위치를 놓치지 않고 필요하면 센티미터 단위 정밀측위까지 지원합니다.", // F:168
      who: "사람 · 기기 · 차량의 위치를 계속 알아야 하는 서비스 운영자",
      when: "신호가 약한 실내에서도 위치가 끊기면 안 될 때, 센티미터 단위 정밀도가 필요할 때", // F:168
      better: "위치가 끊기지 않아, 그 위치로 움직이는 알림 · 배차 · 대장이 같은 값을 씁니다.", // F:168 «이어지는 곳»
      allFeatures: ["AI/ML 기반 복합측위", "RTK 정밀측위 보정 신호 배포", "긴급구조용 3차원 정밀측위", "측정한 위치가 맞는지 되재는 품질 관리"], // F:168
      support: [
        { y: "2023", t: "통신사 복합측위엔진 AI/ML 기반 고도화" }, // F:168 F:141
        { y: "2022", t: "통신사 RTK 정밀측위 서비스 플랫폼 구축" }, // F:137
        { y: "2022", t: "통신사 긴급구조용 3차원 정밀측위 상용 플랫폼 구축" }, // F:138
        { y: "2019", t: "통신사 위치정보 품질 관리 시스템 구축" }, // F:131
      ],
      links: "Cacago · Smart Rental 에 위치 데이터를 넘깁니다", // 3판 «이어지는 곳»
    },
  },
  {
    id: "cacago", field: "mob", name: "Cacago", line: "배차 · 운송 관리 최적화", // F:26 F:93
    features: ["AI 최적 배차 알고리즘", "실시간 경로 재계산", "차량별 위치 추적(AcTrack 연계)"], // F:169
    patent: null, projects: 1, first: 2011, // F:169
    patentDate: null,
    detail: {
      lead: "최적 경로로 배차부터 운송 완료까지", // F:93
      body: "차량 위치를 실시간으로 받아 경로를 다시 세우고, 배차 현황과 차량별 도착 예정을 한 화면에서 봅니다. 항만 물류 자동화에서 다뤄 온 문제를 솔루션으로 묶었습니다.", // F:169
      who: "여러 차량으로 운송을 나누는 물류 · 운송 배차 담당자",
      when: "도로 사정과 차량 위치에 따라 경로를 다시 세워야 할 때", // F:169
      better: "배차 현황과 차량별 도착 예정을 한 화면에서 보므로, 차량마다 위치를 따로 확인하는 일이 줄어듭니다.", // F:169
      allFeatures: ["AI 최적 배차 알고리즘", "실시간 경로 재계산", "차량별 위치 추적(AcTrack 연계)", "비용 · 효율 분석 리포트", "기사용 모바일 앱", "ERP · WMS 연동 API"], // F:169
      support: [{ y: "2011", t: "물류 IT 기업 항만 물류 자동화 시스템 개발" }], // F:169
      links: "AcTrack 의 차량 위치를 받습니다",
    },
  },
  {
    id: "zonecast", field: "etc", name: "Smart Zone Cast", line: "실시간 지역 발송 메시지", // F:27 F:94
    features: ["지도 기반 구역(지오펜스) 설정", "구역에 들어온 단말에 메시지 발송", "위치 기반 재난안전문자"], // F:170
    patent: "제10-1674367호 위치기반 푸쉬형 마케팅", projects: 4, first: 2015, // F:31 F:170 F:175
    patentDate: "2016.11", // F:31 F:175
    detail: {
      lead: "구역 안에 들어온 단말에만 보내는 메시지", // F:170
      body: "지도 위에 구역을 지정하면 그 안에 들어온 단말에만 메시지가 발송됩니다. 통신사 두 곳에 같은 계열의 플랫폼을 구축했고, 위치 기반 재난안전문자에도 적용했습니다.", // F:170 (D2: 통신사 이름 → 통신사 두 곳)
      who: "재난 · 안전 알림을 보내는 기관, 지역 단위 안내가 필요한 사업자",
      when: "정해진 구역 안에 있는 사람에게만 알려야 할 때", // F:170
      better: "구역 밖에는 보내지 않아 받는 쪽은 필요한 알림만 받고, 보내는 쪽은 얼마나 닿았는지 리포트로 봅니다.", // F:94 «얼마나 닿았는지 보는 데까지» F:170 리포트
      allFeatures: ["지도 기반 구역(지오펜스) 설정", "구역 진입 시점 Push · 문자 발송", "위치 기반 재난안전문자", "캠페인 · 발송 결과 리포트", "바깥 시스템에서 부를 수 있는 OPEN API"], // F:170
      support: [
        { y: "2022", t: "통신사 Smart Zone Cast(위치 기반 재난안전문자 서비스) 개발" }, // F:170
        { y: "2018", t: "CBS 지오펜싱 플랫폼 고도화" }, // F:170
        { y: "2016", t: "통신사 CBS 위치기반지오펜싱 플랫폼 구축" }, // F:170
        { y: "2015~, 진행 중", t: "통신사 CBS 위치기반지오펜싱 플랫폼 구축 및 유지보수" }, // F:170 F:126
      ],
      links: "OPEN API 로 바깥 시스템과 잇습니다",
    },
  },
  {
    id: "rental", field: "lbs", name: "Smart Rental", line: "이동 자산 대장 관리", // F:28 F:95
    features: ["대여 · 반납 · 회수 이력 관리", "자산 단위 상태 추적", "관리자 웹 대시보드"], // F:171
    patent: null, projects: 2, first: 2015, // F:171
    patentDate: null,
    detail: {
      lead: "대여부터 회수까지, 이동 자산 대장 한 곳에", // F:95
      body: "차량 · 장비처럼 이동하는 자산의 대여와 반납, 회수 이력을 한 대장에서 관리합니다. 자사 상품으로 2015년부터 직접 운영해 왔고, 차량 이력관리에서 같은 문제를 다뤄 왔습니다.", // F:171
      who: "차량 · 장비를 빌려주는 렌탈 사업자",
      when: "자산마다 대여 · 반납 · 회수 이력과 지금 상태를 따로 모으고 있을 때", // F:171
      better: "자산마다 흩어진 이력이 대장 하나에 모여, 반납 예정과 회수 일정을 미리 확인합니다.", // F:171 가동률 · 회수 예정 집계
      allFeatures: ["대여 · 반납 · 회수 이력 관리", "자산 단위 상태 추적", "관리자 웹 대시보드", "가동률 · 회수 예정 집계", "차량 단위 이력 조회", "AcTrack 위치 데이터 연계"], // F:171
      support: [
        { y: "2015~, 진행 중", t: "스마트 렌탈 솔루션 구축 및 운영" }, // F:171 F:95
        { y: "2015", t: "자동차 토털 이력관리 시스템 유지보수 및 기능개선" }, // F:171
      ],
      links: "AcTrack 의 위치 데이터를 대장에 붙입니다",
    },
  },
] as const satisfies readonly {
  id: string; field: Field; name: string; line: string; features: readonly string[]; patent: string | null; projects: number; first: number;
  patentDate: string | null; detail: MoveDetail;
}[];

/* ───────── 4 사례 · 신뢰 #record ───────── */
export const rec4 = {
  label: "사례 · 신뢰",
  titleBefore: "금융 · 공공 · 모빌리티에서",
  titleAfter: "오래 운영했습니다",
  lead: "끝나면 떠나는 대신 오래 지키는 쪽을 택해 왔습니다. 만든 사람이 지키면 문제가 생겼을 때 원인까지 가는 길이 짧습니다.", // F:104
  cases: [
    {
      id: "capital",
      field: "fin",
      biz: "fin", // 사업 절 패널 #biz-fin(#508 되살린 «사업 사례 링크»)
      chip: "디지털금융",
      title: "캐피탈사 AI 고객센터 · 셀프서비스",
      body: "Azure OpenAI 기반 생성형 AI 로 맞춤형 답변과 셀프서비스를 연계했습니다. 고객이 필요한 정보를 확인하고 관련 업무까지 직접 처리합니다.", // F:78
      items: [
        { y: "2025.06~2026.01", t: "AI 고객센터 및 셀프서비스 구축" }, // F:78
        { y: "2023.08~2024.02", t: "오토금융 플랫폼 구축" }, // F:82
        { y: "2024.06~2024.12", t: "에이전트 영업관리 포털 구축 · 관리" }, // F:81
      ],
    },
    {
      id: "maker",
      field: "mob",
      biz: "it",
      chip: "IT서비스 · 모빌리티",
      title: "완성차사 운전연수 매칭 서비스",
      body: "경찰청에 등록된 학원만 연결해 불법 운전연수를 걸러냅니다. 구축 이후 3년간 운영과 고도화를 이어 왔습니다.", // F 추가 수집 2 운전연수
      items: [
        { y: "2020.06~12", t: "운전연수 매칭 서비스 플랫폼 개발 구축" }, // F 추가 수집 2
        { y: "2024.01~12", t: "글로벌 정보제공 서비스 관리자 웹 개발" }, // F 추가 수집 2
        { y: "2024.09~2025.01", t: "음성 목적지 검색 · 내비3D 시각화 선행개발" }, // F 추가 수집 2
      ],
    },
  ],
  fieldTitle: "사업 사례 103건 이상", // F:14
  fieldCaption: "분야별 사업 건수입니다. 분야를 누르면 그 분야 사례 목록이 펼쳐집니다.", // F:68
  // 분야별 사례 목록(#508): lib/cases.ts = FACTS «사업 사례 103건 목록»
  listNote: "해는 사업을 시작한 해입니다. 고객사 이름 대신 업종으로 적었습니다.",
  listAria: "사례 목록",
  bizLink: "사업 보기", // «디지털금융 사업 보기» → 사업 절 패널
  caseLink: "사례", // «디지털금융 사례 24건» → 분야별 목록
  ongoing: "진행 중",
  byField: [
    { field: "lbs", label: "LBS·측위", n: 52 }, // F:68
    { field: "fin", label: "디지털금융", n: 24 },
    { field: "mob", label: "IT서비스", n: 19 },
    { field: "etc", label: "그 밖", n: 8 },
  ],
  fieldTotal: 103,
  runTitle: "오래 지키는 사업",
  runCaption: "막대 길이는 사업 기간입니다. 진행 중은 사업 사례 목록의 표기입니다.",
  runAxis: { from: 2009, to: 2027 },
  run: [
    { field: "lbs", name: "통신사 위치정보 자기제어 유지보수", period: "2013~, 진행 중", s: 2013, e: 2026.75, open: true }, // F:124
    { field: "lbs", name: "통신사 위치기반 지오펜싱 플랫폼 구축 및 유지보수", period: "2015~, 진행 중", s: 2015, e: 2026.75, open: true }, // F:126
    { field: "lbs", name: "스마트 렌탈 솔루션 구축 및 운영", period: "2015~, 진행 중", s: 2015, e: 2026.75, open: true }, // F:95
    { field: "lbs", name: "통신사 LBS 통합 유지보수", period: "2017~, 진행 중", s: 2017, e: 2026.75, open: true }, // F:128
    { field: "fin", name: "캐피탈사 홈페이지 · 채널 사업", period: "2017~2027", s: 2017.71, e: 2027.08, open: false }, // F:88 F:77
    { field: "lbs", name: "재난안전통신망 위치 기능", period: `2018~, 3년${NB}구축, 7년째${NB}운영`, s: 2018.95, e: 2026.75, open: true }, // F:100
  ],
  netTitle: "재난안전통신망",
  netField: "lbs", // 링크: LBS·측위 사업 패널 · 사례 목록
  netBody: "8대 분야 333개 기관, 24만 명이 쓰는 재난안전통신망의 위치 기능을 맡았습니다. 3년을 지어 7년째 운영 중입니다.", // F:129
  proofTitle: "특허 · 수상 · 국책과제",
  patents: [
    { no: "제10-1674367호", name: "위치기반 푸쉬형 마케팅", date: "2016.11" }, // F:31
    { no: "제10-2226683호", name: "다중 주파수 측위", date: "2021.03" }, // F:32
  ],
  patentLabel: "등록 특허 2건", // F:30
  award: "통신사 우수협력상 2025 · AI/IT 분야", // F:35 (D2: 고객사 이름 대신 업종)
  rd: "국책과제 수행: 긴급구조용 3차원 정밀측위(2021)", // F:134
  processTitle: "구축하고, 운영합니다",
  processBody: "은행 · 보험 · 캐피탈의 채널과 내부 시스템은 구축 · 운영까지, 내비게이션 콘텐츠는 제작 · 운영까지 합니다.", // F:18 F:19
  steps: ["요구 정리", "설계", "개발", "검증", "운영"],
  stepsCaption: "단계 이름은 일반적인 개발 과정을 뜻합니다.",
} as const;

/* ════════════════════════════════════════════════════════════════════
   4.1 사업 영역 #business(2026-11-09, 지시 #488). 근거는 docs/FACTS.md 줄 번호(F:n).
   3판 데이터(lbs · finance · mobility)를 다시 쓰되 고객사 이름은 업종 · 사업 성격으로 바꿨다(D2).
   ════════════════════════════════════════════════════════════════════ */
export type BizFrame = { id: string; title: string; body: string; rec?: readonly Rec[] };
export type BizTeam = {
  id: "lbs" | "fin" | "it";
  field: Field;
  name: string;
  since: number;
  count: number;
  did: string;
  better: readonly string[];
  frames: readonly BizFrame[];
};

export const biz = {
  label: "사업",
  titleBefore: "위치에서 출발해 금융과 모빌리티까지",
  titleAfter: "세 팀이 맡아 운영합니다",
  lead: "위치를 재는 일로 시작한 뒤, 금융 채널과 내비게이션 콘텐츠로 넓혀 왔습니다. 만든 사람이 계속 운영하는 쪽을 택해 왔습니다.", // F:6 F:8 F:104
  sinceLabel: "시작",
  countLabel: "사업",
  didLabel: "무엇을 해 왔나",
  betterLabel: "무엇이 나아지나",
  framesLabel: "일하는 모습",
  casesLink: "사례 목록", // «LBS·측위 사례 목록 52건» → #cases-lbs(#508)
  figCaption: "화면 예시(도식). 실제 고객사 화면이 아닙니다.",
  teams: [
    {
      id: "lbs",
      field: "lbs",
      name: "LBS·측위",
      since: 2009, // F:20 F:68
      count: 52, // F:68
      did: "통신사 플랫폼과 국책과제로 쌓았습니다. 위치를 재는 기술에서 시작해, 그 위치로 무엇을 할지까지 만들고 재난안전통신망처럼 오래 지켜야 하는 시스템을 맡습니다.", // F:118
      better: [
        "신호가 약한 곳에서도 위치를 놓치지 않습니다. 여러 신호를 함께 써서 위치 하나를 계산합니다.", // F:168
        "오차가 미터 단위에서 센티미터 단위까지 줄어듭니다. 보정 신호(RTK)를 전국에 보냅니다.", // F:99
        "구역 안의 단말에만 알림이 닿고, 재난안전통신망의 위치 기능은 오래 끊기지 않게 지킵니다.", // F:170 F:129
      ],
      frames: [
        {
          id: "converge",
          title: "여러 신호를 한 위치로 모읍니다",
          body: "여러 신호를 함께 써서 위치 하나를 계산하는 복합측위 엔진을 고도화해 왔습니다. 통신사 복합측위엔진 고도화(2022)에 이어 AI/ML 기반 고도화(2023)를 수행했습니다.", // F:101 F:141
          rec: [
            { y: "2009", t: "통신사 지하철 측위 시스템 구축(첫 사업)" }, // F:122
            { y: "2023", t: "통신사 복합측위엔진 AI/ML 기반 고도화" }, // F:141
          ],
        },
        {
          id: "rtk",
          title: "미터에서 센티미터로",
          body: "GPS 오차를 센티미터 단위까지 줄이는 보정 신호(RTK)를 전국에 보내는 플랫폼과, 그 위에서 위치를 관리하는 엔진을 구축했습니다(통신사, 2022). 정확도만큼 끊기지 않는 것이 중요합니다.", // F:99
          rec: [{ y: "2022", t: "통신사 RTK 정밀측위 서비스 플랫폼 구축" }], // F:137
        },
        {
          id: "height",
          title: "높이까지 재는 3차원 측위",
          body: "긴급구조용 3차원 정밀측위를 국책과제로 개발했고(2021), 통신사 상용 플랫폼으로 구축했습니다(2022).", // F:134 F:138
          rec: [
            { y: "2021", t: "(국책과제) 긴급구조용 3차원 정밀측위" }, // F:134
            { y: "2022", t: "통신사 긴급구조용 3차원 정밀측위 상용 플랫폼 구축" }, // F:138
          ],
        },
        {
          id: "zone",
          title: "구역에 알리고, 재난망을 지킵니다",
          body: "지도 위에 지정한 구역 안의 단말에만 메시지를 보내는 위치기반 지오펜싱 플랫폼을 통신사 두 곳에 구축했고(2015~, 2016), 위치 기반 재난안전문자 서비스를 개발했습니다(2022). 8대 분야 333개 기관, 24만 명이 쓰는 재난안전통신망의 위치 기능은 3년을 지어 7년째 운영합니다.", // F:126 F:129 F:170
          rec: [
            { y: "2015", t: "통신사 위치기반 지오펜싱 플랫폼 구축 및 유지보수(진행 중)" }, // F:126
            { y: "2018", t: "재난안전통신망 A사업구역 LBS 솔루션 납품 및 유지보수" }, // F:129
          ],
        },
      ],
    },
    {
      id: "fin",
      field: "fin",
      name: "디지털금융",
      since: 2012, // F:18 F:68
      count: 24, // F:68
      did: "은행 · 보험 · 캐피탈의 고객 채널과 내부 시스템을 구축하고 지속적으로 운영합니다.", // F:72
      better: [
        "대출 신청처럼 작은 불편 하나가 고객 이탈로 이어질 수 있는 핵심 서비스를 안정적으로 관리하고 개선합니다.", // F:72
        "상품마다 따로 놀던 신청 절차를 하나의 흐름으로 통일해, 지금 무엇을 신청하는지가 한눈에 보입니다.", // F:158
        "고객이 필요한 정보를 확인하고 관련 업무까지 직접 처리합니다.", // F:78
      ],
      frames: [
        {
          id: "sectors",
          title: "다섯 업종의 채널과 내부 시스템",
          body: "은행 · 보험 · 캐피탈 · 카드 · 증권의 고객 채널과 내부 시스템을 만들어 왔습니다. 증권사 모바일오피스(2012)가 금융 첫 사업이고, 한 캐피탈사와는 2017년 홈페이지 구축부터 AI 고객센터까지 이어 왔습니다.", // F:72 F:87 F:88
          rec: [
            { y: "2012", t: "증권사 모바일오피스 개발(금융 첫 사업)" }, // F:87
            { y: "2017", t: "캐피탈사 PC/모바일 홈페이지 구축" }, // F:88
          ],
        },
        {
          id: "loan",
          title: "대출을 고르고 신청하기까지",
          body: "개인신용대출 · 자동차금융 · 스탁론을 하나의 모바일 흐름으로 묶고, 신청 절차를 One Pass 로 통일했습니다(2022~2023). 2025년에는 대출 상품을 고르고 신청하기까지의 절차를 다시 설계해 온라인과 오프라인을 잇는 경험을 만들었습니다.", // F:158 F:79
          rec: [
            { y: "2022", t: "캐피탈사 홈페이지(WEB/APP) 프로세스 개선 구축" }, // F:158
            { y: "2025", t: "캐피탈사 홈페이지 프로세스 개선 및 UI/UX 리뉴얼" }, // F:79
          ],
        },
        {
          id: "ai",
          title: "AI 고객센터와 셀프서비스",
          body: "Azure OpenAI 기반 생성형 AI 로 맞춤형 답변과 셀프서비스를 잇습니다. 고객은 필요한 정보를 확인하고 관련 업무까지 직접 처리합니다(2025.06~2026.01).", // F:78
          rec: [{ y: "2025", t: "캐피탈사 AI 고객센터 및 셀프서비스 구축" }], // F:78
        },
        {
          id: "tools",
          title: "영업 포털, 오토금융, 디지털브랜치",
          body: "고객 채널 뒤의 영업 도구와 오토금융 플랫폼도 구축합니다. 오토금융 플랫폼(2023.08~2024.02), 에이전트 영업관리 포털(2024.06~2024.12), 디지털브랜치 통합 전환(2026.04~2027.01)입니다.", // F:77 F:81 F:82
          rec: [{ y: "2026", t: "캐피탈사 디지털브랜치 통합 전환 구축" }], // F:77
        },
      ],
    },
    {
      id: "it",
      field: "mob",
      name: "IT서비스",
      since: 2012, // F:19 F:68
      count: 19, // F:68
      did: "내비게이션의 검색과 지도, 차량 콘텐츠를 만들고 서비스를 이어서 운영합니다. 테스트 자동화 플랫폼처럼 차량 밖의 서비스 구축도 이 팀이 맡습니다.", // F:116
      better: [
        "나라마다 다른 데이터 품질을, 무엇이 얼마나 들어왔는지 한 화면에서 비교해 검수합니다.", // F:150
        "사람이 눈으로 확인해야 통과되는 관문을 지도 위 관리자 화면으로 둡니다.", // F:149
        "차 안에서 목적지를 말로 찾고 3D 지도로 잇는 흐름을 먼저 만들어 봅니다. 상용 서비스가 아닌 선행 개발입니다.", // F:153
      ],
      frames: [
        {
          id: "road",
          title: "전 세계 POI 가 모이는 길",
          body: "전 세계에서 들어온 POI(관심 지점)를 지도 위에서 검토하고 승인하는 관리자 웹을 구축했습니다(2023). 사람이 눈으로 확인해야 통과되는 관문입니다. 이어 글로벌 POI Search Service 를 1단계(2024)와 2단계(2024~2025)로 구축하고 운영했습니다(2025).", // F:149 F:152
          rec: [
            { y: "2012", t: "완성차 계열 IT 서비스사 내비게이션센터 시스템 개발" }, // F:144
            { y: "2023", t: "글로벌 CP admin Portal 사이트 구축" }, // F:149
          ],
        },
        {
          id: "stats",
          title: "공급사별로 받아 검수하고, 통계로 봅니다",
          body: "전 세계 전기차(EV) 충전소와 POI 데이터를 공급사별로 받아 검수하고 통계로 보는 관리자 웹을 개발했습니다(2024). 나라마다 데이터 품질이 달라, 무엇이 얼마나 들어왔는지를 한 화면에서 비교하게 했습니다.", // F:150
          rec: [{ y: "2024", t: "글로벌 정보제공 서비스 관리자 웹 개발" }], // F:150
        },
        {
          id: "map",
          title: "말로 찾고, 3D 지도로 잇는 흐름",
          body: "차 안에서 목적지를 말로 찾고, 3D 로 그린 지도 위에서 픽업까지 이어지는 흐름을 미리 만들어 본 선행 개발입니다(2024~2025). 상용 서비스가 아니라, 먼저 만들어 보는 일이었습니다.", // F:153
          rec: [{ y: "2024", t: "음성 목적지 검색 · 내비3D 시각화 선행개발" }], // F:153
        },
        {
          id: "app",
          title: "차 밖까지 잇는 앱",
          body: "원격 시동 · 공조부터 경로를 차로 보내는 기능, 정비 예약까지 한 앱에서 다룹니다(2022). 경찰청에 등록된 학원만 연결하는 운전연수 매칭 서비스는 구축 뒤 3년간 운영과 고도화를 이어 왔습니다(2020~2022).", // F:145 F:147
          rec: [
            { y: "2020", t: "운전연수 매칭 서비스 플랫폼 개발 구축" }, // F:145
            { y: "2022", t: "완성차사 앱 운영 · 고도화" }, // F:147
          ],
        },
      ],
    },
  ] satisfies BizTeam[],

  /* 연혁 띠 */
  historyTitle: "17년 동안 이어 온 경로",
  historyCaption: "연도는 사업 기록의 표기입니다.",
  history: [
    { y: "2009", name: "설립", body: "7월 20일 설립, LBS·측위 사업 시작", kind: "" }, // F:10 F:20
    { y: "2012", name: "세 갈래", body: "디지털금융, IT서비스 사업 시작", kind: "" }, // F:18 F:19
    { y: "2016", name: "특허 등록", body: "위치기반 푸쉬형 마케팅 제10-1674367호(2016.11)", kind: "특허" }, // F:31
    { y: "2021", name: "특허 등록", body: "다중 주파수 측위 제10-2226683호(2021.03)", kind: "특허" }, // F:32
    { y: "2025", name: "AI 고객센터와 수상", body: "캐피탈사 AI 고객센터 구축 착수(2025.06), 통신사 우수협력상(AI/IT 분야)", kind: "" }, // F:78 F:35
    { y: "2026", name: "AI 오피스", body: "AI 직원 팀이 지시를 받아 일하는 사무실 시스템, 2026-10-20 첫 지시", kind: "" }, // F:189 F:190
  ],
} as const;
