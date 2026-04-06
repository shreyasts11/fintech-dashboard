export default function SummaryCard({ title, value, type, icon, subtitle, trend }) {
  const colors = {
    balance: { main: '#3b82f6', glow: 'rgba(59,130,246,0.15)', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
    income:  { main: '#22d3a0', glow: 'rgba(34,211,160,0.15)', bg: 'rgba(34,211,160,0.08)', border: 'rgba(34,211,160,0.2)' },
    expense: { main: '#f87171', glow: 'rgba(248,113,113,0.15)', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
    savings: { main: '#a78bfa', glow: 'rgba(167,139,250,0.15)', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  }
  const c = colors[type] || colors.balance

  const fmt = (v) => {
    const abs = Math.abs(v)
    if (abs >= 100000) return `₹${(abs/100000).toFixed(2)}L`
    if (abs >= 1000) return `₹${(abs/1000).toFixed(1)}K`
    return `₹${abs}`
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${c.border}`,
      borderRadius: 16,
      padding: '22px 24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)'
      e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${c.border}`
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120,
        background: c.main, opacity: 0.08,
        borderRadius: '50%', filter: 'blur(32px)',
        pointerEvents: 'none',
      }}/>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 24, right: 24,
        height: 1.5,
        background: `linear-gradient(90deg, transparent, ${c.main}66, transparent)`,
      }}/>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#7e96b8', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          {title}
        </div>
        <div style={{
          width: 36, height: 36,
          background: c.bg, border: `1px solid ${c.border}`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: c.main,
        }}>
          {icon}
        </div>
      </div>

      <div style={{
        fontSize: 32, fontWeight: 700,
        color: '#eef2f8',
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '-1px', lineHeight: 1,
        marginBottom: 14,
      }}>
        {fmt(value)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#3d5270' }}>{subtitle}</span>
        {trend && (
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: trend > 0 ? '#22d3a0' : '#f87171',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ marginTop: 12, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: type === 'income' ? '100%' : type === 'expense' ? `${Math.min(100, (value/108700)*100).toFixed(0)}%` : '72%',
          background: `linear-gradient(90deg, ${c.main}, ${c.main}66)`,
          borderRadius: 2,
          transformOrigin: 'left',
          animation: 'bar-grow 1.2s ease both',
        }}/>
      </div>
    </div>
  )
}
