"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart.store";

export function CartInitializer() {
  const { initializeCart } = useCartStore();

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  return null;
}
