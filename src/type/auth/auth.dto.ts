import { IdOmitType } from 'src/util/id_omit_type';
import { Auth } from '@app/auth/auth.entity';
import { SocialProviderValues } from '@app/auth/oauth/oauth.enum';

export class jwtDataDto {
  header: any;
  payload: jwtPayloadDto;
  signature: any;
}
export class jwtPayloadDto {
  email: string;
  sub: number;
}

export class oAuthLoginDto {
  code: string;
  redirectUri: string;
}

export class createOrUpdateAuthDto extends IdOmitType(Auth, ['salt']) {
  provider?: SocialProviderValues | 'local';
}
