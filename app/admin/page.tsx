"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, type Message as MessageType, type Profile, type RSVP as RSVPType } from "@/src/integrations/supabase/client"
import { toast } from "sonner"
import { AdminLoadingSpinner } from "@/components/admin/admin-loading-spinner"
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout"
import { type CreateAdminUserFormInputs } from "@/components/admin/admin-manage-admins-tab"

interface EventSetting {
  setting_key: string
  setting_value: string
  updated_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [loadingData, setLoadingData] = useState(false)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)

  const [messages, setMessages] = useState<MessageType[]>([])
  const [rsvps, setRsvps] = useState<RSVPType[]>([]) // New state for RSVPs
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    let isMounted = true;

    const handleAuthSession = async (currentSession: any) => {
      if (!isMounted) return;

      setSession(currentSession);
      if (currentSession) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentSession.user.id)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Erro ao carregar perfil do usuário.");
          setProfile(null);
          await supabase.auth.signOut();
          router.push("/admin/login");
        } else if (data?.is_admin) {
          setProfile(data as Profile);
        } else {
          toast.error("Você não tem permissão de administrador.");
          await supabase.auth.signOut();
          router.push("/admin/login");
        }
      } else {
        setProfile(null);
        router.push("/admin/login");
      }
      setLoadingAuth(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        handleAuthSession(currentSession);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (profile?.is_admin) {
      loadDashboardData()
    }
  }, [profile])

  const handleLogout = async () => {
    setLoadingAuth(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Erro ao fazer logout.")
    } else {
      toast.success("Logout realizado com sucesso!")
      setSession(null)
      setProfile(null)
      router.push("/admin/login")
    }
    setLoadingAuth(false)
  }

  const loadDashboardData = async () => {
    setLoadingData(true)

    // Fetch Messages
    const { data: messagesData, error: messagesError } = await supabase.from("messages").select("*").order("created_at", { ascending: false })
    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      toast.error("Erro ao carregar mensagens.")
    } else {
      setMessages(messagesData || [])
    }

    // Fetch RSVPs
    const { data: rsvpsData, error: rsvpsError } = await supabase.from("rsvp").select("*").order("created_at", { ascending: false })
    if (rsvpsError) {
      console.error("Error fetching RSVPs:", rsvpsError)
      toast.error("Erro ao carregar confirmações de presença.")
    } else {
      setRsvps(rsvpsData || [])
    }

    // Fetch Settings
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

  const deleteRsvp = async (id: number) => {
    if (confirm("Tem certeza que deseja remover esta confirmação de presença?")) {
      const { error } = await supabase.from("rsvp").delete().eq("id", id)

      if (!error) {
        setRsvps(rsvps.filter((r) => r.id !== id))
        toast.success("Confirmação de presença removida com sucesso!")
      } else {
        console.error("Error deleting RSVP:", error)
        toast.error("Erro ao remover confirmação de presença.")
      }
    }
  }

  const toggleRsvpConfirmation = async (id: number, isConfirmed: boolean) => {
    const { error } = await supabase.from("rsvp").update({ is_confirmed: !isConfirmed }).eq("id", id)

    if (!error) {
      setRsvps(rsvps.map((r) => (r.id === id ? { ...r, is_confirmed: !isConfirmed } : r)))
      toast.success(`Confirmação de presença ${!isConfirmed ? "marcada como confirmada" : "desmarcada como confirmada"}!`)
    } else {
      console.error("Error toggling RSVP confirmation:", error)
      toast.error("Erro ao atualizar confirmação de presença.")
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
        console.error("Full error response from API route:", data);
        throw new Error(data.error || `Falha ao criar usuário admin. Status: ${response.status}. Detalhes: ${JSON.stringify(data)}`);
      }

      toast.success("Novo usuário admin criado com sucesso!");
    } catch (error: any) {
      console.error("Error creating admin user in frontend:", error);
      toast.error(error.message || "Erro desconhecido ao criar usuário admin.");
    } finally {
      setIsCreatingAdmin(false)
    }
  }

  if (loadingAuth || !profile?.is_admin) {
    return <AdminLoadingSpinner />
  }

  return (
    <AdminDashboardLayout
      profile={profile}
      messages={messages}
      rsvps={rsvps} // Pass rsvps to layout
      settings={settings}
      loadingData={loadingData}
      onLogout={handleLogout}
      onDeleteMessage={deleteMessage}
      onToggleMessageApproval={toggleMessageApproval}
      onDeleteRsvp={deleteRsvp} // Pass deleteRsvp to layout
      onToggleRsvpConfirmation={toggleRsvpConfirmation} // Pass toggleRsvpConfirmation to layout
      onUpdateSetting={updateSetting}
      onSettingsChange={handleSettingsChange}
      onCreateAdminUser={handleCreateAdminUser}
      isCreatingAdmin={isCreatingAdmin}
    />
  )
}