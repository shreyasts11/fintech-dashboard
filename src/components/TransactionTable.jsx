import { useState } from "react"
import { useStore } from "../store/store"
import TransactionModal from "./TransactionModal"

const CAT_COLORS = {
  Food:          { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24' },
  Transport:     { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6' },
  Shopping:      { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa' },
  Salary:        { bg: 'rgba(34,211,160,0.1)',  color: '#22d3a0' },
  Entertainment: { bg: 'rgba(248,113,113,0.1)', color: '#f87171' },
  Utilities:     { bg: 'rgba(251,146,60,0.1)',  color: '#fb923c' },
  Health:        { bg: 'rgba(236,72,153,0.1)',  color: '#ec4899' },
  Education:     { bg: 'rgba(6,182,212,0.1)',   color: '#06b6d4' },
  Freelance:     { bg: 'rgba(16,185,129,0.1)',  color: '#10b981' },
  Investment:    { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
}
const DEF = { bg: 'rgba(255,255,255,0.06)', color: '#7e96b8' }

export default function TransactionTable() {
  const { role, deleteTransaction, sortBy, sortDir, setSortBy, getFiltered } = useStore()
  const filtered = getFiltered()
  const [editTx, setEditTx] = useState(null)

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span style={{ color: '#3d5270', marginLeft: 4 }}>↕</span>
    return <span style={{ color: '#22d3a0', marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const thStyle = (col) => ({
    padding: '13px 18px', textAlign: 'left',
    fontSize: 11, fontWeight: 600, color: '#3d5270',
    letterSpacing: '1.2px', textTransform: 'uppercase',
    cursor: 'pointer', userSelect: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
  })

  return (
    <>
      {editTx && <TransactionModal mode="edit" tx={editTx} onClose={() => setEditTx(null)} />}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '64px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, color: '#7e96b8', fontWeight: 600 }}>No transactions found</div>
            <div style={{ fontSize: 13, color: '#3d5270', marginTop: 6 }}>Try adjusting your filters or search query</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {[
                    { key: 'date', label: 'Date' },
                    { key: 'description', label: 'Description' },
                    { key: 'category', label: 'Category' },
                    { key: 'type', label: 'Type' },
                    { key: 'amount', label: 'Amount' },
                  ].map(h => (
                    <th key={h.key} style={thStyle(h.key)} onClick={() => setSortBy(h.key)}
                      onMouseEnter={e => e.currentTarget.style.color = '#7e96b8'}
                      onMouseLeave={e => e.currentTarget.style.color = '#3d5270'}
                    >
                      {h.label}<SortIcon col={h.key} />
                    </th>
                  ))}
                  {role === 'admin' && <th style={{ ...thStyle(), cursor: 'default' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const cat = CAT_COLORS[t.category] || DEF
                  const isIncome = t.type === 'income'
                  return (
                    <tr key={t.id} style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: 13, color: '#3d5270', fontFamily: "'JetBrains Mono', monospace" }}>{t.date}</span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: 14, color: '#eef2f8', fontWeight: 500 }}>{t.description}</span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20,
                          fontSize: 12, fontWeight: 600,
                          background: cat.bg, color: cat.color,
                        }}>{t.category}</span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: isIncome ? '#22d3a0' : '#f87171',
                            boxShadow: isIncome ? '0 0 6px #22d3a0' : '0 0 6px #f87171',
                            animation: 'pulse-glow 2s infinite',
                          }}/>
                          <span style={{ fontSize: 13, color: isIncome ? '#22d3a0' : '#f87171', fontWeight: 500, textTransform: 'capitalize' }}>
                            {t.type}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: 15, fontWeight: 700,
                          color: isIncome ? '#22d3a0' : '#eef2f8',
                          fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: '-0.5px',
                        }}>
                          {isIncome ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      {role === 'admin' && (
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setEditTx(t)} style={{
                              padding: '5px 12px', borderRadius: 7,
                              border: '1px solid rgba(59,130,246,0.3)',
                              background: 'rgba(59,130,246,0.08)',
                              color: '#3b82f6', fontSize: 12, fontWeight: 600,
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)' }}
                            >Edit</button>
                            <button onClick={() => window.confirm('Delete this transaction?') && deleteTransaction(t.id)} style={{
                              padding: '5px 12px', borderRadius: 7,
                              border: '1px solid rgba(248,113,113,0.3)',
                              background: 'rgba(248,113,113,0.08)',
                              color: '#f87171', fontSize: 12, fontWeight: 600,
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.18)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
                            >Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
