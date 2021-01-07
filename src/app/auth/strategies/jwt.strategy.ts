import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { jwtConstants } from '@constant/jwt.constant';
import { jwtDataDto } from '@type/auth/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(jwtData: jwtDataDto) {
    return await this.userService.findOneByEmail(jwtData.payload.email);
  }
}
