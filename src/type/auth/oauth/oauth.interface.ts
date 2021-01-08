import {
  SocialProvider,
  SocialProviderValues,
} from '@app/auth/oauth/oauth.enum';
import { oAuthLoginDto } from '@type/auth/auth.dto';
import { oAuthUserInfoDto } from './oauth.base';

export interface IOAuthBaseService {
  baseLogin(payload: oAuthUserInfoDto, provider: SocialProviderValues);
}

export interface IOAuthProviderService extends IOAuthBaseService {
  provider: SocialProvider;
  login(payload: oAuthLoginDto);
}

export interface IOAuthAdapter {
  authUrl: string;
  apiUrl: string;

  login(payload: oAuthLoginDto);
  me(token: string);
}
