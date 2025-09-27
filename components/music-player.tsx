"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { toast } from "sonner" // Import Sonner for notifications

// Use uma variável de ambiente para a URL da música
const MUSIC_URL = process.env.NEXT_PUBLIC_MUSIC_URL || "/pvc.mp3"; // Fallback para o caminho local se a variável não estiver definida

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAudioUnavailable, setIsAudioUnavailable] = useState(false) // Para erros reais do arquivo de áudio
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false) // Para bloqueio de autoplay do navegador
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    console.log("[MusicPlayer] Initializing with MUSIC_URL:", MUSIC_URL); // Adicionado para depuração
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.loop = false; // Explicitamente garantindo que não haja loop

      const audio = audioRef.current;
      let loadingTimeout: NodeJS.Timeout; // Variável para o timeout

      const handleCanPlay = () => {
        console.log("[MusicPlayer] Audio can play. Setting isLoading to false.");
        clearTimeout(loadingTimeout); // Limpa o timeout em caso de sucesso
        setIsLoading(false);
        setIsAudioUnavailable(false);
        setIsAutoplayBlocked(false);
      };

      const handleError = () => {
        console.error("[MusicPlayer] Audio failed to load or play. Setting isAudioUnavailable to true.");
        clearTimeout(loadingTimeout); // Limpa o timeout em caso de erro
        setIsLoading(false);
        setIsAudioUnavailable(true); // Este é um erro real de carregamento
        setIsPlaying(false); // Garante que o estado de reprodução seja falso em caso de erro
        toast.error("Erro ao carregar a música. Verifique o arquivo de áudio.")
      };

      const handleLoadStart = () => {
        console.log("[MusicPlayer] Audio load start. Setting isLoading to true.");
        setIsLoading(true);
        setIsAudioUnavailable(false); // Resetar erros em nova tentativa de carregamento
        setIsAutoplayBlocked(false);

        // Define um timeout para o carregamento (ex: 10 segundos)
        loadingTimeout = setTimeout(() => {
          console.warn("[MusicPlayer] Audio loading timed out. Assuming audio is unavailable.");
          setIsLoading(false);
          setIsAudioUnavailable(true);
          setIsPlaying(false);
          toast.error("A música demorou muito para carregar ou está indisponível.");
        }, 10000); // 10 segundos
      };

      const handleEnded = () => {
        console.log("[MusicPlayer] Audio ended. Setting isPlaying to false.");
        setIsPlaying(false); // Garante que o estado seja atualizado quando a música termina
      };

      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("error", handleError);
      audio.addEventListener("loadstart", handleLoadStart);
      audio.addEventListener("ended", handleEnded); // Adiciona listener para o evento 'ended'

      return () => {
        clearTimeout(loadingTimeout); // Limpa o timeout ao desmontar o componente
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("loadstart", handleLoadStart);
        audio.removeEventListener("ended", handleEnded); // Limpa o listener
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
      setIsPlaying(false) // Garante que isPlaying seja falso enquanto tenta carregar/tocar
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
        setIsPlaying(false) // Garante que isPlaying seja falso em caso de erro
        
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
      {/* Empty div to push the text to center */}
      <div className="flex-1 hidden md:block"></div> 
      
      <div className="flex-1 flex items-center justify-center">
        <span className="text-sm md:text-base font-light">Ouça a trilha do Lucca - Aperte o play</span>
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
      <audio ref={audioRef} preload="none"> {/* Changed preload to 'none' for efficiency */}
        <source src={MUSIC_URL} type="audio/mpeg" />
      </audio>
      {(isAudioUnavailable || isAutoplayBlocked) && (
        <div className="absolute bottom-[-25px] left-1/2 -translate-x-1/2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
          {isAudioUnavailable ? "Áudio indisponível" : "Reprodução automática bloqueada"}
        </div>
      )}
    </div>
  )
}