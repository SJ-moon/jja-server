import * as bcrypt from 'bcrypt';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@app/user/user.service';
import { User } from '@app/user/user.entity';
import { loginResponse } from '@type/auth/auth.resp';
import { createAuthDto } from '@type/auth/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '@app/auth/auth.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async bcryptCompareUser(inputPassword: string, user: User): Promise<boolean> {
    const savedPassword = user.auth.password;
    const result = await bcrypt.compare(inputPassword, savedPassword);
    return result;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await this.bcryptCompareUser(password, user))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<loginResponse> {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async create(createAuthDto: createAuthDto): Promise<Auth> {
    const round = 10;
    const salt = await bcrypt.genSalt(round);
    const password = await bcrypt.hash(createAuthDto.password, salt);
    const authDto = {
      user: createAuthDto.user,
      password,
      salt,
    };
    const auth = await this.authRepository.create(authDto);
    try {
      return await this.authRepository.save(auth);
    } catch (e) {
      if (e instanceof QueryFailedError) return createAuthDto.user.auth;
      else throw e;
    }
  }
}
