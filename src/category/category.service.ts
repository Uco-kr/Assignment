import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category, User } from '@prisma/client';
import { GetPostCountDto } from './dto/req/getPostCountDto';
import { GetUserCountDto } from './dto/req/getUserCountDto';
import { GetSubscribedCategoryDto } from './dto/req/getSubscribedCategoryDto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(categoryName: string): Promise<Category> {
    return await this.categoryRepository.createCategory(categoryName);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.categoryRepository.deleteCategory(categoryId);
  }

  async findSubscriberIdsByCategoryIds(
    categoryIds: string[],
  ): Promise<string[]> {
    return await this.categoryRepository.findSubscriberIdsByCategoryIds(
      categoryIds,
    );
  }

  async findExistingCategoryIds(categoryIds: string[]): Promise<string[]> {
    return await this.categoryRepository.findExistingCategoryIds(categoryIds);
  }

  async getCategoryIds(): Promise<string[]> {
    return await this.categoryRepository.getCategoryIds();
  }

  async getPostCounts(): Promise<GetPostCountDto[]> {
    return await this.categoryRepository.getPostCounts();
  }

  async getUserCounts(): Promise<GetUserCountDto[]> {
    return await this.categoryRepository.getUserCounts();
  }

  async getSubscribedCategories(
    id: string,
  ): Promise<GetSubscribedCategoryDto[]> {
    return await this.categoryRepository.getSubscribedCategories(id);
  }

  async subscribe(userUuid: string, categoryUuid: string): Promise<User> {
    return await this.categoryRepository.subscribe(userUuid, categoryUuid);
  }
}
