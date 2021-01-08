import { Test, TestingModule } from '@nestjs/testing';
import { Auth } from '@app/auth/auth.entity';
import { User } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import { TestConnectionModule } from '@config/test/test.config';
import { AuthModule } from '@app/auth/auth.module';
import { UserController } from '../user.controller';
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

  it('findAll - Fail', async () => {
    const allList = await service.findAll();
    expect(allList).toStrictEqual([]);
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

  it('findAll - Success', async () => {
    const account1 = await service.create({
      email: 'abc@gmail.com',
      name: 'test1',
      password: 'password1',
    });
    const account2 = await service.create({
      email: 'efg@gmail.com',
      name: 'test2',
      password: 'password2',
    });

    const userList = await service.findAll();
    expect(userList).toBeInstanceOf(Array);
    expect(userList).toMatchObject([
      {
        id: 1,
        email: email,
        name: 'name',
      },
      {
        id: 2,
        email: 'abc@gmail.com',
        name: 'test1',
      },
      {
        id: 3,
        email: 'efg@gmail.com',
        name: 'test2',
      },
    ]);
  });

  it('findOne - Success', async () => {
    const findUser = await service.findOne('abc@gmail.com');
    expect(findUser).toBeInstanceOf(User);
    expect(findUser).toMatchObject({
      id: 2,
      email: 'abc@gmail.com',
      name: 'test1',
    });
  });

  it('findOne - Fail', async () => {
    try {
      await service.findOne('bbb@gmail.com');
    } catch (e) {
      expect(e).toBe(undefined);
    }
  });

  it('Delete - Success', async () => {
    const deleteUser = await service.deleteUser('abc@gmail.com');
    expect(deleteUser).toBeInstanceOf(User);
    expect(deleteUser).toMatchObject({
      id: 2,
      email: 'abc@gmail.com',
      name: 'test1',
    });
  });

  it('Delete  - Fail', async () => {
    try {
      await service.deleteUser('fff@gmail.com');
    } catch (e) {
      expect(e).toBe(undefined);
    }
  });
});
