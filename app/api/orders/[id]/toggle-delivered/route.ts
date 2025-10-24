import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get current delivered status
  const { data: order, error: fetchError } = await supabase.from("orders").select("delivered").eq("id", id).single()

  if (fetchError || !order) {
    console.error("[v0] Error fetching order:", fetchError)
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  // Toggle the delivered status
  const { error } = await supabase.from("orders").update({ delivered: !order.delivered }).eq("id", id)

  if (error) {
    console.error("[v0] Error updating order:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
