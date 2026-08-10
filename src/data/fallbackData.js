export const fallbackBrands = [
  { id: 1, name: 'iPhone', logo_url: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Samsung', logo_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Tecno', logo_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Infinix', logo_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Xiaomi', logo_url: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=300&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Google Pixel', logo_url: 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=300&auto=format&fit=crop&q=80' }
];

export const fallbackAccessories = [
  {
    id: 1,
    title: 'Apple AirPods Pro 2nd Gen (ANC)',
    category: 'Earbuds',
    price: 45000,
    stock_qty: 15,
    image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
    description: 'Active Noise Cancellation, MagSafe charging case, immersive sound quality.',
    is_featured: 1
  },
  {
    id: 2,
    title: 'Apple 20W USB-C Fast Charger + Cable',
    category: 'Chargers',
    price: 15000,
    stock_qty: 30,
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    description: 'Original fast charging adapter for iPhone 11, 12, 13, 14, 15 series.',
    is_featured: 1
  },
  {
    id: 3,
    title: 'Oraimo FreePods 4 Noise Cancelling',
    category: 'Earbuds',
    price: 28000,
    stock_qty: 20,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    description: 'Deep bass, 35.5 hour battery life, low latency game mode.',
    is_featured: 1
  },
  {
    id: 4,
    title: 'Anker 20,000mAh PowerCore Fast Power Bank',
    category: 'Power Banks',
    price: 35000,
    stock_qty: 12,
    image_url: 'https://images.unsplash.com/photo-1609592424074-2795cf60c1d1?w=600&auto=format&fit=crop&q=80',
    description: 'High capacity 20,000mAh battery pack. Fast charging technology.',
    is_featured: 1
  }
];

export const fallbackProducts = [
  {
    id: 1,
    title: 'Apple iPhone 13',
    brand: 'iPhone',
    model: 'iPhone 13',
    condition: 'UK Used',
    base_price: 420000,
    stock_status: 'In Stock',
    description: 'Clean UK Used iPhone 13 with pristine Super Retina XDR display, A15 Bionic chip, cinematic video mode.',
    warranty: '6 Months Warranty',
    battery_health: '88% - 100% Clean Battery',
    sim_info: 'Physical SIM + eSIM',
    is_featured: 1,
    image_url: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=700&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=700&auto=format&fit=crop&q=80'],
    variations: [
      { id: 1, storage: '128GB', ram: '4GB', color: 'Midnight Black', price: 420000, stock_qty: 6 },
      { id: 2, storage: '256GB', ram: '4GB', color: 'Pacific Blue', price: 475000, stock_qty: 4 }
    ]
  },
  {
    id: 2,
    title: 'Apple iPhone 15 Pro Max',
    brand: 'iPhone',
    model: 'iPhone 15 Pro Max',
    condition: 'Brand New',
    base_price: 1280000,
    stock_status: 'In Stock',
    description: 'Brand New Sealed iPhone 15 Pro Max with Titanium design, A17 Pro chip, Action button, and 5x Telephoto camera.',
    warranty: '1 Year Apple Warranty',
    battery_health: '100% Original Battery',
    sim_info: 'Nano SIM + eSIM',
    is_featured: 1,
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80'],
    variations: [
      { id: 3, storage: '256GB', ram: '8GB', color: 'Natural Titanium', price: 1280000, stock_qty: 4 }
    ]
  },
  {
    id: 3,
    title: 'Samsung Galaxy S24 Ultra 5G',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    condition: 'Brand New',
    base_price: 1350000,
    stock_status: 'In Stock',
    description: 'Galaxy AI powered flagship phone with Titanium Frame, Snapdragon 8 Gen 3, S Pen, 200MP camera setup.',
    warranty: '1 Year Official Samsung Warranty',
    battery_health: '100% Battery',
    sim_info: 'Dual Nano SIM',
    is_featured: 1,
    image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&auto=format&fit=crop&q=80'],
    variations: [
      { id: 4, storage: '256GB', ram: '12GB', color: 'Titanium Black', price: 1350000, stock_qty: 5 }
    ]
  },
  {
    id: 4,
    title: 'Apple iPhone 11',
    brand: 'iPhone',
    model: 'iPhone 11',
    condition: 'UK Used',
    base_price: 245000,
    stock_status: 'In Stock',
    description: 'Very clean UK Used iPhone 11 with Dual 12MP cameras, Face ID, Liquid Retina display, and A13 Bionic chip.',
    warranty: '6 Months Warranty',
    battery_health: '85% - 96% Clean Battery',
    sim_info: 'Physical SIM + eSIM',
    is_featured: 1,
    image_url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=700&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=700&auto=format&fit=crop&q=80'],
    variations: [
      { id: 5, storage: '64GB', ram: '4GB', color: 'Black', price: 245000, stock_qty: 8 },
      { id: 6, storage: '128GB', ram: '4GB', color: 'Purple', price: 285000, stock_qty: 6 }
    ]
  }
];

export const fallbackReviews = [
  { id: 1, customer_name: 'Chidi Ebere', rating: 5, text: 'Bought UK Used iPhone 13 at UPTH 18 Plaza. Battery health was 92%, phone looks brand new! Delivery to GRA was fast same day.', phone_purchased: 'iPhone 13 128GB', date: 'Yesterday' },
  { id: 2, customer_name: 'Blessing Nwankwo', rating: 5, text: 'They swapped my iPhone 11 to iPhone 13 Pro Max smoothly. Honest valuation and very customer friendly on WhatsApp!', phone_purchased: 'Swapped iPhone 11 to 13 Pro Max', date: '3 days ago' },
  { id: 3, customer_name: 'Dr. Emmanuel K.', rating: 5, text: 'Fixed my cracked Samsung S22 Ultra screen in less than 2 hours. Professional repair shop in Choba. Highly recommended!', phone_purchased: 'Screen Replacement Repair', date: '1 week ago' }
];

export async function safeFetchJson(url, fallbackData) {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      return fallbackData;
    }
    return await res.json();
  } catch (err) {
    console.warn(`API fetch to ${url} failed, using fallback catalog data:`, err);
    return fallbackData;
  }
}
