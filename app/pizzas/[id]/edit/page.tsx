import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

export default async function EditPizzaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: pizza, error } = await supabase.from("pizza_types").select("*").eq("id", id).single()

  if (error || !pizza) {
    notFound()
  }

  async function updatePizza(formData: FormData) {
    "use server"

    const name = formData.get("name") as string
    const price = Number.parseFloat(formData.get("price") as string)

    const supabase = await createClient()

    const { error } = await supabase
      .from("pizza_types")
      .update({
        name,
        price,
      })
      .eq("id", id)

    if (error) {
      console.error("[v0] Error updating pizza:", error)
      return
    }

    redirect("/pizzas")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Editar Pizza</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updatePizza} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" defaultValue={pizza.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={pizza.price} required />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Actualizar
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
