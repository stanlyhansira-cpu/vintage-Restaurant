import React, { useState, useEffect, useCallback } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  Order, 
  OrderStatus, 
  MenuItem, 
  Category, 
  GalleryImage,
  RestaurantSettings 
} from '../../types';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  Settings as SettingsIcon, 
  Image as ImageIcon, 
  Lock, 
  LogOut, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Phone, 
  MapPin, 
  Search, 
  ExternalLink,
  MessageCircle,
  X,
  Sparkles,
  RefreshCw,
  FolderTree,
  Mail,
  Copy
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    settings, 
    categories, 
    menuItems, 
    gallery, 
    isAdminAuthenticated, 
    adminLogin, 
    adminLogout,
    updateSettings,
    saveMenuItem,
    deleteMenuItem,
    saveCategory,
    deleteCategory,
    saveGalleryImage,
    deleteGalleryImage,
    updateOrderStatus,
    showToast,
    refreshData
  } = useRestaurant();

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin tabs: 'overview' | 'orders' | 'menu' | 'categories' | 'settings' | 'gallery'
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'categories' | 'settings' | 'gallery'>('overview');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Analytics state
  const [analytics, setAnalytics] = useState<any>({
    todayOrdersCount: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    completedOrders: 0,
    todayRevenue: 0,
    totalOrdersCount: 0,
    popularItems: []
  });

  // Modals state
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [newGalleryPhoto, setNewGalleryPhoto] = useState<Partial<GalleryImage>>({
    title: '',
    category: 'Food',
    image_url: '',
    caption: ''
  });
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'item' | 'category' | 'gallery' } | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<RestaurantSettings>(settings);
  const [subscribers, setSubscribers] = useState<{ email: string; subscribed_at: string }[]>([]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Fetch admin orders & analytics & newsletter subscribers
  const fetchAdminData = useCallback(async () => {
    if (!isAdminAuthenticated) return;
    try {
      const token = localStorage.getItem('vintage_admin_token_v1');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [ordersRes, analyticsRes, newsletterRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/admin/analytics', { headers }),
        fetch('/api/newsletter', { headers })
      ]);

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data);
      }
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }
      if (newsletterRes.ok) {
        const data = await newsletterRes.json();
        setSubscribers(data.subscribers || []);
      }
    } catch (e) {
      console.error('Failed to fetch admin data:', e);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated, fetchAdminData]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const ok = await adminLogin(passwordInput);
    setIsLoggingIn(false);
    if (ok) {
      setPasswordInput('');
    }
  };

  // Status transitions
  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    const ok = await updateOrderStatus(orderId, nextStatus);
    if (ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      if (selectedOrderForView && selectedOrderForView.id === orderId) {
        setSelectedOrderForView(prev => prev ? { ...prev, status: nextStatus } : null);
      }
      fetchAdminData();
    }
  };

  // If not authenticated, render Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#1c1a17] border border-[#C59A4E]/30 shadow-2xl space-y-6 text-center">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#C59A4E]/40 bg-black flex items-center justify-center mx-auto shadow-lg">
            <img
              src={settings.logo_url || "/logo.png"}
              alt="Vintage Restaurant Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <h1 className="font-serif-vintage text-2xl sm:text-3xl font-bold text-[#F6F3EE] mb-2">
              Restaurant Staff Portal
            </h1>
            <p className="text-xs text-[#A89F93]">
              Authorized personnel only. Manage online food orders, live menu availability, and business settings.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="admin-password-input" className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                Administrator Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full px-4 py-3 rounded-xl bg-[#262420] border border-white/10 text-sm text-[#F6F3EE] placeholder-[#666] focus:outline-none focus:border-[#C59A4E] transition-colors"
              />
              <span className="block text-[11px] text-[#7A7268] mt-1.5">
                Default password: <code className="text-[#C59A4E]">vintage123</code> (Configurable via <code>ADMIN_PASSWORD</code>)
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C59A4E] to-[#A8811F] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg active:scale-98"
            >
              {isLoggingIn ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orderFilterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === orderFilterStatus);

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-[#141210] pb-24">
      {/* Admin Top Header */}
      <div className="bg-[#1b1916] border-b border-white/10 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#C59A4E]/30 bg-black flex items-center justify-center shrink-0">
            <img
              src={settings.logo_url || "/logo.png"}
              alt="Vintage Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="font-serif-vintage text-lg font-bold text-white block leading-tight">
              Vintage Operations
            </span>
            <span className="text-[11px] text-[#857D74]">
              {settings.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            title="Refresh dashboard data"
            className="p-2 rounded-lg bg-[#262420] text-[#C3BAAF] hover:text-white border border-white/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={adminLogout}
            className="px-4 py-2 rounded-lg bg-red-900/30 text-red-300 hover:bg-red-900/50 text-xs font-semibold flex items-center gap-2 border border-red-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-white/5 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.filter(o => o.status === 'pending').length} Pending)`, icon: ShoppingBag },
            { id: 'menu', label: `Menu Items (${menuItems.length})`, icon: Utensils },
            { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-[#C59A4E] text-black shadow-md' 
                    : 'bg-[#1e1c19] text-[#A89F93] hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* ==================================================== */}
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {/* ==================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md">
                <div className="flex items-center justify-between text-xs text-[#857D74] mb-3">
                  <span className="uppercase font-bold">Today's Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-[#F6F3EE]">
                  {settings.currency} {analytics.todayRevenue.toLocaleString()}
                </div>
                <span className="text-[11px] text-[#7A7268] mt-1 block">
                  From {analytics.todayOrdersCount} orders placed today
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md">
                <div className="flex items-center justify-between text-xs text-[#857D74] mb-3">
                  <span className="uppercase font-bold">Pending Confirmation</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-amber-400">
                  {analytics.pendingOrders}
                </div>
                <span className="text-[11px] text-[#7A7268] mt-1 block">
                  Awaiting WhatsApp review
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md">
                <div className="flex items-center justify-between text-xs text-[#857D74] mb-3">
                  <span className="uppercase font-bold">In Kitchen / Preparing</span>
                  <Utensils className="w-4 h-4 text-[#C59A4E]" />
                </div>
                <div className="text-3xl font-bold font-mono text-[#C59A4E]">
                  {analytics.preparingOrders}
                </div>
                <span className="text-[11px] text-[#7A7268] mt-1 block">
                  Currently cooking
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md">
                <div className="flex items-center justify-between text-xs text-[#857D74] mb-3">
                  <span className="uppercase font-bold">Completed Orders</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-emerald-400">
                  {analytics.completedOrders}
                </div>
                <span className="text-[11px] text-[#7A7268] mt-1 block">
                  Successfully delivered / picked up
                </span>
              </div>
            </div>

            {/* Popular Items & Quick Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Popular Menu Items */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md">
                <h3 className="font-serif-vintage text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C59A4E]" />
                  <span>Popular Dishes (by Volume)</span>
                </h3>

                {analytics.popularItems && analytics.popularItems.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.popularItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#262420] border border-white/5 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center font-bold text-[#C59A4E]">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-[#F6F3EE]">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white block">{item.count} orders</span>
                          <span className="text-[10px] text-[#857D74] font-mono">{settings.currency} {item.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#857D74]">No orders recorded yet to calculate dish popularity.</p>
                )}
              </div>

              {/* Recent Orders List */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif-vintage text-lg font-bold text-white">
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#C59A4E] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-[#857D74] py-8 text-center">No orders have been received yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(o => (
                      <div
                        key={o.id}
                        onClick={() => setSelectedOrderForView(o)}
                        className="p-3.5 rounded-xl bg-[#262420] hover:bg-[#2e2b26] border border-white/5 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#C59A4E]">{o.order_number}</span>
                            <span className="text-white font-medium">{o.customer_name}</span>
                          </div>
                          <span className="text-[11px] text-[#857D74] block mt-0.5">
                            {o.items.length} items • {o.order_type.toUpperCase()}
                          </span>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <span className="font-mono font-bold text-white">
                            {settings.currency} {o.total.toLocaleString()}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            o.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                            o.status === 'confirmed' ? 'bg-blue-500/20 text-blue-300' :
                            o.status === 'preparing' ? 'bg-purple-500/20 text-purple-300' :
                            o.status === 'ready' ? 'bg-indigo-500/20 text-indigo-300' :
                            o.status === 'out_for_delivery' ? 'bg-orange-500/20 text-orange-300' :
                            o.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter & VIP Club Subscribers Card */}
            <div className="p-6 rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C59A4E]/15 border border-[#C59A4E]/30 flex items-center justify-center text-[#C59A4E]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-vintage text-lg font-bold text-white">
                      Newsletter & VIP Dining Club
                    </h3>
                    <p className="text-xs text-[#857D74]">
                      {subscribers.length} customer {subscribers.length === 1 ? 'email' : 'emails'} collected from footer signup
                    </p>
                  </div>
                </div>

                {subscribers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const allEmails = subscribers.map(s => s.email).join(', ');
                      navigator.clipboard.writeText(allEmails);
                      showToast(`Copied ${subscribers.length} subscriber emails to clipboard!`, 'success');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262420] hover:bg-[#302d28] border border-[#C59A4E]/30 text-xs font-semibold text-[#E0BC75] transition-colors self-start sm:self-auto"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Emails</span>
                  </button>
                )}
              </div>

              {subscribers.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#7A7268] border border-dashed border-white/10 rounded-2xl bg-black/20">
                  No newsletter subscribers yet. Customer emails collected through the footer will appear here.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {subscribers.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#262420] border border-white/5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-mono text-[#F6F3EE] block truncate">{sub.email}</span>
                        <span className="text-[10px] text-[#7A7268]">
                          {new Date(sub.subscribed_at).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(sub.email);
                          showToast(`Copied ${sub.email}`, 'info');
                        }}
                        title="Copy email"
                        className="p-1 rounded text-[#857D74] hover:text-[#C59A4E] hover:bg-white/5"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: ORDERS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'preparing', label: 'Preparing' },
                  { id: 'ready', label: 'Ready' },
                  { id: 'out_for_delivery', label: 'Out for Delivery' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'cancelled', label: 'Cancelled' },
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setOrderFilterStatus(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      orderFilterStatus === st.id
                        ? 'bg-[#C59A4E] text-black'
                        : 'bg-[#1e1c19] text-[#A89F93] hover:text-white border border-white/5'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-[#857D74]">
                Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-[#1d1b18] border border-white/5">
                <ShoppingBag className="w-12 h-12 text-[#666] mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No orders found</h3>
                <p className="text-xs text-[#857D74]">No orders match the selected filter criteria.</p>
              </div>
            ) : (
              <div className="rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#24221e] text-[#857D74] uppercase font-bold tracking-wider border-b border-white/5">
                      <tr>
                        <th className="p-4">Order #</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Time</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-mono font-bold text-[#C59A4E]">
                            {order.order_number}
                          </td>
                          <td className="p-4 font-medium text-white">
                            {order.customer_name}
                          </td>
                          <td className="p-4">
                            <a 
                              href={`tel:${order.customer_phone}`}
                              className="font-mono text-[#C3BAAF] hover:text-[#C59A4E] flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{order.customer_phone}</span>
                            </a>
                          </td>
                          <td className="p-4 capitalize text-[#A89F93]">
                            {order.order_type}
                          </td>
                          <td className="p-4 font-mono font-bold text-white">
                            {settings.currency} {order.total.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              order.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                              order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-300' :
                              order.status === 'preparing' ? 'bg-purple-500/20 text-purple-300' :
                              order.status === 'ready' ? 'bg-indigo-500/20 text-indigo-300' :
                              order.status === 'out_for_delivery' ? 'bg-orange-500/20 text-orange-300' :
                              order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-[#7A7268] whitespace-nowrap">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedOrderForView(order)}
                                className="px-3 py-1.5 rounded-lg bg-[#262420] hover:bg-[#302d28] text-white text-[11px] font-medium transition-colors"
                              >
                                View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: MENU MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-vintage text-xl font-bold text-white">
                  Menu Items Management
                </h3>
                <p className="text-xs text-[#857D74]">
                  Update dish details, prices, availability, and featured status.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingMenuItem({
                    name: '',
                    category_id: categories[0]?.id || '',
                    price: 1000,
                    description: '',
                    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
                    is_available: true,
                    is_featured: false,
                    portion_size: 'Regular',
                    preparation_note: 'Freshly prepared',
                    add_ons: []
                  });
                  setMenuModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#C59A4E] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food Item</span>
              </button>
            </div>

            {/* Menu Items Table */}
            <div className="rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#24221e] text-[#857D74] uppercase font-bold tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Dish</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Availability</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {menuItems.map(item => {
                      const cat = categories.find(c => c.id === item.category_id);
                      return (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover bg-[#262420]"
                              />
                              <div>
                                <span className="font-semibold text-white block text-sm">{item.name}</span>
                                <span className="text-[11px] text-[#857D74] line-clamp-1 max-w-xs">{item.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-[#A89F93]">
                            {cat?.name || 'Uncategorized'}
                          </td>
                          <td className="p-4 font-mono font-bold text-[#C59A4E]">
                            {settings.currency} {item.price.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => saveMenuItem({ id: item.id, is_available: !item.is_available })}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                item.is_available 
                                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' 
                                  : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                              }`}
                            >
                              {item.is_available ? 'Available' : 'Unavailable'}
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => saveMenuItem({ id: item.id, is_featured: !item.is_featured })}
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                item.is_featured 
                                  ? 'bg-[#C59A4E]/20 border-[#C59A4E] text-[#C59A4E]' 
                                  : 'border-white/10 text-[#666] hover:text-white'
                              }`}
                              title="Toggle Featured"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingMenuItem(item);
                                  setMenuModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-[#262420] text-[#C3BAAF] hover:text-white hover:bg-[#302d28] transition-colors"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setItemToDelete({ id: item.id, name: item.name, type: 'item' })}
                                className="p-2 rounded-lg bg-[#262420] text-[#857D74] hover:text-red-400 hover:bg-red-900/20 transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-vintage text-xl font-bold text-white">
                  Categories Management
                </h3>
                <p className="text-xs text-[#857D74]">
                  Organize menu groupings and ordering sequence.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCategory({
                    name: '',
                    slug: '',
                    order_index: categories.length + 1,
                    is_active: true
                  });
                  setCategoryModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#C59A4E] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="rounded-3xl bg-[#1d1b18] border border-white/5 shadow-md overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#24221e] text-[#857D74] uppercase font-bold tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-4">Order</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Dishes Count</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.map(cat => {
                    const count = menuItems.filter(m => m.category_id === cat.id).length;
                    return (
                      <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-mono font-bold text-[#C59A4E]">
                          #{cat.order_index}
                        </td>
                        <td className="p-4 font-semibold text-white">
                          {cat.name}
                        </td>
                        <td className="p-4 text-[#7A7268] font-mono">
                          {cat.slug}
                        </td>
                        <td className="p-4 text-[#A89F93]">
                          {count} items
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => saveCategory({ id: cat.id, is_active: !cat.is_active })}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              cat.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {cat.is_active ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setCategoryModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-[#262420] text-[#C3BAAF] hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setItemToDelete({ id: cat.id, name: cat.name, type: 'category' })}
                              className="p-2 rounded-lg bg-[#262420] text-[#857D74] hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: RESTAURANT SETTINGS */}
        {/* ==================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif-vintage text-xl font-bold text-white">
                Restaurant Settings
              </h3>
              <p className="text-xs text-[#857D74]">
                Centralized business settings. All values are editable and dynamically update throughout the storefront and WhatsApp notifications.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateSettings(settingsForm);
              }}
              className="p-6 sm:p-8 rounded-3xl bg-[#1d1b18] border border-white/5 space-y-6 shadow-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                    WhatsApp Ordering Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsapp_number}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                  Physical Address
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.opening_hours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, opening_hours: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                    Delivery Fee ({settingsForm.currency})
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={settingsForm.delivery_fee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, delivery_fee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.currency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  value={settingsForm.google_maps_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, google_maps_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={settingsForm.hero_image_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_image_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#C3BAAF] mb-1.5">
                  About Story / Description
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.about_text}
                  onChange={(e) => setSettingsForm({ ...settingsForm, about_text: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E] resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C59A4E] to-[#A8811F] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg"
                >
                  Save Restaurant Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 6: GALLERY MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-vintage text-xl font-bold text-white">
                  Gallery Images
                </h3>
                <p className="text-xs text-[#857D74]">
                  Manage showcase photos across Restaurant, Food, Interior, Exterior, and Events categories.
                </p>
              </div>

              <button
                onClick={() => setGalleryModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#C59A4E] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map(img => (
                <div key={img.id} className="rounded-2xl bg-[#1d1b18] border border-white/5 overflow-hidden shadow-md group relative">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59A4E] block">
                      {img.category}
                    </span>
                    <h4 className="font-serif-vintage text-sm font-semibold text-white mt-0.5 line-clamp-1">
                      {img.title}
                    </h4>
                    {img.caption && (
                      <p className="text-[11px] text-[#857D74] mt-1 line-clamp-2">{img.caption}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setItemToDelete({ id: img.id, name: img.title, type: 'gallery' })}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-900/80 hover:bg-red-800 text-white transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL: ORDER DETAILS & STATUS UPDATE */}
      {/* ==================================================== */}
      {selectedOrderForView && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrderForView(null)}
        >
          <div 
            className="w-full max-w-lg rounded-3xl bg-[#1d1b18] border border-[#C59A4E]/30 p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="font-mono font-bold text-[#C59A4E] text-base">
                  {selectedOrderForView.order_number}
                </span>
                <span className="text-xs text-[#857D74] block">
                  Placed on {new Date(selectedOrderForView.created_at).toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrderForView(null)}
                className="text-[#857D74] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="p-4 rounded-2xl bg-[#262420] border border-white/5 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#857D74]">Customer:</span>
                <span className="font-semibold text-white">{selectedOrderForView.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857D74]">Phone:</span>
                <a href={`tel:${selectedOrderForView.customer_phone}`} className="font-mono text-[#C59A4E] hover:underline">
                  {selectedOrderForView.customer_phone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-[#857D74]">Order Type:</span>
                <span className="font-semibold text-white capitalize">{selectedOrderForView.order_type}</span>
              </div>
              {selectedOrderForView.delivery_address && (
                <div className="flex justify-between pt-1 border-t border-white/5">
                  <span className="text-[#857D74]">Address:</span>
                  <span className="text-right text-white max-w-xs">{selectedOrderForView.delivery_address}, {selectedOrderForView.city}</span>
                </div>
              )}
              {selectedOrderForView.special_instructions && (
                <div className="pt-1 border-t border-white/5 text-amber-300 italic">
                  Note: "{selectedOrderForView.special_instructions}"
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#857D74] block">Order Items</span>
              {selectedOrderForView.items.map(it => (
                <div key={it.id} className="flex justify-between items-baseline py-1 border-b border-white/5">
                  <div>
                    <span className="text-white font-medium">{it.quantity} × {it.item_name}</span>
                    {it.add_ons_detail && <span className="text-[10px] text-[#857D74] block">+ {it.add_ons_detail}</span>}
                  </div>
                  <span className="font-mono text-white">{settings.currency} {it.total_price.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between text-[#857D74]">
                <span>Delivery Fee:</span>
                <span className="font-mono text-white">{settings.currency} {selectedOrderForView.delivery_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-1">
                <span>Total Amount:</span>
                <span className="font-mono text-[#C59A4E]">{settings.currency} {selectedOrderForView.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Transition Actions */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C3BAAF] block">
                Update Order Status (Current: <strong className="text-[#C59A4E]">{selectedOrderForView.status}</strong>)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed'] as OrderStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrderForView.id, st)}
                    className={`py-2 px-2.5 rounded-lg font-semibold uppercase tracking-wider transition-colors ${
                      selectedOrderForView.status === st
                        ? 'bg-[#C59A4E] text-black'
                        : 'bg-[#262420] text-[#A89F93] hover:text-white'
                    }`}
                  >
                    {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              {selectedOrderForView.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => setOrderToCancel(selectedOrderForView)}
                  className="w-full py-2.5 rounded-lg bg-red-900/30 text-red-300 hover:bg-red-900/50 border border-red-500/30 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* CONFIRMATION DIALOG: CANCEL ORDER */}
      {/* ==================================================== */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#1d1b18] border border-red-500/40 p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-serif-vintage text-lg font-bold text-white">
              Cancel Order {orderToCancel.order_number}?
            </h4>
            <p className="text-xs text-[#857D74]">
              Are you sure you want to cancel this order? This action cannot be reversed.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOrderToCancel(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#262420] text-xs font-semibold text-[#C3BAAF] hover:text-white"
              >
                Keep Order
              </button>
              <button
                onClick={async () => {
                  await handleStatusChange(orderToCancel.id, 'cancelled');
                  setOrderToCancel(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white uppercase"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT MENU ITEM */}
      {/* ==================================================== */}
      {menuModalOpen && editingMenuItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setMenuModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg rounded-3xl bg-[#1d1b18] border border-[#C59A4E]/30 p-6 sm:p-7 shadow-2xl space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif-vintage text-xl font-bold text-white">
                {editingMenuItem.id ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button onClick={() => setMenuModalOpen(false)} className="text-[#857D74] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveMenuItem(editingMenuItem);
                setMenuModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={editingMenuItem.name || ''}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Category</label>
                  <select
                    value={editingMenuItem.category_id || ''}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, category_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Price ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingMenuItem.price || 0}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingMenuItem.description || ''}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E] resize-none"
                />
              </div>

              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingMenuItem.image_url || ''}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Portion Size</label>
                  <input
                    type="text"
                    placeholder="e.g. Serves 1-2"
                    value={editingMenuItem.portion_size || ''}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, portion_size: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#262420] border border-white/10 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Prep Note</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 mins"
                    value={editingMenuItem.preparation_note || ''}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, preparation_note: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#262420] border border-white/10 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.is_available ?? true}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, is_available: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C59A4E]"
                  />
                  <span>Is Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.is_featured ?? false}
                    onChange={(e) => setEditingMenuItem({ ...editingMenuItem, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C59A4E]"
                  />
                  <span>Featured Dish</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#262420] text-[#C3BAAF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C59A4E] text-black font-bold uppercase"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ==================================================== */}
      {categoryModalOpen && editingCategory && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCategoryModalOpen(false)}
        >
          <div 
            className="w-full max-w-md rounded-3xl bg-[#1d1b18] border border-[#C59A4E]/30 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif-vintage text-xl font-bold text-white">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-[#857D74] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveCategory(editingCategory);
                setCategoryModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ 
                    ...editingCategory, 
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white focus:outline-none focus:border-[#C59A4E]"
                />
              </div>

              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Display Order Index</label>
                <input
                  type="number"
                  value={editingCategory.order_index || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, order_index: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#262420] text-[#C3BAAF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C59A4E] text-black font-bold uppercase"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD GALLERY IMAGE */}
      {/* ==================================================== */}
      {galleryModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setGalleryModalOpen(false)}
        >
          <div 
            className="w-full max-w-md rounded-3xl bg-[#1d1b18] border border-[#C59A4E]/30 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif-vintage text-xl font-bold text-white">
                Add Photo to Gallery
              </h3>
              <button onClick={() => setGalleryModalOpen(false)} className="text-[#857D74] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveGalleryImage(newGalleryPhoto);
                setGalleryModalOpen(false);
                setNewGalleryPhoto({ title: '', category: 'Food', image_url: '', caption: '' });
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newGalleryPhoto.title || ''}
                  onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, title: e.target.value })}
                  placeholder="e.g. Signature Fried Rice presentation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Category</label>
                <select
                  value={newGalleryPhoto.category || 'Food'}
                  onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Food">Food</option>
                  <option value="Interior">Interior</option>
                  <option value="Exterior">Exterior</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newGalleryPhoto.image_url || ''}
                  onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[#C3BAAF] font-bold uppercase mb-1">Caption</label>
                <input
                  type="text"
                  value={newGalleryPhoto.caption || ''}
                  onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#262420] border border-white/10 text-sm text-white"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#262420] text-[#C3BAAF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C59A4E] text-black font-bold uppercase"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* CONFIRMATION DIALOG: DELETE ITEM / CATEGORY / GALLERY */}
      {/* ==================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#1d1b18] border border-red-500/40 p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif-vintage text-lg font-bold text-white">
              Delete "{itemToDelete.name}"?
            </h4>
            <p className="text-xs text-[#857D74]">
              Are you sure you want to delete this {itemToDelete.type}? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#262420] text-xs font-semibold text-[#C3BAAF]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (itemToDelete.type === 'item') {
                    await deleteMenuItem(itemToDelete.id);
                  } else if (itemToDelete.type === 'category') {
                    await deleteCategory(itemToDelete.id);
                  } else if (itemToDelete.type === 'gallery') {
                    await deleteGalleryImage(itemToDelete.id);
                  }
                  setItemToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
