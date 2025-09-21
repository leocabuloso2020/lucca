"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserPlus, Loader2 } from "lucide-react"

const createAdminUserSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  first_name: z.string().min(1, { message: "Nome é obrigatório." }),
  last_name: z.string().min(1, { message: "Sobrenome é obrigatório." }),
})

type CreateAdminUserFormInputs = z.infer<typeof createAdminUserSchema>

interface AdminManageAdminsTabProps {
  onCreateAdminUser: (values: CreateAdminUserFormInputs) => Promise<void>
  isSubmitting: boolean
}

export function AdminManageAdminsTab({ onCreateAdminUser, isSubmitting }: AdminManageAdminsTabProps) {
  const form = useForm<CreateAdminUserFormInputs>({
    resolver: zodResolver(createAdminUserSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Criar Novo Usuário Admin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onCreateAdminUser)} className="space-y-4">
          <div>
            <Label htmlFor="new-admin-email">E-mail</Label>
            <Input
              id="new-admin-email"
              type="email"
              placeholder="novo.admin@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="new-admin-password">Senha</Label>
            <Input
              id="new-admin-password"
              type="password"
              placeholder="Senha do novo admin"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-admin-first-name">Nome</Label>
              <Input
                id="new-admin-first-name"
                type="text"
                placeholder="Nome"
                {...form.register("first_name")}
              />
              {form.formState.errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.first_name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="new-admin-last-name">Sobrenome</Label>
              <Input
                id="new-admin-last-name"
                type="text"
                placeholder="Sobrenome"
                {...form.register("last_name")}
              />
              {form.formState.errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.last_name.message}</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Criar Usuário Admin"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}