import {
  Controller,
  Headers,
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
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly refreshTokenExpiresIn: number;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const expiresInMs = Number(
      configService.get<string | number>('refreshTokenExpiresIn'),
    );
    this.refreshTokenExpiresIn =
      Number.isFinite(expiresInMs) &&
      expiresInMs > 0 &&
      Number.isFinite(new Date(Date.now() + expiresInMs).getTime())
        ? expiresInMs
        : 7 * 24 * 60 * 60 * 1000;
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Issue JWT token',
  })
  @ApiOkResponse({ type: JwtTokenDto, description: 'Return Jwt Token' })
  @ApiUnauthorizedResponse({ description: 'UnAuthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOAuth2(['email', 'name'], 'oauth2')
  @Post('login')
  async login(
    @Headers('authorization') authHeader: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtTokenDto> {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const match = /^Bearer +([^\s]+)$/i.exec(authHeader);
    if (!match) {
      throw new UnauthorizedException('Invalid Bearer token format');
    }
    const { accessToken, refreshToken } = await this.authService.login(
      match[1],
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + this.refreshTokenExpiresIn),
      path: '/auth',
    });
    return { accessToken };
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

    res.clearCookie('refresh_token', { path: '/auth' });
    return await this.authService.logout(refreshToken);
  }
}
