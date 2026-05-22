// Shared components for Challenge Reward app
// Loaded via <script type="text/babel" src="components.jsx">

const C = {
  blue: '#0066FF',
  blueLow: '#EAF2FE',
  black: '#000',
  text2: 'rgba(46,47,51,0.88)',
  text3: 'rgba(55,56,60,0.61)',
  text4: 'rgba(55,56,60,0.28)',
  disable: 'rgba(55,56,60,0.16)',
  line: 'rgba(112,115,124,0.22)',
  line2: 'rgba(112,115,124,0.16)',
  bg2: '#F7F7F8',
  bg3: 'rgba(112,115,124,0.08)',
  neutral: '#70737C',
  red: '#FF4242',
  redLow: '#FEECEC',
  green: '#00BF40',
  greenLow: '#F2FFF6',
  yellow: '#FF9200',
  yellowLow: '#FFFCF7',
  violet: '#6541F2',
  coral: '#FF5E00',
};

// ── Icon component (loads from /icons/*.svg, recolors via mask) ──
function Icon({ name, size = 20, color = 'currentColor', style }) {
  const src = `icons/${name}.svg`;
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block', width: size, height: size, flexShrink: 0,
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`,
        WebkitMaskSize: 'contain', maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center', maskPosition: 'center',
        ...style,
      }}
    />
  );
}

// ── Wanted-style status bar (light, dark glyphs) ──
function StatusBarLight() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px 6px', height: 44, boxSizing: 'border-box',
      position: 'relative', zIndex: 20, color: '#000',
    }}>
      <span style={{ font: '600 17px/22px -apple-system, system-ui' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="6.5" width="3" height="4" rx="0.7" fill="#000"/><rect x="4.5" y="4.5" width="3" height="6" rx="0.7" fill="#000"/><rect x="9" y="2.5" width="3" height="8" rx="0.7" fill="#000"/><rect x="13.5" y="0" width="3" height="11" rx="0.7" fill="#000"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.8C10 2.8 12 3.6 13.5 5L14.5 4C13 2.4 10.6 1.4 8 1.4C5.4 1.4 3 2.4 1.5 4L2.5 5C4 3.6 6 2.8 8 2.8Z" fill="#000"/><path d="M8 6.2C9.3 6.2 10.4 6.7 11.3 7.4L12.3 6.4C11 5.3 9.6 4.6 8 4.6C6.4 4.6 5 5.3 3.7 6.4L4.7 7.4C5.6 6.7 6.7 6.2 8 6.2Z" fill="#000"/><circle cx="8" cy="9.4" r="1.4" fill="#000"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="#000" strokeOpacity="0.35" fill="none"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="#000"/><path d="M23.5 4V8C24.2 7.7 24.5 7 24.5 6S24.2 4.3 23.5 4Z" fill="#000" fillOpacity="0.4"/></svg>
      </div>
    </div>
  );
}

// ── Top app bar (used inside screens, after status bar) ──
function AppBar({ title, onBack, right, sub, dense = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', minHeight: dense ? 48 : 56,
      padding: '0 8px 0 4px', background: '#fff', position: 'relative', zIndex: 5,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L6 10l7 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      ) : <div style={{ width: 12 }} />}
      <div style={{ flex: 1, font: '600 17px/1.412 var(--font-sans)', textAlign: onBack ? 'center' : 'left', padding: onBack ? '0 0 0 0' : '0 12px' }}>
        {title}
        {sub && <div style={{ font: '500 12px/1.334 var(--font-sans)', letterSpacing: '0.025em', color: C.text3, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ minWidth: 44, display: 'flex', justifyContent: 'flex-end', paddingRight: 4 }}>{right}</div>
    </div>
  );
}

// ── Bottom tab bar (4 tabs) ──
function TabBar({ active, onChange }) {
  const tabs = [
    { id: 'home', label: '홈', icon: 'home', iconFill: 'home-fill' },
    { id: 'discover', label: '탐색', icon: 'search', iconFill: 'search-thick' },
    { id: 'lottery', label: '복권함', icon: 'bookmark', iconFill: 'bookmark-fill' },
    { id: 'profile', label: '프로필', icon: 'person', iconFill: 'person-fill' },
  ];
  return (
    <div style={{
      padding: '8px 14px 14px',
      background: 'linear-gradient(to top, #fff 65%, rgba(255,255,255,0.6) 100%)',
    }}>
      <div style={{
        display: 'flex', gap: 4, padding: 5,
        background: '#fff', borderRadius: 999,
        border: `1px solid ${C.line}`,
        boxShadow: '0 8px 22px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{
                flex: isActive ? 1.9 : 1,
                height: 46, borderRadius: 999, border: 'none',
                background: isActive ? C.black : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                cursor: 'pointer', overflow: 'hidden', padding: 0,
                transition: 'flex 280ms cubic-bezier(0.4,0,0.2,1), background 200ms',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Icon
                name={isActive ? t.iconFill : t.icon}
                size={20}
                color={isActive ? '#fff' : C.neutral}
              />
              {isActive && (
                <span style={{
                  font: '700 13px/1 var(--font-sans)', color: '#fff',
                  letterSpacing: '-0.003em', whiteSpace: 'nowrap',
                }}>{t.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Buttons ──
function Button({ children, variant = 'primary', size = 'lg', onClick, disabled, full, style, leading }) {
  const sizes = {
    lg: { h: 52, font: '600 16px/1.5 var(--font-sans)', r: 12, px: 20 },
    md: { h: 44, font: '600 15px/1.467 var(--font-sans)', r: 10, px: 16 },
    sm: { h: 36, font: '600 14px/1.429 var(--font-sans)', r: 8, px: 12 },
  };
  const s = sizes[size];
  const variants = {
    primary: { bg: C.blue, color: '#fff', border: 'none' },
    secondary: { bg: '#fff', color: C.black, border: `1px solid ${C.line}` },
    ghost: { bg: 'transparent', color: C.blue, border: 'none' },
    tonal: { bg: C.bg3, color: C.black, border: 'none' },
    negative: { bg: '#fff', color: C.red, border: `1px solid ${C.line}` },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      height: s.h, padding: `0 ${s.px}px`, borderRadius: s.r, font: s.font,
      letterSpacing: '-0.002em',
      width: full ? '100%' : undefined,
      background: disabled ? C.disable : v.bg,
      color: disabled ? C.text4 : v.color,
      border: v.border, cursor: disabled ? 'default' : 'pointer',
      transition: 'opacity 150ms', WebkitTapHighlightColor: 'transparent',
      ...style,
    }}>
      {leading}
      {children}
    </button>
  );
}

// ── Card ──
function Card({ children, style, onClick, padding = 20, radius = 20 }) {
  return (
    <div onClick={onClick} style={{
      background: '#fff', border: `1px solid ${C.line}`,
      borderRadius: radius, padding, cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// ── Avatar (color-seeded initial) ──
function Avatar({ name = '?', size = 36, src }) {
  const colors = ['#0066FF', '#FF5E00', '#6541F2', '#00BF40', '#FF9200', '#CB59FF', '#00BDDE', '#FF4242'];
  const idx = Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length;
  const bg = colors[idx];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: src ? `center/cover url(${src})` : bg,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      font: `600 ${size * 0.4}px/1 var(--font-sans)`, flexShrink: 0,
      overflow: 'hidden',
    }}>{!src && name[0]}</div>
  );
}

// ── Badge / Chip ──
function Chip({ children, variant = 'neutral', size = 'sm', style }) {
  const variants = {
    neutral: { bg: C.bg3, color: C.text2 },
    primary: { bg: C.blueLow, color: C.blue },
    positive: { bg: C.greenLow, color: C.green },
    warning: { bg: C.yellowLow, color: '#D17600' },
    negative: { bg: C.redLow, color: C.red },
    outline: { bg: '#fff', color: C.text2, border: `1px solid ${C.line}` },
  };
  const v = variants[variant];
  const heights = { xs: 22, sm: 26, md: 30 };
  const fonts = { xs: '600 11px/1.273 var(--font-sans)', sm: '600 12px/1.334 var(--font-sans)', md: '600 13px/1.385 var(--font-sans)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: heights[size], padding: '0 8px', borderRadius: 999,
      font: fonts[size], letterSpacing: '0.025em',
      background: v.bg, color: v.color, border: v.border, ...style,
    }}>{children}</span>
  );
}

// ── Section header ──
function Section({ title, action, children, style }) {
  return (
    <div style={{ padding: '0 20px', ...style }}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ font: '700 18px/1.445 var(--font-sans)', letterSpacing: '-0.002em', margin: 0 }}>{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Progress bar ──
function ProgressBar({ value, max = 100, color = C.blue, height = 6 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ width: '100%', height, borderRadius: 999, background: C.line2, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 300ms' }} />
    </div>
  );
}

// ── Streak flame (custom svg) ──
function Streak({ days, size = 'md' }) {
  const big = size === 'lg';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      font: big ? '700 18px/1 var(--font-sans)' : '700 13px/1 var(--font-sans)',
      letterSpacing: '0.02em', color: C.coral,
    }}>
      <svg width={big ? 18 : 14} height={big ? 22 : 17} viewBox="0 0 14 17" fill="none">
        <path d="M7 0.5C7 0.5 3 3.5 3 7.5C3 10 4.5 11 4.5 11C4.5 11 4 10 4 9C4 7.5 5.5 6 5.5 6C5.5 6 5 7 5.5 8C6 9 7 9 7 9C7 9 9 10 9 12C9 13.5 8 14.5 8 14.5C8 14.5 12 14 12 9.5C12 4.5 7 0.5 7 0.5Z" fill="#FF5E00"/>
        <path d="M7 16.5C9.5 16.5 11 14.8 11 13C11 11 9 10 9 8.5C9 10.5 7 11.5 7 12.5C7 13.5 8 14 8 14C8 14 6 15 4 13.5C4 14.5 5.5 16.5 7 16.5Z" fill="#FFA938"/>
      </svg>
      {days}일
    </span>
  );
}

// ── Empty list state ──
function Empty({ icon = 'document', title, sub }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      padding: '64px 32px', textAlign: 'center',
    }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.bg3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={28} color={C.neutral} />
      </div>
      <div style={{ font: '600 17px/1.412 var(--font-sans)' }}>{title}</div>
      {sub && <div style={{ font: '500 14px/1.571 var(--font-sans)', color: C.text3 }}>{sub}</div>}
    </div>
  );
}

// ── Photo placeholder (deterministic colorful gradient) ──
function Photo({ seed = 'a', label, style }) {
  // hash seed → two hues
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  const h1 = h % 360, h2 = (h * 17) % 360;
  return (
    <div style={{
      background: `linear-gradient(135deg, hsl(${h1} 70% 70%), hsl(${h2} 60% 55%))`,
      borderRadius: 12, position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 50%)',
      }} />
      {label && (
        <div style={{
          position: 'absolute', bottom: 8, left: 10,
          font: '600 11px/1.27 var(--font-sans)', letterSpacing: '0.03em',
          color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>{label}</div>
      )}
    </div>
  );
}

Object.assign(window, {
  C, Icon, StatusBarLight, AppBar, TabBar, Button, Card, Avatar, Chip, Section, ProgressBar, Streak, Empty, Photo,
});
