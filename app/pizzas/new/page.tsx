import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function NewPizzaPage() {
  async function createPizza(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const price = Number.parseFloat(formData.get("price") as string)

    const supabase = await createClient()

    const { error } = await supabase.from("pizza_types").insert({
      name,
      price,
    })

    if (error) {
      console.error("[v0] Error creating pizza:", error)
      return
    }

    redirect("/pizzas")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Agregar Nueva Pizza</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPizza} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Ej: Mozzarella" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" name="price" type="number" step="0.01" placeholder="Ej: 8000" required />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Guardar
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/pizzas">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
