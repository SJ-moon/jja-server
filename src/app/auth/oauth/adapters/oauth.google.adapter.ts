import { HttpService, Injectable } from '@nestjs/common';
import { SocialProviderUrl } from '@app/auth/oauth/oauth.enum';
import { oAuthLoginDto } from '@type/auth/auth.dto';
import { IOAuthAdapter } from '@type/auth/oauth/oauth.interface';
import { UrlQueryBuilder } from '@util/url_query_builder';
import {
  googleOAuthResponse,
  googleMeResponse,
  googleUserInfoDto,
} from '@type/auth/oauth/oauth.google';

@Injectable()
export class OAuthGoogleAdapter implements IOAuthAdapter {
  authUrl: string = SocialProviderUrl.GOOGLE_AUTH;
  apiUrl: string = SocialProviderUrl.GOOGLE_API;

  constructor(private httpService: HttpService) {}

  async login(payload: oAuthLoginDto): Promise<googleUserInfoDto> {
    const { data }: { data: googleOAuthResponse } = await this.httpService
      .post(
        UrlQueryBuilder(this.authUrl + '/token')
          .setMultipleQuery({
            code: payload.code,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: payload.redirectUri,
            grantType: 'authorization_code',
          })
          .build(),
      )
      .toPromise();

    return await this.me(data.id_token);
  }

  async me(token: string): Promise<googleUserInfoDto> {
    const { data }: { data: googleMeResponse } = await this.httpService
      .get(
        UrlQueryBuilder(this.authUrl + '/tokeninfo')
          .setMultipleQuery({
            id_token: token,
          })
          .build(),
      )
      .toPromise();

    return data;
  }
}
