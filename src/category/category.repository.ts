import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { User } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async CreateCategory(name: string): Promise<Category> {
    return await this.prisma.category.create({ data: { name } });
  }

  async DeleteCategory(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { uuid: id } });
  }

  async FindSubscribeUser(id: string): Promise<User[] | null> {
    const category = await this.prisma.category.findUnique({
      where: { uuid: id },
      include: { users: { include: { user: true } } },
    });
    return category?.users?.map((subscription) => subscription.user) ?? null;
  }
}
