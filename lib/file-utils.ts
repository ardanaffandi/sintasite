import { storage } from "./storage"
import { cmsSync } from "./sync"

export interface SiteData {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    description: string
    image: string
  }
  contact: {
    phone: string
    email: string
    whatsapp: string
    social: {
      instagram: string
      facebook: string
      twitter: string
    }
  }
}

export function getSiteData(): SiteData {
  const defaultData: SiteData = {
    hero: {
      title: "Professional Brand Partnerships",
      subtitle: "Connecting Brands with Authentic Voices",
      description:
        "Transform your brand's reach through strategic partnerships and authentic endorsements that drive real results.",
    },
    about: {
      title: "About Our Partnership Program",
      description:
        "We specialize in creating meaningful connections between brands and their target audiences through authentic partnerships and strategic collaborations.",
      image: "/placeholder.svg?height=400&width=600",
    },
    contact: {
      phone: "+1 (555) 123-4567",
      email: "hello@brandpartnership.com",
      whatsapp: "+1234567890",
      social: {
        instagram: "https://instagram.com/brandpartnership",
        facebook: "https://facebook.com/brandpartnership",
        twitter: "https://twitter.com/brandpartnership",
      },
    },
  }

  const stored = storage.getItem("siteData")
  return stored || defaultData
}

export function saveSiteData(data: SiteData): void {
  storage.setItem("siteData", data)
  cmsSync.markChanged("siteData")
  console.log("✅ Site data saved and marked for sync")
}

export function validateImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP)")
    return false
  }

  if (file.size > maxSize) {
    alert("Image file size must be less than 5MB")
    return false
  }

  return true
}

export function handleFileUpload(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!validateImageFile(file)) {
      reject(new Error("Invalid file"))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const result = e.target?.result as string
      resolve(result)
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsDataURL(file)
  })
}

// Enhanced content management functions
export function saveContent(key: string, content: any): void {
  storage.setItem(key, content)
  cmsSync.markChanged(key)

  // Broadcast change to other tabs
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    const channel = new BroadcastChannel("content-update")
    channel.postMessage({ key, content, timestamp: Date.now() })
    channel.close()
  }

  console.log(`✅ Content saved: ${key}`)
}

export function getContent(key: string, defaultValue: any = null): any {
  return storage.getItem(key) || defaultValue
}

export function deleteContent(key: string): void {
  storage.removeItem(key)
  cmsSync.markChanged(key)
  console.log(`✅ Content deleted: ${key}`)
}

// Backup and restore functions
export function createBackup(): string {
  const data = storage.exportData()
  const backup = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    data,
  }
  return JSON.stringify(backup, null, 2)
}

export function restoreBackup(backupString: string): boolean {
  try {
    const backup = JSON.parse(backupString)
    if (backup.version && backup.data) {
      storage.importData(backup.data)
      console.log("✅ Backup restored successfully")
      return true
    }
    return false
  } catch (error) {
    console.error("❌ Failed to restore backup:", error)
    return false
  }
}
