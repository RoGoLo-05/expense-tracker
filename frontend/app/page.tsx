"use client"
import { useAuth } from "@/context/AuthContext"

export default function Home() {
  const { token } = useAuth()
  return (
    <main className="bg-[var(--color-bg)] text-[var(--color-text)] antialiased">

      {/* ---------------------- HERO ---------------------- */}
      <section className="bg-[var(--color-primary)] text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Lleva el control de tus gastos</h1>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Gestiona tu dinero de forma fácil, visual y segura.
          Controla cada gasto, analiza tus estadísticas y ahorra más cada mes.
        </p>
        <a
          href={token ? "/expenses" : "/register"}
          className="bg-white text-[var(--color-primary)] font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transition"
        >
          {token ? "Ir a mis gastos" : "Empieza Gratis"}
        </a>
      </section>

      {/* ---------------------- BENEFICIOS ---------------------- */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">¿Por qué elegir Expense Tracker?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition text-center">
            <span className="text-5xl mb-4 block">📊</span>
            <h3 className="text-xl font-bold mb-2">Control total de tus gastos</h3>
            <p className="text-gray-600">Registra todos tus movimientos y ten tus finanzas siempre organizadas.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition text-center">
            <span className="text-5xl mb-4 block">📈</span>
            <h3 className="text-xl font-bold mb-2">Estadísticas claras</h3>
            <p className="text-gray-600">Comparativas, totales y gráficos para entender mejor tus hábitos.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition text-center">
            <span className="text-5xl mb-4 block">🔒</span>
            <h3 className="text-xl font-bold mb-2">Seguridad profesional</h3>
            <p className="text-gray-600">Login seguro con token JWT, datos protegidos y acceso personal.</p>
          </div>
        </div>
      </section>

      {/* ---------------------- FUNCIONALIDADES ---------------------- */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Todo lo que necesitas</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { icon: "🏷️", label: "17 categorías" },
            { icon: "🔁", label: "Gastos recurrentes" },
            { icon: "💰", label: "Presupuesto mensual" },
            { icon: "📥", label: "Exportar CSV" },
            { icon: "📅", label: "Filtros por fecha" },
            { icon: "↕️", label: "Ordenar gastos" },
            { icon: "📱", label: "100% responsive" },
            { icon: "👤", label: "Perfil de usuario" },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg transition">
              <span className="text-3xl block mb-2">{f.icon}</span>
              <p className="font-medium text-gray-700 text-sm">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------- ESTADÍSTICAS SIMULADAS ---------------------- */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Tus números cobran vida</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <span className="text-4xl block mb-2">📝</span>
            <h3 className="text-3xl font-extrabold text-[var(--color-primary)]">293</h3>
            <p className="text-gray-600">Gastos registrados</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <span className="text-4xl block mb-2">💶</span>
            <h3 className="text-3xl font-extrabold text-[var(--color-secondary)]">187€</h3>
            <p className="text-gray-600">Promedio mensual</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3 text-center">
            <span className="text-4xl block mb-2">📉</span>
            <h3 className="text-3xl font-extrabold text-yellow-500">42%</h3>
            <p className="text-gray-600">Reducción de gastos</p>
          </div>
        </div>
      </section>

      {/* ---------------------- ¿Cómo empezar? ---------------------- */}
      <section className="bg-gray-50 py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">En 3 pasos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <span className="text-5xl block mb-3">1️⃣</span>
            <h3 className="font-bold text-lg mb-1">Regístrate</h3>
            <p className="text-gray-600">Con tu email y crea una cuenta segura.</p>
          </div>
          <div>
            <span className="text-5xl block mb-3">2️⃣</span>
            <h3 className="font-bold text-lg mb-1">Añade tus gastos</h3>
            <p className="text-gray-600">Desde la aplicación en segundos.</p>
          </div>
          <div>
            <span className="text-5xl block mb-3">3️⃣</span>
            <h3 className="font-bold text-lg mb-1">Mira tus estadísticas</h3>
            <p className="text-gray-600">Descubre cómo mejorar tus finanzas.</p>
          </div>
        </div>
      </section>

      {/* ---------------------- TESTIMONIOS ---------------------- */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Lo que dicen nuestros usuarios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <blockquote className="bg-white p-6 rounded-lg shadow-md">
            <p className="italic mb-4">&quot;Esta aplicación cambió la forma en que administro mis gastos cada mes. Fácil de usar y muy clara.&quot;</p>
            <footer className="font-semibold">— María R.</footer>
          </blockquote>

          <blockquote className="bg-white p-6 rounded-lg shadow-md">
            <p className="italic mb-4">&quot;Me encanta la visualización de estadísticas, ahora puedo ahorrar más cada mes.&quot;</p>
            <footer className="font-semibold">— Alberto F.</footer>
          </blockquote>
        </div>
      </section>

      {/* ---------------------- CTA FINAL ---------------------- */}
      <section className="text-center py-16 px-6 bg-[var(--color-primary)] text-white">
        <h2 className="text-3xl font-bold mb-7">¿Listo para tomar el control?</h2>
        <a
          href={token ? "/expenses" : "/register"}
          className="bg-white text-[var(--color-primary)] px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          {token ? "Ir a mis gastos" : "Comenzar ahora"}
        </a>
      </section>

    </main>
  )
}
