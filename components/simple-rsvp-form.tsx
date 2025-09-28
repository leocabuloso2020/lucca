"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/src/integrations/supabase/client"
import { toast } from "sonner"
import { Loader2, PartyPopper, Check } from "lucide-react"
import { ConfettiEffect } from "./confetti-effect"

export function SimpleRsvpForm() {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Por favor, insira seu nome.")
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Confirmando presença...")

    const { error } = await supabase.from("confirmations").insert([{ name: name.trim() }])

    if (error) {
      toast.error("Ocorreu um erro. Tente novamente.", { id: toastId })
      console.error("Error submitting confirmation:", error)
    } else {
      toast.success("Presença confirmada com sucesso!", { id: toastId })
      setIsSubmitted(true)
    }

    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="text-center w-full max-w-4xl mx-auto">
        <ConfettiEffect />
        <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
          <PartyPopper className="text-green-600" size={48} />
        </div>
        <h3 className="font-serif text-2xl text-[#3CB371] mb-2">Obrigado por confirmar!</h3>
        <p className="text-[#2d5a3d] text-lg">
          Sua presença foi registrada. Mal podemos esperar para celebrar com você!
        </p>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-[#3CB371]/30 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-3xl text-[#3CB371]">Confirme sua Presença</CardTitle>
        <CardDescription className="text-[#2d5a3d]">É rapidinho, só precisamos do seu nome!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-[#3CB371]/30 focus:border-[#3CB371] focus:ring-[#3CB371] text-center text-lg h-12"
              placeholder="Seu nome completo"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3CB371] hover:bg-[#2d5a3d] text-white py-3 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <Check className="mr-2" size={20} />
                Confirmar Presença
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}