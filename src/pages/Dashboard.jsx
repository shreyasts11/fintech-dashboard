import { useStore } from "../store/store"
import SummaryCard from "../components/SummaryCard"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts"
import { monthlyTrend } from "../data/mockData"

const COLORS = ['#22d3a0','#3b82f6','#a78bfa','#fbbf24','#f87171','#fb923c','#ec4899','#06b6d4','#10b981','#6366f1']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#131d2e', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px', fontSize: 13,
    }}>
      <div style={{ color: '#7e96b8', marginBottom: 6, fontSize: 11 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
          {p.name}: ₹{Number(p.value)?.toLocaleString('en-IN')}
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { transactions } = useStore()

  const aprilTx = transactions.filter(t => t.date.startsWith("2026-04"))
  const income = aprilTx.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0)
  const expense = aprilTx.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0)
  const balance = income - expense
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0

  const pieData = Object.entries(
    aprilTx.filter(t => t.type === "expense").reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount; return acc
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

  const recentTx = [...transactions].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 5)

  const catColors = { Food: '#fbbf24', Transport: '#3b82f6', Shopping: '#a78bfa', Entertainment: '#f87171', Utilities: '#fb923c', Health: '#ec4899', Education: '#06b6d4', Salary: '#22d3a0', Freelance: '#10b981', Investment: '#6366f1' }

  return (
    <div style={{ maxWidth: 1140, paddingBottom: 40 }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#3d5270', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>APRIL 2026</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', color: '#eef2f8', lineHeight: 1 }}>
          Financial Overview
        </h1>
        <p style={{ fontSize: 14, color: '#7e96b8', marginTop: 6 }}>Your complete financial picture for this month</p>
      </div>

      {/* Summary Cards */}
      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <SummaryCard title="Net Balance" value={balance} type="balance"
          subtitle="Income − Expenses" trend={12}
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
        />
        <SummaryCard title="Total Income" value={income} type="income"
          subtitle="All sources" trend={8}
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>}
        />
        <SummaryCard title="Total Expenses" value={expense} type="expense"
          subtitle="This month" trend={-3}
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>}
        />
        <SummaryCard title="Savings Rate" value={savingsRate} type="savings"
          subtitle="% of income saved" trend={5}
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
        />
      </div>

      {/* Charts Row */}
      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 16 }}>
        {/* Monthly trend area chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#eef2f8', marginBottom: 2 }}>Cash Flow Trend</div>
              <div style={{ fontSize: 12, color: '#3d5270' }}>Income vs Expenses · Last 7 months</div>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
              <span style={{ color: '#22d3a0', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 2, background: '#22d3a0', display: 'inline-block', borderRadius: 1 }}/>Income
              </span>
              <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 2, background: '#f87171', display: 'inline-block', borderRadius: 1 }}/>Expense
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3a0" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#22d3a0" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#3d5270', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#3d5270', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#22d3a0" strokeWidth={2.5} fill="url(#incG)" dot={{ fill: '#22d3a0', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#22d3a0', stroke: '#07090f', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#f87171" strokeWidth={2.5} fill="url(#expG)" dot={{ fill: '#f87171', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#f87171', stroke: '#07090f', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#eef2f8', marginBottom: 2 }}>Spending Mix</div>
            <div style={{ fontSize: 12, color: '#3d5270' }}>April 2026 · by category</div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#131d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} itemStyle={{ color: '#eef2f8' }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
            {pieData.slice(0,4).map((d, i) => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length] }}/>
                  <span style={{ fontSize: 12, color: '#7e96b8' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 12, color: '#eef2f8', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                  ₹{d.value.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Recent Transactions + Monthly Bar */}
      <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Transactions */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#eef2f8', marginBottom: 16 }}>Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentTx.map(t => {
              const isIncome = t.type === 'income'
              const col = catColors[t.category] || '#7e96b8'
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${col}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                    {t.category === 'Food' ? '🍽️' : t.category === 'Transport' ? '🚗' : t.category === 'Shopping' ? '🛍️' : t.category === 'Salary' ? '💼' : t.category === 'Entertainment' ? '🎮' : t.category === 'Health' ? '❤️' : t.category === 'Freelance' ? '💻' : t.category === 'Utilities' ? '⚡' : t.category === 'Investment' ? '📈' : '💰'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#eef2f8', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description}</div>
                    <div style={{ fontSize: 11, color: '#3d5270' }}>{t.date}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isIncome ? '#22d3a0' : '#eef2f8', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                    {isIncome ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monthly comparison bar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#eef2f8', marginBottom: 2 }}>Monthly Income</div>
            <div style={{ fontSize: 12, color: '#3d5270' }}>Last 7 months performance</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#3d5270', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#3d5270', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
              <Tooltip contentStyle={{ background: '#131d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Income']} />
              <Bar dataKey="income" name="Income" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3a0"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
