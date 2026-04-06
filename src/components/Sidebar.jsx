import { useStore } from "../store/store"

const NAV = [
  { id: "dashboard", label: "Overview", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/>
      <rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>
    </svg>
  )},
  { id: "transactions", label: "Transactions", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
    </svg>
  )},
  { id: "insights", label: "Insights", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  )},
]

export default function Sidebar({ setPage, activePage }) {
  const { role, setRole, transactions } = useStore()
  const totalBalance = transactions.reduce((a, t) => t.type === "income" ? a + t.amount : a - t.amount, 0)

  const fmt = (v) => {
    const abs = Math.abs(v)
    if (abs >= 100000) return `₹${(abs/100000).toFixed(2)}L`
    if (abs >= 1000) return `₹${(abs/1000).toFixed(1)}K`
    return `₹${abs}`
  }

  return (
    <aside className="sidebar" style={{
      width: 240,
      background: 'linear-gradient(180deg, #0a0f1a 0%, #07090f 100%)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      minHeight: '100vh',
      padding: '24px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ padding: '0 10px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #22d3a0 0%, #3b82f6 100%)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(34,211,160,0.3)',
          flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#eef2f8', letterSpacing: '-0.3px' }}>FinTrack</div>
          <div style={{ fontSize: 10, color: '#3d5270', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Pro</div>
        </div>
      </div>

      {/* Balance widget */}
      <div style={{
        margin: '0 2px 20px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(34,211,160,0.1), rgba(59,130,246,0.07))',
        border: '1px solid rgba(34,211,160,0.15)',
        borderRadius: 14,
      }}>
        <div style={{ fontSize: 10, color: '#3d5270', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>NET BALANCE</div>
        <div style={{
          fontSize: 22, fontWeight: 700, color: totalBalance >= 0 ? '#22d3a0' : '#f87171',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '-0.5px',
        }}>
          {totalBalance >= 0 ? '' : '-'}{fmt(totalBalance)}
        </div>
        <div style={{ fontSize: 11, color: '#3d5270', marginTop: 4 }}>All time · {transactions.length} transactions</div>
      </div>

      {/* Nav label */}
      <div style={{ fontSize: 10, color: '#3d5270', fontWeight: 600, letterSpacing: '1.5px', padding: '0 12px 8px', textTransform: 'uppercase' }}>
        Navigation
      </div>

      {/* Nav items */}
      {NAV.map(item => {
        const active = activePage === item.id
        return (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            fontSize: 14, fontWeight: active ? 600 : 500,
            color: active ? '#22d3a0' : '#7e96b8',
            background: active ? 'rgba(34,211,160,0.09)' : 'transparent',
            transition: 'all 0.15s ease',
            position: 'relative',
          }}
          onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#eef2f8' } }}
          onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7e96b8' } }}
          >
            {active && (
              <div style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                width: 3, height: '60%', background: '#22d3a0',
                borderRadius: '0 3px 3px 0', boxShadow: '0 0 10px rgba(34,211,160,0.6)',
              }}/>
            )}
            <span style={{ opacity: active ? 1 : 0.65 }}>{item.icon}</span>
            {item.label}
          </button>
        )
      })}

      <div style={{ flex: 1 }}/>

      {/* Role selector */}
      <div className="sidebar-footer" style={{
        padding: '14px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginTop: 8,
      }}>
        <div style={{ fontSize: 10, color: '#3d5270', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 10 }}>View as role</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['viewer', 'admin'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '7px 0',
              borderRadius: 7,
              border: `1px solid ${role === r ? 'rgba(34,211,160,0.4)' : 'rgba(255,255,255,0.07)'}`,
              background: role === r ? 'rgba(34,211,160,0.12)' : 'transparent',
              color: role === r ? '#22d3a0' : '#7e96b8',
              fontSize: 12, fontWeight: 600,
              transition: 'all 0.15s ease',
              textTransform: 'capitalize', letterSpacing: '0.3px',
            }}>
              {r === 'admin' ? '🔑 ' : '👁 '}{r}
            </button>
          ))}
        </div>
        {role === 'admin' && (
          <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 7, fontSize: 11, color: '#fbbf24' }}>
            ✎ Admin: full edit access
          </div>
        )}
      </div>
    </aside>
  )
}
