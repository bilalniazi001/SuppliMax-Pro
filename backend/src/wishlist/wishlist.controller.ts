import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get(':userId')
  getWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post(':userId')
  addToWishlist(
    @Param('userId') userId: string,
    @Body() body: { productId: string }
  ) {
    return this.wishlistService.addToWishlist(userId, body.productId);
  }

  @Delete(':userId/:productId')
  removeFromWishlist(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }
}
