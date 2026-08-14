/**
 * 솔루션 대시보드 목업 — 2026-08-14 피그마 시안(Version 10)에서 **그대로 옮겼다.**
 *
 * 시안이 스톡 사진을 걷어내고 사업 내용에 맞춰 직접 그린 SVG 라, 형태를 바꾸지 않고 가져온다.
 * 순수 SVG 라 의존성이 없고 정적 내보내기에도 그대로 실린다.
 *
 * ⚠ 안에 적힌 숫자(활성 24기기 · -23% 시간 · 12,847 발송 · ₩8.3M)는 **잰 값이 아니라 그림의 일부**다.
 *   화면에서는 이 그림 아래에 "화면 예시" 표기를 달아 실적으로 읽히지 않게 한다
 *   (SolutionsBand.tsx). 표기를 떼지 않는다 — 떼는 순간 없는 실적을 내건 것이 된다.
 * ⚠ 색은 시안 값을 그대로 둔다. 토큰으로 바꾸면 목업이 배경에 묻혀 "화면처럼" 보이지 않는다.
 */
export function AcTrackMockup() {
  return (
    <svg viewBox="0 0 560 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* BG */}
      <rect width="560" height="380" rx="12" fill="#0a1128"/>
      {/* Grid lines */}
      {[60,120,180,240,300].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="rgba(68,114,245,0.06)" strokeWidth="1"/>)}
      {[80,160,240,320,400,480].map(x=><line key={x} x1={x} y1="0" x2={x} y2="380" stroke="rgba(68,114,245,0.06)" strokeWidth="1"/>)}

      {/* Map base */}
      <rect x="16" y="48" width="340" height="316" rx="10" fill="#0d1730"/>
      {/* Road grid on map */}
      <line x1="16" y1="150" x2="356" y2="150" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
      <line x1="16" y1="240" x2="356" y2="240" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
      <line x1="120" y1="48" x2="120" y2="364" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
      <line x1="240" y1="48" x2="240" y2="364" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
      {/* Zone circle */}
      <circle cx="186" cy="200" r="80" stroke="#4472f5" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6"/>
      <circle cx="186" cy="200" r="80" fill="#4472f5" fillOpacity="0.05"/>
      <circle cx="186" cy="200" r="50" stroke="#4472f5" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
      {/* Zone label */}
      <rect x="140" y="136" width="92" height="22" rx="11" fill="#4472f5" fillOpacity="0.18"/>
      <text x="186" y="151" textAnchor="middle" fill="#7ca0ff" fontSize="10" fontFamily="sans-serif" fontWeight="700">ZONE A</text>
      {/* Route path */}
      <path d="M80 290 Q120 260 160 240 Q200 220 186 200" stroke="#4472f5" strokeWidth="2" strokeDasharray="5 3" opacity="0.7"/>
      {/* Vehicles */}
      <circle cx="80" cy="290" r="7" fill="#4472f5"/>
      <circle cx="80" cy="290" r="12" stroke="#4472f5" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
      <text x="80" y="293" textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif" fontWeight="800">T1</text>
      <circle cx="230" cy="170" r="7" fill="#10b981"/>
      <circle cx="230" cy="170" r="12" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
      <text x="230" y="173" textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif" fontWeight="800">T2</text>
      <circle cx="140" cy="310" r="7" fill="#f59e0b"/>
      <text x="140" y="313" textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif" fontWeight="800">T3</text>
      {/* Map pin */}
      <ellipse cx="186" cy="206" rx="6" ry="2" fill="#4472f5" fillOpacity="0.3"/>
      <path d="M186 200 C186 190 176 185 176 193 C176 200 186 210 186 210 C186 210 196 200 196 193 C196 185 186 190 186 200Z" fill="#4472f5"/>
      <circle cx="186" cy="193" r="3" fill="white" fillOpacity="0.8"/>

      {/* Right panel */}
      <rect x="372" y="48" width="172" height="316" rx="10" fill="#0d1730"/>
      {/* Header */}
      <text x="388" y="72" fill="#eef1f8" fontSize="12" fontFamily="sans-serif" fontWeight="700">실시간 추적 현황</text>
      <rect x="388" y="82" width="140" height="1" fill="rgba(255,255,255,0.07)"/>
      {/* Stat boxes */}
      {[
        { label: '활성 기기', val: '24', sub: '/ 30 전체', color: '#4472f5', y: 100 },
        { label: '이동중', val: '18', sub: '기기', color: '#10b981', y: 148 },
        { label: '존 이탈', val: '2', sub: '알림 발송', color: '#f59e0b', y: 196 },
      ].map(s => (
        <g key={s.y}>
          <rect x="388" y={s.y} width="140" height="38" rx="8" fill={`${s.color}12`}/>
          <rect x="388" y={s.y} width="3" height="38" rx="1.5" fill={s.color}/>
          <text x="400" y={s.y + 14} fill="rgba(180,196,230,0.55)" fontSize="9" fontFamily="sans-serif">{s.label}</text>
          <text x="400" y={s.y + 29} fill={s.color} fontSize="18" fontFamily="sans-serif" fontWeight="800">{s.val}</text>
          <text x={400 + s.val.length * 11} y={s.y + 29} fill="rgba(180,196,230,0.4)" fontSize="9" fontFamily="sans-serif">{s.sub}</text>
        </g>
      ))}
      {/* Mini chart */}
      <text x="388" y="260" fill="rgba(180,196,230,0.55)" fontSize="9" fontFamily="sans-serif">이동 이력 (24h)</text>
      <polyline points="388,310 406,295 424,300 442,280 460,285 478,268 496,275 514,255 532,260" stroke="#4472f5" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="388,310 406,295 424,300 442,280 460,285 478,268 496,275 514,255 532,260 532,330 388,330" fill="url(#actrack-grad)" fillOpacity="0.25"/>
      <defs><linearGradient id="actrack-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4472f5"/><stop offset="100%" stopColor="#4472f5" stopOpacity="0"/></linearGradient></defs>
      {/* Push alert */}
      <rect x="388" y="333" width="140" height="24" rx="8" fill="rgba(68,114,245,0.2)" stroke="rgba(68,114,245,0.4)" strokeWidth="1"/>
      <circle cx="400" cy="345" r="4" fill="#4472f5"/>
      <text x="410" y="349" fill="#7ca0ff" fontSize="9" fontFamily="sans-serif" fontWeight="600">T1 Zone A 진입 감지</text>

      {/* Top bar */}
      <rect width="560" height="44" rx="0" fill="#080f22"/>
      <rect x="0" y="43" width="560" height="1" fill="rgba(255,255,255,0.07)"/>
      <circle cx="22" cy="22" r="10" fill="#4472f5" fillOpacity="0.2"/>
      <path d="M22 22 C22 17 17 14 17 18 C17 22 22 28 22 28 C22 28 27 22 27 18 C27 14 22 17 22 22Z" fill="#4472f5"/>
      <circle cx="22" cy="18" r="2.5" fill="white" fillOpacity="0.9"/>
      <text x="38" y="26" fill="#eef1f8" fontSize="13" fontFamily="sans-serif" fontWeight="700">AcTrack</text>
      <text x="100" y="26" fill="rgba(180,196,230,0.4)" fontSize="10" fontFamily="sans-serif">실시간 위치추적 플랫폼</text>
      <circle cx="520" cy="22" r="6" fill="#10b981" fillOpacity="0.2"/>
      <circle cx="520" cy="22" r="4" fill="#10b981"/>
      <text x="532" y="26" fill="#34d399" fontSize="10" fontFamily="sans-serif" fontWeight="600">LIVE</text>
    </svg>
  )
}

export function CacagoMockup() {
  return (
    <svg viewBox="0 0 560 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="560" height="380" rx="12" fill="#0c0a1a"/>
      {/* BG grid */}
      {[60,120,180,240,300].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="rgba(124,58,237,0.06)" strokeWidth="1"/>)}
      {[80,160,240,320,400,480].map(x=><line key={x} x1={x} y1="0" x2={x} y2="380" stroke="rgba(124,58,237,0.06)" strokeWidth="1"/>)}
      {/* Top bar */}
      <rect width="560" height="44" fill="#0d0b1e"/>
      <rect x="0" y="43" width="560" height="1" fill="rgba(255,255,255,0.07)"/>
      <rect x="12" y="14" width="16" height="16" rx="4" fill="#7c3aed" fillOpacity="0.3"/>
      <path d="M14 22h12M14 18h8" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="34" y="26" fill="#eef1f8" fontSize="13" fontFamily="sans-serif" fontWeight="700">Cacago</text>
      <text x="92" y="26" fill="rgba(180,196,230,0.4)" fontSize="10" fontFamily="sans-serif">스마트 물류 배차 플랫폼</text>
      {/* Status pills */}
      {[{l:'배차완료',c:'#10b981',x:380},{l:'이동중',c:'#f59e0b',x:444},{l:'지연',c:'#ef4444',x:496}].map(s=>(
        <g key={s.x}>
          <rect x={s.x} y="14" width={s.x===496?40:52} height="16" rx="8" fill={`${s.c}20`}/>
          <text x={s.x+(s.x===496?20:26)} y="25" textAnchor="middle" fill={s.c} fontSize="9" fontFamily="sans-serif" fontWeight="700">{s.l}</text>
        </g>
      ))}

      {/* Main content */}
      {/* Route map area */}
      <rect x="16" y="54" width="340" height="200" rx="10" fill="#100e20"/>
      {/* Road network */}
      <path d="M60 180 L180 120 L300 140 L340 110" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round"/>
      <path d="M16 220 L100 200 L180 120 L220 150 L280 180 L356 160" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round"/>
      <path d="M130 54 L150 120 L180 200 L200 254" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round"/>
      <path d="M260 54 L270 120 L280 200 L290 254" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round"/>
      {/* Optimal route */}
      <path d="M50 220 Q100 200 180 120 Q240 80 310 100 Q340 110 356 108" stroke="#7c3aed" strokeWidth="3" strokeDasharray="8 4" strokeLinecap="round" opacity="0.9"/>
      {/* Glow on route */}
      <path d="M50 220 Q100 200 180 120 Q240 80 310 100 Q340 110 356 108" stroke="#7c3aed" strokeWidth="8" strokeDasharray="8 4" strokeLinecap="round" opacity="0.15"/>
      {/* Waypoints */}
      {[{cx:50,cy:220,c:'#7c3aed',l:'출발'},{cx:180,cy:120,c:'#f59e0b',l:'경유1'},{cx:310,cy:100,c:'#f59e0b',l:'경유2'},{cx:356,cy:108,c:'#10b981',l:'도착'}].map((p,i)=>(
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r="8" fill={p.c} fillOpacity="0.2"/>
          <circle cx={p.cx} cy={p.cy} r="5" fill={p.c}/>
          <rect x={p.cx-14} y={p.cy-24} width="28" height="14" rx="4" fill="#0d0b1e"/>
          <text x={p.cx} y={p.cy-13} textAnchor="middle" fill={p.c} fontSize="8" fontFamily="sans-serif" fontWeight="700">{p.l}</text>
        </g>
      ))}
      {/* Moving truck */}
      <g transform="translate(200,140)">
        <rect x="-14" y="-9" width="28" height="18" rx="4" fill="#7c3aed" fillOpacity="0.9"/>
        <rect x="-14" y="-9" width="28" height="18" rx="4" stroke="#7c3aed" strokeWidth="1.5" strokeOpacity="0.5"/>
        <text x="0" y="4" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="800">차량3</text>
        <circle cx="-8" cy="10" r="4" fill="#0d0b1e" stroke="#7c3aed" strokeWidth="1.5"/>
        <circle cx="8" cy="10" r="4" fill="#0d0b1e" stroke="#7c3aed" strokeWidth="1.5"/>
      </g>
      {/* Time saving badge */}
      <rect x="230" y="200" width="112" height="40" rx="10" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
      <text x="286" y="218" textAnchor="middle" fill="rgba(180,196,230,0.55)" fontSize="8" fontFamily="sans-serif">최적 경로 절감</text>
      <text x="286" y="236" textAnchor="middle" fill="#10b981" fontSize="16" fontFamily="sans-serif" fontWeight="800">-23% 시간</text>

      {/* Vehicle list */}
      <rect x="16" y="264" width="340" height="100" rx="10" fill="#100e20"/>
      <text x="28" y="282" fill="rgba(180,196,230,0.55)" fontSize="9" fontFamily="sans-serif">배차 현황</text>
      {[
        {id:'KA-0012', status:'이동중', dest:'강남구 역삼동', eta:'12분', sc:'#f59e0b', prog:65},
        {id:'KA-0037', status:'배차완료', dest:'서초구 서초동', eta:'28분', sc:'#10b981', prog:20},
        {id:'KA-0091', status:'이동중', dest:'마포구 합정동', eta:'44분', sc:'#f59e0b', prog:40},
      ].map((v,i)=>(
        <g key={i}>
          <rect x="28" y={290+i*26} width="316" height="20" rx="5" fill="rgba(124,58,237,0.07)"/>
          <text x="36" y={304+i*26} fill="#eef1f8" fontSize="9" fontFamily="sans-serif" fontWeight="700">{v.id}</text>
          <rect x="84" y={295+i*26} width="44" height="12" rx="6" fill={`${v.sc}20`}/>
          <text x="106" y={304+i*26} textAnchor="middle" fill={v.sc} fontSize="8" fontFamily="sans-serif" fontWeight="700">{v.status}</text>
          <text x="140" y={304+i*26} fill="rgba(180,196,230,0.5)" fontSize="9" fontFamily="sans-serif">{v.dest}</text>
          <text x="286" y={304+i*26} fill={v.sc} fontSize="9" fontFamily="sans-serif" fontWeight="700">ETA {v.eta}</text>
          <rect x="328" y={297+i*26} width="10" height="6" rx="2" fill="rgba(255,255,255,0.07)"/>
          <rect x="328" y={297+i*26} width={v.prog/10} height="6" rx="2" fill={v.sc}/>
        </g>
      ))}

      {/* Right stats panel */}
      <rect x="372" y="54" width="172" height="310" rx="10" fill="#100e20"/>
      <text x="388" y="76" fill="#eef1f8" fontSize="11" fontFamily="sans-serif" fontWeight="700">오늘의 지표</text>
      {[
        {l:'총 배차',v:'47건',c:'#7c3aed',y:88},
        {l:'완료',v:'31건',c:'#10b981',y:134},
        {l:'평균 절감',v:'23%',c:'#f59e0b',y:180},
        {l:'비용 절감',v:'₩4.2M',c:'#4472f5',y:226},
      ].map(s=>(
        <g key={s.y}>
          <rect x="384" y={s.y} width="144" height="38" rx="8" fill={`${s.c}0d`}/>
          <rect x="384" y={s.y} width="3" height="38" rx="1.5" fill={s.c}/>
          <text x="396" y={s.y+13} fill="rgba(180,196,230,0.5)" fontSize="8" fontFamily="sans-serif">{s.l}</text>
          <text x="396" y={s.y+30} fill={s.c} fontSize="17" fontFamily="sans-serif" fontWeight="800">{s.v}</text>
        </g>
      ))}
      {/* Mini bar chart */}
      <text x="388" y="288" fill="rgba(180,196,230,0.5)" fontSize="8" fontFamily="sans-serif">주간 배차량</text>
      {[30,45,28,52,41,47,38].map((h,i)=>(
        <rect key={i} x={388+i*20} y={340-h} width="14" height={h} rx="3" fill="#7c3aed" fillOpacity={0.3+i*0.1}/>
      ))}
      {['월','화','수','목','금','토','일'].map((d,i)=>(
        <text key={i} x={395+i*20} y="356" textAnchor="middle" fill="rgba(180,196,230,0.35)" fontSize="8" fontFamily="sans-serif">{d}</text>
      ))}
      <defs><linearGradient id="cac-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/></linearGradient></defs>
    </svg>
  )
}

export function SmartZoneMockup() {
  return (
    <svg viewBox="0 0 560 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="560" height="380" rx="12" fill="#061812"/>
      {/* Grid */}
      {[60,120,180,240,300].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="rgba(16,185,129,0.06)" strokeWidth="1"/>)}
      {[80,160,240,320,400,480].map(x=><line key={x} x1={x} y1="0" x2={x} y2="380" stroke="rgba(16,185,129,0.06)" strokeWidth="1"/>)}
      {/* Top bar */}
      <rect width="560" height="44" fill="#050f0b"/>
      <rect x="0" y="43" width="560" height="1" fill="rgba(255,255,255,0.07)"/>
      <path d="M18 22 C18 14 12 10 12 16 C12 22 18 30 18 30 C18 30 24 22 24 16 C24 10 18 14 18 22Z" fill="#10b981" opacity="0.9"/>
      <circle cx="18" cy="16" r="3" fill="white" fillOpacity="0.9"/>
      <text x="30" y="26" fill="#eef1f8" fontSize="13" fontFamily="sans-serif" fontWeight="700">Smart Zone Cast</text>
      <text x="164" y="26" fill="rgba(180,196,230,0.4)" fontSize="10" fontFamily="sans-serif">지역 Push 마케팅 플랫폼</text>
      <rect x="470" y="12" width="74" height="20" rx="10" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.35)" strokeWidth="1"/>
      <circle cx="482" cy="22" r="4" fill="#10b981"/>
      <circle cx="482" cy="22" r="7" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" opacity="0.4"/>
      <text x="492" y="26" fill="#34d399" fontSize="9" fontFamily="sans-serif" fontWeight="700">실시간 송출중</text>

      {/* Zone map */}
      <rect x="16" y="54" width="330" height="240" rx="10" fill="#08150e"/>
      {/* Map roads */}
      <line x1="16" y1="160" x2="346" y2="160" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
      <line x1="16" y1="230" x2="346" y2="230" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
      <line x1="110" y1="54" x2="110" y2="294" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
      <line x1="230" y1="54" x2="230" y2="294" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
      {/* Zones */}
      <ellipse cx="170" cy="170" rx="90" ry="70" fill="#10b981" fillOpacity="0.08" stroke="#10b981" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.8"/>
      <ellipse cx="170" cy="170" rx="60" ry="46" fill="#10b981" fillOpacity="0.05" stroke="#10b981" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
      <rect x="128" y="115" width="84" height="20" rx="10" fill="#10b981" fillOpacity="0.18"/>
      <text x="170" y="129" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="sans-serif" fontWeight="700">강남 메인 ZONE</text>
      {/* Small secondary zones */}
      <ellipse cx="310" cy="240" rx="30" ry="24" fill="#4472f5" fillOpacity="0.07" stroke="#4472f5" strokeWidth="1" strokeDasharray="4 3" opacity="0.6"/>
      <text x="310" y="244" textAnchor="middle" fill="#7ca0ff" fontSize="8" fontFamily="sans-serif" fontWeight="600">역삼</text>
      <ellipse cx="55" cy="100" rx="26" ry="22" fill="#f59e0b" fillOpacity="0.07" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity="0.6"/>
      <text x="55" y="103" textAnchor="middle" fill="#fbbf24" fontSize="8" fontFamily="sans-serif" fontWeight="600">서초</text>
      {/* User dots inside zone */}
      {[[150,155],[175,170],[160,185],[185,160],[200,175],[165,165],[180,185]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill="#10b981" fillOpacity={0.5+i*0.07}/>
      ))}
      {/* Push wave animation representation */}
      <circle cx="170" cy="170" r="90" stroke="#10b981" strokeWidth="1" opacity="0.2" strokeDasharray="3 6"/>
      <circle cx="170" cy="170" r="110" stroke="#10b981" strokeWidth="0.5" opacity="0.1" strokeDasharray="2 8"/>
      {/* Push notification popup */}
      <rect x="40" y="54" width="140" height="56" rx="10" fill="#111" stroke="rgba(16,185,129,0.4)" strokeWidth="1"/>
      <rect x="40" y="54" width="140" height="56" rx="10" fill="rgba(16,185,129,0.08)"/>
      <rect x="48" y="64" width="28" height="28" rx="7" fill="#10b981" fillOpacity="0.2"/>
      <text x="62" y="82" textAnchor="middle" fill="#10b981" fontSize="14">☕</text>
      <text x="84" y="74" fill="#eef1f8" fontSize="9" fontFamily="sans-serif" fontWeight="700">특별 할인 쿠폰 🎉</text>
      <text x="84" y="86" fill="rgba(180,196,230,0.6)" fontSize="8" fontFamily="sans-serif">지금 매장 근처에 계신가요?</text>
      <text x="84" y="98" fill="#34d399" fontSize="8" fontFamily="sans-serif" fontWeight="600">30% 할인 → 지금 받기</text>

      {/* Campaign stats below map */}
      <rect x="16" y="302" width="330" height="52" rx="10" fill="#08150e"/>
      {[
        {l:'오늘 발송',v:'12,847',c:'#10b981'},
        {l:'오픈율',v:'38.4%',c:'#4472f5'},
        {l:'전환율',v:'12.1%',c:'#f59e0b'},
        {l:'매출 기여',v:'₩8.3M',c:'#a78bfa'},
      ].map((s,i)=>(
        <g key={i}>
          <text x={36+i*82} y="323" fill="rgba(180,196,230,0.5)" fontSize="8" fontFamily="sans-serif">{s.l}</text>
          <text x={36+i*82} y="343" fill={s.c} fontSize="13" fontFamily="sans-serif" fontWeight="800">{s.v}</text>
        </g>
      ))}

      {/* Right panel: campaign manager */}
      <rect x="362" y="54" width="182" height="300" rx="10" fill="#08150e"/>
      <text x="378" y="76" fill="#eef1f8" fontSize="11" fontFamily="sans-serif" fontWeight="700">캠페인 관리</text>
      {[
        {name:'강남 커피 프로모',status:'송출중',sent:'4.2k',open:'41%',c:'#10b981',y:88},
        {name:'서초 점심 특가',status:'예약됨',sent:'—',open:'—',c:'#f59e0b',y:152},
        {name:'역삼 저녁 이벤트',status:'초안',sent:'—',open:'—',c:'rgba(180,196,230,0.3)',y:216},
      ].map(c=>(
        <g key={c.y}>
          <rect x="374" y={c.y} width="158" height="56" rx="9" fill={`${c.c}0c`} stroke={`${c.c}22`} strokeWidth="1"/>
          <rect x="374" y={c.y} width="3" height="56" rx="1.5" fill={c.c}/>
          <text x="384" y={c.y+16} fill="#eef1f8" fontSize="9" fontFamily="sans-serif" fontWeight="600">{c.name}</text>
          <rect x="384" y={c.y+22} width={c.status.length*8} height="13" rx="6" fill={`${c.c}20`}/>
          <text x={384+c.status.length*4} y={c.y+32} textAnchor="middle" fill={c.c} fontSize="8" fontFamily="sans-serif" fontWeight="700">{c.status}</text>
          <text x="384" y={c.y+49} fill="rgba(180,196,230,0.45)" fontSize="8" fontFamily="sans-serif">발송 {c.sent}  오픈율 {c.open}</text>
        </g>
      ))}
      {/* Add campaign button */}
      <rect x="374" y="286" width="158" height="32" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
      <text x="453" y="306" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="sans-serif" fontWeight="700">+ 캠페인 추가</text>
      {/* Hourly bar chart */}
      <text x="378" y="335" fill="rgba(180,196,230,0.45)" fontSize="8" fontFamily="sans-serif">시간대별 발송</text>
      {[8,14,22,38,52,44,30,18].map((h,i)=>(
        <rect key={i} x={378+i*19} y={370-h} width="14" height={h} rx="2" fill="#10b981" fillOpacity={0.25+i*0.06}/>
      ))}
      <defs><linearGradient id="szc-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient></defs>
    </svg>
  )
}


/**
 * Smart Rental — 시안에 없어서 **같은 화법으로 새로 그렸다.**
 * 이동 자산의 대여·반납·회수를 한 대장에서 보는 화면이다. 색만 다르고 구조(상단 바 · 좌 목록 ·
 * 우 현황판 · 하단 차트)는 나머지 셋과 맞춰 두었다 — 탭을 넘길 때 화면이 튀지 않게.
 */
export function SmartRentalMockup() {
  const ASSETS = [
    { id: 'RN-2041', name: '지게차 · 3.0t', place: '평택 1창고', status: '대여중', c: '#06b6d4', y: 92 },
    { id: 'RN-2077', name: '고소작업대', place: '인천 2창고', status: '반납예정', c: '#f59e0b', y: 148 },
    { id: 'RN-2103', name: '냉동 컨테이너', place: '부산 신항', status: '점검', c: '#a78bfa', y: 204 },
    { id: 'RN-2119', name: '전동 파렛트', place: '평택 1창고', status: '회수완료', c: '#10b981', y: 260 },
  ]
  return (
    <svg viewBox="0 0 560 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="560" height="380" rx="12" fill="#06121a"/>
      {[60,120,180,240,300].map(y=><line key={y} x1="0" y1={y} x2="560" y2={y} stroke="rgba(6,182,212,0.06)" strokeWidth="1"/>)}
      {[80,160,240,320,400,480].map(x=><line key={x} x1={x} y1="0" x2={x} y2="380" stroke="rgba(6,182,212,0.06)" strokeWidth="1"/>)}

      {/* 자산 목록 */}
      <rect x="16" y="56" width="340" height="308" rx="10" fill="#08171f"/>
      <text x="30" y="78" fill="rgba(180,214,230,0.55)" fontSize="9" fontFamily="sans-serif">대여 자산 대장</text>
      {ASSETS.map(a => (
        <g key={a.id}>
          <rect x="30" y={a.y} width="312" height="46" rx="8" fill={`${a.c}0c`} stroke={`${a.c}20`} strokeWidth="1"/>
          <rect x="30" y={a.y} width="3" height="46" rx="1.5" fill={a.c}/>
          <text x="44" y={a.y+19} fill="#eaf6fb" fontSize="10" fontFamily="sans-serif" fontWeight="700">{a.name}</text>
          <text x="44" y={a.y+34} fill="rgba(180,214,230,0.45)" fontSize="8" fontFamily="sans-serif">{a.id} · {a.place}</text>
          <rect x={244} y={a.y+14} width="84" height="18" rx="9" fill={`${a.c}22`}/>
          <text x={286} y={a.y+27} textAnchor="middle" fill={a.c} fontSize="9" fontFamily="sans-serif" fontWeight="700">{a.status}</text>
        </g>
      ))}

      {/* 현황판 */}
      <rect x="372" y="56" width="172" height="308" rx="10" fill="#08171f"/>
      <text x="388" y="78" fill="#eaf6fb" fontSize="12" fontFamily="sans-serif" fontWeight="700">오늘의 현황</text>
      <rect x="388" y="88" width="140" height="1" fill="rgba(255,255,255,0.07)"/>
      {[
        { label: '대여중', val: '38', sub: '/ 52 보유', color: '#06b6d4', y: 104 },
        { label: '반납예정', val: '7', sub: '건 · 오늘', color: '#f59e0b', y: 152 },
        { label: '회수완료', val: '11', sub: '건 · 이번주', color: '#10b981', y: 200 },
      ].map(s => (
        <g key={s.y}>
          <rect x="388" y={s.y} width="140" height="38" rx="8" fill={`${s.color}12`}/>
          <rect x="388" y={s.y} width="3" height="38" rx="1.5" fill={s.color}/>
          <text x="400" y={s.y+14} fill="rgba(180,214,230,0.55)" fontSize="9" fontFamily="sans-serif">{s.label}</text>
          <text x="400" y={s.y+29} fill={s.color} fontSize="18" fontFamily="sans-serif" fontWeight="800">{s.val}</text>
          <text x={400 + s.val.length * 11} y={s.y+29} fill="rgba(180,214,230,0.4)" fontSize="9" fontFamily="sans-serif">{s.sub}</text>
        </g>
      ))}
      <text x="388" y="262" fill="rgba(180,214,230,0.55)" fontSize="9" fontFamily="sans-serif">주간 가동률</text>
      {[26,34,30,42,48,38,44].map((h,i)=>(
        <rect key={i} x={388+i*20} y={340-h} width="14" height={h} rx="2" fill="#06b6d4" fillOpacity={0.28+i*0.07}/>
      ))}
      {['월','화','수','목','금','토','일'].map((d,i)=>(
        <text key={d} x={395+i*20} y="354" textAnchor="middle" fill="rgba(180,214,230,0.4)" fontSize="7" fontFamily="sans-serif">{d}</text>
      ))}

      {/* 상단 바 */}
      <rect width="560" height="44" fill="#051016"/>
      <rect x="0" y="43" width="560" height="1" fill="rgba(255,255,255,0.07)"/>
      <rect x="12" y="14" width="16" height="16" rx="4" fill="#06b6d4" fillOpacity="0.3"/>
      <path d="M16 26h8M16 22h8M16 18h5" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
      <text x="34" y="26" fill="#eaf6fb" fontSize="13" fontFamily="sans-serif" fontWeight="700">Smart Rental</text>
      <text x="128" y="26" fill="rgba(180,214,230,0.4)" fontSize="10" fontFamily="sans-serif">이동 자산 대여·회수 대장</text>
      <circle cx="518" cy="22" r="6" fill="#06b6d4" fillOpacity="0.2"/>
      <circle cx="518" cy="22" r="4" fill="#06b6d4"/>
      <text x="530" y="26" fill="#22d3ee" fontSize="10" fontFamily="sans-serif" fontWeight="600">운영중</text>
    </svg>
  )
}

/**
 * 솔루션 key → 그림과 **그 그림의 바탕색**.
 *
 * 바탕색을 따로 들고 다니는 이유: 판을 이 색으로 칠해 두면 그림이 세로로 남기는 자리(레터박스)가
 * 그림과 이어져 보여서 칸이 통째로 화면처럼 찬다.
 * ⚠ 각 SVG 안 바탕 사각형(`<rect width="560" height="380">`)의 fill 과 **같은 값**이어야 한다.
 *   어긋나면 그림 위아래에 띠가 생긴다.
 */
export const SOLUTION_MOCKUP: Record<string, { C: () => React.JSX.Element; bg: string }> = {
  actrack: { C: AcTrackMockup, bg: '#0a1128' },
  cacago: { C: CacagoMockup, bg: '#0c0a1a' },
  'smart-zone-cast': { C: SmartZoneMockup, bg: '#061812' },
  'smart-rental': { C: SmartRentalMockup, bg: '#06121a' },
}
