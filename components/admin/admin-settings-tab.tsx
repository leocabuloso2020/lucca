"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Settings } from "lucide-react"

interface AdminSettingsTabProps {
  settings: Record<string, string>
  onUpdateSetting: (key: string, value: string) => Promise<void>
  onSettingsChange: (key: string, value: string) => void
}

export function AdminSettingsTab({
  settings,
  onUpdateSetting,
  onSettingsChange,
}: AdminSettingsTabProps) {
  return (
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
                onChange={(e) => onSettingsChange("event_address", e.target.value)}
                placeholder="Digite o endereço completo"
              />
              <Button onClick={() => onUpdateSetting("event_address", settings.event_address)}>Salvar</Button>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">Data do Evento</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={settings.event_date || ""}
                onChange={(e) => onSettingsChange("event_date", e.target.value)}
              />
              <Button onClick={() => {
                console.log("AdminSettingsTab: Valor enviado para 'event_date':", settings.event_date);
                onUpdateSetting("event_date", settings.event_date);
              }}>Salvar</Button>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">Horário de Início</Label>
            <div className="flex gap-2">
              <Input
                type="time"
                value={settings.event_time || ""}
                onChange={(e) => onSettingsChange("event_time", e.target.value)}
              />
              <Button onClick={() => onUpdateSetting("event_time", settings.event_time)}>Salvar</Button>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">Horário de Término</Label>
            <div className="flex gap-2">
              <Input
                type="time"
                value={settings.event_time_end || ""}
                onChange={(e) => onSettingsChange("event_time_end", e.target.value)}
              />
              <Button onClick={() => onUpdateSetting("event_time_end", settings.event_time_end)}>Salvar</Button>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">Título do Evento</Label>
            <div className="flex gap-2">
              <Input
                value={settings.event_title || ""}
                onChange={(e) => onSettingsChange("event_title", e.target.value)}
                placeholder="Nome do evento"
              />
              <Button onClick={() => onUpdateSetting("event_title", settings.event_title)}>Salvar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">A senha do admin agora é gerenciada pelo Supabase Auth. Você pode redefinir a senha de um usuário admin diretamente no painel do Supabase, na seção 'Authentication'.</p>
        </CardContent>
      </Card>
    </div>
  )
}