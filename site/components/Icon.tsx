// 직접 그린 인라인 SVG 아이콘 10종. 24×24 격자, 선 굵기 1.5px 하나, 채움 없음, currentColor.

export type IconName =
  | "external"
  | "arrowDown"
  | "mail"
  | "phone"
  | "menu"
  | "close"
  | "sun"
  | "moon"
  | "pause"
  | "play";

const paths: Record<IconName, string[]> = {
  external: ["M7 17 L17 7", "M9.5 7 H17 V14.5"],
  arrowDown: ["M12 4 V19", "M6.5 13.5 L12 19 L17.5 13.5"],
  mail: ["M3.5 6 H20.5 V18 H3.5 Z", "M3.5 6 L12 12.5 L20.5 6"],
  phone: ["M8 3 H16 V21 H8 Z", "M11 17.5 H13"],
  menu: ["M4 9 H20", "M4 15 H20"],
  close: ["M6 6 L18 18", "M18 6 L6 18"],
  sun: [
    "M12 8 A4 4 0 1 1 11.99 8 Z",
    "M12 2.5 V4.5",
    "M12 19.5 V21.5",
    "M2.5 12 H4.5",
    "M19.5 12 H21.5",
    "M5.3 5.3 L6.7 6.7",
    "M17.3 17.3 L18.7 18.7",
    "M5.3 18.7 L6.7 17.3",
    "M17.3 6.7 L18.7 5.3",
  ],
  moon: ["M19.5 14.5 A8 8 0 1 1 9.5 4.5 A6.5 6.5 0 0 0 19.5 14.5 Z"],
  pause: ["M8.5 5 V19", "M15.5 5 V19"],
  play: ["M7 4.5 L19 12 L7 19.5 Z"],
};

type Props = { name: IconName; className?: string; size?: number };

export function Icon({ name, className, size = 24 }: Props) {
  return (
    <svg
      className={className ? `icon ${className}` : "icon"}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
