"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getExpenses, createExpense, deleteExpense, updateExpense, getProfile } from "@/services/expenseService"
import AddExpenseForm from "@/components/AddExpenseForm"
import ExpenseList from "@/components/ExpenseList"
import { Expense } from "@/types/Expense"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts"
import { motion, AnimatePresence } from "framer-motion"

const CATEGORY_COLORS: Record<string, string> = {
  "Comida": "#EF4444",
  "Supermercado": "#22C55E",
  "Cafetería": "#A16207",
  "Transporte": "#F59E0B",
  "Ocio": "#8B5CF6",
  "Educación": "#3B82F6",
  "Deporte": "#10B981",
  "Salud": "#EC4899",
  "Ropa": "#F97316",
  "Hogar": "#6366F1",
  "Tecnología": "#06B6D4",
  "Suscripciones": "#E11D48",
  "Viajes": "#0EA5E9",
  "Mascotas": "#D97706",
  "Regalos": "#A855F7",
  "Finanzas": "#14B8A6",
  "Otros": "#6B7280",
}

// Genera opciones de filtro por mes (últimos 12 meses)
function getMonthOptions() {
  const now = new Date()
  const options = [
    { label: "Todos los meses", value: "" },
    { label: "Últimos 7 días", value: "last7" },
    { label: "Últimos 30 días", value: "last30" },
  ]
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    options.push({ label: label.charAt(0).toUpperCase() + label.slice(1), value })
  }
  return options
}

type SortKey = "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "category"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [monthFilter, setMonthFilter] = useState("")
  const [sortBy, setSortBy] = useState<SortKey>("date-desc")
  const [budget, setBudget] = useState(0)
  const router = useRouter()

  const monthOptions = getMonthOptions()

  // Mostrar toast
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    async function loadData() {
      try {
        setLoading(true)
        const [expData, profileData] = await Promise.all([getExpenses(), getProfile()])
        setExpenses(Array.isArray(expData) ? expData : [])
        setBudget(profileData.budget || 0)
      } catch (error) {
        console.error("Error cargando datos:", error)
        setExpenses([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // ─── CRUD con toasts ───
  const addExpense = async (title: string, amount: number, category: string, recurring: boolean) => {
    try {
      const newExpense = await createExpense(title, amount, category, recurring)
      setExpenses(prev => [...prev, newExpense])
      showToast("success", `✅ Gasto "${title}" añadido`)
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Error creando gasto")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id)
      setExpenses(prev => prev.filter(e => e.id !== id))
      showToast("success", "🗑️ Gasto eliminado")
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Error eliminando gasto")
    }
  }

  const handleUpdate = async (id: string, title: string, amount: number, category: string, recurring: boolean) => {
    try {
      const updatedExpense = await updateExpense(id, title, amount, category, recurring)
      setExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e))
      showToast("success", `✏️ Gasto "${title}" actualizado`)
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Error actualizando gasto")
    }
  }

  // ─── Filtrado por fecha ───
  const filteredExpenses = (() => {
    if (!monthFilter) return expenses

    const now = new Date()

    if (monthFilter === "last7") {
      const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return expenses.filter(e => new Date(e.date) >= cutoff)
    }
    if (monthFilter === "last30") {
      const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return expenses.filter(e => new Date(e.date) >= cutoff)
    }

    // Filtro por mes específico "2026-03"
    return expenses.filter(e => {
      const d = new Date(e.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      return key === monthFilter
    })
  })()

  // ─── Ordenamiento ───
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case "date-desc": return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc": return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "amount-desc": return b.amount - a.amount
      case "amount-asc": return a.amount - b.amount
      case "category": return (a.category || "").localeCompare(b.category || "")
      default: return 0
    }
  })

  // ─── Estadísticas ───
  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
  const max = filteredExpenses.reduce((prev, e) => (e.amount > prev ? e.amount : prev), 0)
  const average = filteredExpenses.length ? (total / filteredExpenses.length).toFixed(2) : 0
  const recurringTotal = filteredExpenses.filter(e => e.recurring).reduce((sum, e) => sum + e.amount, 0)

  // Datos de gráfico mensual (siempre 12 meses, sin filtro)
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const monthTotal = expenses
      .filter(e => new Date(e.date).getMonth() + 1 === month)
      .reduce((sum, e) => sum + e.amount, 0)
    return { month: new Date(0, i).toLocaleString("es", { month: "short" }), total: monthTotal }
  })

  // Categorías (sobre filtrados)
  const categoryData = Object.entries(
    filteredExpenses.reduce((acc, e) => {
      const cat = e.category || "Otros"
      acc[cat] = (acc[cat] || 0) + e.amount
      return acc
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))

  // ─── Presupuesto mensual ───
  const now = new Date()
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const budgetPercent = budget > 0 ? Math.min((currentMonthTotal / budget) * 100, 100) : 0
  const budgetOverflow = budget > 0 && currentMonthTotal > budget

  // ─── Exportar CSV ───
  const exportCSV = () => {
    const headers = ["Concepto", "Cantidad (€)", "Categoría", "Recurrente", "Fecha"]
    const rows = sortedExpenses.map(e => [
      e.title,
      e.amount.toFixed(2),
      e.category || "Otros",
      e.recurring ? "Sí" : "No",
      new Date(e.date).toLocaleDateString("es-ES")
    ])

    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" }) // BOM para Excel
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `gastos_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()

    URL.revokeObjectURL(url)
    showToast("success", "📄 CSV descargado")
  }

  // Spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Cargando tus gastos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">

      <h1 className="text-3xl font-bold text-blue-700 mb-4">Tus Gastos</h1>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`px-4 py-3 rounded-lg flex justify-between items-center ${toast.type === "success"
              ? "bg-green-100 border border-green-300 text-green-700"
              : "bg-red-100 border border-red-300 text-red-700"
              }`}
          >
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="font-bold ml-3 hover:opacity-70">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra de presupuesto mensual */}
      {budget > 0 && (
        <div className="bg-white p-5 rounded-lg shadow space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">💰 Presupuesto mensual</h2>
            <span className={`text-sm font-bold ${budgetOverflow ? "text-red-600" : "text-green-600"}`}>
              {currentMonthTotal.toFixed(2)} € / {budget} €
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full transition-colors ${budgetOverflow ? "bg-red-500" : budgetPercent > 75 ? "bg-yellow-400" : "bg-green-500"
                }`}
            />
          </div>
          <p className="text-xs text-gray-400">
            {budgetOverflow
              ? `⚠️ Has superado tu presupuesto por ${(currentMonthTotal - budget).toFixed(2)} €`
              : `Te quedan ${(budget - currentMonthTotal).toFixed(2)} € este mes`}
          </p>
        </div>
      )}

      {/* Filtros, ordenamiento y exportar */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 font-medium text-sm">📅 Filtrar:</label>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition text-sm"
          >
            {monthOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-600 font-medium text-sm">↕️ Ordenar:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition text-sm"
          >
            <option value="date-desc">Fecha (recientes)</option>
            <option value="date-asc">Fecha (antiguos)</option>
            <option value="amount-desc">Importe (mayor)</option>
            <option value="amount-asc">Importe (menor)</option>
            <option value="category">Categoría (A-Z)</option>
          </select>
        </div>

        <button
          onClick={exportCSV}
          disabled={sortedExpenses.length === 0}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${sortedExpenses.length > 0
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          📥 Exportar CSV
        </button>

        {monthFilter && (
          <button onClick={() => setMonthFilter("")} className="text-sm text-blue-600 hover:underline">
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Sección de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-6 rounded-lg shadow hover:scale-105 transform transition">
          <h2 className="text-lg font-semibold text-blue-700">Total Gastado</h2>
          <p className="text-2xl font-bold mt-2">{total.toFixed(2)} €</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow hover:scale-105 transform transition">
          <h2 className="text-lg font-semibold text-green-700">Gasto Promedio</h2>
          <p className="text-2xl font-bold mt-2">{average} €</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow hover:scale-105 transform transition">
          <h2 className="text-lg font-semibold text-red-700">Mayor Gasto</h2>
          <p className="text-2xl font-bold mt-2">{max.toFixed(2)} €</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow hover:scale-105 transform transition">
          <h2 className="text-lg font-semibold text-purple-700">🔁 Recurrentes</h2>
          <p className="text-2xl font-bold mt-2">{recurringTotal.toFixed(2)} €</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Gastos Mensuales</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} €`} />
              <Bar dataKey="total" fill="#2563EB">
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.total === max ? "#EF4444" : "#2563EB"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Gastos por Categoría</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                  label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={CATEGORY_COLORS[entry.name] || "#6B7280"} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} €`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 italic text-center py-8">Añade gastos para ver el desglose</p>
          )}
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white p-6 rounded-lg shadow">
        <AddExpenseForm onAddExpense={addExpense} />
      </div>

      {/* Lista de gastos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <ExpenseList expenses={sortedExpenses} onDelete={handleDelete} onUpdate={handleUpdate} />
      </div>

    </div>
  )
}
