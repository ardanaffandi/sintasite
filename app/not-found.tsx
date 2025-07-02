"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, ArrowRight } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Home className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist. You'll be redirected to the homepage shortly.
        </p>

        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm font-medium">Redirecting to homepage...</span>
          <ArrowRight className="w-4 h-4" />
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home Now</span>
          </button>
        </div>
      </div>
    </div>
  )
}
