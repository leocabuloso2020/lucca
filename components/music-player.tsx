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
    <div className="fixed top-0 left-0 w-full bg-[#3CB371] text-white p-2 z-50 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm md:text-base font-medium">Ouça a trilha do Lucca - Aperte o play</span>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={togglePlay}
          disabled={isLoading || isAudioUnavailable}
          className="bg-white text-[#3CB371] hover:bg-gray-100 rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-md disabled:opacity-50"
          size="sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-[#3CB371] border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
        </Button>
        <Button
          onClick={toggleMute}
          disabled={isAudioUnavailable}
          className="bg-white text-[#3CB371] hover:bg-gray-100 rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-md disabled:opacity-50"
          size="sm"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
      </div>
      <audio ref={audioRef} preload="metadata" onEnded={() => setIsPlaying(false)} loop={false}>
        <source src="/pvc.mp3" type="audio/mpeg" />
      </audio>
      {(isAudioUnavailable || isAutoplayBlocked) && (
        <div className="absolute bottom-[-25px] left-1/2 -translate-x-1/2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
          {isAudioUnavailable ? "Áudio indisponível" : "Reprodução automática bloqueada"}
        </div>
      )}
    </div>
  )
}