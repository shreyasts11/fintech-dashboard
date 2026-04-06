import { useStore } from "../store/store"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line, Legend
} from "recharts"
import { monthlyTrend } from "../data/mockData"

const COLORS = ['#f87171','#3b82f6','#a78bfa','#fbbf24','#22d3a0','#fb923c','#ec4899','#06b6d4','#10b981','#6366f1']

export default function Insights() {
  const { transactions } = useStore()

  // April vs March comparison
  const byMonth = (ym) => transactions.filter(t => t.date.startsWith(ym))
  const apr = byMonth("2026-04")
  const mar = byMonth("2026-03")
  const feb = byMonth("2026-02")

  const monthStats = (txns) => ({
    income: txns.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0),
    expense: txns.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0),
  })
  const aprStats = monthStats(apr)
  const marStats = monthStats(mar)
  const febStats = monthStats(feb)

  // Category totals from all transactions
  const catTotals = {}
  transactions.filter(t => t.type === "expense").forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount
  })
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1])
  const totalExpense = sorted.reduce((a, [, v]) => a + v, 0)
  const highest = sorted[0]
  const highest2 = sorted[1]

  const barData = sorted.map(([name, value]) => ({ name, value }))

  // Month comparison data
  const compData = [
    { month: 'Feb', ...febStats },
    { month: 'Mar', ...marStats },
    { month: 'Apr', ...aprStats },
  ]

  // Savings each month
  const savingsData = monthlyTrend.map(m => ({
    month: m.month,
    savings: m.income - m.expense,
    rate: Math.round(((m.income - m.expense) / m.income) * 100),
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: '#131d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
        <div style={{ color: '#7e96b8', marginBottom: 4 }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
            {p.name}: {typeof p.value === 'number' && p.name !== 'Rate' ? `₹${p.value.toLocaleString('en-IN')}` : `${p.value}%`}
          </div>
        ))}
      </div>
    )
  }

  const savingsRate = aprStats.income > 0 ? Math.round(((aprStats.income - aprStats.expense) / aprStats.income) * 100) : 0
  const expChangePct = marStats.expense > 0 ? Math.round(((aprStats.expense - marStats.expense) / marStats.expense) * 100) : 0

  return (
    <div style={{ maxWidth: 1100, paddingBottom: 40 }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#3d5270', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>ANALYTICS</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', color: '#eef2f8' }}>Insights</h1>
        <p style={{ fontSize: 14, color: '#7e96b8', marginTop: 6 }}>Understand your spending patterns and financial health</p>
      </div>

      {/* Insight callout cards */}
      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {/* Highest spending */}
        {highest && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(248,113,113,0.1), rgba(248,113,113,0.04))',
            border: '1px solid rgba(248,113,113,0.2)', borderRadius: 16, padding: '20px',
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>🔥</div>
            <div style={{ fontSize: 11, color: '#f87171', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Top Spending</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#eef2f8', letterSpacing: '-0.5px' }}>{highest[0]}</div>
            <div style={{ fontSize: 16, color: '#f87171', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, marginTop: 2 }}>
              ₹{highest[1].toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 12, color: '#3d5270', marginTop: 4 }}>{((highest[1]/totalExpense)*100).toFixed(0)}% of all expenses</div>
          </div>
        )}

        {/* Savings rate */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,211,160,0.1), rgba(34,211,160,0.04))',
          border: '1px solid rgba(34,211,160,0.2)', borderRadius: 16, padding: '20px',
        }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>💰</div>
          <div style={{ fontSize: 11, color: '#22d3a0', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Savings Rate (Apr)</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#22d3a0', letterSpacing: '-1px', fontFamily: "'JetBrains Mono', monospace" }}>{savingsRate}%</div>
          <div style={{ fontSize: 12, color: '#3d5270', marginTop: 4 }}>
            {savingsRate >= 20 ? '✅ Excellent savings habit!' : savingsRate >= 10 ? '👍 On track' : '⚠️ Try to save more'}
          </div>
        </div>

        {/* Monthly change */}
        <div style={{
          background: `linear-gradient(135deg, rgba(${expChangePct > 0 ? '248,113,113' : '34,211,160'},0.1), rgba(${expChangePct > 0 ? '248,113,113' : '34,211,160'},0.04))`,
          border: `1px solid rgba(${expChangePct > 0 ? '248,113,113' : '34,211,160'},0.2)`, borderRadius: 16, padding: '20px',
        }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>{expChangePct > 0 ? '📈' : '📉'}</div>
          <div style={{ fontSize: 11, color: expChangePct > 0 ? '#f87171' : '#22d3a0', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Expense Change</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: expChangePct > 0 ? '#f87171' : '#22d3a0', letterSpacing: '-1px', fontFamily: "'JetBrains Mono', monospace" }}>
            {expChangePct > 0 ? '+' : ''}{expChangePct}%
          </div>
          <div style={{ fontSize: 12, color: '#3d5270', marginTop: 4 }}>vs March 2026</div>
        </div>
      </div>

      {/* Charts */}
      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Category bar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#eef2f8', marginBottom: 2 }}>Spending by Category</div>
            <div style={{ fontSize: 12, color: '#3d5270' }}>All time · sorted by amount</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#3d5270', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#7e96b8', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={({ active, payload }) => active && payload?.length ? (
                <div style={{ background: '#131d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px', fontSize: 12 }}>
                  <span style={{ color: '#22d3a0', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>₹{payload[0].value.toLocaleString('en-IN')}</span>
                </div>
              ) : null} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly comparison */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#eef2f8', marginBottom: 2 }}>3-Month Comparison</div>
            <div style={{ fontSize: 12, color: '#3d5270' }}>Feb · Mar · Apr 2026</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={compData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#3d5270', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#3d5270', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#7e96b8', paddingTop: 8 }} />
              <Line type="monotone" dataKey="income" name="Income" stroke="#22d3a0" strokeWidth={2.5} dot={{ fill: '#22d3a0', r: 5, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="expense" name="Expense" stroke="#f87171" strokeWidth={2.5} dot={{ fill: '#f87171', r: 5, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category progress bars */}
      <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#eef2f8', marginBottom: 18 }}>Category Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sorted.map(([cat, val], i) => {
              const pct = Math.round((val / totalExpense) * 100)
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }}/>
                      <span style={{ fontSize: 13, color: '#c8d4e6', fontWeight: 500 }}>{cat}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 13, color: '#eef2f8', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>₹{val.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: 11, color: '#3d5270', marginLeft: 6 }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: COLORS[i % COLORS.length],
                      borderRadius: 3, transformOrigin: 'left',
                      animation: 'bar-grow 1s ease both',
                      animationDelay: `${i * 0.05}s`,
                    }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Savings trend */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#eef2f8', marginBottom: 2 }}>Savings Trend</div>
            <div style={{ fontSize: 12, color: '#3d5270' }}>Net savings per month</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={savingsData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#3d5270', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#3d5270', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
              <Tooltip contentStyle={{ background: '#131d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Savings']} />
              <defs>
                <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
              <Bar dataKey="savings" name="Savings" radius={[6,6,0,0]} fill="url(#savGrad)" />
            </BarChart>
          </ResponsiveContainer>

          {/* Observations */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7e96b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>Key Observations</div>
            {[
              `${highest?.[0] || 'Shopping'} is your biggest expense category`,
              `You saved ${savingsRate}% of income in April`,
              `Expenses ${expChangePct >= 0 ? 'increased' : 'decreased'} by ${Math.abs(expChangePct)}% vs last month`,
              'Income is consistent at ₹85K salary base'
            ].map((obs, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22d3a0', marginTop: 5, flexShrink: 0 }}/>
                <span style={{ fontSize: 12, color: '#7e96b8' }}>{obs}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
