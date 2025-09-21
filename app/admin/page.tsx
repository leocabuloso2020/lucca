"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, type Message as MessageType, type Profile } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2, Eye, EyeOff, Settings, MessageSquare, MapPin, UserPlus, LogOut, Loader2 } from "lucide-react" // Adicionado Loader2
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface EventSetting {
  setting_key: string
  setting_value: string
  updated_at: string
}

// Zod schema for admin login
const adminLoginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
})

type AdminLoginFormInputs = z.infer<typeof adminLoginSchema>

// Zod schema for creating new admin user
const createAdminUserSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  first_name: z.string().min(1, { message: "Nome é obrigatório." }),
  last_name: z.string().min(1, { message: "Sobrenome é obrigatório." }),
})

type CreateAdminUserFormInputs = z.infer<typeof createAdminUserSchema>

export default function AdminPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<"messages" | "settings" | "manage-admins">("messages")

  const loginForm = useForm<AdminLoginFormInputs>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const createAdminUserForm = useForm<CreateAdminUserFormInputs>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  })

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (profile?.is_admin) {
      loadData()
    }
  }, [profile])

  const fetchProfile = async (userId: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      toast.error("Erro ao carregar perfil do usuário.")
      setProfile(null)
      setLoading(false)
      await supabase.auth.signOut() // Force logout if profile can't be fetched
    } else {
      setProfile(data as Profile)
      setLoading(false)
    }
  }

  const handleLogin = async (values: AdminLoginFormInputs) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success("Login realizado com sucesso!")
      // Session listener will handle setting session and profile
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Erro ao fazer logout.")
      setLoading(false)
    } else {
      toast.success("Logout realizado com sucesso!")
      setSession(null)
      setProfile(null)
      setLoading(false)
      router.push("/admin") // Redirect to login page
    }
  }

  const loadData = async () => {
    setLoading(true)

    // Carregar mensagens
    const { data: messagesData, error: messagesError } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      toast.error("Erro ao carregar mensagens.")
    } else {
      setMessages(messagesData || [])
    }

    // Carregar configurações
    const { data: settingsData, error: settingsError } = await supabase.from("event_settings").select("*")

    if (settingsError) {
      console.error("Error fetching settings:", settingsError)
      toast.error("Erro ao carregar configurações.")
    } else if (settingsData) {
      const settingsObj = settingsData.reduce(
        (acc: Record<string, string>, item: EventSetting) => {
          acc[item.setting_key] = item.setting_value
          return acc
        },
        {} as Record<string, string>,
      )
      setSettings(settingsObj)
    }

    setLoading(false)
  }

  const deleteMessage = async (id: number) => {
    if (confirm("Tem certeza que deseja remover esta mensagem?")) {
      const { error } = await supabase.from("messages").delete().eq("id", id)

      if (!error) {
        setMessages(messages.filter((m) => m.id !== id))
        toast.success("Mensagem removida com sucesso!")
      } else {
        console.error("Error deleting message:", error)
        toast.error("Erro ao remover mensagem.")
      }
    }
  }

  const toggleMessageApproval = async (id: number, approved: boolean) => {
    const { error } = await supabase.from("messages").update({ approved: !approved }).eq("id", id)

    if (!error) {
      setMessages(messages.map((m) => (m.id === id ? { ...m, approved: !approved } : m)))
      toast.success(`Mensagem ${!approved ? "aprovada" : "desaprovada"}!`)
    } else {
      console.error("Error toggling message approval:", error)
      toast.error("Erro ao atualizar aprovação da mensagem.")
    }
  }

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from("event_settings")
      .upsert(
        { setting_key: key, setting_value: value, updated_at: new Date().toISOString() },
        { onConflict: "setting_key" }
      )

    if (!error) {
      setSettings({ ...settings, [key]: value })
      toast.success("Configuração atualizada com sucesso!")
    } else {
      console.error("Error updating setting:", error)
      toast.error("Erro ao atualizar configuração.")
    }
  }

  const handleCreateAdminUser = async (values: CreateAdminUserFormInputs) => {
    createAdminUserForm.clearErrors()
    try {
      const response = await fetch('/api/create-admin-user', { // This will be an Edge Function endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`, // Pass current admin's token
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário admin.');
      }

      toast.success("Novo usuário admin criado com sucesso!");
      createAdminUserForm.reset();
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      toast.error(error.message || "Erro desconhecido ao criar usuário admin.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600" />
          <p className="mt-4 text-lg text-gray-700">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!session || !profile?.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl text-green-600">Área Administrativa</CardTitle>
            <p className="text-gray-600">Chá de Bebê do Lucca</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loginForm.formState.isSubmitting}>
                {loginForm.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl text-green-600 mb-2">Painel Administrativo</h1>
            <p className="text-gray-600">Gerencie o site do Chá de Bebê do Lucca</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
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
          <Button
            variant={activeTab === "manage-admins" ? "default" : "outline"}
            onClick={() => setActiveTab("manage-admins")}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Gerenciar Admins
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
                          <h4 className="font-semibold">{message.author_name}</h4>
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
                  <Label className="block text-sm font-medium mb-2">Endereço do Evento</Label>
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
                  <Label className="block text-sm font-medium mb-2">Data do Evento</Label>
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
                  <Label className="block text-sm font-medium mb-2">Horário do Evento</Label>
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
                  <Label className="block text-sm font-medium mb-2">Título do Evento</Label>
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
                <p className="text-sm text-gray-600">A senha do admin agora é gerenciada pelo Supabase Auth. Você pode redefinir a senha de um usuário admin diretamente no painel do Supabase, na seção 'Authentication'.</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gerenciar Admins */}
        {activeTab === "manage-admins" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Criar Novo Usuário Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createAdminUserForm.handleSubmit(handleCreateAdminUser)} className="space-y-4">
                <div>
                  <Label htmlFor="new-admin-email">E-mail</Label>
                  <Input
                    id="new-admin-email"
                    type="email"
                    placeholder="novo.admin@example.com"
                    {...createAdminUserForm.register("email")}
                  />
                  {createAdminUserForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{createAdminUserForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="new-admin-password">Senha</Label>
                  <Input
                    id="new-admin-password"
                    type="password"
                    placeholder="Senha do novo admin"
                    {...createAdminUserForm.register("password")}
                  />
                  {createAdminUserForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{createAdminUserForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-admin-first-name">Nome</Label>
                    <Input
                      id="new-admin-first-name"
                      type="text"
                      placeholder="Nome"
                      {...createAdminUserForm.register("first_name")}
                    />
                    {createAdminUserForm.formState.errors.first_name && (
                      <p className="text-red-500 text-sm mt-1">{createAdminUserForm.formState.errors.first_name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="new-admin-last-name">Sobrenome</Label>
                    <Input
                      id="new-admin-last-name"
                      type="text"
                      placeholder="Sobrenome"
                      {...createAdminUserForm.register("last_name")}
                    />
                    {createAdminUserForm.formState.errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">{createAdminUserForm.formState.errors.last_name.message}</p>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={createAdminUserForm.formState.isSubmitting}>
                  {createAdminUserForm.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Criar Usuário Admin"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
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