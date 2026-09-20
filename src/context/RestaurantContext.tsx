import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  RestaurantSettings, 
  Category, 
  MenuItem, 
  CartItem, 
  Order, 
  GalleryImage, 
  AddOnOption 
} from '../types';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_CATEGORIES, 
  DEFAULT_MENU_ITEMS, 
  DEFAULT_GALLERY 
} from '../data/defaultData';
import { Language, TranslationDictionary, translations } from '../i18n/translations';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface RestaurantContextType {
  settings: RestaurantSettings;
  categories: Category[];
  menuItems: MenuItem[];
  gallery: GalleryImage[];
  cart: CartItem[];
  cartSubtotal: number;
  cartItemCount: number;
  activeView: 'home' | 'menu' | 'about' | 'gallery' | 'contact' | 'checkout' | 'order-success' | 'reserve' | 'admin';
  selectedFoodForModal: MenuItem | null;
  isCartDrawerOpen: boolean;
  lastCreatedOrder: Order | null;
  lastWhatsAppUrl: string | null;
  toasts: Toast[];
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  language: Language;

  // Actions
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationDictionary) => string;
  setActiveView: (view: 'home' | 'menu' | 'about' | 'gallery' | 'contact' | 'checkout' | 'order-success' | 'reserve' | 'admin') => void;
  openFoodModal: (item: MenuItem) => void;
  closeFoodModal: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (item: MenuItem, quantity: number, instructions?: string, selectedAddOns?: AddOnOption[]) => void;
  updateCartQuantity: (cartId: string, quantity: number) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  setLastOrderResult: (order: Order, whatsappUrl: string) => void;
  refreshData: () => Promise<void>;

  // Admin Actions
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => Promise<boolean>;
  saveMenuItem: (item: Partial<MenuItem>) => Promise<boolean>;
  deleteMenuItem: (id: string) => Promise<boolean>;
  saveCategory: (category: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  saveGalleryImage: (image: Partial<GalleryImage>) => Promise<boolean>;
  deleteGalleryImage: (id: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: any) => Promise<boolean>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'vintage_gampaha_cart_v1';
const ADMIN_TOKEN_KEY = 'vintage_admin_token_v1';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [gallery, setGallery] = useState<GalleryImage[]>(DEFAULT_GALLERY);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeView, setActiveView] = useState<'home' | 'menu' | 'about' | 'gallery' | 'contact' | 'checkout' | 'order-success' | 'reserve' | 'admin'>('home');
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<MenuItem | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const LANGUAGE_STORAGE_KEY = 'vintage_language_preference';
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'si') return saved;
    } catch {}
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {}
  }, []);

  const t = useCallback((key: keyof TranslationDictionary): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  }, [language]);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Fetch initial data from server
  const refreshData = useCallback(async () => {
    try {
      const [settingsRes, catRes, menuRes, galleryRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/categories'),
        fetch('/api/menu'),
        fetch('/api/gallery')
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
      }
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data);
      }
      if (menuRes.ok) {
        const data = await menuRes.json();
        setMenuItems(data);
      }
      if (galleryRes.ok) {
        const data = await galleryRes.json();
        setGallery(data);
      }
    } catch (err) {
      console.warn('Network request failed, using client defaults:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Toast notifications
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Cart operations
  const addToCart = (item: MenuItem, quantity: number, instructions = '', selectedAddOns: AddOnOption[] = []) => {
    if (quantity <= 0) return;
    const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const unit_price = item.price + addOnTotal;

    // Create a deterministic cart_id based on item id and add-ons/instructions
    const addOnIds = selectedAddOns.map(a => a.id).sort().join('_');
    const cart_id = `${item.id}-${addOnIds}-${instructions.trim().toLowerCase()}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(c => c.cart_id === cart_id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          cart_id,
          item,
          quantity,
          special_instructions: instructions,
          selected_add_ons: selectedAddOns,
          unit_price
        }
      ];
    });

    showToast(`Added ${quantity}× "${item.name}" to cart`);
  };

  const updateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(item => item.cart_id === cartId ? { ...item, quantity } : item));
  };

  const removeFromCart = (cartId: string) => {
    const item = cart.find(c => c.cart_id === cartId);
    setCart(prev => prev.filter(c => c.cart_id !== cartId));
    if (item) {
      showToast(`Removed "${item.item.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const openFoodModal = (item: MenuItem) => {
    setSelectedFoodForModal(item);
  };

  const closeFoodModal = () => {
    setSelectedFoodForModal(null);
  };

  const setLastOrderResult = (order: Order, whatsappUrl: string) => {
    setLastCreatedOrder(order);
    setLastWhatsAppUrl(whatsappUrl);
    clearCart();
    setActiveView('order-success');
    showToast(`Order ${order.order_number} created successfully!`);
  };

  // Admin Login
  const adminLogin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAdminToken(data.token);
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        showToast('Admin logged in successfully');
        return true;
      } else {
        showToast(data.error || 'Login failed', 'error');
        return false;
      }
    } catch {
      showToast('Network error during admin login', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    showToast('Logged out from admin');
    setActiveView('home');
  };

  // Admin mutation helpers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  });

  const updateSettings = async (newSettings: Partial<RestaurantSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        showToast('Restaurant settings updated successfully');
        return true;
      }
      showToast('Failed to update settings', 'error');
      return false;
    } catch {
      showToast('Network error updating settings', 'error');
      return false;
    }
  };

  const saveMenuItem = async (item: Partial<MenuItem>): Promise<boolean> => {
    try {
      const isEdit = !!item.id;
      const url = isEdit ? `/api/menu/${item.id}` : '/api/menu';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });

      if (res.ok) {
        await refreshData();
        showToast(`Menu item ${isEdit ? 'updated' : 'created'} successfully`);
        return true;
      }
      const data = await res.json();
      showToast(data.error || 'Failed to save menu item', 'error');
      return false;
    } catch {
      showToast('Network error saving menu item', 'error');
      return false;
    }
  };

  const deleteMenuItem = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        await refreshData();
        showToast('Menu item deleted');
        return true;
      }
      showToast('Failed to delete item', 'error');
      return false;
    } catch {
      showToast('Network error deleting item', 'error');
      return false;
    }
  };

  const saveCategory = async (category: Partial<Category>): Promise<boolean> => {
    try {
      const isEdit = !!category.id;
      const url = isEdit ? `/api/categories/${category.id}` : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(category)
      });

      if (res.ok) {
        await refreshData();
        showToast(`Category ${isEdit ? 'updated' : 'added'} successfully`);
        return true;
      }
      showToast('Failed to save category', 'error');
      return false;
    } catch {
      showToast('Network error saving category', 'error');
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        await refreshData();
        showToast('Category deleted');
        return true;
      }
      showToast('Failed to delete category', 'error');
      return false;
    } catch {
      showToast('Network error deleting category', 'error');
      return false;
    }
  };

  const saveGalleryImage = async (image: Partial<GalleryImage>): Promise<boolean> => {
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(image)
      });
      if (res.ok) {
        await refreshData();
        showToast('Photo added to gallery');
        return true;
      }
      showToast('Failed to add image', 'error');
      return false;
    } catch {
      showToast('Network error adding image', 'error');
      return false;
    }
  };

  const deleteGalleryImage = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        await refreshData();
        showToast('Gallery image removed');
        return true;
      }
      showToast('Failed to delete image', 'error');
      return false;
    } catch {
      showToast('Network error deleting image', 'error');
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Order status updated to: ${status}`);
        return true;
      }
      showToast('Failed to update order status', 'error');
      return false;
    } catch {
      showToast('Network error updating order', 'error');
      return false;
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        settings,
        categories,
        menuItems,
        gallery,
        cart,
        cartSubtotal,
        cartItemCount,
        activeView,
        selectedFoodForModal,
        isCartDrawerOpen,
        lastCreatedOrder,
        lastWhatsAppUrl,
        toasts,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        language,
        setLanguage,
        t,
        setActiveView,
        openFoodModal,
        closeFoodModal,
        setIsCartDrawerOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        showToast,
        dismissToast,
        setLastOrderResult,
        refreshData,
        adminLogin,
        adminLogout,
        updateSettings,
        saveMenuItem,
        deleteMenuItem,
        saveCategory,
        deleteCategory,
        saveGalleryImage,
        deleteGalleryImage,
        updateOrderStatus
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
