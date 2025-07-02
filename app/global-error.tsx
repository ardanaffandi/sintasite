"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Critical Error</h1>
              <p className="text-gray-600 mb-4">
                A critical system error occurred. Please refresh the page or contact technical support.
              </p>
              {error.digest && (
                <p className="text-sm text-gray-500 font-mono bg-gray-100 p-2 rounded">Error ID: {error.digest}</p>
              )}
            </div>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
