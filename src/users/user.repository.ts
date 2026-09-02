import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { SubscribeDto } from './dto/subscribeDto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByUuid(uuid: string): Promise<User | null> {
    const findUSer = await this.prisma.user.findUnique({
      where: { uuid: uuid },
    });
    return findUSer;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({ where: { uuid: id }, data: data });
  }

  async subscribe(uuid: string, category_id: string): Promise<User> {
    const subscriber = await this.prisma.userCategory.create({
      data: { userId: uuid, categoryId: category_id },
      include: { user: true },
    });

    return subscriber.user;
  }

  async findSubscribe(
    uuid: string,
    category_id: string,
  ): Promise<SubscribeDto | null> {
    return await this.prisma.userCategory.findUnique({
      where: { userId_categoryId: { userId: uuid, categoryId: category_id } },
    });
  }

  async getMe(id: string): Promise<User> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { uuid: id },
    });
    return user;
  }
}
