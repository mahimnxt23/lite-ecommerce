"use server";

import {cookies, headers} from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { guests, carts, cartItems } from "@/lib/db/schema/index";
import { and, eq, lt } from "drizzle-orm";
import { randomUUID } from "crypto";

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(128);
const nameSchema = z.string().min(1).max(100);

export async function createGuestSession() {
  const cookieStore = await cookies();
  const existing = (await cookieStore).get("guest_session");
  if (existing?.value) {
    return { ok: true, sessionToken: existing.value };
  }

  const sessionToken = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + COOKIE_OPTIONS.maxAge * 1000);

  await db.insert(guests).values({
    sessionToken,
    expiresAt,
  });

  (await cookieStore).set("guest_session", sessionToken, COOKIE_OPTIONS);
  return { ok: true, sessionToken };
}

export async function guestSession() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("guest_session")?.value;
  if (!token) {
    return { sessionToken: null };
  }
  const now = new Date();
  await db
    .delete(guests)
    .where(and(eq(guests.sessionToken, token), lt(guests.expiresAt, now)));

  return { sessionToken: token };
}

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export async function signUp(formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const data = signUpSchema.parse(rawData);

  const res = await auth.api.signUpEmail({
    body: {
      email: data.email,
      password: data.password,
      name: data.name,
    },
  });

  await migrateGuestToUser();
  return { ok: true, userId: res.user?.id };
}

const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function signIn(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const data = signInSchema.parse(rawData);

  const res = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
  });

  await migrateGuestToUser();
  return { ok: true, userId: res.user?.id };
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    return session?.user ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function signOut() {
  await auth.api.signOut({ headers: {} });
  return { ok: true };
}

export async function mergeGuestCartWithUserCart() {
  await migrateGuestToUser();
  return { ok: true };
}

async function migrateGuestToUser() {
  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_session")?.value;

  if (!guestToken) return;

  const user = await getCurrentUser();
  if (!user) return;

  const guestCart = await db.query.carts.findFirst({
    where: eq(carts.guestId, guestToken),
    with: { items: true },
  });

  if (!guestCart) return;

  const userCart = await db.query.carts.findFirst({
    where: eq(carts.userId, user.id),
  });

  if (!userCart) {
    await db
      .update(carts)
      .set({ userId: user.id, guestId: null })
      .where(eq(carts.id, guestCart.id));
  } else {
    for (const guestItem of guestCart.items) {
      const userCartItem = await db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.cartId, userCart.id),
          eq(cartItems.productVariantId, guestItem.productVariantId)
        ),
      });

      if (userCartItem) {
        await db
          .update(cartItems)
          .set({ quantity: userCartItem.quantity + guestItem.quantity })
          .where(eq(cartItems.id, userCartItem.id));
      } else {
        await db.insert(cartItems).values({
          cartId: userCart.id,
          productVariantId: guestItem.productVariantId,
          quantity: guestItem.quantity,
        });
      }
    }
    await db.delete(carts).where(eq(carts.id, guestCart.id));
  }

  await db.delete(guests).where(eq(guests.sessionToken, guestToken));
  cookieStore.delete("guest_session");
}
