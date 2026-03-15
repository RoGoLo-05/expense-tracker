"use client" //por defecto los componentes son Server Components, useState solo funciona en Client Components. Este componente se ejecuta en el navegador.

import { useState } from "react"
import { motion } from "framer-motion"

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

type Props = {
  onAddExpense: (title: string, amount: number, category: string, recurring: boolean) => void
}

export default function AddExpenseForm({ onAddExpense }: Props) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Comida")
  const [recurring, setRecurring] = useState(false) //Gasto recurrente
  const [added, setAdded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onAddExpense(title, Number(amount), category, recurring)

    setTitle("")
    setAmount("")
    setCategory("Comida")
    setRecurring(false)

    setAdded(true)
    setTimeout(() => setAdded(false), 500)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">Añadir gasto</h2>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Concepto"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/4 transition"
          required
        />

        <input
          type="number"
          placeholder="Cantidad"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-1/6 transition"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-1/5 transition bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.emoji} {cat.value}
            </option>
          ))}
        </select>

        {/* Toggle recurrente */}
        <label className="flex items-center gap-2 cursor-pointer select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm text-gray-600">🔁 Recurrente</span>
        </label>

        <motion.button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition transform hover:scale-105"
          animate={added ? { scale: [1, 1.2, 1], backgroundColor: ["#2563EB", "#34D399", "#2563EB"] } : {}}
          transition={{ duration: 0.5 }}
        >
          Añadir
        </motion.button>
      </div>
    </form>
  )
}