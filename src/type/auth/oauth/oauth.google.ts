import { oAuthUserInfoDto } from '@type/auth/oauth/oauth.base';

export class googleOAuthResponse {
  access_token: string;
  expire_in: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export class googleMeResponse {
  // jwt configuration
  iss: string;
  sub: string;
  azp: string;
  aud: string;
  iat: string;
  exp: string;
  alg: string;
  kid: string;
  typ: string; // 'JWT'

  // user info
  hd: string; // 'gmail.com',
  email: string; // 'email@gmail.com',
  email_verified: string; // 'true',
  at_hash: string;
  name: string;
  picture: string; // url,
  given_name: string;
  family_name: string;
  locale: string;
}

export class googleUserInfoDto extends oAuthUserInfoDto {
  email: string;
  name: string;
}
