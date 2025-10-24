"use client"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function ToggleReceiptButton({ orderId, receiptStatus }: { orderId: string; receiptStatus: string }) {
  const [status, setStatus] = useState(receiptStatus)
  const [loading, setLoading] = useState(false)

  const toggleStatus = async () => {
    setLoading(true)
    try {
      const newStatus = status === "Recibido" ? "Pendiente" : "Recibido"
      const response = await fetch(`/api/orders/${orderId}/toggle-receipt`, {
        method: "PATCH",
      })

      if (response.ok) {
        setStatus(newStatus)
      }
    } catch (error) {
      console.error("[v0] Error toggling receipt status:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={toggleStatus} disabled={loading} className="cursor-pointer">
      {status === "Recibido" ? <Badge variant="default">RECIBIDO</Badge> : <Badge variant="secondary">Pendiente</Badge>}
    </button>
  )
}
