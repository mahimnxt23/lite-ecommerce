"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { carts, cartItems } from "@/lib/db/schema";
import { getCurrentUser, guestSession } from "@/lib/auth/actions";
import { revalidatePath } from "next/cache";

const addCartItemSchema = z.object({
  productVariantId: z.string().uuid(),
  quantity: z.number().min(1),
});

const updateCartItemSchema = z.object({
  cartItemId: z.string().uuid(),
  quantity: z.number().min(1),
});

const removeCartItemSchema = z.object({
  cartItemId: z.string().uuid(),
});

export async function getCart() {
  const user = await getCurrentUser();
  const { sessionToken: guestToken } = await guestSession();

  if (!user && !guestToken) {
    return [];
  }

  const cart = await db.query.carts.findFirst({
    where: user ? eq(carts.userId, user.id) : eq(carts.guestId, guestToken as string),
    with: {
      items: {
        with: {
          variant: {
            with: {
              product: true,
              color: true,
              size: true,
            },
          },
        },
      },
    },
  });

  return cart?.items ?? [];
}

export async function addCartItem(input: z.infer<typeof addCartItemSchema>) {
  const { productVariantId, quantity } = addCartItemSchema.parse(input);

  const user = await getCurrentUser();
  const { sessionToken: guestToken } = await guestSession();

  if (!user && !guestToken) {
    throw new Error("User or guest session not found");
  }

  let cart = await db.query.carts.findFirst({
    where: user ? eq(carts.userId, user.id) : eq(carts.guestId, guestToken as string),
  });

  if (!cart) {
    cart = (
      await db
        .insert(carts)
        .values(user ? { userId: user.id } : { guestId: guestToken as string })
        .returning()
    )[0];
  }

  const existingCartItem = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cart.id), eq(cartItems.productVariantId, productVariantId)),
  });

  if (existingCartItem) {
    await db
      .update(cartItems)
      .set({ quantity: existingCartItem.quantity + quantity })
      .where(eq(cartItems.id, existingCartItem.id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      productVariantId,
      quantity,
    });
  }

  revalidatePath("/cart");
}

export async function updateCartItem(input: z.infer<typeof updateCartItemSchema>) {
  const { cartItemId, quantity } = updateCartItemSchema.parse(input);

  await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, cartItemId));

  revalidatePath("/cart");
}

export async function removeCartItem(input: z.infer<typeof removeCartItemSchema>) {
  const { cartItemId } = removeCartItemSchema.parse(input);

  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));

  revalidatePath("/cart");
}

export async function clearCart() {
    const user = await getCurrentUser();
    const { sessionToken: guestToken } = await guestSession();

    if (!user && !guestToken) {
        return;
    }

    const cart = await db.query.carts.findFirst({
        where: user ? eq(carts.userId, user.id) : eq(carts.guestId, guestToken as string),
    });

    if (!cart) {
        return;
    }

    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    revalidatePath("/cart");
}
