import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';

type GoogleUser = {
  email: string;
  firstName: string;
  lastName: string;
};

type GoogleRequest = ExpressRequest & {
  user: GoogleUser;
};

type JwtRequest = ExpressRequest & {
  user: Omit<User, 'password'>;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: Request & { user: Omit<User, 'password'> }) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Request() req: Request & { user: { userId: number; username: string } },
  ) {
    return req.user;
  }

  // 🔹 Google 로그인 시작
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // passport가 redirect 처리
  }

  // 🔹 Google callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req: GoogleRequest) {
    return this.authService.googleLogin(req.user);
  }

  // 🔹 로그아웃
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req: JwtRequest) {
    return {
      message: '로그아웃 되었습니다.',
      user: req.user,
    };
  }
}
