"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Briefcase,
  Building2,
  ShoppingBag,
  LogOut,
  Save,
  Plus,
  Trash2,
  BarChart3,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  Upload,
  GripVertical,
  X,
  Globe,
  FileText,
  Phone,
  CreditCard,
  Package,
  CheckCircle,
} from "lucide-react"
import { handleFileUpload, validateImageFile } from "@/lib/file-utils"

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

interface AffiliateCategory {
  id: string
  name: string
  createdAt: string
}

interface AffiliatePriceAttribute {
  id: string
  name: string
  color: string
  icon: string
}

interface CountryCode {
  code: string
  name: string
  flag: string
  dialCode: string
  enabled: boolean
}

interface UMKMContent {
  title: string
  description: string
  formFields: {
    nameLabel: string
    namePlaceholder: string
    brandLabel: string
    brandPlaceholder: string
    instagramLabel: string
    instagramPlaceholder: string
    phoneLabel: string
    phonePlaceholder: string
    productLabel: string
    productPlaceholder: string
    endorsementTypeLabel: string
    endorsementTypes: Array<{
      value: string
      label: string
      price: number
      description: string
    }>
    endorseMonthLabel: string
    photoLabel: string
    photoHelpText: string
  }
  bankInfo: {
    sectionTitle: string
    bankName: string
    accountNumber: string
    accountName: string
    bankLabel: string
    accountNumberLabel: string
    accountNameLabel: string
  }
  paymentInstructions: {
    title: string
    steps: string[]
  }
  whatsappNumber: string
  submitButtonText: string
  disclaimerText: string
  trackingSection: {
    title: string
    description: string
    buttonText: string
    placeholderText: string
    trackButtonText: string
  }
  orderSummaryLabels: {
    title: string
    totalLabel: string
    nextStepsTitle: string
    howItWorksTitle: string
    howItWorksSteps: string[]
    paymentWarning: string
    createInvoiceButton: string
  }
}

interface WhatsAppTemplates {
  umkmConfirmation: string
  umkmStatusUpdate: string
  umkmPaymentReminder: string
  bigBrandsInquiry: string
  generalInquiry: string
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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("home")
  const [isSaving, setIsSaving] = useState(false)
  const [showAffiliateModal, setShowAffiliateModal] = useState(false)
  const [editingAffiliate, setEditingAffiliate] = useState<any>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showCountryModal, setShowCountryModal] = useState(false)
  const router = useRouter()

  // Content states
  const [homeContent, setHomeContent] = useState({
    name: "Alex Johnson",
    title: "Digital Marketing & Brand Collaboration Specialist",
    bio: "Passionate about connecting brands with their perfect audience. With over 5 years of experience in digital marketing and brand partnerships, I help businesses grow through authentic collaborations and strategic endorsements.",
    profileImage: "/placeholder.svg?height=200&width=200",
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

  const [bigBrandsContent, setBigBrandsContent] = useState({
    title: "Premium Brand Partnerships",
    subtitle: "Elevate Your Brand with Professional Endorsements",
    whatsappNumber: "+6281234567890",
    responseTime: "Response within 2 hours",
    consultation: "Free consultation",
    commitment: "No commitment required",
    sections: [
      {
        id: "1",
        type: "text" as const,
        title: "About Our Service",
        content:
          "Partner with us for high-impact brand collaborations that drive measurable results. Our premium service is designed for established brands seeking authentic, professional endorsements.",
        order: 1,
      },
    ] as BigBrandsSection[],
  })

  const [affiliateCategories, setAffiliateCategories] = useState<AffiliateCategory[]>([
    { id: "1", name: "Beauty", createdAt: new Date().toISOString() },
    { id: "2", name: "Tech", createdAt: new Date().toISOString() },
    { id: "3", name: "Fashion", createdAt: new Date().toISOString() },
    { id: "4", name: "Health", createdAt: new Date().toISOString() },
    { id: "5", name: "Food", createdAt: new Date().toISOString() },
    { id: "6", name: "Fitness", createdAt: new Date().toISOString() },
  ])

  const [affiliatePriceAttributes, setAffiliatePriceAttributes] = useState<AffiliatePriceAttribute[]>([
    { id: "1", name: "Most Worth It", color: "green", icon: "💰" },
    { id: "2", name: "Premium Choice", color: "purple", icon: "⭐" },
    { id: "3", name: "Budget Friendly", color: "blue", icon: "💙" },
    { id: "4", name: "Trending Now", color: "pink", icon: "🔥" },
    { id: "5", name: "Editor's Pick", color: "orange", icon: "🏆" },
    { id: "6", name: "Best Seller", color: "red", icon: "🎯" },
  ])

  const [affiliateContent, setAffiliateContent] = useState({
    title: "Affiliate Lookbook",
    description:
      "Discover my personally curated collection of products and brands that I use and love. Each item has been carefully selected based on quality, value, and personal experience.",
    items: [
      {
        id: "1",
        title: "Premium Skincare Set",
        description: "My daily skincare routine essentials for glowing skin",
        image: "/placeholder.svg?height=300&width=300",
        affiliateUrl: "https://example.com/skincare",
        category: "Beauty",
        priceIDR: 1250000,
        priceAttribute: "Most Worth It",
      },
    ],
  })

  const [umkmContent, setUmkmContent] = useState<UMKMContent>({
    title: "UMKM Partnership Program",
    description:
      "Join our exclusive partnership program designed specifically for small and medium businesses. Get authentic endorsements that drive real results.",
    formFields: {
      nameLabel: "Full Name",
      namePlaceholder: "Enter your full name",
      brandLabel: "Brand Name",
      brandPlaceholder: "Your brand or business name",
      instagramLabel: "Instagram Handle",
      instagramPlaceholder: "@yourbrand",
      phoneLabel: "WhatsApp Number",
      phonePlaceholder: "812345678",
      productLabel: "Product Description",
      productPlaceholder: "Describe your product or service...",
      endorsementTypeLabel: "Type of Endorsement",
      endorsementTypes: [
        { value: "basic", label: "Basic Post", price: 500000, description: "1 Instagram post + story" },
        { value: "premium", label: "Premium Package", price: 1000000, description: "2 posts + 3 stories + reel" },
        { value: "deluxe", label: "Deluxe Campaign", price: 2000000, description: "3 posts + 5 stories + 2 reels" },
        {
          value: "ultimate",
          label: "Ultimate Package",
          price: 5000000,
          description: "Full month campaign with multiple content",
        },
      ],
      endorseMonthLabel: "Endorse Month",
      photoLabel: "Product Photo",
      photoHelpText: "Click to upload product photo",
    },
    bankInfo: {
      sectionTitle: "Bank Transfer Details:",
      bankName: "Bank Central Asia (BCA)",
      accountNumber: "1234567890",
      accountName: "Alex Johnson",
      bankLabel: "Bank:",
      accountNumberLabel: "Account Number:",
      accountNameLabel: "Account Name:",
    },
    paymentInstructions: {
      title: "Payment Instructions",
      steps: [
        "Transfer 50% of agreed amount as down payment",
        "Remaining 50% after content delivery",
        "Keep your transfer receipt for confirmation",
      ],
    },
    whatsappNumber: "+6281234567890",
    submitButtonText: "Submit Order via WhatsApp",
    disclaimerText: "By submitting, you agree to our terms and conditions. We'll respond within 24 hours.",
    trackingSection: {
      title: "Track Your Endorsement",
      description: "Already submitted?",
      buttonText: "Track Your Endorsement",
      placeholderText: "Enter Order ID (e.g., SMB0725001)",
      trackButtonText: "Track Order",
    },
    orderSummaryLabels: {
      title: "Order Summary",
      totalLabel: "Total",
      nextStepsTitle: "Next Steps",
      howItWorksTitle: "How it works:",
      howItWorksSteps: [
        "📋 Review your order details",
        "💳 Get payment invoice",
        "💳 Complete bank transfer",
        "✅ Confirm payment via WhatsApp",
        "📱 Track your endorsement progress",
      ],
      paymentWarning: "⚠️ Payment required within 48 hours",
      createInvoiceButton: "Create Payment Invoice",
    },
  })

  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplates>({
    umkmConfirmation: `Hi {customerName}! 

Thank you for your UMKM Partnership order {orderId}!

Order Details:
- Brand: {brandName}
- Total: Rp {totalAmount}
- Status: {status}

{scheduledDate}
{notes}

We'll keep you updated on the progress. Thank you for your partnership!

Best regards,
{senderName}`,
    umkmStatusUpdate: `Hi {customerName}! 

Update on your UMKM Partnership order {orderId}:

Current Status: {status}
{scheduledDate}
{notes}

We'll keep you updated on the progress. Thank you for your partnership!`,
    umkmPaymentReminder: `Hi {customerName}! 

Reminder: Your UMKM Partnership order {orderId} is awaiting payment.

Total Amount: Rp {totalAmount}
Payment Deadline: {paymentDeadline}

Please complete your payment to proceed with your endorsement.

Bank Details:
{bankDetails}

Thank you!`,
    bigBrandsInquiry: `Hello! 

Thank you for your interest in our Premium Brand Partnership program.

We'd love to discuss how we can create a premium partnership that delivers exceptional results for your brand.

Let's schedule a consultation to explore the possibilities!

Best regards,
{senderName}`,
    generalInquiry: `Hello! 

Thank you for reaching out to us.

We've received your inquiry and will get back to you within 24 hours.

If you have any urgent questions, feel free to call us directly.

Best regards,
{senderName}`,
  })

  const [invoiceTemplate, setInvoiceTemplate] = useState({
    companyName: "UMKM Partnership",
    companyTagline: "Professional Endorsement Services",
    companyEmail: "info@umkmpartnership.com",
    companyPhone: "+6281234567890",
    invoiceTitle: "INVOICE",
    paymentTerms: "Payment must be completed within 48 hours to avoid order cancellation.",
    thankYouMessage: "Thank you for choosing UMKM Partnership!",
    supportMessage: "For questions about this invoice, please contact us at",
    footerNote: "Professional endorsement services for small and medium businesses",
    colors: {
      primary: "#3B82F6",
      secondary: "#6B7280",
      accent: "#059669",
      warning: "#F59E0B",
    },
    showLogo: true,
    showCompanyDetails: true,
    showPaymentInstructions: true,
    tableStyle: "modern" as const,
  })

  const [countryCodes, setCountryCodes] = useState<CountryCode[]>([
    { code: "ID", name: "Indonesia", flag: "🇮🇩", dialCode: "+62", enabled: true },
    { code: "MY", name: "Malaysia", flag: "🇲🇾", dialCode: "+60", enabled: true },
    { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65", enabled: true },
    { code: "TH", name: "Thailand", flag: "🇹🇭", dialCode: "+66", enabled: true },
    { code: "PH", name: "Philippines", flag: "🇵🇭", dialCode: "+63", enabled: true },
    { code: "VN", name: "Vietnam", flag: "🇻🇳", dialCode: "+84", enabled: true },
    { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1", enabled: false },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44", enabled: false },
    { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61", enabled: false },
    { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81", enabled: false },
    { code: "KR", name: "South Korea", flag: "🇰🇷", dialCode: "+82", enabled: false },
    { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86", enabled: false },
    { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91", enabled: false },
    { code: "AE", name: "UAE", flag: "🇦🇪", dialCode: "+971", enabled: false },
    { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dialCode: "+966", enabled: false },
  ])

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = localStorage.getItem("isAuthenticated")
        const currentUserData = localStorage.getItem("currentUser")

        if (auth === "true" && currentUserData) {
          const user = JSON.parse(currentUserData)
          setCurrentUser(user)
          setIsAuthenticated(true)
          loadContent()
        } else {
          console.log("❌ Not authenticated, redirecting to login")
          router.push("/login")
          return
        }
      } catch (error) {
        console.error("❌ Authentication check failed:", error)
        router.push("/login")
        return
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadContent = () => {
    try {
      const savedHome = localStorage.getItem("homeContent")
      const savedCards = localStorage.getItem("homeNavigationCards")
      const savedBigBrands = localStorage.getItem("bigBrandsContent")
      const savedAffiliate = localStorage.getItem("affiliateContent")
      const savedCategories = localStorage.getItem("affiliateCategories")
      const savedPriceAttributes = localStorage.getItem("affiliatePriceAttributes")
      const savedCountryCodes = localStorage.getItem("countryCodes")
      const savedUmkmContent = localStorage.getItem("umkmContent")
      const savedWhatsappTemplates = localStorage.getItem("whatsappTemplates")
      const savedInvoiceTemplate = localStorage.getItem("invoiceTemplate")

      if (savedHome) setHomeContent(JSON.parse(savedHome))
      if (savedCards) setNavigationCards(JSON.parse(savedCards))
      if (savedBigBrands) setBigBrandsContent(JSON.parse(savedBigBrands))
      if (savedAffiliate) setAffiliateContent(JSON.parse(savedAffiliate))
      if (savedCategories) setAffiliateCategories(JSON.parse(savedCategories))
      if (savedPriceAttributes) setAffiliatePriceAttributes(JSON.parse(savedPriceAttributes))
      if (savedCountryCodes) setCountryCodes(JSON.parse(savedCountryCodes))
      if (savedUmkmContent) setUmkmContent(JSON.parse(savedUmkmContent))
      if (savedWhatsappTemplates) setWhatsappTemplates(JSON.parse(savedWhatsappTemplates))
      if (savedInvoiceTemplate) setInvoiceTemplate(JSON.parse(savedInvoiceTemplate))
    } catch (error) {
      console.error("❌ Error loading content:", error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      localStorage.setItem("homeContent", JSON.stringify(homeContent))
      localStorage.setItem("homeNavigationCards", JSON.stringify(navigationCards))
      localStorage.setItem("bigBrandsContent", JSON.stringify(bigBrandsContent))
      localStorage.setItem("affiliateContent", JSON.stringify(affiliateContent))
      localStorage.setItem("affiliateCategories", JSON.stringify(affiliateCategories))
      localStorage.setItem("affiliatePriceAttributes", JSON.stringify(affiliatePriceAttributes))
      localStorage.setItem("countryCodes", JSON.stringify(countryCodes))
      localStorage.setItem("umkmContent", JSON.stringify(umkmContent))
      localStorage.setItem("whatsappTemplates", JSON.stringify(whatsappTemplates))
      localStorage.setItem("invoiceTemplate", JSON.stringify(invoiceTemplate))

      setTimeout(() => {
        setIsSaving(false)
        alert("Content saved successfully!")
      }, 1000)
    } catch (error) {
      console.error("❌ Error saving content:", error)
      setIsSaving(false)
      alert("Failed to save content. Please try again.")
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("currentUser")
      console.log("✅ User logged out successfully")
      router.push("/login")
    } catch (error) {
      console.error("❌ Error during logout:", error)
      router.push("/login")
    }
  }

  const handleProfileImageUpload = async (file: File) => {
    if (!validateImageFile(file)) return

    try {
      const imageDataUrl = await handleFileUpload(file)
      setHomeContent((prev) => ({ ...prev, profileImage: imageDataUrl }))
    } catch (error) {
      alert("Failed to upload image. Please try again.")
    }
  }

  const formatIDRPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
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

  // Navigation Card Functions
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

  // Big Brands Functions
  const addBigBrandsSection = (type: BigBrandsSection["type"]) => {
    const newSection: BigBrandsSection = {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: type === "text" ? "Enter your content here..." : undefined,
      features:
        type === "feature" ? [{ title: "Feature Title", description: "Feature description", icon: "star" }] : undefined,
      stats: type === "stat" ? [{ label: "Stat Label", value: "100+", color: "blue" }] : undefined,
      ctaText: type === "cta" ? "Call to Action" : undefined,
      ctaDescription: type === "cta" ? "CTA description..." : undefined,
      order: bigBrandsContent.sections.length + 1,
    }

    setBigBrandsContent((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection].sort((a, b) => a.order - b.order),
    }))
  }

  const removeBigBrandsSection = (id: string) => {
    setBigBrandsContent((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== id),
    }))
  }

  const updateBigBrandsSection = (id: string, updates: Partial<BigBrandsSection>) => {
    setBigBrandsContent((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === id ? { ...section, ...updates } : section)),
    }))
  }

  // Category Functions
  const addCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: AffiliateCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      createdAt: new Date().toISOString(),
    }

    setAffiliateCategories((prev) => [...prev, newCategory])
    setNewCategoryName("")
    setShowCategoryModal(false)
  }

  const removeCategory = (id: string) => {
    setAffiliateCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  // Country Code Functions
  const toggleCountryCode = (code: string) => {
    setCountryCodes((prev) =>
      prev.map((country) => (country.code === code ? { ...country, enabled: !country.enabled } : country)),
    )
  }

  // Modal Components
  const AffiliateModal = () => {
    const [formData, setFormData] = useState(
      editingAffiliate || {
        title: "",
        description: "",
        image: "",
        affiliateUrl: "",
        category: "",
        priceIDR: 0,
        priceAttribute: "",
      },
    )

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (editingAffiliate) {
        setAffiliateContent((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.id === editingAffiliate.id ? { ...formData, id: editingAffiliate.id } : item,
          ),
        }))
      } else {
        const newItem = { ...formData, id: Date.now().toString() }
        setAffiliateContent((prev) => ({
          ...prev,
          items: [...prev.items, newItem],
        }))
      }
      setShowAffiliateModal(false)
      setEditingAffiliate(null)
    }

    const handleImageUpload = async (file: File) => {
      if (!validateImageFile(file)) return

      try {
        const imageDataUrl = await handleFileUpload(file)
        setFormData((prev) => ({ ...prev, image: imageDataUrl }))
      } catch (error) {
        alert("Failed to upload image. Please try again.")
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">{editingAffiliate ? "Edit Product" : "Add New Product"}</h3>
            <button
              onClick={() => {
                setShowAffiliateModal(false)
                setEditingAffiliate(null)
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="flex space-x-2">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {affiliateCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                  id="product-image-upload"
                />
                <label htmlFor="product-image-upload" className="cursor-pointer">
                  {formData.image ? (
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className="text-gray-600">Click to upload image</p>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate URL</label>
              <input
                type="url"
                value={formData.affiliateUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, affiliateUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR)</label>
                <input
                  type="number"
                  value={formData.priceIDR}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priceIDR: Number.parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{formatIDRPrice(formData.priceIDR)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Attribute</label>
                <select
                  value={formData.priceAttribute}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priceAttribute: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select attribute</option>
                  {affiliatePriceAttributes.map((attr) => (
                    <option key={attr.id} value={attr.name}>
                      {attr.icon} {attr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAffiliateModal(false)
                  setEditingAffiliate(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                {editingAffiliate ? "Update" : "Add"} Product
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const CategoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Add New Category</h3>
          <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={addCategory}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const CountryCodeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Manage Country Codes</h3>
          <button onClick={() => setShowCountryModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Enable or disable country codes that will be available in the UMKM form phone number selector.
          </p>
        </div>

        <div className="space-y-2">
          {countryCodes.map((country) => (
            <div key={country.code} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <div className="font-medium text-gray-900">{country.name}</div>
                  <div className="text-sm text-gray-500">{country.dialCode}</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={country.enabled}
                  onChange={() => toggleCountryCode(country.code)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowCountryModal(false)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Show loading spinner if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
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
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Content Management System</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/inquiries"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquiries</span>
              </Link>
              <Link
                href="/admin/umkm"
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
              >
                <Package className="w-4 h-4" />
                <span>UMKM Orders</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Site</span>
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save All"}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Sections</h2>
              <nav className="space-y-2">
                {[
                  { id: "home", label: "Homepage", icon: Home, description: "Main page content" },
                  { id: "homepage-cards", label: "Homepage Cards", icon: Edit, description: "Navigation cards" },
                  { id: "bigbrands", label: "Big Brands", icon: Building2, description: "Enterprise partnerships" },
                  { id: "affiliate", label: "Affiliate", icon: ShoppingBag, description: "Product recommendations" },
                  {
                    id: "umkm-content",
                    label: "UMKM Content",
                    icon: FileText,
                    description: "UMKM page content & text",
                  },
                  { id: "umkm-settings", label: "UMKM Settings", icon: Globe, description: "Phone & country settings" },
                  {
                    id: "whatsapp-templates",
                    label: "WhatsApp Templates",
                    icon: Phone,
                    description: "Message templates",
                  },
                  {
                    id: "invoice-template",
                    label: "Invoice Template",
                    icon: CreditCard,
                    description: "Customize invoice design",
                  },
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
            {activeTab === "home" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Homepage Content</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={homeContent.name}
                        onChange={(e) => setHomeContent((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleProfileImageUpload(e.target.files[0])}
                          className="hidden"
                          id="profile-image-upload"
                        />
                        <label htmlFor="profile-image-upload" className="cursor-pointer">
                          {homeContent.profileImage && !homeContent.profileImage.includes("placeholder") ? (
                            <img
                              src={homeContent.profileImage || "/placeholder.svg"}
                              alt="Profile"
                              className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
                            />
                          ) : (
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          )}
                          <p className="text-gray-600">Click to upload profile image</p>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={homeContent.title}
                      onChange={(e) => setHomeContent((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={homeContent.bio}
                      onChange={(e) => setHomeContent((prev) => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "homepage-cards" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Edit className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Homepage Navigation Cards</h2>
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

            {activeTab === "bigbrands" && (
              <div className="space-y-6">
                {/* Header Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Big Brands Page</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                      <input
                        type="text"
                        value={bigBrandsContent.title}
                        onChange={(e) => setBigBrandsContent((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={bigBrandsContent.subtitle}
                        onChange={(e) => setBigBrandsContent((prev) => ({ ...prev, subtitle: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                      <input
                        type="text"
                        value={bigBrandsContent.whatsappNumber}
                        onChange={(e) => setBigBrandsContent((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                      <input
                        type="text"
                        value={bigBrandsContent.responseTime}
                        onChange={(e) => setBigBrandsContent((prev) => ({ ...prev, responseTime: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Add Section Buttons */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Section</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => addBigBrandsSection("text")}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      + Text Section
                    </button>
                    <button
                      onClick={() => addBigBrandsSection("feature")}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      + Feature Section
                    </button>
                    <button
                      onClick={() => addBigBrandsSection("stat")}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      + Statistics Section
                    </button>
                    <button
                      onClick={() => addBigBrandsSection("cta")}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      + CTA Section
                    </button>
                  </div>
                </div>

                {/* Dynamic Sections */}
                <div className="space-y-4">
                  {bigBrandsContent.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeBigBrandsSection(section.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                            <input
                              type="text"
                              value={section.title || ""}
                              onChange={(e) => updateBigBrandsSection(section.id, { title: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          {section.type === "text" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                              <textarea
                                value={section.content || ""}
                                onChange={(e) => updateBigBrandsSection(section.id, { content: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                              />
                            </div>
                          )}

                          {section.type === "cta" && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                                <input
                                  type="text"
                                  value={section.ctaText || ""}
                                  onChange={(e) => updateBigBrandsSection(section.id, { ctaText: e.target.value })}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Description</label>
                                <textarea
                                  value={section.ctaDescription || ""}
                                  onChange={(e) =>
                                    updateBigBrandsSection(section.id, { ctaDescription: e.target.value })
                                  }
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "affiliate" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Affiliate Products</h2>
                  </div>
                  <button
                    onClick={() => setShowAffiliateModal(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                    <input
                      type="text"
                      value={affiliateContent.title}
                      onChange={(e) => setAffiliateContent((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Description</label>
                    <textarea
                      value={affiliateContent.description}
                      onChange={(e) => setAffiliateContent((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-24 resize-none"
                    />
                  </div>
                </div>

                {/* Categories Management */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                    <button
                      onClick={() => setShowCategoryModal(true)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      + Add Category
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {affiliateCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm">{category.name}</span>
                        <button onClick={() => removeCategory(category.id)} className="text-red-500 hover:text-red-700">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Products ({affiliateContent.items.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {affiliateContent.items.map((item) => {
                      const priceAttr = affiliatePriceAttributes.find((attr) => attr.name === item.priceAttribute)
                      return (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                            {priceAttr && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full bg-${priceAttr.color}-100 text-${priceAttr.color}-800`}
                              >
                                {priceAttr.icon} {priceAttr.name}
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-blue-600 mb-3">{formatIDRPrice(item.priceIDR || 0)}</div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingAffiliate(item)
                                setShowAffiliateModal(true)
                              }}
                              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center space-x-1"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setAffiliateContent((prev) => ({
                                  ...prev,
                                  items: prev.items.filter((i) => i.id !== item.id),
                                }))
                              }}
                              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "umkm-content" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">UMKM Content Management</h2>
                </div>

                <div className="space-y-8">
                  {/* Page Header */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Page Header</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                        <input
                          type="text"
                          value={umkmContent.title}
                          onChange={(e) => setUmkmContent((prev) => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                        <input
                          type="text"
                          value={umkmContent.whatsappNumber}
                          onChange={(e) => setUmkmContent((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Description</label>
                      <textarea
                        value={umkmContent.description}
                        onChange={(e) => setUmkmContent((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                      />
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Form Field Labels
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name Field Label</label>
                        <input
                          type="text"
                          value={umkmContent.formFields.nameLabel}
                          onChange={(e) =>
                            setUmkmContent((prev) => ({
                              ...prev,
                              formFields: { ...prev.formFields, nameLabel: e.target.value },
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name Field Placeholder</label>
                        <input
                          type="text"
                          value={umkmContent.formFields.namePlaceholder}
                          onChange={(e) =>
                            setUmkmContent((prev) => ({
                              ...prev,
                              formFields: { ...prev.formFields, namePlaceholder: e.target.value },
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand Field Label</label>
                        <input
                          type="text"
                          value={umkmContent.formFields.brandLabel}
                          onChange={(e) =>
                            setUmkmContent((prev) => ({
                              ...prev,
                              formFields: { ...prev.formFields, brandLabel: e.target.value },
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand Field Placeholder</label>
                        <input
                          type="text"
                          value={umkmContent.formFields.brandPlaceholder}
                          onChange={(e) =>
                            setUmkmContent((prev) => ({
                              ...prev,
                              formFields: { ...prev.formFields, brandPlaceholder: e.target.value },
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Endorsement Types */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Endorsement Types
                      </h3>
                      <button
                        onClick={() => {
                          const newType = {
                            value: `type-${Date.now()}`,
                            label: "New Package",
                            price: 500000,
                            description: "Package description",
                          }
                          setUmkmContent((prev) => ({
                            ...prev,
                            formFields: {
                              ...prev.formFields,
                              endorsementTypes: [...prev.formFields.endorsementTypes, newType],
                            },
                          }))
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        + Add Type
                      </button>
                    </div>

                    <div className="space-y-4">
                      {umkmContent.formFields.endorsementTypes.map((type, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-900">Package {index + 1}</h4>
                            {umkmContent.formFields.endorsementTypes.length > 1 && (
                              <button
                                onClick={() => {
                                  setUmkmContent((prev) => ({
                                    ...prev,
                                    formFields: {
                                      ...prev.formFields,
                                      endorsementTypes: prev.formFields.endorsementTypes.filter((_, i) => i !== index),
                                    },
                                  }))
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Value (ID)</label>
                              <input
                                type="text"
                                value={type.value}
                                onChange={(e) => {
                                  const newTypes = [...umkmContent.formFields.endorsementTypes]
                                  newTypes[index] = { ...newTypes[index], value: e.target.value }
                                  setUmkmContent((prev) => ({
                                    ...prev,
                                    formFields: { ...prev.formFields, endorsementTypes: newTypes },
                                  }))
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                              <input
                                type="text"
                                value={type.label}
                                onChange={(e) => {
                                  const newTypes = [...umkmContent.formFields.endorsementTypes]
                                  newTypes[index] = { ...newTypes[index], label: e.target.value }
                                  setUmkmContent((prev) => ({
                                    ...prev,
                                    formFields: { ...prev.formFields, endorsementTypes: newTypes },
                                  }))
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Price (IDR)</label>
                              <input
                                type="number"
                                value={type.price}
                                onChange={(e) => {
                                  const newTypes = [...umkmContent.formFields.endorsementTypes]
                                  newTypes[index] = { ...newTypes[index], price: Number.parseInt(e.target.value) || 0 }
                                  setUmkmContent((prev) => ({
                                    ...prev,
                                    formFields: { ...prev.formFields, endorsementTypes: newTypes },
                                  }))
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <p className="text-sm text-gray-500 mt-1">{formatIDRPrice(type.price)}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <input
                                type="text"
                                value={type.description}
                                onChange={(e) => {
                                  const newTypes = [...umkmContent.formFields.endorsementTypes]
                                  newTypes[index] = { ...newTypes[index], description: e.target.value }
                                  setUmkmContent((prev) => ({
                                    ...prev,
                                    formFields: { ...prev.formFields, endorsementTypes: newTypes },
                                  }))
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "umkm-settings" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">UMKM Settings</h2>
                  </div>
                  <button
                    onClick={() => setShowCountryModal(true)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Manage Countries</span>
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Country Codes Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phone Number Country Codes</h3>
                    <p className="text-gray-600 mb-6">
                      Configure which country codes are available in the UMKM form phone number selector.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {countryCodes
                        .filter((country) => country.enabled)
                        .map((country) => (
                          <div
                            key={country.code}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-green-50"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{country.flag}</span>
                              <div>
                                <div className="font-medium text-gray-900">{country.name}</div>
                                <div className="text-sm text-gray-500">{country.dialCode}</div>
                              </div>
                            </div>
                            <div className="text-green-600">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          </div>
                        ))}
                    </div>

                    {countryCodes.filter((country) => !country.enabled).length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Disabled Countries</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {countryCodes
                            .filter((country) => !country.enabled)
                            .slice(0, 6)
                            .map((country) => (
                              <div
                                key={country.code}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl opacity-50">{country.flag}</span>
                                  <div>
                                    <div className="font-medium text-gray-500">{country.name}</div>
                                    <div className="text-sm text-gray-400">{country.dialCode}</div>
                                  </div>
                                </div>
                                <div className="text-gray-400">
                                  <X className="w-5 h-5" />
                                </div>
                              </div>
                            ))}
                        </div>
                        {countryCodes.filter((country) => !country.enabled).length > 6 && (
                          <p className="text-sm text-gray-500 mt-2">
                            +{countryCodes.filter((country) => !country.enabled).length - 6} more disabled countries
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">
                          {countryCodes.filter((c) => c.enabled).length}
                        </div>
                        <div className="text-sm text-blue-700">Enabled Countries</div>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">
                          {
                            countryCodes.filter(
                              (c) => c.enabled && ["ID", "MY", "SG", "TH", "PH", "VN"].includes(c.code),
                            ).length
                          }
                        </div>
                        <div className="text-sm text-green-700">SEA Countries</div>
                      </div>
                      <div className="bg-purple-50 p-6 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">{countryCodes.length}</div>
                        <div className="text-sm text-purple-700">Total Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "whatsapp-templates" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">WhatsApp Message Templates</h2>
                </div>

                <div className="space-y-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="font-medium text-blue-800 mb-3">Available Variables</h4>
                    <div className="text-sm text-blue-700 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p>
                            <code className="bg-blue-100 px-2 py-1 rounded">{"{customerName}"}</code> - Customer's name
                          </p>
                          <p>
                            <code className="bg-blue-100 px-2 py-1 rounded">{"{orderId}"}</code> - Order ID
                          </p>
                          <p>
                            <code className="bg-blue-100 px-2 py-1 rounded">{"{brandName}"}</code> - Brand name
                          </p>
                          <p>
                            <code className="bg-blue-100 px-2 py-1 rounded">{"{status}"}</code> - Order status
                          </p>
                        </div>
                        <div>
                          <p>
                            <code className="bg-blue-100 px-2 py-1 rounded">{"{totalAmount}"}</code> - Total amount
                          </p>
                          <p>
                            <code className="bg-blue-100 px-2 py-1 rounded">{"{orderDate}"}</code> - Order date
                          </p>
                          <p>
                            <code className="bg-blue-100 px-2 py-1 rounded">{"{scheduledDate}"}</code> - Scheduled date
                          </p>
                          <p>
                            <code className="bg-blue-100 px-2 py-1 rounded">{"{notes}"}</code> - Staff notes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">UMKM Order Confirmation</label>
                      <textarea
                        value={whatsappTemplates.umkmConfirmation}
                        onChange={(e) =>
                          setWhatsappTemplates((prev) => ({ ...prev, umkmConfirmation: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none font-mono text-sm"
                        placeholder="Enter UMKM confirmation message template..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This template is used when confirming new UMKM orders.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">UMKM Status Update</label>
                      <textarea
                        value={whatsappTemplates.umkmStatusUpdate}
                        onChange={(e) =>
                          setWhatsappTemplates((prev) => ({ ...prev, umkmStatusUpdate: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none font-mono text-sm"
                        placeholder="Enter status update message template..."
                      />
                      <p className="text-xs text-gray-500 mt-2">This template is used when updating order status.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Reminder</label>
                      <textarea
                        value={whatsappTemplates.umkmPaymentReminder}
                        onChange={(e) =>
                          setWhatsappTemplates((prev) => ({ ...prev, umkmPaymentReminder: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none font-mono text-sm"
                        placeholder="Enter payment reminder message template..."
                      />
                      <p className="text-xs text-gray-500 mt-2">This template is used for payment reminders.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Big Brands Inquiry Response
                      </label>
                      <textarea
                        value={whatsappTemplates.bigBrandsInquiry}
                        onChange={(e) =>
                          setWhatsappTemplates((prev) => ({ ...prev, bigBrandsInquiry: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none font-mono text-sm"
                        placeholder="Enter big brands inquiry response template..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This template is used for responding to big brands inquiries.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">General Inquiry Response</label>
                      <textarea
                        value={whatsappTemplates.generalInquiry}
                        onChange={(e) => setWhatsappTemplates((prev) => ({ ...prev, generalInquiry: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none font-mono text-sm"
                        placeholder="Enter general inquiry response template..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This template is used for general inquiries and contact form responses.
                      </p>
                    </div>
                  </div>

                  {/* Template Preview */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="bg-white rounded-lg p-4 max-w-md">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Phone className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-gray-900">WhatsApp Message</span>
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {whatsappTemplates.umkmConfirmation
                            .replace(/{customerName}/g, "John Doe")
                            .replace(/{orderId}/g, "SMB0725001")
                            .replace(/{brandName}/g, "Sample Brand")
                            .replace(/{status}/g, "Payment Confirmed")
                            .replace(/{totalAmount}/g, "1,000,000")
                            .replace(/{orderDate}/g, "January 15, 2024")
                            .replace(/{scheduledDate}/g, "Scheduled for: January 20, 2024")
                            .replace(/{notes}/g, "Content creation in progress")
                            .replace(/{senderName}/g, "Alex Johnson")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "invoice-template" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Invoice Template Customization</h2>
                </div>

                <div className="space-y-8">
                  {/* Company Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={invoiceTemplate.companyName}
                          onChange={(e) => setInvoiceTemplate((prev) => ({ ...prev, companyName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Tagline</label>
                        <input
                          type="text"
                          value={invoiceTemplate.companyTagline}
                          onChange={(e) => setInvoiceTemplate((prev) => ({ ...prev, companyTagline: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
                        <input
                          type="email"
                          value={invoiceTemplate.companyEmail}
                          onChange={(e) => setInvoiceTemplate((prev) => ({ ...prev, companyEmail: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
                        <input
                          type="text"
                          value={invoiceTemplate.companyPhone}
                          onChange={(e) => setInvoiceTemplate((prev) => ({ ...prev, companyPhone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visual Customization */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Visual Customization
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex space-x-3">
                          <input
                            type="color"
                            value={invoiceTemplate.colors.primary}
                            onChange={(e) =>
                              setInvoiceTemplate((prev) => ({
                                ...prev,
                                colors: { ...prev.colors, primary: e.target.value },
                              }))
                            }
                            className="w-12 h-12 border border-gray-200 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={invoiceTemplate.colors.primary}
                            onChange={(e) =>
                              setInvoiceTemplate((prev) => ({
                                ...prev,
                                colors: { ...prev.colors, primary: e.target.value },
                              }))
                            }
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Preview</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto shadow-sm">
                        {/* Invoice Header */}
                        <div
                          className="flex justify-between items-start mb-6 pb-4"
                          style={{ borderBottom: `3px solid ${invoiceTemplate.colors.primary}` }}
                        >
                          <div>
                            <h1 className="text-2xl font-bold" style={{ color: invoiceTemplate.colors.primary }}>
                              {invoiceTemplate.companyName}
                            </h1>
                            <p className="text-sm" style={{ color: invoiceTemplate.colors.secondary }}>
                              {invoiceTemplate.companyTagline}
                            </p>
                          </div>
                          <div className="text-right">
                            <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
                            <p className="text-sm" style={{ color: invoiceTemplate.colors.secondary }}>
                              Invoice #: SMB0725001
                            </p>
                            <p className="text-sm" style={{ color: invoiceTemplate.colors.secondary }}>
                              Date: January 15, 2024
                            </p>
                          </div>
                        </div>

                        {/* Sample Content */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                            <p className="text-sm text-gray-700">John Doe</p>
                            <p className="text-sm text-gray-700">Sample Brand</p>
                            <p className="text-sm text-gray-700">@samplebrand</p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Order Information:</h3>
                            <p className="text-sm text-gray-700">Order ID: SMB0725001</p>
                            <p className="text-sm text-gray-700">Products: 1</p>
                            <p className="text-sm text-gray-700">Payment: Bank Transfer</p>
                          </div>
                        </div>

                        {/* Sample Table */}
                        <div className="mb-6">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr style={{ backgroundColor: "#F3F4F6", color: invoiceTemplate.colors.primary }}>
                                <th className="text-left p-3 text-sm font-semibold">Description</th>
                                <th className="text-left p-3 text-sm font-semibold">Package</th>
                                <th className="text-right p-3 text-sm font-semibold">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                                <td className="p-3 text-sm">Sample Product Description</td>
                                <td className="p-3 text-sm">Premium Package</td>
                                <td
                                  className="p-3 text-sm text-right font-semibold"
                                  style={{ color: invoiceTemplate.colors.primary }}
                                >
                                  Rp 1,000,000
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Total */}
                        <div className="flex justify-end mb-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center text-lg font-bold">
                              <span>Total:</span>
                              <span style={{ color: invoiceTemplate.colors.primary }}>Rp 1,000,000</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center border-t border-gray-200 pt-4">
                          <p className="font-semibold text-gray-900">Thank you for choosing UMKM Partnership!</p>
                          <p className="text-sm" style={{ color: invoiceTemplate.colors.secondary }}>
                            For questions about this invoice, please contact us at {invoiceTemplate.companyPhone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAffiliateModal && <AffiliateModal />}
      {showCategoryModal && <CategoryModal />}
      {showCountryModal && <CountryCodeModal />}
    </div>
  )
}
