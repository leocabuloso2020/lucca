"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, MessageSquare, Settings, UserPlus, Users } from "lucide-react" // Import Users icon
import { AdminMessagesTab } from "./admin-messages-tab"
import { AdminSettingsTab } from "./admin-settings-tab"
import { AdminManageAdminsTab } from "./admin-manage-admins-tab"
import { AdminRsvpTab } from "./admin-rsvp-tab" // Import the new RSVP tab
import { type Message as MessageType, type Profile, type RSVP as RSVPType } from "@/src/integrations/supabase/client"
import { type AdminLoginFormInputs } from "./admin-auth-form"
import { type CreateAdminUserFormInputs } from "./admin-manage-admins-tab"

interface EventSetting {
  setting_key: string
  setting_value: string
  updated_at: string
}

interface AdminDashboardLayoutProps {
  profile: Profile | null
  messages: MessageType[]
  rsvps: RSVPType[] // Add rsvps prop
  settings: Record<string, string>
  loadingData: boolean
  onLogout: () => Promise<void>
  onDeleteMessage: (id: number) => Promise<void>
  onToggleMessageApproval: (id: number, approved: boolean) => Promise<void>
  onDeleteRsvp: (id: number) => Promise<void> // Add onDeleteRsvp prop
  onToggleRsvpConfirmation: (id: number, isConfirmed: boolean) => Promise<void> // Add onToggleRsvpConfirmation prop
  onUpdateSetting: (key: string, value: string) => Promise<void>
  onSettingsChange: (key: string, value: string) => void
  onCreateAdminUser: (values: CreateAdminUserFormInputs) => Promise<void>
  isCreatingAdmin: boolean
}

export function AdminDashboardLayout({
  profile,
  messages,
  rsvps, // Destructure rsvps
  settings,
  loadingData,
  onLogout,
  onDeleteMessage,
  onToggleMessageApproval,
  onDeleteRsvp, // Destructure onDeleteRsvp
  onToggleRsvpConfirmation, // Destructure onToggleRsvpConfirmation
  onUpdateSetting,
  onSettingsChange,
  onCreateAdminUser,
  isCreatingAdmin,
}: AdminDashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<"messages" | "rsvps" | "settings" | "manage-admins">("messages") // Add 'rsvps' to activeTab

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl text-green-600 mb-2">Painel Administrativo</h1>
            <p className="text-gray-600">Gerencie o site do Chá de Bebê do Lucca</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
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
            variant={activeTab === "rsvps" ? "default" : "outline"} // New RSVP tab button
            onClick={() => setActiveTab("rsvps")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Confirmações
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

        {/* Conteúdo das abas */}
        {activeTab === "messages" && (
          <AdminMessagesTab
            messages={messages}
            loading={loadingData}
            onDeleteMessage={onDeleteMessage}
            onToggleMessageApproval={onToggleMessageApproval}
          />
        )}
        {activeTab === "rsvps" && ( // Render the new RSVP tab
          <AdminRsvpTab
            rsvps={rsvps}
            loading={loadingData}
            onDeleteRsvp={onDeleteRsvp}
            onToggleRsvpConfirmation={onToggleRsvpConfirmation}
          />
        )}
        {activeTab === "settings" && (
          <AdminSettingsTab
            settings={settings}
            onUpdateSetting={onUpdateSetting}
            onSettingsChange={onSettingsChange}
          />
        )}
        {activeTab === "manage-admins" && (
          <AdminManageAdminsTab
            onCreateAdminUser={onCreateAdminUser}
            isSubmitting={isCreatingAdmin}
          />
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