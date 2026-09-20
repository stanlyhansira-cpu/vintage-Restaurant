export type Language = 'en' | 'si';

export interface TranslationDictionary {
  // Navigation
  nav_home: string;
  nav_menu: string;
  nav_reserve: string;
  nav_about: string;
  nav_gallery: string;
  nav_contact: string;
  nav_admin: string;
  nav_order_now: string;
  nav_book_table: string;
  nav_cart: string;
  nav_items: string;

  // Micro bar
  open_until: string;
  call_us: string;

  // Hero
  hero_tagline: string;
  hero_description: string;
  hero_order_now: string;
  hero_reserve_table: string;
  hero_view_menu: string;
  hero_whatsapp_note: string;
  hero_scroll: string;
  reviews_label: string;

  // Features / Why Vintage
  why_tag: string;
  why_title: string;
  why_subtitle: string;
  feat_a_grade_title: string;
  feat_a_grade_desc: string;
  feat_whatsapp_title: string;
  feat_whatsapp_desc: string;
  feat_dining_title: string;
  feat_dining_desc: string;
  feat_open_title: string;
  feat_open_desc: string;

  // Menu Section
  menu_tag: string;
  menu_title: string;
  menu_subtitle: string;
  menu_search_placeholder: string;
  menu_all_dishes: string;
  menu_no_dishes: string;
  menu_no_dishes_desc: string;
  menu_reset_filter: string;
  btn_add_to_cart: string;
  btn_customize: string;
  item_unavailable: string;
  item_featured: string;

  // Customization Modal
  modal_customize_title: string;
  modal_portion: string;
  modal_addons_title: string;
  modal_instructions_title: string;
  modal_instructions_placeholder: string;
  modal_quantity: string;
  modal_total_price: string;
  modal_add_btn: string;

  // Cart Drawer
  cart_title: string;
  cart_empty_title: string;
  cart_empty_desc: string;
  cart_explore_menu: string;
  cart_clear_all: string;
  cart_subtotal: string;
  cart_delivery_note: string;
  cart_checkout_btn: string;

  // Reserve Table
  res_tag: string;
  res_title: string;
  res_subtitle: string;
  res_step1_title: string;
  res_date_label: string;
  res_time_label: string;
  res_guests_label: string;
  res_custom_guests: string;
  res_step2_title: string;
  res_name_label: string;
  res_phone_label: string;
  res_phone_hint: string;
  res_step3_title: string;
  res_seating_label: string;
  res_occasion_label: string;
  res_notes_label: string;
  res_notes_placeholder: string;
  res_submit_btn: string;
  res_success_title: string;
  res_success_desc: string;
  res_success_prompt: string;
  res_continue_whatsapp: string;
  res_another_btn: string;

  // Checkout
  checkout_back: string;
  checkout_title: string;
  checkout_subtitle: string;
  checkout_contact_title: string;
  checkout_fulfillment_title: string;
  checkout_delivery: string;
  checkout_delivery_desc: string;
  checkout_pickup: string;
  checkout_pickup_desc: string;
  checkout_address_label: string;
  checkout_city_label: string;
  checkout_instructions_title: string;
  checkout_instructions_placeholder: string;
  checkout_summary_title: string;
  checkout_items_ordered: string;
  checkout_delivery_fee: string;
  checkout_free: string;
  checkout_total: string;
  checkout_payment_note: string;
  checkout_place_btn: string;

  // Order Success
  order_success_title: string;
  order_success_subtitle: string;
  order_id_label: string;
  order_success_notice: string;
  order_continue_whatsapp: string;
  order_more_food: string;

  // About
  about_tag: string;
  about_title: string;
  about_explore_menu: string;
  about_prime_location: string;
  about_prime_desc: string;
  about_family_friends: string;
  about_family_desc: string;

  // Contact
  contact_tag: string;
  contact_title: string;
  contact_subtitle: string;
  contact_location_title: string;
  contact_hours_title: string;
  contact_get_directions: string;
  contact_call_now: string;
  contact_whatsapp_hotline: string;
  contact_chat_whatsapp: string;
  contact_open_maps: string;

  // Footer
  footer_quick_links: string;
  footer_service_hours: string;
  footer_hotline: string;
  footer_admin_link: string;
  footer_rights: string;

  // Category Names (Translations)
  cat_all: string;
  cat_rice: string;
  cat_kottu: string;
  cat_noodles: string;
  cat_burgers: string;
  cat_cafe: string;
  cat_desserts: string;

  // Reviews
  reviews_tag: string;
  reviews_title: string;
  reviews_subtitle: string;
  reviews_google_summary: string;
  reviews_write_btn: string;
  reviews_name_placeholder: string;
  reviews_comment_placeholder: string;
  reviews_rating_label: string;
  reviews_submit_btn: string;
  reviews_cancel_btn: string;
  reviews_verified: string;
  reviews_empty: string;

  // Promotional Banner
  promo_badge: string;
  promo_countdown_ends: string;
  promo_copy_code: string;
  promo_copied: string;
  promo_order_now: string;
  promo_reopen_tooltip: string;
  promo_view_deals: string;
  promo_deal_1_title: string;
  promo_deal_1_desc: string;
  promo_deal_2_title: string;
  promo_deal_2_desc: string;
  promo_deal_3_title: string;
  promo_deal_3_desc: string;

  // Newsletter
  newsletter_title: string;
  newsletter_subtitle: string;
  newsletter_placeholder: string;
  newsletter_btn: string;
  newsletter_subscribing: string;
  newsletter_success_title: string;
  newsletter_success_desc: string;
  newsletter_invalid_email: string;
  newsletter_privacy_note: string;
  newsletter_perk_discount: string;
  newsletter_perk_specials: string;
  newsletter_perk_events: string;

  // Print PDF Menu
  menu_print_btn: string;
  menu_print_modal_title: string;
  menu_print_modal_subtitle: string;
  menu_print_scope_all: string;
  menu_print_scope_current: string;
  menu_print_action_btn: string;
  menu_print_help_tip: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_menu: 'Menu',
    nav_reserve: 'Reserve Table',
    nav_about: 'About',
    nav_gallery: 'Gallery',
    nav_contact: 'Contact',
    nav_admin: 'Admin',
    nav_order_now: 'Order Now',
    nav_book_table: 'Book Table',
    nav_cart: 'Cart',
    nav_items: 'items',

    // Micro bar
    open_until: 'Open daily till 11:00 PM',
    call_us: 'Call Us',

    // Hero
    hero_tagline: 'Taste the Vintage.',
    hero_description: 'A grade foods. Great food. Good moments. A dining experience worth remembering.',
    hero_order_now: 'Order Now',
    hero_reserve_table: 'Reserve Table',
    hero_view_menu: 'View Menu',
    hero_whatsapp_note: 'Quick WhatsApp order with live confirmation • No account needed',
    hero_scroll: 'Scroll to explore',
    reviews_label: 'Google Reviews',

    // Features
    why_tag: 'The Vintage Experience',
    why_title: 'Why Dine With Vintage?',
    why_subtitle: 'Great food, good moments, and genuine hospitality along the Gampaha highway.',
    feat_a_grade_title: 'A Grade Foods',
    feat_a_grade_desc: 'We prioritize premium quality ingredients, fresh meats, farm vegetables, and authentic spices in every dish.',
    feat_whatsapp_title: 'Seamless WhatsApp Ordering',
    feat_whatsapp_desc: 'Order effortlessly directly to our kitchen phone on WhatsApp. No account or password required.',
    feat_dining_title: 'Versatile Dining & Takeaway',
    feat_dining_desc: 'From flavorful Sri Lankan cheese kottu to wok-tossed fried rice and cafe coffees, our menu caters to every craving.',
    feat_open_title: 'Open Daily till 11 PM',
    feat_open_desc: 'Conveniently situated on Ja-Ela–Ekala–Gampaha–Yakkala Hwy for evening dinners, takeaway, and late bites.',

    // Menu Section
    menu_tag: 'Discover Flavors',
    menu_title: 'Our Dynamic Menu',
    menu_subtitle: 'Browse our freshly prepared menu items and customize your dishes with add-ons.',
    menu_search_placeholder: 'Search fried rice, kottu, burger, coffee...',
    menu_all_dishes: 'All Dishes',
    menu_no_dishes: 'No dishes found',
    menu_no_dishes_desc: 'Try adjusting your search term or select another category.',
    menu_reset_filter: 'Reset Filters',
    btn_add_to_cart: 'Add to Cart',
    btn_customize: 'Customize',
    item_unavailable: 'Currently unavailable',
    item_featured: 'Chef Choice',

    // Customization Modal
    modal_customize_title: 'Customize Your Dish',
    modal_portion: 'Portion Size',
    modal_addons_title: 'Available Add-ons (Optional)',
    modal_instructions_title: 'Special Cooking Instructions (Optional)',
    modal_instructions_placeholder: 'e.g. Less spicy, no onions, extra crispy chicken...',
    modal_quantity: 'Quantity',
    modal_total_price: 'Total Price',
    modal_add_btn: 'Add to Cart',

    // Cart Drawer
    cart_title: 'Your Cart',
    cart_empty_title: 'Your cart is empty.',
    cart_empty_desc: 'Discover our signature dishes, kottu specials, coffees and sweet desserts.',
    cart_explore_menu: 'Explore Menu',
    cart_clear_all: 'Clear all',
    cart_subtotal: 'Subtotal',
    cart_delivery_note: 'Calculated at checkout (Free for pickup)',
    cart_checkout_btn: 'Proceed to Checkout',

    // Reserve Table
    res_tag: 'Dine-In Booking',
    res_title: 'Reserve a Table',
    res_subtitle: 'Planning a dinner, birthday celebration, or casual gathering? Select your date, time, and party size to reserve with us directly via WhatsApp.',
    res_step1_title: 'Reservation Details',
    res_date_label: 'Select Date',
    res_time_label: 'Dining Time',
    res_guests_label: 'Number of Guests',
    res_custom_guests: 'Custom Size...',
    res_step2_title: 'Contact Information',
    res_name_label: 'Your Full Name',
    res_phone_label: 'WhatsApp Phone Number',
    res_phone_hint: "The WhatsApp reservation will open from this number.",
    res_step3_title: 'Seating & Occasion Preferences',
    res_seating_label: 'Seating Area Preference',
    res_occasion_label: 'Occasion / Event',
    res_notes_label: 'Special Requests / Dietary Notes (Optional)',
    res_notes_placeholder: 'e.g. Please arrange a baby high chair; celebrating my wife\'s birthday; window side table preferred.',
    res_submit_btn: 'Send Table Reservation on WhatsApp',
    res_success_title: 'Reservation Request Prepared 🎉',
    res_success_desc: 'Your table booking request has been formatted and opened in WhatsApp.',
    res_success_prompt: 'Please send the WhatsApp message to complete your reservation. Our team will verify floor availability and confirm your table promptly.',
    res_continue_whatsapp: 'Continue in WhatsApp',
    res_another_btn: 'Make Another Reservation',

    // Checkout
    checkout_back: 'Continue Browsing Menu',
    checkout_title: 'Checkout & Order Details',
    checkout_subtitle: 'Complete your information below to place your order directly with Vintage Restaurant via WhatsApp.',
    checkout_contact_title: '1. Contact Information',
    checkout_fulfillment_title: '2. Order Fulfillment Type',
    checkout_delivery: 'Delivery',
    checkout_delivery_desc: 'Delivered to your doorstep',
    checkout_pickup: 'Takeaway / Pickup',
    checkout_pickup_desc: 'Collect at Gampaha restaurant (Free)',
    checkout_address_label: 'Delivery Street Address',
    checkout_city_label: 'City / Neighborhood',
    checkout_instructions_title: '3. Special Instructions for Chef / Delivery (Optional)',
    checkout_instructions_placeholder: 'e.g. Please make the food less spicy. Call before arriving.',
    checkout_summary_title: 'Order Summary',
    checkout_items_ordered: 'Items Ordered',
    checkout_delivery_fee: 'Delivery Fee',
    checkout_free: 'FREE',
    checkout_total: 'Total Amount',
    checkout_payment_note: 'Payment method: Pay on Delivery / In-person',
    checkout_place_btn: 'Place Order on WhatsApp',

    // Order Success
    order_success_title: 'Order Created Successfully 🎉',
    order_success_subtitle: 'Your order details have been prepared for WhatsApp.',
    order_id_label: 'Order ID:',
    order_success_notice: 'Please send the WhatsApp message to complete your order request. Our team at Vintage Restaurant & Cafe will review your items and confirm preparation time and delivery dispatch directly via WhatsApp.',
    order_continue_whatsapp: 'Continue to WhatsApp',
    order_more_food: 'Order More Food',

    // About
    about_tag: 'About Vintage Restaurant & Cafe',
    about_title: 'Crafting Great Food & Unforgettable Moments',
    about_explore_menu: 'Explore Our Menu',
    about_prime_location: 'Prime Location',
    about_prime_desc: 'Convenient highway stop with easy parking and comfortable seating.',
    about_family_friends: 'Family & Friends',
    about_family_desc: 'Spacious dining arrangements suitable for gatherings, celebrations, and casual coffee.',

    // Contact
    contact_tag: 'Find Us & Connect',
    contact_title: 'Location & Contact',
    contact_subtitle: 'Visit us along the Ja-Ela–Ekala–Gampaha–Yakkala highway or reach out anytime for takeaway and orders.',
    contact_location_title: 'Restaurant Location',
    contact_hours_title: 'Opening Hours',
    contact_get_directions: 'Get Directions',
    contact_call_now: 'Call Now',
    contact_whatsapp_hotline: 'WhatsApp Ordering Hotline',
    contact_chat_whatsapp: 'Chat on WhatsApp',
    contact_open_maps: 'Open in Google Maps',

    // Footer
    footer_quick_links: 'Quick Links',
    footer_service_hours: 'Service Hours',
    footer_hotline: 'Restaurant Hotline',
    footer_admin_link: 'Staff / Owner Admin Dashboard',
    footer_rights: 'All rights reserved.',

    // Categories
    cat_all: 'All Dishes',
    cat_rice: 'Rice & Biryani',
    cat_kottu: 'Kottu Specials',
    cat_noodles: 'Noodles & Pasta',
    cat_burgers: 'Burgers & Sandwiches',
    cat_cafe: 'Cafe & Beverages',
    cat_desserts: 'Desserts',

    // Reviews
    reviews_tag: 'Guest Experiences',
    reviews_title: 'Customer Reviews',
    reviews_subtitle: 'What diners say about their culinary moments at Vintage Restaurant & Cafe Gampaha',
    reviews_google_summary: 'Based on 117+ verified dining reviews on Google',
    reviews_write_btn: 'Write a Review',
    reviews_name_placeholder: 'Your Name (e.g. Kasun Fernando)',
    reviews_comment_placeholder: 'Share your dining experience, favorite food, or thoughts on our service...',
    reviews_rating_label: 'Your Rating',
    reviews_submit_btn: 'Submit Review',
    reviews_cancel_btn: 'Cancel',
    reviews_verified: 'Verified Diner',
    reviews_empty: 'No customer reviews yet. Be the first to share your experience!',

    // Promotional Banner
    promo_badge: 'TODAY\'S SPECIAL',
    promo_countdown_ends: 'Ends in',
    promo_copy_code: 'Copy Code',
    promo_copied: 'Copied!',
    promo_order_now: 'Order Special',
    promo_reopen_tooltip: 'View Daily Special & Offers',
    promo_view_deals: 'Daily Specials',
    promo_deal_1_title: '15% OFF Biryani & Kottu Platters',
    promo_deal_1_desc: 'Save 15% on all Sri Lankan Chef Special Biryani & Kottu orders. Use code',
    promo_deal_2_title: 'Twilight Happy Hour: Buy 1 Get 1 50% OFF',
    promo_deal_2_desc: 'Get 50% off second beverage or dessert daily 4 PM – 7 PM. Use code',
    promo_deal_3_title: 'Free Highway Delivery in Gampaha',
    promo_deal_3_desc: 'Zero delivery fee for highway orders over Rs. 2,500. Use code',

    // Newsletter
    newsletter_title: 'Join the Vintage Dining Club',
    newsletter_subtitle: 'Receive exclusive secret discount codes, weekend chef specials, and invitations to culinary tasting events directly in your inbox.',
    newsletter_placeholder: 'Enter your email address (e.g. diner@vintage.lk)',
    newsletter_btn: 'Subscribe',
    newsletter_subscribing: 'Joining...',
    newsletter_success_title: 'Welcome to the Vintage Dining Club!',
    newsletter_success_desc: 'Thank you for subscribing! Your 10% dining welcome voucher has been queued.',
    newsletter_invalid_email: 'Please enter a valid email address.',
    newsletter_privacy_note: 'We respect your privacy. No spam, only great food updates. Unsubscribe anytime.',
    newsletter_perk_discount: '10% Welcome Discount',
    newsletter_perk_specials: 'Weekend Chef Specials',
    newsletter_perk_events: 'VIP Event Invitations',

    // Print PDF Menu
    menu_print_btn: 'Print PDF Menu',
    menu_print_modal_title: 'Printable Dining Menu',
    menu_print_modal_subtitle: 'Generate a clean, high-resolution printable PDF menu for offline viewing, dine-in, or takeaway.',
    menu_print_scope_all: 'Complete Menu (All Categories)',
    menu_print_scope_current: 'Current Filter / Search Results',
    menu_print_action_btn: 'Print / Save as PDF',
    menu_print_help_tip: 'Pro-Tip: In the browser print dialog, choose "Save as PDF" as the Destination to download.'
  },

  si: {
    // Navigation
    nav_home: 'මුල් පිටුව',
    nav_menu: 'මෙනුව',
    nav_reserve: 'මේස වෙන්කරන්න',
    nav_about: 'අප ගැන',
    nav_gallery: 'ඡායාරූප',
    nav_contact: 'සම්බන්ධ වන්න',
    nav_admin: 'පරිපාලක',
    nav_order_now: 'ඇණවුම් කරන්න',
    nav_book_table: 'මේසයක් වෙන්කරන්න',
    nav_cart: 'කරත්තය',
    nav_items: 'අයිතම',

    // Micro bar
    open_until: 'දිනපතා රාත්‍රී 11:00 දක්වා විවෘතයි',
    call_us: 'අමතන්න',

    // Hero
    hero_tagline: 'වින්ටේජ් රස අත්විඳින්න.',
    hero_description: 'උසස් තත්ත්වයේ ප්‍රණීත ආහාර. සොඳුරු අවස්ථා. මතකයේ රැඳෙන අපූරු භෝජන අත්දැකීමක්.',
    hero_order_now: 'දැන් ඇණවුම් කරන්න',
    hero_reserve_table: 'මේසයක් වෙන්කරන්න',
    hero_view_menu: 'මෙනුව බලන්න',
    hero_whatsapp_note: 'WhatsApp හරහා පහසුවෙන් ඇණවුම් කර තහවුරු කරගන්න • ගිණුමක් අවශ්‍ය නොවේ',
    hero_scroll: 'තවදුරටත් බලන්න පහළට යන්න',
    reviews_label: 'ගූගල් සමාලෝචන',

    // Features
    why_tag: 'වින්ටේජ් අත්දැකීම',
    why_title: 'වින්ටේජ් වෙතින් ආහාර රසවිඳින්නේ ඇයි?',
    why_subtitle: 'ගම්පහ ප්‍රධාන මාර්ගයේ විශිෂ්ට ආහාර, ප්‍රීතිමත් මොහොතවල් සහ උණුසුම් ආගන්තුක සත්කාරය.',
    feat_a_grade_title: 'උසස් ප්‍රමිතියේ (A Grade) ආහාර',
    feat_a_grade_desc: 'සෑම කෑමක් සඳහාම නැවුම් එළවළු, පිරිසිදු මස් සහ අව්‍යාජ ශ්‍රී ලාංකීය කුළුබඩු අපි භාවිතා කරමු.',
    feat_whatsapp_title: 'පහසු WhatsApp ඇණවුම්',
    feat_whatsapp_desc: 'ගිණුම් හෝ මුරපද නැතිව, කෙලින්ම අපගේ WhatsApp අංකයට සෘජුවම ඇණවුම් කරන්න.',
    feat_dining_title: 'ආපනශාලාවේ ආහාර ගැනීම හා රැගෙන යාම',
    feat_dining_desc: 'චීස් කොත්තු, ෆ්‍රයිඩ් රයිස්, බර්ගර් සහ රසවත් කෝපි ඇතුළු සියලුම රසයන් එකම වහලක් යටින්.',
    feat_open_title: 'දිනපතා රාත්‍රී 11 දක්වා විවෘතයි',
    feat_open_desc: 'ජා-ඇල–එකල–ගම්පහ–යක්කල මහා මාර්ගයේ පිහිටා ඇති බැවින් සවස ආහාර සහ රාත්‍රී කෑම සඳහා ඉතා පහසුයි.',

    // Menu Section
    menu_tag: 'සුවඳැති රස සොයායන්න',
    menu_title: 'අපගේ රසවත් මෙනුව',
    menu_subtitle: 'නැවුම්ව සකසන ආහාර තෝරාගෙන ඔබේ රුචිකත්වයට අනුව වෙනස්කම් සිදුකර ගන්න.',
    menu_search_placeholder: 'ෆ්‍රයිඩ් රයිස්, කොත්තු, බර්ගර්, කෝපි සොයන්න...',
    menu_all_dishes: 'සියලුම ආහාර',
    menu_no_dishes: 'කිසිදු ආහාරයක් හමු නොවීය',
    menu_no_dishes_desc: 'වෙනත් නමක් යොදා සොයන්න හෝ වෙනත් කාණ්ඩයක් තෝරන්න.',
    menu_reset_filter: 'පෙරහන් යළි සකසන්න',
    btn_add_to_cart: 'කරත්තයට එක්කරන්න',
    btn_customize: 'වෙනස් කරන්න',
    item_unavailable: 'දැනට නොමැත',
    item_featured: 'ප්‍රධාන තේරීම',

    // Customization Modal
    modal_customize_title: 'ආහාරය ඔබේ කැමැත්තට සකසන්න',
    modal_portion: 'ප්‍රමාණය',
    modal_addons_title: 'අමතර එකතු කිරීම් (විකල්ප)',
    modal_instructions_title: 'විශේෂ උපදෙස් (විකල්ප)',
    modal_instructions_placeholder: 'උදා: සැර අඩුවෙන්, ලූනු රහිතව, ක්‍රිස්පි චිකන්...',
    modal_quantity: 'ප්‍රමාණය',
    modal_total_price: 'මුළු මුදල',
    modal_add_btn: 'කරත්තයට එක්කරන්න',

    // Cart Drawer
    cart_title: 'ඔබගේ කරත්තය',
    cart_empty_title: 'ඔබගේ කරත්තය හිස්ව ඇත.',
    cart_empty_desc: 'අපගේ සුවිශේෂී බත්, කොත්තු වර්ග, කෝපි සහ පැණි රස කෑම වර්ග රස බලන්න.',
    cart_explore_menu: 'මෙනුව බලන්න',
    cart_clear_all: 'සියල්ල ඉවත් කරන්න',
    cart_subtotal: 'අතුරු එකතුව',
    cart_delivery_note: 'පිටවීමේදී ගණනය කෙරේ (රැගෙන යාම සඳහා නොමිලේ)',
    cart_checkout_btn: 'ඇණවුම තහවුරු කිරීමට යන්න',

    // Reserve Table
    res_tag: 'මේස වෙන්කරවා ගැනීම',
    res_title: 'මේසයක් වෙන්කරන්න',
    res_subtitle: 'රාත්‍රී භෝජනයක්, උපන් දින සාදයක් හෝ පවුලේ හමුවක්ද? දිනය, වේලාව සහ පිරිස තෝරා WhatsApp හරහා වෙන්කරවා ගන්න.',
    res_step1_title: 'වෙන්කිරීමේ තොරතුරු',
    res_date_label: 'දිනය තෝරන්න',
    res_time_label: 'භෝජන වේලාව',
    res_guests_label: 'අමුත්තන් ගණන',
    res_custom_guests: 'වෙනත් ප්‍රමාණයක්...',
    res_step2_title: 'සම්බන්ධතා තොරතුරු',
    res_name_label: 'ඔබගේ සම්පූර්ණ නම',
    res_phone_label: 'WhatsApp දුරකථන අංකය',
    res_phone_hint: 'මෙම අංකයෙන් WhatsApp පණිවිඩය සූදානම් කෙරේ.',
    res_step3_title: 'ආසන හා අවස්ථාව පිළිබඳ කැමැත්ත',
    res_seating_label: 'ආසන ප්‍රදේශය',
    res_occasion_label: 'අවස්ථාව / සාදය',
    res_notes_label: 'විශේෂ ඉල්ලීම් / සටහන් (විකල්ප)',
    res_notes_placeholder: 'උදා: ළදරු පුටුවක් අවශ්‍යයි, උපන්දිනය සැමරීමක්, ජනේලය අසල මේසයක්...',
    res_submit_btn: 'WhatsApp මගින් මේසය වෙන්කරන්න',
    res_success_title: 'වෙන්කිරීමේ පණිවිඩය සූදානම් 🎉',
    res_success_desc: 'ඔබගේ මේස වෙන්කිරීමේ විස්තර WhatsApp වෙත යොමු කිරීමට සූදානම් කරන ලදී.',
    res_success_prompt: 'කරුණාකර වෙන්කිරීම සම්පූර්ණ කිරීමට WhatsApp පණිවිඩය යවන්න. අපගේ කාර්ය මණ්ඩලය විනාඩි කිහිපයකින් එය තහවුරු කරනු ඇත.',
    res_continue_whatsapp: 'WhatsApp වෙත යන්න',
    res_another_btn: 'තවත් මේසයක් වෙන්කරන්න',

    // Checkout
    checkout_back: 'නැවත මෙනුව වෙත',
    checkout_title: 'පිටවීම සහ ඇණවුම් විස්තර',
    checkout_subtitle: 'WhatsApp හරහා වින්ටේජ් අවන්හල වෙත සෘජුවම ඇණවුම යැවීමට පහත තොරතුරු පුරවන්න.',
    checkout_contact_title: '1. සම්බන්ධතා තොරතුරු',
    checkout_fulfillment_title: '2. ලබාගැනීමේ ක්‍රමය',
    checkout_delivery: 'නිවසටම ගෙන්වා ගැනීම',
    checkout_delivery_desc: 'ඔබගේ නිවසටම ප්‍රවාහනය කෙරේ',
    checkout_pickup: 'අවන්හලෙන් රැගෙන යාම',
    checkout_pickup_desc: 'ගම්පහ අවන්හලට පැමිණ ලබාගන්න (නොමිලේ)',
    checkout_address_label: 'ලිපිනය',
    checkout_city_label: 'නගරය / ප්‍රදේශය',
    checkout_instructions_title: '3. විශේෂ සූපශාස්ත්‍ර / ප්‍රවාහන උපදෙස් (විකල්ප)',
    checkout_instructions_placeholder: 'උදා: කෑම සැර අඩුවෙන් හදන්න. පැමිණීමට පෙර කතා කරන්න.',
    checkout_summary_title: 'ඇණවුම් සාරාංශය',
    checkout_items_ordered: 'ඇණවුම් කළ අයිතම',
    checkout_delivery_fee: 'ප්‍රවාහන ගාස්තුව',
    checkout_free: 'නොමිලේ',
    checkout_total: 'මුළු මුදල',
    checkout_payment_note: 'ගෙවීම් ක්‍රමය: භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම (COD)',
    checkout_place_btn: 'WhatsApp මගින් ඇණවුම් කරන්න',

    // Order Success
    order_success_title: 'ඇණවුම සාර්ථකව සකසන ලදී 🎉',
    order_success_subtitle: 'ඔබගේ ඇණවුම් විස්තර WhatsApp සඳහා සූදානම්.',
    order_id_label: 'ඇණවුම් අංකය:',
    order_success_notice: 'කරුණාකර ඔබගේ ඇණවුම සම්පූර්ණ කිරීම සඳහා WhatsApp පණිවිඩය යවන්න. වින්ටේජ් කාර්ය මණ්ඩලය කෑම පිළියෙල කිරීමේ කාලය සහ ප්‍රවාහනය සෘජුවම තහවුරු කරනු ඇත.',
    order_continue_whatsapp: 'WhatsApp වෙත යන්න',
    order_more_food: 'තව කෑම ඇණවුම් කරන්න',

    // About
    about_tag: 'වින්ටේජ් අවන්හල සහ කැෆේ පිළිබඳව',
    about_title: 'ප්‍රණීත ආහාර සහ අමතක නොවන සුන්දර මතකයන්',
    about_explore_menu: 'අපගේ මෙනුව බලන්න',
    about_prime_location: 'පහසු ප්‍රධාන ස්ථානය',
    about_prime_desc: 'වාහන නැවැත්වීමේ පහසුකම් සහිතව ප්‍රධාන මහා මාර්ගයේ පිහිටා ඇත.',
    about_family_friends: 'පවුලේ සහ මිතුරන්ගේ හමුවීම්',
    about_family_desc: 'සැමරුම්, සාකච්ඡා සහ සාමකාමී කෝපි විවේකයක් සඳහා සුදුසු ඉඩකඩ සහිත පරිසරය.',

    // Contact
    contact_tag: 'අප සොයා පැමිණෙන්න',
    contact_title: 'ස්ථානය සහ සම්බන්ධතා',
    contact_subtitle: 'ජා-ඇල–එකල–ගම්පහ–යක්කල මහා මාර්ගයේ අප වෙත පැමිණෙන්න නැතහොත් ඕනෑම වේලාවක අප අමතන්න.',
    contact_location_title: 'අවන්හල පිහිටි ස්ථානය',
    contact_hours_title: 'විවෘත වේලාවන්',
    contact_get_directions: 'මාර්ගය බලන්න (Directions)',
    contact_call_now: 'දැන්ම අමතන්න',
    contact_whatsapp_hotline: 'WhatsApp ඇණවුම් ක්ෂණික අංකය',
    contact_chat_whatsapp: 'WhatsApp හරහා සම්බන්ධ වන්න',
    contact_open_maps: 'Google Maps හරහා බලන්න',

    // Footer
    footer_quick_links: 'ක්ෂණික සබැඳි',
    footer_service_hours: 'සේවා වේලාවන්',
    footer_hotline: 'අවන්හල් දුරකථන අංකය',
    footer_admin_link: 'සේවක / හිමිකරු පරිපාලක පිවිසුම',
    footer_rights: 'සියලුම හිමිකම් ඇවිරිණි.',

    // Categories
    cat_all: 'සියල්ල',
    cat_rice: 'බත් සහ බිරියානි',
    cat_kottu: 'කොත්තු විශේෂ',
    cat_noodles: 'නූඩ්ල්ස් සහ පැස්ටා',
    cat_burgers: 'බර්ගර් සහ සැන්ඩ්විච්',
    cat_cafe: 'කැෆේ සහ පාන වර්ග',
    cat_desserts: 'පැණි රස අතුරුපස',

    // Reviews
    reviews_tag: 'අමුත්තන්ගේ අදහස්',
    reviews_title: 'පාරිභෝගික සමාලෝචන',
    reviews_subtitle: 'වින්ටේජ් ආපනශාලාවේ සේවාව හා රසවත් ආහාර පිළිබඳ පාරිභෝගිකයන්ගේ සැබෑ අදහස්',
    reviews_google_summary: 'ගූගල් හි සත්‍යාපිත සමාලෝචන 117+ කට අධික ප්‍රමාණයක් මත පදනම්ව',
    reviews_write_btn: 'සමාලෝචනයක් ලියන්න',
    reviews_name_placeholder: 'ඔබගේ නම (උදා: කසුන් ප්‍රනාන්දු)',
    reviews_comment_placeholder: 'ආහාර, සේවාව සහ පරිසරය පිළිබඳ ඔබගේ අත්දැකීම් මෙහි සටහන් කරන්න...',
    reviews_rating_label: 'ඔබේ ශ්‍රේණිගත කිරීම',
    reviews_submit_btn: 'සමාලෝචනය පළ කරන්න',
    reviews_cancel_btn: 'අවලංගු කරන්න',
    reviews_verified: 'සත්‍යාපිත අමුත්තෙක්',
    reviews_empty: 'තවමත් සමාලෝචන නොමැත. ඔබේ අදහස් මුලින්ම බෙදාගන්න!',

    // Promotional Banner
    promo_badge: 'අද දවසේ විශේෂ දීමනාව',
    promo_countdown_ends: 'අවසන් වීමට',
    promo_copy_code: 'කේතය පිටපත් කරන්න',
    promo_copied: 'පිටපත් විය!',
    promo_order_now: 'දැන් ඇණවුම් කරන්න',
    promo_reopen_tooltip: 'අද දවසේ විශේෂ දීමනා බලන්න',
    promo_view_deals: 'විශේෂ දීමනා',
    promo_deal_1_title: 'බිරියානි සහ කොත්තු සඳහා 15% ක වට්ටමක්',
    promo_deal_1_desc: 'වින්ටේජ් ෂෙෆ් විශේෂ බත් සහ කොත්තු සඳහා 15% ක විශේෂ වට්ටමක්. කේතය:',
    promo_deal_2_title: 'සවස 4 - 7 දක්වා දෙවන පානය සඳහා 50% ක වට්ටමක්',
    promo_deal_2_desc: 'විශේෂිත අයිස් කෝපි සහ මිල්ක්ෂේක් සඳහා අදම ලබාගන්න. කේතය:',
    promo_deal_3_title: 'ගම්පහ අවට නොමිලේ ඩිලිවරි සේවාව',
    promo_deal_3_desc: 'රු. 2,500 ට වැඩි ඇණවුම් සඳහා නොමිලේ ඩිලිවරි. කේතය:',

    // Newsletter
    newsletter_title: 'වින්ටේජ් ඩයිනින් ක්ලබ් වෙත ලියාපදිංචි වන්න',
    newsletter_subtitle: 'සතිපතා රහසිගත වට්ටම් කේත, සති අන්ත ෂෙෆ් විශේෂ ආහාර සහ විශේෂ ආරාධනා ඔබගේ ඊමේල් ලිපිනයටම ලබාගන්න.',
    newsletter_placeholder: 'ඔබගේ ඊමේල් ලිපිනය ඇතුළත් කරන්න (උදා: diner@vintage.lk)',
    newsletter_btn: 'ලියාපදිංචි වන්න',
    newsletter_subscribing: 'සම්බන්ධ වෙමින්...',
    newsletter_success_title: 'වින්ටේජ් ඩයිනින් ක්ලබ් වෙත සාදරයෙන් පිළිගනිමු!',
    newsletter_success_desc: 'ඔබ සාර්ථකව ලියාපදිංචි විය! ඔබගේ 10% වට්ටම් කූපනය සුළු මොහොතකින් ලැබෙනු ඇත.',
    newsletter_invalid_email: 'කරුණාකර නිවැරදි ඊමේල් ලිපිනයක් ඇතුළත් කරන්න.',
    newsletter_privacy_note: 'අපි ඔබගේ පෞද්ගලිකත්වයට ගරු කරමු. කිසිදු අනවශ්‍ය පණිවිඩයක් එවන්නේ නැත.',
    newsletter_perk_discount: '10% ක පිළිගැනීමේ වට්ටම',
    newsletter_perk_specials: 'සති අන්ත ෂෙෆ් විශේෂ',
    newsletter_perk_events: 'VIP ආරාධනා',

    // Print PDF Menu
    menu_print_btn: 'මෙනුව මුද්‍රණය කරන්න (PDF)',
    menu_print_modal_title: 'මුද්‍රණය කළ හැකි ආහාර මෙනුව',
    menu_print_modal_subtitle: 'ඔබේ පරිහරණය සඳහා හෝ මුද්‍රණය කිරීම සඳහා පිරිසිදු, පැහැදිලි PDF මෙනුවක් සාදාගන්න.',
    menu_print_scope_all: 'සම්පූර්ණ මෙනුව (සියලුම කාණ්ඩ)',
    menu_print_scope_current: 'දැනට තෝරාගත් අයිතම පමණක්',
    menu_print_action_btn: 'මුද්‍රණය කරන්න / PDF බාගන්න',
    menu_print_help_tip: 'මුද්‍රණ කවුළුවේ "Destination" කොටසෙන් "Save as PDF" තෝරාගැනීමෙන් PDF ගොනුවක් ලෙස සුරැකිය හැක.'
  }
};
