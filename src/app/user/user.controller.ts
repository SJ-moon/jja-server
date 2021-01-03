import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import { createUserDto } from '@type/user/user.dto';
import { generalUserResponse } from '@type/user/user.resp';
import { QueryFailedError } from 'typeorm';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    type: generalUserResponse,
  })
  @ApiBadRequestResponse()
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
