"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3

      const audio = audioRef.current

      const handleCanPlay = () => {
        setIsLoading(false)
        setHasError(false)
      }

      const handleError = () => {
        setIsLoading(false)
        setHasError(true)
        setIsPlaying(false)
        console.log("[v0] Audio failed to load")
      }

      const handleLoadStart = () => {
        setIsLoading(true)
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
    if (audioRef.current && !hasError) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          setIsLoading(true)
          await audioRef.current.play()
          setIsPlaying(true)
          setIsLoading(false)
          console.log("[v0] Music started playing")
        }
      } catch (error) {
        console.log("[v0] Autoplay prevented or audio error:", error)
        setIsLoading(false)
        setHasError(true)
        setIsPlaying(false)
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Button
        onClick={togglePlay}
        disabled={isLoading || hasError}
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
        disabled={hasError}
        className="bg-[#3CB371] hover:bg-[#2d5a3d] text-white rounded-full w-12 h-12 shadow-lg disabled:opacity-50"
        size="sm"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Button>
      <audio ref={audioRef} loop preload="metadata" onEnded={() => setIsPlaying(false)}>
        <source src="/lucca-baby-music.mp3" type="audio/mpeg" />
        <source src="/lucca-baby-music.wav" type="audio/wav" />
        {/* Fallback sources if custom music is not available */}
        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
        <source src="https://actions.google.com/sounds/v1/ambiences/lullaby.ogg" type="audio/ogg" />
      </audio>
      {hasError && (
        <div className="absolute top-14 right-0 bg-red-100 text-red-800 text-xs px-2 py-1 rounded shadow-lg">
          Áudio indisponível
        </div>
      )}
    </div>
  )
}
