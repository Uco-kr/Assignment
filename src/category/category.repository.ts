import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

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

  async getCategory(): Promise<string[]> {
    const category = await this.prisma.category.findMany();
    return category.map((category) => category.name);
  }
}
