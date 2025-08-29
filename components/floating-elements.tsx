"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [elements, setElements] = useState<Array<{ id: number; emoji: string; x: number; y: number; delay: number }>>(
    [],
  )

  useEffect(() => {
    const emojis = ["☁️", "🎈", "👶", "💚", "🍼", "🧸", "⭐", "🌙"]
    const newElements = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }))
    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute text-2xl md:text-4xl animate-float opacity-60"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}s`,
          }}
        >
          {element.emoji}
        </div>
      ))}
    </div>
  )
}
