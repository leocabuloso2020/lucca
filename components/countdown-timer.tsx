"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface CountdownTimerProps {
  targetDateTime: string // Expected format: "YYYY-MM-DDTHH:MM:SS"
}

export function CountdownTimer({ targetDateTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date(targetDateTime).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDateTime])

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-[#3CB371]/30 shadow-lg">
      <CardContent className="p-6">
        <h3 className="font-serif text-2xl text-[#3CB371] text-center mb-4">Contagem Regressiva</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-[#f0f8f0] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#2d5a3d]">{timeLeft.days}</div>
            <div className="text-sm text-[#3CB371]">Dias</div>
          </div>
          <div className="bg-[#f0f8f0] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#2d5a3d]">{timeLeft.hours}</div>
            <div className="text-sm text-[#3CB371]">Horas</div>
          </div>
          <div className="bg-[#f0f8f0] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#2d5a3d]">{timeLeft.minutes}</div>
            <div className="text-sm text-[#3CB371]">Min</div>
          </div>
          <div className="bg-[#f0f8f0] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#2d5a3d]">{timeLeft.seconds}</div>
            <div className="text-sm text-[#3CB371]">Seg</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}