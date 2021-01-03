import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';

describe('UserController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();
  });
});
