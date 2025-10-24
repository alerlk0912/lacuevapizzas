import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function NewPedidoPage() {
  const supabase = await createClient()

  const { data: pizzaTypes } = await supabase.from("pizza_types").select("*").order("name")

  async function createOrder(formData: FormData) {
    "use server"

    const customerName = formData.get("customer_name") as string
    const pizzaTypeId = formData.get("pizza_type_id") as string
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const deliveryTime = formData.get("delivery_time") as string
    const paymentMethod = formData.get("payment_method") as string
    const receiptReceived = formData.get("receipt_received") === "on"
    const pickupMethod = formData.get("pickup_method") as string
    const deliveryAddress = formData.get("delivery_address") as string

    const supabase = await createClient()

    const { error } = await supabase.from("orders").insert({
      customer_name: customerName,
      pizza_type_id: pizzaTypeId,
      quantity,
      delivery_time: deliveryTime,
      payment_method: paymentMethod,
      receipt_received: receiptReceived,
      pickup_method: pickupMethod,
      delivery_address: pickupMethod === "Envio" ? deliveryAddress : null,
      delivered: false,
    })

    if (error) {
      console.error("[v0] Error creating order:", error)
      return
    }

    redirect("/pedidos")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nuevo Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Nombre del Cliente</Label>
                <Input id="customer_name" name="customer_name" placeholder="Ej: Juan Pérez" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pizza_type_id">Tipo de Pizza</Label>
                <Select name="pizza_type_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar pizza" />
                  </SelectTrigger>
                  <SelectContent>
                    {pizzaTypes?.map((pizza) => (
                      <SelectItem key={pizza.id} value={pizza.id}>
                        {pizza.name} - ${pizza.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input id="quantity" name="quantity" type="number" min="1" defaultValue="1" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_time">Hora de Entrega</Label>
                <Input id="delivery_time" name="delivery_time" type="time" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Forma de Pago</Label>
                <Select name="payment_method" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup_method">Retiro</Label>
                <Select name="pickup_method" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retiro en casa">Retiro en casa</SelectItem>
                    <SelectItem value="Envio">Envío</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="receipt_received" name="receipt_received" />
              <Label htmlFor="receipt_received" className="cursor-pointer">
                Comprobante recibido
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_address">Dirección (solo si es envío)</Label>
              <Input id="delivery_address" name="delivery_address" placeholder="Ej: Calle 123, Ciudad" />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Crear Pedido
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/pedidos">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
