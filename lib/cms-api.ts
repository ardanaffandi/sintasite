// Simplified CMS API for public server deployment
class CMSApi {
  private baseUrl: string

  constructor() {
    this.baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }

  async get(path: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cms/${path}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("CMS API GET error:", error)
      // Return default data if API fails
      return this.getDefaultData(path)
    }
  }

  async put(path: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cms/${path}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      // Also save to localStorage as backup
      if (typeof window !== "undefined") {
        localStorage.setItem(`cms-${path}`, JSON.stringify(data))
      }

      return result
    } catch (error) {
      console.error("CMS API PUT error:", error)

      // Fallback to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`cms-${path}`, JSON.stringify(data))
        return { success: true, fallback: true }
      }

      throw error
    }
  }

  async post(path: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cms/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("CMS API POST error:", error)
      throw error
    }
  }

  private getDefaultData(path: string): any {
    // Return default data based on path
    const defaults: Record<string, any> = {
      homePageContent: {
        name: "Your Name",
        title: "Digital Marketing & Brand Collaboration Specialist",
        bio: "Welcome to my professional endorsement platform. I specialize in authentic brand partnerships and strategic collaborations that drive real results for businesses of all sizes.",
        profileImage: "/placeholder.svg?height=200&width=200",
        socialMedia: {
          youtube: "https://youtube.com/@yourhandle",
          tiktok: "https://tiktok.com/@yourhandle",
          instagram: "https://instagram.com/yourhandle",
        },
        navigationCards: [
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
      },
    }

    // Try localStorage first
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`cms-${path}`)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error("Failed to parse stored data:", e)
        }
      }
    }

    return defaults[path] || {}
  }
}

export const cmsApi = new CMSApi()
