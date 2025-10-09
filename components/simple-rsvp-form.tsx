"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
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

  return (
    <>
      {isSubmitted && <ConfettiEffect />}
      {isSubmitted ? (
        <div className="text-center w-full max-w-4xl mx-auto">
          <div className="bg-[#c1a892]/20 rounded-full p-4 inline-block mb-4">
            <PartyPopper className="text-[#7a5a43]" size={48} />
          </div>
          <h3 className="font-serif text-2xl text-[#7a5a43] mb-2">Obrigado por confirmar!</h3>
          <p className="text-[#7a5a43] text-lg">
            Sua presença foi registrada. Mal podemos esperar para celebrar com você!
          </p>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-[#7a5a43] mb-4">Confirme sua Presença</h2>
          <p className="text-lg text-[#7a5a43] mb-6">
            Meus papais pedem a gentileza da sua confirmação até o dia 24 de outubro.
          </p>
          <Card className="w-full bg-white/80 backdrop-blur-sm border-[#c1a892]/30 shadow-lg">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-[#c1a892]/30 focus:border-[#c1a892] focus:ring-[#c1a892] text-center text-lg h-12"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#7a5a43] hover:bg-[#c1a892] text-white py-3 text-lg"
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
        </div>
      )}
    </>
  )
}