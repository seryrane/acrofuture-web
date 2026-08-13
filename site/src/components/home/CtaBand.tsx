import { Rise } from '@/components/Rise'
import { COMPANY } from '@/content/company'

/** 파란 띠 — 시안의 그 자리. 구간이 아니라 **문 하나**라서 여백을 조금 좁게 둔다 */
export function CtaBand() {
  return (
    <section
      className="relative overflow-hidden px-5 py-20 text-center pc:px-10"
      style={{ background: 'linear-gradient(105deg, #1b3ea8 0%, #2f5ce0 45%, #4472f5 100%)' }}
    >
      {/* 오른쪽에서 도는 옅은 원 — 시안의 장식이다. 이미지가 아니라 테두리 하나 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/15 pc:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[4%] top-1/2 hidden h-[260px] w-[260px] -translate-y-1/2 rounded-full border border-white/12 pc:block"
      />

      <Rise className="relative mx-auto max-w-[1280px]">
        <h2 className="text-[clamp(23px,5vw,38px)] font-extrabold leading-[1.35] tracking-[-0.02em] text-white">
          프로젝트를 준비하고 계신가요?
        </h2>
        <p className="mt-4 text-[16px] leading-[1.8] text-white/85">
          필요하신 범위와 일정만 알려 주시면, 저희가 수행해 온 사업 중 맞닿는 부분부터 안내해 드리겠습니다.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${COMPANY.email}`}
            className="inline-flex items-center gap-2 rounded-[14px] bg-white px-8 py-3.5 text-[15px] font-bold text-[#1b3ea8] transition-transform hover:-translate-y-0.5"
          >
            {COMPANY.email}
            <span aria-hidden>↗</span>
          </a>
          <a
            href={`tel:${COMPANY.tel.replace(/-/g, '')}`}
            className="inline-flex items-center rounded-[14px] bg-white/15 px-8 py-3.5 font-display text-[15px] font-bold tabular-nums text-white transition-colors hover:bg-white/25"
          >
            {COMPANY.tel}
          </a>
        </div>
      </Rise>
    </section>
  )
}
