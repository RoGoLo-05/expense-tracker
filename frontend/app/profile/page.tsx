"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { getProfile, changePassword, setBudget, deleteAccount } from "@/services/expenseService"
import { motion, AnimatePresence } from "framer-motion"

export default function ProfilePage() {
    const router = useRouter()
    const { token, logout } = useAuth()

    const [email, setEmail] = useState("")
    const [createdAt, setCreatedAt] = useState("")
    const [budget, setBudgetValue] = useState(0)
    const [budgetInput, setBudgetInput] = useState("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // Reglas de validación para nueva contraseña
    const passwordRules = [
        { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
        { label: "Una mayúscula", test: (p: string) => /[A-Z]/.test(p) },
        { label: "Una minúscula", test: (p: string) => /[a-z]/.test(p) },
        { label: "Un número", test: (p: string) => /[0-9]/.test(p) },
        { label: "Un carácter especial", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
    ]
    const allRulesPass = newPassword.length === 0 || passwordRules.every(r => r.test(newPassword))

    useEffect(() => {
        if (!token) {
            router.push("/login")
            return
        }
        async function load() {
            try {
                const data = await getProfile()
                setEmail(data.email)
                setBudgetValue(data.budget || 0)
                setBudgetInput((data.budget || 0).toString())
                setCreatedAt(data.createdAt)
            } catch {
                setError("Error cargando perfil")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const showMsg = (msg: string) => {
        setMessage(msg)
        setTimeout(() => setMessage(""), 3000)
    }

    const showErr = (msg: string) => {
        setError(msg)
        setTimeout(() => setError(""), 4000)
    }

    const handleChangePw = async () => {
        if (!currentPassword || !newPassword) return showErr("Rellena ambos campos")
        if (!allRulesPass) return showErr("La nueva contraseña no cumple los requisitos")

        try {
            await changePassword(currentPassword, newPassword)
            setCurrentPassword("")
            setNewPassword("")
            showMsg("✅ Contraseña cambiada correctamente")
        } catch (err: unknown) {
            showErr(err instanceof Error ? err.message : "Error cambiando contraseña")
        }
    }

    const handleSaveBudget = async () => {
        const val = Number(budgetInput)
        if (isNaN(val) || val < 0) return showErr("Presupuesto inválido")

        try {
            await setBudget(val)
            setBudgetValue(val)
            showMsg("✅ Presupuesto actualizado")
        } catch {
            showErr("Error guardando presupuesto")
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount()
            logout()
            router.push("/login")
        } catch {
            showErr("Error eliminando cuenta")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold text-blue-700">Mi Perfil</h1>

            {/* Toasts */}
            <AnimatePresence>
                {message && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">{message}</motion.div>
                )}
                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">{error}</motion.div>
                )}
            </AnimatePresence>

            {/* Info de cuenta */}
            <div className="bg-white p-6 rounded-lg shadow space-y-2">
                <h2 className="text-xl font-semibold text-gray-700">Información</h2>
                <p><span className="font-medium text-gray-600">Email:</span> {email}</p>
                <p><span className="font-medium text-gray-600">Cuenta creada:</span> {new Date(createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>

            {/* Presupuesto mensual */}
            <div className="bg-white p-6 rounded-lg shadow space-y-3">
                <h2 className="text-xl font-semibold text-gray-700">💰 Presupuesto mensual</h2>
                <p className="text-sm text-gray-500">Define un límite de gasto mensual. Se mostrará una barra de progreso en la página de gastos.</p>
                <div className="flex gap-3 items-center">
                    <input
                        type="number"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        placeholder="Ej: 500"
                        className="border border-gray-300 rounded-md px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                    />
                    <span className="text-gray-500">€ / mes</span>
                    <button
                        onClick={handleSaveBudget}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                    >
                        Guardar
                    </button>
                </div>
                {budget > 0 && <p className="text-sm text-green-600">Presupuesto actual: {budget} €</p>}
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-white p-6 rounded-lg shadow space-y-3">
                <h2 className="text-xl font-semibold text-gray-700">🔒 Cambiar contraseña</h2>
                <input
                    type="password"
                    placeholder="Contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {newPassword.length > 0 && (
                    <div className="text-sm space-y-1">
                        {passwordRules.map((rule, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span>{rule.test(newPassword) ? "✅" : "❌"}</span>
                                <span className={rule.test(newPassword) ? "text-green-600" : "text-gray-400"}>{rule.label}</span>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    onClick={handleChangePw}
                    disabled={!allRulesPass || !currentPassword}
                    className={`px-4 py-2 rounded-md transition ${allRulesPass && currentPassword ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                    Cambiar contraseña
                </button>
            </div>

            {/* Eliminar cuenta */}
            <div className="bg-white p-6 rounded-lg shadow border border-red-200 space-y-3">
                <h2 className="text-xl font-semibold text-red-600">⚠️ Zona peligrosa</h2>
                <p className="text-sm text-gray-500">Eliminar tu cuenta borrará todos tus gastos permanentemente.</p>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                >
                    Eliminar mi cuenta
                </button>
            </div>

            {/* Modal de confirmación */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold text-red-600 mb-2">¿Estás seguro?</h3>
                            <p className="text-gray-500 mb-4">Se eliminarán tu cuenta y TODOS tus gastos. No se puede deshacer.</p>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                                    Cancelar
                                </button>
                                <button onClick={handleDeleteAccount} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition">
                                    Eliminar cuenta
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
