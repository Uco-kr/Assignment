import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { GetUserDto } from './dto/res/get-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'get own user information',
  })
  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getMe(
    @Req() req: Request & { user: { uuid: string } },
  ): Promise<GetUserDto> {
    return await this.userService.getMe(req.user.uuid);
  }
}
