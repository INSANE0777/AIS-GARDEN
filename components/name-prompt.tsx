"use client"

import type React from "react"

import { useState } from "react"

interface NamePromptProps {
  onSubmit: (name: string) => void
}

export default function NamePrompt({ onSubmit }: NamePromptProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#FBF8F3] p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4 text-center" style={{ fontFamily: "Georgia, serif" }}>
          Welcome to AI's Secret Garden
        </h2>
        <p className="text-slate-600 text-center mb-6" style={{ fontFamily: "Georgia, serif" }}>
          What's your name?
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
            style={{ fontFamily: "Georgia, serif" }}
            autoFocus
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition-colors"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Start Planting
          </button>
        </form>
      </div>
    </div>
  )
}
