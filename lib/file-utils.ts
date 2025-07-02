// File handling utilities for the CMS
/* ------------------------------------------------------------------ */
/*  Simple helpers used throughout the CMS (keep them in one place)   */
/* ------------------------------------------------------------------ */

import { randomUUID } from "crypto"
import path from "path"
import { mkdir, stat, writeFile } from "fs/promises"
import type { File } from "formdata-node"

/**
 * Validate that the file is an acceptable image and below 5 MB.
 */
export function validateImageFileType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
  const maxSize = 5 * 1024 * 1024 // 5 MB

  if (!validTypes.includes(file.type)) {
    alert("Please upload a valid image file (JPEG, PNG, GIF, WebP or SVG).")
    return false
  }

  return true
}

export function validateImageFileSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024 // 5 MB

  if (file.size > maxSize) {
    alert("Image size must be less than 5 MB.")
    return false
  }

  return true
}

export async function handleFileUploadClient(file: File): Promise<string> {
  if (!validateImageFileType(file) || !validateImageFileSize(file)) {
    throw new Error("Invalid image file")
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

/**
 * Validate an image (type + size).
 * Re-exported for backwards compatibility.
 */
export const validateImageFile = (file: File): boolean => validateImageFileType(file) && validateImageFileSize(file)

/**
 * Read an accepted image and return a Base-64 data-URL.
 * Re-exported for backwards compatibility.
 */
export async function handleFileUpload(file: File): Promise<string> {
  return handleFileUploadClient(file)
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
      // Validate file
      const validationType = this.validateFileType(file)
      const validationSize = this.validateFileSize(file)
      if (!validationType || !validationSize) {
        return { success: false, error: "Invalid file type or size" }
      }

      // Convert to base64 for local storage
      const base64 = await this.fileToBase64(file)
      const fileId = this.generateFileId(file)
      const dataUrl = `data:${file.type};base64,${base64}`

      // Store in memory and localStorage
      this.uploadedFiles.set(fileId, dataUrl)
      this.saveUploadedFiles()

      return {
        success: true,
        url: dataUrl,
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      return {
        success: false,
        error: "Failed to upload file",
      }
    }
  }

  private validateFileType(file: File): boolean {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"]

    if (!allowedTypes.includes(file.type)) {
      return false
    }

    return true
  }

  private validateFileSize(file: File): boolean {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return false
    }

    return true
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(",")[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
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

// Generate placeholder images with proper graphics
export const generatePlaceholderImage = (width: number, height: number, text?: string): string => {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  if (!ctx) return `/placeholder.png?height=${height}&width=${width}`

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#667eea")
  gradient.addColorStop(1, "#764ba2")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Add text
  ctx.fillStyle = "white"
  ctx.font = "bold 16px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  const displayText = text || `${width} × ${height}`
  ctx.fillText(displayText, width / 2, height / 2)

  return canvas.toDataURL()
}

// Create avatar placeholder
export const createAvatarPlaceholder = (name: string, size = 200): string => {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) return `/placeholder.png?height=${size}&width=${size}`

  // Create circular gradient
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, "#3b82f6")
  gradient.addColorStop(1, "#1d4ed8")

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
  ctx.fill()

  // Add initials
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

/**
 * Validate that an uploaded image is of an allowed type and size.
 *
 * @param mimeType - The image’s MIME type (`image/jpeg`, `image/png`, …)
 * @param sizeBytes - The file size in bytes
 * @param maxSizeMB - Maximum allowed size in megabytes (default = 5 MB)
 * @returns `true` if valid, otherwise `false`
 */
export function validateImageFileServer(mimeType: string, sizeBytes: number, maxSizeMB = 5): boolean {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
  const isTypeAllowed = allowedTypes.includes(mimeType)
  const isSizeAllowed = sizeBytes <= maxSizeMB * 1024 * 1024
  return isTypeAllowed && isSizeAllowed
}

/**
 * Store an uploaded file in `public/uploads` (or another folder)
 * and return its public URL + generated filename.
 *
 * @param buffer - The raw file buffer
 * @param mimeType - MIME type, used to pick the correct extension
 * @param folder - Relative folder inside `public` (default = `uploads`)
 */
export async function handleFileUploadServer(
  buffer: Buffer,
  mimeType: string,
  folder = "uploads",
): Promise<{ url: string; fileName: string }> {
  const ext =
    {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/svg+xml": ".svg",
    }[mimeType] || ""

  const fileName = `${randomUUID()}${ext}`
  const uploadDir = path.join(process.cwd(), "public", folder)

  // Ensure the upload directory exists
  try {
    await stat(uploadDir)
  } catch {
    await mkdir(uploadDir, { recursive: true })
  }

  const filePath = path.join(uploadDir, fileName)
  await writeFile(filePath, buffer)

  const url = `/${folder}/${fileName}`
  return { url, fileName }
}
