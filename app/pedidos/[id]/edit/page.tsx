"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

type PizzaType = {
  id: string
  name: string
  price: number
}

type PizzaItem = {
  pizza_type_id: string
  quantity: number
}

type Order = {
  id: string
  customer_name: string
  delivery_time: string
  payment_method: string
  receipt_status: string
  pickup_method: string
  delivery_address: string | null
  order_items: Array<{
    id: string
    quantity: number
    pizza_type_id: string
    pizza_types: { name: string; price: number }
  }>
}

export default function EditPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([])
  const [order, setOrder] = useState<Order | null>(null)
  const [pizzaItems, setPizzaItems] = useState<PizzaItem[]>([{ pizza_type_id: "", quantity: 1 }])
  const [pickupMethod, setPickupMethod] = useState("Retiro en casa")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load pizza types
    fetch("/api/pizzas")
      .then((res) => res.json())
      .then((data) => setPizzaTypes(data))

    // Load order data
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data)
        setPickupMethod(data.pickup_method)
        setPizzaItems(
          data.order_items.map((item: any) => ({
            pizza_type_id: item.pizza_type_id,
            quantity: item.quantity,
          })),
        )
      })
  }, [id])

  const addPizzaItem = () => {
    setPizzaItems([...pizzaItems, { pizza_type_id: "", quantity: 1 }])
  }

  const removePizzaItem = (index: number) => {
    if (pizzaItems.length > 1) {
      setPizzaItems(pizzaItems.filter((_, i) => i !== index))
    }
  }

  const updatePizzaItem = (index: number, field: keyof PizzaItem, value: string | number) => {
    const updated = [...pizzaItems]
    updated[index] = { ...updated[index], [field]: value }
    setPizzaItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const orderData = {
      customer_name: formData.get("customer_name"),
      delivery_time: formData.get("delivery_time"),
      payment_method: formData.get("payment_method"),
      receipt_status: formData.get("receipt_status"),
      pickup_method: formData.get("pickup_method"),
      delivery_address: pickupMethod === "Envio" ? formData.get("delivery_address") : null,
      pizza_items: pizzaItems.filter((item) => item.pizza_type_id),
    }

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        router.push("/pedidos")
      }
    } catch (error) {
      console.error("[v0] Error updating order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!order) {
    return <div className="container mx-auto py-8 px-4">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Editar Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Nombre del Cliente</Label>
              <Input
                id="customer_name"
                name="customer_name"
                defaultValue={order.customer_name}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Pizzas</Label>
                <Button type="button" size="sm" variant="outline" onClick={addPizzaItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar Pizza
                </Button>
              </div>

              {pizzaItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`pizza_${index}`}>Tipo de Pizza</Label>
                    <Select
                      value={item.pizza_type_id}
                      onValueChange={(value) => updatePizzaItem(index, "pizza_type_id", value)}
                      required
                    >
                      <SelectTrigger id={`pizza_${index}`}>
                        <SelectValue placeholder="Seleccionar pizza" />
                      </SelectTrigger>
                      <SelectContent>
                        {pizzaTypes.map((pizza) => (
                          <SelectItem key={pizza.id} value={pizza.id}>
                            {pizza.name} - ${pizza.price.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-24 space-y-2">
                    <Label htmlFor={`quantity_${index}`}>Cantidad</Label>
                    <Input
                      id={`quantity_${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updatePizzaItem(index, "quantity", Number.parseInt(e.target.value))}
                      required
                    />
                  </div>

                  {pizzaItems.length > 1 && (
                    <Button type="button" size="icon" variant="ghost" onClick={() => removePizzaItem(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery_time">Hora de Entrega</Label>
                <Input
                  id="delivery_time"
                  name="delivery_time"
                  type="time"
                  defaultValue={order.delivery_time}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Forma de Pago</Label>
                <Select name="payment_method" defaultValue={order.payment_method} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt_status">Comprobante</Label>
                <Select name="receipt_status" defaultValue={order.receipt_status} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Recibido">Recibido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup_method">Retiro</Label>
                <Select name="pickup_method" value={pickupMethod} onValueChange={setPickupMethod} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retiro en casa">Retiro en casa</SelectItem>
                    <SelectItem value="Envio">Envío</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {pickupMethod === "Envio" && (
              <div className="space-y-2">
                <Label htmlFor="delivery_address">Dirección de Envío</Label>
                <Input
                  id="delivery_address"
                  name="delivery_address"
                  defaultValue={order.delivery_address || ""}
                  placeholder="Ej: Calle 123, Ciudad"
                  required
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
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
