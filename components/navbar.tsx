"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.jpeg" alt="La Cueva Pizzas" width={50} height={50} className="rounded-lg" />
              <span className="text-xl font-bold">La Cueva Pizzas</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-sm hover:underline">
                Dashboard
              </Link>
              <Link href="/pedidos" className="text-sm hover:underline">
                Pedidos
              </Link>
              <Link href="/pizzas" className="text-sm hover:underline">
                Pizzas
              </Link>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </nav>
  )
}
