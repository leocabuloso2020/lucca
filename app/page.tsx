"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MapPin, Calendar, Clock, Loader2, Gift } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { FloatingElements } from "@/components/floating-elements"
import { MusicPlayer } from "@/components/music-player"
import { CountdownTimer } from "@/components/countdown-timer"
import { MessagesWall } from "@/components/messages-wall"
import { SimpleRsvpForm } from "@/components/simple-rsvp-form"

interface EventSetting {
  setting_key: string
  setting_value: string
  updated_at: string
}

export default function BabyShowerPage() {
  const [loading, setLoading] = useState(true)
  const [eventSettings, setEventSettings] = useState<Record<string, string>>({})
  const [currentSection, setCurrentSection] = useState("opening")

  useEffect(() => {
    const fetchEventSettings = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("event_settings").select("*")

      if (error) {
        console.error("Error fetching event settings:", error)
        // Fallback to default values or show an error message
      } else if (data) {
        const settingsObj = data.reduce(
          (acc: Record<string, string>, item: EventSetting) => {
            acc[item.setting_key] = item.setting_value
            return acc
          },
          {} as Record<string, string>,
        )
        setEventSettings(settingsObj)
      }
      setLoading(false)
    }

    fetchEventSettings()
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
    setCurrentSection(sectionId)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Data a definir"
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch (e) {
      console.error("Invalid date string for formatting:", dateString, e)
      return "Data inválida"
    }
  }

  const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime) return "Hora a definir"
    if (!endTime) return startTime // Return only start time if no end time
    return `${startTime} - ${endTime}`
  }

  const eventDate = eventSettings.event_date || "2025-03-15" // Default if not set
  const eventTime = eventSettings.event_time || "14:00" // Default if not set
  const eventEndTime = eventSettings.event_time_end || ""
  const eventDateTime = `${eventDate}T${eventTime}:00` // Combine for CountdownTimer

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#3CB371]" size={48} />
        <span className="ml-4 text-[#2d5a3d]">Carregando informações do evento...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F2] via-white to-[#f0f8f0] relative">
      <FloatingElements />
      <MusicPlayer />

      <section id="opening" className="min-h-screen flex items-center justify-center px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-serif text-[#3CB371] mb-4 animate-heartbeat">
              {eventSettings.event_title || "Chá de Bebê do Lucca"}
            </h1>
            <div className="flex items-center justify-center gap-4 text-[#DAA520] text-4xl mb-6">
              <Heart className="animate-heartbeat" />
              <span className="font-serif text-3xl">está chegando!</span>
              <Heart className="animate-heartbeat" />
            </div>
          </div>

          <p className="text-xl text-[#2d5a3d] mb-8 font-light leading-relaxed">
            Venha celebrar conosco este momento especial e dar as boas-vindas ao nosso pequeno príncipe
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#3CB371]/20 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-[#2d5a3d]">
              <div className="flex items-center gap-2">
                <Calendar className="text-[#3CB371]" />
                <span className="font-medium">{formatDate(eventDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-[#3CB371]" />
                <span className="font-medium">{formatTimeRange(eventTime, eventEndTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-[#3CB371]" />
                <span className="font-medium">{eventSettings.event_address || "Salão de Festas"}</span>
              </div>
            </div>
          </div>

          <CountdownTimer targetDateTime={eventDateTime} />

          <Card className="mt-8 bg-white/90 backdrop-blur-sm border-[#3CB371]/30 shadow-lg text-left">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Gift className="text-[#DAA520] mx-auto mb-2" size={32} />
                <h3 className="font-serif text-2xl text-[#3CB371]">Sugestão de Presente</h3>
              </div>
              <p className="text-center text-[#2d5a3d] mb-4">Sua presença será o nosso maior presente! 💕</p>
              <p className="text-center text-[#2d5a3d] mb-6">
                Mas, se desejar nos ajudar a preparar essa nova fase, pedimos com muito carinho:
              </p>
              <ul className="space-y-4 text-[#2d5a3d] list-none p-0 max-w-md mx-auto">
                <li className="flex items-start">
                  <span className="mr-3 text-xl pt-1">🍼</span>
                  <div>
                    <strong className="font-semibold">Fraldas (tamanho P, M ou G)</strong>
                    <p className="text-sm text-gray-600">✨ Marcas: Huggies, Turma da Mônica ou Pampers</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-xl pt-1">🎁</span>
                  <strong className="font-semibold">E um Mimo especial da sua escolha</strong>
                </li>
              </ul>
              <p className="text-center text-[#2d5a3d] mt-6">
                Contamos com seu carinho para tornar esse momento ainda mais doce! 🌸
              </p>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-white/90 backdrop-blur-sm border-[#3CB371]/30 shadow-lg text-left">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h3 className="font-serif text-2xl text-[#3CB371]">🥂 Importante</h3>
              </div>
              <p className="text-center text-[#2d5a3d] mb-4">
                No nosso chá de Bebê já teremos refrigerante e suco para todos!
              </p>
              <p className="text-center text-[#2d5a3d]">
                Quem quiser pode ficar à vontade para levar sua bebida alcoólica preferida para brindar com a gente. 🍻🍷
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="rsvp" className="flex items-center justify-center px-4 py-16 bg-white/50 relative z-10">
        <SimpleRsvpForm />
      </section>

      <section id="messages" className="flex items-center justify-center px-4 py-16 relative z-10">
        <MessagesWall />
      </section>

      <section id="closing" className="flex items-center justify-center px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-[#3CB371] mb-8">Até Breve!</h2>
          <div className="bg-gradient-to-br from-white to-[#f0f8f0] rounded-2xl p-8 md:p-12 shadow-xl border border-[#3CB371]/30">
            <div className="text-lg text-[#2d5a3d] leading-relaxed space-y-6">
              <p>Mal podemos esperar para compartilhar este momento especial com você!</p>
              <p>O Lucca já está ansioso para conhecer todos que o amam.</p>
              <div className="flex items-center justify-center gap-4 text-[#DAA520] text-3xl mt-8">
                <Heart className="animate-heartbeat" />
                <span className="font-serif">Com amor, a família</span>
                <Heart className="animate-heartbeat" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}