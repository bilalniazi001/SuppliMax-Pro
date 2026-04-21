import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../../db/db.module';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
  ) {}

  async findByEmail(email: string) {
    console.log('🔍 Searching user by email:', email);
    const [user] = await this.db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    console.log('📋 User found:', user ? user.email : 'None');
    return user;
  }

  async create(userData: any) {
    console.log('➕ Creating new user:', userData.email);
    const [newUser] = await this.db.insert(schema.users).values(userData).returning();
    return newUser;
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
}