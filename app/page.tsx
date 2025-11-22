"use client"

import { useState, useEffect, useCallback } from "react"
import DrawingCanvas from "@/components/drawing-canvas"
import GardenDisplay from "@/components/garden-display"
import NamePrompt from "@/components/name-prompt"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export default function Home() {
  const [selectedColor, setSelectedColor] = useState("#EF4444")
  const [plantedDrawings, setPlantedDrawings] = useState<
    Array<{
      id: string
      imageData: string
      x: number
      y: number
      color: string
      userName: string
    }>
  >([])

  const [userName, setUserName] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const initializeGarden = async () => {
      try {
        const storedName = localStorage.getItem("gardenUserName")
        const storedUserId = localStorage.getItem("gardenUserId")

        if (storedName && storedUserId) {
          setUserName(storedName)
          setUserId(storedUserId)
          await loadFlowers(storedUserId)
          subscribeToFlowers()
        }
      } catch (error) {
        console.error("[v0] Error initializing garden:", error)
      }
    }

    initializeGarden()
  }, [supabase])

  const loadFlowers = useCallback(
    async (uid: string) => {
      try {
        const { data, error } = await supabase
          .from("planted_flowers")
          .select("id, drawing_data, x, y, color, users(name)")
          .order("created_at", { ascending: true })

        if (error) throw error

        const flowers =
          data?.map((flower: any) => ({
            id: flower.id,
            imageData: flower.drawing_data,
            x: flower.x,
            y: flower.y,
            color: flower.color,
            userName: flower.users?.name || "Unknown",
          })) || []

        setPlantedDrawings(flowers)
      } catch (error) {
        console.error("[v0] Error loading flowers:", error)
      }
    },
    [supabase],
  )

  const subscribeToFlowers = useCallback(() => {
    try {
      const newChannel = supabase
        .channel("planted_flowers")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "planted_flowers" }, (payload: any) => {
          const newFlower = {
            id: payload.new.id,
            imageData: payload.new.drawing_data,
            x: payload.new.x,
            y: payload.new.y,
            color: payload.new.color,
            userName: payload.new.user_name || "Unknown",
          }
          setPlantedDrawings((prev) => [...prev, newFlower])
        })
        .subscribe()

      setChannel(newChannel)
    } catch (error) {
      console.error("[v0] Error subscribing to flowers:", error)
    }
  }, [supabase])

  const handleNameSubmit = async (name: string) => {
    try {
      const { data, error } = await supabase.from("users").insert({ name }).select().single()

      if (error) throw error

      const newUserId = data.id
      setUserName(name)
      setUserId(newUserId)
      localStorage.setItem("gardenUserName", name)
      localStorage.setItem("gardenUserId", newUserId)

      await loadFlowers(newUserId)
      subscribeToFlowers()
    } catch (error) {
      console.error("[v0] Error creating user:", error)
    }
  }

  const handlePlantAtPosition = async (drawingData: string, x: number, y: number) => {
    if (!userId) return

    try {
      const { error } = await supabase.from("planted_flowers").insert({
        user_id: userId,
        drawing_data: drawingData,
        x,
        y,
        color: selectedColor,
      })

      if (error) throw error

      const newFlower = {
        id: Date.now().toString(), // Temporary ID until refresh
        imageData: drawingData,
        x,
        y,
        color: selectedColor,
        userName: userName || "Me",
      }

      setPlantedDrawings((prev) => [...prev, newFlower])
    } catch (error) {
      console.error("[v0] Error planting flower:", error)
    }
  }

  const handlePlantDrawing = (imageData: string, color: string) => {
    // Generate random position between 10% and 90%
    const x = Math.floor(Math.random() * 80) + 10
    const y = Math.floor(Math.random() * 80) + 10

    handlePlantAtPosition(imageData, x, y)
  }

  if (!userName) {
    return <NamePrompt onSubmit={handleNameSubmit} />
  }

  const flowerColors = [
    { name: "red", value: "#EF4444" },
    { name: "orange", value: "#F97316" },
    { name: "yellow", value: "#FBBF24" },
    { name: "pink", value: "#F472B6" },
    { name: "green", value: "#15803d" },
  ]

  return (
    <main className="min-h-screen flex flex-col p-8 relative">
      <div className="absolute top-8 left-8 z-20">
        <img src="/images/ais.png" alt="AIS Logo" className="h-12 w-auto" />
      </div>

      <h1
        className="text-5xl font-bold text-center mb-4"
        style={{ letterSpacing: "0.08em", color: "#98CA7A" }}
      >
        AIS SECRET GARDEN
      </h1>
      <p className="text-center text-slate-500 mb-16">
        Welcome, {userName}!
      </p>

      <div className="flex gap-20 items-start justify-center flex-1 max-w-full mx-auto relative z-10">
        <div className="flex-shrink-0">
          <GardenDisplay
            plantedDrawings={plantedDrawings}
          />

        </div>

        <div className="flex flex-col items-center gap-8 w-96">
          <h2
            className="text-center"
            style={{
              fontSize: "16px",
              color: "#64748b",
              letterSpacing: "0.1em",
            }}
          >
            ADD FLOWERS TO OUR GARDEN?
          </h2>

          <DrawingCanvas selectedColor={selectedColor} onPlant={handlePlantDrawing} />

          <div className="flex gap-4 justify-center">
            {flowerColors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.value)}
                className={`w-14 h-14 rounded-full transition-all transform ${selectedColor === color.value
                  ? "ring-4 ring-slate-400 ring-offset-2 scale-110 shadow-lg"
                  : "ring-3 ring-slate-200 hover:ring-slate-300"
                  }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>

          <a
            href="/gallery"
            className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-colors"
          >
            See Flower Gallery
          </a>
        </div>
      </div>

      <div className="text-center mt-8 text-slate-600" style={{ letterSpacing: "0.08em", color: "#98CA7A" }}>
        <p>{plantedDrawings.length} flowers in the garden</p>
      </div>
    </main>
  )
}
