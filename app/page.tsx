import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default async function HomePage() {
  const supabase = await createClient()

  // Get today's date
  const today = new Date().toISOString().split("T")[0]

  // Fetch today's orders with pizza details
  const { data: todayOrders, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      pizza_types (name, price)
    `,
    )
    .eq("order_date", today)

  if (error) {
    console.error("[v0] Error fetching today's orders:", error)
  }

  // Calculate totals
  const totalPizzas = todayOrders?.reduce((sum, order) => sum + order.quantity, 0) || 0
  const totalEarnings =
    todayOrders?.reduce((sum, order) => sum + (order.pizza_types?.price || 0) * order.quantity, 0) || 0

  // Group by pizza type for summary
  const pizzaSummary = todayOrders?.reduce(
    (acc, order) => {
      const pizzaName = order.pizza_types?.name || "Desconocido"
      const price = order.pizza_types?.price || 0

      if (!acc[pizzaName]) {
        acc[pizzaName] = {
          quantity: 0,
          price: price,
          earnings: 0,
        }
      }

      acc[pizzaName].quantity += order.quantity
      acc[pizzaName].earnings += price * order.quantity

      return acc
    },
    {} as Record<string, { quantity: number; price: number; earnings: number }>,
  )

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard - {new Date().toLocaleDateString("es-AR")}</h1>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/pizzas">Gestionar Pizzas</Link>
              </Button>
              <Button asChild>
                <Link href="/pedidos/new">Nuevo Pedido</Link>
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Pizzas Vendidas Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{totalPizzas}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Ganancias Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">${totalEarnings.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Pizza Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Tipo de Pizza</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unitario</TableHead>
                    <TableHead className="text-right">Ganancia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pizzaSummary &&
                    Object.entries(pizzaSummary).map(([name, data]) => (
                      <TableRow key={name}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell className="text-right">{data.quantity}</TableCell>
                        <TableCell className="text-right">${data.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">${data.earnings.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  {(!pizzaSummary || Object.keys(pizzaSummary).length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No hay pedidos para hoy
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Acceso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/pedidos">Ver Todos los Pedidos</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pizzas">Ver Tipos de Pizzas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
