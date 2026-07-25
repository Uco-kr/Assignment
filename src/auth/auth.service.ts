import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { infoteamAccountService } from '../infoteam-account/infoteam-account.service';
import { authRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private infoteamAccountService: infoteamAccountService,
    private authRepository: authRepository,
  ) {}

  async login(
    auth: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    console.log('authService.login 시작');
    const idpToken = auth.split(' ')[1];
    console.log('idpToken 성공 ', idpToken);
    const userInfo = await this.infoteamAccountService.getUserInfo(idpToken);
    console.log('1. userInfo 성공:', userInfo);
    const user = await this.authRepository.findUserOrCreate(userInfo);
    console.log('2. user 저장 성공:', user);
    const tokens = await this.issueTokens(user.uuid);
    console.log('3. token 발급 성공');
    await this.authRepository.saveRefreshToken(
      tokens.refresh_token,
      userInfo.uuid,
    );
    console.log('4. refresh token 저장 성공');
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
