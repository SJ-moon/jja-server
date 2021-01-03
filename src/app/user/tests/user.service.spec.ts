import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { LocalStrategy } from '@app/auth/strategies/local.strategy';
import { Auth } from '@app/auth/auth.entity';
import { UserModule } from '@app/user/user.module';
import { User } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import { jwtConstants } from '@constant/jwt.constant';
import { TestConnectionModule } from '@config/test/test.config';
import { AuthModule } from '@app/auth/auth.module';
import { UserController } from '../user.controller';
import { generalUserResponse } from '@type/user/user.resp';
import { QueryFailedError } from 'typeorm';

describe('AuthService', () => {
  let app: TestingModule;
  let service: UserService;

  let email: string;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AuthModule, ...TestConnectionModule([User, Auth])],
      controllers: [UserController],
      providers: [UserService],
    }).compile();
    service = app.get<UserService>(UserService);
    email = 'any@email.com';
  });

  it('create - Success', async () => {
    const result = await service.create({
      email: email,
      name: 'name',
      password: 'password',
    });
    expect(result).toBeInstanceOf(User);
    expect(result).toMatchObject({
      id: 1,
      email: email,
      name: 'name',
    });
  });

  it('create - Fail (duplicated)', async () => {
    try {
      await service.create({
        email: email,
        name: 'name',
        password: 'password',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(QueryFailedError);
    }
  });

  it('findOneByEmail - Success', async () => {
    const result = await service.findOneByEmail(email);
    expect(result).toBeInstanceOf(User);
  });

  it('findOneByEmail - Fail', async () => {
    const result = await service.findOneByEmail('other@email.com');
    expect(result).toBe(undefined);
  });
});
