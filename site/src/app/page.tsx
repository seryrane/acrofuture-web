import { AboutBand } from '@/components/home/AboutBand'
import { BusinessAreas } from '@/components/home/BusinessAreas'
import { ContactBand } from '@/components/home/ContactBand'
import { Credibility } from '@/components/home/Credibility'
import { CtaBand } from '@/components/home/CtaBand'
import { Hero } from '@/components/home/Hero'
import { Showcase } from '@/components/home/Showcase'
import { SolutionsBand } from '@/components/home/SolutionsBand'
import { WorkBand } from '@/components/home/WorkBand'

/**
 * 홈 — 한 페이지 스크롤.
 *
 * 순서에 뜻이 있다: **누구인가(hero·about) → 무엇을 하는가(business) → 진짜 했는가(showcase) →
 * 우리 물건은 무엇인가(solutions) → 얼마나 했는가(work) → 남이 인정했는가(credibility) → 연락**.
 * ⚠ 증거(showcase·credibility)를 주장(business·solutions) **뒤에** 두는 이 순서를 바꾸지 않는다.
 *   증거가 먼저 나오면 무엇에 대한 증거인지 모른 채 보게 된다.
 * ⚠ 어두운 구간과 밝은 구간이 번갈아 온다(deep → light → deep → raised → light → deep → raised).
 *   같은 톤이 두 번 이어지면 그 사이에서 구간이 끝난 줄 모른다.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <AboutBand />
      <BusinessAreas />
      <Showcase />
      <SolutionsBand />
      <WorkBand />
      <Credibility />
      <CtaBand />
      <ContactBand />
    </>
  )
}
