import { User } from '@app/user/user.entity';

export class jwtPayloadDto {
  sub: number;
  email: string;
}

export class createAuthDto {
  password: string;
  user: User;
}
