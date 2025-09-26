"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { type RSVP as RSVPType } from "@/src/integrations/supabase/client"

interface AdminRsvpTabProps {
  rsvps: RSVPType[]
  loading: boolean
  onDeleteRsvp: (id: number) => Promise<void>
  onToggleRsvpConfirmation: (id: number, isConfirmed: boolean) => Promise<void>
}

export function AdminRsvpTab({
  rsvps,
  loading,
  onDeleteRsvp,
  onToggleRsvpConfirmation,
}: AdminRsvpTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
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
          Gerenciar Confirmações de Presença ({rsvps.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="flex items-center gap-2 text-gray-600">
            <Loader2 className="animate-spin w-4 h-4" /> Carregando confirmações...
          </p>
        ) : (
          <div className="space-y-4">
            {rsvps.length === 0 ? (
              <p className="text-gray-500">Nenhuma confirmação de presença para exibir.</p>
            ) : (
              rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className={`p-4 border rounded-lg ${rsvp.is_confirmed ? "bg-green-50 border-green-200" : rsvp.will_attend ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{rsvp.name}</h4>
                      <p className="text-sm text-gray-500">
                        {rsvp.will_attend ? "Confirmou presença" : "Não poderá ir"}
                        {rsvp.will_attend && rsvp.number_of_guests && ` (${rsvp.number_of_guests} pessoas)`}
                      </p>
                      <p className="text-xs text-gray-400">
                        Enviado em: {formatDate(rsvp.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleRsvpConfirmation(rsvp.id, rsvp.is_confirmed)}
                        className={rsvp.is_confirmed ? "bg-green-200 hover:bg-green-300" : "hover:bg-gray-100"}
                      >
                        {rsvp.is_confirmed ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-500" />}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDeleteRsvp(rsvp.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {rsvp.dietary_restrictions && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Restrições:</span> {rsvp.dietary_restrictions}
                    </p>
                  )}
                  {rsvp.message && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Mensagem:</span> {rsvp.message}
                    </p>
                  )}
                  {rsvp.is_confirmed && (
                    <p className="text-sm text-green-700 mt-2">✅ Presença confirmada pelo admin</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}