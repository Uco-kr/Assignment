import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InfoteamAccountService } from '../infoteam-account/infoteam-account.service';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private infoteamAccountService: InfoteamAccountService,
    private authRepository: AuthRepository,
  ) {}

  async login(
    idpToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userInfo = await this.infoteamAccountService.getUserInfo(idpToken);
    const user = await this.authRepository.findUserOrCreate(userInfo);
    const tokens = await this.issueTokens(user.uuid);
    await this.authRepository.saveRefreshToken(
      tokens.refreshToken,
      userInfo.uuid,
    );
    return tokens;
  }

  async issueTokens(
    uuid: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync({
      sub: uuid,
      type: 'access',
    });
    const refreshToken = await this.jwtService.signAsync(
      { sub: uuid, type: 'refresh' },
      { expiresIn: '7d' },
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authRepository.delete(refreshToken);
  }
}
