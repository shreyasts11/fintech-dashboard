import { useState } from "react"
import { useStore } from "../store/store"

const CATEGORIES = ["Food","Transport","Shopping","Entertainment","Utilities","Health","Education","Salary","Freelance","Investment","Other"]

const fieldStyle = {
  width: '100%', padding: '10px 14px',
  background: 'var(--surface2)', border: '1px solid var(--border2)',
  borderRadius: 8, color: 'var(--text)', fontSize: 14,
}
const labelStyle = { fontSize: 12, color: '#7e96b8', fontWeight: 600, marginBottom: 6, letterSpacing: '0.5px', display: 'block' }

export default function TransactionModal({ mode, tx, onClose }) {
  const { addTransaction, editTransaction } = useStore()
  const [form, setForm] = useState({
    date: tx?.date || new Date().toISOString().slice(0,10),
    description: tx?.description || "",
    category: tx?.category || "Food",
    type: tx?.type || "expense",
    amount: tx?.amount || "",
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.description.trim()) e.description = "Required"
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter a valid amount"
    if (!form.date) e.date = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const data = { ...form, amount: Number(form.amount) }
    if (mode === "add") addTransaction(data)
    else editTransaction(tx.id, data)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#eef2f8' }}>
            {mode === "add" ? "Add Transaction" : "Edit Transaction"}
          </h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#7e96b8', width: 32, height: 32, borderRadius: 8, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Type toggle */}
        <div style={{ marginBottom: 18 }}>
          <span style={labelStyle}>Type</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {["income","expense"].map(t => (
              <button key={t} onClick={() => set("type", t)} style={{
                flex: 1, padding: '10px',
                borderRadius: 8,
                border: `1px solid ${form.type === t ? (t === "income" ? 'rgba(34,211,160,0.4)' : 'rgba(248,113,113,0.4)') : 'var(--border2)'}`,
                background: form.type === t ? (t === "income" ? 'rgba(34,211,160,0.1)' : 'rgba(248,113,113,0.1)') : 'transparent',
                color: form.type === t ? (t === "income" ? '#22d3a0' : '#f87171') : '#7e96b8',
                fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
              }}>
                {t === "income" ? "↑ Income" : "↓ Expense"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={fieldStyle} />
            {errors.date && <div style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{errors.date}</div>}
          </div>
          <div>
            <label style={labelStyle}>Amount (₹)</label>
            <input type="number" placeholder="0" value={form.amount} onChange={e => set("amount", e.target.value)} style={fieldStyle} min="0" />
            {errors.amount && <div style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{errors.amount}</div>}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Description</label>
          <input type="text" placeholder="What was this for?" value={form.description} onChange={e => set("description", e.target.value)} style={fieldStyle} />
          {errors.description && <div style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{errors.description}</div>}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Category</label>
          <select value={form.category} onChange={e => set("category", e.target.value)} style={fieldStyle}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '12px',
            borderRadius: 10, border: '1px solid var(--border2)',
            background: 'transparent', color: '#7e96b8', fontSize: 14, fontWeight: 600,
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            flex: 2, padding: '12px',
            borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #22d3a0, #3b82f6)',
            color: '#07090f', fontSize: 14, fontWeight: 700,
            boxShadow: '0 4px 16px rgba(34,211,160,0.25)',
          }}>
            {mode === "add" ? "Add Transaction" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
