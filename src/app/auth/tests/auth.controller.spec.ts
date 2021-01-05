import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { LocalStrategy } from '@app/auth/strategies/local.strategy';
import { jwtConstants } from '@constant/jwt.constant';
import { UserModule } from '@app/user/user.module';
import { User } from '@app/user/user.entity';
import { Auth } from '@app/auth/auth.entity';
import { TestConnectionModule } from '@config/test/test.config';
import { UserService } from '@app/user/user.service';

describe('AuthController', () => {
  let app: INestApplication;
  let userService: UserService;
  let user: User;
  let password: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
        ...TestConnectionModule([User, Auth]),
      ],
      controllers: [AuthController],
      providers: [AuthService, LocalStrategy],
    }).compile();
    userService = moduleFixture.get<UserService>(UserService);

    password = 'password';
    const email = 'test@email.com';
    await userService.create({
      email: email,
      name: 'name',
      password: password,
    });
    user = await userService.findOneByEmail(email);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/v1/auth/login', () => {
    it('login - Fail', async () => {
      const data = {
        email: 'any@email.com',
        password: 'password',
      };
      return await request(app.getHttpServer())
        .post('/auth/login')
        .send(data)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/api/v1/auth/pwmodify', () => {
    it('without JWT', async () => {
      const data = {
        email: user.email,
        current_password: password,
        new_password: 'password',
      };
      return await request(app.getHttpServer())
        .patch('/auth/pwmodify')
        .send(data)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
