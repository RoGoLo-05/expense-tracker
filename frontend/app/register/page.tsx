"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function RegisterPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Reglas de validación de contraseña
  const passwordRules = [
    { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
    { label: "Una letra mayúscula", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Una letra minúscula", test: (p: string) => /[a-z]/.test(p) },
    { label: "Un número", test: (p: string) => /[0-9]/.test(p) },
    { label: "Un carácter especial (!@#$%...)", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
  ]

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmailValid = emailRegex.test(email)

  const allRulesPass = passwordRules.every((rule) => rule.test(password)) && isEmailValid

  const handleRegister = async () => {
    setError("") // limpiar errores

    if (!allRulesPass) {
      setError("La contraseña no cumple todos los requisitos")
      return
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()

    if (res.ok) {
      router.push("/login")
    } else {
      setError(data.error || "Ocurrió un error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-6 text-[var(--color-primary)]">Registro</h1>

        {error && (
          <div className="bg-[var(--color-danger)] text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          />

          {/* Indicador de email válido */}
          {email.length > 0 && (
            <div className="text-sm flex items-center gap-2 -mt-2">
              <span>{isEmailValid ? "✅" : "❌"}</span>
              <span className={isEmailValid ? "text-green-600" : "text-gray-400"}>
                Formato de email válido
              </span>
            </div>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Indicadores de requisitos de contraseña */}
          {password.length > 0 && (
            <div className="text-sm space-y-1">
              {passwordRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>{rule.test(password) ? "✅" : "❌"}</span>
                  <span className={rule.test(password) ? "text-green-600" : "text-gray-400"}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={!allRulesPass || !email}
            className={`font-semibold py-2 rounded-lg transition ${allRulesPass && email
              ? "bg-[var(--color-primary)] text-white hover:bg-blue-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Registrarse
          </button>
        </div>

        <p className="text-sm text-center mt-4 text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-[var(--color-primary)] hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  )
}
