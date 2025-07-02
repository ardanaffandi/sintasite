export const handleFileUpload = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const result = await response.json()
    return result.url
  } catch (error) {
    console.error("Upload error:", error)
    throw new Error("Failed to upload file")
  }
}

export const validateImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP)")
    return false
  }

  if (file.size > maxSize) {
    alert("File size must be less than 5MB")
    return false
  }

  return true
}

export interface FileUploadResult {
  success: boolean
  url?: string
  error?: string
}

export class FileManager {
  private static instance: FileManager
  private uploadedFiles: Map<string, string> = new Map()

  private constructor() {
    this.loadUploadedFiles()
  }

  static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager()
    }
    return FileManager.instance
  }

  private loadUploadedFiles(): void {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem("uploaded-files")
      if (stored) {
        const files = JSON.parse(stored)
        this.uploadedFiles = new Map(Object.entries(files))
      }
    } catch (error) {
      console.error("Error loading uploaded files:", error)
    }
  }

  private saveUploadedFiles(): void {
    if (typeof window === "undefined") return

    try {
      const filesObject = Object.fromEntries(this.uploadedFiles)
      localStorage.setItem("uploaded-files", JSON.stringify(filesObject))
    } catch (error) {
      console.error("Error saving uploaded files:", error)
    }
  }

  async uploadFile(file: File): Promise<FileUploadResult> {
    try {
      if (!validateImageFile(file)) {
        return { success: false, error: "Invalid file type or size" }
      }

      const url = await handleFileUpload(file)
      const fileId = this.generateFileId(file)

      this.uploadedFiles.set(fileId, url)
      this.saveUploadedFiles()

      return {
        success: true,
        url: url,
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      return {
        success: false,
        error: "Failed to upload file",
      }
    }
  }

  private generateFileId(file: File): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2)
    const extension = file.name.split(".").pop() || ""
    return `${timestamp}-${random}.${extension}`
  }

  getFileUrl(fileId: string): string | null {
    return this.uploadedFiles.get(fileId) || null
  }

  deleteFile(fileId: string): boolean {
    const deleted = this.uploadedFiles.delete(fileId)
    if (deleted) {
      this.saveUploadedFiles()
    }
    return deleted
  }

  getAllFiles(): Array<{ id: string; url: string }> {
    return Array.from(this.uploadedFiles.entries()).map(([id, url]) => ({
      id,
      url,
    }))
  }

  clearAllFiles(): void {
    this.uploadedFiles.clear()
    this.saveUploadedFiles()
  }
}

export const fileManager = FileManager.getInstance()

export const generatePlaceholderImage = (width: number, height: number, text?: string): string => {
  if (typeof window === "undefined") return `/placeholder.svg?height=${height}&width=${width}`

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  if (!ctx) return `/placeholder.svg?height=${height}&width=${width}`

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#667eea")
  gradient.addColorStop(1, "#764ba2")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = "white"
  ctx.font = "bold 16px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  const displayText = text || `${width} × ${height}`
  ctx.fillText(displayText, width / 2, height / 2)

  return canvas.toDataURL()
}

export const createAvatarPlaceholder = (name: string, size = 200): string => {
  if (typeof window === "undefined") return `/placeholder.svg?height=${size}&width=${size}`

  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) return `/placeholder.svg?height=${size}&width=${size}`

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, "#3b82f6")
  gradient.addColorStop(1, "#1d4ed8")

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
  ctx.fill()

  ctx.fillStyle = "white"
  ctx.font = `bold ${size / 4}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  ctx.fillText(initials, size / 2, size / 2)

  return canvas.toDataURL()
}
