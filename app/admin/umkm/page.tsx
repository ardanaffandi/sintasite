"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Download,
  Eye,
  Edit,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  User,
  Building2,
  Instagram,
  MessageSquare,
  Phone,
  Mail,
  Camera,
  FileText,
} from "lucide-react"

interface UMKMOrder {
  id: string
  orderId: string
  customerName: string
  brandName: string
  instagram: string
  email?: string
  phone?: string
  products: Array<{
    id: string
    description: string
    endorsementType: string
    endorseMonth: string
    price: number
    photo?: string
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

export default function UMKMAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<UMKMOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<UMKMOrder | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      loadOrders()
      // Check for expired orders
      checkExpiredOrders()
    } else {
      router.push("/login")
    }
  }, [router])

  const loadOrders = () => {
    const savedOrders = localStorage.getItem("umkmOrders")
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders)
      // Normalize orders to ensure they have all required fields
      const normalizedOrders = parsedOrders.map((order: any) => ({
        ...order,
        totalAmount: order.totalAmount || order.total || 0,
        priority: order.priority || "medium",
        email: order.email || "",
        phone: order.phone || "",
      }))
      setOrders(normalizedOrders)
    }
  }

  const checkExpiredOrders = () => {
    const savedOrders = localStorage.getItem("umkmOrders")
    if (savedOrders) {
      const orders = JSON.parse(savedOrders)
      const now = new Date()
      let hasUpdates = false

      const updatedOrders = orders.map((order: any) => {
        if (order.status === "payment_confirmation" && order.expiresAt) {
          const expiryDate = new Date(order.expiresAt)
          if (now > expiryDate) {
            hasUpdates = true
            return {
              ...order,
              status: "cancelled",
              notes: "Order automatically cancelled due to non-payment within 48 hours",
              cancelledAt: now.toISOString(),
            }
          }
        }
        return order
      })

      if (hasUpdates) {
        localStorage.setItem("umkmOrders", JSON.stringify(updatedOrders))
        setOrders(updatedOrders)
      }
    }
  }

  const saveOrders = (updatedOrders: UMKMOrder[]) => {
    setOrders(updatedOrders)
    localStorage.setItem("umkmOrders", JSON.stringify(updatedOrders))
  }

  const updateOrderStatus = (orderId: string, status: UMKMOrder["status"]) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status, lastUpdated: new Date().toISOString() } : order,
    )
    saveOrders(updatedOrders)
  }

  const updateOrderField = (orderId: string, field: string, value: any) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, [field]: value, lastUpdated: new Date().toISOString() } : order,
    )
    saveOrders(updatedOrders)
  }

  const sendWhatsAppUpdate = (order: UMKMOrder) => {
    const templates = JSON.parse(localStorage.getItem("whatsappTemplates") || "{}")
    const template =
      templates.umkmConfirmation ||
      `Hi {customerName}! 

Update on your UMKM Partnership order {orderId}:

Current Status: {status}
{scheduledDate}
{notes}

We'll keep you updated on the progress. Thank you for your partnership!`

    const message = template
      .replace("{customerName}", order.customerName)
      .replace("{orderId}", order.orderId)
      .replace("{status}", order.status.replace("_", " ").toUpperCase())
      .replace("{scheduledDate}", order.scheduledDate ? `Scheduled Date: ${order.scheduledDate}` : "")
      .replace("{notes}", order.notes ? `Notes: ${order.notes}` : "")

    const encodedMessage = encodeURIComponent(message)
    const phoneNumber = order.phone || "6281234567890"
    window.open(`https://wa.me/${phoneNumber.replace("+", "")}?text=${encodedMessage}`, "_blank")
  }

  const getStatusIcon = (status: UMKMOrder["status"]) => {
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

  const getStatusColor = (status: UMKMOrder["status"]) => {
    switch (status) {
      case "payment_confirmation":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "payment_confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "item_received":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "scheduled_shoot":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "final_editing":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "post_scheduled":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "posted":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.instagram.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const OrderModal = () => {
    if (!selectedOrder) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Order {selectedOrder.orderId}</h3>
                <p className="text-gray-600">
                  {selectedOrder.customerName} • {selectedOrder.brandName}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.replace("_", " ").toUpperCase()}
                </span>
                <button onClick={() => setShowOrderModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Customer Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Customer Information
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.brandName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Instagram className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.instagram}</span>
                    </div>
                    {selectedOrder.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{selectedOrder.email}</span>
                      </div>
                    )}
                    {selectedOrder.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{selectedOrder.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-500" />
                    Order Details
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-green-600">Rp {selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedOrder.priority || "medium")}`}
                      >
                        {(selectedOrder.priority || "medium").toUpperCase()}
                      </span>
                    </div>
                    {selectedOrder.expiresAt && selectedOrder.status === "payment_confirmation" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span className="text-red-600 font-medium">
                          {new Date(selectedOrder.expiresAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-500" />
                    Status Management
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as UMKMOrder["status"]
                          updateOrderStatus(selectedOrder.id, newStatus)
                          setSelectedOrder({ ...selectedOrder, status: newStatus })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="payment_confirmation">Payment Confirmation</option>
                        <option value="payment_confirmed">Payment Confirmed</option>
                        <option value="item_received">Item Received</option>
                        <option value="scheduled_shoot">Scheduled for Shoot</option>
                        <option value="final_editing">Final Editing</option>
                        <option value="post_scheduled">Post Scheduled</option>
                        <option value="posted">Posted</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={selectedOrder.priority || "medium"}
                        onChange={(e) => {
                          updateOrderField(selectedOrder.id, "priority", e.target.value)
                          setSelectedOrder({ ...selectedOrder, priority: e.target.value as any })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {(selectedOrder.status === "scheduled_shoot" || selectedOrder.scheduledDate) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                        <input
                          type="date"
                          value={selectedOrder.scheduledDate || ""}
                          onChange={(e) => {
                            updateOrderField(selectedOrder.id, "scheduledDate", e.target.value)
                            setSelectedOrder({ ...selectedOrder, scheduledDate: e.target.value })
                          }}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Staff Notes</label>
                      <textarea
                        value={selectedOrder.notes || ""}
                        onChange={(e) => {
                          updateOrderField(selectedOrder.id, "notes", e.target.value)
                          setSelectedOrder({ ...selectedOrder, notes: e.target.value })
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                        placeholder="Add notes about this order (visible to customer in tracking)..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-500" />
                Products ({selectedOrder.products.length})
              </h4>
              <div className="space-y-4">
                {selectedOrder.products.map((product, index) => (
                  <div key={product.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="font-semibold text-gray-900">Product {index + 1}</h5>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Rp {product.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{product.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endorsement Type</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{product.endorsementType}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endorse Month</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{product.endorseMonth}</p>
                      </div>
                      {product.photo && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Photo</label>
                          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                            <Camera className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Photo uploaded</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => sendWhatsAppUpdate(selectedOrder)}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Send WhatsApp Update</span>
              </button>
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
              <h1 className="text-xl font-semibold text-gray-900">UMKM Orders</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{filteredOrders.length} orders</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="payment_confirmation">Payment Confirmation</option>
              <option value="payment_confirmed">Payment Confirmed</option>
              <option value="item_received">Item Received</option>
              <option value="scheduled_shoot">Scheduled Shoot</option>
              <option value="final_editing">Final Editing</option>
              <option value="post_scheduled">Post Scheduled</option>
              <option value="posted">Posted</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <button className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Order</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{order.orderId}</div>
                        <div className="text-sm text-gray-500">{order.products.length} products</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.brandName}</div>
                        <div className="text-sm text-blue-600">{order.instagram}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                        >
                          {order.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">Rp {order.totalAmount.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority || "medium")}`}
                      >
                        {(order.priority || "medium").toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                      {order.expiresAt && order.status === "payment_confirmation" && (
                        <div className="text-xs text-red-600">
                          Expires: {new Date(order.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderModal(true)
                          }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => sendWhatsAppUpdate(order)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          title="Send WhatsApp Update"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">No orders match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      {showOrderModal && <OrderModal />}
    </div>
  )
}
