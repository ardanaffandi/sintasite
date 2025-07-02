"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong!</h1>
          <p className="text-gray-600 mb-4">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500 font-mono bg-gray-100 p-2 rounded">Error ID: {error.digest}</p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors w-full justify-center"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full justify-center"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
