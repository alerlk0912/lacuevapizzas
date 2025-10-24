import { ChangePasswordForm } from "@/components/change-password-form"
import Image from "next/image"

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <Image src="/logo.jpeg" alt="La Cueva Pizzas" width={150} height={150} className="rounded-lg" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Cambiar Contraseña</h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            Por seguridad, debes cambiar tu contraseña antes de continuar
          </p>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}
