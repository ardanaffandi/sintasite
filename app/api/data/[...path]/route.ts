import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Mock data storage (in production, this would be a database)
const mockData = {
  homepage: {
    hero: {
      title: "Sinta Nuriyah",
      subtitle: "Professional Endorsement & Partnership Services",
      description:
        "Connecting brands with authentic partnerships and driving meaningful collaborations across Indonesia.",
      ctaText: "Start Partnership",
    },
    about: {
      title: "About Sinta Nuriyah",
      description:
        "With years of experience in brand partnerships and business development, I help companies build authentic connections and drive growth through strategic collaborations.",
    },
    services: [
      {
        id: "umkm-partnership",
        title: "UMKM Partnership",
        description:
          "Empowering small and medium enterprises through strategic partnerships and business development opportunities.",
        icon: "Building2",
        features: ["Business Consultation", "Partnership Matching", "Growth Strategy", "Market Access"],
      },
      {
        id: "brand-collaboration",
        title: "Brand Collaboration",
        description: "Facilitating authentic brand partnerships that create value for both businesses and consumers.",
        icon: "Handshake",
        features: ["Brand Strategy", "Partnership Development", "Campaign Management", "Performance Tracking"],
      },
      {
        id: "affiliate-marketing",
        title: "Affiliate Marketing",
        description: "Curated product recommendations and affiliate partnerships that deliver results.",
        icon: "TrendingUp",
        features: ["Product Curation", "Performance Marketing", "Audience Engagement", "Revenue Optimization"],
      },
    ],
    testimonials: [
      {
        id: "1",
        name: "Ahmad Rizki",
        role: "CEO",
        company: "TechStart Indonesia",
        content:
          "Sinta's expertise in partnership development helped us expand our market reach significantly. Her professional approach and network are invaluable.",
        rating: 5,
      },
    ],
    contact: {
      title: "Let's Work Together",
      description: "Ready to explore partnership opportunities? Get in touch to discuss how we can collaborate.",
      email: "sinta@example.com",
      phone: "+62 812-3456-7890",
      address: "Jakarta, Indonesia",
    },
  },
  umkm: [],
  inquiries: [],
  settings: {
    siteName: "Sinta Nuriyah - Professional Endorsements",
    siteDescription:
      "Professional endorsement and partnership services connecting brands with authentic collaborations.",
    socialMedia: {},
    analytics: {},
    seo: {
      metaTitle: "Sinta Nuriyah - Professional Endorsement & Partnership Services",
      metaDescription:
        "Connecting brands with authentic partnerships and driving meaningful collaborations across Indonesia.",
      keywords: ["endorsement", "partnership", "collaboration", "UMKM", "brand", "marketing", "Indonesia"],
    },
  },
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")

    // Navigate to the requested data path
    let data = mockData
    const pathParts = path.split("/").filter(Boolean)

    for (const part of pathParts) {
      if (data && typeof data === "object" && part in data) {
        data = (data as any)[part]
      } else {
        return NextResponse.json({ error: "Data not found" }, { status: 404 })
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const body = await request.json()

    // Handle different POST endpoints
    if (path === "umkm") {
      const newApplication = {
        ...body,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      }
      mockData.umkm.push(newApplication)
      return NextResponse.json({ success: true, data: newApplication })
    }

    if (path === "inquiries") {
      const newInquiry = {
        ...body,
        id: Date.now().toString(),
        status: "new",
        createdAt: new Date().toISOString(),
      }
      mockData.inquiries.push(newInquiry)
      return NextResponse.json({ success: true, data: newInquiry })
    }

    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join("/")
    const body = await request.json()

    // Handle updates to different data sections
    const pathParts = path.split("/").filter(Boolean)

    if (pathParts[0] === "homepage") {
      mockData.homepage = { ...mockData.homepage, ...body }
      return NextResponse.json({ success: true, data: mockData.homepage })
    }

    if (pathParts[0] === "settings") {
      mockData.settings = { ...mockData.settings, ...body }
      return NextResponse.json({ success: true, data: mockData.settings })
    }

    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
