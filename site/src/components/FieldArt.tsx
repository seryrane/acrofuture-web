'use client'

import { useEffect, useRef } from 'react'

/**
 * 배경 그림 — **이 회사가 하는 일에서 가져온 소재**다: 좌표 격자, 직각으로 꺾이는 경로,
 * 정확히 찍힌 측위점. 장식이 아니라 주제다.
 *
 * ⚠ 지금 사이트의 육각형·회로 그래픽은 어느 IT 회사에나 붙는 그림이라 걷어냈다.
 * ⚠ 그림 파일 대신 캔버스로 그리는 이유: 어느 크기에서도 또렷하고(레티나), 무게가 0 이며,
 *   사진 저작권 문제가 없다. 값은 seed 로 정해져 새로고침해도 같은 그림이 나온다.
 */
export function FieldArt({ seed = 1, dense = false, className = '' }: { seed?: number; dense?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = cv.clientWidth
      const h = cv.clientHeight
      if (!w || !h) return
      cv.width = w * dpr
      cv.height = h * dpr
      const c = cv.getContext('2d')
      if (!c) return
      c.setTransform(dpr, 0, 0, dpr, 0, 0)

      const g = c.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, '#050810')
      g.addColorStop(0.55, '#0a1526')
      g.addColorStop(1, '#07111f')
      c.fillStyle = g
      c.fillRect(0, 0, w, h)

      let s = seed * 7919
      const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296

      c.strokeStyle = 'rgba(120,160,215,.07)'
      c.lineWidth = 1
      const step = dense ? 46 : 62
      for (let x = 0; x < w; x += step) {
        c.beginPath()
        c.moveTo(x, 0)
        c.lineTo(x, h)
        c.stroke()
      }
      for (let y = 0; y < h; y += step) {
        c.beginPath()
        c.moveTo(0, y)
        c.lineTo(w, y)
        c.stroke()
      }

      for (let r = 0; r < (dense ? 5 : 3); r += 1) {
        let x = -20
        let y = h * (0.2 + rnd() * 0.6)
        c.beginPath()
        c.moveTo(x, y)
        while (x < w + 20) {
          x += 60 + rnd() * 150
          c.lineTo(x, y)
          if (rnd() > 0.35) {
            y = Math.max(20, Math.min(h - 20, y + (rnd() - 0.5) * h * 0.34))
            c.lineTo(x, y)
          }
        }
        c.strokeStyle = r % 2 ? 'rgba(31,95,174,.5)' : 'rgba(125,175,240,.26)'
        c.lineWidth = r % 2 ? 1.6 : 1
        c.stroke()
      }

      for (let i = 0; i < (dense ? 9 : 5); i += 1) {
        const px = rnd() * w
        const py = rnd() * h
        c.beginPath()
        c.arc(px, py, 2.4, 0, Math.PI * 2)
        c.fillStyle = 'rgba(145,195,255,.95)'
        c.fill()
        c.beginPath()
        c.arc(px, py, 9 + rnd() * 11, 0, Math.PI * 2)
        c.strokeStyle = 'rgba(145,195,255,.2)'
        c.lineWidth = 1
        c.stroke()
      }
    }

    draw()
    // 리사이즈마다 다시 그리면 끌 때 버벅인다 — 멈춘 뒤 한 번만
    let t: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(draw, 160)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [seed, dense])

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 block h-full w-full ${className}`} />
}
