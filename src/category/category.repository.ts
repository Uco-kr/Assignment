import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { getPostCount } from './dto/getPostCountDto';
import { getUserCount } from './dto/getUserCountDto';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async CreateCategory(name: string): Promise<Category> {
    return await this.prisma.category.create({ data: { name } });
  }

  async DeleteCategory(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { uuid: id } });
  }

  async FindSubscribeUser(id: string): Promise<string[]> {
    const category = await this.prisma.category.findUnique({
      where: { uuid: id },
      select: { users: { select: { user: { select: { uuid: true } } } } },
    });
    if (!category) {
      return [];
    }
    return category?.users?.map((subscription) => subscription.user.uuid);
  }

  async getCategoryId(): Promise<string[]> {
    const category = await this.prisma.category.findMany();
    return category.map((category) => category.uuid);
  }

  async getNameById(id: string): Promise<string> {
    const category = await this.prisma.category.findUnique({
      where: { uuid: id },
    });
    if (!category) {
      throw new NotFoundException(`카테고리가 아무것도 없습니다.`);
    }
    return category.name;
  }

  async getPostCount(): Promise<getPostCount[]> {
    const categoryIds = await this.getCategoryId();

    // 각 카테고리별 정보를 병렬로 처리
    const result = await Promise.all(
      categoryIds.map(async (id) => {
        const name = await this.getNameById(id);
        const count = await this.prisma.postCategory.count({
          where: { categoryId: id },
        });

        return {
          uuid: id,
          name,
          count,
        };
      }),
    );

    return result;
  }

  async getUserCount(): Promise<getUserCount[]> {
    const categoryIds = await this.getCategoryId();

    const result = await Promise.all(
      categoryIds.map(async (id) => {
        const name = await this.getNameById(id);
        const count = await this.prisma.userCategory.count({
          where: { categoryId: id },
        });

        return { uuid: id, name, count };
      }),
    );
    return result;
  }

  async getSubscribedCategoryId(id: string): Promise<string[]> {
    const categoryId = await this.prisma.userCategory.findMany({
      where: { userId: id },
      select: { categoryId: true },
    });

    return categoryId.map(({ categoryId }) => categoryId);
  }
}
