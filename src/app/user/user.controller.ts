import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { createUserDto } from '@type/user/user.dto';
import { generalUserResponse } from '@type/user/user.resp';
import { QueryFailedError } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: createUserDto,
  ): Promise<generalUserResponse> {
    try {
      return await this.userService.create(createUserDto);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BadRequestException();
      }
      throw e;
    }
  }
}
