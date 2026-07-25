import { Injectable } from '@nestjs/common';
import { Repository } from './repository';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private repo: Repository) {}

  async findUserByUuid(uuid: string): Promise<User> {
    const user = await this.repo.findUserByUuid(uuid);
    return user;
  }

  async subscribe(uuid: string, category_id: string): Promise<User> {
    return await this.repo.subscribe(uuid, category_id);
  }
}
