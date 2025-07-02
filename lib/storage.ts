// Enhanced storage system for production
export interface StorageData {
  [key: string]: any
}

class ProductionStorage {
  private static instance: ProductionStorage
  private cache: Map<string, any> = new Map()
  private syncQueue: Array<{ key: string; value: any }> = []
  private isOnline = true

  static getInstance(): ProductionStorage {
    if (!ProductionStorage.instance) {
      ProductionStorage.instance = new ProductionStorage()
    }
    return ProductionStorage.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      // Listen for online/offline events
      window.addEventListener("online", () => {
        this.isOnline = true
        this.processSyncQueue()
      })

      window.addEventListener("offline", () => {
        this.isOnline = false
      })

      // Auto-sync every 30 seconds when online
      setInterval(() => {
        if (this.isOnline && this.syncQueue.length > 0) {
          this.processSyncQueue()
        }
      }, 30000)
    }
  }

  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)

      // Store in localStorage immediately
      if (typeof window !== "undefined") {
        localStorage.setItem(key, serializedValue)
        this.cache.set(key, value)
      }

      // Add to sync queue for potential cloud sync
      this.syncQueue.push({ key, value })

      // Trigger immediate sync if online
      if (this.isOnline) {
        this.processSyncQueue()
      }

      console.log(`✅ Stored ${key} successfully`)
    } catch (error) {
      console.error(`❌ Failed to store ${key}:`, error)
    }
  }

  getItem(key: string): any {
    try {
      // Check cache first
      if (this.cache.has(key)) {
        return this.cache.get(key)
      }

      // Fallback to localStorage
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key)
        if (item) {
          const parsed = JSON.parse(item)
          this.cache.set(key, parsed)
          return parsed
        }
      }

      return null
    } catch (error) {
      console.error(`❌ Failed to retrieve ${key}:`, error)
      return null
    }
  }

  removeItem(key: string): void {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key)
        this.cache.delete(key)
      }
      console.log(`✅ Removed ${key} successfully`)
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error)
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (this.syncQueue.length === 0) return

    try {
      // In a real production app, you'd sync with a backend here
      // For now, we'll just clear the queue since localStorage is our source of truth
      console.log(`🔄 Processing ${this.syncQueue.length} sync items`)
      this.syncQueue = []
    } catch (error) {
      console.error("❌ Sync failed:", error)
    }
  }

  // Export all data for backup
  exportData(): StorageData {
    const data: StorageData = {}

    if (typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          try {
            data[key] = JSON.parse(localStorage.getItem(key) || "null")
          } catch {
            data[key] = localStorage.getItem(key)
          }
        }
      }
    }

    return data
  }

  // Import data from backup
  importData(data: StorageData): void {
    Object.entries(data).forEach(([key, value]) => {
      this.setItem(key, value)
    })
  }
}

export const storage = ProductionStorage.getInstance()

// Convenience functions
export const setStorageItem = (key: string, value: any) => storage.setItem(key, value)
export const getStorageItem = (key: string) => storage.getItem(key)
export const removeStorageItem = (key: string) => storage.removeItem(key)
export const exportStorageData = () => storage.exportData()
export const importStorageData = (data: StorageData) => storage.importData(data)
