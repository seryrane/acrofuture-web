import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { WORDMARK_OUTLINE as W } from "@/lib/wordmark-outline";
import { hero } from "@/lib/facts";

// OG 이미지(4판 #509): 청사진 바탕 #111A33 위 선 격자, 워드마크 + 히어로 제목 두 줄, 오른쪽에 세 사업 측점(분야 색 오차 원) + 가운데 AI · A-Flow.
// 한글은 빌드 때만 Pretendard ExtraBold(devDependency pretendard 의 OTF)를 읽어 그린다(정적 PNG 라 화면 글꼴 · 첫 로드와 무관).
// 워드마크는 Plus Jakarta Sans 800 윤곽선 경로.
export const dynamic = "force-static";
const NBSP = / /g;
const TITLE = [hero.titleBefore.replace(NBSP, " "), hero.titleEm + hero.titleAfter];
export const alt = `acroFuture, ${TITLE.join(" ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#111A33";
const GRID = "#18223F";
const GRID_MAJOR = "#223158";
const BLUE = "#5B8CFF";
const LEAF = "#A7E04B";
const MUTED = "#9AA7C2";
const INK = "#EEF1F8";
const BLUE_HI = "#6F92FF";
const FIELD = { lbs: "#3FC0E6", mob: "#9A86F7", fin: "#5B8CFF" } as const;

function wordmarkSvg(): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.width} ${W.height}">` +
    `<path fill="${BLUE}" d="${W.acro}"/><path fill="${LEAF}" d="${W.f}"/><path fill="${BLUE}" d="${W.uture}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default function OpengraphImage() {
  const grid = [];
  for (let x = 0; x <= 1200; x += 48) {
    const major = x % 240 === 0;
    grid.push(
      <div key={`x${x}`} style={{ position: "absolute", left: x, top: 0, width: 1, height: 630, background: major ? GRID_MAJOR : GRID }} />,
    );
  }
  for (let y = 3; y <= 630; y += 48) {
    const major = (y - 3) % 240 === 0;
    grid.push(
      <div key={`y${y}`} style={{ position: "absolute", left: 0, top: y, width: 1200, height: 1, background: major ? GRID_MAJOR : GRID }} />,
    );
  }
  const cx = 930;
  const cy = 330;
  const R = 150;
  const ring = (x: number, y: number, r: number, color: string, w = 2) => (
    <div
      key={`${x}-${y}-${r}`}
      style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `${w}px solid ${color}` }}
    />
  );
  const nodes = [
    { k: "lbs", label: "위치", a: -90 },
    { k: "mob", label: "모빌리티", a: 150 },
    { k: "fin", label: "금융", a: 30 },
  ] as const;
  const wmH = 64;
  const wmW = Math.round((W.width / W.height) * wmH);
  const font = readFileSync(join(process.cwd(), "node_modules/pretendard/dist/public/static/Pretendard-ExtraBold.otf"));
  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", background: BG, fontFamily: "Pretendard" }}>
        {grid}
        {ring(cx, cy, R, "#243666")}
        {nodes.map((n) => {
          const t = (n.a * Math.PI) / 180;
          const x = cx + R * Math.cos(t);
          const y = cy + R * Math.sin(t);
          return [
            ring(x, y, 40, `${FIELD[n.k]}55`),
            ring(x, y, 24, FIELD[n.k]),
            <div key={`d${n.k}`} style={{ position: "absolute", left: x - 8, top: y - 8, width: 16, height: 16, borderRadius: "50%", background: FIELD[n.k] }} />,
            <div
              key={`t${n.k}`}
              style={{ position: "absolute", left: x - 100, width: 200, top: n.a > 0 ? y + 46 : y - 86, display: "flex", justifyContent: "center", fontSize: 30, color: INK }}
            >
              {n.label}
            </div>,
          ];
        })}
        <div
          style={{
            position: "absolute",
            left: cx - 66,
            top: cy - 66,
            width: 132,
            height: 132,
            borderRadius: "50%",
            background: "#1A2A57",
            border: `2px solid ${BLUE}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 24, color: INK }}>AI 도입</div>
          <div style={{ fontSize: 24, color: LEAF }}>A-Flow</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 150,
            display: "flex",
            flexDirection: "column",
            padding: "24px 32px 24px 0",
            background: BG,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmarkSvg()} width={wmW} height={wmH} alt="" />
          <div style={{ display: "flex", flexDirection: "column", marginTop: 36, fontSize: 52, lineHeight: 1.25, color: INK, letterSpacing: "-0.03em" }}>
            <div>{TITLE[0]}</div>
            <div style={{ display: "flex" }}>
              <span style={{ color: BLUE_HI }}>{hero.titleEm}</span>
              <span>{hero.titleAfter}</span>
            </div>
          </div>
          <div style={{ fontSize: 24, color: MUTED, marginTop: 28 }}>SINCE 2009 · Mobile Future in Reality</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Pretendard", data: font, weight: 800, style: "normal" }] },
  );
}
