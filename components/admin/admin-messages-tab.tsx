"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Trash2, Eye, EyeOff } from "lucide-react"
import { type Message as MessageType } from "@/lib/supabase/client"

interface AdminMessagesTabProps {
  messages: MessageType[]
  loading: boolean
  onDeleteMessage: (id: number) => Promise<void>
  onToggleMessageApproval: (id: number, approved: boolean) => Promise<void>
}

export function AdminMessagesTab({
  messages,
  loading,
  onDeleteMessage,
  onToggleMessageApproval,
}: AdminMessagesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Gerenciar Mensagens ({messages.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando mensagens...</p>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500">Nenhuma mensagem para exibir.</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border rounded-lg ${message.approved ? "bg-white" : "bg-gray-100"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{message.author_name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(message.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleMessageApproval(message.id, message.approved)}
                      >
                        {message.approved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDeleteMessage(message.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700">{message.message}</p>
                  {!message.approved && (
                    <p className="text-sm text-orange-600 mt-2">⚠️ Mensagem oculta do público</p>
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