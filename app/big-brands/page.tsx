"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MessageCircle, Star, Award, TrendingUp, Users, Target, Zap } from "lucide-react"

interface BigBrandsSection {
  id: string
  type: "text" | "feature" | "stat" | "cta"
  title?: string
  content?: string
  features?: Array<{
    title: string
    description: string
    icon: string
  }>
  stats?: Array<{
    label: string
    value: string
    color: string
  }>
  ctaText?: string
  ctaDescription?: string
  order: number
}

interface BigBrandsContent {
  title: string
  subtitle: string
  whatsappNumber: string
  responseTime: string
  consultation: string
  commitment: string
  sections: BigBrandsSection[]
}

export default function BigBrandsPage() {
  const [content, setContent] = useState<BigBrandsContent>({
    title: "Premium Brand Partnerships",
    subtitle: "Elevate Your Brand with Professional Endorsements",
    whatsappNumber: "+6281234567890",
    responseTime: "Response within 24 hours",
    consultation: "Free consultation",
    commitment: "No commitment required",
    sections: [
      {
        id: "1",
        type: "text",
        title: "About Our Service",
        content:
          "Partner with us for high-impact brand collaborations that drive measurable results. Our premium service is designed for established brands seeking authentic, professional endorsements.",
        order: 1,
      },
      {
        id: "2",
        type: "cta",
        title: "Ready to Get Started?",
        ctaText: "Contact Us Today",
        ctaDescription:
          "Let's discuss how we can create a premium partnership that delivers exceptional results for your brand.",
        order: 2,
      },
    ],
  })

  useEffect(() => {
    const savedContent = localStorage.getItem("bigBrandsContent")
    if (savedContent) {
      setContent(JSON.parse(savedContent))
    } else {
      // Initialize with fresh data
      localStorage.setItem("bigBrandsContent", JSON.stringify(content))
    }
  }, [])

  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in discussing a premium brand partnership opportunity. 

I'd like to learn more about:
- Your premium partnership packages
- Pricing and timeline options
- Previous case studies and results
- Next steps for collaboration

Looking forward to hearing from you!`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${content.whatsappNumber.replace("+", "")}?text=${encodedMessage}`, "_blank")
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "target":
        return <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
      case "zap":
        return <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
      case "trending-up":
        return <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
      case "users":
        return <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
      case "award":
        return <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
      case "star":
        return <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
      default:
        return <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
    }
  }

  const getStatColor = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600"
      case "purple":
        return "text-purple-600"
      case "rose":
        return "text-rose-600"
      case "green":
        return "text-green-600"
      case "orange":
        return "text-orange-600"
      default:
        return "text-blue-600"
    }
  }

  const renderSection = (section: BigBrandsSection) => {
    switch (section.type) {
      case "text":
        return (
          <div key={section.id} className="card max-w-3xl mx-auto mb-8 md:mb-12">
            {section.title && <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>}
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">{section.content}</p>
          </div>
        )

      case "feature":
        return (
          <div key={section.id} className="mb-8 md:mb-12">
            {section.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6 md:mb-8 px-4">
                {section.title}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {section.features?.map((feature, index) => (
                <div
                  key={index}
                  className="card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    {getIcon(feature.icon)}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-base md:text-lg">{feature.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "stat":
        return (
          <div key={section.id} className="mb-8 md:mb-12">
            {section.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6 md:mb-8 px-4">
                {section.title}
              </h2>
            )}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {section.stats?.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl md:text-3xl font-bold ${getStatColor(stat.color)}`}>{stat.value}</div>
                  <div className="text-gray-600 text-xs md:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case "cta":
        return (
          <div
            key={section.id}
            className="card text-center bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 mb-8 md:mb-12"
          >
            {section.title && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 px-4">{section.title}</h2>
            )}
            {section.ctaDescription && (
              <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base px-4">
                {section.ctaDescription}
              </p>
            )}

            <button
              onClick={handleWhatsAppContact}
              className="btn-secondary text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 inline-flex items-center space-x-3 mb-4 md:mb-6"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              <span>{section.ctaText}</span>
            </button>

            <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 px-4">
              <span>• {content.responseTime}</span>
              <span>• {content.consultation}</span>
              <span>• {content.commitment}</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 md:mb-8">
          <Link href="/" className="mr-4 p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6">
            <Award className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium text-sm md:text-base">Premium Service</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 mb-4 px-4">{content.title}</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 px-4">{content.subtitle}</p>
        </div>

        {/* Dynamic Sections */}
        {content.sections.sort((a, b) => a.order - b.order).map((section) => renderSection(section))}
      </div>
    </div>
  )
}
