import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/storage';
import { CreateOrderRequest, OrderStatus } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vintage123';
const ADMIN_TOKEN = 'vtg_admin_token_' + (process.env.ADMIN_SECRET_KEY || 'vintage_secure_session_2026');

app.use(express.json());

// Helper auth middleware for Admin protected routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required.' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired admin token.' });
  }

  next();
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Vintage Restaurant & Cafe API', timestamp: new Date().toISOString() });
});

// 2. Admin Authentication
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password === ADMIN_PASSWORD) {
    return res.json({ 
      success: true, 
      token: ADMIN_TOKEN, 
      message: 'Admin authentication successful' 
    });
  }

  return res.status(401).json({ error: 'Incorrect administrator password' });
});

// 3. Settings (Public read, Admin update)
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve restaurant settings', message: err.message });
  }
});

app.put('/api/settings', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to update restaurant settings', message: err.message });
  }
});

// 4. Categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load categories', message: err.message });
  }
});

app.post('/api/categories', requireAdminAuth, (req, res) => {
  try {
    const { name, slug, order_index, is_active } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const created = db.addCategory({
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      order_index: typeof order_index === 'number' ? order_index : 99,
      is_active: is_active ?? true
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/categories/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', requireAdminAuth, (req, res) => {
  try {
    const ok = db.deleteCategory(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Menu Items
app.get('/api/menu', (req, res) => {
  try {
    const items = db.getMenuItems();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load menu items', message: err.message });
  }
});

app.post('/api/menu', requireAdminAuth, (req, res) => {
  try {
    const { name, category_id, price, description, image_url, is_available, is_featured, preparation_note, portion_size, add_ons } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Item name is required' });
    if (!price || Number(price) <= 0) return res.status(400).json({ error: 'Valid price is required' });

    const created = db.addMenuItem({
      name: name.trim(),
      category_id: category_id || '',
      price: Number(price),
      description: description || '',
      image_url: image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      is_available: is_available ?? true,
      is_featured: is_featured ?? false,
      preparation_note,
      portion_size,
      add_ons: Array.isArray(add_ons) ? add_ons : []
    });

    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/menu/:id', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateMenuItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Menu item not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/menu/:id', requireAdminAuth, (req, res) => {
  try {
    const ok = db.deleteMenuItem(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Gallery
app.get('/api/gallery', (req, res) => {
  try {
    const images = db.getGallery();
    res.json(images);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load gallery', message: err.message });
  }
});

app.post('/api/gallery', requireAdminAuth, (req, res) => {
  try {
    const { title, category, image_url, caption, order_index } = req.body;
    if (!title || !image_url || !category) {
      return res.status(400).json({ error: 'Title, category, and image_url are required' });
    }
    const created = db.addGalleryImage({
      title,
      category,
      image_url,
      caption,
      order_index: order_index || 0
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/gallery/:id', requireAdminAuth, (req, res) => {
  try {
    const ok = db.deleteGalleryImage(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Gallery image not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6.5. Customer Reviews
app.get('/api/reviews', (req, res) => {
  try {
    const reviews = db.getReviews();
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch reviews', message: err.message });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const { customer_name, rating, comment } = req.body;
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ error: 'Name is required to post a review' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Comment is required to post a review' });
    }
    const numRating = Number(rating) || 5;
    const created = db.addReview({
      customer_name: customer_name.trim(),
      rating: Math.min(5, Math.max(1, numRating)),
      comment: comment.trim(),
      source: 'Direct',
      is_verified: true
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to submit review' });
  }
});

app.delete('/api/reviews/:id', requireAdminAuth, (req, res) => {
  try {
    const ok = db.deleteReview(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Review not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6.6. Newsletter Subscription
app.post('/api/newsletter', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email address is required' });
    }
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const result = db.addNewsletterSubscriber(trimmed);
    res.status(200).json({
      success: true,
      message: result.isNew 
        ? 'Successfully subscribed to the Vintage Dining Club' 
        : 'You are already subscribed to the Vintage Dining Club',
      isNew: result.isNew
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process newsletter subscription', message: err.message });
  }
});

app.get('/api/newsletter', requireAdminAuth, (req, res) => {
  try {
    const subscribers = db.getNewsletterSubscribers();
    res.json({ count: subscribers.length, subscribers });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve newsletter subscribers' });
  }
});

// 7. Orders - Customer Checkout & Creation
app.post('/api/orders', (req, res) => {
  try {
    const orderReq: CreateOrderRequest = req.body;
    const result = db.createOrder(orderReq);
    res.status(201).json(result);
  } catch (err: any) {
    console.error('Order creation failed:', err.message);
    res.status(400).json({ error: err.message || 'Failed to create order' });
  }
});

// 8. Orders - Admin queries and management
app.get('/api/orders', requireAdminAuth, (req, res) => {
  try {
    const orders = db.getOrders();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch orders', message: err.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get order', message: err.message });
  }
});

app.patch('/api/orders/:id/status', requireAdminAuth, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 9. Admin Analytics
app.get('/api/admin/analytics', requireAdminAuth, (req, res) => {
  try {
    const analytics = db.getAnalytics();
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get analytics', message: err.message });
  }
});

// ==========================================
// VITE MIDDLEWARE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vintage Restaurant & Cafe Gampaha server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
