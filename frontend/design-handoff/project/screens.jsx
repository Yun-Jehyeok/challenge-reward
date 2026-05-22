// All screens for Challenge Reward app

const screenWidth = 393;

// ─── 0. Splash ───────────────────────────────────────────────────────
function ScreenSplash({ nav }) {
  React.useEffect(() => {
    const t = setTimeout(() => nav.replace('login'), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      flex: 1, background: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: 24,
        background: 'linear-gradient(135deg, #0066FF 0%, #6541F2 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 12px 28px rgba(0,102,255,0.32)'
      }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M22 6L34 22H26V36H18V22H10L22 6Z" fill="#fff" />
        </svg>
      </div>
      <div style={{ font: '800 28px/1.358 var(--font-sans)', letterSpacing: '-0.024em', marginTop: 8 }}>매일챌린지</div>
      <div style={{ font: '500 14px/1.571 var(--font-sans)', color: C.text3 }}>작은 실천이 보상으로</div>
    </div>);

}

// ─── 1. Login ────────────────────────────────────────────────────────
function ScreenLogin({ nav }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', padding: '60px 24px 32px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(135deg, #0066FF 0%, #6541F2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24
        }}>
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
            <path d="M22 6L34 22H26V36H18V22H10L22 6Z" fill="#fff" />
          </svg>
        </div>
        <h1 style={{ font: '800 28px/1.358 var(--font-sans)', letterSpacing: '-0.024em', margin: 0 }}>
          매일의 작은 실천이<br />보상으로 돌아와요
        </h1>
        <p style={{ font: '500 15px/1.6 var(--font-sans)', color: C.text3, margin: '12px 0 0' }}>
          챌린지에 참여하고 인증하면<br />복권과 함께 포인트가 쌓여요
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => nav.push('nickname')} style={{
          height: 52, borderRadius: 12, background: '#FEE500',
          font: '700 16px/1.5 var(--font-sans)', letterSpacing: '-0.002em',
          color: 'rgba(0,0,0,0.85)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <ellipse cx="10" cy="8" rx="9" ry="7.5" fill="#000" />
            <path d="M6.5 12L4.5 16L9 13" fill="#000" />
            <text x="10" y="10" textAnchor="middle" fontSize="6" fontWeight="700" fill="#FEE500" fontFamily="system-ui">talk</text>
          </svg>
          카카오로 3초만에 시작
        </button>
        <div style={{ font: '500 12px/1.5 var(--font-sans)', color: C.text3, textAlign: 'center', marginTop: 12 }}>
          시작하면 <span style={{ color: C.text2, textDecoration: 'underline' }}>이용약관</span> 및{' '}
          <span style={{ color: C.text2, textDecoration: 'underline' }}>개인정보처리방침</span>에 동의하게 돼요
        </div>
      </div>
    </div>);

}

// ─── 2. Nickname setup ───────────────────────────────────────────────
function ScreenNickname({ nav }) {
  const [name, setName] = React.useState('');
  const ok = name.trim().length >= 2;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <AppBar onBack={() => nav.back()} title="" />
      <div style={{ flex: 1, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ font: '700 26px/1.36 var(--font-sans)', letterSpacing: '-0.024em', margin: 0 }}>
          어떻게 불러드릴까요?
        </h1>
        <p style={{ font: '500 15px/1.6 var(--font-sans)', color: C.text3, margin: '8px 0 32px' }}>
          닉네임은 다른 참여자에게 보여요
        </p>
        <label style={{ font: '600 13px/1.385 var(--font-sans)', color: C.text2, marginBottom: 8 }}>닉네임</label>
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="2~10자로 입력해주세요" maxLength={10}
          style={{
            height: 52, padding: '0 16px', borderRadius: 12,
            border: `1px solid ${name ? C.blue : C.line}`,
            font: '500 16px/1.5 var(--font-sans)', outline: 'none',
            background: '#fff'
          }} />
        
        <div style={{
          font: '500 12px/1.334 var(--font-sans)', color: C.text3,
          marginTop: 8, display: 'flex', justifyContent: 'space-between'
        }}>
          <span>한글, 영문, 숫자 입력 가능</span>
          <span>{name.length}/10</span>
        </div>
        <div style={{ flex: 1 }} />
        <Button full disabled={!ok} onClick={() => nav.replace('tabs')}>시작하기</Button>
      </div>
    </div>);

}

// ─── Home ────────────────────────────────────────────────────────────
function ScreenHome({ nav, tweaks }) {
  const u = DATA.user;
  return (
    <div style={{ background: C.bg2, minHeight: '100%' }}>
      <div style={{ background: '#fff', padding: '8px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: '500 13px/1.385 var(--font-sans)', color: C.text3 }}>
              안녕하세요, {u.nickname}님
            </div>
            <h1 style={{ font: '800 24px/1.334 var(--font-sans)', letterSpacing: '-0.023em', margin: '4px 0 0' }}>
              오늘도 잘 하고 있어요
            </h1>
          </div>
          <button onClick={() => nav.push('settings')} style={{
            width: 40, height: 40, borderRadius: 12, border: `1px solid ${C.line}`,
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <Icon name="bell" size={20} color={C.black} />
          </button>
        </div>

        {/* Mini stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
          <MiniStat label="현재 streak" value={`${tweaks.streak}일`} color={C.coral} icon="streak" />
          <MiniStat label="복권" value={`${tweaks.tickets}개`} color={C.yellow} icon="ticket" />
          <MiniStat label="포인트" value={u.points.toLocaleString()} color={C.blue} icon="coin" />
        </div>
      </div>

      {/* 승인 대기 배너 */}
      {tweaks.pending > 0 &&
      <div style={{ padding: '16px 20px 0' }}>
          <button onClick={() => nav.push('pending')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', borderRadius: 14, border: 'none',
          background: C.blueLow, cursor: 'pointer', textAlign: 'left'
        }}>
            <div style={{
            width: 36, height: 36, borderRadius: 10, background: C.blue,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
              <Icon name="document-text" size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: '700 14px/1.4 var(--font-sans)', color: C.blue }}>
                승인 대기 {tweaks.pending}건이 있어요
              </div>
              <div style={{ font: '500 12px/1.4 var(--font-sans)', color: C.text3, marginTop: 2 }}>
                같이 도전하는 사람들의 인증을 확인해주세요
              </div>
            </div>
            <Icon name="search" size={16} color={C.blue} style={{ transform: 'rotate(90deg)' }} />
          </button>
        </div>
      }

      <div style={{ padding: '24px 0 32px' }}>
        <Section title="오늘의 챌린지" action={
        <button onClick={() => nav.setTab('discover')} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          font: '600 13px/1.385 var(--font-sans)', color: C.text3
        }}>전체보기</button>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DATA.myChallenges.map((c) =>
            <ChallengeRow key={c.id} c={c} onClick={() => nav.push('challenge', { id: c.id })} onProof={(e) => {e.stopPropagation();nav.push('upload', { id: c.id });}} />
            )}
          </div>
        </Section>

        <div style={{ height: 28 }} />

        <Section title="추천 챌린지">
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 8px', scrollbarWidth: 'none' }}>
            {DATA.popular.slice(0, 4).map((p) =>
            <button key={p.id} onClick={() => nav.push('challenge', { id: p.id })} style={{
              flexShrink: 0, width: 168, padding: 0, border: 'none', background: 'transparent',
              cursor: 'pointer', textAlign: 'left'
            }}>
                <Photo seed={p.seed} style={{ width: 168, height: 112 }} />
                <div style={{ marginTop: 10 }}>
                  <Chip variant="neutral" size="xs">{p.category}</Chip>
                </div>
                <div style={{ font: '600 14px/1.4 var(--font-sans)', marginTop: 6, color: C.black }}>
                  {p.title}
                </div>
                <div style={{ font: '500 12px/1.4 var(--font-sans)', color: C.text3, marginTop: 4 }}>
                  참여 {p.participants.toLocaleString()}명
                </div>
              </button>
            )}
          </div>
        </Section>
      </div>
    </div>);

}

function MiniStat({ label, value, color, icon }) {
  const glyphs = {
    streak: <svg width="18" height="20" viewBox="0 0 14 17" fill="none"><path d="M7 0.5C7 0.5 3 3.5 3 7.5C3 10 4.5 11 4.5 11C4.5 11 4 10 4 9C4 7.5 5.5 6 5.5 6C5.5 6 5 7 5.5 8C6 9 7 9 7 9C7 9 9 10 9 12C9 13.5 8 14.5 8 14.5C8 14.5 12 14 12 9.5C12 4.5 7 0.5 7 0.5Z" fill={color} /></svg>,
    ticket: <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><path d="M2 1H18V4.5C17 4.5 16 5.5 16 7C16 8.5 17 9.5 18 9.5V13H2V9.5C3 9.5 4 8.5 4 7C4 5.5 3 4.5 2 4.5V1Z" stroke={color} strokeWidth="1.5" /></svg>,
    coin: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke={color} strokeWidth="1.5" /><text x="9" y="12.5" textAnchor="middle" fontSize="9" fontWeight="700" fill={color} fontFamily="system-ui">₩</text></svg>
  };
  return (
    <div style={{
      background: C.bg3, borderRadius: 14, padding: '12px 12px 14px',
      display: 'flex', flexDirection: 'column', gap: 4, justifyContent: "space-between"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {glyphs[icon]}
        <span style={{ font: '500 11px/1.27 var(--font-sans)', letterSpacing: '0.03em', color: C.text3 }}>
          {label}
        </span>
      </div>
      <div style={{ font: '700 18px/1.27 var(--font-sans)', letterSpacing: '-0.005em', color: C.black, padding: "0px" }}>
        {value}
      </div>
    </div>);

}

function ChallengeRow({ c, onClick, onProof }) {
  const progress = (c.total - c.daysLeft) / c.total * 100;
  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 16, padding: 16, cursor: 'pointer',
      border: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', gap: 12
    }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${c.coverColor}, ${c.coverColor}cc)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          font: '700 22px/1 var(--font-sans)'
        }}>{c.title[0]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
            <Chip size="xs" variant="neutral">{c.category}</Chip>
            {c.endingSoon && <Chip size="xs" variant="warning">D-{c.daysLeft}</Chip>}
          </div>
          <div style={{ font: '600 15px/1.4 var(--font-sans)', color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <Streak days={c.streak} />
            <span style={{ font: '500 12px/1 var(--font-sans)', color: C.text3 }}>
              D-{c.daysLeft} · {c.participants}명
            </span>
          </div>
        </div>
      </div>
      <ProgressBar value={progress} color={c.coverColor} />
      {c.todayDone ?
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        height: 40, borderRadius: 10, background: C.greenLow,
        font: '600 14px/1 var(--font-sans)', color: C.green
      }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7L6 11L12 3" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
          오늘 인증 완료
        </div> :

      <button onClick={onProof} style={{
        height: 40, borderRadius: 10, border: 'none', background: C.black,
        font: '600 14px/1 var(--font-sans)', color: '#fff', cursor: 'pointer'
      }}>오늘 인증하기</button>
      }
    </div>);

}

// ─── Discover ────────────────────────────────────────────────────────
function ScreenDiscover({ nav }) {
  const [cat, setCat] = React.useState('전체');
  return (
    <div style={{ background: '#fff', minHeight: '100%' }}>
      <div style={{ padding: '8px 20px 12px' }}>
        <h1 style={{ font: '800 24px/1.334 var(--font-sans)', letterSpacing: '-0.023em', margin: 0 }}>
          탐색
        </h1>
        <div style={{ marginTop: 16, position: 'relative' }}>
          <Icon name="search" size={18} color={C.text3} style={{ position: 'absolute', left: 14, top: 13 }} />
          <input
            placeholder="챌린지 검색"
            style={{
              width: '100%', height: 44, padding: '0 14px 0 42px', borderRadius: 12,
              border: `1px solid ${C.line}`, background: C.bg2,
              font: '500 15px/1.4 var(--font-sans)', outline: 'none', boxSizing: 'border-box'
            }} />
          
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '4px 20px 8px', scrollbarWidth: 'none' }}>
        {DATA.categories.map((c) => {
          const active = cat === c;
          return (
            <button key={c} onClick={() => setCat(c)} style={{
              flexShrink: 0, height: 34, padding: '0 14px', borderRadius: 999,
              border: `1px solid ${active ? C.black : C.line}`,
              background: active ? C.black : '#fff',
              color: active ? '#fff' : C.text2,
              font: '600 13px/1 var(--font-sans)', cursor: 'pointer'
            }}>{c}</button>);

        })}
      </div>

      <div style={{ padding: '16px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ font: '700 16px/1.4 var(--font-sans)' }}>인기 챌린지</div>
          <div style={{ font: '500 12px/1.4 var(--font-sans)', color: C.text3, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="filter" size={14} color={C.text3} />
            인기순
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {DATA.popular.map((p) =>
          <div key={p.id} onClick={() => nav.push('challenge', { id: p.id })} style={{
            display: 'flex', gap: 14, cursor: 'pointer'
          }}>
              <Photo seed={p.seed} style={{ width: 100, height: 100, borderRadius: 14, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                <Chip size="xs" variant="neutral">{p.category}</Chip>
                <div style={{ font: '600 15px/1.4 var(--font-sans)', marginTop: 6, color: C.black }}>
                  {p.title}
                </div>
                <div style={{ font: '500 13px/1.4 var(--font-sans)', color: C.text3, marginTop: 2 }}>
                  {p.creator} · {p.period}
                </div>
                <div style={{
                marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
                font: '600 12px/1 var(--font-sans)', color: C.text2
              }}>
                  <Icon name="person" size={12} color={C.text3} />
                  {p.participants.toLocaleString()}명 참여 중
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => nav.push('create')} style={{
        position: 'absolute', right: 16, bottom: 80, zIndex: 10,
        width: 56, height: 56, borderRadius: 999, border: 'none',
        background: C.black, color: '#fff', cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0,0,0,0.24)',
        display: 'flex',
        font: '300 28px/1 var(--font-sans)', justifyContent: "flex-start", alignItems: "flex-start"
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 4V16M4 10H16" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg>
      </button>
    </div>);

}

// ─── Challenge Detail ───────────────────────────────────────────────
function ScreenChallengeDetail({ nav, ctx }) {
  const c = DATA.challengeDetail;
  const joined = ctx.joined !== false;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ position: 'relative' }}>
        <Photo seed={c.seed} style={{ width: '100%', height: 220, borderRadius: 0 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.45) 100%)'
        }} />
        <button onClick={() => nav.back()} style={{
          position: 'absolute', top: 12, left: 12, width: 40, height: 40, borderRadius: 999,
          background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L6 10l7 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="share" size={18} color="#000" />
          </button>
          <button style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="bookmark" size={18} color="#000" />
          </button>
        </div>
        <div style={{ position: 'absolute', left: 20, bottom: 16, right: 20 }}>
          <Chip size="sm" variant="neutral" style={{ background: 'rgba(255,255,255,0.9)' }}>{c.category}</Chip>
          <h1 style={{ font: '800 24px/1.3 var(--font-sans)', letterSpacing: '-0.023em', color: '#fff', margin: '8px 0 0', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
            {c.title}
          </h1>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '20px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar name={c.creator} size={28} />
            <span style={{ font: '600 13px/1 var(--font-sans)' }}>{c.creator}</span>
            <span style={{ font: '500 12px/1 var(--font-sans)', color: C.text3 }}>· 챌린지 메이커</span>
          </div>
        </div>

        <div style={{ margin: '0 20px', padding: 16, borderRadius: 14, background: C.bg2, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <DetailStat label="참여자" value={`${c.participants}`} />
          <DetailStat label="기간" value={c.period} />
          <DetailStat label="인증주기" value={c.proofFreq} />
        </div>

        <div style={{ padding: '24px 20px 12px' }}>
          <h3 style={{ font: '700 16px/1.4 var(--font-sans)', margin: '0 0 8px' }}>소개</h3>
          <p style={{ font: '400 15px/1.6 var(--font-sans)', color: C.text2, margin: 0, whiteSpace: 'pre-line' }}>
            {c.description}
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 16, font: '500 13px/1.4 var(--font-sans)', color: C.text3 }}>
            <div><Icon name="calendar" size={14} color={C.text3} style={{ verticalAlign: '-2px', marginRight: 4 }} />{c.startDate} ~ {c.endDate}</div>
          </div>
        </div>

        <div style={{ padding: '12px 20px 20px' }}>
          <h3 style={{ font: '700 16px/1.4 var(--font-sans)', margin: '0 0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            최근 인증
            <span style={{ font: '500 12px/1 var(--font-sans)', color: C.text3 }}>{c.participants}명 인증 중</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {c.recentProofs.map((s, i) => <Photo key={i} seed={c.seed + s} style={{ width: '100%', aspectRatio: '1', borderRadius: 8 }} />)}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 20px 20px', borderTop: `1px solid ${C.line2}`, background: '#fff' }}>
        {joined ?
        <Button full onClick={() => nav.push('upload', { id: c.id })}>오늘 인증하기</Button> :

        <Button full onClick={() => nav.push('challenge', { id: c.id, joined: true })}>참여하기</Button>
        }
      </div>
    </div>);

}

function DetailStat({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ font: '500 11px/1.27 var(--font-sans)', letterSpacing: '0.03em', color: C.text3 }}>{label}</div>
      <div style={{ font: '700 15px/1.4 var(--font-sans)', color: C.black }}>{value}</div>
    </div>);

}

// ─── Create Challenge ───────────────────────────────────────────────
function ScreenCreate({ nav }) {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [cat, setCat] = React.useState('생활습관');
  const [color, setColor] = React.useState('#00AEFF');
  const [days, setDays] = React.useState(30);
  const colors = ['#00AEFF', '#0066FF', '#6541F2', '#FF5E00', '#FF9200', '#00BF40'];
  const cats = ['운동', '공부', '생활습관', '자기계발', '갓생', '건강'];
  const ok = title.trim().length >= 2;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <AppBar onBack={() => nav.back()} title="챌린지 만들기" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        <Field label="챌린지 이름" hint={`${title.length}/30`}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={30}
          placeholder="예: 하루 30분 독서"
          style={inputStyle()} />
        </Field>

        <Field label="설명" hint={`${desc.length}/200`}>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={200}
          placeholder="이 챌린지가 어떤 챌린지인지 알려주세요. 어떤 사진을 올려야 하는지도 적어주면 좋아요."
          style={{ ...inputStyle(), height: 96, padding: 14, resize: 'none' }} />
        </Field>

        <Field label="카테고리">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cats.map((c) =>
            <button key={c} onClick={() => setCat(c)} style={{
              height: 38, padding: '0 14px', borderRadius: 999,
              border: `1px solid ${cat === c ? C.black : C.line}`,
              background: cat === c ? C.black : '#fff',
              color: cat === c ? '#fff' : C.text2,
              font: '600 13px/1 var(--font-sans)', cursor: 'pointer'
            }}>{c}</button>
            )}
          </div>
        </Field>

        <Field label="기간">
          <div style={{ display: 'flex', gap: 8 }}>
            {[7, 14, 21, 30, 60, 100].map((d) =>
            <button key={d} onClick={() => setDays(d)} style={{
              flex: 1, height: 44, borderRadius: 10,
              border: `1px solid ${days === d ? C.blue : C.line}`,
              background: days === d ? C.blueLow : '#fff',
              color: days === d ? C.blue : C.text2,
              font: '600 14px/1 var(--font-sans)', cursor: 'pointer'
            }}>{d}일</button>
            )}
          </div>
        </Field>

        <Field label="커버 색">
          <div style={{ display: 'flex', gap: 10 }}>
            {colors.map((co) =>
            <button key={co} onClick={() => setColor(co)} style={{
              width: 44, height: 44, borderRadius: 12, cursor: 'pointer',
              background: co, border: color === co ? '3px solid #000' : '3px solid transparent',
              boxShadow: color === co ? '0 0 0 1px #fff inset' : 'none'
            }} />
            )}
          </div>
        </Field>

        <Field label="최대 인원">
          <input defaultValue="100" type="number"
          style={{ ...inputStyle(), textAlign: 'right' }} />
        </Field>
      </div>

      <div style={{ padding: '12px 20px 20px', borderTop: `1px solid ${C.line2}` }}>
        <Button full disabled={!ok} onClick={() => nav.replace('tabs')}>챌린지 시작하기</Button>
      </div>
    </div>);

}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <label style={{ font: '600 13px/1.385 var(--font-sans)', color: C.text2 }}>{label}</label>
        {hint && <span style={{ font: '500 12px/1.334 var(--font-sans)', color: C.text3 }}>{hint}</span>}
      </div>
      {children}
    </div>);

}

function inputStyle() {
  return {
    width: '100%', height: 48, padding: '0 14px', borderRadius: 10,
    border: `1px solid ${C.line}`, background: '#fff',
    font: '500 15px/1.4 var(--font-sans)', outline: 'none',
    boxSizing: 'border-box'
  };
}

// ─── Upload Proof ───────────────────────────────────────────────────
function ScreenUpload({ nav, ctx }) {
  const [comment, setComment] = React.useState('');
  const [picked, setPicked] = React.useState(true);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <AppBar onBack={() => nav.back()} title="인증하기" sub="하루 물 2L 마시기" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        {picked ?
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            <Photo seed="upload-shot" style={{ width: '100%', aspectRatio: '4/5' }} />
            <button onClick={() => setPicked(false)} style={{
            position: 'absolute', right: 12, bottom: 12, height: 36, padding: '0 14px', borderRadius: 999,
            background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
            font: '600 13px/1 var(--font-sans)', cursor: 'pointer'
          }}>다시 선택</button>
          </div> :

        <div style={{
          width: '100%', aspectRatio: '4/5', borderRadius: 16,
          background: C.bg2, border: `1px dashed ${C.line}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12
        }}>
            <Icon name="image" size={36} color={C.neutral} />
            <div style={{ font: '500 14px/1.4 var(--font-sans)', color: C.text3 }}>사진을 선택해주세요</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Button variant="secondary" size="md" onClick={() => setPicked(true)} leading={<Icon name="upload" size={16} color="#000" />}>갤러리</Button>
              <Button size="md" onClick={() => setPicked(true)} leading={<Icon name="image" size={16} color="#fff" />}>카메라</Button>
            </div>
          </div>
        }

        <div style={{ marginTop: 16 }}>
          <label style={{ font: '600 13px/1.385 var(--font-sans)', color: C.text2 }}>
            한 줄 메모 <span style={{ color: C.text3, fontWeight: 500 }}>(선택)</span>
          </label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
          placeholder="오늘의 한마디를 남겨보세요"
          maxLength={80}
          style={{
            width: '100%', height: 80, marginTop: 8, padding: 14, borderRadius: 12,
            border: `1px solid ${C.line}`, background: '#fff',
            font: '500 15px/1.5 var(--font-sans)', outline: 'none',
            boxSizing: 'border-box', resize: 'none'
          }} />
          
          <div style={{ font: '500 12px/1.334 var(--font-sans)', color: C.text3, textAlign: 'right', marginTop: 4 }}>
            {comment.length}/80
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: C.blueLow, display: 'flex', gap: 10 }}>
          <Icon name="document-text" size={18} color={C.blue} style={{ marginTop: 2 }} />
          <div style={{ flex: 1, font: '500 13px/1.5 var(--font-sans)', color: C.text2 }}>
            업로드하면 같은 챌린지 참여자 3명이 승인해야 복권이 지급돼요. 인증이 거부되면 streak가 초기화됩니다.
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 20px 20px', borderTop: `1px solid ${C.line2}` }}>
        <Button full disabled={!picked} onClick={() => nav.replace('uploaded')}>인증 업로드</Button>
      </div>
    </div>);

}

// ─── Uploaded confirmation (toast-y) ───────────────────────────────
function ScreenUploaded({ nav }) {
  React.useEffect(() => {
    const t = setTimeout(() => nav.replace('tabs'), 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      flex: 1, background: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: 999,
        background: C.greenLow, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <svg width="40" height="40" viewBox="0 0 40 40"><path d="M10 21L17 28L30 13" stroke={C.green} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
      </div>
      <div style={{ font: '700 22px/1.4 var(--font-sans)', letterSpacing: '-0.019em', textAlign: 'center' }}>
        인증을 업로드했어요
      </div>
      <div style={{ font: '500 14px/1.6 var(--font-sans)', color: C.text3, textAlign: 'center' }}>
        streak가 +1 올랐어요. 다른 참여자 3명이 승인하면<br />복권이 도착해요 🎫
      </div>
      <Streak days={8} size="lg" />
    </div>);

}

// ─── Pending Approvals (list) ──────────────────────────────────────
function ScreenPending({ nav }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <AppBar onBack={() => nav.back()} title="승인 대기" sub={`${DATA.pending.length}건의 인증을 검토해주세요`} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DATA.pending.map((p) =>
          <button key={p.id} onClick={() => nav.push('proof', { id: p.id })} style={{
            width: '100%', textAlign: 'left', cursor: 'pointer',
            display: 'flex', gap: 12, padding: 12, borderRadius: 14,
            border: `1px solid ${C.line}`, background: '#fff'
          }}>
              <Photo seed={p.seed} style={{ width: 76, height: 76, borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Avatar name={p.author} size={20} />
                    <span style={{ font: '600 13px/1 var(--font-sans)' }}>{p.author}</span>
                    <span style={{ font: '500 12px/1 var(--font-sans)', color: C.text3 }}>· {p.ago}</span>
                  </div>
                  <div style={{ font: '600 14px/1.4 var(--font-sans)', marginTop: 6, color: C.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.challenge}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Chip size="xs" variant="positive">승인 {p.approves}/3</Chip>
                  {p.rejects > 0 && <Chip size="xs" variant="negative">거부 {p.rejects}/3</Chip>}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>);

}

// ─── Proof Detail (vote) ──────────────────────────────────────────
function ScreenProofDetail({ nav, ctx }) {
  const p = DATA.pending.find((x) => x.id === ctx.id) || DATA.pending[0];
  const [voted, setVoted] = React.useState(null);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg2 }}>
      <AppBar onBack={() => nav.back()} title="인증 검토" right={
      <button style={{ width: 40, height: 40, background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <Icon name="flag" size={18} color={C.neutral} />
        </button>
      } />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '8px 20px 16px', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={p.author} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ font: '600 15px/1.2 var(--font-sans)' }}>{p.author}</div>
              <div style={{ font: '500 12px/1.4 var(--font-sans)', color: C.text3 }}>{p.ago}</div>
            </div>
            <Chip size="sm" variant="neutral">{p.challenge}</Chip>
          </div>
        </div>

        <Photo seed={p.seed} style={{ width: '100%', aspectRatio: '4/5', borderRadius: 0 }} />

        {p.comment &&
        <div style={{ padding: '16px 20px', background: '#fff', font: '500 15px/1.6 var(--font-sans)' }}>
            {p.comment}
          </div>
        }

        <div style={{ padding: 20 }}>
          <div style={{
            background: '#fff', borderRadius: 14, padding: 16,
            display: 'flex', gap: 8, alignItems: 'center', border: `1px solid ${C.line}`
          }}>
            <Chip size="sm" variant="positive">승인 {p.approves}/3</Chip>
            <Chip size="sm" variant="negative">거부 {p.rejects}/3</Chip>
            <div style={{ flex: 1 }} />
            <span style={{ font: '500 12px/1.4 var(--font-sans)', color: C.text3 }}>3명 모이면 결정</span>
          </div>

          <div style={{
            marginTop: 16, padding: 14, borderRadius: 12,
            background: C.bg3, font: '500 13px/1.5 var(--font-sans)', color: C.text2
          }}>
            챌린지에 맞는 진짜 인증인가요? 무관한 사진이거나 도배라면 신고해주세요.
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 20px 20px', borderTop: `1px solid ${C.line2}`, background: '#fff', display: 'flex', gap: 10 }}>
        <Button variant="negative" size="lg" style={{ flex: 1 }} onClick={() => {setVoted('reject');setTimeout(() => nav.back(), 400);}}>
          {voted === 'reject' ? '거부됨' : '거부'}
        </Button>
        <Button size="lg" style={{ flex: 1 }} onClick={() => {setVoted('approve');setTimeout(() => nav.back(), 400);}}>
          {voted === 'approve' ? '승인됨 ✓' : '승인'}
        </Button>
      </div>
    </div>);

}

// ─── Lottery box ──────────────────────────────────────────────────
function ScreenLottery({ nav, tweaks }) {
  return (
    <div style={{ background: C.bg2, minHeight: '100%' }}>
      <div style={{ padding: '8px 20px 24px', background: '#fff' }}>
        <h1 style={{ font: '800 24px/1.334 var(--font-sans)', letterSpacing: '-0.023em', margin: 0 }}>복권함</h1>
        <div style={{
          marginTop: 16, padding: 20, borderRadius: 18,
          background: 'linear-gradient(135deg, #FFF7E0 0%, #FFE0B5 100%)',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ font: '500 12px/1 var(--font-sans)', letterSpacing: '0.03em', color: '#D17600' }}>보유 복권</div>
            <div style={{ font: '800 32px/1.1 var(--font-sans)', letterSpacing: '-0.024em', color: '#FF5E00', marginTop: 4 }}>
              {tweaks.tickets}<span style={{ font: '700 18px/1 var(--font-sans)', marginLeft: 4 }}>개</span>
            </div>
            <div style={{ font: '500 12px/1.4 var(--font-sans)', color: C.text3, marginTop: 6 }}>
              긁어서 포인트로 바꿔보세요
            </div>
          </div>
          <div style={{
            width: 72, height: 72, borderRadius: 16, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}>
            <span style={{ font: '700 32px/1 var(--font-sans)' }}>🎫</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 32px' }}>
        <div style={{ font: '700 16px/1.4 var(--font-sans)', marginBottom: 12 }}>긁지 않은 복권</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DATA.tickets.slice(0, tweaks.tickets).map((t, i) =>
          <button key={t.id} onClick={() => nav.push('ad', { ticketId: t.id })} style={{
            width: '100%', cursor: 'pointer', textAlign: 'left',
            padding: 0, border: 'none', background: 'transparent'
          }}>
              <TicketCard ticket={t} num={i + 1} />
            </button>
          )}
        </div>

        {tweaks.tickets === 0 &&
        <Empty icon="bookmark" title="아직 복권이 없어요" sub="챌린지를 인증하고 승인받으면 복권이 와요" />
        }

        <div style={{ marginTop: 24, padding: 16, borderRadius: 14, background: C.bg3 }}>
          <div style={{ font: '600 13px/1.4 var(--font-sans)', color: C.text2, marginBottom: 6 }}>당첨 확률 안내</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
            ['1원', '60%'], ['3원', '25%'], ['5원', '10%'], ['10원', '4.8%'], ['10만원', '0.19%'], ['50만원', '0.009%'], ['100만원', '0.001%']].
            map(([a, p]) =>
            <span key={a} style={{
              font: '600 11px/1.27 var(--font-sans)', letterSpacing: '0.025em',
              padding: '4px 8px', borderRadius: 999, background: '#fff', color: C.text2,
              border: `1px solid ${C.line}`
            }}>{a} · {p}</span>
            )}
          </div>
        </div>
      </div>
    </div>);

}

function TicketCard({ ticket, num }) {
  return (
    <div style={{
      display: 'flex', position: 'relative',
      background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14, overflow: 'hidden'
    }}>
      <div style={{
        width: 76, background: 'linear-gradient(135deg, #FFE0B5 0%, #FFC06E 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2
      }}>
        <span style={{ font: '700 22px/1 var(--font-sans)' }}>🎫</span>
        <span style={{ font: '700 11px/1 var(--font-sans)', color: '#9C5800', letterSpacing: '0.04em' }}>#{String(num).padStart(3, '0')}</span>
      </div>
      <div style={{
        position: 'absolute', left: 76, top: 0, bottom: 0, width: 1,
        backgroundImage: 'repeating-linear-gradient(to bottom, rgba(112,115,124,0.4) 0 4px, transparent 4px 8px)'
      }} />
      <div style={{ flex: 1, padding: '14px 14px 14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ font: '500 11px/1.27 var(--font-sans)', letterSpacing: '0.03em', color: C.text3 }}>
            {ticket.earnedAt} 획득
          </div>
          <div style={{ font: '600 15px/1.4 var(--font-sans)', marginTop: 4 }}>
            {ticket.from}
          </div>
          <div style={{ font: '600 12px/1 var(--font-sans)', color: C.coral, marginTop: 6 }}>
            긁어서 확인 →
          </div>
        </div>
      </div>
    </div>);

}

// ─── Ad watching ────────────────────────────────────────────────
function ScreenAd({ nav, ctx }) {
  const [seconds, setSeconds] = React.useState(5);
  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  const done = seconds <= 0;

  return (
    <div style={{
      flex: 1, background: '#000', color: '#fff',
      display: 'flex', flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', font: '600 12px/1 var(--font-sans)', letterSpacing: '0.04em'
      }}>
        <span>광고</span>
        <button onClick={() => done && nav.replace('scratch', { ticketId: ctx.ticketId, amount: 10 })} style={{
          height: 32, padding: '0 12px', borderRadius: 999,
          background: done ? '#fff' : 'rgba(255,255,255,0.18)',
          color: done ? '#000' : '#fff',
          border: 'none', font: '600 12px/1 var(--font-sans)', cursor: done ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          {done ? '건너뛰기 ›' : `${seconds}초 후 건너뛰기`}
        </button>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
        padding: 24
      }}>
        <div style={{
          width: 240, height: 240, borderRadius: 24,
          background: 'linear-gradient(135deg, #0066FF 0%, #6541F2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 16px 40px rgba(101,65,242,0.4)'
        }}>
          <div style={{ font: '800 56px/1 var(--font-sans)' }}>📱</div>
        </div>
        <div style={{ font: '700 22px/1.4 var(--font-sans)', textAlign: 'center', letterSpacing: '-0.019em' }}>
          새로운 게임이 출시되었어요
        </div>
        <div style={{ font: '500 14px/1.6 var(--font-sans)', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
          지금 다운로드하면 캐시 5,000원 즉시 지급
        </div>
        <button style={{
          marginTop: 12, height: 44, padding: '0 24px', borderRadius: 999,
          background: '#fff', color: '#000', border: 'none',
          font: '700 14px/1 var(--font-sans)', cursor: 'pointer'
        }}>지금 설치하기</button>
      </div>

      <div style={{
        padding: '14px 20px 24px', textAlign: 'center',
        font: '500 12px/1.5 var(--font-sans)', color: 'rgba(255,255,255,0.5)'
      }}>
        광고를 끝까지 보면 복권을 긁을 수 있어요
      </div>
    </div>);

}

// ─── Scratch screen ────────────────────────────────────────────
function ScreenScratch({ nav, ctx }) {
  const amount = ctx.amount ?? (Math.random() < 0.6 ? 1 : Math.random() < 0.8 ? 3 : 10);
  const [revealed, setRevealed] = React.useState(false);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <AppBar onBack={() => nav.back()} title="복권 긁기" />
      <div style={{ flex: 1, padding: '8px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ font: '500 13px/1.4 var(--font-sans)', color: C.text3, marginBottom: 20, textAlign: 'center' }}>
          하루 물 2L 마시기 인증으로 받은 복권
        </div>
        <ScratchCard amount={amount} onScratched={() => setRevealed(true)} width={320} height={200} />
        <div style={{ flex: 1 }} />
        <div style={{
          width: '100%', padding: 14, borderRadius: 12,
          background: C.bg3, font: '500 13px/1.5 var(--font-sans)', color: C.text2,
          marginBottom: 16
        }}>
          복권 결과는 서버에서 결정돼요. 모든 복권에 당첨이 들어있어요.
        </div>
        <Button full disabled={!revealed} onClick={() => nav.replace('reward', { amount })}>
          {revealed ? `${amount.toLocaleString()}원 지갑에 담기` : '먼저 복권을 긁어주세요'}
        </Button>
      </div>
    </div>);

}

// ─── Reward result ────────────────────────────────────────────
function ScreenReward({ nav, ctx }) {
  const amount = ctx.amount || 10;
  return (
    <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 56 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFF7E0 0%, #FFC06E 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(255,146,0,0.32)'
        }}>
          <span style={{ font: '700 56px/1 var(--font-sans)' }}>🎉</span>
        </div>
        <div style={{ font: '500 14px/1.4 var(--font-sans)', color: C.text3 }}>지갑에 적립되었어요</div>
        <div style={{ font: '800 56px/1 var(--font-sans)', letterSpacing: '-0.031em', color: '#FF5E00' }}>
          +{amount.toLocaleString()}<span style={{ font: '700 28px/1 var(--font-sans)', marginLeft: 4 }}>원</span>
        </div>
        <div style={{ font: '500 14px/1.6 var(--font-sans)', color: C.text3, textAlign: 'center', marginTop: 8 }}>
          누적 포인트 <b style={{ color: C.black }}>{(DATA.user.points + amount).toLocaleString()}원</b>
        </div>
      </div>
      <div style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button full onClick={() => nav.replace('tabs', { tab: 'lottery' })}>
          남은 복권 더 긁기
        </Button>
        <Button full variant="ghost" onClick={() => nav.replace('tabs', { tab: 'profile' })}>
          지갑에서 확인하기
        </Button>
      </div>
    </div>);

}

// ─── Profile ──────────────────────────────────────────────────
function ScreenProfile({ nav, tweaks }) {
  const u = DATA.user;
  return (
    <div style={{ background: C.bg2, minHeight: '100%' }}>
      <div style={{ padding: '8px 20px 24px', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ font: '800 24px/1.334 var(--font-sans)', letterSpacing: '-0.023em', margin: 0 }}>프로필</h1>
          <button onClick={() => nav.push('settings')} style={{
            width: 40, height: 40, borderRadius: 12, border: `1px solid ${C.line}`,
            background: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon name="setting" size={18} color={C.black} />
          </button>
        </div>

        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name={u.nickname} size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ font: '700 20px/1.4 var(--font-sans)', letterSpacing: '-0.012em' }}>{u.nickname}</div>
            <div style={{ font: '500 13px/1.4 var(--font-sans)', color: C.text3, marginTop: 2 }}>
              {u.joinedAt} 가입
            </div>
          </div>
          <button style={{
            height: 32, padding: '0 12px', borderRadius: 8,
            background: '#fff', border: `1px solid ${C.line}`,
            font: '600 12px/1 var(--font-sans)', cursor: 'pointer'
          }}>편집</button>
        </div>

        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <BigStat label="현재 streak" value={tweaks.streak} unit="일" color={C.coral} />
          <BigStat label="누적 인증" value={u.totalProofs} unit="회" color={C.blue} />
          <BigStat label="포인트" value={u.points.toLocaleString()} unit="원" color={C.green} />
        </div>
      </div>

      <div style={{ padding: '12px 20px 32px' }}>
        <MenuRow icon="folder-star" label="내가 만든 챌린지" detail="2" onClick={() => nav.setTab('discover')} />
        <MenuRow icon="document-text" label="지갑 · 거래내역" detail={`${u.points.toLocaleString()}원`} onClick={() => nav.push('wallet')} />
        <MenuRow icon="bell" label="알림 설정" onClick={() => nav.push('settings')} />
        <MenuRow icon="bubble" label="문의하기" />
        <MenuRow icon="document" label="공지사항" />
        <MenuRow icon="setting" label="설정" onClick={() => nav.push('settings')} isLast />
      </div>
    </div>);

}

function BigStat({ label, value, unit, color }) {
  return (
    <div style={{ padding: '14px 12px', borderRadius: 14, background: C.bg3 }}>
      <div style={{ font: '500 11px/1.27 var(--font-sans)', letterSpacing: '0.03em', color: C.text3 }}>{label}</div>
      <div style={{ marginTop: 6, font: '700 22px/1.27 var(--font-sans)', letterSpacing: '-0.012em', color: C.black }}>
        {value}<span style={{ font: '600 13px/1 var(--font-sans)', color: C.text3, marginLeft: 2 }}>{unit}</span>
      </div>
    </div>);

}

function MenuRow({ icon, label, detail, onClick, isLast }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 4px', background: 'transparent', border: 'none', cursor: 'pointer',
      borderBottom: isLast ? 'none' : `1px solid ${C.line2}`
    }}>
      <Icon name={icon} size={20} color={C.neutral} />
      <span style={{ flex: 1, textAlign: 'left', font: '500 15px/1.4 var(--font-sans)', color: C.black }}>{label}</span>
      {detail && <span style={{ font: '500 13px/1.4 var(--font-sans)', color: C.text3 }}>{detail}</span>}
      <svg width="7" height="12" viewBox="0 0 7 12"><path d="M1 1l5 5-5 5" stroke={C.text4} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>);

}

// ─── Wallet ───────────────────────────────────────────────────
function ScreenWallet({ nav }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg2 }}>
      <AppBar onBack={() => nav.back()} title="지갑" />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: '#fff', padding: '24px 20px 28px' }}>
          <div style={{ font: '500 13px/1.4 var(--font-sans)', color: C.text3 }}>누적 포인트</div>
          <div style={{ font: '800 36px/1.1 var(--font-sans)', letterSpacing: '-0.027em', marginTop: 6 }}>
            {DATA.user.points.toLocaleString()}<span style={{ font: '700 20px/1 var(--font-sans)', marginLeft: 4, color: C.text2 }}>원</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Button variant="secondary" size="md" style={{ flex: 1 }} disabled>출금 (준비 중)</Button>
            <Button variant="tonal" size="md" style={{ flex: 1 }} onClick={() => nav.setTab('lottery')}>복권함</Button>
          </div>
        </div>

        <div style={{ padding: '20px 20px 32px' }}>
          <div style={{ font: '700 16px/1.4 var(--font-sans)', marginBottom: 12 }}>거래 내역</div>
          <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
            {DATA.walletTx.map((t, i) =>
            <div key={t.id} style={{
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i < DATA.walletTx.length - 1 ? `1px solid ${C.line2}` : 'none'
            }}>
                <div style={{
                width: 36, height: 36, borderRadius: 999, background: C.greenLow,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                  <span style={{ font: '700 14px/1 var(--font-sans)', color: C.green }}>+</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '600 14px/1.4 var(--font-sans)' }}>{t.label}</div>
                  <div style={{ font: '500 12px/1.4 var(--font-sans)', color: C.text3 }}>{t.from} · {t.when}</div>
                </div>
                <div style={{ font: '700 15px/1 var(--font-sans)', color: C.green }}>+{t.amount}원</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}

// ─── Settings ────────────────────────────────────────────────
function ScreenSettings({ nav }) {
  const [pushOn, setPushOn] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg2 }}>
      <AppBar onBack={() => nav.back()} title="설정" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 24px' }}>
        <SettingsGroup label="알림">
          <SettingsRow label="푸시 알림" trailing={<Toggle on={pushOn} onChange={setPushOn} />} />
          <SettingsRow label="마케팅 알림" sub="새 챌린지·이벤트" trailing={<Toggle on={marketing} onChange={setMarketing} />} isLast />
        </SettingsGroup>

        <SettingsGroup label="계정">
          <SettingsRow label="닉네임 변경" detail="지수" chevron />
          <SettingsRow label="프로필 이미지" chevron />
          <SettingsRow label="로그아웃" chevron isLast />
        </SettingsGroup>

        <SettingsGroup label="이용 정보">
          <SettingsRow label="이용약관" chevron />
          <SettingsRow label="개인정보처리방침" chevron />
          <SettingsRow label="복권 당첨 확률" chevron />
          <SettingsRow label="버전" detail="0.1.0 (MVP)" isLast />
        </SettingsGroup>

        <button style={{
          width: '100%', marginTop: 12, padding: '14px 16px', borderRadius: 12,
          background: 'transparent', border: 'none', cursor: 'pointer',
          font: '500 13px/1.4 var(--font-sans)', color: C.text3, textAlign: 'center'
        }}>회원 탈퇴</button>
      </div>
    </div>);

}

function SettingsGroup({ label, children }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ font: '600 12px/1.27 var(--font-sans)', letterSpacing: '0.025em', color: C.text3, padding: '0 4px 8px' }}>
        {label}
      </div>
      <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
        {children}
      </div>
    </div>);

}

function SettingsRow({ label, sub, detail, trailing, chevron, isLast }) {
  return (
    <div style={{
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, minHeight: 48,
      borderBottom: isLast ? 'none' : `1px solid ${C.line2}`
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ font: '500 15px/1.4 var(--font-sans)' }}>{label}</div>
        {sub && <div style={{ font: '500 12px/1.4 var(--font-sans)', color: C.text3, marginTop: 2 }}>{sub}</div>}
      </div>
      {detail && <span style={{ font: '500 13px/1.4 var(--font-sans)', color: C.text3 }}>{detail}</span>}
      {trailing}
      {chevron && <svg width="7" height="12" viewBox="0 0 7 12"><path d="M1 1l5 5-5 5" stroke={C.text4} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </div>);

}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 50, height: 30, borderRadius: 999,
      background: on ? C.blue : C.line, border: 'none', cursor: 'pointer',
      position: 'relative', transition: 'background 200ms'
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 24, height: 24, borderRadius: '50%', background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'left 200ms'
      }} />
    </button>);

}

Object.assign(window, {
  ScreenSplash, ScreenLogin, ScreenNickname, ScreenHome, ScreenDiscover,
  ScreenChallengeDetail, ScreenCreate, ScreenUpload, ScreenUploaded,
  ScreenPending, ScreenProofDetail, ScreenLottery, ScreenAd, ScreenScratch,
  ScreenReward, ScreenProfile, ScreenWallet, ScreenSettings
});