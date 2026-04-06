import { useState } from "react"
import { useStore } from "../store/store"
import TransactionTable from "../components/TransactionTable"
import TransactionModal from "../components/TransactionModal"

const MONTHS = [
  { v: "all", l: "All Months" },
  { v: "2026-04", l: "Apr 2026" },
  { v: "2026-03", l: "Mar 2026" },
  { v: "2026-02", l: "Feb 2026" },
]

const CATEGORIES = ["all","Food","Transport","Shopping","Entertainment","Utilities","Health","Education","Salary","Freelance","Investment"]

const selStyle = {
  padding: '8px 12px', borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'var(--surface2)',
  color: '#eef2f8', fontSize: 13, fontWeight: 500,
}

export default function Transactions() {
  const {
    role, transactions, getFiltered,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    filterMonth, setFilterMonth,
    searchQuery, setSearchQuery,
    resetData,
  } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const filtered = getFiltered()

  const income = filtered.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0)
  const expense = filtered.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0)

  const exportCSV = () => {
    const header = "Date,Description,Category,Type,Amount\n"
    const rows = filtered.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`).join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click()
    setShowExportMenu(false)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "transactions.json"; a.click()
    setShowExportMenu(false)
  }

  return (
    <div style={{ maxWidth: 1100, paddingBottom: 40 }}>
      {showAdd && <TransactionModal mode="add" onClose={() => setShowAdd(false)} />}

      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: '#3d5270', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>HISTORY</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', color: '#eef2f8', lineHeight: 1 }}>Transactions</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Export */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowExportMenu(!showExportMenu)} style={{
              padding: '9px 16px', borderRadius: 9,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: '#7e96b8', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Export
            </button>
            {showExportMenu && (
              <div style={{
                position: 'absolute', top: '110%', right: 0, zIndex: 99,
                background: 'var(--surface2)', border: '1px solid var(--border2)',
                borderRadius: 10, overflow: 'hidden', minWidth: 140,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}>
                {[{ l: "Export CSV", fn: exportCSV }, { l: "Export JSON", fn: exportJSON }].map(item => (
                  <button key={item.l} onClick={item.fn} style={{
                    width: '100%', padding: '10px 14px', textAlign: 'left',
                    background: 'transparent', border: 'none', color: '#eef2f8', fontSize: 13, fontWeight: 500,
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >{item.l}</button>
                ))}
              </div>
            )}
          </div>

          {role === 'admin' && (
            <button onClick={() => setShowAdd(true)} style={{
              padding: '9px 18px', borderRadius: 9, border: 'none',
              background: 'linear-gradient(135deg, #22d3a0, #3b82f6)',
              color: '#07090f', fontSize: 13, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 16px rgba(34,211,160,0.25)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Showing', val: `${filtered.length} transactions`, color: '#7e96b8' },
          { label: 'Income', val: `₹${income.toLocaleString('en-IN')}`, color: '#22d3a0' },
          { label: 'Expenses', val: `₹${expense.toLocaleString('en-IN')}`, color: '#f87171' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '12px 16px',
          }}>
            <div style={{ fontSize: 11, color: '#3d5270', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="fade-up-2" style={{
        display: 'flex', gap: 10, flexWrap: 'wrap',
        marginBottom: 16, alignItems: 'center',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#3d5270' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            type="text" placeholder="Search transactions..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ ...selStyle, paddingLeft: 32, width: '100%' }}
          />
        </div>

        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selStyle}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={selStyle}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
        </select>

        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={selStyle}>
          {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
        </select>

        {(filterType !== 'all' || filterCategory !== 'all' || filterMonth !== 'all' || searchQuery) && (
          <button onClick={() => { setFilterType('all'); setFilterCategory('all'); setFilterMonth('all'); setSearchQuery('') }} style={{
            padding: '8px 12px', borderRadius: 8,
            border: '1px solid rgba(248,113,113,0.3)',
            background: 'rgba(248,113,113,0.08)',
            color: '#f87171', fontSize: 12, fontWeight: 600,
          }}>Clear ✕</button>
        )}
      </div>

      <div className="fade-up-3">
        <TransactionTable />
      </div>
    </div>
  )
}
