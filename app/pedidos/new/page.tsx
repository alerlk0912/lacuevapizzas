"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

export default function NewPedidoPage() {
  const router = useRouter()
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([])
  const [pizzaItems, setPizzaItems] = useState<PizzaItem[]>([{ pizza_type_id: "", quantity: 1 }])
  const [pickupMethod, setPickupMethod] = useState("Retiro en casa")
  const [paymentMethod, setPaymentMethod] = useState("Efectivo")
  const [receiptStatus, setReceiptStatus] = useState("Pendiente")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/pizzas")
      .then((res) => res.json())
      .then((data) => {
        console.log("[v0] Pizza types loaded:", data)
        setPizzaTypes(data)
      })
      .catch((error) => console.error("[v0] Error loading pizza types:", error))
  }, [])

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
      payment_method: paymentMethod,
      receipt_status: receiptStatus,
      pickup_method: pickupMethod,
      delivery_address: pickupMethod === "Envio" ? formData.get("delivery_address") : null,
      pizza_items: pizzaItems.filter((item) => item.pizza_type_id),
    }

    console.log("[v0] Submitting order:", orderData)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        console.log("[v0] Order created successfully")
        router.push("/pedidos")
        router.refresh()
      } else {
        const error = await response.json()
        console.error("[v0] Error response:", error)
        alert("Error al crear el pedido: " + (error.error || "Error desconocido"))
      }
    } catch (error) {
      console.error("[v0] Error creating order:", error)
      alert("Error al crear el pedido. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nuevo Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Nombre del Cliente</Label>
              <Input id="customer_name" name="customer_name" placeholder="Ej: Juan Pérez" required />
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
                <Input id="delivery_time" name="delivery_time" type="time" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Forma de Pago</Label>
                <Select name="payment_method" value={paymentMethod} onValueChange={setPaymentMethod} required>
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
                <Label htmlFor="receipt_status">Comprobante</Label>
                <Select name="receipt_status" value={receiptStatus} onValueChange={setReceiptStatus} required>
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
                <Input id="delivery_address" name="delivery_address" placeholder="Ej: Calle 123, Ciudad" required />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Creando..." : "Crear Pedido"}
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
