import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ToggleDeliveredButton } from "@/components/toggle-delivered-button"
import { ToggleReceiptButton } from "@/components/toggle-receipt-button"
import { DeleteOrderButton } from "@/components/delete-order-button"
import { Pencil } from "lucide-react"

export default async function PedidosPage() {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        pizza_types (name, price)
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching orders:", error)
  }

  // Calculate total for each order
  const ordersWithTotals = orders?.map((order) => {
    const total = order.order_items?.reduce((sum: number, item: any) => {
      return sum + (item.pizza_types?.price || 0) * item.quantity
    }, 0)
    return { ...order, total }
  })

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
                  <TableHead>Pizzas</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead>Retiro</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersWithTotals?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.customer_name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="text-sm">
                            {item.quantity}x {item.pizza_types?.name}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{order.delivery_time}</TableCell>
                    <TableCell>{order.payment_method}</TableCell>
                    <TableCell>
                      <ToggleReceiptButton orderId={order.id} receiptStatus={order.receipt_status} />
                    </TableCell>
                    <TableCell>{order.pickup_method}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{order.delivery_address || "-"}</TableCell>
                    <TableCell>
                      <ToggleDeliveredButton orderId={order.id} delivered={order.delivered} />
                    </TableCell>
                    <TableCell className="text-right font-medium">${order.total?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" asChild>
                          <Link href={`/pedidos/${order.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteOrderButton orderId={order.id} />
                      </div>
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
