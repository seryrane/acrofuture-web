// 챕터 8개와 장면 39개의 스크롤 구간(3판). STORYBOARD "lib/scenes.ts 3판 값"이 유일한 출처다.
// 단위: 챕터 윗변이 화면 윗변에 닿은 뒤 스크롤한 거리(svh). 챕터 높이 = 100svh + L.
// 컴포넌트의 --L·--z 도 여기서 읽는다(값을 두 곳에 적지 않는다).

export type Surface = "day" | "night";

export type Scene = { id: string; name: string; a: number; b: number };

export type ChapterDef = {
  id: string;
  surface: Surface;
  /** 마지막 장면 끝값(svh) */
  L: number;
  /** 쌓임 순서(앞 챕터가 위) */
  z: number;
  scenes: Scene[];
  /** 챕터 끝의 원형 열림 구간과 열린 뒤 바탕 */
  opens?: { a: number; b: number; to: Surface };
};

export const CHAPTERS: ChapterDef[] = [
  {
    id: "top", surface: "day", L: 200, z: 8,
    scenes: [
      { id: "1.1", name: "측점 고정", a: 0, b: 60 },
      { id: "1.2", name: "오차 원에서 위성 궤도로", a: 40, b: 140 },
      { id: "1.3", name: "원형 열림(신호)", a: 140, b: 200 },
    ],
    opens: { a: 150, b: 200, to: "night" },
  },
  {
    id: "lbs", surface: "night", L: 660, z: 7,
    scenes: [
      { id: "2.1", name: "신호 흩어짐", a: 0, b: 90 },
      { id: "2.2", name: "여러 신호를 한 위치로", a: 90, b: 180 },
      { id: "2.3", name: "미터에서 센티미터로", a: 180, b: 280 },
      { id: "2.4", name: "높이까지 재는 3차원 측위", a: 280, b: 370 },
      { id: "2.5", name: "구역 알림과 재난안전통신망", a: 370, b: 470 },
      { id: "2.6", name: "대형 숫자 17", a: 470, b: 580 },
      { id: "2.7", name: "선으로 풀림(도면)", a: 580, b: 660 },
    ],
    opens: { a: 620, b: 660, to: "day" },
  },
  {
    id: "history", surface: "day", L: 420, z: 6,
    scenes: [
      { id: "3.1", name: "2009 설립", a: 0, b: 70 },
      { id: "3.2", name: "2012 세 갈래", a: 70, b: 150 },
      { id: "3.3", name: "특허 2건", a: 150, b: 270 },
      { id: "3.4", name: "2025·2026과 갈래별 건수", a: 270, b: 420 },
    ],
    opens: { a: 360, b: 420, to: "night" },
  },
  {
    id: "finance", surface: "night", L: 560, z: 5,
    scenes: [
      { id: "4.1", name: "레일과 다섯 업종", a: 0, b: 100 },
      { id: "4.2", name: "2017년부터 이어 온 사업", a: 100, b: 200 },
      { id: "4.3", name: "대출을 고르고 신청하기까지", a: 200, b: 300 },
      { id: "4.4", name: "AI 고객센터와 셀프서비스", a: 300, b: 400 },
      { id: "4.5", name: "영업 포털, 오토금융, 디지털브랜치", a: 400, b: 490 },
      { id: "4.6", name: "레일이 기울어 도로로", a: 490, b: 560 },
    ],
  },
  {
    id: "mobility", surface: "night", L: 560, z: 4,
    scenes: [
      { id: "5.1", name: "원근 주행", a: 0, b: 100 },
      { id: "5.2", name: "전 세계 POI가 모이는 길", a: 100, b: 200 },
      { id: "5.3", name: "공급사별 검수와 통계", a: 200, b: 290 },
      { id: "5.4", name: "말로 찾고 3D 지도로", a: 290, b: 390 },
      { id: "5.5", name: "차 밖까지 잇는 앱", a: 390, b: 490 },
      { id: "5.6", name: "조감 상승(도면)", a: 490, b: 560 },
    ],
    opens: { a: 530, b: 560, to: "day" },
  },
  {
    id: "solutions", surface: "day", L: 620, z: 3,
    scenes: [
      { id: "6.1", name: "솔루션 4종 한눈에", a: 0, b: 80 },
      { id: "6.2", name: "AcTrack", a: 80, b: 190 },
      { id: "6.3", name: "Cacago", a: 190, b: 290 },
      { id: "6.4", name: "Smart Zone Cast", a: 290, b: 410 },
      { id: "6.5", name: "Smart Rental", a: 410, b: 520 },
      { id: "6.6", name: "4종을 한 표로", a: 520, b: 620 },
    ],
  },
  {
    id: "process", surface: "day", L: 420, z: 2,
    scenes: [
      { id: "7.1", name: "요구 정리·설계·개발", a: 0, b: 120 },
      { id: "7.2", name: "검증·운영, 오래 지키는 사업", a: 120, b: 250 },
      { id: "7.3", name: "기술 인력 97%(신호)", a: 250, b: 420 },
    ],
    opens: { a: 385, b: 420, to: "night" },
  },
  {
    id: "record", surface: "night", L: 340, z: 1,
    scenes: [
      { id: "8.1", name: "103+와 분야별 건수", a: 0, b: 110 },
      { id: "8.2", name: "24+와 고객사", a: 110, b: 240 },
      { id: "8.3", name: "도착(도면)", a: 240, b: 340 },
    ],
    opens: { a: 300, b: 340, to: "day" },
  },
];

export const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map((c) => [c.id, c])) as Record<string, ChapterDef>;

/** 원형 열림 뒤에 이어지는 장(8장 뒤는 문의) */
export const NEXT_CHAPTER: Record<string, string> = {
  top: "lbs",
  lbs: "history",
  history: "finance",
  finance: "mobility",
  mobility: "solutions",
  solutions: "process",
  process: "record",
  record: "contact",
};

/** 챕터 안 진행(svh)에서의 바탕: 원형 열림이 절반을 넘으면 다음 바탕 */
export function surfaceAt(ch: ChapterDef, p: number): Surface {
  if (ch.opens && p >= (ch.opens.a + ch.opens.b) / 2) return ch.opens.to;
  return ch.surface;
}

/** 챕터 안 진행(svh)에서 헤더·레일이 가리킬 장: 원형 열림이 절반을 넘으면 다음 장 */
export function chapterAt(ch: ChapterDef, p: number): string {
  if (ch.opens && p >= (ch.opens.a + ch.opens.b) / 2) return NEXT_CHAPTER[ch.id] ?? ch.id;
  return ch.id;
}

/** 챕터 섹션의 --L·--z 스타일 */
export function chapterStyle(id: string): Record<string, number> {
  const c = CHAPTER_BY_ID[id];
  return { "--L": c.L, "--z": c.z };
}

/** 8.4 문의는 스테이지 밖 일반 흐름 */
export const CONTACT_SCENE = { id: "8.4", name: "문의" } as const;
