"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, type Message as MessageType, type Profile } from "@/lib/supabase/client"
import { toast } from "sonner"
import { AdminLoadingSpinner } from "@/components/admin/admin-loading-spinner"
import { AdminAuthForm } from "@/components/admin/admin-auth-form"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { type AdminLoginFormInputs } from "@/components/admin/admin-auth-form" // Importação corrigida
import { type CreateAdminUserFormInputs } from "@/components/admin/admin-manage-admins-tab" // Importação corrigida

interface EventSetting {
  setting_key: string
  setting_value: string
  updated_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true) // Loading for auth state
  const [loadingData, setLoadingData] = useState(false) // Loading for dashboard data
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false) // For login form submission
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false) // For create admin form submission

  const [messages, setMessages] = useState<MessageType[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoadingAuth(false)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id)
      } else {
        setLoadingAuth(false)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (profile?.is_admin) {
      loadDashboardData()
    }
  }, [profile])

  const fetchProfile = async (userId: string) => {
    setLoadingAuth(true)
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      toast.error("Erro ao carregar perfil do usuário.")
      setProfile(null)
      setLoadingAuth(false)
      await supabase.auth.signOut() // Force logout if profile can't be fetched
    } else {
      setProfile(data as Profile)
      setLoadingAuth(false)
    }
  }

  const handleLogin = async (values: AdminLoginFormInputs) => {
    setIsSubmittingLogin(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Login realizado com sucesso!")
      // Session listener will handle setting session and profile
    }
    setIsSubmittingLogin(false)
  }

  const handleLogout = async () => {
    setLoadingAuth(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Erro ao fazer logout.")
    } else {
      toast.success("Logout realizado com sucesso!")
      setSession(null)
      setProfile(null)
      router.push("/admin") // Redirect to login page
    }
    setLoadingAuth(false)
  }

  const loadDashboardData = async () => {
    setLoadingData(true)

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

    setLoadingData(false)
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

  const handleSettingsChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateAdminUser = async (values: CreateAdminUserFormInputs) => {
    setIsCreatingAdmin(true)
    try {
      const response = await fetch('/api/create-admin-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário admin.');
      }

      toast.success("Novo usuário admin criado com sucesso!");
      // No need to reset form here, it's handled by the child component
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      toast.error(error.message || "Erro desconhecido ao criar usuário admin.");
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  if (loadingAuth) {
    return <AdminLoadingSpinner />
  }

  if (!session || !profile?.is_admin) {
    return <AdminAuthForm onLogin={handleLogin} isSubmitting={isSubmittingLogin} />
  }

  return (
    <AdminDashboardLayout
      profile={profile}
      messages={messages}
      settings={settings}
      loadingData={loadingData}
      onLogout={handleLogout}
      onDeleteMessage={deleteMessage}
      onToggleMessageApproval={toggleMessageApproval}
      onUpdateSetting={updateSetting}
      onSettingsChange={handleSettingsChange}
      onCreateAdminUser={handleCreateAdminUser}
      isCreatingAdmin={isCreatingAdmin}
    />
  )
}