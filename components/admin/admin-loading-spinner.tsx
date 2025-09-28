"use client"

import { Loader2 } from "lucide-react"
import type React from "react"

export function AdminLoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#f9f6f2] flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#7a5a43]" />
        <p className="mt-4 text-lg text-gray-700">Carregando painel administrativo...</p>
      </div>
    </div>
  )
}