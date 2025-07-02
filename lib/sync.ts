// Real-time sync system for CMS changes
export class CMSSync {
  private static instance: CMSSync
  private syncInterval: NodeJS.Timeout | null = null
  private lastSyncTime = 0
  private pendingChanges: Set<string> = new Set()

  static getInstance(): CMSSync {
    if (!CMSSync.instance) {
      CMSSync.instance = new CMSSync()
    }
    return CMSSync.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      // Start sync when page loads
      this.startSync()

      // Sync when page becomes visible
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          this.syncNow()
        }
      })

      // Sync before page unloads
      window.addEventListener("beforeunload", () => {
        this.syncNow()
      })
    }
  }

  startSync(): void {
    if (this.syncInterval) return

    // Sync every 10 seconds
    this.syncInterval = setInterval(() => {
      this.syncNow()
    }, 10000)

    console.log("🔄 CMS sync started")
  }

  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
      console.log("⏹️ CMS sync stopped")
    }
  }

  markChanged(key: string): void {
    this.pendingChanges.add(key)
    console.log(`📝 Marked ${key} as changed`)
  }

  async syncNow(): Promise<void> {
    if (this.pendingChanges.size === 0) return

    try {
      const changes = Array.from(this.pendingChanges)
      console.log(`🔄 Syncing ${changes.length} changes...`)

      // In production, you would send these changes to your backend
      // For now, we'll simulate the sync
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Clear pending changes
      this.pendingChanges.clear()
      this.lastSyncTime = Date.now()

      console.log("✅ Sync completed successfully")

      // Trigger a page refresh for other tabs/windows
      this.broadcastSync()
    } catch (error) {
      console.error("❌ Sync failed:", error)
    }
  }

  private broadcastSync(): void {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("cms-sync")
      channel.postMessage({
        type: "sync-complete",
        timestamp: this.lastSyncTime,
      })
      channel.close()
    }
  }

  // Listen for sync broadcasts from other tabs
  listenForSync(callback: () => void): void {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("cms-sync")
      channel.onmessage = (event) => {
        if (event.data.type === "sync-complete") {
          console.log("🔄 Received sync broadcast from another tab")
          callback()
        }
      }
    }
  }
}

export const cmsSync = CMSSync.getInstance()
