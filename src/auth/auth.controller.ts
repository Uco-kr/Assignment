import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req: Request & { user: Omit<User, 'password'> }) {
    return {
      message: '로그아웃 되었습니다.',
      user: req.user,
    };
  }
}
