import { IntersectionType, PartialType } from '@nestjs/swagger';
import { Auth } from '@app/auth/auth.entity';
import { User } from '@app/user/user.entity';
import { IdOmitType } from '@util/id_omit_type';

export class createUserDto extends IntersectionType(
  IdOmitType(User, ['auth'] as const),
  IdOmitType(Auth, ['user', 'salt'] as const), // not partial, password needed on any case
) {}

export class updateUserDto extends IntersectionType(
  PartialType(createUserDto),
  IdOmitType(Auth, ['user', 'salt'] as const), // not partial, password needed on any case
) {}
