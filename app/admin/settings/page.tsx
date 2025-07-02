"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Settings,
  Users,
  Shield,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Crown,
  UserCheck,
  UserX,
  Database,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  X,
  MessageSquare,
} from "lucide-react"

interface AdminUser {
  id: string
  username: string
  email: string
  password: string
  role: "super_admin" | "admin" | "editor" | "viewer"
  permissions: {
    dashboard: boolean
    content_management: boolean
    user_management: boolean
    inquiries: boolean
    umkm_orders: boolean
    analytics: boolean
    settings: boolean
    export_data: boolean
    import_data: boolean
  }
  isActive: boolean
  lastLogin?: string
  createdAt: string
  createdBy: string
}

interface SystemSettings {
  siteName: string
  siteDescription: string
  adminEmail: string
  timezone: string
  language: string
  theme: "light" | "dark" | "auto"
  emailNotifications: boolean
  backupFrequency: "daily" | "weekly" | "monthly"
  sessionTimeout: number
  maxLoginAttempts: number
  enableTwoFactor: boolean
  maintenanceMode: boolean
  debugMode: boolean
}

interface WhatsAppTemplates {
  umkmConfirmation: string
  orderUpdate: string
  paymentReminder: string
  orderCancellation: string
}

const PERMISSION_DESCRIPTIONS = {
  dashboard: "View analytics dashboard and reports",
  content_management: "Edit homepage, affiliate, and big brands content",
  user_management: "Create, edit, and delete admin users",
  inquiries: "View and manage customer inquiries",
  umkm_orders: "Manage UMKM orders and tracking",
  analytics: "Access detailed analytics and statistics",
  settings: "Modify system settings and configurations",
  export_data: "Export data and generate reports",
  import_data: "Import data and bulk operations",
}

const ROLE_PRESETS = {
  super_admin: {
    dashboard: true,
    content_management: true,
    user_management: true,
    inquiries: true,
    umkm_orders: true,
    analytics: true,
    settings: true,
    export_data: true,
    import_data: true,
  },
  admin: {
    dashboard: true,
    content_management: true,
    user_management: false,
    inquiries: true,
    umkm_orders: true,
    analytics: true,
    settings: false,
    export_data: true,
    import_data: false,
  },
  editor: {
    dashboard: true,
    content_management: true,
    user_management: false,
    inquiries: true,
    umkm_orders: false,
    analytics: false,
    settings: false,
    export_data: false,
    import_data: false,
  },
  viewer: {
    dashboard: true,
    content_management: false,
    user_management: false,
    inquiries: true,
    umkm_orders: false,
    analytics: false,
    settings: false,
    export_data: false,
    import_data: false,
  },
}

export default function AdminSettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [activeTab, setActiveTab] = useState("users")
  const [isSaving, setIsSaving] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [importProgress, setImportProgress] = useState(0)
  const router = useRouter()

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: "1",
      username: "sinta",
      email: "sinta@endorsement.com",
      password: "Ketemudibandung1",
      role: "super_admin",
      permissions: ROLE_PRESETS.super_admin,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: "system",
    },
  ])

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: "Personal Endorsement Hub",
    siteDescription: "Professional endorsement and collaboration platform",
    adminEmail: "sinta@endorsement.com",
    timezone: "Asia/Jakarta",
    language: "en",
    theme: "light",
    emailNotifications: true,
    backupFrequency: "weekly",
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    enableTwoFactor: false,
    maintenanceMode: false,
    debugMode: false,
  })

  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplates>({
    umkmConfirmation: `Hi {customerName}! 

Update on your UMKM Partnership order {orderId}:

Current Status: {status}
{scheduledDate}
{notes}

We'll keep you updated on the progress. Thank you for your partnership!`,
    orderUpdate: `Hi {customerName}! 

Your order {orderId} status has been updated to: {status}

{notes}

Thank you for choosing our services!`,
    paymentReminder: `Hi {customerName}! 

This is a friendly reminder that your order {orderId} is awaiting payment confirmation.

Order Details:
- Total Amount: Rp {totalAmount}
- Order Date: {orderDate}

Please complete your payment and send us the confirmation. If you have any questions, feel free to contact us.

Thank you!`,
    orderCancellation: `Hi {customerName}! 

We regret to inform you that your order {orderId} has been automatically cancelled due to non-payment within 48 hours.

If you still wish to proceed with this order, please place a new order through our website.

Thank you for your understanding.`,
  })

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
      loadSettings()
      // Set current user from localStorage
      const currentUserData = localStorage.getItem("currentUser")
      if (currentUserData) {
        setCurrentUser(JSON.parse(currentUserData))
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const loadSettings = () => {
    try {
      const savedUsers = localStorage.getItem("adminUsers")
      const savedSettings = localStorage.getItem("systemSettings")
      const savedTemplates = localStorage.getItem("whatsappTemplates")

      if (savedUsers) {
        const users = JSON.parse(savedUsers)
        setAdminUsers(users)
      }
      if (savedSettings) setSystemSettings(JSON.parse(savedSettings))
      if (savedTemplates) setWhatsappTemplates(JSON.parse(savedTemplates))
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Save all settings to localStorage
    localStorage.setItem("adminUsers", JSON.stringify(adminUsers))
    localStorage.setItem("systemSettings", JSON.stringify(systemSettings))
    localStorage.setItem("whatsappTemplates", JSON.stringify(whatsappTemplates))

    setTimeout(() => {
      setIsSaving(false)
      alert("Settings saved successfully!")
    }, 1000)
  }

  const handleCreateUser = (userData: Partial<AdminUser>) => {
    const newUser: AdminUser = {
      id: Date.now().toString(),
      username: userData.username || "",
      email: userData.email || "",
      password: userData.password || "",
      role: userData.role || "viewer",
      permissions: userData.permissions || ROLE_PRESETS.viewer,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.username || "admin",
    }

    const updatedUsers = [...adminUsers, newUser]
    setAdminUsers(updatedUsers)
    localStorage.setItem("adminUsers", JSON.stringify(updatedUsers))
    setShowUserModal(false)
    setEditingUser(null)
  }

  const handleUpdateUser = (userId: string, userData: Partial<AdminUser>) => {
    const updatedUsers = adminUsers.map((user) => (user.id === userId ? { ...user, ...userData } : user))
    setAdminUsers(updatedUsers)
    localStorage.setItem("adminUsers", JSON.stringify(updatedUsers))
    setShowUserModal(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    if (adminUsers.length === 1) {
      alert("Cannot delete the last admin user!")
      return
    }
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = adminUsers.filter((user) => user.id !== userId)
      setAdminUsers(updatedUsers)
      localStorage.setItem("adminUsers", JSON.stringify(updatedUsers))
    }
  }

  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = adminUsers.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user))
    setAdminUsers(updatedUsers)
    localStorage.setItem("adminUsers", JSON.stringify(updatedUsers))
  }

  const handleExportData = async () => {
    setExportProgress(0)
    const data = {
      adminUsers,
      systemSettings,
      whatsappTemplates,
      homeContent: JSON.parse(localStorage.getItem("homeContent") || "{}"),
      bigBrandsContent: JSON.parse(localStorage.getItem("bigBrandsContent") || "{}"),
      affiliateContent: JSON.parse(localStorage.getItem("affiliateContent") || "{}"),
      umkmOrders: JSON.parse(localStorage.getItem("umkmOrders") || "[]"),
      inquiriesData: JSON.parse(localStorage.getItem("inquiriesData") || "[]"),
      exportDate: new Date().toISOString(),
    }

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      setExportProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `endorsement-site-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setTimeout(() => setExportProgress(0), 2000)
  }

  const handleImportData = async (file: File) => {
    setImportProgress(0)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Simulate import progress
      for (let i = 0; i <= 100; i += 20) {
        setImportProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      if (data.adminUsers) setAdminUsers(data.adminUsers)
      if (data.systemSettings) setSystemSettings(data.systemSettings)
      if (data.whatsappTemplates) setWhatsappTemplates(data.whatsappTemplates)
      if (data.homeContent) localStorage.setItem("homeContent", JSON.stringify(data.homeContent))
      if (data.bigBrandsContent) localStorage.setItem("bigBrandsContent", JSON.stringify(data.bigBrandsContent))
      if (data.affiliateContent) localStorage.setItem("affiliateContent", JSON.stringify(data.affiliateContent))
      if (data.umkmOrders) localStorage.setItem("umkmOrders", JSON.stringify(data.umkmOrders))
      if (data.inquiriesData) localStorage.setItem("inquiriesData", JSON.stringify(data.inquiriesData))

      alert("Data imported successfully!")
    } catch (error) {
      alert("Failed to import data. Please check the file format.")
    }

    setTimeout(() => setImportProgress(0), 2000)
  }

  const UserModal = () => {
    const [formData, setFormData] = useState(
      editingUser || {
        username: "",
        email: "",
        password: "",
        role: "viewer" as const,
        permissions: ROLE_PRESETS.viewer,
        isActive: true,
      },
    )

    const handleRoleChange = (role: AdminUser["role"]) => {
      setFormData((prev) => ({
        ...prev,
        role,
        permissions: ROLE_PRESETS[role],
      }))
    }

    const handlePermissionChange = (permission: keyof AdminUser["permissions"], value: boolean) => {
      setFormData((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permission]: value,
        },
      }))
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (editingUser) {
        handleUpdateUser(editingUser.id, formData)
      } else {
        handleCreateUser(formData)
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {editingUser ? "Edit Admin User" : "Create New Admin User"}
            </h3>
            <button
              onClick={() => {
                setShowUserModal(false)
                setEditingUser(null)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    required={!editingUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as AdminUser["role"])}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PERMISSION_DESCRIPTIONS).map(([key, description]) => (
                  <div key={key} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      id={key}
                      checked={formData.permissions[key as keyof AdminUser["permissions"]]}
                      onChange={(e) => handlePermissionChange(key as keyof AdminUser["permissions"], e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label htmlFor={key} className="text-sm font-medium text-gray-900 cursor-pointer">
                        {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowUserModal(false)
                  setEditingUser(null)
                }}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                {editingUser ? "Update User" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const getRoleIcon = (role: AdminUser["role"]) => {
    switch (role) {
      case "super_admin":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />
      case "editor":
        return <Edit className="w-4 h-4 text-green-500" />
      case "viewer":
        return <Eye className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleColor = (role: AdminUser["role"]) => {
    switch (role) {
      case "super_admin":
        return "bg-yellow-100 text-yellow-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      case "editor":
        return "bg-green-100 text-green-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
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
              <h1 className="text-xl font-semibold text-gray-900">Admin Settings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Settings"}</span>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <nav className="space-y-2">
                {[
                  { id: "users", label: "User Management", icon: Users, description: "Manage admin users" },
                  { id: "system", label: "System Settings", icon: Settings, description: "General configuration" },
                  { id: "security", label: "Security", icon: Shield, description: "Security settings" },
                  {
                    id: "whatsapp",
                    label: "WhatsApp Templates",
                    icon: MessageSquare,
                    description: "Message templates",
                  },
                  { id: "backup", label: "Backup & Export", icon: Database, description: "Data management" },
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
            {activeTab === "users" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  </div>
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {getRoleIcon(user.role)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {user.role.replace("_", " ").toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                user.isActive
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              {user.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                              <span>{user.isActive ? "Active" : "Inactive"}</span>
                            </button>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingUser(user)
                                  setShowUserModal(true)
                                }}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {adminUsers.length > 1 && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                      <input
                        type="text"
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                      <input
                        type="email"
                        value={systemSettings.adminEmail}
                        onChange={(e) => setSystemSettings((prev) => ({ ...prev, adminEmail: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={systemSettings.timezone}
                        onChange={(e) => setSystemSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                        <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                        <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={systemSettings.language}
                        onChange={(e) => setSystemSettings((prev) => ({ ...prev, language: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="id">Bahasa Indonesia</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <select
                        value={systemSettings.theme}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({ ...prev, theme: e.target.value as SystemSettings["theme"] }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                      <select
                        value={systemSettings.backupFrequency}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            backupFrequency: e.target.value as SystemSettings["backupFrequency"],
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                    <textarea
                      value={systemSettings.siteDescription}
                      onChange={(e) => setSystemSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive email alerts for important events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.emailNotifications}
                          onChange={(e) =>
                            setSystemSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                        <p className="text-sm text-gray-500">Put site in maintenance mode</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.maintenanceMode}
                          onChange={(e) =>
                            setSystemSettings((prev) => ({ ...prev, maintenanceMode: e.target.checked }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={systemSettings.sessionTimeout}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({ ...prev, sessionTimeout: Number.parseInt(e.target.value) }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="5"
                        max="480"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                      <input
                        type="number"
                        value={systemSettings.maxLoginAttempts}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({ ...prev, maxLoginAttempts: Number.parseInt(e.target.value) }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Enable 2FA for enhanced security</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.enableTwoFactor}
                          onChange={(e) =>
                            setSystemSettings((prev) => ({ ...prev, enableTwoFactor: e.target.checked }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">Debug Mode</h4>
                        <p className="text-sm text-gray-500">Enable debug logging (development only)</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={systemSettings.debugMode}
                          onChange={(e) => setSystemSettings((prev) => ({ ...prev, debugMode: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {systemSettings.debugMode && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-medium text-yellow-800">Debug Mode Warning</h4>
                      </div>
                      <p className="text-sm text-yellow-700 mt-2">
                        Debug mode should only be enabled in development environments. It may expose sensitive
                        information and impact performance.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "whatsapp" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">WhatsApp Message Templates</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Available Variables</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        <code className="bg-blue-100 px-2 py-1 rounded">{"{customerName}"}</code> - Customer's name
                      </p>
                      <p>
                        <code className="bg-blue-100 px-2 py-1 rounded">{"{orderId}"}</code> - Order ID
                      </p>
                      <p>
                        <code className="bg-blue-100 px-2 py-1 rounded">{"{status}"}</code> - Order status
                      </p>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UMKM Order Confirmation</label>
                    <textarea
                      value={whatsappTemplates.umkmConfirmation}
                      onChange={(e) => setWhatsappTemplates((prev) => ({ ...prev, umkmConfirmation: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                      placeholder="Enter UMKM confirmation message template..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status Update</label>
                    <textarea
                      value={whatsappTemplates.orderUpdate}
                      onChange={(e) => setWhatsappTemplates((prev) => ({ ...prev, orderUpdate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                      placeholder="Enter order update message template..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Reminder</label>
                    <textarea
                      value={whatsappTemplates.paymentReminder}
                      onChange={(e) => setWhatsappTemplates((prev) => ({ ...prev, paymentReminder: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                      placeholder="Enter payment reminder message template..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Cancellation</label>
                    <textarea
                      value={whatsappTemplates.orderCancellation}
                      onChange={(e) => setWhatsappTemplates((prev) => ({ ...prev, orderCancellation: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                      placeholder="Enter order cancellation message template..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "backup" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Backup & Data Management</h2>
                </div>

                <div className="space-y-8">
                  {/* Export Data */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
                        <p className="text-sm text-gray-500">Download a complete backup of all site data</p>
                      </div>
                      <button
                        onClick={handleExportData}
                        disabled={exportProgress > 0}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        <span>{exportProgress > 0 ? "Exporting..." : "Export Data"}</span>
                      </button>
                    </div>
                    {exportProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${exportProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Import Data */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Import Data</h3>
                        <p className="text-sm text-gray-500">Restore data from a backup file</p>
                      </div>
                      <div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => e.target.files?.[0] && handleImportData(e.target.files[0])}
                          className="hidden"
                          id="import-file"
                        />
                        <label
                          htmlFor="import-file"
                          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Import Data</span>
                        </label>
                      </div>
                    </div>
                    {importProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${importProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* System Status */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium text-green-900">Database</div>
                          <div className="text-sm text-green-700">Connected</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium text-green-900">Storage</div>
                          <div className="text-sm text-green-700">Available</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium text-green-900">System</div>
                          <div className="text-sm text-green-700">Operational</div>
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

      {showUserModal && <UserModal />}
    </div>
  )
}
