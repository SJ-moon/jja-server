import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
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
import { SocialProvider } from '@app/auth/oauth/oauth.enum';
import { OAuthGoogleService } from '@app/auth/oauth/services/oauth.google.service';
import { loginResponse } from '@type/auth/auth.resp';
import { oAuthLoginDto } from '@type/auth/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oAuthGoogleService: OAuthGoogleService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Post('login')
  async login(@Request() req): Promise<loginResponse> {
    return this.authService.login(req.user);
  }

  @Post('login/social/:provider')
  async oauthLogin(
    @Param('provider') provider: string,
    @Body() body: oAuthLoginDto,
  ) {
    switch (provider) {
      case SocialProvider.GOOGLE:
        this.oAuthGoogleService.login(body);
        break;
      case SocialProvider.NAVER:
        break;
      case SocialProvider.KAKAO:
        break;
    }
  }
}
