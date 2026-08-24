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

  async getMe(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { uuid: id } });
    if (!user) {
      throw new NotFoundException(`id가 조회되지 않습니다.`);
    }
    return user;
  }
}
