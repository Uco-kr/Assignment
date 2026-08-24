import { Controller, Param, Post, UseGuards, Req, Get } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import {
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({
    summary: 'subscribe category',
    description: 'subscribe category',
  })
  @ApiCreatedResponse({ description: 'Return user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('subscribe/:categoryId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async subscribe(
    @Req() req: Request & { user: { uuid: string } },
    @Param('categoryId') categoryId: string,
  ): Promise<User> {
    return await this.userService.subscribe(req.user.uuid, categoryId);
  }

  @ApiOperation({
    summary: 'get own user information',
  })
  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request & { user: { uuid: string } }) {
    return await this.userService.getMe(req.user.uuid);
  }
}
