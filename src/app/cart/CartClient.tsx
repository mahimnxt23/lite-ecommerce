"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Trash2 } from "lucide-react";

type CartClientProps = {
  cart: Awaited<ReturnType<typeof getCart>>;
};

export function CartClient({ cart }: CartClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    totalQuantity,
    totalPrice,
    initializeCart,
    updateQuantity,
    removeFromCart,
    clear,
    error,
  } = useCartStore();

  useEffect(() => {
    // The cart is now initialized in the root layout
  }, []);

  const handleCheckout = () => {
    if (!user) {
      router.push("/sign-in?redirect_url=/cart");
    } else {
      // Proceed to checkout
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.variant.product.thumbnail}
                      alt={item.variant.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h2 className="font-semibold">{item.variant.product.name}</h2>
                      <p className="text-sm text-gray-500">
                        {item.variant.color.name} / {item.variant.size.name}
                      </p>
                      <p className="font-bold">${item.variant.product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 text-center border rounded"
                    />
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={clear} className="mt-4 text-sm text-red-500">
              Clear Cart
            </button>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({totalQuantity} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
