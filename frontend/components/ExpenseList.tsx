"use client"

import { Expense } from "../types/Expense"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CATEGORIES = [
  { value: "Comida", emoji: "🍔" },
  { value: "Supermercado", emoji: "🛒" },
  { value: "Cafetería", emoji: "☕" },
  { value: "Transporte", emoji: "🚗" },
  { value: "Ocio", emoji: "🎮" },
  { value: "Educación", emoji: "📚" },
  { value: "Deporte", emoji: "⚽" },
  { value: "Salud", emoji: "🏥" },
  { value: "Ropa", emoji: "👕" },
  { value: "Hogar", emoji: "🏠" },
  { value: "Tecnología", emoji: "💻" },
  { value: "Suscripciones", emoji: "📺" },
  { value: "Viajes", emoji: "✈️" },
  { value: "Mascotas", emoji: "🐾" },
  { value: "Regalos", emoji: "🎁" },
  { value: "Finanzas", emoji: "💰" },
  { value: "Otros", emoji: "📦" },
]

function getCategoryEmoji(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.emoji || "📦"
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
}

type Props = {
  expenses: Expense[]
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, amount: number, category: string, recurring: boolean) => void
}

export default function ExpenseList({ expenses, onDelete, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Comida")
  const [recurring, setRecurring] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setTitle(expense.title)
    setAmount(expense.amount.toString())
    setCategory(expense.category || "Otros")
    setRecurring(expense.recurring || false)
  }

  const saveEdit = () => {
    if (!editingId) return
    onUpdate(editingId, title, Number(amount), category, recurring)
    setEditingId(null)
    setTitle("")
    setAmount("")
    setCategory("Comida")
    setRecurring(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    onDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Lista de gastos</h2>
        <span className="text-sm text-gray-400">{expenses.length} gasto{expenses.length !== 1 ? "s" : ""}</span>
      </div>

      {expenses.length === 0 && (
        <p className="text-gray-500 italic">No hay gastos para mostrar.</p>
      )}

      {/* Modal de confirmación */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">¿Eliminar gasto?</h3>
              <p className="font-semibold text-gray-700 mb-4">
                {getCategoryEmoji(deleteTarget.category)} {deleteTarget.title} — {deleteTarget.amount.toFixed(2)} €
              </p>
              <p className="text-sm text-gray-400 mb-5">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition">Cancelar</button>
                <button onClick={confirmDelete} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition">Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista */}
      <AnimatePresence>
        {expenses.map((expense) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center justify-between gap-2 hover:shadow-lg transition"
          >
            {editingId === expense.id ? (
              <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 w-full md:w-1/6 focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-purple-500 transition bg-white">
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.emoji} {cat.value}</option>
                  ))}
                </select>
                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-xs text-gray-600">🔁</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md transition">Guardar</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded-md transition">Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                <div>
                  <span className="font-medium text-gray-700">
                    <span className="mr-1">{getCategoryEmoji(expense.category)}</span>
                    {expense.recurring && <span className="mr-1" title="Gasto recurrente">🔁</span>}
                    {expense.title} - <span className="font-bold">{expense.amount.toFixed(2)}€</span>
                    <span className="ml-2 text-sm text-gray-400">({expense.category || "Otros"})</span>
                  </span>
                  <p className="text-xs text-gray-400 mt-1">📅 {formatDate(expense.date)}</p>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={() => startEdit(expense)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition transform hover:scale-105">Editar</button>
                  <button onClick={() => setDeleteTarget(expense)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition transform hover:scale-105">Eliminar</button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}