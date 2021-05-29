import { Injectable } from '@nestjs/common';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User>> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
    // throw new HttpException(
    //   'Login failed. Username or Password is wrong',
    //   HttpStatus.NOT_FOUND,
    // );
    //throw error of no login instead of returning nul. Write test for this
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: { _id: user._id, admin: true },
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
