"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Upload,
  MessageCircle,
  CreditCard,
  Plus,
  Package,
  ChevronDown,
  Trash2,
  Check,
  Clock,
  Star,
  X,
  Copy,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

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

interface ProductItem {
  id: string
  productDescription: string
  endorsementType: string
  endorseMonth: string
  photo: File | null
  price: number
}

interface CountryCode {
  code: string
  name: string
  flag: string
  dialCode: string
  enabled: boolean
}

interface OrderData {
  orderId: string
  customerName: string
  brandName: string
  instagram: string
  phone: string
  products: ProductItem[]
  totalAmount: number
  createdAt: string
}

export default function UMKMPage() {
  const [content, setContent] = useState<UMKMContent>({
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
    submitButtonText: "Submit Order",
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
    tableStyle: "modern",
  })

  const [countryCodes, setCountryCodes] = useState<CountryCode[]>([
    { code: "ID", name: "Indonesia", flag: "🇮🇩", dialCode: "+62", enabled: true },
    { code: "MY", name: "Malaysia", flag: "🇲🇾", dialCode: "+60", enabled: true },
    { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65", enabled: true },
    { code: "TH", name: "Thailand", flag: "🇹🇭", dialCode: "+66", enabled: true },
    { code: "PH", name: "Philippines", flag: "🇵🇭", dialCode: "+63", enabled: true },
    { code: "VN", name: "Vietnam", flag: "🇻🇳", dialCode: "+84", enabled: true },
  ])

  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    instagram: "",
    countryCode: "+62",
    phone: "",
    products: [
      {
        id: "1",
        productDescription: "",
        endorsementType: "",
        endorseMonth: "",
        photo: null as File | null,
        price: 0,
      },
    ] as ProductItem[],
  })

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    // Load content from localStorage (CMS data)
    const savedContent = localStorage.getItem("umkmContent")
    const savedCountryCodes = localStorage.getItem("countryCodes")

    if (savedContent) {
      setContent(JSON.parse(savedContent))
    }
    if (savedCountryCodes) {
      setCountryCodes(JSON.parse(savedCountryCodes))
    }

    const savedInvoiceTemplate = localStorage.getItem("invoiceTemplate")
    if (savedInvoiceTemplate) {
      setInvoiceTemplate(JSON.parse(savedInvoiceTemplate))
    }
  }, [])

  const formatIDRPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const generateOrderId = () => {
    const date = new Date()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const year = String(date.getFullYear()).slice(-2)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `SMB${month}${day}${year}${random}`
  }

  const addProduct = () => {
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      productDescription: "",
      endorsementType: "",
      endorseMonth: "",
      photo: null,
      price: 0,
    }
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }))
  }

  const removeProduct = (id: string) => {
    if (formData.products.length > 1) {
      setFormData((prev) => ({
        ...prev,
        products: prev.products.filter((product) => product.id !== id),
      }))
    }
  }

  const updateProduct = (id: string, field: keyof ProductItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product) => {
        if (product.id === id) {
          const updatedProduct = { ...product, [field]: value }

          // Update price when endorsement type changes
          if (field === "endorsementType") {
            const selectedType = content.formFields.endorsementTypes.find((type) => type.value === value)
            updatedProduct.price = selectedType ? selectedType.price : 0
          }

          return updatedProduct
        }
        return product
      }),
    }))
  }

  const handleFileUpload = (id: string, file: File) => {
    updateProduct(id, "photo", file)
  }

  const calculateTotal = () => {
    return formData.products.reduce((total, product) => total + product.price, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate order and save to localStorage
    const orderId = generateOrderId()
    const orderData: OrderData = {
      orderId,
      customerName: formData.name,
      brandName: formData.brandName,
      instagram: formData.instagram,
      phone: `${formData.countryCode}${formData.phone}`,
      products: formData.products,
      totalAmount: calculateTotal(),
      createdAt: new Date().toISOString(),
    }

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem("umkmOrders") || "[]")
    const newOrder = {
      id: Date.now().toString(),
      orderId: orderData.orderId,
      customerName: orderData.customerName,
      brandName: orderData.brandName,
      instagram: orderData.instagram,
      phone: orderData.phone,
      products: orderData.products.map((p) => ({
        id: p.id,
        description: p.productDescription,
        endorsementType: p.endorsementType,
        endorseMonth: p.endorseMonth,
        price: p.price,
      })),
      totalAmount: orderData.totalAmount,
      status: "payment_confirmation",
      createdAt: orderData.createdAt,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
    }

    existingOrders.push(newOrder)
    localStorage.setItem("umkmOrders", JSON.stringify(existingOrders))

    setCurrentOrder(orderData)
    setShowPaymentModal(true)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const generatePaymentConfirmationMessage = () => {
    if (!currentOrder) return ""

    const productDetails = currentOrder.products
      .map(
        (product, index) =>
          `Product ${index + 1}:
- Description: ${product.productDescription}
- Type: ${content.formFields.endorsementTypes.find((type) => type.value === product.endorsementType)?.label}
- Month: ${product.endorseMonth}
- Price: ${formatIDRPrice(product.price)}`,
      )
      .join("\n\n")

    const message = `Hi! I have completed the payment for my UMKM Partnership order:

*Order ID: ${currentOrder.orderId}*

*Customer Details:*
Name: ${currentOrder.customerName}
Brand: ${currentOrder.brandName}
Instagram: ${currentOrder.instagram}
Phone: ${currentOrder.phone}

*Order Details:*
${productDetails}

*Total Amount: ${formatIDRPrice(currentOrder.totalAmount)}*

I have transferred the payment to:
Bank: ${content.bankInfo.bankName}
Account: ${content.bankInfo.accountNumber}
Name: ${content.bankInfo.accountName}

Please confirm receipt of payment and proceed with my endorsement order. Thank you!`

    return message
  }

  const sendPaymentConfirmation = () => {
    const message = generatePaymentConfirmationMessage()
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${content.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const selectedCountry = countryCodes.find((country) => country.dialCode === formData.countryCode)
  const enabledCountries = countryCodes.filter((country) => country.enabled)

  // Payment Modal Component
  const PaymentModal = () => {
    if (!currentOrder) return null

    const printInvoice = () => {
      const printWindow = window.open("", "_blank")
      if (!printWindow) return

      const getTableStyles = () => {
        switch (invoiceTemplate.tableStyle) {
          case "classic":
            return `
              .products-table { border: 2px solid ${invoiceTemplate.colors.primary}; }
              .products-table th { background: ${invoiceTemplate.colors.primary}; color: white; }
              .products-table td { border: 1px solid ${invoiceTemplate.colors.primary}; }
            `
          case "minimal":
            return `
              .products-table { border: none; box-shadow: none; }
              .products-table th { background: transparent; color: ${invoiceTemplate.colors.primary}; border-bottom: 2px solid ${invoiceTemplate.colors.primary}; }
              .products-table td { border: none; border-bottom: 1px solid #E5E7EB; }
            `
          default: // modern
            return `
              .products-table { box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
              .products-table th { background: #F3F4F6; color: ${invoiceTemplate.colors.primary}; }
              .products-table td { border-bottom: 1px solid #F3F4F6; }
            `
        }
      }

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice - ${currentOrder.orderId}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Arial', sans-serif; 
                line-height: 1.6; 
                color: #333;
                background: white;
              }
              .invoice-container { 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 40px 20px;
                background: white;
              }
              .invoice-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 3px solid ${invoiceTemplate.colors.primary};
              }
              .company-info h1 { 
                color: ${invoiceTemplate.colors.primary}; 
                font-size: 28px; 
                font-weight: bold;
                margin-bottom: 8px;
              }
              .company-info p { 
                color: ${invoiceTemplate.colors.secondary}; 
                font-size: 14px;
                margin-bottom: 4px;
              }
              .invoice-meta { 
                text-align: right;
              }
              .invoice-meta h2 { 
                color: #1F2937; 
                font-size: 24px; 
                margin-bottom: 8px;
              }
              .invoice-meta p { 
                color: ${invoiceTemplate.colors.secondary}; 
                font-size: 14px;
                margin-bottom: 4px;
              }
              .invoice-details { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 40px; 
                margin-bottom: 40px;
              }
              .detail-section h3 { 
                color: #1F2937; 
                font-size: 16px; 
                font-weight: bold;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #E5E7EB;
              }
              .detail-section p { 
                color: #4B5563; 
                font-size: 14px;
                margin-bottom: 6px;
              }
              .detail-section .highlight { 
                color: #1F2937; 
                font-weight: 600;
              }
              .products-table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 30px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
              }
              .products-table th { 
                font-weight: 600;
                padding: 16px 12px; 
                text-align: left; 
                font-size: 14px;
                border-bottom: 2px solid #E5E7EB;
              }
              .products-table td { 
                padding: 16px 12px; 
                font-size: 14px;
              }
              .products-table tr:last-child td { 
                border-bottom: none;
              }
              .products-table .product-desc { 
                max-width: 200px;
                word-wrap: break-word;
              }
              .products-table .endorsement-type { 
                font-weight: 600;
                color: ${invoiceTemplate.colors.primary};
              }
              .products-table .endorsement-desc { 
                font-size: 12px;
                color: ${invoiceTemplate.colors.secondary};
                margin-top: 4px;
              }
              .products-table .price { 
                font-weight: 600;
                color: ${invoiceTemplate.colors.accent};
                text-align: right;
              }
              ${getTableStyles()}
              .totals-section { 
                margin-left: auto; 
                width: 300px;
                background: #F9FAFB;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #E5E7EB;
              }
              .total-row { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 12px;
                font-size: 14px;
              }
              .total-row.final { 
                border-top: 2px solid ${invoiceTemplate.colors.primary}; 
                padding-top: 12px; 
                font-size: 18px; 
                font-weight: bold;
                color: #1F2937;
              }
              .payment-info { 
                background: #FEF3C7; 
                border: 1px solid ${invoiceTemplate.colors.warning};
                border-radius: 8px; 
                padding: 20px; 
                margin: 30px 0;
                ${!invoiceTemplate.showPaymentInstructions ? "display: none;" : ""}
              }
              .payment-info h3 { 
                color: #92400E; 
                font-size: 16px; 
                margin-bottom: 16px;
                display: flex;
                align-items: center;
              }
              .payment-info h3:before {
                content: "⚠️";
                margin-right: 8px;
              }
              .bank-details { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 16px;
                background: white;
                padding: 16px;
                border-radius: 6px;
                border: 1px solid #F3F4F6;
              }
              .bank-detail { 
                display: flex; 
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #F3F4F6;
              }
              .bank-detail:last-child { 
                border-bottom: none;
              }
              .bank-detail .label { 
                color: ${invoiceTemplate.colors.secondary}; 
                font-size: 13px;
              }
              .bank-detail .value { 
                color: #1F2937; 
                font-weight: 600;
                font-size: 13px;
              }
              .payment-steps { 
                margin-top: 20px;
              }
              .payment-steps ol { 
                padding-left: 20px;
              }
              .payment-steps li { 
                color: #4B5563; 
                font-size: 14px;
                margin-bottom: 8px;
              }
              .footer { 
                margin-top: 40px; 
                padding-top: 20px; 
                border-top: 1px solid #E5E7EB;
                text-align: center;
              }
              .footer p { 
                color: ${invoiceTemplate.colors.secondary}; 
                font-size: 12px;
                margin-bottom: 4px;
              }
              .status-badge {
                display: inline-block;
                background: #FEF3C7;
                color: #92400E;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                margin-top: 8px;
              }
              .company-details {
                ${!invoiceTemplate.showCompanyDetails ? "display: none;" : ""}
              }
              @media print {
                body { print-color-adjust: exact; }
                .invoice-container { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <!-- Invoice Header -->
              <div class="invoice-header">
                <div class="company-info">
                  <h1>${invoiceTemplate.companyName}</h1>
                  <p>${invoiceTemplate.companyTagline}</p>
                  <div class="company-details">
                    <p>Email: ${invoiceTemplate.companyEmail}</p>
                    <p>Phone: ${invoiceTemplate.companyPhone}</p>
                  </div>
                </div>
                <div class="invoice-meta">
                  <h2>${invoiceTemplate.invoiceTitle}</h2>
                  <p><strong>Invoice #:</strong> ${currentOrder.orderId}</p>
                  <p><strong>Date:</strong> ${new Date(currentOrder.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</p>
                  <p><strong>Due Date:</strong> ${new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}</p>
                  <div class="status-badge">Payment Pending</div>
                </div>
              </div>

              <!-- Customer & Order Details -->
              <div class="invoice-details">
                <div class="detail-section">
                  <h3>Bill To:</h3>
                  <p><span class="highlight">${currentOrder.customerName}</span></p>
                  <p>Brand: <span class="highlight">${currentOrder.brandName}</span></p>
                  <p>Instagram: <span class="highlight">${currentOrder.instagram}</span></p>
                  <p>Phone: <span class="highlight">${currentOrder.phone}</span></p>
                </div>
                <div class="detail-section">
                  <h3>Order Information:</h3>
                  <p>Order ID: <span class="highlight">${currentOrder.orderId}</span></p>
                  <p>Total Products: <span class="highlight">${currentOrder.products.length}</span></p>
                  <p>Order Date: <span class="highlight">${new Date(currentOrder.createdAt).toLocaleDateString("id-ID")}</span></p>
                  <p>Payment Method: <span class="highlight">Bank Transfer</span></p>
                </div>
              </div>

              <!-- Products Table -->
              <table class="products-table">
                <thead>
                  <tr>
                    <th style="width: 5%">#</th>
                    <th style="width: 35%">Product Description</th>
                    <th style="width: 25%">Endorsement Package</th>
                    <th style="width: 15%">Schedule</th>
                    <th style="width: 20%">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${currentOrder.products
                    .map((product, index) => {
                      const endorsementType = content.formFields.endorsementTypes.find(
                        (type) => type.value === product.endorsementType,
                      )
                      return `
                      <tr>
                        <td style="text-align: center; font-weight: 600;">${index + 1}</td>
                        <td class="product-desc">${product.productDescription}</td>
                        <td>
                          <div class="endorsement-type">${endorsementType?.label || "Not specified"}</div>
                          <div class="endorsement-desc">${endorsementType?.description || ""}</div>
                        </td>
                        <td>${new Date(product.endorseMonth + "-01").toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                        })}</td>
                        <td class="price">${formatIDRPrice(product.price)}</td>
                      </tr>
                    `
                    })
                    .join("")}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatIDRPrice(currentOrder.totalAmount)}</span>
            </div>
            <div class="total-row">
              <span>Tax (0%):</span>
              <span>${formatIDRPrice(0)}</span>
            </div>
            <div class="total-row final">
              <span>Total Amount:</span>
              <span>${formatIDRPrice(currentOrder.totalAmount)}</span>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="payment-info">
            <h3>${content.paymentInstructions.title}</h3>
            <div class="bank-details">
              <div class="bank-detail">
                <span class="label">Bank:</span>
                <span class="value">${content.bankInfo.bankName}</span>
              </div>
              <div class="bank-detail">
                <span class="label">Account Number:</span>
                <span class="value">${content.bankInfo.accountNumber}</span>
              </div>
              <div class="bank-detail">
                <span class="label">Account Name:</span>
                <span class="value">${content.bankInfo.accountName}</span>
              </div>
              <div class="bank-detail">
                <span class="label">Amount:</span>
                <span class="value">${formatIDRPrice(currentOrder.totalAmount)}</span>
              </div>
            </div>
            
            <div class="payment-steps">
              <ol>
                ${content.paymentInstructions.steps.map((step) => `<li>${step}</li>`).join("")}
              </ol>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>${invoiceTemplate.thankYouMessage}</strong></p>
            <p>${invoiceTemplate.supportMessage} ${invoiceTemplate.companyPhone}</p>
            <p>${invoiceTemplate.paymentTerms}</p>
            <p style="margin-top: 16px; font-style: italic;">${invoiceTemplate.footerNote}</p>
          </div>
        </div>
      </body>
    </html>
  `

      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
      printWindow.print()
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Payment Instructions</h3>
                  <p className="text-gray-600">Order ID: {currentOrder.orderId}</p>
                </div>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Invoice Preview */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold text-gray-900">Invoice Preview</h4>
                <button
                  onClick={printInvoice}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
              </div>

              {/* Mini Invoice Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="text-lg font-bold text-blue-600">UMKM Partnership</h5>
                    <p className="text-sm text-gray-600">Professional Endorsement Services</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">INVOICE #{currentOrder.orderId}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(currentOrder.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Bill To:</p>
                    <p>{currentOrder.customerName}</p>
                    <p>{currentOrder.brandName}</p>
                    <p>{currentOrder.instagram}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Order Details:</p>
                    <p>{currentOrder.products.length} Product(s)</p>
                    <p>Payment: Bank Transfer</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    {currentOrder.products.map((product, index) => {
                      const endorsementType = content.formFields.endorsementTypes.find(
                        (type) => type.value === product.endorsementType,
                      )
                      return (
                        <div key={product.id} className="flex justify-between items-center text-sm">
                          <div className="flex-1">
                            <p className="font-medium">Product {index + 1}</p>
                            <p className="text-xs text-gray-600 truncate max-w-xs">{product.productDescription}</p>
                            <p className="text-xs text-blue-600 font-medium">
                              {endorsementType?.label} - {endorsementType?.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{formatIDRPrice(product.price)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="border-t border-gray-300 mt-4 pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatIDRPrice(currentOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-500" />
                Order Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{currentOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{currentOrder.brandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">{currentOrder.products.length} item(s)</span>
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-blue-600">{formatIDRPrice(currentOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">{content.bankInfo.sectionTitle}</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600 text-sm">{content.bankInfo.bankLabel}</span>
                    <div className="font-medium text-gray-900">{content.bankInfo.bankName}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(content.bankInfo.bankName, "bank")}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedField === "bank" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600 text-sm">{content.bankInfo.accountNumberLabel}</span>
                    <div className="font-medium text-gray-900 font-mono">{content.bankInfo.accountNumber}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(content.bankInfo.accountNumber, "account")}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedField === "account" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600 text-sm">{content.bankInfo.accountNameLabel}</span>
                    <div className="font-medium text-gray-900">{content.bankInfo.accountName}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(content.bankInfo.accountName, "name")}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedField === "name" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600 text-sm">Amount to Transfer:</span>
                    <div className="font-bold text-lg text-blue-600">{formatIDRPrice(currentOrder.totalAmount)}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(currentOrder.totalAmount.toString(), "amount")}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copiedField === "amount" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                {content.paymentInstructions.title}
              </h4>
              <div className="space-y-3">
                {content.paymentInstructions.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">{content.orderSummaryLabels.paymentWarning}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <button
                onClick={sendPaymentConfirmation}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Confirm Payment via WhatsApp</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`/tracking?orderId=${currentOrder.orderId}`}
                  className="bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Track Order</span>
                </Link>

                <button
                  onClick={printInvoice}
                  className="bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Save this page or take a screenshot for your records. Your order ID is:{" "}
                <strong>{currentOrder.orderId}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div className="flex items-start mb-4 md:mb-0">
            <Link href="/" className="mr-4 p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">{content.title}</h1>
              <p className="text-gray-600 mt-2 text-sm md:text-base">{content.description}</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs md:text-sm text-gray-600 mb-2">{content.trackingSection.description}</p>
            <Link
              href="/tracking"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 text-sm md:text-base"
            >
              <Package className="w-4 h-4 md:w-5 md:h-5" />
              <span>{content.trackingSection.buttonText}</span>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="card">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.formFields.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                      placeholder={content.formFields.namePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.formFields.brandLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brandName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, brandName: e.target.value }))}
                      className="input-field"
                      placeholder={content.formFields.brandPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.formFields.instagramLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.instagram}
                      onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                      className="input-field"
                      placeholder={content.formFields.instagramPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.formFields.phoneLabel}
                    </label>
                    <div className="flex">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center space-x-2 px-3 py-3 border border-gray-200 border-r-0 rounded-l-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-lg">{selectedCountry?.flag}</span>
                          <span className="text-sm font-medium">{selectedCountry?.dialCode}</span>
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                            {enabledCountries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, countryCode: country.dialCode }))
                                  setShowCountryDropdown(false)
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                              >
                                <span className="text-lg">{country.flag}</span>
                                <div>
                                  <div className="font-medium text-gray-900">{country.name}</div>
                                  <div className="text-sm text-gray-500">{country.dialCode}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all duration-200 bg-white/50"
                        placeholder={content.formFields.phonePlaceholder}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="card">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Product Details</h2>

                <div className="space-y-6">
                  {formData.products.map((product, index) => (
                    <div
                      key={product.id}
                      className="border-2 border-gray-200 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs md:text-sm font-bold">{index + 1}</span>
                          </div>
                          Product {index + 1}
                        </h3>
                        {formData.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(product.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {content.formFields.productLabel}
                          </label>
                          <textarea
                            required
                            value={product.productDescription}
                            onChange={(e) => updateProduct(product.id, "productDescription", e.target.value)}
                            className="input-field h-20 md:h-24 resize-none"
                            placeholder={content.formFields.productPlaceholder}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            {content.formFields.endorsementTypeLabel}
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {content.formFields.endorsementTypes.map((type) => (
                              <div
                                key={type.value}
                                onClick={() => updateProduct(product.id, "endorsementType", type.value)}
                                className={`relative cursor-pointer rounded-2xl border-2 p-4 md:p-6 transition-all duration-200 hover:shadow-lg ${
                                  product.endorsementType === type.value
                                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                {product.endorsementType === type.value && (
                                  <div className="absolute top-3 right-3">
                                    <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                      <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                                    <h4 className="font-bold text-gray-900 text-sm md:text-base">{type.label}</h4>
                                  </div>
                                </div>

                                <p className="text-xs md:text-sm text-gray-600 mb-4">{type.description}</p>

                                <div className="text-right">
                                  <span className="text-lg md:text-2xl font-bold text-blue-600">
                                    {formatIDRPrice(type.price)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {content.formFields.endorseMonthLabel}
                            </label>
                            <input
                              type="month"
                              required
                              value={product.endorseMonth}
                              onChange={(e) => updateProduct(product.id, "endorseMonth", e.target.value)}
                              className="input-field"
                              min={(() => {
                                const today = new Date()
                                const currentDay = today.getDate()

                                // If today is 14th or later, start from next month
                                if (currentDay >= 14) {
                                  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
                                  return nextMonth.toISOString().slice(0, 7)
                                } else {
                                  // If before 14th, allow current month
                                  return today.toISOString().slice(0, 7)
                                }
                              })()}
                              max={(() => {
                                const today = new Date()
                                const currentDay = today.getDate()

                                // Calculate 12 months from the minimum allowed month
                                let startMonth
                                if (currentDay >= 14) {
                                  startMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
                                } else {
                                  startMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                                }

                                // Add 11 months to get 12 months total range
                                const maxMonth = new Date(startMonth.getFullYear(), startMonth.getMonth() + 11, 1)
                                return maxMonth.toISOString().slice(0, 7)
                              })()}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(() => {
                                const today = new Date()
                                const currentDay = today.getDate()

                                if (currentDay >= 14) {
                                  return "Current month unavailable (after 14th). Select from next month onwards."
                                } else {
                                  return "Select endorsement month (up to 12 months ahead)"
                                }
                              })()}
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {content.formFields.photoLabel}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-rose-300 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(product.id, e.target.files[0])}
                                className="hidden"
                                id={`photo-upload-${product.id}`}
                              />
                              <label htmlFor={`photo-upload-${product.id}`} className="cursor-pointer">
                                {product.photo ? (
                                  <div>
                                    <img
                                      src={URL.createObjectURL(product.photo) || "/placeholder.svg"}
                                      alt="Product preview"
                                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg mx-auto mb-2"
                                    />
                                    <p className="text-green-600 font-medium text-xs md:text-sm">
                                      {product.photo.name}
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    <Upload className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600 text-xs md:text-sm">
                                      {content.formFields.photoHelpText}
                                    </p>
                                  </div>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={addProduct}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Add Another Product</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="card">
                <button type="submit" className="w-full btn-primary text-base md:text-lg py-3 md:py-4">
                  {content.submitButtonText}
                </button>
                <p className="text-xs md:text-sm text-gray-500 text-center mt-4">{content.disclaimerText}</p>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Order Summary */}
              <div className="card">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">{content.orderSummaryLabels.title}</h3>

                <div className="space-y-3 mb-4">
                  {formData.products.map((product, index) => {
                    const endorsementType = content.formFields.endorsementTypes.find(
                      (type) => type.value === product.endorsementType,
                    )
                    return (
                      <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <div className="font-medium text-gray-800 text-sm">Product {index + 1}</div>
                          <div className="text-xs text-gray-600">{endorsementType?.label || "Not selected"}</div>
                        </div>
                        <div className="font-semibold text-gray-800 text-sm">{formatIDRPrice(product.price)}</div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg md:text-xl font-bold text-gray-800">
                    <span>{content.orderSummaryLabels.totalLabel}</span>
                    <span className="text-blue-600">{formatIDRPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              {/* How it Works */}
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500" />
                  {content.orderSummaryLabels.howItWorksTitle}
                </h3>
                <div className="space-y-3">
                  {content.orderSummaryLabels.howItWorksSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-xs md:text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-xs md:text-sm text-yellow-800 font-medium">
                    {content.orderSummaryLabels.paymentWarning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}
    </div>
  )
}
