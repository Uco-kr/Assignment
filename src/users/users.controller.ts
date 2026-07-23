import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtTokenDto } from '../auth/dto/JwtTokenDto';
import { RegisterUserDto } from './dto/RegisterUserDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  async registerUser(@Body() body: RegisterUserDto): Promise<JwtTokenDto> {
    return await this.userService.registerUser(body.name);
  }
}
