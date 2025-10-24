import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase.from("orders").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          quantity,
          pizza_type_id,
          pizza_types (name, price)
        )
      `,
      )
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("[v0] Error fetching order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    // Update the order
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        customer_name,
        delivery_time,
        payment_method,
        receipt_status,
        pickup_method,
        delivery_address,
      })
      .eq("id", id)

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Delete existing order items
    await supabase.from("order_items").delete().eq("order_id", id)

    // Create new order items
    const orderItems = pizza_items.map((item: any) => ({
      order_id: id,
      pizza_type_id: item.pizza_type_id,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
