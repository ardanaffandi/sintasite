"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Heart, ShoppingBag } from "lucide-react"

interface AffiliateItem {
  id: string
  title: string
  description: string
  image: string
  affiliateUrl: string
  category: string
  priceIDR: number
  priceAttribute: string
}

interface AffiliateContent {
  title: string
  description: string
  items: AffiliateItem[]
}

interface AffiliatePriceAttribute {
  id: string
  name: string
  color: string
  icon: string
}

export default function AffiliatePage() {
  const [content, setContent] = useState<AffiliateContent>({
    title: "Affiliate Lookbook",
    description:
      "Discover my personally curated collection of products and brands that I use and love. Each item has been carefully selected based on quality, value, and personal experience.",
    items: [],
  })

  const [priceAttributes, setPriceAttributes] = useState<AffiliatePriceAttribute[]>([
    { id: "1", name: "Most Worth It", color: "green", icon: "💰" },
    { id: "2", name: "Premium Choice", color: "purple", icon: "⭐" },
    { id: "3", name: "Budget Friendly", color: "blue", icon: "💙" },
    { id: "4", name: "Trending Now", color: "pink", icon: "🔥" },
    { id: "5", name: "Editor's Pick", color: "orange", icon: "🏆" },
    { id: "6", name: "Best Seller", color: "red", icon: "🎯" },
  ])

  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const savedContent = localStorage.getItem("affiliateContent")
    const savedPriceAttributes = localStorage.getItem("affiliatePriceAttributes")

    if (savedContent) {
      setContent(JSON.parse(savedContent))
    } else {
      // Initialize with fresh data
      localStorage.setItem("affiliateContent", JSON.stringify(content))
    }

    if (savedPriceAttributes) {
      setPriceAttributes(JSON.parse(savedPriceAttributes))
    } else {
      // Initialize with fresh data
      localStorage.setItem("affiliatePriceAttributes", JSON.stringify(priceAttributes))
    }
  }, [])

  const formatIDRPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPriceAttributeColor = (attributeName: string) => {
    const attr = priceAttributes.find((a) => a.name === attributeName)
    if (!attr) return "bg-gray-100 text-gray-800"

    switch (attr.color) {
      case "green":
        return "bg-green-100 text-green-800"
      case "purple":
        return "bg-purple-100 text-purple-800"
      case "blue":
        return "bg-blue-100 text-blue-800"
      case "pink":
        return "bg-pink-100 text-pink-800"
      case "orange":
        return "bg-orange-100 text-orange-800"
      case "red":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const categories = ["All", ...Array.from(new Set(content.items.map((item) => item.category)))]

  const filteredItems =
    selectedCategory === "All" ? content.items : content.items.filter((item) => item.category === selectedCategory)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center mb-6 md:mb-8">
          <Link
            href="/"
            className="mb-4 md:mb-0 md:mr-4 p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors self-start"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">{content.title}</h1>
            <p className="text-gray-600 mt-2 max-w-2xl text-sm md:text-base">{content.description}</p>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 md:px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm md:text-base ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-rose-300 to-pink-300 text-white shadow-lg"
                    : "bg-white/70 text-gray-600 hover:bg-white/90"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredItems.map((item) => {
              const priceAttr = priceAttributes.find((attr) => attr.name === item.priceAttribute)
              return (
                <div
                  key={item.id}
                  className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Heart className="w-3 h-3 md:w-4 md:h-4 text-rose-500" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">{item.category}</span>
                    </div>
                    {/* Price Attribute Badge */}
                    {priceAttr && (
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getPriceAttributeColor(item.priceAttribute)}`}
                        >
                          {priceAttr.icon} {priceAttr.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1 md:mb-0">{item.title}</h3>
                      <span className="text-rose-600 font-bold text-sm md:text-base">
                        {formatIDRPrice(item.priceIDR)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>

                    {/* Quick Preview Info */}
                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                      <span>⭐ Personally tested</span>
                      <span>🔥 Recommended</span>
                    </div>

                    <a
                      href={item.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center space-x-2 group text-sm md:text-base"
                    >
                      <span>Shop Now</span>
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              I'm currently curating an amazing collection of products for you. Check back soon for my personal
              recommendations!
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="card mt-8 md:mt-12 bg-yellow-50 border-yellow-200">
          <p className="text-xs md:text-sm text-gray-600 text-center">
            <strong>Disclosure:</strong> This page contains affiliate links. I may earn a commission from purchases made
            through these links at no additional cost to you. I only recommend products I personally use and believe in.
          </p>
        </div>
      </div>
    </div>
  )
}
