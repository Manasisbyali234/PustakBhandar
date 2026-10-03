import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { KEYS, load, save, clearAll, uid, SEED_BOOKS, COMMISSION, PREMIUM_COMMISSION, SELLER_BASE_RATINGS } from './storage';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

const REPLIES = [
  'Hi! Yes, the book is still available.',
  'Sure, we can meet on campus. What time suits you?',
  'The price is already low, but I can adjust a little.',
  'Okay, deal! Please place the order in the app.',
];

export function StoreProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [chats, setChats] = useState({}); // { bookId: [{id, from, text, at}] }
  const [orders, setOrders] = useState([]);
  const replyCount = useRef({});

  // Load everything from local storage on startup
  useEffect(() => {
    (async () => {
      try {
        const u = await load(KEYS.user, null);
        let b = await load(KEYS.books, null);
        if (!Array.isArray(b) || b.length === 0) {
          b = SEED_BOOKS;
          await save(KEYS.books, b);
        }
        setUser(u);
        setBooks(b);
        setChats(await load(KEYS.chats, {}));
        const o = await load(KEYS.orders, []);
        setOrders(Array.isArray(o) ? o : []);
      } catch (e) {
        console.warn('Hydrate failed', e);
        setBooks(SEED_BOOKS);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Persist on every change
  useEffect(() => { if (ready) save(KEYS.user, user); }, [user, ready]);
  useEffect(() => { if (ready) save(KEYS.books, books); }, [books, ready]);
  useEffect(() => { if (ready) save(KEYS.chats, chats); }, [chats, ready]);
  useEffect(() => { if (ready) save(KEYS.orders, orders); }, [orders, ready]);

  const commissionRate = user?.premium ? PREMIUM_COMMISSION : COMMISSION;

  // Seller rating = sample base rating + ratings you gave that seller after purchases
  const sellerRating = (sellerId, sellerName) => {
    const base = SELLER_BASE_RATINGS[sellerId] || { avg: 0, count: 0 };
    const given = orders.filter(
      (o) => o.rating > 0 && (o.sellerId ? o.sellerId === sellerId : o.sellerName === sellerName)
    );
    const count = base.count + given.length;
    if (!count) return { avg: 0, count: 0 };
    const total = base.avg * base.count + given.reduce((s, o) => s + o.rating, 0);
    return { avg: total / count, count };
  };

  const actions = {
    register(data) {
      // "Verification": student ID + college email domain check (offline simulation)
      const verified = /\.(edu|ac\.in|edu\.in)$/i.test(data.email.trim()) && data.studentId.trim().length >= 4;
      setUser({ id: 'me', ...data, verified, premium: false, joinedAt: Date.now() });
    },
    updateUser(patch) { setUser((u) => ({ ...u, ...patch })); },

    addBook(b) {
      const book = {
        id: uid(), status: 'available', createdAt: Date.now(),
        sellerId: 'me', sellerName: user.name, sellerVerified: user.verified, ...b,
      };
      setBooks((prev) => [book, ...prev]);
    },
    deleteBook(id) { setBooks((p) => p.filter((b) => b.id !== id)); },
    markSold(id) {
      setBooks((p) => p.map((b) => (b.id === id ? { ...b, status: 'sold', soldAt: Date.now() } : b)));
    },

    buyBook(book, handover) {
      const fee = Math.round(book.price * COMMISSION);
      setOrders((p) => [{
        id: uid(), bookId: book.id, title: book.title, sellerId: book.sellerId, sellerName: book.sellerName,
        price: book.price, mrp: book.mrp, fee, mode: handover.mode, handover, at: Date.now(), rating: 0,
      }, ...p]);
      setBooks((p) => p.map((b) => (b.id === book.id ? { ...b, status: 'sold', soldAt: Date.now() } : b)));
    },
    rateOrder(orderId, rating) {
      setOrders((p) => p.map((o) => (o.id === orderId ? { ...o, rating } : o)));
    },

    sendMessage(book, text) {
      const msg = { id: uid(), from: 'me', text, at: Date.now(), title: book.title };
      setChats((p) => ({ ...p, [book.id]: [...(p[book.id] || []), msg] }));
      // Offline demo: seller auto-replies
      const n = replyCount.current[book.id] || 0;
      replyCount.current[book.id] = n + 1;
      if (book.sellerId !== 'me') {
        setTimeout(() => {
          const reply = { id: uid(), from: 'seller', text: REPLIES[n % REPLIES.length], at: Date.now() };
          setChats((p) => ({ ...p, [book.id]: [...(p[book.id] || []), reply] }));
        }, 1200);
      }
    },

    togglePremium() { setUser((u) => ({ ...u, premium: !u.premium })); },

    async resetAll() {
      await clearAll();
      setUser(null); setBooks(SEED_BOOKS); setChats({}); setOrders([]);
    },
  };

  // Derived stats for "Benefits for Students"
  const myBooks = books.filter((b) => b.sellerId === 'me');
  const sold = myBooks.filter((b) => b.status === 'sold');
  const earned = sold.reduce((s, b) => s + b.price - Math.round(b.price * commissionRate), 0);
  const saved = orders.reduce((s, o) => s + (o.mrp - o.price), 0);
  const stats = { earned, saved, reused: orders.length + sold.length, bought: orders.length, sold: sold.length };

  return (
    <Ctx.Provider value={{ ready, user, books, chats, orders, stats, commissionRate, sellerRating, actions }}>
      {children}
    </Ctx.Provider>
  );
}
