// Main App — router + tab shell + tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "streak": 7,
  "tickets": 5,
  "pending": 3,
  "todayDone": false,
  "dark": false
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Navigation: history stack of { screen, ctx }
  const [history, setHistory] = React.useState([{ screen: 'splash', ctx: {} }]);
  const [tab, setTab] = React.useState('home');
  const current = history[history.length - 1];

  const nav = React.useMemo(() => ({
    push: (screen, ctx = {}) => setHistory(h => [...h, { screen, ctx }]),
    replace: (screen, ctx = {}) => {
      if (screen === 'tabs' && ctx.tab) setTab(ctx.tab);
      setHistory(h => [...h.slice(0, -1), { screen, ctx }]);
    },
    back: () => setHistory(h => h.length > 1 ? h.slice(0, -1) : h),
    setTab: (next) => {
      setTab(next);
      setHistory([{ screen: 'tabs', ctx: {} }]);
    },
  }), []);

  // Inject mock data based on tweaks
  React.useEffect(() => {
    DATA.user.streak = tweaks.streak;
    DATA.myChallenges[0].streak = tweaks.streak;
    DATA.myChallenges[0].todayDone = tweaks.todayDone;
  }, [tweaks.streak, tweaks.todayDone]);

  // Slice pending list by tweak
  const pendingTweak = { ...tweaks, pending: Math.min(tweaks.pending, 5) };

  const renderScreen = () => {
    const screen = current.screen;
    const ctx = current.ctx;

    if (screen === 'splash') return <ScreenSplash nav={nav} />;
    if (screen === 'login') return <ScreenLogin nav={nav} />;
    if (screen === 'nickname') return <ScreenNickname nav={nav} />;
    if (screen === 'challenge') return <ScreenChallengeDetail nav={nav} ctx={ctx} />;
    if (screen === 'create') return <ScreenCreate nav={nav} />;
    if (screen === 'upload') return <ScreenUpload nav={nav} ctx={ctx} />;
    if (screen === 'uploaded') return <ScreenUploaded nav={nav} />;
    if (screen === 'pending') return <ScreenPending nav={nav} />;
    if (screen === 'proof') return <ScreenProofDetail nav={nav} ctx={ctx} />;
    if (screen === 'ad') return <ScreenAd nav={nav} ctx={ctx} />;
    if (screen === 'scratch') return <ScreenScratch nav={nav} ctx={ctx} />;
    if (screen === 'reward') return <ScreenReward nav={nav} ctx={ctx} />;
    if (screen === 'wallet') return <ScreenWallet nav={nav} />;
    if (screen === 'settings') return <ScreenSettings nav={nav} />;

    // tabs
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <div data-screen-label={`Tab: ${tab}`} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {tab === 'home' && <ScreenHome nav={nav} tweaks={pendingTweak} />}
          {tab === 'discover' && <ScreenDiscover nav={nav} />}
          {tab === 'lottery' && <ScreenLottery nav={nav} tweaks={tweaks} />}
          {tab === 'profile' && <ScreenProfile nav={nav} tweaks={tweaks} />}
        </div>
        <TabBar active={tab} onChange={(t) => setTab(t)} />
      </div>
    );
  };

  const isDark = current.screen === 'ad';
  const bg = isDark ? '#000' : '#fff';

  return (
    <>
      {/* Outer page background */}
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 0%, #F7F7F8 0%, #EAEBEC 100%)',
        padding: 24, boxSizing: 'border-box',
      }}>
        <IOSDevice width={393} height={852} dark={isDark}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg, position: 'relative', paddingTop: 50 }}>
            {renderScreen()}
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="진행 상태">
          <TweakSlider label="현재 streak" value={tweaks.streak} min={0} max={30} unit="일" onChange={(v) => setTweak('streak', v)} />
          <TweakSlider label="보유 복권" value={tweaks.tickets} min={0} max={5} unit="개" onChange={(v) => setTweak('tickets', v)} />
          <TweakSlider label="승인 대기" value={tweaks.pending} min={0} max={5} unit="건" onChange={(v) => setTweak('pending', v)} />
          <TweakToggle label="오늘 인증 완료" value={tweaks.todayDone} onChange={(v) => setTweak('todayDone', v)} />
        </TweakSection>
        <TweakSection label="화면 이동">
          <TweakButton label="처음으로 (스플래시)" onClick={() => { setHistory([{ screen: 'splash', ctx: {} }]); setTab('home'); }} />
          <TweakButton label="복권 긁기 화면" secondary onClick={() => setHistory([{ screen: 'scratch', ctx: { amount: 100 } }])} />
          <TweakButton label="당첨 결과" secondary onClick={() => setHistory([{ screen: 'reward', ctx: { amount: 100000 } }])} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
