import { ApiProperty } from '@nestjs/swagger';
import { User } from '@app/user/user.entity';

export class jwtPayloadDto {
  sub: number;
  email: string;
}

export class createAuthDto {
  @ApiProperty()
  password: string;

  @ApiProperty()
  user: User;
}

export class pwModifyDto {
  email: string;
  current_password: string;
  new_password: string;
}
