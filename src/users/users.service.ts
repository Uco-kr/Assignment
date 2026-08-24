import { Injectable } from '@nestjs/common';
import { Repository } from './repository';
import { User } from '@prisma/client';
import { CategoryService } from '../category/category.service';

@Injectable()
export class UsersService {
  constructor(
    private repo: Repository,
    private category: CategoryService,
  ) {}

  async findUserByUuid(uuid: string): Promise<User> {
    const user = await this.repo.findUserByUuid(uuid);
    return user;
  }

  async subscribe(uuid: string, category_id: string): Promise<User> {
    return await this.repo.subscribe(uuid, category_id);
  }

  async getMe(id: string): Promise<User> {
    return await this.repo.getMe(id);
  }
}
