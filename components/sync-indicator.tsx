"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Cloud, CloudOff } from "lucide-react"
import { cmsSync } from "@/lib/sync"

export function SyncIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Listen for sync events
    cmsSync.listenForSync(() => {
      setLastSync(new Date())
      setIsSyncing(false)
    })

    // Check initial online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleManualSync = async () => {
    setIsSyncing(true)
    await cmsSync.syncNow()
    setLastSync(new Date())
    setIsSyncing(false)
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      {/* Online/Offline Status */}
      <div className="flex items-center space-x-1">
        {isOnline ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
        <span className={isOnline ? "text-green-600" : "text-red-600"}>{isOnline ? "Online" : "Offline"}</span>
      </div>

      {/* Sync Status */}
      <div className="flex items-center space-x-1">
        {isSyncing ? (
          <Cloud className="w-4 h-4 text-blue-500 animate-pulse" />
        ) : isOnline ? (
          <Cloud className="w-4 h-4 text-green-500" />
        ) : (
          <CloudOff className="w-4 h-4 text-gray-400" />
        )}

        <button
          onClick={handleManualSync}
          disabled={!isOnline || isSyncing}
          className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isSyncing ? "Syncing..." : "Sync"}
        </button>
      </div>

      {/* Last Sync Time */}
      {lastSync && <span className="text-gray-500">Last sync: {lastSync.toLocaleTimeString()}</span>}
    </div>
  )
}
