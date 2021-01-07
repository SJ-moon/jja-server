import {
  Controller,
  HttpCode,
  HttpStatus,
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
import { LocalAuthGuard } from '@app/auth/guards/local-auth.guard';
import { loginResponse } from '@type/auth/auth.resp';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Post('login')
  async login(@Request() req): Promise<loginResponse> {
    return this.authService.login(req.user);
  }
}
