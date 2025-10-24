import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get current status
    const { data: order } = await supabase.from("orders").select("receipt_status").eq("id", id).single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Toggle status
    const newStatus = order.receipt_status === "Recibido" ? "Pendiente" : "Recibido"

    const { error } = await supabase.from("orders").update({ receipt_status: newStatus }).eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error toggling receipt status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
