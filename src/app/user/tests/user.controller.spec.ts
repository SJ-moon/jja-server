import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { User } from '@app/user/user.entity';
import { Auth } from '@app/auth/auth.entity';
import { UserController } from '@app/user/user.controller';
import { AuthModule } from '@app/auth/auth.module';
import { TestConnectionModule } from '@config/test/test.config';

describe('UserController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AuthModule, ...TestConnectionModule([User, Auth])],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/v1/user', () => {
    it('create - Success', async () => {
      const data = {
        email: 'any@email.com',
        password: 'password',
        name: 'name',
      };
      return await request(app.getHttpServer())
        .post('/user')
        .send(data)
        .expect(HttpStatus.CREATED);
    });

    it('create - Fail (duplicated)', async () => {
      const data = {
        email: 'any@email.com',
        password: 'password',
        name: 'name',
      };
      return await request(app.getHttpServer())
        .post('/user')
        .send(data)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
