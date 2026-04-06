import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Insights from "./pages/Insights"
import { useStore } from "./store/store"

export default function App() {
  const [page, setPage] = useState("dashboard")
  const { role } = useStore()

  return (
    <div className="layout">
      <Sidebar setPage={setPage} activePage={page} />
      <div className="main-content">
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 32, paddingBottom: 20,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              padding: '4px 10px', borderRadius: 20,
              background: role === 'admin' ? 'rgba(251,191,36,0.1)' : 'rgba(34,211,160,0.08)',
              border: `1px solid ${role === 'admin' ? 'rgba(251,191,36,0.25)' : 'rgba(34,211,160,0.2)'}`,
              fontSize: 12, fontWeight: 600,
              color: role === 'admin' ? '#fbbf24' : '#22d3a0',
            }}>
              {role === 'admin' ? '🔑 Admin Mode' : '👁 Viewer Mode'}
            </div>
            {role === 'admin' && (
              <span style={{ fontSize: 12, color: '#3d5270' }}>Full edit access enabled</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#3d5270' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #22d3a0, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: '#07090f',
            }}>U</div>
          </div>
        </div>

        {page === "dashboard" && <Dashboard />}
        {page === "transactions" && <Transactions />}
        {page === "insights" && <Insights />}
      </div>
    </div>
  )
}
