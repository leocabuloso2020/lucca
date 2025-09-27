"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, MessageSquare, Settings, UserPlus, Users } from "lucide-react"
import { AdminMessagesTab } from "./admin-messages-tab"
import { AdminSettingsTab } from "./admin-settings-tab"
import { AdminManageAdminsTab } from "./admin-manage-admins-tab"
import { AdminConfirmationsList } from "./admin-confirmations-list"
import { type Message as MessageType, type Profile, type Confirmation as ConfirmationType } from "@/src/integrations/supabase/client"
import { type CreateAdminUserFormInputs } from "./admin-manage-admins-tab"

interface AdminDashboardLayoutProps {
  profile: Profile | null
  messages: MessageType[]
  confirmations: ConfirmationType[]
  settings: Record<string, string>
  loadingData: boolean
  onLogout: () => Promise<void>
  onDeleteMessage: (id: number) => Promise<void>
  onToggleMessageApproval: (id: number, approved: boolean) => Promise<void>
  onDeleteConfirmation: (id: number) => Promise<void>
  onUpdateSetting: (key: string, value: string) => Promise<void>
  onSettingsChange: (key: string, value: string) => void
  onCreateAdminUser: (values: CreateAdminUserFormInputs) => Promise<void>
  isCreatingAdmin: boolean
}

export function AdminDashboardLayout({
  profile,
  messages,
  confirmations,
  settings,
  loadingData,
  onLogout,
  onDeleteMessage,
  onToggleMessageApproval,
  onDeleteConfirmation,
  onUpdateSetting,
  onSettingsChange,
  onCreateAdminUser,
  isCreatingAdmin,
}: AdminDashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<"messages" | "confirmations" | "settings" | "manage-admins">("messages")

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
            variant={activeTab === "confirmations" ? "default" : "outline"}
            onClick={() => setActiveTab("confirmations")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Confirmados
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
        {activeTab === "confirmations" && (
          <AdminConfirmationsList
            confirmations={confirmations}
            loading={loadingData}
            onDeleteConfirmation={onDeleteConfirmation}
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