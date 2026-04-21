import { pgTable, text, integer, doublePrecision, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('user').notNull(),
  age: integer('age'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  country: text('country'),
  postalCode: text('postal_code'),
  nationality: text('nationality'),
  cnic: text('cnic'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey(), // Using text because it was a random string in MongoDB
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: doublePrecision('price').notNull(),
  rating: doublePrecision('rating').notNull(),
  imageUrl: text('image_url').notNull(),
  description: text('description').notNull(),
  cost: doublePrecision('cost').notNull(),
  quantityInStock: integer('quantity_in_stock').notNull(),
  size: text('size').default('One Size'),
  color: text('color').default(''),
  onSale: boolean('on_sale').default(false),
  discountPercentage: integer('discount_percentage').default(0),
  isNewArrival: boolean('is_new_arrival').default(false),
  isInStock: boolean('is_in_stock').default(true),
  isFeatured: boolean('is_featured').default(false),
  isExclusive: boolean('is_exclusive').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
