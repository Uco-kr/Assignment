import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InfoteamAccountService } from '../infoteam-account/infoteam-account.service';
import { AuthRepository } from './auth.repository';
import { TokenDto } from './dto/res/tokenDto';
import { UserRepository } from '../user/user.repository';
import { RefreshTokenPayload } from './dto/req/refreshTokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly infoteamAccountService: InfoteamAccountService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async login(idpToken: string): Promise<TokenDto> {
    const userInfo = await this.infoteamAccountService.getUserInfo(idpToken);
    const user = await this.userRepository.findUserOrCreate(userInfo);
    const tokens = this.issueTokens(user.uuid);
    await this.authRepository.saveRefreshToken(
      tokens.refreshToken,
      userInfo.uuid,
    );
    return tokens;
  }

  issueTokens(userUuid: string): TokenDto {
    const issuer = this.configService.getOrThrow<string>('TokenIssuer');
    const accessToken = this.jwtService.sign(
      {
        sub: userUuid,
        type: 'access',
        iss: issuer,
      },
      {
        expiresIn:
          this.configService.get<JwtSignOptions['expiresIn']>(
            'accessTokenExpiresIn',
          ) ?? '15m',
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        sub: userUuid,
        type: 'refresh',
        iss: issuer,
      },
      {
        expiresIn:
          this.configService.get<JwtSignOptions['expiresIn']>(
            'refreshTokenExpiresIn',
          ) ?? '7d',
      },
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refresh(refreshToken: string | undefined): Promise<TokenDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          issuer: this.configService.getOrThrow<string>('TokenIssuer'),
        },
      );

      if (payload.type !== 'refresh' || !payload.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const storedToken =
        await this.authRepository.findRefreshToken(refreshToken);
      if (
        !storedToken ||
        storedToken.userId !== payload.sub ||
        storedToken.expiresAt <= new Date()
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = this.issueTokens(payload.sub);
      await this.authRepository.deleteRefreshToken(refreshToken);
      await this.authRepository.saveRefreshToken(
        tokens.refreshToken,
        payload.sub,
      );
      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    await this.authRepository.deleteRefreshToken(refreshToken);
  }
}
