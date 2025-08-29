import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600" />
        <p className="mt-4 text-lg text-gray-700">Carregando painel administrativo...</p>
      </div>
    </div>
  )
}