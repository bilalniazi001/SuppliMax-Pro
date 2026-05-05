import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE } from '../db/db.module';
import * as schema from '../db/schema';
import { eq, desc, sql, ne } from 'drizzle-orm';
import { CreateOrderDto } from './dto/create-order.dto';
import * as crypto from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DRIZZLE) private db: MySql2Database<typeof schema>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      console.log('🔄 [BACKEND] Creating order for user:', createOrderDto.userId);
      
      const orderId = crypto.randomUUID();
      
      // 1. Create the order
      await this.db.insert(schema.orders).values({
        id: orderId,
        userId: createOrderDto.userId,
        totalAmount: createOrderDto.totalAmount,
        address: createOrderDto.address,
        phone: createOrderDto.phone,
        paymentMethod: createOrderDto.paymentMethod,
        status: 'Not Shipped',
      });

      // 2. Create the order items
      const orderItemsData = createOrderDto.items.map(item => ({
        id: crypto.randomUUID(),
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      await this.db.insert(schema.orderItems).values(orderItemsData);

      console.log('✅ [BACKEND] Order created successfully:', orderId);
      return await this.findById(orderId);
    } catch (error) {
      console.error('❌ [BACKEND] Detailed error creating order:', error);
      throw new BadRequestException(`Failed to create order: ${error.message}`);
    }
  }

  async findById(id: string) {
    const [order] = await this.db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
    if (!order) return null;

    // Fetch User details
    const [user] = await this.db.select({
      name: schema.users.name,
      email: schema.users.email,
    }).from(schema.users).where(eq(schema.users.id, order.userId)).limit(1);

    const items = await this.db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, id));
    const itemsWithProducts = await Promise.all(items.map(async (item) => {
      const [product] = await this.db.select().from(schema.products).where(eq(schema.products.id, item.productId)).limit(1);
      return { ...item, product };
    }));

    return { ...order, user, items: itemsWithProducts };
  }

  async findAllByUser(userId: string) {
    try {
      console.log('🔄 [BACKEND] Fetching orders for user:', userId);
      
      const userOrders = await this.db.select().from(schema.orders)
        .where(eq(schema.orders.userId, userId))
        .orderBy(desc(schema.orders.createdAt));
      
      const ordersWithItems = await Promise.all(userOrders.map(async (order) => {
        const items = await this.db.select().from(schema.orderItems)
          .where(eq(schema.orderItems.orderId, order.id));
        
        const itemsWithProducts = await Promise.all(items.map(async (item) => {
          const [product] = await this.db.select().from(schema.products)
            .where(eq(schema.products.id, item.productId)).limit(1);
          return { ...item, product };
        }));

        return { ...order, items: itemsWithProducts };
      }));

      return ordersWithItems;
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching user orders:', error);
      throw new BadRequestException('Failed to fetch orders');
    }
  }

  async updateStatus(id: string, status: string) {
    try {
      await this.db.update(schema.orders)
        .set({ status, updatedAt: new Date() })
        .where(eq(schema.orders.id, id));
      
      const updatedOrder = await this.findById(id);
      if (!updatedOrder) throw new NotFoundException('Order not found');
      return updatedOrder;
    } catch (error) {
      throw new BadRequestException(`Failed to update status: ${error.message}`);
    }
  }

  async submitFeedback(id: string, feedback: string) {
    try {
      await this.db.update(schema.orders)
        .set({ feedback, updatedAt: new Date() })
        .where(eq(schema.orders.id, id));
      
      const updatedOrder = await this.findById(id);
      if (!updatedOrder) throw new NotFoundException('Order not found');
      return updatedOrder;
    } catch (error) {
      throw new BadRequestException(`Failed to submit feedback: ${error.message}`);
    }
  }

  async findAll() {
    try {
      console.log('🔄 [BACKEND] Fetching all orders for admin');
      const allOrders = await this.db.select().from(schema.orders)
        .orderBy(desc(schema.orders.createdAt));
      
      const ordersWithDetails = await Promise.all(allOrders.map(async (order) => {
        // Fetch User details
        const [user] = await this.db.select({
          name: schema.users.name,
          email: schema.users.email,
        }).from(schema.users).where(eq(schema.users.id, order.userId)).limit(1);

        const items = await this.db.select().from(schema.orderItems)
          .where(eq(schema.orderItems.orderId, order.id));
        
        const itemsWithProducts = await Promise.all(items.map(async (item) => {
          const [product] = await this.db.select().from(schema.products)
            .where(eq(schema.products.id, item.productId)).limit(1);
          return { ...item, product };
        }));

        return { ...order, user, items: itemsWithProducts };
      }));

      return ordersWithDetails;
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching all orders:', error);
      throw new BadRequestException('Failed to fetch orders');
    }
  }

  async getDashboardStats() {
    try {
      console.log('📊 [BACKEND] Calculating dashboard stats...');
      
      // 1. Total Revenue (Delivered orders)
      const revenueResult = await this.db.select({
        total: sql<number>`sum(totalAmount)`
      })
      .from(schema.orders)
      .where(eq(schema.orders.status, 'Delivered'));
      const totalRevenue = revenueResult[0]?.total || 0;

      // 2. New Orders (Count of orders NOT Delivered)
      const newOrdersResult = await this.db.select({
        count: sql<number>`count(*)`
      })
      .from(schema.orders)
      .where(ne(schema.orders.status, 'Delivered'));
      const newOrdersCount = newOrdersResult[0]?.count || 0;

      // 3. Total Products
      const productsResult = await this.db.select({
        count: sql<number>`count(*)`
      }).from(schema.products);
      const totalProducts = productsResult[0]?.count || 0;

      // 4. Active Users (Customers)
      const usersResult = await this.db.select({
        count: sql<number>`count(*)`
      }).from(schema.users)
      .where(eq(schema.users.role, 'user'));
      const activeUsers = usersResult[0]?.count || 0;

      // 5. Recent Orders (Latest 5)
      const allOrders = await this.findAll();
      const recentOrders = allOrders.slice(0, 5);

      // 6. Stock Status (5 products with lowest stock)
      const stockStatus = await this.db.select()
        .from(schema.products)
        .orderBy(schema.products.quantityInStock)
        .limit(5);

      return {
        totalRevenue,
        newOrdersCount,
        totalProducts,
        activeUsers,
        recentOrders,
        stockStatus
      };
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching dashboard stats:', error);
      throw new BadRequestException(`Failed to fetch dashboard stats: ${error.message}`);
    }
  }

  async getAdvancedDashboardStats() {
    try {
      console.log('📊 [BACKEND] Calculating ADVANCED dashboard stats...');

      // 1. Weekly Sales Trend (Last 7 days)
      const weeklySales = await this.db.select({
        day: sql<string>`DATE_FORMAT(createdAt, '%a')`,
        date: sql<string>`DATE(createdAt)`,
        revenue: sql<number>`sum(totalAmount)`
      })
      .from(schema.orders)
      .where(sql`createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
      .groupBy(sql`DATE(createdAt)`, sql`DATE_FORMAT(createdAt, '%a')`)
      .orderBy(sql`DATE(createdAt)`);

      // 2. Order Statistics (Doughnut Chart)
      const orderStats = await this.db.select({
        status: schema.orders.status,
        count: sql<number>`count(*)`
      })
      .from(schema.orders)
      .groupBy(schema.orders.status);

      // 3. Top 5 Popular Products
      const topProducts = await this.db.select({
        id: schema.products.id,
        name: schema.products.name,
        category: schema.products.category,
        imageUrl: schema.products.imageUrl,
        price: schema.products.price,
        totalSold: sql<number>`sum(${schema.orderItems.quantity})`
      })
      .from(schema.orderItems)
      .innerJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
      .groupBy(schema.products.id)
      .orderBy(desc(sql`sum(${schema.orderItems.quantity})`))
      .limit(5);

      // 4. Monthly Revenue Report (Current Year)
      const monthlyRevenue = await this.db.select({
        month: sql<string>`DATE_FORMAT(createdAt, '%b')`,
        revenue: sql<number>`sum(totalAmount)`
      })
      .from(schema.orders)
      .where(sql`YEAR(createdAt) = YEAR(NOW())`)
      .groupBy(sql`MONTH(createdAt)`, sql`DATE_FORMAT(createdAt, '%b')`)
      .orderBy(sql`MONTH(createdAt)`);

      // 5. Basic stats for cards
      const [stats] = await this.db.select({
        totalRevenue: sql<number>`sum(case when status = 'Delivered' then totalAmount else 0 end)`,
        totalOrders: sql<number>`count(*)`,
        totalProducts: sql<number>`(select count(*) from products)`,
        totalUsers: sql<number>`(select count(*) from users where role = 'user')`
      }).from(schema.orders);

      // 6. Recent Transactions
      const recentOrders = await this.findAll();

      return {
        cards: {
          revenue: stats.totalRevenue || 0,
          orders: stats.totalOrders || 0,
          products: stats.totalProducts || 0,
          users: stats.totalUsers || 0
        },
        weeklySales,
        orderStats,
        topProducts,
        monthlyRevenue,
        recentOrders: recentOrders.slice(0, 6)
      };
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching advanced stats:', error);
      throw new BadRequestException(`Failed to fetch advanced stats: ${error.message}`);
    }
  }
}
