-- Supabase / PostgreSQL Database Schema for Vintage Restaurant & Cafe Gampaha
-- Run this migration in your Supabase SQL Editor to set up tables, RLS policies, and initial seed data.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. RESTAURANT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS restaurant_settings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT DEFAULT 'Taste the Vintage.',
    description TEXT,
    phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    address TEXT NOT NULL,
    opening_hours TEXT NOT NULL,
    google_rating NUMERIC(3, 1) DEFAULT 3.8,
    review_count INTEGER DEFAULT 117,
    price_range TEXT DEFAULT 'Rs. 1,000–2,000 per person',
    google_maps_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    delivery_fee NUMERIC(10, 2) DEFAULT 300.00,
    delivery_enabled BOOLEAN DEFAULT true,
    minimum_order_amount NUMERIC(10, 2) DEFAULT 500.00,
    currency TEXT DEFAULT 'Rs.',
    logo_url TEXT,
    hero_image_url TEXT,
    about_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    portion_size TEXT,
    preparation_note TEXT,
    add_ons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup')),
    delivery_address TEXT,
    city TEXT,
    special_instructions TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id TEXT,
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    special_instructions TEXT,
    add_ons_detail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Restaurant', 'Food', 'Interior', 'Exterior', 'Events')),
    image_url TEXT NOT NULL,
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Public read access for settings, categories, menu, gallery
CREATE POLICY "Public read restaurant_settings" ON restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read gallery_images" ON gallery_images FOR SELECT USING (true);

-- Customers can insert new orders
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Admin full access policies (authenticated / service role)
CREATE POLICY "Admin write restaurant_settings" ON restaurant_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write menu_items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write gallery_images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated');
