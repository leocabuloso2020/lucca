"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { AdminAuthForm, type AdminLoginFormInputs } from "@/components/admin/admin-auth-form"
import { AdminLoadingSpinner } from "@/components/admin/admin-loading-spinner"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Check if the user is an admin
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
          toast.error("Erro ao carregar perfil do usuário.")
          await supabase.auth.signOut() // Sign out if profile fetch fails
        } else if (profile?.is_admin) {
          router.push("/admin") // Redirect to dashboard if admin
        } else {
          toast.error("Você não tem permissão de administrador.")
          await supabase.auth.signOut() // Sign out if not admin
        }
      }
      setLoadingAuth(false)
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkSession() // Re-check session and profile on sign-in
      } else if (event === 'SIGNED_OUT') {
        setLoadingAuth(false) // Ensure loading is off on sign-out
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

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
      // Redirection handled by useEffect's checkSession
    }
    setIsSubmittingLogin(false)
  }

  const handlePasswordReset = async (email: string) => {
    if (!email) {
      toast.error("Por favor, digite seu e-mail no campo correspondente antes de clicar em 'Esqueci minha senha'.")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`, // Redirect back to admin after reset
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Se o e-mail estiver correto, um link para redefinir a senha foi enviado.")
    }
  }

  if (loadingAuth) {
    return <AdminLoadingSpinner />
  }

  return (
    <AdminAuthForm
      onLogin={handleLogin}
      onPasswordReset={handlePasswordReset}
      isSubmitting={isSubmittingLogin}
    />
  )
}