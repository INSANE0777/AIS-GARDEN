"use client"

import type React from "react"

import { useRef, useState } from "react"

interface DrawingCanvasProps {
  selectedColor: string
  onPlant: (imageData: string, color: string) => void
}

export default function DrawingCanvas({ selectedColor, onPlant }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = selectedColor
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handlePlant = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.toDataURL()
    onPlant(imageData, selectedColor)

    // Clear canvas
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Drawing Canvas */}
      <div className="border-4 border-dashed border-slate-400 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white cursor-crosshair block"
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleClear}
          className="px-6 py-2 border-2 border-slate-400 text-slate-600 font-semibold rounded-full hover:bg-slate-50 transition-colors text-sm"
          style={{ fontFamily: "Georgia, serif" }}
        >
          CLEAR
        </button>

        <button
          onClick={handlePlant}
          className="px-8 py-3 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-full hover:bg-emerald-50 transition-colors flex items-center gap-2"
          style={{ fontFamily: "Georgia, serif", letterSpacing: "0.05em" }}
        >
          <span>🌱</span>
          <span>PLANT</span>
        </button>
      </div>
    </div>
  )
}
