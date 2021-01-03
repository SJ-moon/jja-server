import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@app/auth/auth.controller';
import { AuthService } from '@app/auth/auth.service';
import { LocalStrategy } from '@app/auth/local.strategy';
import { UserService } from '@app/user/user.service';
import { jwtConstants } from '@constant/jwt.constant';
import { UserModule } from '@app/user/user.module';
import { User } from '@app/user/user.entity';
import { Auth } from '@app/auth/auth.entity';
import { TestConnectionModule } from '@config/test/test.config';

describe('AuthService', () => {
  let app: TestingModule;
  let service: AuthService;

  let salt: string;
  let auth: Auth;
  let user: User;

  beforeAll(async () => {
    app = await Test.createTestingModule({
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
      providers: [AuthService, UserService, LocalStrategy],
    }).compile();
    service = app.get<AuthService>(AuthService);

    salt = await bcrypt.genSalt();
    auth = {
      id: 1,
      password: 'password',
      salt: salt,
      user: {} as any,
    };
    user = {
      id: 1,
      email: 'any@email.com',
      auth: auth,
    };
    auth.user = user;
  });

  it('bcryptCompareUser - Success', async () => {
    const result = await service.bcryptCompareUser('password', user);
    expect(result).toBe(true);
  });

  it('bcryptCompareUser - Fail', async () => {
    const result = await service.bcryptCompareUser('wrong_password', user);
    expect(result).toBe(false);
  });

  // it('validateUser - Success', async () => {
  //   const result = await service.validateUser(user.email, auth.password);
  //   console.log(result);
  // });

  it('login', async () => {
    const result = await service.login(user);
    expect(Object.keys(result).toString()).toBe('access_token');
  });
});
