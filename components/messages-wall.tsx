"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Heart, MessageCircle, Send, Loader2, Clock } from "lucide-react"
import { supabase, type Message } from "@/lib/supabase/client"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

export function MessagesWall() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const capitalizeFirstLetter = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  useEffect(() => {
    fetchMessages()

    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload: RealtimePostgresChangesPayload<Message>) => {
        if (payload.eventType === "INSERT") {
          const newMessage = payload.new as Message
          if (newMessage.approved) {
            setMessages((prev) => [newMessage, ...prev])
          }
        } else if (payload.eventType === "UPDATE") {
          const updatedMessage = payload.new as Message
          if (updatedMessage.approved) {
            setMessages((prev) => {
              const exists = prev.find((m) => m.id === updatedMessage.id)
              if (!exists) {
                return [updatedMessage, ...prev]
              }
              return prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
            })
          } else {
            setMessages((prev) => prev.filter((m) => m.id !== updatedMessage.id))
          }
        } else if (payload.eventType === "DELETE") {
          const deletedMessage = payload.old as Message
          setMessages((prev) => prev.filter((m) => m.id !== deletedMessage.id))
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.message.trim()) {
      setError("Por favor, preencha seu nome e mensagem.")
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")

    try {
      const { data, error } = await supabase.from("messages").insert([
        {
          author_name: formData.name.trim(),
          message: formData.message.trim(),
          approved: false,
        },
      ]).select();

      if (error) {
        throw error;
      }

      setFormData({ name: "", message: "" })
      setShowForm(false)
      setSuccessMessage("Mensagem enviada! Ela aparecerá no mural após aprovação.")

      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setError("Erro ao enviar mensagem. Tente novamente.")
      console.error("Error submitting message:", error);
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-5xl md:text-6xl font-serif text-[#7a5a43] mb-4">Mural de Mensagens</h2>
        <p className="text-lg text-[#7a5a43] mb-6">Deixe uma mensagem carinhosa para o Lucca e sua família</p>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#7a5a43] hover:bg-[#c1a892] text-white px-8 py-3 text-lg font-medium"
        >
          <MessageCircle className="mr-2" size={20} />
          {showForm ? "Cancelar" : "Deixar Mensagem"}
        </Button>
      </div>

      {successMessage && (
        <Card className="bg-green-50 border-green-200 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-green-700">
              <Clock className="w-5 h-5" />
              <p>{successMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card className="bg-white border-[#c1a892]/30 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-[#7a5a43] font-serif text-xl">Nova Mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#7a5a43] font-medium">
                  Seu nome *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="border-[#c1a892]/30 focus:border-[#c1a892] focus:ring-[#c1a892]"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#7a5a43] font-medium">
                  Sua mensagem *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="border-[#c1a892]/30 focus:border-[#c1a892] focus:ring-[#c1a892] min-h-[120px]"
                  placeholder="Escreva uma mensagem carinhosa para o Lucca e sua família..."
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                <Clock className="w-4 h-4 inline mr-2" />
                Sua mensagem passará por uma breve moderação antes de aparecer no mural.
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#7a5a43] hover:bg-[#c1a892] text-white py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#7a5a43]" size={48} />
            <span className="ml-4 text-[#7a5a43]">Carregando mensagens...</span>
          </div>
        ) : messages.length === 0 ? (
          <Card className="bg-white border-[#c1a892]/30 shadow-lg">
            <CardContent className="p-8 text-center">
              <MessageCircle className="mx-auto mb-4 text-[#c1a892]" size={48} />
              <p className="text-[#7a5a43] text-lg">Seja o primeiro a deixar uma mensagem carinhosa para o Lucca!</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className="bg-white border-[#c1a892]/30 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f2ebdd] rounded-full p-3 flex-shrink-0">
                    <Heart className="text-[#7a5a43]" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-sans text-lg text-[#7a5a43] font-semibold">
                        {capitalizeFirstLetter(message.author_name)}
                      </h4>
                      <span className="text-sm text-[#c1a892]">{formatDate(message.created_at)}</span>
                    </div>
                    <p className="text-[#7a5a43] leading-relaxed whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}