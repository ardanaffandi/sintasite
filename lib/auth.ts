export interface AdminUser {
  id: string
  username: string
  email: string
  password: string
  role: "super_admin" | "admin" | "editor" | "viewer"
  permissions: {
    dashboard: boolean
    content_management: boolean
    user_management: boolean
    inquiries: boolean
    umkm_orders: boolean
    analytics: boolean
    settings: boolean
    export_data: boolean
    import_data: boolean
  }
  isActive: boolean
  lastLogin?: string
  createdAt: string
  createdBy: string
}

export const ROLE_PRESETS = {
  super_admin: {
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
  admin: {
    dashboard: true,
    content_management: true,
    user_management: false,
    inquiries: true,
    umkm_orders: true,
    analytics: true,
    settings: false,
    export_data: true,
    import_data: false,
  },
  editor: {
    dashboard: true,
    content_management: true,
    user_management: false,
    inquiries: true,
    umkm_orders: false,
    analytics: false,
    settings: false,
    export_data: false,
    import_data: false,
  },
  viewer: {
    dashboard: true,
    content_management: false,
    user_management: false,
    inquiries: true,
    umkm_orders: false,
    analytics: false,
    settings: false,
    export_data: false,
    import_data: false,
  },
}

export function initializeDefaultUsers(): AdminUser[] {
  try {
    const existingUsers = localStorage.getItem("adminUsers")
    if (existingUsers) {
      const users = JSON.parse(existingUsers)
      if (users.length > 0) {
        console.log("✅ Admin users already exist")
        return users
      }
    }

    const defaultUser: AdminUser = {
      id: "1",
      username: "sinta",
      email: "sinta@endorsement.com",
      password: "Ketemudibandung1",
      role: "super_admin",
      permissions: ROLE_PRESETS.super_admin,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: "system",
    }

    const users = [defaultUser]
    localStorage.setItem("adminUsers", JSON.stringify(users))
    console.log("✅ Default super admin user created successfully")
    return users
  } catch (error) {
    console.error("❌ Failed to initialize default users:", error)
    return []
  }
}

export function authenticateUser(username: string, password: string): AdminUser | null {
  try {
    // Ensure users are initialized
    const users = initializeDefaultUsers()

    console.log("🔍 Authenticating user:", username)
    console.log(
      "📊 Available users:",
      users.map((u) => ({ username: u.username, active: u.isActive })),
    )

    const user = users.find((u) => u.username === username && u.password === password && u.isActive)

    if (user) {
      console.log("✅ User authenticated successfully:", user.username)

      // Store authentication state and current user
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Update last login
      const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u))
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

export function getCurrentUser(): AdminUser | null {
  try {
    const currentUser = localStorage.getItem("currentUser")
    return currentUser ? JSON.parse(currentUser) : null
  } catch (error) {
    console.error("❌ Error getting current user:", error)
    return null
  }
}

export function isAuthenticated(): boolean {
  try {
    const auth = localStorage.getItem("isAuthenticated")
    const currentUser = getCurrentUser()
    return auth === "true" && currentUser !== null
  } catch (error) {
    console.error("❌ Error checking authentication:", error)
    return false
  }
}

export function logout(): void {
  try {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("currentUser")
    console.log("✅ User logged out successfully")
  } catch (error) {
    console.error("❌ Error during logout:", error)
  }
}

// Production-ready session management
export function refreshSession(): boolean {
  try {
    const user = getCurrentUser()
    if (!user) return false

    // Update last activity
    const updatedUser = { ...user, lastLogin: new Date().toISOString() }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    return true
  } catch (error) {
    console.error("❌ Error refreshing session:", error)
    return false
  }
}

// Auto-refresh session every 5 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      if (isAuthenticated()) {
        refreshSession()
      }
    },
    5 * 60 * 1000,
  )
}
