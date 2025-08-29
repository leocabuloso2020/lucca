"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-dancing text-2xl text-green-600">Área Administrativa (Teste)</CardTitle>
          <p className="text-gray-600">Se você está vendo esta mensagem, a página está carregando!</p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-600" />
          <p>Aguardando o carregamento completo...</p>
          <p className="text-sm text-gray-500">Por favor, verifique o console do navegador para erros.</p>
        </CardContent>
      </Card>
    </div>
  )
}