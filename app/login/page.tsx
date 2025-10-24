import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <Image src="/logo.jpeg" alt="La Cueva Pizzas" width={200} height={200} className="rounded-lg" priority />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
