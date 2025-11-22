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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)
    setErrorMessage(null) // Clear error when starting to draw
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

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Validation: Check if enough pixels are drawn
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    let coloredPixels = 0

    // Loop through pixels (RGBA)
    for (let i = 0; i < data.length; i += 4) {
      // Check alpha channel (index 3)
      if (data[i + 3] > 0) {
        coloredPixels++
      }
    }

    // Threshold: at least 50 pixels must be drawn
    if (coloredPixels < 50) {
      setErrorMessage("This is not a flower")
      return
    }

    const dataUrl = canvas.toDataURL()
    onPlant(dataUrl, selectedColor)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setErrorMessage(null)
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    setErrorMessage(null)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Drawing Canvas */}
      <div className="relative">
        <div className={`border-4 border-dashed rounded-xl overflow-hidden ${errorMessage ? "border-red-400" : "border-slate-400"}`}>
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
        {errorMessage && (
          <div className="absolute -bottom-8 left-0 right-0 text-center text-red-500 font-bold text-sm animate-bounce">
            {errorMessage}
          </div>
        )}
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
