import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customer_name,
      delivery_time,
      payment_method,
      receipt_status,
      pickup_method,
      delivery_address,
      pizza_items,
    } = body

    const supabase = await createClient()

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        delivery_time,
        payment_method,
        receipt_status,
        pickup_method,
        delivery_address,
        delivered: false,
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Error creating order:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    const orderItems = pizza_items.map((item: any) => ({
      order_id: order.id,
      pizza_type_id: item.pizza_type_id,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[v0] Error creating order items:", itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("[v0] Error in POST /api/orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
