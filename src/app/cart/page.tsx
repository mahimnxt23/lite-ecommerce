import { getCart } from "@/lib/actions/cart";
import { CartClient } from "./CartClient";

export default async function CartPage() {
  const cart = await getCart();

  return <CartClient cart={cart} />;
}
