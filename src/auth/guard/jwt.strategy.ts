import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService, // 👈 ConfigService 주입
  ) {
    // configService.get()을 써서 가져와야 .env 로드 시점 문제를 방지할 수 있습니다.
    const secret = configService.get<string>('JWT_SECRET'); // .env의 키 이름과 대소문자까지 일치해야 함!

    if (!secret) {
      throw new Error('JWT_SECRET 환경변수가 정의되지 않았습니다.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate({ sub }: JwtPayload) {
    if (!sub) throw new UnauthorizedException('invalid token');
    return await this.userService.findUserByUuid(sub).catch(() => {
      throw new UnauthorizedException();
    });
  }
}
