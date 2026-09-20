import fs from 'fs';
import path from 'path';
import { 
  RestaurantSettings, 
  Category, 
  MenuItem, 
  Order, 
  OrderItem, 
  GalleryImage, 
  CreateOrderRequest, 
  OrderStatus,
  CustomerReview 
} from '../src/types';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_CATEGORIES, 
  DEFAULT_MENU_ITEMS, 
  DEFAULT_GALLERY,
  DEFAULT_REVIEWS 
} from '../src/data/defaultData';

interface NewsletterSubscriber {
  email: string;
  subscribed_at: string;
}

interface DatabaseSchema {
  settings: RestaurantSettings;
  categories: Category[];
  menu_items: MenuItem[];
  orders: Order[];
  gallery: GalleryImage[];
  reviews: CustomerReview[];
  newsletter_subscribers: NewsletterSubscriber[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'restaurant_db.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          settings: parsed.settings || DEFAULT_SETTINGS,
          categories: parsed.categories || DEFAULT_CATEGORIES,
          menu_items: parsed.menu_items || DEFAULT_MENU_ITEMS,
          orders: parsed.orders || [],
          gallery: parsed.gallery || DEFAULT_GALLERY,
          reviews: parsed.reviews || DEFAULT_REVIEWS,
          newsletter_subscribers: parsed.newsletter_subscribers || []
        };
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing defaults:', err);
    }

    // Initialize with defaults
    const initial: DatabaseSchema = {
      settings: { ...DEFAULT_SETTINGS },
      categories: [...DEFAULT_CATEGORIES],
      menu_items: [...DEFAULT_MENU_ITEMS],
      orders: [],
      gallery: [...DEFAULT_GALLERY],
      reviews: [...DEFAULT_REVIEWS],
      newsletter_subscribers: []
    };
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave: DatabaseSchema = this.data) {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database to disk:', err);
    }
  }

  // SETTINGS
  getSettings(): RestaurantSettings {
    return this.data.settings;
  }

  updateSettings(partial: Partial<RestaurantSettings>): RestaurantSettings {
    this.data.settings = {
      ...this.data.settings,
      ...partial,
      id: this.data.settings.id || 'vintage-gampaha-default'
    };
    this.persist();
    return this.data.settings;
  }

  // CATEGORIES
  getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.order_index - b.order_index);
  }

  addCategory(category: Omit<Category, 'id'>): Category {
    const id = 'cat-' + Date.now();
    const newCat: Category = { ...category, id };
    this.data.categories.push(newCat);
    this.persist();
    return newCat;
  }

  updateCategory(id: string, partial: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...partial };
    this.persist();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const before = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== before) {
      this.persist();
      return true;
    }
    return false;
  }

  // MENU ITEMS
  getMenuItems(): MenuItem[] {
    return this.data.menu_items;
  }

  getMenuItemById(id: string): MenuItem | undefined {
    return this.data.menu_items.find(m => m.id === id);
  }

  addMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): MenuItem {
    const id = 'item-' + Date.now();
    const now = new Date().toISOString();
    const newItem: MenuItem = {
      ...item,
      id,
      created_at: now,
      updated_at: now
    };
    this.data.menu_items.push(newItem);
    this.persist();
    return newItem;
  }

  updateMenuItem(id: string, partial: Partial<MenuItem>): MenuItem | null {
    const idx = this.data.menu_items.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.menu_items[idx] = {
      ...this.data.menu_items[idx],
      ...partial,
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.data.menu_items[idx];
  }

  deleteMenuItem(id: string): boolean {
    const before = this.data.menu_items.length;
    this.data.menu_items = this.data.menu_items.filter(m => m.id !== id);
    if (this.data.menu_items.length !== before) {
      this.persist();
      return true;
    }
    return false;
  }

  // GALLERY
  getGallery(): GalleryImage[] {
    return [...this.data.gallery].sort((a, b) => a.order_index - b.order_index);
  }

  addGalleryImage(image: Omit<GalleryImage, 'id'>): GalleryImage {
    const id = 'gal-' + Date.now();
    const newImg: GalleryImage = { ...image, id };
    this.data.gallery.push(newImg);
    this.persist();
    return newImg;
  }

  deleteGalleryImage(id: string): boolean {
    const before = this.data.gallery.length;
    this.data.gallery = this.data.gallery.filter(g => g.id !== id);
    if (this.data.gallery.length !== before) {
      this.persist();
      return true;
    }
    return false;
  }

  // ORDERS & SERVER-SIDE PRICE CALCULATION
  createOrder(req: CreateOrderRequest): { order: Order; whatsappText: string; whatsappUrl: string } {
    if (!req.items || req.items.length === 0) {
      throw new Error('Cart is empty. Please add items before checking out.');
    }

    if (!req.customer_name || !req.customer_name.trim()) {
      throw new Error('Customer full name is required.');
    }

    if (!req.customer_phone || !req.customer_phone.trim()) {
      throw new Error('Customer phone number is required.');
    }

    if (req.order_type === 'delivery' && (!req.delivery_address || !req.delivery_address.trim())) {
      throw new Error('Delivery address is required for delivery orders.');
    }

    const settings = this.getSettings();
    let calculatedSubtotal = 0;
    const orderItems: OrderItem[] = [];

    // Calculate prices server-side using current verified prices
    for (const itemReq of req.items) {
      const menuItem = this.getMenuItemById(itemReq.menu_item_id);
      if (!menuItem) {
        throw new Error(`Menu item not found or no longer available: ID ${itemReq.menu_item_id}`);
      }
      if (!menuItem.is_available) {
        throw new Error(`"${menuItem.name}" is currently unavailable.`);
      }

      if (itemReq.quantity <= 0) {
        throw new Error(`Invalid quantity for ${menuItem.name}`);
      }

      let unitPrice = menuItem.price;
      const selectedAddOnNames: string[] = [];

      if (itemReq.selected_add_on_ids && menuItem.add_ons) {
        for (const addOnId of itemReq.selected_add_on_ids) {
          const found = menuItem.add_ons.find(a => a.id === addOnId);
          if (found) {
            unitPrice += found.price;
            selectedAddOnNames.push(`${found.name} (+${settings.currency} ${found.price})`);
          }
        }
      }

      const itemTotalPrice = unitPrice * itemReq.quantity;
      calculatedSubtotal += itemTotalPrice;

      orderItems.push({
        id: 'oi-' + Math.random().toString(36).substring(2, 9),
        order_id: '', // set below
        menu_item_id: menuItem.id,
        item_name: menuItem.name,
        quantity: itemReq.quantity,
        unit_price: unitPrice,
        total_price: itemTotalPrice,
        special_instructions: itemReq.special_instructions?.trim() || undefined,
        add_ons_detail: selectedAddOnNames.length > 0 ? selectedAddOnNames.join(', ') : undefined
      });
    }

    const deliveryFee = req.order_type === 'delivery' ? (settings.delivery_fee || 0) : 0;
    const calculatedTotal = calculatedSubtotal + deliveryFee;

    // Generate human-friendly order number: VF-YYYYMMDD-XXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const todaysOrdersCount = this.data.orders.filter(o => o.created_at.startsWith(now.toISOString().slice(0, 10))).length;
    const seq = String(todaysOrdersCount + 1).padStart(3, '0');
    const orderNumber = `VF-${dateStr}-${seq}`;

    const orderId = 'ord-' + Date.now();
    for (const oi of orderItems) {
      oi.order_id = orderId;
    }

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_name: req.customer_name.trim(),
      customer_phone: req.customer_phone.trim(),
      order_type: req.order_type,
      delivery_address: req.order_type === 'delivery' ? (req.delivery_address?.trim() || '') : undefined,
      city: req.order_type === 'delivery' ? (req.city?.trim() || 'Gampaha') : undefined,
      special_instructions: req.special_instructions?.trim() || undefined,
      subtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      total: calculatedTotal,
      status: 'pending',
      items: orderItems,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    this.data.orders.unshift(newOrder);
    this.persist();

    // Format WhatsApp Message exactly as specified in the requirements
    const whatsappText = this.formatWhatsAppMessage(newOrder, settings);
    
    // Clean WhatsApp number
    let cleanPhone = settings.whatsapp_number.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '94' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('94')) {
      cleanPhone = '94' + cleanPhone;
    }

    const encodedText = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    return { order: newOrder, whatsappText, whatsappUrl };
  }

  private formatWhatsAppMessage(order: Order, settings: RestaurantSettings): string {
    const isDelivery = order.order_type === 'delivery';
    const currency = settings.currency || 'Rs.';

    let itemsText = '';
    order.items.forEach(it => {
      let line = `${it.quantity} × ${it.item_name} — ${currency} ${it.total_price.toLocaleString()}`;
      if (it.add_ons_detail) {
        line += `\n   + ${it.add_ons_detail}`;
      }
      if (it.special_instructions) {
        line += `\n   *Note: ${it.special_instructions}*`;
      }
      itemsText += line + '\n';
    });

    let addressBlock = '';
    if (isDelivery) {
      addressBlock = `📍 Address:\n${order.delivery_address}${order.city ? ', ' + order.city : ''}\n\n`;
    }

    let notesBlock = '';
    if (order.special_instructions) {
      notesBlock = `📝 Note:\n${order.special_instructions}\n\n`;
    }

    return `🍽️ NEW ORDER
${settings.name}

Order: ${order.order_number}

👤 Customer:
${order.customer_name}

📞 Phone:
${order.customer_phone}

🚚 Type:
${isDelivery ? 'Delivery' : 'Pickup'}

${addressBlock}🛒 ITEMS
${itemsText.trim()}

Subtotal: ${currency} ${order.subtotal.toLocaleString()}
${isDelivery ? `Delivery: ${currency} ${order.delivery_fee.toLocaleString()}\n` : ''}💰 TOTAL: ${currency} ${order.total.toLocaleString()}

${notesBlock}Please confirm this order.`;
  }

  getOrders(): Order[] {
    return this.data.orders;
  }

  getOrderById(idOrNumber: string): Order | undefined {
    return this.data.orders.find(o => o.id === idOrNumber || o.order_number === idOrNumber);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.status = status;
    order.updated_at = new Date().toISOString();
    this.persist();
    return order;
  }

  getAnalytics() {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = this.data.orders.filter(o => o.created_at.startsWith(today));
    const pendingOrders = this.data.orders.filter(o => o.status === 'pending').length;
    const preparingOrders = this.data.orders.filter(o => o.status === 'preparing').length;
    const completedOrders = this.data.orders.filter(o => o.status === 'completed').length;
    const todayRevenue = todayOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalRevenueAllTime = this.data.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    // Popular items tally
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    for (const ord of this.data.orders) {
      if (ord.status === 'cancelled') continue;
      for (const it of ord.items) {
        if (!itemCounts[it.item_name]) {
          itemCounts[it.item_name] = { name: it.item_name, count: 0, revenue: 0 };
        }
        itemCounts[it.item_name].count += it.quantity;
        itemCounts[it.item_name].revenue += it.total_price;
      }
    }

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      todayOrdersCount: todayOrders.length,
      pendingOrders,
      preparingOrders,
      completedOrders,
      todayRevenue,
      totalOrdersCount: this.data.orders.length,
      totalRevenueAllTime,
      popularItems
    };
  }

  // Reviews
  getReviews(): CustomerReview[] {
    return this.data.reviews || [];
  }

  addReview(review: Omit<CustomerReview, 'id' | 'date'> & { id?: string; date?: string }): CustomerReview {
    const newReview: CustomerReview = {
      id: review.id || `rev-${Date.now()}`,
      customer_name: review.customer_name,
      rating: Math.min(5, Math.max(1, review.rating)),
      comment: review.comment,
      date: review.date || new Date().toISOString().split('T')[0],
      source: review.source || 'Direct',
      is_verified: review.is_verified ?? true
    };

    if (!this.data.reviews) {
      this.data.reviews = [];
    }

    this.data.reviews.unshift(newReview);
    this.persist();
    return newReview;
  }

  deleteReview(id: string): boolean {
    if (!this.data.reviews) return false;
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter(r => r.id !== id);
    if (this.data.reviews.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Newsletter Subscribers
  getNewsletterSubscribers(): NewsletterSubscriber[] {
    return this.data.newsletter_subscribers || [];
  }

  addNewsletterSubscriber(email: string): { success: boolean; isNew: boolean } {
    const cleanEmail = email.trim().toLowerCase();
    if (!this.data.newsletter_subscribers) {
      this.data.newsletter_subscribers = [];
    }

    const exists = this.data.newsletter_subscribers.some(s => s.email.toLowerCase() === cleanEmail);
    if (!exists) {
      this.data.newsletter_subscribers.unshift({
        email: cleanEmail,
        subscribed_at: new Date().toISOString()
      });
      this.persist();
      return { success: true, isNew: true };
    }

    return { success: true, isNew: false };
  }
}

export const db = new DatabaseStore();
