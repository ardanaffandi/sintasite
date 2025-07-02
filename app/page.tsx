"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Briefcase, Building2, ShoppingBag, Youtube, Instagram } from "lucide-react"

interface HomeContent {
  name: string
  title: string
  bio: string
  profileImage: string
  socialMedia: {
    youtube: string
    tiktok: string
    instagram: string
  }
}

const defaultContent: HomeContent = {
  name: "Your Name",
  title: "Digital Marketing & Brand Collaboration Specialist",
  bio: "Welcome to my professional endorsement platform. I specialize in authentic brand partnerships and strategic collaborations that drive real results for businesses of all sizes.",
  profileImage: "/placeholder.svg?height=200&width=200",
  socialMedia: {
    youtube: "https://youtube.com/@yourhandle",
    tiktok: "https://tiktok.com/@yourhandle",
    instagram: "https://instagram.com/yourhandle",
  },
}

interface NavigationCard {
  id: string
  title: string
  description: string
  buttonText: string
  buttonStyle: "primary" | "secondary"
  icon: "briefcase" | "building" | "shopping"
  href: string
  gradient: string
  isActive: boolean
}

export default function HomePage() {
  const [content, setContent] = useState<HomeContent>(defaultContent)

  const [navigationCards, setNavigationCards] = useState<NavigationCard[]>([
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
  ])

  useEffect(() => {
    const savedContent = localStorage.getItem("homeContent")
    const savedCards = localStorage.getItem("homeNavigationCards")

    if (savedContent) {
      const parsed: Partial<HomeContent> = JSON.parse(savedContent)
      setContent({
        ...defaultContent,
        ...parsed,
        socialMedia: { ...defaultContent.socialMedia, ...(parsed.socialMedia ?? {}) },
      })
    } else {
      localStorage.setItem("homeContent", JSON.stringify(defaultContent))
    }

    if (savedCards) {
      setNavigationCards(JSON.parse(savedCards))
    } else {
      // Initialize with fresh data
      localStorage.setItem("homeNavigationCards", JSON.stringify(navigationCards))
    }
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "briefcase":
        return <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
      case "building":
        return <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
      case "shopping":
        return <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
      default:
        return <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="relative inline-block mb-4 md:mb-6">
            <img
              src={content.profileImage || "/placeholder.svg"}
              alt={content.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto shadow-xl border-4 border-white/50"
            />
            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-green-400 rounded-full border-2 md:border-4 border-white"></div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">{content.name}</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6 px-4">{content.title}</p>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-4 mb-6 md:mb-8">
            <a
              href={content.socialMedia.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a
              href={content.socialMedia.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
            <a
              href={content.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>

          {/* Featured Affiliate Lookbook Button */}
          <div className="mb-6 md:mb-8 px-4">
            <Link href="/affiliate" className="group inline-block w-full max-w-lg">
              <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 p-1 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8">
                  <div className="flex flex-col md:flex-row items-center justify-center mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full flex items-center justify-center mb-3 md:mb-0 md:mr-4">
                      <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">Affiliate Lookbook</h2>
                      <p className="text-gray-600 text-sm md:text-base">My Personal Recommendations</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 text-center text-sm md:text-base">
                    Discover curated products and brands I personally use and love
                  </p>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 md:py-3 px-4 md:px-8 rounded-full inline-block text-sm md:text-base">
                    Browse Collection →
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="card max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">{content.bio}</p>
          </div>
        </header>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {navigationCards
            .filter((card) => card.isActive)
            .map((card) => (
              <Link key={card.id} href={card.href} className="group">
                <div className="card hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${card.gradient} rounded-full flex items-center justify-center mr-3 md:mr-4`}
                    >
                      {getIconComponent(card.icon)}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{card.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm md:text-base">{card.description}</p>
                  <div
                    className={`${card.buttonStyle === "primary" ? "btn-primary" : "btn-secondary"} inline-block text-sm md:text-base`}
                  >
                    {card.buttonText}
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Order Tracking Button */}
        <div className="mb-6 md:mb-8 px-4">
          <Link href="/tracking" className="group inline-block w-full max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 p-1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
              <div className="bg-white rounded-lg p-3 md:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-orange-300 to-red-300 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">Order Tracking</h3>
                      <p className="text-gray-600 text-xs md:text-sm">Track Your Partnership Status</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-4 rounded-full text-sm">
                    Track Order →
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-xs md:text-sm">
          <p>© 2024 {content.name}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
