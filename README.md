# 💰 Expense Tracker — Control de Finanzas Personales

**Expense Tracker** es una aplicación web Full Stack diseñada para ayudarte a gestionar tus gastos de forma fácil, visual y segura. Registra tus movimientos, analiza tus hábitos mediante gráficos interactivos y mantén tu presupuesto bajo control.

---

## 🚀 Funcionalidades Principales

- **📊 Visualización de Datos:** Gráficos dinámicos (tarta y barras) para ver el desglose por categorías y la evolución mensual de tus gastos.
- **💰 Gestión de Presupuesto:** Define un límite de gasto mensual y visualiza tu progreso con una barra dinámica que cambia de color.
- **🔁 Gastos Recurrentes:** Identifica y suma tus suscripciones o pagos fijos para entender mejor tus compromisos financieros.
- **📥 Exportación de Datos:** Descarga todos tus movimientos en formato CSV compatible con Microsoft Excel.
- **👤 Perfil Personalizado:** Cambia tu contraseña, ajusta tu presupuesto mensual o elimina tu cuenta de forma segura.
- **🔒 Seguridad Robusta:** Sistema de autenticación con JWT (JSON Web Tokens), encriptación de contraseñas y validación de emails.
- **📱 100% Responsive:** Diseño premium y adaptable para usarlo en móviles, tablets o PC.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion
- **Gráficos:** Recharts

### Backend
- **Entorno:** Node.js
- **Framework:** Express
- **Base de Datos:** MongoDB
- **Autenticación:** JWT + Bcrypt

---

## ⚙️ Configuración e Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/RoGoLo-05/expense-tracker.git
cd expense-tracker
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```
Crea un archivo `.env` dentro de la carpeta `backend` con:
```env
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES=24h
PORT=3001
```
Inicia el servidor:
```bash
node server.js
```

### 3. Configurar el Frontend
```bash
cd ../frontend
npm install
```
Crea un archivo `.env.local` dentro de la carpeta `frontend` con:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```
Inicia la aplicación:
```bash
npm run dev
```

---

## 📂 Estructura del Proyecto

```bash
expense-tracker/
├── backend/            # Servidor Node.js + Express
│   ├── server.js       # Lógica principal y rutas
│   └── .env            # Variables de entorno (no subir a GitHub)
├── frontend/           # Aplicación Next.js
│   ├── app/            # Páginas y rutas
│   ├── components/     # Componentes de UI reutilizables
│   ├── context/        # Gestión del estado de autenticación
│   ├── services/       # Conexiones con la API del backend
│   └── types/          # Definición de tipos TypeScript
└── README.md           # Documentación del proyecto
```

---

## 📝 Licencia
Este proyecto es de uso libre con fines educativos.
