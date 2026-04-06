import { create } from "zustand"
import { persist } from "zustand/middleware"
import { transactions as initial } from "../data/mockData"

const nextId = (txns) => Math.max(0, ...txns.map(t => t.id)) + 1

export const useStore = create(
  persist(
    (set, get) => ({
      transactions: initial,
      role: "viewer",
      filterType: "all",
      filterCategory: "all",
      filterMonth: "all",
      searchQuery: "",
      sortBy: "date",
      sortDir: "desc",

      setRole: (role) => set({ role }),
      setFilterType: (filterType) => set({ filterType }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setFilterMonth: (filterMonth) => set({ filterMonth }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortBy: (sortBy) => {
        const cur = get().sortBy
        if (cur === sortBy) set({ sortDir: get().sortDir === "asc" ? "desc" : "asc" })
        else set({ sortBy, sortDir: "desc" })
      },

      addTransaction: (tx) => set((s) => ({
        transactions: [...s.transactions, { ...tx, id: nextId(s.transactions) }]
      })),

      editTransaction: (id, updates) => set((s) => ({
        transactions: s.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
      })),

      deleteTransaction: (id) => set((s) => ({
        transactions: s.transactions.filter(t => t.id !== id)
      })),

      resetData: () => set({ transactions: initial }),

      getFiltered: () => {
        const { transactions, filterType, filterCategory, filterMonth, searchQuery, sortBy, sortDir } = get()
        let res = [...transactions]
        if (filterType !== "all") res = res.filter(t => t.type === filterType)
        if (filterCategory !== "all") res = res.filter(t => t.category === filterCategory)
        if (filterMonth !== "all") res = res.filter(t => t.date.slice(0, 7) === filterMonth)
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          res = res.filter(t =>
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            String(t.amount).includes(q)
          )
        }
        res.sort((a, b) => {
          let va = a[sortBy], vb = b[sortBy]
          if (sortBy === "amount") { va = Number(va); vb = Number(vb) }
          if (va < vb) return sortDir === "asc" ? -1 : 1
          if (va > vb) return sortDir === "asc" ? 1 : -1
          return 0
        })
        return res
      }
    }),
    { name: "fintrack-storage" }
  )
)
