import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from '@prisma/client';
import { User } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private repo: CategoryRepository) {}

  async CreateCategory(name: string): Promise<Category> {
    return await this.repo.CreateCategory(name);
  }

  async DeleteCategory(id: string): Promise<void> {
    await this.repo.DeleteCategory(id);
  }

  async FindSubscribeUser(id: string): Promise<User[]> {
    const users = await this.repo.FindSubscribeUser(id);
    if (!users) {
      throw new NotFoundException(`해당 카테고리를 구독하는 사용자가 없습니다`);
    }
    return users;
  }
}
