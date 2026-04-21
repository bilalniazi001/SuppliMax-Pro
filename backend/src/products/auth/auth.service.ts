import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    console.log('🔐 Login attempt for:', email);
    
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      console.log('❌ User not found:', email);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('📧 User found:', user.email);
    console.log('🔑 Password check - Input:', password, 'Stored:', user.password);

    // ✅ SIMPLE PASSWORD CHECK - No hashing
    if (password !== user.password) {
      console.log('❌ Password mismatch');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('✅ Login successful for:', email);

    const payload = { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async adminLogin(email: string, password: string) {
    console.log('👑 Admin login attempt for:', email);
    
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      console.log('❌ Admin user not found:', email);
      throw new UnauthorizedException('Invalid admin credentials');
    }

    console.log('📧 Admin user found - Role:', user.role);
    
    // ✅ Check if user is admin
    if (user.role !== 'admin') {
      console.log('❌ User is not admin. Role:', user.role);
      throw new UnauthorizedException('Admin access required');
    }

    console.log('🔑 Admin password check - Input:', password, 'Stored:', user.password);

    // ✅ SIMPLE PASSWORD CHECK - No hashing
    if (password !== user.password) {
      console.log('❌ Admin password mismatch');
      throw new UnauthorizedException('Invalid admin credentials');
    }

    console.log('✅ Admin login successful for:', email);

    const payload = { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      message: 'Admin login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any) {
    console.log('📝 Registration attempt for:', userData.email);
    
    const existingUser = await this.usersService.findByEmail(userData.email);
    
    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // ✅ NO PASSWORD HASHING - Store plain password
    const newUser = await this.usersService.create({
      ...userData,
      role: 'user', // Default role
    });

    const payload = { 
      userId: newUser.id, 
      email: newUser.email, 
      role: newUser.role 
    };

    return {
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token: this.jwtService.sign(payload),
    };
  }
}