"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { token, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false) //Estado del menú hamburguesa

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    router.push("/login")
  }

  const closeMenu = () => setMenuOpen(false)

  // Links según si está autenticado o no
  const links = token
    ? [
      { href: "/", label: "Inicio" },
      { href: "/expenses", label: "Gastos" },
      { href: "/profile", label: "Perfil" },
    ]
    : [
      { href: "/", label: "Inicio" },
      { href: "/login", label: "Iniciar Sesión" },
      { href: "/register", label: "Registrarse" },
    ]

  return (
    <nav className="bg-blue-800 text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold hover:text-gray-200 transition" onClick={closeMenu}>
          Expense Tracker
        </Link>

        {/* Links para desktop (ocultos en móvil) */}
        <div className="hidden md:flex space-x-4 items-center">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md transition ${pathname === link.href ? "bg-blue-600" : "hover:bg-blue-600"}`}
            >
              {link.label}
            </Link>
          ))}

          {token && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition"
            >
              Cerrar Sesión
            </button>
          )}
        </div>

        {/* Botón hamburguesa (visible solo en móvil) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Abrir menú"
        >
          {/* Icono hamburguesa / X */}
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900 px-4 pb-4 space-y-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md transition ${pathname === link.href ? "bg-blue-600" : "hover:bg-blue-700"}`}
            >
              {link.label}
            </Link>
          ))}

          {token && (
            <button
              onClick={handleLogout}
              className="block w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
