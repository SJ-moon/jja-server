import { Test, TestingModule } from '@nestjs/testing';
import { Auth } from '@app/auth/auth.entity';
import { AuthModule } from '@app/auth/auth.module';
import { AuthService } from '@app/auth/auth.service';
import { User } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import { UserController } from '@app/user/user.controller';
import { TestConnectionModule } from '@config/test/test.config';
import { QueryFailedError } from 'typeorm';

describe('AuthService', () => {
  let app: TestingModule;
  let service: UserService;
  let authService: AuthService;

  let email: string;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AuthModule, ...TestConnectionModule([User, Auth])],
      controllers: [UserController],
      providers: [UserService],
    }).compile();
    service = app.get<UserService>(UserService);
    authService = app.get<AuthService>(AuthService);
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

  it('update - Success', async () => {
    const user = await service.findOneByEmail(email);
    const updateUserDto = {
      password: 'newPassword',
      name: 'newName',
    };
    const updateResult = await service.update(user, updateUserDto);
    expect(updateResult.name).toBe(updateUserDto.name);
    const updatedUser = await authService.validateUser(
      email,
      updateUserDto.password,
    );
    expect(updatedUser).toBeInstanceOf(User);
  });
});
