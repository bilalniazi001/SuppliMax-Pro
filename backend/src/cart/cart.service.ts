import { Injectable, Inject } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE } from '../db/db.module';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';
import * as crypto from 'crypto';

@Injectable()
export class CartService {
  constructor(
    @Inject(DRIZZLE) private db: MySql2Database<typeof schema>,
  ) {}

  async getCart(userId: string) {
    return await this.db.select().from(schema.cartItems)
      .where(eq(schema.cartItems.userId, userId));
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    // Check if item already exists
    const [existing] = await this.db.select().from(schema.cartItems)
      .where(and(
        eq(schema.cartItems.userId, userId),
        eq(schema.cartItems.productId, productId)
      )).limit(1);

    if (existing) {
      await this.db.update(schema.cartItems)
        .set({ quantity: existing.quantity + quantity, updatedAt: new Date() })
        .where(eq(schema.cartItems.id, existing.id));
      return { success: true };
    }

    await this.db.insert(schema.cartItems).values({
      id: crypto.randomUUID(),
      userId,
      productId,
      quantity,
    });
    return { success: true };
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    await this.db.update(schema.cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(and(
        eq(schema.cartItems.userId, userId),
        eq(schema.cartItems.productId, productId)
      ));
    return { success: true };
  }

  async removeFromCart(userId: string, productId: string) {
    await this.db.delete(schema.cartItems)
      .where(and(
        eq(schema.cartItems.userId, userId),
        eq(schema.cartItems.productId, productId)
      ));
    return { success: true };
  }

  async clearCart(userId: string) {
    await this.db.delete(schema.cartItems)
      .where(eq(schema.cartItems.userId, userId));
    return { success: true };
  }
}
