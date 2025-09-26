"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { toast } from "sonner" // Import Sonner for notifications

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAudioUnavailable, setIsAudioUnavailable] = useState(false) // Para erros reais do arquivo de áudio
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false) // Para bloqueio de autoplay do navegador
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3

      const audio = audioRef.current

      const handleCanPlay = () => {
        setIsLoading(false)
        setIsAudioUnavailable(false)
        setIsAutoplayBlocked(false) // Resetar se puder tocar
      }

      const handleError = () => {
        setIsLoading(false)
        setIsAudioUnavailable(true) // Este é um erro real de carregamento
        setIsPlaying(false)
        toast.error("Erro ao carregar a música. Verifique o arquivo de áudio.")
        console.error("[MusicPlayer] Audio failed to load or play.")
      }

      const handleLoadStart = () => {
        setIsLoading(true)
        setIsAudioUnavailable(false) // Resetar erros em nova tentativa de carregamento
        setIsAutoplayBlocked(false)
      }

      audio.addEventListener("canplay", handleCanPlay)
      audio.addEventListener("error", handleError)
      audio.addEventListener("loadstart", handleLoadStart)

      return () => {
        audio.removeEventListener("canplay", handleCanPlay)
        audio.removeEventListener("error", handleError)
        audio.removeEventListener("loadstart", handleLoadStart)
      }
    }
  }, [])

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      toast.info("Música pausada.")
    } else {
      // Se o áudio estiver indisponível devido a um erro de carregamento, não tente tocar
      if (isAudioUnavailable) {
        toast.error("A música não está disponível devido a um erro de carregamento.");
        return;
      }

      setIsLoading(true)
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setIsLoading(false)
        setIsAutoplayBlocked(false) // Tocou com sucesso, então o autoplay não está mais bloqueado
        toast.success("Música tocando!")
        console.log("[MusicPlayer] Music started playing")
      } catch (error) {
        console.error("[MusicPlayer] Autoplay prevented or audio error:", error)
        setIsLoading(false)
        setIsPlaying(false)
        
        if ((error as DOMException)?.name === "NotAllowedError") {
          setIsAutoplayBlocked(true); // Autoplay foi bloqueado, mas o botão deve continuar clicável para reprodução manual
          toast.error("O navegador bloqueou a reprodução automática. Por favor, clique no botão para tocar a música.");
        } else {
          setIsAudioUnavailable(true); // Outros erros são erros reais de carregamento/reprodução
          toast.error("Erro ao iniciar a música. Verifique o arquivo de áudio.");
        }
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      toast.info(`Música ${!isMuted ? "silenciada" : "ativada"}.`)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Button
        onClick={togglePlay}
        // O botão deve ser desabilitado apenas se estiver carregando ou se houver um erro *de carregamento*.
        // Se o autoplay estiver bloqueado, o usuário ainda deve poder clicar nele.
        disabled={isLoading || isAudioUnavailable}
        className="bg-[#3CB371] hover:bg-[#2d5a3d] text-white rounded-full w-12 h-12 shadow-lg disabled:opacity-50"
        size="sm"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={20} />
        ) : (
          <Play size={20} />
        )}
      </Button>
      <Button
        onClick={toggleMute}
        disabled={isAudioUnavailable} // O botão de mudo também deve ser desabilitado se houver um erro de carregamento
        className="bg-[#3CB371] hover:bg-[#2d5a3d] text-white rounded-full w-12 h-12 shadow-lg disabled:opacity-50"
        size="sm"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Button>
      <audio ref={audioRef} preload="metadata" onEnded={() => setIsPlaying(false)} loop={false}>
        <source src="/pvc.mp3" type="audio/mpeg" />
      </audio>
      {(isAudioUnavailable || isAutoplayBlocked) && ( // Mostrar mensagem de erro para ambos os tipos de erros
        <div className="absolute top-14 right-0 bg-red-100 text-red-800 text-xs px-2 py-1 rounded shadow-lg">
          {isAudioUnavailable ? "Áudio indisponível" : "Reprodução automática bloqueada"}
        </div>
      )}
    </div>
  )
}