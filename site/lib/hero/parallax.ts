// 히어로 도식 시차(#510, acro-hero-parallax). HeroMotion 이 ≥1024 · 정밀 포인터 · 모션 허용일 때만 지연 로드한다.
// 포인터 위치(화면 기준 −1~1)를 따라 층마다 다른 깊이로 옮긴다: 격자(반대로) < 도식 · 흐름 층 < 빛 번짐, 상자는 살짝 기운다.
// 값은 0.1초에 한 번만 쓰고, 따라붙는 부드러움은 CSS transition(transform · translate, 합성 단계)이 맡는다
// (rAF 로 매 프레임 쓰던 처음 판은 마우스가 움직이는 동안 1920 에서 5초 중 약 1.2~1.5초를 메인 스레드에 썼다, docs/R510.md §4).
// 레이아웃을 읽지 않는다. 전환 규칙은 components/v4/Company.module.css «[data-parallax]».

const MARK = "acro-hero-parallax"; // verify.mjs 가 청크를 알아보는 표지
const EVERY_MS = 100;

export function startParallax(box: HTMLElement): () => void {
  const mesh = box.querySelector<HTMLElement>('[data-k="mesh"]');
  const glow = box.querySelector<HTMLElement>('[data-k="glow"]');
  const lift = [box.querySelector<SVGSVGElement>("svg"), box.querySelector<HTMLElement>('[data-k="fx"]')].filter(Boolean) as (HTMLElement | SVGSVGElement)[];
  box.dataset.parallax = MARK;

  let tx = 0;
  let ty = 0;
  let timer = 0;

  const apply = () => {
    timer = 0;
    box.style.transform = `perspective(1400px) rotateY(${(tx * 6).toFixed(2)}deg) rotateX(${(-ty * 5).toFixed(2)}deg)`;
    if (mesh) mesh.style.transform = `translate3d(${(-tx * 14).toFixed(1)}px, ${(-ty * 14).toFixed(1)}px, 0)`;
    if (glow) glow.style.translate = `${(tx * 22).toFixed(1)}px ${(ty * 22).toFixed(1)}px`;
    const t = `translate3d(${(tx * 8).toFixed(1)}px, ${(ty * 8).toFixed(1)}px, 0)`;
    for (const el of lift) el.style.transform = t;
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    tx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
    ty = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
    if (!timer) timer = window.setTimeout(apply, EVERY_MS);
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    window.clearTimeout(timer);
    delete box.dataset.parallax;
    box.style.transform = "";
    if (mesh) mesh.style.transform = "";
    if (glow) glow.style.translate = "";
    for (const el of lift) el.style.transform = "";
  };
}
