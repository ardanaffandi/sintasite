"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, Shield, AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [systemReady, setSystemReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    initializeSystem()
  }, [])

  const initializeSystem = async () => {
    try {
      setIsInitializing(true)

      // Check if admin users exist
      let adminUsers = JSON.parse(localStorage.getItem("adminUsers") || "[]")

      // If no users exist, create the default super admin
      if (adminUsers.length === 0) {
        const defaultUser = {
          id: "1",
          username: "admin",
          email: "admin@yoursite.com",
          password: "admin123",
          role: "super_admin",
          permissions: {
            dashboard: true,
            content_management: true,
            user_management: true,
            inquiries: true,
            umkm_orders: true,
            analytics: true,
            settings: true,
            export_data: true,
            import_data: true,
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          createdBy: "system",
        }

        adminUsers = [defaultUser]
        localStorage.setItem("adminUsers", JSON.stringify(adminUsers))
        console.log("✅ Default super admin user created")
      }

      // Initialize fresh data for production
      const freshData = {
        homeContent: {
          name: "Your Name",
          title: "Digital Marketing & Brand Collaboration Specialist",
          bio: "Welcome to my professional endorsement platform. I specialize in authentic brand partnerships and strategic collaborations that drive real results for businesses of all sizes.",
          profileImage: "/placeholder.svg?height=200&width=200",
        },
        homeNavigationCards: [
          {
            id: "umkm",
            title: "UMKM Partnership",
            description:
              "Perfect for small and medium businesses looking for authentic brand collaborations and endorsements.",
            buttonText: "Get Started →",
            buttonStyle: "primary",
            icon: "briefcase",
            href: "/umkm",
            gradient: "from-green-300 to-emerald-300",
            isActive: true,
          },
          {
            id: "big-brands",
            title: "Big Brands",
            description:
              "Enterprise-level partnerships and collaborations for established brands seeking premium endorsements.",
            buttonText: "Contact Now →",
            buttonStyle: "secondary",
            icon: "building",
            href: "/big-brands",
            gradient: "from-blue-300 to-indigo-300",
            isActive: true,
          },
        ],
        affiliateContent: {
          title: "Affiliate Lookbook",
          description:
            "Discover my personally curated collection of products and brands that I use and love. Each item has been carefully selected based on quality, value, and personal experience.",
          items: [],
        },
        affiliateCategories: [
          { id: "1", name: "Beauty", createdAt: new Date().toISOString() },
          { id: "2", name: "Tech", createdAt: new Date().toISOString() },
          { id: "3", name: "Fashion", createdAt: new Date().toISOString() },
          { id: "4", name: "Health", createdAt: new Date().toISOString() },
          { id: "5", name: "Food", createdAt: new Date().toISOString() },
          { id: "6", name: "Fitness", createdAt: new Date().toISOString() },
        ],
        umkmOrders: [],
        inquiriesData: [],
      }

      // Only initialize if data doesn't exist
      Object.entries(freshData).forEach(([key, value]) => {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify(value))
        }
      })

      // Verify system is ready
      const savedUsers = localStorage.getItem("adminUsers")
      if (savedUsers && JSON.parse(savedUsers).length > 0) {
        setSystemReady(true)
        console.log("✅ System initialized successfully")
      } else {
        throw new Error("Failed to initialize admin users")
      }
    } catch (error) {
      console.error("❌ System initialization failed:", error)
      setError("System initialization failed. Please refresh the page.")
    } finally {
      setIsInitializing(false)
    }
  }

  const authenticateUser = (username: string, password: string) => {
    try {
      const adminUsers = JSON.parse(localStorage.getItem("adminUsers") || "[]")
      console.log("🔍 Authenticating user:", username)

      const user = adminUsers.find((u: any) => u.username === username && u.password === password && u.isActive)

      if (user) {
        console.log("✅ User authenticated successfully:", user.username)
        // Store authentication state and current user
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("currentUser", JSON.stringify(user))

        // Update last login
        const updatedUsers = adminUsers.map((u: any) =>
          u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u,
        )
        localStorage.setItem("adminUsers", JSON.stringify(updatedUsers))

        return user
      }

      console.log("❌ Authentication failed for user:", username)
      return null
    } catch (error) {
      console.error("❌ Authentication error:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!systemReady) {
      setError("System is not ready. Please wait for initialization to complete.")
      setIsLoading(false)
      return
    }

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.")
      setIsLoading(false)
      return
    }

    try {
      // Simulate loading delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = authenticateUser(username.trim(), password)

      if (user) {
        console.log("🎉 Login successful, redirecting to admin...")
        router.push("/admin")
      } else {
        setError("Invalid username or password. Please check your credentials.")
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Initializing System</h2>
            <p className="text-gray-600">Setting up your admin environment...</p>
            <div className="mt-6 space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing fresh data...</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Setting up authentication...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Access your content management system</p>
        </div>

        {/* System Status */}
        <div className="mb-6">
          <div
            className={`flex items-center space-x-2 p-3 rounded-lg ${
              systemReady ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {systemReady ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">System Status: {systemReady ? "Ready" : "Not Ready"}</span>
          </div>
        </div>

        {/* Default Credentials Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Default Login Credentials:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              <strong>Username:</strong> admin
            </p>
            <p>
              <strong>Password:</strong> admin123
            </p>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Please change these credentials after your first login for security.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your username"
              disabled={isLoading || !systemReady}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                placeholder="Enter your password"
                disabled={isLoading || !systemReady}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading || !systemReady}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !systemReady}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">Secure admin access • Protected by authentication</p>
        </div>
      </div>
    </div>
  )
}
