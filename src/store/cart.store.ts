import { create } from "zustand";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/lib/actions/cart";

type CartItem = Awaited<ReturnType<typeof getCart>>[0];

type CartState = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  initializeCart: () => Promise<void>;
  addToCart: (productVariantId: string, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clear: () => Promise<void>;
};

const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.quantity * Number(item.variant.product.price),
    0
  );
  return { totalQuantity, totalPrice };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isLoading: true,
  error: null,

  initializeCart: async (initialItems?: CartItem[]) => {
    try {
      set({ isLoading: true, error: null });
      const items = initialItems ?? await getCart();
      const { totalQuantity, totalPrice } = calculateTotals(items);
      set({ items, totalQuantity, totalPrice, isLoading: false });
    } catch (error) {
      set({ error: "Failed to initialize cart", isLoading: false });
    }
  },

  addToCart: async (productVariantId, quantity) => {
    try {
      await addCartItem({ productVariantId, quantity });
      const items = await getCart();
      const { totalQuantity, totalPrice } = calculateTotals(items);
      set({ items, totalQuantity, totalPrice });
    } catch (error) {
      set({ error: "Failed to add item to cart" });
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    try {
      await updateCartItem({ cartItemId, quantity });
      const items = await getCart();
      const { totalQuantity, totalPrice } = calculateTotals(items);
      set({ items, totalQuantity, totalPrice });
    } catch (error) {
      set({ error: "Failed to update item quantity" });
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      await removeCartItem({ cartItemId });
      const items = await getCart();
      const { totalQuantity, totalPrice } = calculateTotals(items);
      set({ items, totalQuantity, totalPrice });
    } catch (error) {
      set({ error: "Failed to remove item from cart" });
    }
  },

  clear: async () => {
    try {
      await clearCart();
      set({ items: [], totalQuantity: 0, totalPrice: 0 });
    } catch (error) {
      set({ error: "Failed to clear cart" });
    }
  },
}));
