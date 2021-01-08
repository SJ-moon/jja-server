import { Injectable } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { UserWithoutAuth } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import { SocialProvider } from '@app/auth/oauth/oauth.enum';
import { loginResponse } from '@type/auth/auth.resp';
import { IOAuthBaseService } from '@type/auth/oauth/oauth.interface';
import { oAuthUserInfoDto } from '@type/auth/oauth/oauth.base';

@Injectable()
export class OAuthBaseService implements IOAuthBaseService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async baseLogin(
    payload: oAuthUserInfoDto,
    provider: SocialProvider,
  ): Promise<loginResponse> {
    let user = (await this.userService.findOneByEmail(
      payload.email,
    )) as UserWithoutAuth;
    if (!user) {
      user = await this.userService.create({
        email: payload.email,
        name: payload.name,
        password: 'password',
        provider: provider,
      });
    }
    return await this.authService.login(user);
  }
}
