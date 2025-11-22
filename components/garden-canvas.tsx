"use client"

import type React from "react"
import { useRef } from "react"

interface Flower {
  x: number
  y: number
  color: string
}

interface GardenCanvasProps {
  flowers: Flower[]
  onPlant: (x: number, y: number) => void
  isPlanting: boolean
}

const flowerShapes: Record<string, string> = {
  red: "🌹",
  orange: "🧡",
  yellow: "🌼",
  pink: "🌷",
  green: "🌿",
}

export default function GardenCanvas({ flowers, onPlant, isPlanting }: GardenCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlanting || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

    if (distance < 200) {
      onPlant(x, y)
    }
  }

  return (
    <div>
      <div
        ref={containerRef}
        onClick={handleClick}
        className={`relative w-96 h-96 flex items-center justify-center transition-all ${
          isPlanting ? "cursor-crosshair" : "cursor-pointer"
        }`}
        style={{
          filter: isPlanting
            ? "drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))"
            : "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))",
        }}
      >
        <img
          src="/images/island.png"
          alt="Garden Island"
          className="w-full h-full object-contain"
          style={{ filter: isPlanting ? "brightness(1.05)" : "brightness(1)" }}
        />

        {/* Flowers layer */}
        <div className="absolute inset-0 pointer-events-none">
          {flowers.map((flower, idx) => (
            <div
              key={idx}
              className="absolute text-5xl animate-bounce"
              style={{
                left: `${flower.x}px`,
                top: `${flower.y}px`,
                transform: "translate(-50%, -50%)",
                animationDelay: `${idx * 0.1}s`,
              }}
            >
              {flowerShapes[flower.color] || "🌸"}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
