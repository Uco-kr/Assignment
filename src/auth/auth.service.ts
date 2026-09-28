import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InfoteamAccountService } from '../infoteam-account/infoteam-account.service';
import { AuthRepository } from './auth.repository';
import { TokenDto } from './dto/res/token.dto';
import { UserRepository } from '../user/user.repository';
import { RefreshTokenPayload } from './dto/req/refresh-token.payload';

@Injectable()
export class AuthService {
  private readonly refreshExpiresIn: number;
  private readonly accessTokenExpiresIn: number;
  private readonly Token_Issuer: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly infoteamAccountService: InfoteamAccountService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    this.refreshExpiresIn = Number(
      this.configService.getOrThrow<number>('REFRESH_EXPIRES_IN'),
    );
    this.accessTokenExpiresIn = Number(
      this.configService.getOrThrow<number>('ACCESS_EXPIRES_IN'),
    );
    this.Token_Issuer = this.configService.getOrThrow<string>('TOKEN_ISSUER');
  }

  async login(idpToken: string): Promise<TokenDto> {
    const userInfo = await this.infoteamAccountService.getUserInfo(idpToken);
    const user = await this.userRepository.findUserOrCreate(userInfo);
    const tokens = this.issueTokens(user.uuid);
    await this.authRepository.saveRefreshToken(
      tokens.refreshToken,
      user.uuid,
      this.refreshExpiresIn,
    );
    return tokens;
  }

  issueTokens(userUuid: string): TokenDto {
    const issuer = this.Token_Issuer;
    const accessToken = this.jwtService.sign(
      {
        sub: userUuid,
        type: 'access',
        iss: issuer,
      },
      {
        expiresIn: this.accessTokenExpiresIn,
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        sub: userUuid,
        type: 'refresh',
        iss: issuer,
      },
      {
        expiresIn: this.refreshExpiresIn,
      },
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<TokenDto> {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          issuer: this.Token_Issuer,
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

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
      this.refreshExpiresIn,
    );

    return tokens;
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    await this.authRepository.deleteRefreshToken(refreshToken);
  }
}
