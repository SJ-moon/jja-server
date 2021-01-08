import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import { createUserDto } from '@type/user/user.dto';
import { generalUserResponse } from '@type/user/user.resp';
import { QueryFailedError } from 'typeorm';
import { User } from '@app/user/user.entity';
import { exception } from 'console';

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

  @Get('list')
  async findAll(): Promise<User[]> {
    try {
      const userList = await this.userService.findAll();
      return Object.assign({
        data: userList,
        statusCode: 200,
        statusMsg: 'Success list',
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Get(':userEmail')
  async findOne(@Param('userEmail') email: string): Promise<User> {
    try {
      const findUser = await this.userService.findOne(email);
      if (findUser !== undefined) {
        return Object.assign({
          data: findUser,
          statusCode: 200,
          statusMsg: 'Success userId',
        });
      } else {
        throw new BadRequestException();
      }
    } catch (e) {
      throw new BadRequestException();
    }
  }

  @Delete(':userEmail')
  async deleteUser(@Param('userEmail') email: string): Promise<string> {
    try {
      const deleteUser = await this.userService.deleteUser(email);
      if (deleteUser !== undefined) {
        return Object.assign({
          data: { email: email },
          statusCode: 201,
          statusMsg: 'delete success',
        });
      } else {
        throw new BadRequestException();
      }
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
