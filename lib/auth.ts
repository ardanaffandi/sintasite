// Simple authentication system for the CMS
export interface User {
  username: string
  role: "admin" | "editor"
  lastLogin?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

// Default admin credentials
const DEFAULT_CREDENTIALS = {
  username: "sinta",
  password: "Ketemudibandung1",
}

class AuthManager {
  private static instance: AuthManager
  private currentUser: User | null = null
  private sessionKey = "endorsement-auth-session"

  private constructor() {
    this.loadSession()
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  private loadSession(): void {
    if (typeof window === "undefined") return

    try {
      const session = localStorage.getItem(this.sessionKey)
      if (session) {
        const parsed = JSON.parse(session)
        // Check if session is still valid (24 hours)
        const sessionTime = new Date(parsed.timestamp)
        const now = new Date()
        const hoursDiff = (now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60)

        if (hoursDiff < 24) {
          this.currentUser = parsed.user
        } else {
          this.logout()
        }
      }
    } catch (error) {
      console.error("Error loading session:", error)
      this.logout()
    }
  }

  private saveSession(user: User): void {
    if (typeof window === "undefined") return

    const session = {
      user,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem(this.sessionKey, JSON.stringify(session))
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    try {
      // Simple credential check
      if (
        credentials.username === DEFAULT_CREDENTIALS.username &&
        credentials.password === DEFAULT_CREDENTIALS.password
      ) {
        const user: User = {
          username: credentials.username,
          role: "admin",
          lastLogin: new Date().toISOString(),
        }

        this.currentUser = user
        this.saveSession(user)

        return { success: true }
      } else {
        return { success: false, error: "Invalid username or password" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed" }
    }
  }

  logout(): void {
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.sessionKey)
      localStorage.setItem("isAuthenticated", "false")
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  hasRole(role: "admin" | "editor"): boolean {
    if (!this.currentUser) return false
    return this.currentUser.role === role || this.currentUser.role === "admin"
  }

  // Legacy support for existing code
  checkAuth(): boolean {
    if (typeof window === "undefined") return false

    const isAuth = localStorage.getItem("isAuthenticated") === "true"
    return isAuth || this.isAuthenticated()
  }

  setAuth(authenticated: boolean): void {
    if (typeof window === "undefined") return
    localStorage.setItem("isAuthenticated", authenticated.toString())
  }
}

export const authManager = AuthManager.getInstance()
export default authManager

// Legacy functions for backward compatibility
export const checkAuth = () => authManager.checkAuth()
export const setAuth = (authenticated: boolean) => authManager.setAuth(authenticated)
