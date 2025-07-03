import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo (in production, use a database)
const storage = new Map<string, any>()

// Initialize with default data that matches the original homepage
const initializeStorage = () => {
  if (!storage.has("homePageContent")) {
    storage.set("homePageContent", {
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
    })
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    initializeStorage()

    const path = params.path.join("/")
    console.log("GET request for path:", path)

    const data = storage.get(path)

    if (!data) {
      return NextResponse.json({ error: "Data not found", path }, { status: 404 })
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("CMS API GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const body = await request.json()

    console.log("PUT request for path:", path)
    console.log("Data:", body)

    // Store the data
    storage.set(path, body)

    return NextResponse.json(
      { success: true, message: "Data updated successfully" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  } catch (error) {
    console.error("CMS API PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const body = await request.json()

    console.log("POST request for path:", path)

    // Handle different POST endpoints
    if (path === "umkm") {
      const newApplication = {
        ...body,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      const existing = storage.get("umkm") || []
      existing.push(newApplication)
      storage.set("umkm", existing)

      return NextResponse.json({ success: true, data: newApplication })
    }

    if (path === "inquiries") {
      const newInquiry = {
        ...body,
        id: Date.now().toString(),
        status: "new",
        createdAt: new Date().toISOString(),
      }

      const existing = storage.get("inquiries") || []
      existing.push(newInquiry)
      storage.set("inquiries", existing)

      return NextResponse.json({ success: true, data: newInquiry })
    }

    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
  } catch (error) {
    console.error("CMS API POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
