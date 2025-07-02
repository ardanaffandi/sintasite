"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Users,
  MousePointer,
  MessageSquare,
  TrendingUp,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from "lucide-react"

interface AnalyticsData {
  pageViews: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    trend: number
  }
  affiliateClicks: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    trend: number
  }
  umkmSubmissions: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    trend: number
  }
  bigBrandInquiries: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    trend: number
  }
  topPages: Array<{
    page: string
    views: number
    percentage: number
  }>
  topAffiliateProducts: Array<{
    product: string
    clicks: number
    percentage: number
  }>
  recentActivity: Array<{
    id: string
    type: "page_view" | "affiliate_click" | "umkm_submission" | "big_brand_inquiry"
    description: string
    timestamp: string
    page?: string
    product?: string
  }>
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: { total: 12847, today: 234, thisWeek: 1567, thisMonth: 6789, trend: 12.5 },
    affiliateClicks: { total: 3421, today: 45, thisWeek: 312, thisMonth: 1234, trend: 8.3 },
    umkmSubmissions: { total: 156, today: 3, thisWeek: 18, thisMonth: 67, trend: 15.2 },
    bigBrandInquiries: { total: 89, today: 1, thisWeek: 8, thisMonth: 32, trend: -2.1 },
    topPages: [
      { page: "Homepage", views: 4567, percentage: 35.5 },
      { page: "Affiliate Lookbook", views: 3421, percentage: 26.6 },
      { page: "UMKM Partnership", views: 2890, percentage: 22.5 },
      { page: "Big Brands", views: 1969, percentage: 15.4 },
    ],
    topAffiliateProducts: [
      { product: "Premium Skincare Set", clicks: 567, percentage: 16.6 },
      { product: "Wireless Earbuds Pro", clicks: 432, percentage: 12.6 },
      { product: "Minimalist Watch", clicks: 389, percentage: 11.4 },
      { product: "Yoga Mat Premium", clicks: 298, percentage: 8.7 },
      { product: "Organic Coffee Blend", clicks: 234, percentage: 6.8 },
    ],
    recentActivity: [
      {
        id: "1",
        type: "umkm_submission",
        description: "New UMKM partnership application from Bakery Delights",
        timestamp: "2 minutes ago",
      },
      {
        id: "2",
        type: "affiliate_click",
        description: "Affiliate click on Premium Skincare Set",
        timestamp: "5 minutes ago",
        product: "Premium Skincare Set",
      },
      {
        id: "3",
        type: "page_view",
        description: "Page view on Affiliate Lookbook",
        timestamp: "8 minutes ago",
        page: "Affiliate Lookbook",
      },
      {
        id: "4",
        type: "big_brand_inquiry",
        description: "Big brand inquiry from TechCorp Solutions",
        timestamp: "15 minutes ago",
      },
      {
        id: "5",
        type: "affiliate_click",
        description: "Affiliate click on Wireless Earbuds Pro",
        timestamp: "23 minutes ago",
        product: "Wireless Earbuds Pro",
      },
    ],
  })

  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      loadAnalytics()
    } else {
      router.push("/login")
    }
  }, [router])

  const loadAnalytics = () => {
    const savedAnalytics = localStorage.getItem("analyticsData")
    if (savedAnalytics) {
      setAnalytics(JSON.parse(savedAnalytics))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const StatCard = ({
    title,
    value,
    subValue,
    trend,
    icon: Icon,
    color,
  }: {
    title: string
    value: number
    subValue: string
    trend: number
    icon: any
    color: string
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
          {trend >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-gray-500 text-xs mt-1">{subValue}</p>
    </div>
  )

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
              <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Page Views"
            value={analytics.pageViews.total}
            subValue={`${analytics.pageViews.today} today`}
            trend={analytics.pageViews.trend}
            icon={Eye}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Affiliate Clicks"
            value={analytics.affiliateClicks.total}
            subValue={`${analytics.affiliateClicks.today} today`}
            trend={analytics.affiliateClicks.trend}
            icon={MousePointer}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="UMKM Submissions"
            value={analytics.umkmSubmissions.total}
            subValue={`${analytics.umkmSubmissions.today} today`}
            trend={analytics.umkmSubmissions.trend}
            icon={Users}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Big Brand Inquiries"
            value={analytics.bigBrandInquiries.total}
            subValue={`${analytics.bigBrandInquiries.today} today`}
            trend={analytics.bigBrandInquiries.trend}
            icon={MessageSquare}
            color="from-rose-500 to-rose-600"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Pages */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{page.page}</span>
                      <span className="text-sm text-gray-600">{page.views.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Affiliate Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Affiliate Products</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.topAffiliateProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{product.product}</span>
                      <span className="text-sm text-gray-600">{product.clicks}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${product.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "page_view"
                        ? "bg-blue-100"
                        : activity.type === "affiliate_click"
                          ? "bg-purple-100"
                          : activity.type === "umkm_submission"
                            ? "bg-green-100"
                            : "bg-rose-100"
                    }`}
                  >
                    {activity.type === "page_view" && <Eye className="w-4 h-4 text-blue-600" />}
                    {activity.type === "affiliate_click" && <ExternalLink className="w-4 h-4 text-purple-600" />}
                    {activity.type === "umkm_submission" && <Users className="w-4 h-4 text-green-600" />}
                    {activity.type === "big_brand_inquiry" && <MessageSquare className="w-4 h-4 text-rose-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/admin/inquiries"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View all inquiries
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin"
              className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-colors"
            >
              <div className="p-2 bg-blue-500 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage Content</h4>
                <p className="text-sm text-gray-600">Edit pages and content</p>
              </div>
            </Link>
            <Link
              href="/admin/inquiries"
              className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-colors"
            >
              <div className="p-2 bg-green-500 rounded-lg mr-3">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Inquiries</h4>
                <p className="text-sm text-gray-600">Manage submissions</p>
              </div>
            </Link>
            <Link
              href="/"
              className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-colors"
            >
              <div className="p-2 bg-purple-500 rounded-lg mr-3">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Site</h4>
                <p className="text-sm text-gray-600">Visit public pages</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
