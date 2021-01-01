import { Module } from '@nestjs/common';
import { UserController } from '@app/users/user.controller';
import { UserService } from '@app/users/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
