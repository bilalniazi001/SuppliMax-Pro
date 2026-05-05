import { Controller, Get, Post, Body, Param, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.ordersService.getDashboardStats();
  }

  @Get('dashboard/advanced')
  getAdvancedDashboardStats() {
    return this.ordersService.getAdvancedDashboardStats();
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.ordersService.findAllByUser(userId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/feedback')
  submitFeedback(@Param('id') id: string, @Body('feedback') feedback: string) {
    return this.ordersService.submitFeedback(id, feedback);
  }
}
