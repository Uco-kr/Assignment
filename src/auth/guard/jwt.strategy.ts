import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { AccessTokenPayload } from '../dto/req/access-token.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.getOrThrow<string>('JWT_SECRET');
    const iss = configService.getOrThrow<string>('TOKEN_ISSUER');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      issuer: iss,
    });
  }

  async validate(payload: AccessTokenPayload) {
    if (!payload.sub || payload.type !== 'access') {
      throw new UnauthorizedException('invalid token');
    }

    try {
      return await this.userService.findUserByUuid(payload.sub);
    } catch {
      throw new UnauthorizedException('invalid token');
    }
  }
}
