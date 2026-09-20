export type OrderType = 'delivery' | 'pickup';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  preparation_note?: string;
  add_ons?: AddOnOption[];
  portion_size?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order_index: number;
  is_active: boolean;
}

export interface CartItem {
  cart_id: string;
  item: MenuItem;
  quantity: number;
  special_instructions: string;
  selected_add_ons: AddOnOption[];
  unit_price: number; // base price + selected add-ons
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  add_ons_detail?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  delivery_address?: string;
  city?: string;
  special_instructions?: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface RestaurantSettings {
  id: string;
  name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  opening_hours: string;
  google_rating: number;
  review_count: number;
  price_range: string;
  google_maps_url: string;
  facebook_url: string;
  instagram_url: string;
  delivery_fee: number;
  delivery_enabled: boolean;
  minimum_order_amount: number;
  currency: string;
  logo_url: string;
  hero_image_url: string;
  about_text: string;
}

export type GalleryCategory = 'Restaurant' | 'Food' | 'Interior' | 'Exterior' | 'Events';

export interface GalleryImage {
  id: string;
  title: string;
  category: GalleryCategory;
  image_url: string;
  caption?: string;
  order_index: number;
}

export interface CreateOrderRequest {
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  delivery_address?: string;
  city?: string;
  special_instructions?: string;
  items: {
    menu_item_id: string;
    quantity: number;
    special_instructions?: string;
    selected_add_on_ids?: string[];
  }[];
}

export interface TableReservation {
  id?: string;
  customer_name: string;
  customer_phone: string;
  date: string;
  time: string;
  guests_count: number;
  seating_preference?: string;
  occasion?: string;
  special_requests?: string;
  created_at?: string;
}

export interface CustomerReview {
  id: string;
  customer_name: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  source?: 'Google' | 'Direct';
  is_verified?: boolean;
}

