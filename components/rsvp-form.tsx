"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Users, Loader2, PartyPopper, Frown } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

// Zod Schema para validação robusta
const rsvpFormSchema = z
  .object({
    name: z.string().min(3, { message: "Por favor, insira seu nome completo." }),
    will_attend: z.enum(["yes", "no"], {
      required_error: "Por favor, selecione se você poderá comparecer.",
    }),
    number_of_guests: z.coerce.number().min(1, "Deve haver pelo menos 1 convidado.").optional(),
    dietary_restrictions: z.string().optional(),
    message: z.string().optional(),
  })
  .refine(
    (data) => {
      // Se for comparecer, o número de convidados é obrigatório
      if (data.will_attend === "yes") {
        return data.number_of_guests !== undefined && data.number_of_guests >= 1
      }
      return true
    },
    {
      message: "Por favor, informe o número de convidados.",
      path: ["number_of_guests"],
    },
  )

type RsvpFormValues = z.infer<typeof rsvpFormSchema>

export function RSVPForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<RsvpFormValues | null>(null)

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      name: "",
      number_of_guests: 1,
      dietary_restrictions: "",
      message: "",
    },
  })

  const willAttend = form.watch("will_attend")

  const onSubmit = async (data: RsvpFormValues) => {
    const toastId = toast.loading("Enviando sua confirmação...")

    try {
      const { error } = await supabase.from("guest_confirmations").insert([
        {
          name: data.name.trim(),
          will_attend: data.will_attend === "yes",
          number_of_guests: data.will_attend === "yes" ? data.number_of_guests : null,
          dietary_restrictions: data.dietary_restrictions?.trim() || null,
          message: data.message?.trim() || null,
          is_confirmed: false,
        },
      ])

      if (error) {
        console.error("Supabase error details:", error)
        throw new Error(error.message)
      }

      toast.success("Confirmação enviada com sucesso!", { id: toastId })
      setSubmittedData(data)
      setIsSubmitted(true)
    } catch (error: any) {
      console.error("Error submitting RSVP:", error)
      toast.error(`Erro ao enviar: ${error.message}`, { id: toastId })
    }
  }

  if (isSubmitted && submittedData) {
    return (
      <Card className="bg-white border-[#3CB371]/30 shadow-xl max-w-2xl mx-auto animate-fade-in-up">
        <CardContent className="p-8 text-center">
          {submittedData.will_attend === "yes" ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4">
                  <PartyPopper className="text-green-600" size={48} />
                </div>
              </div>
              <h3 className="font-serif text-2xl text-[#3CB371] mb-4">Confirmação Recebida!</h3>
              <p className="text-[#2d5a3d] text-lg">
                Obrigado por confirmar sua presença, {submittedData.name}! Mal podemos esperar para celebrar com você.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="bg-amber-100 rounded-full p-4">
                  <Frown className="text-amber-600" size={48} />
                </div>
              </div>
              <h3 className="font-serif text-2xl text-amber-700 mb-4">Resposta Recebida</h3>
              <p className="text-[#2d5a3d] text-lg">
                Obrigado por nos avisar, {submittedData.name}. Sentiremos sua falta, mas entendemos perfeitamente.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-[#3CB371]/30 shadow-xl max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-[#f0f8f0] p-3 rounded-full w-fit mb-2">
          <Users size={32} className="text-[#3CB371]" />
        </div>
        <CardTitle className="font-serif text-3xl text-[#3CB371]">Confirme sua Presença</CardTitle>
        <CardDescription className="text-[#2d5a3d]">
          Por favor, preencha o formulário abaixo para nos ajudar na organização.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2d5a3d] font-medium">Seu nome completo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Seu nome e sobrenome"
                      className="border-[#3CB371]/30 focus:border-[#3CB371] focus:ring-[#3CB371]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="will_attend"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[#2d5a3d] font-medium">Você virá ao chá de bebê? *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-[#3CB371]/30 rounded-lg flex-1 has-[:checked]:bg-[#f0f8f0] has-[:checked]:border-[#3CB371]">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal text-base text-[#2d5a3d]">
                          Sim, estarei lá!
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-[#3CB371]/30 rounded-lg flex-1 has-[:checked]:bg-amber-50 has-[:checked]:border-amber-300">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal text-base text-[#2d5a3d]">
                          Não poderei ir
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {willAttend === "yes" && (
              <>
                <FormField
                  control={form.control}
                  name="number_of_guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#2d5a3d] font-medium">
                        Quantas pessoas virão? (incluindo você) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          className="border-[#3CB371]/30 focus:border-[#3CB371] focus:ring-[#3CB371] w-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dietary_restrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#2d5a3d] font-medium">
                        Restrições alimentares (opcional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: vegetariano, sem glúten, etc."
                          className="border-[#3CB371]/30 focus:border-[#3CB371] focus:ring-[#3CB371]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2d5a3d] font-medium">
                    Mensagem para a família (opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deixe uma mensagem carinhosa..."
                      className="border-[#3CB371]/30 focus:border-[#3CB371] focus:ring-[#3CB371] min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-[#3CB371] hover:bg-[#2d5a3d] text-white py-3 text-lg font-medium"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Confirmação"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}