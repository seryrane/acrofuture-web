// 히어로 도식 기하(#510): 서버 SVG(정지 도식)와 캔버스 엔진(입자 흐름)이 같은 좌표를 쓴다.
// viewBox 0 0 W H. 가운데 AI 도입 · A-Flow 원, 안쪽 궤도에 세 사업 측점, 바깥 궤도에 A-Flow 결과(화면 · API · DB).
// 세 사업은 위 · 왼쪽 아래 · 오른쪽 아래, 결과는 그 사이 세 방향이라 바퀴살 여섯이 번갈아 «들어옴(사업) · 나감(결과)» 이다.

export const W = 600;
export const H = 560;
export const CX = 300;
export const CY = 282;
export const R_NODE = 158; // 세 사업 측점 궤도
export const R_OUT = 246; // 결과 궤도
export const R_CORE = 74; // 가운데 원

export type Field = "lbs" | "mob" | "fin";

export const NODES: readonly { field: Field; label: string; a: number }[] = [
  { field: "lbs", label: "위치", a: -90 },
  { field: "mob", label: "모빌리티", a: 150 },
  { field: "fin", label: "금융", a: 30 },
];

export const OUTS: readonly { label: string; a: number }[] = [
  { label: "화면", a: -30 },
  { label: "API", a: 90 },
  { label: "DB", a: 210 },
];

export const at = (a: number, r: number) => {
  const t = (a * Math.PI) / 180;
  return { x: Math.round((CX + r * Math.cos(t)) * 10) / 10, y: Math.round((CY + r * Math.sin(t)) * 10) / 10 };
};
