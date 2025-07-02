import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    const extension = file.name.split(".").pop() || "jpg"
    const filename = `uploads/${timestamp}-${random}.${extension}`

    try {
      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
      })

      return NextResponse.json({
        success: true,
        url: blob.url,
        filename: filename,
      })
    } catch (blobError) {
      console.log("Blob storage not available, using base64 fallback")

      // Fallback to base64 if Vercel Blob is not configured
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString("base64")
      const dataUrl = `data:${file.type};base64,${base64}`

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: filename,
      })
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
