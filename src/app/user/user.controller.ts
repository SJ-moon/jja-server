import { Controller, Get } from '@nestjs/common';
import { UserService } from '@app/users/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
}
