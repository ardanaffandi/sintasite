"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Search,
  Check,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Calendar,
  Edit,
  User,
  Building2,
  Instagram,
  Phone,
  Mail,
} from "lucide-react"

interface TrackingOrder {
  id: string
  orderId: string
  customerName: string
  brandName: string
  instagram: string
  phone?: string
  email?: string
  products: Array<{
    id: string
    description: string
    endorsementType: string
    endorseMonth: string
    price: number
  }>
  totalAmount: number
  status:
    | "payment_confirmation"
    | "payment_confirmed"
    | "item_received"
    | "scheduled_shoot"
    | "final_editing"
    | "post_scheduled"
    | "posted"
    | "cancelled"
  createdAt: string
  scheduledDate?: string
  notes?: string
  priority?: "low" | "medium" | "high"
  expiresAt?: string
  cancelledAt?: string
}

interface UMKMContent {
  trackingSection: {
    title: string
    description: string
    buttonText: string
    placeholderText: string
    trackButtonText: string
  }
}

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("")
  const [trackingResult, setTrackingResult] = useState<TrackingOrder | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<UMKMContent>({
    trackingSection: {
      title: "Track Your Endorsement",
      description: "Enter your order ID to track your endorsement progress",
      buttonText: "Track Your Endorsement",
      placeholderText: "Enter Order ID (e.g., SMB0725001)",
      trackButtonText: "Track Order",
    },
  })

  const searchParams = useSearchParams()

  // --- NEW (mount-only) EFFECT: load CMS content once -------------
  useEffect(() => {
    const savedContent = localStorage.getItem("umkmContent")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        setContent({
          trackingSection: parsed.trackingSection ?? content.trackingSection,
        })
      } catch {
        /* ignore corrupt JSON */
      }
    }
  }, []) //  ←  run only once on mount

  // --- NEW EFFECT: react to ?orderId= in the url ------------------
  const orderIdParam = searchParams.get("orderId") ?? ""

  useEffect(() => {
    if (orderIdParam && orderIdParam !== trackingId) {
      setTrackingId(orderIdParam)
      handleTracking(orderIdParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderIdParam]) //  ←  depends on the *primitive* string, not the entire searchParams object

  const getStatusSteps = (currentStatus: string) => {
    const allSteps = [
      { id: "payment_confirmation", label: "Payment Confirmation", icon: AlertCircle },
      { id: "payment_confirmed", label: "Payment Confirmed", icon: CheckCircle },
      { id: "item_received", label: "Item Received", icon: Package },
      { id: "scheduled_shoot", label: "Scheduled for Shoot", icon: Calendar },
      { id: "final_editing", label: "Final Editing", icon: Edit },
      { id: "post_scheduled", label: "Post Scheduled", icon: Clock },
      { id: "posted", label: "Posted", icon: CheckCircle },
    ]

    const currentIndex = allSteps.findIndex((step) => step.id === currentStatus)

    return allSteps.map((step, index) => ({
      ...step,
      status:
        currentStatus === "cancelled"
          ? "cancelled"
          : index < currentIndex
            ? "completed"
            : index === currentIndex
              ? "current"
              : "pending",
      date: index <= currentIndex ? new Date().toLocaleDateString() : "",
    }))
  }

  const handleTracking = async (orderIdToTrack?: string) => {
    const idToSearch = orderIdToTrack || trackingId
    if (!idToSearch.trim()) {
      setError("Please enter an order ID")
      return
    }

    setLoading(true)
    setError("")
    setTrackingResult(null)

    try {
      // Get orders from localStorage
      const savedOrders = localStorage.getItem("umkmOrders")
      if (!savedOrders) {
        setError("No orders found in the system")
        setLoading(false)
        return
      }

      const orders = JSON.parse(savedOrders)
      const foundOrder = orders.find((order: any) => order.orderId.toLowerCase() === idToSearch.toLowerCase())

      if (!foundOrder) {
        setError("Order not found. Please check your order ID and try again.")
        setLoading(false)
        return
      }

      // Convert the order to tracking format
      const trackingOrder: TrackingOrder = {
        id: foundOrder.id,
        orderId: foundOrder.orderId,
        customerName: foundOrder.customerName,
        brandName: foundOrder.brandName,
        instagram: foundOrder.instagram,
        phone: foundOrder.phone,
        email: foundOrder.email,
        products: foundOrder.products,
        totalAmount: foundOrder.totalAmount,
        status: foundOrder.status,
        createdAt: foundOrder.createdAt,
        scheduledDate: foundOrder.scheduledDate,
        notes: foundOrder.notes,
        priority: foundOrder.priority,
        expiresAt: foundOrder.expiresAt,
        cancelledAt: foundOrder.cancelledAt,
      }

      setTrackingResult(trackingOrder)
    } catch (err) {
      setError("An error occurred while searching for your order")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white"
      case "current":
        return "bg-blue-500 text-white"
      case "cancelled":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-200 text-gray-500"
    }
  }

  const getStatusIcon = (status: TrackingOrder["status"]) => {
    switch (status) {
      case "payment_confirmation":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "payment_confirmed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case "item_received":
        return <Package className="w-4 h-4 text-purple-500" />
      case "scheduled_shoot":
        return <Calendar className="w-4 h-4 text-orange-500" />
      case "final_editing":
        return <Edit className="w-4 h-4 text-indigo-500" />
      case "post_scheduled":
        return <Clock className="w-4 h-4 text-pink-500" />
      case "posted":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const formatIDRPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6 md:mb-8">
          <Link
            href="/umkm"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm md:text-base">Back to UMKM</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Search Section */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <div className="text-center mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{content.trackingSection.title}</h1>
              <p className="text-gray-600 text-sm md:text-base">{content.trackingSection.description}</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder={content.trackingSection.placeholderText}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleTracking()}
                disabled={!trackingId.trim() || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>{content.trackingSection.trackButtonText}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {trackingResult && (
            <div className="p-6 md:p-8">
              {/* Order Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-blue-900">Order #{trackingResult.orderId}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(trackingResult.status)}
                    <span className="text-sm font-medium text-blue-800 capitalize">
                      {trackingResult.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Customer:</span>
                    <div className="text-blue-900">{trackingResult.customerName}</div>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Brand:</span>
                    <div className="text-blue-900">{trackingResult.brandName}</div>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Total:</span>
                    <div className="text-blue-900 font-bold">{formatIDRPrice(trackingResult.totalAmount)}</div>
                  </div>
                </div>

                {trackingResult.expiresAt && trackingResult.status === "payment_confirmation" && (
                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-yellow-800 text-sm font-medium">
                      ⚠️ Payment expires: {new Date(trackingResult.expiresAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Timeline */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Progress Timeline</h4>
                <div className="space-y-4">
                  {getStatusSteps(trackingResult.status).map((step, index) => {
                    const IconComponent = step.icon
                    return (
                      <div key={step.id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}
                          >
                            {step.status === "completed" ? (
                              <Check className="w-4 h-4" />
                            ) : step.status === "cancelled" ? (
                              <AlertCircle className="w-4 h-4" />
                            ) : (
                              <IconComponent className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{step.label}</p>
                            {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
                          </div>
                          {step.status === "current" && trackingResult.scheduledDate && (
                            <p className="text-xs text-blue-600 mt-1">
                              Scheduled: {new Date(trackingResult.scheduledDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Customer Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Customer Information
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{trackingResult.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span>{trackingResult.brandName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Instagram className="w-4 h-4 text-gray-500" />
                      <span>{trackingResult.instagram}</span>
                    </div>
                    {trackingResult.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{trackingResult.phone}</span>
                      </div>
                    )}
                    {trackingResult.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{trackingResult.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-green-500" />
                    Order Summary
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{new Date(trackingResult.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-medium">{trackingResult.products.length} item(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-green-600">{formatIDRPrice(trackingResult.totalAmount)}</span>
                    </div>
                    {trackingResult.priority && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trackingResult.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : trackingResult.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {trackingResult.priority.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Products ({trackingResult.products.length})
                </h4>
                <div className="space-y-4">
                  {trackingResult.products.map((product, index) => (
                    <div key={product.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="font-semibold text-gray-900">Product {index + 1}</h5>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {formatIDRPrice(product.price)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Description:</span>
                          <p className="text-gray-900 mt-1">{product.description}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <p className="text-gray-900 mt-1 capitalize">{product.endorsementType.replace("_", " ")}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Month:</span>
                          <p className="text-gray-900 mt-1">
                            {new Date(product.endorseMonth + "-01").toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {trackingResult.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Latest Update
                  </h4>
                  <p className="text-yellow-800 text-sm">{trackingResult.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
