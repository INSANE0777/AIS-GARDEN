"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function GalleryPage() {
  const [flowers, setFlowers] = useState<
    Array<{
      id: string
      imageData: string
      x: number
      y: number
      color: string
      userName: string
      createdAt: string
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const loadFlowers = async () => {
      try {
        const { data, error } = await supabase
          .from("planted_flowers")
          .select("id, drawing_data, x, y, color, users(name), created_at")
          .order("created_at", { ascending: false })

        if (error) throw error

        const flowersList =
          data?.map((flower: any) => ({
            id: flower.id,
            imageData: flower.drawing_data,
            x: flower.x,
            y: flower.y,
            color: flower.color,
            userName: flower.users?.name || "Anonymous",
            createdAt: new Date(flower.created_at).toLocaleDateString(),
          })) || []

        setFlowers(flowersList)
      } catch (error) {
        console.error("[v0] Error loading gallery:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFlowers()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF8F3] flex items-center justify-center">
        <p style={{ fontFamily: "Georgia, serif", fontSize: "18px" }}>Loading gallery...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FBF8F3] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1
            className="text-5xl font-bold text-emerald-700"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "0.08em" }}
          >
            FLOWER GALLERY
          </h1>
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Back to Garden
          </Link>
        </div>

        {flowers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-xl" style={{ fontFamily: "Georgia, serif" }}>
              No flowers planted yet. Start drawing and planting!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flowers.map((flower) => (
              <div
                key={flower.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 h-48 flex items-center justify-center p-4">
                  <img
                    src={flower.imageData || "/placeholder.svg"}
                    alt="Drawn flower"
                    className="max-w-full max-h-full"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-emerald-700" style={{ fontFamily: "Georgia, serif" }}>
                    {flower.userName}
                  </p>
                  <p className="text-sm text-slate-600" style={{ fontFamily: "Georgia, serif" }}>
                    {flower.createdAt}
                  </p>
                  <div className="mt-3 w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: flower.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
