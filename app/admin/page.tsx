"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client" // Caminho do import atualizado
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Eye, EyeOff, Settings, MessageSquare, MapPin } from "lucide-react"

interface Message {
  id: number
  name: string
  message: string
  created_at: string
  approved: boolean
}

interface EventSetting {
  setting_key: string
  setting_value: string
  updated_at: string // Adicionado para corresponder ao uso
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"messages" | "settings">("messages")

  // Verificar autenticação
  const handleLogin = async () => {
    if (password === "lucca2024") {
      setIsAuthenticated(true)
      loadData()
    } else {
      alert("Senha incorreta!")
    }
  }

  // Carregar dados
  const loadData = async () => {
    setLoading(true)

    // Carregar mensagens
    const { data: messagesData } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

    if (messagesData) setMessages(messagesData)

    // Carregar configurações
    const { data: settingsData } = await supabase.from("event_settings").select("*")

    if (settingsData) {
      const settingsObj = settingsData.reduce(
        (acc: Record<string, string>, item: EventSetting) => { // Tipagem corrigida
          acc[item.setting_key] = item.setting_value
          return acc
        },
        {} as Record<string, string>,
      )
      setSettings(settingsObj)
    }

    setLoading(false)
  }

  // Remover mensagem
  const deleteMessage = async (id: number) => {
    if (confirm("Tem certeza que deseja remover esta mensagem?")) {
      const { error } = await supabase.from("messages").delete().eq("id", id)

      if (!error) {
        setMessages(messages.filter((m) => m.id !== id))
      }
    }
  }

  // Aprovar/desaprovar mensagem
  const toggleMessageApproval = async (id: number, approved: boolean) => {
    const { error } = await supabase.from("messages").update({ approved: !approved }).eq("id", id)

    if (!error) {
      setMessages(messages.map((m) => (m.id === id ? { ...m, approved: !approved } : m)))
    }
  }

  // Atualizar configuração
  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from("event_settings")
      .update({ setting_value: value, updated_at: new Date().toISOString() })
      .eq("setting_key", key)

    if (!error) {
      setSettings({ ...settings, [key]: value })
      alert("Configuração atualizada com sucesso!")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-dancing text-2xl text-green-600">Área Administrativa</CardTitle>
            <p className="text-gray-600">Chá de Bebê do Lucca</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="font-dancing text-3xl text-green-600 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie o site do Chá de Bebê do Lucca</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "messages" ? "default" : "outline"}
            onClick={() => setActiveTab("messages")}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Mensagens
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "outline"}
            onClick={() => setActiveTab("settings")}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </Button>
        </div>

        {/* Mensagens */}
        {activeTab === "messages" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Gerenciar Mensagens ({messages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Carregando...</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg ${message.approved ? "bg-white" : "bg-gray-100"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{message.name}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(message.created_at).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleMessageApproval(message.id, message.approved)}
                          >
                            {message.approved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteMessage(message.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                      {!message.approved && (
                        <p className="text-sm text-orange-600 mt-2">⚠️ Mensagem oculta do público</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Configurações */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Informações do Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Endereço do Evento</label>
                  <div className="flex gap-2">
                    <Input
                      value={settings.event_address || ""}
                      onChange={(e) => setSettings({ ...settings, event_address: e.target.value })}
                      placeholder="Digite o endereço completo"
                    />
                    <Button onClick={() => updateSetting("event_address", settings.event_address)}>Salvar</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Data do Evento</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={settings.event_date || ""}
                      onChange={(e) => setSettings({ ...settings, event_date: e.target.value })}
                    />
                    <Button onClick={() => updateSetting("event_date", settings.event_date)}>Salvar</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Horário do Evento</label>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={settings.event_time || ""}
                      onChange={(e) => setSettings({ ...settings, event_time: e.target.value })}
                    />
                    <Button onClick={() => updateSetting("event_time", settings.event_time)}>Salvar</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Título do Evento</label>
                  <div className="flex gap-2">
                    <Input
                      value={settings.event_title || ""}
                      onChange={(e) => setSettings({ ...settings, event_title: e.target.value })}
                      placeholder="Nome do evento"
                    />
                    <Button onClick={() => updateSetting("event_title", settings.event_title)}>Salvar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium mb-2">Senha do Admin</label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={settings.admin_password || ""}
                      onChange={(e) => setSettings({ ...settings, admin_password: e.target.value })}
                      placeholder="Nova senha"
                    />
                    <Button onClick={() => updateSetting("admin_password", settings.admin_password)}>Alterar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Botão para voltar ao site */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Voltar ao Site
          </Button>
        </div>
      </div>
    </div>
  )
}