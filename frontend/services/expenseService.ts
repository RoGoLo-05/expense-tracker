const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
//Este archivo centraliza las llamadas al backend.

function getToken() {
  return localStorage.getItem("token")
}

function handleUnauthorized(res: Response) {
  if (res.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/login" //Redirige si el token es inválido/expirado
  }
}


// ═══════════════════════════════════════════════
// GASTOS
// ═══════════════════════════════════════════════

export async function getExpenses() {
  const res = await fetch(`${API_URL}/expenses`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })

  handleUnauthorized(res)

  if (!res.ok) {
    throw new Error("Error obteniendo gastos")
  }

  return res.json()
}

export async function createExpense(title: string, amount: number, category: string, recurring: boolean = false) {
  const res = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ title, amount, category, recurring }),
  })

  handleUnauthorized(res)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Error creando gasto")
  }

  return res.json()
}

export async function deleteExpense(id: string) {
  const res = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })

  handleUnauthorized(res)

  if (!res.ok) {
    throw new Error("Error eliminando gasto")
  }
}

export async function updateExpense(id: string, title: string, amount: number, category: string, recurring: boolean = false) {
  const res = await fetch(`${API_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ title, amount, category, recurring }),
  })

  handleUnauthorized(res)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Error actualizando gasto")
  }

  return res.json()
}


// ═══════════════════════════════════════════════
// PERFIL
// ═══════════════════════════════════════════════

export async function getProfile() {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })

  handleUnauthorized(res)

  if (!res.ok) throw new Error("Error obteniendo perfil")
  return res.json()
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  })

  handleUnauthorized(res)

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Error cambiando contraseña")
  }

  return res.json()
}

export async function setBudget(budget: number) {
  const res = await fetch(`${API_URL}/auth/budget`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ budget }),
  })

  handleUnauthorized(res)

  if (!res.ok) throw new Error("Error actualizando presupuesto")
  return res.json()
}

export async function deleteAccount() {
  const res = await fetch(`${API_URL}/auth/delete-account`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })

  handleUnauthorized(res)

  if (!res.ok) throw new Error("Error eliminando cuenta")
  return res.json()
}
