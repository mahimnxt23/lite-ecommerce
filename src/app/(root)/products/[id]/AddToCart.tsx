"use client";

import { useCartStore } from "@/store/cart.store";
import { ShoppingBag } from "lucide-react";

export function AddToCart({ variantId }: { variantId: string }) {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart(variantId, 1);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex items-center justify-center gap-2 rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
    >
      <ShoppingBag className="h-5 w-5" />
      Add to Bag
    </button>
  );
}
