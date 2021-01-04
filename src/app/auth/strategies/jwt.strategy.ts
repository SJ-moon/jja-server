import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { jwtConstants } from '@constant/jwt.constant';
import { jwtPayloadDto } from '@type/auth/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: jwtPayloadDto) {
    const { sub: user_id, email: email } = payload;
    return {
      user_id,
      email,
    };
  }
}
