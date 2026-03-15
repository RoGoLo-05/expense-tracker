require("dotenv").config()

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3001; //Así si en producción el servidor usa otro puerto, funcionará sin tocar código.

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let expensesCollection;
let usersCollection;


async function startServer() { //Función asíncrona que se ejecuta al iniciar el servidor
  try {
    await client.connect();
    console.log("Conectado a MongoDB");

    const db = client.db("expense-tracker");
    expensesCollection = db.collection("expenses");
    usersCollection = db.collection("users");

    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
  }
}

startServer();


// Obtener todos los gastos
app.get("/expenses", authMiddleware, async (req, res) => {
  const expenses = await expensesCollection.find({ userId: req.user.userId }).toArray();
  res.json(expenses);
});

// Crear un gasto
app.post("/expenses", authMiddleware, async (req, res) => {
  const { title, amount, category, recurring } = req.body;

  // Validar datos del gasto
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "El concepto es obligatorio" });
  }
  if (amount === undefined || amount <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor que 0" });
  }

  const newExpense = {
    id: Date.now().toString(),
    title,
    amount,
    category: category || "Otros",
    recurring: recurring || false, //Gasto recurrente (ej: Netflix, alquiler)
    date: new Date().toISOString(),
    userId: req.user.userId
  };

  await expensesCollection.insertOne(newExpense);

  res.json(newExpense);
});

// Eliminar un gasto
app.delete("/expenses/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  await expensesCollection.deleteOne({ id: id, userId: req.user.userId })

  res.json({ message: "Expense deleted" });
});

// Actualizar un gasto
app.put("/expenses/:id", authMiddleware, async (req, res) => {
  const id = req.params.id.toString().trim()
  const { title, amount, category, recurring } = req.body

  try {
    const result = await expensesCollection.findOneAndUpdate(
      { id: id, userId: req.user.userId },
      { $set: { title, amount, category, recurring: recurring || false } },
      { returnDocument: "after" }
    )

    if (!result) {
      return res.status(404).json({ error: "Gasto no encontrado" })
    }

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error actualizando gasto" })
  }
})


// ═══════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════

// Registro de usuario
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña requeridos" });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Formato de email inválido" });
  }

  // Validación de requisitos de contraseña
  if (password.length < 8) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: "La contraseña debe tener al menos una mayúscula" });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ error: "La contraseña debe tener al menos una minúscula" });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: "La contraseña debe tener al menos un número" });
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return res.status(400).json({ error: "La contraseña debe tener al menos un carácter especial" });
  }

  try {
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      budget: 0, //Presupuesto mensual (0 = sin límite)
      createdAt: new Date().toISOString()
    };

    await usersCollection.insertOne(newUser);

    res.json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registrando usuario" });
  }
});


app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      message: "Login correcto",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en login" });
  }
});


// ═══════════════════════════════════════════════
// PERFIL
// ═══════════════════════════════════════════════

// Obtener perfil del usuario
app.get("/auth/profile", authMiddleware, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) })

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    res.json({
      email: user.email,
      budget: user.budget || 0,
      createdAt: user.createdAt
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error obteniendo perfil" })
  }
})

// Cambiar contraseña
app.put("/auth/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Contraseña actual y nueva requeridas" })
  }

  // Validar nueva contraseña
  if (newPassword.length < 8) return res.status(400).json({ error: "La nueva contraseña debe tener al menos 8 caracteres" })
  if (!/[A-Z]/.test(newPassword)) return res.status(400).json({ error: "La nueva contraseña necesita una mayúscula" })
  if (!/[a-z]/.test(newPassword)) return res.status(400).json({ error: "La nueva contraseña necesita una minúscula" })
  if (!/[0-9]/.test(newPassword)) return res.status(400).json({ error: "La nueva contraseña necesita un número" })
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) return res.status(400).json({ error: "La nueva contraseña necesita un carácter especial" })

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) })

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $set: { password: hashedPassword } }
    )

    res.json({ message: "Contraseña actualizada correctamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error cambiando contraseña" })
  }
})

// Actualizar presupuesto mensual
app.put("/auth/budget", authMiddleware, async (req, res) => {
  const { budget } = req.body

  if (budget === undefined || budget < 0) {
    return res.status(400).json({ error: "Presupuesto inválido" })
  }

  try {
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $set: { budget: Number(budget) } }
    )

    res.json({ message: "Presupuesto actualizado", budget: Number(budget) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error actualizando presupuesto" })
  }
})

// Eliminar cuenta
app.delete("/auth/delete-account", authMiddleware, async (req, res) => {
  try {
    // Eliminar todos los gastos del usuario
    await expensesCollection.deleteMany({ userId: req.user.userId })
    // Eliminar al usuario
    await usersCollection.deleteOne({ _id: new ObjectId(req.user.userId) })

    res.json({ message: "Cuenta eliminada correctamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error eliminando cuenta" })
  }
})


// ═══════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" })
  }
}
