import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class Repository {
  constructor(private prisma: PrismaService) {}

  async findUserByUuid(uuid: string): Promise<User> {
    const findUSer = await this.prisma.user.findUniqueOrThrow({
      where: { uuid: uuid },
    });
    if (!findUSer) {
      throw new NotFoundException();
    }
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
}
