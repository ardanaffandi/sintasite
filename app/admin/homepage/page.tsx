"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Save,
  Upload,
  Eye,
  Home,
  Briefcase,
  Building2,
  ShoppingBag,
  Edit3,
  Plus,
  Trash2,
  GripVertical,
  Instagram,
  Youtube,
} from "lucide-react"

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

export default function HomepageCMS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const router = useRouter()

  const [content, setContent] = useState<HomeContent>({
    name: "Alex Johnson",
    title: "Digital Marketing & Brand Collaboration Specialist",
    bio: "Passionate about connecting brands with their perfect audience. With over 5 years of experience in digital marketing and brand partnerships, I help businesses grow through authentic collaborations and strategic endorsements.",
    profileImage: "/placeholder.svg?height=200&width=200",
    socialMedia: {
      youtube: "https://youtube.com/@yourhandle",
      tiktok: "https://tiktok.com/@yourhandle",
      instagram: "https://instagram.com/yourhandle",
    },
  })

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
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      loadContent()
    } else {
      router.push("/login")
    }
  }, [router])

  const loadContent = () => {
    const savedContent = localStorage.getItem("homeContent")
    const savedCards = localStorage.getItem("homeNavigationCards")

    if (savedContent) {
      const parsed: Partial<HomeContent> = JSON.parse(savedContent)
      setContent((prev) => ({
        ...prev,
        ...parsed,
        socialMedia: { ...prev.socialMedia, ...(parsed.socialMedia ?? {}) },
      }))
    }
    if (savedCards) {
      setNavigationCards(JSON.parse(savedCards))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    localStorage.setItem("homeContent", JSON.stringify(content))
    localStorage.setItem("homeNavigationCards", JSON.stringify(navigationCards))

    setTimeout(() => {
      setIsSaving(false)
      alert("Homepage content saved successfully!")
    }, 1000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setContent((prev) => ({
          ...prev,
          profileImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addNavigationCard = () => {
    const newCard: NavigationCard = {
      id: `card-${Date.now()}`,
      title: "New Card",
      description: "Card description",
      buttonText: "Learn More →",
      buttonStyle: "primary",
      icon: "briefcase",
      href: "/new-page",
      gradient: "from-purple-300 to-pink-300",
      isActive: true,
    }
    setNavigationCards((prev) => [...prev, newCard])
  }

  const updateNavigationCard = (id: string, updates: Partial<NavigationCard>) => {
    setNavigationCards((prev) => prev.map((card) => (card.id === id ? { ...card, ...updates } : card)))
  }

  const deleteNavigationCard = (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      setNavigationCards((prev) => prev.filter((card) => card.id !== id))
    }
  }

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800 transition-colors">
                ← Back to CMS
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Homepage Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Homepage Sections</h2>
              <nav className="space-y-2">
                {[
                  { id: "profile", label: "Profile Section", icon: Home, description: "Personal info & bio" },
                  { id: "social", label: "Social Media", icon: Instagram, description: "Social media links" },
                  { id: "cards", label: "Navigation Cards", icon: Edit3, description: "Service cards" },
                ].map(({ id, label, icon: Icon, description }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-start space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === id
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-sm"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activeTab === id ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-100"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${activeTab === id ? "text-white" : "text-gray-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${activeTab === id ? "text-blue-900" : "text-gray-900"}`}>
                        {label}
                      </div>
                      <div className={`text-sm ${activeTab === id ? "text-blue-700" : "text-gray-500"}`}>
                        {description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Profile Section</h2>
                </div>

                <div className="space-y-6">
                  {/* Profile Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Profile Image</label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <img
                          src={content.profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-image"
                        />
                        <label
                          htmlFor="profile-image"
                          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Image</span>
                        </label>
                        <p className="text-sm text-gray-500 mt-2">Recommended: 200x200px, JPG or PNG</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={content.name}
                        onChange={(e) => setContent((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                      <input
                        type="text"
                        value={content.title}
                        onChange={(e) => setContent((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your professional title"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={content.bio}
                      onChange={(e) => setContent((prev) => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                      placeholder="Tell visitors about yourself and your expertise..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Social Media Links</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Channel</label>
                    <input
                      type="url"
                      value={content.socialMedia.youtube}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, youtube: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://youtube.com/@yourhandle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TikTok Profile</label>
                    <input
                      type="url"
                      value={content.socialMedia.tiktok}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, tiktok: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://tiktok.com/@yourhandle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Profile</label>
                    <input
                      type="url"
                      value={content.socialMedia.instagram}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, instagram: e.target.value },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>

                  {/* Preview */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Preview:</h4>
                    <div className="flex justify-center space-x-4">
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
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cards" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Navigation Cards</h2>
                  </div>
                  <button
                    onClick={addNavigationCard}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Card</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {navigationCards.map((card, index) => (
                    <div key={card.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="w-5 h-5 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">Card {index + 1}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={card.isActive}
                              onChange={(e) => updateNavigationCard(card.id, { isActive: e.target.checked })}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                          <button
                            onClick={() => deleteNavigationCard(card.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Title</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => updateNavigationCard(card.id, { title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                          <input
                            type="text"
                            value={card.buttonText}
                            onChange={(e) => updateNavigationCard(card.id, { buttonText: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                          <input
                            type="text"
                            value={card.href}
                            onChange={(e) => updateNavigationCard(card.id, { href: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="/page-url"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                          <select
                            value={card.icon}
                            onChange={(e) => updateNavigationCard(card.id, { icon: e.target.value as any })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="briefcase">Briefcase</option>
                            <option value="building">Building</option>
                            <option value="shopping">Shopping Bag</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
                          <select
                            value={card.buttonStyle}
                            onChange={(e) => updateNavigationCard(card.id, { buttonStyle: e.target.value as any })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="primary">Primary (Blue)</option>
                            <option value="secondary">Secondary (Gray)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Icon Gradient</label>
                          <select
                            value={card.gradient}
                            onChange={(e) => updateNavigationCard(card.id, { gradient: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="from-green-300 to-emerald-300">Green to Emerald</option>
                            <option value="from-blue-300 to-indigo-300">Blue to Indigo</option>
                            <option value="from-purple-300 to-pink-300">Purple to Pink</option>
                            <option value="from-red-300 to-rose-300">Red to Rose</option>
                            <option value="from-yellow-300 to-orange-300">Yellow to Orange</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={card.description}
                          onChange={(e) => updateNavigationCard(card.id, { description: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                        />
                      </div>

                      {/* Preview */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Preview:</h4>
                        <div className="card hover:shadow-xl transition-all duration-300 max-w-md">
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
