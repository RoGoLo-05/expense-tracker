import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import './globals.css'
import { AuthProvider } from "@/context/AuthContext"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Expense Tracker — Controla tus gastos",
  description: "Gestiona tu dinero de forma fácil, visual y segura. Registra gastos, analiza estadísticas y ahorra más cada mes.",
  keywords: ["gastos", "finanzas", "presupuesto", "ahorro", "expense tracker"],
  authors: [{ name: "Expense Tracker" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}