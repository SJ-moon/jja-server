import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@app/user/user.service';
import { User } from '@app/user/user.entity';
import { loginResponseType } from '@type/auth/auth.resp';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async bcryptCompareUser(inputPassword: string, user: User): Promise<boolean> {
    const salt = user.auth.salt;
    const savedPassword = user.auth.password;
    const hash = await bcrypt.hash(inputPassword, salt);
    return await bcrypt.compare(savedPassword, hash);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await this.bcryptCompareUser(password, user))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<loginResponseType> {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
