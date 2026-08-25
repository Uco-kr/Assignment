import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private repo: UserRepository) {}

  async findUserByUuid(uuid: string): Promise<User> {
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new NotFoundException(`해당 id를 가진 사용자가 없습니다.`);
    }
    return user;
  }

  async subscribe(uuid: string, category_id: string): Promise<User> {
    const subscribe = await this.repo.findSubscribe(uuid, category_id);
    if (!subscribe) {
      throw new ConflictException(`이미 구독된 상태입니다.`);
    }
    return await this.repo.subscribe(uuid, category_id);
  }

  async getMe(id: string): Promise<User> {
    return await this.repo.getMe(id);
  }
}
