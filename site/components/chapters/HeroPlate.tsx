import { origin } from "@/lib/facts";
import s from "./HeroPlate.module.css";

// 흐름 모드 히어로 도판(모바일·태블릿·모션 감소): 모눈 격자(보조선·주선), 끊은 십자선, 오차 원 3개, 측점.
// viewBox 없이 px 로 그려 격자 간격과 오차 원 반지름이 화면 크기와 무관하다.
export function HeroPlate() {
  // 오차 원 3개: 청사진 #456AC2/#324D8F/#243666, 종이 #7295F6/#A1B8F8/#C6D4F9(DESIGN 3.4)
  const rings = [
    { r: 24, c: "var(--d-ring-1)" },
    { r: 88, c: "var(--d-ring-2)" },
    { r: 220, c: "var(--d-ring-3)" },
  ];
  return (
    <figure className={s.plate}>
      <svg className={s.svg} width="100%" height="100%" data-plate="" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="hp-minor" x="50%" y="50%" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0 H0 V48" fill="none" stroke="var(--grid)" strokeWidth="1" />
          </pattern>
          <pattern id="hp-major" x="50%" y="50%" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M240 0 H0 V240" fill="none" stroke="var(--grid-major)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hp-minor)" />
        <rect width="100%" height="100%" fill="url(#hp-major)" />
        <svg x="50%" y="50%" width="1" height="1" overflow="visible">
          <g stroke="var(--ink-3)" strokeWidth="1">
            <path className={s.crossH} d="M-150 0 H150 M-150 -6 V6 M150 -6 V6" />
            <path className={s.crossV} d="M0 -150 V150 M-6 -150 H6 M-6 150 H6" />
          </g>
          <g fill="none" strokeWidth="1.5">
            {rings.map((ring, i) => (
              <circle key={ring.r} className={s.ring} style={{ animationDelay: `${i * 60}ms` }} r={ring.r} stroke={ring.c} />
            ))}
          </g>
          <g className={s.fix}>
            <circle r="14" fill="var(--paper)" stroke="var(--fix)" strokeWidth="1.5" />
            <circle r="6" fill="var(--fix-core)" />
          </g>
        </svg>
      </svg>
      <figcaption className={`${s.caption} tnum`}>
        <span>{origin.captionOrigin}</span>
        <span>{origin.captionField}</span>
      </figcaption>
    </figure>
  );
}
