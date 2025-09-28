"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { toast } from "sonner"

const MUSIC_URL = process.env.NEXT_PUBLIC_MUSIC_URL || "/pvc.mp3";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAudioUnavailable, setIsAudioUnavailable] = useState(false)
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.loop = false;

      const audio = audioRef.current;
      let loadingTimeout: NodeJS.Timeout;

      const handleCanPlay = () => {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
        setIsAudioUnavailable(false);
        setIsAutoplayBlocked(false);
      };

      const handleError = () => {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
        setIsAudioUnavailable(true);
        setIsPlaying(false);
        toast.error("Erro ao carregar a música. Verifique o arquivo de áudio.")
      };

      const handleLoadStart = () => {
        setIsLoading(true);
        setIsAudioUnavailable(false);
        setIsAutoplayBlocked(false);

        loadingTimeout = setTimeout(() => {
          setIsLoading(false);
          setIsAudioUnavailable(true);
          setIsPlaying(false);
          toast.error("A música demorou muito para carregar ou está indisponível.");
        }, 30000);
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("error", handleError);
      audio.addEventListener("loadstart", handleLoadStart);
      audio.addEventListener("ended", handleEnded);

      return () => {
        clearTimeout(loadingTimeout);
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("loadstart", handleLoadStart);
        audio.removeEventListener("ended", handleEnded);
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
      if (isAudioUnavailable) {
        toast.error("A música não está disponível devido a um erro de carregamento.");
        return;
      }

      setIsLoading(true)
      setIsPlaying(false)
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setIsLoading(false)
        setIsAutoplayBlocked(false)
        toast.success("Música tocando!")
      } catch (error) {
        setIsLoading(false)
        setIsPlaying(false)
        
        if ((error as DOMException)?.name === "NotAllowedError") {
          setIsAutoplayBlocked(true);
          toast.error("O navegador bloqueou a reprodução automática. Por favor, clique no botão para tocar a música.");
        } else {
          setIsAudioUnavailable(true);
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
    <div className="fixed top-0 left-0 w-full bg-[#7a5a43] text-white p-2 z-50 flex items-center justify-between shadow-lg">
      <div className="flex-1 hidden md:block"></div> 
      
      <div className="flex-1 flex items-center justify-center">
        <span className="text-sm md:text-base font-light">Ouça a trilha do Lucca - Aperte o play</span>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={togglePlay}
          disabled={isLoading || isAudioUnavailable}
          className="bg-white text-[#7a5a43] hover:bg-gray-100 rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-md disabled:opacity-50"
          size="sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-[#7a5a43] border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
        </Button>
        <Button
          onClick={toggleMute}
          disabled={isAudioUnavailable}
          className="bg-white text-[#7a5a43] hover:bg-gray-100 rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-md disabled:opacity-50"
          size="sm"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
      </div>
      <audio ref={audioRef} preload="metadata">
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