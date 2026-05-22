// Scratch card — canvas overlay with destination-out erase

function ScratchCard({ amount, onScratched, width = 320, height = 200 }) {
  const canvasRef = React.useRef(null);
  const [revealed, setRevealed] = React.useState(0); // 0..100
  const [done, setDone] = React.useState(false);
  const draggingRef = React.useRef(false);
  const lastRef = React.useRef(null);
  const checkTimeoutRef = React.useRef(null);

  const drawScratchCover = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Silver scratch coating with texture
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, '#C2C4C8');
    g.addColorStop(0.4, '#E1E2E4');
    g.addColorStop(0.6, '#AEB0B6');
    g.addColorStop(1, '#878A93');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // texture dots
    for (let i = 0; i < 240; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.35})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5);
    }
    for (let i = 0; i < 120; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.3, Math.random() * 1.5 + 0.3);
    }

    // "긁어주세요" hint
    ctx.fillStyle = 'rgba(46,47,51,0.55)';
    ctx.font = '600 14px Pretendard JP, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('긁어서 확인하기', width / 2, height / 2 - 4);
    ctx.font = '500 11px Pretendard JP, system-ui';
    ctx.fillStyle = 'rgba(46,47,51,0.4)';
    ctx.fillText('손가락으로 문질러 보세요', width / 2, height / 2 + 14);

    ctx.globalCompositeOperation = 'destination-out';
  }, [width, height]);

  React.useEffect(() => {
    drawScratchCover();
  }, [drawScratchCover]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  };

  const erase = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 36;
    ctx.beginPath();
    if (lastRef.current) {
      ctx.moveTo(lastRef.current.x, lastRef.current.y);
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x - 0.5, y - 0.5);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    lastRef.current = { x, y };
  };

  const checkRevealed = () => {
    if (done) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    const step = 16 * dpr;
    let samples = 0;
    for (let i = 0; i < data.length; i += 4 * step) {
      samples++;
      if (data[i + 3] === 0) cleared++;
    }
    const pct = (cleared / samples) * 100;
    setRevealed(pct);
    if (pct > 55 && !done) {
      setDone(true);
      setTimeout(() => onScratched && onScratched(), 600);
    }
  };

  const onStart = (e) => {
    e.preventDefault();
    draggingRef.current = true;
    lastRef.current = null;
    const { x, y } = getPos(e);
    erase(x, y);
  };
  const onMove = (e) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    erase(x, y);
    clearTimeout(checkTimeoutRef.current);
    checkTimeoutRef.current = setTimeout(checkRevealed, 80);
  };
  const onEnd = () => {
    draggingRef.current = false;
    lastRef.current = null;
    checkRevealed();
  };

  const revealAll = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setRevealed(100);
    setDone(true);
    setTimeout(() => onScratched && onScratched(), 400);
  };

  return (
    <div>
      <div style={{
        position: 'relative', width, height,
        borderRadius: 20, overflow: 'hidden',
        background: 'linear-gradient(135deg, #FFF7E0 0%, #FFE0B5 100%)',
        boxShadow: '0 8px 28px rgba(255,146,0,0.18), 0 2px 8px rgba(0,0,0,0.06)',
      }}>
        {/* reward (behind the coating) */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <div style={{
            font: '700 13px/1 var(--font-sans)', letterSpacing: '0.04em',
            color: '#D17600',
          }}>축하합니다!</div>
          <div style={{
            font: '800 56px/1 var(--font-sans)', letterSpacing: '-0.03em',
            color: '#FF5E00',
          }}>{amount.toLocaleString()}<span style={{ font: '700 28px/1 var(--font-sans)', marginLeft: 4 }}>원</span></div>
          <div style={{
            font: '600 12px/1 var(--font-sans)', letterSpacing: '0.025em',
            color: 'rgba(55,56,60,0.61)', marginTop: 4,
          }}>지갑에 적립됩니다</div>
        </div>
        {/* scratch canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
          style={{
            position: 'absolute', inset: 0, touchAction: 'none',
            cursor: 'crosshair', display: done ? 'none' : 'block',
          }}
        />
      </div>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ font: '500 12px/1.27 var(--font-sans)', letterSpacing: '0.025em', color: 'rgba(55,56,60,0.61)' }}>
            {done ? '완료!' : `${Math.round(revealed)}% 긁었어요`}
          </div>
          <div style={{ marginTop: 6, width: '100%', height: 4, borderRadius: 999, background: 'rgba(112,115,124,0.16)', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, revealed)}%`, height: '100%', background: '#FF5E00', borderRadius: 999, transition: 'width 200ms' }} />
          </div>
        </div>
        <button onClick={revealAll} disabled={done} style={{
          height: 36, padding: '0 12px', borderRadius: 8,
          background: 'transparent', border: '1px solid rgba(112,115,124,0.22)',
          font: '600 13px/1 var(--font-sans)', color: done ? 'rgba(55,56,60,0.28)' : '#000',
          cursor: done ? 'default' : 'pointer',
        }}>전체 긁기</button>
      </div>
    </div>
  );
}

window.ScratchCard = ScratchCard;
