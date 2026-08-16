import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  size: string;
  price: number | null;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  discount: { code: string; percent: number } | null;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  setDiscount: (discount: { code: string; percent: number } | null) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discount: null,
      add: (item, qty = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: qty }] });
        }
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, qty) =>
        set({
          items: get()
            .items.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i))
            .filter((i) => i.quantity > 0),
        }),
      setDiscount: (discount) => set({ discount }),
      clear: () => set({ items: [], discount: null }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((n, i) => n + (i.price ?? 0) * i.quantity, 0),
    }),
    { name: "ark-matcha-cart" },
  ),
);
