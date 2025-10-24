import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ToggleDeliveredButton } from "@/components/toggle-delivered-button"

export default async function PedidosPage() {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      pizza_types (name, price)
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching orders:", error)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Pedidos</CardTitle>
          <Button asChild>
            <Link href="/pedidos/new">Nuevo Pedido</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pizza</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead>Retiro</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.customer_name}</TableCell>
                    <TableCell>{order.pizza_types?.name}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.delivery_time}</TableCell>
                    <TableCell>{order.payment_method}</TableCell>
                    <TableCell>
                      {order.receipt_received ? (
                        <Badge variant="default">RECIBIDO</Badge>
                      ) : (
                        <Badge variant="secondary">Pendiente</Badge>
                      )}
                    </TableCell>
                    <TableCell>{order.pickup_method}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{order.delivery_address || "-"}</TableCell>
                    <TableCell>
                      <ToggleDeliveredButton orderId={order.id} delivered={order.delivered} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${((order.pizza_types?.price || 0) * order.quantity).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
