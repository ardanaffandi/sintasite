// Enhanced storage system for the CMS
export interface StorageData {
  [key: string]: any
}

class LocalStorage {
  private prefix = "endorsement-cms-"

  setItem(key: string, value: any): void {
    if (typeof window === "undefined") return

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(this.prefix + key, serialized)
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  getItem(key: string): any {
    if (typeof window === "undefined") return null

    try {
      const item = localStorage.getItem(this.prefix + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return null
    }
  }

  removeItem(key: string): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.prefix + key)
  }

  clear(): void {
    if (typeof window === "undefined") return

    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  getAllKeys(): string[] {
    if (typeof window === "undefined") return []

    const keys = Object.keys(localStorage)
    return keys.filter((key) => key.startsWith(this.prefix)).map((key) => key.replace(this.prefix, ""))
  }

  exportData(): StorageData {
    if (typeof window === "undefined") return {}

    const data: StorageData = {}
    const keys = this.getAllKeys()

    keys.forEach((key) => {
      data[key] = this.getItem(key)
    })

    return data
  }

  importData(data: StorageData): void {
    Object.entries(data).forEach(([key, value]) => {
      this.setItem(key, value)
    })
  }

  getSize(): number {
    if (typeof window === "undefined") return 0

    let size = 0
    const keys = this.getAllKeys()

    keys.forEach((key) => {
      const item = localStorage.getItem(this.prefix + key)
      if (item) {
        size += item.length
      }
    })

    return size
  }
}

export const storage = new LocalStorage()
export default storage
