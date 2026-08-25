import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { infoteamAccountService } from '../infoteam-account/infoteam-account.service';
import { authRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private infoteamAccountService: infoteamAccountService,
    private authRepository: authRepository,
  ) {}

  async login(
    auth: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const idpToken = auth.split(' ')[1];
    const userInfo = await this.infoteamAccountService.getUserInfo(idpToken);
    const user = await this.authRepository.findUserOrCreate(userInfo);
    const tokens = await this.issueTokens(user.uuid);
    await this.authRepository.saveRefreshToken(
      tokens.refresh_token,
      userInfo.uuid,
    );
    return tokens;
  }

  async issueTokens(
    uuid: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessToken = await this.jwtService.signAsync({
      sub: uuid,
      type: 'access',
    });
    const refreshToken = await this.jwtService.signAsync(
      { sub: uuid, type: 'refresh' },
      { expiresIn: '7d' },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.authRepository.del(refreshToken);
  }
}
