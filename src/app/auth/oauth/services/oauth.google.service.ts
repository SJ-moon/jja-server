import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OAuthBaseService } from '@app/auth/oauth/services/oauth.base.service';
import { OAuthGoogleAdapter } from '@app/auth/oauth/adapters/oauth.google.adapter';
import { AuthService } from '@app/auth/auth.service';
import { IOAuthProviderService } from '@type/auth/oauth/oauth.interface';
import { oAuthLoginDto } from '@type/auth/auth.dto';
import { UserService } from '@app/user/user.service';
import { SocialProvider } from '@app/auth/oauth/oauth.enum';
import { loginResponse } from '@type/auth/auth.resp';

@Injectable()
export class OAuthGoogleService
  extends OAuthBaseService
  implements IOAuthProviderService {
  provider = SocialProvider.GOOGLE;

  constructor(
    userService: UserService,
    authService: AuthService,
    private readonly oAuthGoogleAdapter: OAuthGoogleAdapter,
  ) {
    super(userService, authService);
  }

  async login(payload: oAuthLoginDto): Promise<loginResponse> {
    const data = await this.oAuthGoogleAdapter.login(payload);
    return await super.baseLogin(data, this.provider);
  }
}
