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
import { JwtTokenDto } from './dto/res/jwt-token.dto';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly refreshTokenExpiresIn: number;
  private readonly cookieKey: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.refreshTokenExpiresIn = Number(
      this.configService.getOrThrow<number>('REFRESH_EXPIRES_IN'),
    );
    this.cookieKey = 'refresh_token';
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
    res.cookie(this.cookieKey, refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + this.refreshTokenExpiresIn),
      path: 'api/auth',
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
  @ApiBearerAuth('access-token')
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies[this.cookieKey] as string | undefined;
    res.clearCookie(this.cookieKey, { path: '/api/auth' });
    await this.authService.logout(refreshToken);
  }

  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Refresh the access token using the refresh_token cookie. No Authorization header is required.',
  })
  @ApiOkResponse({ type: JwtTokenDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtTokenDto> {
    const refreshToken = req.cookies[this.cookieKey] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    const tokens = await this.authService.refresh(refreshToken);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + this.refreshTokenExpiresIn),
      path: 'api/auth',
    });
    return { accessToken: tokens.accessToken };
  }
}
