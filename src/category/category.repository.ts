import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, User } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async createCategory(name: string): Promise<Category> {
    return await this.prisma.category.create({ data: { name } });
  }

  async deleteCategoryById(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { uuid: id } });
  }

  async findSubscriberIdsByCategoryIds(
    categoryIds: string[],
  ): Promise<string[]> {
    if (categoryIds.length === 0) {
      return [];
    }
    const subscription = await this.prisma.userCategory.findMany({
      where: { categoryId: { in: categoryIds } },
      distinct: ['userId'],
      select: { userId: true },
    });
    return subscription.map(({ userId }) => userId);
  }

  async getCategoryIds(): Promise<string[]> {
    const category = await this.prisma.category.findMany({
      select: { uuid: true },
    });
    return category.map((category) => category.uuid);
  }

  async findExistingCategoryIds(categoryIds: string[]): Promise<string[]> {
    if (categoryIds.length === 0) {
      return [];
    }
    const categories = await this.prisma.category.findMany({
      where: { uuid: { in: categoryIds } },
      select: { uuid: true },
    });
    return categories.map(({ uuid }) => uuid);
  }

  async getPostCounts(): Promise<
    { categoryUuid: string; categoryName: string; postCount: number }[]
  > {
    const categories = await this.prisma.category.findMany({
      select: {
        uuid: true,
        name: true,
        _count: { select: { posts: true } },
      },
    });
    return categories.map(({ uuid, name, _count }) => ({
      categoryUuid: uuid,
      categoryName: name,
      postCount: _count.posts,
    }));
  }

  async getUserCounts(): Promise<
    { uuid: string; name: string; count: number }[]
  > {
    const categories = await this.prisma.category.findMany({
      select: {
        uuid: true,
        name: true,
        _count: { select: { users: true } },
      },
    });
    return categories.map(({ uuid, name, _count }) => ({
      uuid,
      name,
      count: _count.users,
    }));
  }

  async getSubscribedCategories(
    userUuid: string,
  ): Promise<
    { categoryUuid: string; categoryName: string; postCount: number }[]
  > {
    const categories = await this.prisma.category.findMany({
      where: { users: { some: { userId: userUuid } } },
      select: {
        uuid: true,
        name: true,
        _count: { select: { posts: true } },
      },
    });
    return categories.map(({ uuid, name, _count }) => ({
      categoryUuid: uuid,
      categoryName: name,
      postCount: _count.posts,
    }));
  }

  async subscribe(userUuid: string, categoryUuid: string): Promise<User> {
    const subscription = await this.prisma.userCategory.upsert({
      where: {
        userId_categoryId: { userId: userUuid, categoryId: categoryUuid },
      },
      create: { userId: userUuid, categoryId: categoryUuid },
      update: {},
      include: { user: true },
    });

    return subscription.user;
  }
}
