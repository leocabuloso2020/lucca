"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Trash2, Loader2 } from "lucide-react"
import { type Confirmation as ConfirmationType } from "@/src/integrations/supabase/client"

interface AdminConfirmationsListProps {
  confirmations: ConfirmationType[]
  loading: boolean
  onDeleteConfirmation: (id: number) => Promise<void>
}

export function AdminConfirmationsList({
  confirmations,
  loading,
  onDeleteConfirmation,
}: AdminConfirmationsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Convidados Confirmados ({confirmations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-4 h-4" /> Carregando lista...
          </p>
        ) : (
          <div className="space-y-2">
            {confirmations.length === 0 ? (
              <p className="text-gray-500">Nenhum convidado confirmado ainda.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {confirmations.map((confirmation) => (
                  <li key={confirmation.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-800">{confirmation.name}</p>
                      <p className="text-sm text-gray-500">Confirmado em: {formatDate(confirmation.created_at)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDeleteConfirmation(confirmation.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}