"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Download,
  Eye,
  MessageSquare,
  Building2,
  Briefcase,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface Inquiry {
  id: string
  type: "umkm" | "big_brand"
  status: "new" | "in_progress" | "completed" | "rejected"
  name: string
  email?: string
  phone?: string
  brandName?: string
  instagram?: string
  productDescription?: string
  budget?: string
  timeline?: string
  message?: string
  submittedAt: string
  lastUpdated: string
}

export default function InquiriesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: "1",
      type: "umkm",
      status: "new",
      name: "Sarah Johnson",
      brandName: "Bakery Delights",
      instagram: "@bakerydelights",
      productDescription: "Artisanal breads and pastries made with organic ingredients",
      budget: "1jt-2jt",
      timeline: "1-2months",
      submittedAt: "2024-01-15T10:30:00Z",
      lastUpdated: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "big_brand",
      status: "in_progress",
      name: "Michael Chen",
      email: "michael@techcorp.com",
      phone: "+6281234567890",
      message: "We're interested in a premium partnership for our new product launch.",
      submittedAt: "2024-01-14T15:45:00Z",
      lastUpdated: "2024-01-15T09:15:00Z",
    },
    {
      id: "3",
      type: "umkm",
      status: "completed",
      name: "Lisa Wong",
      brandName: "EcoFashion",
      instagram: "@ecofashion_id",
      productDescription: "Sustainable fashion accessories made from recycled materials",
      budget: "500k-1jt",
      timeline: "3-4weeks",
      submittedAt: "2024-01-10T08:20:00Z",
      lastUpdated: "2024-01-14T16:30:00Z",
    },
    {
      id: "4",
      type: "umkm",
      status: "new",
      name: "Ahmad Rizki",
      brandName: "Coffee Roasters",
      instagram: "@coffeeroasters_jkt",
      productDescription: "Premium single-origin coffee beans from Indonesian highlands",
      budget: "2jt-5jt",
      timeline: "flexible",
      submittedAt: "2024-01-13T14:10:00Z",
      lastUpdated: "2024-01-13T14:10:00Z",
    },
    {
      id: "5",
      type: "big_brand",
      status: "rejected",
      name: "David Park",
      email: "david@globaltech.com",
      phone: "+6281987654321",
      message: "Looking for influencer partnership for our tech gadget line.",
      submittedAt: "2024-01-08T11:25:00Z",
      lastUpdated: "2024-01-12T13:45:00Z",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      loadInquiries()
    } else {
      router.push("/login")
    }
  }, [router])

  const loadInquiries = () => {
    const savedInquiries = localStorage.getItem("inquiriesData")
    if (savedInquiries) {
      setInquiries(JSON.parse(savedInquiries))
    }
  }

  const updateInquiryStatus = (id: string, status: Inquiry["status"]) => {
    const updatedInquiries = inquiries.map((inquiry) =>
      inquiry.id === id ? { ...inquiry, status, lastUpdated: new Date().toISOString() } : inquiry,
    )
    setInquiries(updatedInquiries)
    localStorage.setItem("inquiriesData", JSON.stringify(updatedInquiries))
  }

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter
    const matchesType = typeFilter === "all" || inquiry.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (status: Inquiry["status"]) => {
    switch (status) {
      case "new":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: Inquiry["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
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
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Inquiries Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="umkm">UMKM</option>
                <option value="big_brand">Big Brand</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inquiries List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Inquiries ({filteredInquiries.length})</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedInquiry?.id === inquiry.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {inquiry.type === "umkm" ? (
                              <Briefcase className="w-4 h-4 text-green-600" />
                            ) : (
                              <Building2 className="w-4 h-4 text-blue-600" />
                            )}
                            <span className="font-medium text-gray-900">{inquiry.name}</span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}
                          >
                            {inquiry.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {inquiry.brandName && (
                            <div className="flex items-center space-x-1">
                              <span>Brand: {inquiry.brandName}</span>
                            </div>
                          )}
                          {inquiry.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{inquiry.email}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted: {new Date(inquiry.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(inquiry.status)}
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="lg:col-span-1">
            {selectedInquiry ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Inquiry Details</h3>
                  <div className="flex items-center space-x-2">
                    {selectedInquiry.type === "umkm" ? (
                      <Briefcase className="w-5 h-5 text-green-600" />
                    ) : (
                      <Building2 className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{selectedInquiry.name}</p>
                  </div>

                  {selectedInquiry.brandName && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Brand Name</label>
                      <p className="text-gray-900">{selectedInquiry.brandName}</p>
                    </div>
                  )}

                  {selectedInquiry.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedInquiry.email}</p>
                    </div>
                  )}

                  {selectedInquiry.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedInquiry.phone}</p>
                    </div>
                  )}

                  {selectedInquiry.instagram && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Instagram</label>
                      <p className="text-gray-900">{selectedInquiry.instagram}</p>
                    </div>
                  )}

                  {selectedInquiry.productDescription && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Product Description</label>
                      <p className="text-gray-900">{selectedInquiry.productDescription}</p>
                    </div>
                  )}

                  {selectedInquiry.budget && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Budget</label>
                      <p className="text-gray-900">{selectedInquiry.budget}</p>
                    </div>
                  )}

                  {selectedInquiry.timeline && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Timeline</label>
                      <p className="text-gray-900">{selectedInquiry.timeline}</p>
                    </div>
                  )}

                  {selectedInquiry.message && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Message</label>
                      <p className="text-gray-900">{selectedInquiry.message}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => updateInquiryStatus(selectedInquiry.id, e.target.value as Inquiry["status"])}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Submitted: {new Date(selectedInquiry.submittedAt).toLocaleString()}</p>
                      <p>Last Updated: {new Date(selectedInquiry.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Inquiry</h3>
                <p className="text-gray-600">Choose an inquiry from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
