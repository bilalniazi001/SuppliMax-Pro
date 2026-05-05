import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq, sql } from 'drizzle-orm';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private db: MySql2Database<typeof schema>,
  ) {}

  async findByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('🔍 Searching user by email (case-insensitive):', normalizedEmail);
    const [user] = await this.db.select().from(schema.users).where(eq(sql`LOWER(${schema.users.email})`, normalizedEmail)).limit(1);
    console.log('📋 User found:', user ? user.email : 'None');
    return user;
  }

  async create(userData: any) {
    console.log('➕ Creating new user:', userData.email);
    const userId = userData.id || crypto.randomUUID();
    await this.db.insert(schema.users).values({
      ...userData,
      id: userId,
    });
    return await this.findByEmail(userData.email);
  }

  async findById(id: string) {
    const [user] = await this.db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return user;
  }

  async createAdminUser() {
    const adminData = {
      name: "Admin User",
      email: "admin@supplimax.com",
      password: "admin123",
      role: "admin",
      age: 30,
      phone: "+923001234567",
      address: "123 Admin Street, Lahore",
      city: "Lahore",
      country: "Pakistan",
      postalCode: "54000",
      nationality: "Pakistani",
      cnic: "12345-6789012-3"
    };

    const existingAdmin = await this.findByEmail(adminData.email);
    if (!existingAdmin) {
      console.log('👑 Creating admin user...');
      return await this.create(adminData);
    }
    console.log('👑 Admin user already exists');
    return existingAdmin;
  }

  async findAll() {
    try {
      console.log('👥 Fetching all users...');
      return await this.db.select().from(schema.users);
    } catch (error) {
      console.error('❌ [BACKEND] Error fetching all users:', error);
      throw new BadRequestException(`Failed to fetch users: ${error.message}`);
    }
  }

  async findAllAdmins() {
    console.log('👥 Fetching all admin users...');
    return await this.db.select().from(schema.users).where(eq(schema.users.role, 'admin'));
  }

  async update(id: string, data: any) {
    console.log('📝 Updating user:', id);
    await this.db
      .update(schema.users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.users.id, id));
    return await this.findById(id);
  }

  async delete(id: string) {
    console.log('🗑️ Deleting user:', id);
    return await this.db.delete(schema.users).where(eq(schema.users.id, id));
  }

  async changePassword(id: string, cnic: string, phone: string, newPassword: string) {
    console.log('🔐 Change password request for user:', id);
    
    // Verify CNIC and Phone
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    if (!user) throw new Error('User not found');
    
    if (user.cnic !== cnic || user.phone !== phone) {
      throw new Error('Verification failed. CNIC or Phone number is incorrect.');
    }

    await this.db
      .update(schema.users)
      .set({ password: newPassword, updatedAt: new Date() })
      .where(eq(schema.users.id, id));
      
    return await this.findById(id);
  }
}