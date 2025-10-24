import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { DeletePizzaButton } from "@/components/delete-pizza-button"

export default async function PizzasPage() {
  const supabase = await createClient()

  const { data: pizzas, error } = await supabase.from("pizza_types").select("*").order("name")

  if (error) {
    console.error("[v0] Error fetching pizzas:", error)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Tipos de Pizzas</CardTitle>
          <Button asChild>
            <Link href="/pizzas/new">Agregar Pizza</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pizzas?.map((pizza) => (
                <TableRow key={pizza.id}>
                  <TableCell className="font-medium">{pizza.name}</TableCell>
                  <TableCell className="text-right">${pizza.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/pizzas/${pizza.id}/edit`}>Editar</Link>
                      </Button>
                      <DeletePizzaButton id={pizza.id} name={pizza.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
