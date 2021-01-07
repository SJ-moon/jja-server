import { IdOmitType } from 'src/util/id_omit_type';
import { Auth } from '@app/auth/auth.entity';

export class jwtDataDto {
  header: any;
  payload: jwtPayloadDto;
  signature: any;
}
export class jwtPayloadDto {
  email: string;
  sub: number;
}

export class createOrUpdateAuthDto extends IdOmitType(Auth, ['salt']) {}
