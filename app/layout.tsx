import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gestión de Pizzería",
  description: "Sistema simple para gestionar pedidos de pizzas",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <nav className="border-b bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold">
                La Cueva Pizzas
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
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
