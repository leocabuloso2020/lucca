"use client"

import type React from "react"
import { useState, useEffect } from "react" // Import useEffect
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Users, Check, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

export function RSVPForm() {
  const [formData, setFormData] = useState({
    name: "",
    will_attend: "",
    number_of_guests: 1,
    dietary_restrictions: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Log para verificar a instância do Supabase
    console.log("[RSVPForm] Supabase client instance:", supabase);
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.will_attend) {
      setError("Por favor, preencha seu nome e confirme sua presença.")
      toast.error("Por favor, preencha os campos obrigatórios.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const { error } = await supabase.from("rsvp").insert([
        {
          name: formData.name.trim(),
          will_attend: formData.will_attend === "yes",
          number_of_guests: formData.will_attend === "yes" ? formData.number_of_guests : null,
          dietary_restrictions: formData.dietary_restrictions.trim() || null,
          message: formData.message.trim() || null,
          is_confirmed: false, // Default para false, admin irá confirmar
        },
      ])

      if (error) {
        console.error("Supabase error details:", error.message, error.details, error.hint);
        throw error;
      }

      setIsSubmitted(true)
      toast.success("Confirmação de presença enviada com sucesso!")
    } catch (error: any) {
      console.error("Error submitting RSVP:", error)
      const errorMessage = error.message || "Erro desconhecido ao enviar confirmação."
      setError(`Erro ao enviar confirmação: ${errorMessage}. Por favor, tente novamente ou entre em contato com o suporte se o problema persistir.`)
      toast.error(`Erro: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="bg-white border-[#3CB371]/30 shadow-xl max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <Check className="text-green-600" size={48} />
            </div>
          </div>
          <h3 className="font-serif text-2xl text-[#3CB371] mb-4">Confirmação Recebida!</h3>
          <p className="text-[#2d5a3d] text-lg">
            {formData.will_attend === "yes"
              ? "Obrigado por confirmar sua presença! Mal podemos esperar para celebrar com você."
              : "Obrigado por nos avisar. Sentiremos sua falta, mas entendemos."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-[#3CB371]/30 shadow-xl max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#3CB371] font-serif text-2xl">
          <Users size={28} />
          Confirme sua Presença
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#2d5a3d] font-medium">
              Seu nome completo *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="border-[#3CB371]/30 focus:border-[#3CB371] focus:ring-[#3CB371]"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[#2d5a3d] font-medium">Você virá ao chá de bebê? *</Label>
            <RadioGroup
              value={formData.will_attend}
              onValueChange={(value) => handleInputChange("will_attend", value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" className="border-[#3CB371] text-[#3CB371]" />
                <Label htmlFor="yes" className="text-[#2d5a3d]">
                  Sim, estarei lá!
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" className="border-[#3CB371] text-[#3CB371]" />
                <Label htmlFor="no" className="text-[#2d5a3d]">
                  Não poderei ir
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.will_attend === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-[#2d5a3d] font-medium">
                Quantas pessoas virão? (incluindo você)
              </Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="10"
                value={formData.number_of_guests}
                onChange={(e) => handleInputChange("number_of_guests", Number.parseInt(e.target.value) || 1)}
                className="border-[#3CB371]/30 focus:border-[#3CB371] focus:ring-[#3CB371] w-24"
              />
            </div>
          )}

          {formData.will_attend === "yes" && (
            <div className="space-y-2">
              <Label htmlFor="dietary" className="text-[#2d5a3d] font-medium">
                Restrições alimentares (opcional)
              </Label>
              <Input
                id="dietary"
                value={formData.dietary_restrictions}
                onChange={(e) => handleInputChange("dietary_restrictions", e.target.value)}
                className="border-[#3CB371]/30 focus:border-[#3CB371] focus:ring-[#3CB371]"
                placeholder="Ex: vegetariano, sem glúten, etc."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message" className="text-[#2d5a3d] font-medium">
              Mensagem para a família (opcional)
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="border-[#3CB371]/30 focus:border-[#3CB371] focus:ring-[#3CB371] min-h-[100px]"
              placeholder="Deixe uma mensagem carinhosa..."
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3CB371] hover:bg-[#2d5a3d] text-white py-3 text-lg font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "Confirmar Presença"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}