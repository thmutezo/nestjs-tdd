import {
  Body,
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './../users/entities/user.entity';
import { LocalAuthGuard } from '../guards/local_auth.guard';
import { JwtAuthGuard } from '../guards/jwt_auth.guard';
import { Public } from './../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request: any): Promise<any> {
    return await this.authService.login(request.user);
  }
  // async login(@Body() loginCredentials: Partial<User>) {
  //   return this.authService.validateUser(loginCredentials);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await req.user;
  }
}
