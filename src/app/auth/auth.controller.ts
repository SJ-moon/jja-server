import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '@app/auth/auth.service';
import { loginResponse } from '@type/auth/auth.resp';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { pwModifyDto } from '@type/auth/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Post('login')
  async login(@Request() req): Promise<loginResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Patch('pwmodify')
  async pwModify(@Body() pwModifyDto: pwModifyDto): Promise<boolean> {
    return this.authService.pwModify(pwModifyDto);
  }
}
