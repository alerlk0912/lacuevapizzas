"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeletePizzaButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/pizzas/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar")
      }

      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting pizza:", error)
      alert("Error al eliminar la pizza")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Eliminando..." : "Eliminar"}
    </Button>
  )
}
