"use client";

// 트리거형 1회 연출 섬: IntersectionObserver 로 한 번 관측 → data-reveal="done".
// 초기 숨김(data-reveal="pending")은 관측 등록 직후 JS 가 붙인다. JS 가 없거나 모션 감소면 숨기지 않는다.

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  role?: string;
};

export function Reveal({ as: Tag = "div", threshold = 0.25, rootMargin = "0px", children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "done";
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    // 이미 화면 위로 지나간 요소는 숨기지 않는다(되돌아왔을 때 빈 칸 방지)
    if (el.getBoundingClientRect().bottom > 0) el.dataset.reveal = "pending";
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
