import {
  Controller,
  Body,
  Post,
  Patch,
  UseGuards,
  BadRequestException,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { UserService } from '@app/user/user.service';
import { createUserDto, updateUserDto } from '@type/user/user.dto';
import { generalUserResponse } from '@type/user/user.resp';

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

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: generalUserResponse,
  })
  @ApiBadRequestResponse()
  async update(
    @Request() req,
    @Body() updateUserDto: updateUserDto,
  ): Promise<generalUserResponse> {
    return await this.userService.update(req.user, updateUserDto);
  }
}
