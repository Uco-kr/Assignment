import {
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtTokenDto } from './dto/JwtTokenDto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login',
    description: 'Issue JWT token',
  })
  @ApiOkResponse({ type: JwtTokenDto, description: 'Return Jwt Token' })
  @ApiUnauthorizedResponse({ description: 'Unathorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOAuth2(['email', 'openid', 'name'])
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtTokenDto> {
    //아래코드에서 as string | undefined 없으면 오류 발생, 왜? -> 내 생각에는 undefined 안 받으려는 것 같음
    const auth = req.header['authorization'] as string | undefined;
    if (!auth) {
      throw new UnauthorizedException();
    }
    const { access_token, refresh_token } = await this.authService.login(auth);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 15000000),
      path: '/auth',
    });
    return { access_token };
  }

  @ApiOperation({
    summary: 'logout',
    description: 'Logout the user from idp',
  })
  @ApiCreatedResponse({ description: 'Return jwt token' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBearerAuth('jwt')
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies['refresh_token'] as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    res.clearCookie('refresh_token');
    return await this.authService.logout(refreshToken);
  }
}
