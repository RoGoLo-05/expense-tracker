export type Expense = {
  id: string
  title: string
  amount: number
  category: string
  date: string
  recurring?: boolean //Gasto recurrente mensual (ej: Netflix, alquiler)
}