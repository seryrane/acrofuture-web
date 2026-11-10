"use client";

// A-Flow 영상(제어형): 포스터 먼저, 누르면 재생. preload="none" 이라 누르기 전에는 영상 파일을 받지 않고, 자동 재생은 없다.
// 재생 · 장 이동은 AflowStage 가 맡는다(역할 탭 = 장 바로 가기). 크기는 width · height 속성 + aspect-ratio 로 미리 잡아 CLS 0.

import type { RefObject } from "react";
import { aflow } from "@/lib/facts";
import { Icon } from "../Icon";
import s from "./Solutions.module.css";

export function AflowVideo({
  vref,
  started,
  onPlay,
  fromName,
}: {
  vref: RefObject<HTMLVideoElement | null>;
  started: boolean;
  onPlay: () => void;
  fromName: string | null;
}) {
  const v = aflow.video;
  const label = fromName ? `A-Flow 소개 영상, ${fromName} ${v.playFrom}` : v.play;

  return (
    <figure className={s.video} data-k="video">
      <div className={s.videoBox}>
        <video
          ref={vref}
          className={s.videoEl}
          src={v.src}
          poster={v.poster}
          preload="none"
          controls={started}
          playsInline
          aria-label={v.posterAlt}
          width={1152}
          height={720}
        />
        {started ? null : (
          <button type="button" className={s.playBtn} onClick={onPlay} aria-label={label}>
            {fromName ? (
              <span className={s.playFrom} aria-hidden="true">
                {fromName} {v.playFrom}
              </span>
            ) : null}
            <span className={s.playIcon} aria-hidden="true">
              <Icon name="play" size={22} />
            </span>
          </button>
        )}
      </div>
      <figcaption className="meta">{v.tag}</figcaption>
    </figure>
  );
}
