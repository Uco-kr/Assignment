import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { GetUserDto } from './dto/res/get-user.dto';
import { UserInfoDto } from './dto/req/user-info.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findUserByUuid(userUuid: string): Promise<GetUserDto> {
    return await this.userRepository.findUserByUuid(userUuid);
  }

  async getMe(userUuid: string): Promise<GetUserDto> {
    return await this.userRepository.getMe(userUuid);
  }

  async findUserOrCreate(userInfo: UserInfoDto): Promise<GetUserDto> {
    return await this.userRepository.findUserOrCreate(userInfo);
  }
}
