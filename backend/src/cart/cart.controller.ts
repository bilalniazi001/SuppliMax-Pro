import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post(':userId')
  addToCart(
    @Param('userId') userId: string,
    @Body() body: { productId: string; quantity: number }
  ) {
    return this.cartService.addToCart(userId, body.productId, body.quantity);
  }

  @Put(':userId')
  updateQuantity(
    @Param('userId') userId: string,
    @Body() body: { productId: string; quantity: number }
  ) {
    return this.cartService.updateQuantity(userId, body.productId, body.quantity);
  }

  @Delete(':userId/:productId')
  removeFromCart(
    @Param('userId') userId: string,
    @Param('productId') productId: string
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Delete(':userId')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
