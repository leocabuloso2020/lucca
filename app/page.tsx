"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MapPin, Calendar, Clock, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { FloatingElements } from "@/components/floating-elements"
import { MusicPlayer } from "@/components/music-player"
import { CountdownTimer } from "@/components/countdown-timer"
import { RSVPForm } from "@/components/rsvp-form"
import { MessagesWall } from "@/components/messages-wall"

export default function BabyShowerPage() {
  const [loading, setLoading] = useState(false) // Mantido, mas pode ser removido se não houver outras cargas
  const [currentSection, setCurrentSection] = useState("opening") // Mantido para o estado da seção, caso seja usado em outro lugar

  // O useEffect para rolagem automática foi removido aqui.

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
    setCurrentSection(sectionId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F2] via-white to-[#f0f8f0] relative">
      <FloatingElements />
      <MusicPlayer />

      <section id="opening" className="min-h-screen flex items-center justify-center px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-serif text-[#3CB371] mb-4 animate-heartbeat">Lucca</h1>
            <div className="flex items-center justify-center gap-4 text-[#DAA520] text-4xl mb-6">
              <Heart className="animate-heartbeat" />
              <span className="font-serif text-3xl">está chegando!</span>
              <Heart className="animate-heartbeat" />
            </div>
          </div>

          <p className="text-xl md:text-2xl text-[#2d5a3d] mb-8 font-light leading-relaxed">
            Venha celebrar conosco este momento especial e dar as boas-vindas ao nosso pequeno príncipe
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#3CB371]/20 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-[#2d5a3d]">
              <div className="flex items-center gap-2">
                <Calendar className="text-[#3CB371]" />
                <span className="font-medium">15 de Março, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-[#3CB371]" />
                <span className="font-medium">14:00 às 18:00</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-[#3CB371]" />
                <span className="font-medium">Salão de Festas</span>
              </div>
            </div>
          </div>

          <CountdownTimer />
        </div>
      </section>

      <section
        id="invitation"
        className="flex items-center justify-center px-4 py-16 bg-white/50 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-[#3CB371] mb-8">Você está convidado!</h2>

          <Card className="bg-gradient-to-br from-white to-[#f0f8f0] border-[#3CB371]/30 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-lg md:text-xl text-[#2d5a3d] leading-relaxed space-y-6">
                <p>Com muito amor e alegria, convidamos você para celebrar a chegada do nosso pequeno Lucca.</p>
                <p>
                  Será um momento especial de união, carinho e muita felicidade. Sua presença tornará este dia ainda
                  mais especial!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="rsvp" className="flex items-center justify-center px-4 py-16 bg-white/50 relative z-10">
        <RSVPForm />
      </section>

      <section id="messages" className="flex items-center justify-center px-4 py-16 relative z-10">
        <MessagesWall />
      </section>

      <section
        id="location"
        className="flex items-center justify-center px-4 py-16 bg-white/50 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-[#3CB371] mb-8">Como Chegar</h2>
          <Card className="bg-white border-[#3CB371]/30 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <MapPin className="text-[#3CB371]" size={32} />
                <div className="text-left">
                  <h3 className="font-serif text-2xl text-[#2d5a3d] mb-2">Salão de Festas Villa Verde</h3>
                  <p className="text-[#2d5a3d]">Rua das Flores, 123 - Jardim Primavera</p>
                  <p className="text-[#2d5a3d]">São Paulo - SP, CEP: 01234-567</p>
                </div>
              </div>
              <div className="bg-[#f0f8f0] rounded-lg p-6 mt-6">
                <p className="text-[#2d5a3d]">Mapa interativo será implementado na próxima etapa</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="closing" className="flex items-center justify-center px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-[#3CB371] mb-8">Até Breve!</h2>
          <div className="bg-gradient-to-br from-white to-[#f0f8f0] rounded-2xl p-8 md:p-12 shadow-xl border border-[#3CB371]/30">
            <div className="text-xl md:text-2xl text-[#2d5a3d] leading-relaxed space-y-6">
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