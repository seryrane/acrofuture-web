import { captions, finance } from "@/lib/facts";
import { PhoneFrame, Sk } from "../ui/parts";
import "./LoanFlow.css";
import { cls } from "@/lib/cls";

const s = cls("LoanFlow");

const [B1, B2, B3] = finance.loanBranches;
const Y = [70, 180, 290];
const STEPS = [118, 188, 258];

/** 스테이지: 세 갈래(각자 단계 칸 3개)가 뻗고, 한 줄로 겹쳐 모인 뒤 폰으로 들어간다 */
function BranchesLive() {
  return (
    <svg className={s.live} viewBox="0 0 330 360" data-plate="" aria-hidden="true" focusable="false">
      <circle cx="6" cy="180" r="5" fill="var(--fin)" />
      {Y.map((y, i) => (
        <g key={y} data-k="loanBranch">
          <path
            data-k="loanPath"
            d={i === 1 ? "M6 180 H330" : `M6 180 L60 ${y} H330`}
            pathLength={1}
            fill="none"
            stroke="var(--fin)"
            strokeWidth="2"
          />
          {STEPS.map((x) => (
            <rect key={x} x={x - 11} y={y - 11} width="22" height="22" rx="6" fill="var(--s-bg)" stroke="var(--fin)" strokeWidth="1.5" />
          ))}
          <text x="66" y={y - 18} className={s.svgLabel} data-k="loanLabel">
            {[B1, B2, B3][i]}
          </text>
        </g>
      ))}
      <g data-k="onePass">
        <rect x="140" y="126" width="96" height="28" rx="8" fill="var(--card-bg)" stroke="var(--fin)" strokeWidth="1.5" />
        <text x="188" y="145" textAnchor="middle" className={s.svgChip}>
          One Pass
        </text>
      </g>
    </svg>
  );
}

/** 흐름·감소: 세 갈래가 한 줄로 모여 폰으로 들어가는 정지 도판 */
function MergePlate() {
  return (
    <svg className={s.hplate} viewBox="0 0 330 360" data-plate="" aria-hidden="true" focusable="false">
      {Y.map((y, i) => (
        <g key={y}>
          <path d={`M6 ${y} H110 L180 180 H330`} fill="none" stroke="var(--fin)" strokeWidth="2" />
          <rect x={58 - 11} y={y - 11} width="22" height="22" rx="6" fill="var(--paper)" stroke="var(--fin)" strokeWidth="1.5" />
          <text x="6" y={y - 18} className={s.svgLabel}>
            {[B1, B2, B3][i]}
          </text>
        </g>
      ))}
      {[222, 272].map((x) => (
        <rect key={x} x={x - 11} y={169} width="22" height="22" rx="6" fill="var(--paper)" stroke="var(--fin)" strokeWidth="1.5" />
      ))}
      <rect x="200" y="126" width="96" height="28" rx="8" fill="var(--card-bg)" stroke="var(--fin)" strokeWidth="1.5" />
      <text x="248" y="145" textAnchor="middle" className={s.svgChip}>
        One Pass
      </text>
    </svg>
  );
}

/** 폰 화면 3장(스켈레톤, 제목만 FACTS 의 화면 이름) */
function Screens() {
  const [n1, n2, n3] = finance.loanScreens;
  return (
    <div className={s.screens} data-k="loanScreens">
      <div className={s.scr} data-k="loanScr">
        <p className={s.scrTitle}>{n1}</p>
        {[0, 1, 2].map((i) => (
          <div key={i} className={i === 0 ? `${s.prod} ${s.accent}` : s.prod}>
            <span className={s.prodLines}>
              <Sk w={70} strong />
              <Sk w={45} />
            </span>
          </div>
        ))}
        <Sk w={60} style={{ marginTop: 14 }} />
        <Sk w={40} style={{ marginTop: 8 }} />
      </div>
      <div className={s.scr} data-k="loanScr">
        <p className={s.scrTitle}>{n2}</p>
        <Sk w={75} strong />
        <div className={s.choices}>
          <span className={s.choiceOn} />
          <span />
          <span />
        </div>
        <Sk w={55} strong />
        <div className={s.choices}>
          <span />
          <span className={s.choiceOn} />
        </div>
        <div className={s.result}>
          <span className={s.resultBar} />
          <span className={s.prodLines}>
            <Sk w={80} strong />
            <Sk w={55} />
            <Sk w={35} />
          </span>
        </div>
      </div>
      <div className={s.scr} data-k="loanScr">
        <p className={s.scrTitle}>{n3}</p>
        <div className={s.steps}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={n < 3 ? s.stepOn : undefined}>
              {n}
            </span>
          ))}
        </div>
        {[70, 55, 80].map((w, i) => (
          <div key={i} className={s.field}>
            <Sk w={30} />
            <span className={s.input} />
          </div>
        ))}
        <span className={s.submit} />
      </div>
    </div>
  );
}

/**
 * 4.3 대출을 고르고 신청하기까지(One Pass): 세 갈래가 한 줄로 모여 폰 도식으로 들어가고, 폰 안 화면 3장이 차례로 바뀐다.
 * 한 DOM 을 스테이지와 흐름 모드가 함께 쓴다. 흐름·감소에서는 ② "내게 맞는 대출 찾기" 화면으로 정지.
 */
export function LoanFlow() {
  return (
    <div className={`st-shot ${s.loan}`} data-k="loan">
      <div className={s.branches}>
        <BranchesLive />
        <MergePlate />
      </div>
      <div className={s.phoneCol}>
        <p className={s.now} aria-hidden="true">
          {finance.loanScreens.map((n, i) => (
            <span key={n} data-k="loanNow" className={i === 1 ? s.nowOn : undefined}>
              {n}
            </span>
          ))}
        </p>
        <PhoneFrame label={`대출 신청 흐름 ${finance.loanScreens.join(", ")}`} caption={captions.client} k="loanPhone">
          <Screens />
        </PhoneFrame>
      </div>
    </div>
  );
}
