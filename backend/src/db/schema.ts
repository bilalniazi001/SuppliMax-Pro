import { mysqlTable, varchar, text, int, double, boolean, timestamp } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  age: int('age'),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  postalCode: varchar('postalCode', { length: 50 }),
  nationality: varchar('nationality', { length: 100 }),
  cnic: varchar('cnic', { length: 50 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable('products', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  price: double('price').notNull(),
  rating: double('rating').notNull(),
  imageUrl: text('imageUrl').notNull(),
  description: text('description').notNull(),
  cost: double('cost').notNull(),
  quantityInStock: int('quantityInStock').notNull(),
  size: varchar('size', { length: 50 }).default('One Size'),
  color: varchar('color', { length: 50 }).default(''),
  onSale: boolean('onSale').default(false),
  discountPercentage: int('discountPercentage').default(0),
  isNewArrival: boolean('isNewArrival').default(false),
  isInStock: boolean('isInStock').default(true),
  isFeatured: boolean('isFeatured').default(false),
  isExclusive: boolean('isExclusive').default(false),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('userId', { length: 36 }).references(() => users.id).notNull(),
  totalAmount: double('totalAmount').notNull(),
  status: varchar('status', { length: 50 }).default('Not Shipped').notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  paymentMethod: varchar('paymentMethod', { length: 50 }).default('Cash on Delivery').notNull(),
  feedback: text('feedback'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('orderId', { length: 36 }).references(() => orders.id).notNull(),
  productId: varchar('productId', { length: 255 }).references(() => products.id).notNull(),
  quantity: int('quantity').notNull(),
  price: double('price').notNull(),
});

export const cartItems = mysqlTable('cart_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('userId', { length: 36 }).references(() => users.id).notNull(),
  productId: varchar('productId', { length: 255 }).references(() => products.id).notNull(),
  quantity: int('quantity').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export const wishlistItems = mysqlTable('wishlist_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('userId', { length: 36 }).references(() => users.id).notNull(),
  productId: varchar('productId', { length: 255 }).references(() => products.id).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
