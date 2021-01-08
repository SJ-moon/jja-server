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

describe('AuthService', () => {
  let app: TestingModule;
  let service: AuthService;
  let userService: UserService;

  let user: User;
  let password: string;

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
      providers: [AuthService, LocalStrategy],
    }).compile();
    service = app.get<AuthService>(AuthService);
    userService = app.get<UserService>(UserService);

    password = 'password';
    const email = 'test@email.com';
    await userService.create({
      email: email,
      name: 'name',
      password: password,
    });
    user = await userService.findOneByEmail(email);
  });

  it('bcryptCompareUser - Success', async () => {
    const result = await service.bcryptCompareUser('password', user);
    expect(result).toBe(true);
  });

  it('bcryptCompareUser - Fail', async () => {
    const result = await service.bcryptCompareUser('wrong_password', user);
    expect(result).toBe(false);
  });

  it('validateUser - Success', async () => {
    const result = await service.validateUser(user.email, password);
    expect(result).toBeInstanceOf(User);
  });

  it('validateUser - Fail', async () => {
    const result = await service.validateUser('no@email.com', password);
    expect(result).toBeNull();
  });

  it('login - Success', async () => {
    const result = await service.login(user);
    expect(Object.keys(result).toString()).toBe('access_token');
  });

  it('create - Success', async () => {
    // pass - test on user service
  });

  it('create - Success (constraint failure avoidance)', async () => {
    const result = await service.create({
      user: user,
      password: 'password',
    });
    expect(result).toBeInstanceOf(Auth);
  });

  it('password modify - Success', async () => {
    const result = await service.pwModify({
      email: user.email,
      current_password: password,
      new_password: 'password',
    });
    expect(result).toEqual(true);
  });

  it('password modify - Fail (wrong current password', async () => {
    const result = await service.pwModify({
      email: user.email,
      current_password: 'wrong_password',
      new_password: 'password',
    });
    expect(result).toEqual(false);
  });
});
