import { RestaurantSettings, Category, MenuItem, GalleryImage, CustomerReview } from '../types';

export const DEFAULT_SETTINGS: RestaurantSettings = {
  id: 'vintage-gampaha-default',
  name: 'Vintage Restaurant and Cafe Gampaha',
  tagline: 'Taste the Vintage.',
  description: 'A grade foods. Great food. Good moments. A dining experience worth remembering.',
  phone: '071 996 1500',
  whatsapp_number: '071 996 1500',
  address: '141 Ja-Ela–Ekala–Gampaha–Yakkala Hwy, Gampaha 11870, Sri Lanka',
  opening_hours: 'Open daily: 11:00 AM – 11:00 PM',
  google_rating: 3.8,
  review_count: 117,
  price_range: 'Rs. 1,000–2,000 per person',
  google_maps_url: 'https://maps.google.com/?q=141+Ja-Ela–Ekala–Gampaha–Yakkala+Hwy,+Gampaha+11870,+Sri+Lanka',
  facebook_url: 'https://facebook.com',
  instagram_url: 'https://instagram.com',
  delivery_fee: 300,
  delivery_enabled: true,
  minimum_order_amount: 500,
  currency: 'Rs.',
  logo_url: '/logo.png',
  hero_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
  about_text: 'Welcome to Vintage Restaurant & Cafe Gampaha, where great food and memorable moments come together. Situated conveniently along the Ja-Ela–Ekala–Gampaha–Yakkala highway, we offer a welcoming ambiance paired with freshly prepared Sri Lankan favorites, fusion bites, specialty coffees, and refreshing beverages.'
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-rice', name: 'Rice & Biryani', slug: 'rice-biryani', order_index: 1, is_active: true },
  { id: 'cat-kottu', name: 'Kottu Specials', slug: 'kottu-specials', order_index: 2, is_active: true },
  { id: 'cat-noodles', name: 'Noodles & Pasta', slug: 'noodles-pasta', order_index: 3, is_active: true },
  { id: 'cat-burgers', name: 'Burgers & Subs', slug: 'burgers-subs', order_index: 4, is_active: true },
  { id: 'cat-starters', name: 'Short Eats & Bites', slug: 'starters-bites', order_index: 5, is_active: true },
  { id: 'cat-drinks', name: 'Beverages & Coffee', slug: 'drinks-coffee', order_index: 6, is_active: true },
  { id: 'cat-desserts', name: 'Desserts', slug: 'desserts', order_index: 7, is_active: true },
];

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    category_id: 'cat-rice',
    name: 'Vintage Chicken Fried Rice',
    description: 'Fragrant basmati rice wok-tossed with seasoned chicken strips, farm fresh eggs, spring onions, and chili paste.',
    price: 950,
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: 'Regular (Serves 1-2)',
    preparation_note: 'Freshly prepared upon order (15 mins)',
    add_ons: [
      { id: 'add-egg', name: 'Extra Fried Egg', price: 100 },
      { id: 'add-chili', name: 'Extra Chili Paste Cup', price: 80 },
      { id: 'add-chicken', name: 'Extra Devilled Chicken Portion', price: 350 },
    ]
  },
  {
    id: 'item-2',
    category_id: 'cat-rice',
    name: 'Special Mixed Seafood Fried Rice',
    description: 'Wok-charred rice loaded with succulent prawns, tender calamari, fish chunks, and Asian aromatics.',
    price: 1350,
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: 'Regular (Serves 1-2)',
    preparation_note: 'Chef recommended with home-made chili oil',
    add_ons: [
      { id: 'add-prawns', name: 'Extra Jumbo Prawns (3 pcs)', price: 450 },
      { id: 'add-egg', name: 'Extra Fried Egg', price: 100 },
    ]
  },
  {
    id: 'item-3',
    category_id: 'cat-rice',
    name: 'Dum Biryani Chicken Pot',
    description: 'Traditional slow-cooked spiced basmati biryani layered with marinated chicken leg, mint raita, and boiled egg.',
    price: 1450,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: 'Serves 1 generous',
    preparation_note: 'Served with gravy, mint sambol & egg',
    add_ons: [
      { id: 'add-raita', name: 'Extra Cucumber Raita', price: 90 },
      { id: 'add-roast-chicken', name: 'Extra Roast Chicken Piece', price: 400 },
    ]
  },
  {
    id: 'item-4',
    category_id: 'cat-kottu',
    name: 'Vintage Chicken Cheese Kottu',
    description: 'Diced godamba roti chopped on hot griddle with chicken, fresh greens, rich curry gravy, and molten creamy cheese.',
    price: 1200,
    image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: 'Large plate',
    preparation_note: 'Available in Mild / Spicy / Extra Spicy',
    add_ons: [
      { id: 'add-double-cheese', name: 'Double Mozzarella Cheese', price: 250 },
      { id: 'add-egg', name: 'Add Bullseye Egg on Top', price: 100 },
    ]
  },
  {
    id: 'item-5',
    category_id: 'cat-kottu',
    name: 'Roast Chicken Spicy Kottu',
    description: 'Classic Sri Lankan street food favorite prepared with fire-roasted chicken slices, leeks, carrots, and robust curry sauce.',
    price: 1050,
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    portion_size: 'Large plate',
    preparation_note: 'Hot & spicy delight',
    add_ons: [
      { id: 'add-gravy', name: 'Extra Curry Gravy Bowl', price: 100 },
      { id: 'add-double-cheese', name: 'Add Melted Cheese', price: 220 },
    ]
  },
  {
    id: 'item-6',
    category_id: 'cat-noodles',
    name: 'Sri Lankan Wok Chicken Noodles',
    description: 'Stir-fried noodles with shredded chicken, crunchy cabbage, bell peppers, carrots, and house blend spices.',
    price: 900,
    image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    portion_size: 'Serves 1-2',
    preparation_note: 'Quick prepared wok noodles',
    add_ons: [
      { id: 'add-egg', name: 'Extra Fried Egg', price: 100 },
      { id: 'add-spicy-sauce', name: 'Devilled Sauce Drizzle', price: 120 }
    ]
  },
  {
    id: 'item-7',
    category_id: 'cat-noodles',
    name: 'Creamy Garlic Chicken Alfredo',
    description: 'Fettuccine pasta tossed in velvety parmesan garlic sauce with pan-seared herb chicken and toasted garlic bread.',
    price: 1390,
    image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: 'Serves 1',
    preparation_note: 'Cooked fresh with cream and parmesan',
    add_ons: [
      { id: 'add-garlic-bread', name: 'Extra Garlic Bread (2 pcs)', price: 180 },
      { id: 'add-mushrooms', name: 'Sauteed Button Mushrooms', price: 150 }
    ]
  },
  {
    id: 'item-8',
    category_id: 'cat-burgers',
    name: 'Vintage Gourmet Crispy Burger',
    description: 'Golden spiced chicken breast patty topped with melted cheddar, crisp lettuce, tomato, caramelized onions, and house burger relish.',
    price: 1100,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: 'Burger with seasoned french fries',
    preparation_note: 'Served with signature fries & dipping mayo',
    add_ons: [
      { id: 'add-cheese-slice', name: 'Extra Cheddar Cheese Slice', price: 120 },
      { id: 'add-bacon', name: 'Crispy Beef Bacon Strips', price: 220 },
      { id: 'add-fries', name: 'Upgrade to Large Crinkle Fries', price: 150 }
    ]
  },
  {
    id: 'item-9',
    category_id: 'cat-burgers',
    name: 'Loaded Vintage Beef Burger',
    description: 'Juicy smashed beef patty, double melted cheese, gherkins, smoky BBQ glaze, inside a toasted brioche bun.',
    price: 1350,
    image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    portion_size: 'Burger + Fries combo',
    preparation_note: '100% grilled beef patty',
    add_ons: [
      { id: 'add-double-patty', name: 'Extra Beef Patty', price: 400 },
      { id: 'add-egg', name: 'Sunny Side Egg', price: 100 }
    ]
  },
  {
    id: 'item-10',
    category_id: 'cat-starters',
    name: 'Hot Butter Cuttlefish (HBC)',
    description: 'All-time Sri Lankan favorite crispy cuttlefish rings tossed with butter, spring onions, capsicum, and dry red chili flakes.',
    price: 1550,
    image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: 'Shareable Starter (2-3 pax)',
    preparation_note: 'Crisp & aromatic, perfect companion',
    add_ons: [
      { id: 'add-lime', name: 'Extra Lime Wedges & Mayo', price: 60 }
    ]
  },
  {
    id: 'item-11',
    category_id: 'cat-starters',
    name: 'Spicy Devilled Chicken Wings',
    description: 'Crispy battered chicken wings glazed in sweet, tangy, and fiery Sri Lankan devilled chili gravy with crunchy onions.',
    price: 990,
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    portion_size: '6 pcs wings',
    preparation_note: 'Spicy & flavorful glaze',
    add_ons: [
      { id: 'add-wings', name: 'Upgrade to 10 pcs', price: 450 }
    ]
  },
  {
    id: 'item-12',
    category_id: 'cat-drinks',
    name: 'Vintage Iced Caramel Macchiato',
    description: 'Freshly pulled espresso layered over chilled fresh milk and sweet vanilla syrup, finished with a buttery caramel drizzle.',
    price: 750,
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: '350ml Tall glass',
    preparation_note: 'Specialty cafe brew',
    add_ons: [
      { id: 'add-shot', name: 'Extra Espresso Shot', price: 120 },
      { id: 'add-whipped', name: 'Whipped Cream Topping', price: 100 }
    ]
  },
  {
    id: 'item-13',
    category_id: 'cat-drinks',
    name: 'Special Vintage Faluda',
    description: 'Traditional rose syrup milk dessert drink with sweet basil seeds, vermicelli, jelly cubes, and a scoop of vanilla ice cream.',
    price: 650,
    image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: '400ml Glass',
    preparation_note: 'Topped with cashews and ice cream',
    add_ons: [
      { id: 'add-scoop', name: 'Extra Ice Cream Scoop', price: 120 }
    ]
  },
  {
    id: 'item-14',
    category_id: 'cat-drinks',
    name: 'Fresh Passion Fruit Mojito',
    description: 'Fresh passion fruit pulp muddled with garden mint leaves, lime wedges, and sparkling club soda over crushed ice.',
    price: 550,
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    portion_size: '350ml Cooler',
    preparation_note: 'Non-alcoholic refreshing mocktail'
  },
  {
    id: 'item-15',
    category_id: 'cat-drinks',
    name: 'Chilled Coca-Cola (Can)',
    description: 'Classic 330ml chilled carbonated beverage.',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: false,
    portion_size: '330ml Can'
  },
  {
    id: 'item-16',
    category_id: 'cat-desserts',
    name: 'Warm Chocolate Lava Cake',
    description: 'Decadent warm dark chocolate cake with a molten center, served with a scoop of vanilla bean ice cream.',
    price: 850,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    is_available: true,
    is_featured: true,
    portion_size: 'Serves 1',
    preparation_note: 'Freshly baked upon order (12 mins)',
    add_ons: [
      { id: 'add-icecream', name: 'Extra Scoop Vanilla Ice Cream', price: 120 }
    ]
  }
];

export const DEFAULT_GALLERY: GalleryImage[] = [
  {
    id: 'gal-1',
    title: 'Vintage Cafe Welcoming Dining Room',
    category: 'Interior',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    caption: 'Warm ambient lighting and cozy wooden seating for family and friends.',
    order_index: 1
  },
  {
    id: 'gal-2',
    title: 'Artisan Rice & Grills',
    category: 'Food',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    caption: 'Fresh ingredients prepared with passion and authentic flavor profiles.',
    order_index: 2
  },
  {
    id: 'gal-3',
    title: 'Restaurant Facade on Gampaha Highway',
    category: 'Exterior',
    image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80',
    caption: 'Convenient location with roadside parking along Ja-Ela - Gampaha highway.',
    order_index: 3
  },
  {
    id: 'gal-4',
    title: 'Signature Coffee & Beverages Counter',
    category: 'Restaurant',
    image_url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80',
    caption: 'Barista crafted specialty coffee, iced blends, and mocktails.',
    order_index: 4
  },
  {
    id: 'gal-5',
    title: 'Celebrations & Group Gatherings',
    category: 'Events',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    caption: 'Spacious dining arrangement ideal for birthday parties and get-togethers.',
    order_index: 5
  },
  {
    id: 'gal-6',
    title: 'Gourmet Burgers & Crispy Sides',
    category: 'Food',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    caption: 'Satisfying mains crafted fresh daily.',
    order_index: 6
  }
];

export const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customer_name: 'Dinesh Wickramasinghe',
    rating: 5,
    comment: 'The chicken fried rice and cheese kottu here are phenomenal! Authentic Sri Lankan spice balance and very generous portions. Beautiful interior with vintage touches.',
    date: '2026-03-12',
    source: 'Google',
    is_verified: true
  },
  {
    id: 'rev-2',
    customer_name: 'Sanduni Fernando',
    rating: 5,
    comment: 'Ordered via WhatsApp delivery and was impressed by how hot and crisp the food arrived. The seafood platter is top tier. Highly recommended in Gampaha!',
    date: '2026-03-05',
    source: 'Direct',
    is_verified: true
  },
  {
    id: 'rev-3',
    customer_name: 'Kasun Bandara',
    rating: 4,
    comment: 'Lovely atmosphere for family dinners. Very friendly staff and parking along the highway was easy. Their iced caramel latte and chocolate lava cake were delicious.',
    date: '2026-02-28',
    source: 'Google',
    is_verified: true
  },
  {
    id: 'rev-4',
    customer_name: 'Imasha Jayawardena',
    rating: 5,
    comment: 'We reserved a table for my brother’s birthday celebration. The staff arranged everything nicely. WhatsApp booking was quick and smooth. Will visit again!',
    date: '2026-02-18',
    source: 'Google',
    is_verified: true
  }
];

