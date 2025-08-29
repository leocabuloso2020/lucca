import Link from "next/link"
import { Frown } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="text-center">
        <Frown className="mx-auto h-12 w-12 text-red-600" />
        <h1 className="mt-4 text-3xl font-bold text-red-800">Página Não Encontrada</h1>
        <p className="mt-2 text-lg text-gray-700">Não conseguimos encontrar a página de administração.</p>
        <Link href="/" className="mt-6 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}