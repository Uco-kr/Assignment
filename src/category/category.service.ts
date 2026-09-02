import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from '@prisma/client';
import { getPostCount } from './dto/getPostCountDto';
import { getUserCount } from './dto/getUserCountDto';
import { getSubscribedCategoryDto } from './dto/GetSubscribedCategoryDto';

@Injectable()
export class CategoryService {
  constructor(private repo: CategoryRepository) {}

  async CreateCategory(name: string): Promise<Category> {
    return await this.repo.CreateCategory(name);
  }

  async DeleteCategory(id: string): Promise<void> {
    await this.repo.DeleteCategory(id);
  }

  async FindSubscribeUser(id: string): Promise<string[]> {
    const users = await this.repo.FindSubscribeUser(id);
    if (!users) {
      throw new NotFoundException(`해당 카테고리를 구독하는 사용자가 없습니다`);
    }
    return users;
  }

  async getCategoryId(): Promise<string[]> {
    return await this.repo.getCategoryId();
  }

  async getCategoryNameById(id: string): Promise<string> {
    return await this.repo.getCategoryNameById(id);
  }

  async getPostCount(): Promise<getPostCount[]> {
    return await this.repo.getPostCount();
  }

  async getUserCount(): Promise<getUserCount[]> {
    return await this.repo.getUserCount();
  }

  async getCategorySubscribing(
    id: string,
  ): Promise<getSubscribedCategoryDto[]> {
    const categoryIds = await this.repo.getSubscribedCategoryId(id);
    const postCounts = await this.getPostCount();

    const result = await Promise.all(
      categoryIds.map(async (categoryId) => {
        const categoryName = await this.getCategoryNameById(categoryId);

        const foundItem = postCounts.find(
          (item) => item.categoryUuid === categoryId,
        );

        const count = foundItem?.postCount ?? 0;

        return {
          categoryName: categoryId,
          categoryUuid: categoryName,
          postCount: count,
        };
      }),
    );

    return result;
  }
}
