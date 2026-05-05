import { Injectable, Inject } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE } from '../db/db.module';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';
import * as crypto from 'crypto';

@Injectable()
export class WishlistService {
  constructor(
    @Inject(DRIZZLE) private db: MySql2Database<typeof schema>,
  ) {}

  async getWishlist(userId: string) {
    return await this.db.select().from(schema.wishlistItems)
      .where(eq(schema.wishlistItems.userId, userId));
  }

  async addToWishlist(userId: string, productId: string) {
    const [existing] = await this.db.select().from(schema.wishlistItems)
      .where(and(
        eq(schema.wishlistItems.userId, userId),
        eq(schema.wishlistItems.productId, productId)
      )).limit(1);

    if (existing) return existing;

    const id = crypto.randomUUID();
    await this.db.insert(schema.wishlistItems).values({
      id,
      userId,
      productId,
    });
    
    const [newItem] = await this.db.select().from(schema.wishlistItems).where(eq(schema.wishlistItems.id, id)).limit(1);
    return newItem;
  }

  async removeFromWishlist(userId: string, productId: string) {
    await this.db.delete(schema.wishlistItems)
      .where(and(
        eq(schema.wishlistItems.userId, userId),
        eq(schema.wishlistItems.productId, productId)
      ));
    return { success: true };
  }
}
