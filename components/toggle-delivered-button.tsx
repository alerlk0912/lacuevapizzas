"use client"

import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function ToggleDeliveredButton({ orderId, delivered }: { orderId: string; delivered: boolean }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleToggle() {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/toggle-delivered`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Error al actualizar")
      }

      router.refresh()
    } catch (error) {
      console.error("[v0] Error toggling delivered:", error)
      alert("Error al actualizar el estado")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Badge
      variant={delivered ? "default" : "secondary"}
      className="cursor-pointer"
      onClick={handleToggle}
      aria-disabled={isUpdating}
    >
      {isUpdating ? "..." : delivered ? "SI" : "NO"}
    </Badge>
  )
}
