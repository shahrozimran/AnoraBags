"use client"

import React, { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Order, Product, ProductInput, Subscriber, CustomerSummary, AdminAnalytics, DatabaseStatus } from "@/lib/types"
import { Header } from "@/components/anora/header"
import { Footer } from "@/components/anora/footer"
import {
  updateOrderStatusAction,
  fetchAdminOrders,
  fetchAdminProducts,
  saveProductAction,
  deleteProductAction,
  toggleProductStockAction,
  fetchSubscribersAction,
  fetchCustomerSummariesAction,
  fetchAdminAnalyticsAction,
  fetchDatabaseStatusAction,
  resetDatabaseAction,
  verifyAdminKeyAction,
  logoutAdminAction
} from "@/app/actions/admin"
import {
  Banknote,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Download,
  Users,
  Layers,
  Settings,
  AlertTriangle,
  Printer,
  X,
  MessageCircle,
  LogOut,
  Eye,
  Sparkles,
  Database,
  Check,
  TrendingUp,
  MapPin,
  Tag
} from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products" | "customers" | "database">("dashboard")
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [adminKey, setAdminKey] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [passcodeInput, setPasscodeInput] = useState("")
  const [authError, setAuthError] = useState("")

  // Product Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState<ProductInput>({
    name: "",
    tagline: "",
    price: 6990,
    originalPrice: 8990,
    category: "crossbody",
    colorName: "Midnight Noir",
    colorHex: "#181615",
    badge: "New Arrival",
    image: "/images/products/bordeaux-crossbody-hero.jpeg",
    description: "",
    story: "",
    inStock: true,
    featured: false,
    isNew: true,
    specs: {
      dimensions: "22 cm (W) × 17 cm (H) × 9 cm (D)",
      weight: "480 grams",
      material: "Full-Grain Pebbled Calfskin Leather",
      hardware: "18k Brushed Gold Brass",
      strapDrop: "52 cm (Adjustable)",
      capacity: "Accordion interior with center zip divider",
      closure: "Mechanical Circular Twist-Lock",
      origin: "Handcrafted Full-Grain Leather Studio"
    }
  })

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("anora_admin_key") : null
    if (saved) {
      setAdminKey(saved)
      setIsAuthenticated(true)
      loadAllAdminData(saved)
    } else {
      setIsLoading(false)
    }
  }, [])

  const loadAllAdminData = async (key?: string) => {
    const activeKey = key || adminKey
    if (!activeKey) return
    setIsLoading(true)
    try {
      const [ordList, prodList, subsList, custsList, analyticsData, dbInfo] = await Promise.all([
        fetchAdminOrders(activeKey),
        fetchAdminProducts(activeKey),
        fetchSubscribersAction(activeKey),
        fetchCustomerSummariesAction(activeKey),
        fetchAdminAnalyticsAction(activeKey),
        fetchDatabaseStatusAction(activeKey)
      ])
      setOrders(ordList)
      setProducts(prodList)
      setSubscribers(subsList)
      setCustomers(custsList)
      setAnalytics(analyticsData)
      setDbStatus(dbInfo)
    } catch (e) {
      console.error("Failed to load admin data:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passcodeInput) return
    setAuthError("")
    const res = await verifyAdminKeyAction(passcodeInput)
    if (res.success) {
      sessionStorage.setItem("anora_admin_key", passcodeInput)
      setAdminKey(passcodeInput)
      setIsAuthenticated(true)
      loadAllAdminData(passcodeInput)
    } else {
      setAuthError(res.message || "Incorrect Admin PIN.")
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAdminAction()
    } catch {}
    sessionStorage.removeItem("anora_admin_key")
    setAdminKey("")
    setIsAuthenticated(false)
  }

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type })
    setTimeout(() => setFeedbackMessage(null), 4000)
  }

  // Format domestic Pakistani phone number (e.g. 0300 1234567) to international WhatsApp format (923001234567)
  const formatPakistaniWhatsAppNumber = (phone: string): string => {
    let digits = phone.replace(/[^0-9]/g, "")
    if (digits.startsWith("03") && digits.length === 11) {
      digits = "92" + digits.slice(1)
    } else if (digits.startsWith("9203")) {
      digits = "92" + digits.slice(3)
    } else if (digits.startsWith("0092")) {
      digits = digits.slice(2)
    }
    return digits
  }

  // Order Status Change
  const handleStatusChange = async (orderId: number, newStatus: Order["orderStatus"]) => {
    try {
      const res = await updateOrderStatusAction(orderId, newStatus, adminKey)
      if (!res.success) {
        showFeedback(res.message || "Failed to update order status", "error")
        return
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                orderStatus: newStatus,
                paymentStatus: newStatus === "Delivered" ? "Paid Cash on Delivery" : o.paymentStatus
              }
            : o
        )
      )
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null))
      }
      showFeedback(`Order #${orderId} marked as ${newStatus}`)
      // refresh analytics
      const updatedAnalytics = await fetchAdminAnalyticsAction(adminKey)
      setAnalytics(updatedAnalytics)
    } catch (e) {
      console.error("Failed to update status:", e)
      showFeedback("Failed to update order status", "error")
    }
  }

  // Product Catalog Handlers
  const openNewProductModal = () => {
    setEditingProduct(null)
    setProductForm({
      name: "",
      tagline: "Timeless Style, Modern You — Bags For Every You",
      price: 6990,
      originalPrice: 8990,
      category: "crossbody",
      colorName: "Rich Bordeaux Wine",
      colorHex: "#4A1525",
      badge: "New Arrival",
      image: "/images/products/bordeaux-crossbody-hero.jpeg",
      description: "Handcrafted from genuine full-grain pebbled calfskin leather with signature custom hardware.",
      story: "Architectural minimalism meets everyday utility.",
      inStock: true,
      featured: false,
      isNew: true,
      specs: {
        dimensions: "22 cm (W) × 17 cm (H) × 9 cm (D)",
        weight: "480 grams",
        material: "Full-Grain Pebbled Calfskin Leather",
        hardware: "18k Brushed Champagne Gold Brass",
        strapDrop: "52 cm (Adjustable)",
        capacity: "Accordion interior with center zip divider",
        closure: "Mechanical Circular Twist-Lock",
        origin: "Handcrafted Full-Grain Leather Studio"
      }
    })
    setIsProductModalOpen(true)
  }

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod)
    setProductForm({
      id: prod.id,
      name: prod.name,
      tagline: prod.tagline,
      price: prod.price,
      originalPrice: prod.originalPrice,
      category: prod.category,
      colorName: prod.colorName,
      colorHex: prod.colorHex,
      badge: prod.badge,
      image: prod.image,
      images: prod.images,
      availableColors: prod.availableColors,
      supports3D: prod.supports3D,
      description: prod.description,
      story: prod.story,
      inStock: prod.inStock,
      featured: prod.featured,
      isNew: prod.isNew,
      specs: prod.specs
    })
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await saveProductAction(productForm, adminKey)
      if (res.success && res.product) {
        showFeedback(`Bag "${res.product.name}" successfully saved to catalog!`)
        setIsProductModalOpen(false)
        const updatedList = await fetchAdminProducts(adminKey)
        setProducts(updatedList)
        const updatedAnalytics = await fetchAdminAnalyticsAction(adminKey)
        setAnalytics(updatedAnalytics)
      } else {
        showFeedback(res.message || "Failed to save product", "error")
      }
    })
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the catalog?`)) return
    startTransition(async () => {
      const res = await deleteProductAction(id, adminKey)
      if (res.success) {
        showFeedback(`Product "${name}" removed.`)
        const updatedList = await fetchAdminProducts(adminKey)
        setProducts(updatedList)
        const updatedAnalytics = await fetchAdminAnalyticsAction(adminKey)
        setAnalytics(updatedAnalytics)
      } else {
        showFeedback(res.message || "Could not delete product.", "error")
      }
    })
  }

  const handleToggleStock = async (id: string) => {
    startTransition(async () => {
      const res = await toggleProductStockAction(id, adminKey)
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, inStock: res.inStock ?? !p.inStock } : p))
        )
        showFeedback(`Stock status updated!`)
      } else {
        showFeedback(res.message || "Could not update stock status.", "error")
      }
    })
  }

  // Reset to Seed
  const handleResetDatabase = async () => {
    if (!confirm("Reset database to initial seed catalog and sample reviews? All custom orders will be cleared.")) return
    startTransition(async () => {
      const res = await resetDatabaseAction(adminKey)
      if (res.success) {
        showFeedback("Database reset to factory seeds!")
        loadAllAdminData()
      } else {
        showFeedback(res.message || "Failed to reset database.", "error")
      }
    })
  }

  // CSV Exporters
  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export.")
      return
    }
    const headers = ["OrderNumber", "Date", "Customer", "Phone", "Email", "City", "Address", "ItemsCount", "TotalPKR", "Status", "PaymentStatus"]
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.email}"`,
      `"${o.city}"`,
      `"${(o.address + (o.apartment ? ", " + o.apartment : "")).replace(/"/g, '""')}"`,
      o.items.length,
      o.totalAmount,
      o.orderStatus,
      o.paymentStatus
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `anora_cod_orders_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportCustomersCSV = () => {
    if (customers.length === 0) {
      alert("No customers to export.")
      return
    }
    const headers = ["Name", "Phone", "Email", "City", "OrderCount", "TotalSpentPKR", "LatestOrderDate"]
    const rows = customers.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.city}"`,
      c.orderCount,
      c.totalSpent,
      new Date(c.latestOrderDate).toLocaleDateString()
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `anora_customers_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      alert("No subscribers to export.")
      return
    }
    const headers = ["ID", "Email", "SubscribedAt"]
    const rows = subscribers.map((s) => [s.id, s.email, new Date(s.createdAt).toLocaleDateString()])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `anora_subscribers_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "all" || o.orderStatus === filterStatus
    const q = search.toLowerCase()
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })

  // Security Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between">
        <Header />
        <main className="max-w-md mx-auto px-4 py-12 sm:py-20 w-full">
          <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-[#E5DCD2] shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#462F1D]/10 text-[#462F1D] flex items-center justify-center mx-auto border border-[#462F1D]/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#462F1D]">Staff Portal</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">Anora Admin Access</h1>
              <p className="text-sm text-stone-600 font-light">
                Enter your security PIN to manage bag catalogs, dispatch orders, and inspect COD metrics.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Security PIN / Access Key</label>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter Admin PIN"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-hidden focus:border-[#462F1D] bg-stone-50/50"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-600 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#462F1D] text-white hover:bg-[#32231A] text-sm font-medium transition shadow-sm"
              >
                Authenticate & Unlock
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Feedback Banner */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium flex items-center justify-between shadow-xs transition ${
              feedbackMessage.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                : "bg-rose-50 border border-rose-200 text-rose-900"
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button onClick={() => setFeedbackMessage(null)} className="p-1 hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Admin Header with Tab Navigation */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-xs font-mono text-stone-600">
                  Anora Admin Command Center
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#462F1D]/10 text-[#462F1D] text-xs font-semibold">
                  {dbStatus?.engine || "Universal DB"}
                </span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-light text-stone-900 mt-1">
                Store Operations & Logistics
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <button
                onClick={() => loadAllAdminData()}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-medium transition"
                title="Reload from DB"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </button>

              <button
                onClick={openNewProductModal}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#462F1D] text-white hover:bg-[#342214] text-xs font-medium transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bag</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Lock Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-t border-stone-100 pt-3 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "dashboard"
                  ? "bg-[#462F1D] text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>COD Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "orders"
                  ? "bg-[#462F1D] text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "products"
                  ? "bg-[#462F1D] text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Bags Catalog ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("customers")}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "customers"
                  ? "bg-[#462F1D] text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers & Club ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("database")}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === "database"
                  ? "bg-[#462F1D] text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Database Engine</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD & COD ANALYTICS */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs font-medium text-stone-500">Total COD Volume</span>
                <p className="font-serif text-2xl font-semibold text-stone-900">{orders.length} Orders</p>
                <p className="text-xs text-stone-500 font-normal">Nationwide doorsteps</p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs font-medium text-stone-500">Total Booked Value</span>
                <p className="font-serif text-2xl font-semibold text-[#462F1D]">
                  Rs. {analytics?.totalRevenue.toLocaleString() || 0}
                </p>
                <p className="text-xs text-stone-500 font-normal">Cash receivable volume</p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs font-medium text-stone-500">Delivered Cash Collected</span>
                <p className="font-serif text-2xl font-semibold text-emerald-700">
                  Rs. {analytics?.deliveredCashCollected.toLocaleString() || 0}
                </p>
                <p className="text-xs text-emerald-700 font-medium">{analytics?.deliveredOrders || 0} parcels completed</p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <span className="text-xs font-medium text-stone-500">Average Order Value (AOV)</span>
                <p className="font-serif text-2xl font-semibold text-stone-900">
                  Rs. {analytics?.averageOrderValue.toLocaleString() || 0}
                </p>
                <p className="text-xs text-stone-500 font-normal">Per customer cart</p>
              </div>
            </div>

            {/* Pipeline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-amber-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>In Preparation</span>
                  </span>
                  <span className="text-sm font-bold text-amber-800">{analytics?.pendingOrders || 0}</span>
                </div>
                <p className="text-xs text-stone-500 font-light">
                  Orders requiring verification, packaging, and dispatch handover to courier rider.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-700 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>In Courier Transit</span>
                  </span>
                  <span className="text-sm font-bold text-blue-800">{analytics?.dispatchedOrders || 0}</span>
                </div>
                <p className="text-xs text-stone-500 font-light">
                  En route with TCS / Leopards / Trax couriers for doorstep cash collection.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Delivered & 7-Day Window</span>
                  </span>
                  <span className="text-sm font-bold text-emerald-800">{analytics?.deliveredOrders || 0}</span>
                </div>
                <p className="text-xs text-stone-500 font-light">
                  Client has accepted package. Unconditional 7-day refund guarantee currently active.
                </p>
              </div>
            </div>

            {/* Top Regional Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-normal text-stone-900">Regional COD Deliveries</h3>
                  <p className="text-xs text-stone-500 font-light">Top Pakistani urban centers by cash volume</p>
                </div>
                <button
                  onClick={exportOrdersCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Orders CSV</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {analytics?.topCities && analytics.topCities.length > 0 ? (
                  analytics.topCities.map((item) => (
                    <div key={item.city} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900 text-sm">{item.city}</span>
                        <span className="text-xs font-bold text-[#462F1D]">{item.count} orders</span>
                      </div>
                      <p className="text-xs text-stone-500 font-light">Rs. {item.total.toLocaleString()} total</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 col-span-4 py-4 text-center">No city data available yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-md overflow-hidden space-y-4">
            {/* Filters Bar */}
            <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search order #, customer, phone, city..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:border-[#462F1D]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {["all", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                      filterStatus === st
                        ? "bg-[#462F1D] text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {st === "all" ? "All Orders" : st}
                  </button>
                ))}

                <button
                  onClick={exportOrdersCSV}
                  className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
                  title="Export to CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-xs text-stone-600 border-b border-stone-200 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Amount (COD)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-stone-400 font-light">
                        No orders found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                        <td className="py-3.5 px-4 font-mono font-medium text-[#462F1D]">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="hover:underline font-semibold text-left"
                          >
                            {ord.orderNumber}
                          </button>
                          <p className="text-xs text-stone-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-stone-900">{ord.customerName}</p>
                          <div className="flex items-center gap-1.5 text-stone-500">
                            <span>{ord.phone}</span>
                            <a
                              href={`https://wa.me/${formatPakistaniWhatsAppNumber(ord.phone)}?text=Hi%20${encodeURIComponent(ord.customerName)},%20this%20is%20Anora%20Bags%20regarding%20order%20${ord.orderNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                              title="Message on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-stone-800">
                          {ord.city}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium text-xs">
                            {ord.items.length} bag(s)
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-900">
                            Rs. {ord.totalAmount.toLocaleString()}
                          </span>
                          <p className={`text-xs font-medium ${ord.orderStatus === "Delivered" ? "text-emerald-700" : "text-amber-700"}`}>
                            {ord.paymentStatus}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                              ord.orderStatus === "Delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.orderStatus === "Dispatched"
                                ? "bg-blue-100 text-blue-800"
                                : ord.orderStatus === "Out for Delivery"
                                ? "bg-purple-100 text-purple-800"
                                : ord.orderStatus === "Cancelled"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                              className="text-xs rounded-lg border border-stone-300 py-1 px-2 bg-white text-stone-800 focus:outline-hidden"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="p-1.5 text-stone-400 hover:text-stone-700 transition"
                              title="Inspect Packing Slip"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <Link
                              href={`/order-confirmation/${ord.orderNumber}`}
                              target="_blank"
                              className="p-1.5 text-stone-400 hover:text-stone-700 transition"
                              title="View Client Confirmation"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-normal text-stone-900">Handbag Catalog</h3>
                <p className="text-xs text-stone-500 font-light">
                  Manage product titles, prices, stock statuses, specs, and editorial stories.
                </p>
              </div>

              <button
                onClick={openNewProductModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#462F1D] text-white hover:bg-[#342214] text-xs font-medium transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Bag</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                      {prod.badge && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#462F1D] text-white text-xs font-medium shadow-sm">
                          {prod.badge}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleStock(prod.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition shadow-sm ${
                            prod.inStock
                              ? "bg-emerald-600 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {prod.inStock ? "In Stock" : "Sold Out"}
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-[#462F1D] capitalize">
                          {prod.category}
                        </span>
                        <h4 className="font-serif text-lg font-normal text-stone-900 line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1 font-light">
                          {prod.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                        <div>
                          <span className="font-semibold text-stone-900 text-sm">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-stone-400 line-through ml-2 text-xs">
                              Rs. {prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-700 font-medium">
                          <span>★ {prod.rating}</span>
                          <span className="text-stone-400">({prod.reviewCount})</span>
                        </div>
                      </div>

                      {/* Specs pills */}
                      <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 space-y-0.5">
                        <p><strong>Dimensions:</strong> {prod.specs.dimensions}</p>
                        <p><strong>Material:</strong> {prod.specs.material}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      href={`/product/${prod.id}`}
                      target="_blank"
                      className="text-xs text-stone-600 hover:text-stone-900 inline-flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditProductModal(prod)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-medium flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS & SUBSCRIBERS */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Unique Customers */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-stone-900">Client Directory</h3>
                    <p className="text-xs text-stone-500 font-light">
                      Unique clients aggregated from nationwide COD orders
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#462F1D] bg-[#462F1D]/10 px-3 py-1 rounded-full">
                      {customers.length} Clients
                    </span>
                    <button
                      onClick={exportCustomersCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-xs text-stone-600 border-b border-stone-200 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Client</th>
                        <th className="py-2.5 px-3">City</th>
                        <th className="py-2.5 px-3">Orders</th>
                        <th className="py-2.5 px-3">Total Spend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {customers.map((c, i) => (
                        <tr key={i} className="hover:bg-stone-50">
                          <td className="py-3 px-3">
                            <p className="font-semibold text-stone-900">{c.name}</p>
                            <p className="text-xs text-stone-500">{c.phone}</p>
                          </td>
                          <td className="py-3 px-3 font-medium text-stone-800">{c.city}</td>
                          <td className="py-3 px-3 font-semibold text-stone-900">{c.orderCount}</td>
                          <td className="py-3 px-3 font-bold text-[#462F1D]">
                            Rs. {c.totalSpent.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Newsletter Subscribers */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-stone-900">Anora Club Subscribers</h3>
                    <p className="text-xs text-stone-500 font-light">VIP early-access email subscribers</p>
                  </div>
                  <button
                    onClick={exportSubscribersCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full min-w-[340px] text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-xs text-stone-600 border-b border-stone-200 font-semibold sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Subscribed At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {subscribers.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="py-6 text-center text-stone-400 font-light">
                            No newsletter subscribers yet.
                          </td>
                        </tr>
                      ) : (
                        subscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-stone-50">
                            <td className="py-3 px-3 font-medium text-stone-900">{sub.email}</td>
                            <td className="py-3 px-3 text-stone-400">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE & EDGE DIAGNOSTICS */}
        {activeTab === "database" && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#462F1D]">Infrastructure</span>
              <h2 className="font-serif text-2xl font-normal text-stone-900">Database Engine & Hosting Environment</h2>
              <p className="text-xs text-stone-500 font-light">
                Designed for 100% zero-cost out of the box with 1-click serverless edge Postgres (Neon/Supabase) scalability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 text-xs">
                <h4 className="font-semibold text-stone-900">Active Storage Adapter</h4>
                <div className="space-y-1.5 text-stone-600">
                  <p><strong>Engine:</strong> <span className="font-mono text-stone-900">{dbStatus?.engine}</span></p>
                  <p><strong>Location:</strong> <span className="font-mono text-xs text-stone-700">{dbStatus?.storagePath}</span></p>
                  <p><strong>Remote Connection:</strong> {dbStatus?.isRemote ? "Yes (Cloud Database)" : "No (Local Zero-Cost File Store)"}</p>
                  <p><strong>Writable:</strong> {dbStatus?.isWritable ? "Yes (Full Persistence Active)" : "No"}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 text-xs">
                <h4 className="font-semibold text-stone-900">Record Summary</h4>
                <div className="space-y-1.5 text-stone-600">
                  <p><strong>Products in Catalog:</strong> {dbStatus?.counts.products}</p>
                  <p><strong>Total COD Orders:</strong> {dbStatus?.counts.orders}</p>
                  <p><strong>Verified Customer Reviews:</strong> {dbStatus?.counts.reviews}</p>
                  <p><strong>VIP Club Subscribers:</strong> {dbStatus?.counts.subscribers}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-stone-900">Reset to Factory Seeds</h4>
                <p className="text-xs text-stone-500">Restore the original 5 handcrafted bags and authentic customer testimonials.</p>
              </div>

              <button
                onClick={handleResetDatabase}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 text-xs font-medium transition"
              >
                Reset Database
              </button>
            </div>
          </div>
        )}

        {/* MODAL 1: ADD / EDIT PRODUCT */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-stone-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="font-serif text-xl font-normal text-stone-900">
                  {editingProduct ? "Edit Handbag" : "Add New Handbag to Catalog"}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-medium text-stone-700">Bag Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. The Anora Royale Flap Crossbody"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-medium text-stone-700">Editorial Tagline</label>
                    <input
                      type="text"
                      value={productForm.tagline}
                      onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                      placeholder="e.g. Timeless Style, Modern You — Bags For Every You"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Original Price (Strikethrough)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice || ""}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value ? Number(e.target.value) : null })}
                      placeholder="e.g. 8990"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Silhouette Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 bg-white"
                    >
                      <option value="crossbody">Crossbody</option>
                      <option value="satchel">Satchel</option>
                      <option value="top-handle">Top-Handle</option>
                      <option value="tote">Tote</option>
                      <option value="shoulder">Shoulder</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Badge Tag (Optional)</label>
                    <input
                      type="text"
                      value={productForm.badge || ""}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value || null })}
                      placeholder="e.g. Signature Bestseller or Drop Soon"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Color Shade Name</label>
                    <input
                      type="text"
                      value={productForm.colorName}
                      onChange={(e) => setProductForm({ ...productForm, colorName: e.target.value })}
                      placeholder="e.g. Rich Bordeaux Wine"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Color Hex Code</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={productForm.colorHex}
                        onChange={(e) => setProductForm({ ...productForm, colorHex: e.target.value })}
                        className="w-10 h-10 rounded-xl border border-stone-300 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={productForm.colorHex}
                        onChange={(e) => setProductForm({ ...productForm, colorHex: e.target.value })}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-medium text-stone-700">Primary Image URL</label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="/images/products/bordeaux-crossbody-hero.jpeg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-medium text-stone-700">Description</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Handcrafted from genuine full-grain pebbled calfskin leather..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-medium text-stone-700">Design Story</label>
                    <textarea
                      rows={2}
                      value={productForm.story || ""}
                      onChange={(e) => setProductForm({ ...productForm, story: e.target.value })}
                      placeholder="Inspired by European café afternoons..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Dimensions</label>
                    <input
                      type="text"
                      value={productForm.specs?.dimensions || ""}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          specs: { ...productForm.specs, dimensions: e.target.value } as any
                        })
                      }
                      placeholder="22 cm (W) × 17 cm (H) × 9 cm (D)"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Weight</label>
                    <input
                      type="text"
                      value={productForm.specs?.weight || ""}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          specs: { ...productForm.specs, weight: e.target.value } as any
                        })
                      }
                      placeholder="480 grams"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Leather Material</label>
                    <input
                      type="text"
                      value={productForm.specs?.material || ""}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          specs: { ...productForm.specs, material: e.target.value } as any
                        })
                      }
                      placeholder="Full-Grain Pebbled Calfskin Leather"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Hardware Accent</label>
                    <input
                      type="text"
                      value={productForm.specs?.hardware || ""}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          specs: { ...productForm.specs, hardware: e.target.value } as any
                        })
                      }
                      placeholder="18k Brushed Champagne Gold Brass"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Strap Drop</label>
                    <input
                      type="text"
                      value={productForm.specs?.strapDrop || ""}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          specs: { ...productForm.specs, strapDrop: e.target.value } as any
                        })
                      }
                      placeholder="52 cm (Adjustable)"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-stone-700">Closure Type</label>
                    <input
                      type="text"
                      value={productForm.specs?.closure || ""}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          specs: { ...productForm.specs, closure: e.target.value } as any
                        })
                      }
                      placeholder="Mechanical Circular Twist-Lock"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-medium text-stone-700">Capacity & Compartments</label>
                    <input
                      type="text"
                      value={productForm.specs?.capacity || ""}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          specs: { ...productForm.specs, capacity: e.target.value } as any
                        })
                      }
                      placeholder="Accordion interior with center zip divider"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-900"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-2 border-t border-stone-100 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="rounded text-[#462F1D] focus:ring-[#462F1D]"
                    />
                    <span className="font-medium text-stone-800">In Stock for COD</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="rounded text-[#462F1D] focus:ring-[#462F1D]"
                    />
                    <span className="font-medium text-stone-800">Feature on Homepage</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-full bg-[#462F1D] hover:bg-[#342214] text-white font-medium transition shadow-sm disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Save Handbag"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ORDER DETAILS / PACKING SLIP */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="anora-printable-slip bg-white rounded-2xl sm:rounded-3xl border border-stone-200 max-w-xl w-full p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-xs font-semibold font-mono text-[#462F1D]">COD Packing Slip</span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 no-print"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Courier Delivery Details */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#462F1D]" />
                    <span>Shipping Destination</span>
                  </span>
                  <span className="text-xs text-emerald-800 font-medium">Free Express COD</span>
                </div>
                <p className="font-medium text-stone-900 text-sm">{selectedOrder.customerName}</p>
                <p className="text-stone-600">{selectedOrder.address}</p>
                {selectedOrder.apartment && <p className="text-stone-600">{selectedOrder.apartment}</p>}
                <p className="text-stone-700 font-semibold">{selectedOrder.city} {selectedOrder.postalCode}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <p className="text-stone-600 break-words">Phone: <strong>{selectedOrder.phone}</strong> | Email: {selectedOrder.email}</p>
                  <a
                    href={`https://wa.me/${formatPakistaniWhatsAppNumber(selectedOrder.phone)}?text=Hi%20${encodeURIComponent(selectedOrder.customerName)},%20this%20is%20Anora%20Bags%20regarding%20order%20${selectedOrder.orderNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium text-xs transition no-print self-start sm:self-auto"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
                {selectedOrder.deliveryNotes && (
                  <p className="pt-1 text-amber-900 italic font-light bg-amber-50 p-2 rounded-lg">
                    Notes: {selectedOrder.deliveryNotes}
                  </p>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-stone-500">
                  Parcel Contents ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          <Image src={it.image} alt={it.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-stone-900">{it.name}</p>
                          <p className="text-stone-400">Color: {it.color} • Qty: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-stone-900">
                        Rs. {(it.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Status Selector */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 block text-xs font-medium">Total Cash Receivable</span>
                  <span className="text-xl font-serif font-bold text-[#462F1D]">
                    Rs. {selectedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as any)}
                    className="text-xs rounded-xl border border-stone-300 py-2 px-3 bg-white font-medium text-stone-800"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
                    title="Print Slip"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Print Styles for Clean Packing Slip */}
        <style jsx global>{`
          @media print {
            body {
              background: white !important;
            }
            header, footer, nav, .no-print, button {
              display: none !important;
            }
            .anora-printable-slip {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              box-shadow: none !important;
              border: 2px solid #23170F !important;
              border-radius: 0 !important;
              padding: 32px !important;
              background: white !important;
              z-index: 999999 !important;
            }
            .anora-printable-slip * {
              visibility: visible !important;
            }
          }
        `}</style>
      </main>

      <Footer />
    </div>
  )
}
