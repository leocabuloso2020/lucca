"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Gift, MapPin, Calendar, Clock, Loader2 } from "lucide-react"
import { supabase, type Gift as GiftType } from "@/lib/supabase/client"
import { GiftCard } from "@/components/gift-card"
import { FloatingElements } from "@/components/floating-elements"
import { MusicPlayer } from "@/components/music-player"
import { CountdownTimer } from "@/components/countdown-timer"
import { RSVPForm } from "@/components/rsvp-form"
import { MessagesWall } from "@/components/messages-wall"

export default function BabyShowerPage() {
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState("opening") // Mantido para o estado da seção, caso seja usado em outro lugar

  useEffect(() => {
    // Adicionado para depuração: verificar a variável de ambiente
    console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    fetchGifts()
  }, [])

  // O useEffect para rolagem automática foi removido aqui.

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase.from("gifts").select("*").order("created_at", { ascending: true })

      if (error) throw error
      setGifts(data || [])
    } catch (error) {
      console.error("Error fetching gifts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGiftPurchase = async (giftId: number, purchaserName: string) => {
    try {
      const { error } = await supabase
        .from("gifts")
        .update({
          is_purchased: true,
          purchased_by: purchaserName,
        })
        .eq("id", giftId)

      if (error) throw error

      // Update local state
      setGifts(
        gifts.map((gift) => (gift.id === giftId ? { ...gift, is_purchased: true, purchased_by: purchaserName } : gift)),
      )
    } catch (error) {
      console.error("Error updating gift:", error)
    }
  }

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

      {/* Os pontinhos de navegação foram removidos daqui. */}

      <section id="opening" className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
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
        className="min-h-screen flex items-center justify-center px-4 py-20 bg-white/50 relative z-10"
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
                <div className="flex items-center justify-center gap-4 text-[#DAA520] text-2xl mt-8">
                  <Gift />
                  <span className="font-serif">Presentes são bem-vindos, mas sua presença é o maior presente!</span>
                  <Gift />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="gifts" className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif text-[#3CB371] mb-8">Lista de Presentes</h2>
          <p className="text-xl text-[#2d5a3d] mb-8">Algumas sugestões para o nosso pequeno Lucca</p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-[#3CB371]" size={48} />
              <span className="ml-4 text-[#2d5a3d]">Carregando presentes...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map((gift) => (
                <GiftCard key={gift.id} gift={gift} onPurchase={handleGiftPurchase} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="rsvp" className="min-h-screen flex items-center justify-center px-4 py-20 bg-white/50 relative z-10">
        <RSVPForm />
      </section>

      <section id="messages" className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
        <MessagesWall />
      </section>

      <section
        id="location"
        className="min-h-screen flex items-center justify-center px-4 py-20 bg-white/50 relative z-10"
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

      <section id="closing" className="min-h-screen flex items-center justify-center px-4 py-20 relative z-10">
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