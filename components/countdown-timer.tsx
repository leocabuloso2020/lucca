"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface CountdownTimerProps {
  targetDateTime: string
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
    <Card className="bg-white/90 backdrop-blur-sm border-[#c1a892]/30 shadow-lg">
      <CardContent className="p-6">
        <h3 className="font-serif text-3xl text-[#7a5a43] text-center mb-4">Contagem Regressiva</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-[#f2ebdd] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#7a5a43]">{timeLeft.days}</div>
            <div className="text-sm text-[#c1a892]">Dias</div>
          </div>
          <div className="bg-[#f2ebdd] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#7a5a43]">{timeLeft.hours}</div>
            <div className="text-sm text-[#c1a892]">Horas</div>
          </div>
          <div className="bg-[#f2ebdd] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#7a5a43]">{timeLeft.minutes}</div>
            <div className="text-sm text-[#c1a892]">Min</div>
          </div>
          <div className="bg-[#f2ebdd] rounded-lg p-3">
            <div className="text-2xl font-bold text-[#7a5a43]">{timeLeft.seconds}</div>
            <div className="text-sm text-[#c1a892]">Seg</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}