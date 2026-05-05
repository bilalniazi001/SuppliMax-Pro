import { Controller, Get, Patch, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get('admins')
  async getAllAdmins() {
    return await this.usersService.findAllAdmins();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    return await this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Patch(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { cnic: string; phone: string; newPassword: string }
  ) {
    try {
      return await this.usersService.changePassword(
        id,
        body.cnic,
        body.phone,
        body.newPassword
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
