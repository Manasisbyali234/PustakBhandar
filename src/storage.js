import AsyncStorage from '@react-native-async-storage/async-storage';

// All app data lives on the device in AsyncStorage (local storage).
export const KEYS = {
  user: 'pb:user',
  books: 'pb:books',
  chats: 'pb:chats',
  orders: 'pb:orders',
};

export async function load(key, fallback) {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}

export async function save(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage save failed', key, e);
  }
}

export async function clearAll() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Sample listings from other students so the marketplace isn't empty on first launch.
export const SEED_BOOKS = [
  { id: 's1', title: 'Engineering Mathematics', author: 'B.S. Grewal', course: 'B.Tech', college: 'KLE Technological University', mrp: 750, price: 320, condition: 'Good', delivery: ['Pickup', 'Delivery'], sellerId: 'u_riya', sellerName: 'Riya P.', sellerVerified: true, featured: true, status: 'available', description: 'Clean copy, few pencil notes in Chapter 3.', createdAt: 1 },
  { id: 's2', title: 'Data Structures using C', author: 'Reema Thareja', course: 'BCA', college: 'KLE Technological University', mrp: 580, price: 240, condition: 'Like New', delivery: ['Pickup'], sellerId: 'u_arjun', sellerName: 'Arjun K.', sellerVerified: true, featured: false, status: 'available', description: 'Used for one semester only.', createdAt: 2 },
  { id: 's3', title: 'Financial Accounting', author: 'T.S. Grewal', course: 'B.Com', college: 'Karnatak University', mrp: 690, price: 280, condition: 'Fair', delivery: ['Pickup', 'Delivery'], sellerId: 'u_sneha', sellerName: 'Sneha M.', sellerVerified: true, featured: false, status: 'available', description: 'Some highlighting, all pages intact.', createdAt: 3 },
  { id: 's4', title: 'Concepts of Physics Vol. 1', author: 'H.C. Verma', course: 'B.Sc', college: 'Karnatak University', mrp: 520, price: 210, condition: 'Good', delivery: ['Delivery'], sellerId: 'u_farhan', sellerName: 'Farhan S.', sellerVerified: false, featured: false, status: 'available', description: 'Solved examples marked.', createdAt: 4 },
  { id: 's5', title: 'Database System Concepts', author: 'Silberschatz', course: 'B.Tech', college: 'KLE Technological University', mrp: 1100, price: 520, condition: 'Like New', delivery: ['Pickup', 'Delivery'], sellerId: 'u_meera', sellerName: 'Meera R.', sellerVerified: true, featured: true, status: 'available', description: '7th edition, no markings.', createdAt: 5 },
  { id: 's6', title: 'Business Law', author: 'N.D. Kapoor', course: 'BBA', college: 'SDM College', mrp: 480, price: 190, condition: 'Good', delivery: ['Pickup'], sellerId: 'u_kiran', sellerName: 'Kiran B.', sellerVerified: true, featured: false, status: 'available', description: 'Latest syllabus edition.', createdAt: 6 },
];

// Publisher / stationery ads (static, stored in app)
export const ADS = [
  {
    id: 'a1',
    brand: 'Navneet Stationery',
    tag: 'EXCLUSIVE OFFER',
    headline: 'Flat 15% off on all notebooks',
    text: 'Use code STUDENT15 at checkout. Valid on orders above ₹199.',
    emoji: '📓',
    color: '#1A3557',
    light: '#E8F0FB',
  },
  {
    id: 'a2',
    brand: 'S. Chand Publications',
    tag: 'NEW ARRIVALS',
    headline: 'Latest edition textbooks are here',
    text: 'Get 10% student discount on all new editions. Show your college ID.',
    emoji: '📘',
    color: '#27AE60',
    light: '#E8F8EF',
  },
  {
    id: 'a3',
    brand: 'Camlin Art & Stationery',
    tag: 'BEST PRICE',
    headline: 'Geometry boxes starting ₹99',
    text: 'Premium quality instruments for engineering & science students.',
    emoji: '📐',
    color: '#7C3AED',
    light: '#F3EEFF',
  },
  {
    id: 'a4',
    brand: 'Xerox & Print Hub',
    tag: 'NEAR CAMPUS',
    headline: 'Notes printing at ₹0.50/page',
    text: 'Spiral binding, colour prints & lamination. Open 8 AM – 10 PM.',
    emoji: '🖨️',
    color: '#E67E22',
    light: '#FFF4E5',
  },
  {
    id: 'a5',
    brand: 'EduTech Pro',
    tag: 'FREE TRIAL',
    headline: '1 month free on premium courses',
    text: 'Coding, design & aptitude prep. 50,000+ students enrolled.',
    emoji: '💻',
    color: '#E53E3E',
    light: '#FFF0F0',
  },
];

export const COMMISSION = 0.05;        // 5% per sale
export const PREMIUM_COMMISSION = 0.02; // reduced for Premium sellers
export const FEATURED_FEE = 20;         // Rs. to highlight a listing

// Starting ratings of the sample sellers. Ratings you give are added on top of these.
export const SELLER_BASE_RATINGS = {
  u_riya: { avg: 4.8, count: 12 },
  u_arjun: { avg: 4.5, count: 7 },
  u_sneha: { avg: 4.2, count: 5 },
  u_farhan: { avg: 3.9, count: 3 },
  u_meera: { avg: 4.9, count: 18 },
  u_kiran: { avg: 4.4, count: 6 },
};
