import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      console.log(' Login API called:', loginDto.email);
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      console.error(' Login error:', error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('admin-login')
  async adminLogin(@Body() loginDto: { email: string; password: string }) {
    try {
      console.log(' Admin Login API called:', loginDto.email);
      return await this.authService.adminLogin(loginDto.email, loginDto.password);
    } catch (error) {
      console.error(' Admin login error:', error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    try {
      console.log(' Register API called:', registerDto.email);
      return await this.authService.register(registerDto);
    } catch (error) {
      console.error(' Register error:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //  Add endpoint to create admin user
  @Post('create-admin')
  async createAdmin() {
    try {
      console.log(' Creating admin user via API...');
      const admin = await this.usersService.createAdminUser();
      return {
        message: 'Admin user created successfully',
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role
        }
      };
    } catch (error) {
      console.error(' Create admin error:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //  Health check endpoint
  @Get('health')
  async healthCheck() {
    return {
      status: 'OK',
      message: 'Auth service is running',
      timestamp: new Date().toISOString()
    };
  }
}