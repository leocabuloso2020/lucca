"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const adminLoginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
})

export type AdminLoginFormInputs = z.infer<typeof adminLoginSchema>

interface AdminAuthFormProps {
  onLogin: (values: AdminLoginFormInputs) => Promise<void>
  onPasswordReset: (email: string) => Promise<void>
  isSubmitting: boolean
}

export function AdminAuthForm({ onLogin, onPasswordReset, isSubmitting }: AdminAuthFormProps) {
  const form = useForm<AdminLoginFormInputs>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handlePasswordResetClick = () => {
    const email = form.getValues("email")
    onPasswordReset(email)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl text-[#7a5a43]">Área Administrativa</CardTitle>
          <p className="text-gray-600">Chá de Bebê do Lucca</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onLogin)} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Senha</Label>
                <button
                  type="button"
                  onClick={handlePasswordResetClick}
                  className="text-sm text-[#7a5a43] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-[#7a5a43] hover:bg-[#c1a892] text-white" disabled={isSubmitting}>
              {isSubmitting ? (
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