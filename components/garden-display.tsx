"use client"

import type React from "react"
import { useState } from "react"

interface PlantedDrawing {
  id: string
  imageData: string
  x: number
  y: number
  color: string
  userName: string
}

interface GardenDisplayProps {
  plantedDrawings: PlantedDrawing[]
}

export default function GardenDisplay({ plantedDrawings }: GardenDisplayProps) {
  const [hoveredFlowerId, setHoveredFlowerId] = useState<string | null>(null)

  return (
    <div
      className="relative w-full h-[600px] flex items-center justify-center cursor-default"
      style={{
        filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15))",
        animation: "float 4s ease-in-out infinite",
      }}
    >
      <img src="/images/island.png" alt="Garden Island" className="w-full h-full object-contain" />

      <div className="absolute inset-0 pointer-events-none">
        {plantedDrawings.map((drawing) => (
          <div
            key={drawing.id}
            className={`absolute transition-all duration-200 group ${hoveredFlowerId === drawing.id ? "scale-125 z-10" : "scale-100"
              }`}
            style={{
              left: `${drawing.x}%`,
              top: `${drawing.y}%`,
              transform:
                hoveredFlowerId === drawing.id ? "translate(-50%, -50%) scale(1.25)" : "translate(-50%, -50%) scale(1)",
              width: "60px",
              height: "60px",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredFlowerId(drawing.id)}
            onMouseLeave={() => setHoveredFlowerId(null)}
          >
            <div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {drawing.userName}
            </div>
            <img
              src={drawing.imageData || "/placeholder.svg"}
              alt={`Planted flower by ${drawing.userName}`}
              className="w-full h-full object-contain"
              style={{ filter: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
