import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('🔐 Login attempt for:', normalizedEmail);

    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      console.log('❌ User not found:', normalizedEmail);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('📧 User found:', user.email);
    console.log('🔑 Password check - Input:', password, 'Stored:', user.password);

    // ✅ SIMPLE PASSWORD CHECK - No hashing
    if (password !== user.password) {
      console.log('❌ Password mismatch for user:', normalizedEmail);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('✅ Login successful for user:', normalizedEmail, 'Role:', user.role);

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return {
      message: 'Login successful',
      user: {
        ...user,
        password: undefined // Security: don't send password
      },
      token: this.jwtService.sign(payload),
    };
  }

  async adminLogin(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('👑 Admin login attempt for:', normalizedEmail);

    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      console.log('❌ Admin user not found:', normalizedEmail);
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
      console.log('❌ Admin password mismatch for:', normalizedEmail);
      throw new UnauthorizedException('Invalid admin credentials');
    }

    console.log('✅ Admin login successful for:', normalizedEmail);

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return {
      message: 'Admin login successful',
      user: {
        ...user,
        password: undefined // Security: don't send password
      },
      token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any) {
    const normalizedEmail = userData.email.trim().toLowerCase();
    console.log(' Registration attempt for:', normalizedEmail);

    const existingUser = await this.usersService.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // ✅ NO PASSWORD HASHING - Store plain password
    console.log('📡 Saving new user to database:', normalizedEmail);
    const newUser = await this.usersService.create({
      ...userData,
      email: normalizedEmail,
      role: userData.role || 'user', // Use provided role or default to 'user'
    });
    console.log('✅ User created successfully with ID:', newUser.id);

    const payload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    };

    return {
      message: 'User registered successfully',
      user: {
        ...newUser,
        password: undefined // Security: don't send password
      },
      token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(googleToken: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new BadRequestException('Google Client ID not configured on server.');
    }

    const client = new OAuth2Client(clientId);
    let payload: any;

    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch (err) {
      throw new UnauthorizedException('Invalid Google token');
    }

    if (!payload || !payload.email) {
      throw new UnauthorizedException('Could not get email from Google token');
    }

    const normalizedEmail = payload.email.toLowerCase();
    let user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      // Auto-register the Google user
      console.log('🆕 Auto-registering Google user:', normalizedEmail);
      user = await this.usersService.create({
        name: payload.name || 'Google User',
        email: normalizedEmail,
        password: `google_oauth_${Date.now()}`, // Placeholder, not used for Google login
        role: 'user',
        age: 0,
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        nationality: '',
        cnic: '',
      });
    }

    console.log('✅ Google login successful for:', normalizedEmail);

    const jwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'Google login successful',
      user: {
        ...user,
        password: undefined,
      },
      token: this.jwtService.sign(jwtPayload),
    };
  }

  async googleAccessLogin(googleData: { access_token: string; email: string; name: string; sub: string }) {
    if (!googleData.email) {
      throw new UnauthorizedException('No email received from Google');
    }

    const normalizedEmail = googleData.email.toLowerCase();
    let user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      console.log('🆕 Auto-registering Google user (access token flow):', normalizedEmail);
      user = await this.usersService.create({
        name: googleData.name || 'Google User',
        email: normalizedEmail,
        password: `google_oauth_${googleData.sub}`,
        role: 'user',
        age: 0,
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        nationality: '',
        cnic: '',
      });
    }

    console.log('✅ Google access login successful for:', normalizedEmail);

    const jwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'Google login successful',
      user: { ...user, password: undefined },
      token: this.jwtService.sign(jwtPayload),
    };
  }
}